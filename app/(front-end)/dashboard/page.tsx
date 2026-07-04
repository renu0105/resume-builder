"use client";
import { getAnalyzedResume, getTemplates } from "@/app/services/getData";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const features = [
  {
    name: "Analyze Resume",
    description: "Get AI powered feedback and improve your resume.",
    link: "/analyzer",
    bgColor: "bg-purple-100",
    buttonText: "Analyze Now",
    buttonColor: "bg-purple-700",
    logo: "/ats-analyzer.png",
  },

  {
    name: "Build Resume",
    description: "Use professional templates to create a standout resume.",
    link: "/templates",
    bgColor: "bg-green-100",
    buttonText: "Build Now",
    buttonColor: "bg-green-700",
    logo: "/templates.png",
  },
  {
    name: "Mock Interviews",
    description:
      "Practice your interview skills with AI-powered mock interviews.",
    link: "/interview-prep",
    bgColor: "bg-amber-100",
    buttonText: "Start Interview",
    buttonColor: "bg-amber-500",
    logo: "/interview-prep.png",
  },
  {
    name: "AI Assistant",
    description:
      "Ask questions and get instant answers to your career and interview queries.",
    link: "/chat-bot",
    bgColor: "bg-blue-100",
    buttonText: "Get Advice",
    buttonColor: "bg-blue-700",
    logo: "/chat-bot.png",
  },
];

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

    fetchAnalyzedResume();
    fetchTemplates();
    fetchChatSessions();
  }, []);

  const values = [
    {
      title: "Resume Score",
      value: atsScore ?? 0,
      logo: "/logo/ats-analyzer.png",
    },
    {
      title: "Template Used",
      value: templates.length,
      logo: "/logo/templates.png",
    },
    {
      title: "AI conversation",
      value: chatSessions.length,
      logo: "/logo/chat-bot.png",
    },
    { title: "Interviews", value: 3, logo: "/logo/interview-prep.png" },
  ];

  return (
    <div className="mx-auto w-full max-w-screen my-8">
      <div className="lg:ml-44 ml-12">
        <p className="text-black mb-2 text-3xl font-semibold">
          Welcome Back,{session?.user?.name} 👋
        </p>
        <p>Let&apos;s continue building your career!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-between w-full max-w-335 items-center mt-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="text-gray-700 border border-gray-200 p-2 rounded-lg"
            >
              <div className="flex flex-row items-center gap-2">
                <Image
                  src={value.logo}
                  alt={value.title}
                  width={80}
                  height={80}
                />
                <div>
                  <p>{value.title}</p>
                  <p className="text-2xl font-bold">{value.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4">
          <p className="text-xl my-2 font-semibold">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-between w-full max-w-335 items-center">
            {features.map((feature) => (
              <div
                key={feature.name}
                className={`p-4 rounded-lg ${feature.bgColor} w-full shadow-lg`}
              >
                <div className="flex flex-row h-40">
                  <div className="flex-1">
                    <h1 className="text-lg font-bold h-12">{feature.name}</h1>
                    <p className="h-32 text-sm">{feature.description}</p>
                  </div>
                  <Image
                    src={feature.logo}
                    alt={feature.name}
                    width={200}
                    height={200}
                    className="object-center h-36 w-36 "
                  />
                </div>
                <button
                  className={`text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 w-full ${feature.buttonColor}`}
                  onClick={() => router.push(feature.link)}
                >
                  {feature.buttonText}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 w-335">
            {suggestions.length > 0 ? (
              <div>
                <h1 className="text-xl my-2 font-semibold mt-4">
                  Suggestions for improvement
                </h1>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="text-gray-700 mb-2 bg-orange-100 p-6 rounded-lg"
                  >
                    <p className="font-semibold text-orange-400">
                      {suggestion.title}
                    </p>
                    <p className="text-sm">{suggestion.description}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg shadow-lg bg-purple-200 flex justify-between items-center w-full max-w-335">
          <div>
            <h1 className="text-lg font-bold">
              Need help? Ask our AI assistant!
            </h1>
            <p>Get instant answers to your career and interview questions.</p>
          </div>
          <button
            className="bg-purple-800 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 p-2"
            onClick={() => router.push("/chat-bot")}
          >
            Chat now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
