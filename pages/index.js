// pages/index.js
import Link from "next/link";
import { getAllPosts } from "../lib/posts";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function Home({ posts }) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

  // Filtered posts based on search
  const filteredPosts = useMemo(() => {
    if (!normalizedSearch) return posts;
    return posts.filter((post) => {
      const title = (post.frontmatter?.title || "").toLowerCase();
      const author = (post.frontmatter?.author || "").toLowerCase();
      const slug = (post.slug || "").toLowerCase();
      const excerpt = (post.frontmatter?.excerpt || "").toLowerCase();
      const category = (post.frontmatter?.category || "").toLowerCase();
      return (
        title.includes(normalizedSearch) ||
        author.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        excerpt.includes(normalizedSearch) ||
        category.includes(normalizedSearch)
      );
    });
  }, [posts, normalizedSearch]);

  // Only show 4 latest posts by default
  const latestPosts = filteredPosts.slice(0, 4);

  return (
    <div className="w-full sm:max-w-5xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      {/* ------------------ HERO ------------------ */}
      <section className="mb-6">
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-none sm:rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
                Blendistry
              </h2>
              <p className="mt-1 text-neutral-600 dark:text-neutral-300 max-w-xl">
                A GitHub-inspired blog built for developers who seek clarity in problem-solving. From debugging tricky errors to understanding backend logic,
                 database optimization, and version control workflows, the posts provide structured breakdowns, real-world fixes, and practical tips.
                  Each article supports Markdown and inline HTML to deliver theory-rich explanations alongside concise examples, making complex concepts
                   easier to grasp and apply in everyday development.
              </p>
              <div className="mt-3 flex gap-3 items-center">
                <Link
                  href="/blogs"
                  className="button inline-block px-3 py-1 rounded-md border border-neutral-300 sm:inline-flex items-center gap-2 text-sm"
                >
                  Browse all blogs
                </Link>
                <span className="button inline-block px-3 py-1 rounded-md border border-neutral-300 text-sm">
                  Bugs · Fixes · Tips
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-xs text-neutral-700 dark:text-neutral-500 text-right">
                <div className="font-medium">Curated for Developers</div>
                <div className="mt-1">Concise, practical solutions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ Heading + Search ------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center sm:text-left mb-0 text-neutral-900 dark:text-neutral-100">
          Latest Posts
        </h1>
        <div className="w-full sm:w-64">
          <label htmlFor="search" className="sr-only">
            Search posts
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search (e.g. TS, React)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* ------------------ Posts List ------------------ */}
      <div className="flex flex-col gap-5 sm:gap-7">
        {latestPosts.length === 0 && (
          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
            No posts match your search.
          </div>
        )}
        {latestPosts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="w-full"
          >
            <Link href={`/posts/${post.slug}`} className="block">
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-none sm:rounded-xl shadow-dark overflow-hidden hover:scale-[1.01] transition-transform duration-300 cursor-pointer flex flex-col sm:flex-row">
                {/* Thumbnail */}
                {post.frontmatter?.image ? (
                  <div className="w-full sm:w-48 h-48 overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                    <img
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      loading="lazy"
                      className="w-full h-full object-cover block"
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-48 h-48 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                    No Image
                  </div>
                )}
                <div className="p-4 sm:p-5 flex-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Date: {post.frontmatter.date} &nbsp;|&nbsp; Author:{" "}
                    {post.frontmatter.author || "Unknown"}
                  </p>
                  {post.frontmatter?.category && (
                    <Link
                      href={`/category/${post.frontmatter.category.toLowerCase()}`}
                    >
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-200 cursor-pointer">
                        {post.frontmatter.category}
                      </span>
                    </Link>
                  )}
                  {/* NEW: Excerpt/Description */}
                  {post.frontmatter?.excerpt && (
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      {post.frontmatter.excerpt}
                    </p>
                  )}
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                    Read more …
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ------------------ Explore More Button ------------------ */}
      {posts.length > 4 && (
        <div className="mt-6 text-center">
          <Link
            href="/blogs"
            className="inline-block px-6 py-2 rounded-md border hover:underline"
          >
            Explore More
          </Link>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}
