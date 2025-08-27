// pages/posts/[slug].js
import { getPostBySlug } from "../../lib/posts";
import { marked } from "marked";
import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import Loader from "../../components/Loader";

export default function Post({ frontmatter, content }) {
  const { theme } = useTheme();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHtmlContent(marked(content));
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [content]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen px-0 sm:px-6 lg:px-8 py-6 transition-colors duration-300">
      <div className="w-full sm:max-w-3xl sm:mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-none sm:rounded-xl shadow-dark">
        <article className="p-3 sm:p-6 lg:p-8 transition-colors duration-300">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
            {frontmatter.title}
          </h1>

          <div className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
            <span>Date: {frontmatter.date}</span> &nbsp;|&nbsp;
            <span>Author: {frontmatter.author || "Unknown"}</span>
          </div>

          {frontmatter.image && (
            <img
              src={frontmatter.image}
              alt={frontmatter.title}
              className="w-full rounded-none sm:rounded-lg mb-6 object-cover"
            />
          )}

          <div
            className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none text-neutral-900 dark:text-neutral-100"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>

      <div className="mt-10 w-full sm:max-w-3xl sm:mx-auto">
        <Giscus
          id="comments"
          repo="LevyMaze/Blendistry"
          repoId="R_kgDOPhxMbA"
          category="General"
          categoryId="DIC_kwDOPhxMbM4CubFF"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={theme === "dark" ? "dark_dimmed" : "light"}
          lang="en"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // import getAllPosts server-side only
  const { getAllPosts } = await import("../../lib/posts");
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const { frontmatter, content } = getPostBySlug(slug);

  // replace undefined values to avoid serialization issues
  const safeFrontmatter = {
    title: frontmatter.title || "Untitled",
    date: frontmatter.date || null,
    author: frontmatter.author || null,
    image: frontmatter.image || null,
    category: frontmatter.category || "General",
  };

  return {
    props: {
      frontmatter: safeFrontmatter,
      content,
    },
  };
}
