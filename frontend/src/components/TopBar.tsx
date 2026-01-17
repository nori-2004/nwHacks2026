import { Button } from '@/components/ui/button'
import { 
  Search, 
  Plus, 
  FileText, 
  Image, 
  Video, 
  Music,
  SlidersHorizontal
} from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  onSearch?: (query: string) => void
}

export function TopBar({ onSearch }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <header className="h-14 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-9 pl-9 pr-4 rounded-md bg-secondary border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>
      </div>

      {/* Quick Create Actions */}
      <div className="flex items-center gap-2 ml-4">
        <div className="flex items-center border border-border rounded-md">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 rounded-none rounded-l-md border-r border-border"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 rounded-none border-r border-border"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 rounded-none border-r border-border"
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 rounded-none rounded-r-md"
          >
            <Music className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm" className="h-8">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>

        <Button size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>
    </header>
  )
}
