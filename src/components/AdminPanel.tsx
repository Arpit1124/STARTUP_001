import React, { useState } from "react";
import { Shield, Users, Terminal, Code, MessageSquare, Check, Trash2, Cpu, Activity, Database, AlertCircle } from "lucide-react";

interface AdminPanelProps {
  userCount: number;
  totalTokens: number;
}

export default function AdminPanel({ userCount, totalTokens }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"metrics" | "users" | "prompts" | "logs">("metrics");
  const [logs, setLogs] = useState([
    { id: 1, type: "INFO", time: "11:24:02", msg: "Server initialization successful. Express routing loaded." },
    { id: 2, type: "INFO", time: "11:24:15", msg: "GoogleGenAI lazy model initialized - Model: gemini-3.5-flash." },
    { id: 3, type: "INFO", time: "11:25:44", msg: "POST /api/generate-module - identity generated for 'soil monitor'" },
    { id: 4, type: "SUCCESS", time: "11:25:52", msg: "JWT session authorized for user_alex_mercer." },
    { id: 5, type: "WARN", time: "11:26:11", msg: "Database pool idle warnings. Restructuring active slots." },
    { id: 6, type: "INFO", time: "11:26:30", msg: "Chat Stream prompt pre-seeded for startup workspace advisor." }
  ]);

  const [users, setUsers] = useState([
    { id: "usr-01", name: "Alex Mercer", email: "alex.mercer@gmail.com", tier: "PRO", credits: "8 / 50", status: "Active" },
    { id: "usr-02", name: "Sarah Jenkins", email: "sarah@agritech.co", tier: "ENTERPRISE", credits: "144 / 500", status: "Active" },
    { id: "usr-03", name: "Marcus Chen", email: "marcus.chen@outlook.com", tier: "FREE", credits: "4 / 5", status: "Active" },
    { id: "usr-04", name: "Emily Watson", email: "emily.w@finance-node.net", tier: "PRO", credits: "21 / 50", status: "Active" }
  ]);

  const toggleUserTier = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextTier = u.tier === "FREE" ? "PRO" : u.tier === "PRO" ? "ENTERPRISE" : "FREE";
          const nextLimit = nextTier === "FREE" ? "0 / 5" : nextTier === "PRO" ? "21 / 50" : "144 / 500";
          return { ...u, tier: nextTier, credits: nextLimit };
        }
        return u;
      })
    );
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden" id="admin-workspace">
      {/* Admin Title Ribbon */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-rose-950/40 border border-rose-800/30 rounded-xl flex items-center justify-center text-rose-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">StartupForge Control Console</h4>
            <p className="text-[11px] text-slate-400">Manage SaaS subscriptions, credits, logs, and parameters</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl max-w-max">
          <button
            onClick={() => setActiveTab("metrics")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "metrics" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> METRICS
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "users" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> USERS
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "prompts" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Code className="w-3.5 h-3.5" /> PROMPTS
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "logs" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> LOGGER
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* METRICS VIEW */}
        {activeTab === "metrics" && (
          <div className="space-y-6" id="admin-metrics-tab">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">ACTIVE NODE STATUS</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> ONLINE (99.98%)
                </span>
              </div>
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">REGISTERED USERS</span>
                <span className="text-xl font-black text-white">{users.length + userCount}</span>
              </div>
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">AI API TOKEN QUERIES</span>
                <span className="text-xl font-black text-white">{totalTokens}</span>
              </div>
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">DB WRITE SESSIONS</span>
                <span className="text-sm font-bold text-cyan-400 flex items-center gap-1">
                  <Database className="w-4 h-4" /> 16 Slots / 2 Active
                </span>
              </div>
            </div>

            <div className="bg-slate-950/30 border border-slate-800 rounded-xl p-5 space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" /> Server Performance Indicators
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg">
                  <span>Gemini API average response:</span>
                  <span className="text-white font-mono font-semibold">4.2s (gemini-3.5-flash)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg">
                  <span>Nginx routing latency:</span>
                  <span className="text-white font-mono font-semibold">32ms</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg">
                  <span>Redis cache hit-ratio:</span>
                  <span className="text-emerald-400 font-mono font-semibold">88.4%</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg">
                  <span>Database CPU allocation:</span>
                  <span className="text-white font-mono font-semibold">12.5%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS VIEW */}
        {activeTab === "users" && (
          <div className="overflow-x-auto" id="admin-users-tab">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-950 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">NAME & EMAIL</th>
                  <th className="px-4 py-3">SUBSCRIPTION TIER</th>
                  <th className="px-4 py-3">FORGE TOKENS USED</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/30">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${
                        u.tier === "ENTERPRISE" ? "bg-indigo-950 text-indigo-400 border-indigo-900" :
                        u.tier === "PRO" ? "bg-cyan-950 text-cyan-400 border-cyan-900" :
                        "bg-slate-950 text-slate-500 border-slate-800"
                      }`}>
                        {u.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-white">{u.credits}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">● {u.status}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleUserTier(u.id)}
                        className="text-[10px] bg-slate-950 border border-slate-800 hover:border-cyan-800 hover:text-cyan-400 px-2.5 py-1 rounded transition-colors cursor-pointer"
                      >
                        Adjust Tier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PROMPTS VIEW */}
        {activeTab === "prompts" && (
          <div className="space-y-4" id="admin-prompts-tab">
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-1">
                  <Code className="w-4 h-4 text-rose-400" /> Module: Market Research Schema
                </span>
                <span className="text-[10px] bg-slate-900 text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-800">
                  SYSTEM_DRAFT_V2
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 leading-relaxed max-h-24 overflow-y-auto bg-slate-900 p-2.5 rounded border border-slate-800">
                "Perform comprehensive market research and analysis for the following startup. Return a JSON structure representing TAM, SAM, SOM, SWOT quadrants, PESTLE regulations, and detailed early customer persona profiles with pain-points and budget limits."
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-1">
                  <Code className="w-4 h-4 text-rose-400" /> Module: Financial Planner Modeling
                </span>
                <span className="text-[10px] bg-slate-900 text-slate-500 font-mono px-2 py-0.5 rounded border border-slate-800">
                  SYSTEM_DRAFT_V2
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 leading-relaxed max-h-24 overflow-y-auto bg-slate-900 p-2.5 rounded border border-slate-800">
                "Formulate structured year-1 revenue model, operational costs, salary details, ad spend margins, and project break-even points in months based on industry average standard margins. Return numerical values only."
              </p>
            </div>
          </div>
        )}

        {/* LOGGER VIEW */}
        {activeTab === "logs" && (
          <div className="space-y-3" id="admin-logs-tab">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">SYSTEM LOG LOGGER PIPELINE (STDOUT)</span>
              <button
                onClick={handleClearLogs}
                className="text-[10px] hover:text-rose-400 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Logs
              </button>
            </div>

            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl font-mono text-[10px] h-60 overflow-y-auto space-y-1.5 scrollbar-thin">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600">No active stdout system lines in register buffer.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-slate-500 font-semibold">[{log.time}]</span>
                    <span className={`font-bold ${
                      log.type === "SUCCESS" ? "text-emerald-400" :
                      log.type === "WARN" ? "text-amber-400" : "text-cyan-400"
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-300">{log.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
