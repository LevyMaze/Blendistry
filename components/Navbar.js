// components/Navbar.js
import logoLight from "../images/logo-light.png";
import logoDark from "../images/logo-dark.png";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "All", slug: "all" },
    { name: "Frontend", slug: "frontend" },
    { name: "Backend", slug: "backend" },
    { name: "Database", slug: "database" },
    { name: "GitGithub", slug: "git-github" },
    { name: "Debugging", slug: "debugging" },
    { name: "General", slug: "general" },
  ];

  return (
    <nav className="bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow transition-colors duration-300 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-blue-500">
          {mounted && (
            <img
              src={theme === "dark" ? logoDark.src : logoLight.src}
              alt="Logo"
              width="45"
              height="45"
              className="rounded-full"
            />
          )}
           <p class="font-bold text-lg text-blue-500">Blendistry</p>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 relative">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/blogs" className="hover:underline">Blogs</Link>
          <Link href="/about" className="hover:underline">About</Link>

          {/* Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="hover:underline"
            >
              Categories ▾
            </button>
            {categoryOpen && (
              <div className="absolute mt-2 bg-neutral-100 dark:bg-neutral-900 shadow-lg rounded-md py-2 w-44 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug === "all" ? "/blogs" : `/category/${cat.slug}`}
                    className="block px-4 py-2 hover:underline"
                    onClick={() => setCategoryOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 transition-colors duration-300 hover:underline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="toggle theme"
          >
            {mounted ? (theme === "dark" ? "🌙 Dark" : "☀️ Light") : "..."}
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md text-neutral-800 dark:text-neutral-200 focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-neutral-100 dark:bg-neutral-900 px-4 py-4 space-y-3 shadow-inner"
          >
            <Link href="/" className="block py-1 hover:underline" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/blogs" className="block py-1 hover:underline" onClick={() => setIsOpen(false)}>Blogs</Link>
            <Link href="/about" className="block py-1 hover:underline" onClick={() => setIsOpen(false)}>About</Link>

            {/* Mobile Categories */}
            <details>
              <summary className="cursor-pointer py-1">Categories</summary>
              <div className="pl-4 mt-1 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug === "all" ? "/blogs" : `/category/${cat.slug}`}
                    className="block py-1 hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </details>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 transition-colors duration-300"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setIsOpen(false);
              }}
              aria-label="toggle theme"
            >
              {mounted ? (theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode") : "..."}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
