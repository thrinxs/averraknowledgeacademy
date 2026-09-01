'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, MicOff, Square, CheckCircle, AlertCircle, ChevronRight, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface Props {
  assessmentId: string
  childName: string
  yearGroupLabel: string
  yearGroupCode: string
}

type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop' | null
type Section = 'device' | 'intro' | 'reading' | 'tracing' | 'audio' | 'sentence' | 'submitting'

type AudioResponse = {
  question_id: number
  question: string
  transcript: string
  keywords: string[]
  audio_url?: string
}

type SentenceResponse = {
  sentence_id: number
  prompt: string
  transcript: string
  keywords: string[]
  audio_url?: string
}

// ── MediaRecorder hook ────────────────────────────────────────────────────
function useAudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.start(100)
      mediaRecorderRef.current = mr
    } catch (err) {
      console.error('Could not start audio recording:', err)
    }
  }

  function stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const mr = mediaRecorderRef.current
      if (!mr || mr.state === 'inactive') { resolve(null); return }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop())
          streamRef.current = null
        }
        resolve(blob.size > 0 ? blob : null)
      }
      mr.stop()
    })
  }

  return { startRecording, stopRecording }
}

// ── Speech recognition hook ───────────────────────────────────────────────
function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recRef = useRef<unknown>(null)
  const accumulatedRef = useRef('')

  useEffect(() => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
               (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (SR) setSupported(true)
  }, [])

  const startListening = useCallback(() => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
               (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    if (!SR) return
    type SRInstance = {
      lang: string; continuous: boolean; interimResults: boolean
      onresult: (e: unknown) => void; onend: () => void
      start: () => void; stop: () => void
    }
    const recognition = new (SR as new () => SRInstance)()
    recognition.lang = 'en-GB'
    recognition.continuous = true
    recognition.interimResults = true
    accumulatedRef.current = ''

    recognition.onresult = (e: unknown) => {
      const ev = e as {
        results: Record<number, Record<number, { transcript: string; isFinal?: boolean }> & { isFinal: boolean }>
        resultIndex: number
      }
      let interim = ''
      for (let i = ev.resultIndex; i < Object.keys(ev.results).length; i++) {
        const result = ev.results[i]
        if (result.isFinal) {
          accumulatedRef.current += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }
      setTranscript((accumulatedRef.current + interim).trim())
    }

    recognition.onend = () => {
      setListening(false)
      setTranscript(accumulatedRef.current.trim())
    }
    recognition.start()
    recRef.current = recognition
    setListening(true)
    setTranscript('')
  }, [])

  const stopListening = useCallback(() => {
    if (recRef.current) (recRef.current as { stop: () => void }).stop()
    setListening(false)
    return accumulatedRef.current.trim()
  }, [])

  const resetTranscript = useCallback(() => {
    accumulatedRef.current = ''
    setTranscript('')
  }, [])

  return { transcript, listening, supported, startListening, stopListening, resetTranscript }
}

// ── Upload audio to Supabase Storage ─────────────────────────────────────
async function uploadAudio(blob: Blob, assessmentId: string, filename: string): Promise<string | null> {
  try {
    const path = `assessments/${assessmentId}/${filename}`
    const { error } = await supabase.storage
      .from('academy-audio')
      .upload(path, blob, { contentType: 'audio/webm', upsert: true })
    if (error) { console.error('Audio upload error:', error); return null }
    const { data: { publicUrl } } = supabase.storage.from('academy-audio').getPublicUrl(path)
    return publicUrl
  } catch (err) {
    console.error('Audio upload failed:', err)
    return null
  }
}

export default function PrimaryAssessmentClient({
  assessmentId, childName, yearGroupLabel,
}: Props) {
  const [section, setSection] = useState<Section>('device')
  const [deviceType, setDeviceType] = useState<DeviceType>(null)
  const [savingDevice, setSavingDevice] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const router = useRouter()

  const [readingPassage, setReadingPassage] = useState<{
    passage: string
    comprehension_questions: { question: string; answer: string; keywords: string[] }[]
  } | null>(null)
  const [wordList, setWordList] = useState<{ tracing_words: string[] } | null>(null)
  const [audioContent, setAudioContent] = useState<{
    questions: { id: number; question: string; keywords: string[]; hint?: string }[]
  } | null>(null)
  const [sentenceContent, setSentenceContent] = useState<{
    sentences: { id: number; prompt: string; hint: string; keywords: string[] }[]
  } | null>(null)

  const [readingScore, setReadingScore] = useState(0)
  const [readingWpm, setReadingWpm] = useState(0)
  const [readingTranscript, setReadingTranscript] = useState('')
  const [readingAudioUrl, setReadingAudioUrl] = useState<string | null>(null)
  const [uploadingAudio, setUploadingAudio] = useState(false)

  const [tracingScore, setTracingScore] = useState(0)
  const [tracingCompleted, setTracingCompleted] = useState(0)
  const [audioResponses, setAudioResponses] = useState<AudioResponse[]>([])
  const [sentenceResponses, setSentenceResponses] = useState<SentenceResponse[]>([])
  const [readingStartTime, setReadingStartTime] = useState(0)
  const [currentAudioQ, setCurrentAudioQ] = useState(0)
  const [currentSentenceQ, setCurrentSentenceQ] = useState(0)

  const speech = useSpeechRecognition()
  const recorder = useAudioRecorder()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tracingWord, setTracingWord] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tracingDone, setTracingDone] = useState<boolean[]>([])

  async function saveDeviceAndContinue(device: DeviceType) {
    setDeviceType(device)
    setSavingDevice(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({ device_type: device }).eq('id', user.id)
      }
    } catch (err) {
      console.error('Failed to save device type:', err)
    } finally {
      setSavingDevice(false)
      setSection('intro')
    }
  }

  async function loadContent() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/academy/assessment/primary?assessment_id=' + assessmentId)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReadingPassage(data.reading_passage)
      setWordList(data.word_list)
      setAudioContent(data.audio_questions)
      setSentenceContent(data.sentence_construction)
      if (data.word_list?.tracing_words) {
        setTracingDone(new Array(data.word_list.tracing_words.length).fill(false))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    setSection('submitting')
    try {
      const res = await fetch('/api/academy/assessment/primary/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_id: assessmentId,
          reading_score: readingScore,
          reading_wpm: readingWpm,
          reading_transcript: readingTranscript,
          reading_audio_url: readingAudioUrl,
          tracing_score: tracingScore,
          tracing_words_completed: tracingCompleted,
          audio_responses: audioResponses,
          sentence_responses: sentenceResponses,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/dashboard/academy/assessment/results?assessment_id=' + assessmentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setSection('sentence')
    }
  }

  // ── Canvas helpers with correct coordinate scaling ──────────────────────
  function getCanvasPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const pos = getCanvasPos(e, canvas)
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const pos = getCanvasPos(e, canvas)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#062850'; ctx.lineWidth = 4; ctx.lineCap = 'round'
    ctx.stroke()
  }

  function endDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    setIsDrawing(false)
  }

  function drawWordGuide() {
    const canvas = canvasRef.current; if (!canvas || !wordList) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const word = wordList.tracing_words[tracingWord] || ''
    ctx.font = 'bold 64px Arial'
    ctx.fillStyle = 'rgba(6,40,80,0.10)'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(word, canvas.width / 2, canvas.height / 2)
    ctx.strokeStyle = 'rgba(73,114,150,0.2)'; ctx.lineWidth = 1
    const lineY = canvas.height / 2 + 40
    ctx.beginPath(); ctx.moveTo(20, lineY); ctx.lineTo(canvas.width - 20, lineY); ctx.stroke()
  }

  function clearCanvas() {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    drawWordGuide()
  }

  useEffect(() => {
    if (section === 'tracing') {
      setTimeout(() => drawWordGuide(), 100)
    }
  }, [section, tracingWord, wordList])

  function markTracingDone() {
    const updated = [...tracingDone]
    updated[tracingWord] = true
    setTracingDone(updated)
    const completed = updated.filter(Boolean).length
    setTracingCompleted(completed)
    setTracingScore(Math.round((completed / (wordList?.tracing_words.length || 1)) * 100))
    if (tracingWord < (wordList?.tracing_words.length || 1) - 1) {
      setTracingWord(tracingWord + 1)
      setTimeout(() => clearCanvas(), 150)
    }
  }

  const sectionIcons = ['📖', '✏️', '🎤', '💬']
  const sectionIndex = { device: 0, intro: 0, reading: 0, tracing: 1, audio: 2, sentence: 3, submitting: 3 }[section]

  function SectionProgress({ current }: { current: number }) {
    return (
      <div className="flex items-center gap-2 mb-6">
        {sectionIcons.map((icon, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: i <= current ? '#062850' : '#E5E7EB', color: i <= current ? '#ffffff' : '#9CA3AF' }}>
              {i < current ? <CheckCircle className="w-4 h-4" /> : icon}
            </div>
            {i < 3 && <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: i < current ? '#062850' : '#E5E7EB' }} />}
          </div>
        ))}
        <p className="text-xs text-gray-500 ml-1">Section {current + 1} of 4</p>
      </div>
    )
  }

  // ── DEVICE SELECTION ─────────────────────────────────────────────────────
  if (section === 'device') return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6" style={{ backgroundColor: '#062850' }}>
            <h1 className="text-xl font-bold text-white mb-1">Before We Begin</h1>
            <p className="text-blue-300 text-sm">{childName} — {yearGroupLabel}</p>
          </div>
          <div className="px-8 py-8">
            <h2 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>What device are you using?</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              We will adapt the assessment to work best on your device. Your choice is saved so you do not need to select again next time.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { key: 'phone' as DeviceType, emoji: '📱', label: 'Phone', desc: 'Touchscreen, small screen' },
                { key: 'tablet' as DeviceType, emoji: '📟', label: 'Tablet', desc: 'Touchscreen, larger screen' },
                { key: 'laptop' as DeviceType, emoji: '💻', label: 'Laptop', desc: 'Keyboard and trackpad' },
                { key: 'desktop' as DeviceType, emoji: '🖥️', label: 'Desktop', desc: 'Keyboard and mouse' },
              ].map((device) => (
                <button key={String(device.key)}
                  onClick={() => !savingDevice && saveDeviceAndContinue(device.key)}
                  disabled={savingDevice}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all hover:shadow-md hover:border-[#497296]"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#ffffff' }}>
                  <span className="text-4xl">{device.emoji}</span>
                  <div className="text-center">
                    <p className="font-bold text-sm" style={{ color: '#062850' }}>{device.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{device.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            {savingDevice && (
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving your preference...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (section === 'intro') return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6" style={{ backgroundColor: '#062850' }}>
            <h1 className="text-xl font-bold text-white mb-1">Primary Baseline Assessment</h1>
            <p className="text-blue-300 text-sm">{childName} — {yearGroupLabel}</p>
          </div>
          <div className="px-8 py-8">
            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2"><AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /><p className="text-red-700 text-sm">{error}</p></div>}
            <div className="space-y-3 mb-6">
              {[
                { icon: '📖', title: 'Reading', desc: 'Read a short passage aloud. We record your voice and measure fluency and comprehension.' },
                { icon: '✏️', title: 'Tracing', desc: deviceType === 'phone' || deviceType === 'tablet' ? 'Trace words on screen with your finger or stylus.' : 'Trace words on screen using your mouse. Click and drag to draw.' },
                { icon: '🎤', title: 'Speaking', desc: 'Answer spoken questions into the microphone. Your voice is recorded for your teacher to review.' },
                { icon: '💬', title: 'Sentence Construction', desc: 'Complete sentence starters by speaking aloud. Your voice is recorded.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl mb-4 border" style={{ borderColor: '#F59E0B', backgroundColor: '#FFF8F0' }}>
              {deviceType === 'phone' || deviceType === 'tablet' ? (
                <><p className="text-xs font-semibold text-amber-800 mb-1">📱 Touch Device</p>
                <p className="text-xs text-amber-700">Great choice for tracing. Make sure your <strong>microphone is enabled</strong> in your browser settings.</p></>
              ) : (
                <><p className="text-xs font-semibold text-amber-800 mb-1">💻 Desktop/Laptop</p>
                <p className="text-xs text-amber-700">Use your <strong>mouse to trace</strong> words. Make sure your <strong>microphone is enabled</strong> in your browser settings.</p></>
              )}
            </div>
            <div className="flex items-start gap-3 mb-6 p-4 rounded-xl border-2" style={{ borderColor: '#497296', backgroundColor: '#EBF4FF' }}>
              <input type="checkbox" id="confirm" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 cursor-pointer flex-shrink-0" />
              <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                My microphone is working and I am ready to begin. I understand this assessment will record my voice and cannot be paused once started.
              </label>
            </div>
            <Button onClick={async () => { await loadContent(); setSection('reading') }}
              disabled={!confirmed || loading}
              className="w-full py-4 text-white font-bold text-base rounded-xl"
              style={{ backgroundColor: confirmed && !loading ? '#062850' : '#9CA3AF' }}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading...</> : 'Begin Assessment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── READING ───────────────────────────────────────────────────────────────
  if (section === 'reading' && readingPassage) return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-2xl mx-auto">
        <SectionProgress current={sectionIndex} />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
          <h2 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>📖 Reading Assessment</h2>
          <p className="text-xs text-gray-500 mb-4">
            Read the passage below <strong>aloud</strong> clearly and at your natural pace. Your voice will be recorded. Press <strong>Start Reading</strong> when ready, then <strong>Stop</strong> when you finish.
          </p>
          <div className="p-6 rounded-2xl mb-4 border-2 text-lg font-medium"
            style={{ borderColor: '#497296', backgroundColor: '#F0F6FB', color: '#062850', lineHeight: '2.2',
              fontSize: deviceType === 'phone' ? '1.1rem' : '1.2rem' }}>
            {readingPassage.passage}
          </div>
          <div className="flex items-center gap-3 mb-4">
            {!speech.listening ? (
              <Button onClick={async () => {
                setReadingStartTime(Date.now())
                speech.resetTranscript()
                await recorder.startRecording()
                speech.startListening()
              }} className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#16A34A' }}>
                <Mic className="w-4 h-4" /> Start Reading
              </Button>
            ) : (
              <Button onClick={async () => {
                const finalTranscript = speech.stopListening()
                setUploadingAudio(true)
                const blob = await recorder.stopRecording()
                const elapsed = (Date.now() - readingStartTime) / 60000
                const wordCount = readingPassage.passage.split(' ').length
                setReadingWpm(elapsed > 0 ? Math.round(wordCount / elapsed) : 0)
                setReadingTranscript(finalTranscript)
                const passageWords = readingPassage.passage.toLowerCase().split(/\s+/)
                const found = passageWords.filter(w => finalTranscript.toLowerCase().includes(w.replace(/[^a-z]/g, ''))).length
                setReadingScore(Math.round((found / passageWords.length) * 100))
                if (blob) {
                  const url = await uploadAudio(blob, assessmentId, 'reading.webm')
                  setReadingAudioUrl(url)
                }
                setUploadingAudio(false)
              }} className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#DC2626' }}>
                <Square className="w-4 h-4" /> Stop Reading
              </Button>
            )}
            {speech.listening && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Recording...
              </div>
            )}
            {uploadingAudio && (
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving audio...
              </div>
            )}
          </div>
          {speech.transcript && (
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p className="text-xs text-green-600 font-semibold mb-1">What we heard:</p>
              <p className="text-sm text-green-800 leading-relaxed">{speech.transcript}</p>
            </div>
          )}
          {readingAudioUrl && (
            <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ backgroundColor: '#EBF4FF' }}>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-blue-700 font-semibold">Audio recorded successfully. Your teacher will be able to listen to your reading.</p>
            </div>
          )}
          {!speech.supported && <p className="text-xs text-amber-600 mb-3">Speech recognition not supported. Please use Chrome or Safari on mobile.</p>}
        </div>
        <Button onClick={() => { speech.stopListening(); setSection('tracing') }}
          disabled={!readingTranscript && !readingAudioUrl}
          className="w-full py-3 text-white font-semibold rounded-xl"
          style={{ backgroundColor: readingTranscript || readingAudioUrl ? '#062850' : '#9CA3AF' }}>
          Next: Tracing <ChevronRight className="w-4 h-4 ml-1 inline" />
        </Button>
        {!readingTranscript && !readingAudioUrl && <p className="text-center text-xs text-gray-400 mt-2">Please complete the reading section first</p>}
      </div>
    </div>
  )

  // ── TRACING ───────────────────────────────────────────────────────────────
  if (section === 'tracing' && wordList) {
    const currentWord = wordList.tracing_words[tracingWord] || ''
    const canvasHeight = deviceType === 'phone' ? 150 : deviceType === 'tablet' ? 220 : 180

    return (
      <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-2xl mx-auto">
          <SectionProgress current={1} />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
            <h2 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>✏️ Tracing Assessment</h2>
            <p className="text-xs text-gray-500 mb-4">
              {deviceType === 'phone' || deviceType === 'tablet'
                ? 'Trace over each word using your finger or stylus. Follow the faint guide letters carefully.'
                : 'Trace over each word by clicking and dragging your mouse. Follow the faint guide letters carefully.'}
            </p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: '#062850' }}>Word {tracingWord + 1} of {wordList.tracing_words.length}:</span>
                <span className="text-2xl font-bold" style={{ color: '#497296' }}>{currentWord}</span>
              </div>
              <span className="text-xs text-gray-500">{tracingDone.filter(Boolean).length} done</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border-2 mb-4" style={{ borderColor: '#497296' }}>
              <canvas ref={canvasRef} width={560} height={canvasHeight}
                className="w-full bg-white"
                style={{ cursor: 'crosshair', touchAction: 'none' }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
            </div>
            <div className="flex gap-3 mb-4">
              <Button variant="outline" onClick={clearCanvas} className="flex items-center gap-2 rounded-xl">
                <RefreshCw className="w-4 h-4" /> Clear
              </Button>
              <Button onClick={markTracingDone}
                className="flex-1 flex items-center justify-center gap-2 text-white rounded-xl"
                style={{ backgroundColor: '#16A34A' }}>
                <CheckCircle className="w-4 h-4" />
                {tracingWord < wordList.tracing_words.length - 1 ? 'Done — Next Word' : 'Finish Tracing'}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {wordList.tracing_words.map((w, i) => (
                <span key={w + i} className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: tracingDone[i] ? '#F0FDF4' : i === tracingWord ? '#EBF4FF' : '#F0F6FB',
                    color: tracingDone[i] ? '#16A34A' : i === tracingWord ? '#497296' : '#9CA3AF',
                    border: i === tracingWord ? '1px solid #497296' : '1px solid transparent',
                  }}>
                  {tracingDone[i] ? '✓ ' : ''}{w}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={() => setSection('audio')}
            className="w-full py-3 text-white font-semibold rounded-xl" style={{ backgroundColor: '#062850' }}>
            Next: Speaking <ChevronRight className="w-4 h-4 ml-1 inline" />
          </Button>
        </div>
      </div>
    )
  }

  // ── AUDIO ─────────────────────────────────────────────────────────────────
  if (section === 'audio' && audioContent) {
    const q = audioContent.questions[currentAudioQ]
    const isLastQ = currentAudioQ >= audioContent.questions.length - 1
    const currentResponse = audioResponses.find(r => r.question_id === q.id)

    async function saveAudioResponse() {
      const finalTranscript = speech.stopListening()
      setUploadingAudio(true)
      const blob = await recorder.stopRecording()
      let audioUrl: string | null = null
      if (blob) {
        audioUrl = await uploadAudio(blob, assessmentId, `audio_q${q.id}.webm`)
      }
      const updated = audioResponses.filter(r => r.question_id !== q.id)
      updated.push({ question_id: q.id, question: q.question, transcript: finalTranscript, keywords: q.keywords, audio_url: audioUrl || undefined })
      setAudioResponses(updated)
      speech.resetTranscript()
      setUploadingAudio(false)
    }

    return (
      <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-2xl mx-auto">
          <SectionProgress current={2} />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
            <h2 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>🎤 Speaking Assessment</h2>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500">Question {currentAudioQ + 1} of {audioContent.questions.length}</p>
              <div className="flex gap-1">
                {audioContent.questions.map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: audioResponses.find(r => r.question_id === audioContent.questions[i].id) ? '#16A34A' : i === currentAudioQ ? '#497296' : '#E5E7EB' }} />
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl mb-4 text-center" style={{ backgroundColor: '#F0F6FB' }}>
              <p className="text-lg font-semibold leading-relaxed" style={{ color: '#062850' }}>{q.question}</p>
              {q.hint && <p className="text-xs text-gray-400 mt-2">{q.hint}</p>}
            </div>
            <div className="text-center mb-4">
              {speech.listening ? (
                <div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse"
                    style={{ backgroundColor: '#FEF2F2', border: '4px solid #DC2626' }}>
                    <Mic className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-semibold mb-2">Recording...</p>
                  {speech.transcript && <p className="text-xs text-gray-500 italic mb-3 leading-relaxed">"{speech.transcript}"</p>}
                  <Button onClick={saveAudioResponse} disabled={uploadingAudio}
                    className="flex items-center gap-2 text-white rounded-xl px-8 mx-auto"
                    style={{ backgroundColor: '#DC2626' }}>
                    {uploadingAudio ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Saving...</> : <><MicOff className="w-4 h-4" /> Stop Recording</>}
                  </Button>
                </div>
              ) : currentResponse ? (
                <div>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 font-semibold mb-1">Answer recorded!</p>
                  {currentResponse.audio_url && <p className="text-xs text-blue-600 mb-1">Audio saved for teacher review</p>}
                  <p className="text-xs text-gray-500 italic mb-3 leading-relaxed">"{currentResponse.transcript}"</p>
                  <Button variant="outline" onClick={async () => { speech.resetTranscript(); await recorder.startRecording(); speech.startListening() }}
                    className="flex items-center gap-2 rounded-xl px-4 mx-auto text-xs">
                    <RefreshCw className="w-3 h-3" /> Re-record
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: '#F0F6FB', border: '4px solid #497296' }}>
                    <Mic className="w-8 h-8" style={{ color: '#497296' }} />
                  </div>
                  <Button onClick={async () => { speech.resetTranscript(); await recorder.startRecording(); speech.startListening() }}
                    className="flex items-center gap-2 text-white rounded-xl px-8 mx-auto"
                    style={{ backgroundColor: '#497296' }}>
                    <Mic className="w-4 h-4" /> Tap to Speak
                  </Button>
                  {!speech.supported && <p className="text-xs text-amber-600 mt-2">Please use Chrome or Safari.</p>}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentAudioQ(Math.max(0, currentAudioQ - 1))} disabled={currentAudioQ === 0} className="rounded-xl px-6">Back</Button>
              <Button onClick={() => { if (!isLastQ) setCurrentAudioQ(currentAudioQ + 1); else setSection('sentence') }}
                disabled={!currentResponse}
                className="flex-1 text-white rounded-xl font-semibold" style={{ backgroundColor: '#062850' }}>
                {isLastQ ? 'Next: Sentences' : 'Next Question'} <ChevronRight className="w-4 h-4 ml-1 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── SENTENCE ──────────────────────────────────────────────────────────────
  if (section === 'sentence' && sentenceContent) {
    const s = sentenceContent.sentences[currentSentenceQ]
    const isLast = currentSentenceQ >= sentenceContent.sentences.length - 1
    const currentResp = sentenceResponses.find(r => r.sentence_id === s.id)

    async function saveSentenceResponse() {
      const finalTranscript = speech.stopListening()
      setUploadingAudio(true)
      const blob = await recorder.stopRecording()
      let audioUrl: string | null = null
      if (blob) {
        audioUrl = await uploadAudio(blob, assessmentId, `sentence_${s.id}.webm`)
      }
      const updated = sentenceResponses.filter(r => r.sentence_id !== s.id)
      updated.push({ sentence_id: s.id, prompt: s.prompt, transcript: finalTranscript, keywords: s.keywords, audio_url: audioUrl || undefined })
      setSentenceResponses(updated)
      speech.resetTranscript()
      setUploadingAudio(false)
    }

    return (
      <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-2xl mx-auto">
          <SectionProgress current={3} />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
            <h2 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>💬 Sentence Construction</h2>
            <p className="text-xs text-gray-500 mb-4">Sentence {currentSentenceQ + 1} of {sentenceContent.sentences.length}</p>
            <div className="p-6 rounded-2xl mb-4" style={{ backgroundColor: '#F0F6FB' }}>
              <p className="text-xs text-gray-500 mb-2">Complete this sentence starter:</p>
              <p className="text-2xl font-bold mb-2" style={{ color: '#062850' }}>{s.prompt}</p>
              <p className="text-xs text-gray-400 italic">{s.hint}</p>
            </div>
            <div className="text-center mb-4">
              {speech.listening ? (
                <div>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse"
                    style={{ backgroundColor: '#FEF2F2', border: '4px solid #DC2626' }}>
                    <Mic className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-semibold mb-2">Recording...</p>
                  {speech.transcript && <p className="text-xs text-gray-500 italic mb-3 leading-relaxed">"{speech.transcript}"</p>}
                  <Button onClick={saveSentenceResponse} disabled={uploadingAudio}
                    className="flex items-center gap-2 text-white rounded-xl px-6 mx-auto"
                    style={{ backgroundColor: '#DC2626' }}>
                    {uploadingAudio ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Saving...</> : <><MicOff className="w-4 h-4" /> Stop</>}
                  </Button>
                </div>
              ) : currentResp ? (
                <div>
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 font-semibold mb-1">Recorded!</p>
                  {currentResp.audio_url && <p className="text-xs text-blue-600 mb-1">Audio saved for teacher review</p>}
                  <p className="text-xs text-gray-500 italic mb-3">"{currentResp.transcript}"</p>
                  <Button variant="outline" onClick={async () => { speech.resetTranscript(); await recorder.startRecording(); speech.startListening() }}
                    className="flex items-center gap-2 rounded-xl px-4 mx-auto text-xs">
                    <RefreshCw className="w-3 h-3" /> Re-record
                  </Button>
                </div>
              ) : (
                <Button onClick={async () => { speech.resetTranscript(); await recorder.startRecording(); speech.startListening() }}
                  className="flex items-center gap-2 text-white rounded-xl px-8 mx-auto"
                  style={{ backgroundColor: '#497296' }}>
                  <Mic className="w-4 h-4" /> Speak Your Sentence
                </Button>
              )}
            </div>
            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 mb-3"><AlertCircle className="w-4 h-4 text-red-500 mt-0.5" /><p className="text-red-700 text-sm">{error}</p></div>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentSentenceQ(Math.max(0, currentSentenceQ - 1))} disabled={currentSentenceQ === 0} className="rounded-xl px-6">Back</Button>
              {!isLast ? (
                <Button onClick={() => setCurrentSentenceQ(currentSentenceQ + 1)} disabled={!currentResp}
                  className="flex-1 text-white rounded-xl font-semibold" style={{ backgroundColor: '#062850' }}>
                  Next Sentence <ChevronRight className="w-4 h-4 ml-1 inline" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}
                  className="flex-1 text-white rounded-xl font-semibold" style={{ backgroundColor: '#16A34A' }}>
                  <CheckCircle className="w-4 h-4 mr-2 inline" /> Submit Assessment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (section === 'submitting') return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#16A34A' }} />
        <p className="text-gray-600 font-medium">Submitting your assessment...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we save your results</p>
      </div>
    </div>
  )

  return null
}
