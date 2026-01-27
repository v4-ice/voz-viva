-- Create storage bucket for manifestation attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('manifestacao-anexos', 'manifestacao-anexos', true);

-- Allow authenticated users to upload files
CREATE POLICY "Anyone can upload manifestacao attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'manifestacao-anexos');

-- Allow public read access to attachments
CREATE POLICY "Manifestacao attachments are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'manifestacao-anexos');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'manifestacao-anexos');

-- Add anexos column to manifestacoes table
ALTER TABLE public.manifestacoes 
ADD COLUMN IF NOT EXISTS anexos TEXT[] DEFAULT '{}';