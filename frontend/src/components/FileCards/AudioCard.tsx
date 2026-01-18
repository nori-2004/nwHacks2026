import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  Trash2, 
  Tag,
  Clock,
  FileAudio,
  ChevronDown,
  ChevronUp,
  Mic,
  Languages,
  Timer,
  MessageSquareText
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'

interface AudioCardProps {
  file: FileRecord
  onDelete: (id: number) => void
  onSelect: (file: FileRecord) => void
}

export function AudioCard({ file, onDelete, onSelect }: AudioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  const [showTranscription, setShowTranscription] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Convert filepath to file:// URL for audio playback
  const audioSrc = `file://${file.filepath.replace(/\\/g, '/')}`

  // Get metadata
  const transcription = file.metadata?.transcription
  const language = file.metadata?.language
  const duration = file.metadata?.duration ? parseFloat(file.metadata.duration) : undefined

  return (
    <Card 
      className="group overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
      onClick={() => onSelect(file)}
    >
      {/* Audio Visual */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioSrc}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Waveform visualization placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-end gap-1 h-16">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-primary/60 rounded-full transition-all duration-150 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="icon"
            variant="secondary"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
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

        {/* Audio Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
          <Mic className="h-3 w-3" />
          Audio
        </div>

        {/* Duration Badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {formatDuration(duration)}
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Filename */}
        <h3 className="font-medium text-sm truncate" title={file.filename}>
          {file.filename}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileAudio className="h-3 w-3" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(file.created_at)}
          </span>
          {language && (
            <span className="flex items-center gap-1">
              <Languages className="h-3 w-3" />
              {language.toUpperCase()}
            </span>
          )}
        </div>

        {/* Transcription Toggle */}
        {transcription && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs w-full justify-between"
              onClick={(e) => {
                e.stopPropagation()
                setShowTranscription(!showTranscription)
              }}
            >
              <span className="flex items-center gap-1">
                <MessageSquareText className="h-3 w-3" />
                Transcription
              </span>
              {showTranscription ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            
            {showTranscription && (
              <div className="mt-2 p-2 bg-secondary/50 rounded text-xs max-h-24 overflow-y-auto">
                {transcription.length > 200 
                  ? transcription.substring(0, 200) + '...' 
                  : transcription}
              </div>
            )}
          </div>
        )}

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
                {file.keywords.slice(0, 8).map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
                {file.keywords.length > 8 && (
                  <span className="px-2 py-0.5 text-muted-foreground text-xs">
                    +{file.keywords.length - 8} more
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
