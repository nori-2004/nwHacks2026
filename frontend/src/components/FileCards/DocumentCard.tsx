import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Trash2, 
  Clock,
  FileText,
  File,
  Sparkles
} from 'lucide-react'
import type { FileRecord } from '@/lib/api'

interface DocumentCardProps {
  file: FileRecord
  onDelete: (id: number) => void
  onSelect: (file: FileRecord) => void
}

export function DocumentCard({ file, onDelete, onSelect }: DocumentCardProps) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(1)} KB`
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown'
    return new Date(dateStr).toLocaleDateString()
  }

  const getExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE'
  }

  const getExtensionColor = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'txt': return 'bg-gray-500/20 text-gray-600'
      case 'md': return 'bg-purple-500/20 text-purple-600'
      default: return 'bg-secondary text-muted-foreground'
    }
  }

  // Get summary from metadata if available
  const summary = file.metadata?.summary

  return (
    <Card 
      className="group overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
      onClick={() => onSelect(file)}
    >
      {/* Document Visual */}
      <div className="relative aspect-video bg-gradient-to-br from-orange-500/10 to-yellow-500/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExtensionColor(file.filename)}`}>
            {getExtension(file.filename)}
          </span>
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

        {/* Document Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
          <File className="h-3 w-3" />
          Document
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
            <FileText className="h-3 w-3" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(file.created_at)}
          </span>
        </div>

        {/* Summary Preview */}
        {summary && (
          <div className="flex items-start gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
            <p className="line-clamp-2">{summary}</p>
          </div>
        )}

        {/* Keywords */}
        {file.keywords && file.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {file.keywords.slice(0, 5).map((keyword, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-orange-500/20 text-orange-700 dark:text-orange-300 rounded-full text-xs"
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
