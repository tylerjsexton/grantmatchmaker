
// Daily collection script - runs the automated grants data collection
// This script is designed to be called by a cron job

import { grantsCollector } from '@/lib/grants-collector'

async function runDailyCollection() {
  const startTime = Date.now()
  
  console.log('🌅 Starting daily grants collection...')
  console.log(`📅 Date: ${new Date().toISOString()}`)
  
  try {
    const results = await grantsCollector.collectGrants()
    const duration = Math.round((Date.now() - startTime) / 1000)
    
    if (results.success) {
      console.log('✅ Daily collection completed successfully!')
      console.log(`📊 Processed: ${results.processed} opportunities`)
      console.log(`⏱️  Duration: ${duration}s`)
    } else {
      console.error('❌ Daily collection completed with errors:')
      results.errors.forEach(error => console.error(`  - ${error}`))
      console.log(`📊 Processed: ${results.processed} opportunities`)
      console.log(`⏱️  Duration: ${duration}s`)
      
      // Exit with error code for monitoring
      process.exit(1)
    }
    
  } catch (error) {
    console.error('💥 Daily collection failed:', error)
    process.exit(1)
  }
}

// Run the collection if this script is executed directly
if (require.main === module) {
  runDailyCollection()
    .then(() => {
      console.log('🏁 Daily collection script finished')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Script error:', error)
      process.exit(1)
    })
}

export { runDailyCollection }
