import { invokeLLM } from "./_core/llm";
import { logExecution, updateTaskStatus } from "./db";

/**
 * Agent Tool Definition
 */
export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Browser automation tools for the agent
 */
export const browserTools: AgentTool[] = [
  {
    name: "navigate",
    description: "Navigate to a URL in the browser",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "The URL to navigate to" },
      },
      required: ["url"],
    },
    execute: async (params) => {
      const { url } = params as { url: string };
      // This would be implemented with actual browser automation
      return { success: true, url };
    },
  },
  {
    name: "click",
    description: "Click on an element on the page",
    parameters: {
      type: "object",
      properties: {
        selector: { type: "string", description: "CSS selector of the element to click" },
      },
      required: ["selector"],
    },
    execute: async (params) => {
      const { selector } = params as { selector: string };
      // This would be implemented with actual browser automation
      return { success: true, selector };
    },
  },
  {
    name: "type",
    description: "Type text into an input field",
    parameters: {
      type: "object",
      properties: {
        selector: { type: "string", description: "CSS selector of the input element" },
        text: { type: "string", description: "Text to type" },
      },
      required: ["selector", "text"],
    },
    execute: async (params) => {
      const { selector, text } = params as { selector: string; text: string };
      // This would be implemented with actual browser automation
      return { success: true, selector, text };
    },
  },
  {
    name: "screenshot",
    description: "Take a screenshot of the current page",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async () => {
      // This would be implemented with actual browser automation
      return { success: true, screenshotUrl: "https://example.com/screenshot.png" };
    },
  },
  {
    name: "extract_text",
    description: "Extract text content from the page",
    parameters: {
      type: "object",
      properties: {
        selector: { type: "string", description: "CSS selector to extract text from (optional)" },
      },
      required: [],
    },
    execute: async (params) => {
      const { selector } = params as { selector?: string };
      // This would be implemented with actual browser automation
      return { success: true, text: "Extracted text content" };
    },
  },
  {
    name: "wait",
    description: "Wait for a specific time or for an element to appear",
    parameters: {
      type: "object",
      properties: {
        duration: { type: "number", description: "Duration to wait in milliseconds" },
        selector: { type: "string", description: "CSS selector to wait for (optional)" },
      },
      required: [],
    },
    execute: async (params) => {
      const { duration } = params as { duration?: number };
      if (duration) {
        await new Promise((resolve) => setTimeout(resolve, duration));
      }
      return { success: true };
    },
  },
];

/**
 * Execute an agent task using LLM
 */
export async function executeAgentTask(
  taskId: number,
  sessionId: number,
  taskDescription: string,
  context?: Record<string, unknown>
) {
  try {
    // Build the system prompt for the agent
    const systemPrompt = `You are an AI agent that can control a web browser. You have access to the following tools:
${browserTools.map((tool) => `- ${tool.name}: ${tool.description}`).join("\n")}

Your task is to complete the user's request by using these tools. Think step by step and explain your actions.
Always use the tools to accomplish the task. When you need to use a tool, respond with a JSON object containing the tool name and parameters.`;

    // Call the LLM with the task description
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Please complete this task: ${taskDescription}${context ? `\n\nContext: ${JSON.stringify(context)}` : ""}`,
        },
      ],
    });

    // Extract the response content
    const responseContent = response.choices[0]?.message.content || "";

    // Log the execution
    await logExecution(taskId, sessionId, "llm_call", { response: responseContent }, true);

    // Update task status to completed
    await updateTaskStatus(taskId, "completed", {
      response: responseContent,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      response: responseContent,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Log the execution error
    await logExecution(taskId, sessionId, "llm_call", {}, false, errorMessage);

    // Update task status to failed
    await updateTaskStatus(taskId, "failed", undefined, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get available tools for the agent
 */
export function getAvailableTools() {
  return browserTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
}
