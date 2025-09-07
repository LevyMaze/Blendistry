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
        username: user_metadata.user_name, // GitHub username
        avatar_url: user_metadata.avatar_url, // GitHub avatar
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
      <div className="feedback-container">
        <p className="feedback-login-text">
          Please log in with GitHub to leave feedback.
        </p>
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
          className="feedback-btn github-btn flex align-center"
        >
          <FaGithub className="btn-icon" /> Login with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-container">
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="feedback-user">
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="feedback-avatar"
          />
          <span className="feedback-username">
            <FaGithub className="inline-icon" /> {user.user_metadata.user_name}
          </span>
        </div>

        <div className="feedback-textarea-container">
          <FiEdit className="feedback-icon" />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="feedback-textarea"
            placeholder="Write your feedback..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="feedback-btn submit-btn"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {toast && (
        <div
          className={`feedback-toast ${
            toast.type === "success" ? "success" : "error"
          }`}
        >
          {toast.type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
