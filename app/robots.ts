import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard/', '/admin/', '/auth/'] },
    sitemap: 'https://averraknowledgeacademy.com/sitemap.xml'
  }
}