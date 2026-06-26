import { CheckCircle, X } from 'lucide-react'

export default function WhatYouWillReceive() {
  const rows = [
    {
      feature: '5 Scholarship Matches',
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: 'Detailed Match Report',
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: 'Country & Deadline Info',
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: 'Eligibility Breakdown',
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: 'SOP Review & Modification',
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: 'CV Review & Modification',
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: 'Application Guidance',
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: 'Profile Boosting Coaching',
      basic: false,
      standard: false,
      premium: true,
    },
    {
      feature: 'Interview Preparation',
      basic: false,
      standard: false,
      premium: true,
    },
    {
      feature: 'WhatsApp Advisor Access',
      basic: false,
      standard: false,
      premium: true,
    },
    {
      feature: 'Priority Support',
      basic: false,
      standard: false,
      premium: true,
    },
  ]

  const columns = [
    { key: 'basic', label: 'Basic', color: '#497296' },
    { key: 'standard', label: 'Standard', color: '#325E84' },
    { key: 'premium', label: 'Premium', color: '#062850' },
  ]

  return (
    <section
      className="py-24"
      style={{ backgroundColor: '#F0F6FB' }}
    >
      <div className="max-w-5xl mx-auto px-4
      sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2
            px-4 py-2 rounded-full text-sm font-medium
            text-white mb-4"
            style={{ backgroundColor: '#497296' }}
          >
            What You Will Receive
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold
            mb-4 leading-tight"
            style={{ color: '#062850' }}
          >
            Full Package
            <br />
            <span style={{ color: '#497296' }}>
              Comparison
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-xl
          mx-auto">
            See exactly what is included in each package
            before you decide.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-sm
        border border-gray-100 overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-4 border-b
          border-gray-100">
            <div className="p-6" />
            {columns.map((col) => (
              <div
                key={col.key}
                className="p-6 text-center border-l
                border-gray-100"
              >
                <div
                  className="font-bold text-lg"
                  style={{ color: col.color }}
                >
                  {col.label}
                </div>
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {rows.map((row, index) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4
              border-b border-gray-100 last:border-0
              transition-colors duration-200
              ${index % 2 === 0
                ? 'bg-white'
                : 'bg-gray-50/50'
              }`}
            >
              {/* Feature Name */}
              <div className="p-5 flex items-center">
                <span
                  className="text-sm font-medium"
                  style={{ color: '#062850' }}
                >
                  {row.feature}
                </span>
              </div>

              {/* Basic */}
              <div className="p-5 flex items-center
              justify-center border-l border-gray-100">
                {row.basic ? (
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: '#497296' }}
                  />
                ) : (
                  <X className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Standard */}
              <div className="p-5 flex items-center
              justify-center border-l border-gray-100">
                {row.standard ? (
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: '#325E84' }}
                  />
                ) : (
                  <X className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Premium */}
              <div className="p-5 flex items-center
              justify-center border-l border-gray-100">
                {row.premium ? (
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: '#062850' }}
                  />
                ) : (
                  <X className="w-5 h-5 text-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}