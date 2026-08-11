"use client";
import { getAnalyzedResume, getTemplates } from "@/app/services/getData";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiFileText,
  FiLayout,
  FiMessageSquare,
  FiMic,
  FiTarget,
} from "react-icons/fi";
import type { IconType } from "react-icons";

const features = [
  {
    name: "Analyze Resume",
    description: "Get AI powered feedback and improve your resume.",
    link: "/analyzer",
    buttonText: "Analyze Now",
    logo: "/ats-analyzer.png",
    card: "border-purple-200 bg-purple-50 dark:border-purple-500/25 dark:bg-purple-500/10",
    button: "bg-purple-700 hover:bg-purple-800 focus-visible:ring-purple-500",
  },
  {
    name: "Build Resume",
    description: "Use professional templates to create a standout resume.",
    link: "/templates",
    buttonText: "Build Now",
    logo: "/templates.png",
    card: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10",
    button:
      "bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-emerald-500",
  },
  {
    name: "Mock Interviews",
    description:
      "Practice your interview skills with AI-powered mock interviews.",
    link: "/interview-prep",
    buttonText: "Start Interview",
    logo: "/interview-prep.png",
    card: "border-amber-200 bg-amber-50 dark:border-amber-500/25 dark:bg-amber-500/10",
    button: "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500",
  },
  {
    name: "AI Assistant",
    description:
      "Ask questions and get instant answers to your career and interview queries.",
    link: "/chat-bot",
    buttonText: "Get Advice",
    logo: "/chat-bot.png",
    card: "border-blue-200 bg-blue-50 dark:border-blue-500/25 dark:bg-blue-500/10",
    button: "bg-blue-700 hover:bg-blue-800 focus-visible:ring-blue-500",
  },
];

// Priority badge styling for analyzer suggestions. The model returns a free-form
// string, so anything unrecognised falls back to the neutral "low" treatment.
const priorityStyles: Record<string, string> = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
};

type StatCard = {
  title: string;
  value: number;
  hint: string;
  icon: IconType;
  accent: string;
  /** Percentage bar shown under the value — only the score card uses it. */
  progress?: number;
};

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<
    { title: string; description: string; priority?: string }[]
  >([]);
  const [templates, setTemplates] = useState<unknown[]>([]);
  const [chatSessions, setChatSessions] = useState<
    { id: number; title: string }[]
  >([]);
  const [interviews, setInterviews] = useState<{ id: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyzedResume = async () => {
      try {
        const resumeData = await getAnalyzedResume();
        if (resumeData?.score != null) {
          setAtsScore(Number(resumeData.score));
        }

        if (resumeData?.suggestions) {
          // The API stores suggestions as a JSON string, so parse it back
          // into an array (tolerating the case where it's already an array).
          const parsed =
            typeof resumeData.suggestions === "string"
              ? JSON.parse(resumeData.suggestions)
              : resumeData.suggestions;
          setSuggestions(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error("Error fetching analyzed resume:", error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const templateList = await getTemplates();
        setTemplates(templateList ?? []);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    const fetchChatSessions = async () => {
      try {
        const response = await axios.get("/api/chat-bot/chat-session");
        setChatSessions(response.data.chatSessions ?? []);
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
      }
    };

    const fetchInterviews = async () => {
      try {
        const response = await axios.get("/api/interview/interview-session");
        setInterviews(response.data.interviewSessions ?? []);
      } catch (error) {
        console.error("Error fetching interview sessions:", error);
      }
    };

    // One settle point for every card so the skeletons disappear together
    // instead of the grid reflowing four separate times.
    Promise.allSettled([
      fetchAnalyzedResume(),
      fetchTemplates(),
      fetchChatSessions(),
      fetchInterviews(),
    ]).finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(" ")[0];

  const values: StatCard[] = [
    {
      title: "Resume Score",
      value: atsScore ?? 0,
      hint: atsScore == null ? "Not analyzed yet" : "ATS readiness",
      icon: FiTarget,
      accent:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
      progress: atsScore ?? 0,
    },
    {
      title: "Templates Used",
      value: templates.length,
      hint: "Resumes created",
      icon: FiLayout,
      accent:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
    {
      title: "AI Conversations",
      value: chatSessions.length,
      hint: "Chats with the assistant",
      icon: FiMessageSquare,
      accent:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    },
    {
      title: "Interviews",
      value: interviews.length,
      hint: "Mock sessions practiced",
      icon: FiMic,
      accent:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Greeting */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
            Welcome back{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Let&apos;s continue building your career.
          </p>
        </div>
        <button
          onClick={() => router.push("/analyzer")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:w-auto dark:focus-visible:ring-offset-neutral-900"
        >
          Analyze my resume
          <FiArrowRight className="text-base" />
        </button>
      </header>

      {/* Stats */}
      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-30 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/60"
              />
            ))
          : values.map((value) => {
              const Icon = value.icon;
              const isScore = value.progress !== undefined;
              return (
                <div
                  key={value.title}
                  className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                        {value.title}
                      </p>
                      <p
                        className={`mt-2 text-3xl font-bold ${
                          isScore
                            ? scoreTone(value.value)
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {value.value}
                        {isScore && (
                          <span className="text-base font-medium text-neutral-400">
                            /100
                          </span>
                        )}
                      </p>
                    </div>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${value.accent}`}
                    >
                      <Icon className="text-xl" />
                    </span>
                  </div>

                  {isScore ? (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-purple-600 transition-[width] duration-700 dark:bg-purple-500"
                        style={{
                          width: `${Math.min(Math.max(value.value, 0), 100)}%`,
                        }}
                      />
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
                      {value.hint}
                    </p>
                  )}
                </div>
              );
            })}
      </section>

      {/* Quick actions */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className={`flex flex-col rounded-xl border p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md ${feature.card}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </div>
                <Image
                  src={feature.logo}
                  alt=""
                  width={200}
                  height={200}
                  className="h-20 w-20 shrink-0 object-contain"
                />
              </div>
              <button
                className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 ${feature.button}`}
                onClick={() => router.push(feature.link)}
              >
                {feature.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Suggestions */}
      <section className="mt-10">
        {loading ? null : suggestions.length > 0 ? (
          <>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Suggestions for improvement
              </h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {suggestions.length}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
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
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
              <FiFileText className="text-2xl" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
              No feedback yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
              Upload your resume to get an ATS score and personalised
              suggestions from our AI.
            </p>
            <button
              onClick={() => router.push("/analyzer")}
              className="mt-5 rounded-lg bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
            >
              Upload resume
            </button>
          </div>
        )}
      </section>

      {/* Assistant CTA */}
      <section className="mt-10 flex flex-col gap-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Need help? Ask our AI assistant
          </h2>
          <p className="mt-1 text-sm text-purple-100">
            Get instant answers to your career and interview questions.
          </p>
        </div>
        <button
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-purple-800 transition-colors hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-700"
          onClick={() => router.push("/chat-bot")}
        >
          Chat now
          <FiArrowRight className="text-base" />
        </button>
      </section>
    </main>
  );
}

export default Page;
