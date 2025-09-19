import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function AddPostBlog() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    excerpt: "",
    image: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (form.excerpt.length > 100) {
      alert("Excerpt must be less than 100 characters.");
      return false;
    }
    if (!/^https?:\/\//.test(form.image)) {
      alert("Image must be a valid URL.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!validateForm()) return;

    setLoading(true);

    const { error } = await supabase.from("pending_posts").insert([
      {
        title: form.title,
        category: form.category,
        excerpt: form.excerpt,
        image: form.image,
        content: form.content,
        author: user.user_metadata?.user_name || "Anonymous",
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      alert("❌ Error submitting blog: " + error.message);
    } else {
      alert("✅ Blog submitted! Awaiting admin verification.");
      router.push("/"); // back to homepage
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p>Please log in to submit a blog post.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <span className="text-2xl font-bold text-center block text-blue-500">
        Submit Your Blog
      </span>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bordered p-4 rounded-lg shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Title ..."
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Category <span className="text-yellow-600">(Choose one)</span>
          </label>
          <input
            type="text"
            name="category"
            placeholder="Frontend, Backend, Database, Git-Github, Debugging, General"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Excerpt <span className="text-yellow-600">(≤ 100 characters)</span>
          </label>
          <textarea
            name="excerpt"
            rows={2}
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Excerpt ..."
            required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image <span className="text-blue-500">(URL)</span>
          </label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            placeholder="https:// ..."
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Content <span className="text-yellow-600">(Markdown Supported)</span>
          </label>
          <textarea
            name="content"
            placeholder="Content goes here ..."
            rows={12}
            value={form.content}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bordered rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Blog"}
        </button>
      </form>

      {/* Example Blog Format */}
      <div className="mt-8 bordered rounded-lg p-4 text-sm leading-relaxed">
        <span className="font-semibold text-blue-600 mb-2">
          Example Blog Post Format
        </span>
        <p>
          <strong>Title:</strong> Getting Started with Tailwind CSS
        </p>
        <p>
          <strong>Category:</strong> Frontend
        </p>
        <p>
          <strong>Excerpt:</strong> Tailwind makes styling effortless with
          utility-first classes.
        </p>
        <p>
          <strong>Cover Image:</strong>{" "}
          https://example.com/tailwind-cover.png
        </p>
        <pre className="font-mono whitespace-pre-wrap border p-3 rounded mt-2 text-xs overflow-x-auto">
{`# Introduction
Tailwind CSS is a utility-first CSS framework...

## Why Tailwind?
- Fast styling
- Highly customizable

## Example
\`\`\`html
<div class="p-4 bg-blue-500 text-white">Hello Tailwind!</div>
\`\`\`

## Conclusion
Tailwind CSS speeds up development and keeps your design consistent.`}
        </pre>
      </div>
    </div>
  );
}
