const plans = [
  {
    name: "Starter",
    price: "Free",
    features: [
      "Up to 3 Projects",
      "Kanban Board",
      "Basic AI",
      "Community Support",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12/mo",
    features: [
      "Unlimited Projects",
      "Advanced AI",
      "GitHub Integration",
      "Analytics",
      "Priority Support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited Everything",
      "SSO Authentication",
      "Dedicated Manager",
      "Private Deployment",
    ],
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section className="bg-zinc-950 py-24 px-6">
      <div className="mx-auto max-w-7xl">

        <h2 className="text-center text-5xl font-bold text-white">
          Pricing
        </h2>

        <p className="mt-5 text-center text-zinc-400">
          Choose the perfect plan for your team.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-10 ${
                plan.highlight
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              <h3 className="text-3xl font-bold text-white">
                {plan.name}
              </h3>

              <p className="mt-5 text-5xl font-extrabold text-blue-500">
                {plan.price}
              </p>

              <div className="mt-8 space-y-3">

                {plan.features.map((feature) => (
                  <p
                    key={feature}
                    className="text-zinc-300"
                  >
                    ✓ {feature}
                  </p>
                ))}

              </div>

              <button className="mt-10 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500">
                Get Started
              </button>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}