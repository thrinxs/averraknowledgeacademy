'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { generateSlug, calculateReadingTime } from '@/lib/blog-utils'
import { supabase } from '@/lib/supabase'
import { Save, Eye, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

const BlogEditor = dynamic(
  () => import('@/components/blog/BlogEditor'),
  { ssr: false }
)

const CATEGORIES = [
  'Scholarship', 'Study Abroad', 'Career', 'Skills', 'Academic', 'General',
]

export default function EditBlogPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [loading,         setLoading]         = useState(true)
  const [title,           setTitle]           = useState('')
  const [slug,            setSlug]            = useState('')
  const [excerpt,         setExcerpt]         = useState('')
  const [content,         setContent]         = useState('')
  const [category,        setCategory]        = useState('Scholarship')
  const [tags,            setTags]            = useState('')
  const [metaTitle,       setMetaTitle]       = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [status,          setStatus]          = useState<'draft' | 'published'>('draft')
  const [saving,          setSaving]          = useState(false)
  const [deleting,        setDeleting]        = useState(false)
  const [error,           setError]           = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setTitle(data.title)
        setSlug(data.slug)
        setExcerpt(data.excerpt || '')
        setContent(data.content)
        setCategory(data.category)
        setTags((data.tags || []).join(', '))
        setMetaTitle(data.meta_title || '')
        setMetaDescription(data.meta_description || '')
        setStatus(data.status)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSave(publishStatus: 'draft' | 'published') {
    if (!title.trim())   { setError('Title is required.');   return }
    if (!content.trim()) { setError('Content is required.'); return }

    setSaving(true)
    setError('')

    const reading_time = calculateReadingTime(content)
    const tagArray     = tags.split(',').map(t => t.trim()).filter(Boolean)

    const updateData: any = {
      title,
      slug:             slug.toLowerCase(),
      excerpt,
      content,
      category,
      tags:             tagArray,
      meta_title:       metaTitle || title,
      meta_description: metaDescription || excerpt,
      status:           publishStatus,
      reading_time,
      updated_at:       new Date().toISOString(),
    }

    if (publishStatus === 'published' && status === 'draft') {
      updateData.published_at = new Date().toISOString()
    }

    const { error: saveError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)

    setSaving(false)

    if (saveError) { setError(saveError.message); return }

    router.push('/admin/dashboard/blog')
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this article? This cannot be undone.')) return

    setDeleting(true)
    await supabase.from('blog_posts').delete().eq('id', id)
    router.push('/admin/dashboard/blog')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const charCount = metaDescription.length

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/blog"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: '#062850' }}>Edit Article</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: '#062850', color: '#062850' }}
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#009846' }}
          >
            <Eye className="w-4 h-4" />
            {saving ? 'Saving...' : status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#062850' }}>
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#062850' }}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#062850' }}>
              Article Content *
            </label>
            <BlogEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#062850' }}>URL Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-2">/blog/<strong>{slug}</strong></p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#062850' }}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#062850' }}>Tags</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="scholarship, Nigeria, study abroad"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm" style={{ color: '#062850' }}>SEO Settings</h3>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">{metaTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
              />
              <p className={`text-xs mt-1 ${charCount > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                {charCount}/160 characters
              </p>
            </div>
          </div>

          {(metaTitle || title) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-sm mb-3" style={{ color: '#062850' }}>Google Preview</h3>
              <div className="p-4 rounded-xl border border-gray-200">
                <p className="text-blue-700 text-sm font-medium leading-tight mb-1 line-clamp-1">
                  {metaTitle || title} | Averra Knowledge Academy
                </p>
                <p className="text-green-700 text-xs mb-1">averraknowledgeacademy.com/blog/{slug}</p>
                <p className="text-gray-600 text-xs line-clamp-2">
                  {metaDescription || excerpt || 'No description provided yet.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}