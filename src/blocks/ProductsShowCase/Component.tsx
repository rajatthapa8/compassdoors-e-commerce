import { AddToCart } from '@/components/Cart/AddToCart'
import { RichText } from '@/components/RichText'
import { Media, Product } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
type props = {
  title?: string
  description?: string
  products: Product[]
}

export const ProductsShowCaseBlock: React.FC<props> = ({ title, description, products }) => {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:h-screen flex items-center justify-center mt-10 lg:mt-0">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-1/4 px-4 flex flex-col justify-end mb-12 lg:mb-0">
          <h2 className="text-3xl font-semibold text-[#2f2f2f] mb-4 leading-tight">{title}</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">{description}</p>
          <div>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-primary text-white font-medium rounded-full hover:bg-black transition-all"
            >
              Our Products
            </Link>
          </div>
        </div>

        {products?.map((product, i) => {
          const galleryImage = product.gallery?.[0]?.image as Media
          const seoImage = product.meta?.image as Media
          const displayImage = galleryImage || seoImage

          return (
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-4 mb-8" key={i}>
              <Link
                href={`/products/${product.slug}`}
                className="group text-center relative z-0 inline-block p-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[65%] after:z-[-1] 
                after:bg-[#f2dac9] after:rounded-[10px] after:transition-all after:duration-600 hover:after:h-full"
              >
                <div className="mb-6 transition-all duration-300 relative overflow-hidden aspect-[4/5] flex items-center justify-center">
                  {displayImage?.url && (
                    <Image
                      height={400}
                      width={400}
                      src={displayImage.url}
                      alt={product.title || 'Product'}
                      className="w-full h-auto object-contain transform transition-transform duration-500 group-hover:scale-105 group-hover:transform-[perspective(400px)_rotateY(-45deg)_translateZ(0px)]"
                    />
                  )}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full group-hover:-translate-y-6 transition-all duration-400 bg-[#2f2f2f] p-3 rounded-full shadow-lg">
                    <PlusIcon className="text-white w-5 h-5" />
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#2f2f2f] mb-4 leading-tight">
                  {product.title}
                </h3>

                <div className="text-gray-700 mb-8 leading-relaxed line-clamp-4 text-center">
                  {product.description ? (
                    <RichText data={product.description} enableGutter={false} />
                  ) : (
                    product.meta?.description
                  )}
                </div>
                <AddToCart product={product} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)
