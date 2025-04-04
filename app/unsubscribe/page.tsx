"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function UnsubscribePage() {
  const [loading, setLoading] = useState(true);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentlySubscribed, setCurrentlySubscribed] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  // Fetch current subscription status when page loads
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchReminderSettings();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const fetchReminderSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/reminder-settings");

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const settings = await response.json();

      // Check if user is currently subscribed
      setCurrentlySubscribed(settings?.enabled || false);
    } catch (err) {
      console.error("Error fetching reminder settings:", err);
      setError("Failed to load your current subscription status.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setUnsubscribing(true);
      setError(null);

      // Use the existing endpoint to update reminder settings
      const response = await fetch("/api/user/reminder-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: false,
          // Keep the existing time and timezone
          time: "09:00", // Default if not set
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to unsubscribe");
      }

      setSuccess(true);
      setCurrentlySubscribed(false);
    } catch (err) {
      console.error("Error unsubscribing:", err);
      setError("Failed to unsubscribe. Please try again or contact support.");
    } finally {
      setUnsubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Notification Settings</CardTitle>
          <CardDescription>
            Manage your daily reminder preferences
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isSignedIn ? (
            <p className="text-center">
              Please sign in to manage your notification settings.
              <div className="mt-4">
                <Button onClick={() => (window.location.href = "/sign-in")}>
                  Sign In
                </Button>
              </div>
            </p>
          ) : currentlySubscribed ? (
            <div className="space-y-4">
              <p>
                You are currently receiving daily reminder emails. Would you
                like to unsubscribe?
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {success ? (
                <div className="rounded-lg bg-green-50 p-4 text-green-800">
                  <p className="font-medium">Successfully unsubscribed</p>
                  <p className="text-sm">
                    You will no longer receive daily reminder emails.
                  </p>
                </div>
              ) : (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleUnsubscribe}
                  disabled={unsubscribing}
                >
                  {unsubscribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Unsubscribe from Reminders"
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
              <p className="font-medium">You are not subscribed to reminders</p>
              <p className="text-sm mt-1">
                You are currently not receiving any reminder emails.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => (window.location.href = "/settings")}
              >
                Manage All Settings
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-center text-xs text-muted-foreground">
            If you need help, please contact{" "}
            <a
              href="mailto:support@nicely.tech"
              className="text-primary underline"
            >
              support@nicely.tech
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
