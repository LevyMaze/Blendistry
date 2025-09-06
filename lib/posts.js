import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  const posts = files
    .filter((file) => file.endsWith(".mdx"))
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
    content,
  };
}
