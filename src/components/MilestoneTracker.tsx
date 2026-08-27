import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Flag,
  Target,
  Rocket,
  Shield,
  DollarSign,
  Users,
  Layers,
  ChevronRight,
  Filter,
  CheckSquare,
  Square,
  X,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Startup, Milestone } from "../types";
import { exportCombinedStartupCSV } from "../utils/csvExport";

interface MilestoneTrackerProps {
  startup: Startup;
  onUpdateStartup: (updated: Startup) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  Product: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: Layers },
  "GTM & Marketing": { bg: "bg-emerald-500/10", text: "text-[#00ff66]", border: "border-[#00ff66]/30", icon: Rocket },
  Fundraising: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", icon: DollarSign },
  "Legal & Ops": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", icon: Shield },
  Hiring: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", icon: Users }
};

const PRIORITY_BADGES: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "bg-rose-500/20 text-rose-300 border-rose-500/40", text: "Critical" },
  High: { bg: "bg-amber-500/20 text-amber-300 border-amber-500/40", text: "High" },
  Medium: { bg: "bg-blue-500/20 text-blue-300 border-blue-500/40", text: "Medium" },
  Low: { bg: "bg-slate-500/20 text-slate-300 border-slate-500/40", text: "Low" }
};

export default function MilestoneTracker({ startup, onUpdateStartup }: MilestoneTrackerProps) {
  // Ensure default milestones if none exist
  const initialMilestones = useMemo<Milestone[]>(() => {
    if (startup.milestones && startup.milestones.length > 0) {
      return startup.milestones;
    }

    const today = new Date();
    const addWeeks = (w: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + w * 7);
      return d.toISOString().split("T")[0];
    };

    return [
      {
        id: "m-1",
        title: "Technical Architecture & Core Database Setup",
        description: "Configure scalable cloud infrastructure, PostgreSQL tables, and authentication endpoints.",
        targetDate: addWeeks(2),
        completedDate: addWeeks(-1),
        category: "Product",
        status: "Completed",
        priority: "Critical",
        deliverables: ["DB schema migration", "REST API routes", "Staging environment"]
      },
      {
        id: "m-2",
        title: "Alpha MVP Core Workflow Prototype",
        description: `Implement primary automation engine addressing ${startup.idea?.problem || "operational friction"}.`,
        targetDate: addWeeks(4),
        category: "Product",
        status: "In-Progress",
        priority: "Critical",
        deliverables: ["Frontend dashboard layout", "Primary engine integration", "State persistence"]
      },
      {
        id: "m-3",
        title: "Pre-Launch Waitlist & Landing Page Launch",
        description: "Deploy branded microsite to capture initial 100 early access emails.",
        targetDate: addWeeks(6),
        category: "GTM & Marketing",
        status: "Upcoming",
        priority: "High",
        deliverables: ["Custom domain setup", "Email capture form", "Social media announcements"]
      },
      {
        id: "m-4",
        title: "Closed Beta Onboarding (Cohort 1: 30 Users)",
        description: "Invite initial pilot users to evaluate product-market fit and measure NPS.",
        targetDate: addWeeks(8),
        category: "Product",
        status: "Upcoming",
        priority: "High",
        deliverables: ["User onboarding script", "Feedback analytics telemetry", "Bug fix sprint"]
      },
      {
        id: "m-5",
        title: "Legal Incorporation & Trademark Filings",
        description: "Complete formal Delaware C-Corp registration and IP assignment agreements.",
        targetDate: addWeeks(10),
        category: "Legal & Ops",
        status: "Upcoming",
        priority: "Medium",
        deliverables: ["EIN registration", "Bank account setup", "Founders IP assignment"]
      },
      {
        id: "m-6",
        title: "Angel / Seed Round Pitching ($150k Ask)",
        description: "Present executive deck to accredited angels and early-stage venture funds.",
        targetDate: addWeeks(12),
        category: "Fundraising",
        status: "Upcoming",
        priority: "High",
        deliverables: ["Executive 1-pager", "10-slide deck", "Data room financials"]
      }
    ];
  }, [startup]);

  const [milestones, setMilestones] = useState<Milestone[]>(startup.milestones || initialMilestones);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState("");

  // Save changes to parent startup state
  const saveMilestones = (updated: Milestone[]) => {
    setMilestones(updated);
    onUpdateStartup({
      ...startup,
      milestones: updated
    });
  };

  // Stats calculation
  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.status === "Completed").length;
  const inProgressCount = milestones.filter((m) => m.status === "In-Progress").length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Next upcoming milestone
  const upcomingMilestones = milestones
    .filter((m) => m.status !== "Completed")
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  const nextMilestone = upcomingMilestones[0];

  // Filtering
  const filteredMilestones = milestones
    .filter((m) => (selectedCategory === "All" ? true : m.category === selectedCategory))
    .filter((m) => (selectedStatus === "All" ? true : m.status === selectedStatus))
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  // Toggle milestone status cycle
  const handleToggleStatus = (id: string) => {
    const updated = milestones.map((m) => {
      if (m.id === id) {
        const nextStatus: Milestone["status"] =
          m.status === "Upcoming"
            ? "In-Progress"
            : m.status === "In-Progress"
            ? "Completed"
            : m.status === "Completed"
            ? "Delayed"
            : "Upcoming";

        return {
          ...m,
          status: nextStatus,
          completedDate: nextStatus === "Completed" ? new Date().toISOString().split("T")[0] : undefined
        };
      }
      return m;
    });
    saveMilestones(updated);
  };

  const handleDeleteMilestone = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project milestone?")) {
      const updated = milestones.filter((m) => m.id !== id);
      saveMilestones(updated);
    }
  };

  const handleOpenAddModal = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setEditingMilestone({
      id: `m-${Date.now()}`,
      title: "",
      description: "",
      targetDate: d.toISOString().split("T")[0],
      category: "Product",
      status: "Upcoming",
      priority: "High",
      deliverables: []
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !editingMilestone.title.trim()) return;

    const exists = milestones.some((m) => m.id === editingMilestone.id);
    let updated: Milestone[];
    if (exists) {
      updated = milestones.map((m) => (m.id === editingMilestone.id ? editingMilestone : m));
    } else {
      updated = [...milestones, editingMilestone];
    }
    saveMilestones(updated);
    setIsModalOpen(false);
    setEditingMilestone(null);
  };

  const handleGenerateAIMilestones = () => {
    const today = new Date();
    const addDays = (days: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    };

    const sName = startup.identity?.name || "Startup";
    const generated: Milestone[] = [
      {
        id: `ai-1-${Date.now()}`,
        title: "Sprint 1: Core Database & API Scaffolding",
        description: "Deploy scalable cloud backend, authenticate users, and provision databases.",
        targetDate: addDays(10),
        category: "Product",
        status: "In-Progress",
        priority: "Critical",
        deliverables: ["SQL Schema migration", "Vite/Express endpoints", "Unit testing setup"]
      },
      {
        id: `ai-2-${Date.now()}`,
        title: "Sprint 2: Core Engine & Workflow Automation",
        description: `Build and polish the central engine solving ${startup.idea?.problem || "manual workflow bottlenecks"}.`,
        targetDate: addDays(24),
        category: "Product",
        status: "Upcoming",
        priority: "Critical",
        deliverables: ["Interactive dashboard UI", "Engine business logic", "Export pipelines"]
      },
      {
        id: `ai-3-${Date.now()}`,
        title: "GTM Phase 1: Waitlist Microsite & Seed SEO",
        description: `Publish ${sName} high-converting landing page and publish 3 cornerstone SEO articles.`,
        targetDate: addDays(38),
        category: "GTM & Marketing",
        status: "Upcoming",
        priority: "High",
        deliverables: ["Domain & SSL configuration", "Waitlist email capture", "Product Hunt teaser page"]
      },
      {
        id: `ai-4-${Date.now()}`,
        title: "Beta Cohort 1: 50 Private Beta Users",
        description: `Onboard first 50 pilot customers from target audience (${startup.idea?.targetAudience || "industry teams"}).`,
        targetDate: addDays(55),
        category: "Product",
        status: "Upcoming",
        priority: "High",
        deliverables: ["1-on-1 onboarding interviews", "Weekly cohort NPS tracking", "Core retention audit"]
      },
      {
        id: `ai-5-${Date.now()}`,
        title: "Legal Incorporation & Founder IP Assignment",
        description: "Incorporate corporate entity, open business bank account, and assign intellectual property.",
        targetDate: addDays(70),
        category: "Legal & Ops",
        status: "Upcoming",
        priority: "Medium",
        deliverables: ["IRS EIN acquisition", "Operating agreement", "Founders vesting schedule"]
      },
      {
        id: `ai-6-${Date.now()}`,
        title: "Public Launch & Paid Subscription Checkout",
        description: "Activate Stripe / payment gateway and launch across Product Hunt, Hacker News, and LinkedIn.",
        targetDate: addDays(90),
        category: "GTM & Marketing",
        status: "Upcoming",
        priority: "Critical",
        deliverables: ["Payment billing checkout", "Launch day marketing blast", "Customer support live chat"]
      },
      {
        id: `ai-7-${Date.now()}`,
        title: "Seed Capital Closing ($150k Seed Round)",
        description: "Close angel round to fund 12-month runway and scale customer acquisition.",
        targetDate: addDays(120),
        category: "Fundraising",
        status: "Upcoming",
        priority: "High",
        deliverables: ["SAFE agreements signing", "Investor data room updates", "Post-round hiring plan"]
      }
    ];

    saveMilestones(generated);
  };

  return (
    <div className="space-y-8 font-mono" id="milestone-tracker-component">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/40 text-[#00ff66]">
              <Flag className="w-4 h-4" />
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-syne uppercase">
              Milestone & Delivery Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Define, track, and visually represent key project delivery dates using an interactive chronological timeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleGenerateAIMilestones}
            className="bg-slate-900 hover:bg-slate-850 text-[#00ff66] border border-[#00ff66]/30 hover:border-[#00ff66] px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
            title="Auto-generate AI calibrated milestone timeline"
            id="ai-generate-milestones-btn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Roadmap Generate</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="bg-[#00ff66] hover:bg-[#00cc52] text-black font-extrabold px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-[#00ff66]/20"
            id="add-new-milestone-btn"
          >
            <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* METRICS & OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="milestones-metrics-grid">
        {/* Card 1: Total Completion */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Progress Velocity</span>
            <span className="text-[#00ff66] font-bold">{progressPct}%</span>
          </div>
          <div className="text-xl font-black font-syne text-white">
            {completedCount} / {totalCount} <span className="text-xs text-slate-400 font-mono font-normal">Delivered</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-[#00ff66] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Card 2: Next Critical Delivery */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Next Target Delivery</span>
            <Clock className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-cyan-300 truncate font-syne">
            {nextMilestone ? nextMilestone.title : "All Delivered 🎉"}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>{nextMilestone ? `Due: ${nextMilestone.targetDate}` : "Roadmap Complete"}</span>
          </div>
        </div>

        {/* Card 3: In-Progress Sprint */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Active Sprint</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          </div>
          <div className="text-xl font-black font-syne text-white">
            {inProgressCount} <span className="text-xs text-slate-400 font-mono font-normal">In-Flight</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {inProgressCount > 0 ? "Currently active in execution" : "No active task in progress"}
          </p>
        </div>

        {/* Card 4: Master Spreadsheet Export */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Spreadsheet Sync</span>
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <button
            onClick={() => exportCombinedStartupCSV(startup)}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-[10px] text-[#00ff66] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3 h-3 text-[#00ff66]" />
            <span>Download CSV Roadmap</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/60 border border-slate-850 p-3 rounded-2xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 custom-scrollbar">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mr-1">Filter:</span>
          {["All", "Product", "GTM & Marketing", "Fundraising", "Legal & Ops", "Hiring"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-tight transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#00ff66]/20 border border-[#00ff66]/50 text-[#00ff66]"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-[10px] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#00ff66] cursor-pointer uppercase"
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* INTERACTIVE TIMELINE DISPLAY */}
      <div className="space-y-4" id="timeline-container">
        {filteredMilestones.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white uppercase">No Milestones Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No project delivery dates match your selected filters. Reset filters or create a new milestone.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedStatus("All");
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-[#00ff66] rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#00ff66] before:via-cyan-500 before:to-slate-800">
            {filteredMilestones.map((m, idx) => {
              const catConfig = CATEGORY_COLORS[m.category] || CATEGORY_COLORS["Product"];
              const CatIcon = catConfig.icon;
              const isCompleted = m.status === "Completed";
              const isInProgress = m.status === "In-Progress";
              const isDelayed = m.status === "Delayed";

              return (
                <div key={m.id} className="relative group">
                  {/* TIMELINE NODE DOT */}
                  <div
                    onClick={() => handleToggleStatus(m.id)}
                    className={`absolute -left-6 md:-left-10 top-4 -translate-x-1/2 w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all z-10 ${
                      isCompleted
                        ? "bg-[#00ff66] border-white text-black shadow-[0_0_15px_rgba(0,255,102,0.6)]"
                        : isInProgress
                        ? "bg-cyan-500 border-cyan-300 text-black animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                        : isDelayed
                        ? "bg-amber-500 border-amber-300 text-black"
                        : "bg-slate-900 border-slate-700 text-slate-500 hover:border-[#00ff66] hover:text-[#00ff66]"
                    }`}
                    title="Click to toggle status (Upcoming → In-Progress → Completed → Delayed)"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                    ) : isInProgress ? (
                      <Clock className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                    ) : (
                      <span className="text-[9px] font-bold font-mono">{idx + 1}</span>
                    )}
                  </div>

                  {/* MILESTONE CARD */}
                  <div
                    className={`bg-slate-900/80 hover:bg-slate-900 border rounded-2xl p-5 md:p-6 transition-all space-y-4 shadow-sm ${
                      isCompleted
                        ? "border-emerald-800/40 bg-emerald-950/10"
                        : isInProgress
                        ? "border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.05)]"
                        : isDelayed
                        ? "border-amber-800/40 bg-amber-950/10"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          {m.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono border ${
                            PRIORITY_BADGES[m.priority]?.bg || "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {m.priority} Priority
                        </span>

                        {m.status && (
                          <button
                            onClick={() => handleToggleStatus(m.id)}
                            className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider cursor-pointer transition-all border ${
                              isCompleted
                                ? "bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66]/40"
                                : isInProgress
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                                : isDelayed
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                            title="Click to toggle status"
                          >
                            {m.status} ⇄
                          </button>
                        )}
                      </div>

                      {/* Target Date Pill */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-[#00ff66]" />
                        <span className="font-bold">{m.targetDate}</span>
                        {isCompleted && m.completedDate && (
                          <span className="text-[9px] text-[#00ff66] font-normal">
                            (Completed: {m.completedDate})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h4 className={`text-base font-bold font-syne ${isCompleted ? "text-slate-200 line-through opacity-85" : "text-white"}`}>
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Deliverables Checklist */}
                    {m.deliverables && m.deliverables.length > 0 && (
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-2">
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold block">
                          Key Deliverables:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-300 font-sans">
                          {m.deliverables.map((del, dIdx) => (
                            <div key={dIdx} className="flex items-center gap-1.5 text-[11px]">
                              <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-[#00ff66]" : "bg-cyan-400"}`} />
                              <span className="truncate">{del}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-850/60">
                      <button
                        onClick={() => {
                          setEditingMilestone({ ...m });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                        title="Edit milestone parameters"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD / EDIT MILESTONE MODAL */}
      <AnimatePresence>
        {isModalOpen && editingMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0d0d11] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-[#e4e4e7]"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-syne font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#00ff66]" />
                  <span>{milestones.some((x) => x.id === editingMilestone.id) ? "Edit Milestone" : "Add Project Milestone"}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.title}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                    placeholder="e.g., MVP Core Engine Launch"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00ff66]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                    Description & Objectives
                  </label>
                  <textarea
                    rows={2}
                    value={editingMilestone.description}
                    onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                    placeholder="Describe specific functional and business goals for this milestone..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00ff66]"
                  />
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                      Category
                    </label>
                    <select
                      value={editingMilestone.category}
                      onChange={(e) =>
                        setEditingMilestone({
                          ...editingMilestone,
                          category: e.target.value as Milestone["category"]
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00ff66]"
                    >
                      <option value="Product">Product</option>
                      <option value="GTM & Marketing">GTM & Marketing</option>
                      <option value="Fundraising">Fundraising</option>
                      <option value="Legal & Ops">Legal & Ops</option>
                      <option value="Hiring">Hiring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                      Target Delivery Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={editingMilestone.targetDate}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, targetDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00ff66]"
                    />
                  </div>
                </div>

                {/* Priority & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                      Priority Level
                    </label>
                    <select
                      value={editingMilestone.priority}
                      onChange={(e) =>
                        setEditingMilestone({
                          ...editingMilestone,
                          priority: e.target.value as Milestone["priority"]
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00ff66]"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                      Current Status
                    </label>
                    <select
                      value={editingMilestone.status}
                      onChange={(e) =>
                        setEditingMilestone({
                          ...editingMilestone,
                          status: e.target.value as Milestone["status"]
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00ff66]"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </div>
                </div>

                {/* Deliverables List */}
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                    Deliverables Checklist
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      placeholder="Add concrete deliverable..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#00ff66]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newDeliverable.trim()) {
                            setEditingMilestone({
                              ...editingMilestone,
                              deliverables: [...(editingMilestone.deliverables || []), newDeliverable.trim()]
                            });
                            setNewDeliverable("");
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newDeliverable.trim()) {
                          setEditingMilestone({
                            ...editingMilestone,
                            deliverables: [...(editingMilestone.deliverables || []), newDeliverable.trim()]
                          });
                          setNewDeliverable("");
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
                    {(editingMilestone.deliverables || []).map((item, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex justify-between items-center bg-slate-950 p-1.5 px-2 rounded-lg border border-slate-850 text-[11px]"
                      >
                        <span className="text-slate-300 truncate">{item}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = (editingMilestone.deliverables || []).filter((_, i) => i !== dIdx);
                            setEditingMilestone({ ...editingMilestone, deliverables: filtered });
                          }}
                          className="text-slate-500 hover:text-red-400 ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00ff66] hover:bg-[#00cc52] text-black font-extrabold rounded-xl text-xs cursor-pointer shadow-md shadow-[#00ff66]/20"
                  >
                    Save Milestone
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
