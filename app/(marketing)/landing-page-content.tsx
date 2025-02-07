"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  HeartIcon,
  SparklesIcon as SparklesIconMarketing,
  NotebookIcon,
  QuoteIcon,
} from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function LandingPageContent() {
  return (
    <>
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
      <div className="min-h-screen bg-[#F5F5F5]">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-gray-100">
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
                  className="rounded-full px-6 py-2 text-white"
                  style={{
                    backgroundColor: "#1A1CD7",
                    ["--hover-color" as string]: "#4F46E5",
                  }}
                >
                  Sign Up Today
                </Button>
              </SignInButton>
            </div>
          </div>
        </nav>

        {/* Add padding to account for fixed navbar */}
        <div className="pt-8">
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
                className="text-left space-y-5 sm:space-y-6 flex flex-col items-start justify-center lg:pl-13"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-[55px] sm:text-[65px] lg:text-[71px] font-bold leading-tight tracking-tight text-gray-900">
                  Everything your
                  <br />
                  <span className="text-[#6559D4]">therapy journey</span>
                  <br />
                  needs
                </h1>
                <p className="text-base sm:text-xl text-gray-700 leading-relaxed max-w-xl">
                  Make real progress in therapy by remember key insights, track
                  your growth, and stay engaged between sessions.
                </p>

                <motion.div
                  className="pt-2 sm:pt-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <SignInButton
                    mode="modal"
                    signUpForceRedirectUrl="/sign-in-success"
                  >
                    <Button
                      size="lg"
                      className="px-8 py-6 text-lg rounded-full w-full sm:w-auto text-white bg-[#FFC13B] hover:bg-[#E6A82F] transition-colors"
                    >
                      Join now, completely free
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
              {/* Title Section */}
              <div className="lg:col-span-3 text-center mt-20">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  How Nicely Works
                </h2>
              </div>

              <FeatureCard
                icon={<FeatureSparklesIcon size={22} />}
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
              className="w-full max-w-7xl mx-auto px-4 py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-center mb-12 mt-12 text-black">
                Join our community today
              </h2>

              {/* Scrolling Container */}
              <div className="relative overflow-hidden">
                {/* First Row - Scrolling Left */}
                <div
                  className="flex space-x-6 mb-6"
                  style={{
                    animation: "scroll-left 30s linear infinite",
                  }}
                >
                  <TestimonialCard
                    name="@hiral.sidhu"
                    review="I just got on it and thank you sooo much for this is truly helped me"
                  />
                  <TestimonialCard
                    name="pierce"
                    review="hey! i just tried your ai model and it's sick, i already feel a little better"
                  />
                  <TestimonialCard
                    name="@_hebored_"
                    review="Naw tho this really helps"
                  />
                  <TestimonialCard
                    name="@mindful22"
                    review="Great way to track my progress"
                  />
                  <TestimonialCard
                    name="@healing_journey"
                    review="Makes therapy so much more effective"
                  />
                  <TestimonialCard
                    name="@growth_mindset"
                    review="Perfect companion between sessions"
                  />
                  <TestimonialCard
                    name="@wellness_seeker"
                    review="Exactly what I needed for my journey"
                  />
                </div>

                {/* Second Row - Scrolling Right */}
                <div
                  className="flex space-x-6"
                  style={{
                    animation: "scroll-right 30s linear infinite",
                  }}
                >
                  <TestimonialCard
                    name="@therapy_progress"
                    review="Really helps me stay on track"
                  />
                  <TestimonialCard
                    name="@mental_health_matters"
                    review="Such a supportive tool"
                  />
                  <TestimonialCard
                    name="@self_care_daily"
                    review="Changed how I approach therapy"
                  />
                  <TestimonialCard
                    name="@mindfulness_path"
                    review="Incredibly helpful features"
                  />
                  <TestimonialCard
                    name="@therapy_goals"
                    review="Makes progress tracking easy"
                  />
                  <TestimonialCard
                    name="decim033"
                    review="This would actually help my therapist"
                  />
                  <TestimonialCard
                    name="@user5"
                    review="Love how intuitive the interface is!"
                  />
                </div>
              </div>
            </motion.div>

            {/* Why Nicely & Commitment Section */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 px-4 py-16">
              {/* Why Nicely? Section */}
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-gray-900">
                  Why Nicely?
                </h2>
                <div className="space-y-6">
                  <ExpandableHighlight
                    icon={<SparklesIconMarketing size={16} />}
                    title="Capture Key Moments Effortlessly"
                    description="Therapy insights are processed automatically, so nothing is missed."
                  />
                  <ExpandableHighlight
                    icon={<BellIcon className="w-4 h-4 text-white" />}
                    title="Reminders That Fit Your Journey"
                    description="Receive gentle reminders aligned with your goals to keep you supported each day."
                  />
                  <ExpandableHighlight
                    icon={<ChartIcon className="w-4 h-4 text-white" />}
                    title="Track Your Growth, Easily"
                    description="Track your progress over time with a clear view to appreciate each step forward."
                  />
                </div>
              </div>

              {/* Our Commitment Section */}
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-gray-900">
                  Our Commitment
                </h2>
                <div className="space-y-6">
                  <ExpandableHighlight
                    icon={<ShieldIcon className="w-4 h-4 text-white" />}
                    title="Data Ownership & Control"
                    description="You remain full in control to all of your data and can choose to delete them anytime."
                  />
                  <ExpandableHighlight
                    icon={<LockIcon className="w-4 h-4 text-white" />}
                    title="Privacy-Powered AI"
                    description="We securely store data in Supabase (which is HIPAA-compliant) using a vector database, making our AI smarter and more responsive."
                  />
                  <ExpandableHighlight
                    icon={<HeartIcon size={16} />}
                    title="Built for You, Here for You"
                    description="You deserve a solution that truly works. We are here building it with you to make it happen."
                  />
                </div>
              </div>
            </div>

            {/* Collaborators Section */}
            <motion.div
              className="w-full max-w-lg lg:max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-black">
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
            {/* <div className="pt-2 text-white/70 text-sm">
              <p>© 2024 Nicely.</p>
            </div> */}
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
    <div className="flex flex-col items-center text-center p-6 lg:p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="size-14 rounded-2xl flex items-center justify-center mb-5 bg-[#6559D4]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-700 text-base lg:text-base">{description}</p>
    </div>
  );
}

function TestimonialCard({ name, review }: { name: string; review: string }) {
  return (
    <div className="flex-shrink-0 w-[300px] p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 w-5 h-5 text-gray-400">
          <QuoteIcon size={16} />
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      <p className="text-gray-700 text-sm">{review}</p>
    </div>
  );
}

function UniversityLogo({
  name,
  image,
  width,
  height,
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
            maxWidth: "150px",
          }}
        />
      </div>
    </div>
  );
}

function ExpandableHighlight({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full">
        <div className="flex items-start gap-4 group-hover:opacity-80 transition-opacity duration-200">
          <div className="mt-[3px]">
            <div className="w-7 h-7 rounded-full bg-[#6559D4] flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-2xl text-gray-900 text-left">{title}</h3>
            <ChevronIcon
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-base text-gray-600 leading-relaxed mt-3 ml-10">
          {description}
        </p>
      </div>
    </div>
  );
}

function ChevronIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function LinkedInIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TwitterIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}

function FeatureSparklesIcon(
  props: React.ComponentProps<"svg"> & { size?: number }
) {
  return (
    <svg
      width={props.size || 22}
      height={props.size || 22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
    </svg>
  );
}

function BellIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function ChartIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

function ShieldIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
