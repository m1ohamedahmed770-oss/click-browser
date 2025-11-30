import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  validateTaskSecurity,
  sanitizeTask,
  createExecutionContext,
  logSecurityEvent,
} from "../agent";

/**
 * Agent Router
 * Handles task submission, execution, and monitoring
 */

// Task schema
const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  task: z.string().min(1).max(1000),
  status: z.enum(["pending", "running", "completed", "failed"]),
  result: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
  securityCheck: z.object({
    safe: z.boolean(),
    reason: z.string().optional(),
  }),
});

type Task = z.infer<typeof TaskSchema>;

// In-memory task storage (in production, use database)
const tasks: Map<string, Task> = new Map();

export const agentRouter = router({
  /**
   * Submit a new task to the agent
   */
  submitTask: protectedProcedure
    .input(
      z.object({
        task: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const userId = ctx.user.id.toString();

      // Security validation
      const securityCheck = validateTaskSecurity(input.task);

      if (!securityCheck.safe) {
        logSecurityEvent({
          type: "blocked",
          taskId,
          userId,
          action: "submit_task",
          reason: securityCheck.reason,
          timestamp: new Date(),
        });

        return {
          success: false,
          error: `Task blocked for security: ${securityCheck.reason}`,
          taskId,
        };
      }

      // Sanitize the task
      const sanitizedTask = sanitizeTask(input.task);

      // Create execution context
      const executionContext = createExecutionContext(
        taskId,
        sanitizedTask,
        userId
      );

      // Create task record
      const task: Task = {
        id: taskId,
        userId,
        task: sanitizedTask,
        status: "pending",
        createdAt: new Date(),
        securityCheck,
      };

      tasks.set(taskId, task);

      logSecurityEvent({
        type: "allowed",
        taskId,
        userId,
        action: "submit_task",
        timestamp: new Date(),
      });

      // Simulate task execution
      setTimeout(async () => {
        const updatedTask = tasks.get(taskId);
        if (updatedTask) {
          updatedTask.status = "running";

          // Simulate work
          await new Promise((resolve) => setTimeout(resolve, 2000));

          updatedTask.status = "completed";
          updatedTask.result = `Successfully processed: ${updatedTask.task}`;
          updatedTask.completedAt = new Date();
        }
      }, 100);

      return {
        success: true,
        taskId,
        message: "Task submitted successfully",
      };
    }),

  /**
   * Get task status
   */
  getTaskStatus: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(({ input, ctx }) => {
      const task = tasks.get(input.taskId);

      if (!task) {
        return {
          found: false,
          error: "Task not found",
        };
      }

      // Only allow users to see their own tasks
      if (task.userId !== ctx.user.id.toString()) {
        logSecurityEvent({
          type: "warning",
          taskId: input.taskId,
          userId: ctx.user.id.toString(),
          action: "access_other_user_task",
          timestamp: new Date(),
        });

        return {
          found: false,
          error: "Unauthorized access",
        };
      }

      return {
        found: true,
        task: {
          id: task.id,
          status: task.status,
          result: task.result,
          error: task.error,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
        },
      };
    }),

  /**
   * Get user's task history
   */
  getTaskHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(({ input, ctx }) => {
      const userId = ctx.user.id.toString();
      const userTasks = Array.from(tasks.values())
        .filter((t) => t.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(input.offset, input.offset + input.limit);

      return {
        tasks: userTasks.map((t) => ({
          id: t.id,
          task: t.task,
          status: t.status,
          result: t.result,
          createdAt: t.createdAt,
          completedAt: t.completedAt,
        })),
        total: Array.from(tasks.values()).filter((t) => t.userId === userId)
          .length,
      };
    }),

  /**
   * Get agent status
   */
  getAgentStatus: publicProcedure.query(async ({ ctx }) => {
    const totalTasks = tasks.size;
    const runningTasks = Array.from(tasks.values()).filter(
      (t) => t.status === "running"
    ).length;
    const completedTasks = Array.from(tasks.values()).filter(
      (t) => t.status === "completed"
    ).length;

    return {
      status: "ready",
      sandbox: true,
      totalTasks,
      runningTasks,
      completedTasks,
      security: {
        dataProtection: true,
        noAccountAccess: true,
        noPaymentAccess: true,
        sandboxActive: true,
      },
    };
  }),

  /**
   * Get security restrictions
   */
  getSecurityInfo: publicProcedure.query(() => {
    return {
      restrictions: {
        noVisa: "Credit card and payment information cannot be accessed",
        noAccounts: "User accounts and authentication cannot be accessed",
        noPersonalData: "Personal and sensitive data is protected",
        noFileSystem: "File system access is restricted",
        sandboxOnly: "All operations run in isolated sandbox environment",
      },
      allowedActions: [
        "Navigate websites",
        "Search information",
        "Read public content",
        "Click elements",
        "Fill forms (non-sensitive)",
        "Take screenshots",
        "Extract text",
      ],
    };
  }),
});
