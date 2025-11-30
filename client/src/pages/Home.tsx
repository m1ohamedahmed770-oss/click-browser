import { AgentInterface } from "@/components/AgentInterface";

/**
 * Home Page - Click Browser Agent Interface
 * Main landing page with the agent control interface
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AgentInterface />
    </div>
  );
}
