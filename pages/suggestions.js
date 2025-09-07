// pages/suggestions.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Suggestions() {
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSuggestions = async () => {
      setLoading(true);

      // get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // fetch feedbacks written by this user
        const { data, error } = await supabase
          .from("feedbacks")
          .select("id, feedback, created_at, username, avatar_url")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching suggestions:", error);
        } else {
          setSuggestions(data);
        }
      }

      setLoading(false);
    };

    fetchUserAndSuggestions();
  }, []);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Please login to see your Feedbacks.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Feedbacks</h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          You haven’t submitted any Feedbacks yet.
        </p>
      ) : (
        <ul className="space-y-4">
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
    </div>
  );
}
