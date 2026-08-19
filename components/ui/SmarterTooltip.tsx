'use client'

import { useState, useRef, useEffect } from 'react'

export default function SmarterTooltip({
  children,
}: {
  children: React.ReactNode
}) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (visible && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setPosition(rect.top < 200 ? 'bottom' : 'top')
    }
  }, [visible])

  return (
    <span
      ref={ref}
      className="relative inline-block cursor-help"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {/* Underline indicator */}
      <span
        className="border-b-2 border-dashed pb-0.5
        transition-colors duration-200"
        style={{ borderColor: '#97C3E0' }}
      >
        {children}
      </span>

      {/* Tooltip */}
      {visible && (
        <span
          className={`absolute z-50 left-1/2 -translate-x-1/2
          w-80 pointer-events-none
          ${position === 'top'
            ? 'bottom-full mb-3'
            : 'top-full mt-3'
          }`}
        >
          {/* Arrow */}
          <span
            className={`absolute left-1/2 -translate-x-1/2
            w-3 h-3 rotate-45
            ${position === 'top'
              ? '-bottom-1.5'
              : '-top-1.5'
            }`}
            style={{ backgroundColor: '#062850' }}
          />

          {/* Box */}
          <span
            className="block rounded-2xl p-5 text-left
            shadow-2xl"
            style={{ backgroundColor: '#062850' }}
          >
            <span className="block text-sm font-bold
            text-white mb-2 flex items-center gap-2">
              <span>✨</span>
              What is &ldquo;Smarter Than Einstein&rdquo;?
            </span>
            <span className="block text-xs text-blue-200
            leading-relaxed mb-3">
              Einstein famously said:{' '}
              <span className="italic text-blue-100">
                &ldquo;If you can&apos;t explain it simply,
                you don&apos;t understand it well enough.&rdquo;
              </span>
            </span>
            <span className="block text-xs text-blue-200
            leading-relaxed mb-3">
              <span className="font-semibold text-white">
                Smarter Than Einstein
              </span>{' '}
              is a book written by our founder — a
              practical guide that teaches learners how to
              truly study, deeply understand what they are
              learning, and confidently explain it to others.
            </span>
            <span className="block text-xs font-semibold"
            style={{ color: '#97C3E0' }}>
              Understand. Don&apos;t Memorise.
            </span>
          </span>
        </span>
      )}
    </span>
  )
}
