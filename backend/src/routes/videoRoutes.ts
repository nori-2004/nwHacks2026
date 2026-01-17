import { Router } from 'express'
import { upload } from '../middleware/upload'
import { extractKeywords } from '../controllers/videoController'

const router = Router()

router.post('/keywords', upload.array('videos', 10), extractKeywords)

export default router
