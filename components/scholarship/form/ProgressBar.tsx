import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const stepLabels = [
  'Basic Info',
  'Academic Background',
  'Country Preferences',
  'Course Preferences',
  'Account Creation',
]

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  return (
    <div className="mb-10">

      {/* Step Labels — desktop */}
      <div className="hidden sm:flex items-center
      justify-between mb-4">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div
              key={label}
              className="flex flex-col items-center
              gap-2 flex-1"
            >
              {/* Circle */}
              <div
                className="w-9 h-9 rounded-full flex
                items-center justify-center text-sm
                font-bold transition-all duration-300
                border-2"
                style={{
                  backgroundColor: isCompleted
                    ? '#497296'
                    : isCurrent
                    ? '#062850'
                    : 'white',
                  borderColor: isCompleted
                    ? '#497296'
                    : isCurrent
                    ? '#062850'
                    : '#D1D5DB',
                  color: isCompleted || isCurrent
                    ? 'white'
                    : '#9CA3AF',
                }}
              >
                {isCompleted
                  ? <Check className="w-4 h-4" />
                  : stepNumber
                }
              </div>

              {/* Label */}
              <span
                className="text-xs font-medium
                text-center leading-tight"
                style={{
                  color: isCurrent
                    ? '#062850'
                    : isCompleted
                    ? '#497296'
                    : '#9CA3AF',
                }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Connector Lines — desktop */}
      <div className="hidden sm:flex items-center
      mb-6 -mt-10 px-5">
        {Array.from({ length: totalSteps - 1 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 transition-all
            duration-500 mx-1"
            style={{
              backgroundColor:
                i + 1 < currentStep ? '#497296' : '#E5E7EB',
            }}
          />
        ))}
      </div>

      {/* Mobile — simple text indicator */}
      <div className="sm:hidden flex items-center
      justify-between mb-4">
        <span
          className="text-sm font-semibold"
          style={{ color: '#062850' }}
        >
          Step {currentStep} of {totalSteps}
        </span>
        <span
          className="text-sm"
          style={{ color: '#497296' }}
        >
          {stepLabels[currentStep - 1]}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full
      overflow-hidden">
        <div
          className="h-full rounded-full transition-all
          duration-500"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            backgroundColor: '#497296',
          }}
        />
      </div>

    </div>
  )
}