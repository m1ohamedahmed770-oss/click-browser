import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

/**
 * useAgent Hook
 * Manages agent task submission and monitoring
 */

export interface AgentTask {
  id: string;
  task: string;
  status: "pending" | "running" | "completed" | "failed";
  result?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export function useAgent() {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get agent status
  const { data: agentStatus } = trpc.agent.getAgentStatus.useQuery();

  // Submit task mutation
  const submitTaskMutation = trpc.agent.submitTask.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        // Task submitted successfully
        setTasks((prev) => [
          {
            id: result.taskId,
            task: "",
            status: "pending",
            createdAt: new Date(),
          },
          ...prev,
        ]);
      }
    },
    onError: (error) => {
      console.error("Task submission failed:", error);
    },
  });

  // Get task status
  const getTaskStatusQuery = trpc.agent.getTaskStatus.useQuery(
    { taskId: "" },
    { enabled: false }
  );

  // Get task history
  const { data: taskHistory, refetch: refetchHistory } =
    trpc.agent.getTaskHistory.useQuery({
      limit: 50,
      offset: 0,
    });

  // Get security info
  const { data: securityInfo } = trpc.agent.getSecurityInfo.useQuery();

  // Submit a new task
  const submitTask = useCallback(
    async (taskDescription: string) => {
      if (!taskDescription.trim()) {
        return { success: false, error: "Task cannot be empty" };
      }

      setIsLoading(true);
      try {
        const result = await submitTaskMutation.mutateAsync({
          task: taskDescription,
        });
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [submitTaskMutation]
  );

  // Check task status
  const checkTaskStatus = useCallback(
    async (taskId: string) => {
      try {
        const result = await getTaskStatusQuery.refetch();
        return result.data;
      } catch (error) {
        console.error("Failed to check task status:", error);
        return null;
      }
    },
    [getTaskStatusQuery]
  );

  // Refresh task history
  const refreshHistory = useCallback(async () => {
    await refetchHistory();
  }, [refetchHistory]);

  return {
    // State
    tasks,
    isLoading,
    agentStatus,
    taskHistory: taskHistory?.tasks || [],
    securityInfo,

    // Methods
    submitTask,
    checkTaskStatus,
    refreshHistory,

    // Status
    isReady: agentStatus?.status === "ready",
    sandboxActive: agentStatus?.sandbox === true,
  };
}
