"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "@/app/types/speech-recognition";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function Page() {
  const [askedQuestion, setAskedQuestion] = useState("");
  const [message, setMessage] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const fetchAnswer = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    try {
      setLoading(true);
      setAskedQuestion("");

      setMessage((prev: Message[]) => [
        ...prev,
        {
          role: "user",
          content: trimmed,
        },
      ]);

      // Conversation context is loaded server-side from the session; we only
      // send the current question plus the session id (null on the first turn).
      const res = await axios.post("/api/chat-bot", {
        question: trimmed,
        sessionId,
      });

      if (res.data.sessionId) {
        setSessionId(res.data.sessionId);
      }

      setMessage((prev: Message[]) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.message.content,
        },
      ]);
    } catch (error) {
      console.error("Error fetching answer:", error);
      toast.error("Failed to fetch answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [message, loading]);

  const startListening = () => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert("Speech Recognition is not supported");
      return;
    }

    const recognition = new SpeechRecognitionCtor() as SpeechRecognition;

    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setAskedQuestion(transcript);
    };
    toast.success("Listening... Please speak now.");
    recognition.start();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pt-8 pb-28 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900 lg:text-3xl dark:text-white">
        AI Assistant
      </h1>
      <p className="mt-1 text-neutral-500 dark:text-neutral-400">
        Ask anything to the AI assistant!
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchAnswer(askedQuestion);
        }}
        className="w-full"
      >
        {message.length === 0 ? (
          <div className="mt-6 flex h-[55vh] flex-col items-center justify-center gap-2 overflow-y-auto rounded-2xl border border-dashed border-neutral-300 bg-white px-6 text-center sm:h-[60vh] dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              Welcome to the AI Assistant!
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              Ask any question and get an instant answer.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex h-[55vh] w-full flex-col justify-start gap-3 overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 sm:h-[60vh] dark:border-neutral-800 dark:bg-neutral-900">
            {message.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] px-4 py-3 leading-relaxed ${msg.role === "user" ? "self-end rounded-2xl rounded-br-sm bg-purple-600 text-white" : "self-start rounded-2xl rounded-bl-sm border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] animate-pulse self-start rounded-2xl rounded-bl-sm border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
        <div className="fixed bottom-4 left-1/2 flex w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 items-center justify-between gap-2 rounded-2xl border border-neutral-300 bg-white p-2 shadow-lg sm:w-[calc(100%-3rem)] dark:border-neutral-700 dark:bg-neutral-900">
          <input
            type="text"
            placeholder="Type your question here..."
            value={askedQuestion}
            onChange={(e) => setAskedQuestion(e.target.value)}
            disabled={loading}
            className="w-full bg-transparent px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:outline-none disabled:opacity-60 dark:text-neutral-100"
          />
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={startListening}
              disabled={loading}
              className="rounded-lg px-3 py-2 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-neutral-800"
            >
              🎤
            </button>
            <button
              type="submit"
              disabled={loading || !askedQuestion.trim()}
              className="rounded-lg bg-purple-700 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Page;
