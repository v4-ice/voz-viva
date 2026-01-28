-- Hardening: ensure RLS is enabled and forced on sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE public.manifestacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manifestacoes FORCE ROW LEVEL SECURITY;

-- Defense-in-depth: revoke any direct anon privileges on sensitive tables
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.manifestacoes FROM anon;

-- Replace manifestacoes_public with a curated public table (no protocol numbers, no attachments)
DO $$
BEGIN
  -- Drop as view if it exists
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'manifestacoes_public'
      AND c.relkind IN ('v','m')
  ) THEN
    EXECUTE 'DROP VIEW IF EXISTS public.manifestacoes_public';
  END IF;

  -- Drop as table if it exists
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'manifestacoes_public'
      AND c.relkind = 'r'
  ) THEN
    EXECUTE 'DROP TABLE IF EXISTS public.manifestacoes_public';
  END IF;
END $$;

CREATE TABLE public.manifestacoes_public (
  id uuid PRIMARY KEY,
  assunto text NOT NULL,
  texto text NOT NULL,
  localidade text,
  status text NOT NULL DEFAULT 'publicada',
  respondida boolean NOT NULL DEFAULT false,
  divulgacoes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.manifestacoes_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manifestacoes_public FORCE ROW LEVEL SECURITY;

-- Public read access (curated table only)
CREATE POLICY "Anyone can view public manifestations"
ON public.manifestacoes_public
FOR SELECT
TO anon, authenticated
USING (true);

-- Only moderators/admins can create/update/delete curated public posts
CREATE POLICY "Moderators can manage public manifestations"
ON public.manifestacoes_public
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- Convenience: publish (copy) a private manifestacao into the public curated table
CREATE OR REPLACE FUNCTION public.publish_manifestacao(_manifestacao_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  m record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  IF NOT (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT id, assunto, texto, localidade, status, respondida, divulgacoes, created_at, updated_at
  INTO m
  FROM public.manifestacoes
  WHERE id = _manifestacao_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'manifestacao not found';
  END IF;

  INSERT INTO public.manifestacoes_public (id, assunto, texto, localidade, status, respondida, divulgacoes, created_at, updated_at)
  VALUES (m.id, m.assunto, m.texto, m.localidade, m.status, m.respondida, m.divulgacoes, m.created_at, m.updated_at)
  ON CONFLICT (id) DO UPDATE
  SET assunto = EXCLUDED.assunto,
      texto = EXCLUDED.texto,
      localidade = EXCLUDED.localidade,
      status = EXCLUDED.status,
      respondida = EXCLUDED.respondida,
      divulgacoes = EXCLUDED.divulgacoes,
      created_at = EXCLUDED.created_at,
      updated_at = EXCLUDED.updated_at;

  RETURN true;
END;
$$;
