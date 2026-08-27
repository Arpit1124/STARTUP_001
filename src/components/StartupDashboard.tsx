import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import {
  Sparkles, Check, ChevronRight, Briefcase, Users, Bot, Download, ArrowLeft, Loader2,
  ShieldAlert, TrendingUp, AlertTriangle, PieChart, ShieldCheck, Landmark, Hammer, Map,
  Globe, Server, DollarSign, LayoutGrid, Radio, CheckSquare, MessageSquare, FileText, ChevronDown, Mic, LogOut, Search,
  PartyPopper, Award, CheckCircle2, Share2, X, Calendar, Brain, FileSpreadsheet
} from "lucide-react";
import { Startup, User } from "../types";
import StartupChat from "./StartupChat";
import StartupLandingPage from "./StartupLandingPage";
import ExportDocs from "./ExportDocs";
import MockInterviewPractice from "./MockInterviewPractice";
import StartupInsights from "./StartupInsights";
import MilestoneTracker from "./MilestoneTracker";
import AIInsightsSummaryModal from "./AIInsightsSummaryModal";
import MarketGrowthProjection from "./MarketGrowthProjection";
import { exportFinancialProjectionsCSV, exportSWOTAnalysisCSV } from "../utils/csvExport";

interface StartupDashboardProps {
  startup: Startup;
  onUpdateStartup: (updated: Startup) => void;
  onBack: () => void;
  user: User | null;
  onUpdateUser: (user: User | null) => void;
  onOpenSearch?: () => void;
}

type TabType =
  | "identity"
  | "insights"
  | "market-research"
  | "competitor-analysis"
  | "business-model"
  | "financial-planner"
  | "milestones"
  | "mvp-planner"
  | "technical-architecture"
  | "prd"
  | "marketing-planner"
  | "investor-section"
  | "mock-interview"
  | "legal-checklist"
  | "landing-page"
  | "chat"
  | "export";

export default function StartupDashboard({ startup, onUpdateStartup, onBack, user, onUpdateUser, onOpenSearch }: StartupDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("identity");
  const [generatingTab, setGeneratingTab] = useState<TabType | null>(null);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [show10thModuleModal, setShow10thModuleModal] = useState(false);
  const [isAIInsightsOpen, setIsAIInsightsOpen] = useState(false);

  const fireConfettiAnimation = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#00ff66", "#3b82f6", "#f43f5e", "#fbbf24", "#a855f7"]
    });
  };

  const handleGenerateModule = async (tabName: TabType) => {
    setGeneratingTab(tabName);
    const messages = [
      "Consulting standard sector parameters...",
      "Simulating demographic purchasing pain points...",
      "Synthesizing customized operational frameworks...",
      "Executing market SWOT alignment models...",
      "Calibrating projection coefficients..."
    ];

    let index = 0;
    setLoaderMessage(messages[0]);
    const timer = setInterval(() => {
      index++;
      if (index < messages.length) {
        setLoaderMessage(messages[index]);
      }
    }, 1500);

    try {
      const response = await fetch("/api/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: startup.idea,
          identity: startup.identity,
          module: tabName
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Error status: ${response.status}`);
      }

      let generatedData;
      try {
        generatedData = await response.json();
      } catch (err) {
        console.error("Failed to parse generated data response as JSON:", err);
        throw new Error("Received an invalid or malformed response from the AI generator. Please try again.");
      }

      // Calculate progress increment
      const nextProgress = Math.min(startup.progress + 8, 100);

      // Check if 10th module / 100% completion milestone is reached
      if (nextProgress >= 100 || (startup.progress < 100 && nextProgress >= 100)) {
        setTimeout(() => {
          fireConfettiAnimation();
          setShow10thModuleModal(true);
        }, 300);
      }

      // Update local startup state
      const updatedStartup: Startup = {
        ...startup,
        [tabName.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof Startup]: generatedData,
        progress: nextProgress
      };

      // Add helper message to AI advisor chat context
      const chatUpdate = [
        ...updatedStartup.chatHistory,
        {
          sender: "ai" as const,
          text: `I have generated and established your **${tabName.toUpperCase().replace("-", " ")}** parameters! 🛠️\n\nYou can now view interactive charts, database schemas, and outlines in that tab, or ask me questions specifically about these elements.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ];
      updatedStartup.chatHistory = chatUpdate;

      onUpdateStartup(updatedStartup);

      // Deduct AI credit
      if (user) {
        onUpdateUser({
          ...user,
          aiUsageCount: user.aiUsageCount + 1,
          recentActivity: [
            { action: `Forged workspace module: ${tabName.replace("-", " ")}`, time: "Just now" },
            ...user.recentActivity
          ]
        });
      }

    } catch (err: any) {
      console.error(err);
      alert(`API generation failed: ${err.message || "Please try again."}`);
    } finally {
      clearInterval(timer);
      setGeneratingTab(null);
    }
  };

  const navItems: { id: TabType; label: string; icon: any; category: string }[] = [
    { id: "identity", label: "Brand Identity", icon: Sparkles, category: "BRAND SETUP" },
    { id: "insights", label: "Startup Insights", icon: TrendingUp, category: "BRAND SETUP" },
    { id: "market-research", label: "Market Research", icon: PieChart, category: "MARKET STRATEGY" },
    { id: "competitor-analysis", label: "Competitor Analysis", icon: TrendingUp, category: "MARKET STRATEGY" },
    { id: "business-model", label: "Business Model", icon: LayoutGrid, category: "COMMERCIALS" },
    { id: "financial-planner", label: "Financial Planner", icon: DollarSign, category: "COMMERCIALS" },
    { id: "milestones", label: "Milestone Tracker", icon: Calendar, category: "PRODUCT SCOPING" },
    { id: "prd", label: "PRD Generator", icon: FileSquare, category: "PRODUCT SCOPING" },
    { id: "mvp-planner", label: "MVP Developer", icon: Hammer, category: "PRODUCT SCOPING" },
    { id: "technical-architecture", label: "Technical Blueprint", icon: Server, category: "PRODUCT SCOPING" },
    { id: "marketing-planner", label: "Marketing Planner", icon: Radio, category: "GROWTH PLAYBOOK" },
    { id: "investor-section", label: "Investor Capital", icon: Landmark, category: "GROWTH PLAYBOOK" },
    { id: "mock-interview", label: "Mock Pitch Practice", icon: Mic, category: "INVESTOR PRACTICE" },
    { id: "legal-checklist", label: "Legal & Trademark", icon: ShieldCheck, category: "GROWTH PLAYBOOK" },
    { id: "landing-page", label: "Live Microsite Preview", icon: Globe, category: "LAUNCH STAGE" },
    { id: "chat", label: "AI Advisor Chat", icon: Bot, category: "LAUNCH STAGE" },
    { id: "export", label: "Export & Copy Docs", icon: FileText, category: "LAUNCH STAGE" }
  ];

  // Helper file square icon
  function FileSquare(props: any) {
    return <FileText {...props} />;
  }

  // Group items by category for visual hierarchy
  const categories = Array.from(new Set(navItems.map((item) => item.category)));

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#111113] text-[#e4e4e7] flex flex-col md:flex-row w-full relative z-10" id="dashboard-view">
      {/* LEFT WORKSPACE SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#111113] border-b md:border-b-0 md:border-r border-[rgba(228,228,231,0.1)] flex flex-col justify-between flex-shrink-0 relative z-20 text-[rgba(228,228,231,0.7)]">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[rgba(228,228,231,0.1)] flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-white/5 rounded-lg text-[rgba(228,228,231,0.5)] hover:text-[#00ff66] transition-colors cursor-pointer border border-[rgba(228,228,231,0.1)] shrink-0"
              title="Return to Saved Startups"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-1.5 hover:bg-white/5 rounded-lg text-[rgba(228,228,231,0.5)] hover:text-[#00ff66] transition-colors cursor-pointer border border-[rgba(228,228,231,0.1)] shrink-0"
                id="sidebar-open-search-btn"
                title="Search Any Startup (Cmd+K)"
              >
                <Search className="w-4 h-4 text-[#00ff66]" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-syne text-xs font-black text-[#e4e4e7] uppercase tracking-wider truncate">{startup.identity.name}</h3>
                {startup.progress >= 100 && (
                  <button
                    onClick={() => {
                      fireConfettiAnimation();
                      setShow10thModuleModal(true);
                    }}
                    className="px-1.5 py-0.5 bg-[#00ff66]/20 border border-[#00ff66]/60 rounded text-[#00ff66] font-mono text-[8px] font-bold uppercase tracking-wider hover:bg-[#00ff66]/30 transition-all cursor-pointer flex items-center gap-1 animate-pulse"
                    title="Click to trigger celebration animation"
                    id="dashboard-celebrate-100-btn"
                  >
                    <PartyPopper className="w-3 h-3 text-[#00ff66]" />
                    <span>10/10</span>
                  </button>
                )}
              </div>
              <p className="font-mono text-[9px] text-[rgba(228,228,231,0.4)] mt-0.5 truncate uppercase">{startup.identity.tagline}</p>
            </div>
          </div>

          {/* Nav Categories */}
          <div className="p-4 max-h-[500px] overflow-y-auto space-y-4 custom-scrollbar">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <span className="block text-[8px] font-mono tracking-widest text-[rgba(228,228,231,0.4)] uppercase px-2">{cat}</span>
                {navItems
                  .filter((item) => item.category === cat)
                  .map((item) => {
                    const Icon = item.icon;
                    const isGenerated = !!startup[item.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof Startup];
                    const active = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-[10px] font-mono tracking-tight transition-all cursor-pointer uppercase ${
                          active
                            ? "bg-white/[0.03] text-[#00ff66] border border-[#00ff66]/20 shadow-sm shadow-[#00ff66]/5"
                            : "hover:bg-white/[0.01] text-[rgba(228,228,231,0.6)] hover:text-[#e4e4e7] border border-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${active ? "text-[#00ff66]" : "text-[rgba(228,228,231,0.4)]"}`} />
                          {item.label}
                        </span>
                        {item.id !== "chat" && item.id !== "export" && item.id !== "identity" && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isGenerated ? "bg-[#00ff66]" : "bg-white/10"}`} />
                        )}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-[rgba(228,228,231,0.1)] bg-white/[0.01] space-y-3 font-mono">
          {/* AI INSIGHTS SUMMARY EXECUTIVE AGENT BUTTON */}
          <button
            onClick={() => setIsAIInsightsOpen(true)}
            className="w-full bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] hover:text-white border border-[#00ff66]/30 hover:border-[#00ff66]/60 font-mono text-[10px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
            id="sidebar-ai-insights-btn"
            title="Launch specialized agent to generate executive project evolution summary"
          >
            <Brain className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
            <span>AI INSIGHTS SUMMARY</span>
          </button>

          <div>
            <div className="flex justify-between items-center text-[9px] mb-1">
              <span className="text-[rgba(228,228,231,0.4)] uppercase">FORGE COMPLETION</span>
              <span className="text-[#00ff66] font-black">{startup.progress}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-[#00ff66] h-full rounded-full transition-all duration-500"
                style={{ width: `${startup.progress}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] pt-1.5 border-t border-white/5">
            <span className="text-[rgba(228,228,231,0.4)] uppercase">WORKSPACE STATUS:</span>
            <button
              onClick={() => {
                const WORKSPACE_STATUSES = ["Drafting", "In-Review", "Refinement", "Finalized"] as const;
                const currentStatus = startup.status || (startup.progress <= 30 ? "Drafting" : startup.progress <= 75 ? "In-Review" : startup.progress < 100 ? "Refinement" : "Finalized");
                const nextIdx = (WORKSPACE_STATUSES.indexOf(currentStatus) + 1) % WORKSPACE_STATUSES.length;
                const nextStatus = WORKSPACE_STATUSES[nextIdx];
                let newProgress = startup.progress;
                if (nextStatus === "Drafting") newProgress = 25;
                else if (nextStatus === "In-Review") newProgress = 50;
                else if (nextStatus === "Refinement") newProgress = 75;
                else if (nextStatus === "Finalized") newProgress = 100;

                onUpdateStartup({
                  ...startup,
                  status: nextStatus,
                  progress: newProgress
                });
              }}
              className="text-[#00ff66] hover:text-white font-bold tracking-wider cursor-pointer flex items-center gap-1 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 px-2 py-0.5 rounded border border-[#00ff66]/30 transition-all"
              title="Click to toggle status (Drafting → In-Review → Refinement → Finalized)"
              id="dashboard-sidebar-status-btn"
            >
              <span>{startup.status || (startup.progress <= 30 ? "Drafting" : startup.progress <= 75 ? "In-Review" : startup.progress < 100 ? "Refinement" : "Finalized")}</span>
              <span className="text-[8px] opacity-70">⇄</span>
            </button>
          </div>

          {/* SIDEBAR LOG OUT OPTION */}
          {user && (
            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
              <div className="min-w-0 pr-1">
                <div className="text-[rgba(228,228,231,0.4)] text-[8px] uppercase tracking-wider font-mono">OPERATOR</div>
                <div className="text-[#e4e4e7] font-bold truncate font-mono">{user.name}</div>
              </div>
              <button
                onClick={() => onUpdateUser(null)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 font-mono text-[9px] px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider font-bold shrink-0 shadow-xs active:scale-95"
                id="sidebar-logout-btn"
                title="Log out of session"
              >
                <LogOut className="w-3 h-3" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* CORE DISPLAY CANVAS */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar relative z-10 bg-[#111113] text-[#e4e4e7]" id="dashboard-content-scroll">
        <AnimatePresence mode="wait">
          {generatingTab === activeTab ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="min-h-[500px] flex flex-col items-center justify-center text-center gap-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#00ff66]/10 blur-2xl rounded-full" />
                <Loader2 className="w-12 h-12 text-[#00ff66] animate-spin relative z-10" />
              </div>
              <div>
                <h4 className="font-syne font-black text-sm uppercase tracking-wider text-[#e4e4e7]">Forging Module Strategy</h4>
                <p className="text-xs text-[rgba(228,228,231,0.5)] mt-1 max-w-sm mx-auto leading-relaxed">
                  Our advanced AI business engineer is mapping operational metrics, researching benchmarks, and drafting modules.
                </p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg max-w-xs w-full shadow-md font-mono">
                <span className="text-[8px] font-bold text-[#00ff66] block tracking-widest uppercase">STAGE:</span>
                <p className="text-[10px] text-[rgba(228,228,231,0.7)] mt-0.5 uppercase">{loaderMessage}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* BRAND SETUP: IDENTITY TAB */}
              {activeTab === "identity" && (
                <div className="space-y-6" id="tab-identity-view">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Startup Brand Identity</h2>
                      <p className="text-xs text-slate-500 mt-1">Foundational naming, taglines, UVP, brand voice, and domain listings.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Elevator Pitch & UVP</h4>
                          <span className="text-[10px] bg-slate-50 px-2.5 py-1 rounded-full text-slate-600 border border-slate-150 font-semibold uppercase">30s Presentation</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-150">
                          "{startup.identity.elevatorPitch}"
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                          <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-1">
                            <span className="font-bold block uppercase tracking-wide text-[10px] text-blue-600">Unique Moat (UVP)</span>
                            <p className="text-slate-600 leading-relaxed">{startup.identity.uvp}</p>
                          </div>
                          <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl space-y-1">
                            <span className="font-bold block uppercase tracking-wide text-[10px] text-blue-600">Brand Persona Voice</span>
                            <p className="text-slate-600 leading-relaxed">{startup.identity.brandVoice}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Mission Statement</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{startup.identity.mission}</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Vision Statement</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{startup.identity.vision}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Aesthetic Parameters</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                            <span className="text-xs text-slate-500">Typography:</span>
                            <div className="text-right">
                              <span className="text-slate-900 text-xs font-bold block">{startup.identity.typography?.heading}</span>
                              <span className="text-slate-400 text-[10px]">{startup.identity.typography?.body}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">Brand Color Array</span>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="text-center space-y-1">
                                <div className="h-8 rounded-lg border border-slate-200" style={{ backgroundColor: startup.identity.brandColors?.primary }} />
                                <span className="text-[9px] font-mono text-slate-400">Prim</span>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="h-8 rounded-lg border border-slate-200" style={{ backgroundColor: startup.identity.brandColors?.secondary }} />
                                <span className="text-[9px] font-mono text-slate-400">Sec</span>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="h-8 rounded-lg border border-slate-200" style={{ backgroundColor: startup.identity.brandColors?.accent }} />
                                <span className="text-[9px] font-mono text-slate-400">Acc</span>
                              </div>
                              <div className="text-center space-y-1">
                                <div className="h-8 rounded-lg border border-slate-200" style={{ backgroundColor: startup.identity.brandColors?.bg }} />
                                <span className="text-[9px] font-mono text-slate-400">BG</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Social Handles & Domain</h4>
                        <div className="space-y-3 text-xs">
                          {startup.identity.domainIdeas?.slice(0, 3).map((dom, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-[11px]">
                              <span className="font-mono text-slate-900 font-semibold">{dom}</span>
                              <span className="text-[9px] font-bold text-emerald-700 px-1.5 py-0.5 bg-emerald-50 border border-emerald-150 rounded">Available</span>
                            </div>
                          ))}
                          <hr className="border-slate-100 my-2" />
                          <div className="space-y-1.5 text-[10px] text-slate-500">
                            <div>Twitter: <span className="text-slate-800 font-mono font-bold">{startup.identity.socialHandles?.twitter}</span></div>
                            <div>LinkedIn: <span className="text-slate-800 font-mono font-bold">{startup.identity.socialHandles?.linkedin}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULES THAT REQUIRE GENERATION VIEW GENERATOR CARD */}
              {activeTab !== "identity" && activeTab !== "insights" && activeTab !== "chat" && activeTab !== "export" && activeTab !== "mock-interview" && activeTab !== "landing-page" && !startup[activeTab.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof Startup] ? (
                <div className="min-h-[450px] bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-6 shadow-sm" id="generate-card-placeholder">
                  <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Forge Module: {activeTab.replace("-", " ")}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      This strategy vertical is currently unmapped. Click below to launch our state-of-the-art AI analyst to synthesize benchmarks, SWOT points, or architectures for this vertical.
                    </p>
                  </div>
                  <button
                    onClick={() => handleGenerateModule(activeTab)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5 text-xs uppercase tracking-wide transition-all"
                  >
                    Forge Strategy Node <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* MARKET RESEARCH TAB */}
                  {activeTab === "market-research" && startup.marketResearch && (
                    <div className="space-y-6" id="tab-market-research-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Market Analysis & SWOT</h2>
                          <p className="text-xs text-slate-500 mt-1">Concentric TAM/SAM/SOM sizing, sector compounding, customer persona logs, and SWOT/PESTLE quadrants.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportSWOTAnalysisCSV(startup)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                            title="Export SWOT Analysis to CSV Spreadsheet"
                            id="export-swot-csv-btn"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Export SWOT (CSV)</span>
                          </button>
                          <button
                            onClick={() => handleGenerateModule("market-research")}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                          >
                            Re-Forge Module
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Concentric Sizing */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 flex flex-col justify-between shadow-sm">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">TAM • SAM • SOM Sizing</h4>
                          <div className="flex justify-center py-4">
                            {/* Concentric SVGs diagram */}
                            <svg className="w-44 h-44" viewBox="0 0 200 200">
                              <circle cx="100" cy="100" r="95" fill="rgba(37,99,235,0.02)" stroke="#2563eb" strokeWidth="1" />
                              <circle cx="100" cy="100" r="65" fill="rgba(79,70,229,0.04)" stroke="#4f46e5" strokeWidth="1" />
                              <circle cx="100" cy="100" r="35" fill="rgba(16,185,129,0.06)" stroke="#10b981" strokeWidth="1" />
                              <text x="100" y="25" textAnchor="middle" fill="#2563eb" fontSize="9" fontWeight="bold">TAM</text>
                              <text x="100" y="55" textAnchor="middle" fill="#4f46e5" fontSize="9" fontWeight="bold">SAM</text>
                              <text x="100" y="105" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">SOM</text>
                            </svg>
                          </div>
                          <div className="space-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                            <div><span className="font-bold text-blue-600">TAM:</span> {startup.marketResearch.tam}</div>
                            <div><span className="font-bold text-indigo-600">SAM:</span> {startup.marketResearch.sam}</div>
                            <div><span className="font-bold text-emerald-600">SOM:</span> {startup.marketResearch.som}</div>
                          </div>
                        </div>

                        {/* General stats & SWOT */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
                            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Sector CAGR & Secular Trends</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                              <div>
                                <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wide">Industry Sizing Context</span>
                                <p className="leading-relaxed mt-1 font-medium">{startup.marketResearch.industrySize}</p>
                              </div>
                              <div>
                                <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wide">Growth Drivers</span>
                                <p className="leading-relaxed mt-1 font-medium">{startup.marketResearch.growthTrends}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SWOT Matrix */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">SWOT Quadrant Matrix</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                            <span className="font-bold text-emerald-700 text-xs block uppercase">Strengths (Internal)</span>
                            <ul className="space-y-1 text-xs text-slate-700">
                              {startup.marketResearch.swot.strengths.slice(0, 3).map((s, i) => <li key={i} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> {s}</li>)}
                            </ul>
                          </div>
                          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2">
                            <span className="font-bold text-amber-700 text-xs block uppercase">Weaknesses (Internal)</span>
                            <ul className="space-y-1 text-xs text-slate-700">
                              {startup.marketResearch.swot.weaknesses.slice(0, 3).map((w, i) => <li key={i} className="flex gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> {w}</li>)}
                            </ul>
                          </div>
                          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                            <span className="font-bold text-blue-700 text-xs block uppercase">Opportunities (External)</span>
                            <ul className="space-y-1 text-xs text-slate-700">
                              {startup.marketResearch.swot.opportunities.slice(0, 3).map((o, i) => <li key={i} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> {o}</li>)}
                            </ul>
                          </div>
                          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl space-y-2">
                            <span className="font-bold text-rose-700 text-xs block uppercase">Threats (External)</span>
                            <ul className="space-y-1 text-xs text-slate-700">
                              {startup.marketResearch.swot.threats.slice(0, 3).map((t, i) => <li key={i} className="flex gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" /> {t}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Customer Personas */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Ideal Customer Personas (ICP)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {startup.marketResearch.customerPersonas.map((cp, i) => (
                            <div key={i} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-3 flex flex-col justify-between shadow-sm">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-slate-900 text-sm">{cp.name}</h5>
                                    <p className="text-[10px] text-slate-500">{cp.role} • {cp.demographics}</p>
                                  </div>
                                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs border border-blue-100">{i+1}</span>
                                </div>
                                <p className="text-[11px] text-slate-600 italic leading-relaxed">"{cp.quote}"</p>
                              </div>
                              <hr className="border-slate-200" />
                              <div className="space-y-2 text-[10px] text-slate-500">
                                <div><span className="font-bold text-slate-700 block mb-0.5">Pain Points:</span> {cp.painPoints.join(", ")}</div>
                                <div><span className="font-bold text-slate-700 block mb-0.5">Core Goals:</span> {cp.goals.join(", ")}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COMPETITOR ANALYSIS TAB */}
                  {activeTab === "competitor-analysis" && startup.competitorAnalysis && (
                    <div className="space-y-6" id="tab-competitor-analysis-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Competitor Landscape</h2>
                          <p className="text-xs text-slate-500 mt-1">Strengths, pricing tiers, weaknesses, and key defensive positions.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("competitor-analysis")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {startup.competitorAnalysis.competitors.map((comp, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all shadow-sm">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                                <h5 className="font-bold text-slate-900 text-sm">{comp.name}</h5>
                                <span className="text-[10px] font-semibold text-slate-500 font-mono">{comp.pricing}</span>
                              </div>
                              <div className="space-y-3 text-xs">
                                <div>
                                  <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wide">Key Features</span>
                                  <p className="text-slate-600 leading-relaxed mt-0.5 font-medium">{comp.features.join(", ")}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 pt-1">
                                  <div>
                                    <span className="text-[10px] text-emerald-600 block font-bold uppercase">Strengths</span>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{comp.strengths.join(", ")}</p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-amber-600 block font-bold uppercase">Weaknesses</span>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{comp.weaknesses.join(", ")}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-600 font-bold leading-relaxed">
                              Our differentiation: {comp.differentiation}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-850 uppercase tracking-wider">Landscape Positioning & Wide Gaps</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                          <div>
                            <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wide mb-1">Sector Intensity</span>
                            <p className="font-medium">{startup.competitorAnalysis.marketOverview}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wide mb-1">Opportunities to Disrupt</span>
                            <p className="font-medium">{startup.competitorAnalysis.opportunitiesToDifferentiate}</p>
                          </div>
                        </div>
                      </div>

                      {/* D3 ANIMATED MARKET GROWTH PROJECTION */}
                      <MarketGrowthProjection startup={startup} />
                    </div>
                  )}

                  {/* BUSINESS MODEL TAB */}
                  {activeTab === "business-model" && startup.businessModel && (
                    <div className="space-y-6" id="tab-business-model-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Business Model Canvas</h2>
                          <p className="text-xs text-slate-500 mt-1">Operational canvas structures, monetization strategies, and core pricing plans.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("business-model")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      {/* Canvas Bento Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3" id="canvas-bento-grid">
                        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 md:col-span-1 shadow-sm text-slate-800">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Key Partners</span>
                          <ul className="space-y-1 text-xs text-slate-600 list-disc pl-3">{startup.businessModel.canvas.keyPartners.map((x, i) => <li key={i}>{x}</li>)}</ul>
                        </div>
                        <div className="md:col-span-1 space-y-3">
                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-sm text-slate-800">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Key Activities</span>
                            <ul className="space-y-1 text-xs text-slate-600 list-disc pl-3">{startup.businessModel.canvas.keyActivities.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
                          </div>
                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-sm text-slate-800">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Key Resources</span>
                            <ul className="space-y-1 text-xs text-slate-600 list-disc pl-3">{startup.businessModel.canvas.keyResources.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50/20 border border-blue-150 rounded-xl space-y-2 md:col-span-1 shadow-sm text-slate-800">
                          <span className="text-[9px] font-bold text-blue-600 block uppercase tracking-wide">Value Propositions</span>
                          <ul className="space-y-1 text-xs text-slate-600 list-disc pl-3">{startup.businessModel.canvas.valuePropositions.map((x, i) => <li key={i}>{x}</li>)}</ul>
                        </div>
                        <div className="md:col-span-1 space-y-3">
                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-sm text-slate-800">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Relationships</span>
                            <ul className="space-y-1 text-xs text-slate-600 list-disc pl-3">{startup.businessModel.canvas.customerRelationships.slice(0, 2).map((x, i) => <li key={i}>{x}</li>)}</ul>
                          </div>
                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-sm text-slate-800">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Channels</span>
                            <ul className="space-y-1 text-xs text-slate-600 list-disc pl-3">{startup.businessModel.canvas.channels.slice(0, 3).map((x, i) => <li key={i}>{x}</li>)}</ul>
                          </div>
                        </div>
                        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 md:col-span-1 shadow-sm text-slate-800">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Customer Segments</span>
                          <ul className="space-y-1 text-xs text-slate-600 list-disc pl-3">{startup.businessModel.canvas.customerSegments.map((x, i) => <li key={i}>{x}</li>)}</ul>
                        </div>
                      </div>

                      {/* Pricing strategy plans */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-855 uppercase tracking-wider">Strategic Pricing Architecture</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {startup.businessModel.pricingStrategy.map((tier, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-150 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:border-blue-300 transition-all">
                              <div>
                                <h5 className="font-bold text-slate-800 text-sm">{tier.tier}</h5>
                                <p className="text-lg font-extrabold text-blue-600 mt-1">{tier.price}</p>
                                <hr className="border-slate-200 my-3" />
                                <ul className="space-y-1.5 text-[11px] text-slate-500">
                                  {tier.features.slice(0, 4).map((f, i) => <li key={i} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> {f}</li>)}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FINANCIAL PLANNER TAB */}
                  {activeTab === "financial-planner" && startup.financialPlanner && (
                    <div className="space-y-6" id="tab-financial-planner-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">12-Month Financial Planner</h2>
                          <p className="text-xs text-slate-500 mt-1">Starting launch budgets, itemized operating overheads, and interactive projection trends.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportFinancialProjectionsCSV(startup)}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                            title="Export Financial Projections to CSV Spreadsheet"
                            id="export-financial-csv-btn"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Export Projections (CSV)</span>
                          </button>
                          <button
                            onClick={() => handleGenerateModule("financial-planner")}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                          >
                            Re-Forge Module
                          </button>
                        </div>
                      </div>

                      {/* Projections Line Chart using SVG (Highly Robust & Stunning) */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">12-Month Profitability Curve</h4>
                        <div className="flex justify-center">
                          {/* Render beautiful interactive SVG line chart */}
                          <svg className="w-full max-w-2xl h-48" viewBox="0 0 600 200">
                            {/* Gridlines */}
                            <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1.5" />
                            <line x1="40" y1="85" x2="580" y2="85" stroke="#f1f5f9" strokeWidth="1.5" />
                            <line x1="40" y1="150" x2="580" y2="150" stroke="#f1f5f9" strokeWidth="1.5" />
                            
                            {/* Projections calculations */}
                            {/* Month 1-12 nodes: (40 + idx*48) => range from 40 to 568 */}
                            {/* Map values to Y coordinate: y_pos = 150 - (val / 22000)*130 */}
                            {/* Draw Revenue Line (blue) */}
                            <polyline
                              fill="none"
                              stroke="#2563eb"
                              strokeWidth="2.5"
                              points={startup.financialPlanner.projections.map((p, idx) => {
                                const x = 40 + idx * 48;
                                const y = 150 - (p.revenue / 22000) * 130;
                                return `${x},${y}`;
                              }).join(" ")}
                            />

                            {/* Draw Expenses Line (rose) */}
                            <polyline
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="2"
                              points={startup.financialPlanner.projections.map((p, idx) => {
                                const x = 40 + idx * 48;
                                const y = 150 - (p.expenses / 22000) * 130;
                                return `${x},${y}`;
                              }).join(" ")}
                            />

                            {/* Points and Labels */}
                            {startup.financialPlanner.projections.map((p, idx) => {
                              const x = 40 + idx * 48;
                              const y_rev = 150 - (p.revenue / 22000) * 130;
                              return (
                                <g key={idx}>
                                  <circle cx={x} cy={y_rev} r="3.5" fill="#2563eb" />
                                  {idx % 2 === 0 && (
                                    <text x={x} y="172" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="semibold">M{idx + 1}</text>
                                  )}
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                        <div className="flex gap-6 justify-center text-xs font-semibold">
                          <span className="flex items-center gap-1.5 text-blue-600"><span className="w-2.5 h-2.5 bg-blue-600 rounded-full" /> Month Revenue ($)</span>
                          <span className="flex items-center gap-1.5 text-rose-500"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> Month Expenses ($)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Startup Budget items */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Startup Launch Budget Allocation</h4>
                          <div className="space-y-2">
                            {startup.financialPlanner.budget.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-150 shadow-sm">
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-slate-800 block">{item.item}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.category}</span>
                                </div>
                                <span className="font-mono font-bold text-slate-900">${item.cost.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Monthly Expenses */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Monthly Operational Expenses</h4>
                          <div className="space-y-2">
                            {startup.financialPlanner.monthlyExpenses.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-150 shadow-sm">
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-slate-800 block">{item.item}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.category}</span>
                                </div>
                                <span className="font-mono font-bold text-slate-900">${item.cost.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Break-Even & Profit Outlook</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Break-Even Timeline</span>
                            <span className="text-base font-extrabold text-slate-900">Month {startup.financialPlanner.breakEvenMonths}</span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Required Break-Even Revenue</span>
                            <span className="text-base font-extrabold text-slate-900">${startup.financialPlanner.breakEvenRevenue.toLocaleString()}/mo</span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Projected Year 1 Profits</span>
                            <span className="text-base font-extrabold text-emerald-600">${startup.financialPlanner.profitProjectionYear1.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mt-4 p-3 bg-slate-50 rounded-xl border border-slate-150 font-medium italic">
                          {startup.financialPlanner.cashFlowEstimate}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* MVP PLANNER TAB */}
                  {activeTab === "mvp-planner" && startup.mvpPlanner && (
                    <div className="space-y-6" id="tab-mvp-planner-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">MVP Developer Scope</h2>
                          <p className="text-xs text-slate-500 mt-1">Core backlog features, prioritized task lists, agile sprints, and chronological roadmaps.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("mvp-planner")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      {/* MVP Features Backlog */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Priority backlog specification</h4>
                        <div className="space-y-2.5">
                          {startup.mvpPlanner.features.slice(0, 5).map((feat, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs shadow-sm">
                              <div className="space-y-1 max-w-sm">
                                <span className="font-bold text-slate-900 text-sm block">{feat.name}</span>
                                <p className="text-slate-500 leading-relaxed font-medium">{feat.description}</p>
                              </div>
                              <div className="flex gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                  feat.priority === "Must-Have" ? "bg-blue-50 text-blue-700 border-blue-100" :
                                  feat.priority === "Should-Have" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                  "bg-slate-100 text-slate-500 border-slate-200"
                                }`}>
                                  {feat.priority}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[9px] font-mono text-slate-400 uppercase font-bold">Complexity: {feat.complexity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chronological Roadmap Timeline */}
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Chronological launch roadmap</h4>
                        <div className="space-y-4">
                          <div className="flex gap-4 items-start relative pb-4 border-l border-slate-150 pl-4 ml-2">
                            <span className="w-5 h-5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 absolute -left-[10px] top-0.5 z-10">1</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">{startup.mvpPlanner.roadmap.phase1}</p>
                          </div>
                          <div className="flex gap-4 items-start relative pb-4 border-l border-slate-150 pl-4 ml-2">
                            <span className="w-5 h-5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 absolute -left-[10px] top-0.5 z-10">2</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">{startup.mvpPlanner.roadmap.phase2}</p>
                          </div>
                          <div className="flex gap-4 items-start relative pb-4 border-l border-slate-150 pl-4 ml-2">
                            <span className="w-5 h-5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 absolute -left-[10px] top-0.5 z-10">3</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">{startup.mvpPlanner.roadmap.phase3}</p>
                          </div>
                          <div className="flex gap-4 items-start relative pl-4 ml-2">
                            <span className="w-5 h-5 bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 absolute -left-[10px] top-0.5 z-10">4</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">{startup.mvpPlanner.roadmap.phase4}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TECHNICAL ARCHITECTURE TAB */}
                  {activeTab === "technical-architecture" && startup.technicalArchitecture && (
                    <div className="space-y-6" id="tab-tech-architecture-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Technical Architecture Design</h2>
                          <p className="text-xs text-slate-500 mt-1">Recommended technology stack layer models, database schemas, and endpoints.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("technical-architecture")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tech stack stack items */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 lg:col-span-1 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Infrastructure Stack</h4>
                          <div className="space-y-3">
                            {startup.technicalArchitecture.techStack.map((layer, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1 shadow-sm">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">{layer.layer}</span>
                                <span className="text-xs font-bold text-slate-900 block">{layer.tech}</span>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{layer.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Database table columns */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 lg:col-span-2 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Relational Database Schemas</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {startup.technicalArchitecture.databaseDesign.map((table, i) => (
                              <div key={i} className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2.5 shadow-sm text-slate-900">
                                <span className="font-mono font-bold text-xs text-slate-900 border-b border-slate-200 pb-1 block">Table: {table.name}</span>
                                <div className="space-y-1 font-mono text-[10px] text-slate-500">
                                  {table.columns.map((col, idx) => (
                                    <div key={idx} className="flex justify-between items-start">
                                      <span className="text-slate-700">{col.name}</span>
                                      <span className="text-blue-600 font-bold text-right">{col.type}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRD TAB */}
                  {activeTab === "prd" && startup.prd && (
                    <div className="space-y-6" id="tab-prd-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Product Requirements Document (PRD)</h2>
                          <p className="text-xs text-slate-500 mt-1">Product problem statements, functional priority lists, acceptance tests, and product KPIs.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("prd")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Problem statement & goals</h4>
                        <p className="text-xs text-slate-600 leading-relaxed italic p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                          "{startup.prd.problemStatement}"
                        </p>
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Strategic Product Metrics (KPIs)</span>
                          <ul className="space-y-1 text-xs text-slate-600 font-medium">
                            {startup.prd.kpis.map((k, i) => <li key={i} className="flex gap-1.5"><Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> {k}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Functional product backlog specification</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {startup.prd.functionalRequirements.map((fr, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs flex justify-between items-center shadow-sm">
                              <span className="text-slate-700 leading-relaxed font-semibold">{fr.req}</span>
                              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">{fr.id}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MARKETING PLANNER TAB */}
                  {activeTab === "marketing-planner" && startup.marketingPlanner && (
                    <div className="space-y-6" id="tab-marketing-planner-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Marketing Planner & GTM</h2>
                          <p className="text-xs text-slate-500 mt-1">Go-To-Market strategies, launch calendars, social content, and ad copy ideas.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("marketing-planner")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 lg:col-span-2 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">GTM Launch checklist</h4>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Pre-Launch Timeline Tasks</span>
                              <ul className="space-y-1 text-xs text-slate-600 font-medium">{startup.marketingPlanner.launchChecklist.preLaunch.slice(0, 3).map((item, i) => <li key={i} className="flex gap-2"><CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" /> {item}</li>)}</ul>
                            </div>
                            <hr className="border-slate-100" />
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Launch Day Checklist</span>
                              <ul className="space-y-1 text-xs text-slate-600 font-medium">{startup.marketingPlanner.launchChecklist.launchDay.slice(0, 2).map((item, i) => <li key={i} className="flex gap-2"><CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" /> {item}</li>)}</ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 lg:col-span-1 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">SEO Focus Keywords</h4>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {startup.marketingPlanner.seoKeywords.map((k, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-xs font-semibold text-slate-600 rounded-lg shadow-xs">{k}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INVESTOR PLANNER TAB */}
                  {activeTab === "investor-section" && startup.investorSection && (
                    <div className="space-y-6" id="tab-investor-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Investor Relations & Pitch</h2>
                          <p className="text-xs text-slate-500 mt-1">Capital requirements, itemized fund uses, deck outlines, and summaries.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("investor-section")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Mock Interview Launch Callout */}
                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 shadow-md lg:col-span-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <span className="bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                              AUDIO / MIC PERMISSION CONTROLLED
                            </span>
                            <h4 className="font-syne font-black text-base uppercase tracking-tight text-white flex items-center gap-2">
                              <Mic className="w-5 h-5 text-[#00ff66]" />
                              Practice Pitch: Mock Investor Interview
                            </h4>
                            <p className="text-xs text-slate-300 font-mono">
                              Test your elevator pitch, valuation defense, and Q&A with custom AI investor personas. Choose to allow or disallow microphone access anytime.
                            </p>
                          </div>

                          <button
                            onClick={() => setActiveTab("mock-interview")}
                            className="bg-[#00ff66] hover:bg-[#00cc52] text-black font-mono font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-[#00ff66]/20 cursor-pointer flex-shrink-0 flex items-center gap-2"
                            id="launch-mock-interview-from-investor"
                          >
                            <span>START MOCK INTERVIEW</span>
                            <ChevronRight className="w-4 h-4 text-black" />
                          </button>
                        </div>

                        {/* Funding metrics */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 lg:col-span-1 shadow-sm text-slate-900 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Investment Ask</h4>
                            <span className="text-2xl font-black text-slate-900 mt-2 block">${startup.investorSection.investmentAsk.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400 block mt-1 uppercase font-bold tracking-wide">Target Seed Round Capital</span>
                          </div>
                          <hr className="border-slate-100" />
                          <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed font-medium">
                            <div>Highlights: <span className="text-slate-700">{startup.investorSection.financialHighlights}</span></div>
                          </div>
                        </div>

                        {/* Use of funds percentages */}
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 lg:col-span-2 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Strategic Round Allocation</h4>
                          <div className="space-y-3 pt-2">
                            {startup.investorSection.useOfFunds.map((u, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-slate-700">{u.item}</span>
                                  <span className="font-bold text-blue-600">{u.percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${u.percentage}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LEGAL CHECKLIST TAB */}
                  {activeTab === "legal-checklist" && startup.legalChecklist && (
                    <div className="space-y-6" id="tab-legal-view">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-5">
                        <div>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Legal & Trademark Registry</h2>
                          <p className="text-xs text-slate-500 mt-1">Incorporation blueprints, privacy policy guidelines, and IP protection checklist.</p>
                        </div>
                        <button
                          onClick={() => handleGenerateModule("legal-checklist")}
                          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Re-Forge Module
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Company registration timeline</h4>
                          <div className="space-y-2">
                            {startup.legalChecklist.companyRegistration.map((step, i) => (
                              <div key={i} className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-600 leading-relaxed font-semibold shadow-xs">
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm text-slate-900">
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Trademark search checklist</h4>
                          <div className="space-y-2">
                            {startup.legalChecklist.trademarkChecklist.map((item, i) => (
                              <div key={i} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed font-medium">
                                <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EMBEDDED SUB-COMPONENTS */}
                  {activeTab === "insights" && (
                    <StartupInsights
                      startup={startup}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                      onGenerateModule={(tab) => handleGenerateModule(tab)}
                    />
                  )}
                  {activeTab === "milestones" && (
                    <MilestoneTracker startup={startup} onUpdateStartup={onUpdateStartup} />
                  )}
                  {activeTab === "mock-interview" && <MockInterviewPractice startup={startup} />}
                  {activeTab === "landing-page" && (
                    <StartupLandingPage
                      startup={startup}
                      onGenerateLandingPage={() => handleGenerateModule("landing-page")}
                      isGenerating={generatingTab === "landing-page"}
                    />
                  )}
                  {activeTab === "chat" && <StartupChat startup={startup} onUpdateStartup={onUpdateStartup} />}
                  {activeTab === "export" && <ExportDocs startup={startup} />}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI INSIGHTS SUMMARY MODAL OVERLAY */}
      <AIInsightsSummaryModal
        startup={startup}
        isOpen={isAIInsightsOpen}
        onClose={() => setIsAIInsightsOpen(false)}
        onUpdateStartup={onUpdateStartup}
      />

      {/* 10TH MODULE CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {show10thModuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow10thModuleModal(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0c0c0e] border-2 border-[#00ff66]/60 rounded-3xl p-8 shadow-[0_0_80px_rgba(0,255,102,0.35)] space-y-6 font-mono relative overflow-hidden text-center"
              id="celebration-10th-module-modal"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setShow10thModuleModal(false)}
                  className="p-2 text-[rgba(228,228,231,0.5)] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00ff66]/10 border-2 border-[#00ff66] rounded-full shadow-[0_0_30px_rgba(0,255,102,0.4)] mx-auto animate-bounce">
                <PartyPopper className="w-10 h-10 text-[#00ff66]" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30 px-3 py-1 rounded-full inline-block">
                  🏆 MILESTONE ACHIEVED • 10/10 MODULES FORGED
                </span>
                <h2 className="font-syne font-black text-2xl text-white uppercase tracking-wider">
                  STRATEGY 100% FORGED!
                </h2>
                <p className="text-xs text-[rgba(228,228,231,0.7)] max-w-md mx-auto leading-relaxed">
                  Congratulations! You have successfully completed all 10 core strategic modules for{" "}
                  <strong className="text-[#00ff66] font-extrabold">{startup.identity.name}</strong>. Your workspace is fully primed for pitch decks, market entry, and investor calls.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-left">
                <div>
                  <span className="text-[9px] uppercase text-[rgba(228,228,231,0.4)] block font-bold">STARTUP NAME</span>
                  <span className="text-xs font-syne font-bold text-white uppercase truncate block mt-0.5">{startup.identity.name}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[rgba(228,228,231,0.4)] block font-bold">COMPLETION STATUS</span>
                  <span className="text-xs font-mono font-bold text-[#00ff66] uppercase flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" /> 10/10 FORGED
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    fireConfettiAnimation();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PartyPopper className="w-4 h-4 text-amber-400" />
                  <span>MORE CONFETTI 🎉</span>
                </button>

                <button
                  onClick={() => {
                    setShow10thModuleModal(false);
                    setActiveTab("export");
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#00ff66] hover:bg-[#00cc52] text-[#0c0c0e] font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-[#00ff66]/30 flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#0c0c0e]" />
                  <span>VIEW FULL DECK & EXPORT</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
