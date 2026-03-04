'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { RichText } from '@/components/RichText'
import Image from 'next/image'
export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div className="flex items-center justify-center text-white" data-theme="dark">
      <div className="container mb-8 z-10 relative flex items-center justify-items-start">
        <div className="max-w-[36.5rem] md:text-center">
          {richText && <RichText className="mb-6 text-left" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4 !justify-start">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} className="rounded-3xl px-10 py-6" />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-screen select-none">
        {media && typeof media === 'object' && (
          <Image
            src={media.url || ''}
            fill
            priority
            unoptimized
            className="object-cover -z-10"
            alt={media.alt || ''}
          />
        )}
      </div>
    </div>
  )
}
