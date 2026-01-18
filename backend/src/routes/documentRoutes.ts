import { Router } from 'express'
import { uploadDocument } from '../middleware/upload'
import { 
  processLocalDocument, 
  uploadDocumentOnly, 
  extractDocumentKeywords,
  getDocumentContent 
} from '../controllers/documentController'

const router = Router()

// Process documents from local filepaths (recommended for Electron - no file duplication)
router.post('/process', processLocalDocument)

// Upload documents only (for browser mode - copies files)
router.post('/upload', uploadDocument.array('documents', 10), uploadDocumentOnly)

// Upload and analyze documents with AI (for browser mode - copies files)
router.post('/keywords', uploadDocument.array('documents', 10), extractDocumentKeywords)

// Get document content by ID
router.get('/:id/content', getDocumentContent)

export default router
