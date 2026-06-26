import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  isSubmitting?: boolean
  canSubmit?: boolean
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isSubmitting = false,
  canSubmit = true,
}: FormNavigationProps) {
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1
  const isDisabled = isSubmitting || (isLastStep && !canSubmit)

  return (
    <div className="flex items-center justify-between
    mt-8 pt-6 border-t border-gray-100">

      {/* Back Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep}
        className="flex items-center gap-2 px-6 py-5
        rounded-xl font-medium transition-all duration-300
        disabled:opacity-0 disabled:pointer-events-none"
        style={{
          borderColor: '#062850',
          color: '#062850',
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {/* Next / Submit Button */}
      <Button
        type="button"
        onClick={onNext}
        disabled={isDisabled}
        className="flex items-center gap-2 px-8 py-5
        rounded-xl font-semibold text-white
        transition-all duration-300
        hover:opacity-90 hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100"
        style={{
          backgroundColor: isDisabled
            ? '#94A3B8'
            : '#062850',
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : isLastStep ? (
          <>
            Create My Account
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

    </div>
  )
}