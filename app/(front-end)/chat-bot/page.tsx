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

    const recognition =
      new (SpeechRecognitionCtor as new () => SpeechRecognition)();

    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAskedQuestion(transcript);
    };
    toast.success("Listening... Please speak now.");
    recognition.start();
  };

  return (
    <div className="flex flex-col items-center max-h-screen w-full max-w-7xl mx-auto ">
      <div className="flex flex-col items-center w-full max-w-7xl ml-48">
        <h1 className="text-2xl font-bold mt-20">AI Assistant</h1>
        <p className="text-gray-600">Ask anything to the AI assistant!</p>
        <div className="flex flex-col items-center gap-4 h-150">
          <form
            className="flex flex-col items-center gap-4 h-20"
            onSubmit={(e) => {
              e.preventDefault();
              fetchAnswer(askedQuestion);
            }}
          >
            {message.length === 0 ? (
              <div className="p-4 border border-gray-300 rounded-lg w-5xl max-w-7xl flex flex-col items-center gap-2  justify-center h-screen min-h-140 my-4 overflow-y-auto">
                <p className="text-lg font-semibold">
                  Welcome to the AI Assistant!
                </p>
                <p>Ask any question and get an instant answer.</p>
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-lg w-full max-w-7xl flex flex-col items-center gap-2 justify-start h-screen min-h-140 my-4 overflow-y-auto">
                {message.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${msg.role === "user" ? "bg-neutral-500 text-white self-end" : "bg-gray-200 self-start"}`}
                  >
                    {msg.content}
                  </div>
                ))}
                {loading && (
                  <div className="p-4 rounded-lg bg-gray-200 self-start text-gray-500 animate-pulse">
                    Thinking...
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
            <div className="flex gap-2 w-screen max-w-5xl fixed bottom-2">
              <input
                type="text"
                placeholder="Type your question here..."
                className="border border-gray-300 rounded-lg w-full focus:outline-none p-4 border-r-0 disabled:opacity-60"
                value={askedQuestion}
                onChange={(e) => setAskedQuestion(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={startListening}
                disabled={loading}
                className="border  border-r rounded-lg border-gray-300 p-4 bg-white hover:bg-gray-100 disabled:opacity-60"
              >
                🎤
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg disabled:opacity-60"
                type="submit"
                disabled={loading || !askedQuestion.trim()}
              >
                {loading ? "..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
