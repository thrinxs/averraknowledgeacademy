'use client'

import { useMemo } from 'react'
import Image from 'next/image'

interface CountryMapProps {
  selectedCountries: string[]
}

const COUNTRY_DATA: Record<
  string,
  {
    lat: number
    lng: number
    capital: string
    flag: string
    landmark: string
    landmarkImage: string
  }
> = {
  'Australia': {
    lat: -25.27, lng: 133.77,
    capital: 'Canberra',
    flag: '🇦🇺',
    landmark: 'Sydney Opera House',
    landmarkImage: 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=400&h=250&fit=crop&q=80',
  },
  'Austria': {
    lat: 47.52, lng: 14.55,
    capital: 'Vienna',
    flag: '🇦🇹',
    landmark: 'Schönbrunn Palace',
    landmarkImage: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&h=250&fit=crop&q=80',
  },
  'Belgium': {
    lat: 50.50, lng: 4.47,
    capital: 'Brussels',
    flag: '🇧🇪',
    landmark: 'Grand Place, Brussels',
    landmarkImage: 'https://images.unsplash.com/photo-1559113202-c916b8e44373?w=400&h=250&fit=crop&q=80',
  },
  'Canada': {
    lat: 56.13, lng: -106.35,
    capital: 'Ottawa',
    flag: '🇨🇦',
    landmark: 'Niagara Falls',
    landmarkImage: 'https://images.unsplash.com/photo-1489447068241-b3490214e879?w=400&h=250&fit=crop&q=80',
  },
  'China': {
    lat: 35.86, lng: 104.20,
    capital: 'Beijing',
    flag: '🇨🇳',
    landmark: 'Great Wall of China',
    landmarkImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=250&fit=crop&q=80',
  },
  'Czech Republic': {
    lat: 49.82, lng: 15.47,
    capital: 'Prague',
    flag: '🇨🇿',
    landmark: 'Charles Bridge, Prague',
    landmarkImage: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=250&fit=crop&q=80',
  },
  'Denmark': {
    lat: 56.26, lng: 9.50,
    capital: 'Copenhagen',
    flag: '🇩🇰',
    landmark: 'Nyhavn, Copenhagen',
    landmarkImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=250&fit=crop&q=80',
  },
  'Finland': {
    lat: 61.92, lng: 25.75,
    capital: 'Helsinki',
    flag: '🇫🇮',
    landmark: 'Helsinki Cathedral',
    landmarkImage: 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?w=400&h=250&fit=crop&q=80',
  },
  'France': {
    lat: 46.60, lng: 1.89,
    capital: 'Paris',
    flag: '🇫🇷',
    landmark: 'Eiffel Tower',
    landmarkImage: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400&h=250&fit=crop&q=80',
  },
  'Germany': {
    lat: 51.17, lng: 10.45,
    capital: 'Berlin',
    flag: '🇩🇪',
    landmark: 'Brandenburg Gate',
    landmarkImage: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=250&fit=crop&q=80',
  },
  'Hungary': {
    lat: 47.16, lng: 19.50,
    capital: 'Budapest',
    flag: '🇭🇺',
    landmark: 'Hungarian Parliament',
    landmarkImage: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=400&h=250&fit=crop&q=80',
  },
  'Ireland': {
    lat: 53.14, lng: -7.69,
    capital: 'Dublin',
    flag: '🇮🇪',
    landmark: 'Cliffs of Moher',
    landmarkImage: 'https://images.unsplash.com/photo-1564959130747-897fb406b9af?w=400&h=250&fit=crop&q=80',
  },
  'Italy': {
    lat: 41.87, lng: 12.57,
    capital: 'Rome',
    flag: '🇮🇹',
    landmark: 'Colosseum, Rome',
    landmarkImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop&q=80',
  },
  'Japan': {
    lat: 36.20, lng: 138.25,
    capital: 'Tokyo',
    flag: '🇯🇵',
    landmark: 'Mount Fuji',
    landmarkImage: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400&h=250&fit=crop&q=80',
  },
  'Netherlands': {
    lat: 52.13, lng: 5.29,
    capital: 'Amsterdam',
    flag: '🇳🇱',
    landmark: 'Amsterdam Canals',
    landmarkImage: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=250&fit=crop&q=80',
  },
  'New Zealand': {
    lat: -40.90, lng: 174.89,
    capital: 'Wellington',
    flag: '🇳🇿',
    landmark: 'Milford Sound',
    landmarkImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=250&fit=crop&q=80',
  },
  'Norway': {
    lat: 60.47, lng: 8.47,
    capital: 'Oslo',
    flag: '🇳🇴',
    landmark: 'Norwegian Fjords',
    landmarkImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=250&fit=crop&q=80',
  },
  'Poland': {
    lat: 51.92, lng: 19.15,
    capital: 'Warsaw',
    flag: '🇵🇱',
    landmark: 'Wawel Castle, Kraków',
    landmarkImage: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400&h=250&fit=crop&q=80',
  },
  'Portugal': {
    lat: 39.40, lng: -8.22,
    capital: 'Lisbon',
    flag: '🇵🇹',
    landmark: 'Belém Tower, Lisbon',
    landmarkImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=250&fit=crop&q=80',
  },
  'Russia': {
    lat: 61.52, lng: 105.32,
    capital: 'Moscow',
    flag: '🇷🇺',
    landmark: 'St. Basil\'s Cathedral',
    landmarkImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400&h=250&fit=crop&q=80',
  },
  'Saudi Arabia': {
    lat: 23.89, lng: 45.08,
    capital: 'Riyadh',
    flag: '🇸🇦',
    landmark: 'Al-Masjid an-Nabawi',
    landmarkImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=250&fit=crop&q=80',
  },
  'South Korea': {
    lat: 35.91, lng: 127.77,
    capital: 'Seoul',
    flag: '🇰🇷',
    landmark: 'Gyeongbokgung Palace',
    landmarkImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=250&fit=crop&q=80',
  },
  'Spain': {
    lat: 40.46, lng: -3.75,
    capital: 'Madrid',
    flag: '🇪🇸',
    landmark: 'Sagrada Família',
    landmarkImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=250&fit=crop&q=80',
  },
  'Sweden': {
    lat: 60.13, lng: 18.64,
    capital: 'Stockholm',
    flag: '🇸🇪',
    landmark: 'Gamla Stan, Stockholm',
    landmarkImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=250&fit=crop&q=80',
  },
  'Switzerland': {
    lat: 46.82, lng: 8.23,
    capital: 'Bern',
    flag: '🇨🇭',
    landmark: 'Matterhorn',
    landmarkImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&h=250&fit=crop&q=80',
  },
  'Turkey': {
    lat: 38.96, lng: 35.24,
    capital: 'Ankara',
    flag: '🇹🇷',
    landmark: 'Hagia Sophia',
    landmarkImage: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=250&fit=crop&q=80',
  },
  'United Arab Emirates': {
    lat: 23.42, lng: 53.85,
    capital: 'Abu Dhabi',
    flag: '🇦🇪',
    landmark: 'Burj Khalifa',
    landmarkImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&q=80',
  },
  'United Kingdom': {
    lat: 55.38, lng: -3.44,
    capital: 'London',
    flag: '🇬🇧',
    landmark: 'Big Ben & Parliament',
    landmarkImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop&q=80',
  },
  'United States': {
    lat: 37.09, lng: -95.71,
    capital: 'Washington, D.C.',
    flag: '🇺🇸',
    landmark: 'Statue of Liberty',
    landmarkImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=400&h=250&fit=crop&q=80',
  },
}

export default function CountryMap({
  selectedCountries,
}: CountryMapProps) {
  const mapSrc = useMemo(() => {
    const filtered = selectedCountries.filter(
      (c) => c !== 'Any Country' && COUNTRY_DATA[c]
    )

    if (filtered.length === 0) {
      return (
        'https://www.google.com/maps/embed?pb=' +
        '!1m14!1m12!1m3!1d50000000!2d10!3d20' +
        '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768' +
        '!4f13.1!5e0!3m2!1sen!2sus' +
        '!4v1700000000000!5m2!1sen!2sus'
      )
    }

    const lastCountry = filtered[filtered.length - 1]
    const data = COUNTRY_DATA[lastCountry]

    if (!data) {
      return (
        'https://www.google.com/maps/embed?pb=' +
        '!1m14!1m12!1m3!1d50000000!2d10!3d20' +
        '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768' +
        '!4f13.1!5e0!3m2!1sen!2sus' +
        '!4v1700000000000!5m2!1sen!2sus'
      )
    }

    let zoom = 5000000
    if (
      ['Russia', 'Canada', 'United States',
        'China', 'Australia'].includes(lastCountry)
    ) {
      zoom = 15000000
    }

    return (
      `https://www.google.com/maps/embed?pb=` +
      `!1m14!1m12!1m3!1d${zoom}` +
      `!2d${data.lng}!3d${data.lat}` +
      `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768` +
      `!4f13.1!5e0!3m2!1sen!2sus` +
      `!4v1700000000000!5m2!1sen!2sus`
    )
  }, [selectedCountries])

  const selectedData = selectedCountries
    .filter(
      (c) => c !== 'Any Country' && COUNTRY_DATA[c]
    )
    .map((c) => ({
      name: c,
      ...COUNTRY_DATA[c],
    }))

  return (
    <div>
      {/* Google Maps Embed */}
      <div
        className="w-full rounded-2xl overflow-hidden
        border shadow-sm"
        style={{ borderColor: '#97C3E0' }}
      >
        <iframe
          src={mapSrc}
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Selected countries map"
        />
      </div>

      {/* Selected Country Cards with Landmark Images */}
      {selectedData.length > 0 && (
        <div className="mt-4 grid grid-cols-1
        sm:grid-cols-2 gap-4">
          {selectedData.map((country, index) => (
            <div
              key={country.name}
              className="rounded-2xl border overflow-hidden
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-lg"
              style={{
                borderColor: '#97C3E0',
                backgroundColor: '#ffffff',
                animation: `fadeInUp 0.4s ease-out ${
                  index * 0.1
                }s both`,
              }}
            >
              {/* Landmark Image */}
              <div className="relative w-full"
              style={{ height: '140px' }}>
                <Image
                  src={country.landmarkImage}
                  alt={country.landmark}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  unoptimized
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, ' +
                      'rgba(6,40,80,0.6) 0%, ' +
                      'transparent 60%)',
                  }}
                />
                {/* Landmark name on image */}
                <div className="absolute bottom-2 left-3
                right-3">
                  <p className="text-white text-xs
                  font-medium drop-shadow-lg">
                    📍 {country.landmark}
                  </p>
                </div>
              </div>

              {/* Country Info */}
              <div className="px-4 py-3 flex items-center
              gap-3">
                <span className="text-2xl">
                  {country.flag}
                </span>
                <div>
                  <p
                    className="text-sm font-bold
                    leading-tight"
                    style={{ color: '#062850' }}
                  >
                    {country.name}
                  </p>
                  <p className="text-xs text-gray-500
                  leading-tight">
                    Capital: {country.capital}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}