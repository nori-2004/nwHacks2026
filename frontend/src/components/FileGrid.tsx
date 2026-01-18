import { useState } from 'react'
import { 
  Loader2,
  Files
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'
import { api } from '@/lib/api'
import { 
  VideoCard, 
  AudioCard, 
  ImageCard, 
  DocumentCard,
  VideoDetailPanel,
  AudioDetailPanel,
  ImageDetailPanel,
  DocumentEditor
} from './FileCards'

interface FileGridProps {
  files: FileRecord[]
  loading?: boolean
  onRefresh: () => void
}

export function FileGrid({ files, loading, onRefresh }: FileGridProps) {
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null)
  const [detailedFile, setDetailedFile] = useState<FileRecord | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [documentEditorFile, setDocumentEditorFile] = useState<FileRecord | null>(null)

  const handleSelect = async (file: FileRecord) => {
    // For documents, open full-screen editor instead of sidebar
    if (file.filetype === 'document' || file.filetype === 'text') {
      setDocumentEditorFile(file)
      return
    }

    setSelectedFile(file)
    setLoadingDetails(true)
    try {
      const result = await api.getFile(file.id)
      if (result.success) {
        setDetailedFile(result.file)
      }
    } catch (error) {
      console.error('Failed to load file details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    try {
      await api.deleteFile(id)
      onRefresh()
      if (selectedFile?.id === id) {
        setSelectedFile(null)
        setDetailedFile(null)
      }
      if (documentEditorFile?.id === id) {
        setDocumentEditorFile(null)
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const closeDetail = () => {
    setSelectedFile(null)
    setDetailedFile(null)
  }

  const closeDocumentEditor = () => {
    setDocumentEditorFile(null)
  }

  // Render the appropriate card based on file type
  const renderCard = (file: FileRecord) => {
    const props = {
      file,
      onDelete: handleDelete,
      onSelect: handleSelect
    }

    switch (file.filetype) {
      case 'video':
        return <VideoCard key={file.id} {...props} />
      case 'audio':
        return <AudioCard key={file.id} {...props} />
      case 'image':
        return <ImageCard key={file.id} {...props} />
      case 'document':
      case 'text':
        return <DocumentCard key={file.id} {...props} />
      default:
        return <DocumentCard key={file.id} {...props} />
    }
  }

  // Render the appropriate detail panel based on file type (not for documents)
  const renderDetailPanel = () => {
    if (!selectedFile || !detailedFile) return null

    const props = {
      file: detailedFile,
      onClose: closeDetail
    }

    if (loadingDetails) {
      return (
        <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border shadow-xl z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    // Documents use full-screen editor, not sidebar
    switch (detailedFile.filetype) {
      case 'video':
        return <VideoDetailPanel {...props} />
      case 'audio':
        return <AudioDetailPanel {...props} />
      case 'image':
        return <ImageDetailPanel {...props} />
      case 'document':
      case 'text':
        return null // Handled by DocumentEditor
      default:
        return null
    }
  }

  // Get empty state icon and message
  const getEmptyState = () => {
    return {
      icon: Files,
      title: 'No files yet',
      subtitle: 'Add files to get started'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (files.length === 0) {
    const emptyState = getEmptyState()
    const Icon = emptyState.icon
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Icon className="h-12 w-12 mb-4" />
        <p>{emptyState.title}</p>
        <p className="text-sm">{emptyState.subtitle}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* File Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map(renderCard)}
      </div>

      {/* Detail Panel (for non-document files) */}
      {selectedFile && renderDetailPanel()}

      {/* Full-screen Document Editor */}
      {documentEditorFile && (
        <DocumentEditor
          file={documentEditorFile}
          onClose={closeDocumentEditor}
          onSave={() => {
            onRefresh()
          }}
        />
      )}
    </div>
  )
}
