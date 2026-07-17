const stats = [
  {
    value: "50K+",
    label: "Developers",
  },
  {
    value: "1200+",
    label: "Teams",
  },
  {
    value: "1M+",
    label: "Tasks Managed",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
];

export default function Stats() {
  return (
    <section className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center transition hover:border-blue-500"
          >
            <h2 className="text-5xl font-bold text-blue-500">
              {stat.value}
            </h2>

            <p className="mt-3 text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}