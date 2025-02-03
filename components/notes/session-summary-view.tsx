"use client";

import { motion } from "framer-motion";
import type { SessionSummary } from "@/models/session-summary";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const InsightCard = ({
  summary,
  excerpt,
}: {
  summary: string;
  excerpt: string;
}) => (
  <div className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary/50 transition-colors">
    <p className="font-medium mb-3 text-lg">{summary}</p>
    <p className="text-sm text-muted-foreground italic leading-relaxed">
      &ldquo;{excerpt}&rdquo;
    </p>
  </div>
);

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
            {summary.created_at.toLocaleDateString(undefined, {
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
            <InsightCard key={i} summary={rec.summary} excerpt={rec.excerpt} />
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
