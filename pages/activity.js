// pages/myactivity.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { Activity } from "lucide-react";
import Loader from "../components/Loader"; // ✅ universal loader

export default function MyActivity() {
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [comments, setComments] = useState([]);
  const [postTitles, setPostTitles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // ✅ fetch feedbacks
        const { data: feedbacks } = await supabase
          .from("feedbacks")
          .select("id, feedback, created_at, username, avatar_url")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setSuggestions(feedbacks || []);

        // ✅ fetch comments & replies
        const { data: userComments } = await supabase
          .from("comments")
          .select(
            "id, message, created_at, username, avatar_url, post_slug, parent_id"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (userComments) {
          setComments(userComments);

          const uniqueSlugs = [...new Set(userComments.map((c) => c.post_slug))];
          if (uniqueSlugs.length > 0) {
            const { data: postsData } = await supabase
              .from("posts")
              .select("slug, title")
              .in("slug", uniqueSlugs);

            if (postsData) {
              const titleMap = {};
              postsData.forEach((p) => {
                titleMap[p.slug] = p.title;
              });
              setPostTitles(titleMap);
            }
          }
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Loader />; // ✅ use global loader
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Please login to see your activity.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Activity className="w-7 h-7 text-blue-500" />
        <h1 className="text-2xl font-bold">My Activity</h1>
      </div>

      {/* Feedbacks */}
      <h2 className="text-xl font-semibold mb-4">My Feedbacks</h2>
      {suggestions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          You haven't submitted any feedbacks yet.
        </p>
      ) : (
        <ul className="space-y-4 mb-10">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="p-5 border rounded-xl shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                {s.avatar_url && (
                  <img
                    src={s.avatar_url}
                    alt={s.username}
                    className="w-10 h-10 rounded-full border"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {s.username || "Anonymous"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(s.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {s.feedback}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Divider */}
      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      {/* Comments & Replies */}
      <h2 className="text-xl font-semibold mb-4">My Comments & Replies</h2>
      {comments.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          You haven't written any comments or replies yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="p-5 border rounded-xl shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                {c.avatar_url && (
                  <img
                    src={c.avatar_url}
                    alt={c.username}
                    className="w-9 h-9 rounded-full border"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {c.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* ✅ Scrollable if long */}
              <div className="max-h-32 overflow-y-auto pr-2 mb-2">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {c.message}
                </p>
              </div>

              {/* ✅ Linked post reference */}
              <Link
                href={`/posts/${c.post_slug}`}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline block"
              >
                {c.parent_id ? "Replied on " : "Commented on "}
                <span className="font-medium">
                  {postTitles[c.post_slug]
                    ? postTitles[c.post_slug].length > 50
                      ? postTitles[c.post_slug].substring(0, 50) + "..."
                      : postTitles[c.post_slug]
                    : "Post"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
