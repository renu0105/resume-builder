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
    <div className="flex flex-col items-center w-full my-4 md:my-2">
      <h1 className="lg:text-2xl text-lg font-bold">AI Assistant</h1>
      <p className="text-neutral-500">Ask anything to the AI assistant!</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchAnswer(askedQuestion);
        }}
        className="w-full lg:w-5xl"
      >
        {message.length === 0 ? (
          <div className="border border-gray-300 rounded-lg flex flex-col items-center gap-2 justify-center h-150 lg:h-130  overflow-y-auto my-4 mx-4">
            <p className="text-lg font-semibold">
              Welcome to the AI Assistant!
            </p>
            <p>Ask any question and get an instant answer.</p>
          </div>
        ) : (
          <div className="p-4 border border-gray-200 rounded-lg w-full max-w-md md:max-w-3xl lg:max-w-7xl flex flex-col items-center gap-2 justify-start h-150 lg:h-130 my-4 overflow-y-auto mx-auto">
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
        <div className="flex fixed bottom-2  border border-gray-300 p-2 rounded-2xl justify-between w-sm md:w-200 lg:w-250 bg-white md:m-2 m-4">
          <input
            type="text"
            placeholder="Type your question here..."
            value={askedQuestion}
            onChange={(e) => setAskedQuestion(e.target.value)}
            disabled={loading}
            className="bg-transparent focus:outline-none w-full text-gray-700 placeholder-gray-400"
          />
          <div className="flex gap-2">
            <button type="button" onClick={startListening} disabled={loading}>
              🎤
            </button>
            <button
              type="submit"
              disabled={loading || !askedQuestion.trim()}
              className="bg-purple-700 hover:bg-purple-900 text-white font-semibold p-2 rounded  text-center"
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
