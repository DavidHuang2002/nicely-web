import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ShieldIcon, BellIcon } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DeleteAccountDialog } from "./delete-account-dialog";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    // Try to get user's timezone, fallback to America/Chicago
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
  });
  const { user } = useUser();

  const TIMEZONES = [
    { value: 'America/New_York', label: 'Eastern Time (New York)' },
    { value: 'America/Chicago', label: 'Central Time (Chicago)' },
    { value: 'America/Denver', label: 'Mountain Time (Denver)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
    { value: 'Asia/Shanghai', label: 'China Time (Shanghai)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle saving reminder settings
    console.log({
      dailyReminder,
      reminderTime,
      selectedTimezone
    });
  };

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
            <TabsTrigger value="notifications" className="flex gap-2 items-center">
              <BellIcon className="h-4 w-4" />
              Notifications
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

          <TabsContent value="notifications" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Send Daily Reminder</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily notifications for your activities
                  </p>
                </div>
                <Switch 
                  checked={dailyReminder}
                  onCheckedChange={setDailyReminder}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">
                    Time Zone<span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="timezone"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    required
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminderTime">
                    Reminder Time<span className="text-red-500">*</span>
                  </Label>
                  <input
                    type="time"
                    id="reminderTime"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-6">
                  Save Reminder Settings
                </Button>
              </div>
            </form>
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
