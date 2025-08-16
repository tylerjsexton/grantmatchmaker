
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '')
  const [agency, setAgency] = useState(searchParams?.get('agency') || 'all')
  const [category, setCategory] = useState(searchParams?.get('category') || 'all')
  const [fundingType, setFundingType] = useState(searchParams?.get('fundingType') || 'all')
  const [minFunding, setMinFunding] = useState([parseInt(searchParams?.get('minFunding') || '0')])
  const [maxFunding, setMaxFunding] = useState([parseInt(searchParams?.get('maxFunding') || '100000000')])
  const [status, setStatus] = useState(searchParams?.get('status') || 'all')

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('search', searchQuery)
    if (agency !== 'all') params.set('agency', agency)
    if (category !== 'all') params.set('category', category)
    if (fundingType !== 'all') params.set('fundingType', fundingType)
    if (minFunding[0] > 0) params.set('minFunding', minFunding[0].toString())
    if (maxFunding[0] < 100000000) params.set('maxFunding', maxFunding[0].toString())
    if (status !== 'all') params.set('status', status)
    
    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setAgency('all')
    setCategory('all') 
    setFundingType('all')
    setMinFunding([0])
    setMaxFunding([100000000])
    setStatus('all')
    router.push('/')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Search & Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Grants</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              type="text"
              placeholder="Search by title, description, or agency..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Agency Filter */}
        <div className="space-y-2">
          <Label>Agency</Label>
          <Select value={agency} onValueChange={setAgency}>
            <SelectTrigger>
              <SelectValue placeholder="Select Agency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agencies</SelectItem>
              <SelectItem value="EPA">Environmental Protection Agency</SelectItem>
              <SelectItem value="NSF">National Science Foundation</SelectItem>
              <SelectItem value="USDA">Department of Agriculture</SelectItem>
              <SelectItem value="DOT">Department of Transportation</SelectItem>
              <SelectItem value="HHS">Health and Human Services</SelectItem>
              <SelectItem value="DOE">Department of Energy</SelectItem>
              <SelectItem value="HUD">Housing and Urban Development</SelectItem>
              <SelectItem value="NEA">National Endowment for the Arts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Funding Activity</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="EJ">Environmental Quality</SelectItem>
              <SelectItem value="ED">Education</SelectItem>
              <SelectItem value="AG">Agriculture</SelectItem>
              <SelectItem value="TR">Transportation</SelectItem>
              <SelectItem value="HL">Health</SelectItem>
              <SelectItem value="EN">Energy</SelectItem>
              <SelectItem value="HO">Housing</SelectItem>
              <SelectItem value="AR">Arts</SelectItem>
              <SelectItem value="ST">Science and Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Funding Type Filter */}
        <div className="space-y-2">
          <Label>Funding Type</Label>
          <Select value={fundingType} onValueChange={setFundingType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="G">Grant</SelectItem>
              <SelectItem value="CA">Cooperative Agreement</SelectItem>
              <SelectItem value="PC">Procurement Contract</SelectItem>
              <SelectItem value="O">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Funding Range */}
        <div className="space-y-4">
          <Label>Funding Range</Label>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-gray-600">Minimum: ${minFunding[0]?.toLocaleString() || '0'}</Label>
              <Slider
                value={minFunding}
                onValueChange={setMinFunding}
                max={50000000}
                step={100000}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Maximum: ${maxFunding[0]?.toLocaleString() || '100,000,000'}</Label>
              <Slider
                value={maxFunding}
                onValueChange={setMaxFunding}
                max={100000000}
                step={1000000}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSearch} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={clearFilters} size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
