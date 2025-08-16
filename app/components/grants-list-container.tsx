
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const pageParam = searchParams?.get('page')
    const newPage = pageParam ? parseInt(pageParam) : 1
    setCurrentPage(newPage)
    fetchGrants(newPage)
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
      
      setGrants(data?.grants || [])
      setTotalPages(data?.totalPages || 1)
      setTotalCount(data?.total || 0)
      setCurrentPage(pageNum)
    } catch (err) {
      console.error('Error fetching grants:', err)
      setError(err instanceof Error ? err?.message : 'Failed to fetch grants')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return
    
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.set('page', newPage.toString())
    
    window.history.pushState(null, '', `?${params.toString()}`)
    fetchGrants(newPage)
  }

  if (loading && currentPage === 1) {
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
      {/* Header with results count */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Grant Opportunities
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalCount > 0 
              ? `Showing ${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalCount)} of ${totalCount} grants` 
              : 'No grants found'
            }
          </p>
        </div>
        {loading && currentPage > 1 && (
          <div className="flex items-center space-x-2">
            <LoaderIcon className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        )}
      </div>

      {/* Grants List */}
      <div className="space-y-6">
        {grants?.map((grant) => (
          <GrantCard key={grant?.id} grant={grant} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            
            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {currentPage > 2 && (
                <>
                  <Button
                    onClick={() => handlePageChange(1)}
                    disabled={loading}
                    variant="ghost"
                    size="sm"
                  >
                    1
                  </Button>
                  {currentPage > 3 && (
                    <span className="text-gray-400">...</span>
                  )}
                </>
              )}
              
              {currentPage > 1 && (
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                >
                  {currentPage - 1}
                </Button>
              )}
              
              <Button
                disabled={true}
                variant="default"
                size="sm"
              >
                {currentPage}
              </Button>
              
              {currentPage < totalPages && (
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                >
                  {currentPage + 1}
                </Button>
              )}
              
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="text-gray-400">...</span>
                  )}
                  <Button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={loading}
                    variant="ghost"
                    size="sm"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  )
}
