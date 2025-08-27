// components/Loader.js
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <motion.div
        className="w-16 h-16 border-4 border-t-4 border-neutral-300 dark:border-neutral-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
