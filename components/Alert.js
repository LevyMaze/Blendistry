import { useEffect } from "react";
import { X } from "lucide-react";

export default function Alert({ type = "info", message, onClose }) {
  // Auto close after 3s
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: "border-green-400 text-green-400",
    error: "border-red-400 text-red-400",
    warning: "border-yellow-400 text-yellow-400",
    info: "border-blue-400 text-blue-400",
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 border px-4 py-3 rounded-lg shadow-lg transition-all duration-500 animate-fade-in-out ${
        styles[type]
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-xl leading-none opacity-70 hover:opacity-100 rounded border-red-500 text-red-500 text-sm bg-red-500 cursor-pointer"
        >
          <X className="w-4 h-4" size={8}/>
        </button>
      </div>
    </div>
  );
}
