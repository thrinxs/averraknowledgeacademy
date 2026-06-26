'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
  Save,
  History,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  matches: any[]
  scholarships: any[]
}

const inputClass = `w-full px-3 py-2 rounded-lg border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

export default function MatchVerification({
  matches: initialMatches,
  scholarships,
}: Props) {
  const [matches, setMatches] =
    useState(initialMatches)
  const [expandedId, setExpandedId] =
    useState<string | null>(null)
  const [editingId, setEditingId] =
    useState<string | null>(null)
  const [verifying, setVerifying] =
    useState<string | null>(null)
  const [saving, setSaving] =
    useState<string | null>(null)
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'verified'
  >('pending')
  const router = useRouter()

  // Edit form state
  const [editScholarshipId, setEditScholarshipId] =
    useState('')
  const [editMatchReason, setEditMatchReason] =
    useState('')
  const [editAdminNotes, setEditAdminNotes] =
    useState('')
  const [editNotes, setEditNotes] = useState('')

  // Scholarship edit fields
  const [editName, setEditName] = useState('')
  const [editDeadline, setEditDeadline] =
    useState('')
  const [editLink, setEditLink] = useState('')
  const [editDescription, setEditDescription] =
    useState('')
  const [editEligibility, setEditEligibility] =
    useState('')

  const [editError, setEditError] = useState('')

  const filtered = matches.filter((m) => {
    if (filter === 'pending') return !m.is_verified
    if (filter === 'verified') return m.is_verified
    return true
  })

  const pendingCount = matches.filter(
    (m) => !m.is_verified
  ).length
  const verifiedCount = matches.filter(
    (m) => m.is_verified
  ).length

  const startEdit = (match: any) => {
    const s = match.scholarship
    setEditingId(match.id)
    setEditScholarshipId(match.scholarship_id)
    setEditMatchReason(match.match_reason || '')
    setEditAdminNotes(match.admin_notes || '')
    setEditNotes('')
    setEditName(s?.name || '')
    setEditDeadline(
      s?.deadline
        ? s.deadline.split('T')[0]
        : ''
    )
    setEditLink(s?.link || '')
    setEditDescription(s?.description || '')
    setEditEligibility(
      s?.eligibility_summary || ''
    )
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleSaveEdit = async (match: any) => {
    setSaving(match.id)
    setEditError('')

    try {
      const scholarshipEdits: any = {}

      const s = match.scholarship

      if (editName !== s?.name)
        scholarshipEdits.name = editName
      if (editLink !== s?.link)
        scholarshipEdits.link = editLink
      if (editDescription !== s?.description)
        scholarshipEdits.description =
          editDescription
      if (
        editEligibility !== s?.eligibility_summary
      )
        scholarshipEdits.eligibility_summary =
          editEligibility
      if (
        editDeadline &&
        editDeadline !== s?.deadline?.split('T')[0]
      )
        scholarshipEdits.deadline = editDeadline

      const response = await fetch(
        '/api/admin/edit-match',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matchId: match.id,
            newScholarshipId:
              editScholarshipId !==
              match.scholarship_id
                ? editScholarshipId
                : undefined,
            scholarshipEdits,
            matchReason:
              editMatchReason !== match.match_reason
                ? editMatchReason
                : undefined,
            adminNotes:
              editAdminNotes !== match.admin_notes
                ? editAdminNotes
                : undefined,
            editNotes,
          }),
        }
      )

      const result = await response.json()

      if (!result.success) {
        setEditError(
          result.error || 'Failed to save changes.'
        )
        return
      }

      // Update local state
      setMatches((prev) =>
        prev.map((m) =>
          m.id === match.id
            ? {
                ...m,
                was_edited: true,
                match_reason: editMatchReason,
                admin_notes: editAdminNotes,
                scholarship: {
                  ...m.scholarship,
                  name: editName,
                  link: editLink,
                  description: editDescription,
                  eligibility_summary:
                    editEligibility,
                  deadline: editDeadline,
                },
              }
            : m
        )
      )

      setEditingId(null)
      router.refresh()
    } catch {
      setEditError(
        'Something went wrong. Please try again.'
      )
    } finally {
      setSaving(null)
    }
  }

  const handleVerify = async (matchId: string) => {
    setVerifying(matchId)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      await supabase
        .from('scholarship_matches')
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
          verified_by: user?.id || null,
          status: 'verified',
        })
        .eq('id', matchId)

      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? {
                ...m,
                is_verified: true,
                status: 'verified',
              }
            : m
        )
      )

      const match = matches.find(
        (m) => m.id === matchId
      )

      if (match) {
        const userMatches = matches.filter(
          (m) => m.user_id === match.user_id
        )
        const allVerified = userMatches.every(
          (m) => m.id === matchId || m.is_verified
        )

        if (allVerified) {
          await supabase
            .from('notifications')
            .insert({
              user_id: match.user_id,
              type: 'matches',
              title:
                'Your Matches Have Been Verified!',
              message:
                'Our team has manually verified ' +
                'all your scholarship matches. ' +
                'They are confirmed active and ' +
                'suitable for your profile.',
              is_read: false,
              link: '/dashboard/matches',
            })

          await supabase
            .from('messages')
            .insert({
              receiver_id: match.user_id,
              sender_id: null,
              sender_name: 'Averra Team',
              sender_role: 'admin',
              recipient_role:
                'scholarship_advisor',
              topic:
                'Scholarship Matches Verified',
              content:
                'Great news! All 5 of your ' +
                'scholarship matches have been ' +
                'manually verified by our team.',
              is_read: false,
            })

          // Send verified email
          const { data: verifiedProfile } =
            await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', match.user_id)
              .single()

          const { data: verifiedPrefs } =
            await supabase
              .from('scholarship_preferences')
              .select('selected_package')
              .eq('user_id', match.user_id)
              .single()

          if (verifiedProfile?.email) {
            await fetch(
              '/api/email/send-verified',
              {
                method: 'POST',
                headers: {
                  'Content-Type':
                    'application/json',
                },
                body: JSON.stringify({
                  to: verifiedProfile.email,
                  name:
                    verifiedProfile.full_name ||
                    'Student',
                  packageName:
                    verifiedPrefs?.selected_package ||
                    'Basic',
                }),
              }
            )
          }
        }
      }

      router.refresh()
    } catch (err) {
      console.error('Verify error:', err)
    } finally {
      setVerifying(null)
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
            Match Verification
          </h1>
          <p className="text-gray-500 text-sm">
            Review, edit, and verify scholarship
            matches before students proceed.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          {
            key: 'pending',
            label: 'Pending',
            count: pendingCount,
          },
          {
            key: 'verified',
            label: 'Verified',
            count: verifiedCount,
          },
          {
            key: 'all',
            label: 'All',
            count: matches.length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setFilter(
                tab.key as
                  | 'all'
                  | 'pending'
                  | 'verified'
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
            {tab.label}
            <span
              className="px-1.5 py-0.5 rounded-full
              text-xs font-bold"
              style={{
                backgroundColor:
                  filter === tab.key
                    ? 'rgba(255,255,255,0.2)'
                    : '#E0EEF7',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-12 text-center">
          <ShieldCheck
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: '#497296' }}
          />
          <p
            className="font-semibold"
            style={{ color: '#062850' }}
          >
            {filter === 'pending'
              ? 'No pending matches'
              : 'No matches found'}
          </p>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-3">
        {filtered.map((match) => {
          const s = match.scholarship
          const p = match.profile
          const isExpanded =
            expandedId === match.id
          const isEditing =
            editingId === match.id

          return (
            <div
              key={match.id}
              className="bg-white rounded-2xl
              border border-gray-100 overflow-hidden"
            >
              {/* Row Header */}
              <div
                onClick={() => {
                  if (!isEditing) {
                    setExpandedId(
                      isExpanded ? null : match.id
                    )
                  }
                }}
                className={`p-5 transition-colors
                ${!isEditing
                  ? 'cursor-pointer hover:bg-gray-50/50'
                  : ''
                }`}
              >
                <div className="flex items-center
                justify-between">
                  <div className="flex items-center
                  gap-4">
                    {match.is_verified ? (
                      <CheckCircle
                        className="w-5 h-5
                        flex-shrink-0"
                        style={{
                          color: '#16A34A',
                        }}
                      />
                    ) : (
                      <Clock
                        className="w-5 h-5
                        flex-shrink-0"
                        style={{
                          color: '#D97706',
                        }}
                      />
                    )}
                    <div>
                      <div className="flex
                      items-center gap-2">
                        <p
                          className="text-sm
                          font-semibold"
                          style={{
                            color: '#062850',
                          }}
                        >
                          {s?.name || 'Unknown'}
                        </p>
                        {match.was_edited && (
                          <span
                            className="flex
                            items-center gap-1
                            px-2 py-0.5 rounded-full
                            text-xs font-medium"
                            style={{
                              backgroundColor:
                                '#EFF6FF',
                              color: '#2563EB',
                            }}
                          >
                            <History
                              className="w-3 h-3"
                            />
                            Edited
                          </span>
                        )}
                      </div>
                      <p className="text-xs
                      text-gray-500">
                        {p?.full_name ||
                          'Unknown'}{' '}
                        · {p?.email || ''} ·
                        Score:{' '}
                        {match.match_score}/100
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center
                  gap-2">
                    {!isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startEdit(match)
                          setExpandedId(match.id)
                        }}
                        className="p-1.5 rounded-lg
                        text-gray-400
                        hover:text-[#062850]
                        hover:bg-blue-50
                        transition-all"
                        title="Edit match"
                      >
                        <Pencil
                          className="w-4 h-4"
                        />
                      </button>
                    )}

                    {!match.is_verified &&
                      !isEditing && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVerify(match.id)
                        }}
                        disabled={
                          verifying === match.id
                        }
                        className="text-white
                        text-xs font-medium px-4
                        py-2 rounded-lg
                        disabled:opacity-60"
                        style={{
                          backgroundColor:
                            '#16A34A',
                        }}
                      >
                        {verifying ===
                          match.id ? (
                          <Loader2
                            className="w-3 h-3
                            animate-spin"
                          />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    )}

                    {!isEditing && (
                      isExpanded ? (
                        <ChevronUp
                          className="w-4 h-4
                          text-gray-400"
                        />
                      ) : (
                        <ChevronDown
                          className="w-4 h-4
                          text-gray-400"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded — View Mode */}
              {isExpanded && !isEditing && s && (
                <div className="px-5 pb-5
                border-t border-gray-100">
                  <div className="pt-4 grid
                  grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        Country
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#062850' }}
                      >
                        {s.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        University
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#062850' }}
                      >
                        {s.university || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        Funding
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#062850' }}
                      >
                        {s.funding_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        Deadline
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#062850' }}
                      >
                        {s.deadline
                          ? new Date(
                              s.deadline
                            ).toLocaleDateString(
                              'en-GB'
                            )
                          : 'Rolling'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        Match Reason
                      </p>
                      <p className="text-sm
                      text-gray-600">
                        {match.match_reason || '—'}
                      </p>
                    </div>
                    {match.admin_notes && (
                      <div className="col-span-2">
                        <p className="text-xs
                        text-gray-500 mb-0.5">
                          Admin Notes
                        </p>
                        <p className="text-sm
                        text-gray-600">
                          {match.admin_notes}
                        </p>
                      </div>
                    )}
                    {match.was_edited && (
                      <div
                        className="col-span-2
                        rounded-xl p-3 border"
                        style={{
                          backgroundColor:
                            '#EFF6FF',
                          borderColor: '#93C5FD',
                        }}
                      >
                        <p
                          className="text-xs
                          font-medium flex
                          items-center gap-1"
                          style={{
                            color: '#2563EB',
                          }}
                        >
                          <History
                            className="w-3 h-3"
                          />
                          This match was edited
                          by admin on{' '}
                          {new Date(
                            match.edited_at
                          ).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </p>
                        {match.edit_notes && (
                          <p
                            className="text-xs
                            mt-1"
                            style={{
                              color: '#2563EB',
                            }}
                          >
                            Note: {match.edit_notes}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="col-span-2">
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        Link
                      </p>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm
                        hover:underline break-all"
                        style={{
                          color: '#497296',
                        }}
                      >
                        {s.link}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Mode */}
              {isEditing && (
                <div className="px-5 pb-5
                border-t border-gray-100">
                  <div className="pt-4 space-y-4">

                    <div
                      className="rounded-xl p-3
                      border mb-2"
                      style={{
                        backgroundColor: '#FFFBEB',
                        borderColor: '#FCD34D',
                      }}
                    >
                      <p
                        className="text-xs
                        font-medium"
                        style={{
                          color: '#92400E',
                        }}
                      >
                        ⚠ Editing this match will
                        notify the student via
                        notification, message,
                        and email.
                      </p>
                    </div>

                    {/* Swap Scholarship */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Swap Scholarship
                      </label>
                      <select
                        value={editScholarshipId}
                        onChange={(e) =>
                          setEditScholarshipId(
                            e.target.value
                          )
                        }
                        className={inputClass}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      >
                        {scholarships.map((sch) => (
                          <option
                            key={sch.id}
                            value={sch.id}
                          >
                            {sch.name} —{' '}
                            {sch.country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Scholarship Name */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Scholarship Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                        className={inputClass}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={editDeadline}
                        onChange={(e) =>
                          setEditDeadline(
                            e.target.value
                          )
                        }
                        className={inputClass}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Link */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Application Link
                      </label>
                      <input
                        type="text"
                        value={editLink}
                        onChange={(e) =>
                          setEditLink(e.target.value)
                        }
                        className={inputClass}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Description
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(
                            e.target.value
                          )
                        }
                        rows={3}
                        className={`${inputClass}
                        resize-none`}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Eligibility */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Eligibility Summary
                      </label>
                      <textarea
                        value={editEligibility}
                        onChange={(e) =>
                          setEditEligibility(
                            e.target.value
                          )
                        }
                        rows={2}
                        className={`${inputClass}
                        resize-none`}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Match Reason */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Match Reason
                        <span
                          className="text-gray-400
                          font-normal ml-1"
                        >
                          (shown to student)
                        </span>
                      </label>
                      <textarea
                        value={editMatchReason}
                        onChange={(e) =>
                          setEditMatchReason(
                            e.target.value
                          )
                        }
                        rows={2}
                        className={`${inputClass}
                        resize-none`}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Admin Notes
                        <span
                          className="text-gray-400
                          font-normal ml-1"
                        >
                          (internal only)
                        </span>
                      </label>
                      <textarea
                        value={editAdminNotes}
                        onChange={(e) =>
                          setEditAdminNotes(
                            e.target.value
                          )
                        }
                        rows={2}
                        className={`${inputClass}
                        resize-none`}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Edit Notes */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Reason for Edit
                        <span
                          className="text-gray-400
                          font-normal ml-1"
                        >
                          (saved to edit history)
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Updated deadline, swapped better match..."
                        value={editNotes}
                        onChange={(e) =>
                          setEditNotes(
                            e.target.value
                          )
                        }
                        className={inputClass}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {editError && (
                      <p className="text-red-500
                      text-xs">
                        {editError}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex
                    justify-end gap-3 pt-2">
                      <Button
                        onClick={cancelEdit}
                        variant="outline"
                        className="px-4 py-2
                        rounded-lg text-sm
                        font-medium"
                        style={{
                          borderColor: '#D1D5DB',
                          color: '#6B7280',
                        }}
                      >
                        <X className="w-4 h-4
                        mr-1" />
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          handleSaveEdit(match)
                        }
                        disabled={
                          saving === match.id
                        }
                        className="px-4 py-2
                        rounded-lg text-sm
                        font-semibold text-white
                        disabled:opacity-60"
                        style={{
                          backgroundColor:
                            '#062850',
                        }}
                      >
                        {saving === match.id ? (
                          <>
                            <Loader2
                              className="w-4 h-4
                              mr-1 animate-spin"
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save
                              className="w-4 h-4
                              mr-1"
                            />
                            Save & Notify Student
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
    </div>
  )
}