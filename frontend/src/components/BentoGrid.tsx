import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  MoreHorizontal, 
  Star,
  FileText,
  Image as ImageIcon,
  Video,
  Music
} from 'lucide-react'
import { useState } from 'react'

// Types for different content items
interface BaseItem {
  id: string
  title: string
  createdAt: string
  isFavorite?: boolean
}

interface TextItem extends BaseItem {
  type: 'text'
  content: string
  tags?: string[]
}

interface ImageItem extends BaseItem {
  type: 'image'
  src: string
  alt?: string
}

interface VideoItem extends BaseItem {
  type: 'video'
  thumbnail: string
  duration: string
  src?: string
}

interface AudioItem extends BaseItem {
  type: 'audio'
  duration: string
  artist?: string
  waveform?: number[]
}

type ContentItem = TextItem | ImageItem | VideoItem | AudioItem

// Sample data for demonstration
const sampleItems: ContentItem[] = [
  {
    id: '1',
    type: 'text',
    title: 'Project Ideas',
    content: 'Brainstorming session notes for the new app design. We discussed multiple approaches including a modular component system and a plugin architecture...',
    createdAt: '2 hours ago',
    tags: ['ideas', 'design'],
    isFavorite: true
  },
  {
    id: '2',
    type: 'image',
    title: 'Design Mockup',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    alt: 'Abstract design',
    createdAt: '5 hours ago'
  },
  {
    id: '3',
    type: 'video',
    title: 'Tutorial Recording',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    duration: '12:34',
    createdAt: 'Yesterday'
  },
  {
    id: '4',
    type: 'audio',
    title: 'Voice Memo',
    duration: '3:45',
    artist: 'Recording Session',
    waveform: [0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.5, 0.7, 0.4],
    createdAt: 'Yesterday'
  },
  {
    id: '5',
    type: 'image',
    title: 'Inspiration Board',
    src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=500&fit=crop',
    alt: 'Colorful abstract art',
    createdAt: '2 days ago',
    isFavorite: true
  },
  {
    id: '6',
    type: 'text',
    title: 'Meeting Notes',
    content: 'Key takeaways from the client meeting: 1. Focus on user experience 2. Simplify the onboarding flow 3. Add dark mode support...',
    createdAt: '2 days ago',
    tags: ['meeting', 'client']
  },
  {
    id: '7',
    type: 'video',
    title: 'Product Demo',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    duration: '5:20',
    createdAt: '3 days ago'
  },
  {
    id: '8',
    type: 'audio',
    title: 'Podcast Episode',
    duration: '45:12',
    artist: 'Tech Talk Weekly',
    waveform: [0.4, 0.6, 0.7, 0.5, 0.8, 0.6, 0.9, 0.7, 0.5, 0.8, 0.4, 0.7, 0.6, 0.8, 0.5],
    createdAt: '3 days ago'
  }
]

// Individual card components for each type
function TextCard({ item }: { item: TextItem }) {
  return (
    <Card className="group h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-secondary">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">{item.createdAt}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'fill-foreground text-foreground' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="font-medium text-sm text-foreground mb-1.5">{item.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{item.content}</p>
        {item.tags && (
          <div className="flex gap-1.5 mt-3">
            {item.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ImageCard({ item }: { item: ImageItem }) {
  return (
    <Card className="group h-full overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={item.src} 
          alt={item.alt || item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/80 hover:bg-background">
            <Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'fill-foreground' : ''}`} />
          </Button>
          <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/80 hover:bg-background">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <div className="p-1.5 rounded-md bg-background/80">
            <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm text-foreground">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{item.createdAt}</p>
      </CardContent>
    </Card>
  )
}

function VideoCard({ item }: { item: VideoItem }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className="group h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.thumbnail} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Play button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center transition-transform hover:scale-105"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 text-foreground" />
          ) : (
            <Play className="h-4 w-4 text-foreground ml-0.5" />
          )}
        </button>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-background/80 text-foreground text-xs font-medium">
          {item.duration}
        </div>

        {/* Top icons */}
        <div className="absolute top-2 left-2">
          <div className="p-1.5 rounded-md bg-background/80">
            <Video className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/80 hover:bg-background">
            <Star className="h-3.5 w-3.5" />
          </Button>
          <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/80 hover:bg-background">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm text-foreground">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{item.createdAt}</p>
      </CardContent>
    </Card>
  )
}

function AudioCard({ item }: { item: AudioItem }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className="group h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-secondary">
              <Music className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">{item.createdAt}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Star className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="font-medium text-sm text-foreground mb-0.5">{item.title}</h3>
        {item.artist && (
          <p className="text-xs text-muted-foreground mb-3">{item.artist}</p>
        )}

        {/* Waveform visualization */}
        <div className="flex items-center gap-0.5 h-8 mb-3">
          {item.waveform?.map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-colors ${
                isPlaying ? 'bg-foreground' : 'bg-muted-foreground/30'
              }`}
              style={{ height: `${height * 100}%` }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-foreground hover:bg-foreground/90 flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 text-background" />
            ) : (
              <Play className="h-3.5 w-3.5 text-background ml-0.5" />
            )}
          </button>
          <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">{item.duration}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Bento Grid component
export function BentoGrid() {
  const renderItem = (item: ContentItem) => {
    switch (item.type) {
      case 'text':
        return <TextCard key={item.id} item={item} />
      case 'image':
        return <ImageCard key={item.id} item={item} />
      case 'video':
        return <VideoCard key={item.id} item={item} />
      case 'audio':
        return <AudioCard key={item.id} item={item} />
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Your Content</h2>
        <p className="text-sm text-muted-foreground">All your notes, images, videos and audio in one place</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* First row - mixed sizes */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          {renderItem(sampleItems[0])}
        </div>
        <div className="col-span-1">
          {renderItem(sampleItems[1])}
        </div>
        <div className="col-span-1">
          {renderItem(sampleItems[2])}
        </div>

        {/* Second row */}
        <div className="col-span-1">
          {renderItem(sampleItems[3])}
        </div>
        <div className="col-span-1 row-span-2">
          {renderItem(sampleItems[4])}
        </div>
        <div className="col-span-1 md:col-span-2">
          {renderItem(sampleItems[5])}
        </div>

        {/* Third row */}
        <div className="col-span-1">
          {renderItem(sampleItems[6])}
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          {renderItem(sampleItems[7])}
        </div>
      </div>
    </div>
  )
}
