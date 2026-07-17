import {
  Brain,
  FolderGit2,
  KanbanSquare,
  Users,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Code Review",
    desc: "Review code instantly using AI.",
  },
  {
    icon: FolderGit2,
    title: "GitHub Integration",
    desc: "Connect repositories seamlessly.",
  },
  {
    icon: KanbanSquare,
    title: "Kanban Boards",
    desc: "Organize every sprint visually.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Work together in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Workspace",
    desc: "Enterprise-grade authentication.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Track productivity and progress.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-zinc-950 px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">

        <h2 className="text-center text-5xl font-bold text-white">
          Everything Developers Need
        </h2>

        <p className="mt-5 text-center text-zinc-400">
          One platform for planning, coding and shipping software.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition hover:border-blue-500 hover:-translate-y-2"
            >
              <feature.icon
                size={40}
                className="text-blue-500"
              />

              <h3 className="mt-6 text-2xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-4 text-zinc-400">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}