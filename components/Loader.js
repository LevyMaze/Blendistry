// components/Loader.js
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="flex items-center space-x-3 font-mono text-xl">
        {/* Pulsing "Loading" text synced with dots */}
        <motion.span
          className="text-blue-700 dark:text-blue-300"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading
        </motion.span>

        {/* Endless typing-style 3 dots */}
        <motion.div
          className="flex space-x-1"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
                repeat: Infinity,
              },
            },
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400"
              variants={{
                hidden: { scale: 1, opacity: 0.4 },
                visible: {
                  scale: [1, 1.6, 1],
                  opacity: [0.4, 1, 0.4],
                  transition: {
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
