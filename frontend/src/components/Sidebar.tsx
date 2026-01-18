import { Button } from '@/components/ui/button'
import { 
  Plus, 
  FolderPlus, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Settings,
  Star,
  Clock,
  Trash2,
  LayoutGrid
} from 'lucide-react'
import { type ContentType } from '@/App'

interface SidebarProps {
  onCreateNote?: () => void
  onCreateFolder?: () => void
  onFilterChange?: (filter: ContentType) => void
  currentFilter?: ContentType
}

export function Sidebar({ onCreateNote, onCreateFolder, onFilterChange, currentFilter = 'all' }: SidebarProps) {
  const handleFilterClick = (filter: ContentType) => {
    onFilterChange?.(filter)
  }

  return (
    <aside className="w-[240px] h-screen bg-secondary border-r border-border flex flex-col">
      {/* Logo / Brand */}
      <div className="h-12 px-4 border-b border-border flex items-center">
        <h1 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-[11px] font-bold">O</span>
          </div>
          Omni
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="p-2 space-y-0.5">
        <Button 
          onClick={onCreateNote}
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
        <Button 
          variant="ghost" 
          onClick={onCreateFolder}
          className="w-full justify-start gap-2 text-muted-foreground"
          size="sm"
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        <p className="text-[11px] font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wide">
          Navigate
        </p>
        <Button 
          variant={currentFilter === 'all' ? 'secondary' : 'ghost'} 
          className={`w-full justify-start gap-2 ${currentFilter !== 'all' ? 'text-muted-foreground' : ''}`}
          size="sm"
          onClick={() => handleFilterClick('all')}
        >
          <LayoutGrid className="h-4 w-4" />
          All Files
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" size="sm">
          <Star className="h-4 w-4" />
          Favorites
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" size="sm">
          <Clock className="h-4 w-4" />
          Recent
        </Button>

        <p className="text-[11px] font-medium text-muted-foreground px-2 py-1.5 mt-3 uppercase tracking-wide">
          Content Types
        </p>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" size="sm">
          <FileText className="h-4 w-4" />
          Notes
        </Button>
        <Button 
          variant={currentFilter === 'image' ? 'secondary' : 'ghost'} 
          className={`w-full justify-start gap-2 ${currentFilter !== 'image' ? 'text-muted-foreground' : ''}`}
          size="sm"
          onClick={() => handleFilterClick('image')}
        >
          <Image className="h-4 w-4" />
          Images
        </Button>
        <Button 
          variant={currentFilter === 'video' ? 'secondary' : 'ghost'} 
          className={`w-full justify-start gap-2 ${currentFilter !== 'video' ? 'text-muted-foreground' : ''}`}
          size="sm"
          onClick={() => handleFilterClick('video')}
        >
          <Video className="h-4 w-4" />
          Videos
        </Button>
        <Button 
          variant={currentFilter === 'audio' ? 'secondary' : 'ghost'} 
          className={`w-full justify-start gap-2 ${currentFilter !== 'audio' ? 'text-muted-foreground' : ''}`}
          size="sm"
          onClick={() => handleFilterClick('audio')}
        >
          <Music className="h-4 w-4" />
          Audio
        </Button>
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-border space-y-0.5">
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" size="sm">
          <Trash2 className="h-4 w-4" />
          Trash
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" size="sm">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  )
}
