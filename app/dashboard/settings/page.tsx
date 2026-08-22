'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Bell, Lock, Eye, Globe, Trash2,
  Loader2, CheckCircle, AlertCircle, Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Settings = {
  notification_email: boolean
  notification_inapp: boolean
  profile_visibility: string
  timezone: string
  language: string
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [settings, setSettings] = useState<Settings>({
    notification_email: true,
    notification_inapp: true,
    profile_visibility: 'private',
    timezone: '',
    language: 'en',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Password change
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Email change
  const [newEmail, setNewEmail] = useState('')
  const [changingEmail, setChangingEmail] = useState(false)
  const [emailMsg, setEmailMsg] = useState('')
  const [emailError, setEmailError] = useState('')

  // Delete account
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    setMounted(true)
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)
    setEmail(user.email || '')

    const { data } = await supabase
      .from('profiles')
      .select('notification_email, notification_inapp, profile_visibility, timezone, language')
      .eq('id', user.id)
      .single()

    if (data) setSettings(data as Settings)
  }

  async function handleSaveSettings() {
    setSaving(true)
    setError('')
    const { error: saveError } = await supabase
      .from('profiles')
      .update(settings)
      .eq('id', userId)

    if (saveError) setError('Failed to save settings.')
    else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  async function handleChangePassword() {
    setPasswordError('')
    setPasswordMsg('')
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
      return
    }
    setChangingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setPasswordError(error.message)
    else {
      setPasswordMsg('Password changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setChangingPassword(false)
  }

  async function handleChangeEmail() {
    setEmailError('')
    setEmailMsg('')
    if (!newEmail || !newEmail.includes('@')) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setChangingEmail(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) setEmailError(error.message)
    else setEmailMsg('Verification email sent to ' + newEmail + '. Please check your inbox.')
    setChangingEmail(false)
  }

  if (!mounted) return null

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
          Settings
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your account security, notifications and preferences.
        </p>
      </div>

      {/* Account — Change Email */}
      <Section icon={<Globe className="w-5 h-5" />} title="Email Address">
        <p className="text-sm text-gray-500 mb-4">
          Current email: <span className="font-semibold" style={{ color: '#062850' }}>{email}</span>
        </p>
        <div className="space-y-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email address"
            className={inputClass}
          />
          {emailMsg && (
            <p className="text-green-600 text-xs flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {emailMsg}
            </p>
          )}
          {emailError && (
            <p className="text-red-600 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {emailError}
            </p>
          )}
          <Button
            onClick={handleChangeEmail}
            disabled={changingEmail || !newEmail}
            className="text-white rounded-xl px-6"
            style={{ backgroundColor: '#497296' }}
          >
            {changingEmail
              ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</>
              : 'Change Email'
            }
          </Button>
        </div>
      </Section>

      {/* Account — Change Password */}
      <Section icon={<Lock className="w-5 h-5" />} title="Change Password">
        <div className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className={inputClass}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={inputClass}
          />
          {passwordMsg && (
            <p className="text-green-600 text-xs flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {passwordMsg}
            </p>
          )}
          {passwordError && (
            <p className="text-red-600 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {passwordError}
            </p>
          )}
          <Button
            onClick={handleChangePassword}
            disabled={changingPassword || !newPassword}
            className="text-white rounded-xl px-6"
            style={{ backgroundColor: '#497296' }}
          >
            {changingPassword
              ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Changing...</>
              : 'Change Password'
            }
          </Button>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={<Bell className="w-5 h-5" />} title="Notifications">
        <div className="space-y-4">
          <Toggle
            label="Email Notifications"
            description="Receive updates, match alerts and payment confirmations by email"
            value={settings.notification_email}
            onChange={(v) => setSettings({ ...settings, notification_email: v })}
          />
          <Toggle
            label="In-App Notifications"
            description="Receive notifications inside your dashboard"
            value={settings.notification_inapp}
            onChange={(v) => setSettings({ ...settings, notification_inapp: v })}
          />
        </div>
      </Section>

      {/* Privacy */}
      <Section icon={<Eye className="w-5 h-5" />} title="Privacy">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
            Profile Visibility
          </label>
          <select
            value={settings.profile_visibility}
            onChange={(e) => setSettings({ ...settings, profile_visibility: e.target.value })}
            className={inputClass}
          >
            <option value="private">Private — Only you and Averra staff</option>
            <option value="public">Public — Visible to other users</option>
          </select>
        </div>
      </Section>

      {/* Save Settings */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 text-white font-semibold rounded-xl"
          style={{ backgroundColor: '#062850' }}
        >
          {saving
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : saved
            ? <><CheckCircle className="w-4 h-4" /> Saved!</>
            : <><Save className="w-4 h-4" /> Save Settings</>
          }
        </Button>
        {saved && (
          <p className="text-green-600 text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Settings saved
          </p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border-2 border-red-200 overflow-hidden">
        <div className="px-6 py-4 bg-red-50 flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h2 className="font-bold text-red-700">Danger Zone</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-4">
            Deleting your account is permanent and cannot be undone.
            All your data, enrollments and matches will be lost.
          </p>
          {!showDelete ? (
            <Button
              variant="outline"
              onClick={() => setShowDelete(true)}
              className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
            >
              Delete My Account
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-red-700">
                Type <span className="font-mono bg-red-100 px-1 rounded">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE"
                className={inputClass + ' border-red-200'}
              />
              <div className="flex gap-3">
                <Button
                  disabled={deleteConfirm !== 'DELETE'}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  onClick={() => alert('Account deletion — contact info@averraknowledgeacademy.com')}
                >
                  Permanently Delete Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setShowDelete(false); setDeleteConfirm('') }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

function Section({
  icon, title, children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: '#062850' }}
        >
          {icon}
        </div>
        <h2 className="font-bold text-lg" style={{ color: '#062850' }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Toggle({
  label, description, value, onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl"
      style={{ backgroundColor: '#F0F6FB' }}
    >
      <div>
        <p className="font-semibold text-sm" style={{ color: '#062850' }}>{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
        style={{ backgroundColor: value ? '#497296' : '#D1D5DB' }}
      >
        <div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
          style={{ left: value ? '26px' : '4px' }}
        />
      </button>
    </div>
  )
}
