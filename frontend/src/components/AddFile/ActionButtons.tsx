import { Button } from '@/components/ui/button'
import { Upload, Sparkles, Loader2 } from 'lucide-react'
import type { FileType } from './types'

interface ActionButtonsProps {
  loading: boolean
  selectedType: FileType
  onUploadOnly: () => void
  onAnalyzeWithAI: () => void
}

export function ActionButtons({ 
  loading, 
  selectedType, 
  onUploadOnly, 
  onAnalyzeWithAI 
}: ActionButtonsProps) {
  // AI analysis is available for videos, audio, and documents
  const isAISupported = selectedType === 'video' || selectedType === 'audio' || selectedType === 'document'
  const isAIDisabled = loading || !isAISupported

  return (
    <div className="space-y-2 pt-2 border-t border-border">
      <Button
        variant="secondary"
        size="sm"
        className="w-full justify-start gap-2"
        onClick={onUploadOnly}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        Add to Library
      </Button>
      
      <Button
        size="sm"
        className="w-full justify-start gap-2"
        onClick={onAnalyzeWithAI}
        disabled={isAIDisabled}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        Analyze with AI
        {!isAISupported && (
          <span className="text-xs text-muted-foreground ml-auto">(images not supported)</span>
        )}
      </Button>
    </div>
  )
}
