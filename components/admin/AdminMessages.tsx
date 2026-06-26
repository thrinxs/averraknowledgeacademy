'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Headphones,
  GraduationCap,
  Monitor,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  MailOpen,
  Inbox,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  messages: any[]
  adminId: string
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

function getRoleIcon(role: string | null) {
  switch (role) {
    case 'scholarship_advisor':
      return GraduationCap
    case 'it_support':
      return Monitor
    case 'customer_care':
    default:
      return Headphones
  }
}

function getRoleName(role: string | null) {
  switch (role) {
    case 'scholarship_advisor':
      return 'Scholarship Advisor'
    case 'it_support':
      return 'IT Support'
    case 'customer_care':
    default:
      return 'Customer Care'
  }
}

function getRoleColor(role: string | null) {
  switch (role) {
    case 'scholarship_advisor':
      return '#16A34A'
    case 'it_support':
      return '#D97706'
    default:
      return '#497296'
  }
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export default function AdminMessages({
  messages: initialMessages,
  adminId,
}: Props) {
  const [messages, setMessages] =
    useState(initialMessages)
  const [expandedId, setExpandedId] =
    useState<string | null>(null)
  const [replyContent, setReplyContent] =
    useState('')
  const [replying, setReplying] =
    useState<string | null>(null)
  const [filter, setFilter] = useState<
    'all' | 'unread' | 'read'
  >('all')
  const [roleFilter, setRoleFilter] =
    useState('all')
  const router = useRouter()

  const filtered = messages.filter((m) => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'unread' && !m.is_read) ||
      (filter === 'read' && m.is_read)

    const matchRole =
      roleFilter === 'all' ||
      m.recipient_role === roleFilter

    return matchFilter && matchRole
  })

  const handleExpand = async (msg: any) => {
    if (expandedId === msg.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(msg.id)

    if (!msg.is_read) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', msg.id)

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? { ...m, is_read: true }
            : m
        )
      )
    }
  }

  const handleReply = async (msg: any) => {
    if (!replyContent.trim()) return

    setReplying(msg.id)
    try {
      await supabase.from('messages').insert({
        sender_id: adminId,
        receiver_id: msg.sender_id,
        sender_name: 'Averra Team',
        sender_role: 'admin',
        recipient_role: msg.recipient_role,
        topic: `Re: ${msg.topic}`,
        content: replyContent.trim(),
        is_read: false,
        thread_id: msg.thread_id || msg.id,
      })

            // Send email notification to student
      // Get student email first
      const { data: studentProfile } =
        await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', msg.sender_id)
          .maybeSingle()

      if (studentProfile?.email) {
        const deptName =
          msg.recipient_role ===
          'scholarship_advisor'
            ? 'Scholarship Advisor'
            : msg.recipient_role === 'it_support'
            ? 'IT Support'
            : 'Customer Care'

        await fetch('/api/email/send-reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: studentProfile.email,
            name:
              studentProfile.full_name ||
              'Student',
            subject: msg.topic,
            replyContent: replyContent.trim(),
            department: deptName,
          }),
        })
      }
      
      // Notify the student
      await supabase
        .from('notifications')
        .insert({
          user_id: msg.sender_id,
          type: 'message',
          title: 'New Reply from Averra Team',
          message: `You have a new reply regarding: ${msg.topic}`,
          is_read: false,
          link: '/dashboard/messages',
        })

      setReplyContent('')
      setExpandedId(null)
      router.refresh()
    } finally {
      setReplying(null)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: '#062850' }}
        >
          Student Messages
        </h1>
        <p className="text-gray-500 text-sm">
          {messages.filter((m) => !m.is_read).length}{' '}
          unread messages
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'read', label: 'Read' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setFilter(
                tab.key as 'all' | 'unread' | 'read'
              )
            }
            className="px-4 py-2 rounded-xl text-sm
            font-medium transition-all"
            style={{
              backgroundColor:
                filter === tab.key
                  ? '#062850'
                  : '#F0F6FB',
              color:
                filter === tab.key
                  ? 'white'
                  : '#497296',
            }}
          >
            {tab.label}
          </button>
        ))}

        <span className="w-px bg-gray-200 mx-1" />

        {[
          { key: 'all', label: 'All Departments' },
          {
            key: 'customer_care',
            label: 'Customer Care',
          },
          {
            key: 'scholarship_advisor',
            label: 'Scholarship',
          },
          { key: 'it_support', label: 'IT Support' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setRoleFilter(tab.key)
            }
            className="px-4 py-2 rounded-xl text-sm
            font-medium transition-all"
            style={{
              backgroundColor:
                roleFilter === tab.key
                  ? '#497296'
                  : '#F0F6FB',
              color:
                roleFilter === tab.key
                  ? 'white'
                  : '#497296',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-12 text-center">
          <MessageSquare
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: '#497296' }}
          />
          <p
            className="font-semibold"
            style={{ color: '#062850' }}
          >
            No messages
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const RoleIcon = getRoleIcon(
              msg.recipient_role
            )
            const roleColor = getRoleColor(
              msg.recipient_role
            )
            const isExpanded =
              expandedId === msg.id

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl
                border overflow-hidden
                ${!msg.is_read
                  ? 'border-l-4'
                  : 'border-gray-100'
                }`}
                style={{
                  borderLeftColor: !msg.is_read
                    ? roleColor
                    : undefined,
                }}
              >
                <button
                  onClick={() =>
                    handleExpand(msg)
                  }
                  className="w-full text-left p-5"
                >
                  <div className="flex items-center
                  justify-between">
                    <div className="flex
                    items-center gap-3">
                      <RoleIcon
                        className="w-5 h-5"
                        style={{
                          color: roleColor,
                        }}
                      />
                      <div>
                        <p
                          className={`text-sm
                          ${!msg.is_read
                            ? 'font-bold'
                            : 'font-semibold'
                          }`}
                          style={{
                            color: '#062850',
                          }}
                        >
                          {msg.topic}
                        </p>
                        <p className="text-xs
                        text-gray-500">
                          From:{' '}
                          {msg.sender_name ||
                            'Student'}{' '}
                          · {getRoleName(
                            msg.recipient_role
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex
                    items-center gap-2">
                      {!msg.is_read && (
                        <span
                          className="w-2 h-2
                          rounded-full"
                          style={{
                            backgroundColor:
                              roleColor,
                          }}
                        />
                      )}
                      <span className="text-xs
                      text-gray-400">
                        {formatTime(
                          msg.created_at
                        )}
                      </span>
                      {isExpanded ? (
                        <ChevronUp
                          className="w-4 h-4
                          text-gray-400"
                        />
                      ) : (
                        <ChevronDown
                          className="w-4 h-4
                          text-gray-400"
                        />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5
                  border-t border-gray-100">
                    <p className="text-sm
                    text-gray-700 leading-relaxed
                    whitespace-pre-line pt-4 mb-4">
                      {msg.content}
                    </p>

                    {/* Reply Form */}
                    <div className="pt-4 border-t
                    border-gray-100">
                      <label
                        className="block text-sm
                        font-semibold mb-2"
                        style={{
                          color: '#062850',
                        }}
                      >
                        Reply
                      </label>
                      <textarea
                        placeholder="Type your reply..."
                        value={
                          expandedId === msg.id
                            ? replyContent
                            : ''
                        }
                        onChange={(e) =>
                          setReplyContent(
                            e.target.value
                          )
                        }
                        rows={3}
                        className={`${inputClass}
                        resize-none mb-3`}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                      <div className="flex
                      justify-end">
                        <Button
                          onClick={() =>
                            handleReply(msg)
                          }
                          disabled={
                            replying === msg.id ||
                            !replyContent.trim()
                          }
                          className="text-white
                          font-medium px-5 py-3
                          rounded-xl text-sm"
                          style={{
                            backgroundColor:
                              '#062850',
                          }}
                        >
                          {replying === msg.id ? (
                            <>
                              <Loader2
                                className="w-4
                                h-4 mr-2
                                animate-spin"
                              />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send
                                className="w-4
                                h-4 mr-2"
                              />
                              Send Reply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}