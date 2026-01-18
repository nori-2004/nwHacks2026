// API service for communicating with the backend

const API_BASE = 'http://localhost:3000/api'

export interface FileRecord {
  id: number
  filename: string
  filepath: string
  filetype: string
  size?: number
  mimetype?: string
  created_at?: string
  updated_at?: string
  metadata?: Record<string, string>
  keywords?: string[]
  tags?: string[]
  frameKeywords?: FrameKeyword[]
  keywordFrameMap?: Record<string, number[]>
}

export interface FrameKeyword {
  id: number
  file_id: number
  frame_index: number
  timestamp?: number
  keyword: string
  confidence?: number
}

export interface VideoProcessResult {
  success: boolean
  combinedKeywords: string
  combinedKeywordsArray: string[]
  videos: {
    filepath: string
    filename: string
    keywords: string
    keywordsArray: string[]
    framesAnalyzed: number
    frames: {
      frameIndex: number
      timestamp?: number
      keywords: string
      keywordsArray: string[]
    }[]
  }[]
  savedFiles: {
    id: number
    filename: string
    filepath: string
  }[]
  totalVideosProcessed: number
}

export interface AudioProcessResult {
  success: boolean
  combinedKeywords: string
  combinedKeywordsArray: string[]
  audioFiles: {
    filepath: string
    filename: string
    transcription: string
    keywords: string[]
    language?: string
    duration?: number
  }[]
  savedFiles: {
    id: number
    filename: string
    filepath: string
  }[]
  totalAudioProcessed: number
}

export interface DocumentProcessResult {
  success: boolean
  processed: number
  failed: number
  results: {
    filepath: string
    filename: string
    content: string
    summary: string
    keywords: string[]
    wordCount: number
    characterCount: number
  }[]
  errors?: { filepath: string; error: string }[]
}

export interface DocumentContentResult {
  success: boolean
  file: FileRecord
  content: string
  summary: string
  keywords: string[]
  wordCount: number
  characterCount: number
  documentType: string
}

// File operations
export const api = {
  // Get all files
  async getFiles(type?: string): Promise<{ success: boolean; files: FileRecord[] }> {
    const url = type ? `${API_BASE}/files?type=${type}` : `${API_BASE}/files`
    const res = await fetch(url)
    return res.json()
  },

  // Get single file with full metadata
  async getFile(id: number): Promise<{ success: boolean; file: FileRecord }> {
    const res = await fetch(`${API_BASE}/files/${id}`)
    return res.json()
  },

  // Register a local file (no copying)
  async registerFile(filepath: string, tags?: string[]): Promise<{ success: boolean; file: FileRecord }> {
    const res = await fetch(`${API_BASE}/files/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepath, tags })
    })
    return res.json()
  },

  // Register multiple files
  async registerMultipleFiles(filepaths: string[], tags?: string[]): Promise<{
    success: boolean
    registered: number
    failed: number
    results: { success: FileRecord[]; failed: { filepath: string; error: string }[] }
  }> {
    const res = await fetch(`${API_BASE}/files/register-multiple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepaths, tags })
    })
    return res.json()
  },

  // Process videos for keywords (AI analysis)
  async processVideos(filepaths: string[]): Promise<VideoProcessResult> {
    const res = await fetch(`${API_BASE}/video/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepaths })
    })
    return res.json()
  },

  // Upload files (browser mode) - uses FormData
  async uploadFiles(files: File[], fileType?: 'video' | 'image' | 'audio' | 'document'): Promise<{ success: boolean; files?: FileRecord[]; registered?: number }> {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    
    // Use type-specific endpoint if specified, otherwise use general upload
    const endpoint = fileType ? `${API_BASE}/files/upload/${fileType}` : `${API_BASE}/files/upload`
    
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    })
    return res.json()
  },

  // Upload and process videos (browser mode)
  async uploadAndProcessVideos(files: File[]): Promise<VideoProcessResult> {
    const formData = new FormData()
    files.forEach(file => formData.append('videos', file))
    
    const res = await fetch(`${API_BASE}/video/keywords`, {
      method: 'POST',
      body: formData
    })
    return res.json()
  },

  // Process audio files for keywords (AI analysis - Electron mode)
  async processAudio(filepaths: string[]): Promise<AudioProcessResult> {
    const res = await fetch(`${API_BASE}/audio/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepaths })
    })
    return res.json()
  },

  // Upload and process audio (browser mode)
  async uploadAndProcessAudio(files: File[]): Promise<AudioProcessResult> {
    const formData = new FormData()
    files.forEach(file => formData.append('audio', file))
    
    const res = await fetch(`${API_BASE}/audio/keywords`, {
      method: 'POST',
      body: formData
    })
    return res.json()
  },

  // Process documents for keywords (AI analysis - Electron mode)
  async processDocuments(filepaths: string[]): Promise<DocumentProcessResult> {
    console.log('Processing documents:', filepaths)
    const res = await fetch(`${API_BASE}/document/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepaths })
    })
    const data = await res.json()
    console.log('Document process result:', data)
    return data
  },

  // Upload and process documents (browser mode)
  async uploadAndProcessDocuments(files: File[]): Promise<DocumentProcessResult> {
    console.log('Uploading and processing documents:', files.map(f => f.name))
    const formData = new FormData()
    files.forEach(file => formData.append('documents', file))
    
    const res = await fetch(`${API_BASE}/document/keywords`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    console.log('Document upload result:', data)
    return data
  },

  // Get document content with analysis
  async getDocumentContent(id: number): Promise<DocumentContentResult> {
    const res = await fetch(`${API_BASE}/document/${id}/content`)
    return res.json()
  },

  // Search files
  async searchFiles(params: { q?: string; keyword?: string; tag?: string; includeFrames?: boolean }): Promise<{ success: boolean; files: FileRecord[] }> {
    const searchParams = new URLSearchParams()
    if (params.q) searchParams.set('q', params.q)
    if (params.keyword) searchParams.set('keyword', params.keyword)
    if (params.tag) searchParams.set('tag', params.tag)
    if (params.includeFrames) searchParams.set('includeFrames', 'true')
    
    const res = await fetch(`${API_BASE}/files/search?${searchParams}`)
    return res.json()
  },

  // Delete file
  async deleteFile(id: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/files/${id}`, { method: 'DELETE' })
    return res.json()
  },

  // Add tag
  async addTag(id: number, tag: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/files/${id}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    })
    return res.json()
  },

  // Remove tag
  async removeTag(id: number, tag: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/files/${id}/tags/${tag}`, { method: 'DELETE' })
    return res.json()
  }
}
