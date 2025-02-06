"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { HeartIcon, SparklesIcon, NotebookIcon } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LandingPageContent() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-primary/5">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src={"/images/logo.png"}
                  alt="Nicely Logo"
                  width={140}
                  height={60}
                  className="h-10 w-auto"
                  priority
                />
              </Link>

              {/* Sign Up Button */}
              <SignInButton mode="modal">
                <Button
                  className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90 text-white"
                >
                  Sign Up Today
                </Button>
              </SignInButton>
            </div>
          </div>
        </nav>

        {/* Add padding to account for fixed navbar */}
        <div className="pt-16">
          <div className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Hero Section */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-16 items-center relative">
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Purple arc */}
                <motion.div 
                  className="absolute top-20 right-40 w-32 h-32 border-4 border-primary/30 rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
                {/* Yellow star */}
                <motion.div 
                  className="absolute top-10 right-20 text-amber-400 text-2xl"
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  ✦
                </motion.div>
                {/* Circle */}
                <motion.div 
                  className="absolute bottom-20 left-10 w-16 h-16 bg-amber-400/20 rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                />
              </div>

              {/* Text Content */}
              <motion.div
                className="text-left space-y-5 sm:space-y-6 flex flex-col items-start justify-center lg:pl-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900">
                  Everything your<br />
                  <span className="text-primary">therapy journey</span><br />
                  needs
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-xl">
                  Feel like your best self with organized therapy notes, between-session insights, and self-care exercises.
                </p>
                
                <motion.div
                  className="pt-2 sm:pt-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <SignInButton mode="modal" signUpForceRedirectUrl="/sign-in-success">
                    <Button
                      size="lg"
                      className="px-8 py-6 text-lg rounded-full w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      Try 14 days free
                    </Button>
                  </SignInButton>
                </motion.div>
              </motion.div>

              {/* Phone Image with Decorative Elements */}
              <motion.div
                className="relative w-full max-w-md mx-auto lg:max-w-none"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {/* Decorative chat bubble */}
                <motion.div
                  className="absolute -left-16 bottom-20 w-12 h-12 bg-blue-500/20 rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
                
                <div className="relative w-full aspect-[9/19] max-w-[300px] mx-auto transform -rotate-[5deg] hover:-rotate-[7deg] transition-transform duration-300">
                  {/* iPhone Frame */}
                  <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-[0_0_60px_rgba(0,0,0,0.1)] border-[12px] border-white">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-white rounded-b-3xl"></div>
                  </div>
                  {/* Screen Content */}
                  <div className="absolute inset-[12px] rounded-[1.8rem] overflow-hidden bg-white border border-gray-200">
                    <div className="relative w-full h-full transform origin-top">
                      <Image
                        src="/images/chat-preview.png"
                        alt="Therapy chat interface preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 300px) 100vw, 300px"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Orange smiley */}
                <motion.div
                  className="absolute -right-10 top-20 w-16 h-16 bg-amber-500/20 rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                />
              </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 max-w-lg lg:max-w-6xl mx-auto w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <FeatureCard
                icon={<SparklesIcon className="text-primary" size={22} />}
                title="Between Session Thoughts"
                description="Quickly record what's happening to help plan your next session"
              />
              <FeatureCard
                icon={<HeartIcon size={22} />}
                title="Daily Self-Care"
                description="Easier and interactive conversations to complete homeworks exercises."
              />
              <FeatureCard
                icon={<NotebookIcon size={22} />}
                title="Session Notes"
                description="Effortlessly summarize key points and action items from last session"
              />
            </motion.div>

            {/* Testimonials Section */}
            <motion.div
              className="w-full max-w-6xl mx-auto px-4 py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                What our users say
              </h2>
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="md:translate-y-8"
                >
                  <TestimonialCard
                    name="Sarah M."
                    review="Nicely has been a game-changer for my mental health journey. It helps me maintain the progress I make in therapy."
                    highlight
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TestimonialCard
                    name="James R."
                    review="The daily check-ins and guided reflections have helped me stay consistent with my mental health practices."
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:translate-y-12"
                >
                  <TestimonialCard
                    name="Emily L."
                    review="Having Nicely as a companion between therapy sessions gives me the confidence to tackle challenges on my own."
                  />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Collaborators Section */}
            <motion.div
              className="w-full max-w-lg lg:max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Built by Collaborators From
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-center justify-items-center">
                <UniversityLogo 
                  name="UPenn" 
                  image={"/images/upenn.png"}
                  width={400}
                  height={150}
                />
                <UniversityLogo 
                  name="Columbia" 
                  image={"/images/columbia.png"}
                  width={400}
                  height={150}
                />
                <UniversityLogo 
                  name="Vanderbilt" 
                  image={"/images/vanderbilt.png"}
                  width={400}
                  height={150}
                />
                <UniversityLogo 
                  name="Northwestern" 
                  image={"/images/northwestern.png"}
                  width={400}
                  height={150}
                />
              </div>
            </motion.div>

            {/* Why Nicely & Commitment Section */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 px-4 py-16">
              {/* Why Nicely? Section */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Why Nicely?</h2>
                <div className="space-y-8">
                  <FeatureRow
                    title="Grounded in Research"
                    description="Built on methods that truly support progress."
                  />
                  <FeatureRow
                    title="Capture Key Moments Effortlessly"
                    description="Therapy insights are processed automatically, so nothing is missed."
                  />
                  <FeatureRow
                    title="Reminders That Fit Your Journey"
                    description="Receive gentle reminders aligned with your goals to keep you supported each day."
                  />
                  <FeatureRow
                    title="Track Your Growth, Easily"
                    description="Track your progress over time with a clear view to appreciate each step forward."
                  />
                </div>
              </motion.div>

              {/* Our Commitment Section */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Commitment</h2>
                <div className="space-y-8">
                  <FeatureRow
                    title="Data Ownership & Control"
                    description="You own your data. You remain full in control to all of your data and can choose to delete or migrate them anytime you choose."
                  />
                  <FeatureRow
                    title="Advanced Data Encryption"
                    description="All data is secured using AES encryption during transmission and at rest, providing top-tier protection against unauthorized access."
                  />
                  <FeatureRow
                    title="Automatic Audio Deletion"
                    description="Audio recordings are permanently deleted after transcription, ensuring recordings are never accessible to anyone, anytime."
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Moved outside the main container */}
      <div className="w-full bg-[#00008B] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {/* Contact Section */}
            <h2 className="text-2xl sm:text-3xl font-bold">Contact Us.</h2>
            
            {/* Contact Details */}
            <div className="space-y-1 text-sm">
              <p>New York, US</p>
              <p>tom_hu@nicely.tech</p>
              <p>(615) 931-7093</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a 
                href="https://linkedin.com/company/nicely" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
              >
                <LinkedInIcon className="size-5" />
              </a>
              <a 
                href="https://instagram.com/nicely" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
              >
                <InstagramIcon className="size-5" />
              </a>
              <a 
                href="https://twitter.com/nicely" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 transition-colors"
              >
                <TwitterIcon className="size-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="pt-2 text-white/70 text-sm">
              <p>© 2024 Nicely.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 lg:p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-base lg:text-lg">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({ 
  name, 
  review,
  highlight = false 
}: { 
  name: string; 
  review: string;
  highlight?: boolean;
}) {
  return (
    <div className="h-full group">
      <div 
        className={cn(
          "h-full p-6 lg:p-8 rounded-3xl transition-all duration-300 border",
          "hover:shadow-xl hover:-translate-y-1",
          highlight ? 
            "bg-primary/5 border-primary/20 hover:bg-primary/10" : 
            "bg-white border-gray-100 hover:border-primary/20"
        )}
      >
        <div className="space-y-5">
          <div className="relative">
            <svg
              className={cn(
                "absolute -top-3 -left-3 w-8 h-8 transform -rotate-12",
                highlight ? "text-primary" : "text-gray-300"
              )}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className={cn(
              "text-lg leading-relaxed relative",
              highlight ? "text-gray-800" : "text-gray-500"
            )}>
              "{review}"
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "size-10 rounded-full flex items-center justify-center",
              highlight ? "bg-primary/20" : "bg-primary/10"
            )}>
              <span className={cn(
                "text-base font-medium",
                highlight ? "text-primary" : "text-primary/70"
              )}>
                {name.split(' ')[0][0]}
                {name.split(' ')[1][0]}
              </span>
            </div>
            <span className="font-semibold text-lg text-gray-900">{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UniversityLogo({ 
  name, 
  image,
  width,
  height
}: { 
  name: string; 
  image: string;
  width: number;
  height: number;
}) {
  return (
    <div className="w-full h-full px-4">
      <div className="relative w-full h-[60px] flex items-center justify-center">
        <Image
          src={image}
          alt={`${name} logo`}
          width={width}
          height={height}
          className="object-contain max-h-[60px] w-auto filter grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
          style={{ 
            maxWidth: '150px',
          }}
        />
      </div>
    </div>
  );
}

function FeatureRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-primary">
        {/* Placeholder for icon - you can add your icons here later */}
        <div className="w-6 h-6 border-2 border-current rounded-full" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function LinkedInIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function InstagramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );
}
