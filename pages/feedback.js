// pages/feedback.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
import Confetti from "react-confetti";

export default function Feedback() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showNotification("Please fill all fields!", "error");
      return;
    }

    setLoading(true);

    // Insert into Supabase
    const { error } = await supabase.from("feedback").insert([formData]);

    setLoading(false);

    if (error) {
      showNotification("Submission failed! Try again.", "error");
    } else {
      setFormData({ name: "", email: "", message: "" });
      showNotification("Feedback submitted! Thank you 😊", "success");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, show: true });
    setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 4000);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {showConfetti && <Confetti />}
      <h1 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
        Feedback
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg  rounded-xl p-6 sm:p-8 shadow-lg flex flex-col gap-5 transition-colors"
      >
        {/* Name */}
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-300" />
          <input
            type="text"
            name="name"
            placeholder=" "
            value={formData.name}
            onChange={handleChange}
            className="peer w-full pl-10 pr-3 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <label
            htmlFor="name"
            className="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
          >
            Name
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-300" />
          <input
            type="email"
            name="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            className="peer w-full pl-10 pr-3 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <label
            htmlFor="email"
            className="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500"
          >
            Email
          </label>
        </div>

        {/* Message */}
        <div className="relative">
          <FaCommentDots className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-300" />
          <textarea
            name="message"
            placeholder=" "
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="peer w-full pl-10 pr-3 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
          />
          <label
            htmlFor="message"
            className="absolute left-10 top-3 text-neutral-500 dark:text-neutral-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500"
          >
            Message
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Submit Feedback"
          )}
        </button>
      </form>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded shadow-lg text-white transform transition-all duration-500 ease-out ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } ${notification.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}
