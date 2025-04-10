
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, PlusCircle, Search, Brain, Tag, Calendar, Trash2, Mic } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  tags: string[];
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Business Ideas 2025",
      content: "1. Create a mobile app for freelance project management\n2. Develop a productivity dashboard for entrepreneurs\n3. Research AI-powered content creation tools",
      createdAt: new Date(),
      tags: ["ideas", "business", "projects"]
    },
    {
      id: "2",
      title: "Meeting Notes - Investor Call",
      content: "- Discussed funding options for Q3\n- Shared latest user growth metrics\n- Need to prepare financial projections\n- Follow up with Sarah about term sheet",
      createdAt: new Date(Date.now() - 86400000),
      tags: ["meeting", "investor"]
    },
    {
      id: "3",
      title: "Marketing Strategy",
      content: "Content plan for next quarter:\n- Blog posts: 2x per week\n- Social media: daily posts\n- Email newsletter: weekly\n- Podcast guest appearances: 1x per month",
      createdAt: new Date(Date.now() - 172800000),
      tags: ["marketing", "planning"]
    }
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      tags: []
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    toast.success("Note added successfully");
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success("Note deleted");
  };

  const toggleRecording = () => {
    // In a real implementation, this would use the Web Speech API
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info("Voice recording started...");
      // Simulate ending recording after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setContent(prev => prev + "\n[Voice transcription would appear here in a real implementation]");
        toast.success("Voice recording added to note");
      }, 3000);
    } else {
      toast.info("Voice recording stopped");
    }
  };

  const analyzedNote = {
    summary: "This note contains business ideas focused on app development, productivity tools, and AI innovations. It appears to be brainstorming for future projects.",
    suggestedTasks: [
      "Research competition for freelance project management apps",
      "Create mockups for productivity dashboard",
      "Evaluate AI content creation tools in the market"
    ]
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">Idea Vault</h1>
          <p className="text-cerebro-soft/70">Capture and organize your thoughts</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cerebro-soft/60 h-4 w-4" />
          <Input
            placeholder="Search notes..."
            className="pl-10 bg-gray-800/50 border-white/10 w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* New Note Form */}
        <Card className="md:col-span-1 bg-gray-900/60 border-white/10">
          <CardHeader>
            <h3 className="text-lg font-semibold">New Note</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNote} className="space-y-4">
              <Input
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800/50 border-white/10"
              />
              <div className="relative">
                <Textarea
                  placeholder="Write your note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] bg-gray-800/50 border-white/10"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={toggleRecording}
                  className={`absolute bottom-3 right-3 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-cerebro-purple'} rounded-full h-8 w-8 p-1`}
                >
                  <Mic size={16} />
                </Button>
              </div>
              <Button type="submit" className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark">
                <PlusCircle className="mr-2 h-4 w-4" />
                Save Note
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notes List */}
        <Card className="md:col-span-2 bg-gray-900/60 border-white/10">
          <CardHeader className="pb-2">
            <Tabs defaultValue="all">
              <TabsList className="bg-gray-800/50 border-white/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-cerebro-purple">
                  All Notes
                </TabsTrigger>
                <TabsTrigger value="recent" className="data-[state=active]:bg-cerebro-purple">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="tagged" className="data-[state=active]:bg-cerebro-purple">
                  Tagged
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10 text-cerebro-soft/50">
                <StickyNote className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>No notes found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-lg bg-gray-800/30 border border-white/5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">{note.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-cerebro-soft/50 hover:text-red-400 hover:bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-cerebro-soft/80 mt-2 whitespace-pre-line text-sm">
                      {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <span key={tag} className="flex items-center text-xs bg-cerebro-purple/10 text-cerebro-purple-light px-2 py-1 rounded-full">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-cerebro-soft/50">
                        <Calendar className="mr-1 h-3 w-3" />
                        {note.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis */}
      {notes.length > 0 && (
        <Card className="bg-gray-900/60 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cerebro-purple" />
              <h3 className="text-lg font-semibold">Gemini Analysis</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-cerebro-soft/70 mb-2">Summary</h4>
                <p className="text-sm">{analyzedNote.summary}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-cerebro-soft/70 mb-2">Suggested Tasks</h4>
                <ul className="space-y-2">
                  {analyzedNote.suggestedTasks.map((task, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-cerebro-purple/20 flex items-center justify-center text-xs text-cerebro-purple">
                        {index + 1}
                      </div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotesPage;
