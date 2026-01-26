import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
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
        return new Response(
          JSON.stringify({ 
            response: "Muitas solicitações. Por favor, aguarde um momento e tente novamente." 
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            response: "Serviço temporariamente indisponível. Tente novamente mais tarde." 
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 
      "Desculpe, não consegui processar sua mensagem. Tente novamente.";

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
