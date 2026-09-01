'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Loader2, CheckCircle, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#497296] transition-all'

interface ClassSlot {
  id: string; name: string; class_type: string
  days: string[]; start_time: string; end_time: string
  timezone: string; meet_link: string; max_students: number; is_active: boolean
}

export default function ClassSlotsPage() {
  const [slots, setSlots] = useState<ClassSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: '', class_type: 'general', days: ['Monday','Wednesday','Friday'],
    start_time: '17:00', end_time: '18:00', timezone: 'Africa/Lagos',
    meet_link: '', max_students: 20,
  })

  const loadSlots = useCallback(async () => {
    const { data } = await supabase.from('class_slots').select('*').order('created_at')
    setSlots(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadSlots() }, [loadSlots])

  function toggleDay(day: string) {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }))
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('class_slots').insert(form)
    if (!error) {
      setSuccess('Class slot created!')
      setShowForm(false)
      loadSlots()
      setTimeout(() => setSuccess(''), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#062850' }}>
            Class Slots
          </h1>
          <p className="text-gray-500 text-sm">
            Manage general class groups and their schedules.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-white rounded-xl"
          style={{ backgroundColor: '#062850' }}>
          <Plus className="w-4 h-4" /> Add Group
        </Button>
      </div>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-lg mb-5" style={{ color: '#062850' }}>New Class Group</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Group Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className={inputCls} placeholder="e.g. Group A" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Class Type</label>
                <select value={form.class_type} onChange={e => setForm({...form, class_type: e.target.value})}
                  className={inputCls}>
                  <option value="general">General (Standard)</option>
                  <option value="private">Private (Premium)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: form.days.includes(day) ? '#062850' : '#F0F6FB',
                      color: form.days.includes(day) ? '#ffffff' : '#497296',
                    }}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Time (WAT)</label>
                <input type="time" value={form.start_time}
                  onChange={e => setForm({...form, start_time: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">End Time (WAT)</label>
                <input type="time" value={form.end_time}
                  onChange={e => setForm({...form, end_time: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Google Meet Link</label>
              <input value={form.meet_link} onChange={e => setForm({...form, meet_link: e.target.value})}
                className={inputCls} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Max Students</label>
              <input type="number" value={form.max_students}
                onChange={e => setForm({...form, max_students: Number(e.target.value)})}
                className={inputCls} />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving || !form.name}
                className="flex items-center gap-2 text-white rounded-xl px-8"
                style={{ backgroundColor: '#062850' }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Create Group'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#497296' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map(slot => (
            <div key={slot.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between"
                style={{ backgroundColor: '#062850' }}>
                <div>
                  <p className="font-bold text-white">{slot.name}</p>
                  <p className="text-blue-300 text-xs capitalize">{slot.class_type} class</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: slot.is_active ? '#16A34A' : '#DC2626', color: '#ffffff' }}>
                  {slot.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#497296' }} />
                  <p className="text-sm" style={{ color: '#062850' }}>
                    {slot.days.join(', ')} at {slot.start_time} – {slot.end_time} WAT
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#497296' }} />
                  <p className="text-sm text-gray-500">Max {slot.max_students} students</p>
                </div>
                {slot.meet_link && (
                  <a href={slot.meet_link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
                    Join Class →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
