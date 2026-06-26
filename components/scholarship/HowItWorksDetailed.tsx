import {
    ClipboardList,
    CreditCard,
    Search,
    ShieldCheck,
    BellRing,
    Handshake,
  } from 'lucide-react'
  
  export default function HowItWorksDetailed() {
    const steps = [
      {
        icon: ClipboardList,
        step: '01',
        title: 'Fill Your Profile Form',
        description:
          'Complete a detailed multi-step form covering your academic ' +
          'background, the countries you prefer, the degree level and ' +
          'field you want to study, and any special circumstances that ' +
          'may strengthen your application.',
        color: '#497296',
        note: null,
      },
      {
        icon: CreditCard,
        step: '02',
        title: 'Choose Your Package & Pay',
        description:
          'Select the package that best fits your needs — Basic, ' +
          'Standard, or Premium. All packages include 5 scholarship ' +
          'matches. The difference is the level of support and ' +
          'preparation you receive. Payment is processed securely ' +
          'via Paystack.',
        color: '#325E84',
        note: null,
      },
      {
        icon: Search,
        step: '03',
        title: 'We Research & Match',
        description:
          'As soon as payment is confirmed, our matching system ' +
          'searches across thousands of scholarships in 50+ countries ' +
          'and identifies your 5 best matches based on your profile, ' +
          'preferences, and eligibility.',
        color: '#1D4469',
        note: 'Matches are automatically delivered in less than 1 hour after payment.',
      },
      {
        icon: ShieldCheck,
        step: '04',
        title: 'We Manually Verify',
        description:
          'Our team personally reviews every match to confirm accuracy, ' +
          'eligibility, and that the scholarship is current and active ' +
          'before it is finalised for your profile.',
        color: '#062850',
        note: 'Manual verification is completed within 24 hours.',
      },
      {
        icon: BellRing,
        step: '05',
        title: 'You Receive Your Matches',
        description:
          'Once verified, you will receive a notification, an in-app ' +
          'message, and an email confirming that your scholarship ' +
          'matches are ready and verified. You can view the full ' +
          'details in your dashboard.',
        color: '#497296',
        note: null,
      },
      {
        icon: Handshake,
        step: '06',
        title: 'Support Begins',
        description:
          'Depending on your chosen package, our team begins supporting ' +
          'you — from reviewing your SOP and CV, to coaching you through ' +
          'your application, interview preparation, and beyond.',
        color: '#325E84',
        note: null,
      },
    ]
  
    return (
      <section
        className="py-24"
        style={{ backgroundColor: '#F0F6FB' }}
      >
        <div className="max-w-7xl mx-auto px-4
        sm:px-6 lg:px-8">
  
          {/* Header */}
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2
              px-4 py-2 rounded-full text-sm font-medium
              text-white mb-4"
              style={{ backgroundColor: '#497296' }}
            >
              How It Works
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold
              mb-4 leading-tight"
              style={{ color: '#062850' }}
            >
              Six Simple Steps to
              <br />
              <span style={{ color: '#497296' }}>
                Your Scholarship Matches
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl
            mx-auto">
              From filling your profile to receiving verified
              scholarship matches — here is exactly what happens
              at every stage.
            </p>
          </div>
  
          {/* Steps */}
          <div className="relative">
            {/* Vertical Line — desktop */}
            <div
              className="hidden lg:block absolute left-1/2
              -translate-x-1/2 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: '#97C3E0' }}
            />
  
            <div className="space-y-12">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0
                return (
                  <div
                    key={step.step}
                    className={`relative flex flex-col
                    lg:flex-row items-center gap-8
                    ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    {/* Card */}
                    <div className="lg:w-5/12 w-full">
                      <div
                        className="bg-white rounded-2xl p-8
                        shadow-sm border border-gray-100
                        transition-all duration-300
                        hover:shadow-lg hover:-translate-y-1"
                      >
                        {/* Icon + Step */}
                        <div className="flex items-center
                        gap-4 mb-4">
                          <div
                            className="w-14 h-14 rounded-xl
                            flex items-center justify-center
                            flex-shrink-0"
                            style={{
                              backgroundColor: `${step.color}15`,
                            }}
                          >
                            <step.icon
                              className="w-7 h-7"
                              style={{ color: step.color }}
                            />
                          </div>
                          <div
                            className="text-4xl font-bold
                            opacity-20"
                            style={{ color: step.color }}
                          >
                            {step.step}
                          </div>
                        </div>
  
                        <h3
                          className="text-xl font-bold mb-3"
                          style={{ color: '#062850' }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm
                        leading-relaxed">
                          {step.description}
                        </p>
  
                        {/* Timing Note */}
                        {step.note && (
                          <div
                            className="mt-4 px-4 py-2.5
                            rounded-xl text-xs font-medium
                            flex items-center gap-2"
                            style={{
                              backgroundColor: `${step.color}10`,
                              color: step.color,
                            }}
                          >
                            <span className="w-1.5 h-1.5
                            rounded-full bg-green-500
                            flex-shrink-0" />
                            {step.note}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* Center Circle — desktop */}
                    <div className="hidden lg:flex w-2/12
                    items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full
                        flex items-center justify-center
                        text-white font-bold text-sm
                        shadow-lg z-10"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.step}
                      </div>
                    </div>
  
                    {/* Empty side — desktop */}
                    <div className="hidden lg:block lg:w-5/12" />
                  </div>
                )
              })}
            </div>
          </div>
  
        </div>
      </section>
    )
  }