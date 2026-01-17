import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { VideoGrid } from '@/components/VideoGrid'
import { UploadPanel } from '@/components/UploadPanel'
import { api } from '@/lib/api'
import type { FileRecord } from '@/lib/api'

function App() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'audio'>('all')

  const fetchFiles = async () => {
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
  }

  useEffect(() => {
    fetchFiles()
  }, [filter])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchFiles()
      return
    }
    setLoading(true)
    try {
      const result = await api.searchFiles({ q: query, keyword: query })
      if (result.success) {
        setFiles(result.files)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = () => {
    console.log('Create new note')
  }

  const handleCreateFolder = () => {
    console.log('Create new folder')
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
        onFilterChange={setFilter}
        currentFilter={filter}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar onSearch={handleSearch} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Upload Panel */}
            <UploadPanel onUploadComplete={fetchFiles} />

            {/* Video Grid */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {filter === 'all' ? 'All Files' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
                <span className="text-muted-foreground font-normal ml-2">({files.length})</span>
              </h2>
              <VideoGrid 
                files={files} 
                loading={loading} 
                onRefresh={fetchFiles} 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
