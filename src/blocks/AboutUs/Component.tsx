import { RichText } from '@/components/RichText'
import { Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'
type props = {
  heading: string
  description: string
  bulletPoints: string
  media1: string
  media2: string
  media3: string
}
export const AboutUsBlock: React.FC<props> = ({
  heading,
  description,
  bulletPoints,
  media1,
  media2,
  media3,
}) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="w-full lg:w-[60%] flex justify-start items-start">
            <div className="relative w-full max-w-[600px] aspect-[4/3] md:aspect-square">
              <div className="relative w-[70%] h-[85%] z-10">
                <Image
                  src={(media1 as unknown as Media)?.url || ''}
                  alt="Main Door Display"
                  fill
                  className="object-cover rounded-3xl shadow-xl"
                />
              </div>

              <div className="absolute top-0 right-0 w-[45%] h-[40%] z-20">
                <Image
                  src={(media2 as unknown as Media)?.url || ''}
                  alt="Craftsmanship"
                  fill
                  className="object-cover rounded-3xl shadow-lg border-[6px] border-white md:border-[12px]"
                />
              </div>

              <div className="absolute bottom-0 right-[5%] w-[55%] h-[50%] z-30">
                <Image
                  src={(media3 as unknown as Media)?.url || ''}
                  alt="Workshop"
                  fill
                  className="object-cover rounded-3xl shadow-2xl border-[6px] border-white md:border-[12px]"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[40%] flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2f2f2f] mb-6">{heading}</h2>

            <p className="text-gray-500 leading-relaxed mb-8">{description}</p>

            <div className="mb-8">
              <div className="about-us-bullets">
                <RichText data={bulletPoints as any} enableGutter={false} />
              </div>
            </div>

            <div className="flex">
              <a
                href="https://wa.me/9779825961555"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-[#25D366] text-white font-bold rounded-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
