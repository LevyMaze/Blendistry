// lib/posts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

// 🔹 Get all posts (frontmatter only)
export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  const posts = files
    .filter((file) => file.endsWith(".mdx")) // use only .mdx
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContents);

      const categoryName = data.category || "General";
      const categorySlug = categoryName
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/&/g, "and");

      const excerpt =
        data.excerpt ||
        content
          .split("\n")
          .find((line) => line.trim().length > 0)
          ?.slice(0, 150) + "...";

      return {
        slug,
        frontmatter: {
          title: data.title || "Untitled",
          date: data.date || "No date",
          author: data.author || "Unknown",
          image: data.image || null,
          category: categoryName,
          categorySlug,
          excerpt,
        },
      };
    });

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  );
}

// 🔹 Get single post by slug
export function getPostBySlug(slug) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const categoryName = data.category || "General";
  const categorySlug = categoryName
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/&/g, "and");

  return {
    slug,
    frontmatter: {
      title: data.title || "Untitled",
      date: data.date || "No date",
      author: data.author || "Unknown",
      image: data.image || null,
      category: categoryName,
      categorySlug,
      excerpt: data.excerpt || content.slice(0, 150) + "...",
    },
    content, // raw MDX string
  };
}

// 🔹 Get categories
export function getAllCategories() {
  const posts = getAllPosts();
  const categories = posts.map((p) => ({
    name: p.frontmatter.category,
    slug: p.frontmatter.categorySlug,
  }));

  const unique = [];
  const seen = new Set();
  for (const c of categories) {
    if (!seen.has(c.slug)) {
      unique.push(c);
      seen.add(c.slug);
    }
  }
  return unique;
}

export function getPostsByCategorySlug(slug) {
  const posts = getAllPosts();
  return posts.filter((p) => p.frontmatter.categorySlug === slug);
}
