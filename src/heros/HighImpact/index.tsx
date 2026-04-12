'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { RichText } from '@/components/RichText'
import Image from 'next/image'
export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
  rotatingPhrases,
  image,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const phrases = rotatingPhrases?.map((item) => item.phrase).filter(Boolean) || []
  const hasRotatingPhrases = phrases.length > 0

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useEffect(() => {
    if (!hasRotatingPhrases || phrases.length <= 1) return

    const interval = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        setIsAnimating(false)
      }, 300)
    }, 2000)

    return () => clearInterval(interval)
  }, [phrases.length, hasRotatingPhrases])

  return (
    <div
      className="flex items-center justify-center text-white bg-[#04143E] md:bg-transparent overflow-x-hidden"
      data-theme="dark"
    >
      <div className="container mx-auto px-4 mb-8 z-10 relative flex items-center justify-items-start min-h-screen md:min-h-0">
        <div className="max-w-146 md:text-center">
          <div className="md:hidden select-none w-auto h-auto ">
            {image && typeof image === 'object' && (
              <Image
                src={image.url || ''}
                height={500}
                width={500}
                priority
                unoptimized
                className="-z-10"
                alt={image.alt || ''}
              />
            )}
          </div>
          {richText && !hasRotatingPhrases && (
            <RichText className="mb-6 text-left text-lg" data={richText} enableGutter={false} />
          )}

          {hasRotatingPhrases && (
            <div className="mb-6 text-left">
              <h1 className="text-2xl md:text-5xl font-bold leading-tight">
                <span className="block mb-2">Beautiful,</span>
                <span
                  className={`block text-secondary transition-all duration-300 mb-2 ${
                    isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  }`}
                >
                  {phrases[currentPhraseIndex]}
                </span>
                <span className="block">Laminated Doors</span>
              </h1>

              {richText && (
                <div className="text-base text-gray-300 mt-6 max-w-2xl">
                  <RichText className="" data={richText} enableGutter={false} />
                </div>
              )}
            </div>
          )}

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
      <div className="hidden md:block min-h-screen select-none ">
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
