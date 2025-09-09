import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { FiEdit, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription?.subscription.unsubscribe();
  }, []);

  const showToast = (type, msg, ms = 4000) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), ms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      showToast("error", "Feedback cannot be empty.");
      return;
    }

    if (!user) {
      showToast("error", "You must log in with GitHub first.");
      return;
    }

    setLoading(true);

    const { user_metadata, id } = user;

    const { error } = await supabase.from("feedbacks").insert([
      {
        user_id: id,
        username: user_metadata.user_name, 
        avatar_url: user_metadata.avatar_url, 
        feedback: message.trim(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      showToast("error", "Failed to submit feedback.");
    } else {
      setMessage("");
      showToast("success", "Feedback submitted!");
    }
  };

  if (!user) {
    return (
      <div className="feedback-container border border-gray-500 lg:mx-10 rounded">
        <p className="feedback-login-text">
          Please log in with GitHub to leave feedback.
        </p>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
          className="flex align-center border border-gray-500"
        >
          <FaGithub className="btn-icon" /> Login with GitHub
        </button>
      </div>
    );
  }

 return (
  <div className="feedback-container w-full">
    <form
      onSubmit={handleSubmit}
      className="feedback-form flex flex-col gap-4 border"
    >
      {/* User Info */}
      <div className="feedback-user flex items-center gap-3">
        <img
          src={user.user_metadata.avatar_url}
          alt="avatar"
          className="feedback-avatar w-10 h-10 sm:w-12 sm:h-12 rounded-full border"
        />
        <span className="feedback-username flex items-center gap-2 font-medium text-sm sm:text-base">
          <FaGithub className="inline-icon" /> {user.user_metadata.user_name}
        </span>
      </div>

      {/* Textarea */}
      <div className="feedback-textarea-container flex items-start gap-2 w-full">
        <FiEdit className="feedback-icon mt-2 shrink-0 text-gray-500 dark:text-gray-400" />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="feedback-textarea flex-1 resize-y border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          placeholder="Write your feedback..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="feedback-btn submit-btn px-5 py-2 rounded-lg border font-medium text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>

    {/* Toast Notification */}
    {toast && (
      <div
        className={`feedback-toast fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white text-sm sm:text-base transition-transform duration-500 ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <div className="flex items-center gap-2">
          {toast.type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
          <span>{toast.msg}</span>
        </div>
      </div>
    )}
  </div>
);

}
