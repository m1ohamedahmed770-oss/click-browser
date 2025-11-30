import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClickLogo } from "./ClickLogo";
import { useAgent } from "@/hooks/useAgent";
import { Send, Settings, History, Shield, AlertCircle } from "lucide-react";

/**
 * AgentInterface Component
 * Main UI for the Click Browser Agent with glassmorphism design
 */
export function AgentInterface() {
  const [taskInput, setTaskInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    taskHistory,
    isLoading,
    agentStatus,
    securityInfo,
    submitTask,
    isReady,
    sandboxActive,
  } = useAgent();

  const handleSubmitTask = async () => {
    if (!taskInput.trim()) return;

    setErrorMessage("");
    const result = await submitTask(taskInput);

    if (!result.success) {
      setErrorMessage(result.error || "Failed to submit task");
    } else {
      setTaskInput("");
    }
  };

  const completedTasks = taskHistory?.filter((t) => t.status === "completed") || [];
  const pendingTasks = taskHistory?.filter((t) => t.status === "pending" || t.status === "running") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 md:p-8">
      {/* Header */}
      <div className="glass glass-transition mb-8 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="neon-glow-purple">
              <ClickLogo className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Click Browser
              </h1>
              <p className="text-sm text-muted-foreground">The Agent Browser</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="glass-transition hover:neon-glow-purple"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="glass-card p-4 flex items-start gap-3 border-primary/30">
          <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-primary">Secure Sandbox Environment</p>
            <p className="text-muted-foreground text-xs mt-1">
              This agent operates in a sandboxed environment. It cannot access personal data, financial information, or sensitive accounts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Task Input */}
        <div className="lg:col-span-2">
          <div className="glass glass-transition p-6 md:p-8 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Give Agent a Task
            </h2>
            <div className="space-y-4">
              {errorMessage && (
                <div className="glass-card p-4 border-l-2 border-destructive bg-destructive/5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}
              <div className="relative">
                <Input
                  placeholder="Describe what you want the agent to do..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmitTask()}
                  disabled={isLoading || !isReady}
                  className="glass-transition bg-input/50 border-primary/20 focus:border-primary focus:shadow-[0_0_20px_rgba(200,100,255,0.3)]"
                />
              </div>
              <Button
                onClick={handleSubmitTask}
                disabled={!taskInput.trim() || isLoading || !isReady}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(200,100,255,0.5)] glass-transition"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Processing..." : "Send Task"}
              </Button>
            </div>
          </div>

          {/* Task History */}
          <div className="glass glass-transition p-6 md:p-8">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-background/50 p-1 rounded-lg">
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <History className="w-4 h-4 mr-2" />
                  Recent ({pendingTasks?.length || 0})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Completed ({completedTasks?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-3 mt-4">
                {!pendingTasks || pendingTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No pending tasks. Give the agent a task to get started!</p>
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="glass-card p-4 border-l-2 border-primary glass-transition hover:border-accent"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{task.task}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                task.status === "completed"
                                  ? "bg-green-500/20 text-green-600"
                                  : task.status === "running"
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          {task.result && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {task.result}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3 mt-4">
                {!completedTasks || completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No completed tasks yet.</p>
                  </div>
                ) : (
                  completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="glass-card p-4 border-l-2 border-green-500 glass-transition"
                    >
                      <p className="font-medium text-foreground">{task.task}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {task.result}
                      </p>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar - Agent Status & Settings */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="glass glass-transition p-6">
            <h3 className="font-semibold mb-4 text-foreground">Agent Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    isReady
                      ? "bg-green-500/20 text-green-600"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {isReady ? "Ready" : "Loading"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks</span>
                <span className="text-sm font-semibold text-primary">
                  {taskHistory?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-semibold text-green-600">
                  {completedTasks?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass glass-transition p-6">
            <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Security
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Sandbox Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Data Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">No Account Access</span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="glass glass-transition p-6">
            <h3 className="font-semibold mb-4 text-foreground">Language</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 glass-transition hover:bg-primary/20"
              >
                English
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 glass-transition hover:bg-primary/20"
              >
                العربية
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
