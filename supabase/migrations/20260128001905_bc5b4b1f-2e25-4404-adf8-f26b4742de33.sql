-- =====================================================
-- FIX 1: comentarios - Enforce user_id attribution server-side
-- =====================================================

-- Create trigger function to auto-set user_id on comment insert
CREATE OR REPLACE FUNCTION public.set_comment_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-set user_id before insert
CREATE TRIGGER set_comment_user_id_trigger
  BEFORE INSERT ON public.comentarios
  FOR EACH ROW
  EXECUTE FUNCTION public.set_comment_user_id();

-- Update INSERT policy to also validate user_id matches auth.uid()
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comentarios;

CREATE POLICY "Users can create comments as themselves"
ON public.comentarios FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- =====================================================
-- FIX 2: respostas - Add write protection (admin-only)
-- =====================================================

-- Create app_role enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

-- Create user_roles table for admin management
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Only admins can view roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add write protection policies for respostas (admin/moderator only)
CREATE POLICY "Admins can insert responses"
ON public.respostas FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can update responses"
ON public.respostas FOR UPDATE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can delete responses"
ON public.respostas FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- FIX 3: manifestacoes - Create anonymized public view
-- =====================================================

-- Create public view without user_id exposure
CREATE VIEW public.manifestacoes_public 
WITH (security_invoker = on) AS
SELECT 
  id, 
  protocolo, 
  texto, 
  assunto, 
  localidade, 
  status, 
  respondida, 
  divulgacoes, 
  created_at, 
  updated_at, 
  anexos
FROM public.manifestacoes;

-- Grant public access to the view
GRANT SELECT ON public.manifestacoes_public TO anon;
GRANT SELECT ON public.manifestacoes_public TO authenticated;

-- Update manifestacoes policies: users can only see their own directly
DROP POLICY IF EXISTS "Anyone can view manifestations" ON public.manifestacoes;

CREATE POLICY "Users can view their own manifestations"
ON public.manifestacoes FOR SELECT
USING (auth.uid() = user_id);

-- =====================================================
-- FIX 4: manifestacoes - Enforce user_id on insert
-- =====================================================

-- Create trigger function to auto-set user_id on manifestation insert
CREATE OR REPLACE FUNCTION public.set_manifestacao_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-set user_id before insert
CREATE TRIGGER set_manifestacao_user_id_trigger
  BEFORE INSERT ON public.manifestacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_manifestacao_user_id();

-- Update INSERT policy to enforce user_id
DROP POLICY IF EXISTS "Authenticated users can create manifestations" ON public.manifestacoes;

CREATE POLICY "Users can create manifestations as themselves"
ON public.manifestacoes FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);