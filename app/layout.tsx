
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Federal Grants Database',
  description: 'Search and discover federal grant opportunities from across government agencies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
