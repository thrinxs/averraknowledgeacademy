import type { Metadata } from 'next'
import { getPostBySlug, getPublishedPosts, getRelatedPosts, formatDate } from '@/lib/blog'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title:       post.meta_title       || post.title,
    description: post.meta_description || post.excerpt,
    keywords:    post.tags,
    alternates: {
      canonical: `https://www.averraknowledgeacademy.com/blog/${post.slug}`,
    },
    openGraph: {
      title:       post.meta_title       || post.title,
      description: post.meta_description || post.excerpt,
      url:         `https://www.averraknowledgeacademy.com/blog/${post.slug}`,
      type:        'article',
      publishedTime: post.published_at || post.created_at,
      authors:       [post.author],
      tags:          post.tags,
    },
    twitter: {
      card:        'summary_large_image',
      title:       post.meta_title       || post.title,
      description: post.meta_description || post.excerpt,
    },
  }
}

export async function generateStaticParams() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')
  return (data || []).map(post => ({ slug: post.slug }))
}

export const revalidate = 3600

// ── Ad Slot Component ─────────────────────────────────────────────────────────
function AdSlot({ id }: { id: string }) {
  return (
    <div
      className="my-10 rounded-2xl border-2 border-dashed flex items-center justify-center py-8"
      style={{ borderColor: '#E2EEF7', backgroundColor: '#F0F6FB' }}
      data-ad-slot={id}
    >
      <div className="text-center">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Advertisement</p>
        <p className="text-xs text-gray-300">Ad space — Google AdSense will appear here</p>
      </div>
    </div>
  )
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post.slug, post.category)

  // Split content into 3 parts for ad placement
  const contentParts = splitContentForAds(post.content)

  return (
    <main className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: 'linear-gradient(135deg, #062850 0%, #325E84 100%)' }}
      >
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <span
            className="text-xs px-3 py-1 rounded-full font-medium text-white inline-block mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            {post.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-white/50 text-sm">
            <span>{post.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time} min read
            </span>
            {post.published_at && (
              <>
                <span>·</span>
                <span>{formatDate(post.published_at)}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Part 1 — Introduction */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#062850] prose-a:text-[#497296] prose-blockquote:border-[#497296]"
            dangerouslySetInnerHTML={{ __html: contentParts[0] }}
          />

          {/* AD SLOT 1 — after introduction */}
          <AdSlot id="blog-ad-1" />

          {/* Part 2 — Body */}
          {contentParts[1] && (
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#062850] prose-a:text-[#497296]"
              dangerouslySetInnerHTML={{ __html: contentParts[1] }}
            />
          )}

          {/* AD SLOT 2 — middle */}
          {contentParts[1] && <AdSlot id="blog-ad-2" />}

          {/* Part 3 — Conclusion */}
          {contentParts[2] && (
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#062850] prose-a:text-[#497296]"
              dangerouslySetInnerHTML={{ __html: contentParts[2] }}
            />
          )}

          {/* AD SLOT 3 — end of article */}
          <AdSlot id="blog-ad-3" />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-100">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ backgroundColor: '#E2EEF7', color: '#325E84' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-10 text-white text-center"
            style={{ background: 'linear-gradient(135deg, #062850 0%, #325E84 100%)' }}
          >
            <h3 className="text-2xl font-bold mb-3">
              Ready to Find Your Scholarship?
            </h3>
            <p className="text-white/70 mb-6 max-w-lg mx-auto">
              Stop searching alone. Let our team research and match you with the 5 best
              fully funded scholarships for your exact profile.
            </p>
            <Link
              href="/scholarship/apply"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ backgroundColor: '#fff', color: '#062850' }}
            >
              Get My Scholarship Matches
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── RELATED POSTS ── */}
      {related.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8" style={{ color: '#062850' }}>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rp => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium inline-block mb-3"
                    style={{ backgroundColor: '#E2EEF7', color: '#325E84' }}
                  >
                    {rp.category}
                  </span>
                  <h3
                    className="font-bold text-sm mb-2 group-hover:text-blue-700 transition-colors leading-snug"
                    style={{ color: '#062850' }}
                  >
                    {rp.title}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {rp.reading_time} min read
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}

// ── Split content into 3 parts for ad placement ───────────────────────────────
function splitContentForAds(html: string): [string, string, string] {
  const paragraphs = html.split('</p>')
  const total      = paragraphs.length

  if (total <= 4) return [html, '', '']

  const third = Math.floor(total / 3)

  const part1 = paragraphs.slice(0, third).join('</p>') + '</p>'
  const part2 = paragraphs.slice(third, third * 2).join('</p>') + '</p>'
  const part3 = paragraphs.slice(third * 2).join('</p>')

  return [part1, part2, part3]
}