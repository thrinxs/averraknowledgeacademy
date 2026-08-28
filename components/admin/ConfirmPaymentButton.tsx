'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import ConfirmPaymentModal from '@/components/admin/ConfirmPaymentModal'

interface Props {
  enrollmentId: string
  billingAmount: number
  currency: string
  parentEmail: string
}

export default function ConfirmPaymentButton({
  enrollmentId,
  billingAmount,
  currency,
  parentEmail,
}: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2
        rounded-xl text-sm font-semibold text-white
        transition-all hover:opacity-90"
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
