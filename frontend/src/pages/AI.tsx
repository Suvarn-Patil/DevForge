import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function AI() {
  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex flex-1 flex-col p-8">

          <h1 className="text-4xl font-bold text-white">
            AI Assistant
          </h1>

          <p className="mt-2 text-zinc-400">
            Ask DevForge AI anything.
          </p>

          <div className="mt-8 flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <div className="space-y-4">

              <div className="max-w-xl rounded-2xl bg-zinc-950 p-4 text-zinc-300">
                How can I optimize my backend architecture?
              </div>

              <div className="ml-auto max-w-xl rounded-2xl bg-blue-600 p-4 text-white">
                Consider using a service layer, JWT authentication,
                proper validation and MongoDB indexing.
              </div>

            </div>

          </div>

          <div className="mt-6 flex gap-4">

            <input
              placeholder="Ask AI something..."
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none focus:border-blue-500"
            />

            <button
              className="rounded-xl bg-blue-600 px-8 font-semibold text-white hover:bg-blue-500"
            >
              Send
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}