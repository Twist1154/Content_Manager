/*
  # Add Content Auto-Deletion After 30 Days
  
  This migration adds functionality to automatically delete client content after 30 days:
  
  1. Create a function to mark content as deleted after 30 days
     - Uses the existing is_deleted column in the content table
     - Logs the operation in the audit_logs table
  
  2. Create a function to physically delete files from storage
     - Deletes files from storage.objects for content marked as deleted
     - Ensures storage space is freed up
  
  3. Set up pg_cron to run these functions daily
     - Uses Supabase's pg_cron extension
     - Scheduled to run at midnight every day
*/

-- Enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Add function to automatically mark content as deleted after 30 days
CREATE OR REPLACE FUNCTION fn_mark_old_content_deleted()
RETURNS void AS $$
DECLARE
  affected_rows integer;
BEGIN
  -- Mark content as deleted if it's older than 30 days
  WITH updated_content AS (
    UPDATE content
    SET is_deleted = TRUE
    WHERE 
      created_at < (CURRENT_TIMESTAMP - INTERVAL '30 days') AND
      is_deleted = FALSE
    RETURNING id, to_jsonb(content) as content_data
  )
  
  -- Log the operation in audit_logs
  INSERT INTO audit_logs (
    table_name, 
    record_id, 
    operation, 
    old_data, 
    new_data, 
    changed_by
  )
  SELECT 
    'content', 
    id, 
    'AUTO_DELETE', 
    content_data, 
    jsonb_build_object('is_deleted', TRUE), 
    '00000000-0000-0000-0000-000000000000'::uuid
  FROM updated_content;
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  RAISE NOTICE 'Marked % content items as deleted', affected_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to physically delete files from storage for content deleted more than 30 days ago
CREATE OR REPLACE FUNCTION fn_delete_storage_files_for_deleted_content()
RETURNS void AS $$
DECLARE
  file_record record;
  affected_rows integer := 0;
  error_count integer := 0;
BEGIN
  -- Get file paths for content that was marked as deleted more than 30 days ago
  FOR file_record IN 
    SELECT c.id, c.file_url
    FROM content c
    JOIN audit_logs a ON a.record_id = c.id AND a.table_name = 'content' AND a.operation = 'AUTO_DELETE'
    WHERE 
      c.is_deleted = TRUE AND
      a.changed_at < (CURRENT_TIMESTAMP - INTERVAL '30 days')
  LOOP
    BEGIN
      -- Extract the path part after the bucket name
      -- This handles different URL formats by looking for the bucket name and taking everything after it
      DECLARE
        storage_path text;
        bucket_pos integer;
      BEGIN
        bucket_pos := position('content/' in file_record.file_url);
        
        IF bucket_pos > 0 THEN
          storage_path := substring(file_record.file_url from (bucket_pos + 8)); -- 'content/' is 8 characters
          
          -- Delete the file from storage
          DELETE FROM storage.objects
          WHERE bucket_id = 'content' AND name = storage_path;
          
          affected_rows := affected_rows + 1;
        ELSE
          RAISE WARNING 'Could not extract storage path from URL: %', file_record.file_url;
          error_count := error_count + 1;
        END IF;
      END;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error deleting file % (ID: %): %', file_record.file_url, file_record.id, SQLERRM;
      error_count := error_count + 1;
    END;
  END LOOP;
  
  RAISE NOTICE 'Deleted % files from storage (% errors)', affected_rows, error_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cleanup functions to run daily at midnight
SELECT cron.schedule(
  'daily-content-cleanup',  -- unique job name
  '0 0 * * *',              -- cron schedule (midnight every day)
  $$
    SELECT fn_mark_old_content_deleted();
    SELECT fn_delete_storage_files_for_deleted_content();
  $$
);

-- Add a comment to the content table to document the auto-deletion policy
COMMENT ON TABLE content IS 'Stores metadata about uploaded content. Content is automatically deleted after 30 days.';