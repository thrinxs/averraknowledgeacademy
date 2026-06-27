import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://averraknowledgeacademy.com'
  const pages = ['', '/scholarship', '/academy', '/skills', '/careers', '/contact']
  return pages.map(p => ({ url: `${base}${p}`, lastModified: new Date() }))
}