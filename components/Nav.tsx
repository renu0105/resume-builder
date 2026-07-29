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
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
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
    <div className="lg:mx-12 mx-2 lg:bg-transparent lg:text-left flex flex-row lg:justify-center lg:items-center">
      <button
        onClick={() => setSideBarOpen(!isSideBarOpen)}
        className="text-gray-600 text-lg font-medium hover:border border-purple-500 hover:bg-purple-100 rounded-lg transition-colors duration-200 justify-center p-4 lg:hidden"
      >
        <TfiMenuAlt />
      </button>
      <div
        className={`${
          isSideBarOpen ? "flex" : "hidden"
        } lg:flex lg:flex-row flex-col justify-between lg:items-center max-w-screen fixed lg:static top-0 left-0 lg:p-0  border-r lg:border-none border-gray-300 z-50 w-64 lg:w-350 bg-gray-200 md:bg-transparent h-screen lg:h-24`}
      >
        <div className="flex lg:flex-row items-center gap-2 border-b lg:border-none border-gray-300 bg-purple-900 lg:bg-transparent ">
          <button className="text-xl lg:text-gray-800 text-gray-400 text-left w-full lg:w-fit p-4">
            Resume
            <strong className="text-purple-600 hover:text-purple-900 shadow-2xl">
              Nova
            </strong>
          </button>
          <button
            onClick={() => setSideBarOpen(false)}
            className="text-gray-300 hover:text-gray-400 text-lg font-medium transition-colors duration-200 justify-center p-4 lg:hidden"
          >
            <CgClose />
          </button>
        </div>
        {session?.user ? (
          <>
            <div className="text-lg font-medium flex lg:flex-row flex-col gap-4 items-start lg:h-fit h-250 px-4 lg:w-5xl lg:items-center justify-between bg-gray-100 lg:bg-transparent lg:bg-none text-gray-400">
              <div className="flex lg:flex-row flex-col gap-8 lg:w-400 my-4">
                {navLink.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-neutral-800 border-b-2 border-transparent hover:border-purple-600 py-2"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <button
                className="flex flex-row gap-4 items-center bg-purple-300/80 lg:bg-transparent rounded-lg px-4 py-4 self-end lg:w-44 w-full mb-6"
                onClick={() => setSignedIn(!isSignedIn)}
              >
                <p className="bg-purple-800 rounded-full p-4 px-6 text-white">
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
              <div className="absolute z-50 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl bottom-24 left-6 lg:bottom-auto lg:left-auto lg:top-16 lg:right-16">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
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
          <div className="text-lg font-medium flex lg:flex-row flex-col gap-4 items-start lg:h-fit h-250 px-4 lg:w-5xl lg:items-center justify-between bg-gray-100 lg:bg-transparent lg:bg-none text-gray-400">
            <div className="flex lg:flex-row flex-col gap-8 lg:w-400 my-4 lg:justify-center">
              {defaultLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`border-b-2 border-transparent hover:border-purple-600 py-2 ${resolvedTheme === "dark" ? "text-gray-100" : "text-neutral-800 "} `}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="text-lg font-semibold rounded w-44 p-4 transition-colors duration-200 bg-purple-600 text-white hover:bg-purple-900 text-center mb-4"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
        }}
        className="text-lg font-medium cursor-pointer mx-2 md:my-0 my-4"
      >
        {resolvedTheme === "dark" ? "☀️ " : "🌙 "}
      </button>
    </div>
  );
}

export default Nav;
