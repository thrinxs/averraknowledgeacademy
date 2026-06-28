import { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base  = 'https://www.averraknowledgeacademy.com'
  const posts = await getPublishedPosts()

  const blogUrls = posts.map(post => ({
    url:             `${base}/blog/${post.slug}`,
    lastModified:    new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority:        0.7,
  }))

  return [
    { url: `${base}`,                   lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/scholarship`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/scholarship/apply`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/academy`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/careers`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/skills`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/about`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/earn`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`,              lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/privacy`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,             lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    ...blogUrls,
  ]
}