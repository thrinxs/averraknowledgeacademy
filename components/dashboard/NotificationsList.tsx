'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  CheckCheck,
  Trophy,
  CreditCard,
  MessageSquare,
  Info,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  is_read: boolean
  link: string | null
  created_at: string
}

interface Props {
  notifications: Notification[]
  userId: string
}

function getNotifIcon(type: string) {
  switch (type) {
    case 'matches':
      return Trophy
    case 'payment':
      return CreditCard
    case 'message':
      return MessageSquare
    case 'system':
      return Info
    default:
      return Bell
  }
}

function getNotifColor(type: string) {
  switch (type) {
    case 'matches':
      return '#16A34A'
    case 'payment':
      return '#2563EB'
    case 'message':
      return '#497296'
    case 'system':
      return '#D97706'
    default:
      return '#497296'
  }
}

function getNotifBg(type: string) {
  switch (type) {
    case 'matches':
      return '#F0FDF4'
    case 'payment':
      return '#EFF6FF'
    case 'message':
      return '#F0F6FB'
    case 'system':
      return '#FFFBEB'
    default:
      return '#F0F6FB'
  }
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

export default function NotificationsList({
  notifications: initialNotifications,
  userId,
}: Props) {
  const [notifications, setNotifications] =
    useState(initialNotifications)
  const [markingAll, setMarkingAll] = useState(false)
  const router = useRouter()

  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length

  const markAsRead = async (
    notifId: string
  ) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notifId)

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notifId
          ? { ...n, is_read: true }
          : n
      )
    )
  }

  const markAllAsRead = async () => {
    setMarkingAll(true)
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      )

      router.refresh()
    } finally {
      setMarkingAll(false)
    }
  }

  const handleNotifClick = async (
    notif: Notification
  ) => {
    if (!notif.is_read) {
      await markAsRead(notif.id)
    }
    if (notif.link) {
      router.push(notif.link)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center
      justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: '#062850' }}
          >
            Notifications
          </h1>
          <p className="text-gray-500 text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
              : 'All caught up'}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            disabled={markingAll}
            variant="outline"
            className="flex items-center gap-2
            text-sm font-medium rounded-xl
            transition-all duration-200
            hover:scale-105"
            style={{
              borderColor: '#062850',
              color: '#062850',
            }}
          >
            <CheckCheck className="w-4 h-4" />
            {markingAll
              ? 'Marking...'
              : 'Mark all as read'}
          </Button>
        )}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-12 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex
            items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F0F6FB' }}
          >
            <Bell
              className="w-7 h-7"
              style={{ color: '#497296' }}
            />
          </div>
          <p
            className="font-semibold mb-1"
            style={{ color: '#062850' }}
          >
            No notifications yet
          </p>
          <p className="text-gray-500 text-sm">
            You will receive notifications here when
            your matches are ready, verified, or when
            you have new messages.
          </p>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const Icon = getNotifIcon(notif.type)
            const color = getNotifColor(notif.type)
            const bg = getNotifBg(notif.type)

            return (
              <div
                key={notif.id}
                onClick={() =>
                  handleNotifClick(notif)
                }
                className={`bg-white rounded-2xl
                border p-5 transition-all duration-200
                cursor-pointer
                hover:shadow-md hover:-translate-y-0.5
                ${!notif.is_read
                  ? 'border-l-4'
                  : 'border-gray-100'
                }`}
                style={{
                  borderColor: !notif.is_read
                    ? color
                    : undefined,
                  borderLeftColor: !notif.is_read
                    ? color
                    : undefined,
                }}
              >
                <div className="flex items-start
                gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl
                    flex items-center justify-center
                    flex-shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start
                    justify-between gap-2 mb-1">
                      <p
                        className={`text-sm leading-snug
                        ${!notif.is_read
                          ? 'font-bold'
                          : 'font-semibold'
                        }`}
                        style={{ color: '#062850' }}
                      >
                        {notif.title}
                      </p>
                      <div className="flex items-center
                      gap-2 flex-shrink-0">
                        {!notif.is_read && (
                          <span
                            className="w-2 h-2
                            rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: color,
                            }}
                          />
                        )}
                        <span className="text-xs
                        text-gray-400 whitespace-nowrap">
                          {formatTime(notif.created_at)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm
                    text-gray-600 leading-relaxed
                    mb-2">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <div
                        className="flex items-center
                        gap-1 text-xs font-medium"
                        style={{ color }}
                      >
                        View details
                        <ArrowRight
                          className="w-3 h-3"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}