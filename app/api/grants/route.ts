
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const search = searchParams.get('search') || ''
    const agency = searchParams.get('agency') || 'all'
    const category = searchParams.get('category') || 'all'
    const fundingType = searchParams.get('fundingType') || 'all'
    const status = searchParams.get('status') || 'all'
    const minFunding = parseInt(searchParams.get('minFunding') || '0')
    const maxFunding = parseInt(searchParams.get('maxFunding') || '999999999')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Build where clause
    const where: any = {}
    
    // Search filter
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          agencyName: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }
    
    // Agency filter
    if (agency !== 'all') {
      where.agencyCode = agency
    }
    
    // Category filter
    if (category !== 'all') {
      where.categoryOfFundingActivity = category
    }
    
    // Funding type filter
    if (fundingType !== 'all') {
      where.fundingInstrumentType = fundingType
    }
    
    // Status filter
    if (status !== 'all') {
      if (status === 'active') {
        where.AND = [
          ...(where.AND || []),
          {
            closeDate: {
              gte: new Date()
            }
          },
          {
            status: 'active'
          }
        ]
      } else {
        where.status = status
      }
    }
    
    // Funding range filter
    if (minFunding > 0 || maxFunding < 999999999) {
      where.estimatedTotalFunding = {
        gte: BigInt(minFunding),
        lte: BigInt(maxFunding)
      }
    }
    
    // Calculate offset
    const offset = (page - 1) * limit
    
    // Fetch grants with pagination
    const [grants, totalCount] = await Promise.all([
      db.opportunity.findMany({
        where,
        include: {
          contacts: {
            select: {
              contactName: true,
              contactEmail: true,
              contactPhone: true
            }
          }
        },
        orderBy: [
          { closeDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: limit
      }),
      db.opportunity.count({ where })
    ])
    
    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages
    
    // Convert BigInt values to strings for JSON serialization
    const serializedGrants = grants.map(grant => ({
      ...grant,
      estimatedTotalFunding: grant.estimatedTotalFunding?.toString() || null,
      awardCeiling: grant.awardCeiling?.toString() || null,
      awardFloor: grant.awardFloor?.toString() || null
    }))
    
    return NextResponse.json({
      grants: serializedGrants,
      total: totalCount,
      totalPages,
      currentPage: page,
      hasMore
    })
    
  } catch (error) {
    console.error('Error fetching grants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grants' },
      { status: 500 }
    )
  }
}
