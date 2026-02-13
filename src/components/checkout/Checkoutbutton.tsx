'use client'

import { Button } from '@/components/ui/button'
import { Loader2, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface CheckoutButtonProps {
  cartId: string
  disabled?: boolean
  className?: string
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ cartId, disabled, className }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (!cartId) {
      toast.error('No cart found')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If unauthorized, redirect to login
        if (response.status === 401) {
          toast.error('Please log in to checkout')
          router.push('/login?redirect=/cart')
          return
        }
        throw new Error(data.error || 'Checkout failed')
      }

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={disabled || loading} className={className} size="lg">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to payment...
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Checkout
        </>
      )}
    </Button>
  )
}
