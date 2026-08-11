"use client";
import axios from "axios";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast/headless";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Software Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
];

function Page() {
  type Feedback = {
    score: number;
    strengths: string;
    improvements: string[];
    improvedAnswer: string;
  };

  type ResponseMessage = {
    role: "user" | "assistant";
    content: string;
    // Set on an assistant turn that graded the answer just before it.
    feedback?: Feedback | null;
  };

  const [role, setRole] = useState("");
  const [response, setResponse] = useState<ResponseMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const trimmedAnswer = answer.trim();

      if (trimmedAnswer) {
        setResponse((prev) => [
          ...prev,
          { role: "user", content: trimmedAnswer },
        ]);
      }

      const response = await axios.post("/api/interview", {
        role,
        answer: trimmedAnswer,
        sessionId,
      });

      if (response.data?.sessionId) {
        setSessionId(response.data.sessionId);
      }

      const assistantMessage = response.data?.message?.content || "";

      setResponse((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantMessage,
          feedback: response.data?.feedback ?? null,
        },
      ]);

      setAnswer(""); // Clear the answer input after sending
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      console.log("Fetch attempt completed.");
    }
  };

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
      setAnswer(transcript);
    };
    toast.success("Listening... Please speak now.");
    recognition.start();
  };

  const startInterview = async () => {
    if (!role.trim()) {
      toast.error("Please enter or select a role first.");
      return;
    }

    try {
      const res = await axios.post("/api/interview", {
        role,
        answer: "",
        sessionId: null,
      });

      if (res.data?.sessionId) {
        setSessionId(res.data.sessionId);
      }

      setResponse([
        {
          role: "assistant",
          content: res.data?.message?.content || "",
        },
      ]);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-8 pb-32 sm:px-6">
      <h1 className="text-xl font-semibold text-neutral-900 lg:text-3xl dark:text-white">
        Interview Preparation
      </h1>

      <p className="my-2 w-full text-center text-sm text-neutral-500 lg:text-base dark:text-neutral-400">
        Tell us about your role which you want to prepare for
      </p>
      <div className="mt-4 flex w-full flex-col items-stretch justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900">
        <input
          type="text"
          placeholder="E.g. Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-400 focus:border-purple-500 focus:outline-none focus:ring focus:ring-purple-500/30 sm:w-64 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 font-normal text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring focus:ring-purple-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
        >
          <option value="">Select a role</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          onClick={startInterview}
          className="shrink-0 rounded-lg bg-purple-700 px-5 py-2 font-semibold text-white transition-colors hover:bg-purple-800 sm:w-24"
        >
          Submit
        </button>
      </div>

      {response.map((msg, index) => (
        <React.Fragment key={index}>
          {msg.feedback && (
            <div className="mt-4 w-full self-start rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:border-purple-500/25 dark:bg-purple-500/10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-wide text-purple-700 uppercase dark:text-purple-300">
                  Feedback on your answer
                </h2>
                <span className="shrink-0 rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-800 dark:bg-purple-500/20 dark:text-purple-200">
                  {msg.feedback.score}/10
                </span>
              </div>

              {msg.feedback.strengths && (
                <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                  <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                    What went well:{" "}
                  </strong>
                  {msg.feedback.strengths}
                </p>
              )}

              {msg.feedback.improvements.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    How to improve
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                    {msg.feedback.improvements.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {msg.feedback.improvedAnswer && (
                <details className="group mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-purple-700 hover:underline dark:text-purple-400">
                    Show a stronger version of your answer
                  </summary>
                  <p className="mt-2 rounded-lg border border-neutral-200 bg-white p-3 text-sm leading-relaxed text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                    {msg.feedback.improvedAnswer}
                  </p>
                </details>
              )}
            </div>
          )}
          <div
            className={`mt-4 max-w-[85%] px-4 py-3 leading-relaxed ${msg.role === "user" ? "self-end rounded-2xl rounded-br-sm bg-purple-600 text-white" : "self-start rounded-2xl rounded-bl-sm border border-neutral-200 bg-neutral-50 text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"}`}
          >
            {msg.content}
          </div>
        </React.Fragment>
      ))}
      <div className="fixed bottom-4 left-1/2 flex w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 flex-row items-center justify-between gap-2 rounded-2xl border border-neutral-300 bg-white p-2 shadow-lg sm:w-[calc(100%-3rem)] dark:border-neutral-700 dark:bg-neutral-900">
        <input
          type="text"
          placeholder="Enter your answer..."
          value={answer}
          className="w-full bg-transparent px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:outline-none dark:text-neutral-100"
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Toaster />

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={startListening}
            className="rounded-lg px-3 py-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            🎤
          </button>
          <button
            disabled={!role.trim() || !answer.trim()}
            onClick={fetchData}
            className="rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
