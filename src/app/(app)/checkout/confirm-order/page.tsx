// import type { Metadata } from 'next'

// import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
// import React, { Fragment } from 'react'
// import { ConfirmOrder } from '@/components/checkout/ConfirmOrder'

// type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// export default async function ConfirmOrderPage({
//   searchParams: searchParamsPromise,
// }: {
//   searchParams: SearchParams
// }) {
//   const searchParams = await searchParamsPromise

//   const paymentIntent = searchParams.paymentId

//   return (
//     <div className="container min-h-[90vh] flex py-12">
//       <ConfirmOrder />
//     </div>
//   )
// }

// export const metadata: Metadata = {
//   description: 'Confirm order.',
//   openGraph: mergeOpenGraph({
//     title: 'Confirming order',
//     url: '/checkout/confirm-order',
//   }),
//   title: 'Confirming order',
// }

import configPromise from '@payload-config'
import { ArrowRight, CheckCircle, Mail, MapPin, Package } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

interface OrderConfirmationPageProps {
  searchParams: Promise<{
    session_id?: string
    order_id?: string
  }>
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const { session_id, order_id } = await searchParams

  if (!session_id || !order_id) {
    redirect('/cart')
  }

  // Verify Stripe session
  let stripeSession: Stripe.Checkout.Session | null = null
  try {
    stripeSession = await stripe.checkout.sessions.retrieve(session_id)
  } catch (err) {
    console.error('Invalid Stripe session:', err)
    notFound()
  }

  if (stripeSession.payment_status !== 'paid') {
    redirect('/cart')
  }

  // Fetch order from Payload
  const payload = await getPayload({ config: configPromise })

  let order
  try {
    order = await payload.findByID({
      collection: 'orders',
      id: order_id,
      depth: 3,
      overrideAccess: true,
    })
  } catch {
    notFound()
  }

  const customerName = stripeSession.customer_details?.name || 'Customer'
  const customerEmail = stripeSession.customer_details?.email || order?.customerEmail
  const shipping = order?.shippingAddress
  const orderItems = (order?.items as any[]) || []
  const totalAmount = stripeSession.amount_total
    ? (stripeSession.amount_total / 100).toFixed(2)
    : (order?.amount || 0).toFixed(2)

  return (
    <div className="min-h-screen bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Thank You for Your Order!</h1>
          <p className="text-muted-foreground">
            Your order has been confirmed and is being processed.
          </p>
        </div>

        {/* Order Number */}
        <div className="mb-6 rounded-lg border bg-card p-6 text-center">
          <p className="mb-1 text-sm text-muted-foreground">Order Number</p>
          <p className="font-mono text-2xl font-bold">#{order_id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Order Details */}
        <div className="mb-6 rounded-lg border bg-card">
          <div className="border-b bg-muted/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Order Items</h2>
            </div>
          </div>

          <div className="divide-y">
            {orderItems.map((item: any, index: number) => {
              const product = typeof item.product === 'string' ? null : item.product
              const variant = item.variant && typeof item.variant !== 'string' ? item.variant : null
              const image = product?.gallery?.[0]?.image
              const imageUrl = image && typeof image !== 'string' ? image.url : null
              const price = variant?.priceInUSD || product?.priceInUSD || 0

              return (
                <div key={index} className="flex items-center gap-4 p-6">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={product?.title || 'Product'}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{product?.title || 'Product'}</p>
                    {variant && <p className="text-sm text-muted-foreground">{variant.title}</p>}
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(price * item.quantity).toFixed(2)}</p>
                </div>
              )
            })}
          </div>

          <div className="border-t bg-muted/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold">${totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {shipping && (
          <div className="mb-6 rounded-lg border bg-card">
            <div className="border-b bg-muted/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">Shipping Address</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="font-medium">
                {shipping.firstName} {shipping.lastName}
              </p>
              <p className="text-muted-foreground">{shipping.addressLine1}</p>
              {shipping.addressLine2 && (
                <p className="text-muted-foreground">{shipping.addressLine2}</p>
              )}
              <p className="text-muted-foreground">
                {shipping.city}, {shipping.state} {shipping.postalCode}
              </p>
              <p className="text-muted-foreground">{shipping.country}</p>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="mb-8 rounded-lg border bg-card">
          <div className="border-b bg-muted/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">What Happens Next?</h2>
            </div>
          </div>
          <div className="p-6">
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <span className="pt-0.5">
                  You willreceive an order confirmation email at <strong>{customerEmail}</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <span className="pt-0.5">We will prepare and pack your order with care</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <span className="pt-0.5">
                  You will receive tracking information once your order ships
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-6 py-3 font-medium transition hover:bg-accent"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
