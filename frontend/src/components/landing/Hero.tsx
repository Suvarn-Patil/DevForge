import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-950">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
          AI Powered Developer Collaboration
        </span>

        <h1 className="mt-8 text-6xl font-extrabold leading-tight text-white md:text-7xl">

          Build Better

          <span className="text-blue-500">
            {" "}
            Software
          </span>

          <br />

          Together.

        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">

          Manage projects, collaborate with teammates,
          review code using AI and ship products faster
          than ever before.

        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

          <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500">

            Start Free

            <ArrowRight size={20} />

          </button>

          <button className="rounded-xl border border-zinc-700 px-8 py-4 font-semibold text-white transition hover:border-blue-500">

            Live Demo

          </button>

        </div>

      </div>

    </section>
  );
}