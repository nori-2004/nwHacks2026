import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useFileUpload } from './useFileUpload'
import { FileTypeMenu } from './FileTypeMenu'
import { SelectedFilesPanel } from './SelectedFilesPanel'
import ReactDOM from 'react-dom'
import { useEffect, useRef, useState } from 'react'

interface AddFileButtonProps {
  onComplete: () => void
}

export function AddFileButton({ onComplete }: AddFileButtonProps) {
  const {
    isOpen,
    setIsOpen,
    selectedType,
    selectedFiles,
    loading,
    status,
    fileInputRef,
    handleSelectType,
    handleBrowserFileChange,
    handleUploadOnly,
    handleAnalyzeWithAI,
    resetAndClose,
    removeFile,
    goBack
  } = useFileUpload({ onComplete })

  const [dropdownPos, setDropdownPos] = useState<{left: number, top: number} | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const DROPDOWN_WIDTH = 320
  const DROPDOWN_HEIGHT = 320 // estimate, can be improved

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      let left = rect.left
      let top = rect.bottom + 6 // 6px margin below button
      // Ensure dropdown doesn't overflow right edge
      if (left + DROPDOWN_WIDTH > window.innerWidth) {
        left = window.innerWidth - DROPDOWN_WIDTH - 16 // 16px margin from edge
      }
      // Ensure dropdown doesn't overflow bottom edge
      if (top + DROPDOWN_HEIGHT > window.innerHeight) {
        top = rect.top - DROPDOWN_HEIGHT - 6 // show above button
        if (top < 0) top = 16 // fallback to top margin
      }
      setDropdownPos({ left, top })
    }
  }, [isOpen])

  return (
    <div className="relative">
      {/* Hidden file input for browser mode */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleBrowserFileChange}
        className="hidden"
      />

      {/* Main Add Button */}
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1.5 h-7"
        size="sm"
        data-add-file-button
      >
        <Plus className="h-3.5 w-3.5" />
        Add Files
      </Button>

      {/* Dropdown Menu */}
      {isOpen && dropdownPos && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={resetAndClose}
          />
          {/* Menu Card in Portal, positioned below button and always visible */}
          {ReactDOM.createPortal(
            <Card style={{ position: 'fixed', left: dropdownPos.left, top: dropdownPos.top, width: DROPDOWN_WIDTH, zIndex: 100 }}>
              <div className="p-2">
                {/* Step 1: Choose file type */}
                {!selectedType && (
                  <FileTypeMenu onSelectType={handleSelectType} />
                )}

                {/* Step 2: Selected files & actions */}
                {selectedType && (
                  <SelectedFilesPanel
                    selectedType={selectedType}
                    selectedFiles={selectedFiles}
                    loading={loading}
                    status={status}
                    onGoBack={goBack}
                    onRemoveFile={removeFile}
                    onUploadOnly={handleUploadOnly}
                    onAnalyzeWithAI={handleAnalyzeWithAI}
                  />
                )}
              </div>
            </Card>,
            document.body
          )}
        </>
      )}
    </div>
  )
}
