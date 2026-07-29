"use client";
import { useRouter } from "next/navigation";
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
    <div className="flex flex-col lg:items-center lg:justify-center gap-6 mx-auto lg:my-20 p-4  my-6 lg:min-h-screen">
      <div className="flex flex-col items-center justify-center gap-6 mx-auto">
        <p className="text-md text-purple-400 border border-purple-400 bg-purple-100 rounded-2xl px-4 py-1">
          AI-powered resume analysis & interview prep
        </p>
        <h1 className="text-3xl lg:text-6xl md:text-5xl font-bold text-purple-400 text-center w-full max-w-4xl font-sans">
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
            className="bg-purple-500 text-white p-4 rounded-3xl w-64 hover:bg-purple-600 transition-colors duration-200 cursor-pointer"
            onClick={() => toast("Login required to access this feature!")}
          >
            ✈️ Explore Templates
          </button>
          <button
            className="bg-gray-500 text-white p-4 rounded-3xl w-64 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            onClick={() => toast("Login required to access this feature!")}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-between w-full max-w-365 items-center mt-8 text-purple-500">
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

      <section
        id="about"
        className="flex lg:flex-row flex-col items-center justify-center lg:mt-20 p-4 md:text-xl gap-6 lg:gap-30 dark:text-gray-500 text-lg"
      >
        <div className=" space-x-0 space-y-4 lg:w-180">
          <h1 className="text-xl lg:text-5xl font-bold text-purple-400">
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
        <div>
          <h1 className="text-purple-300">Why Choose Resume Nova?</h1>
          {additionalFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl p-4 my-4 border border-purple-600/70 lg:w-150"
            >
              <div className="flex flex-row items-center ">
                <p className="text-lg">{feature.logo}</p>
                <p className="text-lg ml-2">{feature.title}</p>
              </div>
              <p className="text-sm text-gray-400 mx-6">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="flex flex-col items-center justify-center gap-4 mt-4 p-4"
      >
        <div className="text-2xl font-2xl font-bold flex flex-row items-center gap-2">
          Everything You Need to Land More Interviews
          <HiOutlineSparkles className="text-purple-500 ml-2" />
        </div>
        <p className="w-44 border-b-4 border-purple-600 mb-4"></p>
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-5 gap-4 justify-between w-full lg:max-w-8xl items-center ">
          {functionalities.map((functionality) => (
            <div
              key={functionality.name}
              className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-6 shadow-lg lg:w-70 w-full items-center"
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
              <p className="text-purple-600 text-lg font-semibold flex flex-row items-center gap-2 hover:underline cursor-pointer mt-2">
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
