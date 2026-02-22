'use client'

import { ContentEditor } from '@/components/content/content-editor'
import type { Platform } from '@/types'

export default function CreateContentPage() {
  function handleSaveDraft(content: string, platforms: Platform[]) {
    // TODO: POST to /api/content with status: 'draft'
    console.log('Save draft:', { content, platforms })
  }

  function handleSchedule(content: string, platforms: Platform[]) {
    // TODO: Open schedule modal
    console.log('Schedule:', { content, platforms })
  }

  function handlePublish(content: string, platforms: Platform[]) {
    // TODO: POST to /api/content with status: 'publishing'
    console.log('Publish:', { content, platforms })
  }

  return (
    <ContentEditor
      onSaveDraft={handleSaveDraft}
      onSchedule={handleSchedule}
      onPublish={handlePublish}
    />
  )
}
