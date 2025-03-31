import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ShieldIcon, BellIcon } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { DeleteAccountDialog } from "./delete-account-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimePickerSelectProps {
  value: string;
  onChange: (time: string) => void;
}

function TimePickerSelect({ value, onChange }: TimePickerSelectProps) {
  // Parse the current time value
  const date = new Date(`2000-01-01T${value}`);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  // Generate hours (1-12)
  const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minutes (00, 15, 30, 45)
  const minuteOptions = [0, 15, 30, 45];

  const handleTimeChange = (
    type: "hour" | "minute" | "period",
    newValue: number | string
  ) => {
    const date = new Date(`2000-01-01T${value}`);

    if (type === "hour") {
      const newHour =
        typeof newValue === "number"
          ? (newValue % 12) + (period === "PM" ? 12 : 0)
          : hours;
      date.setHours(newHour);
    } else if (type === "minute") {
      date.setMinutes(typeof newValue === "number" ? newValue : minutes);
    } else if (type === "period") {
      const currentHour = date.getHours() % 12;
      date.setHours(newValue === "PM" ? currentHour + 12 : currentHour);
    }

    const timeString = date.toTimeString().slice(0, 5);
    onChange(timeString);
  };

  return (
    <div className="flex gap-2 items-center">
      <Select
        value={displayHours.toString()}
        onValueChange={(val) => handleTimeChange("hour", parseInt(val))}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hours12.map((hour) => (
            <SelectItem key={hour} value={hour.toString()}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={minutes.toString()}
        onValueChange={(val) => handleTimeChange("minute", parseInt(val))}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent>
          {minuteOptions.map((minute) => (
            <SelectItem key={minute} value={minute.toString()}>
              {minute.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={period}
        onValueChange={(val) => handleTimeChange("period", val)}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      options.push({
        value: timeString,
        label: new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        ),
      });
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    // Try to get user's timezone, fallback to America/Chicago
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago"
    );
  });
  const { user } = useUser();

  const TIMEZONES = [
    { value: "America/New_York", label: "Eastern Time (New York)" },
    { value: "America/Chicago", label: "Central Time (Chicago)" },
    { value: "America/Denver", label: "Mountain Time (Denver)" },
    { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)" },
    { value: "Asia/Shanghai", label: "China Time (Shanghai)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("time", reminderTime);
      const response = await fetch("/api/user/reminder-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: dailyReminder,
          time: reminderTime,
          timezone: selectedTimezone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save reminder settings");
      }

      // TODO: Show success toast
    } catch (error) {
      console.error("Error saving reminder settings:", error);
      // TODO: Show error toast
    }
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
            <TabsTrigger
              value="notifications"
              className="flex gap-2 items-center"
            >
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
                  <TimePickerSelect
                    value={reminderTime}
                    onChange={setReminderTime}
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
