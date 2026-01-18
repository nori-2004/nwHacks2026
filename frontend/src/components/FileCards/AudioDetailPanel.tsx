import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  X,
  Tag,
  Mic,
  HardDrive,
  Languages,
  Timer,
  MessageSquareText,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'

interface AudioDetailPanelProps {
  file: FileRecord
  onClose: () => void
}

export function AudioDetailPanel({ file, onClose }: AudioDetailPanelProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  const audioSrc = `media://${file.filepath.replace(/\\/g, '/')}`

  // Get metadata
  const transcription = file.metadata?.transcription
  const language = file.metadata?.language
  const fileDuration = file.metadata?.duration ? parseFloat(file.metadata.duration) : undefined

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration || fileDuration || 0)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [fileDuration])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(2)} KB`
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border shadow-xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-purple-500" />
          <h2 className="font-semibold truncate">{file.filename}</h2>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Audio Player */}
        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg p-6 space-y-4">
          <audio ref={audioRef} src={audioSrc} />
          
          {/* Waveform visualization */}
          <div className="flex items-center justify-center h-20">
            <div className="flex items-end gap-1 h-full">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 bg-purple-500/60 rounded-full transition-all duration-150 ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                  style={{ 
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 30}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
          </div>
        </div>

        {/* File Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            File Information
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Size</div>
            <div>{formatSize(file.size)}</div>
            <div className="text-muted-foreground">Type</div>
            <div>{file.mimetype}</div>
            {language && (
              <>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Languages className="h-3 w-3" /> Language
                </div>
                <div>{language.toUpperCase()}</div>
              </>
            )}
            {fileDuration && (
              <>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Timer className="h-3 w-3" /> Duration
                </div>
                <div>{formatTime(fileDuration)}</div>
              </>
            )}
            <div className="text-muted-foreground">Added</div>
            <div>{file.created_at ? new Date(file.created_at).toLocaleString() : 'Unknown'}</div>
          </div>
          <div className="text-xs text-muted-foreground break-all">
            {file.filepath}
          </div>
        </div>

        {/* Transcription */}
        {transcription && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <MessageSquareText className="h-4 w-4" />
              Transcription
            </h3>
            <div className="bg-secondary/50 rounded-lg p-3 max-h-48 overflow-y-auto">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {transcription}
              </p>
            </div>
          </div>
        )}

        {/* Keywords */}
        {file.keywords && file.keywords.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              AI Keywords ({file.keywords.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {file.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-md text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {file.tags && file.tags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {file.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
