// pages/settings.js
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTheme } from "next-themes";
import { FiGithub, FiLogOut, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import previewLight from "/public/preview-light.png";
import previewDark from "/public/preview-dark.png";

const DEFAULT_SETTINGS = {
  theme: "system",
  cookieConsent: true,
  saveTheme: true,
};

function snakeToCamel(row = {}) {
  return {
    theme: row.theme ?? DEFAULT_SETTINGS.theme,
    cookieConsent: row.cookie_consent ?? DEFAULT_SETTINGS.cookieConsent,
    saveTheme: row.save_theme ?? DEFAULT_SETTINGS.saveTheme,
  };
}

function camelToSnake(obj = {}) {
  return {
    user_id: obj.user_id,
    theme: obj.theme,
    cookie_consent: obj.cookieConsent,
    save_theme: obj.saveTheme,
  };
}

export default function SettingsPage() {
  const { theme: appTheme, setTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      setLoading(true);
      const { data: userRes } = await supabase.auth.getUser();
      const currentUser = userRes?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: row } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        const loadedSettings = row ? snakeToCamel(row) : DEFAULT_SETTINGS;
        setSettings(loadedSettings);

        if (mountedRef.current && loadedSettings.saveTheme) {
          setTheme(loadedSettings.theme);
        }
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mountedRef.current = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, [setTheme]);

  const showToast = (type, message, ms = 3000) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), ms);
  };

  const handleSave = async () => {
    if (!user) return showToast("error", "Sign in to save settings.");

    setSaving(true);
    const payload = camelToSnake({ user_id: user.id, ...settings });

    const { data, error } = await supabase
      .from("user_settings")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Save error:", error);
      showToast("error", "Failed to save settings.");
    } else {
      setSettings(snakeToCamel(data));
      showToast("success", "Settings saved!");
    }

    setSaving(false);
  };

  const handleChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };

      // Apply live preview immediately
      if (key === "theme") {
        setTheme(value);
      }

      return updated;
    });
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "github" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSettings(DEFAULT_SETTINGS);
    showToast("success", "Logged out");
  };

  if (loading) return <div className="text-center py-10">Loading…</div>;

  if (!user)
    return (
      <div className="max-w-md mx-auto p-6 border rounded bg-neutral-50 dark:bg-neutral-800">
        <p className="mb-4">Sign in with GitHub to manage your settings.</p>
        <button
          onClick={handleLogin}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded"
        >
          <FiGithub /> Continue with GitHub
        </button>
      </div>
    );

  const previewImage =
    settings.theme === "dark"
      ? previewDark
      : settings.theme === "light"
      ? previewLight
      : appTheme === "dark"
      ? previewDark
      : previewLight;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-4 p-4 rounded bg-neutral-50 dark:bg-neutral-900 shadow-sm">
        <img
          src={user.user_metadata?.avatar_url}
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            <span className="text-sm text-gray-500">Logged in as</span> <br/>{user.user_metadata?.user_name || "User"}
          </h2>
          <p className="text-sm text-gray-500">
            ID: <span className="font-mono">{user.id}</span>
          </p>
        </div>
      </div>

      {/* Settings + Preview Side by Side */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Panel */}
        <div className="flex-1 p-4 rounded bg-neutral-50 dark:bg-neutral-800 space-y-4">
          {/* Theme Select */}
          <label className="flex items-center justify-between">
            <span>Theme</span>
            <select
              value={settings.theme}
              onChange={handleChange("theme")}
              className="p-2 border rounded cursor-pointer"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>

          {/* Remember Theme */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.saveTheme}
              onChange={handleChange("saveTheme")}
            />
             Remember theme <span className="text-red-600 text-sm font-semibold"> (Prevents theme change)</span>
          </label>

          {/* Cookies */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.cookieConsent}
              onChange={handleChange("cookieConsent")}
            />
            <span>Allow cookies</span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded text-white cursor-pointer ${
                saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 cursor-pointer"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 p-4 rounded bg-neutral-50 dark:bg-neutral-900 shadow-sm text-center">
          <h3 className="font-semibold mb-2">Home Page Preview</h3>
          <Image
            src={previewImage}
            alt="Home page preview"
            className="rounded mx-auto"
            width={600}
            height={350}
            objectFit="contain"
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 p-3 rounded shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white flex items-center gap-2`}
        >
          {toast.type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
