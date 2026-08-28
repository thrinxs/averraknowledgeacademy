'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import ConfirmPaymentModal from '@/components/admin/ConfirmPaymentModal'

interface Props {
  enrollmentId: string
  billingAmount: number
  currency: string
  parentEmail: string
  isPaid: boolean
}

export default function EnrollmentDetailClient({
  enrollmentId,
  billingAmount,
  currency,
  parentEmail,
  isPaid,
}: Props) {
  const [showModal, setShowModal] = useState(false)

  if (isPaid) {
    return (
      <div className="p-3 rounded-xl text-sm text-green-700 bg-green-50 text-center font-semibold">
        ✅ Payment Confirmed
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
        style={{ backgroundColor: '#16A34A' }}
      >
        <CheckCircle className="w-4 h-4" />
        Confirm Payment Received
      </button>

      {showModal && (
        <ConfirmPaymentModal
          enrollmentId={enrollmentId}
          billingAmount={billingAmount}
          currency={currency}
          parentEmail={parentEmail}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
