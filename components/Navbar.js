// components/Navbar.js
import logoLight from "../images/logo-light.png";
import logoDark from "../images/logo-dark.png";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Github, ChevronDown, LogOut, Settings } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const categoryRef = useRef(null);
  const profileRef = useRef(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user || null)
    );

    return () => authListener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) setCategoryOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async () => await supabase.auth.signInWithOAuth({ provider: "github" });
  const handleLogout = async () => await supabase.auth.signOut();

  const categories = [
    { name: "All", slug: "all" },
    { name: "Frontend", slug: "frontend" },
    { name: "Backend", slug: "backend" },
    { name: "Database", slug: "database" },
    { name: "Git & GitHub", slug: "git-github" },
    { name: "Debugging", slug: "debugging" },
    { name: "General", slug: "general" },
  ];

  return (
    <nav className="bg-neutral-50 dark:bg-neutral-800 w-full sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {mounted && (
            <img
              src={theme === "dark" ? logoDark.src : logoLight.src}
              alt="Logo"
              width="36"
              height="36"
              className="rounded-full"
            />
          )}
          <p className="font-bold text-lg text-blue-500">Blendistry</p>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 relative text-sm font-medium">
          <Link href="/" className="hover:text-blue-500 transition">Home</Link>
          <Link href="/blogs" className="hover:text-blue-500 transition">Blogs</Link>
          <Link href="/about" className="hover:text-blue-500 transition">About</Link>
          <Link href="/feedback" className="hover:text-blue-500 transition">Feedback</Link>

          {/* Categories */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => { setCategoryOpen(!categoryOpen); setProfileOpen(false); }}
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              Categories <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute mt-1 bg-neutral-50 dark:bg-neutral-900 rounded-md py-1 w-40 z-50 shadow-sm"
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={cat.slug === "all" ? "/blogs" : `/category/${cat.slug}`}
                      className="block px-3 py-1 hover:text-blue-500 rounded"
                      onClick={() => setCategoryOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="toggle theme"
            className="p-1 rounded"
          >
            {mounted ? (theme === "dark" ? <Moon size={18} /> : <Sun size={18} />) : "..."}
          </motion.button>

          {/* Profile / Auth */}
          {!user ? (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-500"
            >
              <Github size={16} /> Login
            </button>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(!profileOpen); setCategoryOpen(false); }}
                className="flex items-center gap-1 hover:text-blue-500 transition"
              >
                <img
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                  className="w-7 h-7 rounded-full border"
                />
                <span>{user.user_metadata.user_name}</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 mt-1 bg-neutral-50 dark:bg-neutral-900 rounded-md py-1 w-40 z-50 shadow-sm"
                  >
                    <Link
                      href="/settings"
                      className="block px-3 py-1 hover:text-blue-500 flex items-center gap-1"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={14} /> Settings
                    </Link>
                    <Link
                      href="/suggestions"
                      className="block px-3 py-1 hover:text-blue-500"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Feedback
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1 text-red-600 flex items-center gap-1 hover:text-red-500"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 rounded text-neutral-800 dark:text-neutral-200 focus:outline-none"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="md:hidden bg-neutral-50 dark:bg-neutral-900 px-4 py-3 space-y-2 shadow-inner text-sm"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="block hover:text-blue-500">Home</Link>
            <Link href="/blogs" onClick={() => setIsOpen(false)} className="block hover:text-blue-500">Blogs</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block hover:text-blue-500">About</Link>
            <Link href="/feedback" onClick={() => setIsOpen(false)} className="block hover:text-blue-500">Feedback</Link>

            <details className="group">
              <summary className="cursor-pointer py-1 group-open:text-blue-500">Categories</summary>
              <div className="pl-3 mt-1 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug === "all" ? "/blogs" : `/category/${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-blue-500"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </details>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setIsOpen(false); }}
              aria-label="toggle theme"
              className="flex items-center gap-2 py-1"
            >
              {mounted ? theme === "dark" ? <Moon size={16} /> : <Sun size={16} /> : "..."}
              <span>{theme === "dark" ? "Dark" : "Light"}</span>
            </motion.button>

            {!user ? (
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 py-1 bg-blue-500 text-white rounded-md"
              >
                <Github size={16} /> Login
              </button>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    className="w-7 h-7 rounded-full"
                  />
                  <span>{user.user_metadata.user_name}</span>
                </div>
                <Link href="/settings" onClick={() => setIsOpen(false)} className="block hover:text-blue-500 py-1">Settings</Link>
                <Link href="/suggestions" onClick={() => setIsOpen(false)} className="block hover:text-blue-500 py-1">My Feedback</Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-1 text-red-600 flex items-center gap-1"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
