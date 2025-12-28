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
            height={100}
            width={100}
            src={logo.url}
            alt={logo.alt || 'Logo'}
            className="w-full h-auto"
          />
        ) : (
          <span className="text-xl font-bold">Logo</span>
        )}
      </div>
    </>
  )
}
