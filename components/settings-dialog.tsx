import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ShieldIcon, BellIcon } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { DeleteAccountDialog } from "./delete-account-dialog";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user } = useUser();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="privacy" className="flex gap-2 items-center">
              <ShieldIcon className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              <BellIcon className="h-4 w-4" />
              Notifications
              <span className="ml-1.5 text-[10px] text-muted-foreground">
                (Soon)
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous usage data to improve our service
                  </p>
                </div>
                <Switch />
              </div>

              <div className="pt-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    We never share or sell your information beyond our
                    app&apos;s purpose. Conversations remain confidential, just
                    like therapy, and are never used to train our models.
                  </p>
                </div>

                <div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete My Data
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This will permanently delete all your data from our servers
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        userEmail={user?.emailAddresses[0]?.emailAddress || ""}
      />
    </Dialog>
  );
}
