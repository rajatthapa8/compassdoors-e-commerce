import { Button } from '@/components/ui/button'
import { MdOutlineShoppingCart } from 'react-icons/md'
export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button variant="plain" className="navLink relative items-end hover:cursor-pointer" {...rest}>
      <MdOutlineShoppingCart className="text-lg" />
      <span>Cart</span>

      {quantity ? (
        <>
          <span>•</span>
          <span>{quantity}</span>
        </>
      ) : null}
    </Button>
  )
}
