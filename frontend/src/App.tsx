import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            ⚡ Electron + React
          </CardTitle>
          <CardDescription>
            With TailwindCSS & shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-4">
            <img src="/vite.svg" className="h-16 w-16" alt="Vite logo" />
            <img src="/electron.svg" className="h-16 w-16" alt="Electron logo" />
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-4xl font-bold">{count}</p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setCount(c => c - 1)}
              >
                Decrease
              </Button>
              <Button 
                onClick={() => setCount(c => c + 1)}
              >
                Increase
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Edit <code className="bg-muted px-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
