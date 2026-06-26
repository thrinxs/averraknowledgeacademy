'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { FormData } from '../FormShell'

interface Props {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors: Record<string, string>
}

const inputClass = `w-full px-4 py-3 rounded-xl border
text-sm transition-all duration-200
focus:outline-none focus:ring-2`

const labelClass = `block text-sm font-semibold mb-2`

// ── Fields of Study ──
const FIELD_CATEGORIES = [
  {
    category: 'Engineering & Technology',
    fields: [
      'Computer Science',
      'Software Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Biomedical Engineering',
      'Aerospace Engineering',
      'Information Technology',
      'Data Science & Analytics',
      'Artificial Intelligence',
      'Cybersecurity',
      'Robotics',
      'Telecommunications',
    ],
  },
  {
    category: 'Business & Management',
    fields: [
      'Business Administration (MBA)',
      'Finance',
      'Accounting',
      'Marketing',
      'Human Resource Management',
      'Supply Chain Management',
      'Entrepreneurship',
      'Project Management',
      'International Business',
      'Economics',
    ],
  },
  {
    category: 'Health & Medicine',
    fields: [
      'Medicine',
      'Public Health',
      'Nursing',
      'Pharmacy',
      'Dentistry',
      'Epidemiology',
      'Global Health',
      'Biomedical Sciences',
      'Physiotherapy',
      'Nutrition & Dietetics',
      'Health Policy & Management',
      'Veterinary Medicine',
    ],
  },
  {
    category: 'Sciences',
    fields: [
      'Biology',
      'Chemistry',
      'Physics',
      'Mathematics',
      'Statistics',
      'Biochemistry',
      'Microbiology',
      'Geology',
      'Environmental Science',
      'Marine Science',
      'Astronomy',
    ],
  },
  {
    category: 'Social Sciences',
    fields: [
      'Psychology',
      'Sociology',
      'Political Science',
      'International Relations',
      'Development Studies',
      'Anthropology',
      'Social Work',
      'Criminology',
      'Geography',
      'Public Administration',
      'Public Policy',
    ],
  },
  {
    category: 'Arts & Humanities',
    fields: [
      'English Language & Literature',
      'History',
      'Philosophy',
      'Linguistics',
      'Theology & Religious Studies',
      'Cultural Studies',
      'Classics',
      'Gender Studies',
    ],
  },
  {
    category: 'Law',
    fields: [
      'Law (LLM)',
      'International Law',
      'Human Rights Law',
      'Commercial Law',
      'Environmental Law',
      'Criminal Justice',
    ],
  },
  {
    category: 'Education',
    fields: [
      'Education',
      'Curriculum & Instruction',
      'Educational Leadership',
      'Special Education',
      'TESOL / English Language Teaching',
      'Educational Technology',
    ],
  },
  {
    category: 'Agriculture & Environment',
    fields: [
      'Agriculture',
      'Agricultural Economics',
      'Forestry',
      'Environmental Management',
      'Climate Change & Sustainability',
      'Food Science & Technology',
    ],
  },
  {
    category: 'Creative Arts & Design',
    fields: [
      'Architecture',
      'Fine Arts',
      'Graphic Design',
      'Film & Media Studies',
      'Music',
      'Fashion Design',
      'Urban Planning',
    ],
  },
  {
    category: 'Communication & Media',
    fields: [
      'Mass Communication',
      'Journalism',
      'Media Studies',
      'Public Relations',
      'Advertising',
    ],
  },
]

// ── Specific Courses per Field ──
const COURSES_BY_FIELD: Record<string, string[]> = {
  'Computer Science': [
    'MSc Computer Science',
    'MSc Software Engineering',
    'MSc Data Science',
    'MSc Artificial Intelligence',
    'MSc Machine Learning',
    'MSc Cybersecurity',
    'MSc Information Systems',
    'PhD Computer Science',
  ],
  'Software Engineering': [
    'MSc Software Engineering',
    'MSc Computer Science',
    'MSc DevOps Engineering',
    'PhD Software Engineering',
  ],
  'Electrical Engineering': [
    'MSc Electrical Engineering',
    'MSc Electronics Engineering',
    'MSc Power Systems',
    'MSc Renewable Energy',
    'PhD Electrical Engineering',
  ],
  'Mechanical Engineering': [
    'MSc Mechanical Engineering',
    'MSc Automotive Engineering',
    'MSc Manufacturing Engineering',
    'PhD Mechanical Engineering',
  ],
  'Civil Engineering': [
    'MSc Civil Engineering',
    'MSc Structural Engineering',
    'MSc Construction Management',
    'MSc Transportation Engineering',
    'PhD Civil Engineering',
  ],
  'Chemical Engineering': [
    'MSc Chemical Engineering',
    'MSc Process Engineering',
    'MSc Petroleum Engineering',
    'PhD Chemical Engineering',
  ],
  'Biomedical Engineering': [
    'MSc Biomedical Engineering',
    'MSc Medical Devices',
    'PhD Biomedical Engineering',
  ],
  'Aerospace Engineering': [
    'MSc Aerospace Engineering',
    'MSc Astronautics',
    'PhD Aerospace Engineering',
  ],
  'Information Technology': [
    'MSc Information Technology',
    'MSc IT Management',
    'MSc Cloud Computing',
    'PhD Information Technology',
  ],
  'Data Science & Analytics': [
    'MSc Data Science',
    'MSc Business Analytics',
    'MSc Big Data',
    'MSc Statistics & Data Science',
    'PhD Data Science',
  ],
  'Artificial Intelligence': [
    'MSc Artificial Intelligence',
    'MSc Machine Learning',
    'MSc Cognitive Science',
    'MSc Natural Language Processing',
    'PhD Artificial Intelligence',
  ],
  'Cybersecurity': [
    'MSc Cybersecurity',
    'MSc Information Security',
    'MSc Digital Forensics',
    'PhD Cybersecurity',
  ],
  'Robotics': [
    'MSc Robotics',
    'MSc Mechatronics',
    'MSc Autonomous Systems',
    'PhD Robotics',
  ],
  'Telecommunications': [
    'MSc Telecommunications',
    'MSc Network Engineering',
    'PhD Telecommunications',
  ],
  'Business Administration (MBA)': [
    'MBA General',
    'MBA Finance',
    'MBA Marketing',
    'MBA International Business',
    'Executive MBA',
  ],
  'Finance': [
    'MSc Finance',
    'MSc Financial Engineering',
    'MSc Banking & Finance',
    'MSc Investment Management',
    'PhD Finance',
  ],
  'Accounting': [
    'MSc Accounting',
    'MSc Accounting & Finance',
    'MSc Forensic Accounting',
    'PhD Accounting',
  ],
  'Marketing': [
    'MSc Marketing',
    'MSc Digital Marketing',
    'MSc Strategic Marketing',
    'PhD Marketing',
  ],
  'Human Resource Management': [
    'MSc Human Resource Management',
    'MSc Organisational Behaviour',
    'PhD HRM',
  ],
  'Supply Chain Management': [
    'MSc Supply Chain Management',
    'MSc Logistics',
    'MSc Operations Management',
  ],
  'Entrepreneurship': [
    'MSc Entrepreneurship',
    'MSc Innovation Management',
  ],
  'Project Management': [
    'MSc Project Management',
    'MSc Construction Project Management',
  ],
  'International Business': [
    'MSc International Business',
    'MSc International Management',
    'MSc Global Business',
  ],
  'Economics': [
    'MSc Economics',
    'MSc Development Economics',
    'MSc Financial Economics',
    'MSc International Economics',
    'PhD Economics',
  ],
  'Medicine': [
    'MD Medicine',
    'MSc Clinical Medicine',
    'MSc Tropical Medicine',
    'PhD Medicine',
  ],
  'Public Health': [
    'MPH Public Health',
    'MSc Global Health',
    'MSc Epidemiology',
    'MSc Health Policy',
    'DrPH',
    'PhD Public Health',
  ],
  'Nursing': [
    'MSc Nursing',
    'MSc Advanced Nursing Practice',
    'MSc Midwifery',
    'PhD Nursing',
  ],
  'Pharmacy': [
    'MPharm Pharmacy',
    'MSc Clinical Pharmacy',
    'MSc Pharmaceutical Sciences',
    'PhD Pharmacy',
  ],
  'Dentistry': [
    'MSc Dentistry',
    'MSc Orthodontics',
    'PhD Dental Sciences',
  ],
  'Epidemiology': [
    'MSc Epidemiology',
    'MSc Biostatistics',
    'PhD Epidemiology',
  ],
  'Global Health': [
    'MSc Global Health',
    'MSc International Health',
    'PhD Global Health',
  ],
  'Biomedical Sciences': [
    'MSc Biomedical Sciences',
    'MSc Molecular Biology',
    'PhD Biomedical Sciences',
  ],
  'Physiotherapy': [
    'MSc Physiotherapy',
    'DPT Doctor of Physical Therapy',
  ],
  'Nutrition & Dietetics': [
    'MSc Nutrition',
    'MSc Dietetics',
    'MSc Food & Nutrition',
    'PhD Nutrition',
  ],
  'Health Policy & Management': [
    'MSc Health Policy',
    'MSc Health Management',
    'MSc Health Economics',
  ],
  'Veterinary Medicine': [
    'MSc Veterinary Medicine',
    'MSc Veterinary Public Health',
    'PhD Veterinary Science',
  ],
  'Biology': [
    'MSc Biology',
    'MSc Molecular Biology',
    'MSc Genetics',
    'MSc Ecology',
    'PhD Biology',
  ],
  'Chemistry': [
    'MSc Chemistry',
    'MSc Organic Chemistry',
    'MSc Analytical Chemistry',
    'PhD Chemistry',
  ],
  'Physics': [
    'MSc Physics',
    'MSc Applied Physics',
    'MSc Astrophysics',
    'PhD Physics',
  ],
  'Mathematics': [
    'MSc Mathematics',
    'MSc Applied Mathematics',
    'MSc Pure Mathematics',
    'PhD Mathematics',
  ],
  'Statistics': [
    'MSc Statistics',
    'MSc Applied Statistics',
    'MSc Biostatistics',
    'PhD Statistics',
  ],
  'Biochemistry': [
    'MSc Biochemistry',
    'PhD Biochemistry',
  ],
  'Microbiology': [
    'MSc Microbiology',
    'MSc Medical Microbiology',
    'PhD Microbiology',
  ],
  'Geology': [
    'MSc Geology',
    'MSc Geophysics',
    'MSc Petroleum Geoscience',
    'PhD Geology',
  ],
  'Environmental Science': [
    'MSc Environmental Science',
    'MSc Environmental Management',
    'MSc Sustainability',
    'PhD Environmental Science',
  ],
  'Marine Science': [
    'MSc Marine Science',
    'MSc Marine Biology',
    'MSc Oceanography',
  ],
  'Astronomy': [
    'MSc Astronomy',
    'MSc Astrophysics',
    'PhD Astronomy',
  ],
  'Psychology': [
    'MSc Psychology',
    'MSc Clinical Psychology',
    'MSc Organisational Psychology',
    'MSc Forensic Psychology',
    'PhD Psychology',
  ],
  'Sociology': [
    'MSc Sociology',
    'MSc Urban Studies',
    'PhD Sociology',
  ],
  'Political Science': [
    'MSc Political Science',
    'MSc Comparative Politics',
    'MSc Governance',
    'PhD Political Science',
  ],
  'International Relations': [
    'MSc International Relations',
    'MSc Diplomacy',
    'MSc Conflict Studies',
    'MSc Peace & Security',
    'PhD International Relations',
  ],
  'Development Studies': [
    'MSc Development Studies',
    'MSc International Development',
    'MSc Sustainable Development',
    'PhD Development Studies',
  ],
  'Anthropology': [
    'MSc Anthropology',
    'MSc Social Anthropology',
    'PhD Anthropology',
  ],
  'Social Work': [
    'MSW Social Work',
    'MSc Social Policy',
    'PhD Social Work',
  ],
  'Criminology': [
    'MSc Criminology',
    'MSc Criminal Justice',
    'PhD Criminology',
  ],
  'Geography': [
    'MSc Geography',
    'MSc Human Geography',
    'MSc GIS & Remote Sensing',
    'PhD Geography',
  ],
  'Public Administration': [
    'MPA Public Administration',
    'MSc Governance',
    'PhD Public Administration',
  ],
  'Public Policy': [
    'MPP Public Policy',
    'MSc Public Policy',
    'PhD Public Policy',
  ],
  'English Language & Literature': [
    'MA English Literature',
    'MA Creative Writing',
    'MSc Applied Linguistics',
    'PhD English',
  ],
  'History': [
    'MA History',
    'MSc African History',
    'MSc Modern History',
    'PhD History',
  ],
  'Philosophy': [
    'MA Philosophy',
    'MSc Ethics',
    'PhD Philosophy',
  ],
  'Linguistics': [
    'MA Linguistics',
    'MSc Applied Linguistics',
    'MSc Computational Linguistics',
    'PhD Linguistics',
  ],
  'Theology & Religious Studies': [
    'MA Theology',
    'MA Religious Studies',
    'PhD Theology',
  ],
  'Cultural Studies': [
    'MA Cultural Studies',
    'MA African Studies',
    'PhD Cultural Studies',
  ],
  'Classics': [
    'MA Classics',
    'PhD Classical Studies',
  ],
  'Gender Studies': [
    'MA Gender Studies',
    'MSc Women & Development',
    'PhD Gender Studies',
  ],
  'Law (LLM)': [
    'LLM General Law',
    'LLM International Law',
    'LLM Human Rights Law',
    'LLM Commercial Law',
    'LLM Environmental Law',
    'PhD Law',
  ],
  'International Law': [
    'LLM International Law',
    'LLM Public International Law',
    'PhD International Law',
  ],
  'Human Rights Law': [
    'LLM Human Rights',
    'LLM International Human Rights',
    'PhD Human Rights',
  ],
  'Commercial Law': [
    'LLM Commercial Law',
    'LLM Corporate Law',
    'LLM Banking & Finance Law',
  ],
  'Environmental Law': [
    'LLM Environmental Law',
    'LLM Energy Law',
    'PhD Environmental Law',
  ],
  'Criminal Justice': [
    'MSc Criminal Justice',
    'LLM Criminal Law',
    'PhD Criminal Justice',
  ],
  'Education': [
    'MEd Education',
    'MSc Education',
    'MA Education',
    'PhD Education',
  ],
  'Curriculum & Instruction': [
    'MEd Curriculum & Instruction',
    'PhD Curriculum Studies',
  ],
  'Educational Leadership': [
    'MEd Educational Leadership',
    'EdD Educational Leadership',
  ],
  'Special Education': [
    'MEd Special Education',
    'MSc Inclusive Education',
  ],
  'TESOL / English Language Teaching': [
    'MA TESOL',
    'MSc Applied Linguistics & TESOL',
    'PhD TESOL',
  ],
  'Educational Technology': [
    'MSc Educational Technology',
    'MEd Instructional Design',
    'PhD EdTech',
  ],
  'Agriculture': [
    'MSc Agriculture',
    'MSc Agronomy',
    'MSc Agricultural Engineering',
    'PhD Agriculture',
  ],
  'Agricultural Economics': [
    'MSc Agricultural Economics',
    'MSc Rural Development',
    'PhD Agricultural Economics',
  ],
  'Forestry': [
    'MSc Forestry',
    'MSc Forest Management',
    'PhD Forestry',
  ],
  'Environmental Management': [
    'MSc Environmental Management',
    'MSc Natural Resource Management',
    'PhD Environmental Management',
  ],
  'Climate Change & Sustainability': [
    'MSc Climate Change',
    'MSc Sustainability',
    'MSc Environmental Policy',
    'PhD Climate Science',
  ],
  'Food Science & Technology': [
    'MSc Food Science',
    'MSc Food Technology',
    'MSc Food Safety',
    'PhD Food Science',
  ],
  'Architecture': [
    'MArch Architecture',
    'MSc Architectural Design',
    'MSc Urban Design',
    'PhD Architecture',
  ],
  'Fine Arts': [
    'MFA Fine Arts',
    'MA Visual Arts',
    'PhD Fine Arts',
  ],
  'Graphic Design': [
    'MA Graphic Design',
    'MSc UX Design',
    'MFA Design',
  ],
  'Film & Media Studies': [
    'MA Film Studies',
    'MFA Filmmaking',
    'MSc Media Production',
    'PhD Film Studies',
  ],
  'Music': [
    'MA Music',
    'MMus Performance',
    'MSc Music Technology',
    'PhD Music',
  ],
  'Fashion Design': [
    'MA Fashion Design',
    'MSc Fashion Management',
  ],
  'Urban Planning': [
    'MSc Urban Planning',
    'MSc City Planning',
    'PhD Urban Studies',
  ],
  'Mass Communication': [
    'MSc Mass Communication',
    'MA Communication Studies',
    'PhD Communication',
  ],
  'Journalism': [
    'MA Journalism',
    'MSc Investigative Journalism',
    'MSc Digital Journalism',
  ],
  'Media Studies': [
    'MA Media Studies',
    'MSc Digital Media',
    'PhD Media Studies',
  ],
  'Public Relations': [
    'MSc Public Relations',
    'MSc Strategic Communications',
  ],
  'Advertising': [
    'MSc Advertising',
    'MA Advertising & Marketing',
  ],
}

// ── Study Abroad Reasons ──
const REASON_CATEGORIES = [
  {
    category: 'Strong Reasons',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    borderColor: '#86EFAC',
    tag: 'strong',
    reasons: [
      'To gain specialised knowledge not available in my country',
      'To contribute to my country\'s development after graduation',
      'To access world-class research facilities and expertise',
      'To build international professional networks',
      'To learn from a different academic culture and perspective',
      'To pursue a field that is underdeveloped in my home country',
      'To gain skills that will help me solve problems in my community',
      'To access advanced technology and training methods',
      'To collaborate with leading researchers in my field',
      'To bring back knowledge and innovation to my home country',
    ],
  },
  {
    category: 'Acceptable Reasons',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FCD34D',
    tag: 'acceptable',
    reasons: [
      'For better career opportunities',
      'For personal growth and independence',
      'To experience a new culture',
      'To improve my language skills',
      'To get a globally recognised degree',
      'To expand my worldview',
      'To access scholarships and financial aid',
    ],
  },
  {
    category: 'Risky Reasons',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    tag: 'risky',
    reasons: [
      'To relocate permanently to another country',
      'To earn more money abroad',
      'To escape my current situation',
      'Because my friends or family are there',
      'Because I could not get into a good school locally',
    ],
  },
]

const ALL_REASONS = REASON_CATEGORIES.flatMap((c) =>
  c.reasons.map((r) => ({
    text: r,
    tag: c.tag,
    color: c.color,
    bgColor: c.bgColor,
    borderColor: c.borderColor,
  }))
)

function getReasonMeta(reason: string) {
  return ALL_REASONS.find((r) => r.text === reason)
}

function getRecommendation(
  selected: string[]
): {
  type: 'strong' | 'warning' | 'danger' | null
  title: string
  message: string
} | null {
  if (selected.length === 0) return null

  const tags = selected.map(
    (s) => getReasonMeta(s)?.tag || 'strong'
  )

  const hasRisky = tags.includes('risky')
  const hasStrong = tags.includes('strong')
  const onlyAcceptable =
    !hasRisky &&
    !hasStrong &&
    tags.every((t) => t === 'acceptable')

  if (hasRisky && !hasStrong) {
    return {
      type: 'danger',
      title: 'This may weaken your application',
      message:
        'Some of your selected reasons are viewed ' +
        'negatively by scholarship committees. ' +
        'Scholarships are typically awarded to ' +
        'applicants who plan to return and contribute ' +
        'to their home country. We strongly recommend ' +
        'adding reasons that show your commitment to ' +
        'giving back — such as contributing to your ' +
        'country\'s development or solving community ' +
        'problems with the knowledge you gain.',
    }
  }

  if (hasRisky && hasStrong) {
    return {
      type: 'warning',
      title: 'Consider reframing some of your reasons',
      message:
        'You have some strong motivations, but one or ' +
        'more of your selected reasons may raise ' +
        'concerns with scholarship committees. In your ' +
        'Statement of Purpose, focus on your strong ' +
        'reasons and avoid mentioning intentions to ' +
        'relocate permanently or escape your current ' +
        'situation. Our team will help you frame your ' +
        'story effectively.',
    }
  }

  if (onlyAcceptable) {
    return {
      type: 'warning',
      title: 'Good, but could be stronger',
      message:
        'Your reasons are acceptable but may not stand ' +
        'out to scholarship committees. Consider adding ' +
        'reasons that show how you plan to use your ' +
        'education to contribute to your field or ' +
        'community back home — this is what most ' +
        'scholarship boards actively look for.',
    }
  }

  if (hasStrong) {
    return {
      type: 'strong',
      title: 'Strong motivation',
      message:
        'Your reasons align well with what scholarship ' +
        'committees look for. Applicants who show a ' +
        'clear plan to contribute to their home country ' +
        'or community are viewed very favourably. ' +
        'Expand on these reasons in the text box below ' +
        'to make your application even stronger.',
    }
  }

  return null
}

// ── Special Circumstances ──
const CIRCUMSTANCE_CATEGORIES = [
  {
    category: 'Highly Valued by Scholarship Committees',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    borderColor: '#86EFAC',
    tag: 'strong',
    items: [
      'First in my family to attend university',
      'From a low-income or financially disadvantaged background',
      'From a rural or underserved community',
      'Community leadership or volunteer experience',
      'Founded or led a social impact project',
      'Published academic research or papers',
      'Overcame significant personal hardship',
      'From a conflict-affected or post-conflict region',
      'Refugee or internally displaced person',
      'Advocate for gender equality or minority rights',
      'Active in environmental or sustainability initiatives',
      'Demonstrated commitment to developing my home country',
      'Received national or international awards or recognition',
      'Mentored or tutored other students',
    ],
  },
  {
    category: 'Relevant Circumstances',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#93C5FD',
    tag: 'relevant',
    items: [
      'Person with a disability',
      'Orphan or raised by a single parent',
      'Member of an ethnic or religious minority',
      'Returned migrant or diaspora member',
      'Worked while studying to support my family',
      'Caregiver for a family member',
      'Experienced gender-based barriers to education',
      'From a country with limited educational opportunities',
      'Self-funded my previous education',
      'Older or non-traditional student',
      'Career changer seeking new qualifications',
      'Military veteran or service member',
    ],
  },
  {
    category: 'Professional Strengths',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#C4B5FD',
    tag: 'professional',
    items: [
      'Significant work experience in my field',
      'Work experience in government or public service',
      'Experience in an NGO or international organisation',
      'Entrepreneurial experience or business ownership',
      'Experience in healthcare or frontline services',
      'Teaching or academic experience',
      'Technical or STEM industry experience',
      'Experience in agriculture or food security',
      'Experience in media, journalism, or communications',
    ],
  },
]

const ALL_CIRCUMSTANCES = CIRCUMSTANCE_CATEGORIES.flatMap(
  (c) =>
    c.items.map((item) => ({
      text: item,
      tag: c.tag,
      color: c.color,
      bgColor: c.bgColor,
      borderColor: c.borderColor,
    }))
)

function getCircumstanceRecommendation(
  selected: string[]
): {
  type: 'strong' | 'info' | null
  title: string
  message: string
} | null {
  if (selected.length === 0) return null

  const tags = selected.map(
    (s) =>
      ALL_CIRCUMSTANCES.find((c) => c.text === s)
        ?.tag || 'relevant'
  )

  const hasStrong = tags.includes('strong')
  const hasProfessional = tags.includes('professional')
  const count = selected.length

  if (hasStrong && count >= 3) {
    return {
      type: 'strong',
      title: 'Excellent — your background stands out',
      message:
        'You have multiple circumstances that scholarship ' +
        'committees actively prioritise. Many fully funded ' +
        'scholarships specifically target applicants with ' +
        'backgrounds like yours. Make sure to highlight ' +
        'these in your Statement of Purpose — they can ' +
        'significantly strengthen your application.',
    }
  }

  if (hasStrong) {
    return {
      type: 'strong',
      title: 'Strong background for scholarships',
      message:
        'Your circumstances align with what many ' +
        'scholarship programmes look for. Several fully ' +
        'funded scholarships prioritise applicants who ' +
        'have overcome challenges or demonstrated ' +
        'leadership in their communities. We will match ' +
        'you with scholarships that value your specific ' +
        'background.',
    }
  }

  if (hasProfessional) {
    return {
      type: 'info',
      title: 'Professional experience is valuable',
      message:
        'Your professional background can strengthen ' +
        'your application, especially for scholarships ' +
        'that target working professionals or those with ' +
        'industry experience. Many programmes like ' +
        'Chevening, Fulbright, and DAAD value applicants ' +
        'who have real-world experience in their field.',
    }
  }

  return {
    type: 'info',
    title: 'Your circumstances matter',
    message:
      'Every applicant has a unique story. The ' +
      'circumstances you have selected will help us ' +
      'find scholarships that are specifically designed ' +
      'for applicants with backgrounds like yours. ' +
      'Expand on these in the text box below to give ' +
      'us more detail.',
  }
}

// ── Searchable Dropdown Component ──
function SearchableDropdown({
  value,
  onChange,
  options,
  categories,
  placeholder,
  hasError,
}: {
  value: string
  onChange: (val: string) => void
  options?: string[]
  categories?: { category: string; fields: string[] }[]
  placeholder: string
  hasError: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () =>
      document.removeEventListener('mousedown', handle)
  }, [])

  const allOptions = useMemo(() => {
    if (options) return options
    if (categories)
      return categories.flatMap((c) => c.fields)
    return []
  }, [options, categories])

  const filtered = useMemo(() => {
    if (!search.trim()) return allOptions
    return allOptions.filter((o) =>
      o.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, allOptions])

  const filteredCategories = useMemo(() => {
    if (!categories) return null
    return categories
      .map((cat) => ({
        ...cat,
        fields: cat.fields.filter((f) =>
          !search.trim()
            ? true
            : f
                .toLowerCase()
                .includes(search.toLowerCase())
        ),
      }))
      .filter((cat) => cat.fields.length > 0)
  }, [categories, search])

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
    setSearch('')
    setIsCustom(false)
  }

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        placeholder={
          isCustom ? 'Type your option...' : placeholder
        }
        value={isCustom ? value : open ? search : value}
        onChange={(e) => {
          if (isCustom) {
            onChange(e.target.value)
          } else {
            setSearch(e.target.value)
            setOpen(true)
          }
        }}
        onFocus={() => {
          if (!isCustom) setOpen(true)
        }}
        className={inputClass}
        style={{
          borderColor: hasError ? '#EF4444' : '#D1D5DB',
        }}
      />

      {open && !isCustom && (
        <div
          className="absolute top-full left-0 right-0
          mt-1 bg-white rounded-xl border border-gray-200
          shadow-xl z-30 overflow-hidden"
        >
          <div className="max-h-64 overflow-y-auto">
            {filteredCategories ? (
              filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <div key={cat.category}>
                    <div
                      className="px-4 py-2 text-xs
                      font-bold uppercase tracking-wider
                      bg-gray-50 border-b border-gray-100
                      sticky top-0"
                      style={{ color: '#497296' }}
                    >
                      {cat.category}
                    </div>
                    {cat.fields.map((field) => (
                      <button
                        key={field}
                        type="button"
                        onMouseDown={() =>
                          handleSelect(field)
                        }
                        className="w-full text-left px-4
                        py-2.5 text-sm transition-colors
                        duration-150 hover:bg-blue-50
                        border-b border-gray-50
                        last:border-0"
                        style={{ color: '#062850' }}
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm
                text-gray-400 text-center">
                  No fields found
                </div>
              )
            ) : filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onMouseDown={() => handleSelect(opt)}
                  className="w-full text-left px-4
                  py-2.5 text-sm transition-colors
                  duration-150 hover:bg-blue-50
                  border-b border-gray-50 last:border-0"
                  style={{ color: '#062850' }}
                >
                  {opt}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm
              text-gray-400 text-center">
                No options found
              </div>
            )}

            <button
              type="button"
              onMouseDown={() => {
                setIsCustom(true)
                setOpen(false)
                setSearch('')
                onChange('')
              }}
              className="w-full text-left px-4 py-3
              text-sm font-medium border-t
              border-gray-100 transition-colors
              duration-150 hover:bg-blue-50"
              style={{ color: '#497296' }}
            >
              + Enter a custom option
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ──
export default function Step4CoursePreferences({
  formData,
  updateFormData,
  errors,
}: Props) {
  const availableCourses = useMemo(() => {
    if (!formData.fieldAbroad) return []
    return COURSES_BY_FIELD[formData.fieldAbroad] || []
  }, [formData.fieldAbroad])

  const reasonConfig = {
    strong: {
      bg: '#F0FDF4',
      border: '#86EFAC',
      iconColor: '#16A34A',
      textColor: '#166534',
      icon: '✓',
    },
    warning: {
      bg: '#FFFBEB',
      border: '#FCD34D',
      iconColor: '#D97706',
      textColor: '#92400E',
      icon: '⚠',
    },
    danger: {
      bg: '#FEF2F2',
      border: '#FECACA',
      iconColor: '#DC2626',
      textColor: '#991B1B',
      icon: '⚠',
    },
  }

  const circumstanceConfig = {
    strong: {
      bg: '#F0FDF4',
      border: '#86EFAC',
      iconColor: '#16A34A',
      textColor: '#166534',
      icon: '✓',
    },
    info: {
      bg: '#EFF6FF',
      border: '#93C5FD',
      iconColor: '#2563EB',
      textColor: '#1E40AF',
      icon: 'ℹ',
    },
  }

  // Derive selected reasons from textarea
  const selectedReasons = useMemo(() => {
    return formData.reasonForStudying
      .split('\n')
      .map((l) => l.trim())
      .filter((l) =>
        ALL_REASONS.some((r) => r.text === l)
      )
  }, [formData.reasonForStudying])

  // Derive selected circumstances from textarea
  const selectedCircumstances = useMemo(() => {
    return formData.specialCircumstances
      .split('\n')
      .map((l) => l.trim())
      .filter((l) =>
        ALL_CIRCUMSTANCES.some((c) => c.text === l)
      )
  }, [formData.specialCircumstances])

  const reasonRec = getRecommendation(selectedReasons)
  const circumstanceRec = getCircumstanceRecommendation(
    selectedCircumstances
  )

  const toggleReason = (reason: string) => {
    const isSelected =
      formData.reasonForStudying.includes(reason)
    if (isSelected) {
      const updated = formData.reasonForStudying
        .replace(reason + '\n', '')
        .replace(reason, '')
        .trim()
      updateFormData({ reasonForStudying: updated })
    } else {
      const current = formData.reasonForStudying.trim()
      updateFormData({
        reasonForStudying: current
          ? current + '\n' + reason
          : reason,
      })
    }
  }

  const toggleCircumstance = (item: string) => {
    const isSelected =
      formData.specialCircumstances.includes(item)
    if (isSelected) {
      const updated = formData.specialCircumstances
        .replace(item + '\n', '')
        .replace(item, '')
        .trim()
      updateFormData({ specialCircumstances: updated })
    } else {
      const current =
        formData.specialCircumstances.trim()
      updateFormData({
        specialCircumstances: current
          ? current + '\n' + item
          : item,
      })
    }
  }

  return (
    <div>
      {/* Step Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#062850' }}
        >
          Course &amp; Field Preferences
        </h2>
        <p className="text-gray-500 text-sm">
          Tell us what you want to study abroad. This
          helps us narrow your matches to the most
          relevant scholarships.
        </p>
      </div>

      <div className="space-y-6">

        {/* Degree Level */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Degree Level You Want to Study{' '}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.degreeLevel}
            onChange={(e) =>
              updateFormData({
                degreeLevel: e.target.value,
              })
            }
            className={inputClass}
            style={{
              borderColor: errors.degreeLevel
                ? '#EF4444'
                : '#D1D5DB',
            }}
          >
            <option value="">Select degree level</option>
            <option value="undergraduate">
              Undergraduate
            </option>
            <option value="postgraduate_diploma">
              Postgraduate Diploma
            </option>
            <option value="master">
              Master&apos;s
            </option>
            <option value="phd">PhD / Doctorate</option>
            <option value="short_course">
              Short Course / Certificate
            </option>
            <option value="any">Any Level</option>
          </select>
          {errors.degreeLevel && (
            <p className="text-red-500 text-xs mt-1">
              {errors.degreeLevel}
            </p>
          )}
        </div>

        {/* Field of Study Abroad */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Field of Study Abroad{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Select from the list or type your own.
          </p>
          <SearchableDropdown
            value={formData.fieldAbroad}
            onChange={(val) => {
              updateFormData({
                fieldAbroad: val,
                specificCourse: '',
              })
            }}
            categories={FIELD_CATEGORIES}
            placeholder="Search or select field..."
            hasError={!!errors.fieldAbroad}
          />
          {errors.fieldAbroad && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fieldAbroad}
            </p>
          )}
        </div>

        {/* Specific Course */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Specific Course
            <span className="text-gray-400 font-normal
            ml-1">
              (optional)
            </span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            {availableCourses.length > 0
              ? 'Choose from courses related to your selected field, or type your own.'
              : 'Select a field of study above to see related courses, or type your own.'}
          </p>
          <SearchableDropdown
            value={formData.specificCourse}
            onChange={(val) =>
              updateFormData({ specificCourse: val })
            }
            options={availableCourses}
            placeholder={
              availableCourses.length > 0
                ? 'Search or select course...'
                : 'Select a field first or type a course...'
            }
            hasError={false}
          />
        </div>

        {/* Why Study Abroad */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Why Do You Want to Study Abroad?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Select the reasons that apply to you. This
            helps us match you with scholarships that
            align with your goals — and helps us guide
            your Statement of Purpose. You can also add
            your own words in the text box below.
          </p>

          <div className="space-y-4 mb-4">
            {REASON_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center
                gap-2 mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full
                    flex-shrink-0"
                    style={{
                      backgroundColor: cat.color,
                    }}
                  />
                  <span
                    className="text-xs font-bold
                    uppercase tracking-wider"
                    style={{ color: cat.color }}
                  >
                    {cat.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.reasons.map((reason) => {
                    const isSelected =
                      formData.reasonForStudying
                        .includes(reason)
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() =>
                          toggleReason(reason)
                        }
                        className="px-3 py-1.5
                        rounded-full text-xs font-medium
                        border transition-all
                        duration-200 hover:scale-105"
                        style={{
                          backgroundColor: isSelected
                            ? cat.bgColor
                            : '#F9FAFB',
                          borderColor: isSelected
                            ? cat.borderColor
                            : '#E5E7EB',
                          color: isSelected
                            ? cat.color
                            : '#6B7280',
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {reason}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Reason Recommendation */}
          {reasonRec && (
            <div
              className="rounded-2xl px-5 py-4 mb-4
              border transition-all duration-300"
              style={{
                backgroundColor:
                  reasonConfig[reasonRec.type!].bg,
                borderColor:
                  reasonConfig[reasonRec.type!].border,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-lg flex-shrink-0
                  mt-0.5"
                  style={{
                    color:
                      reasonConfig[reasonRec.type!]
                        .iconColor,
                  }}
                >
                  {reasonConfig[reasonRec.type!].icon}
                </span>
                <div>
                  <p
                    className="font-bold text-sm mb-1"
                    style={{
                      color:
                        reasonConfig[reasonRec.type!]
                          .textColor,
                    }}
                  >
                    {reasonRec.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color:
                        reasonConfig[reasonRec.type!]
                          .textColor,
                    }}
                  >
                    {reasonRec.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <label
            className="block text-xs font-semibold mb-2"
            style={{ color: '#062850' }}
          >
            Expand on your reasons
            <span className="text-gray-400 font-normal
            ml-1">
              (edit or add more detail)
            </span>
          </label>
          <textarea
            placeholder="Your selected reasons appear here. Feel free to edit, expand, or add more detail..."
            value={formData.reasonForStudying}
            onChange={(e) =>
              updateFormData({
                reasonForStudying: e.target.value,
              })
            }
            rows={6}
            className={`${inputClass} resize-none`}
            style={{
              borderColor: errors.reasonForStudying
                ? '#EF4444'
                : '#D1D5DB',
            }}
          />
          {errors.reasonForStudying && (
            <p className="text-red-500 text-xs mt-1">
              {errors.reasonForStudying}
            </p>
          )}
        </div>

        {/* Special Circumstances */}
        <div>
          <label
            className={labelClass}
            style={{ color: '#062850' }}
          >
            Special Circumstances
            <span className="text-gray-400 font-normal
            ml-1">
              (optional — but highly recommended)
            </span>
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Many scholarships specifically target
            applicants from certain backgrounds or with
            particular experiences. Selecting what applies
            to you helps us find scholarships that match
            your story — and can significantly strengthen
            your application.
          </p>

          <div className="space-y-4 mb-4">
            {CIRCUMSTANCE_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center
                gap-2 mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full
                    flex-shrink-0"
                    style={{
                      backgroundColor: cat.color,
                    }}
                  />
                  <span
                    className="text-xs font-bold
                    uppercase tracking-wider"
                    style={{ color: cat.color }}
                  >
                    {cat.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => {
                    const isSelected =
                      formData.specialCircumstances
                        .includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          toggleCircumstance(item)
                        }
                        className="px-3 py-1.5
                        rounded-full text-xs font-medium
                        border transition-all
                        duration-200 hover:scale-105"
                        style={{
                          backgroundColor: isSelected
                            ? cat.bgColor
                            : '#F9FAFB',
                          borderColor: isSelected
                            ? cat.borderColor
                            : '#E5E7EB',
                          color: isSelected
                            ? cat.color
                            : '#6B7280',
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Circumstance Recommendation */}
          {circumstanceRec && (
            <div
              className="rounded-2xl px-5 py-4 mb-4
              border transition-all duration-300"
              style={{
                backgroundColor:
                  circumstanceConfig[
                    circumstanceRec.type!
                  ].bg,
                borderColor:
                  circumstanceConfig[
                    circumstanceRec.type!
                  ].border,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-lg flex-shrink-0
                  mt-0.5"
                  style={{
                    color:
                      circumstanceConfig[
                        circumstanceRec.type!
                      ].iconColor,
                  }}
                >
                  {
                    circumstanceConfig[
                      circumstanceRec.type!
                    ].icon
                  }
                </span>
                <div>
                  <p
                    className="font-bold text-sm mb-1"
                    style={{
                      color:
                        circumstanceConfig[
                          circumstanceRec.type!
                        ].textColor,
                    }}
                  >
                    {circumstanceRec.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{
                      color:
                        circumstanceConfig[
                          circumstanceRec.type!
                        ].textColor,
                    }}
                  >
                    {circumstanceRec.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <label
            className="block text-xs font-semibold mb-2"
            style={{ color: '#062850' }}
          >
            Expand on your circumstances
            <span className="text-gray-400 font-normal
            ml-1">
              (add more detail to strengthen your profile)
            </span>
          </label>
          <textarea
            placeholder="Your selected circumstances appear here. Add more detail about your experiences, challenges, achievements, or anything that makes your story unique..."
            value={formData.specialCircumstances}
            onChange={(e) =>
              updateFormData({
                specialCircumstances: e.target.value,
              })
            }
            rows={5}
            className={`${inputClass} resize-none`}
            style={{ borderColor: '#D1D5DB' }}
          />
        </div>

      </div>
    </div>
  )
}