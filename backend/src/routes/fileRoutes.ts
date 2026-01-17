import { Router } from 'express'
import {
  getAllFiles,
  getFileById,
  createFile,
  registerFile,
  registerMultipleFiles,
  updateFile,
  deleteFile,
  searchFiles,
  setMetadata,
  addTag,
  removeTag
} from '../controllers/fileController'

const router = Router()

// File CRUD
router.get('/', getAllFiles)
router.get('/search', searchFiles)
router.get('/:id', getFileById)
router.post('/', createFile)
router.post('/register', registerFile)
router.post('/register-multiple', registerMultipleFiles)
router.put('/:id', updateFile)
router.delete('/:id', deleteFile)

// Metadata
router.post('/:id/metadata', setMetadata)

// Tags
router.post('/:id/tags', addTag)
router.delete('/:id/tags/:tag', removeTag)

export default router
