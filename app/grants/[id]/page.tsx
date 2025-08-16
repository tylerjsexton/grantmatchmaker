
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, DollarSign, Building2, Tag, Users, FileText, Mail, Phone, ExternalLink, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { db, formatFunding, formatDate, getOpportunityCategoryName, getFundingInstrumentName, getFundingActivityName } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

async function getGrant(id: string) {
  try {
    const grant = await db.opportunity.findUnique({
      where: { id },
      include: {
        contacts: true,
        changes: {
          orderBy: { changeDate: 'desc' },
          take: 5
        }
      }
    })
    return grant
  } catch (error) {
    console.error('Error fetching grant:', error)
    return null
  }
}

export default async function GrantDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const grant = await getGrant(resolvedParams.id)

  if (!grant) {
    notFound()
  }

  const isActive = grant?.closeDate ? new Date(grant?.closeDate) > new Date() : true
  const daysUntilClose = grant?.closeDate ? Math.ceil((new Date(grant?.closeDate)?.getTime() - new Date()?.getTime()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grant Details</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {grant?.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{grant?.agencyName || grant?.agencyCode}</span>
                      </div>
                      {grant?.opportunityNumber && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>#{grant?.opportunityNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={isActive ? "default" : "secondary"} className="text-lg px-3 py-1">
                      {isActive ? 'Active' : 'Closed'}
                    </Badge>
                    {isActive && daysUntilClose !== null && (
                      <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                        <Clock className="h-4 w-4" />
                        <span>{daysUntilClose > 0 ? `${daysUntilClose} days left` : 'Deadline today'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            {grant?.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Program Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {grant?.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Eligibility */}
            {grant?.additionalEligibilityInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Eligibility Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {grant?.additionalEligibilityInfo}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Contacts */}
            {grant?.contacts?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {grant?.contacts?.map((contact, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {contact?.contactName && (
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {contact?.contactName}
                        </h4>
                      )}
                      <div className="space-y-2">
                        {contact?.contactEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <a 
                              href={`mailto:${contact?.contactEmail}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {contact?.contactEmail}
                            </a>
                          </div>
                        )}
                        {contact?.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a 
                              href={`tel:${contact?.contactPhone}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {contact?.contactPhone}
                            </a>
                          </div>
                        )}
                        {contact?.contactText && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            {contact?.contactText}
                          </p>
                        )}
                        {contact?.additionalInfoUrl && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-gray-500" />
                            <a 
                              href={contact?.additionalInfoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Additional Information
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Funding Information */}
                {grant?.estimatedTotalFunding && Number(grant?.estimatedTotalFunding) > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Funding</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white pl-6">
                      {formatFunding(grant?.estimatedTotalFunding)}
                    </p>
                  </div>
                ) : null}

                {grant?.awardCeiling && Number(grant?.awardCeiling) > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Award</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white pl-6">
                      {formatFunding(grant?.awardCeiling)}
                    </p>
                  </div>
                ) : null}

                {grant?.awardFloor && Number(grant?.awardFloor) > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Min Award</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white pl-6">
                      {formatFunding(grant?.awardFloor)}
                    </p>
                  </div>
                ) : null}

                <Separator />

                {/* Dates */}
                {grant?.postDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Posted</span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white pl-6">
                      {formatDate(grant?.postDate)}
                    </p>
                  </div>
                )}

                {grant?.closeDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Application Deadline</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white pl-6">
                      {formatDate(grant?.closeDate)}
                    </p>
                  </div>
                )}

                {grant?.estimatedProjectStartDate && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Start</span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white pl-6">
                      {formatDate(grant?.estimatedProjectStartDate)}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Expected Awards */}
                {grant?.expectedNumberOfAwards && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected Awards</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white pl-6">
                      {grant?.expectedNumberOfAwards?.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Cost Sharing */}
                {grant?.costSharingRequired !== null && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost Sharing</span>
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white pl-6">
                      {grant?.costSharingRequired ? 'Required' : 'Not Required'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories & Classifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {grant?.opportunityCategory && (
                  <Badge variant="secondary" className="w-full justify-center">
                    {getOpportunityCategoryName(grant?.opportunityCategory)}
                  </Badge>
                )}
                {grant?.fundingInstrumentType && (
                  <Badge variant="outline" className="w-full justify-center">
                    {getFundingInstrumentName(grant?.fundingInstrumentType)}
                  </Badge>
                )}
                {grant?.categoryOfFundingActivity && (
                  <Badge variant="outline" className="w-full justify-center">
                    {getFundingActivityName(grant?.categoryOfFundingActivity)}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* CFDA Numbers */}
            {grant?.cfdaNumbers?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>CFDA Numbers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {grant?.cfdaNumbers?.map((cfda, index) => (
                      <Badge key={index} variant="outline">
                        {cfda}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
