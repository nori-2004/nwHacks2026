import { Button } from '@/components/ui/button'
import { 
  X,
  Tag,
  Image,
  HardDrive
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'

interface ImageDetailPanelProps {
  file: FileRecord
  onClose: () => void
}

export function ImageDetailPanel({ file, onClose }: ImageDetailPanelProps) {
  const imageSrc = `media://${file.filepath.replace(/\\/g, '/')}`

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
          <Image className="h-5 w-5 text-green-500" />
          <h2 className="font-semibold truncate">{file.filename}</h2>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* Image Preview */}
        <div className="bg-secondary rounded-lg overflow-hidden">
          <img
            src={imageSrc}
            alt={file.filename}
            className="w-full h-auto object-contain max-h-80"
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
              Keywords ({file.keywords.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {file.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-green-500/10 text-green-700 dark:text-green-300 rounded-md text-xs"
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
