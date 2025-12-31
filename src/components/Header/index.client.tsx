'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
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
      <nav className="flex items-center md:items-end justify-between container pt-2 pl-0 pr-0">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <div className="flex w-full items-center justify-between container py-4">
          <div className="flex flex-1 justify-start">
            <Link href="/">
              <LogoIcon logo={setting.Logo as logo | undefined} />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            {menu.length ? (
              <ul className="flex items-center gap-6 text-sm">
                {menu.map((item) => (
                  <li key={item.id}>
                    <CMSLink
                      {...item.link}
                      size={'clear'}
                      className={cn('relative navLink', {
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

          <div className="flex flex-1 justify-end items-center gap-4">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </nav>
    </div>
  )
}
