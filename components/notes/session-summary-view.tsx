"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SessionSummary } from "@/models/session-summary";
import {
  CalendarIcon,
  ArrowLeft,
  ChevronDownIcon,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn, generateUUID } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import InsightChat from "@/components/notes/insight-chat";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4"
  >
    <h2 className="text-xl font-semibold text-primary">{title}</h2>
    {children}
  </motion.div>
);

interface InsightCardProps {
  summary: string;
  excerpt: string;
  detail: string;
}

const InsightCard = ({ summary, excerpt, detail }: InsightCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="rounded-xl border border-border bg-card/50 hover:border-primary/50 transition-colors">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium text-lg">{summary}</p>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/insight/${generateUUID()}?summary=${encodeURIComponent(
                        summary
                      )}&excerpt=${encodeURIComponent(
                        excerpt
                      )}&detail=${encodeURIComponent(detail)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 mt-0.5"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Explore this insight with AI assistance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 mt-0.5"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic leading-relaxed mt-3">
            &ldquo;{excerpt}&rdquo;
          </p>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-border/50">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {detail}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{summary}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Let&apos;s explore this insight further together.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <InsightChat
              insight={{
                summary,
                excerpt,
                detail,
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export function SessionSummaryView({ summary }: { summary: SessionSummary }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <Link href="/notes">
        <Button variant="ghost" className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Session Notes
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-6 pb-6 border-b">
        <div className="flex items-center gap-2 text-primary">
          <CalendarIcon className="h-5 w-5" />
          <time className="text-lg">
            {summary.session_date.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="text-4xl font-bold">{summary.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {summary.one_line_summary}
        </p>
      </div>

      {/* Action Steps */}
      <Section title="Action Steps">
        <div className="grid grid-cols-1 gap-4">
          {summary.recommendations.map((rec, i) => (
            <InsightCard
              key={i}
              summary={rec.summary}
              excerpt={rec.excerpt}
              detail={rec.detail}
            />
          ))}
        </div>
      </Section>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Therapist Insights */}
        <Section title="Therapist Insights">
          <div className="space-y-4">
            {summary.therapist_insights.map((insight, i) => (
              <InsightCard
                key={i}
                summary={insight.summary}
                excerpt={insight.excerpt}
                detail={insight.detail}
              />
            ))}
          </div>
        </Section>

        {/* Client Learnings */}
        <Section title="Your Discoveries">
          <div className="space-y-4">
            {summary.client_learnings.map((learning, i) => (
              <InsightCard
                key={i}
                summary={learning.summary}
                excerpt={learning.excerpt}
                detail={learning.detail}
              />
            ))}
          </div>
        </Section>
      </div>

      {/* Full Recap */}
      <Section title="Session Overview">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {summary.full_recap}
          </p>
        </div>
      </Section>
    </div>
  );
}
