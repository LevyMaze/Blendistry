// pages/blogs.js
import { useState } from "react";
import Link from "next/link";
import { getAllPosts } from "../lib/posts";
import { motion } from "framer-motion";

export default function Blogs({ posts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPosts = posts.filter((post) => {
    const content = `${post.frontmatter.title} ${post.frontmatter.author} ${post.frontmatter.date} ${post.slug} ${post.frontmatter.excerpt || ""}`.toLowerCase();
    return content.includes(searchQuery.toLowerCase());
  });

  // Category color mapping (matching your categories exactly)
  const categoryColors = {
    "Frontend": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 hover:underline",
    "Backend": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 hover:underline",
    "Database": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 hover:underline",
    "Git & Github": "bg-black text-white dark:bg-gray-800 dark:text-gray-100 hover:underline",
    "Debugging": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 hover:underline",
    "General": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:underline",
  };

  return (
    <div className="w-full sm:max-w-5xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
  {/* Page heading */}
  <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100">
    All Blogs
  </h4>

  {/* Search bar with floating label */}
  <div className="relative w-full sm:w-72">
    <input
      type="text"
      id="search"
      placeholder=" "
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="peer w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <label
      htmlFor="search"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500 px-1"
    >
      Search posts
    </label>
  </div>
</div>


      <div className="flex flex-col gap-5 sm:gap-7">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link href={`/posts/${post.slug}`} className="block">
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-none sm:rounded-xl shadow-sm hover:shadow-md overflow-hidden hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col sm:flex-row">
                  {post.frontmatter?.image ? (
                    <img
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      className="w-full sm:w-48 h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full sm:w-48 h-48 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                      No Image
                    </div>
                  )}
                  <div className="p-4 sm:p-5 flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-neutral-900 dark:text-neutral-100 hover:underline">
                      {post.frontmatter.title}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                      Date: {post.frontmatter.date} &nbsp;|&nbsp; Author:{" "}
                      {post.frontmatter.author || "Unknown"}
                    </p>
                    {/* Excerpt */}
                    {post.frontmatter.excerpt && (
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                        {post.frontmatter.excerpt.length > 120
                          ? post.frontmatter.excerpt.slice(0, 120) + "..."
                          : post.frontmatter.excerpt}
                      </p>
                    )}
                    {/* Category Tag */}
                    {post.frontmatter?.category && (
                      <Link href={`/category/${post.frontmatter.categorySlug}`}>
                        <span
                          className={`inline-block text-xs px-2 py-1 rounded-md cursor-pointer ${
                            categoryColors[post.frontmatter.category] ||
                            "bg-black text-white dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {post.frontmatter.category}
                        </span>
                      </Link>
                    )}
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Read more …
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-neutral-500 dark:text-neutral-400">
            No posts found.
          </p>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}
