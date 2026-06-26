'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Send,
  Plus,
  X,
  Headphones,
  GraduationCap,
  Monitor,
  ArrowRight,
  CheckCheck,
  Loader2,
  Inbox,
  Mail,
  MailOpen,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  sender_id: string | null
  receiver_id: string | null
  sender_name: string | null
  sender_role: string | null
  recipient_role: string | null
  topic: string
  content: string
  is_read: boolean
  thread_id: string | null
  created_at: string
}

interface Props {
  messages: Message[]
  userId: string
  userName: string
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

const RECIPIENT_ROLES = [
  {
    id: 'customer_care',
    name: 'Customer Care',
    icon: Headphones,
    description: 'General enquiries, account support, complaints',
    color: '#497296',
    bg: '#F0F6FB',
  },
  {
    id: 'scholarship_advisor',
    name: 'Scholarship Advisor',
    icon: GraduationCap,
    description: 'Matches, applications, SOP, CV, interview prep',
    color: '#16A34A',
    bg: '#F0FDF4',
  },
  {
    id: 'it_support',
    name: 'IT Support',
    icon: Monitor,
    description: 'Login issues, payment errors, platform bugs',
    color: '#D97706',
    bg: '#FFFBEB',
  },
]

function getRoleName(role: string | null): string {
  if (!role) return 'Averra Team'
  const found = RECIPIENT_ROLES.find(
    (r) => r.id === role
  )
  return found ? found.name : 'Averra Team'
}

function getRoleColor(role: string | null): string {
  if (!role) return '#497296'
  const found = RECIPIENT_ROLES.find(
    (r) => r.id === role
  )
  return found ? found.color : '#497296'
}

function getRoleBg(role: string | null): string {
  if (!role) return '#F0F6FB'
  const found = RECIPIENT_ROLES.find(
    (r) => r.id === role
  )
  return found ? found.bg : '#F0F6FB'
}

function getRoleIcon(role: string | null) {
  if (!role) return MessageSquare
  const found = RECIPIENT_ROLES.find(
    (r) => r.id === role
  )
  return found ? found.icon : MessageSquare
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function MessagesInbox({
  messages: initialMessages,
  userId,
  userName,
}: Props) {
  const [messages, setMessages] =
    useState(initialMessages)
  const [showCompose, setShowCompose] =
    useState(false)
  const [expandedId, setExpandedId] =
    useState<string | null>(null)
  const [filter, setFilter] = useState<
    'all' | 'unread' | 'read'
  >('all')

  // Compose form state
  const [selectedRole, setSelectedRole] =
    useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] =
    useState(false)

  const router = useRouter()

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read') return m.is_read
    return true
  })

  const unreadCount = messages.filter(
    (m) => !m.is_read && m.receiver_id === userId
  ).length

  const readCount = messages.filter(
    (m) => m.is_read && m.receiver_id === userId
  ).length

  const markAsRead = async (msgId: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', msgId)

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, is_read: true }
          : m
      )
    )
  }

  const handleExpand = async (msg: Message) => {
    if (expandedId === msg.id) {
      setExpandedId(null)
      return
    }

    setExpandedId(msg.id)

    if (
      !msg.is_read &&
      msg.receiver_id === userId
    ) {
      await markAsRead(msg.id)
    }
  }

  const handleSend = async () => {
    if (!selectedRole) {
      setSendError('Please select who to message.')
      return
    }
    if (!subject.trim()) {
      setSendError('Please enter a subject.')
      return
    }
    if (!content.trim()) {
      setSendError('Please enter your message.')
      return
    }

    setSending(true)
    setSendError('')
    setSendSuccess(false)

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: null,
          sender_name: userName,
          sender_role: 'student',
          recipient_role: selectedRole,
          topic: subject.trim(),
          content: content.trim(),
          is_read: false,
        })

      if (error) {
        setSendError(
          'Could not send message. Please try again.'
        )
        return
      }

      setSendSuccess(true)
      setSubject('')
      setContent('')
      setSelectedRole('')

      setTimeout(() => {
        setShowCompose(false)
        setSendSuccess(false)
        router.refresh()
      }, 2000)
    } catch {
      setSendError(
        'Something went wrong. Please try again.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center
      justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#062850' }}
          >
            Messages
          </h1>
          <p className="text-gray-500 text-sm">
            Communication between you and the
            Averra team.
          </p>
        </div>

        <Button
          onClick={() => {
            setShowCompose(!showCompose)
            setSendSuccess(false)
            setSendError('')
          }}
          className="flex items-center gap-2
          text-white font-semibold px-5 py-4
          rounded-xl transition-all duration-300
          hover:opacity-90 hover:scale-105"
          style={{ backgroundColor: '#062850' }}
        >
          {showCompose ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              New Message
            </>
          )}
        </Button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <div
          className="bg-white rounded-2xl border
          border-gray-100 p-6 mb-6 transition-all
          duration-300"
        >
          <h3
            className="font-bold mb-4"
            style={{ color: '#062850' }}
          >
            New Message
          </h3>

          {sendSuccess ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{
                backgroundColor: '#F0FDF4',
              }}
            >
              <CheckCheck
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: '#16A34A' }}
              />
              <p
                className="font-semibold"
                style={{ color: '#166534' }}
              >
                Message sent successfully!
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: '#166534' }}
              >
                Our team will respond as soon as
                possible.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label
                  className="block text-sm
                  font-semibold mb-3"
                  style={{ color: '#062850' }}
                >
                  Who would you like to message?
                </label>
                <div className="grid grid-cols-1
                sm:grid-cols-3 gap-3">
                  {RECIPIENT_ROLES.map((role) => {
                    const isSelected =
                      selectedRole === role.id
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() =>
                          setSelectedRole(role.id)
                        }
                        className="text-left p-4
                        rounded-xl border-2
                        transition-all duration-200
                        hover:-translate-y-0.5"
                        style={{
                          borderColor: isSelected
                            ? role.color
                            : '#E5E7EB',
                          backgroundColor: isSelected
                            ? role.bg
                            : 'white',
                        }}
                      >
                        <role.icon
                          className="w-5 h-5 mb-2"
                          style={{
                            color: role.color,
                          }}
                        />
                        <p
                          className="text-sm
                          font-semibold mb-0.5"
                          style={{
                            color: '#062850',
                          }}
                        >
                          {role.name}
                        </p>
                        <p className="text-xs
                        text-gray-500">
                          {role.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  className="block text-sm
                  font-semibold mb-2"
                  style={{ color: '#062850' }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What is this about?"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                  className={inputClass}
                  style={{
                    borderColor: '#D1D5DB',
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="block text-sm
                  font-semibold mb-2"
                  style={{ color: '#062850' }}
                >
                  Message
                </label>
                <textarea
                  placeholder="Write your message here..."
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  rows={5}
                  className={`${inputClass} resize-none`}
                  style={{
                    borderColor: '#D1D5DB',
                  }}
                />
              </div>

              {/* Error */}
              {sendError && (
                <p className="text-red-500 text-xs">
                  {sendError}
                </p>
              )}

              {/* Send Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex items-center
                  gap-2 text-white font-semibold
                  px-6 py-4 rounded-xl
                  transition-all duration-300
                  hover:opacity-90 hover:scale-105
                  disabled:opacity-60"
                  style={{
                    backgroundColor: '#062850',
                  }}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4
                      animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          {
            key: 'all',
            label: 'All',
            count: messages.length,
            icon: Inbox,
          },
          {
            key: 'unread',
            label: 'Unread',
            count: unreadCount,
            icon: Mail,
          },
          {
            key: 'read',
            label: 'Read',
            count: readCount,
            icon: MailOpen,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setFilter(
                tab.key as 'all' | 'unread' | 'read'
              )
            }
            className="flex items-center gap-2
            px-4 py-2.5 rounded-xl text-sm
            font-medium transition-all duration-200"
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
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-full
                text-xs font-bold"
                style={{
                  backgroundColor:
                    filter === tab.key
                      ? 'rgba(255,255,255,0.2)'
                      : '#E0EEF7',
                  color:
                    filter === tab.key
                      ? 'white'
                      : '#062850',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-12 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex
            items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F0F6FB' }}
          >
            <MessageSquare
              className="w-7 h-7"
              style={{ color: '#497296' }}
            />
          </div>
          <p
            className="font-semibold mb-1"
            style={{ color: '#062850' }}
          >
            {filter === 'unread'
              ? 'No unread messages'
              : filter === 'read'
              ? 'No read messages'
              : 'No messages yet'}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {filter === 'all'
              ? 'Start a conversation with our team using the New Message button above.'
              : 'Try changing the filter to see other messages.'}
          </p>
          {filter === 'all' && (
            <Button
              onClick={() => setShowCompose(true)}
              className="text-white font-medium
              px-6 py-4 rounded-xl transition-all
              duration-300 hover:opacity-90
              hover:scale-105"
              style={{
                backgroundColor: '#062850',
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Send Your First Message
            </Button>
          )}
        </div>
      )}

      {/* Messages List */}
      {filteredMessages.length > 0 && (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isSent =
              msg.sender_id === userId
            const isExpanded =
              expandedId === msg.id
            const role = isSent
              ? msg.recipient_role
              : msg.sender_role === 'student'
              ? null
              : msg.recipient_role
            const RoleIcon = isSent
              ? getRoleIcon(msg.recipient_role)
              : getRoleIcon(msg.recipient_role)
            const roleColor = getRoleColor(
              msg.recipient_role
            )
            const roleBg = getRoleBg(
              msg.recipient_role
            )

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl
                border overflow-hidden
                transition-all duration-200
                hover:shadow-md
                ${!msg.is_read &&
                  msg.receiver_id === userId
                  ? 'border-l-4'
                  : 'border-gray-100'
                }`}
                style={{
                  borderLeftColor:
                    !msg.is_read &&
                    msg.receiver_id === userId
                      ? roleColor
                      : undefined,
                }}
              >
                {/* Message Header */}
                <button
                  onClick={() => handleExpand(msg)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start
                  gap-4">
                    {/* Icon */}
                    <div
                      className="w-10 h-10
                      rounded-xl flex items-center
                      justify-center flex-shrink-0"
                      style={{
                        backgroundColor: roleBg,
                      }}
                    >
                      <RoleIcon
                        className="w-5 h-5"
                        style={{
                          color: roleColor,
                        }}
                      />
                    </div>

                    {/* Content Preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex
                      items-start justify-between
                      gap-2 mb-1">
                        <div>
                          <div className="flex
                          items-center gap-2 mb-0.5">
                            <span
                              className="text-xs
                              font-medium px-2 py-0.5
                              rounded-full"
                              style={{
                                backgroundColor:
                                  roleBg,
                                color: roleColor,
                              }}
                            >
                              {isSent
                                ? `To: ${getRoleName(msg.recipient_role)}`
                                : `From: ${msg.sender_name || getRoleName(msg.recipient_role)}`}
                            </span>
                            {isSent && (
                              <span
                                className="text-xs
                                px-2 py-0.5
                                rounded-full
                                bg-gray-100
                                text-gray-500"
                              >
                                Sent
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm
                            ${!msg.is_read &&
                              msg.receiver_id ===
                                userId
                              ? 'font-bold'
                              : 'font-semibold'
                            }`}
                            style={{
                              color: '#062850',
                            }}
                          >
                            {msg.topic}
                          </p>
                        </div>

                        <div className="flex
                        items-center gap-2
                        flex-shrink-0">
                          {!msg.is_read &&
                            msg.receiver_id ===
                              userId && (
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
                          text-gray-400
                          whitespace-nowrap">
                            {formatTime(
                              msg.created_at
                            )}
                          </span>
                        </div>
                      </div>

                      {!isExpanded && (
                        <p className="text-sm
                        text-gray-500 truncate">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0
                  border-t border-gray-100">
                    <div className="pt-4">
                      <p className="text-sm
                      text-gray-700 leading-relaxed
                      whitespace-pre-line">
                        {msg.content}
                      </p>

                      <div className="flex
                      items-center justify-between
                      mt-4 pt-4 border-t
                      border-gray-50">
                        <span className="text-xs
                        text-gray-400">
                          {new Date(
                            msg.created_at
                          ).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>

                        {!isSent && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowCompose(true)
                              setSelectedRole(
                                msg.recipient_role ||
                                  'customer_care'
                              )
                              setSubject(
                                `Re: ${msg.topic}`
                              )
                            }}
                            variant="outline"
                            className="text-xs
                            font-medium rounded-lg
                            px-3 py-2"
                            style={{
                              borderColor:
                                '#062850',
                              color: '#062850',
                            }}
                          >
                            <ArrowRight
                              className="w-3 h-3
                              mr-1 rotate-180"
                            />
                            Reply
                          </Button>
                        )}
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