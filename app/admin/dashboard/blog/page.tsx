import { getAllPostsForAdmin } from '@/lib/blog'
import Link from 'next/link'
import { Plus, Edit, Eye, FileText } from 'lucide-react'

export default async function AdminBlogPage() {
  const posts = await getAllPostsForAdmin()

  const published = posts.filter(p => p.status === 'published')
  const drafts    = posts.filter(p => p.status === 'draft')

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#062850' }}>Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">
            {published.length} published · {drafts.length} drafts
          </p>
        </div>
        <Link
          href="/admin/dashboard/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#062850' }}
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Articles', value: posts.length,     color: '#062850' },
          { label: 'Published',      value: published.length, color: '#009846' },
          { label: 'Drafts',         value: drafts.length,    color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">No articles yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first blog article to get started.</p>
          <Link
            href="/admin/dashboard/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#062850' }}
          >
            <Plus className="w-4 h-4" />
            Write First Article
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F0F6FB' }}>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{post.reading_time} min read</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: '#E2EEF7', color: '#325E84' }}
                    >
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{
                        backgroundColor: post.status === 'published' ? '#dcfce7' : '#fef9c3',
                        color:           post.status === 'published' ? '#166534' : '#854d0e',
                      }}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/dashboard/blog/${post.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#062850' }}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Link>
                      {post.status === 'published' && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-90"
                          style={{ backgroundColor: '#E2EEF7', color: '#325E84' }}
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}