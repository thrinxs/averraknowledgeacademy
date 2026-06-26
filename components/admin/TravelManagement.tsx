'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Globe,
  Plus,
  X,
  Loader2,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Save,
  Search,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TravelRequirement {
  id: string
  from_country: string
  to_country: string
  visa_type: string
  visa_cost: string | null
  processing_time: string | null
  required_documents: string[]
  additional_notes: string | null
  source_url: string | null
  last_verified: string | null
  is_active: boolean
}

interface Props {
  requirements: TravelRequirement[]
}

const inputClass = `w-full px-3 py-2 rounded-lg border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

export default function TravelManagement({
  requirements: initialRequirements,
}: Props) {
  const [requirements, setRequirements] =
    useState(initialRequirements)
  const [search, setSearch] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [expandedId, setExpandedId] =
    useState<string | null>(null)
  const [editingId, setEditingId] =
    useState<string | null>(null)
  const [showCreate, setShowCreate] =
    useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editError, setEditError] = useState('')
  const [createError, setCreateError] = useState('')
  const router = useRouter()

  // Edit form state
  const [editFromCountry, setEditFromCountry] =
    useState('')
  const [editToCountry, setEditToCountry] =
    useState('')
  const [editVisaType, setEditVisaType] =
    useState('')
  const [editVisaCost, setEditVisaCost] =
    useState('')
  const [editProcessingTime, setEditProcessingTime] =
    useState('')
  const [editDocs, setEditDocs] =
    useState<string[]>([])
  const [editNotes, setEditNotes] = useState('')
  const [editSourceUrl, setEditSourceUrl] =
    useState('')
  const [editLastVerified, setEditLastVerified] =
    useState('')
  const [editNewDoc, setEditNewDoc] = useState('')

  // Create form state
  const [createFromCountry, setCreateFromCountry] =
    useState('Global')
  const [createToCountry, setCreateToCountry] =
    useState('')
  const [createVisaType, setCreateVisaType] =
    useState('')
  const [createVisaCost, setCreateVisaCost] =
    useState('')
  const [
    createProcessingTime,
    setCreateProcessingTime,
  ] = useState('')
  const [createDocs, setCreateDocs] =
    useState<string[]>([])
  const [createNotes, setCreateNotes] = useState('')
  const [createSourceUrl, setCreateSourceUrl] =
    useState('')
  const [createNewDoc, setCreateNewDoc] =
    useState('')

  // Get unique countries for filters
  const fromCountries = [
    ...new Set(
      requirements.map((r) => r.from_country)
    ),
  ].sort()
  const toCountries = [
    ...new Set(
      requirements.map((r) => r.to_country)
    ),
  ].sort()

  const filtered = requirements.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      r.from_country.toLowerCase().includes(q) ||
      r.to_country.toLowerCase().includes(q) ||
      r.visa_type.toLowerCase().includes(q)
    const matchFrom =
      !filterFrom || r.from_country === filterFrom
    const matchTo =
      !filterTo || r.to_country === filterTo
    return matchSearch && matchFrom && matchTo
  })

  const startEdit = (r: TravelRequirement) => {
    setEditingId(r.id)
    setExpandedId(r.id)
    setEditFromCountry(r.from_country)
    setEditToCountry(r.to_country)
    setEditVisaType(r.visa_type)
    setEditVisaCost(r.visa_cost || '')
    setEditProcessingTime(r.processing_time || '')
    setEditDocs(r.required_documents || [])
    setEditNotes(r.additional_notes || '')
    setEditSourceUrl(r.source_url || '')
    setEditLastVerified(
      r.last_verified
        ? r.last_verified.split('T')[0]
        : new Date().toISOString().split('T')[0]
    )
    setEditNewDoc('')
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleSave = async (id: string) => {
    if (!editVisaType.trim()) {
      setEditError('Visa type is required.')
      return
    }

    setSaving(true)
    setEditError('')

    try {
      const updates = {
        from_country: editFromCountry.trim(),
        to_country: editToCountry.trim(),
        visa_type: editVisaType.trim(),
        visa_cost: editVisaCost.trim() || null,
        processing_time:
          editProcessingTime.trim() || null,
        required_documents: editDocs,
        additional_notes: editNotes.trim() || null,
        source_url: editSourceUrl.trim() || null,
        last_verified: editLastVerified || null,
      }

      const { error } = await supabase
        .from('travel_requirements')
        .update(updates)
        .eq('id', id)

      if (error) {
        setEditError(error.message)
        return
      }

      setRequirements((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...updates } : r
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

  const handleCreate = async () => {
    if (!createToCountry.trim()) {
      setCreateError('Destination country is required.')
      return
    }
    if (!createVisaType.trim()) {
      setCreateError('Visa type is required.')
      return
    }

    setCreating(true)
    setCreateError('')

    try {
      const newReq = {
        from_country:
          createFromCountry.trim() || 'Global',
        to_country: createToCountry.trim(),
        visa_type: createVisaType.trim(),
        visa_cost: createVisaCost.trim() || null,
        processing_time:
          createProcessingTime.trim() || null,
        required_documents: createDocs,
        additional_notes:
          createNotes.trim() || null,
        source_url:
          createSourceUrl.trim() || null,
        last_verified: new Date()
          .toISOString()
          .split('T')[0],
        is_active: true,
      }

      const { data, error } = await supabase
        .from('travel_requirements')
        .insert(newReq)
        .select()
        .single()

      if (error) {
        setCreateError(error.message)
        return
      }

      setRequirements((prev) => [data, ...prev])
      setShowCreate(false)
      setCreateFromCountry('Global')
      setCreateToCountry('')
      setCreateVisaType('')
      setCreateVisaCost('')
      setCreateProcessingTime('')
      setCreateDocs([])
      setCreateNotes('')
      setCreateSourceUrl('')
      setCreateNewDoc('')
      router.refresh()
    } catch {
      setCreateError(
        'Failed to create. Please try again.'
      )
    } finally {
      setCreating(false)
    }
  }

  const toggleActive = async (
    id: string,
    isActive: boolean
  ) => {
    await supabase
      .from('travel_requirements')
      .update({ is_active: !isActive })
      .eq('id', id)

    setRequirements((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, is_active: !isActive }
          : r
      )
    )
  }

  const deleteRequirement = async (id: string) => {
    if (
      !confirm(
        'Delete this travel requirement? This cannot be undone.'
      )
    )
      return

    await supabase
      .from('travel_requirements')
      .delete()
      .eq('id', id)

    setRequirements((prev) =>
      prev.filter((r) => r.id !== id)
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
            Travel Requirements
          </h1>
          <p className="text-gray-500 text-sm">
            {requirements.length} country pair
            {requirements.length === 1 ? '' : 's'}{' '}
            — shown to students alongside their
            scholarship matches
          </p>
        </div>
        <Button
          onClick={() => {
            setShowCreate(!showCreate)
            setEditingId(null)
          }}
          className="flex items-center gap-2
          text-white font-semibold px-5 py-4
          rounded-xl"
          style={{ backgroundColor: '#062850' }}
        >
          {showCreate ? (
            <>
              <X className="w-4 h-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add
              Requirement
            </>
          )}
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-6 mb-6">
          <h3
            className="font-bold mb-4"
            style={{ color: '#062850' }}
          >
            Add Travel Requirement
          </h3>
          <div className="grid grid-cols-1
          md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                From Country
                <span className="text-gray-400
                font-normal ml-1">
                  (use "Global" as fallback)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Nigeria or Global"
                value={createFromCountry}
                onChange={(e) =>
                  setCreateFromCountry(
                    e.target.value
                  )
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                To Country *
              </label>
              <input
                type="text"
                placeholder="e.g. United Kingdom"
                value={createToCountry}
                onChange={(e) =>
                  setCreateToCountry(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                Visa Type *
              </label>
              <input
                type="text"
                placeholder="e.g. Student Visa (Tier 4)"
                value={createVisaType}
                onChange={(e) =>
                  setCreateVisaType(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                Visa Cost
              </label>
              <input
                type="text"
                placeholder="e.g. £490"
                value={createVisaCost}
                onChange={(e) =>
                  setCreateVisaCost(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                Processing Time
              </label>
              <input
                type="text"
                placeholder="e.g. 3-8 weeks"
                value={createProcessingTime}
                onChange={(e) =>
                  setCreateProcessingTime(
                    e.target.value
                  )
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                Source URL
              </label>
              <input
                type="text"
                placeholder="https://official-embassy-link.com"
                value={createSourceUrl}
                onChange={(e) =>
                  setCreateSourceUrl(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div className="md:col-span-2">
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                Additional Notes
              </label>
              <textarea
                placeholder="Important information for applicants..."
                value={createNotes}
                onChange={(e) =>
                  setCreateNotes(e.target.value)
                }
                rows={3}
                className={`${inputClass} resize-none`}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div className="md:col-span-2">
              <label
                className="block text-xs
                font-semibold mb-1"
                style={{ color: '#062850' }}
              >
                Required Documents
              </label>
              <div className="space-y-1 mb-2">
                {createDocs.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-start
                    gap-2"
                  >
                    <span className="text-xs
                    text-gray-600 flex-1 pt-0.5">
                      {i + 1}. {doc}
                    </span>
                    <button
                      onClick={() =>
                        setCreateDocs((prev) =>
                          prev.filter(
                            (_, idx) => idx !== i
                          )
                        )
                      }
                      className="text-gray-400
                      hover:text-red-500
                      flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add document requirement..."
                  value={createNewDoc}
                  onChange={(e) =>
                    setCreateNewDoc(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (createNewDoc.trim()) {
                        setCreateDocs((prev) => [
                          ...prev,
                          createNewDoc.trim(),
                        ])
                        setCreateNewDoc('')
                      }
                    }
                  }}
                  className={inputClass}
                  style={{ borderColor: '#D1D5DB' }}
                />
                <button
                  onClick={() => {
                    if (createNewDoc.trim()) {
                      setCreateDocs((prev) => [
                        ...prev,
                        createNewDoc.trim(),
                      ])
                      setCreateNewDoc('')
                    }
                  }}
                  className="px-3 py-2 rounded-lg
                  text-white text-xs font-medium
                  flex-shrink-0"
                  style={{
                    backgroundColor: '#497296',
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {createError && (
            <p className="text-red-500 text-xs mt-3">
              {createError}
            </p>
          )}

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="text-white font-semibold
              px-6 py-4 rounded-xl"
              style={{ backgroundColor: '#062850' }}
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4
                  mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Requirement'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search
            className="absolute left-3 top-1/2
            -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search countries or visa type..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2.5
            rounded-xl border text-sm
            focus:outline-none"
            style={{ borderColor: '#D1D5DB' }}
          />
        </div>
        <select
          value={filterFrom}
          onChange={(e) =>
            setFilterFrom(e.target.value)
          }
          className="px-3 py-2.5 rounded-xl border
          text-sm focus:outline-none"
          style={{ borderColor: '#D1D5DB' }}
        >
          <option value="">All From Countries</option>
          {fromCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterTo}
          onChange={(e) =>
            setFilterTo(e.target.value)
          }
          className="px-3 py-2.5 rounded-xl border
          text-sm focus:outline-none"
          style={{ borderColor: '#D1D5DB' }}
        >
          <option value="">All To Countries</option>
          {toCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 mb-3">
        Showing {filtered.length} of{' '}
        {requirements.length} requirements
      </p>

      {/* Requirements List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-12 text-center">
          <Globe
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: '#497296' }}
          />
          <p
            className="font-semibold"
            style={{ color: '#062850' }}
          >
            No requirements found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const isExpanded = expandedId === r.id
            const isEditing = editingId === r.id

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl
                border border-gray-100 overflow-hidden"
              >
                {/* Row Header */}
                <div
                  onClick={() => {
                    if (!isEditing) {
                      setExpandedId(
                        isExpanded ? null : r.id
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
                  gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg
                      flex items-center justify-center
                      flex-shrink-0"
                      style={{
                        backgroundColor: r.is_active
                          ? '#F0F6FB'
                          : '#F3F4F6',
                      }}
                    >
                      <Globe
                        className="w-4 h-4"
                        style={{
                          color: r.is_active
                            ? '#497296'
                            : '#9CA3AF',
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm
                        font-semibold"
                        style={{ color: '#062850' }}
                      >
                        {r.from_country} →{' '}
                        {r.to_country}
                      </p>
                      <p className="text-xs
                      text-gray-500">
                        {r.visa_type}
                        {r.visa_cost
                          ? ` · ${r.visa_cost}`
                          : ''}
                        {r.processing_time
                          ? ` · ${r.processing_time}`
                          : ''}
                        {' · '}
                        {r.required_documents
                          ?.length || 0}{' '}
                        documents
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center
                  gap-2 flex-shrink-0">
                    {!isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startEdit(r)
                        }}
                        className="p-1.5 rounded-lg
                        text-gray-400
                        hover:text-[#062850]
                        hover:bg-blue-50
                        transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleActive(
                          r.id,
                          r.is_active
                        )
                      }}
                      className="text-xs font-medium
                      px-2 py-1 rounded-lg border
                      transition-all"
                      style={{
                        borderColor: r.is_active
                          ? '#16A34A'
                          : '#D1D5DB',
                        color: r.is_active
                          ? '#16A34A'
                          : '#DC2626',
                      }}
                    >
                      {r.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </button>
                    {!isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteRequirement(r.id)
                        }}
                        className="p-1.5 rounded-lg
                        text-gray-400
                        hover:text-red-500
                        hover:bg-red-50
                        transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

                {/* Expanded View */}
                {isExpanded && !isEditing && (
                  <div className="px-5 pb-5
                  border-t border-gray-100">
                    <div className="pt-4 space-y-3">
                      <div className="grid
                      grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Visa Cost
                          </p>
                          <p
                            className="font-medium"
                            style={{
                              color: '#062850',
                            }}
                          >
                            {r.visa_cost || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Processing Time
                          </p>
                          <p
                            className="font-medium"
                            style={{
                              color: '#062850',
                            }}
                          >
                            {r.processing_time ||
                              '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Last Verified
                          </p>
                          <p
                            className="font-medium"
                            style={{
                              color: '#062850',
                            }}
                          >
                            {r.last_verified
                              ? new Date(
                                  r.last_verified
                                ).toLocaleDateString(
                                  'en-GB',
                                  {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  }
                                )
                              : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-0.5">
                            Source
                          </p>
                          {r.source_url ? (
                            <a
                              href={r.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs
                              hover:underline"
                              style={{
                                color: '#497296',
                              }}
                            >
                              Official Link
                            </a>
                          ) : (
                            <p className="text-xs
                            text-gray-400">
                              No source
                            </p>
                          )}
                        </div>
                      </div>

                      {r.required_documents
                        ?.length > 0 && (
                        <div>
                          <p className="text-xs
                          text-gray-500 mb-1">
                            Required Documents (
                            {
                              r.required_documents
                                .length
                            }
                            )
                          </p>
                          <div className="space-y-1">
                            {r.required_documents.map(
                              (doc, i) => (
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
                                      color:
                                        '#16A34A',
                                    }}
                                  />
                                  {doc}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {r.additional_notes && (
                        <div
                          className="rounded-lg p-3"
                          style={{
                            backgroundColor:
                              '#FFFBEB',
                          }}
                        >
                          <p
                            className="text-xs
                            font-semibold mb-1"
                            style={{
                              color: '#92400E',
                            }}
                          >
                            Important Notes
                          </p>
                          <p className="text-xs
                          text-gray-600">
                            {r.additional_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Edit Mode */}
                {isEditing && (
                  <div className="px-5 pb-5
                  border-t border-gray-100">
                    <div className="pt-4 space-y-4">
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
                            From Country
                          </label>
                          <input
                            type="text"
                            value={editFromCountry}
                            onChange={(e) =>
                              setEditFromCountry(
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
                            To Country
                          </label>
                          <input
                            type="text"
                            value={editToCountry}
                            onChange={(e) =>
                              setEditToCountry(
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
                            Visa Type *
                          </label>
                          <input
                            type="text"
                            value={editVisaType}
                            onChange={(e) =>
                              setEditVisaType(
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
                            Visa Cost
                          </label>
                          <input
                            type="text"
                            value={editVisaCost}
                            onChange={(e) =>
                              setEditVisaCost(
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
                            Processing Time
                          </label>
                          <input
                            type="text"
                            value={editProcessingTime}
                            onChange={(e) =>
                              setEditProcessingTime(
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
                            Last Verified Date
                          </label>
                          <input
                            type="date"
                            value={editLastVerified}
                            onChange={(e) =>
                              setEditLastVerified(
                                e.target.value
                              )
                            }
                            className={inputClass}
                            style={{
                              borderColor: '#D1D5DB',
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label
                            className="block text-xs
                            font-semibold mb-1"
                            style={{
                              color: '#062850',
                            }}
                          >
                            Source URL
                          </label>
                          <input
                            type="text"
                            value={editSourceUrl}
                            onChange={(e) =>
                              setEditSourceUrl(
                                e.target.value
                              )
                            }
                            className={inputClass}
                            style={{
                              borderColor: '#D1D5DB',
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label
                            className="block text-xs
                            font-semibold mb-1"
                            style={{
                              color: '#062850',
                            }}
                          >
                            Additional Notes
                          </label>
                          <textarea
                            value={editNotes}
                            onChange={(e) =>
                              setEditNotes(
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

                        {/* Edit Documents */}
                        <div className="md:col-span-2">
                          <label
                            className="block text-xs
                            font-semibold mb-1"
                            style={{
                              color: '#062850',
                            }}
                          >
                            Required Documents
                          </label>
                          <div className="space-y-1
                          mb-2">
                            {editDocs.map(
                              (doc, i) => (
                                <div
                                  key={i}
                                  className="flex
                                  items-start gap-2"
                                >
                                  <span className="text-xs
                                  text-gray-600
                                  flex-1 pt-0.5">
                                    {i + 1}. {doc}
                                  </span>
                                  <button
                                    onClick={() =>
                                      setEditDocs(
                                        (prev) =>
                                          prev.filter(
                                            (
                                              _,
                                              idx
                                            ) =>
                                              idx !==
                                              i
                                          )
                                      )
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
                              placeholder="Add document..."
                              value={editNewDoc}
                              onChange={(e) =>
                                setEditNewDoc(
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === 'Enter'
                                ) {
                                  e.preventDefault()
                                  if (
                                    editNewDoc.trim()
                                  ) {
                                    setEditDocs(
                                      (prev) => [
                                        ...prev,
                                        editNewDoc.trim(),
                                      ]
                                    )
                                    setEditNewDoc('')
                                  }
                                }
                              }}
                              className={inputClass}
                              style={{
                                borderColor:
                                  '#D1D5DB',
                              }}
                            />
                            <button
                              onClick={() => {
                                if (
                                  editNewDoc.trim()
                                ) {
                                  setEditDocs(
                                    (prev) => [
                                      ...prev,
                                      editNewDoc.trim(),
                                    ]
                                  )
                                  setEditNewDoc('')
                                }
                              }}
                              className="px-3 py-2
                              rounded-lg text-white
                              text-xs flex-shrink-0"
                              style={{
                                backgroundColor:
                                  '#497296',
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {editError && (
                        <p className="text-red-500
                        text-xs">
                          {editError}
                        </p>
                      )}

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
                            handleSave(r.id)
                          }
                          disabled={saving}
                          className="px-4 py-2
                          rounded-lg text-sm
                          font-semibold text-white
                          disabled:opacity-60"
                          style={{
                            backgroundColor:
                              '#062850',
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
      )}
    </div>
  )
}