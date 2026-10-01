"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FiLogOut, FiMenu, FiMoon, FiSun } from "react-icons/fi";

const appLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Analyzer", href: "/analyzer" },
  { name: "Templates", href: "/templates" },
  { name: "Interview Prep", href: "/interview-prep" },
  { name: "AI Assistant", href: "/chat-bot" },
];

const marketingLinks = [
  { name: "Templates", href: "/hero-section#templates" },
  { name: "About", href: "/hero-section#about" },
  { name: "Features", href: "/hero-section#features" },
];

function Nav() {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Close the drawer and account menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setDrawerOpen(false);
    setMenuOpen(false);
  }

  // Dismiss the account menu on outside click / Escape.
  useEffect(() => {
    if (!menuOpen && !drawerOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, drawerOpen]);

  const user = session?.user;
  const links = user ? appLinks : marketingLinks;
  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";
  const isDark = mounted && resolvedTheme === "dark";

  const isActive = (href: string) =>
    !href.includes("#") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  const themeButton = (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
    >
      {/* Render nothing until mounted so the icon never mismatches the theme. */}
      {mounted && (isDark ? <FiSun /> : <FiMoon />)}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="-ml-2 rounded-lg p-2 text-xl text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden dark:text-neutral-200 dark:hover:bg-neutral-800"
        >
          <FiMenu />
        </button>

        <Link
          href={user ? "/dashboard" : "/hero-section"}
          className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white"
        >
          Resume<span className="text-purple-600 dark:text-purple-400">Nova</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {themeButton}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white ring-offset-2 transition hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:ring-offset-neutral-950"
              >
                {initial}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/hero-section" })}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <FiLogOut />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            status !== "loading" && (
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
              >
                Sign in
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl dark:bg-neutral-950">
            <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
              <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Resume
                <span className="text-purple-600 dark:text-purple-400">Nova</span>
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-xl text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <CgClose />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
                      : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            {user && (
              <div className="flex items-center gap-3 border-t border-neutral-200 p-4 dark:border-neutral-800">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/hero-section" })}
                  aria-label="Log out"
                  className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <FiLogOut />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </header>
  );
}

export default Nav;
