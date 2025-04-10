
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, CheckCircle2, Circle, Clock, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  due?: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  createdAt: Date;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      completed: false,
      due: "2025-04-15",
      priority: "high",
      tags: ["work", "project"],
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Send follow-up emails",
      completed: false,
      due: "2025-04-12",
      priority: "medium",
      tags: ["email", "follow-up"],
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Prepare for client meeting",
      completed: true,
      due: "2025-04-08",
      priority: "high",
      tags: ["meeting", "client"],
      createdAt: new Date(),
    },
  ]);

  const [newTask, setNewTask] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      priority: "medium",
      tags: [],
      createdAt: new Date(),
    };

    setTasks([task, ...tasks]);
    setNewTask("");
    toast.success("Task added successfully");
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };

  // Filter tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">Tasks</h1>
          <p className="text-cerebro-soft/70">Manage your tasks effectively</p>
        </div>
      </div>

      {/* Add Task Form */}
      <Card className="bg-gray-900/60 border-white/10">
        <CardContent className="pt-6">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              className="bg-gray-800/50 border-white/10"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button type="submit" className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Task Lists */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-gray-800/50 border-white/10">
          <TabsTrigger value="active" className="data-[state=active]:bg-cerebro-purple">
            Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-cerebro-purple">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Active Tasks</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTasks.length === 0 ? (
                  <p className="text-center text-cerebro-soft/50 py-8">No active tasks</p>
                ) : (
                  activeTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className="mt-1 text-cerebro-soft/70 hover:text-cerebro-purple"
                        >
                          <Circle className="h-5 w-5" />
                        </button>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.due && (
                              <span className="flex items-center text-xs bg-cerebro-purple/20 text-cerebro-purple-light px-2 py-1 rounded">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(task.due).toLocaleDateString()}
                              </span>
                            )}
                            <span className={`flex items-center text-xs px-2 py-1 rounded ${
                              task.priority === "high" 
                                ? "bg-red-500/20 text-red-400" 
                                : task.priority === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}>
                              <Clock className="mr-1 h-3 w-3" />
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                            {task.tags.map((tag) => (
                              <span key={tag} className="flex items-center text-xs bg-cerebro-cyan/10 text-cerebro-cyan px-2 py-1 rounded">
                                <Tag className="mr-1 h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-cerebro-soft/50 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card className="bg-gray-900/60 border-white/10">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Completed Tasks</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTasks.length === 0 ? (
                  <p className="text-center text-cerebro-soft/50 py-8">No completed tasks</p>
                ) : (
                  completedTasks.map((task) => (
                    <div key={task.id} className="flex items-start justify-between p-3 bg-gray-800/30 rounded-lg opacity-70">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className="mt-1 text-cerebro-purple"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <div>
                          <p className="font-medium line-through">{task.title}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.due && (
                              <span className="flex items-center text-xs bg-cerebro-purple/10 text-cerebro-purple/70 px-2 py-1 rounded">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(task.due).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-cerebro-soft/50 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
