"use client";
import axios from "axios";
import React, { useState } from "react";
import GaugeComponent from "react-gauge-component";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";

type Suggestion = {
  title: string;
  description: string;
  priority?: string;
};

// Shape returned by /api/analyzer — a resumeAnalysis DB row. The list fields
// are stored as JSON strings, so they need parsing before display.
type AnalysisResult = {
  id?: number;
  score: string | number;
  summary: string;
  missingKeywords: string | string[];
  suggestions: string | Suggestion[];
};

// Safely turn a JSON-string-or-array column into a typed array.
function parseList<T>(value: string | T[] | undefined | null): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function Page() {
  const { status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [atsScore, setAtsScore] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async (file: File | null) => {
    if (status === "loading") {
      toast("Checking your session… please try again in a moment.");
      return;
    }

    if (status !== "authenticated") {
      toast.error("Please sign in to analyze your resume.");
      signIn("google");
      return;
    }

    if (!file) {
      toast("Please upload a resume file to analyze.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await axios.post("/api/analyzer", formData);
      const data: AnalysisResult = result.data.data;
      console.log(data);
      setResult(data);
      setAtsScore(Number(data.score) || 0); // score is stored as a string

      if (result.data.duplicate) {
        toast("This resume was already analyzed — showing your saved results.");
      }
      // Note: the analyzer route already persists the resume + analysis, so we
      // do NOT post to /api/resume again here (that stored a duplicate row).
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Your session expired. Please sign in again.");
        signIn("google");
        return;
      }
      console.error("Error analyzing resume:", error);
      // Surface the server's message (e.g. unsupported file type) when present.
      const serverMessage = axios.isAxiosError(error)
        ? error.response?.data?.error
        : undefined;
      toast.error(
        serverMessage || "Failed to analyze resume. Please try again.",
      );
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center max-h-screen lg:w-7xl w-2xl mx-auto my-4 rounded-lg p-4 m-10 bg-gray-100">
      <div className=" lgw-7xl w-xl flex flex-col items-center p-8">
        <h1 className=" text-xl lg:text-3xl font-bold mb-2">
          Analyze Your Resume
        </h1>
        <p className="text-md text-gray-400 mb-8 text-center lg:max-w-2xl w-xl">
          Analyze your resume with AI and get personalized feedback to improve
          your chances of landing your dream job.
        </p>

        {!result ? (
          <div
            className="text-lg text-gray-400 border rounded-4xl border-dashed h-100 lg:w-5xl w-xl text-center flex flex-col items-center justify-center gap-2"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFile = e.dataTransfer.files?.[0];
              if (droppedFile) {
                setFile(droppedFile);
              }
            }}
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx"
              onChange={handleChange}
              className="hidden"
              placeholder="Drag and drop your file here or click to upload"
            />
            {file ? (
              <>
                <p>{file.name}</p>
                <p>File size: {Math.round(file.size / 1024)} KB</p>
              </>
            ) : (
              <>
                <p>Drag and drop your file here</p>
                <p>Supported formats: PDF, DOCX</p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full max-w-5xl h-170">
            <div className="w-150 h-75">
              <GaugeComponent
                value={atsScore}
                arc={{
                  subArcs: [
                    { limit: 60, color: "#ff0000" },
                    { limit: 80, color: "#ffff00" },
                    { limit: 100, color: "#00ff00" },
                  ],
                }}
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <p className="w-full border border-gray-300 p-4 rounded-lg">
                <strong className=" text-red-500 font-bold">
                  Missing Keywords:
                </strong>{" "}
                {(() => {
                  const keywords = parseList<string>(result.missingKeywords);
                  return keywords.length > 0 ? keywords.join(", ") : "None 🎉";
                })()}
              </p>
              <p className="w-full border border-gray-300 p-4 rounded-lg">
                <strong className=" text-blue-500 font-bold">Summary:</strong>{" "}
                {result.summary || "No summary available."}
              </p>
              <div className=" w-full rounded-lg p-4 border border-gray-300">
                <strong className=" text-green-500 font-bold ">
                  Suggestions to Improve:
                </strong>
                {parseList<Suggestion>(result.suggestions).map((s, index) => (
                  <div key={index} className="flex flex-col mt-2">
                    <li>
                      <strong>{s.title}:</strong> {s.description}
                    </li>
                    {s.priority && (
                      <p className="text-sm text-gray-500">
                        Priority: {s.priority}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <Toaster />
        <div className="flex flex-row gap-4 mt-8 lg:w-5xl justify-center my-4 bottom-0 w-xl ">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold p-4 rounded w-44 disabled:opacity-60 lg:w-[50%]"
            onClick={() => handleAnalyze(file)}
            disabled={status === "loading"}
          >
            {status === "unauthenticated"
              ? "Sign in to Analyze"
              : "Analyze Resume"}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-semibold p-4 rounded lg:w-[50%] w-44 text-center"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
