import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, Globe, Brain, Code, Shield, Smartphone } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Click Browser
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Your AI-powered web automation agent is ready to work
          </p>
          <a href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Click Browser
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            The AI-powered web browser that automates your tasks. Built on Chromium, open source, and ready to work for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 w-full sm:w-auto">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-lg px-8 py-6 w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-slate-900 dark:text-white">Full Browser Control</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Complete Chromium-based browser with tabs, bookmarks, history, and all standard browser features.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-slate-900 dark:text-white">AI Agent System</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Intelligent agent that understands natural language and automates complex web tasks.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Code className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-slate-900 dark:text-white">Open Source</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Fully open source on GitHub. Customize, extend, and deploy on your own infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-slate-900 dark:text-white">Local & Cloud</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Run locally on your machine or deploy to any server. Complete control over your data.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-slate-900 dark:text-white">Secure & Private</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Your data stays with you. No cloud dependency, no data sharing with third parties.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-slate-900 dark:text-white">Powerful Tools</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Web scraping, form filling, data extraction, and advanced browser automation tools.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Automate?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start using Click Browser today and let your AI agent handle repetitive web tasks.
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-white hover:bg-slate-100 text-blue-600 text-lg px-8 py-6">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 Click Browser. Open source project on GitHub.</p>
        </div>
      </footer>
    </div>
  );
}
