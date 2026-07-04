"use client";
import { useRouter } from "next/navigation";
import { BsGraphDown } from "react-icons/bs";
import { FaArrowRight, FaMicrophone, FaRobot } from "react-icons/fa6";
import {
  FcComboChart,
  FcDocument,
  FcDownload,
  FcPositiveDynamic,
  FcPrivacy,
  FcTemplate,
} from "react-icons/fc";
import { GiArtificialIntelligence } from "react-icons/gi";
import { HiOutlineSparkles } from "react-icons/hi2";

const functionalities = [
  {
    name: "AI Resume Builder",
    description:
      "Create a professional resume in minutes with AI assistance and smart suggestions.",
    icon: <FcPositiveDynamic />,
    iconColor: "text-blue-400",
    iconBgColor: "bg-blue-100",
  },
  {
    name: "ATS Resume Analyzer",
    description:
      "Get an ATS score and personalized tips to improve your resume instantly.",
    icon: <BsGraphDown />,
    iconColor: "text-green-400",
    iconBgColor: "bg-green-100",
  },
  {
    name: "Professional Templates",
    description:
      "Choose from a variety of professionally designed resume templates.",
    icon: <FcTemplate />,
    iconColor: "text-purple-400",
    iconBgColor: "bg-purple-100",
  },
  {
    name: "Interview Practice",
    description: "Practice interviews with AI-generated questions.",
    icon: <FaMicrophone />,
    iconColor: "text-amber-400",
    iconBgColor: "bg-amber-100",
  },
  {
    name: "AI Career Assistant",
    description: "Get career advice and guidance from AI.",
    icon: <FaRobot />,
    iconColor: "text-gray-400",
    iconBgColor: "bg-gray-100",
  },
];

const secure = [
  { title: "ATS Optimized", icon: <FcComboChart /> },
  { title: "AI Powered", icon: <GiArtificialIntelligence /> },
  { title: "Professional Templates", icon: <FcDocument /> },
  { title: "One-click Export", icon: <FcDownload /> },
  { title: "Secure & Private", icon: <FcPrivacy /> },
];

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-6 mx-auto lg:mt-30 p-4 md:my-20 my-44 lg:min-h-screen ">
      <div className="flex flex-col items-center justify-center gap-6 mx-auto">
        <p className="text-md text-blue-400 border border-blue-400 bg-blue-100 rounded-2xl px-4 py-1">
          AI-powered resume analysis & interview prep
        </p>
        <h1 className="text-3xl lg:text-6xl md:text-5xl font-bold text-blue-400 text-center w-full max-w-4xl font-sans">
          Build Better Resumes.
          <strong className="text-gray-800">Crack More Interviews. </strong>
        </h1>
        <p className="text-lg lg:text-xl text-gray-400 text-center max-w-5xl">
          Use AI to create standout resumes, identify weaknesses in your CV, and
          practice real interview questions tailored to your target role.Talk
          with AI Assistant to improve chances of landing your dream job.
        </p>
        <div className="flex flex-col md:flex-row gap-6 text-lg">
          <button
            className="bg-blue-500 text-white p-4 rounded-3xl w-64 hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
            onClick={() => router.push("/templates")}
          >
            ✈️ Explore Templates
          </button>
          <button
            className="bg-gray-500 text-white p-4 rounded-3xl w-64 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            onClick={() => router.push("/interview")}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-between w-full max-w-365 items-center mt-8 text-blue-500">
        {secure.map((value) => (
          <div
            key={value.title}
            className="flex flex-row items-center gap-4 p-4 w-70"
          >
            <p className={`text-4xl`}>{value.icon}</p>
            <div>
              <h3 className="text-lg font-semibold">{value.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mt-4 p-4">
        <div className="text-2xl font-2xl font-bold flex flex-row items-center gap-2">
          Everything You Need to Land More Interviews
          <HiOutlineSparkles className="text-blue-500 ml-2" />
        </div>
        <p className="w-44 border-b-4 border-blue-600 mb-4"></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-between w-full max-w-8xl items-center ">
          {functionalities.map((functionality) => (
            <div
              key={functionality.name}
              className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-6 shadow-lg w-70 items-center"
            >
              <p
                className={`text-4xl ${functionality.iconColor} ${functionality.iconBgColor} rounded-xl p-4 w-fit`}
              >
                {functionality.icon}
              </p>
              <h3 className="text-lg font-bold">{functionality.name}</h3>
              <p className="text-sm text-gray-500 text-center">
                {functionality.description}
              </p>
              <p className="text-blue-600 text-lg font-semibold flex flex-row items-center gap-2 hover:underline cursor-pointer mt-2">
                Learn More
                <FaArrowRight />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
