import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ShieldIcon, BellIcon, UserIcon } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="privacy" className="flex gap-2 items-center">
              <ShieldIcon className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellIcon className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account">
              <UserIcon className="h-4 w-4" />
              Account
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

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Conversation History</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep chat history for personalized support
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  We never share or sell your information beyond our app&apos;s
                  purpose. Conversations remain confidential, just like therapy,
                  and are never used to train our models.
                </p>
                <Button variant="outline" className="w-full">
                  Export My Data
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Add other tabs content as needed */}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
