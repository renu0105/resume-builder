"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { TfiMenuAlt } from "react-icons/tfi";
import { FiLogOut } from "react-icons/fi";

function Nav() {
  const navLink = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Analyzer", href: "/analyzer" },
    { name: "Resume Templates", href: "/templates" },
    { name: "Practice Interview", href: "/interview-prep" },
    { name: "AI Assistant", href: "/chat-bot" },
  ];

  const defaultLinks = [
    { name: "Features", href: "/features" },
    { name: "Analyzer", href: "/analyzer" },
    { name: "About", href: "/about" },
    { name: "Templates", href: "/templates" },
  ];

  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return <button className="...">Theme</button>;
  }

  return (
    <div className="lg:mx-44 mx-2 w-100">
      <button
        onClick={() => setSideBarOpen(!isSideBarOpen)}
        className="text-gray-600 hover:text-gray-900 text-lg font-medium hover:border border-blue-300 hover:bg-blue-100 rounded-lg transition-colors duration-200 justify-center p-4 lg:hidden"
      >
        <TfiMenuAlt />
      </button>
      <div
        className={`${
          isSideBarOpen ? "flex" : "hidden"
        } lg:flex lg:flex-row flex-col justify-between max-w-screen fixed lg:static top-0 left-0 lg:p-0  border-r lg:border-none border-gray-300 z-50 w-64 lg:w-350 lg:items-center bg-white`}
      >
        <div className="flex flex-row justify-between items-center gap-2 w-full border-b lg:border-none border-gray-300">
          <button className="text-xl text-gray-800 text-left w-full lg:w-fit p-4">
            Resume
            <strong className="text-blue-400 hover:text-blue-600 shadow-2xl">
              Nova
            </strong>
          </button>
          <button
            onClick={() => setSideBarOpen(false)}
            className="text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors duration-200 justify-center p-4 lg:hidden"
          >
            <CgClose />
          </button>
        </div>
        {session?.user ? (
          <>
            <div className="text-gray-600 hover:text-gray-900 text-lg font-medium flex lg:flex-row flex-col gap-4 items-start lg:h-fit h-180 px-4 lg:w-5xl lg:items-center justify-between">
              <div className="flex lg:flex-row flex-col gap-8 lg:w-400">
                {navLink.map((link) => (
                  <Link key={link.name} href={link.href}>
                    {link.name}
                  </Link>
                ))}
              </div>
              <button
                className="flex flex-row gap-4 items-center bg-blue-300/80 lg:bg-transparent  rounded-lg px-4 py-2 self-end lg:w-44 w-full"
                onClick={() => setSignedIn(!isSignedIn)}
              >
                <p className="bg-blue-600 rounded-full p-4 px-6 text-white">
                  {session?.user?.name
                    ?.split(" ")[0]
                    ?.charAt(0)
                    .toUpperCase() || null}
                </p>
                <p className="text-gray-600 lg:hidden">
                  {" "}
                  {session?.user?.name?.split(" ")[0]}
                </p>
              </button>
            </div>

            {isSignedIn && (
              <div className="absolute z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl bottom-24 left-6 lg:bottom-auto lg:left-auto lg:top-16 lg:right-16">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {session?.user?.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <div className="my-1 h-px bg-gray-100" />
                <button
                  onClick={() => signOut({ callbackUrl: "/hero-section" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
                >
                  <FiLogOut className="text-base" />
                  Log Out
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-600 hover:text-gray-900 text-lg font-medium flex flex-row gap-4 items-center justify-between w-5xl">
            <div className="flex gap-8 text-center">
              {defaultLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  {link.name}
                </Link>
              ))}
            </div>
            <div>
              <button
                onClick={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                }}
                className="text-lg font-medium border border-gray-100 hover:border-gray-200 px-4 py-2 mx-2"
              >
                {resolvedTheme === "dark" ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="text-lg font-medium rounded-lg px-4 py-2 transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600 text-center"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
