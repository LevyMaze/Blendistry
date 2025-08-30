// pages/category/[category].js
import { getAllCategories, getPostsByCategorySlug } from "../../lib/posts";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function CategoryPage({ categoryName = "", posts = [] }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="w-full sm:max-w-5xl sm:mx-auto px-4 py-10 text-center text-neutral-700 dark:text-neutral-300">
        Loading category...
      </div>
    );
  }

  // Define background color classes for each category
  const categoryColors = {
    Frontend: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
    Backend: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    Database:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    "Git & Github":
      "bg-black text-white dark:bg-neutral-900 dark:text-neutral-100",
    Debugging:
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    General:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  };

  return (
    <div className="w-full sm:max-w-5xl sm:mx-auto px-0 sm:px-6 lg:px-8">
      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 py-10">
        Category: {categoryName}
      </h3>

      <div className="flex flex-col gap-5 sm:gap-7">
        {(!posts || posts.length === 0) && (
          <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
            No posts found in this category.
          </div>
        )}

        {posts &&
          posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link href={`/posts/${post.slug}`} className="block">
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-none sm:rounded-xl shadow-dark overflow-hidden hover:scale-[1.01] transition-transform transition-colors duration-300 cursor-pointer flex flex-col sm:flex-row mx-0 sm:mx-0">
                  {post.frontmatter.image ? (
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
                            "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
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
          ))}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const categories = getAllCategories();
  return {
    paths: categories.map((c) => ({ params: { category: c.slug } })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const posts = getPostsByCategorySlug(params.category) || [];
  const categoryName = posts[0]?.frontmatter.category || params.category;
  return {
    props: { categoryName, posts },
    revalidate: 10,
  };
}
