
import { SearchIcon, DollarSignIcon, CalendarIcon, BuildingIcon } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  // Mock stats for now - will be replaced with real data once database is connected
  const stats = {
    totalGrants: 1245,
    totalFunding: BigInt(15000000000), // $15B mock data
    totalAgencies: 26,
    activeGrants: 892
  }

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/grants" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100 group-hover:scale-110 transition-transform">
                  <BuildingIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Opportunities</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalGrants.toLocaleString()}</p>
                <p className="text-xs text-gray-500">View all grant opportunities</p>
              </div>
            </Link>

            <Link href="/grants" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100 group-hover:scale-110 transition-transform">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Grants</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stats.activeGrants.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Currently accepting applications</p>
              </div>
            </Link>

            <Link href="/grants" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100 group-hover:scale-110 transition-transform">
                  <DollarSignIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Funding</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">$15.0B+</p>
                <p className="text-xs text-gray-500">Browse by funding amount</p>
              </div>
            </Link>

            <Link href="/grants" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-indigo-100 group-hover:scale-110 transition-transform">
                  <SearchIcon className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Federal Agencies</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalAgencies.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Browse by agency</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Click on any of the summary cards above to explore grant opportunities. 
              Use the search and filtering tools to find grants that match your specific needs.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Search & Filter</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Use advanced filters to find grants by agency, funding amount, deadline, and category
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Track Deadlines</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Monitor application deadlines and get detailed information about each opportunity
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <DollarSignIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Find Funding</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Discover funding opportunities from federal agencies across various categories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
