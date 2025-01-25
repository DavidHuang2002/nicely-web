import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { GoogleAnalytics } from "@/components/google-analytics";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export const metadata = {
  title: "Nicely",
  description: "Your therapy companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // @ts-ignore
    <ClerkProvider>
      <html lang="en">
        <head>
          <GoogleAnalytics />
        </head>
        <body className={cn(GeistSans.className, "antialiased dark")}>
          <Toaster position="top-center" richColors />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
