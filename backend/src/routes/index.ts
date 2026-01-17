import { Router } from 'express'
import videoRoutes from './videoRoutes'

const router = Router()

router.use('/video', videoRoutes)

export default router
