"use client";
import { signIn } from "next-auth/react";
import { TEMPLATES, type TemplateMeta } from "@/lib/templateMeta";
import { BsGraphDown } from "react-icons/bs";
import { FaMicrophone, FaRobot } from "react-icons/fa6";
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
    iconColor: "text-purple-600 dark:text-purple-300",
    iconBgColor: "bg-purple-100 dark:bg-purple-500/15",
  },
  {
    name: "ATS Resume Analyzer",
    description:
      "Get an ATS score and personalized tips to improve your resume instantly.",
    icon: <BsGraphDown />,
    iconColor: "text-emerald-600 dark:text-emerald-300",
    iconBgColor: "bg-emerald-100 dark:bg-emerald-500/15",
  },
  {
    name: "Professional Templates",
    description:
      "Choose from a variety of professionally designed resume templates.",
    icon: <FcTemplate />,
    iconColor: "text-purple-600 dark:text-purple-300",
    iconBgColor: "bg-purple-100 dark:bg-purple-500/15",
  },
  {
    name: "Interview Practice",
    description: "Practice interviews with AI-generated questions.",
    icon: <FaMicrophone />,
    iconColor: "text-amber-600 dark:text-amber-300",
    iconBgColor: "bg-amber-100 dark:bg-amber-500/15",
  },
  {
    name: "AI Career Assistant",
    description: "Get career advice and guidance from AI.",
    icon: <FaRobot />,
    iconColor: "text-gray-600 dark:text-gray-300",
    iconBgColor: "bg-gray-100 dark:bg-neutral-800",
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

// A miniature "sheet of paper" rendered from the same metadata the PDF
// generator uses (accent colour, font family, header style), so the gallery
// stays in sync with what the builder actually produces.
function TemplatePreview({ template }: { template: TemplateMeta }) {
  const fontClass =
    template.font === "serif"
      ? "font-serif"
      : template.font === "mono"
        ? "font-mono"
        : "font-sans";

  const bar = (width: string) => (
    <span className={`block h-1 rounded-full bg-gray-200 ${width}`} />
  );

  const section = (title: string, widths: string[]) => (
    <div key={title} className="space-y-1">
      <p
        className="text-[6px] font-bold tracking-widest uppercase"
        style={{ color: template.accent }}
      >
        {title}
      </p>
      {widths.map((w, i) => (
        <span key={i}>{bar(w)}</span>
      ))}
    </div>
  );

  return (
    <div
      className={`aspect-[1/1.414] w-full overflow-hidden rounded-lg border border-gray-200 bg-white ${fontClass}`}
    >
      {template.header === "band" ? (
        <div
          className="px-3 py-2.5"
          style={{ backgroundColor: template.accent }}
        >
          <p className="text-[8px] font-bold tracking-wide text-white uppercase">
            Your Name
          </p>
          <p className="text-[6px] text-white/75">you@email.com · +1 555 0100</p>
        </div>
      ) : (
        <div
          className={`px-3 pt-3 ${
            template.header === "center" ? "text-center" : ""
          }`}
        >
          <p
            className="text-[8px] font-bold tracking-wide uppercase"
            style={{ color: template.accent }}
          >
            Your Name
          </p>
          <p className="text-[6px] text-gray-500">you@email.com · +1 555 0100</p>
          <span
            className="mt-1.5 block h-px w-full"
            style={{ backgroundColor: template.accent }}
          />
        </div>
      )}

      <div className="space-y-2.5 px-3 pt-2.5">
        {section("Experience", ["w-full", "w-11/12", "w-3/4"])}
        {section("Projects", ["w-full", "w-2/3"])}
        {section("Skills", ["w-5/6"])}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-4 py-12 sm:px-6 lg:gap-24 lg:px-8 lg:py-20">
      <div className="flex max-w-4xl flex-col items-center justify-center gap-5 text-center sm:gap-6">
        <p className="rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-medium tracking-wide text-purple-700 sm:text-sm dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-300">
          AI-powered resume analysis & interview prep
        </p>
        <h1 className="max-w-4xl text-3xl leading-tight font-bold tracking-tight text-balance text-purple-600 sm:text-4xl md:text-5xl lg:text-6xl dark:text-purple-400">
          Build Better Resumes.{" "}
          <span className="text-gray-900 dark:text-white">
            Crack More Interviews.
          </span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-gray-600 sm:text-lg dark:text-gray-300">
          Use AI to create standout resumes, identify weaknesses in your CV, and
          practice real interview questions tailored to your target role. Talk
          with the AI Assistant to improve your chances of landing your dream
          job.
        </p>
        <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          {/* Scrolls to the gallery below — <html> already has smooth scrolling. */}
          <a
            href="#templates"
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 sm:w-60 sm:text-lg dark:focus-visible:ring-offset-neutral-900"
          >
            ✈️ Explore Templates
          </a>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {secure.map((value) => (
          <div
            key={value.title}
            className="flex h-full flex-row items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-purple-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-500/40"
          >
            <p className="shrink-0 text-2xl text-purple-600 dark:text-purple-400">
              {value.icon}
            </p>
            <h3 className="min-w-0 text-sm font-semibold text-gray-800 dark:text-gray-100">
              {value.title}
            </h3>
          </div>
        ))}
      </div>

      <section
        id="templates"
        className="flex w-full scroll-mt-24 flex-col items-center justify-center gap-3"
      >
        <h2 className="text-center text-2xl font-bold tracking-tight text-balance text-gray-900 sm:text-3xl dark:text-gray-100">
          Professionally Designed Templates
        </h2>
        <p className="max-w-2xl text-center text-base text-pretty text-gray-600 dark:text-gray-300">
          Every template is ATS-friendly and exports to PDF in one click. Pick
          the one that fits your role — you can switch at any time.
        </p>
        <span className="mb-6 block h-1 w-24 rounded-full bg-purple-600" />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-500/40"
            >
              <TemplatePreview template={template} />
              <div className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: template.accent }}
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/templates" })}
          className="mt-6 cursor-pointer rounded-full bg-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
        >
          Sign in to use these templates
        </button>
      </section>

      <section
        id="about"
        className="flex w-full flex-col items-start justify-center gap-10 text-base leading-relaxed text-gray-600 lg:flex-row lg:gap-16 dark:text-gray-300"
      >
        <div className="flex-1 space-y-4 lg:max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight text-purple-600 sm:text-3xl lg:text-4xl dark:text-purple-400">
            About Us
          </h2>

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
        <div className="w-full flex-1 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-purple-600 sm:text-3xl lg:text-4xl dark:text-purple-400">
            Why Choose Resume Nova?
          </h2>
          {additionalFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-purple-600/30 p-5 transition-colors hover:border-purple-600 hover:bg-purple-50/50 dark:border-purple-500/30 dark:hover:border-purple-500 dark:hover:bg-purple-500/5"
            >
              <div className="flex flex-row items-center gap-2.5">
                <span className="shrink-0 text-xl text-purple-600 dark:text-purple-400">
                  {feature.logo}
                </span>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
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
        className="flex w-full flex-col items-center justify-center gap-3"
      >
        <h2 className="flex flex-row flex-wrap items-center justify-center gap-2 text-center text-2xl font-bold tracking-tight text-balance text-gray-900 sm:text-3xl dark:text-gray-100">
          Everything You Need to Land More Interviews
          <HiOutlineSparkles className="shrink-0 text-purple-600 dark:text-purple-400" />
        </h2>
        <span className="mb-6 block h-1 w-24 rounded-full bg-purple-600" />
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {functionalities.map((functionality) => (
            <div
              key={functionality.name}
              className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-500/40"
            >
              <p
                className={`text-3xl ${functionality.iconColor} ${functionality.iconBgColor} w-fit rounded-xl p-3.5`}
              >
                {functionality.icon}
              </p>
              <h3 className="text-base font-bold text-balance text-gray-900 dark:text-gray-100">
                {functionality.name}
              </h3>
              <p className="text-sm leading-relaxed text-pretty text-gray-500 dark:text-gray-400">
                {functionality.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
