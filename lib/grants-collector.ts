
// Federal Grants Data Collection System
// Downloads daily XML extracts from grants.gov and updates the database

import axios from 'axios'
import * as xml2js from 'xml2js'
import * as zlib from 'zlib'
import { db } from '@/lib/db'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const gunzip = promisify(zlib.gunzip)

interface GrantsGovOpportunity {
  OpportunityID: string[]
  OpportunityNumber: string[]
  OpportunityTitle: string[]
  OpportunityCategory: string[]
  FundingInstrumentType: string[]
  CategoryOfFundingActivity: string[]
  CategoryExplanation?: string[]
  CFDANumbers?: string[]
  EligibleApplicants?: string[]
  AdditionalInformationOnEligibility?: string[]
  AgencyCode: string[]
  AgencyName: string[]
  PostDate: string[]
  CloseDate: string[]
  LastUpdatedDate?: string[]
  AwardCeiling?: string[]
  AwardFloor?: string[]
  EstimatedTotalProgramFunding?: string[]
  ExpectedNumberOfAwards?: string[]
  Description?: string[]
  Version: string[]
  CostSharingOrMatchingRequirement?: string[]
  ArchiveDate?: string[]
  GrantorContactEmail?: string[]
  GrantorContactEmailDescription?: string[]
  GrantorContactText?: string[]
}

interface GrantsGovContact {
  Email?: string[]
  EmailDescription?: string[]
  Text?: string[]
}

export class GrantsCollector {
  private readonly GRANTS_GOV_BASE_URL = 'https://www.grants.gov'
  private readonly XML_EXTRACT_URL = `${this.GRANTS_GOV_BASE_URL}/extract`
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 5000 // 5 seconds

  constructor() {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  }

  /**
   * Main collection method - downloads and processes grants data
   */
  async collectGrants(): Promise<{ success: boolean; processed: number; errors: string[] }> {
    const results = {
      success: false,
      processed: 0,
      errors: [] as string[]
    }

    try {
      console.log('🚀 Starting grants data collection...')
      
      // Step 1: Download the latest XML extract
      const xmlData = await this.downloadLatestExtract()
      
      // Step 2: Parse the XML data
      const opportunities = await this.parseXmlData(xmlData)
      console.log(`📊 Found ${opportunities.length} opportunities in XML`)
      
      // Step 3: Process and store opportunities in batches
      const batchSize = 50
      let processed = 0
      
      for (let i = 0; i < opportunities.length; i += batchSize) {
        const batch = opportunities.slice(i, i + batchSize)
        
        try {
          const batchResult = await this.processBatch(batch)
          processed += batchResult
          console.log(`✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(opportunities.length / batchSize)} (${processed} total)`)
        } catch (error) {
          const errorMsg = `Batch processing error: ${error}`
          console.error(errorMsg)
          results.errors.push(errorMsg)
        }
      }

      results.processed = processed
      results.success = results.errors.length === 0
      
      console.log(`🎉 Collection completed: ${processed} opportunities processed`)
      
    } catch (error) {
      const errorMsg = `Collection failed: ${error}`
      console.error(errorMsg)
      results.errors.push(errorMsg)
    }

    return results
  }

  /**
   * Downloads the latest XML extract from grants.gov
   */
  private async downloadLatestExtract(): Promise<string> {
    const today = new Date()
    const dateStr = this.formatDateForUrl(today)
    
    // Try today's extract first, then yesterday's (in case today's isn't available yet)
    for (let daysBack = 0; daysBack < 7; daysBack++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - daysBack)
      const checkDateStr = this.formatDateForUrl(checkDate)
      
      try {
        console.log(`📥 Attempting to download extract for ${checkDateStr}...`)
        
        const xmlData = await this.downloadExtractForDate(checkDateStr)
        if (xmlData) {
          console.log(`✅ Successfully downloaded extract for ${checkDateStr}`)
          return xmlData
        }
      } catch (error) {
        console.log(`❌ Extract for ${checkDateStr} not available: ${error}`)
        continue
      }
    }
    
    throw new Error('No recent XML extract found in the last 7 days')
  }

  /**
   * Downloads XML extract for a specific date
   */
  private async downloadExtractForDate(dateStr: string): Promise<string> {
    const urls = [
      `${this.XML_EXTRACT_URL}/${dateStr}-v2.xml.gz`, // Try v2 format first
      `${this.XML_EXTRACT_URL}/${dateStr}-v1.xml.gz`, // Fallback to v1
      `${this.XML_EXTRACT_URL}/${dateStr}.xml.gz`     // Generic format
    ]

    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          responseType: 'arraybuffer',
          timeout: 120000, // 2 minutes timeout
          headers: {
            'User-Agent': 'Federal-Grants-Collector/1.0'
          }
        })
        
        if (response.status === 200 && response.data.length > 0) {
          // Decompress the gzipped data
          const decompressed = await gunzip(response.data)
          return decompressed.toString('utf8')
        }
      } catch (error) {
        // Continue to next URL
        continue
      }
    }
    
    throw new Error(`No valid extract found for ${dateStr}`)
  }

  /**
   * Parses XML data and extracts opportunities
   */
  private async parseXmlData(xmlData: string): Promise<GrantsGovOpportunity[]> {
    try {
      const parser = new xml2js.Parser({
        explicitArray: true,
        ignoreAttrs: false,
        trim: true
      })
      
      const result = await parser.parseStringPromise(xmlData)
      
      // Extract opportunities from different possible XML structures
      let opportunities: GrantsGovOpportunity[] = []
      
      if (result.Opportunities && result.Opportunities.OpportunityDetail) {
        opportunities = result.Opportunities.OpportunityDetail
      } else if (result.OpportunityDetail) {
        opportunities = Array.isArray(result.OpportunityDetail) 
          ? result.OpportunityDetail 
          : [result.OpportunityDetail]
      } else if (result.grants && result.grants.grant) {
        // Alternative XML structure
        opportunities = result.grants.grant
      }
      
      return opportunities.filter(opp => opp.OpportunityID && opp.OpportunityID[0])
    } catch (error) {
      throw new Error(`XML parsing failed: ${error}`)
    }
  }

  /**
   * Processes a batch of opportunities and stores them in the database
   */
  private async processBatch(opportunities: GrantsGovOpportunity[]): Promise<number> {
    let processed = 0
    
    for (const opp of opportunities) {
      try {
        await this.processOpportunity(opp)
        processed++
      } catch (error) {
        console.error(`Failed to process opportunity ${opp.OpportunityID?.[0]}: ${error}`)
        // Continue processing other opportunities
      }
    }
    
    return processed
  }

  /**
   * Processes a single opportunity and stores it in the database
   */
  private async processOpportunity(opp: GrantsGovOpportunity): Promise<void> {
    const opportunityId = opp.OpportunityID[0]
    
    // Check if opportunity already exists
    const existing = await db.opportunity.findUnique({
      where: { opportunityId }
    })
    
    const opportunityData = {
      opportunityId,
      opportunityNumber: opp.OpportunityNumber?.[0] || null,
      title: opp.OpportunityTitle?.[0]?.substring(0, 255) || 'Untitled',
      description: opp.Description?.[0] || null,
      
      // Agency Information
      agencyCode: opp.AgencyCode?.[0] || null,
      agencyName: opp.AgencyName?.[0] || null,
      
      // Timeline Information
      postDate: this.parseDate(opp.PostDate?.[0]),
      closeDate: this.parseDate(opp.CloseDate?.[0]),
      archiveDate: this.parseDate(opp.ArchiveDate?.[0]),
      lastUpdatedDate: this.parseDate(opp.LastUpdatedDate?.[0]),
      
      // Funding Information
      estimatedTotalFunding: this.parseBigInt(opp.EstimatedTotalProgramFunding?.[0]),
      awardCeiling: this.parseBigInt(opp.AwardCeiling?.[0]),
      awardFloor: this.parseBigInt(opp.AwardFloor?.[0]),
      expectedNumberOfAwards: this.parseInt(opp.ExpectedNumberOfAwards?.[0]),
      costSharingRequired: this.parseBoolean(opp.CostSharingOrMatchingRequirement?.[0]),
      
      // Categorical Classifications
      opportunityCategory: opp.OpportunityCategory?.[0] || null,
      fundingInstrumentType: opp.FundingInstrumentType?.[0] || null,
      categoryOfFundingActivity: opp.CategoryOfFundingActivity?.[0] || null,
      cfdaNumbers: opp.CFDANumbers || [],
      
      // Eligibility Information
      eligibleApplicants: opp.EligibleApplicants?.[0] || null,
      additionalEligibilityInfo: opp.AdditionalInformationOnEligibility?.[0] || null,
      
      // Version and Status
      version: opp.Version?.[0] || null,
      status: 'active'
    }
    
    let opportunity
    
    if (existing) {
      // Update existing opportunity
      opportunity = await db.opportunity.update({
        where: { opportunityId },
        data: opportunityData
      })
      
      // Record the change
      await db.opportunityChange.create({
        data: {
          opportunityId: opportunity.id,
          changeType: 'modified',
          source: 'xml_extract',
          details: 'Updated from daily XML extract'
        }
      })
    } else {
      // Create new opportunity
      opportunity = await db.opportunity.create({
        data: opportunityData
      })
      
      // Record the creation
      await db.opportunityChange.create({
        data: {
          opportunityId: opportunity.id,
          changeType: 'new',
          source: 'xml_extract',
          details: 'Created from daily XML extract'
        }
      })
    }
    
    // Process contact information
    await this.processContacts(opportunity.id, opp)
  }

  /**
   * Processes contact information for an opportunity
   */
  private async processContacts(opportunityId: string, opp: GrantsGovOpportunity): Promise<void> {
    // Clear existing contacts
    await db.opportunityContact.deleteMany({
      where: { opportunityId }
    })
    
    // Add new contact information
    if (opp.GrantorContactEmail || opp.GrantorContactText) {
      await db.opportunityContact.create({
        data: {
          opportunityId,
          contactEmail: opp.GrantorContactEmail?.[0] || null,
          contactText: opp.GrantorContactText?.[0] || null,
          contactName: null, // Not provided in XML
          contactPhone: null // Not provided in XML
        }
      })
    }
  }

  /**
   * Utility methods for parsing data
   */
  private parseDate(dateStr?: string): Date | null {
    if (!dateStr) return null
    
    try {
      const date = new Date(dateStr)
      return isNaN(date.getTime()) ? null : date
    } catch {
      return null
    }
  }

  private parseBigInt(numStr?: string): bigint | null {
    if (!numStr) return null
    
    try {
      const num = parseFloat(numStr.replace(/[,$]/g, ''))
      return isNaN(num) ? null : BigInt(Math.floor(num))
    } catch {
      return null
    }
  }

  private parseInt(numStr?: string): number | null {
    if (!numStr) return null
    
    try {
      const num = parseInt(numStr.replace(/[,$]/g, ''), 10)
      return isNaN(num) ? null : num
    } catch {
      return null
    }
  }

  private parseBoolean(boolStr?: string): boolean | null {
    if (!boolStr) return null
    return boolStr.toLowerCase() === 'yes' || boolStr.toLowerCase() === 'true'
  }

  private formatDateForUrl(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }
}

export const grantsCollector = new GrantsCollector()
