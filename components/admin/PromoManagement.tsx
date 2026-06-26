'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Tag,
  Plus,
  X,
  Loader2,
  Trash2,
  Pencil,
  Check,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props {
  promos: any[]
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

function formatPrice(amount: number) {
  return '₦' + amount.toLocaleString('en-NG')
}

export default function PromoManagement({
  promos: initialPromos,
}: Props) {
  const [promos, setPromos] =
    useState(initialPromos)
  const [showCreate, setShowCreate] =
    useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  // Create form state
  const [code, setCode] = useState('')
  const [description, setDescription] =
    useState('')
  const [discountType, setDiscountType] =
    useState('percentage')
  const [discountValue, setDiscountValue] =
    useState('')
  const [packages, setPackages] = useState<
    string[]
  >(['basic', 'standard', 'premium'])
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [requiresVerification, setRequiresVerification] =
    useState(false)
  const [approvedUsers, setApprovedUsers] = useState<
    { name: string; email: string }[]
  >([])
  const [newApprovedName, setNewApprovedName] =
    useState('')
  const [newApprovedEmail, setNewApprovedEmail] =
    useState('')

  // Edit state
  const [editingId, setEditingId] =
    useState<string | null>(null)
  const [editCode, setEditCode] = useState('')
  const [editDescription, setEditDescription] =
    useState('')
  const [editDiscountType, setEditDiscountType] =
    useState('percentage')
  const [editDiscountValue, setEditDiscountValue] =
    useState('')
  const [editPackages, setEditPackages] =
    useState<string[]>([])
  const [editMaxUses, setEditMaxUses] =
    useState('')
  const [editExpiresAt, setEditExpiresAt] =
    useState('')
  const [editRequiresVerification, setEditRequiresVerification] =
    useState(false)
  const [editApprovedUsers, setEditApprovedUsers] =
    useState<{ name: string; email: string }[]>([])
  const [editNewApprovedName, setEditNewApprovedName] =
    useState('')
  const [editNewApprovedEmail, setEditNewApprovedEmail] =
    useState('')
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')

  const router = useRouter()

  const togglePackage = (pkg: string) => {
    setPackages((prev) =>
      prev.includes(pkg)
        ? prev.filter((p) => p !== pkg)
        : [...prev, pkg]
    )
  }

  const toggleEditPackage = (pkg: string) => {
    setEditPackages((prev) =>
      prev.includes(pkg)
        ? prev.filter((p) => p !== pkg)
        : [...prev, pkg]
    )
  }

  const startEdit = (promo: any) => {
    setEditingId(promo.id)
    setEditCode(promo.code)
    setEditDescription(promo.description || '')
    setEditDiscountType(promo.discount_type)
    setEditDiscountValue(
      String(promo.discount_value)
    )
    setEditPackages(
      promo.applicable_packages || [
        'basic',
        'standard',
        'premium',
      ]
    )
    setEditMaxUses(
      promo.max_uses ? String(promo.max_uses) : ''
    )
    setEditExpiresAt(
      promo.expires_at
        ? promo.expires_at.split('T')[0]
        : ''
    )
    setEditRequiresVerification(
      promo.requires_verification || false
    )
    setEditApprovedUsers(
      promo.approved_users || []
    )
    setEditNewApprovedName('')
    setEditNewApprovedEmail('')
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleSaveEdit = async () => {
    if (!editCode.trim()) {
      setEditError('Code is required.')
      return
    }
    if (!editDiscountValue) {
      setEditError('Discount value is required.')
      return
    }
    if (editPackages.length === 0) {
      setEditError(
        'Select at least one package.'
      )
      return
    }

    setSaving(true)
    setEditError('')

    try {
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update({
          code: editCode.trim().toUpperCase(),
          description: editDescription.trim(),
          discount_type: editDiscountType,
          discount_value: parseFloat(
            editDiscountValue
          ),
          applicable_packages: editPackages,
          max_uses: editMaxUses
            ? parseInt(editMaxUses)
            : null,
          expires_at: editExpiresAt || null,
          requires_verification:
            editRequiresVerification,
          approved_users: editApprovedUsers,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId)

      if (updateError) {
        if (
          updateError.message.includes('duplicate')
        ) {
          setEditError(
            'A promo code with this name already exists.'
          )
        } else {
          setEditError(updateError.message)
        }
        return
      }

      setPromos((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                code: editCode.trim().toUpperCase(),
                description:
                  editDescription.trim(),
                discount_type: editDiscountType,
                discount_value: parseFloat(
                  editDiscountValue
                ),
                applicable_packages: editPackages,
                max_uses: editMaxUses
                  ? parseInt(editMaxUses)
                  : null,
                expires_at: editExpiresAt || null,
                requires_verification:
                  editRequiresVerification,
                approved_users: editApprovedUsers,
              }
            : p
        )
      )

      setEditingId(null)
      router.refresh()
    } catch {
      setEditError('Failed to update promo code.')
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async () => {
    if (!code.trim()) {
      setError('Code is required.')
      return
    }
    if (!discountValue) {
      setError('Discount value is required.')
      return
    }
    if (packages.length === 0) {
      setError(
        'Select at least one applicable package.'
      )
      return
    }

    setCreating(true)
    setError('')

    try {
      const { data, error: insertError } =
        await supabase
          .from('promo_codes')
          .insert({
            code: code.trim().toUpperCase(),
            description: description.trim(),
            discount_type: discountType,
            discount_value: parseFloat(
              discountValue
            ),
            applicable_packages: packages,
            max_uses: maxUses
              ? parseInt(maxUses)
              : null,
            expires_at: expiresAt || null,
            is_active: true,
            times_used: 0,
            requires_verification:
              requiresVerification,
            approved_users: approvedUsers,
          })
          .select()
          .single()

      if (insertError) {
        if (
          insertError.message.includes('duplicate')
        ) {
          setError(
            'A promo code with this name already exists.'
          )
        } else {
          setError(insertError.message)
        }
        return
      }

      setPromos((prev) => [data, ...prev])
      setShowCreate(false)
      setCode('')
      setDescription('')
      setDiscountValue('')
      setMaxUses('')
      setExpiresAt('')
      setRequiresVerification(false)
      setApprovedUsers([])
      setNewApprovedName('')
      setNewApprovedEmail('')
      router.refresh()
    } catch {
      setError('Failed to create promo code.')
    } finally {
      setCreating(false)
    }
  }

  const toggleActive = async (
    id: string,
    isActive: boolean
  ) => {
    await supabase
      .from('promo_codes')
      .update({ is_active: !isActive })
      .eq('id', id)

    setPromos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, is_active: !isActive }
          : p
      )
    )
  }

  const deletePromo = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this promo code?'
      )
    )
      return

    await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id)

    setPromos((prev) =>
      prev.filter((p) => p.id !== id)
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
            Promo Codes
          </h1>
          <p className="text-gray-500 text-sm">
            {promos.length} total promo codes
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
              <Plus className="w-4 h-4" /> New Code
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
            Create Promo Code
          </h3>
          <div className="grid grid-cols-1
          md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm
                font-semibold mb-2"
                style={{ color: '#062850' }}
              >
                Code
              </label>
              <input
                type="text"
                placeholder="e.g. LAUNCH20"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value.toUpperCase()
                  )
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-sm
                font-semibold mb-2"
                style={{ color: '#062850' }}
              >
                Description
              </label>
              <input
                type="text"
                placeholder="e.g. Launch discount"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-sm
                font-semibold mb-2"
                style={{ color: '#062850' }}
              >
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              >
                <option value="percentage">
                  Percentage (%)
                </option>
                <option value="fixed">
                  Fixed Amount (₦)
                </option>
              </select>
            </div>
            <div>
              <label
                className="block text-sm
                font-semibold mb-2"
                style={{ color: '#062850' }}
              >
                Discount Value
              </label>
              <input
                type="number"
                placeholder={
                  discountType === 'percentage'
                    ? 'e.g. 10'
                    : 'e.g. 5000'
                }
                value={discountValue}
                onChange={(e) =>
                  setDiscountValue(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-sm
                font-semibold mb-2"
                style={{ color: '#062850' }}
              >
                Max Uses
                <span className="text-gray-400
                font-normal ml-1">
                  (leave empty for unlimited)
                </span>
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={maxUses}
                onChange={(e) =>
                  setMaxUses(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>
            <div>
              <label
                className="block text-sm
                font-semibold mb-2"
                style={{ color: '#062850' }}
              >
                Expires At
                <span className="text-gray-400
                font-normal ml-1">
                  (optional)
                </span>
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) =>
                  setExpiresAt(e.target.value)
                }
                className={inputClass}
                style={{ borderColor: '#D1D5DB' }}
              />
            </div>

            {/* Applicable Packages */}
            <div className="md:col-span-2">
              <label
                className="block text-sm
                font-semibold mb-2"
                style={{ color: '#062850' }}
              >
                Applicable Packages
              </label>
              <div className="flex gap-3">
                {[
                  'basic',
                  'standard',
                  'premium',
                ].map((pkg) => (
                  <button
                    key={pkg}
                    type="button"
                    onClick={() =>
                      togglePackage(pkg)
                    }
                    className="px-4 py-2
                    rounded-xl text-sm
                    font-medium border-2
                    transition-all capitalize"
                    style={{
                      borderColor:
                        packages.includes(pkg)
                          ? '#062850'
                          : '#E5E7EB',
                      backgroundColor:
                        packages.includes(pkg)
                          ? '#06285010'
                          : 'white',
                      color: packages.includes(pkg)
                        ? '#062850'
                        : '#6B7280',
                    }}
                  >
                    {packages.includes(pkg) && '✓ '}
                    {pkg}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center
              gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresVerification}
                  onChange={(e) =>
                    setRequiresVerification(
                      e.target.checked
                    )
                  }
                  className="w-4 h-4
                  accent-[#062850]"
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: '#062850' }}
                  >
                    Requires Verification
                  </p>
                  <p className="text-xs
                  text-gray-500">
                    Only approved names and emails
                    can use this code
                  </p>
                </div>
              </label>
            </div>

            {/* Approved Users — Create */}
            {requiresVerification && (
              <div className="md:col-span-2">
                <label
                  className="block text-sm
                  font-semibold mb-2"
                  style={{ color: '#062850' }}
                >
                  Approved Users
                </label>
                <p className="text-xs
                text-gray-500 mb-3">
                  Only these exact name + email
                  combinations can use this code.
                  Name matching is case-sensitive.
                </p>

                {approvedUsers.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {approvedUsers.map(
                      (user, i) => (
                        <div
                          key={i}
                          className="flex items-center
                          justify-between px-3 py-2
                          rounded-xl text-sm border"
                          style={{
                            backgroundColor:
                              '#F0F6FB',
                            borderColor: '#97C3E0',
                          }}
                        >
                          <div>
                            <span
                              className="font-medium"
                              style={{
                                color: '#062850',
                              }}
                            >
                              {user.name}
                            </span>
                            <span className="text-gray-500 ml-2">
                              {user.email}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setApprovedUsers(
                                (prev) =>
                                  prev.filter(
                                    (_, idx) =>
                                      idx !== i
                                  )
                              )
                            }
                            className="text-gray-400
                            hover:text-red-500
                            transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1
                sm:grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Full name (case-sensitive)"
                    value={newApprovedName}
                    onChange={(e) =>
                      setNewApprovedName(
                        e.target.value
                      )
                    }
                    className={inputClass}
                    style={{ borderColor: '#D1D5DB' }}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newApprovedEmail}
                    onChange={(e) =>
                      setNewApprovedEmail(
                        e.target.value
                      )
                    }
                    className={inputClass}
                    style={{ borderColor: '#D1D5DB' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      newApprovedName.trim() &&
                      newApprovedEmail.trim()
                    ) {
                      setApprovedUsers((prev) => [
                        ...prev,
                        {
                          name: newApprovedName.trim(),
                          email:
                            newApprovedEmail.trim(),
                        },
                      ])
                      setNewApprovedName('')
                      setNewApprovedEmail('')
                    }
                  }}
                  className="flex items-center
                  gap-2 px-4 py-2 rounded-xl
                  text-sm font-medium text-white
                  transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#497296',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Approved User
                </button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-3">
              {error}
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
                'Create Promo Code'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Promos List */}
      {promos.length === 0 ? (
        <div className="bg-white rounded-2xl border
        border-gray-100 p-12 text-center">
          <Tag
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: '#497296' }}
          />
          <p
            className="font-semibold"
            style={{ color: '#062850' }}
          >
            No promo codes yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl border
              border-gray-100 overflow-hidden"
            >
              {/* Editing Mode */}
              {editingId === promo.id ? (
                <div className="p-5">
                  <h3
                    className="font-bold mb-4 text-sm"
                    style={{ color: '#062850' }}
                  >
                    Edit Promo Code
                  </h3>
                  <div className="grid grid-cols-1
                  md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Code
                      </label>
                      <input
                        type="text"
                        value={editCode}
                        onChange={(e) =>
                          setEditCode(
                            e.target.value.toUpperCase()
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
                        style={{ color: '#062850' }}
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(
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
                        style={{ color: '#062850' }}
                      >
                        Discount Type
                      </label>
                      <select
                        value={editDiscountType}
                        onChange={(e) =>
                          setEditDiscountType(
                            e.target.value
                          )
                        }
                        className={inputClass}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      >
                        <option value="percentage">
                          Percentage (%)
                        </option>
                        <option value="fixed">
                          Fixed Amount (₦)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Discount Value
                      </label>
                      <input
                        type="number"
                        value={editDiscountValue}
                        onChange={(e) =>
                          setEditDiscountValue(
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
                        style={{ color: '#062850' }}
                      >
                        Max Uses
                      </label>
                      <input
                        type="number"
                        placeholder="Leave empty for unlimited"
                        value={editMaxUses}
                        onChange={(e) =>
                          setEditMaxUses(
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
                        style={{ color: '#062850' }}
                      >
                        Expires At
                      </label>
                      <input
                        type="date"
                        value={editExpiresAt}
                        onChange={(e) =>
                          setEditExpiresAt(
                            e.target.value
                          )
                        }
                        className={inputClass}
                        style={{
                          borderColor: '#D1D5DB',
                        }}
                      />
                    </div>

                    {/* Edit Packages */}
                    <div className="md:col-span-2">
                      <label
                        className="block text-xs
                        font-semibold mb-1"
                        style={{ color: '#062850' }}
                      >
                        Applicable Packages
                      </label>
                      <div className="flex gap-3">
                        {[
                          'basic',
                          'standard',
                          'premium',
                        ].map((pkg) => (
                          <button
                            key={pkg}
                            type="button"
                            onClick={() =>
                              toggleEditPackage(pkg)
                            }
                            className="px-4 py-2
                            rounded-xl text-sm
                            font-medium border-2
                            transition-all capitalize"
                            style={{
                              borderColor:
                                editPackages.includes(
                                  pkg
                                )
                                  ? '#062850'
                                  : '#E5E7EB',
                              backgroundColor:
                                editPackages.includes(
                                  pkg
                                )
                                  ? '#06285010'
                                  : 'white',
                              color:
                                editPackages.includes(
                                  pkg
                                )
                                  ? '#062850'
                                  : '#6B7280',
                            }}
                          >
                            {editPackages.includes(
                              pkg
                            ) && '✓ '}
                            {pkg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Edit Verification Toggle */}
                    <div className="md:col-span-2">
                      <label className="flex
                      items-center gap-3
                      cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            editRequiresVerification
                          }
                          onChange={(e) =>
                            setEditRequiresVerification(
                              e.target.checked
                            )
                          }
                          className="w-4 h-4
                          accent-[#062850]"
                        />
                        <div>
                          <p
                            className="text-sm
                            font-semibold"
                            style={{
                              color: '#062850',
                            }}
                          >
                            Requires Verification
                          </p>
                          <p className="text-xs
                          text-gray-500">
                            Only approved names and
                            emails can use this code
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Edit Approved Users */}
                    {editRequiresVerification && (
                      <div className="md:col-span-2">
                        <label
                          className="block text-xs
                          font-semibold mb-2"
                          style={{
                            color: '#062850',
                          }}
                        >
                          Approved Users
                        </label>

                        {editApprovedUsers.length >
                          0 && (
                          <div className="space-y-2
                          mb-3">
                            {editApprovedUsers.map(
                              (user, i) => (
                                <div
                                  key={i}
                                  className="flex
                                  items-center
                                  justify-between
                                  px-3 py-2
                                  rounded-xl
                                  text-sm border"
                                  style={{
                                    backgroundColor:
                                      '#F0F6FB',
                                    borderColor:
                                      '#97C3E0',
                                  }}
                                >
                                  <div>
                                    <span
                                      className="font-medium"
                                      style={{
                                        color:
                                          '#062850',
                                      }}
                                    >
                                      {user.name}
                                    </span>
                                    <span className="text-gray-500 ml-2 text-xs">
                                      {user.email}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditApprovedUsers(
                                        (prev) =>
                                          prev.filter(
                                            (_, idx) =>
                                              idx !== i
                                          )
                                      )
                                    }
                                    className="text-gray-400
                                    hover:text-red-500"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        <div className="grid
                        grid-cols-1 sm:grid-cols-2
                        gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Full name"
                            value={
                              editNewApprovedName
                            }
                            onChange={(e) =>
                              setEditNewApprovedName(
                                e.target.value
                              )
                            }
                            className={inputClass}
                            style={{
                              borderColor: '#D1D5DB',
                            }}
                          />
                          <input
                            type="email"
                            placeholder="Email address"
                            value={
                              editNewApprovedEmail
                            }
                            onChange={(e) =>
                              setEditNewApprovedEmail(
                                e.target.value
                              )
                            }
                            className={inputClass}
                            style={{
                              borderColor: '#D1D5DB',
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              editNewApprovedName.trim() &&
                              editNewApprovedEmail.trim()
                            ) {
                              setEditApprovedUsers(
                                (prev) => [
                                  ...prev,
                                  {
                                    name: editNewApprovedName.trim(),
                                    email:
                                      editNewApprovedEmail.trim(),
                                  },
                                ]
                              )
                              setEditNewApprovedName(
                                ''
                              )
                              setEditNewApprovedEmail(
                                ''
                              )
                            }
                          }}
                          className="flex items-center
                          gap-2 px-4 py-2 rounded-xl
                          text-xs font-medium
                          text-white"
                          style={{
                            backgroundColor:
                              '#497296',
                          }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Approved User
                        </button>
                      </div>
                    )}
                  </div>

                  {editError && (
                    <p className="text-red-500
                    text-xs mt-3">
                      {editError}
                    </p>
                  )}

                  <div className="flex justify-end
                  gap-3 mt-4">
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      className="px-5 py-3
                      rounded-xl font-medium"
                      style={{
                        borderColor: '#D1D5DB',
                        color: '#6B7280',
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="text-white
                      font-semibold px-5 py-3
                      rounded-xl"
                      style={{
                        backgroundColor: '#062850',
                      }}
                    >
                      {saving ? (
                        <>
                          <Loader2
                            className="w-4 h-4
                            mr-2 animate-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check
                            className="w-4 h-4 mr-2"
                          />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Display Mode */
                <div className="p-5 flex
                items-center justify-between
                flex-wrap gap-4">
                  <div className="flex items-center
                  gap-4">
                    <div
                      className="w-10 h-10 rounded-xl
                      flex items-center justify-center"
                      style={{
                        backgroundColor:
                          promo.is_active
                            ? '#F0FDF4'
                            : '#F3F4F6',
                      }}
                    >
                      <Tag
                        className="w-5 h-5"
                        style={{
                          color: promo.is_active
                            ? '#16A34A'
                            : '#9CA3AF',
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex
                      items-center gap-2 flex-wrap">
                        <p
                          className="text-sm
                          font-bold"
                          style={{
                            color: '#062850',
                          }}
                        >
                          {promo.code}
                        </p>
                        <span
                          className="px-2 py-0.5
                          rounded-full text-xs
                          font-semibold"
                          style={{
                            backgroundColor:
                              promo.discount_type ===
                              'percentage'
                                ? '#EFF6FF'
                                : '#F0FDF4',
                            color:
                              promo.discount_type ===
                              'percentage'
                                ? '#2563EB'
                                : '#16A34A',
                          }}
                        >
                          {promo.discount_type ===
                          'percentage'
                            ? `${promo.discount_value}%`
                            : formatPrice(
                                promo.discount_value
                              )}
                        </span>
                        {promo.requires_verification && (
                          <span
                            className="flex
                            items-center gap-1
                            px-2 py-0.5 rounded-full
                            text-xs font-semibold"
                            style={{
                              backgroundColor:
                                '#FEF2F2',
                              color: '#DC2626',
                            }}
                          >
                            <ShieldCheck
                              className="w-3 h-3"
                            />
                            Verified Only
                          </span>
                        )}
                      </div>
                      <p className="text-xs
                      text-gray-500 mt-0.5">
                        {promo.description ||
                          'No description'}{' '}
                        · Used {promo.times_used}
                        {promo.max_uses
                          ? ` / ${promo.max_uses}`
                          : ''}{' '}
                        times · Packages:{' '}
                        {promo.applicable_packages?.join(
                          ', '
                        )}
                        {promo.expires_at && (
                          <>
                            {' '}· Expires:{' '}
                            {new Date(
                              promo.expires_at
                            ).toLocaleDateString(
                              'en-GB'
                            )}
                          </>
                        )}
                        {promo.requires_verification &&
                          promo.approved_users
                            ?.length > 0 && (
                          <>
                            {' '}·{' '}
                            {
                              promo.approved_users
                                .length
                            }{' '}
                            approved user
                            {promo.approved_users
                              .length === 1
                              ? ''
                              : 's'}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center
                  gap-2">
                    <button
                      onClick={() =>
                        startEdit(promo)
                      }
                      className="p-1.5 rounded-lg
                      text-gray-400
                      hover:text-[#062850]
                      hover:bg-blue-50
                      transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        toggleActive(
                          promo.id,
                          promo.is_active
                        )
                      }
                      className="px-3 py-1.5
                      rounded-lg text-xs
                      font-medium border
                      transition-all"
                      style={{
                        borderColor:
                          promo.is_active
                            ? '#16A34A'
                            : '#D1D5DB',
                        color: promo.is_active
                          ? '#16A34A'
                          : '#6B7280',
                      }}
                    >
                      {promo.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </button>
                    <button
                      onClick={() =>
                        deletePromo(promo.id)
                      }
                      className="p-1.5 rounded-lg
                      text-gray-400
                      hover:text-red-500
                      hover:bg-red-50
                      transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}