
#!/bin/bash

# Setup script for daily grants collection cron job
# This script sets up a cron job to run the grants collection daily at midnight

echo "🔧 Setting up daily grants collection cron job..."

# Get the current directory
APP_DIR="/home/ubuntu/federal_grants_app/app"
LOG_DIR="$APP_DIR/logs"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Create the cron job script
CRON_SCRIPT="$APP_DIR/scripts/run-daily-collection.sh"

cat > "$CRON_SCRIPT" << 'EOL'
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
EOL

# Make the script executable
chmod +x "$CRON_SCRIPT"

# Add the cron job (runs daily at 5:00 AM - when grants.gov XML is typically available)
CRON_JOB="0 5 * * * $CRON_SCRIPT"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "run-daily-collection.sh"; then
    echo "⚠️  Cron job already exists. Updating..."
    # Remove existing job and add new one
    (crontab -l 2>/dev/null | grep -v "run-daily-collection.sh"; echo "$CRON_JOB") | crontab -
else
    echo "➕ Adding new cron job..."
    # Add the new job to existing crontab
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
fi

echo "✅ Daily grants collection cron job set up successfully!"
echo "📅 Will run daily at 5:00 AM"
echo "📁 Logs will be stored in: $LOG_DIR"
echo ""
echo "To view current cron jobs: crontab -l"
echo "To remove the cron job: crontab -l | grep -v 'run-daily-collection.sh' | crontab -"
echo "To test collection manually: cd $APP_DIR && npx tsx scripts/daily-collection.ts"
echo "To monitor logs: tail -f $LOG_DIR/daily-collection-$(date +%Y%m%d).log"
