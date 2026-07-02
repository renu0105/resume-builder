"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <section>
        <div className="flex flex-col items-center justify-center h-screen max-h-180 gap-6 ml-42">
          <p className="text-md text-blue-400 border border-blue-400 bg-blue-100 rounded-2xl px-4 py-1">
            AI-powered resume analysis & interview prep
          </p>
          <h1 className="text-3xl lg:text-6xl md:text-5xl font-bold text-blue-400 text-center w-full max-w-4xl font-sans">
            Build Better Resumes.
            <strong className="text-gray-800">Crack More Interviews. </strong>
          </h1>
          <p className="text-lg lg:text-xl text-gray-400 text-center max-w-5xl">
            Use AI to create standout resumes, identify weaknesses in your CV,
            and practice real interview questions tailored to your target
            role.Talk with AI Assistant to improve chances of landing your dream
            job.
          </p>
          <div className="flex lg:flex-row gap-6 text-lg">
            <button
              className="bg-blue-500 text-white p-4 rounded-3xl w-64 hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
              onClick={() => router.push("/templates")}
            >
              Build My Resume
            </button>
            <button
              className="bg-gray-500 text-white p-4 rounded-3xl w-64 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
              onClick={() => router.push("/interview")}
            >
              Practice Interview
            </button>
          </div>
        </div>
      </section>

      <section>
        <h1>Templates</h1>
        <p>Here are some resume templates to choose from:</p>
      </section>
    </>
  );
}
