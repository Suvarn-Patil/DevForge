import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  Send,
  Trash2,
  User,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import {
  chatWithAI,
} from "../services/aiService";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi! I'm DevForge AI. Ask me about programming, debugging, system design, databases, APIs, Git, or your project architecture.",
  },
];

export default function AI() {
  const [messages, setMessages] =
    useState<Message[]>(
      initialMessages
    );

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();

    if (!text || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response =
        await chatWithAI(text);

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error: any) {
      console.error(
        "AI request failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Sorry, I couldn't process that request.";

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages(initialMessages);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Topbar />

        <main className="flex min-h-0 flex-1 flex-col p-8">

          {/* HEADER */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                <Bot
                  size={26}
                  className="text-blue-400"
                />
              </div>

              <div>
                <h1 className="text-4xl font-bold text-white">
                  AI Assistant
                </h1>

                <p className="mt-1 text-zinc-400">
                  Your software engineering copilot.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={clearChat}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition hover:border-red-500/50 hover:text-red-400"
            >
              <Trash2 size={16} />
              Clear
            </button>

          </div>

          {/* CHAT */}

          <div className="mt-8 flex min-h-0 flex-1 flex-col rounded-2xl border border-zinc-800 bg-zinc-900">

            <div className="min-h-0 flex-1 overflow-y-auto p-6">

              <div className="mx-auto max-w-4xl space-y-6">

                {messages.map(
                  (message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role ===
                        "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      {message.role ===
                        "assistant" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                          <Bot
                            size={18}
                            className="text-blue-400"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-2xl whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-6 ${
                          message.role ===
                          "user"
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-950 text-zinc-300"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.role ===
                        "user" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                          <User
                            size={18}
                            className="text-zinc-400"
                          />
                        </div>
                      )}

                    </div>
                  )
                )}

                {loading && (
                  <div className="flex gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                      <Bot
                        size={18}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="rounded-2xl bg-zinc-950 px-5 py-4 text-sm text-zinc-500">
                      DevForge AI is thinking...
                    </div>

                  </div>
                )}

                <div
                  ref={messagesEndRef}
                />

              </div>

            </div>

            {/* INPUT */}

            <div className="border-t border-zinc-800 p-5">

              <div className="mx-auto flex max-w-4xl gap-3">

                <input
                  value={input}
                  onChange={(e) =>
                    setInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={loading}
                  placeholder="Ask DevForge AI..."
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none placeholder:text-zinc-600 focus:border-blue-500 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="flex items-center justify-center rounded-xl bg-blue-600 px-6 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={19} />
                </button>

              </div>

              <p className="mx-auto mt-3 max-w-4xl text-xs text-zinc-600">
                Press Enter to send.
              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}
