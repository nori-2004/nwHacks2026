import { Request, Response } from 'express'
import fs from 'fs'
import SemanticVideoClient from 'semantic-video'

const apiKey = process.env.OPENAI_API_KEY || ''

export const extractKeywords = async (req: Request, res: Response) => {
  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key not configured' })
    return
  }

  const files = req.files as Express.Multer.File[]

  if (!files || files.length === 0) {
    res.status(400).json({ error: 'No video files uploaded' })
    return
  }

  // Map files to their paths for cleanup later
  const filePaths = files.map(f => f.path)

  try {
    // Initialize client with concurrency settings:
    // - 3 videos processed simultaneously
    // - 5 frames analyzed concurrently per video
    const client = new SemanticVideoClient(
      apiKey,
      { enabled: false },
      3,
      10
    )

    // Prepare video configs for batch processing
    const videoConfigs = files.map(file => ({
      videoPath: file.path,
      numPartitions: 10,
      prompt: 'List only the main keywords that describe what you see in this frame. Output ONLY comma-separated keywords, nothing else. Example: person, car, street, daytime, walking'
    }))

    // Process all videos concurrently using built-in batch processing
    const allResults = await client.analyzeMultipleVideos(videoConfigs)

    // Extract keywords from all videos
    // Each result has: videoPath, frames (array), tokensUsed
    const videoResults = allResults.map((result, index) => {
      const allKeywords = new Set<string>()

      // Get keywords per frame
      const framesWithKeywords = result.frames.map((frame: { description?: string; timestamp?: number }, frameIndex: number) => {
        const frameKeywords = frame.description
          ? frame.description
              .split(',')
              .map((k: string) => k.trim().toLowerCase())
              .filter((k: string) => k.length > 0 && k.length < 50)
          : []

        frameKeywords.forEach((k: string) => allKeywords.add(k))

        return {
          frameIndex,
          timestamp: frame.timestamp,
          keywords: frameKeywords.join(', '),
          keywordsArray: frameKeywords
        }
      })

      const keywordsArray = Array.from(allKeywords)

      return {
        filename: files[index].originalname,
        keywords: keywordsArray.join(', '),
        keywordsArray,
        framesAnalyzed: result.frames.length,
        frames: framesWithKeywords
      }
    })

    // Combine all keywords from all videos
    const combinedKeywords = new Set<string>()
    videoResults.forEach(r => r.keywordsArray.forEach(k => combinedKeywords.add(k)))

    // Clean up all uploaded files
    filePaths.forEach(path => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path)
      }
    })

    res.json({
      success: true,
      combinedKeywords: Array.from(combinedKeywords).join(', '),
      combinedKeywordsArray: Array.from(combinedKeywords),
      videos: videoResults,
      totalVideosProcessed: videoResults.length
    })

  } catch (error) {
    // Clean up all uploaded files on error
    filePaths.forEach(path => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path)
      }
    })

    console.error('Video processing error:', error)
    res.status(500).json({
      error: 'Failed to process videos',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}