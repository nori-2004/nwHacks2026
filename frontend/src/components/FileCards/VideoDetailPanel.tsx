import { Button } from '@/components/ui/button'
import { 
  X,
  Tag,
  Film,
  Clock,
  HardDrive
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'

interface VideoDetailPanelProps {
  file: FileRecord
  onClose: () => void
}

export function VideoDetailPanel({ file, onClose }: VideoDetailPanelProps) {
  const videoSrc = `media://${file.filepath.replace(/\\/g, '/')}`

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
          <Film className="h-5 w-5 text-blue-500" />
          <h2 className="font-semibold truncate">{file.filename}</h2>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={videoSrc}
            className="w-full h-full object-contain"
            controls
          />
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
            <div className="text-muted-foreground">Added</div>
            <div>{file.created_at ? new Date(file.created_at).toLocaleString() : 'Unknown'}</div>
          </div>
          <div className="text-xs text-muted-foreground break-all">
            {file.filepath}
          </div>
        </div>

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
                  className="px-2.5 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Frame Keywords Map */}
        {file.keywordFrameMap && Object.keys(file.keywordFrameMap).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Keywords by Frame
            </h3>
            <p className="text-xs text-muted-foreground">
              Keywords detected at specific frames in the video
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {Object.entries(file.keywordFrameMap).map(([keyword, frames]) => (
                <div key={keyword} className="flex items-start justify-between gap-2 text-xs p-2 bg-secondary/50 rounded">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{keyword}</span>
                  <span className="text-muted-foreground text-right">
                    Frame{(frames as number[]).length > 1 ? 's' : ''}: {(frames as number[]).join(', ')}
                  </span>
                </div>
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
