import { Router } from 'express'
import videoRoutes from './videoRoutes'
import audioRoutes from './audioRoutes'
import documentRoutes from './documentRoutes'
import fileRoutes from './fileRoutes'

const router = Router()

router.use('/video', videoRoutes)
router.use('/audio', audioRoutes)
router.use('/document', documentRoutes)
router.use('/files', fileRoutes)

export default router

