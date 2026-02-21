import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { cartId } = await req.json()

    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID is required' }, { status: 400 })
    }

    // Get user from session
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Please log in to checkout' }, { status: 401 })
    }

    // Fetch the cart with populated products
    const cart = await payload.findByID({
      collection: 'carts',
      id: cartId,
      depth: 3,
      user,
    })

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 })
    }

    // Get server URL
    const serverURL = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

    // Build Stripe line items from cart
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of cart.items as any[]) {
      const product = item.product
      if (!product || typeof product === 'string') continue

      // Get price - variant price takes priority
      const variant = item.variant && typeof item.variant !== 'string' ? item.variant : null
      let priceInCents = 0

      if (variant?.priceInUSD) {
        priceInCents = Math.round(variant.priceInUSD * 100)
      } else if (product.priceInUSD) {
        priceInCents = Math.round(product.priceInUSD * 100)
      }

      if (priceInCents === 0) {
        console.warn(`Product ${product.id} has no price, skipping`)
        continue
      }

      // Get product image
      let imageUrl: string | undefined
      if (product.gallery && product.gallery.length > 0) {
        const firstImage = product.gallery[0].image
        if (typeof firstImage !== 'string' && firstImage?.url) {
          imageUrl = firstImage.url.startsWith('http')
            ? firstImage.url
            : `${serverURL}${firstImage.url}`
        }
      }

      const productName = variant
        ? `${product.title} - ${variant.title || 'Variant'}`
        : product.title

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: product.meta?.description || undefined,
            images: imageUrl ? [imageUrl] : [],
            metadata: {
              productId: product.id,
              variantId: variant?.id || '',
            },
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      })
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        {
          error: 'No valid items in cart. Please ensure all products have prices.',
        },
        { status: 400 },
      )
    }

    // Create order in Payload (pending status)
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: user.id,
        customerEmail: user.email,
        status: 'processing',
        items: (cart.items as any[]).map((item: any) => ({
          product: typeof item.product === 'string' ? item.product : item.product?.id,
          variant: item.variant
            ? typeof item.variant === 'string'
              ? item.variant
              : item.variant?.id
            : undefined,
          quantity: item.quantity,
        })),
        amount: cart.subtotal || 0,
        currency: 'USD',
      },
      overrideAccess: true,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${serverURL}/checkout/confirm-order?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${serverURL}/cart`,
      customer_email: user.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'AU', 'GB', 'CA', 'NZ'],
      },
      metadata: {
        orderId: order.id,
        userId: user.id,
        cartId: cartId,
      },
    })

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Checkout failed. Please try again.',
      },
      { status: 500 },
    )
  }
}
