'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Upload,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Props {
  enrollmentId: string
  billingAmount: number
  currency: string
  parentEmail: string
  onClose: () => void
}

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

export default function ConfirmPaymentModal({
  enrollmentId,
  billingAmount,
  currency,
  parentEmail,
  onClose,
}: Props) {
  const [amountReceived, setAmountReceived] = useState(
    String(billingAmount)
  )
  const [discountType, setDiscountType] = useState<
    'none' | 'percentage' | 'fixed'
  >('none')
  const [discountValue, setDiscountValue] = useState('')
  const [notes, setNotes] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const symbol = currency === 'NGN' ? '₦' : '£'

  const discountAmount =
    discountType === 'percentage'
      ? (Number(amountReceived) * Number(discountValue)) / 100
      : discountType === 'fixed'
      ? Number(discountValue)
      : 0

  const finalAmount = Math.max(
    0,
    Number(amountReceived) - discountAmount
  )

  function handleFileSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Receipt must be under 10MB')
      return
    }
    setReceiptFile(file)
    if (file.type.startsWith('image/')) {
      setReceiptPreview(URL.createObjectURL(file))
    } else {
      setReceiptPreview('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('enrollment_id', enrollmentId)
      formData.append('amount_received', amountReceived)
      formData.append('discount_type', discountType)
      formData.append('discount_value', discountValue || '0')
      formData.append('final_amount', String(finalAmount))
      formData.append('notes', notes)
      if (receiptFile) formData.append('receipt', receiptFile)

      const res = await fetch(
        '/api/academy/confirm-payment',
        { method: 'POST', body: formData }
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to confirm payment')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(6,40,80,0.7)' }}>
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>
            Payment Confirmed!
          </h3>
          <p className="text-gray-500 text-sm">
            The enrollment has been activated and the parent has been notified.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(6,40,80,0.7)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl"
        >
          <div>
            <h2 className="font-bold text-lg" style={{ color: '#062850' }}>
              Confirm Payment Received
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {parentEmail}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Amount received */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Amount Received ({symbol})
            </label>
            <input
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              className={inputCls}
              placeholder={String(billingAmount)}
              required
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-400 mt-1">
              Expected: {symbol}{billingAmount.toLocaleString()}
            </p>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Discount Applied
            </label>
            <select
              value={discountType}
              onChange={(e) =>
                setDiscountType(
                  e.target.value as 'none' | 'percentage' | 'fixed'
                )
              }
              className={inputCls}
            >
              <option value="none">No discount</option>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed amount ({symbol})</option>
            </select>
          </div>

          {discountType !== 'none' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {discountType === 'percentage'
                  ? 'Discount Percentage (%)'
                  : `Discount Amount (${symbol})`}
              </label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className={inputCls}
                placeholder={discountType === 'percentage' ? 'e.g. 10' : 'e.g. 50'}
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* Payment summary */}
          <div
            className="rounded-xl p-4 border-2"
            style={{ borderColor: '#497296', backgroundColor: '#F0F6FB' }}
          >
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Payment Summary
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount Received</span>
                <span className="font-semibold" style={{ color: '#062850' }}>
                  {symbol}{Number(amountReceived || 0).toLocaleString()}
                </span>
              </div>
              {discountType !== 'none' && discountValue && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Discount{' '}
                    {discountType === 'percentage'
                      ? `(${discountValue}%)`
                      : '(fixed)'}
                  </span>
                  <span className="font-semibold text-amber-600">
                    -{symbol}{discountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200"
              >
                <span style={{ color: '#062850' }}>Final Amount</span>
                <span style={{ color: '#16A34A' }}>
                  {symbol}{finalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Payment Receipt <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            {receiptPreview ? (
              <div className="relative">
                <Image
                  src={receiptPreview}
                  alt="Receipt"
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setReceiptFile(null)
                    setReceiptPreview('')
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : receiptFile ? (
              <div
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200"
                style={{ backgroundColor: '#F0F6FB' }}
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-sm text-gray-600 truncate">{receiptFile.name}</p>
                <button
                  type="button"
                  onClick={() => setReceiptFile(null)}
                  className="ml-auto"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6
                flex flex-col items-center gap-2 hover:border-[#497296] transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click to upload receipt
                </p>
                <p className="text-xs text-gray-400">
                  Image or PDF, max 10MB
                </p>
              </button>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Admin Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputCls + ' resize-none'}
              placeholder="e.g. Partial payment agreed, remainder due next month..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 text-white font-semibold rounded-xl"
              style={{ backgroundColor: '#16A34A' }}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Confirming...</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2" />Confirm Payment</>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
