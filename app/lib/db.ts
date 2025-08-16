// Database configuration and connection
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Helper function to format funding amounts for display
export function formatFunding(amount: bigint | null | undefined): string {
  if (!amount) return 'Not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

// Helper function to format dates
export function formatDate(date: Date | null | undefined): string {
  if (!date) return 'Not specified';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// Helper function to get opportunity category display name
export function getOpportunityCategoryName(category: string | null | undefined): string {
  const categories = {
    'D': 'Discretionary',
    'M': 'Mandatory',
    'C': 'Continuation',
    'E': 'Earmark',
    'O': 'Other',
  };
  return categories[category as keyof typeof categories] || 'Unknown';
}

// Helper function to get funding instrument type display name
export function getFundingInstrumentName(type: string | null | undefined): string {
  const instruments = {
    'G': 'Grant',
    'CA': 'Cooperative Agreement',
    'O': 'Other',
    'PC': 'Procurement Contract',
  };
  return instruments[type as keyof typeof instruments] || 'Unknown';
}

// Helper function to get funding activity category display name
export function getFundingActivityName(category: string | null | undefined): string {
  const activities = {
    'AG': 'Agriculture',
    'HL': 'Health',
    'ED': 'Education',
    'EN': 'Energy',
    'EJ': 'Environmental Quality',
    'TR': 'Transportation',
    'CD': 'Community Development',
    'IS': 'Information and Statistics',
    'RD': 'Regional Development',
    'ST': 'Science and Technology',
    'CP': 'Consumer Protection',
    'LM': 'Law, Justice, and Legal Services',
    'IH': 'Income Security and Social Services',
    'HO': 'Housing',
    'BC': 'Business and Commerce',
    'EM': 'Employment, Labor, and Training',
    'AR': 'Arts',
    'FN': 'Food and Nutrition',
    'NR': 'Natural Resources',
    'DM': 'Disaster Prevention and Relief',
  };
  return activities[category as keyof typeof activities] || 'Other';
}
