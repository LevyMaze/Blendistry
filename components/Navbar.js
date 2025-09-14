// components/Navbar.js
import logoLight from "../images/logo-light.png";
import logoDark from "../images/logo-dark.png";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Github, ChevronDown, LogOut, Settings, Activity } from "lucide-react";

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
            <span
              onClick={() => { setCategoryOpen(!categoryOpen); setProfileOpen(false); }}
              className="flex items-center gap-1 hover:text-blue-500 transition cursor-pointer transition"
            >
              Categories <ChevronDown size={14} />
            </span>
            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute mt-1 bg-neutral-50 dark:bg-neutral-900 rounded-md py-1 w-40 z-50 shadow-sm transition"
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={cat.slug === "all" ? "/blogs" : `/category/${cat.slug}`}
                      className="block px-3 py-1 hover:text-blue-500 rounded transition"
                      onClick={() => setCategoryOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          

          {/* Profile / Auth */}
          {!user ? (
            <span
              onClick={handleLogin}
              className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900 cursor-pointer transition border border-gray-500 transition"
            >
              <Github size={16} /> Login
            </span>
          ) : (
            <div className="relative" ref={profileRef}>
              <span
                onClick={() => { setProfileOpen(!profileOpen); setCategoryOpen(false); }}
                className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition"
              >
                <img
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                  className="w-7 h-7 rounded-full border"
                />
                <span className="flex items-center">{user.user_metadata.user_name} <ChevronDown size={14} /></span>
              </span>
              
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
                      className="block px-3 py-1 hover:text-blue-500 flex items-center gap-1 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={14} /> Settings
                    </Link>
                    <Link
                      href="/activity"
                      className="block px-3 py-1 hover:text-blue-500 flex items-center gap-1 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Activity size={14} /> 
                      My Activity
                    </Link>
                    <span
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1 text-red-600 flex items-center gap-1 hover:text-red-400 cursor-pointer transition"
                    >
                      <LogOut size={14} /> Logout
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

{/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="toggle theme"
            className="p-1 px-2 rounded cursor-pointer transition"           
          >
            {mounted ? (theme === "dark" ? <Moon size={20} /> : <Sun size={20} />) : "..."}
          </motion.button>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded text-neutral-800 dark:text-neutral-200 focus:outline-none px-2 p-1"
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
        <summary className="cursor-pointer group-open:text-gray-500 group-open: mr-55 rounded p-1 px-2 transition">Categories</summary>
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

      

      {/* Profile Dropdown */}
      {!user ? (
        <span
          onClick={handleLogin}
          className="flex mr-59 items-center justify-center gap-2 py-2 bg-gray-800 border-gray-500 hover:bg-gray-600 border text-white rounded-md"
        >
          <Github size={16} /> Login
        </span>
      ) : (
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer py-1 group-open:text-blue-500">
            <img
              src={user.user_metadata.avatar_url}
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
            <span className="flex items-center">{user.user_metadata.user_name} <ChevronDown size={14} /></span>
          </summary>
          <div className="pl-3 mt-1 space-y-1">
            <Link href="/settings" onClick={() => setIsOpen(false)} className="block hover:text-blue-500 py-1">Settings</Link>
            <Link href="/suggestions" onClick={() => setIsOpen(false)} className="block hover:text-blue-500 py-1">My Feedbacks</Link>
            <span
              onClick={handleLogout}
              className="py-1 text-red-600 flex items-center gap-1"
            >
              <LogOut size={14} /> Logout
            </span>
          </div>
        </details>
      )}
      {/* Theme toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setIsOpen(false); }}
        aria-label="toggle theme"
        className="flex items-center gap-2 p-1 rounded px-2"
      >
        {mounted ? theme === "dark" ? <Moon size={16} /> : <Sun size={16} /> : "..."}
        <span>{theme === "dark" ? "Dark" : "Light"}</span>
      </motion.button>
    </motion.div>
  )}
</AnimatePresence>

    </nav>
  );
}
