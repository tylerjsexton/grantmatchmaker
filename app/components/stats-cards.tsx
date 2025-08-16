
'use client'

import { motion } from 'framer-motion'
import { DollarSignIcon, CalendarIcon, BuildingIcon, FileTextIcon } from 'lucide-react'
import { formatFunding } from '@/lib/db'

interface StatsCardsProps {
  totalGrants: number
  totalFunding: bigint
  totalAgencies: number  
  activeGrants: number
}

export function StatsCards({ totalGrants, totalFunding, totalAgencies, activeGrants }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Opportunities',
      value: totalGrants.toLocaleString(),
      icon: FileTextIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Grants',
      value: activeGrants.toLocaleString(),
      icon: CalendarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Funding',
      value: formatFunding(totalFunding),
      icon: DollarSignIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Federal Agencies',
      value: totalAgencies.toLocaleString(),
      icon: BuildingIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats?.map((stat, index) => (
        <motion.div
          key={stat?.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {stat?.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat?.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat?.bgColor || 'bg-gray-100'}`}>
              {stat?.icon && (
                <stat.icon className={`h-6 w-6 ${stat?.color || 'text-gray-600'}`} />
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
