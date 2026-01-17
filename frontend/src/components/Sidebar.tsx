import { Button } from '@/components/ui/button'
import { 
  Plus, 
  FolderPlus, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Settings,
  Home,
  Star,
  Clock,
  Trash2
} from 'lucide-react'

interface SidebarProps {
  onCreateNote?: () => void
  onCreateFolder?: () => void
}

export function Sidebar({ onCreateNote, onCreateFolder }: SidebarProps) {
  return (
    <aside className="w-60 h-screen bg-secondary/50 border-r border-border flex flex-col">
      {/* Logo / Brand */}
      <div className="p-4 border-b border-border">
        <h1 className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">N</span>
          </div>
          Notebox
        </h1>
      </div>

      {/* Quick Actions */}
      <div className="p-3 space-y-1">
        <Button 
          onClick={onCreateNote}
          className="w-full justify-start gap-2 h-9 text-sm"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
        <Button 
          variant="ghost" 
          onClick={onCreateFolder}
          className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground"
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground px-2 py-2">
          Navigate
        </p>
        <Button variant="secondary" className="w-full justify-start gap-2 h-9 text-sm">
          <Home className="h-4 w-4" />
          Home
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <Star className="h-4 w-4" />
          Favorites
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <Clock className="h-4 w-4" />
          Recent
        </Button>

        <p className="text-xs font-medium text-muted-foreground px-2 py-2 mt-4">
          Content Types
        </p>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <FileText className="h-4 w-4" />
          Notes
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <Image className="h-4 w-4" />
          Images
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <Video className="h-4 w-4" />
          Videos
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <Music className="h-4 w-4" />
          Audio
        </Button>
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <Trash2 className="h-4 w-4" />
          Trash
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-sm text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  )
}
