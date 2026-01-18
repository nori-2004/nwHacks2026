import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Trash2, 
  Clock,
  FileImage as FileImageIcon,
  Image
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'

interface ImageCardProps {
  file: FileRecord
  onDelete: (id: number) => void
  onSelect: (file: FileRecord) => void
}

export function ImageCard({ file, onDelete, onSelect }: ImageCardProps) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown'
    return new Date(dateStr).toLocaleDateString()
  }

  // Convert filepath to file:// URL for image display
  const imageSrc = `file://${file.filepath.replace(/\\/g, '/')}`

  return (
    <Card 
      className="group overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
      onClick={() => onSelect(file)}
    >
      {/* Image Preview */}
      <div className="relative aspect-video bg-secondary">
        <img
          src={imageSrc}
          alt={file.filename}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />

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

        {/* Image Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
          <Image className="h-3 w-3" />
          Image
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
            <FileImageIcon className="h-3 w-3" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(file.created_at)}
          </span>
        </div>

        {/* Keywords */}
        {file.keywords && file.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {file.keywords.slice(0, 5).map((keyword, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-xs"
              >
                {keyword}
              </span>
            ))}
            {file.keywords.length > 5 && (
              <span className="px-2 py-0.5 text-muted-foreground text-xs">
                +{file.keywords.length - 5} more
              </span>
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
