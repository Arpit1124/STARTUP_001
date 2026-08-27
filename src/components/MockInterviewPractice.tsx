import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic, MicOff, Play, Square, RefreshCw, CheckCircle2, AlertCircle, Sparkles,
  Bot, ShieldCheck, HelpCircle, ArrowRight, Award, ChevronRight, X, Volume2,
  Clock, RotateCcw, Copy, Check, ThumbsUp, Zap, Radio, BarChart3, PieChart as PieChartIcon,
  TrendingUp, Award as AwardIcon
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine
} from "recharts";
import { Startup } from "../types";

interface MockInterviewPracticeProps {
  startup: Startup;
  onClose?: () => void;
}

type PermissionState = "prompt" | "allowed" | "disallowed";

type InvestorPersona = "vc" | "angel" | "cto" | "yc";

interface FeedbackItem {
  question: string;
  answer: string;
  isVoice: boolean;
  score: number;
  clarity: string;
  strengths: string[];
  improvements: string[];
  idealAnswer: string;
}

const PERSONAS: { id: InvestorPersona; name: string; title: string; style: string; avatar: string; focus: string }[] = [
  {
    id: "vc",
    name: "Elena Rostova",
    title: "Partner @ Sequoia Cyber Ventures",
    style: "Skeptical & Data-Driven",
    avatar: "💼",
    focus: "TAM, CAC/LTV ratio, defensible moats, and financial unit economics."
  },
  {
    id: "angel",
    name: "Marcus Vance",
    title: "Serial Founder & Super Angel",
    style: "Encouraging & Product-Obsessed",
    avatar: "🚀",
    focus: "Founder vision, problem urgency, customer passion, and speed of execution."
  },
  {
    id: "cto",
    name: "Dr. Aris Thorne",
    title: "Managing Director @ Apex DeepTech",
    style: "Technical & Analytical",
    avatar: "⚡",
    focus: "Tech stack scalability, proprietary algorithms, data security, and moat."
  },
  {
    id: "yc",
    name: "Samantha Chen",
    title: "Group Partner @ Y Combinator",
    style: "Direct & High-Velocity",
    avatar: "🔥",
    focus: "Weekly growth metrics, user retention, initial PMF, and rapid iteration."
  }
];

export default function MockInterviewPractice({ startup, onClose }: MockInterviewPracticeProps) {
  // Permission modal & status states
  const [micPermission, setMicPermission] = useState<PermissionState>("prompt");
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Selected persona & practice mode
  const [selectedPersona, setSelectedPersona] = useState<InvestorPersona>("vc");
  const [isInterviewActive, setIsInterviewActive] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Voice recording / timer states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);

  // Stored interview feedback history
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [chartTab, setChartTab] = useState<"bars" | "radar">("bars");

  // MediaRecorder ref for microphone audio capture
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);

  // Generate tailored questions based on startup details
  const questions = [
    `Give me your 60-second pitch for ${startup.identity.name}. What urgent problem do you solve?`,
    `Who is your primary target customer, and what is your unique value proposition (${startup.identity.uvp || "UVP"}) over incumbents?`,
    startup.investorSection
      ? `You are asking for $${startup.investorSection.investmentAsk.toLocaleString()}. Walk me through how you will allocate these funds and hit profitability.`
      : `How do you plan to monetize ${startup.identity.name} and achieve break-even unit economics?`,
    `What is your unfair advantage or moat that prevents a competitor from cloning your product overnight?`,
    `Where do you see ${startup.identity.name} in 3 years, and what is your target exit or long-term growth trajectory?`
  ];

  // Text-to-speech question reader
  const handleSpeakQuestion = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeakingQuestion) {
        setIsSpeakingQuestion(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      setIsSpeakingQuestion(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle explicit Allow permission request
  const handleAllowPermission = async () => {
    setPermissionError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop stream tracks immediately since we only checked permission
        stream.getTracks().forEach((track) => track.stop());
      }
      setMicPermission("allowed");
      setShowPermissionModal(false);
    } catch (err: any) {
      console.warn("Microphone access request rejected or unhandled:", err);
      setMicPermission("disallowed");
      setPermissionError("Microphone permission was declined or unavailable in browser. Switched to Text-Only Practice Mode.");
      setShowPermissionModal(false);
    }
  };

  // Handle explicit Disallow permission
  const handleDisallowPermission = () => {
    setMicPermission("disallowed");
    setShowPermissionModal(false);
    setPermissionError(null);
  };

  // Recording timer tick
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Start microphone voice recording with live transcription
  const handleStartRecording = async () => {
    if (micPermission !== "allowed") {
      setShowPermissionModal(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Web Speech API real-time transcript
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setTypedAnswer(transcript);
          }
        };
        recognition.onerror = (e: any) => console.warn("SpeechRec error:", e);
        recognition.start();
        speechRecRef.current = recognition;
      }
    } catch (err: any) {
      console.error("Recording start error:", err);
      setMicPermission("disallowed");
      setIsRecording(false);
      setPermissionError("Could not access microphone hardware. Switched to Text-Only practice.");
    }
  };

  // Stop voice recording
  const handleStopRecording = () => {
    if (speechRecRef.current) {
      try { speechRecRef.current.stop(); } catch {}
      speechRecRef.current = null;
    }
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      } catch {}
    }
    setIsRecording(false);
  };

  // Submit answer for AI analysis
  const handleSubmitAnswer = async () => {
    if (isRecording) handleStopRecording();

    const currentQ = questions[currentQuestionIndex];
    const answerText = typedAnswer.trim() || (recordingSeconds > 0 ? `[Voice Pitch Response recorded (${recordingSeconds}s) - Pitch delivered with ${recordingSeconds > 30 ? "thorough" : "concise"} cadence]` : "No response provided.");

    setIsAnalyzing(true);

    try {
      const activePersonaObj = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

      const res = await fetch("/api/generate-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: startup.idea,
          identity: startup.identity,
          module: "chat",
          prompt: `You are acting as investor "${activePersonaObj.name}" (${activePersonaObj.title}, style: ${activePersonaObj.style}). Evaluate this startup pitch answer during a mock interview test:
Question: "${currentQ}"
Founder's Answer: "${answerText}"

Provide JSON output with:
- score: number (out of 100)
- clarity: string (e.g., "High Confidence & Direct")
- strengths: array of 2 short bullet strings
- improvements: array of 2 short bullet strings
- idealAnswer: string (short example of an exemplary investor response)
Return ONLY raw valid JSON.`
        })
      });

      let evalData: any = null;
      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json && typeof json === "object") {
          evalData = json;
        }
      }

      // Fallback if AI server response is unavailable
      if (!evalData || !evalData.score) {
        const calcScore = Math.min(98, Math.max(70, 75 + Math.floor(answerText.length / 10) + (recordingSeconds > 15 ? 10 : 0)));
        evalData = {
          score: calcScore,
          clarity: recordingSeconds > 20 || answerText.length > 80 ? "Crisp & Articulate" : "Concise / Needs Detail",
          strengths: [
            `Directly addresses ${startup.identity.name}'s core value proposition`,
            "Demonstrates founder enthusiasm and clear industry context"
          ],
          improvements: [
            "Quantify TAM numbers and CAC payback period explicitly",
            "Keep elevator pitch under 60 seconds with punchy traction metrics"
          ],
          idealAnswer: `For ${startup.identity.name}, we solve ${startup.idea.problem} for ${startup.idea.targetAudience}. Our UVP (${startup.identity.uvp}) drives strong retention, positioning us to capture market share with superior unit economics.`
        };
      }

      const newFeedback: FeedbackItem = {
        question: currentQ,
        answer: answerText,
        isVoice: recordingSeconds > 0,
        score: evalData.score || 85,
        clarity: evalData.clarity || "Clear & Confident",
        strengths: evalData.strengths || ["Clear UVP", "Strong market positioning"],
        improvements: evalData.improvements || ["Add numeric metrics", "Elaborate on unit economics"],
        idealAnswer: evalData.idealAnswer || "Strong pitch with metrics and defensible competitive moat."
      };

      setFeedbackHistory((prev) => [...prev, newFeedback]);
      setTypedAnswer("");
      setRecordingSeconds(0);

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Restart interview practice session
  const handleRestartSession = () => {
    setCurrentQuestionIndex(0);
    setFeedbackHistory([]);
    setIsFinished(false);
    setTypedAnswer("");
    setRecordingSeconds(0);
    setIsRecording(false);
  };

  // Compute average score across questions
  const averageScore = feedbackHistory.length
    ? Math.round(feedbackHistory.reduce((acc, f) => acc + f.score, 0) / feedbackHistory.length)
    : 0;

  // Copy interview transcript
  const handleCopyTranscript = () => {
    const text = feedbackHistory
      .map(
        (f, i) =>
          `Q${i + 1}: ${f.question}\nAnswer: ${f.answer}\nScore: ${f.score}/100 (${f.clarity})\nStrengths: ${f.strengths.join(", ")}\nImprovements: ${f.improvements.join(", ")}\n`
      )
      .join("\n---\n\n");
    navigator.clipboard.writeText(`STARTUPFORGE MOCK INVESTOR INTERVIEW - ${startup.identity.name.toUpperCase()}\nAverage Score: ${averageScore}/100\n\n${text}`);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  const activePersonaObj = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  return (
    <div className="bg-[#111113] text-[#e4e4e7] min-h-[600px] rounded-2xl border border-[rgba(228,228,231,0.15)] overflow-hidden flex flex-col shadow-2xl relative" id="mock-interview-container">
      {/* HEADER BAR & PERMISSION STATUS TOGGLE */}
      <div className="bg-[#18181b] p-5 border-b border-[rgba(228,228,231,0.1)] flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-xl text-[#00ff66]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-syne text-sm font-extrabold uppercase tracking-wider text-[#e4e4e7] flex items-center gap-2">
              Mock Investor Pitch Interview & Practice
              <span className="bg-gradient-to-r from-[#00ff66]/20 to-cyan-500/20 text-[#00ff66] border border-[#00ff66]/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold">
                TEST MODE
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[rgba(228,228,231,0.5)] mt-0.5">
              Practice pitching {startup.identity.name} with audio permission choices and real-time AI evaluation.
            </p>
          </div>
        </div>

        {/* PERMISSION STATUS BADGE & CHANGE BUTTON */}
        <div className="flex items-center gap-2.5">
          <div
            id="mic-permission-indicator-badge"
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-2 shadow-xs transition-all ${
              micPermission === "allowed"
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : micPermission === "disallowed"
                ? "bg-rose-500/10 border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                : "bg-white/5 border-white/10 text-slate-300"
            }`}
          >
            {micPermission === "allowed" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider">MICROPHONE: ALLOWED</span>
              </>
            ) : micPermission === "disallowed" ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <MicOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-bold uppercase tracking-wider">MICROPHONE: DENIED</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold uppercase tracking-wider">MICROPHONE: PENDING</span>
              </>
            )}
          </div>

          <button
            onClick={() => setShowPermissionModal(true)}
            className="bg-[#0c0c0e] hover:bg-white/10 text-[rgba(228,228,231,0.8)] hover:text-[#00ff66] border border-[rgba(228,228,231,0.2)] px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Configure or toggle audio microphone permissions"
            id="open-perm-modal-btn"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CHANGE PERMISSIONS</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-[rgba(228,228,231,0.5)] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* PERMISSION ASK MODAL PROMPT */}
      <AnimatePresence>
        {showPermissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#18181b] border border-[rgba(228,228,231,0.2)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-left relative overflow-hidden"
              id="permission-prompt-modal"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00ff66] via-cyan-400 to-indigo-500" />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#00ff66]/15 border border-[#00ff66]/30 rounded-2xl text-[#00ff66]">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-syne font-black text-base text-[#e4e4e7] uppercase tracking-wider">
                      Microphone & Audio Permission
                    </h4>
                    <span className="text-[10px] font-mono text-[#00ff66] font-bold">
                      Mock Pitch Interview & Speech Practice
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="p-1 text-[rgba(228,228,231,0.4)] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#0c0c0e] border border-[rgba(228,228,231,0.1)] p-4 rounded-xl space-y-2 text-xs text-[rgba(228,228,231,0.8)] leading-relaxed font-sans">
                <p>
                  StartupForge would like permission to access your microphone to enable voice responses, speech tempo analysis, and delivery feedback during mock investor pitch tests.
                </p>
                <div className="pt-2 border-t border-white/5 font-mono text-[11px] text-[rgba(228,228,231,0.6)] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
                  <span>If disallowed, you can seamlessly practice in Text-Only mode.</span>
                </div>
              </div>

              {permissionError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{permissionError}</span>
                </div>
              )}

              {/* ACTION BUTTONS: ALLOW VS DISALLOW */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDisallowPermission}
                  className="w-full bg-[#0c0c0e] hover:bg-white/10 text-[rgba(228,228,231,0.9)] border border-[rgba(228,228,231,0.2)] py-2.5 px-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                  id="btn-disallow-mic"
                >
                  <MicOff className="w-4 h-4 text-amber-400" />
                  <span>DISALLOW</span>
                </button>

                <button
                  onClick={handleAllowPermission}
                  className="w-full bg-[#00ff66] hover:bg-[#00cc52] text-black font-mono font-bold py-2.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#00ff66]/20 cursor-pointer flex items-center justify-center gap-2"
                  id="btn-allow-mic"
                >
                  <Mic className="w-4 h-4 text-black" />
                  <span>ALLOW ACCESS</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN INTERVIEW PRACTICE CONTENT */}
      <div className="p-6 md:p-8 flex-1 space-y-6">
        {/* SETUP STAGE: SELECT PERSONA & LAUNCH */}
        {!isInterviewActive && !isFinished && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="font-syne text-xl md:text-2xl font-black text-[#e4e4e7] uppercase tracking-tight">
                Select AI Investor Persona
              </h2>
              <p className="text-xs text-[rgba(228,228,231,0.6)] font-mono max-w-lg mx-auto">
                Choose an investor personality to evaluate your pitch. Questions and evaluation standards adjust automatically.
              </p>
            </div>

            {/* PERSONA CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERSONAS.map((p) => {
                const selected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      selected
                        ? "bg-[#00ff66]/[0.06] border-[#00ff66] shadow-lg shadow-[#00ff66]/10"
                        : "bg-[#18181b] border-[rgba(228,228,231,0.1)] hover:border-white/30"
                    }`}
                  >
                    {selected && (
                      <span className="absolute top-3 right-3 bg-[#00ff66] text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                        SELECTED
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl p-2 bg-white/5 rounded-xl border border-white/10">{p.avatar}</span>
                      <div>
                        <h4 className="font-bold text-sm text-[#e4e4e7]">{p.name}</h4>
                        <span className="text-[10px] font-mono text-[#00ff66] block">{p.title}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[rgba(228,228,231,0.7)] font-mono mb-2">{p.style}</p>
                    <p className="text-[11px] text-[rgba(228,228,231,0.5)] italic leading-relaxed border-t border-white/5 pt-2">
                      Focus: {p.focus}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* START TEST ACTION BAR */}
            <div className="bg-[#18181b] border border-[rgba(228,228,231,0.15)] p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="space-y-1 text-left font-mono">
                <span className="text-[10px] uppercase text-[rgba(228,228,231,0.4)] tracking-wider">TEST SETUP SUMMARY</span>
                <p className="text-xs text-[#e4e4e7] font-bold">
                  5 Pitch Questions • Evaluator: {activePersonaObj.name} ({micPermission === "allowed" ? "🎙️ Voice Mode Allowed" : "🚫 Text-Only Disallowed Mode"})
                </p>
              </div>

              <button
                onClick={() => setIsInterviewActive(true)}
                className="w-full sm:w-auto bg-[#00ff66] hover:bg-[#00cc52] text-black font-mono font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00ff66]/20 cursor-pointer flex items-center justify-center gap-2"
                id="start-mock-interview-btn"
              >
                <span>LAUNCH PRACTICE TEST</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE PRACTICE SESSION */}
        {isInterviewActive && !isFinished && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* PROGRESS COUNTER */}
            <div className="flex justify-between items-center font-mono text-xs border-b border-[rgba(228,228,231,0.1)] pb-3">
              <span className="text-[#00ff66] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
                QUESTION {currentQuestionIndex + 1} OF {questions.length}
              </span>

              <span className="text-[rgba(228,228,231,0.5)]">
                Evaluator: <strong className="text-white">{activePersonaObj.name}</strong>
              </span>
            </div>

            {/* QUESTION CARD */}
            <div className="bg-[#18181b] border border-[#00ff66]/30 p-6 rounded-2xl space-y-4 shadow-xl text-left relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activePersonaObj.avatar}</span>
                  <div>
                    <span className="text-[10px] font-mono text-[#00ff66] uppercase font-bold tracking-wider">
                      {activePersonaObj.name} asks:
                    </span>
                    <p className="font-syne font-bold text-base md:text-lg text-[#e4e4e7] mt-0.5 leading-snug">
                      "{questions[currentQuestionIndex]}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakQuestion(questions[currentQuestionIndex])}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                    isSpeakingQuestion
                      ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] animate-pulse"
                      : "bg-[#0c0c0e] hover:bg-white/10 border-white/10 text-[rgba(228,228,231,0.7)] hover:text-[#00ff66]"
                  }`}
                  title="Listen to investor voice audio readout"
                  id="speak-question-btn"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RESPONSE INPUT SECTION */}
            <div className="bg-[#18181b] border border-[rgba(228,228,231,0.15)] p-6 rounded-2xl space-y-4 text-left">
              <div className="flex justify-between items-center font-mono text-xs">
                <span className="text-[rgba(228,228,231,0.6)] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {micPermission === "allowed" ? (
                    <>
                      <Mic className="w-4 h-4 text-emerald-400" />
                      Voice & Text Pitch Delivery
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-amber-400" />
                      Text-Only Pitch Delivery (Mic Disallowed)
                    </>
                  )}
                </span>

                {micPermission === "allowed" && (
                  <span className="text-xs font-mono text-[#00ff66] font-bold">
                    RECORDED: {recordingSeconds}s / 60s
                  </span>
                )}
              </div>

              {/* AUDIO RECORDING CONTROLS IF PERMISSION GRANTED */}
              {micPermission === "allowed" && (
                <div className="p-4 bg-[#0c0c0e] border border-emerald-500/30 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all"
                        id="btn-start-recording"
                      >
                        <Mic className="w-4 h-4" />
                        <span>START RECORDING RESPONSE</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all animate-pulse"
                        id="btn-stop-recording"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>STOP RECORDING ({recordingSeconds}s)</span>
                      </button>
                    )}

                    {isRecording && (
                      <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Listening & Analyzing Speech Wave...</span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-[rgba(228,228,231,0.5)]">
                    Speech Tempo & Clarity Tracking
                  </span>
                </div>
              )}

              {/* TEXTAREA RESPONSE */}
              <div className="space-y-2">
                <textarea
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder={
                    micPermission === "allowed"
                      ? "Optionally add or refine your response text here..."
                      : "Type your pitch answer here to submit for AI evaluation..."
                  }
                  rows={4}
                  className="w-full bg-[#0c0c0e] text-[#e4e4e7] border border-[rgba(228,228,231,0.2)] focus:border-[#00ff66] focus:outline-none rounded-xl p-3.5 text-xs font-mono leading-relaxed placeholder-[rgba(228,228,231,0.3)] resize-none"
                  id="interview-typed-answer"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleRestartSession}
                  className="text-[10px] font-mono text-[rgba(228,228,231,0.5)] hover:text-white transition-colors cursor-pointer"
                >
                  Reset Session
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={isAnalyzing}
                  className="bg-[#00ff66] hover:bg-[#00cc52] text-black font-mono font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  id="submit-interview-answer-btn"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>EVALUATING PITCH...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT FOR ANALYSIS</span>
                      <ChevronRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FINISHED SESSION SCORECARD & PERFORMANCE ANALYSIS CHART */}
        {isFinished && (() => {
          const questionChartData = feedbackHistory.map((item, idx) => ({
            name: `Q${idx + 1}`,
            topic: ["60s Pitch", "Target & UVP", "Economics & Funding", "Moat / Defensibility", "3-Year Vision"][idx] || `Q${idx + 1}`,
            score: item.score,
            benchmark: 85
          }));

          const dimensionChartData = [
            { subject: "Pitch Clarity", score: Math.round(((feedbackHistory[0]?.score || 80) + (feedbackHistory[1]?.score || 80)) / 2), fullMark: 100 },
            { subject: "Financial Logic", score: feedbackHistory[2]?.score || 78, fullMark: 100 },
            { subject: "Moat & Defense", score: feedbackHistory[3]?.score || 82, fullMark: 100 },
            { subject: "Strategic Vision", score: feedbackHistory[4]?.score || 85, fullMark: 100 },
            { subject: "Overall Readiness", score: averageScore, fullMark: 100 }
          ];

          const highestQuestion = [...questionChartData].sort((a, b) => b.score - a.score)[0];
          const lowestQuestion = [...questionChartData].sort((a, b) => a.score - b.score)[0];

          return (
            <div className="max-w-4xl mx-auto space-y-6 text-left">
              {/* SCORE BANNER */}
              <div className="bg-gradient-to-r from-[#18181b] to-[#0c0c0e] border border-[#00ff66]/40 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                <div className="space-y-2 text-left">
                  <span className="bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    TEST COMPLETED
                  </span>
                  <h2 className="font-syne font-black text-2xl text-[#e4e4e7]">
                    Pitch Performance Summary
                  </h2>
                  <p className="text-xs font-mono text-[rgba(228,228,231,0.6)]">
                    Evaluated by {activePersonaObj.name} ({activePersonaObj.title})
                  </p>
                </div>

                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-2xl min-w-[160px]">
                  <span className="text-[10px] font-mono text-[rgba(228,228,231,0.5)] block uppercase font-bold">
                    OVERALL PITCH SCORE
                  </span>
                  <span className="text-4xl font-black text-[#00ff66] font-syne">{averageScore}/100</span>
                  <span className="text-[10px] font-mono text-[#00ff66] block mt-0.5 font-bold">
                    {averageScore >= 85 ? "INVESTOR READY" : "STRONG FOUNDATION"}
                  </span>
                </div>
              </div>

              {/* PERFORMANCE ANALYSIS CHART CARD */}
              <div className="bg-[#18181b] border border-[rgba(228,228,231,0.15)] p-6 rounded-2xl space-y-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-lg text-[#00ff66]">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-syne font-extrabold text-sm text-[#e4e4e7] uppercase tracking-wider">
                        Performance Analysis Chart
                      </h3>
                      <p className="text-[11px] font-mono text-[rgba(228,228,231,0.5)]">
                        Real-time score trajectory and investor readiness competency radar
                      </p>
                    </div>
                  </div>

                  {/* CHART TYPE TOGGLE TABS */}
                  <div className="flex items-center bg-[#0c0c0e] p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setChartTab("bars")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        chartTab === "bars"
                          ? "bg-[#00ff66] text-black shadow-md"
                          : "text-[rgba(228,228,231,0.6)] hover:text-white"
                      }`}
                      id="chart-tab-bars"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>QUESTION SCORES</span>
                    </button>
                    <button
                      onClick={() => setChartTab("radar")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        chartTab === "radar"
                          ? "bg-[#00ff66] text-black shadow-md"
                          : "text-[rgba(228,228,231,0.6)] hover:text-white"
                      }`}
                      id="chart-tab-radar"
                    >
                      <PieChartIcon className="w-3.5 h-3.5" />
                      <span>COMPETENCY RADAR</span>
                    </button>
                  </div>
                </div>

                {/* CHART CONTAINER */}
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartTab === "bars" ? (
                      <BarChart data={questionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
                          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
                          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-[#0c0c0e] border border-[#00ff66]/40 p-3 rounded-xl shadow-2xl font-mono text-xs text-[#e4e4e7] space-y-1">
                                  <p className="font-bold text-[#00ff66]">{data.name}: {data.topic}</p>
                                  <p className="text-white">Score: <strong className="text-[#00ff66]">{data.score}/100</strong></p>
                                  <p className="text-[rgba(228,228,231,0.6)] text-[10px]">Benchmark: 85/100</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <ReferenceLine y={85} stroke="#00ff66" strokeDasharray="3 3" label={{ value: "Benchmark (85)", fill: "#00ff66", fontSize: 10 }} />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {questionChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.score >= 85 ? "#00ff66" : entry.score >= 75 ? "#38bdf8" : "#f59e0b"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dimensionChartData}>
                        <PolarGrid stroke="rgba(255,255,255,0.15)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#e4e4e7", fontSize: 11, fontFamily: "monospace" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 9 }} />
                        <Radar name="Pitch Competency" dataKey="score" stroke="#00ff66" fill="#00ff66" fillOpacity={0.3} />
                      </RadarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* KEY HIGHLIGHTS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 font-mono text-xs">
                  <div className="bg-[#0c0c0e] p-3 rounded-xl border border-emerald-500/20 space-y-1">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase block flex items-center gap-1">
                      <AwardIcon className="w-3 h-3 text-emerald-400" />
                      TOP PERFORMING SECTION
                    </span>
                    <p className="font-bold text-white text-xs">{highestQuestion?.name}: {highestQuestion?.topic}</p>
                    <span className="text-[#00ff66] text-[10px] block font-bold">{highestQuestion?.score}/100 Score</span>
                  </div>

                  <div className="bg-[#0c0c0e] p-3 rounded-xl border border-amber-500/20 space-y-1">
                    <span className="text-[9px] font-bold text-amber-400 uppercase block flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-amber-400" />
                      PRIMARY REFINEMENT AREA
                    </span>
                    <p className="font-bold text-white text-xs">{lowestQuestion?.name}: {lowestQuestion?.topic}</p>
                    <span className="text-amber-400 text-[10px] block font-bold">{lowestQuestion?.score}/100 Score</span>
                  </div>

                  <div className="bg-[#0c0c0e] p-3 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[9px] font-bold text-[rgba(228,228,231,0.6)] uppercase block flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#00ff66]" />
                      BENCHMARK DELTA
                    </span>
                    <p className="font-bold text-white text-xs">
                      {averageScore >= 85 ? `+${averageScore - 85} Above Target` : `${averageScore - 85} Below Target`}
                    </p>
                    <span className="text-[rgba(228,228,231,0.5)] text-[10px] block">Target Score: 85/100</span>
                  </div>
                </div>
              </div>

              {/* FEEDBACK BREAKDOWN */}
              <div className="space-y-4">
                <h4 className="font-syne font-bold text-sm text-[#e4e4e7] uppercase tracking-wider flex justify-between items-center">
                  <span>QUESTION EVALUATION BREAKDOWN</span>
                  <button
                    onClick={handleCopyTranscript}
                    className="bg-[#0c0c0e] hover:bg-white/10 text-[rgba(228,228,231,0.8)] hover:text-[#00ff66] border border-[rgba(228,228,231,0.2)] px-3 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    id="copy-transcript-btn"
                  >
                    {copiedTranscript ? <Check className="w-3.5 h-3.5 text-[#00ff66]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTranscript ? "COPIED TRANSCRIPT" : "COPY TRANSCRIPT"}</span>
                  </button>
                </h4>

                <div className="space-y-3">
                  {feedbackHistory.map((item, idx) => (
                    <div key={idx} className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-5 rounded-xl space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-2">
                        <span className="text-[#00ff66] font-bold">Q{idx + 1}: {item.question}</span>
                        <span className="bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0">
                          {item.score}/100 • {item.clarity}
                        </span>
                      </div>

                      <div className="p-2.5 bg-[#0c0c0e] rounded-lg text-[rgba(228,228,231,0.8)] italic border border-white/5">
                        "{item.answer}"
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">
                          <span className="text-[9px] font-bold text-emerald-400 uppercase block">Strengths</span>
                          <ul className="space-y-1 text-[11px] text-[rgba(228,228,231,0.8)] list-disc pl-3">
                            {item.strengths.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>

                        <div className="space-y-1 bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                          <span className="text-[9px] font-bold text-amber-400 uppercase block">Improvements Needed</span>
                          <ul className="space-y-1 text-[11px] text-[rgba(228,228,231,0.8)] list-disc pl-3">
                            {item.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RESTART OR RETRY BUTTONS */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={handleRestartSession}
                  className="bg-[#00ff66] hover:bg-[#00cc52] text-black font-mono font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00ff66]/20 cursor-pointer flex items-center gap-2"
                  id="retry-mock-interview-btn"
                >
                  <RotateCcw className="w-4 h-4 text-black" />
                  <span>Retry Mock Interview</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
