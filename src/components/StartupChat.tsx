import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Send, Sparkles, User as UserIcon, Bot, Loader2, ArrowRight,
  Copy, Check, Trash2, Zap, AlertCircle, RefreshCw, Landmark, HelpCircle, Brain
} from "lucide-react";
import { Startup, ChatMessage } from "../types";
import AIInsightsSummaryModal from "./AIInsightsSummaryModal";

interface StartupChatProps {
  startup: Startup;
  onUpdateStartup: (updated: Startup) => void;
}

const PLAYBOOKS = [
  {
    title: "GTM Blitz Plan",
    description: "Launch with organic viral loops and zero-dollar budget",
    prompt: "Generate an ultimate Go-To-Market Blitz Strategy. I want 3 highly specific, creative, organic growth hacks with zero budget, tailored specifically to our target audience and industry. Include step-by-step instructions on execution."
  },
  {
    title: "Competitor Flank",
    description: "Exploit giant vulnerabilities with targeted positioning",
    prompt: "Let's perform a strategic flanking audit. Based on our industry segment and any competitor info we have, what are the top 3 weaknesses of established players we can aggressively exploit, and how do we position our unique value proposition (UVP) as the ideal alternative?"
  },
  {
    title: "Monetization stress test",
    description: "Audit current tiers and suggest recurring streams",
    prompt: "I want to stress-test our business model. How should we set up our initial pricing tiers to maximize customer conversion while maintaining healthy unit economics? Please provide concrete monthly/yearly price points and feature distributions."
  },
  {
    title: "Risk Premortem",
    description: "Imagine a 12-month failure scenario and reverse it",
    prompt: "Let's perform a strategic pre-mortem. Imagine our startup completely failed 12 months from now. What are the top 3 most likely reasons (technical, commercial, or market) that caused it, and what exact preventative steps should we implement today to safeguard our venture?"
  },
  {
    title: "Mock Interview Q&A",
    description: "Simulate a tough investor grilling session with audio or text",
    prompt: "I want to do a rapid mock investor interview test. Act as a tough venture capitalist and ask me 3 challenging questions about our startup's market size, defensibility, and unit economics. After each answer, score my response and suggest improvements."
  }
];

// Quick helper to render advanced markdown safely in our cyber theme
function renderMarkdown(text: string) {
  if (!text) return "";
  
  // Clean trailing and leading newlines
  let formatted = text.trim();

  // Replace triple backticks code blocks
  formatted = formatted.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono my-3 overflow-x-auto text-emerald-400 max-w-full"><code>${code.trim()}</code></pre>`;
  });

  // Replace inline code ticks
  formatted = formatted.replace(/`([^`\n]+)`/g, '<code class="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-850 text-[10px] font-mono text-cyan-300 mx-0.5">$1</code>');

  // Replace double asterisks with bold tags
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

  // Replace single asterisks with italic tags
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>');

  // Format line breaks and bullet points
  const lines = formatted.split("\n");
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      return `<h5 class="text-xs font-bold text-slate-100 uppercase tracking-wider mt-4 mb-1.5 border-l-2 border-[#00ff66] pl-2">${trimmed.slice(4)}</h5>`;
    }
    if (trimmed.startsWith("## ")) {
      return `<h4 class="text-sm font-bold text-white uppercase tracking-wide mt-5 mb-2 border-b border-slate-800/80 pb-1">${trimmed.slice(3)}</h4>`;
    }
    if (trimmed.startsWith("# ")) {
      return `<h3 class="text-base font-extrabold text-[#00ff66] uppercase mt-6 mb-3 tracking-tight pb-1">${trimmed.slice(2)}</h3>`;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return `<li class="ml-4 list-disc text-xs text-slate-300 my-1 leading-relaxed">${trimmed.slice(2)}</li>`;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return `<li class="ml-4 list-decimal text-xs text-slate-300 my-1 leading-relaxed">${trimmed.replace(/^\d+\.\s/, "")}</li>`;
    }
    if (trimmed === "") {
      return "<div class='h-2.5'></div>";
    }
    if (trimmed.startsWith("> ")) {
      return `<p class="border-l-2 border-[#00ff66] pl-3 py-1 bg-[#00ff66]/5 rounded-r text-xs text-slate-400 italic my-1.5 leading-relaxed">${trimmed.slice(2)}</p>`;
    }
    return `<p class="text-xs text-slate-300 leading-relaxed my-1.5">${line}</p>`;
  });

  return processedLines.join("");
}

// Copy to Clipboard Action Button
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy strategy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-slate-800/60 rounded border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-[#00ff66] transition-all flex items-center gap-1.5 text-[10px] uppercase font-mono cursor-pointer shrink-0"
      title="Copy raw guidance markdown to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#00ff66]" />
          <span className="text-[#00ff66]">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Guidance</span>
        </>
      )}
    </button>
  );
};

export default function StartupChat({ startup, onUpdateStartup }: StartupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(startup.chatHistory || []);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Compute dynamic suggestions based on generated modules
  const dynamicSuggestions = useMemo(() => {
    const suggestions: string[] = [];

    if (startup.marketResearch) {
      suggestions.push("How can we position ourselves for our main customer persona?");
      suggestions.push("Given PESTLE opportunities, what strategy brings the quickest ROI?");
    } else {
      suggestions.push("Help me define my target customer personas.");
    }

    if (startup.competitorAnalysis) {
      suggestions.push("What's our defensive competitive moat against these giants?");
      suggestions.push("How do we win a competitor's customer based on their weaknesses?");
    } else {
      suggestions.push("What standard competitor types should we audit first?");
    }

    if (startup.businessModel) {
      suggestions.push("What upselling tactics can we bundle into our pricing tiers?");
      suggestions.push("Critique our established cost structure and revenue streams.");
    } else {
      suggestions.push("Which pricing models yield the highest initial margins?");
    }

    if (startup.financialPlanner) {
      suggestions.push("How can we lower operational costs to reach breakeven faster?");
    }

    if (startup.technicalArchitecture) {
      suggestions.push("Are there potential scaling bottlenecks in our chosen tech stack?");
    }

    suggestions.push("Write a catchy LinkedIn cold outreach targeting early beta testing partnerships.");
    suggestions.push("What are 3 organic viral GTM loops we can weave into our MVP software?");

    // Shuffle and pick 4
    return suggestions.slice(0, 4);
  }, [startup]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          startup: startup,
          history: messages // pass history for stateful multi-turn memory
        })
      });

      if (!response.ok) {
        throw new Error(`Chat API error! Status: ${response.status}`);
      }

      let resData;
      try {
        resData = await response.json();
      } catch (err) {
        console.error("Failed to parse chat response as JSON:", err);
        throw new Error("Received an invalid or malformed response from the AI strategist. Please try again.");
      }

      const botMsg: ChatMessage = {
        sender: "ai",
        text: resData.text || "I apologize, but I encountered an error formulating my guidance.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalHistory = [...newHistory, botMsg];
      setMessages(finalHistory);

      // Save to startup state
      onUpdateStartup({
        ...startup,
        chatHistory: finalHistory
      });

    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        sender: "ai",
        text: `**Connection Error**: Failed to consult your AI advisor. Please verify that your dev server is active and try again.\n\n*Error details: ${err.message || "Failed to fetch"}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const handleResetChat = () => {
    if (window.confirm("Are you sure you want to reset this conversation? This will clear history and restart memory with your AI Strategist.")) {
      setMessages([]);
      onUpdateStartup({
        ...startup,
        chatHistory: []
      });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6" id="chat-workspace-parent">
      
      {/* LEFT COLUMN: STRATEGY PLAYBOOKS PANEL */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-6" id="strategy-sidebar">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-emerald-950 border border-emerald-800/40 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#00ff66]" />
            </div>
            <h5 className="font-syne font-bold text-xs uppercase tracking-wider text-slate-200">Advisory Playbooks</h5>
          </div>
          <p className="text-[10px] text-slate-400 mb-5 leading-relaxed">
            Click any premium playbook to run an immediate, targeted business analysis on your venture.
          </p>

          <div className="space-y-3">
            {PLAYBOOKS.map((pb, index) => (
              <button
                key={index}
                disabled={isLoading}
                onClick={() => handleSend(pb.prompt)}
                className="w-full text-left p-3 rounded-xl bg-slate-950/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-emerald-800/40 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-200 group-hover:text-[#00ff66] uppercase transition-colors">
                    {pb.title}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-[#00ff66] transition-all group-hover:translate-x-0.5 shrink-0" />
                </div>
                <p className="text-[9px] text-slate-500 leading-normal line-clamp-2">
                  {pb.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Indicator Panel */}
        <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2.5">
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className="text-slate-400 uppercase">Blueprints Found</span>
            <span className="text-[#00ff66] font-bold">
              {[
                startup.marketResearch, startup.competitorAnalysis, startup.businessModel,
                startup.financialPlanner, startup.mvpPlanner, startup.technicalArchitecture,
                startup.prd, startup.marketingPlanner, startup.investorSection, startup.legalChecklist
              ].filter(Boolean).length} / 10
            </span>
          </div>
          <p className="text-[9px] text-slate-500 leading-relaxed">
            Your strategist automatically scans and incorporates all active blueprints shown in other tabs during your chat.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: MAIN INTERACTIVE CHAT ENGINE */}
      <div className="flex flex-col h-[650px] bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden" id="chat-workspace">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-cyan-950 border border-cyan-800/50 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.15)]">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-white leading-none">AI Startup Strategist</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Pre-seeded with context memory</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* SPECIALIZED AGENT: AI INSIGHTS SUMMARY BUTTON */}
            <button
              onClick={() => setIsInsightsModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-[#00ff66]/20 to-cyan-500/20 hover:from-[#00ff66]/30 hover:to-cyan-500/30 border border-[#00ff66]/50 text-[#00ff66] hover:text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,255,102,0.15)] cursor-pointer"
              title="Trigger specialized agent to analyze chat history and synthesize executive project evolution summary"
              id="chat-ai-insights-summary-btn"
            >
              <Brain className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
              <span>AI Insights Summary</span>
            </button>

            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 text-[#00ff66] rounded-full text-[9px] font-mono font-semibold border border-[#00ff66]/10 uppercase tracking-wide">
              <Sparkles className="w-3 h-3 animate-pulse" /> Strategist Active
            </span>
            {messages.length > 0 && (
              <button
                onClick={handleResetChat}
                className="p-1.5 bg-slate-950 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/30 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[9px] uppercase font-mono"
                title="Reset Conversation Thread"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden md:inline">Reset Thread</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-slate-950/25" id="chat-messages-container">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto">
              <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-[#00ff66] mb-4 animate-bounce">
                <Bot className="w-6 h-6" />
              </div>
              <h5 className="font-syne font-bold text-white text-sm uppercase tracking-wide">Strategic Boardroom</h5>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Consult your AI Partner on funding stages, product scope, risk deflection, or growth formulas. Let's make an impact today.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3.5 max-w-[90%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                    msg.sender === "user"
                      ? "bg-slate-800 text-slate-300"
                      : "bg-cyan-950 border border-cyan-800/40 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                  }`}
                >
                  {msg.sender === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div
                    className={`p-4 rounded-2xl text-xs border ${
                      msg.sender === "user"
                        ? "bg-slate-800 border-slate-750 text-slate-100 rounded-tr-none shadow-sm"
                        : "bg-slate-900/95 border-slate-800 text-slate-300 rounded-tl-none shadow-md leading-relaxed"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <p className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{msg.text}</p>
                    ) : (
                      <div className="space-y-2 max-w-none text-slate-300">
                        <div
                          className="prose prose-invert max-w-none text-slate-300"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                        />
                        
                        {/* Strategic Toolbar inside AI Message */}
                        <div className="pt-3 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-4">
                          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> FORGE CO-PILOT ADVISOR
                          </span>
                          <CopyButton text={msg.text} />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block px-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 max-w-[90%] mr-auto">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.05)]">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1.5 items-center justify-start py-1">
                  <div className="w-2 h-2 bg-[#00ff66] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-[#00ff66] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-[#00ff66] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic context suggestions (only if not loading) */}
        {!isLoading && (
          <div className="px-6 py-3 border-t border-slate-850 bg-slate-950/20 flex flex-wrap gap-2">
            {dynamicSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[10px] text-slate-400 bg-slate-950/60 hover:bg-slate-900 border border-slate-850 hover:border-[#00ff66]/30 hover:text-[#00ff66] rounded-lg px-2.5 py-1.5 text-left transition-all cursor-pointer flex items-center gap-1.5 max-w-full truncate shadow-xs font-mono"
              >
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                <span className="truncate">{sug}</span>
                <ArrowRight className="w-3 h-3 flex-shrink-0 opacity-40 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask your strategist: 'How can we scale acquisition?' or 'Review our MVP priority list...'"
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-750 focus:border-[#00ff66] focus:outline-none rounded-xl px-4 py-3 text-xs text-white transition-colors disabled:opacity-50 font-sans"
            id="chat-text-input"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-[#00ff66] hover:bg-[#00e059] disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-bold px-4 rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-[0_0_12px_rgba(0,255,102,0.1)]"
            id="chat-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* AI INSIGHTS SUMMARY MODAL */}
      <AIInsightsSummaryModal
        startup={startup}
        isOpen={isInsightsModalOpen}
        onClose={() => setIsInsightsModalOpen(false)}
        onUpdateStartup={onUpdateStartup}
      />
    </div>
  );
}
