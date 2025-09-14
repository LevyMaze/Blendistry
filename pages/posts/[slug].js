// pages/posts/[slug].js
import { getAllPosts, getPostBySlug } from "../../lib/posts";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import Image from "next/image";
import CodeBlock from "../../components/CodeBlock";
import PostStats from "../../components/PostStats";
import Comments from "../../components/Comments";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const components = {
  h1: (props) => <h1 className="text-3xl font-bold mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold mt-6 mb-2" {...props} />,
  code: (props) =>
    props.className ? (
      <CodeBlock {...props} />
    ) : (
      <code
        className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded"
        {...props}
      />
    ),
};

export default function Post({ slug, frontmatter, mdxSource }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState(null);

  // ✅ Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen px-0 sm:px-6 lg:px-8 py-6">
      <div className="w-full sm:max-w-3xl sm:mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-lg">
        <article className="p-3 sm:p-6 lg:p-8">
          {/* Back button */}
          <p
            onClick={() => router.back()}
            className="group flex items-center px-3 py-1 rounded-lg cursor-pointer select-none w-max text-blue-600 dark:text-blue-400 transition transform duration-200 ease-in-out"
          >
            <span className="text-m font-bold transform transition-transform duration-200 ease-in-out group-hover:-translate-x-1 group-hover:text-blue-800 dark:group-hover:text-blue-500">
              く Back
            </span>
          </p>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">
            {frontmatter.title}
          </h1>

          {/* Author, date, stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm mb-6">
            <div className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-y-0">
              <span>Author: {frontmatter.author || "Unknown"}</span>
              <span>Date: {frontmatter.date}</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
              <PostStats slug={slug} inline />
            </div>
          </div>

          {/* Featured image */}
          {frontmatter.image && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 mb-6 rounded-lg shadow-md mx-auto">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none">
            <MDXRemote {...mdxSource} components={components} />
          </div>
        </article>
      </div>

      {/* Comments */}
      <div className="mt-10 w-full sm:max-w-3xl sm:mx-auto space-y-3">
        <Comments slug={slug} user={user} />
      </div>
    </div>
  );
}

// Static paths
export async function getStaticPaths() {
  const posts = getAllPosts();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

// Static props
export async function getStaticProps({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);
  const mdxSource = await serialize(post.content);

  return {
    props: { slug, frontmatter: post.frontmatter, mdxSource },
  };
}
