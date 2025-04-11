
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StickyNote, Lightbulb } from "lucide-react";
import WidgetWrapper from "./WidgetWrapper";
import { getNotes, Note } from "@/services/notesService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const NotesWidget = () => {
  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['notes-widget'],
    queryFn: () => getNotes().then(data => data.slice(0, 3)), // Only get top 3 notes
  });
  
  useEffect(() => {
    if (error) {
      toast.error("Failed to load notes");
      console.error(error);
    }
  }, [error]);
  
  const getNoteTypeIcon = (tags: string[]) => {
    if (tags.includes("idea")) {
      return <Lightbulb size={14} className="text-yellow-400" />;
    } else if (tags.includes("insight")) {
      return <Lightbulb size={14} className="text-cerebro-cyan" />;
    } else {
      return <StickyNote size={14} className="text-cerebro-purple" />;
    }
  };

  return (
    <WidgetWrapper title="Ideas & Notes" icon={<StickyNote className="h-5 w-5 text-yellow-400" />}>
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-md bg-white/5"></div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-6 text-cerebro-soft/70">
          <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No notes yet</p>
          <Link to="/notes">
            <Button 
              variant="ghost" 
              size="sm"
              className="mt-2 text-cerebro-soft hover:text-white hover:bg-white/10"
            >
              Create your first note
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-hidden">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  {getNoteTypeIcon(note.tags)}
                  <div className="font-semibold">{note.title}</div>
                </div>
                <p className="text-sm text-cerebro-soft/80 line-clamp-2">{note.content}</p>
              </div>
            ))}
          </div>
          
          <Link to="/notes">
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-cerebro-soft hover:text-white hover:bg-white/10"
            >
              View All Notes
            </Button>
          </Link>
        </>
      )}
    </WidgetWrapper>
  );
};

export default NotesWidget;
