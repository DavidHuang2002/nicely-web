import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { TodoItemType } from "./types";

interface ChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: TodoItemType | undefined;
}

export function ChallengeDialog({
  open,
  onOpenChange,
  challenge,
}: ChallengeDialogProps) {
  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95%] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pr-8">
          <DialogTitle className="text-lg sm:text-xl">
            {challenge.title}
          </DialogTitle>
          {/* TODO: implement discuss later */}
          {/* <Button
            variant="outline"
            size="sm"
            className="hover:bg-primary/10"
            asChild
          >
            <Link
              href={`/between-sessions?topic=${encodeURIComponent(
                `Help me with: ${challenge.title}`
              )}`}
            >
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="text-xs sm:text-sm">Discuss</span>
            </Link>
          </Button> */}
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <h4 className="font-medium text-base sm:text-lg">
              How to do this exercise:
            </h4>
            <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line">
              {challenge.how_to}
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h4 className="font-medium text-base sm:text-lg">
              What is this exercise?
            </h4>
            <p className="text-sm sm:text-base text-muted-foreground">
              {challenge.description}
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h4 className="font-medium text-base sm:text-lg">Why now?</h4>
            <p className="text-sm sm:text-base text-muted-foreground">
              {challenge.reason}
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <h4 className="font-medium text-base sm:text-lg">
              How this will help you:
            </h4>
            <p className="text-sm sm:text-base text-muted-foreground">
              {challenge.benefits}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
