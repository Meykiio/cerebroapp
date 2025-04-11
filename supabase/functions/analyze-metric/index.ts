
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_KEY is not set');
    }

    const { metricName, metricData } = await req.json();

    if (!metricName || !metricData) {
      return new Response(
        JSON.stringify({ error: "metricName and metricData are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following ${metricName} data and provide a brief insight about the trend and what it might mean for a business:
      
      Data: ${JSON.stringify(metricData)}
      
      Provide a concise, insightful analysis in about 2-3 sentences.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-metric function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
