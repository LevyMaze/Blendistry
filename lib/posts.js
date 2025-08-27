import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

// 🔹 Get all posts
export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);

    const categoryName = data.category || "General";
    const categorySlug = categoryName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/&/g, "and");

    // Generate excerpt if not provided in frontmatter
    const excerpt =
      data.excerpt ||
      content
        .split("\n")
        .find((line) => line.trim().length > 0)
        ?.slice(0, 150) + "...";

    const frontmatter = {
      title: data.title || "Untitled",
      date: data.date || "No date",
      author: data.author || "Unknown",
      image: data.image || null,
      category: categoryName,
      categorySlug,
      excerpt,
    };

    return { slug, frontmatter, content };
  });

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  );
}

// 🔹 Get single post by slug
export function getPostBySlug(slug) {
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  return post || null;
}

// 🔹 Get all unique categories
export function getAllCategories() {
  const posts = getAllPosts();
  const categories = posts.map((p) => ({
    name: p.frontmatter.category,
    slug: p.frontmatter.categorySlug,
  }));

  // Remove duplicates
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

// 🔹 Get posts by category slug
export function getPostsByCategorySlug(slug) {
  const posts = getAllPosts();
  return posts.filter((p) => p.frontmatter.categorySlug === slug);
}
