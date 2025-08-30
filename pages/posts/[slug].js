// pages/posts/[slug].js
import { getPostBySlug, getAllPosts } from "../../lib/posts";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

// Optional: Custom components inside MDX
const components = {
  h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-2" {...props} />,
  code: (props) => (
    <code
      className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded"
      {...props}
    />
  ),
};

export default function Post({ frontmatter, mdxSource }) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <div className="min-h-screen px-0 sm:px-6 lg:px-8 py-6">
      <div className="w-full sm:max-w-3xl sm:mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-lg ">
        <article className="p-3 sm:p-6 lg:p-8">
{/* Back button */}
<p
  onClick={() => router.back()}
  className="group flex items-center px-3 py-1 rounded-lg cursor-pointer select-none w-max 
             text-blue-600 dark:text-blue-400 
             
             hover: 
             transition transform duration-200 ease-in-out"
>
  <span className="text-xl font-bold transform transition-transform duration-200 ease-in-out
                   group-hover:-translate-x-1 group-hover:text-blue-800 dark:group-hover:text-blue-500">
    🠔
  </span>
</p>


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
              className="rounded-lg mb-6 object-cover"
            />
          )}

          <div className="prose dark:prose-invert max-w-none">
            <MDXRemote {...mdxSource} components={components} />
          </div>
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
  const posts = getAllPosts();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  // Serialize MDX for hydration
  const mdxSource = await serialize(post.content);

  return {
    props: {
      frontmatter: post.frontmatter,
      mdxSource,
    },
  };
}
