import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

// IMPORTANT: Disable body parsing for webhooks
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    console.error('No stripe signature found')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      {
        error: `Webhook Error: ${err.message}`,
      },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config: configPromise })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { orderId, userId, cartId } = session.metadata || {}

        console.log('✅ Checkout completed:', { orderId, userId, cartId })

        if (!orderId) {
          console.error('No orderId in session metadata')
          break
        }

        // Get shipping and customer details
        const shippingDetails = session.customer_details
        const customerDetails = session.customer_details

        // Update order with payment details
        await payload.update({
          collection: 'orders',
          id: orderId,
          data: {
            status: 'completed',
            amount: session.amount_total ? session.amount_total / 100 : 0,
            customerEmail: customerDetails?.email || undefined,
            shippingAddress: shippingDetails?.address
              ? {
                  firstName: customerDetails?.name?.split(' ')[0] || '',
                  lastName: customerDetails?.name?.split(' ').slice(1).join(' ') || '',
                  addressLine1: shippingDetails.address.line1 || '',
                  addressLine2: shippingDetails.address.line2 || '',
                  city: shippingDetails.address.city || '',
                  state: shippingDetails.address.state || '',
                  postalCode: shippingDetails.address.postal_code || '',
                  country: shippingDetails.address.country || '',
                }
              : undefined,
          },
          overrideAccess: true,
        })

        // Create transaction record
        await payload.create({
          collection: 'transactions',
          data: {
            paymentProcessor: 'stripe',
            stripePaymentIntentID: session.payment_intent as string,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency?.toUpperCase() || 'USD',
            status: 'succeeded',
            order: orderId,
          } as any,
          overrideAccess: true,
        })

        // Clear user's cart
        if (cartId) {
          try {
            await payload.update({
              collection: 'carts',
              id: cartId,
              data: {
                items: [],
                subtotal: 0,
              },
              overrideAccess: true,
            })
            console.log('✅ Cart cleared:', cartId)
          } catch (cartError) {
            console.error('Error clearing cart:', cartError)
          }
        }

        console.log(`✅ Order ${orderId} completed successfully`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderId = paymentIntent.metadata?.orderId

        console.error('❌ Payment failed:', orderId)

        if (orderId) {
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: { status: 'cancelled' },
            overrideAccess: true,
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error.message,
      },
      { status: 500 },
    )
  }
}
