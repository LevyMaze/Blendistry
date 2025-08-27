// pages/about.js
import Link from "next/link";

export default function About() {
  return (
    <div className="w-full sm:max-w-4xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-neutral-900 dark:text-neutral-100">
        About Blendistry
      </h1>

      {/* Intro */}
      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 sm:p-10 shadow-sm leading-relaxed">
        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
          Welcome to <span className="font-semibold">Blendistry</span>, a blog
          crafted for developers, by developers. Our mission is simple:{" "}
          <span className="italic">
            to blend clean design with practical solutions for coding problems
          </span>. Whether it’s a sneaky JavaScript bug, a tricky TypeScript
          type issue, or a React hydration mismatch — you’ll find clear answers
          here.
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
            What You’ll Find
          </h2>
          <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed space-y-2">
            <li>Bug fixes and error explanations</li>
            <li>Code snippets and best practices</li>
            <li>Step-by-step tutorials</li>
            <li>Tips for React, Next.js, TypeScript, and more</li>
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
          className="button inline-block px-6 py-2 rounded-lg font-medium border hover:underline "
        >
          Browse Blogs
        </Link>
      </div>
    </div>
  );
}
