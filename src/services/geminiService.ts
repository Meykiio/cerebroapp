
import { supabase } from "@/integrations/supabase/client";

interface GeminiNoteAnalysisResponse {
  summary: string;
  suggestedTasks: string[];
}

interface GeminiContentResponse {
  text: string;
}

export const analyzeNote = async (noteContent: string): Promise<GeminiNoteAnalysisResponse> => {
  try {
    const { data: response, error } = await supabase.functions.invoke('analyze-note', {
      body: { content: noteContent }
    });

    if (error) throw error;
    
    return response as GeminiNoteAnalysisResponse;
  } catch (error) {
    console.error("Error analyzing note with Gemini:", error);
    return {
      summary: "Unable to generate analysis at this time.",
      suggestedTasks: []
    };
  }
};

export const generateMetricInsight = async (
  metricName: string, 
  metricData: any[]
): Promise<string> => {
  try {
    const { data: response, error } = await supabase.functions.invoke('analyze-metric', {
      body: { 
        metricName,
        metricData
      }
    });

    if (error) throw error;
    
    return (response as GeminiContentResponse).text;
  } catch (error) {
    console.error("Error generating metric insight with Gemini:", error);
    return "Unable to generate insight at this time.";
  }
};
