"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Video,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  UserPlus,
  LayoutDashboard,
  CreditCard,
  Settings,
  Search,
  Bell,
  Blocks,
  Database,
  Handshake,
} from "lucide-react";
import Spotlight from "@/icons/Spotlight";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-[#07020F] text-white overflow-hidden relative flex flex-col font-sans">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Mesh Gradient Blobs & Glowing Orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-[#8B5CF6]/20 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-0 left-0 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-[#C084FC]/10 rounded-full blur-[150px] pointer-events-none -translate-x-1/3 translate-y-1/3"
      />
      {/* Corner Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#8B5CF6]/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#C084FC]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
            <Spotlight className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Spotlight</span>
        </div>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
                  Sign up
                </button>
              </SignUpButton>
            </>
          ) : (
            <Link
              href="/home"
              className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-slate-200 transition-colors"
            >
              Go to Home
            </Link>
          )}
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 relative z-10 grid grid-cols-1 md:grid-cols-12 items-center px-6 pt-12 pb-24 max-w-7xl mx-auto w-full gap-12 min-h-[80vh]">
        {/* Left Column */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col items-start text-left z-20 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg md:text-md lg:text-[30px] font-bold text-white mb-2 leading-[1.1]"
          >
            Transform your business
            <br />
            with an autonomous
            <br />
            <span className="pb-2 ml-[-20px] mr-[-130px] tracking-[-5px] text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#D8B4FE] uppercase text-[180px] md:text-[72px] lg:text-[120px] font-black leading-[1.1] block mt-2 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              AI SALES
              <br />
              AGENT
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 rounded-4xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(139,92,246,0.5)] cursor-pointer text-lg">
                Get Started Free <ChevronRight className="w-5 h-5" />
              </button>
            </SignInButton>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-4xl bg-transparent text-slate-200 font-medium border border-white/30 hover:border-white hover:bg-white/10 transition-colors text-center text-lg"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* <motion.div 
            initial={{ opacity: 0, opacity: 0 }}
            animate={{ opacity: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 w-full"
          >
            <p className="text-sm text-slate-400 mb-6">Trusted logos are:</p>
            <div className="flex flex-wrap items-center gap-8 text-slate-400 opacity-60 grayscale">
              <span className="font-bold text-xl md:text-2xl flex items-center gap-2"><div className="w-6 h-6 bg-current rounded-full" /> HubSpot</span>
              <span className="font-bold text-xl md:text-2xl flex items-center gap-2"><div className="w-8 h-5 bg-current rounded-sm" /> salesforce</span>
              <span className="font-bold text-xl md:text-2xl flex items-center gap-2"><div className="w-6 h-6 border-[3px] border-current rounded-sm" /> zendesk</span>
              <span className="font-bold text-xl md:text-2xl flex items-center gap-2"><div className="w-5 h-5 bg-current rounded-sm" /> INTERCOM</span>
            </div>
          </motion.div> */}
        </div>

        {/* Right Column: Dashboard Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="md:col-span-6 lg:col-span-5 relative w-full h-[500px] hidden md:block z-20 scale-[1.15] lg:scale-125 origin-center lg:origin-right xl:origin-center mt-10 lg:mt-0"
        >
          {/* Main Dashboard Card */}
          <div className="absolute top-[10%] right-0 w-full lg:w-[500px] h-[360px] bg-white/8 border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
                  <Spotlight className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm">Spotlight</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-300 font-medium flex-1 pl-12">
                <span>Dashboard</span>
              </div>
              <div className="flex gap-2 text-slate-400 ">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Search className="w-3 h-3" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center relative">
                  <Bell className="w-3 h-3" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full"></span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-4 h-full">
              {/* Sidebar */}
              <div className="w-32 flex flex-col gap-2">
                <div className="bg-[#8B5CF6]/10 text-[#C084FC] text-xs py-2 px-3 rounded-lg flex items-center gap-2 font-medium border border-[#8B5CF6]/20">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </div>
                <div className="text-slate-400 text-xs py-2 px-3 flex items-center gap-2 hover:bg-white/5 rounded-lg transition-colors">
                  <CreditCard className="w-3.5 h-3.5" /> Pricing
                </div>
                <div className="text-slate-400 text-xs py-2 px-3 flex items-center gap-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Blocks className="w-3.5 h-3.5" /> Use Cases
                </div>
                <div className="text-slate-400 text-xs py-2 px-3 flex items-center gap-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Settings className="w-3.5 h-3.5" /> Integrations
                </div>
              </div>
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Stat block 1 (Top) */}
                <div className="w-full h-[150px] bg-black/20 border border-white/10 rounded-xl p-4 flex flex-col relative overflow-hidden -mt-4">
                  <h4 className="text-xs text-slate-400 mb-4 font-medium">
                    Webinar Stats
                  </h4>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">
                        Attendees
                      </div>
                      <div className="text-2xl font-bold">1.2K</div>
                    </div>
                  </div>
                  {/* Fake Chart Area */}
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#8B5CF6]/20 to-transparent flex items-end opacity-80">
                    <svg
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      className="w-full h-full text-[#8B5CF6]/40 fill-current"
                    >
                      <path d="M0,40 C15,20 30,30 45,15 C60,0 75,25 100,10 L100,40 L0,40 Z" />
                    </svg>
                    <svg
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                      className="w-full h-full text-[#C084FC] absolute bottom-0 left-0 fill-none stroke-current"
                      strokeWidth="1.5"
                    >
                      <path d="M0,40 C15,20 30,30 45,15 C60,0 75,25 100,10" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="w-full flex-1 flex gap-4">
                  {/* Content block 2 (Bottom Left) */}
                  <div className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] text-slate-400 font-medium">
                        Live Chat
                      </h4>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex-shrink-0 mt-0.5"></div>
                        <div className="text-[8px] text-slate-300 leading-tight">
                          <span className="font-semibold text-white">
                            Alex:
                          </span>{" "}
                          Looks amazing!
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex-shrink-0 mt-0.5"></div>
                        <div className="text-[8px] text-slate-300 leading-tight">
                          <span className="font-semibold text-white">
                            Sarah:
                          </span>{" "}
                          How to sign up?
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content block 3 (Bottom Right) */}
                  <div className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 flex flex-col relative overflow-hidden">
                    <h4 className="text-[10px] text-slate-400 mb-2 font-medium">
                      Performance
                    </h4>
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="text-[8px] text-slate-500 mb-0.5">
                          Engagement
                        </div>
                        <div className="text-sm font-bold text-white">84%</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 mb-0.5">
                          Conversion
                        </div>
                        <div className="text-sm font-bold text-white">12%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chat Panel (Overlapping) */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute top-[50%] left-[-12%] lg:left-[-10%] w-36 lg:w-50 bg-white/8 border border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-semibold">Live Chat</h3>
              <div className="flex gap-1">
                <div className="w-0.5 h-0.5 bg-slate-500 rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-slate-500 rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-slate-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Active</div>
                <div className="text-2xl font-bold">5</div>
              </div>
              <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Messages</div>
                <div className="text-2xl font-bold">89</div>
              </div>
            </div>
          </motion.div>

          {/* Lead Alerts Panel (Overlapping) */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-[-3%] right-[5%] lg:right-[15%] w-36 lg:w-50 bg-white/8 border border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30"
          >
            <h3 className="text-xs font-semibold mb-2">Lead Alerts</h3>
            <div className="flex gap-3">
              <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">New</div>
                <div className="text-2xl font-bold">15</div>
              </div>
              <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Qualified</div>
                <div className="text-2xl font-bold">8</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Details / Features Section */}
      <section
        id="features"
        className="relative z-10 py-24 flex flex-col items-center bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-white via-[#D8B4FE] to-[#8B5CF6] bg-clip-text text-transparent drop-shadow-sm">
              Supercharge Your Sales Funnel
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Our AI Sales Agent seamlessly integrates into your workflow,
              providing interactive webinars and personalized customer support
              at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Feature Card 1 */}
            <div className="p-8 rounded-3xl bg-[#12071f]/60 border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:-translate-y-[5px]">
              <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-8 h-8 text-[#D8B4FE]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Live AI Webinars
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Host thousands of attendees simultaneously with an AI host that
                presents flawlessly and adapts to audience engagement.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-8 rounded-3xl bg-[#12071f]/60 border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:-translate-y-[5px]">
              <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-8 h-8 text-[#D8B4FE]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Intelligent Q&A
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The agent answers questions in real-time, pulling from your
                knowledge base to provide accurate and persuasive responses.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-8 rounded-3xl bg-[#12071f]/60 border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:-translate-y-[5px]">
              <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="w-8 h-8 text-[#D8B4FE]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Automated Lead Gen
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Capture leads automatically during sessions, qualify them
                instantly, and push them to your CRM for seamless follow-ups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow & Product Showcase Section */}
      <section className="relative z-10 pb-24 flex flex-col items-center bg-transparent">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
          {/* Pill */}
          <div className="mb-8 px-5 py-2 rounded-full border border-white/10 bg-[#150724]/50 backdrop-blur-md">
            <span className="text-sm font-medium text-slate-300">Premium</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center leading-tight tracking-tight">
            <span className="text-white">Workflow &</span>
            <br />
            <span className="pb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-[#8B5CF6]">
              Product Showcase
            </span>
          </h2>

          <h3 className="text-3xl md:text-4xl font-bold mb-20 text-white text-center">
            How It Works
          </h3>

          {/* Steps Timeline */}
          <div className="relative w-full max-w-5xl mx-auto">
            {/* The horizontal connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] w-[70%] h-1 bg-gradient-to-r from-[#C084FC] via-[#8B5CF6] to-[#3B82F6] rounded-full blur-[3px] opacity-70"></div>
            <div className="hidden md:block absolute top-12 left-[15%] w-[70%] h-1 bg-gradient-to-r from-[#C084FC] via-[#8B5CF6] to-[#3B82F6] rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#150724]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(192,132,252,0.3)] flex items-center justify-center text-4xl font-bold text-white mb-8 relative">
                  1
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#D8B4FE] bg-white/5">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Connect Knowledge
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed px-4">
                  Upload PDFs, URLs, and CRM data. The AI instantly learns your
                  product inside out.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#150724]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center text-4xl font-bold text-white mb-8 relative">
                  2
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#D8B4FE] bg-white/5">
                  <Video className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Launch Webinar
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed px-4">
                  Set a schedule and go live. The agent hosts, presents slides,
                  and speaks naturally.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#150724]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center text-4xl font-bold text-white mb-8 relative">
                  3
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-[#D8B4FE] bg-white/5">
                  <Handshake className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Close Deals
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed px-4">
                  The agent answers live Q&A, pushes sign-up links, and
                  automatically follows up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative z-10 py-24 flex flex-col items-center bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Start for free, upgrade when you need more power.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="p-10 rounded-[2rem] bg-[#12071f]/60 border border-white/10 hover:border-white/20 transition-colors flex flex-col h-full shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
              <div className="text-5xl font-bold text-white mb-2 flex items-baseline">
                $0
                <span className="text-lg font-medium text-slate-500 ml-1">
                  /mo
                </span>
              </div>
              <p className="text-slate-400 mb-8 text-sm">
                Perfect for individual and small teams.
              </p>
              <ul className="space-y-5 mb-10 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  Up to 3 live webinars/mo
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  100 attendees per session
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/50" />
                  </div>
                  Basic AI Q&A
                </li>
              </ul>
              <div className="mt-auto w-full">
                <SignInButton mode="modal">
                  <button className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-white font-medium cursor-pointer">
                    Get Started
                  </button>
                </SignInButton>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="p-10 rounded-[2rem] bg-[#1a0b2e]/80 border-2 border-[#8B5CF6] relative flex flex-col h-full shadow-[0_0_40px_rgba(139,92,246,0.2)] transform md:-translate-y-2">
              <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-[#8B5CF6] rounded-full text-[10px] font-bold text-white tracking-wider shadow-lg uppercase">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <div className="text-5xl font-bold text-white mb-2 flex items-baseline">
                $49
                <span className="text-lg font-medium text-slate-500 ml-1">
                  /mo
                </span>
              </div>
              <p className="text-slate-400 mb-8 text-sm">
                For growing businesses scaling sales.
              </p>
              <ul className="space-y-5 mb-10 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#8B5CF6]/30 flex items-center justify-center bg-[#8B5CF6]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D8B4FE]" />
                  </div>
                  Unlimited webinars
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#8B5CF6]/30 flex items-center justify-center bg-[#8B5CF6]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D8B4FE]" />
                  </div>
                  10,000 attendees per session
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#8B5CF6]/30 flex items-center justify-center bg-[#8B5CF6]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D8B4FE]" />
                  </div>
                  Advanced Knowledge Base
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#8B5CF6]/30 flex items-center justify-center bg-[#8B5CF6]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D8B4FE]" />
                  </div>
                  Custom voice cloning
                </li>
              </ul>
              <div className="mt-auto w-full">
                <SignInButton mode="modal">
                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:opacity-90 transition-opacity text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer text-lg">
                    Upgrade to Pro
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-20 pb-10 bg-[#07020F] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
                  <Spotlight className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  Spotlight
                </span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                The next generation of sales. Deploy autonomous AI agents to
                host webinars, interact with your audience, and close more 24/7.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-sm">Product</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-sm">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-[#C084FC] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 border-t border-white/5">
            <p>
              © {new Date().getFullYear()} Spotlight Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
