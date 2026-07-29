"use client";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FcDown } from "react-icons/fc";

function Page() {
  const [visibleAnswerIndex, setVisibleAnswerIndex] = useState<number | null>(
    null,
  );
  const faqs = [
    {
      que: "Is ResumeNova free?",
      ans: "Yes. ResumeNova offers free access to core resume-building features, with additional capabilities planned for future releases.",
    },
    {
      que: "Are the resume templates ATS-friendly?",
      ans: "Yes. All templates are designed to be ATS-compliant, ensuring your resume passes through applicant tracking systems effectively.",
    },
    {
      que: "Can I edit my resume after downloading?",
      ans: "Yes. You can download your resume in editable formats like Word or PDF, allowing you to make changes as needed.",
    },
    {
      que: "Is my data secure?",
      ans: "Absolutely. We prioritize user privacy and employ robust security measures to protect your personal information.",
    },
    {
      que: "Can I use ResumeNova for multiple resumes?",
      ans: "Yes. You can create and manage multiple resumes for different job applications within your account.",
    },
    {
      que: "Can I practice interviews?",
      ans: "Yes. ResumeNova offers an interview practice feature where you can simulate interviews and receive feedback to improve your performance.",
    },
  ];
  return (
    <div className="flex flex-col items-center  mt-4 w-full max-w-xl min-h-screen p-4 text-lg my-12">
      <h1>Frequently Asked Questions</h1>
      {/* <div className="flex flex-col gap-4 mt-4 w-full max-w-2xl"> */}
      {faqs.map((faq, index) => (
        <div key={index}>
          <button
            className="flex flex-row justify-between   p-4 rounded border border-gray-300 bg-amber-500"
            onClick={() =>
              setVisibleAnswerIndex(visibleAnswerIndex === index ? null : index)
            }
          >
            <h2>{faq.que}</h2>
            <FaAngleDown />
          </button>
          {visibleAnswerIndex === index && <p>{faq.ans}</p>}
        </div>
      ))}{" "}
    </div>
    // </div>
  );
}

export default Page;
