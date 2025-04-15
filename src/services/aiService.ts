import { supabase } from "@/integrations/supabase/client";

interface NoteAnalysisResponse {
  summary: string;
  suggestedTasks: string[];
}

interface AIContentResponse {
  text: string;
}

export const analyzeNote = async (noteContent: string): Promise<NoteAnalysisResponse> => {
  try {
    const { data: response, error } = await supabase.functions.invoke('analyze-note', {
      body: { content: noteContent }
    });

    if (error) throw error;
    
    return response as NoteAnalysisResponse;
  } catch (error) {
    console.error("Error analyzing note:", error);
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
    
    return (response as AIContentResponse).text;
  } catch (error) {
    console.error("Error generating metric insight:", error);
    return "Unable to generate insight at this time.";
  }
}; 