# Supabase Setup Guide for GCMS v3.0

This guide walks through setting up Supabase for the GCMS v3.0 Outbound Stack.

## Prerequisites

- Supabase account
- Project created in Supabase dashboard

---

## Step 1: Run Database Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the entire contents of `db/v3_outbound_schema.sql`
5. Click **Run** to execute the migration

This will create:
- 5 tables: `programs`, `applications`, `documents`, `waitlist`, `case_logs`
- 2 ENUM types: `app_status`, `verification_status`
- RLS policies for secure data access
- Triggers for auto-updating timestamps
- Seeded data for 3 programs

**Verification:**
- Go to **Table Editor**
- Verify `programs` table has 3 rows (Wisconsin, Hopkins, Edinburgh)
- Check that other tables exist but are empty

---

## Step 2: Create Storage Bucket

1. Navigate to **Storage** in the Supabase dashboard
2. Click **New bucket**
3. Configure the bucket:
   - **Name**: `documents`
   - **Public bucket**: OFF (private)
   - **File size limit**: 10 MB (optional)
   - **Allowed MIME types**: Leave empty or specify: `application/pdf, image/jpeg, image/png`

4. Click **Create bucket**

---

## Step 3: Configure Storage Policies

After creating the bucket, set up Row-Level Security policies:

1. Click on the `documents` bucket
2. Go to **Policies**
3. Click **New policy**

### Policy 1: User Upload (INSERT)
```sql
-- Name: Users can upload their own documents
-- Operation: INSERT
-- Policy:
(auth.uid()::text IN (
  SELECT user_id 
  FROM applications 
  WHERE id::text = (storage.foldername(name))[1]
))
```

### Policy 2: User Read (SELECT)
```sql
-- Name: Users can view their own documents
-- Operation: SELECT
-- Policy:
(auth.uid()::text IN (
  SELECT user_id 
  FROM applications 
  WHERE id::text = (storage.foldername(name))[1]
))
```

### Policy 3: User Delete (DELETE)
```sql
-- Name: Users can delete their own documents
-- Operation: DELETE
-- Policy:
(auth.uid()::text IN (
  SELECT user_id 
  FROM applications 
  WHERE id::text = (storage.foldername(name))[1]
))
```

**Note:** The storage path format is `{applicationId}/{documentType}_{timestamp}.{ext}`, so the first folder name is the application ID.

---

## Step 4: Get Environment Variables

1. Navigate to **Project Settings** → **API**
2. Copy the following values:

```env
# Add to your .env.local file:

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is under **Project API keys** → **anon/public**
4. The `SUPABASE_SERVICE_ROLE_KEY` is under **Project API keys** → **service_role** (⚠️ Keep this secret!)

---

## Step 5: Verify Setup

### Test Database Connection

Run this query in SQL Editor:
```sql
SELECT * FROM programs;
```

Expected result: 3 rows (Wisconsin, Hopkins, Edinburgh)

### Test Storage Access

1. Try uploading a test file through the Supabase dashboard
2. Bucket: `documents`
3. Path: `test/sample.pdf`
4. If upload succeeds, storage is configured correctly

---

## Step 6: Enable Realtime (Optional)

If you plan to add real-time document verification updates:

1. Navigate to **Database** → **Replication**
2. Enable replication for:
   - `documents` table
   - `applications` table

---

## Troubleshooting

### Issue: "relation does not exist"
- **Solution**: Re-run the migration script from Step 1

### Issue: Upload fails with 401 Unauthorized
- **Solution**: Check that storage policies are configured correctly
- Verify application belongs to the authenticated user

### Issue: RLS policy errors
- **Solution**: Temporarily disable RLS on the `documents` table to test:
  ```sql
  ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
  ```
  Then re-enable and fix policies:
  ```sql
  ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
  ```

### Issue: File size limit exceeded
- **Solution**: Increase bucket file size limit in Storage settings
- Or reduce `maxSizeMB` in FileUpload component props

---

## Security Checklist

- [ ] RLS is enabled on all tables
- [ ] Storage bucket is private (not public)
- [ ] Service role key is stored securely (not in Git)
- [ ] Anon key is safe to expose (read-only with RLS)
- [ ] Storage policies verify application ownership

---

## Next Steps

1. Run `npm install` to install dependencies
2. Create `.env.local` with Supabase credentials
3. Start development server: `npm run dev`
4. Test document upload flow:
   - Sign up → Create application → Upload passport

---

## Database ERD

```
programs (1) ──< (M) applications (1) ──< (M) documents
                       │
                       └──< (M) case_logs

waitlist (M) ──> (1) programs
```

**Key relationships:**
- One program → Many applications
- One application → Many documents
- One application → Many case logs
- Many waitlist entries → One program

---

## Maintenance

### Backup Database
```bash
# Using Supabase CLI
supabase db dump > backup.sql
```

### Reset Database (⚠️ Destroys all data)
```sql
-- Drop all tables
DROP TABLE IF EXISTS case_logs CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS waitlist CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TYPE IF EXISTS app_status;
DROP TYPE IF EXISTS verification_status;

-- Then re-run the migration
```

### Clear Storage Bucket
```bash
# Using Supabase dashboard:
# Storage → documents → Select all → Delete
```

---

## Support

If you encounter issues:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Review [Storage Guide](https://supabase.com/docs/guides/storage)
3. Check Supabase dashboard logs (Database → Logs)
