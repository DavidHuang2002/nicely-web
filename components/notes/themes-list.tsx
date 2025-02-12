"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TrendingUpIcon, RepeatIcon } from "lucide-react";

interface Theme {
  id: string;
  title: string;
  description: string;
  type: "recurring" | "emerging";
  lastSessionDate: string;
  mentionCount: number;
  sessions: {
    date: string;
    id: string;
  }[];
}

export default function ThemesList() {
  // This will be replaced with actual data from your backend
  const themes: Theme[] = [
    {
      id: "1",
      title: "Anxiety Management",
      description:
        "Exploring triggers, coping strategies, and progress in managing anxiety",
      type: "recurring",
      lastSessionDate: "2024-03-15",
      mentionCount: 8,
      sessions: [
        { date: "2024-03-15", id: "session1" },
        { date: "2024-02-28", id: "session2" },
      ],
    },
    {
      id: "2",
      title: "Work-Life Balance",
      description:
        "New discussions about setting boundaries and managing professional stress",
      type: "emerging",
      lastSessionDate: "2024-03-10",
      mentionCount: 2,
      sessions: [{ date: "2024-03-10", id: "session3" }],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Therapy Themes</h2>
        <p className="text-sm text-muted-foreground">
          Patterns and insights emerging from your therapy journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          // <Link href={`/notes/themes/${theme.id}`} key={theme.id}>
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.02 }}
              className="h-[280px] p-5 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors flex flex-col"
            >
              <Badge
                variant={theme.type === "recurring" ? "default" : "secondary"}
                className="w-fit mb-4"
              >
                {theme.type === "recurring" ? (
                  <RepeatIcon className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingUpIcon className="mr-1 h-3 w-3" />
                )}
                {theme.type === "recurring" ? "Recurring" : "Emerging"}
              </Badge>

              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">{theme.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {theme.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{theme.mentionCount} mentions</span>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {new Date(theme.lastSessionDate).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          // </Link>
        ))}
      </div>
    </div>
  );
}
