interface BusinessGeneration {
  id: number
  name: string
  query: string
  isGenerated: boolean
  isGenerating: boolean
  isQueued: boolean
  city: string
  createdAt: number
  description: string
}

interface BusinessGenerationUpdatePayload {
  id: number
  is_generated?: boolean
  is_generating?: boolean
  is_queued?: boolean
}

export type {
  BusinessGeneration,
  BusinessGenerationUpdatePayload
}
