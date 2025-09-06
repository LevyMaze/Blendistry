// pages/index.js
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllPosts } from "../lib/posts";
import BlogCard from "../components/BlogCard"; // Import reusable BlogCard

export default function Home({ posts }) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();

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

  const latestPosts = filteredPosts.slice(0, 4);

  return (
    <div className="w-full sm:max-w-5xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      {/* ------------------ HERO ------------------ */}
      <section className="mb-6">
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-none sm:rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold blue">
                Blendistry
              </h1>
              <p className="mt-1 text-neutral-600 dark:text-neutral-300 max-w-xl">
                Blendistry is a knowledge platform dedicated to clear, practical, and disciplined guidance in web development.
              </p>
              <div className="mt-3 flex gap-3 items-center">
                <Link
                  href="/blogs"
                  className="button inline-block px-3 py-1 rounded-md border border-neutral-300 sm:inline-flex items-center gap-2 text-sm hover:underline blue"
                >
                  Browse all blogs
                </Link>
                <span className="button inline-block px-3 py-1 rounded-md border border-neutral-300 text-sm">
                  Bugs · Fixes · Tips
                </span>
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
        <div className="relative w-full sm:w-64">
          <input
            id="search"
            type="text"
            placeholder=" "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="peer w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500 px-1"
          >
            Search Latest posts
          </label>
        </div>
      </div>

      {/* ------------------ Posts List ------------------ */}
      <div className="flex flex-col gap-5 sm:gap-7">
        {latestPosts.length === 0 ? (
          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
            No posts match your search.
          </div>
        ) : (
          latestPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i}/>
          ))
        )}
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
