// pages/myactivity.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { Activity, Trash2 } from "lucide-react";
import Loader from "../components/Loader"; // ✅ universal loader

export default function MyActivity() {
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [comments, setComments] = useState([]);
  const [postTitles, setPostTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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

  // ✅ delete comment logic
  const handleDeleteComment = async (id) => {
    setDeleting(id);
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      console.error("Error deleting comment:", error.message);
    }
    setDeleting(null);
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Please login to see your activity.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Feedbacks */}
  <div className="w-full">
    <h2 className="text-xl font-semibold mb-4">My Feedbacks</h2>
    {suggestions.length === 0 ? (
      <p className="text-gray-600 dark:text-gray-300">
        You haven't submitted any feedbacks yet.
      </p>
    ) : (
      
      <ul className="space-y-4">
        <span className="text-sm text-amber-600 dark:text-amber-400 mb-3 border border-yellow-500 rounded p-1 mb-10">
      Feedbacks cannot be deleted.
    </span>
    <br/>
    <br/>
        {suggestions.map((s) => (
          
          <li
            key={s.id}
            className="p-5 border rounded-xl shadow-sm transition hover:shadow-md bordered"
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
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
              {s.feedback}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Comments & Replies */}
  <div className="w-full">
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
            className="p-5 border bordered rounded-xl shadow-sm transition hover:shadow-md relative"
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

            <div className="max-h-32 overflow-y-auto pr-2 mb-2">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line break-words">
                {c.message}
              </p>
            </div>

            <Link
              href={`/posts/${c.post_slug}`}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline block mb-2"
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

            <span
              onClick={() => handleDeleteComment(c.id)}
              disabled={deleting === c.id}
              className="absolute top-4 right-4 flex items-center gap-1 text-sm p-1 px-2 rounded cursor-pointer text-red-700 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300 border border-red-500 transition"
            >
              <Trash2 className="w-4 h-4 cursor-pointer " />
              {deleting === c.id ? "Deleting..." : "Delete"}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

  );
}
