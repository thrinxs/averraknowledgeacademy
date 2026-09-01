'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, MicOff, Square, CheckCircle, AlertCircle, ChevronRight, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  assessmentId: string
  childName: string
  yearGroupLabel: string
  yearGroupCode: string
}

type Section = 'intro' | 'reading' | 'tracing' | 'audio' | 'sentence' | 'submitting'

type AudioResponse = {
  question_id: number
  question: string
  transcript: string
  keywords: string[]
}

type SentenceResponse = {
  sentence_id: number
  prompt: string
  transcript: string
  keywords: string[]
}

function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const recRef = useRef<unknown>(null)

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
    recognition.onresult = (e: unknown) => {
      const ev = e as { results: Record<number, Record<number, { transcript: string }>>; resultIndex: number }
      let final = ''
      for (let i = ev.resultIndex; i < Object.keys(ev.results).length; i++) {
        final += ev.results[i][0].transcript
      }
      setTranscript(final)
    }
    recognition.onend = () => setListening(false)
    recognition.start()
    recRef.current = recognition
    setListening(true)
    setTranscript('')
  }, [])

  const stopListening = useCallback(() => {
    if (recRef.current) (recRef.current as { stop: () => void }).stop()
    setListening(false)
  }, [])

  return { transcript, listening, supported, startListening, stopListening, setTranscript }
}

export default function PrimaryAssessmentClient({
  assessmentId, childName, yearGroupLabel,
}: Props) {
  const [section, setSection] = useState<Section>('intro')
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
  const [tracingScore, setTracingScore] = useState(0)
  const [tracingCompleted, setTracingCompleted] = useState(0)
  const [audioResponses, setAudioResponses] = useState<AudioResponse[]>([])
  const [sentenceResponses, setSentenceResponses] = useState<SentenceResponse[]>([])
  const [readingStartTime, setReadingStartTime] = useState(0)
  const [currentAudioQ, setCurrentAudioQ] = useState(0)
  const [currentSentenceQ, setCurrentSentenceQ] = useState(0)

  const speech = useSpeechRecognition()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tracingWord, setTracingWord] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tracingDone, setTracingDone] = useState<boolean[]>([])

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

  function getCanvasPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const pos = getCanvasPos(e, canvas)
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const pos = getCanvasPos(e, canvas)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#062850'; ctx.lineWidth = 4; ctx.lineCap = 'round'
    ctx.stroke()
  }

  function endDraw() { setIsDrawing(false) }

  function drawWordGuide() {
    const canvas = canvasRef.current; if (!canvas || !wordList) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const word = wordList.tracing_words[tracingWord] || ''
    ctx.font = 'bold 72px Arial'
    ctx.fillStyle = 'rgba(6,40,80,0.08)'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(word, canvas.width / 2, canvas.height / 2)
    ctx.strokeStyle = 'rgba(73,114,150,0.15)'; ctx.lineWidth = 1
    const lineY = canvas.height / 2 + 36
    ctx.beginPath(); ctx.moveTo(20, lineY); ctx.lineTo(canvas.width - 20, lineY); ctx.stroke()
  }

  function clearCanvas() {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    drawWordGuide()
  }

  useEffect(() => {
    if (section === 'tracing' && canvasRef.current) drawWordGuide()
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
      setTimeout(() => clearCanvas(), 100)
    }
  }

  const sectionIcons = ['📖', '✏️', '🎤', '💬']
  const sectionIndex = { intro: 0, reading: 0, tracing: 1, audio: 2, sentence: 3, submitting: 3 }[section]

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

  if (section === 'intro') return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6" style={{ backgroundColor: '#062850' }}>
            <h1 className="text-xl font-bold text-white mb-1">Primary Baseline Assessment</h1>
            <p className="text-blue-300 text-sm">{childName} — {yearGroupLabel}</p>
          </div>
          <div className="px-8 py-8">
            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2"><AlertCircle className="w-4 h-4 text-red-500 mt-0.5" /><p className="text-red-700 text-sm">{error}</p></div>}
            <div className="space-y-3 mb-6">
              {[
                { icon: '📖', title: 'Reading', desc: 'Read a short passage aloud. We measure fluency and comprehension.' },
                { icon: '✏️', title: 'Tracing', desc: 'Trace words on screen with your finger or stylus.' },
                { icon: '🎤', title: 'Speaking', desc: 'Answer spoken questions using your microphone.' },
                { icon: '💬', title: 'Sentence Construction', desc: 'Complete sentence starters by speaking aloud.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F0F6FB' }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#062850' }}>{item.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl mb-4 border" style={{ borderColor: '#F59E0B', backgroundColor: '#FFF8F0' }}>
              <p className="text-xs font-semibold text-amber-800 mb-1">📱 Device Recommendation</p>
              <p className="text-xs text-amber-700">Use a <strong>tablet or phone</strong> for the best experience. Ensure your <strong>microphone is enabled</strong>.</p>
            </div>
            <div className="flex items-start gap-3 mb-6 p-4 rounded-xl border-2" style={{ borderColor: '#497296', backgroundColor: '#EBF4FF' }}>
              <input type="checkbox" id="confirm" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 w-4 h-4 cursor-pointer flex-shrink-0" />
              <label htmlFor="confirm" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                My microphone is working and I am ready to begin. I understand this cannot be paused once started.
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

  if (section === 'reading' && readingPassage) return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#F0F6FB' }}>
      <div className="max-w-2xl mx-auto">
        <SectionProgress current={0} />
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
          <h2 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>📖 Reading Assessment</h2>
          <p className="text-xs text-gray-500 mb-4">Read the passage below aloud clearly and at your natural pace. Press <strong>Start Reading</strong> when ready.</p>
          <div className="p-6 rounded-2xl mb-4 border-2 text-lg font-medium" style={{ borderColor: '#497296', backgroundColor: '#F0F6FB', color: '#062850', lineHeight: '2.2' }}>
            {readingPassage.passage}
          </div>
          <div className="flex items-center gap-3 mb-4">
            {!speech.listening ? (
              <Button onClick={() => { setReadingStartTime(Date.now()); speech.startListening() }}
                className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#16A34A' }}>
                <Mic className="w-4 h-4" /> Start Reading
              </Button>
            ) : (
              <Button onClick={() => {
                speech.stopListening()
                const elapsed = (Date.now() - readingStartTime) / 60000
                const wordCount = readingPassage.passage.split(' ').length
                setReadingWpm(elapsed > 0 ? Math.round(wordCount / elapsed) : 0)
                setReadingTranscript(speech.transcript)
                const passageWords = readingPassage.passage.toLowerCase().split(/\s+/)
                const found = passageWords.filter(w => speech.transcript.toLowerCase().includes(w.replace(/[^a-z]/g, ''))).length
                setReadingScore(Math.round((found / passageWords.length) * 100))
              }} className="flex items-center gap-2 text-white rounded-xl px-6" style={{ backgroundColor: '#DC2626' }}>
                <Square className="w-4 h-4" /> Stop Reading
              </Button>
            )}
            {speech.listening && <div className="flex items-center gap-2 text-green-600 text-sm font-medium"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Recording...</div>}
          </div>
          {speech.transcript && (
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <p className="text-xs text-green-600 font-semibold mb-1">What we heard:</p>
              <p className="text-sm text-green-800">{speech.transcript}</p>
            </div>
          )}
          {!speech.supported && <p className="text-xs text-amber-600">Speech recognition not supported. Please use Chrome or Safari on mobile.</p>}
        </div>
        <Button onClick={() => { speech.stopListening(); setSection('tracing') }}
          disabled={!readingTranscript}
          className="w-full py-3 text-white font-semibold rounded-xl"
          style={{ backgroundColor: readingTranscript ? '#062850' : '#9CA3AF' }}>
          Next: Tracing <ChevronRight className="w-4 h-4 ml-1 inline" />
        </Button>
        {!readingTranscript && <p className="text-center text-xs text-gray-400 mt-2">Please complete the reading section first</p>}
      </div>
    </div>
  )

  if (section === 'tracing' && wordList) {
    const currentWord = wordList.tracing_words[tracingWord] || ''
    return (
      <div className="min-h-screen px-4 py-8" style={{ backgroundColor: '#F0F6FB' }}>
        <div className="max-w-2xl mx-auto">
          <SectionProgress current={1} />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
            <h2 className="font-bold text-lg mb-2" style={{ color: '#062850' }}>✏️ Tracing Assessment</h2>
            <p className="text-xs text-gray-500 mb-4">Trace over each word using your finger or stylus. The word is shown faintly — trace over it carefully.</p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: '#062850' }}>Word {tracingWord + 1} of {wordList.tracing_words.length}:</span>
                <span className="text-2xl font-bold" style={{ color: '#497296' }}>{currentWord}</span>
              </div>
              <span className="text-xs text-gray-500">{tracingDone.filter(Boolean).length} done</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border-2 mb-4" style={{ borderColor: '#497296' }}>
              <canvas ref={canvasRef} width={560} height={200}
                className="w-full touch-none bg-white cursor-crosshair"
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
                <span key={w} className="text-xs px-2 py-1 rounded-full font-medium"
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
            className="w-full py-3 text-white font-semibold rounded-xl"
            style={{ backgroundColor: '#062850' }}>
            Next: Speaking <ChevronRight className="w-4 h-4 ml-1 inline" />
          </Button>
        </div>
      </div>
    )
  }

  if (section === 'audio' && audioContent) {
    const q = audioContent.questions[currentAudioQ]
    const isLastQ = currentAudioQ >= audioContent.questions.length - 1
    const currentResponse = audioResponses.find(r => r.question_id === q.id)

    function saveAudioResponse() {
      speech.stopListening()
      const updated = audioResponses.filter(r => r.question_id !== q.id)
      updated.push({ question_id: q.id, question: q.question, transcript: speech.transcript, keywords: q.keywords })
      setAudioResponses(updated)
      speech.setTranscript('')
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
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse" style={{ backgroundColor: '#FEF2F2', border: '4px solid #DC2626' }}>
                    <Mic className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-semibold mb-2">Recording...</p>
                  {speech.transcript && <p className="text-xs text-gray-500 italic mb-3">"{speech.transcript}"</p>}
                  <Button onClick={saveAudioResponse} className="flex items-center gap-2 text-white rounded-xl px-8 mx-auto" style={{ backgroundColor: '#DC2626' }}>
                    <MicOff className="w-4 h-4" /> Stop Recording
                  </Button>
                </div>
              ) : currentResponse ? (
                <div>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 font-semibold mb-1">Answer recorded!</p>
                  <p className="text-xs text-gray-500 italic mb-3">"{currentResponse.transcript}"</p>
                  <Button variant="outline" onClick={() => { speech.setTranscript(''); speech.startListening() }}
                    className="flex items-center gap-2 rounded-xl px-4 mx-auto text-xs">
                    <RefreshCw className="w-3 h-3" /> Re-record
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F0F6FB', border: '4px solid #497296' }}>
                    <Mic className="w-8 h-8" style={{ color: '#497296' }} />
                  </div>
                  <Button onClick={() => speech.startListening()} className="flex items-center gap-2 text-white rounded-xl px-8 mx-auto" style={{ backgroundColor: '#497296' }}>
                    <Mic className="w-4 h-4" /> Tap to Speak
                  </Button>
                  {!speech.supported && <p className="text-xs text-amber-600 mt-2">Microphone not supported. Please use Chrome or Safari.</p>}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentAudioQ(Math.max(0, currentAudioQ - 1))} disabled={currentAudioQ === 0} className="rounded-xl px-6">Back</Button>
              <Button onClick={() => { if (!isLastQ) setCurrentAudioQ(currentAudioQ + 1); else setSection('sentence') }}
                disabled={!currentResponse && speech.supported}
                className="flex-1 text-white rounded-xl font-semibold" style={{ backgroundColor: '#062850' }}>
                {isLastQ ? 'Next: Sentences' : 'Next Question'} <ChevronRight className="w-4 h-4 ml-1 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (section === 'sentence' && sentenceContent) {
    const s = sentenceContent.sentences[currentSentenceQ]
    const isLast = currentSentenceQ >= sentenceContent.sentences.length - 1
    const currentResp = sentenceResponses.find(r => r.sentence_id === s.id)

    function saveSentenceResponse() {
      speech.stopListening()
      const updated = sentenceResponses.filter(r => r.sentence_id !== s.id)
      updated.push({ sentence_id: s.id, prompt: s.prompt, transcript: speech.transcript, keywords: s.keywords })
      setSentenceResponses(updated)
      speech.setTranscript('')
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
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse" style={{ backgroundColor: '#FEF2F2', border: '4px solid #DC2626' }}>
                    <Mic className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-sm text-red-600 font-semibold mb-2">Recording...</p>
                  {speech.transcript && <p className="text-xs text-gray-500 italic mb-3">"{speech.transcript}"</p>}
                  <Button onClick={saveSentenceResponse} className="flex items-center gap-2 text-white rounded-xl px-6 mx-auto" style={{ backgroundColor: '#DC2626' }}>
                    <MicOff className="w-4 h-4" /> Stop
                  </Button>
                </div>
              ) : currentResp ? (
                <div>
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 font-semibold mb-1">Recorded!</p>
                  <p className="text-xs text-gray-500 italic mb-3">"{currentResp.transcript}"</p>
                  <Button variant="outline" onClick={() => { speech.setTranscript(''); speech.startListening() }} className="flex items-center gap-2 rounded-xl px-4 mx-auto text-xs">
                    <RefreshCw className="w-3 h-3" /> Re-record
                  </Button>
                </div>
              ) : (
                <Button onClick={() => speech.startListening()} className="flex items-center gap-2 text-white rounded-xl px-8 mx-auto" style={{ backgroundColor: '#497296' }}>
                  <Mic className="w-4 h-4" /> Speak Your Sentence
                </Button>
              )}
            </div>
            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 mb-3"><AlertCircle className="w-4 h-4 text-red-500 mt-0.5" /><p className="text-red-700 text-sm">{error}</p></div>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentSentenceQ(Math.max(0, currentSentenceQ - 1))} disabled={currentSentenceQ === 0} className="rounded-xl px-6">Back</Button>
              {!isLast ? (
                <Button onClick={() => setCurrentSentenceQ(currentSentenceQ + 1)} disabled={!currentResp && speech.supported}
                  className="flex-1 text-white rounded-xl font-semibold" style={{ backgroundColor: '#062850' }}>
                  Next Sentence <ChevronRight className="w-4 h-4 ml-1 inline" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1 text-white rounded-xl font-semibold" style={{ backgroundColor: '#16A34A' }}>
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
      </div>
    </div>
  )

  return null
}
