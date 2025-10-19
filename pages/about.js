// pages/about.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub, FaDiscord } from "react-icons/fa";

export default function About() {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    // Fetch GitHub avatar dynamically
    fetch("https://api.github.com/users/LevyMaze")
      .then((res) => res.json())
      .then((data) => setAvatar(data.avatar_url))
      .catch(() => setAvatar(null));
  }, []);

  return (
    <div className="w-full sm:max-w-4xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-neutral-900 dark:text-neutral-100">
        About <span className="text-blue-500">Blendistry</span>
      </h1>

      {/* Intro */}
      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 sm:p-10 shadow-sm leading-relaxed">
        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
          Blendistry is a platform committed to delivering precise, structured,
          and practical knowledge in web development. Covering frontend,
          backend, databases, debugging, version control, and core programming
          concepts, we cut through unnecessary complexity to provide clear,
          reliable, and actionable content. Our purpose is simple: empower
          developers with focused resources that accelerate learning, sharpen
          skills, and support professional growth.
        </p>

        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
          Blendistry started as a place to share fixes for those frustrating
          errors we all encounter late at night. Over time, it’s grown into a
          space where tips, tutorials, and best practices are shared in a
          developer-friendly format.
        </p>
      </div>

      {/* Philosophy */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Our Philosophy
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
            Code should be simple, readable, and reliable. We believe that
            documenting bugs and fixes makes everyone a stronger programmer. No
            problem is too small to write about, every solved error is a step
            forward for the community.
          </p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            What You'll Find
          </h2>
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed space-y-2">
            <li>Precise bug fixes and error breakdowns</li>
            <li>Concise, reliable code snippets</li>
            <li>Direct, step-by-step tutorials</li>
            <li>Tips for frontend, backend, and beyond</li>
          </ul>
        </div>
      </div>

      {/* Developer Section */}
      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 sm:p-10 shadow-sm leading-relaxed mt-10 text-center">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-3 mb-3"></div>

          <p className="text-neutral-700 dark:text-neutral-300 mb-4 text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
            {/* Inline avatar beside text */}
            <span className="text-gray-500 text-bold">The Developer</span>
            {avatar && (
              <Link
                href="https://github.com/LevyMaze"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-500 transition"
              >
                <img
                  src={avatar}
                  alt="LevyMaze GitHub avatar"
                  className="w-12 h-12 sm:w-7 sm:h-7 rounded-full border border-neutral-300 dark:border-neutral-600"
                />
                <span className="font-medium text-xl">LevyMaze</span>
              </Link>
            )}
            Hope you’re enjoying Blendistry so far! If you’ve got an idea,
            suggestion, or tweak in mind, I’d love to hear it through feedback
            or email.
          </p>

          <div className="flex justify-center items-center gap-6 mt-3">
            <Link
              href="https://github.com/LevyMaze"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-500 transition"
            >
              <FaGithub className="text-xl" />
              <span className="text-sm">@levymaze</span>
            </Link>
            <Link
              href="https://discord.com/users/levymaze"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-500 transition"
            >
              <FaDiscord className="text-xl" />
              <span className="text-sm">@levymaze</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="mt-12 text-center">
        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
          Want to explore the latest blogs?
        </p>
        <Link
          href="/blogs"
          className="button inline-block px-6 py-2 rounded-lg font-medium border border-gray-500 hover:text-blue-500 hover:border-blue-400 transition"
        >
          Browse Blogs
        </Link>
      </div>
    </div>
  );
}
