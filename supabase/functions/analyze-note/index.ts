
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

    const { content } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following note and provide:
      1. A brief summary (max 150 characters)
      2. Three suggested tasks based on the content
      
      Note Content:
      ${content}
      
      Format response as JSON with fields "summary" and "suggestedTasks" (array of strings).
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Try to parse the response as JSON
    let jsonResponse;
    try {
      // The model might return code fenced JSON, so try to extract it
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/```\n([\s\S]*?)\n```/) ||
                        responseText.match(/{[\s\S]*?}/);
      
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      jsonResponse = JSON.parse(jsonStr);
    } catch (e) {
      // If parsing fails, create a structured response manually
      jsonResponse = {
        summary: responseText.slice(0, 150),
        suggestedTasks: ["Review the note content", "Create follow-up actions", "Share with relevant team members"]
      };
    }

    return new Response(
      JSON.stringify(jsonResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-note function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
