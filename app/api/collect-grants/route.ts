
// API endpoint to trigger grants data collection
// Can be called manually or by scheduled tasks

import { NextResponse } from 'next/server'
import { grantsCollector } from '@/lib/grants-collector'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes timeout

export async function POST() {
  try {
    console.log('🚀 Manual grants collection triggered via API')
    
    const startTime = Date.now()
    const results = await grantsCollector.collectGrants()
    const duration = Date.now() - startTime
    
    console.log(`⏱️  Collection completed in ${Math.round(duration / 1000)}s`)
    
    return NextResponse.json({
      success: results.success,
      processed: results.processed,
      errors: results.errors,
      duration: Math.round(duration / 1000),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Collection API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        processed: 0,
        errors: [`Collection failed: ${error}`],
        duration: 0,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// GET endpoint for checking collection status
export async function GET() {
  try {
    // Get latest collection stats
    const { db } = await import('@/lib/db')
    
    const [totalOpportunities, recentChanges] = await Promise.all([
      db.opportunity.count(),
      db.opportunityChange.findMany({
        where: {
          changeDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { changeDate: 'desc' },
        take: 10,
        include: {
          opportunity: {
            select: {
              title: true,
              agencyName: true
            }
          }
        }
      })
    ])
    
    return NextResponse.json({
      totalOpportunities,
      recentChanges: recentChanges.map((change: any) => ({
        type: change.changeType,
        date: change.changeDate,
        source: change.source,
        opportunity: {
          title: change.opportunity.title,
          agency: change.opportunity.agencyName
        }
      })),
      lastUpdated: recentChanges[0]?.changeDate || null
    })
    
  } catch (error) {
    console.error('❌ Status check error:', error)
    
    return NextResponse.json(
      { error: 'Failed to get collection status' },
      { status: 500 }
    )
  }
}
