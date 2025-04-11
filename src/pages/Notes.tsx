import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote, PlusCircle, Search, Brain, Tag, Calendar, Trash2, Mic } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotes, createNote, deleteNote, Note } from "@/services/notesService";
import { analyzeNote } from "@/services/geminiService";
import { useAuth } from "@/contexts/AuthContext";

const NotesPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  
  // Fetch notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes
  });
  
  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success("Note added successfully");
      setTitle("");
      setContent("");
    },
    onError: (error) => {
      toast.error(`Failed to add note: ${error.message}`);
    }
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success("Note deleted");
      if (selectedNoteId === null) {
        setAnalyzedNote(null);
      }
    },
    onError: (error) => {
      toast.error(`Failed to delete note: ${error.message}`);
    }
  });
  
  // Note analysis
  const [analyzedNote, setAnalyzedNote] = useState<{
    summary: string;
    suggestedTasks: string[];
  } | null>(null);
  
  const analyzeNoteMutation = useMutation({
    mutationFn: (content: string) => analyzeNote(content),
    onSuccess: (data) => {
      setAnalyzedNote(data);
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    }
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    // Extract hashtags from content
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    const tags = matches 
      ? matches.map(tag => tag.substring(1).toLowerCase()) 
      : [];

    createNoteMutation.mutate({
      title,
      content,
      tags,
      user_id: user.id  // Add the user_id here
    });
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
    if (id === selectedNoteId) {
      setSelectedNoteId(null);
      setAnalyzedNote(null);
    }
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

  const handleAnalyzeNote = (note: Note) => {
    setSelectedNoteId(note.id);
    analyzeNoteMutation.mutate(note.content);
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
                  placeholder="Write your note... (Use #hashtags to categorize)"
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
              <Button 
                type="submit" 
                className="w-full bg-cerebro-purple hover:bg-cerebro-purple-dark"
                disabled={createNoteMutation.isPending || !title.trim() || !user}
              >
                {createNoteMutation.isPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Save Note
                  </>
                )}
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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg bg-gray-800/30 border border-white/5 animate-pulse">
                    <div className="h-4 w-3/4 bg-white/10 rounded mb-3"></div>
                    <div className="h-3 w-full bg-white/5 rounded mb-2"></div>
                    <div className="h-3 w-5/6 bg-white/5 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-10 text-cerebro-soft/50">
                <StickyNote className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>{searchQuery ? "No notes found matching your search" : "No notes yet"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-lg bg-gray-800/30 border border-white/5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">{note.title}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAnalyzeNote(note)}
                          className="text-cerebro-soft/50 hover:text-cerebro-purple hover:bg-transparent"
                        >
                          <Brain className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-cerebro-soft/50 hover:text-red-400 hover:bg-transparent"
                          disabled={deleteNoteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                        {new Date(note.created_at).toLocaleDateString()}
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
      {selectedNoteId && analyzedNote && (
        <Card className="bg-gray-900/60 border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cerebro-purple" />
              <h3 className="text-lg font-semibold">Gemini Analysis</h3>
            </div>
          </CardHeader>
          <CardContent>
            {analyzeNoteMutation.isPending ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-8 w-8 text-cerebro-purple mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm text-cerebro-soft/70">Analyzing note content...</p>
                </div>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotesPage;
