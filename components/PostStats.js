// components/PostStats.js
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import likeIcon from "../images/like.png";
import dislikeIcon from "../images/dislike.png";

export default function PostStats({ slug }) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [show, setShow] = useState(false);

  // ✅ Fetch or create post row
  const fetchStats = async () => {
    let { data } = await supabase
      .from("post_stats")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!data) {
      const { data: newRow } = await supabase
        .from("post_stats")
        .insert([{ slug }])
        .select()
        .single();
      data = newRow;
    }

    setViews(data.views);
    setLikes(data.likes);
    setDislikes(data.dislikes);
  };

  // ✅ Increment views once per mount
  useEffect(() => {
    const incrementViews = async () => {
      await supabase.rpc("increment_views", { post_slug: slug });
      fetchStats();
    };
    incrementViews();
  }, [slug]);

  // ✅ Show custom sliding alert
  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setShow(true);
    setTimeout(() => setShow(false), 2000);
    setTimeout(() => setAlert({ message: "", type: "" }), 2500);
  };

  // ✅ Handle like/dislike with localStorage guard
  const handleVote = async (type) => {
    const voted = localStorage.getItem(`blendistry-voted-${slug}`);

    if (voted) {
      if (voted === "like") {
        showAlert("You already liked this post!", "warning");
      } else if (voted === "dislike") {
        showAlert("You already disliked this post!", "warning");
      }
      return;
    }

    const column = type === "like" ? "likes" : "dislikes";
    await supabase.rpc("increment_stat", {
      post_slug: slug,
      column_name: column,
    });
    fetchStats();

    localStorage.setItem(`blendistry-voted-${slug}`, type);

    if (type === "like") {
      showAlert("Thanks for liking!", "success");
    } else {
      showAlert("Thanks for disliking!", "success");
    }
  };

  return (
    <div className="relative">
      {/* Sliding Alert */}
      {alert.message && (
        <div
          className={`fixed top-20 right-6 px-4 py-2 rounded-lg shadow-lg text-white transform transition-all duration-500 ${
            show ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
          } ${
            alert.type === "success"
              ? "bg-green-600"
              : alert.type === "warning"
              ? "bg-yellow-600"
              : "bg-red-600"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Stats row */}
      <div className="flex sm:flex-row justify-between items-center text-sm">
        <div className="flex gap-4">
          <span
            onClick={() => handleVote("like")}
            className="flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer bg-gray-700 border border-gray-500 text-gray-200 hover:bg-blue-700 transition"
          >
            <span>{likes}</span>
            <Image src={likeIcon} alt="Like" width={18} height={18} />
          </span>

          <span
            onClick={() => handleVote("dislike")}
            className="flex items-center gap-1 px-3 py-1 rounded-lg cursor-pointer bg-gray-700 border border-gray-500 text-gray-200 hover:bg-red-700 transition"
          >
            <span>{dislikes}</span>
            <Image src={dislikeIcon} alt="Dislike" width={18} height={18} />
          </span>
        </div>
      </div>
    </div>
  );
}
