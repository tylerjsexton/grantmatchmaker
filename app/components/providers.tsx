
'use client'

import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface ProvidersProps {
  children: React.ReactNode
  session?: any
}

export function Providers({ children, session }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" />
  }

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
