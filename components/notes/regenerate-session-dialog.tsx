import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegenerateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isRegenerating: boolean;
}

export function RegenerateSessionDialog({
  open,
  onOpenChange,
  onConfirm,
  isRegenerating,
}: RegenerateSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Regenerate Session Summary</DialogTitle>
          <DialogDescription>
            This will create a new summary of your session. The current summary
            will be replaced.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isRegenerating}
          >
            {isRegenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
