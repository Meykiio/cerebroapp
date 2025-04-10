
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StickyNote, Lightbulb } from "lucide-react";
import WidgetWrapper from "./WidgetWrapper";

interface Note {
  id: string;
  title: string;
  content: string;
  type: "idea" | "note" | "insight";
  createdAt: Date;
}

const NotesWidget = () => {
  const [notes] = useState<Note[]>([
    {
      id: "1",
      title: "Marketing Strategy",
      content: "Consider implementing referral program to boost organic growth",
      type: "idea",
      createdAt: new Date('2023-06-10'),
    },
    {
      id: "2",
      title: "Product Feedback",
      content: "Users have requested better onboarding experience",
      type: "insight",
      createdAt: new Date('2023-06-12'),
    },
    {
      id: "3",
      title: "Team Meeting Notes",
      content: "Discussed Q3 goals and resource allocation",
      type: "note",
      createdAt: new Date('2023-06-15'),
    },
  ]);
  
  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case "idea":
        return <Lightbulb size={14} className="text-yellow-400" />;
      case "insight":
        return <Lightbulb size={14} className="text-cerebro-cyan" />;
      default:
        return <StickyNote size={14} className="text-cerebro-purple" />;
    }
  };

  return (
    <WidgetWrapper title="Ideas & Notes" icon={<StickyNote className="h-5 w-5 text-yellow-400" />}>
      <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-hidden">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              {getNoteTypeIcon(note.type)}
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
    </WidgetWrapper>
  );
};

export default NotesWidget;
