import React from "react";
import { motion } from "motion/react";
import { Startup } from "../types";
import { Sparkles, Activity, CheckCircle2, Compass, Layers, Clock } from "lucide-react";

interface WorkspaceHoverTooltipProps {
  startup: Startup;
  statusUpdate: string;
  isOpen: boolean;
  completedModules: number;
  totalModules: number;
}

export const WorkspaceHoverTooltip: React.FC<WorkspaceHoverTooltipProps> = ({
  startup,
  statusUpdate,
  isOpen,
  completedModules,
  totalModules
}) => {
  if (!isOpen) return null;

  const missionText =
    startup.identity.mission ||
    startup.identity.tagline ||
    startup.identity.elevatorPitch ||
    "Empowering next-generation solutions through modern innovation and execution.";

  const isFinalized = startup.status === "Finalized" || startup.progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-2 right-4 z-40 w-80 md:w-96 bg-[#0c0c0e]/95 backdrop-blur-xl border border-[#00ff66]/40 rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,255,102,0.15)] font-mono pointer-events-none text-left"
      id={`workspace-hover-tooltip-${startup.id}`}
    >
      {/* Glow Accent Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 text-[10px]">
        <div className="flex items-center gap-1.5 font-syne font-black text-[#e4e4e7] uppercase tracking-wider text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
          <span className="truncate max-w-[170px]">{startup.identity.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[rgba(228,228,231,0.6)]">
            {startup.idea.industry || "SaaS"}
          </span>
          <span
            className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${
              isFinalized
                ? "bg-[#00ff66]/15 border-[#00ff66]/60 text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.25)]"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFinalized ? "bg-[#00ff66] animate-ping" : "bg-amber-400"
              }`}
            />
            {startup.status || (isFinalized ? "Finalized" : "Drafting")}
          </span>
        </div>
      </div>

      {/* 1. Core Mission Statement Section */}
      <div className="space-y-1 mb-3 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
        <div className="text-[9px] text-[#00ff66] uppercase tracking-wider font-bold flex items-center gap-1">
          <Compass className="w-3 h-3 text-[#00ff66]" />
          <span>Core Mission Statement</span>
        </div>
        <p className="text-[11px] text-[rgba(228,228,231,0.9)] italic leading-relaxed pl-1 font-sans border-l-2 border-[#00ff66]/50">
          "{missionText}"
        </p>
      </div>

      {/* 2. One-Sentence Status Update Section */}
      <div className="space-y-1 mb-3 bg-[#00ff66]/[0.03] p-2.5 rounded-lg border border-[#00ff66]/20">
        <div className="text-[9px] text-[#00ff66] uppercase tracking-wider font-bold flex items-center gap-1">
          <Activity className="w-3 h-3 text-[#00ff66] animate-pulse" />
          <span>One-Sentence Status Update</span>
        </div>
        <p className="text-[11px] text-[#e4e4e7] leading-relaxed pl-1 font-sans">
          {statusUpdate}
        </p>
      </div>

      {/* Quick Metrics Bar */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-[rgba(228,228,231,0.5)]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-[#00ff66]" />
          <span>
            {completedModules}/{totalModules} Modules Forged ({startup.progress}%)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[rgba(228,228,231,0.4)]">
          <Clock className="w-3 h-3" />
          <span>Nav: ⌘← / ⌘→</span>
        </div>
      </div>
    </motion.div>
  );
};
