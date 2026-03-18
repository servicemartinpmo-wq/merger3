'use client';

import { motion } from "motion/react";
import { Rocket, Sparkles, Layout, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-emerald-100 rounded-2xl">
            <Rocket className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
            Project Reinitialized
          </h1>
          <p className="text-xl text-zinc-600">
            Your application has been restored with a clean Next.js architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <FeatureCard 
            icon={<Zap className="w-5 h-5" />}
            title="Fast"
            description="Built with Next.js 15 and App Router."
          />
          <FeatureCard 
            icon={<Layout className="w-5 h-5" />}
            title="Styled"
            description="Tailwind CSS v4 for modern UI."
          />
          <FeatureCard 
            icon={<Sparkles className="w-5 h-5" />}
            title="Animated"
            description="Motion for smooth transitions."
          />
        </div>

        <div className="pt-8">
          <button className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors shadow-md">
            Get Started
          </button>
        </div>
      </motion.div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-white border border-zinc-200 rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
      <div className="text-emerald-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-zinc-900 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
