import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import routes from './routes'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is running' })
})

app.use('/api', routes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
