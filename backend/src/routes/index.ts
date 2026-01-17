import { Router } from 'express'
import videoRoutes from './videoRoutes'
import fileRoutes from './fileRoutes'

const router = Router()

router.use('/video', videoRoutes)
router.use('/files', fileRoutes)

export default router

