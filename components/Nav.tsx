"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useState } from "react";

function Nav() {
  const navLink = [
    { name: "Dashboard", href: "/" },
    { name: "Analyzer", href: "/analyzer" },
    { name: "Resume Templates", href: "/templates" },
    { name: "Practice Interview", href: "/interview-prep" },
    { name: "AI Assistant", href: "/chat-bot" },
  ];

  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    if (session) {
      signOut();
    }
  };
  return (
    <div className="flex flex-row justify-between items-center p-7 absolute top-0 left-0 border-b border-gray-300 w-full">
      <div className="lg:flex hidden flex-col h-screen w-64 items-center gap-4 p-4 absolute top-0 left-0 border-r border-gray-300 ">
        <button className="text-xl text-gray-800 w-64 text-left px-8">
          Resume
          <strong className="text-blue-400 hover:text-blue-600 shadow-2xl">
            Nova
          </strong>
        </button>
        {/* <div className=""> */}
        {navLink.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-gray-600 hover:text-gray-900 text-lg font-medium hover:border border-blue-300 hover:bg-blue-100 rounded-lg px-4 py-2 transition-colors duration-200 w-full"
          >
            {link.name}
          </Link>
        ))}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-gray-600 hover:text-gray-900 text-lg font-medium hover:border border-blue-300 hover:bg-blue-100 rounded-lg px-4 py-2 transition-colors duration-200 w-full text-start"
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button
          onClick={() => signOut()}
          className="hover:text-gray-900 text-lg font-medium hover:border border-blue-300 rounded-lg px-4 py-2 transition-colors duration-200 w-56  bg-blue-500 text-white fixed bottom-0  mb-4 hover:bg-blue-600 text-center"
        >
          Log Out
        </button>
      </div>

      {status === "loading" ? null : session?.user ? (
        <p className="text-gray-600 hover:text-gray-900 text-lg font-medium w-fit absolute right-4 px-4 py-2 rounded-lg transition-colors duration-200">
          {session.user.name}
        </p>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="text-gray-600 hover:text-gray-900 text-lg font-medium w-fit absolute right-4 px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Sign in
        </button>
      )}
    </div>
  );
}

export default Nav;
