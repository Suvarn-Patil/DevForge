import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="p-8">

          <h1 className="text-4xl font-bold text-white">
            Settings
          </h1>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 space-y-6">

            <div>

              <label className="block text-zinc-400 mb-2">
                Full Name
              </label>

              <input
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
                defaultValue="Suvarn Patil"
              />

            </div>

            <div>

              <label className="block text-zinc-400 mb-2">
                Email
              </label>

              <input
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white"
                defaultValue="suvarn@example.com"
              />

            </div>

            <button
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Save Changes
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}