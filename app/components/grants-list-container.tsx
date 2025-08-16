
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { GrantCard } from '@/components/grant-card'
import { Button } from '@/components/ui/button'
import { LoaderIcon, AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Grant {
  id: string
  title: string
  description?: string | null
  agencyCode?: string | null
  agencyName?: string | null
  postDate?: string | null // API returns ISO string dates
  closeDate?: string | null // API returns ISO string dates
  estimatedTotalFunding?: string | null // API returns string
  awardCeiling?: string | null // API returns string
  opportunityCategory?: string | null
  fundingInstrumentType?: string | null
  categoryOfFundingActivity?: string | null
  status?: string | null
  contacts: Array<{
    contactEmail?: string | null
    contactName?: string | null
    contactPhone?: string | null
  }>
}

export function GrantsListContainer() {
  const searchParams = useSearchParams()
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchGrants(1) // Reset to first page when search params change
  }, [searchParams])

  const fetchGrants = async (pageNum: number) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams(searchParams?.toString() || '')
      params.set('page', pageNum.toString())
      params.set('limit', '10')

      const response = await fetch(`/api/grants?${params.toString()}`)
      
      if (!response?.ok) {
        throw new Error(`Failed to fetch grants: ${response?.status}`)
      }

      const data = await response.json()
      
      if (pageNum === 1) {
        setGrants(data?.grants || [])
      } else {
        setGrants(prev => [...(prev || []), ...(data?.grants || [])])
      }
      
      setHasMore(data?.hasMore || false)
      setPage(pageNum)
    } catch (err) {
      console.error('Error fetching grants:', err)
      setError(err instanceof Error ? err?.message : 'Failed to fetch grants')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchGrants(page + 1)
    }
  }

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <LoaderIcon className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading grant opportunities...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          {error}. Please try again or contact support if the problem persists.
        </AlertDescription>
      </Alert>
    )
  }

  if (!grants?.length) {
    return (
      <Alert>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertDescription>
          No grant opportunities found matching your criteria. Try adjusting your search filters.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Grant Opportunities ({grants?.length || 0} found)
        </h3>
      </div>

      <div className="space-y-6">
        {grants?.map((grant) => (
          <GrantCard key={grant?.id} grant={grant} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button 
            onClick={loadMore} 
            disabled={loading}
            variant="outline"
            size="lg"
          >
            {loading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Grants'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
