import type { Metadata } from 'next'
import { getPublishedPosts, formatDate } from '@/lib/blog'
import Link from 'next/link'
import { ArrowRight, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog & Scholarship Guides',
  description:
    'Expert scholarship guides, study abroad tips, and career advice from Averra Knowledge Academy. Learn how to find and win fully funded scholarships.',
  alternates: {
    canonical: 'https://www.averraknowledgeacademy.com/blog',
  },
}

export const revalidate = 3600 // revalidate every hour

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  const featured  = posts.filter(p => p.featured)
  const regular   = posts.filter(p => !p.featured)
  const hasPosts  = posts.length > 0

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{ backgroundColor: '#062850' }}
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#97C3E0' }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium mb-8">
            <Tag className="w-4 h-4" />
            Scholarship Guides & Resources
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            The Averra <span style={{ color: '#97C3E0' }}>Blog</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Expert guides on scholarships, study abroad, careers, and academic success —
            written to help you make better decisions faster.
          </p>
        </div>
      </section>

      {/* ── POSTS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {!hasPosts ? (
            /* No posts yet */
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#062850' }}>
                Articles Coming Soon
              </h2>
              <p className="text-gray-500 mb-8">
                We are writing expert scholarship guides right now. Check back soon.
              </p>
              <Link
                href="/scholarship/apply"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#062850' }}
              >
                Get Scholarship Matches Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Featured posts */}
              {featured.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-xl font-bold mb-8" style={{ color: '#062850' }}>
                    Featured Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featured.map(post => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div
                          className="h-48 flex items-end p-6"
                          style={{ background: `linear-gradient(135deg, #062850 0%, #325E84 100%)` }}
                        >
                          <span
                            className="text-xs px-3 py-1 rounded-full font-medium text-white"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                          >
                            {post.category}
                          </span>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-700 transition-colors" style={{ color: '#062850' }}>
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.reading_time} min read
                            </span>
                            <span>{post.published_at ? formatDate(post.published_at) : ''}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All posts */}
              <div>
                {featured.length > 0 && (
                  <h2 className="text-xl font-bold mb-8" style={{ color: '#062850' }}>
                    All Articles
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regular.map(post => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
                    >
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium inline-block mb-4"
                        style={{ backgroundColor: '#E2EEF7', color: '#325E84' }}
                      >
                        {post.category}
                      </span>
                      <h3 className="font-bold text-base mb-2 group-hover:text-blue-700 transition-colors leading-snug" style={{ color: '#062850' }}>
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.reading_time} min read
                        </span>
                        <span className="flex items-center gap-1 font-medium" style={{ color: '#497296' }}>
                          Read →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: '#062850' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Scholarship?
          </h2>
          <p className="text-white/60 mb-8">
            Stop researching and start applying. Let us match you with the right scholarships.
          </p>
          <Link
            href="/scholarship/apply"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#497296' }}
          >
            Get My Scholarship Matches
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </main>
  )
}