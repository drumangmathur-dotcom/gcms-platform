#!/bin/bash
# Combined database migration script
# Runs base schema + enriched content update

echo "🚀 Starting GCMS v3.0 Database Migration..."
echo ""

# Check if Supabase is configured
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in environment"
    echo "Please ensure .env.local is properly configured"
    exit 1
fi

echo "✅ Supabase URL configured"
echo "📊 Database: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Create a temporary combined SQL file
TEMP_SQL="/tmp/gcms_combined_migration.sql"

echo "📝 Creating combined migration script..."

# Combine base schema + enriched content
cat db/v3_outbound_schema.sql > "$TEMP_SQL"
echo "" >> "$TEMP_SQL"
echo "-- ============================================================================" >> "$TEMP_SQL"
echo "-- ENRICHED CONTENT UPDATE (appended automatically)" >> "$TEMP_SQL"
echo "-- ============================================================================" >> "$TEMP_SQL"
echo "" >> "$TEMP_SQL"
cat db/v3_outbound_schema_enriched.sql >> "$TEMP_SQL"

echo "✅ Combined migration created at $TEMP_SQL"
echo ""
echo "📋 Migration includes:"
echo "   - Base v3.0 Outbound Stack schema"
echo "   - 3 programs (Wisconsin, Hopkins, Edinburgh)"
echo "   - Enriched content with research data"
echo "   - Row-level security policies"
echo "   - Database views and triggers"
echo ""
echo "⚠️  IMPORTANT: This script creates the SQL file but CANNOT execute it automatically."
echo ""
echo "👉 Next steps:"
echo "   1. Open Supabase Dashboard → SQL Editor"
echo "   2. Click 'New Query'"
echo "   3. Run this command to copy SQL:"
echo "      pbcopy < $TEMP_SQL"
echo "   4. Paste into SQL Editor and click 'Run'"
echo ""
echo "Or manually open: $TEMP_SQL"
echo ""

# Copy to clipboard if pbcopy is available
if command -v pbcopy &> /dev/null; then
    cat "$TEMP_SQL" | pbcopy
    echo "✅ SQL copied to clipboard! Just paste into Supabase SQL Editor."
else
    echo "💡 Tip: Install pbcopy to auto-copy to clipboard"
fi

echo ""
echo "File location: $TEMP_SQL"
