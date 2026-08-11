"use client";
import axios from "axios";
import React, { useState } from "react";
import GaugeComponent from "react-gauge-component";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { FiFileText, FiUploadCloud, FiX } from "react-icons/fi";

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

// Matches the badge palette used on the dashboard. The model returns a
// free-form priority string, so anything unrecognised falls back to "low".
const priorityStyles: Record<string, string> = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
};

function scoreVerdict(score: number) {
  if (score >= 80)
    return {
      label: "Strong",
      tone: "text-emerald-600 dark:text-emerald-400",
      note: "Your resume should pass most ATS screens.",
    };
  if (score >= 60)
    return {
      label: "Needs work",
      tone: "text-amber-600 dark:text-amber-400",
      note: "A few fixes below will lift this score meaningfully.",
    };
  return {
    label: "At risk",
    tone: "text-rose-600 dark:text-rose-400",
    note: "Applicant tracking systems may filter this resume out.",
  };
}

function Page() {
  const { status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [atsScore, setAtsScore] = useState<number>(0);
  // Purely presentational: drives the spinner and the drop-zone highlight.
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
      setAnalyzing(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await axios.post("/api/analyzer", formData);
      const data: AnalysisResult = result.data.data;
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
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setResult(null);
  };

  const verdict = scoreVerdict(atsScore);
  const keywords = result ? parseList<string>(result.missingKeywords) : [];
  const suggestions = result ? parseList<Suggestion>(result.suggestions) : [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
          Analyze Your Resume
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-pretty text-neutral-500 sm:text-base dark:text-neutral-400">
          Get an ATS score and personalized feedback to improve your chances of
          landing your dream job.
        </p>
      </header>

      {!result ? (
        <section className="mt-8 flex flex-col gap-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.docx"
            onChange={handleChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const droppedFile = e.dataTransfer.files?.[0];
              if (droppedFile) {
                setFile(droppedFile);
              }
            }}
            className={`flex min-h-64 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:min-h-72 dark:focus-visible:ring-offset-neutral-900 ${
              dragActive
                ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10"
                : "border-neutral-300 bg-white hover:border-purple-400 hover:bg-purple-50/40 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-purple-500/50 dark:hover:bg-purple-500/5"
            }`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
              <FiUploadCloud />
            </span>
            <span className="text-base font-semibold text-neutral-900 dark:text-white">
              Drag and drop your resume here
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              or <span className="font-medium text-purple-600">browse</span> to
              upload — PDF or DOCX
            </span>
          </button>

          {file && (
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-lg text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                <FiFileText />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {Math.round(file.size / 1024)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                aria-label="Remove file"
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                <FiX />
              </button>
            </div>
          )}

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-neutral-900"
            onClick={() => handleAnalyze(file)}
            disabled={analyzing || status === "loading"}
          >
            {analyzing && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {analyzing
              ? "Analyzing…"
              : status === "unauthenticated"
                ? "Sign in to Analyze"
                : "Analyze Resume"}
          </button>
        </section>
      ) : (
        <section className="mt-8 flex flex-col gap-6">
          {/* Score */}
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:gap-8 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="w-full max-w-60 shrink-0">
              <GaugeComponent
                value={atsScore}
                arc={{
                  subArcs: [
                    { limit: 60, color: "#ef4444" },
                    { limit: 80, color: "#f59e0b" },
                    { limit: 100, color: "#5cc55e" },
                  ],
                }}
                labels={{
                  valueLabel: { hide: true },
                  tickLabels: { hideMinMax: true },
                }}
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                ATS Score
              </p>
              <p className={`mt-1 text-5xl font-bold ${verdict.tone}`}>
                {atsScore}
                <span className="text-xl font-medium text-neutral-400">
                  /100
                </span>
              </p>
              <p className={`mt-1 text-base font-semibold ${verdict.tone}`}>
                {verdict.label}
              </p>
              <p className="mt-1 text-sm text-pretty text-neutral-500 dark:text-neutral-400">
                {verdict.note}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Summary
            </h2>
            <p className="mt-2 leading-relaxed text-pretty text-neutral-700 dark:text-neutral-200">
              {result.summary || "No summary available."}
            </p>
          </div>

          {/* Missing keywords */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Missing Keywords
            </h2>
            {keywords.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 ring-1 ring-rose-200 ring-inset dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/25"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-emerald-600 dark:text-emerald-400">
                Nothing missing — great keyword coverage 🎉
              </p>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Suggestions to improve
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        {suggestion.title}
                      </p>
                      {suggestion.priority && (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            priorityStyles[suggestion.priority.toLowerCase()] ??
                            priorityStyles.low
                          }`}
                        >
                          {suggestion.priority}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {suggestion.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-900"
            onClick={handleReset}
          >
            Reset{" "}
          </button>
        </section>
      )}
    </main>
  );
}

export default Page;
