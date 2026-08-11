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
        className="text-neutral-600 text-lg font-medium hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors duration-200 justify-center p-4 lg:hidden dark:text-neutral-300 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
      >
        <TfiMenuAlt />
      </button>
      <div
        className={`${
          isSideBarOpen ? "flex" : "hidden"
        } lg:flex lg:flex-row flex-col justify-between lg:items-center max-w-screen fixed lg:static top-0 left-0 lg:p-0  border-r lg:border-none border-neutral-200 z-50 w-64 lg:w-350 bg-white lg:bg-transparent h-screen lg:h-24 dark:border-neutral-800 dark:bg-neutral-950 dark:lg:bg-transparent`}
      >
        <div className="flex lg:flex-row items-center gap-2 border-b lg:border-none border-neutral-200 bg-purple-700 lg:bg-transparent dark:border-neutral-800 dark:bg-purple-900 dark:lg:bg-transparent">
          <button className="text-xl text-white lg:text-neutral-800 text-left w-full lg:w-fit p-4 dark:lg:text-white">
            Resume
            <strong className="text-purple-200 transition-colors hover:text-white lg:text-purple-600 lg:hover:text-purple-800 dark:lg:text-purple-400 dark:lg:hover:text-purple-300">
              Nova
            </strong>
          </button>
          <button
            onClick={() => setSideBarOpen(false)}
            className="text-purple-100 hover:text-white text-lg font-medium transition-colors duration-200 justify-center p-4 lg:hidden"
          >
            <CgClose />
          </button>
        </div>
        {session?.user ? (
          <>
            <div className="text-lg font-medium flex lg:flex-row flex-col gap-4 items-start lg:h-fit h-250 px-4 lg:w-5xl lg:items-center justify-between bg-white lg:bg-transparent lg:bg-none text-neutral-700 dark:bg-neutral-950 dark:lg:bg-transparent dark:text-neutral-300">
              <div className="flex lg:flex-row flex-col gap-8 lg:w-400 my-4">
                {navLink.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="border-b-2 border-transparent py-2 text-neutral-800 transition-colors hover:border-purple-600 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <button
                className="flex flex-row gap-4 items-center bg-purple-50 hover:bg-purple-100 lg:bg-transparent lg:hover:bg-transparent rounded-lg px-4 py-4 self-end lg:w-44 w-full mb-6 transition-colors dark:bg-purple-500/10 dark:hover:bg-purple-500/20 dark:lg:bg-transparent"
                onClick={() => setSignedIn(!isSignedIn)}
              >
                <p className="bg-purple-700 rounded-full p-4 px-6 text-white">
                  {session?.user?.name
                    ?.split(" ")[0]
                    ?.charAt(0)
                    .toUpperCase() || null}
                </p>
                <p className="text-neutral-700 lg:hidden dark:text-neutral-200">
                  {" "}
                  {session?.user?.name?.split(" ")[0]}
                </p>
              </button>
            </div>

            {isSignedIn && (
              <div className="absolute z-50 w-52 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl bottom-24 left-6 lg:bottom-auto lg:left-auto lg:top-16 lg:right-16 dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                    {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">
                      {session?.user?.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                <button
                  onClick={() => signOut({ callbackUrl: "/hero-section" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors duration-200 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <FiLogOut className="text-base" />
                  Log Out
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            className="text-lg font-medium flex lg:flex-row flex-col gap-4 items-start lg:h-fit h-200 px-4 lg:w-5xl lg:items-center lg:bg-transparent lg:bg-none justify-between bg-white text-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:lg:bg-transparent"
          >
            <div className="flex lg:flex-row flex-col gap-8 lg:w-400 my-4 lg:justify-center">
              {defaultLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="border-b-2 border-transparent py-2 text-neutral-800 transition-colors hover:border-purple-600 hover:text-purple-700 dark:text-neutral-100 dark:hover:border-purple-400 dark:hover:text-purple-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="text-lg font-semibold rounded-lg w-44 p-4 transition-colors duration-200 bg-purple-700 text-white hover:bg-purple-800 text-center mb-12 lg:mb-0"
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
        aria-label={
          resolvedTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        title={
          resolvedTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        className="mx-2 my-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-lg shadow-sm transition-colors duration-200 hover:bg-neutral-100 md:my-0 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
      >
        {resolvedTheme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
}

export default Nav;
