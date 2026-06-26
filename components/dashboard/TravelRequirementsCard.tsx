'use client'

import { useState } from 'react'
import {
  FileText,
  Globe,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

interface TravelRequirement {
  from_country: string
  to_country: string
  visa_type: string
  visa_cost: string | null
  processing_time: string | null
  required_documents: string[]
  additional_notes: string | null
  source_url: string | null
  last_verified: string | null
}

interface Props {
  requirements: TravelRequirement | null
  toCountry: string
  fromCountry: string
  compact?: boolean
}

export default function TravelRequirementsCard({
  requirements,
  toCountry,
  fromCountry,
  compact = false,
}: Props) {
  const [expanded, setExpanded] = useState(
    !compact
  )

  if (!requirements) {
    return (
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: '#FFFBEB',
          borderColor: '#FCD34D',
        }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle
            className="w-4 h-4 flex-shrink-0
            mt-0.5"
            style={{ color: '#D97706' }}
          />
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: '#92400E' }}
            >
              Travel requirements not found
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: '#92400E' }}
            >
              We don&apos;t have specific
              requirements for {fromCountry} →{' '}
              {toCountry} yet. Please check the
              official embassy website of{' '}
              {toCountry} for visa requirements.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: '#97C3E0',
        backgroundColor: '#F0F6FB',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3
        flex items-center justify-between
        transition-colors hover:bg-blue-50/50"
      >
        <div className="flex items-center gap-2">
          <Globe
            className="w-4 h-4 flex-shrink-0"
            style={{ color: '#497296' }}
          />
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: '#062850' }}
            >
              Travel to {toCountry}
            </p>
            <p
              className="text-xs"
              style={{ color: '#497296' }}
            >
              {requirements.visa_type}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp
            className="w-4 h-4 flex-shrink-0"
            style={{ color: '#497296' }}
          />
        ) : (
          <ChevronDown
            className="w-4 h-4 flex-shrink-0"
            style={{ color: '#497296' }}
          />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t"
        style={{ borderColor: '#97C3E0' }}>

          {/* Key Info */}
          <div className="grid grid-cols-2
          gap-3 pt-3 mb-4">
            {requirements.visa_cost && (
              <div className="flex items-start
              gap-2">
                <DollarSign
                  className="w-3.5 h-3.5
                  flex-shrink-0 mt-0.5"
                  style={{ color: '#497296' }}
                />
                <div>
                  <p className="text-xs
                  text-gray-500">
                    Visa Cost
                  </p>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: '#062850' }}
                  >
                    {requirements.visa_cost}
                  </p>
                </div>
              </div>
            )}
            {requirements.processing_time && (
              <div className="flex items-start
              gap-2">
                <Clock
                  className="w-3.5 h-3.5
                  flex-shrink-0 mt-0.5"
                  style={{ color: '#497296' }}
                />
                <div>
                  <p className="text-xs
                  text-gray-500">
                    Processing Time
                  </p>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: '#062850' }}
                  >
                    {requirements.processing_time}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Required Documents */}
          {requirements.required_documents
            ?.length > 0 && (
            <div className="mb-3">
              <p
                className="text-xs font-bold
                uppercase tracking-wider mb-2"
                style={{ color: '#497296' }}
              >
                Required Documents
              </p>
              <div className="space-y-1.5">
                {requirements.required_documents.map(
                  (doc, i) => (
                    <div
                      key={i}
                      className="flex items-start
                      gap-2"
                    >
                      <CheckCircle
                        className="w-3.5 h-3.5
                        flex-shrink-0 mt-0.5"
                        style={{
                          color: '#16A34A',
                        }}
                      />
                      <p className="text-xs
                      text-gray-700">
                        {doc}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {requirements.additional_notes && (
            <div
              className="rounded-lg p-3 mb-3"
              style={{
                backgroundColor:
                  'rgba(255,255,255,0.7)',
              }}
            >
              <p
                className="text-xs font-semibold
                mb-1"
                style={{ color: '#062850' }}
              >
                Important Notes
              </p>
              <p className="text-xs text-gray-600
              leading-relaxed">
                {requirements.additional_notes}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div
            className="rounded-lg p-3 mb-3 border"
            style={{
              backgroundColor: '#FFFBEB',
              borderColor: '#FCD34D',
            }}
          >
            <p
              className="text-xs leading-relaxed"
              style={{ color: '#92400E' }}
            >
              ⚠ <strong>Disclaimer:</strong>{' '}
              Requirements shown are for guidance
              only and may change. Always verify
              with the official embassy or
              consulate of {toCountry} in your
              country before applying.
            </p>
          </div>

          {/* Source + Last Verified */}
          <div className="flex items-center
          justify-between">
            {requirements.source_url && (
              <a
                href={requirements.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1
                text-xs font-medium hover:underline"
                style={{ color: '#497296' }}
              >
                <ExternalLink className="w-3 h-3" />
                Official Source
              </a>
            )}
            {requirements.last_verified && (
              <p className="text-xs text-gray-400">
                Last verified:{' '}
                {new Date(
                  requirements.last_verified
                ).toLocaleDateString('en-GB', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  )
}