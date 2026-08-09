"use client";
import toast from "react-hot-toast";
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
    iconColor: "text-purple-400",
    iconBgColor: "bg-purple-100",
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

const additionalFeatures = [
  {
    title: "AI-powered resume",
    desc: "Generate resume by using AI Analyzing Resume ",
    logo: <GiArtificialIntelligence />,
  },
  {
    title: "Secure and private platform",
    desc: "Only Accessed by Authorized user ",
    logo: <FcPrivacy />,
  },
  {
    title: "Interview preparation and coaching",
    desc: "Teach You how to give interview and remove your hesitation",
    logo: <HiOutlineSparkles />,
  },
  {
    title: "ATS-friendly templates and designs",
    desc: "Build ATS-Friendly resume to get opportunity faster",
    logo: <FcComboChart />,
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-4 py-12 sm:px-6 lg:gap-24 lg:px-8 lg:py-20">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <p className="rounded-full border border-purple-300 bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-600 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-300">
          AI-powered resume analysis & interview prep
        </p>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight text-purple-500 md:text-5xl lg:text-6xl">
          Build Better Resumes.{" "}
          <span className="text-gray-800 dark:text-white">
            Crack More Interviews.
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-gray-600 lg:text-xl dark:text-gray-300">
          Use AI to create standout resumes, identify weaknesses in your CV, and
          practice real interview questions tailored to your target role. Talk
          with the AI Assistant to improve your chances of landing your dream
          job.
        </p>
        <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <button
            className="w-full cursor-pointer rounded-full bg-purple-500 px-8 py-4 text-lg font-semibold text-white shadow-md transition-colors duration-200 hover:bg-purple-600 sm:w-60"
            onClick={() => toast("Login required to access this feature!")}
          >
            ✈️ Explore Templates
          </button>
          <button
            className="w-full cursor-pointer rounded-full border border-gray-300 bg-transparent px-8 py-4 text-lg font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 sm:w-60 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-800"
            onClick={() => toast("Login required to access this feature!")}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {secure.map((value) => (
          <div
            key={value.title}
            className="flex flex-row items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className="text-3xl text-purple-500">{value.icon}</p>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {value.title}
            </h3>
          </div>
        ))}
      </div>

      <section
        id="about"
        className="flex w-full flex-col items-start justify-center gap-10 text-lg text-gray-600 md:text-xl lg:flex-row lg:gap-16 dark:text-gray-300"
      >
        <div className="flex-1 space-y-4 lg:max-w-xl">
          <h1 className="text-3xl font-bold text-purple-500 lg:text-5xl">
            About Us
          </h1>

          <p>
            Resume Nova is a cutting-edge platform designed to help job seekers
            create stunning resumes and cover letters with ease. Our mission is
            to empower individuals with the tools they need to stand out in
            today&apos;s competitive job market.
          </p>
          <p>
            Our team of experts is dedicated to providing the best possible
            experience for our users, ensuring that they have the resources and
            support they need to succeed in their job search.
          </p>
          <p>
            At Resume Nova, we believe that everyone deserves the opportunity to
            showcase their skills and talents. That&apos;s why we&apos;ve
            created a platform that is accessible, user-friendly, and packed
            with features to help job seekers achieve their career goals.
          </p>
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold text-purple-400">
            Why Choose Resume Nova?
          </h1>
          {additionalFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-purple-600/40 p-5 transition-colors hover:border-purple-600 dark:border-purple-500/30 dark:hover:border-purple-500"
            >
              <div className="flex flex-row items-center gap-2">
                <span className="text-xl text-purple-500">{feature.logo}</span>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {feature.title}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="flex w-full flex-col items-center justify-center gap-6"
      >
        <div className="flex flex-row items-center gap-2 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          Everything You Need to Land More Interviews
          <HiOutlineSparkles className="text-purple-500" />
        </div>
        <span className="mb-4 block h-1 w-44 rounded-full bg-purple-600" />
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {functionalities.map((functionality) => (
            <div
              key={functionality.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p
                className={`text-4xl ${functionality.iconColor} ${functionality.iconBgColor} w-fit rounded-xl p-4`}
              >
                {functionality.icon}
              </p>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {functionality.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {functionality.description}
              </p>
              <p className="mt-auto flex cursor-pointer flex-row items-center gap-2 pt-2 text-base font-semibold text-purple-600 hover:underline dark:text-purple-400">
                Learn More
                <FaArrowRight />
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
