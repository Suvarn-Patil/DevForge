import {
  useState,
} from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import {
  chatWithAI,
} from "../services/aiService";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AI() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSend = async () => {
    const message =
      input.trim();

    if (!message || loading) {
      return;
    }

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setLoading(true);

    try {
      const response =
        await chatWithAI(
          message
        );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response,
        },
      ]);
    } catch (error: any) {
      console.error(
        "AI request failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "AI is currently unavailable. Please try again later.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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

          <div className="mt-8 flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-zinc-950 p-5 text-zinc-400">
                  Start a conversation with DevForge AI.
                </div>
              )}

              {messages.map(
                (message, index) => (
                  <div
                    key={index}
                    className={
                      message.role ===
                      "user"
                        ? "ml-auto max-w-xl rounded-2xl bg-blue-600 p-4 text-white"
                        : "max-w-xl rounded-2xl bg-zinc-950 p-4 text-zinc-300"
                    }
                  >
                    {message.content}
                  </div>
                )
              )}

              {loading && (
                <div className="max-w-xl rounded-2xl bg-zinc-950 p-4 text-zinc-400">
                  DevForge is thinking...
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <input
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleSend();
                }
              }}
              disabled={loading}
              placeholder="Ask AI something..."
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-white outline-none focus:border-blue-500 disabled:opacity-50"
            />

            <button
              onClick={handleSend}
              disabled={
                loading ||
                !input.trim()
              }
              className="rounded-xl bg-blue-600 px-8 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Thinking..."
                : "Send"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
