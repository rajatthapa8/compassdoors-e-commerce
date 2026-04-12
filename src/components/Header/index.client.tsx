'use client'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Suspense } from 'react'

import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { LogoIcon } from '@/components/icons/logo'
import { cn } from '@/utilities/cn'
import { usePathname } from 'next/navigation'

import { SiteSetting } from 'src/payload-types'
type Props = {
  header: Header
  setting: SiteSetting
}
interface logo {
  url: string
  alt?: string
}

export function HeaderClient({ header, setting }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <div className="relative z-20 bg-[#04143E]">
      <nav className="flex items-center md:items-end justify-between container pt-2 pl-0 pr-0 md:border-0 md:border-none border-b border-gray-500">
        <div className="flex w-full items-center justify-between container py-4">
          <div className="flex flex-1 justify-start">
            <Link href="/">
              <LogoIcon logo={setting.Logo as logo | undefined} />
            </Link>
          </div>
          <div className="block flex-none md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
          <div className="hidden md:flex flex-1 justify-center">
            {menu.length ? (
              <ul className="flex items-center gap-6">
                {menu.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      {...item.link}
                      className={cn('relative navLink  text-white! text-sm', {
                        active:
                          item.link.url && item.link.url !== '/'
                            ? pathname.includes(item.link.url)
                            : false,
                      })}
                      appearance="default"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  )
}
