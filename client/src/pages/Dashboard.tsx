import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Play, Trash2, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskType, setTaskType] = useState("web_scrape");

  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = trpc.tasks.list.useQuery();
  const createTaskMutation = trpc.tasks.create.useMutation();
  const executeTaskMutation = trpc.tasks.execute.useMutation();
  const updateStatusMutation = trpc.tasks.updateStatus.useMutation();

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title: taskTitle,
        description: taskDescription,
        taskType,
        input: {} as Record<string, unknown>,
      });
      toast.success("Task created successfully");
      setTaskTitle("");
      setTaskDescription("");
      setTaskType("web_scrape");
      setIsOpen(false);
      refetchTasks();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleExecuteTask = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await executeTaskMutation.mutateAsync({
        taskId,
        description: task.description || task.title,
        context: (task.input as Record<string, unknown>) || {},
      });
      toast.success("Task executed successfully");
      refetchTasks();
    } catch (error) {
      toast.error("Failed to execute task");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Click Browser Agent
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Welcome back, {user?.name || "User"}! Control your AI agent and automate web tasks.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{tasks.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Running
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "running").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Create Task Button */}
        <div className="mb-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">Create a New Task</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                  Define a new task for your AI agent to execute
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                    Task Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Scrape product prices"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you want the agent to do..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-slate-700 dark:text-slate-300">
                    Task Type
                  </Label>
                  <select
                    id="type"
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-900 dark:text-white"
                  >
                    <option value="web_scrape">Web Scraping</option>
                    <option value="form_fill">Form Filling</option>
                    <option value="automation">Automation</option>
                    <option value="data_extraction">Data Extraction</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateTask}
                    disabled={createTaskMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  >
                    {createTaskMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Task"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your Tasks</h2>
          {tasksLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : tasks.length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600 dark:text-slate-400">No tasks yet. Create your first task to get started!</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <CardTitle className="text-slate-900 dark:text-white">{task.title}</CardTitle>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                          {task.status}
                        </span>
                      </div>
                      {task.description && (
                        <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
                          {task.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {task.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleExecuteTask(task.id)}
                          disabled={executeTaskMutation.isPending}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Execute
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {(task.result as any) && (
                  <CardContent>
                    <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded text-sm text-slate-600 dark:text-slate-400">
                      <p className="font-semibold mb-1">Result:</p>
                      <pre className="overflow-auto text-xs">{String(typeof task.result === 'object' ? JSON.stringify(task.result, null, 2) : task.result || '')}</pre>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
