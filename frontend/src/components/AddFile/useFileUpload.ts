import { useState, useRef, useCallback } from 'react'
import { api } from '@/lib/api'
import type { FileType, StatusType } from './types'
import { fileTypeConfig, isElectron } from './types'

interface UseFileUploadOptions {
  onComplete: () => void
}

// Helper to get file extension
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

// Helper to detect actual file type from files
function detectFileType(
  selectedType: FileType | null,
  selectedFiles: string[],
  browserFiles: File[]
): 'video' | 'audio' | 'document' | 'image' | null {
  // If user explicitly selected a type (not 'all'), use that
  if (selectedType && selectedType !== 'all') {
    return selectedType
  }

  // Otherwise, detect from file extensions
  const files = isElectron() ? selectedFiles : browserFiles.map(f => f.name)
  if (files.length === 0) return null

  const ext = getFileExtension(files[0])
  
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video'
  if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac', 'wma'].includes(ext)) return 'audio'
  if (['txt', 'md'].includes(ext)) return 'document'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  
  return null
}

export function useFileUpload({ onComplete }: UseFileUploadOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<FileType | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [browserFiles, setBrowserFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<StatusType>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetAndClose = useCallback(() => {
    setIsOpen(false)
    setSelectedType(null)
    setSelectedFiles([])
    setBrowserFiles([])
    setStatus(null)
  }, [])

  const handleSelectType = useCallback(async (type: FileType) => {
    setSelectedType(type)
    setStatus(null)
    
    if (isElectron()) {
      try {
        const config = fileTypeConfig[type]
        const files = await window.electronAPI!.openFiles({
          filters: [{ name: config.label, extensions: config.extensions }]
        })
        if (files && files.length > 0) {
          setSelectedFiles(files)
        } else {
          setSelectedType(null)
        }
      } catch (error) {
        console.error('Failed to open file dialog:', error)
        setStatus({ type: 'error', message: 'Failed to open file dialog' })
      }
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.accept = fileTypeConfig[type].accept
        fileInputRef.current.click()
      }
    }
  }, [])

  const handleBrowserFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      setBrowserFiles(fileArray)
      setSelectedFiles(fileArray.map(f => f.name))
    }
    e.target.value = ''
  }, [])

  const handleUploadOnly = useCallback(async () => {
    if (selectedFiles.length === 0) return
    
    setLoading(true)
    setStatus({ type: 'info', message: 'Uploading files...' })

    try {
      if (isElectron()) {
        const result = await api.registerMultipleFiles(selectedFiles)
        if (result.success) {
          setStatus({ type: 'success', message: `Added ${result.registered} files` })
          setTimeout(() => {
            resetAndClose()
            onComplete()
          }, 1000)
        } else {
          setStatus({ type: 'error', message: 'Failed to add files' })
        }
      } else {
        // Map FileType to API file type (exclude 'all' and 'document' -> undefined for general upload)
        const apiFileType = selectedType === 'all' ? undefined : 
                           selectedType === 'document' ? 'document' : 
                           selectedType as 'video' | 'image' | 'audio' | 'document' | undefined
        const result = await api.uploadFiles(browserFiles, apiFileType)
        if (result.success) {
          setStatus({ type: 'success', message: `Uploaded ${result.registered || result.files?.length || 0} files` })
          setTimeout(() => {
            resetAndClose()
            onComplete()
          }, 1000)
        } else {
          setStatus({ type: 'error', message: 'Failed to upload files' })
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      setStatus({ type: 'error', message: 'Failed to upload. Is the backend running?' })
    } finally {
      setLoading(false)
    }
  }, [selectedFiles, browserFiles, selectedType, resetAndClose, onComplete])

  const handleAnalyzeWithAI = useCallback(async () => {
    if (selectedFiles.length === 0) return
    
    // Detect file type
    const detectedType = detectFileType(selectedType, selectedFiles, browserFiles)
    console.log('Analyze - Selected type:', selectedType, 'Detected type:', detectedType, 'Files:', selectedFiles)
    
    if (!detectedType || detectedType === 'image') {
      setStatus({ type: 'error', message: 'AI analysis is available for videos, audio, and documents (.txt, .md)' })
      return
    }

    setLoading(true)
    setStatus({ type: 'info', message: `Analyzing ${detectedType} with AI... This may take a while.` })

    try {
      if (detectedType === 'document') {
        await analyzeDocuments()
      } else if (detectedType === 'audio') {
        await analyzeAudio()
      } else if (detectedType === 'video') {
        await analyzeVideos()
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setStatus({ type: 'error', message: 'Failed to analyze. Is the backend running?' })
    } finally {
      setLoading(false)
    }
  }, [selectedFiles, browserFiles, selectedType, resetAndClose, onComplete])

  // Analyze documents helper
  const analyzeDocuments = useCallback(async () => {
    if (isElectron()) {
      const result = await api.processDocuments(selectedFiles)
      if (result.success) {
        const totalKeywords = result.results.reduce((acc, r) => acc + r.keywords.length, 0)
        setStatus({ 
          type: 'success', 
          message: `Analyzed ${result.processed} documents. Found ${totalKeywords} keywords.` 
        })
        setTimeout(() => { resetAndClose(); onComplete() }, 1500)
      } else {
        setStatus({ type: 'error', message: 'Failed to analyze documents' })
      }
    } else {
      const result = await api.uploadAndProcessDocuments(browserFiles)
      if (result.success) {
        setStatus({ type: 'success', message: `Analyzed ${result.processed} documents` })
        setTimeout(() => { resetAndClose(); onComplete() }, 1500)
      } else {
        setStatus({ type: 'error', message: 'Failed to analyze documents' })
      }
    }
  }, [selectedFiles, browserFiles, resetAndClose, onComplete])

  // Analyze audio helper
  const analyzeAudio = useCallback(async () => {
    if (isElectron()) {
      const result = await api.processAudio(selectedFiles)
      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: `Analyzed ${result.totalAudioProcessed} audio files. Found ${result.combinedKeywordsArray.length} keywords.` 
        })
        setTimeout(() => { resetAndClose(); onComplete() }, 1500)
      } else {
        setStatus({ type: 'error', message: 'Failed to analyze audio' })
      }
    } else {
      const result = await api.uploadAndProcessAudio(browserFiles)
      if (result.success) {
        setStatus({ type: 'success', message: `Analyzed ${result.totalAudioProcessed} audio files` })
        setTimeout(() => { resetAndClose(); onComplete() }, 1500)
      } else {
        setStatus({ type: 'error', message: 'Failed to analyze audio' })
      }
    }
  }, [selectedFiles, browserFiles, resetAndClose, onComplete])

  // Analyze videos helper
  const analyzeVideos = useCallback(async () => {
    if (isElectron()) {
      const result = await api.processVideos(selectedFiles)
      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: `Analyzed ${result.totalVideosProcessed} videos. Found ${result.combinedKeywordsArray.length} keywords.` 
        })
        setTimeout(() => { resetAndClose(); onComplete() }, 1500)
      } else {
        setStatus({ type: 'error', message: 'Failed to analyze videos' })
      }
    } else {
      const result = await api.uploadAndProcessVideos(browserFiles)
      if (result.success) {
        setStatus({ type: 'success', message: `Analyzed ${result.totalVideosProcessed} videos` })
        setTimeout(() => { resetAndClose(); onComplete() }, 1500)
      } else {
        setStatus({ type: 'error', message: 'Failed to analyze videos' })
      }
    }
  }, [selectedFiles, browserFiles, resetAndClose, onComplete])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index))
    setBrowserFiles(files => files.filter((_, i) => i !== index))
  }, [])

  const goBack = useCallback(() => {
    setSelectedType(null)
    setSelectedFiles([])
    setBrowserFiles([])
    setStatus(null)
  }, [])

  return {
    isOpen,
    setIsOpen,
    selectedType,
    selectedFiles,
    loading,
    status,
    fileInputRef,
    handleSelectType,
    handleBrowserFileChange,
    handleUploadOnly,
    handleAnalyzeWithAI,
    resetAndClose,
    removeFile,
    goBack
  }
}
