import 'server-only'

import { createSupabaseServerClient } from '@/lib/supabase-server'

export interface BlogPost {
  id:               string
  title:            string
  slug:             string
  excerpt:          string
  content:          string
  cover_image:      string | null
  category:         string
  tags:             string[]
  author:           string
  status:           'draft' | 'published'
  featured:         boolean
  reading_time:     number
  meta_title:       string | null
  meta_description: string | null
  published_at:     string | null
  created_at:       string
  updated_at:       string
}

// ── Get all published posts ───────────────────────────────────────────────────
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  return data || []
}

// ── Get single post by slug ───────────────────────────────────────────────────
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return data
}

// ── Get all posts for admin ───────────────────────────────────────────────────
export async function getAllPostsForAdmin(): Promise<BlogPost[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

// ── Get related posts ─────────────────────────────────────────────────────────
export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3
): Promise<BlogPost[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .neq('slug', currentSlug)
    .limit(limit)
    .order('published_at', { ascending: false })
  return data || []
}

// ── Generate slug from title ──────────────────────────────────────────────────
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ── Calculate reading time ────────────────────────────────────────────────────
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// ── Format date ───────────────────────────────────────────────────────────────
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })
}