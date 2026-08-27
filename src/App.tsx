import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PieChart, Pie, Cell } from "recharts";
import {
  Sparkles, Plus, Folder, LogIn, User as UserIcon, LogOut, Code, Bot, Globe, Shield,
  TrendingUp, Activity, CheckCircle, ArrowRight, Star, Heart, Flame, Database, ChevronRight,
  Search, ArrowUpDown, X, Download, CheckSquare, Square, Trash2, Tag, Command, FileJson, Zap,
  MoreVertical, Edit3, Copy, Share2, CheckCircle2, GripVertical, ChevronDown, ChevronUp,
  Clock, Timer, ArrowUp, ArrowDown, MessageCircle, Mail, FileText, Printer, Lightbulb, Send, AlertTriangle, MessageSquare,
  StickyNote, Award, ExternalLink, PartyPopper
} from "lucide-react";
import confetti from "canvas-confetti";
import { Startup, User } from "./types";
import { STARTUP_ARCHETYPES_CATALOG, archetypeToStartup, generateFullStartupStrategy, StartupArchetype } from "./utils/startupTemplates";
import AuthModal from "./components/AuthModal";
import StartupWizard from "./components/StartupWizard";
import StartupDashboard from "./components/StartupDashboard";
import AdminPanel from "./components/AdminPanel";
import { WorkspaceHoverTooltip } from "./components/WorkspaceHoverTooltip";
import canvaAiLogo from "./assets/images/canva_ai_logo_1785082405207.jpg";


// Complete preloaded high-fidelity startup to provide immediate workspace exploration
const PRELOADED_STARTUP: Startup = {
  id: "preloaded_agrisoil",
  ownerId: "mock_user_123",
  createdAt: "July 12, 2026",
  progress: 100,
  previousDayProgress: 90,
  status: "Finalized",
  isFavorite: true,
  idea: {
    industry: "SaaS Agriculture",
    problem: "Soil nitrogen and pH analysis takes 3 weeks and costs $400, delaying fertilization plans.",
    targetAudience: "Mid-sized family farms and independent crop agronomists.",
    budget: "$15,000",
    country: "United States"
  },
  identity: {
    name: "AgriSoil AI",
    tagline: "Instant autonomous soil intelligence.",
    mission: "To eliminate chemical guessing in crop farming by providing on-demand, sub-minute soil health analysis.",
    vision: "To become the global standard dataset for micro-nutrient calibration across arable land.",
    elevatorPitch: "AgriSoil AI combines custom mobile spectrographic probes with artificial intelligence to diagnose soil nitrogen, potassium, and phosphorus in under 60 seconds. Instead of waiting weeks for lab results, farmers receive hyper-targeted, prescription-level fertilization maps directly on their smartphones, saving up to 22% in overhead costs.",
    uvp: "Sub-minute chemical detection maps via low-cost mobile spectrography with 94.2% lab accuracy.",
    brandVoice: "Scientific, supportive, technical, humble",
    typography: {
      heading: "Space Grotesk",
      body: "Inter"
    },
    brandColors: {
      primary: "#064e3b",
      secondary: "#10b981",
      accent: "#f59e0b",
      bg: "#f8fafc"
    },
    logoPrompt: "A sleek modern hexagram containing green micro-veins representing soil and intelligence",
    domainIdeas: ["agrisoil.ai", "agrisoil-tech.com"],
    socialHandles: {
      twitter: "@agrisoil",
      linkedin: "company/agrisoil",
      instagram: "agrisoil"
    }
  },
  marketResearch: {
    tam: "$8.4B globally across grain and legume farming sectors",
    sam: "$1.2B US sustainable farming consultants and advisors",
    som: "$44M first 3 target Midwest wheat producing states",
    industrySize: "Valued at $12.4B in 2025, expanding at a CAGR of 11.4% driven by fertilizer cost inflation.",
    growthTrends: "High pressure to reduce nitric runoff, combined with real-time drone and satellite crop telemetry.",
    painPoints: ["Wet lab turnaround latency", "Courier delivery expenses"],
    opportunities: ["Carbon credit validation", "Retail precision hardware partnerships"],
    risks: ["Laser calibration limitations", "Farmer technology skepticism"],
    swot: {
      strengths: [
        "Proprietary chemical calibration models trained on 10,000 Midwestern soil core samples.",
        "Low-cost, high-durability portable optical spectrum hardware.",
        "Immediate cell-signal syncing for offline-first rural usage."
      ],
      weaknesses: [
        "Dependent on initial device distribution logistics.",
        "Calibrating clay-heavy soils requires higher-power lasers.",
        "Farmers are historically slow to adopt new technological hardware."
      ],
      opportunities: [
        "Integration with carbon credit validation registries.",
        "Partnerships with John Deere and Case IH telemetry rails.",
        "Government subsidies for agricultural runoff reduction."
      ],
      threats: [
        "Legacy laboratory chains offering express courier pick-up.",
        "Direct satellite moisture indices mimicking nutrient charts.",
        "Supply chain blockages on optic laser elements."
      ]
    },
    pestle: {
      political: "Sustained USDA agricultural resource subsidies",
      economic: "Fertilizer price inflation driving precision demand",
      social: "Increased environmental consumer interest in organic soil metrics",
      technological: "Widespread rural cellular internet growth",
      legal: "State-level nitrogen runoff penalties and carbon validation compliance",
      environmental: "Extreme weather cycles demanding rapid soil mitigation plans"
    },
    customerPersonas: [
      {
        name: "Farmer Dave",
        role: "Multi-generation Crop Grower",
        demographics: "Age 54, Iowa, manages 1,200 acres of yellow corn.",
        quote: "I can't afford to guess with $200k worth of fertilizer, but waiting 3 weeks for lab charts means missing the planting window.",
        painPoints: [
          "Laboratory backlogs during peak spring periods.",
          "Over-fertilization causing chemical burn and local runoff complaints."
        ],
        goals: [
          "Maintain optimal yield without wasting chemical budgets.",
          "Get immediate answers in the field."
        ]
      },
      {
        name: "Agronomist Alexa",
        role: "Independent Soil Consultant",
        demographics: "Age 31, Oregon, serves 42 organic vineyards.",
        quote: "My clients expect precise chemical reports. I need a modern tool to analyze soil samples in real-time during field walks.",
        painPoints: [
          "Manual spreadsheet reporting is slow and tedious.",
          "Legacy competitors scaling their client counts rapidly."
        ],
        goals: [
          "Generate instant professional PDFs for clients.",
          "Increase weekly farm visits by 3x."
        ]
      }
    ]
  },
  competitorAnalysis: {
    marketOverview: "The agricultural soil analysis space is highly fragmented, occupied primarily by localized wet-chemistry laboratories with average turnaround times of 14-21 days.",
    opportunitiesToDifferentiate: "By placing immediate spectrographic diagnostics directly in the hands of growers, we bypass logistics delays entirely and capture high-margin SaaS revenue.",
    competitors: [
      {
        name: "AgSource Labs",
        pricing: "$35 - $60 per physical sample",
        features: ["Wet-lab chemistry", "Full trace mineral reports", "Courier logistics"],
        strengths: ["Highly accurate", "USDA accredited"],
        weaknesses: ["Takes 14 days", "Expensive shipping fees"],
        positioning: "Trusted legacy provider",
        differentiation: "AgriSoil AI delivers results instantly in the field without shipping overhead."
      },
      {
        name: "Trace Genomics",
        pricing: "$120 per DNA sample",
        features: ["Soil microbiome sequencing", "Pathogen prediction", "Custom portals"],
        strengths: ["Deep biological data", "Strong scientific backing"],
        weaknesses: ["Overkill for nitrogen updates", "Extremely slow feedback loop"],
        positioning: "Premium biotech player",
        differentiation: "We focus on real-time macro-nutrient levels required for immediate planting cycles."
      }
    ]
  },
  businessModel: {
    canvas: {
      keyPartners: ["Agricultural cooperatives", "Optic hardware distributors", "Agronomy universities"],
      keyActivities: ["Spectrographic model calibration", "SaaS dashboard maintenance", "B2B client onboarding"],
      keyResources: ["Proprietary spectrograph models", "Mobile spectrographic hardware", "Agribusiness sales team"],
      valuePropositions: ["Instant soil nitrogen diagnostics", "Reduced chemical fertilizer costs", "Interactive prescription maps"],
      customerRelationships: ["Direct consulting support", "Automated weekly email summary reports"],
      channels: ["Agri-retail distribution stores", "Soil science trade conferences", "Direct farm sales reps"],
      customerSegments: ["Mid-sized commercial grain farmers", "Organic vineyard operators", "Crop agronomists"],
      costStructure: ["Hardware component assembly", "AI model training", "Server cloud API compute infrastructure"],
      revenueStreams: ["Monthly software subscriptions", "One-time spectrometer hardware sales"]
    },
    revenueStreams: ["Software monthly tiers", " spectrometer hardware sales"],
    pricingStrategy: [
      {
        tier: "AgriSoil Starter",
        price: "$49 / month",
        features: ["1 spectrometer device included", "Up to 50 active soil scans/month", "Standard iOS/Android dashboard app", "Email support"]
      },
      {
        tier: "Grower Pro",
        price: "$149 / month",
        features: ["2 spectrometer devices included", "Unlimited field scans", "Prescription-level fertilizer export maps", "Priority 24/7 phone agronomist hotline"]
      },
      {
        tier: "Enterprise Cooperative",
        price: "Custom Contract",
        features: ["Unlimited devices for all field reps", "White-labeled agronomist client PDF reports", "Custom API data integrations"]
      }
    ],
    costStructureDesc: "Focus on laser hardware assembly, data-pipeline storage, and direct Midwest representative sales salaries."
  },
  financialPlanner: {
    profitProjectionYear1: 144200,
    breakEvenMonths: 5,
    breakEvenRevenue: 12500,
    cashFlowEstimate: "We project positive operational cash flow by Month 5 based on selling 85 Spectrograph hardware units and establishing 140 recurring Grower Pro subscribers.",
    budget: [
      { item: "Hardware Spectrometer Prototypes", cost: 4500, category: "Setup" },
      { item: "Cloud infrastructure & API tokens", cost: 1500, category: "Other" },
      { item: "Agricultural Cooperative Marketing", cost: 4000, category: "Marketing" },
      { item: "Legal incorporation & liability covers", cost: 2000, category: "Legal" }
    ],
    monthlyExpenses: [
      { item: "Server hosting & AI compute nodes", cost: 350, category: "Hosting/Software" },
      { item: "Google/LinkedIn ad campaigns", cost: 1200, category: "Marketing" },
      { item: "Hardware maintenance & repairs", cost: 400, category: "Other" },
      { item: "Legal counsel & compliance checks", cost: 250, category: "Other" }
    ],
    projections: [
      { month: "Month 1", revenue: 1500, expenses: 8450, profit: -6950 },
      { month: "Month 2", revenue: 3400, expenses: 7200, profit: -3800 },
      { month: "Month 3", revenue: 6200, expenses: 6400, profit: -200 },
      { month: "Month 4", revenue: 9800, expenses: 5800, profit: 4000 },
      { month: "Month 5", revenue: 13500, expenses: 5200, profit: 8300 },
      { month: "Month 6", revenue: 16800, expenses: 5400, profit: 11400 },
      { month: "Month 7", revenue: 19500, expenses: 5600, profit: 13900 },
      { month: "Month 8", revenue: 22000, expenses: 5800, profit: 16200 },
      { month: "Month 9", revenue: 24500, expenses: 6000, profit: 18500 },
      { month: "Month 10", revenue: 27000, expenses: 6200, profit: 20800 },
      { month: "Month 11", revenue: 29500, expenses: 6400, profit: 23100 },
      { month: "Month 12", revenue: 32000, expenses: 6600, profit: 25400 }
    ]
  },
  mvpPlanner: {
    features: [
      { name: "Optical Spectrograph Calibration", description: "Firmware module to capture light reflections on soil samples and output raw spectrographic waveforms.", priority: "Must-Have", complexity: "High" },
      { name: "Mobile Spectrometer Bluetooth Link", description: "iOS/Android application module to pair with the handheld device and upload scans instantly.", priority: "Must-Have", complexity: "Medium" },
      { name: "SaaS Diagnostic Dashboard", description: "Web-based portal showing macro-nutrient trends, crop prescription recommendations, and history logs.", priority: "Must-Have", complexity: "Low" }
    ],
    userStories: [
      { role: "Crop Farmer", action: "Perform immediate scans in the field", benefit: "Calibrate nutrient mix in real-time", acceptanceCriteria: ["Scan yields complete in under 60 seconds", "Accuracy maintains above 92%"] }
    ],
    roadmap: {
      phase1: "Hardware spectrometer validation, laser casing blueprints, and micro-nutrient spectrographic training datasets.",
      phase2: "Handheld Bluetooth syncing app development and real-time offline local data storage caching.",
      phase3: "B2B Agronomist portal design, custom PDF export tools, and farm cooperative pilot runs.",
      phase4: "Launch public marketing campaign, integrate third-party drone coordinates, and begin general order shipping."
    },
    sprints: [
      { name: "Sprint 1: Hardware integration", goal: "Calibrate optical lenses to capture phosphorus reflectance levels.", tasks: [{ title: "Lenses mounting", duration: "1 week", assignee: "Optics Engineer" }] }
    ],
    timelineWeeks: 12
  },
  technicalArchitecture: {
    backendDetails: "Node.js Express API proxying requests to Google GenAI for diagnostic predictions and utilizing PostgreSQL on Cloud SQL for historical records.",
    frontendDetails: "Single-Page React application bundled with Vite and styled dynamically using Tailwind utility classes.",
    authFlow: "Firebase Authentication handling email/password credentials and OAuth Google login tokens securely.",
    cloudRecommendation: "Google Cloud Run hosting the API containers, with static assets served via Google Cloud Storage CDN.",
    deploymentPlan: "Continuous Integration pipeline built with GitHub Actions, pushing bundled images to Google Artifact Registry upon main commits.",
    techStack: [
      { layer: "Frontend Framework", tech: "React 19 + TypeScript + Vite", reason: "Fast compilation times, lightweight bundle, and excellent SPA responsive routing." },
      { layer: "Backend Server", tech: "Express (Node.js)", reason: "Highly robust, fast middleman routing, and native SDK integration for Gemini models." },
      { layer: "Primary Database", tech: "PostgreSQL on Cloud SQL", reason: "Relational schema design required for structured chemical soil entries and user activity tracking." }
    ],
    databaseDesign: [
      {
        name: "users",
        columns: [
          { name: "id", type: "uuid (PK)", notes: "Unique user identifier from Auth" },
          { name: "email", type: "varchar(255)", notes: "User email address" },
          { name: "subscription_tier", type: "varchar(50)", notes: "FREE, PRO, or ENTERPRISE" }
        ]
      },
      {
        name: "soil_scans",
        columns: [
          { name: "id", type: "uuid (PK)", notes: "Unique scan log ID" },
          { name: "user_id", type: "uuid (FK)", notes: "Links to users.id" },
          { name: "nitrogen_level", type: "numeric(5,2)", notes: "Measured nitrogen concentration" }
        ]
      }
    ],
    apiList: [
      { method: "POST", path: "/api/scans/analyze", description: "Uploads raw spectrographic waveforms to evaluate nutrient values.", payload: "{ rawWaveform: [] }", response: "{ status: 'success', nitrogen: 12.4 }" }
    ]
  },
  prd: {
    problemStatement: "Current chemical soil analysis is too slow and expensive, leaving modern agronomists and farmers with outdated crop health charts.",
    goals: ["Provide laboratory chemical metrics under 60 seconds", "Maintain high diagnostic repeatability"],
    functionalRequirements: [
      { id: "FR-1", req: "Handheld spectrographic hardware must sync via standard Bluetooth BLE protocol.", priority: "High" },
      { id: "FR-2", req: "Users must be able to export custom soil prescription maps in PDF format.", priority: "Medium" }
    ],
    nonFunctionalRequirements: [
      { id: "NFR-1", req: "Application must handle scans offline without cellular internet grid connections.", type: "Reliability" }
    ],
    userStories: [
      "As a corn farmer, I want to scan my soil in 60 seconds so that I can calibrate my fertilizer sprayer immediately.",
      "As an agronomist, I want to export custom branded white-label PDF reports for my field clients."
    ],
    acceptanceCriteria: "Optical diagnostic calibration must match laboratory chemical results with at least 92% accuracy across clay and silt soils.",
    kpis: [
      "Average turnaround time under 60 seconds",
      "Customer acquisition cost (CAC) under $250",
      "SaaS churn rate below 2.8% annually"
    ],
    risks: ["Extreme weather disrupting spectral calibrations", "Global supply restrictions on optical semiconductor elements"]
  },
  marketingPlanner: {
    gtmStrategy: "Deploy field agronomist reps directly to agricultural cooperatives, targeting spring planting schedules.",
    socialMediaPlan: {
      twitter: ["🚀 Announcing instant spectrographic scans on wheat farms!", "How AgriSoil saves crop overhead costs."],
      linkedin: ["Fascinating developments in sustainable soil analytics.", "Optimizing regional macro-nutrient levels."],
      instagram: ["Our spectacular optical scanner in field action.", "Green corn rows growing healthier."]
    },
    launchChecklist: {
      preLaunch: [
        "Create custom 3D spectrometer renders for high-fidelity social banners.",
        "Launch a closed beta with 12 organic family farms in Iowa and Illinois."
      ],
      launchDay: [
        "Launch early-bird discount checkout links on Product Hunt and agri-retailer hubs.",
        "Send email notifications to 2,500 waiting-list growers."
      ],
      postLaunch: [
        "Sponsor sustainable grain crop farming podcasts.",
        "Gather video feedback reviews from Midwest pilot users."
      ]
    },
    seoKeywords: ["soil nutrients scanner", "precision fertilizer app", "real-time agritech tools", "instant nitrogen test"],
    contentIdeas: ["Ultimate guide to micro-nutrient crop health", "How nitric runoff hurts cooperative soil"],
    emailCampaign: [
      { subject: "Stop chemical guessing on your crops", body: "Check out immediate spectrograph evaluations directly on your smartphone..." }
    ],
    adIdeas: [
      { platform: "Facebook Crop Interest", headline: "Instantly check nitrogen levels", copy: "Reduce expensive fertilizer waste up to 22%." }
    ]
  },
  investorSection: {
    investmentAsk: 350000,
    financialHighlights: "Projecting $1.4M ARR by Year 2 with highly attractive 74% gross margins on spectrometers and 90% software SaaS margins.",
    exitStrategy: "Acquisition target by large machinery and crop logistics giants (e.g., Deere & Company, Corteva, Syngenta) within 5 years.",
    executiveSummary: "AgriSoil AI represents a massive disruption opportunity in the precision agriculture space. By resolving physical laboratory courier delays, we empower growers to make data-driven nitrogen and nutrient decisions instantly in the field.",
    useOfFunds: [
      { item: "Spectrograph Optic Parts Procurement", percentage: 40 },
      { item: "AI calibration model engineering", percentage: 35 },
      { item: "Midwest farm cooperative sales", percentage: 25 }
    ],
    pitchDeckOutline: [
      { slide: 1, title: "The Massive Delay", bullets: ["Modern farming requires rapid nutrient data, but laboratory queues take 21 days.", "Fertilizer waste costs family farms thousands of dollars every spring."] },
      { slide: 2, title: "Our Solution: AgriSoil AI", bullets: ["Handheld spectrographic probes delivering laboratory accuracy in 60 seconds.", "Instant smartphone mapping and targeted prescription spreadsheets."] }
    ]
  },
  legalChecklist: {
    companyRegistration: [
      "Incorporate as an agricultural-tech Delaware C-Corp.",
      "Establish primary business liability insurance for physical spectrometer equipment."
    ],
    privacyPolicyOutline: [
      "We strictly safeguard individual farm geolocation maps.",
      "Soil nutrient density vectors are never shared without consent."
    ],
    termsOfServiceOutline: [
      "Users agree spectrometer hardware devices must only be operated under dry climates.",
      "Subscription plans cover software support and active spectrographic predictions."
    ],
    ipConsiderations: [
      "AgriSoil AI retains utility patents over laser spectrographic nutrient evaluation models.",
      "Custom smartphone software frameworks are trade secret proprietary content."
    ],
    trademarkChecklist: [
      "Perform USPTO search for brand term 'AgriSoil AI'.",
      "File provisional utility patents on optical laser calibration models."
    ]
  },
  landingPage: {
    hero: {
      headline: "Instant Soil Intelligence, Right in Your Hand",
      subheadline: "Stop waiting weeks for wet-lab feedback. AgriSoil AI delivers micro-nutrient prescription maps directly to your smartphone in 60 seconds.",
      ctaText: "Request early-bird access"
    },
    features: [
      { title: "On-Demand Optical Scan", description: "Simply place our handheld spectrograph on any soil sample and get answers in seconds.", icon: "zap" },
      { title: "Fertility Prescriptions", description: "Receive custom formulas for nitrogen, potassium, and phosphorus tailored specifically to your crop type.", icon: "activity" },
      { title: "Offline-First Syncing", description: "Works flawlessly in remote rural zones, automatically syncing records once cell coverage is found.", icon: "shield" }
    ],
    pricing: [
      { tier: "AgriSoil Starter", price: "$49 / month", features: ["1 Handheld spectrometer", "50 active scans per month", "iOS/Android app dashboard"] },
      { tier: "Grower Pro", price: "$149 / month", features: ["2 Spectrometer devices", "Unlimited field scans", "Prescription PDF export maps", "Priority agronomy support"] }
    ],
    testimonials: [
      { name: "Farmer Bill", role: "Corn grower, Illinois", quote: "Using AgriSoil saved me nearly $14,000 in urea fertilizer waste in my very first season. Truly revolutionary tool.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
      { name: "Sarah J.", role: "Vineyard Consultant", quote: "My client reports are generated immediately now during farm walks. They are blown away by the speed and science.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" }
    ],
    faq: [
      { question: "How accurate is the spectrograph spectrometer?", answer: "Our laser optical spectral model achieves a verified 94.2% correlation accuracy compared to standard laboratory wet-lab chemistry reports." },
      { question: "Is physical training required to operate the spectrometer?", answer: "Not at all. It features a simple one-click button trigger with real-time calibration guides on our mobile app." }
    ],
    contactText: "Questions? Chat with our agritech support team at support@agrisoil.ai"
  },
  chatHistory: [
    {
      sender: "ai",
      text: "Welcome to the AgriSoil AI strategy room! 🚀\n\nI have fully loaded your complete agricultural SaaS parameters. We have established your **SWOT matrix**, drafted your **Business Model Canvas**, calculated your **TAM, SAM, SOM metrics**, and designed your relational **database schemas**!\n\nHow can I help you refine your operations today? You can ask me to draft a pitch letter, modify pricing tiers, or solve technical hurdles!",
      timestamp: "11:24 AM"
    }
  ]
};

// Deep search across all nested properties of a Startup object
function searchDeepInObject(obj: unknown, q: string): boolean {
  if (obj === null || obj === undefined) return false;
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return String(obj).toLowerCase().includes(q);
  }
  if (Array.isArray(obj)) {
    return obj.some((item) => searchDeepInObject(item, q));
  }
  if (typeof obj === "object") {
    return Object.values(obj).some((val) => searchDeepInObject(val, q));
  }
  return false;
}

// Helper to identify specific sections where a search query matched for visual badges
function getMatchedSections(st: Startup, query: string): string[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const sections: string[] = [];

  if (searchDeepInObject(st.identity, q)) sections.push("Identity / Mission");
  if (searchDeepInObject(st.idea, q)) sections.push("Idea / Industry / Problem");
  if (st.marketResearch && searchDeepInObject(st.marketResearch, q)) sections.push("Market Research (TAM/SAM/SOM)");
  if (st.businessModel && searchDeepInObject(st.businessModel, q)) sections.push("Business Model");
  if (st.technicalArchitecture && searchDeepInObject(st.technicalArchitecture, q)) sections.push("Tech Stack");
  if (st.prd && searchDeepInObject(st.prd, q)) sections.push("PRD / Features");
  if (st.competitorAnalysis && searchDeepInObject(st.competitorAnalysis, q)) sections.push("Competitors / SWOT");
  if (st.marketingPlanner && searchDeepInObject(st.marketingPlanner, q)) sections.push("Marketing / GTM");
  if (st.financialPlanner && searchDeepInObject(st.financialPlanner, q)) sections.push("Financials");
  if (st.mvpPlanner && searchDeepInObject(st.mvpPlanner, q)) sections.push("MVP Roadmap");
  if (st.investorSection && searchDeepInObject(st.investorSection, q)) sections.push("Investor Pitch");
  if (st.legalChecklist && searchDeepInObject(st.legalChecklist, q)) sections.push("Legal");
  if (st.status && st.status.toLowerCase().includes(q)) sections.push("Status");
  if (st.chatHistory && searchDeepInObject(st.chatHistory, q)) sections.push("AI Chat Logs");

  return sections;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [activeStartup, setActiveStartup] = useState<Startup | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Search, Industry Filter, Bulk selection, Sort, Micro-summary expand, and Drag-and-drop states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "recent_top3" | "alphabetical" | "progress" | "duration">("recent");
  const [selectedStartupIds, setSelectedStartupIds] = useState<string[]>([]);
  const [expandedStartupIds, setExpandedStartupIds] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Search Modal / Command Palette & Archetype Catalog states
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalActiveTab, setModalActiveTab] = useState<"workspace" | "catalog" | "batch">("workspace");
  const [selectedArchetypeIds, setSelectedArchetypeIds] = useState<string[]>([]);
  const [archetypeCategoryFilter, setArchetypeCategoryFilter] = useState("All");
  const [isPostLoginSearchFocused, setIsPostLoginSearchFocused] = useState(false);
  const modalSearchInputRef = useRef<HTMLInputElement>(null);

  // Global Share Modal state
  const [isGlobalShareModalOpen, setIsGlobalShareModalOpen] = useState(false);
  const [globalShareTab, setGlobalShareTab] = useState<"profile" | "portfolio" | "links">("profile");

  // Sticky Quick Note state
  const [quickNoteModalTarget, setQuickNoteModalTarget] = useState<Startup | null>(null);
  const [quickNoteInputText, setQuickNoteInputText] = useState("");

  // Quick Actions dropdown state & Inline Rename state
  const [openQuickActionsId, setOpenQuickActionsId] = useState<string | null>(null);
  const [hoveredTooltipStartupId, setHoveredTooltipStartupId] = useState<string | null>(null);
  const [renamingStartupId, setRenamingStartupId] = useState<string | null>(null);
  const [newStartupNameInput, setNewStartupNameInput] = useState("");
  const [quickActionToast, setQuickActionToast] = useState<string | null>(null);
  const [archiveTargetStartup, setArchiveTargetStartup] = useState<Startup | null>(null);

  const handleAddQuickNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickNoteModalTarget || !quickNoteInputText.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      text: quickNoteInputText.trim(),
      createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedStartup: Startup = {
      ...quickNoteModalTarget,
      quickNotes: [newNote, ...(quickNoteModalTarget.quickNotes || [])]
    };

    const nextStartups = startups.map((s) => (s.id === quickNoteModalTarget.id ? updatedStartup : s));
    setStartups(nextStartups);
    localStorage.setItem("sf_startups", JSON.stringify(nextStartups));
    setQuickNoteModalTarget(updatedStartup);
    setQuickNoteInputText("");

    setQuickActionToast("Sticky note saved to workspace!");
    setTimeout(() => setQuickActionToast(null), 2500);
  };

  const handleDeleteQuickNote = (noteId: string) => {
    if (!quickNoteModalTarget) return;

    const updatedStartup: Startup = {
      ...quickNoteModalTarget,
      quickNotes: (quickNoteModalTarget.quickNotes || []).filter((n) => n.id !== noteId)
    };

    const nextStartups = startups.map((s) => (s.id === quickNoteModalTarget.id ? updatedStartup : s));
    setStartups(nextStartups);
    localStorage.setItem("sf_startups", JSON.stringify(nextStartups));
    setQuickNoteModalTarget(updatedStartup);

    setQuickActionToast("Sticky note deleted");
    setTimeout(() => setQuickActionToast(null), 2000);
  };

  const handleCopyProfileSummary = () => {
    const summary = `🚀 FOUNDER PROFILE — STARTUPFORGE PORTFOLIO
Founder: ${user?.name || "Founder"}
Subscription Tier: ${(user?.subscriptionTier || "FREE").toUpperCase()}
Active Startups Forged: ${startups.length}
Total Modules Forged: ${startups.reduce((acc, s) => acc + getCompletedModulesCount(s), 0)}

Recent Founder Activity:
${(user?.recentActivity || []).slice(0, 5).map(a => `• ${a.action} (${a.time})`).join("\n")}

Explore Public Portfolio: ${window.location.origin}/?portfolio=${user?.id || 'founder'}`;

    navigator.clipboard.writeText(summary);
    setQuickActionToast("Founder profile summary copied to clipboard!");
    setTimeout(() => setQuickActionToast(null), 2500);
  };

  const handleCopyPortfolioLink = () => {
    const link = `${window.location.origin}/?portfolio=${user?.id || 'founder'}`;
    navigator.clipboard.writeText(link);
    setQuickActionToast("Public portfolio link copied to clipboard!");
    setTimeout(() => setQuickActionToast(null), 2500);
  };

  // Close quick actions dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = () => setOpenQuickActionsId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Helper function to highlight matching search query terms in text
  const highlightMatch = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const q = query.trim();
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQ})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark
              key={i}
              className="bg-[#00ff66]/30 text-[#00ff66] font-bold px-0.5 rounded underline decoration-[#00ff66]"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Available Workspace Status options
  const WORKSPACE_STATUSES: ("Drafting" | "In-Review" | "Refinement" | "Finalized")[] = [
    "Drafting",
    "In-Review",
    "Refinement",
    "Finalized",
  ];

  // Helper function for visual stage status indicators based on status field or progress %
  const getStatusBadge = (st: Startup) => {
    let currentStatus = st.status;
    if (!currentStatus) {
      if (st.progress <= 30) currentStatus = "Drafting";
      else if (st.progress <= 75) currentStatus = "In-Review";
      else if (st.progress < 100) currentStatus = "Refinement";
      else currentStatus = "Finalized";
    }

    switch (currentStatus) {
      case "Drafting":
        return {
          label: "Drafting",
          style: "text-amber-400 bg-amber-400/10 border-amber-400/30 hover:border-amber-400/70 hover:bg-amber-400/20",
          dot: "bg-amber-400 animate-pulse",
        };
      case "In-Review":
        return {
          label: "In-Review",
          style: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30 hover:border-cyan-400/70 hover:bg-cyan-400/20",
          dot: "bg-cyan-400",
        };
      case "Refinement":
        return {
          label: "Refinement",
          style: "text-purple-400 bg-purple-400/10 border-purple-400/30 hover:border-purple-400/70 hover:bg-purple-400/20",
          dot: "bg-purple-400",
        };
      case "Finalized":
        return {
          label: "Finalized",
          style: "text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/30 font-bold hover:border-[#00ff66]/70 hover:bg-[#00ff66]/20",
          dot: "bg-[#00ff66]",
        };
    }
  };

  const handleToggleStatus = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    let currentStatus = st.status;
    if (!currentStatus) {
      if (st.progress <= 30) currentStatus = "Drafting";
      else if (st.progress <= 75) currentStatus = "In-Review";
      else if (st.progress < 100) currentStatus = "Refinement";
      else currentStatus = "Finalized";
    }

    const currentIndex = WORKSPACE_STATUSES.indexOf(currentStatus);
    const nextStatus = WORKSPACE_STATUSES[(currentIndex + 1) % WORKSPACE_STATUSES.length];

    // Align progress default range with stage
    let newProgress = st.progress;
    if (nextStatus === "Drafting") newProgress = 25;
    else if (nextStatus === "In-Review") newProgress = 50;
    else if (nextStatus === "Refinement") newProgress = 75;
    else if (nextStatus === "Finalized") newProgress = 100;

    const updatedStartup: Startup = {
      ...st,
      status: nextStatus,
      progress: newProgress,
    };

    const nextStartups = startups.map((s) => (s.id === st.id ? updatedStartup : s));
    setStartups(nextStartups);
    localStorage.setItem("sf_startups", JSON.stringify(nextStartups));

    if (activeStartup && activeStartup.id === st.id) {
      setActiveStartup(updatedStartup);
    }

    setQuickActionToast(`Updated status of "${st.identity.name}" to [${nextStatus}]`);
    setTimeout(() => setQuickActionToast(null), 3000);
  };

  // Quick Action Handlers
  const handleStartRename = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingStartupId(st.id);
    setNewStartupNameInput(st.identity.name);
    setOpenQuickActionsId(null);
  };

  const handleSaveRename = (stId: string, e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!newStartupNameInput.trim()) return;
    const updatedName = newStartupNameInput.trim();
    const next = startups.map((s) =>
      s.id === stId
        ? { ...s, identity: { ...s.identity, name: updatedName } }
        : s
    );
    setStartups(next);
    localStorage.setItem("sf_startups", JSON.stringify(next));

    if (activeStartup && activeStartup.id === stId) {
      setActiveStartup({
        ...activeStartup,
        identity: { ...activeStartup.identity, name: updatedName },
      });
    }

    setRenamingStartupId(null);
    setQuickActionToast(`Renamed workspace to "${updatedName}"`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  const handleDuplicateStartup = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);
    const newId = `startup_${Date.now()}`;
    const duplicate: Startup = {
      ...JSON.parse(JSON.stringify(st)),
      id: newId,
      identity: {
        ...st.identity,
        name: `${st.identity.name} (Copy)`,
      },
      createdAt: new Date().toISOString(),
    };
    const next = [duplicate, ...startups];
    setStartups(next);
    localStorage.setItem("sf_startups", JSON.stringify(next));

    if (user) {
      const actionStr = `Duplicated workspace "${st.identity.name}"`;
      const newActivity = { action: actionStr, time: "Just now" };
      handleUpdateUser({
        ...user,
        recentActivity: [newActivity, ...user.recentActivity].slice(0, 10),
        savedStartupsCount: next.length,
      });
    }

    setQuickActionToast(`Duplicated "${st.identity.name}" successfully!`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  const handleShareStartup = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);
    const shareUrl = `${window.location.origin}${window.location.pathname}?workspace=${st.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          setQuickActionToast(`Share link for "${st.identity.name}" copied to clipboard!`);
          setTimeout(() => setQuickActionToast(null), 3500);
        },
        () => {
          window.prompt("Workspace Share Link:", shareUrl);
        }
      );
    } else {
      window.prompt("Workspace Share Link:", shareUrl);
    }
  };

  const handleShareWhatsApp = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);
    const shareUrl = `${window.location.origin}${window.location.pathname}?workspace=${st.id}`;
    const text = `🚀 Check out *${st.identity.name}* on StartupForge!\n\n💡 *Industry:* ${st.idea.industry || "Tech"}\n🎯 *Problem:* ${st.idea.problem}\n⚡ *Tagline:* ${st.identity.tagline || st.identity.uvp || "Next-gen startup"}\n\n🔗 View Workspace: ${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setQuickActionToast(`Opening WhatsApp to share "${st.identity.name}"...`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  const handleShareEmail = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);
    const shareUrl = `${window.location.origin}${window.location.pathname}?workspace=${st.id}`;
    const subject = encodeURIComponent(`Startup Workspace: ${st.identity.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nI wanted to share our startup workspace "${st.identity.name}" built on StartupForge.\n\n` +
      `Industry: ${st.idea.industry}\n` +
      `Problem Statement: ${st.idea.problem}\n` +
      `Target Audience: ${st.idea.targetAudience}\n` +
      `Progress: ${st.progress}%\n\n` +
      `View full workspace here:\n${shareUrl}\n\n` +
      `Best regards,`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setQuickActionToast(`Opening default email client for "${st.identity.name}"...`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  const handleShareSlack = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);
    const shareUrl = `${window.location.origin}${window.location.pathname}?workspace=${st.id}`;
    const slackMsg = `🚀 *Startup Workspace:* ${st.identity.name}\n🏢 *Industry:* ${st.idea.industry || "General"}\n🎯 *Problem:* ${st.idea.problem}\n📊 *Progress:* ${st.progress}% (${getCompletedModulesCount(st)}/10 modules completed)\n🔗 *Workspace Link:* ${shareUrl}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(slackMsg);
    }
    const slackRedirectUrl = `https://slack.com/app_redirect?channel=general`;
    window.open(slackRedirectUrl, "_blank", "noopener,noreferrer");

    setQuickActionToast(`Slack snippet copied & Slack share link opened!`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  const handleCopyIdea = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);
    const snippet = `💡 STARTUP CONCEPT: ${st.identity.name}\n🏢 INDUSTRY: ${st.idea.industry || "General"}\n🎯 PROBLEM STATEMENT: ${st.idea.problem}\n⚡ CORE IDEA / UVP: ${st.identity.uvp || st.identity.tagline || st.idea.targetAudience || "Accelerated concept"}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(snippet).then(
        () => {
          setQuickActionToast(`Idea & Problem Statement copied to clipboard!`);
          setTimeout(() => setQuickActionToast(null), 3500);
        },
        () => {
          window.prompt("Startup Idea Snippet:", snippet);
        }
      );
    } else {
      window.prompt("Startup Idea Snippet:", snippet);
    }
  };

  const handleDeleteStartup = (stId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenQuickActionsId(null);
    const target = startups.find((s) => s.id === stId);
    if (target) {
      setArchiveTargetStartup(target);
    }
  };

  const confirmArchiveStartup = () => {
    if (!archiveTargetStartup) return;
    const targetId = archiveTargetStartup.id;
    const targetName = archiveTargetStartup.identity.name;
    const next = startups.filter((s) => s.id !== targetId);
    setStartups(next);
    localStorage.setItem("sf_startups", JSON.stringify(next));

    if (activeStartup && activeStartup.id === targetId) {
      setActiveStartup(null);
    }

    if (user) {
      const actionStr = `Archived workspace "${targetName}"`;
      const newActivity = { action: actionStr, time: "Just now" };
      handleUpdateUser({
        ...user,
        recentActivity: [newActivity, ...user.recentActivity].slice(0, 10),
        savedStartupsCount: next.length,
      });
    }

    setQuickActionToast(`Archived workspace "${targetName}".`);
    setTimeout(() => setQuickActionToast(null), 3500);
    setArchiveTargetStartup(null);
  };

  const handleCopyJSON = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);
    const jsonString = JSON.stringify(st, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jsonString).then(
        () => {
          setQuickActionToast(`Formatted JSON string for "${st.identity.name}" copied to clipboard!`);
          setTimeout(() => setQuickActionToast(null), 3500);
        },
        () => {
          window.prompt("Workspace Formatted JSON:", jsonString);
        }
      );
    } else {
      window.prompt("Workspace Formatted JSON:", jsonString);
    }
  };

  const handleDownloadPDF = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenQuickActionsId(null);

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${st.identity.name} - Executive Workspace Brief</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 40px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #10b981;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .title {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .tagline {
      font-size: 14px;
      color: #475569;
      font-style: italic;
    }
    .meta-badge {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }
    .status-pill {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 12px;
      margin-top: 6px;
    }
    .section {
      margin-bottom: 20px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px 20px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #047857;
      margin-bottom: 10px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 3px;
    }
    .value {
      font-size: 13px;
      color: #1e293b;
      font-weight: 500;
    }
    .progress-bar-bg {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 6px;
    }
    .progress-bar-fill {
      height: 100%;
      background: #10b981;
      width: ${st.progress}%;
    }
    .footer {
      margin-top: 36px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
    }
    .print-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  </style>
</head>
<body>
  <button onclick="window.print()" class="no-print print-btn">🖨️ Print / Save as PDF</button>

  <div class="header">
    <div>
      <div class="brand">STARTUP FORGE • EXECUTIVE WORKSPACE BRIEF</div>
      <h1 class="title">${st.identity.name}</h1>
      <div class="tagline">${st.identity.tagline || st.identity.uvp || "Accelerated Startup Concept"}</div>
    </div>
    <div class="meta-badge">
      <div><strong>Export Date:</strong> ${dateStr}</div>
      <div><strong>Industry:</strong> ${st.idea.industry || "General Tech"}</div>
      <div class="status-pill">Forge Completion: ${st.progress}%</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">01. Core Concept & Value Proposition</div>
    <div class="grid">
      <div>
        <div class="label">Problem Statement</div>
        <div class="value">${st.idea.problem}</div>
      </div>
      <div>
        <div class="label">Proposed Solution & UVP</div>
        <div class="value">${st.identity.uvp || st.identity.elevatorPitch || "Accelerated SaaS platform"}</div>
      </div>
    </div>
    <div style="margin-top: 12px;">
      <div class="label">Target Audience</div>
      <div class="value">${st.idea.targetAudience}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">02. Market Opportunity</div>
    <div class="grid">
      <div>
        <div class="label">Total Addressable Market (TAM)</div>
        <div class="value">${st.marketResearch?.tam || "N/A"}</div>
      </div>
      <div>
        <div class="label">Serviceable Addressable Market (SAM)</div>
        <div class="value">${st.marketResearch?.sam || "N/A"}</div>
      </div>
    </div>
    <div style="margin-top: 12px;">
      <div class="label">Serviceable Obtainable Market (SOM)</div>
      <div class="value">${st.marketResearch?.som || "N/A"}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">03. Business & Monetization Model</div>
    <div class="grid">
      <div>
        <div class="label">Revenue Streams</div>
        <div class="value">${st.businessModel?.revenueStreams ? st.businessModel.revenueStreams.join(", ") : "Recurring Subscriptions / B2B SaaS"}</div>
      </div>
      <div>
        <div class="label">Pricing Tier Structure</div>
        <div class="value">${st.businessModel?.pricingStrategy ? st.businessModel.pricingStrategy.map((p) => `${p.tier} (${p.price})`).join(", ") : "Tiered Monthly & Annual Plans"}</div>
      </div>
    </div>
    <div style="margin-top: 12px;">
      <div class="label">Go-To-Market Strategy</div>
      <div class="value">${st.marketingPlanner?.gtmStrategy || "Inbound Content Marketing, Direct B2B Outreach, Search Engine Optimization"}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">04. Technical Architecture & Stack</div>
    <div class="value">
      ${st.technicalArchitecture?.techStack ? st.technicalArchitecture.techStack.map((t) => `<strong>${t.layer}:</strong> ${t.tech}`).join("<br>") : "<strong>Frontend:</strong> React, TypeScript<br><strong>Backend:</strong> Node.js, Express"}
    </div>
  </div>

  <div class="section">
    <div class="section-title">05. Workspace Progress Overview</div>
    <div class="label">Completion Depth: ${st.progress}%</div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill"></div>
    </div>
  </div>

  <div class="footer">
    Generated via StartupForge Operating Platform • Confidential Workspace Document
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setQuickActionToast(`Generated printable PDF summary for "${st.identity.name}"...`);
    } else {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${st.identity.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_summary.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setQuickActionToast(`Downloaded printable workspace summary for "${st.identity.name}"!`);
    }
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  // Color preset options for workspace card customization
  const CARD_COLOR_PRESETS = [
    { id: "emerald", name: "Neon Green", hex: "#00ff66", borderClass: "border-l-4 border-l-[#00ff66]", bgTint: "bg-[#00ff66]/[0.08]" },
    { id: "cyan", name: "Electric Cyan", hex: "#00e5ff", borderClass: "border-l-4 border-l-[#00e5ff]", bgTint: "bg-[#00e5ff]/[0.08]" },
    { id: "purple", name: "Purple Spark", hex: "#a855f7", borderClass: "border-l-4 border-l-[#a855f7]", bgTint: "bg-[#a855f7]/[0.08]" },
    { id: "rose", name: "Rose Coral", hex: "#f43f5e", borderClass: "border-l-4 border-l-[#f43f5e]", bgTint: "bg-[#f43f5e]/[0.08]" },
    { id: "amber", name: "Golden Amber", hex: "#f59e0b", borderClass: "border-l-4 border-l-[#f59e0b]", bgTint: "bg-[#f59e0b]/[0.08]" },
    { id: "indigo", name: "Indigo Tech", hex: "#6366f1", borderClass: "border-l-4 border-l-[#6366f1]", bgTint: "bg-[#6366f1]/[0.08]" },
  ];

  const handleSetStartupCardColor = (id: string, colorId: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    setStartups((prev) =>
      prev.map((s) => (s.id === id ? { ...s, cardColor: colorId || undefined } : s))
    );
    const colorObj = CARD_COLOR_PRESETS.find((c) => c.id === colorId);
    setQuickActionToast(colorObj ? `Card color set to ${colorObj.name}!` : `Card color cleared!`);
    setTimeout(() => setQuickActionToast(null), 2500);
  };

  // Dynamically extract unique industries from current startups list plus preset defaults
  const availableIndustries = useMemo(() => {
    const defaultCategories = ["All", "SaaS", "Hardware", "Finance", "AgriTech", "AI/ML"];
    const industrySet = new Set<string>(defaultCategories);
    startups.forEach((s) => {
      if (s.idea && s.idea.industry && s.idea.industry.trim()) {
        industrySet.add(s.idea.industry.trim());
      }
    });
    return Array.from(industrySet);
  }, [startups]);

  // Compute workspace counts for each industry tag category
  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: startups.length };
    startups.forEach((s) => {
      const ind = s.idea?.industry?.trim();
      if (ind) {
        counts[ind] = (counts[ind] || 0) + 1;
      }
    });
    return counts;
  }, [startups]);

  // Calculate average progress percentage across all current startups
  const averageProgress = useMemo(() => {
    if (startups.length === 0) return 0;
    const total = startups.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(total / startups.length);
  }, [startups]);

  // Helper to generate a contextual one-sentence status update for workspace preview tooltip
  const getOneSentenceStatusUpdate = (st: Startup): string => {
    const completed = getCompletedModulesCount(st);
    const status = st.status || (st.progress >= 100 ? "Finalized" : st.progress >= 75 ? "Refinement" : st.progress >= 30 ? "In-Review" : "Drafting");

    if (status === "Finalized" || st.progress >= 100) {
      return "All 10 architecture and strategic modules are fully forged, verified, and ready for market deployment.";
    }
    if (status === "Refinement") {
      return `Product roadmaps, MVP scope, and financial models (${completed}/10 modules) are forged and undergoing final refinement.`;
    }
    if (status === "In-Review") {
      return `Market validation and business canvases (${completed}/10 modules) are drafted and actively under executive review.`;
    }
    return `Initial concept and core problem parameters established (${completed}/10 modules); strategic expansion underway.`;
  };

  // Keep live references for global event listener
  const startupsRef = useRef(startups);
  startupsRef.current = startups;
  const activeStartupRef = useRef(activeStartup);
  activeStartupRef.current = activeStartup;

  // Auto-focus search input when Global Search Modal is opened
  useEffect(() => {
    if (isSearchModalOpen && modalSearchInputRef.current) {
      const timer = setTimeout(() => {
        modalSearchInputRef.current?.focus();
        modalSearchInputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen]);

  // Global keyboard shortcuts:
  // Cmd+K / Ctrl+K to toggle Global Search Modal
  // Cmd+F / Ctrl+F to focus search input
  // Cmd+Left / Cmd+Right (or Ctrl+Left / Ctrl+Right) to navigate between active startup workspaces
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        } else {
          setIsSearchModalOpen(true);
        }
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "ArrowLeft" || e.key === "Left")) {
        if (!isInput || target.getAttribute("type") === "range" || target.getAttribute("type") === "checkbox") {
          e.preventDefault();
          const list = startupsRef.current;
          if (list && list.length > 0) {
            const curId = activeStartupRef.current?.id;
            const curIndex = curId ? list.findIndex((s) => s.id === curId) : -1;
            const nextIndex = curIndex <= 0 ? list.length - 1 : curIndex - 1;
            const targetStartup = list[nextIndex];
            setActiveStartup(targetStartup);
            setQuickActionToast(`← Navigated to [${nextIndex + 1}/${list.length}]: "${targetStartup.identity.name}" workspace`);
            setTimeout(() => setQuickActionToast(null), 2500);
          }
        }
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "ArrowRight" || e.key === "Right")) {
        if (!isInput || target.getAttribute("type") === "range" || target.getAttribute("type") === "checkbox") {
          e.preventDefault();
          const list = startupsRef.current;
          if (list && list.length > 0) {
            const curId = activeStartupRef.current?.id;
            const curIndex = curId ? list.findIndex((s) => s.id === curId) : -1;
            const nextIndex = curIndex === -1 ? 0 : (curIndex + 1) % list.length;
            const targetStartup = list[nextIndex];
            setActiveStartup(targetStartup);
            setQuickActionToast(`→ Navigated to [${nextIndex + 1}/${list.length}]: "${targetStartup.identity.name}" workspace`);
            setTimeout(() => setQuickActionToast(null), 2500);
          }
        }
      } else if (e.key === "Escape") {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter startups for the Global Search Modal
  const modalFilteredStartups = useMemo(() => {
    if (!modalSearchQuery.trim()) return startups;
    const q = modalSearchQuery.toLowerCase().trim();
    return startups.filter((st) => searchDeepInObject(st, q));
  }, [startups, modalSearchQuery]);

  // Filter catalog archetypes by search query and category
  const filteredArchetypes = useMemo(() => {
    return STARTUP_ARCHETYPES_CATALOG.filter((arch) => {
      const matchesCategory = archetypeCategoryFilter === "All" || arch.category === archetypeCategoryFilter;
      if (!modalSearchQuery.trim()) return matchesCategory;
      const q = modalSearchQuery.toLowerCase().trim();
      const matchesQuery =
        arch.name.toLowerCase().includes(q) ||
        arch.category.toLowerCase().includes(q) ||
        arch.industry.toLowerCase().includes(q) ||
        arch.problem.toLowerCase().includes(q) ||
        arch.tagline.toLowerCase().includes(q) ||
        arch.techStackSummary.toLowerCase().includes(q) ||
        arch.keyFeatures.some((f) => f.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [modalSearchQuery, archetypeCategoryFilter]);

  // Handle single archetype instant strategy generation
  const handleGenerateSingleArchetype = (arch: StartupArchetype) => {
    const newStartup = archetypeToStartup(arch, user);
    const updated = [newStartup, ...startups];
    setStartups(updated);
    localStorage.setItem("sf_startups", JSON.stringify(updated));
    setActiveStartup(newStartup);
    setIsSearchModalOpen(false);
    setQuickActionToast(`⚡ Generated complete strategy for "${newStartup.identity.name}"!`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  // Handle batch archetype strategy generation (creating multiple startups at once)
  const handleBatchGenerateArchetypes = () => {
    if (selectedArchetypeIds.length === 0) return;
    const selectedArchetypes = STARTUP_ARCHETYPES_CATALOG.filter((a) => selectedArchetypeIds.includes(a.id));
    const createdStartups = selectedArchetypes.map((arch) => archetypeToStartup(arch, user));
    const updated = [...createdStartups, ...startups];
    setStartups(updated);
    localStorage.setItem("sf_startups", JSON.stringify(updated));
    setSelectedArchetypeIds([]);
    setIsSearchModalOpen(false);

    if (createdStartups.length > 0) {
      setActiveStartup(createdStartups[0]);
    }
    setQuickActionToast(`⚡ Batch generated strategies for ${createdStartups.length} startups!`);
    setTimeout(() => setQuickActionToast(null), 4000);
  };

  // Handle instant strategy generation for custom query typed in search bar
  const handleInstantGenerateCustomQuery = (query: string) => {
    if (!query.trim()) return;
    const cleanQ = query.trim();
    const newIdea = {
      industry: cleanQ,
      problem: `Manual operational friction and fragmented software tools in ${cleanQ}.`,
      targetAudience: `Businesses and teams operating in ${cleanQ}.`,
      budget: "$25,000",
      country: "United States"
    };
    const newStartup = generateFullStartupStrategy(newIdea, user);
    const updated = [newStartup, ...startups];
    setStartups(updated);
    localStorage.setItem("sf_startups", JSON.stringify(updated));
    setActiveStartup(newStartup);
    setIsSearchModalOpen(false);
    setModalSearchQuery("");
    setQuickActionToast(`⚡ Generated full AI strategy for "${newStartup.identity.name}"!`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  const toggleSelectArchetype = (id: string) => {
    setSelectedArchetypeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate completed modules count for a startup (out of 10 core modules)
  const getCompletedModulesCount = (st: Startup) => {
    const modules = [
      st.marketResearch,
      st.competitorAnalysis,
      st.businessModel,
      st.financialPlanner,
      st.mvpPlanner,
      st.technicalArchitecture,
      st.prd,
      st.marketingPlanner,
      st.investorSection,
      st.legalChecklist,
    ];
    return modules.filter(Boolean).length;
  };

  // Calculate average Productivity Score based on completed modules ratio vs time since creation
  const productivityScore = useMemo(() => {
    if (startups.length === 0) return 0;

    const scores = startups.map((st) => {
      const completed = getCompletedModulesCount(st);
      if (completed === 0) return 0;

      const createdTime = new Date(st.createdAt).getTime();
      const now = Date.now();
      const diffMs = isNaN(createdTime) ? 86400000 : Math.max(60000, now - createdTime);
      const daysSince = diffMs / (1000 * 60 * 60 * 24);

      const moduleRatio = completed / 10; // 0 to 1 ratio of active modules completed
      // Velocity: completed modules per day
      const modulesPerDay = completed / Math.max(0.1, daysSince);
      // Normalized velocity factor (capped at 3 modules/day = 1.0)
      const velocityFactor = Math.min(1, modulesPerDay / 3);

      // Productivity score combination: 60% completion depth + 40% time efficiency velocity
      const score = Math.round((moduleRatio * 60) + (velocityFactor * 40));
      return Math.min(100, Math.max(0, score));
    });

    const total = scores.reduce((acc, val) => acc + val, 0);
    return Math.round(total / startups.length);
  }, [startups]);

  // Compute pinned top 3 recent startup IDs
  const top3RecentIds = useMemo(() => {
    const sorted = [...startups].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;
      return dateB - dateA;
    });
    return new Set(sorted.slice(0, 3).map((s) => s.id));
  }, [startups]);

  // Real-time filtering and sorting of startups list across all internal startup data
  const filteredAndSortedStartups = useMemo(() => {
    let result = [...startups];

    // Filter by text search across ALL internal startup data
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((st) => searchDeepInObject(st, q));
    }

    // Filter by selected industry tag
    if (selectedIndustry !== "All") {
      result = result.filter(
        (st) => st.idea.industry.toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    // Sort options
    if (sortBy === "recent_top3") {
      // Specifically pin the three most recently created/edited startup workspaces to the top of the list
      const pinnedTop3 = result.filter((s) => top3RecentIds.has(s.id));
      const unpinned = result.filter((s) => !top3RecentIds.has(s.id));

      pinnedTop3.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;
        return dateB - dateA;
      });

      result = [...pinnedTop3, ...unpinned];
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.identity.name.localeCompare(b.identity.name));
    } else if (sortBy === "progress") {
      result.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === "duration") {
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime() || 0;
        const dateB = new Date(b.createdAt).getTime() || 0;
        return dateB - dateA; // newest created date first
      });
    }

    return result;
  }, [startups, searchQuery, selectedIndustry, sortBy, top3RecentIds]);

  // Toggle micro-summary expansion for a workspace row
  const toggleExpandStartup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStartupIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Reorder workspaces manually (drag and drop) and persist to localStorage
  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= startups.length || toIndex >= startups.length) return;
    const reordered = [...startups];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);
    setStartups(reordered);
    localStorage.setItem("sf_startups", JSON.stringify(reordered));
    setQuickActionToast(`Reordered "${movedItem.identity.name}" workspace`);
    setTimeout(() => setQuickActionToast(null), 3000);
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) handleReorder(index, index - 1);
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < startups.length - 1) handleReorder(index, index + 1);
  };

  // Time to Launch estimation calculation
  const getTimeToLaunchEstimate = (st: Startup) => {
    const completed = getCompletedModulesCount(st);
    const incomplete = Math.max(0, 10 - completed);

    if (incomplete === 0 || st.progress >= 100) {
      return {
        label: "LAUNCH READY",
        subtext: "All 10 modules forged",
        style: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
        isReady: true,
      };
    }

    const createdMs = new Date(st.createdAt).getTime();
    const now = Date.now();
    const diffDays = isNaN(createdMs) ? 2 : Math.max(0.5, (now - createdMs) / (1000 * 60 * 60 * 24));
    const daysPerModule = completed > 0 ? Math.min(4, Math.max(1, diffDays / completed)) : 2;
    const estDaysLeft = Math.max(1, Math.round(incomplete * daysPerModule));

    let label = `${estDaysLeft}d to launch`;
    if (estDaysLeft >= 14) {
      label = `~${Math.round(estDaysLeft / 7)} wks to launch`;
    }

    return {
      label,
      subtext: `${incomplete} module(s) remaining`,
      style: "bg-cyan-500/15 border-cyan-500/40 text-cyan-300",
      isReady: false,
    };
  };

  // Bulk selection handlers
  const toggleSelectStartup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStartupIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStartupIds.length === filteredAndSortedStartups.length) {
      setSelectedStartupIds([]);
    } else {
      setSelectedStartupIds(filteredAndSortedStartups.map((s) => s.id));
    }
  };

  const handleBulkArchive = () => {
    if (selectedStartupIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to archive ${selectedStartupIds.length} selected workspace(s)?`
      )
    ) {
      const next = startups.filter((s) => !selectedStartupIds.includes(s.id));
      setStartups(next);
      localStorage.setItem("sf_startups", JSON.stringify(next));

      if (activeStartup && selectedStartupIds.includes(activeStartup.id)) {
        setActiveStartup(null);
      }

      // Log bulk activity
      const actionStr = `Archived ${selectedStartupIds.length} workspace(s)`;
      const newActivity = { action: actionStr, time: "Just now" };
      if (user) {
        const updatedUser: User = {
          ...user,
          recentActivity: [newActivity, ...user.recentActivity].slice(0, 10),
          savedStartupsCount: next.length,
        };
        handleUpdateUser(updatedUser);
      }

      setSelectedStartupIds([]);
    }
  };

  // Export/Download single workspace to JSON file
  const handleDownloadStartup = (st: Startup, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = JSON.stringify(st, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${st.identity.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_workspace.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export/Download ALL workspaces to a aggregated local backup JSON file
  const handleDownloadAllData = () => {
    if (startups.length === 0) {
      setQuickActionToast("No workspace data available to export.");
      setTimeout(() => setQuickActionToast(null), 3000);
      return;
    }
    const backupData = {
      app: "StartupForge Systems",
      exportDate: new Date().toISOString(),
      totalWorkspaces: startups.length,
      workspaces: startups,
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.download = `startupforge_all_workspaces_backup_${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setQuickActionToast(`Downloaded backup with all ${startups.length} workspace(s)!`);
    setTimeout(() => setQuickActionToast(null), 3500);
  };

  // Security Gateway / Auth starting states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleActivateDemo = () => {
    const demoUser: User = {
      id: "mock_user_123",
      name: "Founder Dave",
      email: "dave@startupforge.ai",
      subscriptionTier: "pro",
      aiUsageLimit: 50,
      aiUsageCount: 4,
      recentActivity: [
        { action: "Demo sandbox session activated", time: "Just now" },
        { action: "Accessed StartupForge System", time: "Just now" }
      ],
      savedStartupsCount: startups.length || 1
    };
    setUser(demoUser);
    sessionStorage.setItem("sf_user", JSON.stringify(demoUser));
    localStorage.setItem("sf_user", JSON.stringify(demoUser));
  };

  const handleGoogleGatewayLogin = (platform: string) => {
    const googleUser: User = {
      id: "user_google_" + Math.random().toString(36).substring(2, 9),
      name: platform === "Google" ? "ALEX MERCER (GOOGLE)" : "ALEX MERCER (GITHUB)",
      email: platform === "Google" ? "alex.mercer@gmail.com" : "alex.mercer@github.com",
      subscriptionTier: "pro",
      aiUsageLimit: 50,
      aiUsageCount: 4,
      recentActivity: [
        { action: `Authenticated via ${platform} SSO`, time: "Just now" },
        { action: "Gateway credentials approved", time: "Just now" }
      ],
      savedStartupsCount: startups.length
    };
    setAuthSuccess(`Authenticating with ${platform}...`);
    setTimeout(() => {
      setUser(googleUser);
      sessionStorage.setItem("sf_user", JSON.stringify(googleUser));
      localStorage.setItem("sf_user", JSON.stringify(googleUser));
      setAuthSuccess("");
    }, 600);
  };

  const handleGatewaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!authEmail || !authPassword) {
      setAuthError("Please fill in all security credentials.");
      return;
    }

    if (authMode === "register" && !authName) {
      setAuthError("Name parameter is required for registration.");
      return;
    }

    if (authMode === "login") {
      const loggedInUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 11),
        name: authEmail.split("@")[0].toUpperCase(),
        email: authEmail,
        subscriptionTier: "pro",
        aiUsageLimit: 50,
        aiUsageCount: 4,
        recentActivity: [
          { action: "Gateway credentials validated", time: "Just now" },
          { action: "System connection established", time: "Just now" }
        ],
        savedStartupsCount: startups.length
      };
      setAuthSuccess("Credentials approved. Decompressing system...");
      setTimeout(() => {
        setUser(loggedInUser);
        sessionStorage.setItem("sf_user", JSON.stringify(loggedInUser));
        localStorage.setItem("sf_user", JSON.stringify(loggedInUser));
        setAuthSuccess("");
      }, 1000);
    } else {
      const registeredUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 11),
        name: authName,
        email: authEmail,
        subscriptionTier: "free",
        aiUsageLimit: 5,
        aiUsageCount: 0,
        recentActivity: [
          { action: "System workspace registered", time: "Just now" }
        ],
        savedStartupsCount: startups.length
      };
      setAuthSuccess("Registration complete. Constructing environment...");
      setTimeout(() => {
        setUser(registeredUser);
        sessionStorage.setItem("sf_user", JSON.stringify(registeredUser));
        localStorage.setItem("sf_user", JSON.stringify(registeredUser));
        setAuthSuccess("");
      }, 1200);
    }
  };


  // Initialize with Preloaded mockup and local storage
  useEffect(() => {
    // Look for persistent signed-in user and startups in storage
    const savedUser = localStorage.getItem("sf_user") || sessionStorage.getItem("sf_user");
    const savedStartups = localStorage.getItem("sf_startups");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Corrupted sf_user found in storage, resetting...", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    if (savedStartups) {
      try {
        const parsed = JSON.parse(savedStartups);
        if (parsed.length === 0) {
          setStartups([PRELOADED_STARTUP]);
        } else {
          setStartups(parsed);
        }
      } catch (e) {
        console.error("Corrupted sf_startups found in localStorage, resetting...", e);
        setStartups([PRELOADED_STARTUP]);
        localStorage.setItem("sf_startups", JSON.stringify([PRELOADED_STARTUP]));
      }
    } else {
      setStartups([PRELOADED_STARTUP]);
      localStorage.setItem("sf_startups", JSON.stringify([PRELOADED_STARTUP]));
    }
  }, []);


  const handleUpdateUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      sessionStorage.setItem("sf_user", JSON.stringify(updatedUser));
      localStorage.setItem("sf_user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.removeItem("sf_user");
      localStorage.removeItem("sf_user");
      setActiveStartup(null);
    }
  };

  const handleUpdateStartup = (updatedStartup: Startup) => {
    const nextStartups = startups.map((s) => (s.id === updatedStartup.id ? updatedStartup : s));
    setStartups(nextStartups);
    localStorage.setItem("sf_startups", JSON.stringify(nextStartups));
    if (activeStartup && activeStartup.id === updatedStartup.id) {
      setActiveStartup(updatedStartup);
    }
  };

  const handleCreateStartup = (newStartup: Startup) => {
    const nextStartups = [newStartup, ...startups];
    setStartups(nextStartups);
    localStorage.setItem("sf_startups", JSON.stringify(nextStartups));
    setActiveStartup(newStartup);
    setShowWizard(false);

    // Sync activity log
    const targetName = newStartup.identity.name;
    const actionStr = `Forged new startup concept: ${targetName}`;
    const newActivity = { action: actionStr, time: "Just now" };
    if (user) {
      const updatedUser: User = {
        ...user,
        recentActivity: [newActivity, ...user.recentActivity].slice(0, 10),
        savedStartupsCount: nextStartups.length
      };
      handleUpdateUser(updatedUser);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = startups.map((s) => {
      if (s.id === id) {
        return { ...s, isFavorite: !s.isFavorite };
      }
      return s;
    });
    setStartups(next);
    localStorage.setItem("sf_startups", JSON.stringify(next));

    // Sync activity log
    const target = startups.find(s => s.id === id);
    if (target) {
      const targetName = target.identity.name;
      const isFavNow = !target.isFavorite;
      const actionStr = isFavNow ? `Starred workspace: ${targetName}` : `Unstarred workspace: ${targetName}`;
      const newActivity = { action: actionStr, time: "Just now" };
      if (user) {
        const updatedUser: User = {
          ...user,
          recentActivity: [newActivity, ...user.recentActivity].slice(0, 10)
        };
        handleUpdateUser(updatedUser);
      }
    }
  };


  const totalTokensUsed = startups.reduce((acc, curr) => acc + (curr.progress / 8), 0) + (user?.aiUsageCount || 0);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#e4e4e7] flex flex-col justify-between relative overflow-hidden selection:bg-[#00ff66] selection:text-[#0c0c0e]" id="app-root">
      {/* Technical Grid Background */}
      <div className="bg-grid" />

      {/* Auth modal overlay */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          user={user}
          onUpdateUser={handleUpdateUser}
          isOpen={showAuth}
        />
      )}

      {/* GLOBAL COMMAND PALETTE / QUICK STARTUP SEARCH & MULTI-TYPE GENERATION MODAL */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-14 px-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-3xl bg-[#111113] border-2 border-[#00ff66]/40 rounded-xl shadow-[0_0_80px_rgba(0,255,102,0.22)] overflow-hidden flex flex-col max-h-[88vh]"
            >
              {/* MODAL SEARCH HEADER */}
              <div className="p-4 border-b border-white/10 bg-[#0c0c0e] space-y-3">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#00ff66] shrink-0 animate-pulse" />
                  <input
                    ref={modalSearchInputRef}
                    type="text"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    placeholder="Search startups, or type any industry / idea (e.g. AI FinTech, BioTech, Cyber)..."
                    className="w-full bg-transparent text-[#e4e4e7] placeholder-[rgba(228,228,231,0.4)] focus:outline-none font-mono text-xs sm:text-sm"
                    id="global-modal-search-input"
                  />
                  {modalSearchQuery && (
                    <button
                      onClick={() => setModalSearchQuery("")}
                      className="p-1 text-[rgba(228,228,231,0.4)] hover:text-white transition-colors cursor-pointer"
                      title="Clear query"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsSearchModalOpen(false)}
                    className="px-2 py-1 bg-white/5 border border-white/10 hover:border-white/30 text-[10px] font-mono text-[rgba(228,228,231,0.6)] rounded cursor-pointer shrink-0"
                  >
                    ESC
                  </button>
                </div>

                {/* MODAL TABS NAVIGATION */}
                <div className="flex items-center gap-2 border-t border-white/5 pt-2.5 font-mono text-xs">
                  <button
                    onClick={() => setModalActiveTab("workspace")}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                      modalActiveTab === "workspace"
                        ? "bg-[#00ff66]/15 border-[#00ff66] text-[#00ff66] font-bold shadow-[0_0_12px_rgba(0,255,102,0.2)]"
                        : "bg-white/5 border-white/10 text-[rgba(228,228,231,0.6)] hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span>My Workspace ({modalFilteredStartups.length})</span>
                  </button>

                  <button
                    onClick={() => setModalActiveTab("catalog")}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                      modalActiveTab === "catalog"
                        ? "bg-[#00ff66]/15 border-[#00ff66] text-[#00ff66] font-bold shadow-[0_0_12px_rgba(0,255,102,0.2)]"
                        : "bg-white/5 border-white/10 text-[rgba(228,228,231,0.6)] hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Startup Types Catalog ({STARTUP_ARCHETYPES_CATALOG.length})</span>
                  </button>

                  <button
                    onClick={() => setModalActiveTab("batch")}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                      modalActiveTab === "batch" || selectedArchetypeIds.length > 0
                        ? "bg-purple-500/20 border-purple-400 text-purple-300 font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                        : "bg-white/5 border-white/10 text-[rgba(228,228,231,0.6)] hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Multi-Create ({selectedArchetypeIds.length})</span>
                  </button>
                </div>
              </div>

              {/* INSTANT STRATEGY GENERATOR BANNER FOR CUSTOM SEARCH QUERY */}
              {modalSearchQuery.trim() && (
                <div className="px-4 py-2.5 bg-gradient-to-r from-[#00ff66]/10 via-emerald-500/10 to-transparent border-b border-[#00ff66]/30 flex items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Sparkles className="w-4 h-4 text-[#00ff66] shrink-0" />
                    <span className="text-[rgba(228,228,231,0.8)] truncate">
                      Generate full AI strategy for concept: <strong className="text-white">"{modalSearchQuery}"</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => handleInstantGenerateCustomQuery(modalSearchQuery)}
                    className="px-3 py-1 bg-[#00ff66] hover:bg-[#00cc52] text-[#0c0c0e] font-extrabold text-[11px] rounded transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Generate Strategy Now</span>
                  </button>
                </div>
              )}

              {/* TAB 1: WORKSPACE SEARCH RESULTS */}
              {modalActiveTab === "workspace" && (
                <div className="p-3 overflow-y-auto space-y-2 flex-1 custom-scrollbar">
                  {modalFilteredStartups.length === 0 ? (
                    <div className="text-center py-12 px-4 font-mono">
                      <Search className="w-10 h-10 text-[rgba(228,228,231,0.2)] mx-auto mb-3" />
                      <div className="text-sm font-bold text-[#e4e4e7]">No existing workspace startups match "{modalSearchQuery}"</div>
                      <p className="text-xs text-[rgba(228,228,231,0.4)] mt-1 max-w-sm mx-auto leading-relaxed">
                        Switch to the <button onClick={() => setModalActiveTab("catalog")} className="text-[#00ff66] underline cursor-pointer">Startup Types Catalog</button> to browse 14 preset startup categories or generate a new concept strategy.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-wider text-[rgba(228,228,231,0.4)] px-2 mb-2 flex items-center justify-between">
                        <span>Matching Workspace Startups ({modalFilteredStartups.length})</span>
                        <span>Click to open workspace</span>
                      </div>
                      <div className="space-y-1.5">
                        {modalFilteredStartups.map((st) => {
                          const badge = getStatusBadge(st);
                          const matchedSections = getMatchedSections(st, modalSearchQuery);
                          return (
                            <div
                              key={st.id}
                              onClick={() => {
                                setActiveStartup(st);
                                setIsSearchModalOpen(false);
                              }}
                              className="group p-3 bg-[#18181b] hover:bg-[#222226] border border-white/10 hover:border-[#00ff66]/50 rounded-lg transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
                            >
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-syne font-extrabold text-sm text-[#e4e4e7] group-hover:text-[#00ff66] transition-colors">
                                    {highlightMatch(st.identity.name, modalSearchQuery)}
                                  </span>
                                  <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-[rgba(228,228,231,0.6)] px-2 py-0.5 rounded">
                                    {highlightMatch(st.idea.industry, modalSearchQuery)}
                                  </span>
                                  <span className={`text-[9px] font-mono px-2 py-0.5 border rounded uppercase font-bold ${badge.style}`}>
                                    {badge.label}
                                  </span>
                                  {st.isFavorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                                </div>
                                <p className="text-xs text-[rgba(228,228,231,0.5)] line-clamp-1 font-mono">
                                  {highlightMatch(st.idea.problem, modalSearchQuery)}
                                </p>

                                {modalSearchQuery.trim() && matchedSections.length > 0 && (
                                  <div className="flex items-center gap-1 flex-wrap pt-0.5 font-mono text-[8px]">
                                    <span className="text-[#00ff66] font-bold">Matched in:</span>
                                    {matchedSections.map((sec, idx) => (
                                      <span key={idx} className="bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-1.5 py-0.2 rounded font-semibold">
                                        {sec}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right font-mono hidden sm:block">
                                  <div className="text-[10px] text-[rgba(228,228,231,0.4)]">Progress</div>
                                  <div className="text-xs font-bold text-[#00ff66]">{st.progress}%</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[rgba(228,228,231,0.3)] group-hover:text-[#00ff66] group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2 & 3: STARTUP TYPES CATALOG & MULTI-CREATE BATCH BUILDER */}
              {(modalActiveTab === "catalog" || modalActiveTab === "batch") && (
                <div className="p-3 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                  {/* CATEGORY FILTERS */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 font-mono text-[10px]">
                    <span className="text-[rgba(228,228,231,0.4)] shrink-0">VERTICAL:</span>
                    {["All", "AI & B2B SaaS", "FinTech & Payments", "HealthTech & Telemedicine", "AgriTech & Climate", "Cybersecurity", "EdTech & Upskilling", "E-Commerce & Logistics", "DeepTech & Robotics", "Creator Economy", "PropTech", "CleanTech & ESG", "Gig Economy", "BioTech", "LegalTech"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setArchetypeCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded border transition-colors shrink-0 cursor-pointer ${
                          archetypeCategoryFilter === cat
                            ? "bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66] font-bold"
                            : "bg-white/5 text-[rgba(228,228,231,0.6)] border-white/10 hover:text-white hover:border-white/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* BATCH SELECT ACTIONS BAR */}
                  <div className="bg-[#18181b] p-2.5 rounded-lg border border-white/10 flex items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (selectedArchetypeIds.length === filteredArchetypes.length) {
                            setSelectedArchetypeIds([]);
                          } else {
                            setSelectedArchetypeIds(filteredArchetypes.map((a) => a.id));
                          }
                        }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] text-[rgba(228,228,231,0.8)] transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {selectedArchetypeIds.length === filteredArchetypes.length && filteredArchetypes.length > 0 ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#00ff66]" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-[rgba(228,228,231,0.4)]" />
                        )}
                        <span>
                          {selectedArchetypeIds.length === filteredArchetypes.length ? "Deselect All" : `Select All (${filteredArchetypes.length})`}
                        </span>
                      </button>
                      <span className="text-[10px] text-[rgba(228,228,231,0.4)]">
                        {selectedArchetypeIds.length} of {filteredArchetypes.length} archetype ideas selected
                      </span>
                    </div>

                    {selectedArchetypeIds.length > 0 && (
                      <button
                        onClick={handleBatchGenerateArchetypes}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-[#00ff66] text-[#0c0c0e] font-black text-xs rounded shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Generate Strategy for All Selected ({selectedArchetypeIds.length})</span>
                      </button>
                    )}
                  </div>

                  {/* ARCHETYPE CARDS LIST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {filteredArchetypes.map((arch) => {
                      const isSelected = selectedArchetypeIds.includes(arch.id);
                      return (
                        <div
                          key={arch.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 relative group ${
                            isSelected
                              ? "bg-[#18181b] border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.15)]"
                              : "bg-[#141417] border-white/10 hover:border-white/30 hover:bg-[#1a1a1e]"
                          }`}
                        >
                          <div className="space-y-2">
                            {/* TOP HEADER */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelectArchetype(arch.id);
                                  }}
                                  className="text-[rgba(228,228,231,0.5)] hover:text-[#00ff66] transition-colors cursor-pointer"
                                  title="Check to select for batch strategy creation"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-[#00ff66]" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                                <span className={`text-[9px] font-mono px-2 py-0.5 border rounded uppercase font-bold ${arch.badgeColor}`}>
                                  {arch.category}
                                </span>
                              </div>
                              <div className="font-mono text-[9px] bg-white/5 border border-white/10 text-[rgba(228,228,231,0.5)] px-2 py-0.5 rounded">
                                TAM: {arch.tamSamSom.tam}
                              </div>
                            </div>

                            {/* TITLE & TAGLINE */}
                            <div>
                              <h4 className="font-syne font-extrabold text-sm text-[#e4e4e7] group-hover:text-[#00ff66] transition-colors">
                                {arch.name}
                              </h4>
                              <p className="text-[11px] text-[#00ff66] font-mono font-medium">
                                {arch.tagline}
                              </p>
                            </div>

                            {/* PROBLEM SUMMARY */}
                            <p className="text-xs text-[rgba(228,228,231,0.6)] font-mono line-clamp-2 leading-relaxed">
                              <strong className="text-[rgba(228,228,231,0.8)]">Problem:</strong> {arch.problem}
                            </p>

                            {/* KEY FEATURES BADGES */}
                            <div className="flex items-center gap-1 flex-wrap pt-1 font-mono text-[9px]">
                              {arch.keyFeatures.map((feat, i) => (
                                <span key={i} className="bg-white/5 border border-white/10 text-[rgba(228,228,231,0.7)] px-2 py-0.5 rounded">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* BOTTOM ACTION BAR */}
                          <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 font-mono text-[10px]">
                            <span className="text-[rgba(228,228,231,0.4)] truncate" title={arch.techStackSummary}>
                              {arch.techStackSummary.split("+")[0]} + AI
                            </span>

                            <button
                              onClick={() => handleGenerateSingleArchetype(arch)}
                              className="px-3 py-1 bg-[#00ff66] hover:bg-[#00cc52] text-[#0c0c0e] font-extrabold text-[11px] rounded transition-all cursor-pointer shadow-md flex items-center gap-1 shrink-0"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Generate Strategy</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="px-4 py-2.5 bg-[#0c0c0e] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[rgba(228,228,231,0.4)]">
                <div className="flex items-center gap-3">
                  <span>Press <kbd className="bg-white/10 text-white px-1 py-0.5 rounded">ESC</kbd> to close</span>
                  <span>•</span>
                  <span>Press <kbd className="bg-white/10 text-white px-1 py-0.5 rounded">⌘K</kbd> to toggle search</span>
                </div>
                <span>{STARTUP_ARCHETYPES_CATALOG.length} Startup Types & Strategy Blueprints Ready</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MASTER PAGE HEADER */}
      <header className="h-20 border-b-2 border-[#e4e4e7] px-8 grid grid-cols-1 md:grid-cols-[300px_1fr_300px] items-center sticky top-0 bg-[#0c0c0e] z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[#00ff66] flex items-center justify-center bg-[#00ff66]/10 shrink-0 overflow-hidden shadow-[0_0_12px_rgba(0,255,102,0.25)]">
            <img
              src={canvaAiLogo}
              alt="StartupForge Canva AI Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-syne font-extrabold text-sm uppercase tracking-[0.1em] text-[#e4e4e7] leading-tight">STARTUPFORGE</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#00ff66]">CONCEPT_ENGINE.04</div>
          </div>
        </div>

        {/* HEADER CENTER: GLOBAL SEARCH OPTION FOR ANY STARTUP */}
        <div className="hidden md:flex items-center justify-center px-4">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full max-w-sm bg-[#111113] hover:bg-[#18181b] border border-white/10 hover:border-[#00ff66]/60 text-[rgba(228,228,231,0.6)] hover:text-[#e4e4e7] px-3.5 py-2 rounded-lg font-mono text-xs flex items-center justify-between transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_rgba(0,255,102,0.12)]"
            id="header-search-any-startup-btn"
            title="Search any startup by name, industry, problem, mission, or tech (Cmd+K)"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-[#00ff66] group-hover:scale-110 transition-transform" />
              <span className="truncate">Search any startup...</span>
            </div>
            <span className="font-mono text-[9px] bg-white/10 border border-white/10 text-[rgba(228,228,231,0.5)] px-2 py-0.5 rounded shrink-0">
              ⌘K
            </span>
          </button>
        </div>

        {/* User state details */}
        <div className="justify-self-end flex items-center gap-2.5 font-mono text-[11px]">
          {/* Mobile Quick Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 bg-[#111113] hover:bg-white/10 border border-white/10 hover:border-[#00ff66]/50 text-[#00ff66] rounded-lg transition-all cursor-pointer md:hidden flex items-center gap-1 font-mono text-[10px]"
            id="header-mobile-search-btn"
            title="Search any startup"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* GLOBAL SHARE BUTTON */}
          <button
            onClick={() => setIsGlobalShareModalOpen(true)}
            className="px-3 py-1.5 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 hover:border-[#00ff66] rounded-lg font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] font-bold active:scale-95"
            id="header-global-share-btn"
            title="Share Founder Profile, Activity Summary & Finalized Startup Portfolio"
          >
            <Share2 className="w-3.5 h-3.5 text-[#00ff66]" />
            <span className="hidden sm:inline">GLOBAL SHARE</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <span className="text-[#00ff66] border border-[#00ff66]/40 bg-[#00ff66]/10 px-2 py-1 text-[9px] uppercase tracking-wider font-bold">
                {user.subscriptionTier === "free" ? "FREE_EDITION" : user.subscriptionTier === "pro" ? "PRO_EDITION" : "ENTERPRISE"}
              </span>
              <button
                onClick={() => setShowAuth(true)}
                className="text-[#e4e4e7] hover:text-[#00ff66] transition-colors cursor-pointer uppercase font-semibold"
                id="profile-dropdown-btn"
                title="View user profile details"
              >
                <span>{user.name.toUpperCase()}</span>
              </button>
              <button
                onClick={() => handleUpdateUser(null)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 font-mono text-[10px] px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-wider font-bold shadow-xs active:scale-95 ml-1"
                id="header-logout-btn"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
                setAuthSuccess("");
              }}
              className="text-[#00ff66] hover:bg-[#00ff66]/10 border border-[#00ff66] font-bold px-3 py-1.5 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer animate-pulse"
              id="login-trigger-btn"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* POST-LOGIN QUICK SEARCH & DISCOVERY BAR (ACTIVE AFTER LOGIN) */}
      {user && (
        <div className="bg-[#111113] border-b-2 border-[#00ff66]/30 px-4 sm:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 relative z-30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          {/* Left: Interactive Post-Login Search Bar & Live Autocomplete Overlay */}
          <div className="w-full md:max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#00ff66] absolute left-3.5 pointer-events-none animate-pulse" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsPostLoginSearchFocused(true)}
                placeholder="Search startups, industries, problems, PRDs, tech stack..."
                className="w-full bg-[#0c0c0e] text-[#e4e4e7] border border-white/10 focus:border-[#00ff66] focus:shadow-[0_0_15px_rgba(0,255,102,0.25)] focus:outline-none rounded-lg pl-10 pr-20 py-2 font-mono text-xs placeholder:text-[rgba(228,228,231,0.4)] transition-all"
                id="post-login-quick-search-input"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-[10px] font-mono text-[rgba(228,228,231,0.5)] hover:text-[#00ff66] transition-colors cursor-pointer"
                >
                  CLEAR
                </button>
              ) : (
                <span className="absolute right-3 font-mono text-[9px] bg-white/5 border border-white/10 text-[rgba(228,228,231,0.4)] px-1.5 py-0.5 rounded pointer-events-none">
                  ⌘F
                </span>
              )}
            </div>

            {/* Live Autocomplete Overlay */}
            {searchQuery.trim() && isPostLoginSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#141417] border-2 border-[#00ff66] rounded-xl shadow-[0_10px_40px_rgba(0,255,102,0.25)] p-3 z-50 max-h-80 overflow-y-auto custom-scrollbar space-y-2">
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[rgba(228,228,231,0.5)] px-1">
                  <span>Matching Workspace Startups ({filteredAndSortedStartups.length})</span>
                  <button onClick={() => setIsPostLoginSearchFocused(false)} className="hover:text-white cursor-pointer">
                    Close ✕
                  </button>
                </div>

                {filteredAndSortedStartups.length === 0 ? (
                  <div className="p-3 text-center font-mono text-xs text-[rgba(228,228,231,0.5)]">
                    No existing workspaces match "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredAndSortedStartups.slice(0, 5).map((st) => (
                      <div
                        key={st.id}
                        onClick={() => {
                          setActiveStartup(st);
                          setIsPostLoginSearchFocused(false);
                        }}
                        className="p-2.5 bg-[#18181b] hover:bg-[#222226] border border-white/5 hover:border-[#00ff66]/50 rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2 group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-syne font-bold text-xs text-[#e4e4e7] group-hover:text-[#00ff66] transition-colors truncate flex items-center gap-2">
                            <span>{st.identity.name}</span>
                            <span className="text-[9px] font-mono text-[#00ff66] bg-[#00ff66]/10 px-1.5 py-0.2 rounded">
                              {st.idea.industry}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-[rgba(228,228,231,0.5)] truncate mt-0.5">
                            {st.idea.problem}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[9px]">
                          <span className="text-[#00ff66] font-bold">{st.progress}%</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[rgba(228,228,231,0.3)] group-hover:text-[#00ff66] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instant Strategy Generator Action */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 font-mono">
                  <span className="text-[10px] text-[rgba(228,228,231,0.5)]">
                    Create new AI concept from search query?
                  </span>
                  <button
                    onClick={() => handleInstantGenerateCustomQuery(searchQuery)}
                    className="px-2.5 py-1 bg-[#00ff66] hover:bg-[#00cc52] text-[#0c0c0e] font-extrabold text-[10px] rounded cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Forge Strategy for "{searchQuery}"</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Category Filter Chips & Command Palette Button */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none font-mono text-[10px] shrink-0">
            <span className="text-[rgba(228,228,231,0.4)] shrink-0 hidden lg:inline">QUICK FILTERS:</span>
            {["All", "SaaS", "AgriTech", "AI/ML", "FinTech", "HealthTech", "Favorites"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (tag === "All") {
                    setSelectedIndustry("All");
                    setSearchQuery("");
                  } else if (tag === "Favorites") {
                    const favs = startups.filter((s) => s.isFavorite);
                    if (favs.length > 0) {
                      setSearchQuery(favs[0].identity.name);
                    } else {
                      setQuickActionToast("No starred workspaces found.");
                      setTimeout(() => setQuickActionToast(null), 2500);
                    }
                  } else {
                    setSelectedIndustry(tag);
                    setSearchQuery("");
                  }
                }}
                className={`px-2.5 py-1 rounded border transition-all shrink-0 cursor-pointer ${
                  (selectedIndustry.toLowerCase() === tag.toLowerCase() && !searchQuery) ||
                  (tag === "All" && selectedIndustry === "All" && !searchQuery)
                    ? "bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66] font-bold shadow-[0_0_10px_rgba(0,255,102,0.15)]"
                    : "bg-white/5 text-[rgba(228,228,231,0.6)] border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                {tag}
              </button>
            ))}

            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="px-3 py-1.5 bg-[#00ff66] hover:bg-[#00cc52] text-[#0c0c0e] font-extrabold text-[10px] font-mono rounded transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ml-auto shadow-md"
              id="post-login-open-catalog-btn"
              title="Open Full Search & Startup Archetype Catalog (Cmd+K)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Command Palette (⌘K)</span>
            </button>
          </div>
        </div>
      )}

      {/* TRANSITIONS LOGIC CONTAINER */}
      <div className="flex-1 flex flex-col relative z-10">
        {!user ? (
          /* SYSTEM SECURITY GATEWAY (STARTING AUTHENTICATION) */
          <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-140px)] bg-[#111113] relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#00ff66]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-white/[0.01] border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl relative z-10">
              <div className="text-center mb-8">
                <div className="inline-block relative p-1 rounded-xl bg-[#111113] border border-white/10 mb-4 shadow-[0_0_30px_rgba(0,255,102,0.05)]">
                  <img
                    src={canvaAiLogo}
                    alt="System Gateway Canva AI Logo"
                    className="w-16 h-16 rounded-lg border border-[#00ff66]/40 shadow-[0_0_20px_rgba(0,255,102,0.15)] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00ff66] border-2 border-[#111113] flex items-center justify-center animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <h3 className="font-syne text-xl uppercase font-black tracking-tight text-[#e4e4e7]">SYSTEM GATEWAY DEPLOYED</h3>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#00ff66] mt-1">FORGE SESSION AUTHENTICATION</p>
              </div>

              {authError && (
                <div className="mb-6 p-3.5 bg-rose-950/20 border border-rose-900/40 text-rose-300 rounded font-mono text-[10px] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="mb-6 p-3.5 bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 rounded font-mono text-[10px] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {authSuccess}
                </div>
              )}

              {/* Google & Social Fast SSO */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => handleGoogleGatewayLogin("Google")}
                  className="bg-[#111113] hover:bg-white/5 border border-white/10 hover:border-[#00ff66]/40 text-[#e4e4e7] hover:text-[#00ff66] font-mono text-[10px] py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  id="gateway-google-btn"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                  </svg>
                  <span>GOOGLE SSO</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGoogleGatewayLogin("GitHub")}
                  className="bg-[#111113] hover:bg-white/5 border border-white/10 hover:border-[#00ff66]/40 text-[#e4e4e7] hover:text-[#00ff66] font-mono text-[10px] py-2.5 px-3 rounded flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  id="gateway-github-btn"
                >
                  <span className="font-bold">GITHUB SSO</span>
                </button>
              </div>

              <div className="relative my-4 text-center">
                <hr className="border-white/5" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111113] border border-white/5 px-2.5 py-0.5 rounded font-mono text-[8px] text-[rgba(228,228,231,0.4)]">
                  OR CREDENTIALS
                </span>
              </div>

              <form onSubmit={handleGatewaySubmit} className="space-y-4">
                {authMode === "register" && (
                  <div>
                    <label className="block font-mono text-[9px] text-[rgba(228,228,231,0.5)] uppercase tracking-wider mb-1.5">FULL NAME // OWNER</label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. ALEX MERCER"
                      className="w-full bg-[#111113] border border-white/10 rounded px-4 py-2.5 font-mono text-xs text-[#e4e4e7] focus:border-[#00ff66] focus:outline-none transition-all uppercase placeholder-[rgba(228,228,231,0.25)]"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[9px] text-[rgba(228,228,231,0.5)] uppercase tracking-wider mb-1.5">EMAIL ADDR // TERMINAL ID</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#111113] border border-white/10 rounded px-4 py-2.5 font-mono text-xs text-[#e4e4e7] focus:border-[#00ff66] focus:outline-none transition-all placeholder-[rgba(228,228,231,0.25)]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-[9px] text-[rgba(228,228,231,0.5)] uppercase tracking-wider mb-1.5">SECURITY KEY // PASSCODE</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111113] border border-white/10 rounded px-4 py-2.5 font-mono text-xs text-[#e4e4e7] focus:border-[#00ff66] focus:outline-none transition-all placeholder-[rgba(228,228,231,0.25)]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full font-syne bg-[#00ff66] hover:bg-[#00e059] text-black font-black py-3 px-4 rounded text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#00ff66]/10"
                >
                  <span>{authMode === "login" ? "AUTHORIZED ACCESS" : "REGISTER WORKSPACE"}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                </button>
              </form>

              <div className="relative my-6 text-center">
                <hr className="border-white/5" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111113] border border-white/5 px-2.5 py-0.5 rounded font-mono text-[8px] text-[rgba(228,228,231,0.4)]">
                  SANDBOX PROTOCOLS
                </span>
              </div>

              {/* Instant bypass / recruiter access */}
              <button
                onClick={handleActivateDemo}
                className="w-full font-mono bg-white/[0.02] border border-white/10 hover:border-[#00ff66]/30 text-[rgba(228,228,231,0.8)] hover:text-[#00ff66] font-bold py-2.5 px-4 rounded text-[9px] uppercase tracking-widest transition-all cursor-pointer"
              >
                INITIALIZE DEMO BYPASS (1-CLICK ENTRY)
              </button>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setAuthError("");
                    setAuthSuccess("");
                  }}
                  className="font-mono text-[9px] text-[rgba(228,228,231,0.5)] hover:text-[#00ff66] uppercase tracking-wider underline cursor-pointer"
                >
                  {authMode === "login" ? "Request brand new workspace key" : "Sign in using established workspace"}
                </button>
              </div>
            </div>
          </div>
        ) : activeStartup ? (
          <StartupDashboard
            startup={activeStartup}
            onUpdateStartup={handleUpdateStartup}
            onBack={() => setActiveStartup(null)}
            user={user}
            onUpdateUser={handleUpdateUser}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        ) : showWizard ? (
          <StartupWizard
            onComplete={handleCreateStartup}
            onCancel={() => setShowWizard(false)}
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-[calc(100vh-130px)]" id="dashboard-landing-page">
            {/* EDITORIAL CONTENT LEFT */}
            <div className="p-8 md:p-16 lg:p-20 flex flex-col justify-between border-r border-[rgba(228,228,231,0.1)] bg-[#0c0c0e]">
              <div>
                <div className="font-mono text-[10px] text-[#00ff66] tracking-[0.15em] uppercase mb-8 flex items-center gap-2">
                  [ SYSTEM STATUS: AUTHENTICATED_SESSION_05 ]
                </div>
                <h2 className="font-syne text-4xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.85] text-[#e4e4e7] mb-10">
                  The elegant way <br /> to build a <br /> <span className="outline-text font-black">startup</span> empire.
                </h2>
                <p className="text-sm md:text-base text-[rgba(228,228,231,0.5)] leading-relaxed max-w-lg mb-12">
                  A refined workspace engine for modern visionaries. Input business concepts, perform deep market analysis, and structure fiscal trajectories with unparalleled clarity.
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setShowWizard(true)}
                    className="font-syne bg-[#00ff66] hover:bg-[#00e059] text-[#0c0c0e] font-extrabold text-sm uppercase tracking-wider px-8 py-4 cursor-pointer flex items-center gap-3 shadow-lg shadow-[#00ff66]/10 transition-all active:scale-[0.98]"
                    id="forge-startup-btn"
                  >
                    <span>Forge Concept</span>
                    <span className="bg-[#0c0c0e]/20 text-[#0c0c0e] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">⌘K</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="stroke-[3px]"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                  <button
                    onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                    className="font-mono bg-transparent hover:bg-white/5 text-[#e4e4e7] border border-[rgba(228,228,231,0.1)] font-bold px-8 py-4 text-xs uppercase tracking-widest cursor-pointer transition-all"
                    id="admin-toggle-btn"
                  >
                    Sandbox Overlay
                  </button>
                </div>

                {isAdminPanelOpen && (
                  <div className="w-full mt-10 p-6 bg-white/[0.02] border border-white/5 rounded-lg">
                    <AdminPanel userCount={startups.length} totalTokens={Math.round(totalTokensUsed)} />
                  </div>
                )}
              </div>

              {/* CHRONOLOGICAL RECENT ACTIVITY LOG PANEL */}
              <div className="mt-16 pt-8 border-t border-[rgba(228,228,231,0.1)] w-full max-w-lg">
                <div className="font-mono text-[10px] text-[#00ff66] tracking-[0.15em] uppercase mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                  Audit Trail
                </div>
                <div className="space-y-2 font-mono text-[11px] max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                  {user && user.recentActivity && user.recentActivity.length > 0 ? (
                    user.recentActivity.map((activity, actIdx) => (
                      <div key={actIdx} className="flex justify-between items-start gap-4 text-[rgba(228,228,231,0.5)]">
                        <span className="flex items-center gap-2">
                          <span>&gt;</span>
                          {activity.action.toUpperCase()}
                        </span>
                        <span className="text-[9px] uppercase whitespace-nowrap">
                          {activity.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-[rgba(228,228,231,0.4)] block italic">
                      No recent system activities logged. Forge a concept to begin.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* WORKSPACE LIST RIGHT */}
            <div className="bg-[rgba(228,228,231,0.02)] flex flex-col overflow-y-auto max-h-[calc(100vh-130px)] custom-scrollbar border-t lg:border-t-0 border-[rgba(228,228,231,0.1)]" id="workspaces-grid">
              
              {/* ACTIVE WORKSPACES HEADER WITH SEARCH, SORT, & INDUSTRY TAGS */}
              <div className="p-6 border-b-2 border-[#e4e4e7] bg-[rgba(228,228,231,0.02)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-mono text-[11px] font-bold text-[#e4e4e7] tracking-wider uppercase flex flex-wrap items-center gap-2.5">
                    <span>ACTIVE_WORKSPACES</span>
                    <span className="text-[#00ff66] bg-[#00ff66]/10 px-1.5 py-0.5 rounded border border-[#00ff66]/20">
                      [{String(filteredAndSortedStartups.length).padStart(2, "0")}]
                    </span>

                    {/* CIRCULAR RECHARTS PROGRESS INDICATOR */}
                    <div className="flex items-center gap-1.5 bg-[#0c0c0e] px-2 py-0.5 rounded border border-[rgba(228,228,231,0.15)] shadow-xs ml-1" title={`Average progress: ${averageProgress}% across ${startups.length} workspace(s)`}>
                      <div className="w-6 h-6 flex items-center justify-center shrink-0">
                        <PieChart width={24} height={24}>
                          <Pie
                            data={[
                              { value: averageProgress },
                              { value: Math.max(0, 100 - averageProgress) }
                            ]}
                            cx={12}
                            cy={12}
                            innerRadius={6}
                            outerRadius={10}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                            isAnimationActive={false}
                          >
                            <Cell fill="#00ff66" />
                            <Cell fill="rgba(228, 228, 231, 0.15)" />
                          </Pie>
                        </PieChart>
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-mono">
                        <span className="text-[#00ff66] font-bold">{averageProgress}%</span>
                        <span className="text-[rgba(228,228,231,0.4)] text-[8px]">AVG</span>
                      </div>
                    </div>

                    {/* PRODUCTIVITY SCORE METRIC */}
                    <div className="flex items-center gap-1.5 bg-[#0c0c0e] px-2.5 py-1 rounded border border-amber-500/30 shadow-xs ml-1 bg-amber-500/5" title={`Productivity Score: ${productivityScore}/100 calculated from completed modules vs creation velocity`}>
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      <div className="flex items-center gap-1 text-[9px] font-mono">
                        <span className="text-amber-400 font-bold">{productivityScore}/100</span>
                        <span className="text-[rgba(228,228,231,0.5)] text-[8px] uppercase">SCORE</span>
                      </div>
                    </div>
                  </div>

                  {/* DOWNLOAD ALL DATA & SORT DROPDOWN MENU */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadAllData}
                      className="bg-[#0c0c0e] hover:bg-[#00ff66]/10 text-[rgba(228,228,231,0.8)] hover:text-[#00ff66] border border-[rgba(228,228,231,0.2)] hover:border-[#00ff66]/40 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xs font-bold"
                      title="Generate a single formatted JSON file containing every startup workspace for archival purposes"
                      id="bulk-export-all-data-btn"
                    >
                      <Download className="w-3 h-3 text-[#00ff66]" />
                      <span>Bulk Export All Data</span>
                    </button>

                    <div className="flex items-center gap-1.5 ml-1">
                      <ArrowUpDown className="w-3.5 h-3.5 text-[rgba(228,228,231,0.5)]" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "recent" | "recent_top3" | "alphabetical" | "progress" | "duration")}
                        className="bg-[#0c0c0e] text-[#e4e4e7] border border-[rgba(228,228,231,0.2)] focus:border-[#00ff66] focus:outline-none rounded px-2.5 py-1 text-[10px] font-mono cursor-pointer hover:border-[#00ff66]/50 transition-colors"
                        id="sort-startups-select"
                      >
                        <option value="recent">Sort: Recent</option>
                        <option value="recent_top3">Sort: Show Recent (Pin Top 3)</option>
                        <option value="duration">Sort: Duration (Newest)</option>
                        <option value="alphabetical">Sort: Alphabetical</option>
                        <option value="progress">Sort: Progress</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* REAL-TIME DEEP SEARCH BAR WITH KEYBOARD SHORTCUT (Cmd+F / Ctrl+F) */}
                <div className="space-y-1.5">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-[#00ff66] absolute left-3 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search across all startup data (industry, problem, mission, UVP, tech, PRD...)"
                      className="w-full bg-[#0c0c0e] text-[#e4e4e7] border border-[rgba(228,228,231,0.2)] focus:border-[#00ff66] focus:outline-none rounded-md pl-9 pr-14 py-2 text-xs font-mono placeholder:text-[rgba(228,228,231,0.35)] transition-colors shadow-inner"
                      id="search-startups-input"
                    />
                    <div className="absolute right-2.5 flex items-center gap-1">
                      {searchQuery ? (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="p-0.5 text-[rgba(228,228,231,0.4)] hover:text-white transition-colors cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="hidden sm:inline-block font-mono text-[8px] bg-white/5 border border-white/10 text-[rgba(228,228,231,0.4)] px-1.5 py-0.5 rounded">
                          ⌘F
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE SEARCH STATUS BADGE */}
                  {searchQuery.trim() && (
                    <div className="flex items-center justify-between font-mono text-[9px] text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30 px-2.5 py-1 rounded">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                        <span>Real-time deep query: "{searchQuery}"</span>
                      </span>
                      <span className="font-bold">
                        [{filteredAndSortedStartups.length} of {startups.length} Workspaces Found]
                      </span>
                    </div>
                  )}
                </div>

                {/* INDUSTRY PILL TAG SELECTOR WITH COUNT BADGES */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-[rgba(228,228,231,0.4)] uppercase">
                    <Tag className="w-3 h-3 text-[#00ff66]" />
                    <span>Filter by Industry:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto custom-scrollbar pt-0.5">
                    {availableIndustries.map((ind) => {
                      const isActive = selectedIndustry.toLowerCase() === ind.toLowerCase();
                      const count = industryCounts[ind] || 0;
                      return (
                        <button
                          key={ind}
                          onClick={() => setSelectedIndustry(ind)}
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? "bg-[#00ff66] text-[#0c0c0e] font-bold border-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.2)]"
                              : "bg-[#0c0c0e] text-[rgba(228,228,231,0.6)] hover:text-white border-[rgba(228,228,231,0.15)] hover:border-[#00ff66]/40"
                          }`}
                        >
                          <span>{ind}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold ${
                              isActive
                                ? "bg-[#0c0c0e]/30 text-[#0c0c0e]"
                                : "bg-white/10 text-[rgba(228,228,231,0.7)]"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BULK SELECTION ACTION BAR */}
                {filteredAndSortedStartups.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(228,228,231,0.1)] text-[10px] font-mono">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-1.5 text-[rgba(228,228,231,0.6)] hover:text-[#00ff66] transition-colors cursor-pointer"
                    >
                      {selectedStartupIds.length === filteredAndSortedStartups.length ? (
                        <CheckSquare className="w-3.5 h-3.5 text-[#00ff66]" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {selectedStartupIds.length === filteredAndSortedStartups.length
                          ? "Deselect All"
                          : `Select All (${filteredAndSortedStartups.length})`}
                      </span>
                    </button>

                    {selectedStartupIds.length > 0 && (
                      <button
                        onClick={handleBulkArchive}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-bold px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        id="bulk-archive-btn"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Archive Selected ({selectedStartupIds.length})</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {startups.length === 0 ? (
                <div className="p-12 text-center my-auto space-y-4">
                  <div className="w-12 h-12 bg-white/[0.02] border border-white/10 text-[rgba(228,228,231,0.3)] rounded-full flex items-center justify-center mx-auto">
                    <Folder className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#e4e4e7] text-sm uppercase font-syne">No saved workspaces</h5>
                    <p className="text-xs text-[rgba(228,228,231,0.5)] mt-1 font-mono">Create a workspace to begin building.</p>
                  </div>
                </div>
              ) : filteredAndSortedStartups.length === 0 ? (
                <div className="p-12 text-center my-auto space-y-4">
                  <div className="w-10 h-10 bg-white/[0.02] border border-white/10 text-[rgba(228,228,231,0.4)] rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#e4e4e7] text-xs uppercase font-syne">No matching workspaces</h5>
                    <p className="text-[11px] text-[rgba(228,228,231,0.5)] mt-1 font-mono">
                      No startups match your search/industry filter. Try different keywords or reset filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedIndustry("All");
                      }}
                      className="mt-3 text-[10px] font-mono text-[#00ff66] underline cursor-pointer hover:text-white"
                    >
                      Clear search & industry filters
                    </button>
                  </div>
                </div>
              ) : (
                filteredAndSortedStartups.map((st, index) => {
                  const isSelected = selectedStartupIds.includes(st.id);
                  const isExpanded = expandedStartupIds.includes(st.id);
                  const completedModules = getCompletedModulesCount(st);
                  const totalModules = 10;
                  const statusBadge = getStatusBadge(st);
                  const launchEst = getTimeToLaunchEstimate(st);
                  const isPinnedRecent = sortBy === "recent_top3" && top3RecentIds.has(st.id);
                  const isBeingDragged = draggedIndex === index;
                  const assignedColorObj = CARD_COLOR_PRESETS.find((c) => c.id === st.cardColor);
                  const isFinalized = st.status === "Finalized" || statusBadge.label === "Finalized" || st.progress >= 100;

                  return (
                    <motion.div
                      key={st.id}
                      onClick={() => setActiveStartup(st)}
                      draggable={true}
                      onDragStart={(e: any) => {
                        if (e.dataTransfer) {
                          e.dataTransfer.setData("text/plain", String(index));
                        }
                        setDraggedIndex(index);
                      }}
                      onDragOver={(e: any) => e.preventDefault()}
                      onDrop={(e: any) => {
                        e.preventDefault();
                        if (e.dataTransfer) {
                          const fromIdx = Number(e.dataTransfer.getData("text/plain"));
                          handleReorder(fromIdx, index);
                        }
                        setDraggedIndex(null);
                      }}
                      onDragEnd={() => setDraggedIndex(null)}
                      onMouseEnter={() => setHoveredTooltipStartupId(st.id)}
                      onMouseLeave={() => setHoveredTooltipStartupId(null)}
                      whileHover={{
                        y: -3,
                        boxShadow: isFinalized
                          ? "0 12px 35px -5px rgba(0, 255, 102, 0.3), 0 0 0 1px rgba(0, 255, 102, 0.6)"
                          : "0 10px 30px -5px rgba(0, 255, 102, 0.15), 0 0 0 1px rgba(0, 255, 102, 0.35)",
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                      className={`p-6 md:p-8 border-b border-[rgba(228,228,231,0.1)] transition-all duration-300 cursor-pointer group relative ${
                        isFinalized
                          ? "finalized-glow-pulse border-[#00ff66]/50 bg-gradient-to-r from-[#00ff66]/[0.04] via-[#0c0c0e] to-[#00ff66]/[0.02]"
                          : ""
                      } ${
                        isBeingDragged ? "opacity-40 border-dashed border-[#00ff66]" : ""
                      } ${
                        isSelected
                          ? "bg-[#00ff66]/[0.06] border-l-4 border-l-[#00ff66]"
                          : isPinnedRecent
                          ? "bg-amber-500/[0.03] border-l-4 border-l-amber-500 hover:bg-white/[0.05]"
                          : assignedColorObj
                          ? `${assignedColorObj.borderClass} ${assignedColorObj.bgTint} hover:bg-white/[0.08]`
                          : "hover:bg-white/[0.05]"
                      }`}
                      id={`workspace-row-${st.id}`}
                    >
                      {/* HOVER-STATE PREVIEW TOOLTIP */}
                      <AnimatePresence>
                        {hoveredTooltipStartupId === st.id && (
                          <WorkspaceHoverTooltip
                            startup={st}
                            statusUpdate={getOneSentenceStatusUpdate(st)}
                            isOpen={true}
                            completedModules={completedModules}
                            totalModules={totalModules}
                          />
                        )}
                      </AnimatePresence>

                      <div className="space-y-4">
                        {/* Drag handle, Checkbox, Industry tag, Pinned badge, Time-to-Launch, Status Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2">
                            {/* DRAG HANDLE & REORDER BUTTONS */}
                            <div
                              className="cursor-grab active:cursor-grabbing p-1 text-[rgba(228,228,231,0.3)] hover:text-[#00ff66] transition-colors"
                              title="Click and drag to reorder project"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <button
                              onClick={(e) => toggleSelectStartup(st.id, e)}
                              className="text-[rgba(228,228,231,0.5)] hover:text-[#00ff66] p-0.5 transition-colors cursor-pointer"
                              title={isSelected ? "Deselect workspace" : "Select workspace"}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#00ff66]" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>

                            <span className="font-mono text-[10px] text-[rgba(228,228,231,0.5)] uppercase tracking-wider">
                              [{String(index + 1).padStart(2, "0")}] {highlightMatch(st.idea.industry, searchQuery)}
                            </span>

                            {/* REORDER UP / DOWN BUTTONS FOR QUICK TOUCH ACCESSIBILITY */}
                            <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                              <button
                                onClick={(e) => handleMoveUp(index, e)}
                                disabled={index === 0}
                                className="p-0.5 text-[rgba(228,228,231,0.4)] hover:text-[#00ff66] disabled:opacity-20 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => handleMoveDown(index, e)}
                                disabled={index === startups.length - 1}
                                className="p-0.5 text-[rgba(228,228,231,0.4)] hover:text-[#00ff66] disabled:opacity-20 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* FINALIZED STATUS PULSE INDICATOR BADGE */}
                            {isFinalized && (
                              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#00ff66]/60 bg-[#00ff66]/15 text-[#00ff66] font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,102,0.3)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
                                <span>FINALIZED</span>
                              </span>
                            )}

                            {/* CARD ACCENT COLOR BADGE IF ASSIGNED */}
                            {assignedColorObj && (
                              <span
                                className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1.5 font-bold"
                                style={{
                                  borderColor: `${assignedColorObj.hex}60`,
                                  backgroundColor: `${assignedColorObj.hex}18`,
                                  color: assignedColorObj.hex
                                }}
                                title={`Assigned workspace color: ${assignedColorObj.name}`}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: assignedColorObj.hex }}
                                />
                                <span>{assignedColorObj.name}</span>
                              </span>
                            )}

                            {/* PINNED RECENT BADGE (When 'Show Recent' filter active) */}
                            {isPinnedRecent && (
                              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-400 font-bold flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                                <span>PINNED RECENT</span>
                              </span>
                            )}

                            {/* VISUAL 'TIME TO LAUNCH' COUNTDOWN TIMER BADGE */}
                            <span
                              className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${launchEst.style}`}
                              title={launchEst.subtext}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{launchEst.label}</span>
                            </span>

                            {/* CLICKABLE VISUAL STATUS INDICATOR BADGE ('Drafting', 'In-Review', 'Refinement', 'Finalized') */}
                            <button
                              onClick={(e) => handleToggleStatus(st, e)}
                              className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${statusBadge.style}`}
                              title="Click to toggle status (Drafting → In-Review → Refinement → Finalized)"
                              id={`toggle-status-btn-${st.id}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                              <span>{statusBadge.label}</span>
                              <span className="text-[8px] opacity-60 ml-0.5 font-mono">⇄</span>
                            </button>
                          </div>
                        </div>

                        {/* WORKSPACE NAME (WITH HIGHLIGHTING & INLINE RENAME) & QUICK ACTIONS */}
                        <div className="flex justify-between items-center gap-4">
                          {renamingStartupId === st.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveRename(st.id, e);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 flex-1"
                            >
                              <input
                                type="text"
                                value={newStartupNameInput}
                                onChange={(e) => setNewStartupNameInput(e.target.value)}
                                autoFocus
                                className="bg-[#0c0c0e] border border-[#00ff66] text-[#e4e4e7] font-syne text-lg uppercase font-extrabold px-2.5 py-1 rounded focus:outline-none flex-1 shadow-inner"
                              />
                              <button
                                type="submit"
                                className="bg-[#00ff66] text-[#0c0c0e] font-mono text-xs font-bold px-3 py-1 rounded hover:bg-[#00e059] cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenamingStartupId(null);
                                }}
                                className="text-[rgba(228,228,231,0.5)] hover:text-white font-mono text-xs px-2 py-1 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <h4 className="font-syne text-xl uppercase font-extrabold text-[#e4e4e7] group-hover:text-[#00ff66] transition-colors flex-1">
                              {highlightMatch(st.identity.name, searchQuery)}
                            </h4>
                          )}

                          <div className="flex items-center gap-1.5">
                            {/* DEDICATED QUICK PDF EXPORT BUTTON */}
                            <button
                              onClick={(e) => handleDownloadPDF(st, e)}
                              className="bg-[#0c0c0e] hover:bg-[#00ff66]/15 text-[rgba(228,228,231,0.8)] hover:text-[#00ff66] border border-[rgba(228,228,231,0.2)] hover:border-[#00ff66]/40 px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                              title="Export Executive Brief PDF"
                              id={`card-quick-pdf-btn-${st.id}`}
                            >
                              <Printer className="w-3.5 h-3.5 text-[#00ff66]" />
                              <span className="hidden sm:inline">PDF</span>
                            </button>

                            {/* EXPAND MICRO-SUMMARY TOGGLE BUTTON */}
                            <button
                              onClick={(e) => toggleExpandStartup(st.id, e)}
                              className="bg-[#0c0c0e] hover:bg-white/10 text-[rgba(228,228,231,0.8)] hover:text-[#00ff66] border border-[rgba(228,228,231,0.2)] px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer"
                              title={isExpanded ? "Collapse micro-summary" : "Expand micro-summary overview"}
                              id={`expand-toggle-btn-${st.id}`}
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#00ff66]" : ""}`} />
                              <span className="hidden sm:inline">{isExpanded ? "COLLAPSE" : "EXPAND"}</span>
                            </button>

                            {/* FAVORITE STAR BUTTON */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(st.id, e);
                              }}
                              className="text-[rgba(228,228,231,0.4)] hover:text-amber-400 p-1.5 rounded transition-colors cursor-pointer"
                              title={st.isFavorite ? "Unfavorite" : "Favorite"}
                            >
                              <Star className={`w-4 h-4 ${st.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
                            </button>

                            {/* STICKY QUICK NOTE FAB BUTTON */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickNoteModalTarget(st);
                              }}
                              className="bg-[#0c0c0e] hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400 px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer shadow-xs font-semibold relative group/note"
                              title="Add or view quick sticky notes for this startup"
                              id={`quick-note-fab-btn-${st.id}`}
                            >
                              <StickyNote className="w-3.5 h-3.5 text-amber-400 group-hover/note:scale-110 transition-transform" />
                              <span className="hidden sm:inline">
                                {st.quickNotes && st.quickNotes.length > 0 ? `${st.quickNotes.length} Note${st.quickNotes.length > 1 ? 's' : ''}` : "Add Note"}
                              </span>
                              {st.quickNotes && st.quickNotes.length > 0 && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse absolute -top-1 -right-1" />
                              )}
                            </button>

                            {/* QUICK ACTIONS DROPDOWN MENU TRIGGER */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenQuickActionsId(openQuickActionsId === st.id ? null : st.id);
                                }}
                                className="bg-[#0c0c0e] hover:bg-white/10 text-[rgba(228,228,231,0.7)] hover:text-[#00ff66] border border-[rgba(228,228,231,0.2)] p-1.5 rounded transition-all cursor-pointer flex items-center"
                                title="Quick Actions Menu"
                                id={`quick-actions-btn-${st.id}`}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* QUICK ACTIONS DROPDOWN POPUP */}
                              <AnimatePresence>
                                {openQuickActionsId === st.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-full mt-2 w-52 bg-[#0c0c0e] border border-[rgba(228,228,231,0.25)] shadow-2xl rounded-xl p-1.5 z-40 font-mono text-xs space-y-1 backdrop-blur-md"
                                  >
                                    <button
                                      onClick={(e) => handleDownloadPDF(st, e)}
                                      className="w-full text-left px-3 py-2 text-[#00ff66] hover:bg-[#00ff66]/10 rounded flex items-center gap-2.5 transition-colors cursor-pointer font-bold border border-[#00ff66]/30 bg-[#00ff66]/5"
                                      id={`quick-download-pdf-btn-${st.id}`}
                                    >
                                      <FileText className="w-3.5 h-3.5 text-[#00ff66]" />
                                      <span>Download as PDF</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleStartRename(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-[#00ff66] hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-[#00ff66]" />
                                      <span>Rename Workspace</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleShareSlack(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-pink-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                      id={`quick-slack-btn-${st.id}`}
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                                      <span>Share via Slack</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleCopyIdea(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-yellow-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                      id={`quick-copy-idea-btn-${st.id}`}
                                    >
                                      <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                                      <span>Copy Idea & Problem</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleDuplicateStartup(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-cyan-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                                      <span>Duplicate Workspace</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleShareStartup(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-purple-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                      <Share2 className="w-3.5 h-3.5 text-purple-400" />
                                      <span>Copy Share Link</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleShareWhatsApp(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-emerald-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                      id={`quick-whatsapp-btn-${st.id}`}
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Share via WhatsApp</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleShareEmail(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-sky-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                      id={`quick-email-btn-${st.id}`}
                                    >
                                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                                      <span>Share via Email</span>
                                    </button>

                                    <button
                                      onClick={(e) => handleCopyJSON(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-amber-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                      id={`quick-copy-json-btn-${st.id}`}
                                    >
                                      <FileJson className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Copy JSON</span>
                                     </button>

                                     <div className="border-t border-[rgba(228,228,231,0.1)] my-1" />

                                     <div className="px-3 py-1.5 space-y-1.5">
                                       <span className="text-[9px] uppercase font-bold text-[rgba(228,228,231,0.5)] block tracking-wider">
                                         Assign Card Accent Color
                                       </span>
                                       <div className="flex items-center gap-1.5 pt-0.5">
                                         <button
                                           onClick={(e) => handleSetStartupCardColor(st.id, null, e)}
                                           className={`w-5 h-5 rounded-full border text-[9px] flex items-center justify-center transition-all cursor-pointer ${
                                             !st.cardColor
                                               ? "border-[#00ff66] text-[#00ff66] bg-[#00ff66]/20 font-bold"
                                               : "border-white/20 text-[rgba(228,228,231,0.4)] hover:border-white/50"
                                           }`}
                                           title="Clear Color Accent"
                                           id={`clear-card-color-btn-${st.id}`}
                                         >
                                           ✕
                                         </button>
                                         {CARD_COLOR_PRESETS.map((colorPreset) => (
                                           <button
                                             key={colorPreset.id}
                                             onClick={(e) => handleSetStartupCardColor(st.id, colorPreset.id, e)}
                                             style={{ backgroundColor: colorPreset.hex }}
                                             className={`w-5 h-5 rounded-full transition-all cursor-pointer shadow-sm ${
                                               st.cardColor === colorPreset.id
                                                 ? "ring-2 ring-white ring-offset-2 ring-offset-[#0c0c0e] scale-110"
                                                 : "opacity-75 hover:opacity-100 hover:scale-105"
                                             }`}
                                             title={`Set card accent: ${colorPreset.name}`}
                                             id={`set-card-color-${colorPreset.id}-${st.id}`}
                                           />
                                         ))}
                                       </div>
                                     </div>

                                    <button
                                      onClick={(e) => handleDownloadStartup(st, e)}
                                      className="w-full text-left px-3 py-2 text-[rgba(228,228,231,0.9)] hover:text-emerald-400 hover:bg-white/5 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Export JSON</span>
                                    </button>

                                    <div className="border-t border-[rgba(228,228,231,0.1)] my-1" />

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenQuickActionsId(null);
                                        handleDeleteStartup(st.id, e);
                                      }}
                                      className="w-full text-left px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded flex items-center gap-2.5 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Archive Workspace</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-[rgba(228,228,231,0.6)] leading-relaxed italic line-clamp-2">
                          {highlightMatch(st.idea.problem, searchQuery)}
                        </p>

                        {/* DISPLAY TAGLINE / MISSION HIGHLIGHT IF AVAILABLE OR MATCHED */}
                        {(st.identity.tagline || st.identity.mission) && (
                          <div className="text-[11px] font-mono text-[rgba(228,228,231,0.5)] flex items-start gap-1.5 pt-0.5">
                            <span className="text-[#00ff66] font-bold shrink-0">MISSION:</span>
                            <span className="line-clamp-2">
                              {highlightMatch(st.identity.mission || st.identity.tagline, searchQuery)}
                            </span>
                          </div>
                        )}

                        {/* SEARCH MATCH BADGES SHOWING SPECIFIC SECTIONS */}
                        {searchQuery.trim() && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[9px] font-mono">
                            <span className="text-[#00ff66] font-bold uppercase tracking-wider">Matched in:</span>
                            {getMatchedSections(st, searchQuery).map((sec, sIdx) => (
                              <span
                                key={sIdx}
                                className="bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 rounded-full font-semibold"
                              >
                                {sec}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* EXPANDABLE MICRO-SUMMARY OVERVIEW (Industry, Problem Statement, Progress) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#0c0c0e] border border-[rgba(228,228,231,0.15)] rounded-xl p-4 my-2 space-y-3 font-mono text-xs overflow-hidden shadow-inner"
                            >
                              <div className="flex items-center justify-between border-b border-[rgba(228,228,231,0.1)] pb-2 text-[10px] text-[#00ff66]">
                                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                                  <Zap className="w-3 h-3 text-[#00ff66]" />
                                  MICRO-SUMMARY OVERVIEW
                                </span>
                                <span className="text-[rgba(228,228,231,0.5)]">ID: {st.id}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
                                <div className="space-y-1 bg-white/[0.02] p-2.5 rounded border border-white/5">
                                  <div className="text-[9px] uppercase text-[rgba(228,228,231,0.4)]">Industry Category</div>
                                  <div className="font-bold text-[#e4e4e7]">{st.idea.industry}</div>
                                </div>

                                <div className="space-y-1 bg-white/[0.02] p-2.5 rounded border border-white/5">
                                  <div className="text-[9px] uppercase text-[rgba(228,228,231,0.4)] font-mono">Completion Depth</div>
                                  <div className="font-bold text-[#00ff66]">{completedModules} / 10 Modules Built ({st.progress}%)</div>
                                </div>

                                <div className="space-y-1 bg-white/[0.02] p-2.5 rounded border border-white/5">
                                  <div className="text-[9px] uppercase text-[rgba(228,228,231,0.4)]">Time to Launch</div>
                                  <div className={`font-bold ${launchEst.isReady ? "text-emerald-400" : "text-cyan-300"}`}>{launchEst.label} ({launchEst.subtext})</div>
                                </div>
                              </div>

                              <div className="space-y-1 bg-white/[0.02] p-2.5 rounded border border-white/5 text-[11px]">
                                <div className="text-[9px] uppercase text-[rgba(228,228,231,0.4)]">Problem Statement</div>
                                <div className="text-[rgba(228,228,231,0.8)] leading-relaxed italic">{st.idea.problem}</div>
                              </div>

                              {st.identity.uvp && (
                                <div className="space-y-1 bg-white/[0.02] p-2.5 rounded border border-white/5 text-[11px]">
                                  <div className="text-[9px] uppercase text-[rgba(228,228,231,0.4)]">Unique Value Proposition</div>
                                  <div className="text-[#e4e4e7] font-medium">{st.identity.uvp}</div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* DETAILED NUMERIC PROGRESS INDICATOR & BAR */}
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between items-center font-mono text-[10px]">
                            <span className="text-[#00ff66] font-bold flex items-center gap-1">
                              <span>{completedModules}/{totalModules} MODULES FORGED</span>
                            </span>
                            <span className="text-[rgba(228,228,231,0.7)]">
                              Step {Math.min(completedModules + 1, totalModules)} of {totalModules} ({st.progress}%)
                            </span>
                          </div>

                          {(() => {
                            const isRefinementOrFinalized =
                              statusBadge.label === "Refinement" ||
                              statusBadge.label === "Finalized" ||
                              st.status === "Refinement" ||
                              st.status === "Finalized" ||
                              st.progress >= 75;

                            return (
                              <div
                                className={`w-full bg-[rgba(228,228,231,0.1)] h-[5px] overflow-hidden rounded-full relative transition-all ${
                                  isRefinementOrFinalized
                                    ? "shadow-[0_0_12px_rgba(0,255,102,0.4)] border border-[#00ff66]/40"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`h-full transition-all duration-500 relative ${
                                    isRefinementOrFinalized ? "animate-pulse" : ""
                                  }`}
                                  style={{
                                    width: `${st.progress}%`,
                                    backgroundColor:
                                      st.progress <= 30
                                        ? "#f43f5e"
                                        : st.progress <= 70
                                        ? "#fbbf24"
                                        : "#00ff66",
                                  }}
                                >
                                  {isRefinementOrFinalized && <div className="animate-shimmer" />}
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* ACTION ROW: DOWNLOAD PDF BRIEF, DOWNLOAD WORKSPACE JSON & ARCHIVE BUTTON */}
                        <div className="flex justify-between items-center pt-3 border-t border-[rgba(228,228,231,0.05)] text-[9px] font-mono gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDownloadPDF(st, e)}
                              className="text-[#00ff66] hover:bg-[#00ff66]/10 border border-[#00ff66]/40 hover:border-[#00ff66] px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer bg-[#0c0c0e] font-bold shadow-xs"
                              title="Export Executive Brief PDF without opening workspace"
                              id={`quick-export-pdf-brief-btn-${st.id}`}
                            >
                              <FileText className="w-3 h-3 text-[#00ff66]" />
                              <span>EXPORT BRIEF (PDF)</span>
                            </button>

                            <button
                              onClick={(e) => handleDownloadStartup(st, e)}
                              className="text-[rgba(228,228,231,0.6)] hover:text-[#00ff66] border border-[rgba(228,228,231,0.15)] hover:border-[#00ff66]/40 px-2.5 py-1 rounded flex items-center gap-1.5 transition-all cursor-pointer bg-[#0c0c0e]"
                              title="Download workspace data as JSON file"
                            >
                              <Download className="w-3 h-3 text-[#00ff66]" />
                              <span>JSON</span>
                            </button>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStartup(st.id, e);
                            }}
                            className="text-red-400 hover:text-red-500 border border-red-400/20 hover:border-red-400/40 px-2 py-1 transition-all cursor-pointer uppercase"
                          >
                            ARCHIVE
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ARCHIVE CONFIRMATION MODAL */}
      <AnimatePresence>
        {archiveTargetStartup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setArchiveTargetStartup(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0c0c0e] border-2 border-rose-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.25)] space-y-5 font-mono relative overflow-hidden"
              id="archive-confirmation-modal"
            >
              <div className="flex items-center gap-3 text-rose-400 border-b border-white/10 pb-4">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-syne font-extrabold text-base text-white uppercase tracking-wider">
                    ARCHIVE WORKSPACE
                  </h3>
                  <p className="text-[10px] text-[rgba(228,228,231,0.5)] uppercase tracking-widest mt-0.5">
                    CONFIRMATION REQUIRED
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="text-xs text-[#e4e4e7] font-bold">
                  <span className="text-[rgba(228,228,231,0.5)] text-[10px] block uppercase mb-0.5">
                    STARTUP NAME
                  </span>
                  <span className="font-syne text-lg text-rose-300 font-extrabold uppercase">
                    {archiveTargetStartup.identity.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                  <span className="text-[rgba(228,228,231,0.6)]">Completed Modules:</span>
                  <span className="text-[#00ff66] font-bold bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/20">
                    {getCompletedModulesCount(archiveTargetStartup)} / 10 Forged ({archiveTargetStartup.progress}%)
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[rgba(228,228,231,0.6)]">Industry Sector:</span>
                  <span className="text-white font-medium">{archiveTargetStartup.idea.industry || "General"}</span>
                </div>
              </div>

              <p className="text-xs text-[rgba(228,228,231,0.6)] leading-relaxed italic">
                Are you sure you want to archive <strong className="text-white font-semibold">"{archiveTargetStartup.identity.name}"</strong>? This workspace will be removed from your active list.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setArchiveTargetStartup(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[rgba(228,228,231,0.8)] hover:text-white rounded-lg text-xs font-bold border border-white/10 transition-all cursor-pointer"
                  id="cancel-archive-modal-btn"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmArchiveStartup}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
                  id="confirm-archive-modal-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>CONFIRM ARCHIVE</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK ACTIONS TOAST NOTIFICATION */}
      <AnimatePresence>
        {quickActionToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 right-8 z-50 bg-[#0c0c0e] border border-[#00ff66]/50 text-[#e4e4e7] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs backdrop-blur-md"
          >
            <div className="w-6 h-6 rounded-full bg-[#00ff66]/20 border border-[#00ff66]/40 flex items-center justify-center text-[#00ff66]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <span>{quickActionToast}</span>
            <button
              onClick={() => setQuickActionToast(null)}
              className="text-[rgba(228,228,231,0.4)] hover:text-white ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL SHARE & FOUNDER PORTFOLIO MODAL */}
      <AnimatePresence>
        {isGlobalShareModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-[#0c0c0e] border border-white/20 rounded-2xl shadow-2xl p-6 font-mono space-y-6 text-[#e4e4e7] relative overflow-hidden"
              id="global-share-modal"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#00ff66]/10 border border-[#00ff66]/40 rounded-xl text-[#00ff66]">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-syne text-lg uppercase font-black text-white tracking-wider flex items-center gap-2">
                      <span>GLOBAL SHARE & PORTFOLIO</span>
                      <span className="text-[9px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 rounded uppercase font-mono">
                        LIVE HUB
                      </span>
                    </h2>
                    <p className="text-[10px] text-[rgba(228,228,231,0.5)]">
                      Share founder profile, activity log, or public link of finalized startup projects
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGlobalShareModalOpen(false)}
                  className="p-1.5 text-[rgba(228,228,231,0.5)] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <button
                  onClick={() => setGlobalShareTab("profile")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    globalShareTab === "profile"
                      ? "bg-[#00ff66] text-[#0c0c0e] shadow-md shadow-[#00ff66]/20"
                      : "bg-white/5 hover:bg-white/10 text-[rgba(228,228,231,0.7)]"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>FOUNDER PROFILE</span>
                </button>

                <button
                  onClick={() => setGlobalShareTab("portfolio")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    globalShareTab === "portfolio"
                      ? "bg-[#00ff66] text-[#0c0c0e] shadow-md shadow-[#00ff66]/20"
                      : "bg-white/5 hover:bg-white/10 text-[rgba(228,228,231,0.7)]"
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>FINALIZED PORTFOLIO ({startups.filter(s => s.status === "Finalized" || s.progress >= 90).length})</span>
                </button>

                <button
                  onClick={() => setGlobalShareTab("links")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    globalShareTab === "links"
                      ? "bg-[#00ff66] text-[#0c0c0e] shadow-md shadow-[#00ff66]/20"
                      : "bg-white/5 hover:bg-white/10 text-[rgba(228,228,231,0.7)]"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>DEEP LINKS</span>
                </button>
              </div>

              {/* Tab 1: Founder Profile & Activity */}
              {globalShareTab === "profile" && (
                <div className="space-y-4">
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-syne font-extrabold text-white text-base uppercase">{user?.name || "Founder Sandbox"}</h3>
                        <p className="text-[11px] text-[#00ff66]">{user?.email || "founder@startupforge.ai"}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-[10px] font-bold rounded-full uppercase">
                        {(user?.subscriptionTier || "free").toUpperCase()}_TIER
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/5 text-center text-[10px]">
                      <div className="p-2 bg-white/5 rounded-xl">
                        <span className="block text-[rgba(228,228,231,0.4)] uppercase">STARTUPS</span>
                        <strong className="text-base font-bold text-white font-syne">{startups.length}</strong>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl">
                        <span className="block text-[rgba(228,228,231,0.4)] uppercase">MODULES FORGED</span>
                        <strong className="text-base font-bold text-[#00ff66] font-syne">
                          {startups.reduce((acc, s) => acc + getCompletedModulesCount(s), 0)}
                        </strong>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl">
                        <span className="block text-[rgba(228,228,231,0.4)] uppercase">AI CREDITS</span>
                        <strong className="text-base font-bold text-cyan-400 font-syne">{user?.aiUsageCount || 0}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-[rgba(228,228,231,0.4)] font-bold block mb-1">
                        RECENT ACTIVITY SUMMARY
                      </span>
                      <div className="space-y-1 text-[11px] text-[rgba(228,228,231,0.8)] max-h-28 overflow-y-auto custom-scrollbar pr-1">
                        {(user?.recentActivity || []).slice(0, 4).map((act, i) => (
                          <div key={i} className="flex justify-between items-center py-0.5 border-b border-white/5">
                            <span className="truncate">{act.action}</span>
                            <span className="text-[9px] text-[rgba(228,228,231,0.4)] shrink-0 ml-2">{act.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyProfileSummary}
                      className="flex-1 py-2.5 bg-[#00ff66] hover:bg-[#00cc52] text-[#0c0c0e] font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#00ff66]/20"
                    >
                      <Copy className="w-4 h-4" />
                      <span>COPY PROFILE SUMMARY</span>
                    </button>
                    <button
                      onClick={handleCopyPortfolioLink}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-[#00ff66]" />
                      <span>PORTFOLIO LINK</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Finalized Portfolio Showcase */}
              {globalShareTab === "portfolio" && (
                <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                  {startups.filter(s => s.status === "Finalized" || s.progress >= 75).length === 0 ? (
                    <div className="p-6 bg-white/[0.02] border border-dashed border-white/20 rounded-2xl text-center space-y-3">
                      <Award className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                      <p className="text-xs text-[rgba(228,228,231,0.7)]">
                        No startups are currently marked as <strong className="text-[#00ff66]">Finalized</strong>. You can mark any startup workspace as Finalized using the status toggle pill on its workspace card.
                      </p>
                      <div className="pt-2">
                        <span className="text-[10px] text-[rgba(228,228,231,0.4)] block mb-2 uppercase">AVAILABLE WORKSPACES TO FINALIZE:</span>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {startups.slice(0, 3).map((st) => (
                            <button
                              key={st.id}
                              onClick={() => {
                                const updated = { ...st, status: "Finalized" as const };
                                const next = startups.map(s => s.id === st.id ? updated : s);
                                setStartups(next);
                                localStorage.setItem("sf_startups", JSON.stringify(next));
                                setQuickActionToast(`Marked "${st.identity.name}" as Finalized!`);
                                setTimeout(() => setQuickActionToast(null), 2500);
                              }}
                              className="px-2.5 py-1 bg-white/5 hover:bg-[#00ff66]/20 border border-white/10 hover:border-[#00ff66] text-xs text-white rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3 h-3 text-[#00ff66]" />
                              <span>Finalize {st.identity.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    startups.filter(s => s.status === "Finalized" || s.progress >= 75).map((st) => (
                      <div key={st.id} className="p-4 bg-white/[0.03] border border-white/10 hover:border-[#00ff66]/50 rounded-2xl space-y-2 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-syne font-extrabold text-sm text-white uppercase">{st.identity.name}</h4>
                            <p className="text-[10px] text-[rgba(228,228,231,0.5)] truncate">{st.identity.tagline}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 text-[9px] font-bold rounded-full uppercase">
                            {st.status || "Finalized"}
                          </span>
                        </div>

                        <p className="text-[11px] text-[rgba(228,228,231,0.7)] line-clamp-2 italic">
                          "{st.identity.uvp || st.idea.problem}"
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                          <span className="text-[rgba(228,228,231,0.4)]">{st.idea.industry} • 10/10 Modules</span>
                          <button
                            onClick={() => handleShareStartup(st, { stopPropagation: () => {} } as any)}
                            className="px-3 py-1 bg-[#00ff66]/20 hover:bg-[#00ff66] text-[#00ff66] hover:text-[#0c0c0e] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Copy Portfolio Link</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Deep Links */}
              {globalShareTab === "links" && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
                    <span className="text-[10px] uppercase text-[rgba(228,228,231,0.5)] font-bold">
                      PUBLIC PORTFOLIO URL
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/?portfolio=${user?.id || 'founder'}`}
                        className="bg-[#111113] border border-white/10 text-[#00ff66] px-3 py-2 rounded-lg font-mono text-xs flex-1 select-all"
                      />
                      <button
                        onClick={handleCopyPortfolioLink}
                        className="px-3 py-2 bg-[#00ff66] text-[#0c0c0e] font-bold rounded-lg hover:bg-[#00cc52] cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
                    <span className="text-[10px] uppercase text-[rgba(228,228,231,0.5)] font-bold">
                      MARKDOWN PORTFOLIO BADGE
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`[![StartupForge Portfolio](https://img.shields.io/badge/StartupForge-Portfolio-00ff66?style=flat)](${window.location.origin}/?portfolio=${user?.id || 'founder'})`}
                        className="bg-[#111113] border border-white/10 text-[rgba(228,228,231,0.8)] px-3 py-2 rounded-lg font-mono text-[10px] flex-1 select-all"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`[![StartupForge Portfolio](https://img.shields.io/badge/StartupForge-Portfolio-00ff66?style=flat)](${window.location.origin}/?portfolio=${user?.id || 'founder'})`);
                          setQuickActionToast("Markdown badge snippet copied!");
                          setTimeout(() => setQuickActionToast(null), 2500);
                        }}
                        className="px-3 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 cursor-pointer"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STICKY QUICK NOTE MODAL */}
      <AnimatePresence>
        {quickNoteModalTarget && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-lg bg-[#0c0c0e] border-2 border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] p-6 font-mono space-y-5 text-[#e4e4e7] relative overflow-hidden"
              id="quick-note-modal"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 border border-amber-500/40 rounded-lg text-amber-400">
                    <StickyNote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-syne font-extrabold text-sm text-white uppercase tracking-wider">
                      STICKY REMINDERS
                    </h3>
                    <p className="text-[10px] text-amber-400 font-bold uppercase truncate max-w-xs">
                      {quickNoteModalTarget.identity.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setQuickNoteModalTarget(null)}
                  className="p-1.5 text-[rgba(228,228,231,0.5)] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddQuickNote} className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[rgba(228,228,231,0.6)] block">
                  ADD NEW QUICK NOTE
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickNoteInputText}
                    onChange={(e) => setQuickNoteInputText(e.target.value)}
                    placeholder="e.g., Pitch deck review with Angel Investor on Friday..."
                    className="flex-1 bg-[#111113] border border-amber-500/40 focus:border-amber-400 text-white text-xs px-3 py-2 rounded-xl focus:outline-none placeholder:text-[rgba(228,228,231,0.3)]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0c0c0e] font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              {/* Existing Notes List */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[rgba(228,228,231,0.4)] block">
                  SAVED STICKY REMINDERS ({quickNoteModalTarget.quickNotes?.length || 0})
                </span>

                {(!quickNoteModalTarget.quickNotes || quickNoteModalTarget.quickNotes.length === 0) ? (
                  <div className="p-4 bg-amber-500/5 border border-dashed border-amber-500/20 rounded-xl text-center text-xs text-[rgba(228,228,231,0.5)] italic">
                    No sticky notes attached yet. Add short reminders or tasks for this startup above!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {quickNoteModalTarget.quickNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start justify-between gap-3 shadow-xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs text-amber-200 font-sans font-medium leading-relaxed break-words">
                            {note.text}
                          </p>
                          <span className="text-[9px] text-amber-400/60 block font-mono">
                            {note.createdAt}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteQuickNote(note.id)}
                          className="p-1 text-amber-400/60 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer shrink-0"
                          title="Delete sticky note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MASTER PAGE FOOTER */}
      <footer className="h-[50px] border-t border-[rgba(228,228,231,0.1)] flex justify-between items-center px-8 font-mono text-[10px] text-[rgba(228,228,231,0.5)] relative z-20 bg-[#0c0c0e] uppercase">
        <div>© 2026 STARTUPFORGE SYSTEMS_V4.0 // BUILT FOR EXCELLENCE</div>
        <div className="flex gap-6 uppercase">
          <span className="hover:text-[#00ff66] cursor-pointer">Security</span>
          <span className="hover:text-[#00ff66] cursor-pointer">API Agreement</span>
          <span className="hover:text-[#00ff66] cursor-pointer">IP Terms</span>
        </div>
      </footer>
    </div>
  );
}
