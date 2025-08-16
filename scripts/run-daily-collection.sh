#!/bin/bash

# Daily grants collection runner script
# This script is called by cron to run the daily collection

# Set the working directory
cd /home/ubuntu/federal_grants_app/app

# Set up environment
export NODE_ENV=production
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# Create log file with timestamp
LOG_FILE="logs/daily-collection-$(date +%Y%m%d).log"

echo "Starting daily grants collection at $(date)" >> "$LOG_FILE"

# Run the collection script
npx tsx scripts/daily-collection.ts >> "$LOG_FILE" 2>&1

# Log completion
echo "Collection finished at $(date)" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# Keep only last 30 days of logs
find logs/ -name "daily-collection-*.log" -mtime +30 -delete 2>/dev/null || true
