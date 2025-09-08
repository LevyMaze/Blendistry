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

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const ADMIN_USERS = ["LevyMaze"];

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
    const { data } = await supabase.from("feedbacks").select("*");
    setFeedbacks(data || []);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, created_at");
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
  };

  if (!user) {
    return (
      <div className="p-6 text-center border rounded-xl max-w-lg mx-auto mt-20">
        <h1 className="text-xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Please log in with GitHub to access this page.
        </p>
      </div>
    );
  }

  if (!ADMIN_USERS.includes(user.user_metadata.user_name)) {
    return (
      <div className="p-6 text-center border rounded-xl max-w-lg mx-auto mt-20">
        <h1 className="text-xl font-bold mb-4 text-red-600">Unauthorized</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Hello <b>{user.user_metadata.user_name}</b>, you don’t have permission
          to access this page.
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
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3 items-center">
          <img
            src={user.user_metadata.avatar_url}
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border"
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
          <div
            key={i}
            className="border p-4 rounded-lg text-center"
          >
            <h2 className="font-semibold">{stat.title}</h2>
            <p className="text-lg sm:text-2xl font-bold break-words">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg">
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

        <div className="border p-4 rounded-lg">
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
      <section className="border rounded-lg p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between mb-4 items-start lg:items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold">User Feedbacks</h2>
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
              className="border px-3 py-1 rounded"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button
              onClick={exportCSV}
              className="border px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Export CSV
            </button>
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
                <tr className="border-b">
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Feedback</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((f) => (
                  <tr key={f.id} className="border-b">
                    <td className="p-2 flex items-center gap-2 min-w-[140px]">
                      <img
                        src={f.avatar_url}
                        className="w-8 h-8 rounded-full border"
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
      <section className="border rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3">System Logs</h2>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <li>✔️ Dashboard loaded at {new Date().toLocaleTimeString()}</li>
          <li>✔️ {feedbacks.length} feedbacks fetched</li>
          <li>✔️ {users.length} users fetched</li>
        </ul>
      </section>
    </div>
  );
}
