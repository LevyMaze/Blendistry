// components/Layout.js
import Navbar from "./Navbar";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Import both versions of the logo
import logoLight from "../images/logo-light.png";
import logoDark from "../images/logo-dark.png";

export default function Layout({ children, categories }) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Decide which logo to use
  const currentTheme = theme === "system" ? systemTheme : theme;
  const logo = currentTheme === "dark" ? logoDark : logoLight;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-[#0d1117] transition-colors duration-300">
      <Navbar categories={categories || []} />

      <main className="container mx-auto flex-1 pt-8 pb-16 w-full rounded-lg px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-[#161b22] py-8 mt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: logo + brand */}
          <div className="flex items-center gap-3">
            {mounted && (
              <Image
                src={logo}
                alt="Blendistry Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
            )}
            <div>
              <div className="font-semibold dark:text-neutral-400">Blendistry</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                © {new Date().getFullYear()}
              </div>
            </div>
          </div>

          {/* Middle: links */}
          <div className="flex gap-6 text-sm">
            <Link
              href="/tos"
              className="hover:underline "
            >
              Terms of Service
            </Link>
            <Link
              href="/privacypolicy"
              className="hover:underline "
            >
              Privacy Policy
            </Link>
          </div>

          {/* Right: GitHub + Email */}
          <div className="flex gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/LevyMaze"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-600 hover:underline transition"
              aria-label="LevyMaze on GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 .297a12 12 0 0 0-3.792 23.402c.6.11.82-.258.82-.577 
                  0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.39-1.334-1.76-1.334-1.76-1.09-.745.083-.729.083-.729 
                  1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.108-.776.418-1.305.76-1.606-2.665-.305-5.466-1.332-5.466-5.932 
                  0-1.31.47-2.38 1.235-3.22-.124-.304-.535-1.527.118-3.183 
                  0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.552 3.297-1.23 3.297-1.23.655 1.656.244 2.879.12 3.183.77.84 
                  1.233 1.91 1.233 3.22 0 4.61-2.804 5.624-5.475 5.92.43.37.814 1.1.814 2.22 
                  0 1.604-.014 2.896-.014 3.286 0 .322.218.694.825.576A12 12 0 0 0 12 .297" />
              </svg>
              <span className="hidden sm:inline text-sm">GitHub</span>
            </a>

            {/* Email */}
            <a
              href="mailto:LevyMaze@gmail.com"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-600 hover:underline transition"
              aria-label="Send email to LevyMaze"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 
                  2 0 0 0 2 2h16a2 2 0 0 0 
                  2-2V6a2 2 0 0 0-2-2zm0 
                  2v.01L12 13 4 6.01V6h16zM4 
                  18V8l8 5 8-5v10H4z"/>
              </svg>
              <span className="hidden sm:inline text-sm">Email</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
