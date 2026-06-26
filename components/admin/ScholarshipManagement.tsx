'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Search,
  CheckCircle,
  XCircle,
  Pencil,
  X,
  Save,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  scholarships: any[]
}

const inputClass = `w-full px-3 py-2 rounded-lg border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

export default function ScholarshipManagement({
  scholarships: initialScholarships,
}: Props) {
  const [scholarships, setScholarships] =
    useState(initialScholarships)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] =
    useState<string | null>(null)
  const [expandedId, setExpandedId] =
    useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const router = useRouter()

  // Edit form state
  const [editName, setEditName] = useState('')
  const [editUniversity, setEditUniversity] =
    useState('')
  const [editCountry, setEditCountry] = useState('')
  const [editFundingType, setEditFundingType] =
    useState('')
  const [editDeadline, setEditDeadline] =
    useState('')
  const [editLink, setEditLink] = useState('')
  const [editDescription, setEditDescription] =
    useState('')
  const [editEligibility, setEditEligibility] =
    useState('')
  const [editMinCgpa, setEditMinCgpa] = useState('')
  const [editRequiresIelts, setEditRequiresIelts] =
    useState(false)
  const [editDuration, setEditDuration] =
    useState('')
  const [
    editLanguageRequirements,
    setEditLanguageRequirements,
  ] = useState('')
  const [editDocs, setEditDocs] = useState<string[]>(
    []
  )
  const [editSteps, setEditSteps] = useState<
    string[]
  >([])
  const [editLevel, setEditLevel] = useState<
    string[]
  >([])
  const [editFields, setEditFields] = useState<
    string[]
  >([])
  const [editCovers, setEditCovers] = useState<
    string[]
  >([])
  const [newDoc, setNewDoc] = useState('')
  const [newStep, setNewStep] = useState('')
  const [newField, setNewField] = useState('')
  const [newCover, setNewCover] = useState('')

  const DEGREE_LEVELS = [
    'Undergraduate',
    "Bachelor's",
    "Master's",
    'PhD',
    'Postdoctoral',
    'Professional Development',
    'Certificate',
    'Short Course',
    'Any',
  ]

  const filtered = scholarships.filter((s) => {
    const q = search.toLowerCase()
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.country || '').toLowerCase().includes(q) ||
      (s.university || '').toLowerCase().includes(q)
    )
  })

  const activeCount = scholarships.filter(
    (s) => s.is_active
  ).length

  const startEdit = (s: any) => {
    setEditingId(s.id)
    setExpandedId(s.id)
    setEditName(s.name || '')
    setEditUniversity(s.university || '')
    setEditCountry(s.country || '')
    setEditFundingType(s.funding_type || '')
    setEditDeadline(
      s.deadline ? s.deadline.split('T')[0] : ''
    )
    setEditLink(s.link || '')
    setEditDescription(s.description || '')
    setEditEligibility(s.eligibility_summary || '')
    setEditMinCgpa(s.min_cgpa || '')
    setEditRequiresIelts(s.requires_ielts || false)
    setEditDuration(s.duration || '')
    setEditLanguageRequirements(
      s.language_requirements || ''
    )
    setEditDocs(s.required_documents || [])
    setEditSteps(s.application_steps || [])
    setEditLevel(s.level || [])
    setEditFields(s.fields || [])
    setEditCovers(s.covers || [])
    setEditError('')
    setNewDoc('')
    setNewStep('')
    setNewField('')
    setNewCover('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleSave = async (id: string) => {
    if (!editName.trim()) {
      setEditError('Name is required.')
      return
    }
    if (!editCountry.trim()) {
      setEditError('Country is required.')
      return
    }
    if (!editLink.trim()) {
      setEditError('Link is required.')
      return
    }

    setSaving(true)
    setEditError('')

    try {
      const updates = {
        name: editName.trim(),
        university: editUniversity.trim() || null,
        country: editCountry.trim(),
        funding_type: editFundingType.trim(),
        deadline: editDeadline || null,
        link: editLink.trim(),
        description: editDescription.trim(),
        eligibility_summary:
          editEligibility.trim(),
        min_cgpa: editMinCgpa.trim() || null,
        requires_ielts: editRequiresIelts,
        duration: editDuration.trim() || null,
        language_requirements:
          editLanguageRequirements.trim() || null,
        required_documents: editDocs,
        application_steps: editSteps,
        level: editLevel,
        fields: editFields,
        covers: editCovers,
        last_updated: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('scholarships')
        .update(updates)
        .eq('id', id)

      if (error) {
        setEditError(error.message)
        return
      }

      setScholarships((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        )
      )

      setEditingId(null)
      router.refresh()
    } catch {
      setEditError(
        'Failed to save. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (
    id: string,
    isActive: boolean
  ) => {
    await supabase
      .from('scholarships')
      .update({ is_active: !isActive })
      .eq('id', id)

    setScholarships((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, is_active: !isActive }
          : s
      )
    )
  }

  const toggleLevel = (level: string) => {
    setEditLevel((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    )
  }

  const addDoc = () => {
    if (newDoc.trim()) {
      setEditDocs((prev) => [
        ...prev,
        newDoc.trim(),
      ])
      setNewDoc('')
    }
  }

  const removeDoc = (index: number) => {
    setEditDocs((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const addStep = () => {
    if (newStep.trim()) {
      setEditSteps((prev) => [
        ...prev,
        newStep.trim(),
      ])
      setNewStep('')
    }
  }

  const removeStep = (index: number) => {
    setEditSteps((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const addField = () => {
    if (newField.trim()) {
      setEditFields((prev) => [
        ...prev,
        newField.trim(),
      ])
      setNewField('')
    }
  }

  const removeField = (index: number) => {
    setEditFields((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const addCover = () => {
    if (newCover.trim()) {
      setEditCovers((prev) => [
        ...prev,
        newCover.trim(),
      ])
      setNewCover('')
    }
  }

  const removeCover = (index: number) => {
    setEditCovers((prev) =>
      prev.filter((_, i) => i !== index)
    )
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
            Scholarship Database
          </h1>
          <p className="text-gray-500 text-sm">
            {activeCount} active /{' '}
            {scholarships.length} total — edits
            reflect immediately on student
            dashboards
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2
          -translate-y-1/2 w-4 h-4 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name, country, or university..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-11 pr-4 py-3
          rounded-xl border text-sm
          focus:outline-none focus:ring-2"
          style={{ borderColor: '#D1D5DB' }}
        />
      </div>

      {/* Scholarships List */}
      <div className="space-y-3">
        {filtered.map((s) => {
          const isExpanded = expandedId === s.id
          const isEditing = editingId === s.id

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl
              border border-gray-100 overflow-hidden"
            >
              {/* Row Header */}
              <div
                onClick={() => {
                  if (!isEditing) {
                    setExpandedId(
                      isExpanded ? null : s.id
                    )
                  }
                }}
                className={`px-5 py-4 flex items-center
                justify-between
                ${!isEditing
                  ? 'cursor-pointer hover:bg-gray-50/50'
                  : ''
                } transition-colors`}
              >
                <div className="flex items-center
                gap-4 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg
                    flex items-center justify-center
                    flex-shrink-0"
                    style={{
                      backgroundColor: s.is_active
                        ? '#F0FDF4'
                        : '#F3F4F6',
                    }}
                  >
                    <BookOpen
                      className="w-4 h-4"
                      style={{
                        color: s.is_active
                          ? '#16A34A'
                          : '#9CA3AF',
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm
                      font-semibold truncate"
                      style={{ color: '#062850' }}
                    >
                      {s.name}
                    </p>
                    <p className="text-xs
                    text-gray-500">
                      {s.country}
                      {s.university
                        ? ` · ${s.university}`
                        : ''}
                      {' · '}
                      <span
                        style={{
                          color: s.funding_type
                            ?.toLowerCase()
                            .includes('fully')
                            ? '#16A34A'
                            : '#D97706',
                        }}
                      >
                        {s.funding_type}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center
                gap-2 flex-shrink-0">
                  {!isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startEdit(s)
                      }}
                      className="p-1.5 rounded-lg
                      text-gray-400
                      hover:text-[#062850]
                      hover:bg-blue-50
                      transition-all"
                      title="Edit scholarship"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleActive(s.id, s.is_active)
                    }}
                    className="flex items-center
                    gap-1 text-xs font-medium px-2
                    py-1 rounded-lg border
                    transition-all"
                    style={{
                      borderColor: s.is_active
                        ? '#16A34A'
                        : '#D1D5DB',
                      color: s.is_active
                        ? '#16A34A'
                        : '#DC2626',
                    }}
                  >
                    {s.is_active ? (
                      <>
                        <CheckCircle
                          className="w-3 h-3"
                        />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle
                          className="w-3 h-3"
                        />
                        Inactive
                      </>
                    )}
                  </button>
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

              {/* Expanded View Mode */}
              {isExpanded && !isEditing && (
                <div className="px-5 pb-5
                border-t border-gray-100">
                  <div className="pt-4 grid
                  grid-cols-2 gap-4 text-sm">
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
                    <div>
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        Min CGPA
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#062850' }}
                      >
                        {s.min_cgpa || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        IELTS Required
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#062850' }}
                      >
                        {s.requires_ielts
                          ? 'Yes'
                          : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs
                      text-gray-500 mb-0.5">
                        Duration
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#062850' }}
                      >
                        {s.duration || '—'}
                      </p>
                    </div>
                    {s.level?.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-xs
                        text-gray-500 mb-0.5">
                          Degree Levels
                        </p>
                        <p
                          className="font-medium"
                          style={{
                            color: '#062850',
                          }}
                        >
                          {s.level.join(', ')}
                        </p>
                      </div>
                    )}
                    {s.fields?.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-xs
                        text-gray-500 mb-0.5">
                          Fields
                        </p>
                        <p
                          className="font-medium"
                          style={{
                            color: '#062850',
                          }}
                        >
                          {s.fields.join(', ')}
                        </p>
                      </div>
                    )}
                    {s.covers?.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-xs
                        text-gray-500 mb-0.5">
                          Covers
                        </p>
                        <p
                          className="font-medium"
                          style={{
                            color: '#062850',
                          }}
                        >
                          {s.covers.join(', ')}
                        </p>
                      </div>
                    )}
                    {s.description && (
                      <div className="col-span-2">
                        <p className="text-xs
                        text-gray-500 mb-0.5">
                          Description
                        </p>
                        <p className="text-sm
                        text-gray-600 leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    )}
                    {s.eligibility_summary && (
                      <div className="col-span-2">
                        <p className="text-xs
                        text-gray-500 mb-0.5">
                          Eligibility
                        </p>
                        <p className="text-sm
                        text-gray-600">
                          {s.eligibility_summary}
                        </p>
                      </div>
                    )}
                    {s.required_documents?.length >
                      0 && (
                      <div className="col-span-2">
                        <p className="text-xs
                        text-gray-500 mb-1">
                          Required Documents (
                          {s.required_documents
                            .length}
                          )
                        </p>
                        <div className="space-y-1">
                          {s.required_documents.map(
                            (
                              doc: string,
                              i: number
                            ) => (
                              <p
                                key={i}
                                className="text-xs
                                text-gray-600 flex
                                items-start gap-1"
                              >
                                <CheckCircle
                                  className="w-3 h-3
                                  flex-shrink-0
                                  mt-0.5"
                                  style={{
                                    color: '#16A34A',
                                  }}
                                />
                                {doc}
                              </p>
                            )
                          )}
                        </div>
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
                        className="text-xs
                        hover:underline break-all"
                        style={{ color: '#497296' }}
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

                    {/* Warning */}
                    <div
                      className="rounded-xl p-3
                      border"
                      style={{
                        backgroundColor: '#FFFBEB',
                        borderColor: '#FCD34D',
                      }}
                    >
                      <p
                        className="text-xs font-medium"
                        style={{ color: '#92400E' }}
                      >
                        ⚠ Changes saved here will
                        immediately reflect on all
                        student dashboards that have
                        this scholarship matched.
                      </p>
                    </div>

                    {/* Basic Info */}
                    <div className="grid
                    grid-cols-1 md:grid-cols-2
                    gap-4">
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
                        >
                          Scholarship Name *
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) =>
                            setEditName(
                              e.target.value
                            )
                          }
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
                        >
                          University
                        </label>
                        <input
                          type="text"
                          value={editUniversity}
                          onChange={(e) =>
                            setEditUniversity(
                              e.target.value
                            )
                          }
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
                        >
                          Country *
                        </label>
                        <input
                          type="text"
                          value={editCountry}
                          onChange={(e) =>
                            setEditCountry(
                              e.target.value
                            )
                          }
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
                        >
                          Funding Type
                        </label>
                        <select
                          value={editFundingType}
                          onChange={(e) =>
                            setEditFundingType(
                              e.target.value
                            )
                          }
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        >
                          <option value="Fully Funded">
                            Fully Funded
                          </option>
                          <option value="Partially Funded">
                            Partially Funded
                          </option>
                          <option value="Tuition Only">
                            Tuition Only
                          </option>
                          <option value="Stipend Only">
                            Stipend Only
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
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
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
                        >
                          Min CGPA
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 3.0/4.0 or 75%"
                          value={editMinCgpa}
                          onChange={(e) =>
                            setEditMinCgpa(
                              e.target.value
                            )
                          }
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
                        >
                          Duration
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1-2 years"
                          value={editDuration}
                          onChange={(e) =>
                            setEditDuration(
                              e.target.value
                            )
                          }
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs
                          font-semibold mb-1"
                          style={{
                            color: '#062850',
                          }}
                        >
                          Language Requirements
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IELTS 6.5"
                          value={
                            editLanguageRequirements
                          }
                          onChange={(e) =>
                            setEditLanguageRequirements(
                              e.target.value
                            )
                          }
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                      </div>
                    </div>

                    {/* Link */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Application Link *
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

                    {/* IELTS Toggle */}
                    <div className="flex items-center
                    gap-3">
                      <input
                        type="checkbox"
                        id="requires-ielts"
                        checked={editRequiresIelts}
                        onChange={(e) =>
                          setEditRequiresIelts(
                            e.target.checked
                          )
                        }
                        className="w-4 h-4
                        accent-[#062850]"
                      />
                      <label
                        htmlFor="requires-ielts"
                        className="text-sm
                        font-medium cursor-pointer"
                        style={{ color: '#062850' }}
                      >
                        Requires IELTS / English
                        Proficiency
                      </label>
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

                    {/* Degree Levels */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-2"
                        style={{ color: '#062850' }}
                      >
                        Degree Levels
                      </label>
                      <div className="flex flex-wrap
                      gap-2">
                        {DEGREE_LEVELS.map(
                          (level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() =>
                                toggleLevel(level)
                              }
                              className="px-3 py-1
                              rounded-lg text-xs
                              font-medium border-2
                              transition-all"
                              style={{
                                borderColor:
                                  editLevel.includes(
                                    level
                                  )
                                    ? '#062850'
                                    : '#E5E7EB',
                                backgroundColor:
                                  editLevel.includes(
                                    level
                                  )
                                    ? '#06285010'
                                    : 'white',
                                color:
                                  editLevel.includes(
                                    level
                                  )
                                    ? '#062850'
                                    : '#6B7280',
                              }}
                            >
                              {editLevel.includes(
                                level
                              ) && '✓ '}
                              {level}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Fields */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Fields of Study
                      </label>
                      <div className="flex flex-wrap
                      gap-1 mb-2">
                        {editFields.map(
                          (field, i) => (
                            <span
                              key={i}
                              className="flex
                              items-center gap-1
                              px-2 py-1 rounded-lg
                              text-xs"
                              style={{
                                backgroundColor:
                                  '#F0F6FB',
                                color: '#062850',
                              }}
                            >
                              {field}
                              <button
                                onClick={() =>
                                  removeField(i)
                                }
                                className="text-gray-400
                                hover:text-red-500"
                              >
                                <X
                                  className="w-3 h-3"
                                />
                              </button>
                            </span>
                          )
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add field..."
                          value={newField}
                          onChange={(e) =>
                            setNewField(
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addField()
                            }
                          }}
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                        <button
                          onClick={addField}
                          className="px-3 py-2
                          rounded-lg text-white
                          text-xs font-medium"
                          style={{
                            backgroundColor:
                              '#497296',
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Covers */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        What It Covers
                      </label>
                      <div className="flex flex-wrap
                      gap-1 mb-2">
                        {editCovers.map(
                          (cover, i) => (
                            <span
                              key={i}
                              className="flex
                              items-center gap-1
                              px-2 py-1 rounded-lg
                              text-xs"
                              style={{
                                backgroundColor:
                                  '#F0FDF4',
                                color: '#166534',
                              }}
                            >
                              {cover}
                              <button
                                onClick={() =>
                                  removeCover(i)
                                }
                                className="text-gray-400
                                hover:text-red-500"
                              >
                                <X
                                  className="w-3 h-3"
                                />
                              </button>
                            </span>
                          )
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Tuition, Stipend..."
                          value={newCover}
                          onChange={(e) =>
                            setNewCover(
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCover()
                            }
                          }}
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                        <button
                          onClick={addCover}
                          className="px-3 py-2
                          rounded-lg text-white
                          text-xs font-medium"
                          style={{
                            backgroundColor:
                              '#497296',
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Required Documents */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Required Documents
                      </label>
                      <div className="space-y-1 mb-2">
                        {editDocs.map((doc, i) => (
                          <div
                            key={i}
                            className="flex items-start
                            gap-2"
                          >
                            <span className="text-xs
                            text-gray-600 flex-1
                            leading-relaxed pt-0.5">
                              {i + 1}. {doc}
                            </span>
                            <button
                              onClick={() =>
                                removeDoc(i)
                              }
                              className="text-gray-400
                              hover:text-red-500
                              flex-shrink-0"
                            >
                              <Trash2
                                className="w-3.5 h-3.5"
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add document requirement..."
                          value={newDoc}
                          onChange={(e) =>
                            setNewDoc(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addDoc()
                            }
                          }}
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                        <button
                          onClick={addDoc}
                          className="px-3 py-2
                          rounded-lg text-white
                          text-xs font-medium
                          flex-shrink-0"
                          style={{
                            backgroundColor:
                              '#497296',
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Application Steps */}
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Application Steps
                        <span
                          className="text-gray-400
                          font-normal ml-1"
                        >
                          (shown to students)
                        </span>
                      </label>
                      <div className="space-y-1 mb-2">
                        {editSteps.map(
                          (step, i) => (
                            <div
                              key={i}
                              className="flex
                              items-start gap-2"
                            >
                              <span className="text-xs
                              text-gray-600 flex-1
                              leading-relaxed pt-0.5">
                                {i + 1}. {step}
                              </span>
                              <button
                                onClick={() =>
                                  removeStep(i)
                                }
                                className="text-gray-400
                                hover:text-red-500
                                flex-shrink-0"
                              >
                                <Trash2
                                  className="w-3.5 h-3.5"
                                />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add application step..."
                          value={newStep}
                          onChange={(e) =>
                            setNewStep(
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addStep()
                            }
                          }}
                          className={inputClass}
                          style={{
                            borderColor: '#D1D5DB',
                          }}
                        />
                        <button
                          onClick={addStep}
                          className="px-3 py-2
                          rounded-lg text-white
                          text-xs font-medium
                          flex-shrink-0"
                          style={{
                            backgroundColor:
                              '#497296',
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {editError && (
                      <p className="text-red-500
                      text-xs">
                        {editError}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end
                    gap-3 pt-2">
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
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          handleSave(s.id)
                        }
                        disabled={saving}
                        className="px-4 py-2
                        rounded-lg text-sm
                        font-semibold text-white
                        disabled:opacity-60"
                        style={{
                          backgroundColor: '#062850',
                        }}
                      >
                        {saving ? (
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
                            Save Changes
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

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-12 text-center">
          <BookOpen
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: '#497296' }}
          />
          <p
            className="font-semibold"
            style={{ color: '#062850' }}
          >
            No scholarships found
          </p>
        </div>
      )}
    </div>
  )
}