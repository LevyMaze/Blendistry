// components/BlogCard.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import PostStats from "./PostStats";

export default function BlogCard({ post, index }) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      let { data } = await supabase
        .from("post_stats")
        .select("*")
        .eq("slug", post.slug)
        .single();

      if (data) {
        setViews(data.views);
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    };
    fetchStats();
  }, [post.slug]);

  // ---------------- Category Colors Mapping ----------------
  const categoryColors = {
    frontend: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 hover:underline",
    backend: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 hover:underline",
    database: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 hover:underline",
    "git & github": "bg-black text-white dark:bg-gray-800 dark:text-gray-100 hover:underline",
    "git-github": "bg-black text-white dark:bg-gray-800 dark:text-gray-100 hover:underline",
    debugging: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 hover:underline",
    general: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:underline",
  };

  const catKey = (post.frontmatter?.category || "").toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative"
    >
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-none sm:rounded-xl shadow-dark overflow-hidden hover:scale-[1.01] transition-transform duration-300 cursor-pointer flex flex-col sm:flex-row relative">
          
          {/* PostStats positioned top-right */}
          <div className="absolute top-3 right-3 z-10">
            <PostStats slug={post.slug} inline />
          </div>

          {/* Thumbnail */}
          {post.frontmatter?.image ? (
            <div className="w-full sm:w-48 h-48 overflow-hidden bg-neutral-200 dark:bg-neutral-700 hover:underline">
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

          <div className="sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 mt-3 text-neutral-900 dark:text-neutral-100 hover:underline">
                {post.frontmatter.title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Date: {post.frontmatter.date} &nbsp;|&nbsp; Author: {post.frontmatter.author || "Unknown"}
              </p>
              {post.frontmatter?.category && (
                <Link href={`/category/${catKey}`}>
                  <span className={`inline-block text-xs px-2 py-1 rounded-md cursor-pointer ${categoryColors[catKey] || "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}>
                    {post.frontmatter.category}
                  </span>
                </Link>
              )}
              {post.frontmatter?.excerpt && (
                <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                  {post.frontmatter.excerpt.length > 60
                    ? post.frontmatter.excerpt.slice(0, 60) + "..."
                    : post.frontmatter.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
