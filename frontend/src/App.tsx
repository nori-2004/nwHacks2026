import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { BentoGrid } from '@/components/BentoGrid'

function App() {
  const handleCreateNote = () => {
    console.log('Create new note')
  }

  const handleCreateFolder = () => {
    console.log('Create new folder')
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar 
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar onSearch={handleSearch} />

        {/* Content Area with Bento Grid */}
        <main className="flex-1 overflow-auto bg-background">
          <BentoGrid />
        </main>
      </div>
    </div>
  )
}

export default App
