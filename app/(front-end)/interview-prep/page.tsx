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
  type ResponseMessage = {
    role: "user" | "assistant";
    content: string;
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
        { role: "assistant", content: assistantMessage },
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
    <div className="flex flex-col items-center justify-center w-full p-4 ">
      <h1 className="lg:text-3xl text-xl font-semibold">
        Interview Preparation
      </h1>

      <p className="font-serif text-gray-300 lg:text-lg text-sm w-full text-center my-1">
        Tell us about your role which you want to prepare for
      </p>
      <div className="flex flex-row items-center justify-between gap-2 w-full lg:max-w-5xl">
        <input
          type="text"
          placeholder="E.g. Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-gray-500 "
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded border p-2 font-normal w-full"
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
          className="bg-purple-500 text-white p-2 rounded-lg w-20 my-4
          hover:bg-purple-600"
        >
          Submit
        </button>
      </div>

      {response.map((msg, index) => (
        <div
          key={index}
          className={`p-4 lg:w-4xl my-4 w-84 rounded-lg ${msg.role === "user" ? "bg-neutral-400 self-end " : "bg-gray-200 self-start"}`}
        >
          {msg.content}
        </div>
      ))}
      <div className="flex flex-row items-center m-2 fixed bottom-4 w-full lg:max-w-5xl border border-gray-400 p-4 rounded-2xl justify-between">
        <input
          type="text"
          placeholder="Enter your answer..."
          value={answer}
          className="bg-transparent focus:outline-none w-full text-gray-700 placeholder-gray-400"
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Toaster />

        <div className="flex gap-2">
          <button type="button" onClick={startListening}>
            🎤
          </button>
          <button
            disabled={!role.trim() || !answer.trim()}
            onClick={fetchData}
            className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
