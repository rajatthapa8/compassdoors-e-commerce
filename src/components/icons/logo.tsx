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
            height={781}
            width={208}
            src={logo.url}
            alt={logo.alt || 'Logo'}
            className="h-10 w-auto md:h-12 lg:h-12"
          />
        ) : (
          <span className="text-xl font-bold">Logo</span>
        )}
      </div>
    </>
  )
}
