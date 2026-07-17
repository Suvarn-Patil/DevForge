export default function Trusted() {
  const companies = [
    "Google",
    "Microsoft",
    "OpenAI",
    "GitHub",
    "Amazon",
    "Netflix",
  ];

  return (
    <section className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <p className="text-center text-sm uppercase tracking-[0.3em] text-zinc-500">
          Trusted by developers worldwide
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {companies.map((company) => (
            <div
              key={company}
              className="rounded-xl border border-zinc-800 bg-zinc-900 py-6 text-center font-semibold text-zinc-400 transition hover:border-blue-500 hover:text-white"
            >
              {company}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}