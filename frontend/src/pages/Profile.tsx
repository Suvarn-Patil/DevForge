import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function Profile() {
  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="p-8">

          <h1 className="text-4xl font-bold text-white">
            Profile
          </h1>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

            <div className="flex items-center gap-6">

              <img
                src="https://i.pravatar.cc/150"
                alt="profile"
                className="h-28 w-28 rounded-full"
              />

              <div>

                <h2 className="text-3xl font-bold text-white">
                  Suvarn Patil
                </h2>

                <p className="text-zinc-400">
                  Full Stack Developer
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}