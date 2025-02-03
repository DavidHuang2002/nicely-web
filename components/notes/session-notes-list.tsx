"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SessionNotesList() {
  return (
    <div className="grid gap-4">
      {/* We'll populate this with actual session data later */}
      <Link href="/notes/1">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
        >
          <p className="text-sm text-muted-foreground">March 15, 2024</p>
          <h3 className="text-lg font-medium mt-1">Weekly Check-in</h3>
          <p className="text-muted-foreground mt-2">
            Discussed anxiety management techniques and set goals for the
            week...
          </p>
        </motion.div>
      </Link>
    </div>
  );
}
