import StarRating from '@/components/StarRating'
import Image from 'next/image'
import Link from 'next/link'

type GoogleReviewBlockProps = {
  title?: string
  limit?: number
}

type Review = {
  author_name: string
  rating: number
  text: string
  profile_photo_url: string
  relative_time_description: string
  author_url: string
}

async function getReviews(limit = 3): Promise<Review[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/google-reviews?limit=${limit}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []

  const data = await res.json()
  return data.reviews ?? []
}

export default async function GoogleReviewBlock({ title, limit }: GoogleReviewBlockProps) {
  const reviewLimit = limit || 3
  const reviews = await getReviews(reviewLimit)
  const displayedReviews = reviews.slice(0, limit || 3)
  if (!reviews.length) return null

  return (
    <section className="h-screen container flex flex-col justify-center items-left">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2f2f2f] mb-16">{title}</h2>
        <Link href="https://maps.app.goo.gl/ZFkFYcwoMQTLMqrZ6" target="_blank">
          <h2 className="text-md md:text-md underline font-bold text-[#2f2f2f] mb-16">
            View Google Map
          </h2>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {displayedReviews.map((review, i) => (
          <Link
            href={review.author_url}
            key={i}
            target="_blank"
            className="w-full max-w-88 space-y-4 rounded-md border border-gray-200 bg-white p-3 text-gray-500 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-row">
                <StarRating rating={review.rating} />
              </div>
              <p>{review.relative_time_description}</p>
            </div>
            <p>{review.text}</p>
            <div className="flex items-center gap-2 pt-3">
              <Image
                className="h-8 w-8 rounded-full"
                src={review.profile_photo_url}
                alt="Richard Nelson"
                height={500}
                width={500}
              />
              <p className="font-medium text-gray-800">{review.author_name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
