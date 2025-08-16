
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PlayCircle, Clock, Database, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/db'

interface CollectionResult {
  success: boolean
  processed: number
  errors: string[]
  duration: number
  timestamp: string
}

interface CollectionStatus {
  totalOpportunities: number
  recentChanges: Array<{
    type: string
    date: string
    source: string
    opportunity: {
      title: string
      agency: string
    }
  }>
  lastUpdated: string | null
}

export default function AdminPage() {
  const [isCollecting, setIsCollecting] = useState(false)
  const [lastResult, setLastResult] = useState<CollectionResult | null>(null)
  const [status, setStatus] = useState<CollectionStatus | null>(null)
  
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/collect-grants', { method: 'GET' })
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }
  
  const triggerCollection = async () => {
    setIsCollecting(true)
    setLastResult(null)
    
    try {
      const response = await fetch('/api/collect-grants', { method: 'POST' })
      const result = await response.json()
      setLastResult(result)
      
      // Refresh status after collection
      setTimeout(() => {
        fetchStatus()
      }, 1000)
    } catch (error) {
      setLastResult({
        success: false,
        processed: 0,
        errors: [`Network error: ${error}`],
        duration: 0,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsCollecting(false)
    }
  }
  
  // Fetch status on component mount
  useEffect(() => {
    fetchStatus()
  }, [])
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Grants Collection Admin</h1>
          <p className="text-muted-foreground">
            Manage automated federal grants data collection from grants.gov
          </p>
        </div>
        
        <Button
          onClick={triggerCollection}
          disabled={isCollecting}
          size="lg"
          className="min-w-[160px]"
        >
          {isCollecting ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Collecting...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Collect Now
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Database Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Database className="mr-2 h-5 w-5" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Grants:</span>
                  <Badge variant="secondary">
                    {status.totalOpportunities.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="text-sm text-muted-foreground">
                    {status.lastUpdated 
                      ? formatDate(new Date(status.lastUpdated))
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>
        
        {/* Last Collection Result */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              {lastResult?.success ? (
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              ) : lastResult?.success === false ? (
                <XCircle className="mr-2 h-5 w-5 text-red-500" />
              ) : (
                <Clock className="mr-2 h-5 w-5" />
              )}
              Last Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastResult ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={lastResult.success ? 'default' : 'destructive'}>
                    {lastResult.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Processed:</span>
                  <span>{lastResult.processed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{lastResult.duration}s</span>
                </div>
                {lastResult.errors.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-red-600 mb-1">Errors:</div>
                    {lastResult.errors.slice(0, 2).map((error, index) => (
                      <div key={index} className="text-xs text-red-600 break-words">
                        {error}
                      </div>
                    ))}
                    {lastResult.errors.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{lastResult.errors.length - 2} more errors
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">
                {isCollecting ? 'Collection in progress...' : 'No recent collections'}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Schedule Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Frequency:</span>
                <Badge variant="outline">Daily</Badge>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>5:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Source:</span>
                <span className="text-sm">grants.gov XML</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Changes */}
      {status?.recentChanges && status.recentChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Changes (Last 24 Hours)</CardTitle>
            <CardDescription>
              Latest updates to the grants database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {status.recentChanges.map((change, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge 
                    variant={change.type === 'new' ? 'default' : change.type === 'modified' ? 'secondary' : 'outline'}
                    className="mt-0.5 min-w-[70px] justify-center"
                  >
                    {change.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {change.opportunity.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {change.opportunity.agency} • {formatDate(new Date(change.date))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Separator />
      
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">To set up automatic daily collection:</h4>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">
                cd /home/ubuntu/federal_grants_app/app && chmod +x scripts/setup-cron.sh && ./scripts/setup-cron.sh
              </code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">To run collection manually:</h4>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">
                cd /home/ubuntu/federal_grants_app/app && npx tsx scripts/daily-collection.ts
              </code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">To view collection logs:</h4>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">
                tail -f /home/ubuntu/federal_grants_app/app/logs/daily-collection-$(date +%Y%m%d).log
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
