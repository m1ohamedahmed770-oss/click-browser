import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Code2, Zap } from "lucide-react";

export default function AgentTools() {
  const { data: tools = [], isLoading } = trpc.agent.getTools.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Agent Tools
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Available tools for your AI agent to automate web tasks
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : tools.length === 0 ? (
            <Card className="col-span-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="pt-6 text-center">
                <p className="text-slate-600 dark:text-slate-400">No tools available</p>
              </CardContent>
            </Card>
          ) : (
            tools.map((tool, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-slate-900 dark:text-white">{tool.name}</CardTitle>
                      </div>
                      <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Parameters:
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded">
                        <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-auto">
                          {JSON.stringify(tool.parameters, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Code2 className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <CardTitle className="text-blue-900 dark:text-blue-100">How to Use Tools</CardTitle>
                <CardDescription className="text-blue-800 dark:text-blue-200 mt-2">
                  These tools are automatically available to your AI agent. When you create a task, the agent will intelligently select and use the appropriate tools to complete your request. Each tool has specific parameters that the agent will fill in based on your task description.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
