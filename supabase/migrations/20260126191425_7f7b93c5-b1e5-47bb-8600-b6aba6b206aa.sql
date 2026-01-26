-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  cpf TEXT,
  telefone TEXT,
  email TEXT,
  data_nascimento DATE,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create manifestations table
CREATE TABLE public.manifestacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  protocolo TEXT NOT NULL UNIQUE,
  texto TEXT NOT NULL,
  assunto TEXT NOT NULL,
  localidade TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  respondida BOOLEAN NOT NULL DEFAULT false,
  divulgacoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create responses table
CREATE TABLE public.respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manifestacao_id UUID REFERENCES public.manifestacoes(id) ON DELETE CASCADE,
  orgao TEXT NOT NULL,
  texto TEXT NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comentarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manifestacao_id UUID REFERENCES public.manifestacoes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  texto TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manifestacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for manifestacoes
-- Anyone can read manifestations (community feature)
CREATE POLICY "Anyone can view manifestations" 
ON public.manifestacoes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create manifestations" 
ON public.manifestacoes FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own manifestations" 
ON public.manifestacoes FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for respostas
CREATE POLICY "Anyone can view responses" 
ON public.respostas FOR SELECT 
USING (true);

-- RLS Policies for comentarios
CREATE POLICY "Anyone can view comments" 
ON public.comentarios FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.comentarios FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime for manifestacoes (community feed)
ALTER PUBLICATION supabase_realtime ADD TABLE public.manifestacoes;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manifestacoes_updated_at
  BEFORE UPDATE ON public.manifestacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();