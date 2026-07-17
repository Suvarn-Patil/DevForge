const faqs = [
  {
    q: "Is DevForge free?",
    a: "Yes. You can start with the free plan.",
  },
  {
    q: "Does it support GitHub?",
    a: "Yes, repositories can be connected directly.",
  },
  {
    q: "Can I use AI Code Review?",
    a: "Absolutely. AI is integrated into the platform.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-zinc-950 py-24 px-6">

      <div className="mx-auto max-w-5xl">

        <h2 className="text-center text-5xl font-bold text-white">
          Frequently Asked Questions
        </h2>

        <div className="mt-16 space-y-6">

          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
            >
              <h3 className="text-xl font-semibold text-white">
                {faq.q}
              </h3>

              <p className="mt-3 text-zinc-400">
                {faq.a}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}