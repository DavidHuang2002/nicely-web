import { Button } from "../ui/button";
import { Message, CreateMessage } from "ai";
import { motion } from "framer-motion";
import { createAIMessage } from "@/lib/utils";
import { ChatRequestOptions } from "ai";
import { SparklesIcon } from "lucide-react";

interface InitialOptionsButtonsProps {
  options: string[];
  customAppend: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

export function InitialOptionsButtons({
  options,
  customAppend,
}: InitialOptionsButtonsProps) {
  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-muted rounded-xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="h-5 w-5 text-primary" />
          <h3 className="font-medium">How would you like to proceed?</h3>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={(event) => {
                  event.preventDefault();
                  customAppend(createAIMessage(option, "user"));
                }}
              >
                <span className="text-sm">{option}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
