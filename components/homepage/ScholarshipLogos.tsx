export default function ScholarshipLogos() {
  const countries = [
    { flag: '🇬🇧', name: 'United Kingdom' },
    { flag: '🇺🇸', name: 'United States' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇨🇦', name: 'Canada' },
    { flag: '🇦🇺', name: 'Australia' },
    { flag: '🇫🇷', name: 'France' },
    { flag: '🇳🇱', name: 'Netherlands' },
    { flag: '🇯🇵', name: 'Japan' },
    { flag: '🇰🇷', name: 'South Korea' },
    { flag: '🇹🇷', name: 'Turkey' },
    { flag: '🇭🇺', name: 'Hungary' },
    { flag: '🇨🇳', name: 'China' },
    { flag: '🇸🇪', name: 'Sweden' },
    { flag: '🇳🇴', name: 'Norway' },
    { flag: '🇮🇹', name: 'Italy' },
    { flag: '🇪🇸', name: 'Spain' },
    { flag: '🇧🇪', name: 'Belgium' },
    { flag: '🇦🇹', name: 'Austria' },
    { flag: '🇮🇪', name: 'Ireland' },
    { flag: '🇳🇿', name: 'New Zealand' },
  ]

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <p
          className="text-center text-sm font-semibold mb-10
          uppercase tracking-widest"
          style={{ color: '#497296' }}
        >
          Countries Offering Fully Funded Scholarships
        </p>

        {/* Scrolling Container */}
        <div className="relative overflow-hidden">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0
          w-20 bg-gradient-to-r from-white to-transparent z-10" />
          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0
          w-20 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling Track */}
          <div className="flex gap-4 animate-scroll">
            {/* First set */}
            {countries.map((c) => (
              <div
                key={c.name}
                className="flex-shrink-0 flex items-center
                gap-2 px-5 py-3 rounded-full border
                border-gray-200 bg-gray-50
                transition-all duration-200
                hover:border-[#497296] hover:bg-blue-50
                hover:scale-105 cursor-default"
              >
                <span className="text-xl">{c.flag}</span>
                <span
                  className="text-sm font-semibold whitespace-nowrap"
                  style={{ color: '#062850' }}
                >
                  {c.name}
                </span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {countries.map((c) => (
              <div
                key={`${c.name}-dup`}
                className="flex-shrink-0 flex items-center
                gap-2 px-5 py-3 rounded-full border
                border-gray-200 bg-gray-50
                transition-all duration-200
                hover:border-[#497296] hover:bg-blue-50
                hover:scale-105 cursor-default"
              >
                <span className="text-xl">{c.flag}</span>
                <span
                  className="text-sm font-semibold whitespace-nowrap"
                  style={{ color: '#062850' }}
                >
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-center text-sm mt-10 font-medium"
          style={{ color: '#497296' }}
        >
          ...and 30+ more countries worldwide
        </p>

      </div>
    </section>
  )
}