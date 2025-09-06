import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import likeIcon from "../images/like.png"; 
import dislikeIcon from "../images/dislike.png"; 

export default function PostStats({ slug }) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  // ✅ Fetch or create post row
  const fetchStats = async () => {
    let { data, error } = await supabase
      .from("post_stats")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!data) {
      // Insert new row if not exists
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

  // ✅ Handle like/dislike with localStorage guard
  const handleVote = async (type) => {
    const voted = localStorage.getItem(`blendistry-voted-${slug}`);
    if (voted) {
      alert("You already voted!");
      return;
    }

    const column = type === "like" ? "likes" : "dislikes";

    await supabase.rpc("increment_stat", { post_slug: slug, column_name: column });
    fetchStats();

    localStorage.setItem(`blendistry-voted-${slug}`, type);
  };

  return (
    <div className="flex sm:flex-row justify-between items-center text-sm">
      
      {/* Like / Dislike */}
<div className="flex gap-4">
  <span
    onClick={() => handleVote("like")}
    className="flex items-center gap-1 px-3 py-1 rounded-lg vote"
  >
    <span>{likes}</span>
    <Image src={likeIcon} alt="Like" width={18} height={18} />
  </span>

  <span
    onClick={() => handleVote("dislike")}
    className="flex items-center gap-1 px-3 py-1 rounded-lg vote"
  >
    <span>{dislikes}</span>
    <Image src={dislikeIcon} alt="Dislike" width={18} height={18} />
  </span>
</div>

    </div>
  );
}
