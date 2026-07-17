const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer",
    review:
      "DevForge completely changed how our team manages projects.",
  },
  {
    name: "Emily Johnson",
    role: "Tech Lead",
    review:
      "The AI assistant saves us hours every week.",
  },
  {
    name: "Akash Patil",
    role: "Full Stack Developer",
    review:
      "Beautiful interface with everything in one place.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <h2 className="text-center text-5xl font-bold text-white">
          Loved by Teams
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
            >
              <p className="text-zinc-400">
                "{item.review}"
              </p>

              <h3 className="mt-8 text-xl font-semibold text-white">
                {item.name}
              </h3>

              <p className="text-zinc-500">
                {item.role}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}