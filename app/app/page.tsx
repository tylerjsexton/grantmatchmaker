
import { Suspense } from 'react'
import { SearchIcon, DollarSignIcon, CalendarIcon, BuildingIcon } from 'lucide-react'
import { GrantsListContainer } from '@/components/grants-list-container'
import { SearchFilters } from '@/components/search-filters'
import { StatsCards } from '@/components/stats-cards'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getGrantsStats() {
  try {
    const [totalGrants, totalFunding, agencies, activeGrants] = await Promise.all([
      db.opportunity.count(),
      db.opportunity.aggregate({
        _sum: {
          estimatedTotalFunding: true
        }
      }),
      db.opportunity.groupBy({
        by: ['agencyName'],
        _count: {
          agencyName: true
        }
      }),
      db.opportunity.count({
        where: {
          closeDate: {
            gte: new Date()
          },
          status: 'active'
        }
      })
    ])

    return {
      totalGrants,
      totalFunding: totalFunding?._sum?.estimatedTotalFunding || BigInt(0),
      totalAgencies: agencies?.length || 0,
      activeGrants
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalGrants: 0,
      totalFunding: BigInt(0),
      totalAgencies: 0,
      activeGrants: 0
    }
  }
}

export default async function HomePage() {
  const stats = await getGrantsStats()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
                <SearchIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Federal Grants Database
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Discover funding opportunities from government agencies
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Find Federal Grant <span className="text-blue-600">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access comprehensive federal grant information from agencies across the government. 
              Search by agency, funding amount, deadline, and category to find opportunities that match your needs.
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards 
            totalGrants={stats.totalGrants}
            totalFunding={stats.totalFunding}
            totalAgencies={stats.totalAgencies}
            activeGrants={stats.activeGrants}
          />
        </div>
      </section>

      {/* Search and Results Section */}
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Search Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Suspense fallback={
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                }>
                  <SearchFilters />
                </Suspense>
              </div>
            </div>

            {/* Grants List */}
            <div className="lg:col-span-3">
              <Suspense fallback={
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <GrantsListContainer />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
