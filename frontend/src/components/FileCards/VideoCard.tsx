import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  Trash2, 
  Tag,
  Clock,
  FileVideo,
  ChevronDown,
  ChevronUp,
  Film
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'

interface VideoCardProps {
  file: FileRecord
  onDelete: (id: number) => void
  onSelect: (file: FileRecord) => void
}

export function VideoCard({ file, onDelete, onSelect }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown'
    return new Date(dateStr).toLocaleDateString()
  }

  // Convert filepath to media:// URL for video playback (custom Electron protocol)
  const videoSrc = `media://${file.filepath.replace(/\\/g, '/')}`

  return (
    <Card 
      className="group overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
      onClick={() => onSelect(file)}
    >
      {/* Video Preview */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain"
          onEnded={() => setIsPlaying(false)}
          muted
        />
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-12 w-12 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          </Button>
        </div>

        {/* Delete Button */}
        <Button
          size="icon"
          variant="destructive"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(file.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Video Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
          <Film className="h-3 w-3" />
          Video
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Filename */}
        <h3 className="font-medium text-sm truncate" title={file.filename}>
          {file.filename}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileVideo className="h-3 w-3" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(file.created_at)}
          </span>
        </div>

        {/* Keywords Toggle */}
        {file.keywords && file.keywords.length > 0 && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs w-full justify-between"
              onClick={(e) => {
                e.stopPropagation()
                setShowKeywords(!showKeywords)
              }}
            >
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {file.keywords.length} keywords
              </span>
              {showKeywords ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            
            {showKeywords && (
              <div className="flex flex-wrap gap-1 mt-2">
                {file.keywords.slice(0, 10).map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
                {file.keywords.length > 10 && (
                  <span className="px-2 py-0.5 text-muted-foreground text-xs">
                    +{file.keywords.length - 10} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {file.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
