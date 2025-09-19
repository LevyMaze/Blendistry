import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Alert from "../../components/Alert";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const ADMIN_USERS = ["LevyMaze"];

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user && ADMIN_USERS.includes(user.user_metadata.user_name)) {
        fetchFeedbacks();
        fetchUsers();
      } else {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const fetchFeedbacks = async () => {
    const { data, error } = await supabase.from("feedbacks").select("*");
    if (error) {
      showAlert("error", "Failed to fetch feedbacks");
    }
    setFeedbacks(data || []);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, created_at");
    if (error) {
      showAlert("error", "Failed to fetch users");
    }
    setUsers(data || []);
  };

  const filteredFeedbacks = feedbacks
    .filter(
      (f) =>
        f.username?.toLowerCase().includes(search.toLowerCase()) ||
        f.feedback.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  const exportCSV = () => {
    if (!feedbacks.length) {
      showAlert("info", "No feedbacks to export");
      return;
    }

    const csv = [
      ["User", "Feedback", "Date"].join(","),
      ...feedbacks.map((f) =>
        [
          f.username || "Anonymous",
          `"${f.feedback.replace(/"/g, '""')}"`,
          new Date(f.created_at).toLocaleString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "feedbacks.csv";
    a.click();
    URL.revokeObjectURL(url);

    showAlert("success", "Feedbacks exported as CSV");
  };

  if (!user) {
    return (
      <div className="p-6 text-center rounded-xl max-w-lg mx-auto mt-20 border-red-500">
        <span className="text-xl font-bold mb-4 text-red-600 dark:red danger">
          Access Denied
        </span>
        <p className="text-gray-600 dark:text-gray-400 mt-5">
          Please log in with Developer Account on GitHub to access this page.
        </p>
      </div>
    );
  }

  if (!ADMIN_USERS.includes(user.user_metadata.user_name)) {
    return (
      <div className="p-6 text-center border rounded-xl max-w-lg mx-auto mt-20 border-yellow-600">
        <span className="text-xl font-bold mb-4 text-red-600 warning">
          Unauthorized
        </span>
        <p className="text-gray-600 dark:text-gray-400 mt-5">
          Hello <b>{user.user_metadata.user_name}</b>, The developer did not give
          you access to this page.
        </p>
      </div>
    );
  }

  const feedbackOverTime = feedbacks.map((f) => ({
    date: new Date(f.created_at).toLocaleDateString(),
    count: 1,
  }));

  const topContributors = Object.values(
    feedbacks.reduce((acc, f) => {
      const user = f.username || "Anonymous";
      if (!acc[user]) acc[user] = { name: user, count: 0 };
      acc[user].count++;
      return acc;
    }, {})
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {/* Global Alert */}
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({})}
      />

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-bottom pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-3 items-center">
          <img
            src={user.user_metadata.avatar_url}
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full bordered"
          />
          <span className="text-sm">{user.user_metadata.user_name}</span>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Feedbacks", value: feedbacks.length },
          {
            title: "Unique Users",
            value: new Set(feedbacks.map((f) => f.user_id)).size,
          },
          {
            title: "This Week",
            value: feedbacks.filter(
              (f) =>
                new Date(f.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
          },
          {
            title: "Latest Signup",
            value: users[0]
              ? new Date(users[0].created_at).toLocaleString()
              : "—",
          },
        ].map((stat, i) => (
          <div key={i} className="bordered p-4 rounded-lg text-center">
            <h2 className="font-semibold">{stat.title}</h2>
            <p className="text-lg sm:text-2xl font-bold break-words">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bordered p-4 rounded-lg">
          <h2 className="font-semibold mb-3 text-center sm:text-left">
            Feedbacks Over Time
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={feedbackOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
              <XAxis dataKey="date" stroke="currentColor" />
              <YAxis allowDecimals={false} stroke="currentColor" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg,  #8d8d8dff)",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                }}
              />
              <Line type="monotone" dataKey="count" stroke="currentColor" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bordered p-4 rounded-lg">
          <h2 className="font-semibold mb-3 text-center sm:text-left">
            Top Contributors
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topContributors}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis allowDecimals={false} stroke="currentColor" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, #8d8d8dff)",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                }}
              />
              <Bar dataKey="count" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Feedback List */}
      <section className="bordered rounded-lg p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between mb-4 items-start lg:items-center gap-3">
          <span className="text-lg sm:text-xl font-bold text-yellow-600">
            User Feedbacks
          </span>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded flex-1 min-w-[150px]"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bordered px-3 py-1 rounded"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <span
              onClick={exportCSV}
              className="bordered px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              Export CSV
            </span>
          </div>
        </div>

        {loading ? (
          <p>Loading feedbacks...</p>
        ) : filteredFeedbacks.length === 0 ? (
          <p>No feedbacks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-bottom">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Feedback</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((f) => (
                  <tr key={f.id} className="border-bottom">
                    <td className="p-2 flex items-center gap-2 min-w-[140px]">
                      <img
                        src={f.avatar_url}
                        className="w-8 h-8 rounded-full bordered"
                      />
                      <span className="truncate max-w-[100px] sm:max-w-none">
                        {f.username || "Anonymous"}
                      </span>
                    </td>
                    <td className="p-2 min-w-[200px]">
                      <div className="max-h-24 overflow-y-auto pr-2">
                        {f.feedback}
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap min-w-[140px]">
                      {new Date(f.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Logs */}
      <section className="bordered rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3">System Logs</h2>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <li>✔️ Dashboard loaded at {new Date().toLocaleTimeString()}</li>
          <li>✔️ {feedbacks.length} feedbacks fetched</li>
          <li>✔️ {users.length} users fetched</li>
        </ul>
      </section>

      {/* Pending Blogs Section */}
      <section className="bordered rounded-lg p-4 sm:p-6">
        <span className="text-lg sm:text-xl font-bold mb-3 text-yellow-600">
          Pending Blog Submissions
        </span>
        <PendingBlogs showAlert={showAlert} />
      </section>
    </div>
  );
}

function PendingBlogs({ showAlert }) {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const { data, error } = await supabase
      .from("pending_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      showAlert("error", "Failed to fetch pending blogs");
    } else {
      setPendingPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Reject this blog?")) return;
    const { error } = await supabase.from("pending_posts").delete().eq("id", id);
    if (error) {
      showAlert("error", "Failed to reject blog");
    } else {
      showAlert("success", "Blog rejected");
      fetchPending();
    }
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    showAlert("success", message);
  };

  return (
    <div className="divide-y">
      {loading ? (
        <span className="text-blue-500">Loading blogs...</span>
      ) : pendingPosts.length === 0 ? (
        <span className="text-green-500">No pending blogs</span>
      ) : (
        pendingPosts.map((p) => {
          const mdxContent = `---
title: "${p.title}"
date: "${new Date(p.created_at).toISOString().split("T")[0]}"
author: "${p.author}"
image: "${p.image}"
excerpt: "${p.excerpt}"
category: "${p.category}"
---

${p.content}`;
          return (
            <div key={p.id} className="py-6 space-y-3">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.excerpt}</p>
              <p className="text-xs text-gray-500">
                By <b>{p.author}</b> ·{" "}
                {new Date(p.created_at).toLocaleString()}
              </p>

              <div className="flex gap-3 flex-wrap">
                <span
                  onClick={() =>
                    copyToClipboard(
                      `${p.title.replace(/\s+/g, "-").toLowerCase()}.mdx`,
                      "File name copied"
                    )
                  }
                  className="px-3 py-1 bordered rounded cursor-pointer hover:text-neutral-400 transition"
                >
                  Copy Title (.mdx)
                </span>
                <span
                  onClick={() =>
                    copyToClipboard(
                      mdxContent,
                      "Blog copied! Paste into /posts/"
                    )
                  }
                  className="px-3 py-1 bordered rounded cursor-pointer hover:text-neutral-400 transition"
                >
                  Copy MDX
                </span>
                <span
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 bordered rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer transition"
                >
                  Reject
                </span>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600 hover:underline">
                  Preview MDX
                </summary>
                <pre className="p-2 mt-2 bordered rounded text-xs overflow-x-auto">
                  {mdxContent}
                </pre>
              </details>
            </div>
          );
        })
      )}
    </div>
  );
}
