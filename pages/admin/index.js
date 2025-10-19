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
    if (error) showAlert("error", "Failed to fetch feedbacks");
    setFeedbacks(data || []);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username, created_at");
    if (error) showAlert("error", "Failed to fetch users");
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
    if (!feedbacks.length) return showAlert("info", "No feedbacks to export");

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
      <div className="p-6 text-center max-w-lg mx-auto mt-20">
        <span className="text-xl font-bold mb-4 text-red-600">
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
      <div className="p-6 text-center max-w-lg mx-auto mt-20">
        <span className="text-xl font-bold mb-4 text-yellow-600">
          Unauthorized
        </span>
        <p className="text-gray-600 dark:text-gray-400 mt-5">
          Hello <b>{user.user_metadata.user_name}</b>, you are not authorized to
          view this page.
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
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({})}
      />

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-3 items-center">
          <img
            src={user.user_metadata.avatar_url}
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full"
          />
          {user.user_metadata.user_name ? (
          <a
            href={`https://github.com/${user.user_metadata.user_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {user.user_metadata.user_name}
          </a>
        ) : (
          "Anonymous"
        )}
          
          
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ title: "Total Feedbacks", value: feedbacks.length },
          { title: "Unique Users", value: new Set(feedbacks.map((f) => f.user_id)).size },
          { title: "This Week", value: feedbacks.filter((f) =>
              new Date(f.created_at) >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length },
          { title: "Latest Signup", value: users[0]
              ? new Date(users[0].created_at).toLocaleString()
              : "—" },
        ].map((stat, i) => (
          <div key={i} className="bordered p-4 rounded-lg text-center">
            <span className="font-semibold text-blue-500">{stat.title}</span>
            <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bordered p-4 rounded-lg">
          <span className="font-semibold mb-3 text-blue-500">Feedbacks Over Time</span>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={feedbackOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="blue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bordered p-4 rounded-lg">
          <span className="font-semibold mb-3 text-blue-500">Top Contributors</span>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topContributors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="blue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Feedback List */}
      <section className="bordered rounded-lg p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row justify-between mb-4 items-start lg:items-center gap-3">
          <span className="text-lg sm:text-xl font-bold text-blue-500">
            User Feedbacks
          </span>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded cursor-pointer transition hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 flex-grow sm:flex-grow-0"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border px-3 py-1 rounded cursor-pointer hover:border-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button
              onClick={exportCSV}
              className="border px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer hover:border-gray-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
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
            <table className="w-full border-collapse text-sm">
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
      <td className="p-2 flex items-center gap-2">
        <img
          src={f.avatar_url}
          alt={f.username || "Anonymous"}
          className="w-8 h-8 rounded-full"
        />
        {f.username ? (
          <a
            href={`https://github.com/${f.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {f.username}
          </a>
        ) : (
          "Anonymous"
        )}
      </td>
      <td className="p-2">{f.feedback}</td>
      <td className="p-2 whitespace-nowrap">
        {new Date(f.created_at).toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )}
      </section>

      
</div>
  );
}


