import React, { useState } from "react";
import { Sparkles, Check, ChevronDown, ChevronUp, Send, Play, Monitor, Smartphone, Palette, CheckCircle, Loader2 } from "lucide-react";
import { Startup } from "../types";

interface StartupLandingPageProps {
  startup: Startup;
  onGenerateLandingPage?: () => void;
  isGenerating?: boolean;
}

export default function StartupLandingPage({ startup, onGenerateLandingPage, isGenerating }: StartupLandingPageProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [styleTemplate, setStyleTemplate] = useState<"slate" | "neon" | "warm">("slate");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const { identity, landingPage } = startup;

  if (!landingPage) {
    return (
      <div className="min-h-[450px] bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-6 shadow-sm" id="landing-page-empty">
        <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
          <Sparkles className="w-7 h-7 animate-pulse text-blue-600" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Forge Live Landing Page Microsite</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generate a full interactive microsite preview for <strong className="text-slate-800">{identity?.name || "your startup"}</strong> complete with hero headlines, feature highlights, pricing tables, testimonials, and FAQ lead generation.
          </p>
        </div>
        {onGenerateLandingPage && (
          <button
            onClick={onGenerateLandingPage}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
            id="forge-landing-page-btn"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Forging Landing Page...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Forge Landing Page with AI</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setLeadSuccess(true);
    setTimeout(() => {
      setLeadEmail("");
    }, 4000);
  };

  // Determine design parameters based on selected theme template
  const getThemeStyles = () => {
    switch (styleTemplate) {
      case "neon":
        return {
          bg: "bg-black text-slate-100",
          headerBg: "bg-black/80 border-b border-purple-900/40",
          accentText: "text-purple-400",
          buttonBg: "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white",
          cardBg: "bg-slate-950 border border-purple-900/30",
          badgeBg: "bg-purple-950/50 text-purple-400 border border-purple-800/40",
          footerBg: "bg-black border-t border-purple-950/40",
          primaryColor: "#a855f7",
          secondaryColor: "#ec4899"
        };
      case "warm":
        return {
          bg: "bg-amber-50 text-amber-950",
          headerBg: "bg-amber-50/80 border-b border-amber-200/50",
          accentText: "text-amber-800",
          buttonBg: "bg-amber-900 hover:bg-amber-950 text-white",
          cardBg: "bg-white border border-amber-100 shadow-sm",
          badgeBg: "bg-amber-100/60 text-amber-900 border border-amber-200/40",
          footerBg: "bg-amber-900 text-amber-100",
          primaryColor: "#78350f",
          secondaryColor: "#b45309"
        };
      case "slate":
      default:
        // Parse raw generated brand colors or fallback to high-quality slate defaults
        const prim = identity.brandColors?.primary || "#0f172a";
        const sec = identity.brandColors?.secondary || "#3b82f6";
        const acc = identity.brandColors?.accent || "#f43f5e";
        return {
          bg: "bg-slate-950 text-slate-100",
          headerBg: "bg-slate-950/80 border-b border-slate-800/60",
          accentText: "text-cyan-400",
          buttonBg: `bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950`,
          cardBg: "bg-slate-900 border border-slate-800/80 shadow-md",
          badgeBg: "bg-cyan-950/40 text-cyan-400 border border-cyan-800/30",
          footerBg: "bg-slate-950 border-t border-slate-900",
          primaryColor: prim,
          secondaryColor: sec
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="space-y-6" id="dashboard-landing-page">
      {/* Configuration Ribbon */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">LANDING PAGE THEME TEMPLATE:</span>
          <div className="flex gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
            <button
              onClick={() => setStyleTemplate("slate")}
              className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                styleTemplate === "slate" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Slate AI
            </button>
            <button
              onClick={() => setStyleTemplate("neon")}
              className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                styleTemplate === "neon" ? "bg-purple-500 text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cyber Neon
            </button>
            <button
              onClick={() => setStyleTemplate("warm")}
              className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                styleTemplate === "warm" ? "bg-amber-950 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sand Warmth
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 bg-slate-950/80 border border-slate-850 p-1 rounded-lg">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                deviceMode === "desktop" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Desktop Preview"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                deviceMode === "mobile" ? "bg-slate-800 text-cyan-400" : "text-slate-500 hover:text-slate-300"
              }`}
              title="Mobile Preview"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {onGenerateLandingPage && (
            <button
              onClick={onGenerateLandingPage}
              disabled={isGenerating}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 border border-cyan-500/30 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              id="reforge-landing-page-btn"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <span>Re-Forge AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Actual Live Website Frame */}
      <div className="flex justify-center transition-all duration-300">
        <div
          className={`w-full overflow-hidden transition-all duration-300 rounded-3xl border border-slate-800/80 bg-slate-950 shadow-2xl relative ${
            deviceMode === "mobile" ? "max-w-[375px] min-h-[600px] border-4 border-slate-700" : "w-full"
          }`}
          style={{ fontFamily: identity.typography?.body || "Inter, sans-serif" }}
          id="landing-page-preview-frame"
        >
          {/* Mock Browser Notch/StatusBar if Mobile */}
          {deviceMode === "mobile" && (
            <div className="bg-slate-900 text-[10px] px-6 py-2 flex justify-between items-center text-slate-400 font-mono select-none">
              <span>9:41 AM</span>
              <div className="w-16 h-3 bg-black rounded-full" />
              <div className="flex gap-1">
                <span>LTE</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Website Canvas Area */}
          <div className={`w-full h-[650px] overflow-y-auto ${theme.bg}`}>
            {/* Header Navigation */}
            <header className={`sticky top-0 z-40 backdrop-blur-md ${theme.headerBg} px-6 py-4 flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-black text-sm">
                  {identity.name.charAt(0)}
                </div>
                <span className="font-bold tracking-tight text-sm text-white" style={{ fontFamily: identity.typography?.heading }}>
                  {identity.name}
                </span>
              </div>
              
              {deviceMode === "desktop" && (
                <nav className="flex gap-6 text-[11px] font-semibold text-slate-400">
                  <a href="#features" className="hover:text-white transition-colors">Features</a>
                  <a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a>
                  <a href="#pricing" className="hover:text-white transition-colors">Plans</a>
                  <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
                </nav>
              )}

              <button className={`text-[10px] font-bold px-3.5 py-1.5 rounded-lg ${theme.buttonBg} cursor-pointer`}>
                Get Started
              </button>
            </header>

            {/* HERO SECTION */}
            <section className="px-6 py-16 text-center max-w-3xl mx-auto space-y-6 relative overflow-hidden">
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                <Sparkles className="w-3 h-3" /> Turn key product launch
              </div>

              <h1
                className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight"
                style={{ fontFamily: identity.typography?.heading }}
              >
                {landingPage.hero?.headline}
              </h1>

              <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                {landingPage.hero?.subheadline}
              </p>

              {/* Early Access Form */}
              <div className="max-w-md mx-auto pt-4 relative z-10">
                {leadSuccess ? (
                  <div className="bg-emerald-900/30 border border-emerald-800/80 p-4 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2 animate-bounce">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Thanks! We've saved your spot in the early access queue.</span>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="flex gap-2 p-1.5 bg-slate-900 border border-slate-850 rounded-xl max-w-sm mx-auto">
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="bg-transparent text-xs text-white focus:outline-none px-3.5 flex-1 w-full"
                    />
                    <button
                      type="submit"
                      className={`text-[10px] font-bold py-2 px-4 rounded-lg flex-shrink-0 flex items-center gap-1 cursor-pointer ${theme.buttonBg}`}
                    >
                      {landingPage.hero?.ctaText} <Send className="w-3 h-3" />
                    </button>
                  </form>
                )}
                <span className="text-[10px] text-slate-500 block mt-2">Zero spam. Cancel subscription updates any time.</span>
              </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="px-6 py-12 max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">Moats & Benefits</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">Engineered for Superior Outcome</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {landingPage.features?.map((feat, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl ${theme.cardBg} space-y-3`}>
                    <div className="w-8 h-8 bg-cyan-950 text-cyan-400 border border-cyan-800/30 rounded-xl flex items-center justify-center text-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h5 className="font-bold text-sm text-white">{feat.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="px-6 py-12 max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">Simple Costs</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">Transparent plans that scale with you</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {landingPage.pricing?.slice(0, 2).map((plan, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between ${theme.cardBg} ${
                      idx === 1 ? "border-cyan-500/80 shadow-lg shadow-cyan-500/5" : ""
                    }`}
                  >
                    {idx === 1 && (
                      <span className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[8px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wide">
                        RECOMMENDED
                      </span>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-white">{plan.tier}</h4>
                      <p className="text-xl font-extrabold text-white mt-2">{plan.price}</p>
                      <hr className="border-slate-800 my-4" />
                      <ul className="space-y-2 text-[11px] text-slate-400">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className={`w-full mt-6 text-[10px] font-bold py-2 rounded-xl cursor-pointer ${theme.buttonBg}`}>
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className="px-6 py-12 max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">Endorsements</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">Loved by global teams</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {landingPage.testimonials?.map((t, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl flex flex-col justify-between ${theme.cardBg} space-y-4`}>
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-8 h-8 rounded-full bg-slate-800 object-cover flex-shrink-0 border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h6 className="text-[11px] font-bold text-white">{t.name}</h6>
                        <p className="text-[9px] text-slate-400">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="px-6 py-12 max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-4">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">Clarifications</span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">Frequently Asked Questions</h3>
              </div>

              <div className="space-y-2.5">
                {landingPage.faq?.map((item, idx) => (
                  <div key={idx} className={`rounded-xl border ${theme.cardBg}`}>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-white flex justify-between items-center cursor-pointer"
                    >
                      <span>{item.question}</span>
                      {expandedFaq === idx ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-4 pb-3.5 border-t border-slate-850 pt-2 text-slate-400 text-[11px] leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="px-6 py-16 text-center bg-slate-950 relative overflow-hidden border-t border-slate-900">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5" />
              <div className="max-w-md mx-auto space-y-4 relative z-10">
                <h4 className="text-xl font-bold text-white">Join the Startup Revolution</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Start mapping operations, analyzing customer saturation, and building your dream with high-performance automated tools.
                </p>
                <button className={`text-[10px] font-bold px-6 py-2.5 rounded-xl cursor-pointer ${theme.buttonBg}`}>
                  Launch Now
                </button>
                <p className="text-[10px] text-slate-500">{landingPage.contactText}</p>
              </div>
            </section>

            {/* FOOTER */}
            <footer className={`px-6 py-8 text-center text-[10px] text-slate-500 ${theme.footerBg}`}>
              <p>© {new Date().getFullYear()} {identity.name}. All rights reserved.</p>
              <div className="flex justify-center gap-4 mt-2">
                <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
                <span>•</span>
                <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
                <span>•</span>
                <span className="hover:text-slate-300 cursor-pointer">IP Guarantee</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
