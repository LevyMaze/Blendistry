// pages/about.js
import Link from "next/link";

export default function About() {
  return (
    <div className="w-full sm:max-w-4xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-neutral-900 dark:text-neutral-100">
        About <span className="text-blue-500">Blendistry</span> 
      </h1>

      {/* Intro */}
      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 sm:p-10 shadow-sm leading-relaxed">
        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
Blendistry is a platform committed to delivering precise, structured, and practical knowledge in web development. Covering frontend, backend, databases, debugging, version control, and core programming concepts, we cut through unnecessary complexity to provide clear, reliable, and actionable content.

Our purpose is simple: empower developers with focused resources that accelerate learning, sharpen skills, and support professional growth.
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
            problem is too small to write about — every solved error is a step
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
            <li>Tips for Frontend, backend, general and beyond</li>
          </ul>
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
