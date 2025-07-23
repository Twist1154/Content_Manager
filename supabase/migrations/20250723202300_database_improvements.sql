/*
  # Database Improvements Migration
  
  This migration implements all the recommended improvements from the database analysis:
  
  1. Indexes for Performance
     - Add an index on the profiles.role field for faster filtering by role
     - Add an index on the stores.user_id field for faster queries
  
  2. Data Validation
     - Add check constraint to ensure start_date is before end_date in the content table
  
  3. Audit Logging
     - Create an audit_logs table for tracking sensitive operations
     - Add triggers to record changes to profiles, stores, and content tables
  
  4. Soft Delete
     - Add is_deleted column to stores and content tables
     - Update RLS policies to filter out deleted records
  
  5. Metadata Synchronization
     - Enhance handle_new_user() function to ensure consistent profile creation and role synchronization
*/

-- 1. Indexes for Performance

-- Add index on profiles.role for faster filtering by role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add index on stores.user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);

-- 2. Data Validation

-- Add check constraint to ensure start_date is before end_date in the content table
-- First, check if there are any existing records that would violate the constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM content WHERE start_date > end_date
  ) THEN
    RAISE NOTICE 'Warning: There are records in the content table where start_date is after end_date. These need to be fixed before adding the constraint.';
    -- You can uncomment the following line to automatically fix these records
    UPDATE content SET end_date = start_date WHERE start_date > end_date;
  END IF;
END $$;

-- Add the constraint (will fail if there are violating records)
ALTER TABLE content ADD CONSTRAINT check_date_range CHECK (start_date <= end_date);

-- 3. Audit Logging

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on audit_logs.table_name and record_id for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);

-- Create index on audit_logs.changed_by for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_by ON audit_logs(changed_by);

-- Create index on audit_logs.changed_at for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at);

-- Create function to record audit logs
CREATE OR REPLACE FUNCTION fn_record_audit() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (table_name, record_id, operation, old_data, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (table_name, record_id, operation, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (table_name, record_id, operation, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit logging
CREATE TRIGGER trg_profiles_audit
AFTER INSERT OR UPDATE OR DELETE ON profiles
FOR EACH ROW EXECUTE FUNCTION fn_record_audit();

CREATE TRIGGER trg_stores_audit
AFTER INSERT OR UPDATE OR DELETE ON stores
FOR EACH ROW EXECUTE FUNCTION fn_record_audit();

CREATE TRIGGER trg_content_audit
AFTER INSERT OR UPDATE OR DELETE ON content
FOR EACH ROW EXECUTE FUNCTION fn_record_audit();

-- 4. Soft Delete

-- Add is_deleted column to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Add is_deleted column to content table
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index on stores.is_deleted for faster filtering
CREATE INDEX IF NOT EXISTS idx_stores_is_deleted ON stores(is_deleted);

-- Create index on content.is_deleted for faster filtering
CREATE INDEX IF NOT EXISTS idx_content_is_deleted ON content(is_deleted);

-- Update RLS policies to filter out deleted records
-- Note: Policy names may differ in your database. Adjust the policy names as needed.

-- For stores table - update existing policies
DROP POLICY IF EXISTS "Users can read their own stores" ON stores;
CREATE POLICY "Users can read their own stores"
  ON stores
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() AND
    is_deleted = FALSE
  );

DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
CREATE POLICY "Users can update their own stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    is_deleted = FALSE
  );

DROP POLICY IF EXISTS "Users can delete their own stores" ON stores;
CREATE POLICY "Users can delete their own stores"
  ON stores
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    is_deleted = FALSE
  );

DROP POLICY IF EXISTS "Admins can read all stores" ON stores;
CREATE POLICY "Admins can read all stores"
  ON stores
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ) AND
    is_deleted = FALSE
  );

-- For content table - update existing policies
DROP POLICY IF EXISTS "Users can read their own content" ON content;
CREATE POLICY "Users can read their own content"
  ON content
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() AND
    is_deleted = FALSE
  );

DROP POLICY IF EXISTS "Users can update their own content" ON content;
CREATE POLICY "Users can update their own content"
  ON content
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    is_deleted = FALSE
  );

DROP POLICY IF EXISTS "Users can delete their own content" ON content;
CREATE POLICY "Users can delete their own content"
  ON content
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() AND
    is_deleted = FALSE
  );

DROP POLICY IF EXISTS "Admins can read all content" ON content;
CREATE POLICY "Admins can read all content"
  ON content
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ) AND
    is_deleted = FALSE
  );

-- 5. Metadata Synchronization

-- Enhance handle_new_user function to ensure consistent profile creation and role synchronization
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a new profile for the user with default role 'client'
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      (NEW.raw_app_meta_data->>'role')::TEXT,
      'client'
    )
  );
  
  -- Ensure app_metadata has the correct role
  UPDATE auth.users
  SET raw_app_meta_data = 
    CASE 
      WHEN raw_app_meta_data IS NULL THEN 
        jsonb_build_object('role', 'client')
      WHEN NOT (raw_app_meta_data ? 'role') THEN
        raw_app_meta_data || jsonb_build_object('role', 'client')
      ELSE
        raw_app_meta_data
    END
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to keep profile role and auth.users metadata in sync
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.role <> NEW.role) THEN
    -- Update auth.users metadata when profile role changes
    UPDATE auth.users
    SET raw_app_meta_data = 
      CASE 
        WHEN raw_app_meta_data IS NULL THEN 
          jsonb_build_object('role', NEW.role)
        ELSE
          raw_app_meta_data || jsonb_build_object('role', NEW.role)
      END
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to keep roles in sync
CREATE TRIGGER trg_sync_user_role
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_user_role();

-- Add RLS policies for audit_logs table
CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update audit logs"
  ON audit_logs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete audit logs"
  ON audit_logs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Enable RLS on audit_logs table
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Add a function to implement soft delete instead of hard delete
CREATE OR REPLACE FUNCTION soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stores SET is_deleted = TRUE WHERE id = OLD.id AND TG_TABLE_NAME = 'stores';
  UPDATE content SET is_deleted = TRUE WHERE id = OLD.id AND TG_TABLE_NAME = 'content';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for soft delete
CREATE TRIGGER trg_stores_soft_delete
BEFORE DELETE ON stores
FOR EACH ROW
WHEN (OLD.is_deleted = FALSE)
EXECUTE FUNCTION soft_delete_record();

CREATE TRIGGER trg_content_soft_delete
BEFORE DELETE ON content
FOR EACH ROW
WHEN (OLD.is_deleted = FALSE)
EXECUTE FUNCTION soft_delete_record();