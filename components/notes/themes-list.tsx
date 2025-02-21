"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, TrendingUpIcon, RepeatIcon, Flame, ChevronDown, ChevronUp, CheckCircle2, ChevronRight, ShieldIcon } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  relevance: string;
  benefits: string;
  howTo: string;
  completed: boolean;
}

interface ThemeCard {
  id: string;
  title: string;
  description: string;
  streak: number;
  todos: TodoItem[];
}

export default function ThemesList() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [themes, setThemes] = useState<ThemeCard[]>([
    {
      id: "1",
      title: "Managing Anxiety and Stress",
      description: '"My heart races before meetings and I cannot focus, wishing for better tools to handle these moments."',
      streak: 3,
      todos: [
        {
          id: "t1",
          title: "Progressive Muscle Relaxation",
          description: "A systematic technique to reduce physical tension and break the anxiety cycle by tensing and relaxing different muscle groups.",
          howTo: "1. Find a quiet, comfortable place to sit or lie down\n2. Start with your toes, tense them for 5 seconds\n3. Release and notice the feeling of relaxation for 10 seconds\n4. Move up through each muscle group (feet, legs, abdomen, arms, face)\n5. Practice for 10-15 minutes total",
          relevance: "During our last session, you mentioned experiencing physical tension, especially in your shoulders and jaw. This technique will help you recognize and release tension before it builds up.",
          benefits: "Reduces muscle tension, lowers overall stress levels, improves body awareness, and provides a practical tool for managing anxiety in the moment.",
          completed: false
        },
        {
          id: "t2",
          title: "3-3-3 Grounding Exercise",
          description: "A quick mindfulness technique to break anxiety spirals by engaging your senses and returning to the present moment.",
          howTo: "1. Name 3 things you can see\n2. Name 3 things you can hear\n3. Move 3 parts of your body\n4. Take a deep breath after each step\n5. Notice how you feel more centered",
          relevance: "You've described feeling overwhelmed in meetings and social situations. This quick exercise can help you regain focus without others noticing.",
          benefits: "Interrupts anxiety cycles, brings attention to the present moment, can be done anywhere without drawing attention, and helps regain mental clarity.",
          completed: false
        },
        {
          id: "t3",
          title: "Worry Time Scheduling",
          description: "Designate specific times for addressing worries to prevent them from consuming your entire day.",
          howTo: "1. Set aside 15-20 minutes daily at a consistent time\n2. When worries arise, note them down\n3. During worry time, review and problem-solve\n4. Outside worry time, remind yourself to postpone worrying\n5. Keep a small notebook for capturing thoughts",
          relevance: "We discussed how racing thoughts affect your sleep and productivity. This structured approach helps contain worry without suppressing it.",
          benefits: "Reduces the impact of worry on daily life, improves productivity, better sleep quality, and develops healthier worry management habits.",
          completed: false
        }
      ]
    },
    {
      id: "2",
      title: "Building Self-Compassion",
      description: '"When others make mistakes I understand, but with myself I am too harsh."',
      streak: 5,
      todos: [
        {
          id: "t4",
          title: "Self-Compassion Letter Writing",
          description: "Write a letter to yourself from the perspective of a caring friend, addressing a current challenge or self-criticism.",
          howTo: "1. Choose a specific situation causing self-criticism\n2. Write as if you're addressing a dear friend\n3. Acknowledge the pain or difficulty\n4. Offer understanding and kindness\n5. Suggest gentle ways forward",
          relevance: "Your inner critic has been particularly loud lately, especially regarding work performance. This exercise helps develop a more balanced, compassionate inner voice.",
          benefits: "Reduces harsh self-judgment, develops emotional resilience, improves self-worth, and creates healthier self-talk patterns.",
          completed: false
        },
        {
          id: "t5",
          title: "Daily Compassion Break",
          description: "Take brief moments throughout the day to practice the three components of self-compassion: mindfulness, common humanity, and self-kindness.",
          howTo: "1. Notice when you're struggling (mindfulness)\n2. Remember others also face similar challenges (common humanity)\n3. Offer yourself a kind phrase or gesture\n4. Take three deep breaths\n5. Continue your day with gentleness",
          relevance: "This builds on our discussions about feeling isolated in your struggles. The practice helps you feel more connected while building self-compassion.",
          benefits: "Increases emotional resilience, reduces feelings of isolation, improves stress management, and builds a more positive relationship with yourself.",
          completed: true
        }
      ]
    },
    {
      id: "3",
      title: "Improving Sleep Habits",
      description: '"My body feels tired but my mind refuses to quiet down at night."',
      streak: 2,
      todos: [
        {
          id: "t6",
          title: "Evening Wind-Down Routine",
          description: "Create a calming pre-sleep routine to signal your body it's time to rest.",
          howTo: "1. Start 1 hour before bedtime\n2. Dim lights and reduce blue light exposure\n3. Do gentle stretching or reading\n4. Practice 5 minutes of deep breathing\n5. Keep your bedroom cool and dark",
          relevance: "Your sleep patterns have been irregular, affecting your daily energy. This structured routine will help regulate your circadian rhythm.",
          benefits: "Improves sleep quality, reduces time to fall asleep, increases daytime energy, and helps maintain consistent sleep schedule.",
          completed: false
        },
        {
          id: "t7",
          title: "Sleep Thought Journal",
          description: "Address nighttime worry patterns by logging thoughts before bed.",
          howTo: "1. Keep a journal by your bed\n2. Write down any worrying thoughts\n3. Note potential solutions or next steps\n4. Close the journal as a symbol of setting aside concerns\n5. Focus on restful breathing",
          relevance: "Night-time anxiety has been disrupting your sleep. This technique helps clear your mind before bed.",
          benefits: "Reduces bedtime anxiety, prevents racing thoughts, improves sleep quality, and provides action steps for tomorrow.",
          completed: true
        }
      ]
    },
    {
      id: "4",
      title: "Building Healthy Boundaries",
      description: '"I keep saying yes to everything, even while feeling overwhelmed."',
      streak: 4,
      todos: [
        {
          id: "t8",
          title: "Boundary Check-In Practice",
          description: "Regular assessment of your emotional and physical boundaries in different situations.",
          howTo: "1. Identify situations where you feel drained\n2. Notice physical and emotional responses\n3. Write down your ideal boundaries\n4. Practice saying no when needed\n5. Validate your right to have boundaries",
          relevance: "You've mentioned feeling overwhelmed by others' demands. This practice helps you recognize and honor your limits.",
          benefits: "Increases self-respect, reduces emotional exhaustion, improves relationships, and enhances work-life balance.",
          completed: false
        },
        {
          id: "t9",
          title: "Assertive Communication Script",
          description: "Develop and practice clear, assertive responses for common boundary challenges.",
          howTo: "1. Identify a boundary situation\n2. Write out your feelings and needs\n3. Create a clear, firm response\n4. Practice delivery in a mirror\n5. Use 'I' statements and stay calm",
          relevance: "This builds on our discussion about difficulty saying no to extra work projects.",
          benefits: "Improves confidence in setting boundaries, reduces anxiety about confrontation, maintains professional relationships.",
          completed: false
        }
      ]
    },
    {
      id: "5",
      title: "Processing Grief and Loss",
      description: '"The memories still feel fresh, as if everything happened just yesterday."',
      streak: 7,
      todos: [
        {
          id: "t10",
          title: "Memory Journal Practice",
          description: "Create a safe space to explore and honor memories of your loss.",
          howTo: "1. Set aside quiet time each day\n2. Write about a specific memory\n3. Express associated emotions freely\n4. Include photos or mementos if helpful\n5. Close with a gratitude statement",
          relevance: "As we've discussed your recent loss, this provides a structured way to process emotions and preserve memories.",
          benefits: "Facilitates healthy grieving, preserves important memories, reduces emotional suppression, promotes healing.",
          completed: true
        },
        {
          id: "t11",
          title: "Grief Check-In Meditation",
          description: "A gentle meditation practice for acknowledging and sitting with grief emotions.",
          howTo: "1. Find a quiet, comfortable space\n2. Focus on your breath for 2 minutes\n3. Notice any emotions present\n4. Allow feelings without judgment\n5. Close with self-compassion phrase",
          relevance: "This helps address the waves of grief you've described experiencing throughout the day.",
          benefits: "Develops emotional awareness, reduces anxiety about grief, builds resilience, promotes self-compassion.",
          completed: false
        }
      ]
    }
  ]);

  const toggleTodoComplete = (themeId: string, todoId: string) => {
    setThemes(themes.map(theme => {
      if (theme.id === themeId) {
        return {
          ...theme,
          todos: theme.todos.map(todo => 
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
          ).sort((a, b) => {
            // Move completed items to the bottom
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
          })
        };
      }
      return theme;
    }));
  };

  const handleDescriptionClick = (themeId: string) => {
    // Placeholder navigation function
    console.log(`Navigating to session summary for theme ${themeId}`);
    // You can implement actual navigation later
    // router.push(`/sessions/summary/${themeId}`);
  };

  return (
    <div className="relative w-full space-y-4 sm:space-y-6">
      <div className="overflow-x-auto pb-4 sm:pb-6">
        <div className="flex gap-3 sm:gap-6 min-w-full px-2 sm:px-4 pt-1">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -2,
                transition: { duration: 0.2 }
              }}
              transition={{ duration: 0.2 }}
              className="w-[280px] sm:w-[350px] md:w-[400px] flex-shrink-0"
            >
              <Card className={cn(
                "overflow-visible relative",
                "bg-gradient-to-br from-card to-card/95",
                "border-primary/10",
                "transition-all duration-300",
                "shadow-md hover:shadow-xl",
                "hover:border-primary/20",
                "hover:bg-card/95"
              )}>
                <div className="relative p-4 sm:p-6">
                  {/* Streak Badge */}
                  <div className={cn(
                    "absolute top-2 sm:top-3 left-4 sm:left-6 border rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] sm:text-xs shadow-sm",
                    theme.streak >= 5 
                      ? "bg-white border-white text-black"
                      : "bg-muted border-border text-muted-foreground"
                  )}>
                    <Flame className={cn(
                      "h-2.5 w-2.5 sm:h-3 sm:w-3",
                      theme.streak >= 5 ? "text-orange-500" : "text-muted-foreground"
                    )} />
                    <span className="font-medium">{theme.streak}d streak</span>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                    <div>
                      <h3 className="text-base sm:text-xl font-semibold tracking-tight">{theme.title}</h3>
                      <button
                        onClick={() => handleDescriptionClick(theme.id)}
                        className={cn(
                          "mt-1 sm:mt-2 text-sm text-muted-foreground",
                          "hover:text-primary transition-colors duration-200",
                          "cursor-pointer text-left w-full",
                          "group flex items-center gap-1"
                        )}
                      >
                        <span className="group-hover:underline">
                          {theme.description}
                        </span>
                        <ChevronRight 
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                        />
                      </button>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-muted/50 rounded-xl p-3 sm:p-4">
                        <div className="mb-2 sm:mb-3">
                          <h4 className="text-xs sm:text-sm font-medium">Daily Challenges</h4>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          {theme.todos.map((todo) => (
                            <div
                              key={todo.id}
                              className={cn(
                                "flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all group",
                                todo.completed ? 
                                  "bg-primary/5 text-muted-foreground" : 
                                  "bg-background hover:bg-primary/5"
                              )}
                            >
                              <div 
                                className="cursor-pointer mt-0.5"
                                onClick={() => toggleTodoComplete(theme.id, todo.id)}
                              >
                                <CheckCircle2 
                                  className={cn(
                                    "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                                    todo.completed ? "text-primary" : "text-muted-foreground/30 group-hover:text-muted-foreground/50"
                                  )}
                                />
                              </div>
                              <div className="flex-1">
                                <button
                                  onClick={() => setOpenDialog(todo.id)}
                                  className={cn(
                                    "text-left text-xs sm:text-sm w-full transition-all",
                                    "hover:text-primary hover:font-medium",
                                    todo.completed ? "line-through" : "hover:translate-x-0.5"
                                  )}
                                >
                                  {todo.title}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto px-3 sm:px-4"
      >
        <div className="relative">
          <div className="relative px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-primary/5 bg-muted/30">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <ShieldIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary/50" />
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                Your Privacy is Our Priority
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-relaxed">
              We never share or sell your information beyond our app&apos;s
              purpose. Conversations remain confidential, just like therapy,
              and are never used to train our models.
            </p>
            <Button
              variant="link"
              className="text-[11px] sm:text-xs text-primary/50 hover:text-primary mt-1 h-auto p-0"
              onClick={() => setIsSettingsOpen(true)}
            >
              View Privacy Settings →
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Todo Detail Dialog */}
      {openDialog && (
        <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="flex flex-row items-center justify-between pr-8">
              <DialogTitle className="text-xl">
                {themes.find(theme => 
                  theme.todos.some(todo => todo.id === openDialog)
                )?.todos.find(todo => todo.id === openDialog)?.title}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary/10"
                asChild
              >
                <Link href={`/between-sessions?topic=${encodeURIComponent(`Help me with: ${
                  themes.find(theme => 
                    theme.todos.some(todo => todo.id === openDialog)
                  )?.todos.find(todo => todo.id === openDialog)?.title
                }`)}`}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Discuss</span>
                </Link>
              </Button>
            </DialogHeader>
            <div className="space-y-6">
              {/* How To Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-lg">How to do this exercise:</h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {themes.find(theme => 
                    theme.todos.some(todo => todo.id === openDialog)
                  )?.todos.find(todo => todo.id === openDialog)?.howTo}
                </p>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-lg">What is this exercise?</h4>
                <p className="text-muted-foreground">
                  {themes.find(theme => 
                    theme.todos.some(todo => todo.id === openDialog)
                  )?.todos.find(todo => todo.id === openDialog)?.description}
                </p>
              </div>

              {/* Relevance Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-lg">Why now?</h4>
                <p className="text-muted-foreground">
                  {themes.find(theme => 
                    theme.todos.some(todo => todo.id === openDialog)
                  )?.todos.find(todo => todo.id === openDialog)?.relevance}
                </p>
              </div>

              {/* Benefits Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-lg">How this will help you:</h4>
                <p className="text-muted-foreground">
                  {themes.find(theme => 
                    theme.todos.some(todo => todo.id === openDialog)
                  )?.todos.find(todo => todo.id === openDialog)?.benefits}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
