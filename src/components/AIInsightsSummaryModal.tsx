import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Bot,
  Brain,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Copy,
  Check,
  RefreshCw,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { Startup, AIInsightsSummary } from "../types";
import { exportFinancialProjectionsCSV, exportSWOTAnalysisCSV, exportCombinedStartupCSV } from "../utils/csvExport";

interface AIInsightsSummaryModalProps {
  startup: Startup;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStartup?: (updated: Startup) => void;
}

export default function AIInsightsSummaryModal({
  startup,
  isOpen,
  onClose,
  onUpdateStartup
}: AIInsightsSummaryModalProps) {
  const [summary, setSummary] = useState<AIInsightsSummary | null>(startup.aiInsightsSummary || null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Synthesizing chat interaction transcripts...",
    "Extracting strategic pivots & founder decisions...",
    "Benchmarking project evolution against industry standards...",
    "Formulating executive trajectory and risk mitigation brief..."
  ];

  const fetchInsightsSummary = async () => {
    setIsLoading(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
    }, 1400);

    try {
      const response = await fetch("/api/ai-insights-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: AIInsightsSummary = await response.json();
      setSummary(data);

      // Persist to startup
      onUpdateStartup({
        ...startup,
        aiInsightsSummary: data
      });
    } catch (err) {
      console.error("Failed to generate AI insights summary:", err);
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !summary && !isLoading) {
      fetchInsightsSummary();
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (!summary) return;
    const text = `# EXECUTIVE AI STRATEGY SUMMARY: ${startup.identity.name.toUpperCase()}
Generated: ${new Date(summary.generatedAt || Date.now()).toLocaleDateString()}

## EXECUTIVE OVERVIEW
${summary.executiveOverview}

## PROJECT EVOLUTION & TRAJECTORY
${summary.evolutionSummary}

## KEY STRATEGIC DECISIONS & PIVOTS
${summary.keyDecisions.map((d, i) => `### ${i + 1}. ${d.decision} [${d.category || "Strategic"}]
* **Context:** ${d.context}
* **Impact:** ${d.impact}
* **Phase:** ${d.timestamp || "Active"}`).join("\n\n")}

## STRATEGIC TRAJECTORY
${summary.strategicTrajectory.map((t) => `* **${t.stage} (${t.horizon}):** ${t.focus}`).join("\n")}

## CRITICAL TAKEAWAYS
${summary.criticalTakeaways.map((c) => `* ${c}`).join("\n")}

## ACTIONABLE RECOMMENDATIONS
${summary.actionableRecommendations.map((a) => `* ${a}`).join("\n")}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!summary) return;
    const text = `# EXECUTIVE AI STRATEGY SUMMARY: ${startup.identity.name.toUpperCase()}
*Generated via StartupForge AI Executive Agent on ${new Date().toLocaleString()}*

---

## 1. Executive Overview
${summary.executiveOverview}

## 2. Project Evolution & Decision Log
${summary.evolutionSummary}

## 3. Key Decisions & Strategic Pivots
${summary.keyDecisions.map((d, i) => `### ${i + 1}. ${d.decision}
* **Category:** ${d.category || "General"}
* **Context & Trigger:** ${d.context}
* **Business Impact:** ${d.impact}
* **Timeline Milestone:** ${d.timestamp || "Established"}
`).join("\n")}

## 4. Phased Strategic Trajectory
${summary.strategicTrajectory.map((t) => `* **${t.stage}** \`[${t.horizon}]\`: ${t.focus}`).join("\n")}

## 5. Critical Executive Takeaways
${summary.criticalTakeaways.map((c) => `* ${c}`).join("\n")}

## 6. Actionable Next Steps
${summary.actionableRecommendations.map((a) => `* ${a}`).join("\n")}
`;

    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${startup.identity.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_executive_summary.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"
        id="ai-insights-modal-backdrop"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[92vh] bg-[#0d0d11] border border-[#00ff66]/40 rounded-3xl shadow-[0_0_60px_rgba(0,255,102,0.15)] flex flex-col overflow-hidden text-[#e4e4e7] font-mono relative"
          id="ai-insights-summary-modal-content"
        >
          {/* MODAL HEADER */}
          <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.2)]">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-syne font-black text-sm md:text-base text-white uppercase tracking-wider">
                    Executive AI Insights Summary
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#00ff66]/20 border border-[#00ff66]/40 text-[#00ff66] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Agent Analyzed
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Deep retrospective synthesis of chat history, founder discussions, and strategic pivots for{" "}
                  <strong className="text-white">{startup.identity.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchInsightsSummary}
                disabled={isLoading}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-[#00ff66] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1 text-[10px] uppercase font-bold"
                title="Re-analyze chat history & refresh summary"
                id="refresh-ai-insights-btn"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#00ff66]" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                id="close-ai-insights-modal-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MODAL BODY */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00ff66]/20 blur-xl rounded-full" />
                  <div className="w-16 h-16 rounded-full bg-[#00ff66]/10 border-2 border-[#00ff66] flex items-center justify-center animate-spin relative z-10">
                    <Bot className="w-8 h-8 text-[#00ff66]" />
                  </div>
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="font-syne font-bold text-sm text-white uppercase tracking-wider">
                    Analyzing Project Trajectory
                  </h4>
                  <p className="text-xs text-[#00ff66] animate-pulse">
                    {loadingMessages[loadingStep]}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Scanning {startup.chatHistory?.length || 0} discussion messages and established blueprint modules...
                  </p>
                </div>
              </div>
            ) : summary ? (
              <>
                {/* 1. EXECUTIVE OVERVIEW */}
                <div className="bg-gradient-to-br from-[#00ff66]/10 via-slate-950/80 to-slate-900/60 border border-[#00ff66]/30 rounded-2xl p-5 md:p-6 space-y-3 shadow-[0_0_30px_rgba(0,255,102,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#00ff66] tracking-widest uppercase flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> 1. EXECUTIVE SYNOPSIS
                    </span>
                    {summary.generatedAt && (
                      <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(summary.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans font-medium">
                    {summary.executiveOverview}
                  </p>
                </div>

                {/* 2. PROJECT EVOLUTION */}
                <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-5 md:p-6 space-y-3">
                  <span className="text-[9px] font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> 2. PROJECT EVOLUTION & DISCOVERY NARRATIVE
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-3 whitespace-pre-line">
                    {summary.evolutionSummary}
                  </div>
                </div>

                {/* 3. KEY DECISIONS & STRATEGIC PIVOTS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-amber-400 tracking-widest uppercase flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> 3. KEY STRATEGIC DECISIONS & PIVOTS IDENTIFIED
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {summary.keyDecisions.length} Decisions Extracted
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summary.keyDecisions.map((decision, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 md:p-5 flex flex-col justify-between space-y-3 transition-all group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-syne font-bold text-xs text-white group-hover:text-[#00ff66] transition-colors leading-snug">
                              {decision.decision}
                            </h5>
                            <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                              {decision.category || "Strategic"}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[11px] font-sans">
                            <p className="text-slate-400 leading-relaxed">
                              <strong className="text-slate-300">Context:</strong> {decision.context}
                            </p>
                            <p className="text-slate-300 leading-relaxed bg-black/30 p-2 rounded-lg border border-slate-850">
                              <strong className="text-[#00ff66]">Impact:</strong> {decision.impact}
                            </p>
                          </div>
                        </div>

                        {decision.timestamp && (
                          <div className="pt-2 border-t border-slate-850 text-[9px] text-slate-500 font-mono flex items-center gap-1">
                            <span>Stage:</span>
                            <span className="text-slate-400 font-semibold">{decision.timestamp}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. STRATEGIC TRAJECTORY TIMELINE */}
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-[#00ff66] tracking-widest uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 4. STRATEGIC TRAJECTORY & ROADMAP HORIZONS
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {summary.strategicTrajectory.map((traj, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <span className="text-[#00ff66] font-bold uppercase">{traj.stage}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {traj.horizon}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans font-medium leading-relaxed mt-1">
                          {traj.focus}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. CRITICAL TAKEAWAYS & ACTIONABLE RECOMMENDATIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Critical Takeaways */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <span className="text-[9px] font-bold text-amber-400 tracking-widest uppercase block">
                      CRITICAL TAKEAWAYS FOR FOUNDERS
                    </span>
                    <ul className="space-y-2 text-xs font-sans text-slate-300">
                      {summary.criticalTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Immediate Action Items */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <span className="text-[9px] font-bold text-cyan-400 tracking-widest uppercase block">
                      IMMEDIATE HIGH-LEVERAGE ACTIONS
                    </span>
                    <ul className="space-y-2 text-xs font-sans text-slate-300">
                      {summary.actionableRecommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center space-y-3">
                <p className="text-xs text-slate-400">No summary generated yet.</p>
                <button
                  onClick={fetchInsightsSummary}
                  className="px-4 py-2 bg-[#00ff66] text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Generate Summary
                </button>
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="p-4 md:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => exportFinancialProjectionsCSV(startup)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono"
                title="Download Financial Projection Model as CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Financials CSV</span>
              </button>
              <button
                onClick={() => exportSWOTAnalysisCSV(startup)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono"
                title="Download SWOT Matrix as CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                <span>SWOT CSV</span>
              </button>
              <button
                onClick={() => exportCombinedStartupCSV(startup)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono hidden sm:flex"
                title="Download Complete Master Workbook CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                <span>Master Workbook CSV</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!summary}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono disabled:opacity-50"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                    <span className="text-[#00ff66]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                disabled={!summary}
                className="px-4 py-2 bg-[#00ff66] hover:bg-[#00cc52] text-black font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-[#00ff66]/20 flex items-center gap-1.5 text-[11px] font-mono disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-black" />
                <span>Download Executive Brief (.md)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
