import Image from 'next/image'

// Inside LogoProps definition

interface LogoProps {
  logo?: {
    url: string
    alt?: string
  }
}

export function LogoIcon({ logo }: LogoProps) {
  return (
    <>
      <div>
        {logo ? (
          <Image
            height={120}
            width={120}
            src={logo.url}
            alt={logo.alt || 'Logo'}
            className="w-full h-11 "
            priority
            quality={100}
          />
        ) : (
          <span className="text-xl font-bold">Logo</span>
        )}
      </div>
    </>
  )
}
