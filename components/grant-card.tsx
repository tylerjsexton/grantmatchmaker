
'use client'

import { motion } from 'framer-motion'
import { Calendar, DollarSign, Building2, Tag, Mail, Phone, ExternalLink, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatFunding, formatDate, getOpportunityCategoryName, getFundingInstrumentName, getFundingActivityName } from '@/lib/db'

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

interface GrantCardProps {
  grant: Grant
}

export function GrantCard({ grant }: GrantCardProps) {
  const parseDate = (dateValue: Date | string | null | undefined): Date | null => {
    if (!dateValue) return null
    if (dateValue instanceof Date) return dateValue
    try {
      return new Date(dateValue)
    } catch {
      return null
    }
  }

  const closeDateObj = parseDate(grant?.closeDate)
  const isActive = closeDateObj ? closeDateObj > new Date() : true
  const daysUntilClose = closeDateObj ? Math.ceil((closeDateObj?.getTime() - new Date()?.getTime()) / (1000 * 60 * 60 * 24)) : null
  const primaryContact = grant?.contacts?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                {grant?.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{grant?.agencyName || grant?.agencyCode || 'Unknown Agency'}</span>
                </div>
                {grant?.categoryOfFundingActivity && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>{getFundingActivityName(grant?.categoryOfFundingActivity)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={isActive ? "default" : "secondary"} className="whitespace-nowrap">
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

        <CardContent className="space-y-4">
          {/* Description */}
          {grant?.description && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
              {grant?.description}
            </p>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
            {/* Funding Information */}
            {grant?.estimatedTotalFunding && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Funding</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatFunding(grant?.estimatedTotalFunding ? BigInt(grant?.estimatedTotalFunding) : null)}
                  </p>
                </div>
              </div>
            )}

            {/* Award Ceiling */}
            {grant?.awardCeiling && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Max Award</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatFunding(grant?.awardCeiling ? BigInt(grant?.awardCeiling) : null)}
                  </p>
                </div>
              </div>
            )}

            {/* Close Date */}
            {closeDateObj && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Application Deadline</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(closeDateObj)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {grant?.opportunityCategory && (
              <Badge variant="outline">
                {getOpportunityCategoryName(grant?.opportunityCategory)}
              </Badge>
            )}
            {grant?.fundingInstrumentType && (
              <Badge variant="outline">
                {getFundingInstrumentName(grant?.fundingInstrumentType)}
              </Badge>
            )}
          </div>

          {/* Contact Information */}
          {primaryContact && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                {primaryContact?.contactName && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Name:</strong> {primaryContact?.contactName}
                  </p>
                )}
                {primaryContact?.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`mailto:${primaryContact?.contactEmail}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {primaryContact?.contactEmail}
                    </a>
                  </div>
                )}
                {primaryContact?.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${primaryContact?.contactPhone}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {primaryContact?.contactPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1"
              onClick={() => window?.open?.(`/grants/${grant?.id}`, '_blank')}
            >
              View Full Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            {primaryContact?.contactEmail && (
              <Button 
                variant="outline"
                onClick={() => window?.open?.(`mailto:${primaryContact?.contactEmail}?subject=Inquiry about ${grant?.title}`, '_blank')}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
