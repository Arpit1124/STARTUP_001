import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Landmark, Globe, Briefcase, Users, AlertCircle, Mic, MicOff } from "lucide-react";
import { StartupIdea, Startup, User } from "../types";

interface StartupWizardProps {
  onComplete: (newStartup: Startup) => void;
  onCancel: () => void;
  user: User | null;
  onUpdateUser: (user: User | null) => void;
}

const STEP_DATA = [
  {
    title: "The Industry Domain",
    desc: "Which vertical or industry space are you disrupting?",
    field: "industry",
    icon: Briefcase,
    placeholder: "e.g., Sustainable Agriculture, AI FinTech, Creator Economy, Elder Care",
    suggestions: ["PropTech SaaS", "Healthcare Biotech", "ClimateTech Grid Logistics", "Creator Economy Web3", "AI Soil AgriTech"]
  },
  {
    title: "The Core Problem",
    desc: "Describe the specific friction or painful gap you are addressing.",
    field: "problem",
    icon: AlertCircle,
    placeholder: "e.g., Soil testing takes 3 weeks and costs $400, leaving farmers guessing about fertilizers.",
    suggestions: [
      "Small medical practices waste 15 hours a week manually checking patient insurance coverage.",
      "Apartment renters have no built-in way to build credit scores by paying their monthly rent on time.",
      "Local cafes lose 20% of ingredients to spoilage due to unpredictable weekend foot-traffic."
    ]
  },
  {
    title: "The Ideal Audience",
    desc: "Who feels this pain most acutely? Be as specific as possible.",
    field: "targetAudience",
    icon: Users,
    placeholder: "e.g., Independent crop consultants and organic vegetable farmers with under 500 acres.",
    suggestions: ["Solo real estate property managers in tier-2 cities", "Pediatric clinics with under 5 administrative staff", "Freelance video editors doing YouTube client work"]
  },
  {
    title: "Your Initial Budget",
    desc: "How much starting capital do you realistically have to scale the MVP?",
    field: "budget",
    icon: Landmark,
    placeholder: "e.g., $10,000",
    suggestions: ["$5,000 (Bootstrap)", "$20,000 (Friends & Family)", "$100,000 (Angel Capital)", "$500,000 (VC Seed Round)"]
  },
  {
    title: "The Target Market Country",
    desc: "Which primary geographic region are you incorporating in?",
    field: "country",
    icon: Globe,
    placeholder: "e.g., United States",
    suggestions: ["United States", "India", "Germany", "United Kingdom", "Canada", "Singapore"]
  }
];

export default function StartupWizard({ onComplete, onCancel, user, onUpdateUser }: StartupWizardProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<StartupIdea>({
    industry: "",
    problem: "",
    targetAudience: "",
    budget: "",
    country: "United States"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generationPhase, setGenerationPhase] = useState("");

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const baselineTextRef = useRef<string>("");

  const currentStepInfo = STEP_DATA[step];

  // Stop recognition when step changes
  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition on step change:", err);
      }
      setIsListening(false);
    }
  }, [step]);

  // Clean up recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Error stopping recognition on unmount:", err);
        }
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition API is not supported in this browser. Please type your response manually.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Error stopping recognition:", err);
        }
      }
      setIsListening(false);
      return;
    }

    const currentField = currentStepInfo.field as keyof StartupIdea;
    const initialVal = formData[currentField] || "";
    baselineTextRef.current = initialVal;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError("");
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        const base = baselineTextRef.current;
        const combined = base ? `${base} ${transcript}` : transcript;

        setFormData((prev) => ({
          ...prev,
          [currentField]: combined
        }));
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setError("Microphone permission was denied. Please grant microphone access in browser settings.");
        } else if (event.error === "no-speech") {
          setError("No speech was detected. Please speak clearly into your microphone.");
        } else if (event.error !== "aborted") {
          setError(`Voice dictation issue: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Speech recognition initialization failed:", err);
      setError("Could not launch microphone dictation. Please check browser permissions.");
      setIsListening(false);
    }
  };

  const handleNext = () => {
    const currentField = currentStepInfo.field as keyof StartupIdea;
    if (!formData[currentField].trim()) {
      setError("Please provide an answer or click a suggestion.");
      return;
    }
    setError("");
    if (step < STEP_DATA.length - 1) {
      setStep(step + 1);
    } else {
      handleForge();
    }
  };

  const handleBack = () => {
    setError("");
    if (step > 0) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const handleSuggestion = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentStepInfo.field]: val
    }));
    setError("");
  };

  const handleForge = async () => {
    setIsGenerating(true);
    setError("");

    // Simulate multi-phase loading messages for high-quality UX feel
    const phases = [
      "Consulting SaaS benchmark repositories...",
      "Analyzing competitive saturation filters...",
      "Drafting unique brand names & taglines...",
      "Configuring sleek color palettes...",
      "Formulating custom elevator pitches..."
    ];

    let phaseIndex = 0;
    setGenerationPhase(phases[0]);
    const phaseTimer = setInterval(() => {
      phaseIndex++;
      if (phaseIndex < phases.length) {
        setGenerationPhase(phases[phaseIndex]);
      }
    }, 1800);

    try {
      // Call standard server endpoint to generate initial identity
      const response = await fetch("/api/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: formData,
          module: "identity"
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error! status: ${response.status}`);
      }

      let identityData;
      try {
        identityData = await response.json();
      } catch (err) {
        console.error("Failed to parse identity response as JSON:", err);
        throw new Error("Received an invalid or malformed response from the AI identity generator. Please try again.");
      }

      // Ensure properties are valid fallback strings if parsing issue
      const finalIdentity = {
        name: identityData.name || "My Startup",
        tagline: identityData.tagline || "Disrupting the industry",
        mission: identityData.mission || "Our mission is to bring state-of-the-art automation to solve key problems.",
        vision: identityData.vision || "To lead global scaling in our focus vertical.",
        elevatorPitch: identityData.elevatorPitch || "We are building a highly integrated cloud portal...",
        uvp: identityData.uvp || "Sub-2 minute response times compared to legacy alternatives.",
        brandColors: identityData.brandColors || {
          primary: "#0f172a",
          secondary: "#3b82f6",
          accent: "#f43f5e",
          bg: "#f8fafc"
        },
        typography: identityData.typography || {
          heading: "Space Grotesk",
          body: "Inter"
        },
        logoPrompt: identityData.logoPrompt || "A minimalist line art emblem representing modern tech logo design",
        brandVoice: identityData.brandVoice || "Professional, forward-thinking, clear",
        domainIdeas: identityData.domainIdeas || ["startupname.com", "startupname.ai"],
        socialHandles: identityData.socialHandles || {
          twitter: "@startup",
          linkedin: "company/startup",
          instagram: "startup"
        }
      };

      const newStartup: Startup = {
        id: `startup_${Date.now()}`,
        ownerId: user?.id || "anonymous",
        idea: formData,
        identity: finalIdentity,
        createdAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        progress: 8, // Initial identity counts as ~8% progress
        isFavorite: false,
        chatHistory: [
          {
            sender: "ai",
            text: `Welcome to the war-room of **${finalIdentity.name}**! 🚀\n\nI have generated your initial startup identity, catchy branding parameters, domain options, and brand tone guidelines.\n\nWhat would you like to build next? We can perform deep **Market Research**, draft your **Business Model Canvas**, outline your **Financial Plan**, or model the complete **Technical Architecture** of your MVP!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]
      };

      // Update User Credit usage if logged in
      if (user) {
        onUpdateUser({
          ...user,
          aiUsageCount: user.aiUsageCount + 1,
          recentActivity: [
            { action: `Forged initial concept: ${finalIdentity.name}`, time: "Just now" },
            ...user.recentActivity
          ],
          savedStartupsCount: user.savedStartupsCount + 1
        });
      }

      clearInterval(phaseTimer);
      setIsGenerating(false);
      onComplete(newStartup);

    } catch (err: any) {
      console.error(err);
      clearInterval(phaseTimer);
      setIsGenerating(false);
      setError(`Failed to forge concept: ${err.message || "Please check your network connection and retry."}`);
    }
  };

  const StepIcon = currentStepInfo.icon;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden" id="wizard-view">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isGenerating ? (
          <motion.div
            key="wizard-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative z-10"
          >
            {/* Step Indicators */}
            <div className="flex gap-1.5 mb-8 justify-between">
              {STEP_DATA.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "bg-slate-800"
                  }`}
                />
              ))}
            </div>

            {/* Back Arrow Button */}
            <button
              onClick={handleBack}
              className="text-xs text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-1.5 mb-5 cursor-pointer"
              id="wizard-back"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            {/* Question Module */}
            <div className="mb-6">
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                <StepIcon className="w-4 h-4" /> STEP {step + 1} OF {STEP_DATA.length}
              </span>
              <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">{currentStepInfo.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{currentStepInfo.desc}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-rose-900/20 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Input Handler */}
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  RESPONSE DATA:
                </span>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                    isListening
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/60 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                      : "bg-slate-950 text-cyan-400 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40"
                  }`}
                  title={isListening ? "Click to stop dictation" : "Click to dictate answer using your microphone"}
                  id="voice-dictate-btn"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      <span>Recording... (Click to stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dictate with Voice</span>
                    </>
                  )}
                </button>
              </div>

              {currentStepInfo.field === "problem" ? (
                <textarea
                  value={formData[currentStepInfo.field as keyof StartupIdea]}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, [currentStepInfo.field]: e.target.value }));
                    setError("");
                  }}
                  placeholder={currentStepInfo.placeholder}
                  className={`w-full bg-slate-950 border ${
                    isListening
                      ? "border-rose-500/70 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                      : "border-slate-800 hover:border-slate-700/80 focus:border-cyan-500"
                  } rounded-xl p-3.5 text-sm h-32 focus:outline-none transition-all text-white resize-none`}
                  id="wizard-input-textarea"
                />
              ) : (
                <input
                  type="text"
                  value={formData[currentStepInfo.field as keyof StartupIdea]}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, [currentStepInfo.field]: e.target.value }));
                    setError("");
                  }}
                  placeholder={currentStepInfo.placeholder}
                  className={`w-full bg-slate-950 border ${
                    isListening
                      ? "border-rose-500/70 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                      : "border-slate-800 hover:border-slate-700/80 focus:border-cyan-500"
                  } rounded-xl px-4 py-3 text-sm focus:outline-none transition-all text-white`}
                  id="wizard-input-text"
                />
              )}

              {/* Suggestions Grid */}
              <div>
                <span className="block text-xs font-semibold text-slate-400 mb-2">QUICK SUGGESTIONS / EXAMPLES:</span>
                <div className="flex flex-col gap-2">
                  {currentStepInfo.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestion(sug)}
                      className={`text-left text-xs p-2.5 rounded-lg border transition-colors cursor-pointer ${
                        formData[currentStepInfo.field as keyof StartupIdea] === sug
                          ? "bg-cyan-950/40 border-cyan-500/80 text-cyan-300"
                          : "bg-slate-950/40 border-slate-800/60 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bottom Button */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 flex justify-end">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/15 active:scale-98 transition-all flex items-center gap-1.5 text-sm cursor-pointer"
                id="wizard-next"
              >
                {step === STEP_DATA.length - 1 ? (
                  <>
                    Forge Startup Concept <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="wizard-loader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-2xl relative z-10 flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                Forging Your Startup Idea
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Our AI engine is busy consulting target benchmarks, drafting branding, and establishing structure...
              </p>
            </div>

            <div className="w-full bg-slate-950 p-4 border border-slate-800/60 rounded-xl">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="tracking-wide uppercase">CURRENT STAGE:</span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 text-left">{generationPhase}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
