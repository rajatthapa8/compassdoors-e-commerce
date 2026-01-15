import type { Footer } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import Image from 'next/image'
import Link from 'next/link'
import { SiFacebook, SiWhatsapp } from 'react-icons/si'
import { RichText } from '../RichText'
import { FooterMenu } from './menu'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 2)()
  const menu = footerData.navItems || []

  //extracting logo's url and alt
  const { logo } = footerData
  const logoUrl =
    typeof logo === 'object' && logo !== null && 'url' in logo ? (logo.url as string) : ''
  const logoAlt =
    typeof logo === 'object' && logo !== null && 'alt' in logo
      ? (logo.alt as string)
      : 'Compass Doors Logo'
  return (
    <>
      <footer className="bg-[#04143E] px-6 pt-8 md:px-16 lg:px-36 w-full text-gray-300">
        <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10 container">
          <div className="md:max-w-96">
            <Image alt={logoAlt} className="h-auto" src={logoUrl} height={200} width={200} />

            <RichText data={footerData.footerText} className="mt-6 text-sm text-white p-0" />

            <div className="flex items-center gap-4 mt-3 text-white">
              <Link href="http://facebook.com/compassdoors" target="_blank">
                <SiFacebook className="w-6 h-6 hover:text-[#1877F2] transition-colors cursor-pointer" />
              </Link>
              <Link href="https://wa.me/9779825961555" target="_blank">
                <SiWhatsapp
                  className="w-6 h-6 hover:text-[#25D366] transition-colors cursor-pointer"
                  target="www.google.com"
                />
              </Link>
              {/* <Link href="" target="_blank">
                <SiInstagram className="w-6 h-6 hover:text-[#E4405F] transition-colors cursor-pointer" />
              </Link> */}
            </div>
          </div>
          <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
            <div>
              <h2 className="font-semibold mb-5">Useful Links</h2>

              <FooterMenu menu={footerData.navItems} />
            </div>
            <div>
              <h2 className="font-semibold mb-5">Get in touch</h2>
              <div className="text-sm space-y-2">
                <Link href={`tel:${footerData.phoneNumber}`} target="_blank">
                  <p>{footerData.phoneNumber}</p>
                </Link>
                <p>{footerData.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center container">
          <p className="pt-4 text-center text-sm pb-5">
            Copyright {new Date().getFullYear()} © Compass Doors All Right Reserved.
          </p>
          <Link href="https://www.linkedin.com/in/rajat-thapa-5a0266a1/" target="_blank">
            <p className='className="pt-4 text-center text-sm pb-5"'>Made with ❤️ by Rajat</p>
          </Link>
        </div>
      </footer>
    </>
  )
}
