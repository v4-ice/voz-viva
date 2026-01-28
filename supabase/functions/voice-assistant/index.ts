import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Voice assistant: Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ response: 'Autenticação necessária. Por favor, faça login.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Validate JWT and get user claims
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.warn('Voice assistant: Invalid token', claimsError);
      return new Response(
        JSON.stringify({ response: 'Sessão inválida. Por favor, faça login novamente.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Voice assistant: Authenticated user', userId);

    // Parse JSON with error handling
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ response: 'Formato de requisição inválido.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate message exists and is string
    if (!body.message || typeof body.message !== 'string') {
      return new Response(
        JSON.stringify({ response: 'Formato de mensagem inválido. Envie uma mensagem de texto.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const message = body.message.trim();

    // Enforce length limits
    if (message.length === 0) {
      return new Response(
        JSON.stringify({ response: 'Mensagem vazia. Por favor, faça uma pergunta.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (message.length > 500) {
      return new Response(
        JSON.stringify({ response: 'Mensagem muito longa. Limite de 500 caracteres.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Monitor suspicious patterns (log only, don't block legitimate users)
    const suspiciousPatterns = [
      /ignore (all |previous |prior )?instructions/i,
      /system prompt/i,
      /you are now/i,
      /act as/i,
      /pretend (to be|you are)/i
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(message));
    if (isSuspicious) {
      console.warn('Voice assistant: Potential prompt injection detected', {
        userId,
        messagePreview: message.substring(0, 100),
        timestamp: new Date().toISOString()
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("Voice assistant: LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é o assistente de voz da Ouvidoria do Governo do Distrito Federal (GDF). 
Você ajuda cidadãos a navegar pelo aplicativo e entender como usar os serviços de ouvidoria.

Seu papel é:
1. Ajudar pessoas a navegar pelo app dizendo para qual página ir
2. Explicar como fazer uma manifestação
3. Tirar dúvidas sobre o processo de ouvidoria
4. Ser acessível e usar linguagem simples para pessoas de todas as idades e níveis de escolaridade

Páginas disponíveis no app:
- "Meu perfil cidadão" - para ver e editar dados pessoais
- "Manifeste-se" - para criar uma nova manifestação/reclamação/sugestão
- "Comunidade" - para ver manifestações de outros cidadãos
- "Minhas respostas" - para ver respostas às suas manifestações

Se o usuário quiser navegar, diga claramente qual página ele deve acessar.
Mantenha respostas curtas e claras (máximo 2-3 frases).
Seja sempre educado e prestativo.`;

    console.log('Voice assistant: Sending request to AI gateway for user', userId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Voice assistant: Rate limit exceeded for user', userId);
        return new Response(
          JSON.stringify({ 
            response: "Muitas solicitações. Por favor, aguarde um momento e tente novamente." 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.warn('Voice assistant: Payment required (quota exceeded)');
        return new Response(
          JSON.stringify({ 
            response: "Serviço temporariamente indisponível. Tente novamente mais tarde." 
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Voice assistant: AI gateway error", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 
      "Desculpe, não consegui processar sua mensagem. Tente novamente.";

    console.log('Voice assistant: Successfully processed request for user', userId);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Voice assistant error:", error);
    return new Response(
      JSON.stringify({ 
        response: "Desculpe, houve um erro. Você pode dizer perfil, manifestar, comunidade ou minhas respostas para navegar." 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
