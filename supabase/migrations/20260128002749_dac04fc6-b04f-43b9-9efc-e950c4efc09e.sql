-- Fix: Deny anonymous access to profiles table (contains PII)
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Fix: Deny anonymous access to manifestacoes table
CREATE POLICY "Deny anonymous access to manifestacoes"
ON public.manifestacoes
FOR SELECT
TO anon
USING (false);