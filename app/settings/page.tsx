"use client";

import { SettingsContent } from "@/components/settings-dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10 max-w-md">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <SettingsContent />
      </div>
    </div>
  );
}
