import { useState } from "react";
import { getAllPosts } from "../lib/posts";
import BlogCard from "../components/BlogCard";

export default function Blogs({ posts }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) =>
    `${post.frontmatter.title} ${post.frontmatter.author} ${post.frontmatter.date} ${post.slug} ${post.frontmatter.excerpt || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full sm:max-w-5xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h4 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100">
          All Blogs
        </h4>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder=" "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="peer w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500 px-1">
            Search posts
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:gap-7">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i}/>
          ))
        ) : (
          <p className="text-center text-yellow-600">No posts found.</p>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}
