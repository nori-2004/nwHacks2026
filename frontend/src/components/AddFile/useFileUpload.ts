import { useState, useRef, useCallback } from 'react'
import { api } from '@/lib/api'
import type { FileType, StatusType } from './types'
import { fileTypeConfig, isElectron } from './types'

interface UseFileUploadOptions {
  onComplete: () => void
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
    
    const hasNonVideo = browserFiles.some(f => !f.type.startsWith('video/')) ||
      (isElectron() && selectedFiles.some(f => {
        const ext = f.split('.').pop()?.toLowerCase()
        return !['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext || '')
      }))

    if (hasNonVideo && selectedType !== 'video') {
      setStatus({ type: 'error', message: 'AI analysis is currently only available for videos' })
      return
    }

    setLoading(true)
    setStatus({ type: 'info', message: 'Analyzing with AI... This may take a while.' })

    try {
      if (isElectron()) {
        const result = await api.processVideos(selectedFiles)
        if (result.success) {
          setStatus({ 
            type: 'success', 
            message: `Analyzed ${result.totalVideosProcessed} videos. Found ${result.combinedKeywordsArray.length} keywords.` 
          })
          setTimeout(() => {
            resetAndClose()
            onComplete()
          }, 1500)
        } else {
          setStatus({ type: 'error', message: 'Failed to analyze videos' })
        }
      } else {
        const result = await api.uploadAndProcessVideos(browserFiles)
        if (result.success) {
          setStatus({ type: 'success', message: `Analyzed ${result.totalVideosProcessed} videos` })
          setTimeout(() => {
            resetAndClose()
            onComplete()
          }, 1500)
        } else {
          setStatus({ type: 'error', message: 'Failed to analyze videos' })
        }
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setStatus({ type: 'error', message: 'Failed to analyze. Is the backend running?' })
    } finally {
      setLoading(false)
    }
  }, [selectedFiles, browserFiles, selectedType, resetAndClose, onComplete])

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
