-- Fix storage bucket policies: require authentication for uploads and deletes

-- Remove overly permissive policies
DROP POLICY IF EXISTS "Anyone can upload manifestacao attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Manifestacao attachments are publicly readable" ON storage.objects;

-- Require authentication for uploads
CREATE POLICY "Authenticated users can upload manifestacao attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'manifestacao-anexos' 
  AND auth.uid() IS NOT NULL
);

-- Keep public read access (since manifestations are public by design)
CREATE POLICY "Manifestacao attachments are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'manifestacao-anexos');

-- Allow users to delete only their own uploads
CREATE POLICY "Users can delete own manifestacao attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'manifestacao-anexos' 
  AND auth.uid() = owner
);