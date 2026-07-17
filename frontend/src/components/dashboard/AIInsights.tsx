import { Sparkles } from "lucide-react";

export default function AIInsights() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex items-center gap-3">

        <Sparkles className="text-blue-500" />

        <h2 className="text-2xl font-bold text-white">
          AI Insights
        </h2>

      </div>

      <div className="mt-6 space-y-4">

        <div className="rounded-xl bg-zinc-950 p-4">
          <p className="text-zinc-300">
            🚀 Productivity increased by
            <span className="font-bold text-blue-500"> 18%</span>
            this week.
          </p>
        </div>

        <div className="rounded-xl bg-zinc-950 p-4">
          <p className="text-zinc-300">
            ⚠️ Backend project may miss its deadline.
          </p>
        </div>

        <div className="rounded-xl bg-zinc-950 p-4">
          <p className="text-zinc-300">
            💡 AI recommends reviewing 4 pull requests.
          </p>
        </div>

      </div>

    </div>
  );
}