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
    <div className="-mt-[10.4rem] flex items-center justify-center text-white" data-theme="dark">
      <div className="container mb-8 z-10 relative flex items-center justify-items-start">
        <div className="max-w-[36.5rem] md:text-center">
          {richText && <RichText className="mb-6 text-left" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4 !justify-start">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} className="rounded-3xl p-6" />
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

// 'use client'
// import { CMSLink } from '@/components/Link'
// import { RichText } from '@/components/RichText'
// import type { Page } from '@/payload-types'
// import { useHeaderTheme } from '@/providers/HeaderTheme'
// import Image from 'next/image'
// import React, { useEffect } from 'react'

// export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
//   const { setHeaderTheme } = useHeaderTheme()

//   useEffect(() => {
//     setHeaderTheme('dark')
//   }, [])

//   return (
//     <section className="relative min-h-screen text-white overflow-hidden" data-theme="dark">
//       {media && typeof media === 'object' && (
//         <Image
//           src={media.url || ''}
//           alt={media.alt || ''}
//           fill
//           priority
//           unoptimized
//           className="object-cover"
//         />
//       )}

//       <div className="relative z-20 min-h-screen flex items-center">
//         <div className="container">
//           <div className="max-w-[36.5rem]">
//             {richText && (
//               <RichText className="mb-6 text-left" data={richText} enableGutter={false} />
//             )}

//             {Array.isArray(links) && links.length > 0 && (
//               <ul className="flex gap-4">
//                 {links.map(({ link }, i) => (
//                   <li key={i}>
//                     <CMSLink {...link} className="rounded-3xl p-6" />
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
