import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { VideoGrid } from '@/components/VideoGrid'
import { api } from '@/lib/api'
import type { FileRecord } from '@/lib/api'
import { useDebounce } from '@/hooks/useDebounce'

export type ContentType = 'all' | 'video' | 'image' | 'audio'

function App() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ContentType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Debounce search for performance (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const result = await api.getFiles(filter === 'all' ? undefined : filter)
      if (result.success) {
        setFiles(result.files)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  // Fetch files when filter changes
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      fetchFiles()
    }
  }, [filter, debouncedSearchQuery, fetchFiles])

  // Handle debounced search
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        return // fetchFiles is called in the other effect
      }
      setLoading(true)
      try {
        const result = await api.searchFiles({ q: debouncedSearchQuery, keyword: debouncedSearchQuery })
        if (result.success) {
          setFiles(result.files)
        }
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedSearchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilter: ContentType) => {
    setFilter(newFilter)
  }

  const handleCreateNote = () => {
    console.log('Create new note')
  }

  const handleCreateFolder = () => {
    console.log('Create new folder')
  }

  // Command Palette actions
  const handleUpload = () => {
    // Click the add file button programmatically
    const addButton = document.querySelector('[data-add-file-button]') as HTMLButtonElement
    addButton?.click()
  }

  const handleProcessAI = async () => {
    if (files.length === 0) {
      console.log('No files to process')
      return
    }
    setIsProcessing(true)
    try {
      // Process video files with AI
      const videoFiles = files.filter(f => f.filetype === 'video')
      if (videoFiles.length > 0) {
        const filepaths = videoFiles.map(f => f.filepath)
        const result = await api.processVideos(filepaths)
        if (result.success) {
          console.log('AI processing complete:', result)
          fetchFiles() // Refresh to show updated data
        }
      } else {
        console.log('No video files to process')
      }
    } catch (error) {
      console.error('AI processing failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddTags = () => {
    // For now, log action - could open a tag modal
    console.log('Add tags action triggered')
    // TODO: Implement tag modal
  }

  const handleOpenFolder = async () => {
    // Check if running in Electron
    if (typeof window !== 'undefined' && window.electronAPI) {
      try {
        const folders = await window.electronAPI.openFolder()
        if (folders && folders.length > 0) {
          console.log('Selected folder:', folders[0])
          // TODO: Process folder contents
        }
      } catch (error) {
        console.error('Failed to open folder:', error)
      }
    } else {
      console.log('Open folder only available in Electron')
    }
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
        onFilterChange={handleFilterChange}
        currentFilter={filter}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          onSearch={handleSearch}
          onUpload={handleUpload}
          onProcessAI={handleProcessAI}
          onAddTags={handleAddTags}
          onOpenFolder={handleOpenFolder}
          onFilesAdded={fetchFiles}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Processing with AI...</span>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {debouncedSearchQuery.trim() 
                  ? `Results for "${debouncedSearchQuery}"`
                  : filter === 'all' 
                    ? 'All Files' 
                    : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`
                }
                <span className="text-muted-foreground font-normal ml-2">({files.length})</span>
              </h2>
            </div>

            {/* File Grid */}
            <VideoGrid 
              files={files} 
              loading={loading} 
              onRefresh={fetchFiles} 
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
