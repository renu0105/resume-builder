"use client";
import axios from "axios";
import React, { useState } from "react";
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
    <div className="flex flex-col items-center lg:m-24 lg:ml-48 max-h-screen">
      <h1 className="text-3xl font-bold">Interview Preparation</h1>

      <p className="font-serif text-gray-400 text-lg">
        Tell us about your role which you want to prepare for
      </p>
      <div className="flex flex-row items-center justify-between gap-2 w-full max-w-5xl ">
        <input
          type="text"
          placeholder="E.g. Software Engineer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-gray-500 w-3xl"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded border p-2 font-normal w-44"
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
          className="bg-blue-500 text-white p-2 rounded-lg w-20 my-4
      hover:bg-blue-600"
        >
          Submit
        </button>
      </div>

      {response.map((msg, index) => (
        <div
          key={index}
          className={`p-4 w-5xl ml-48 my-4 rounded-lg ${msg.role === "user" ? "bg-neutral-500 self-end " : "bg-gray-200 self-start"}`}
        >
          {msg.content}
        </div>
      ))}
      <div className="flex flex-row items-center m-4 fixed bottom-4 w-full max-w-5xl">
        <input
          type="text"
          placeholder="Enter your answer..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring focus:ring-gray-500 w-5xl border-r-0"
        />
        <button
          type="button"
          onClick={startListening}
          className="border border-gray-300 p-4 rounded-lg hover:bg-gray-100"
        >
          🎤
        </button>
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
        <button
          onClick={() => {
            setRole("");
            setSessionId(null);
            setResponse([]);
            setAnswer("");
          }}
          className="bg-gray-500 text-white p-4 rounded-lg hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Page;
