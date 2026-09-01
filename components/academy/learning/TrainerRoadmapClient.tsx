'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RoadmapView, { RoadmapTopic } from './RoadmapView'

interface Props {
  topics: RoadmapTopic[]
  childName: string
  childId: string
}

export default function TrainerRoadmapClient({ topics, childName, childId }: Props) {
  const [localTopics, setLocalTopics] = useState<RoadmapTopic[]>(topics)
  const router = useRouter()

  async function handleUpdateStatus(topicId: string, status: string, notes: string, cId: string) {
    const res = await fetch('/api/academy/roadmap/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topicId, status, notes, child_id: cId }),
    })
    if (res.ok) {
      setLocalTopics(prev => prev.map(t => {
        if (t.id === topicId) return { ...t, status: status as RoadmapTopic['status'], completed_at: status === 'completed' ? new Date().toISOString() : null }
        if (status === 'completed') {
          const updated = prev.find(p => p.id === topicId)
          if (updated && t.subject_code === updated.subject_code && t.topic_index === updated.topic_index + 1) {
            return { ...t, status: 'current' }
          }
        }
        return t
      }))
      router.refresh()
    }
  }

  return (
    <RoadmapView
      topics={localTopics}
      childName={childName}
      canEdit={true}
      onUpdateStatus={handleUpdateStatus}
      childId={childId}
    />
  )
}
