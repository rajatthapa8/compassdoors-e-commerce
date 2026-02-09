import { Button } from '@/components/ui/button'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <Button
      variant="default"
      size="clear"
      className="navLink relative items-end hover:cursor-pointer text-white!"
      {...rest}
    >
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
