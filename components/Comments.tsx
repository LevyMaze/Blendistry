// components/Comments.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";

export default function Comments({ slug, user }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [notice, setNotice] = useState(null);
  const [openReplies, setOpenReplies] = useState({});

  const POLL_INTERVAL_MS = 5000;

  const showNotice = (msg, type = "info", ms = 3000) => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), ms);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_slug", slug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetchComments error:", error);
      return;
    }

    const rows = data || [];

    const repliesMap = {};
    rows.forEach((r) => {
      if (r.parent_id) {
        repliesMap[r.parent_id] = repliesMap[r.parent_id] || [];
        repliesMap[r.parent_id].push(r);
      }
    });

    const roots = rows
      .filter((r) => !r.parent_id)
      .map((r) => ({
        ...r,
        replies: (repliesMap[r.id] || []).sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        ),
      }));

    roots.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
    setComments(roots);
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return showNotice("You must be logged in to comment.", "error");

    const text = message?.trim();
    if (!text) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert([
      {
        post_slug: slug,
        parent_id: null,
        user_id: user.id,
        username: user.user_metadata.user_name,
        avatar_url: user.user_metadata.avatar_url,
        message: text,
      },
    ]);
    setLoading(false);

    if (error) {
      console.error("insert comment error:", error);
      showNotice("Failed to post comment.", "error");
    } else {
      setMessage("");
      fetchComments();
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!user) return showNotice("You must be logged in to reply.", "error");

    const text = replyMessage?.trim();
    if (!text) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert([
      {
        post_slug: slug,
        parent_id: parentId,
        user_id: user.id,
        username: user.user_metadata.user_name,
        avatar_url: user.user_metadata.avatar_url,
        message: text,
      },
    ]);
    setLoading(false);

    if (error) {
      console.error("insert reply error:", error);
      showNotice("Failed to post reply.", "error");
    } else {
      setReplyMessage("");
      setReplyingTo(null);
      fetchComments();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      console.error("delete comment error:", error);
      showNotice("Failed to delete.", "error");
    } else {
      showNotice("Deleted.", "success");
      fetchComments();
    }
  };

  const handleVote = async (commentId, type) => {
    if (!user) return showNotice("You must be logged in to vote.", "error");

    const { error } = await supabase.from("comment_votes").insert([
      { comment_id: commentId, user_id: user.id, vote_type: type },
    ]);

    if (!error) {
      await supabase.rpc("increment_comment_vote", {
        comment_id: commentId,
        column_name: type === "like" ? "likes" : "dislikes",
      });
      fetchComments();
      showNotice(
        type === "like" ? "liked" : "disliked",
        "success"
      );
      return;
    }
    showNotice("You already voted!", "error");
  };

  return (
    <div className="mt-6 border-t pt-4">
      {notice && (
        <div
          className={`fixed right-4 top-20 z-50 px-4 py-2 rounded-lg border ${
            notice.type === "error"
              ? "border-red-600 text-red-600"
              : "border-green-600 text-green-600"
          }`}
        >
          {notice.msg}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-3">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your comment..."
            className="w-full border rounded-lg p-2 resize-none"
            rows={3}
            required
          />
          <div className="flex gap-2 items-center">
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 rounded border text-sm cursor-pointer hover:border-gray-600 hover:text-gray-600 transition text-gray-400 border-gray-400"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
            <span className="text-xs text-neutral-500">
              Signed in as <strong>{user.user_metadata?.user_name}</strong>
            </span>
          </div>
        </form>
      ) : (
        <p className="text-sm text-neutral-500 mb-4">
          Log in to Blendistry to post a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-neutral-500">No comments yet.</p>
        )}

        {comments.map((c) => (
          <div key={c.id} className="relative p-3 rounded-lg">
            <div className="flex gap-3">
              <img
                src={c.avatar_url}
                alt={c.username}
                className="w-10 h-10 rounded-full border flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-top">
                  <div>
                    <a
                      href={`https://github.com/${c.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {c.username}
                    </a>
                    <div className="text-xs text-neutral-500 mt-1">
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      onClick={() => handleVote(c.id, "like")}
                      className="flex items-center text-neutral-500 gap-1 hover:text-gray-400 transition cursor-pointer"
                    >
                      <FiThumbsUp /> <span>{c.likes || 0}</span>
                    </span>

                    <span
                      onClick={() => handleVote(c.id, "dislike")}
                      className="flex items-center gap-1 text-neutral-500 hover:text-gray-400 transition cursor-pointer"
                    >
                      <FiThumbsDown /> <span>{c.dislikes || 0}</span>
                    </span>
                    {user && user.id === c.user_id && (
                      <span
                        onClick={() => handleDelete(c.id)}
                        className="flex items-center gap-1 text-neutral-500 hover:text-red-500 transition cursor-pointer"
                      >
                        <FiTrash2 size={18} />
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-sm w-full">
                  <div className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
                    {c.message}
                  </div>
                </div>

                {user && (
                  <div className="mt-2">
                    <span
                      onClick={() =>
                        setReplyingTo(replyingTo === c.id ? null : c.id)
                      }
                      className="flex items-center gap-1"
                    >
                      <span className="flex items-center gap-1 hover:text-gray-500 transition cursor-pointer text-sm text-gray-400">
                        <FiChevronDown /> Reply
                      </span>
                    </span>
                  </div>
                )}

                {replyingTo === c.id && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, c.id)}
                    className="mt-3"
                  >
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full border rounded-lg resize-none p-2"
                      rows={2}
                      required
                    />
                    <div className="flex gap-2 items-center mt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-1 rounded border text-sm border-gray-500 cursor-pointer hover:border-gray-400 transition"
                      >
                        {loading ? "Replying..." : "Post Reply"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyMessage("");
                        }}
                        className="px-3 py-1 rounded border text-sm border-gray-500 cursor-pointer hover:border-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {c.replies?.length > 0 && (
                  <div className="mt-3">
                    <span
                      onClick={() =>
                        setOpenReplies((prev) => ({
                          ...prev,
                          [c.id]: !prev[c.id],
                        }))
                      }
                      className="flex items-center gap-1"
                    >
                      {openReplies[c.id] ? (
                        <>
                          <span className="flex items-center gap-1 hover:text-gray-500 transition cursor-pointer text-sm text-gray-400">
                            <FiChevronUp /> Hide replies ({c.replies.length})
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1 hover:text-gray-500 transition cursor-pointer text-sm text-gray-400">
                            <FiChevronDown /> View replies ({c.replies.length})
                          </span>
                        </>
                      )}
                    </span>

                    {openReplies[c.id] && (
                      <div className="mt-2 space-y-2 border-top">
                        {c.replies.map((r) => (
                          <div
                            key={r.id}
                            className="p-2 rounded flex gap-2 items-start">
                          
                            <img
                              src={r.avatar_url}
                              alt={r.username}
                              className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <a
                                href={`https://github.com/${r.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline text-sm"
                              >
                                {r.username}
                              </a>
                              <div className="text-xs text-neutral-500">
                                {new Date(r.created_at).toLocaleString()}
                              </div>
                              <div className="mt-1 text-sm whitespace-pre-wrap break-words max-h-28 overflow-y-auto pr-2">
                                {r.message}
                              </div>
                            </div>

                            {user && user.id === r.user_id && (
                              <span
                                onClick={() => handleDelete(r.id)}
                                className="p-1 rounded text-neutral-500 hover:text-red-500 transition cursor-pointer"
                              >
                                <FiTrash2 size={16} />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
