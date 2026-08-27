import { Startup, StartupIdea, User } from "../types";

export interface StartupArchetype {
  id: string;
  category: string;
  badgeColor: string;
  name: string;
  tagline: string;
  industry: string;
  problem: string;
  targetAudience: string;
  budget: string;
  country: string;
  solutionSummary: string;
  keyFeatures: string[];
  techStackSummary: string;
  tamSamSom: { tam: string; sam: string; som: string };
}

export const STARTUP_ARCHETYPES_CATALOG: StartupArchetype[] = [
  {
    id: "archetype_ai_saas",
    category: "AI & B2B SaaS",
    badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    name: "CogniFlow AI",
    tagline: "Autonomous multi-agent enterprise workflow orchestration.",
    industry: "AI & B2B SaaS",
    problem: "Enterprise teams lose 20+ hours per week copying context manually between fragmented SaaS tools and debugging broken Zapier zaps.",
    targetAudience: "Mid-to-large engineering & operations managers at B2B tech companies with 50-500 employees.",
    budget: "$25,000",
    country: "United States",
    solutionSummary: "Self-healing AI multi-agent workflows connecting Jira, Slack, Salesforce, and GitHub with automated fallback logic.",
    keyFeatures: ["Visual Multi-Agent Builder", "Self-Healing API Pipeline Repair", "Enterprise SOC2 Log Vault", "Slack Incident Bot"],
    techStackSummary: "React 19 + Node.js + LangChain / Gemini API + PostgreSQL + Redis",
    tamSamSom: { tam: "$48.2B", sam: "$9.4B", som: "$180M" }
  },
  {
    id: "archetype_fintech",
    category: "FinTech & Payments",
    badgeColor: "text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/30",
    name: "PayPulse Global",
    tagline: "Instant zero-margin cross-border B2B settlement engine.",
    industry: "FinTech & Payments",
    problem: "Cross-border B2B wire transfers take 3-5 business days with 4.5% hidden foreign exchange markup fees.",
    targetAudience: "Global e-commerce exporters, remote tech agencies, and cross-border SaaS suppliers.",
    budget: "$50,000",
    country: "Singapore",
    solutionSummary: "Real-time stablecoin settlement rail with automated multi-currency FX conversion and direct instant ACH payouts.",
    keyFeatures: ["Sub-Second FX Swaps", "Automated Invoice Escrow", "KYC/AML Automated Compliance", "Multi-Currency Virtual IBANs"],
    techStackSummary: "React + Go / Node.js + PostgreSQL + Circle API + Plaid",
    tamSamSom: { tam: "$120B", sam: "$18B", som: "$450M" }
  },
  {
    id: "archetype_healthtech",
    category: "HealthTech & Telemedicine",
    badgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/30",
    name: "PulseCare AI",
    tagline: "AI early diagnostic triage & continuous patient monitoring.",
    industry: "HealthTech & Telemedicine",
    problem: "Primary care clinics face 6-week appointment queues while 40% of non-urgent symptoms could be safely triaged remotely.",
    targetAudience: "Independent medical clinics, outpatient groups, and remote chronic care patients.",
    budget: "$30,000",
    country: "United States",
    solutionSummary: "Continuous Bluetooth wearable vitals monitor paired with an AI clinical triage assistant for fast physician escalation.",
    keyFeatures: ["24/7 AI Vitals Telemetry", "HIPAA-Compliant Patient Portal", "EHR/Epic Integration", "Automated Urgency Scoring"],
    techStackSummary: "React + Express + Gemini Medical Models + Cloud SQL + Bluetooth Web BLE",
    tamSamSom: { tam: "$64B", sam: "$11.2B", som: "$220M" }
  },
  {
    id: "archetype_agritech",
    category: "AgriTech & Climate",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    name: "AgriSoil AI",
    tagline: "Instant autonomous soil nitrogen & micro-nutrient diagnostics.",
    industry: "AgriTech & Sustainable Farming",
    problem: "Soil nutrient analysis takes 3 weeks and costs $400, forcing farmers to guess fertilizer volumes and burn crop margins.",
    targetAudience: "Mid-sized grain and legume family farms and independent crop agronomists.",
    budget: "$15,000",
    country: "United States",
    solutionSummary: "Sub-minute optical spectrography probes delivering precision nitrogen, potassium, and pH prescription maps to smartphones.",
    keyFeatures: ["60-Second Field Scans", "Variable-Rate Fertilizer Maps", "Offline Mobile Syncing", "Carbon Offset Credit Logger"],
    techStackSummary: "React + Vite + Python Spectrographic AI Models + PostgreSQL + Mapbox",
    tamSamSom: { tam: "$8.4B", sam: "$1.2B", som: "$44M" }
  },
  {
    id: "archetype_cybersecurity",
    category: "Cybersecurity",
    badgeColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    name: "SentinelShield",
    tagline: "Autonomous cloud secret vault & real-time leak remediation.",
    industry: "Cybersecurity & Cloud Security",
    problem: "DevOps teams inadvertently leak API credentials and cloud secrets in GitHub commits, causing catastrophic data breaches.",
    targetAudience: "Cloud security engineers, CTOs, and DevOps teams managing Kubernetes / AWS workloads.",
    budget: "$40,000",
    country: "Germany",
    solutionSummary: "Real-time eBPF cloud secret detector that blocks exposed tokens at IDE pre-commit hooks and auto-rotates compromised keys.",
    keyFeatures: ["IDE Pre-Commit Shield", "Automatic Key Rotation Bot", "Zero-Trust Secrets Vault", "SOC2 Compliance Auditor"],
    techStackSummary: "React + Rust / Go + eBPF Linux Kernel Probe + HashiCorp Vault API",
    tamSamSom: { tam: "$32B", sam: "$5.8B", som: "$110M" }
  },
  {
    id: "archetype_edtech",
    category: "EdTech & Upskilling",
    badgeColor: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    name: "SkillForge AI",
    tagline: "Personalized AI pair-programmer & real-world tech mentor.",
    industry: "EdTech & Software Engineering",
    problem: "Traditional coding bootcamps cost $15,000 with static out-of-date lectures that fail to prepare developers for AI engineering roles.",
    targetAudience: "Junior software developers, career switchers, and CS graduates entering the tech workforce.",
    budget: "$10,000",
    country: "United States",
    solutionSummary: "Interactive AI mentor that assigns real-world code tasks, conducts mock technical interviews, and grades pull requests instantly.",
    keyFeatures: ["AI Mock Interview Simulator", "Real Pull Request Code Review", "Adaptive Skill Growth Tree", "Live Code Playground"],
    techStackSummary: "React 19 + Node.js + Gemini Flash 2.0 API + WebSockets + Monaco Editor",
    tamSamSom: { tam: "$22B", sam: "$3.5B", som: "$75M" }
  },
  {
    id: "archetype_ecommerce",
    category: "E-Commerce & Logistics",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    name: "OmniShip AI",
    tagline: "Predictive multi-warehouse inventory & cross-border freight.",
    industry: "E-Commerce & Supply Chain",
    problem: "DTC brands waste 18% of operating capital on inventory overstock and expensive express air freight due to poor demand signals.",
    targetAudience: "DTC e-commerce brands doing $1M-$20M annual revenue across Shopify and Amazon.",
    budget: "$35,000",
    country: "Canada",
    solutionSummary: "Predictive inventory distribution engine using weather, social media trends, and historical order velocity telemetry.",
    keyFeatures: ["Multi-Warehouse Demand Predictor", "Shopify & Amazon 1-Click Sync", "Automated Purchase Order Bot", "3PL Freight Rate Optimizer"],
    techStackSummary: "React + Express + Python Prophet ML + Cloud SQL + Shopify GraphQL API",
    tamSamSom: { tam: "$55B", sam: "$8.2B", som: "$140M" }
  },
  {
    id: "archetype_deeptech",
    category: "DeepTech & Robotics",
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    name: "RoboMetrics",
    tagline: "Autonomous drone inspection fleet OS for industrial assets.",
    industry: "DeepTech & Robotics",
    problem: "Inspecting offshore wind turbines and power grids requires dangerous manual rappelling costing $50k/day in downtime.",
    targetAudience: "Energy utility companies, offshore wind operators, and civil infrastructure managers.",
    budget: "$75,000",
    country: "United Kingdom",
    solutionSummary: "Autonomous drone swarm software using LiDAR and infrared computer vision to detect micro-cracks and structural corrosion.",
    keyFeatures: ["Autonomous Path Navigation", "Sub-Millimeter Crack Detection", "Real-time Thermal Heatmap", "3D Digital Twin Viewer"],
    techStackSummary: "React + C++ / Python ROS2 + PyTorch Computer Vision + Three.js 3D Engine",
    tamSamSom: { tam: "$18B", sam: "$2.9B", som: "$60M" }
  },
  {
    id: "archetype_creator",
    category: "Creator Economy",
    badgeColor: "text-pink-400 bg-pink-400/10 border-pink-400/30",
    name: "MediaPulse AI",
    tagline: "Automated multi-format video repurposing & viral clip studio.",
    industry: "Creator Economy & Digital Media",
    problem: "Video creators and podcast hosts spend 80% of their week manually clipping, captioning, and formatting videos for TikTok, Reels, and Shorts.",
    targetAudience: "YouTube creators, podcast networks, agency social media managers, and course creators.",
    budget: "$12,000",
    country: "United States",
    solutionSummary: "AI video engine that auto-detects hook moments, adds animated typography captions, applies multi-camera cropping, and posts natively.",
    keyFeatures: ["Viral Hook Detector", "Dynamic Kinetic Captions", "Multilingual Voice Dubbing", "Auto-Scheduling Social Matrix"],
    techStackSummary: "React + Express + FFmpeg Video Pipeline + Gemini Multimodal API + Cloud Storage",
    tamSamSom: { tam: "$14B", sam: "$2.1B", som: "$50M" }
  },
  {
    id: "archetype_proptech",
    category: "PropTech",
    badgeColor: "text-teal-400 bg-teal-400/10 border-teal-400/30",
    name: "EstateVision AI",
    tagline: "Predictive property underwriting & instant lease extraction.",
    industry: "PropTech & Real Estate",
    problem: "Commercial property buyers spend 3 weeks manually auditing lease contracts and maintenance spreadsheets before making acquisition bids.",
    targetAudience: "Commercial real estate brokers, private equity property buyers, and property management firms.",
    budget: "$20,000",
    country: "United States",
    solutionSummary: "AI document parser extracting rent rolls, lease terms, and operating expenses to generate instant NOI valuation models.",
    keyFeatures: ["Instant Rent Roll Extraction", "Automated NOI & Cap Rate Calculator", "Tenant Risk Audit", "3D Building Floorplan Generator"],
    techStackSummary: "React + Express + Document AI + PostgreSQL + Recharts Financial Engine",
    tamSamSom: { tam: "$28B", sam: "$4.1B", som: "$85M" }
  },
  {
    id: "archetype_cleantech",
    category: "CleanTech & ESG",
    badgeColor: "text-lime-400 bg-lime-400/10 border-lime-400/30",
    name: "CarbonVault AI",
    tagline: "Real-time Scope 1-3 carbon accounting & ESG compliance ledger.",
    industry: "CleanTech & Sustainability",
    problem: "Enterprise corporations face heavy SEC and EU regulatory penalties if they cannot accurately report Scope 1-3 supply chain carbon metrics.",
    targetAudience: "Chief Sustainability Officers, enterprise compliance leaders, and manufacturing supply chain directors.",
    budget: "$45,000",
    country: "Germany",
    solutionSummary: "Automated carbon ledger connecting enterprise SAP/Oracle ERPs with satellite telemetry and verified carbon credit clearing.",
    keyFeatures: ["Scope 1, 2, 3 Automated Tracker", "ERP Connector Suite", "Satellite Methane Telemetry", "Audit-Ready ESG PDF Exporter"],
    techStackSummary: "React + Express + Cloud SQL + Satellite Geo-Telemetry APIs + PDFKit",
    tamSamSom: { tam: "$38B", sam: "$6.5B", som: "$120M" }
  },
  {
    id: "archetype_gig_marketplace",
    category: "Gig Economy",
    badgeColor: "text-indigo-400 bg-indigo-400/10 border-indigo-400/30",
    name: "TaskGrid Pro",
    tagline: "On-demand 48-hour vetted senior tech talent marketplace.",
    industry: "Gig Economy & Talent Tech",
    problem: "High-growth tech startups wait 3-4 months to hire specialized DevOps or AI engineers for emergency 2-week launch sprints.",
    targetAudience: "Founders, VP of Engineering, and senior CTOs at YC/VC backed startups.",
    budget: "$18,000",
    country: "United States",
    solutionSummary: "AI-verified talent marketplace matching startups with pre-vetted senior engineers backed by automated escrow milestone payments.",
    keyFeatures: ["48-Hour Talent Match", "Smart Contract Escrow", "Automated Code Assessment", "Instant Slack War-Room Integration"],
    techStackSummary: "React + Express + Stripe Connect + PostgreSQL + WebSockets",
    tamSamSom: { tam: "$42B", sam: "$7.1B", som: "$150M" }
  },
  {
    id: "archetype_biotech",
    category: "BioTech",
    badgeColor: "text-violet-400 bg-violet-400/10 border-violet-400/30",
    name: "GeneCraft AI",
    tagline: "Generative protein binder design & therapeutic hit-to-lead acceleration.",
    industry: "BioTech & Synthetic Biology",
    problem: "Initial antibody discovery and protein docking simulations take 3-4 years in wet labs before reaching pre-clinical trial phases.",
    targetAudience: "Pharma drug discovery teams, biotech research labs, and synthetic biology startups.",
    budget: "$80,000",
    country: "United States",
    solutionSummary: "Cloud GPU protein sequence generator running targeted molecular docking simulations to shorten hit-to-lead cycles to weeks.",
    keyFeatures: ["3D Molecular Docking Viewer", "Affinity Prediction Models", "Lab Protocol Auto-Generator", "Patent Freedom-to-Operate Audit"],
    techStackSummary: "React + Python PyTorch / AlphaFold API + Three.js 3D Molecule + Cloud SQL",
    tamSamSom: { tam: "$85B", sam: "$14.2B", som: "$310M" }
  },
  {
    id: "archetype_legaltech",
    category: "LegalTech",
    badgeColor: "text-amber-300 bg-amber-300/10 border-amber-300/30",
    name: "LexiMind AI",
    tagline: "Instant contract redlining & automated corporate compliance audit.",
    industry: "LegalTech & Enterprise Compliance",
    problem: "In-house legal teams spend $350/hour on external law firm retainers to review standard vendor NDAs and enterprise service agreements.",
    targetAudience: "Corporate legal counsel, procurement managers, and enterprise sales directors.",
    budget: "$22,000",
    country: "United States",
    solutionSummary: "Instant legal contract redlining engine trained on 500,000 corporate agreements to flag non-standard indemnity and liability caps.",
    keyFeatures: ["Instant NDA & MSA Redliner", "Custom Legal Playbook Auditor", "Risk Score Heatmap", "Word / Google Docs Plugin"],
    techStackSummary: "React + Express + Gemini 2.0 Pro + PostgreSQL + Office OpenXML SDK",
    tamSamSom: { tam: "$19B", sam: "$3.1B", som: "$70M" }
  }
];

/**
 * Builds a complete, high-fidelity Startup object with full strategy populated for ALL 12+ modules.
 */
export function generateFullStartupStrategy(idea: StartupIdea, user: User | null, customName?: string, customTagline?: string): Startup {
  const timestamp = Date.now() + Math.floor(Math.random() * 10000);
  const name = customName || `${idea.industry.split(" ")[0]}Forge AI`;
  const tagline = customTagline || `The next-gen ${idea.industry.toLowerCase()} platform.`;

  return {
    id: `startup_${timestamp}`,
    ownerId: user?.id || "anonymous",
    createdAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    progress: 100,
    previousDayProgress: 88,
    status: "Finalized",
    isFavorite: false,
    idea: {
      industry: idea.industry,
      problem: idea.problem,
      targetAudience: idea.targetAudience,
      budget: idea.budget || "$20,000",
      country: idea.country || "United States"
    },
    identity: {
      name: name,
      tagline: tagline,
      mission: `To solve critical friction in ${idea.industry} by empowering ${idea.targetAudience} with automated intelligence.`,
      vision: `To establish the global operating system for ${idea.industry.toLowerCase()} over the next 5 years.`,
      elevatorPitch: `${name} is an AI-powered platform built for ${idea.targetAudience}. By directly solving the pain point where "${idea.problem}", we streamline operations, lower costs, and boost overall efficiency.`,
      uvp: `Instant end-to-end automation tailored specifically for ${idea.targetAudience} with guaranteed ROI.`,
      brandVoice: "Authoritative, innovative, sleek, user-centric",
      brandColors: {
        primary: "#0c0c0e",
        secondary: "#00ff66",
        accent: "#3b82f6",
        bg: "#111113"
      },
      typography: {
        heading: "Syne",
        body: "JetBrains Mono"
      },
      logoPrompt: `Minimalist futuristic tech logo representing ${name} in green and dark chrome vector style`,
      domainIdeas: [`${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.ai`, `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}-tech.com`],
      socialHandles: {
        twitter: `@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        linkedin: `company/${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        instagram: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}`
      }
    },
    marketResearch: {
      tam: "$24.5 Billion Global Addressable Market",
      sam: "$3.8 Billion Serviceable Obtainable Sector",
      som: "$120 Million Target Initial Wave Capture",
      industrySize: `The ${idea.industry} sector is expanding rapidly at an estimated CAGR of 14.8% annually.`,
      growthTrends: "High pressure for automated software, cloud migration, and real-time AI decision loops.",
      painPoints: [
        idea.problem,
        "High reliance on manual spreadsheets and disconnected tools",
        "Lack of real-time visibility into operational performance metrics"
      ],
      opportunities: [
        "First-mover advantage in AI-driven automation for this niche",
        "High-margin recurring B2B software SaaS model",
        "API integration partnerships with market incumbents"
      ],
      risks: [
        "Customer reluctance to adopt new software workflows",
        "Competitor price cutting in adjacent markets"
      ],
      swot: {
        strengths: [
          `Specialized AI algorithms tailored precisely for ${idea.industry}`,
          "Sleek modern user interface with zero learning curve",
          "Fast time-to-value for end customers"
        ],
        weaknesses: [
          "Early brand recognition building required",
          "Initial bootstrap marketing budget constraints"
        ],
        opportunities: [
          "Expanding into international markets",
          "Cross-selling complementary enterprise analytics modules"
        ],
        threats: [
          "Large legacy software vendors attempting slow copycat releases",
          "Evolving cloud compliance and privacy regulations"
        ]
      },
      pestle: {
        political: "Supportive government initiatives for technology modernization and digitization.",
        economic: "Cost pressures forcing companies to substitute expensive labor with efficient AI tools.",
        social: "Growing consumer & enterprise demand for immediate digital solutions.",
        technological: "Rapid advancements in LLMs, cloud APIs, and mobile edge computing.",
        legal: "Increasing emphasis on data privacy, GDPR, and SOC2 compliance.",
        environmental: "Low carbon footprint cloud server architecture."
      },
      customerPersonas: [
        {
          name: "Decision Maker Dan",
          role: "Operations / Tech Leader",
          demographics: "35-50 years old, manages team of 10-50 people.",
          quote: `We need a simple tool that solves "${idea.problem}" without requiring 3 months of implementation training.`,
          painPoints: [idea.problem, "Unpredictable software bills"],
          goals: ["Reduce manual overhead", "Improve team output by 3x"]
        }
      ]
    },
    competitorAnalysis: {
      marketOverview: `The ${idea.industry} market features legacy providers that offer slow, manual alternatives.`,
      opportunitiesToDifferentiate: `By offering instant AI automation and transparent pricing, ${name} captures underserved users.`,
      competitors: [
        {
          name: "Legacy Vendor A",
          pricing: "$500/month seat fee",
          features: ["Manual data entry", "Basic CSV exports"],
          strengths: ["Established enterprise brand"],
          weaknesses: ["Slow turnaround", "Outdated UI"],
          positioning: "Traditional enterprise choice",
          differentiation: `${name} delivers results 10x faster using native AI.`
        },
        {
          name: "Point Solution B",
          pricing: "$199/month",
          features: ["Basic dashboard", "Email alerts"],
          strengths: ["Low cost"],
          weaknesses: ["Lacks full workflow coverage"],
          positioning: "Budget alternative",
          differentiation: `${name} provides an all-in-one comprehensive operating suite.`
        }
      ]
    },
    businessModel: {
      canvas: {
        keyPartners: ["Cloud Infrastructure Providers", "Industry Consultants", "API Service Partners"],
        keyActivities: ["AI Model Tuning", "Product Development", "B2B Sales & Marketing"],
        keyResources: ["Proprietary AI Pipelines", "Engineering Team", "Domain Data Assets"],
        valuePropositions: [`Eliminate "${idea.problem}" with automated AI workflows.`],
        customerRelationships: ["Self-Serve Onboarding", "Dedicated Priority Support", "Product Community"],
        channels: ["Direct Web Portal", "Inbound Content Marketing", "Industry Conferences"],
        customerSegments: [idea.targetAudience, "Mid-Market Enterprise Teams"],
        costStructure: ["Server Compute & APIs", "Software Development", "Marketing & Customer Acquisition"],
        revenueStreams: ["Monthly & Annual Software Subscriptions", "Custom Enterprise Plans"]
      },
      revenueStreams: ["Software SaaS Subscriptions", "Usage-Based Add-ons", "Enterprise Implementation Services"],
      pricingStrategy: [
        {
          tier: "Starter Tier",
          price: "$29 / month",
          features: ["Core AI features", "Up to 5 team seats", "Standard email support"]
        },
        {
          tier: "Pro Tier",
          price: "$99 / month",
          features: ["Unlimited AI usage", "Priority execution queue", "24/7 dedicated support", "Custom exports"]
        },
        {
          tier: "Enterprise Tier",
          price: "Custom Annual",
          features: ["Custom SLA", "Dedicated account manager", "SOC2 compliance audit logs", "Custom API connectors"]
        }
      ],
      costStructureDesc: "Main expense drivers are AI API inference compute, server hosting infrastructure, and direct marketing acquisition."
    },
    financialPlanner: {
      profitProjectionYear1: 185000,
      breakEvenMonths: 4,
      breakEvenRevenue: 15000,
      cashFlowEstimate: `Positive operational cash flow projected by Month 4 with 120 active paying subscriber accounts.`,
      budget: [
        { item: "Software Product Engineering", cost: 8000, category: "Setup" },
        { item: "Cloud Hosting & AI Token Reserve", cost: 3000, category: "Operational" },
        { item: "Targeted Customer Acquisition Marketing", cost: 5000, category: "Marketing" },
        { item: "Legal Incorporation & IP Filing", cost: 2000, category: "Legal" }
      ],
      monthlyExpenses: [
        { item: "Cloud Compute & Database Hosting", cost: 450, category: "Hosting/Software" },
        { item: "Ad Campaigns & Content Marketing", cost: 1500, category: "Marketing" },
        { item: "Software Tool Subscriptions", cost: 350, category: "Hosting/Software" }
      ],
      projections: Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        const rev = Math.round(2000 * Math.pow(1.3, i));
        const exp = Math.round(4000 + i * 300);
        return {
          month: `Month ${monthNum}`,
          revenue: rev,
          expenses: exp,
          profit: rev - exp
        };
      })
    },
    mvpPlanner: {
      features: [
        { name: "Core AI Processing Engine", description: "Processes inputs and outputs real-time strategy recommendations.", priority: "Must-Have", complexity: "High" },
        { name: "Interactive User Dashboard", description: "Central workspace allowing users to manage data and configure settings.", priority: "Must-Have", complexity: "Medium" },
        { name: "PDF & Report Export Engine", description: "Generates audit-ready white-label reports for external stakeholders.", priority: "Should-Have", complexity: "Low" }
      ],
      userStories: [
        {
          role: "End User",
          action: "Submit workflow parameters",
          benefit: "Get instant automated solutions",
          acceptanceCriteria: ["Execution time under 5 seconds", "Clear error feedback if input is invalid"]
        }
      ],
      roadmap: {
        phase1: "MVP development, core AI pipeline setup, and UI wireframing.",
        phase2: "Beta testing with 20 design partners and feedback integration.",
        phase3: "Public launch, paid subscription gateway, and marketing push.",
        phase4: "Enterprise SLA integrations and API connector marketplace."
      },
      sprints: [
        {
          name: "Sprint 1: Core Architecture",
          goal: "Build frontend React layout and proxy backend API routes.",
          tasks: [
            { title: "Set up React & Tailwind layout", duration: "3 days", assignee: "Frontend Lead" },
            { title: "Implement Gemini API route", duration: "2 days", assignee: "Backend Lead" }
          ]
        }
      ],
      timelineWeeks: 8
    },
    technicalArchitecture: {
      backendDetails: "Node.js Express API server proxying requests to Gemini Flash & Pro AI models, backed by PostgreSQL on Cloud SQL.",
      frontendDetails: "Single-Page Application using React 19, TypeScript, Vite, and Tailwind CSS with motion/react animations.",
      authFlow: "Firebase Authentication handling secure user email/password login and OAuth tokens.",
      cloudRecommendation: "Google Cloud Run container deployment with Cloud Storage CDN asset delivery.",
      deploymentPlan: "Continuous Integration via GitHub Actions deploying bundled containers on main push.",
      techStack: [
        { layer: "Frontend Framework", tech: "React 19 + TypeScript + Vite", reason: "Ultra-fast rendering, type safety, and modular component architecture." },
        { layer: "Backend Server", tech: "Node.js + Express", reason: "Lightweight, highly scalable, and native support for server-side AI key hiding." },
        { layer: "Database", tech: "PostgreSQL on Cloud SQL", reason: "Reliable relational storage for user accounts, workspace state, and analytics logs." }
      ],
      databaseDesign: [
        {
          name: "workspaces",
          columns: [
            { name: "id", type: "uuid (PK)", notes: "Unique workspace ID" },
            { name: "user_id", type: "uuid (FK)", notes: "Owner user ID" },
            { name: "startup_name", type: "varchar(255)", notes: "Name of startup project" }
          ]
        }
      ],
      apiList: [
        { method: "POST", path: "/api/generate-strategy", description: "Triggers AI strategy generation for requested module.", payload: "{ module: 'marketing' }", response: "{ status: 'success', data: {} }" }
      ]
    },
    prd: {
      problemStatement: idea.problem,
      goals: ["Deliver 10x faster execution than manual alternatives", "Achieve 95%+ customer satisfaction score"],
      functionalRequirements: [
        { id: "FR-1", req: "User must be able to view and edit all strategy parameters.", priority: "High" },
        { id: "FR-2", req: "Export workspace data to JSON or formatted PDF.", priority: "Medium" }
      ],
      nonFunctionalRequirements: [
        { id: "NFR-1", req: "System response latency must remain under 1.5 seconds for UI actions.", type: "Performance" }
      ],
      userStories: [
        `As a user in ${idea.industry}, I want an automated workspace so that I can eliminate manual friction.`
      ],
      acceptanceCriteria: "All 10 strategy modules must load reliably with zero missing data fields.",
      kpis: ["Monthly Active Users (MAU)", "User Retention Rate > 80%", "Average Session Length > 12 minutes"],
      risks: ["API key rate limits during peak viral traffic"]
    },
    marketingPlanner: {
      gtmStrategy: `Launch targeted digital campaigns focusing on ${idea.targetAudience} across LinkedIn, Twitter, and Product Hunt.`,
      socialMediaPlan: {
        twitter: [
          `🚀 Announcing ${name}! The future of ${idea.industry} is here.`,
          `How ${name} solves "${idea.problem}" in under 60 seconds.`
        ],
        linkedin: [
          `Excited to share ${name} - empowering ${idea.targetAudience} with AI automation.`,
          `Case Study: How automated workflows increase productivity by 300%.`
        ],
        instagram: [
          `Behind the scenes of building ${name}! 💡`,
          `Say goodbye to manual friction in ${idea.industry}.`
        ]
      },
      launchChecklist: {
        preLaunch: ["Finalize product landing page and product demo video.", "Build early access waiting list of 500 leads."],
        launchDay: ["Publish on Product Hunt, Hacker News, and LinkedIn.", "Send email broadcast to all waiting list subscribers."],
        postLaunch: ["Collect user reviews and testimonials.", "Iterate product features based on community feedback."]
      },
      seoKeywords: [
        `${idea.industry.toLowerCase()} software`,
        `ai tool for ${idea.targetAudience.toLowerCase()}`,
        `automated ${name.toLowerCase()}`
      ],
      contentIdeas: [
        `The Ultimate Guide to Automating ${idea.industry}`,
        `5 Ways ${idea.targetAudience} Can Save 20 Hours a Week`
      ],
      emailCampaign: [
        {
          subject: `Welcome to ${name} - Revolutionizing ${idea.industry}`,
          body: `Hi there!\n\nThank you for joining ${name}. We built this platform to address the exact problem where ${idea.problem}.\n\nGet started today and experience the difference.`
        }
      ],
      adIdeas: [
        {
          platform: "LinkedIn Sponsored Content",
          headline: `Tired of manual friction in ${idea.industry}?`,
          copy: `Discover how ${name} automates workflows for ${idea.targetAudience} in 1 click.`
        }
      ]
    },
    investorSection: {
      investmentAsk: Number(idea.budget.replace(/[^0-9]/g, "")) * 10 || 250000,
      financialHighlights: "Projecting $1.2M ARR by Year 2 with 82% gross margins on SaaS software revenue.",
      exitStrategy: "Acquisition target for major cloud & enterprise software conglomerates within 4-6 years.",
      executiveSummary: `${name} addresses a high-growth market opportunity in ${idea.industry} by delivering automated AI workflows for ${idea.targetAudience}.`,
      useOfFunds: [
        { item: "Product Engineering & AI R&D", percentage: 45 },
        { item: "Customer Acquisition & Marketing", percentage: 35 },
        { item: "Operations & Cloud Infrastructure", percentage: 20 }
      ],
      pitchDeckOutline: [
        { slide: 1, title: "The Problem", bullets: [idea.problem, "Current solutions are slow, manual, and expensive."] },
        { slide: 2, title: "Our Solution", bullets: [`${name} - Automated AI platform for ${idea.targetAudience}.`, "10x faster execution with seamless cloud integration."] },
        { slide: 3, title: "Market Opportunity", bullets: ["$24.5B TAM with 14.8% annual CAGR growth.", "Expanding target audience looking for digital modern tools."] }
      ]
    },
    legalChecklist: {
      companyRegistration: [
        `Incorporate ${name} as a Delaware C-Corporation.`,
        "Obtain Federal Employer Identification Number (EIN)."
      ],
      privacyPolicyOutline: [
        "Comprehensive user data protection policy.",
        "Strict adherence to GDPR, CCPA, and data retention standards."
      ],
      termsOfServiceOutline: [
        "Clear definition of software subscription terms.",
        "Limitation of liability and acceptable use guidelines."
      ],
      ipConsiderations: [
        `Register trademark for "${name}".`,
        "Maintain non-disclosure agreements (NDAs) with contractors and partners."
      ],
      trademarkChecklist: [
        "Conduct USPTO brand availability search.",
        "File trademark registration application."
      ]
    },
    landingPage: {
      hero: {
        headline: `Automate Your ${idea.industry} Workflows Instantly`,
        subheadline: `Say goodbye to "${idea.problem}". ${name} brings sub-second AI intelligence directly to your team.`,
        ctaText: "Get Started Free"
      },
      features: [
        { title: "Instant AI Execution", description: "Process complex workflows in seconds with custom AI models.", icon: "zap" },
        { title: "Seamless Cloud Integration", description: "Connect with your existing tools without technical hassle.", icon: "shield" },
        { title: "Real-time Analytics", description: "Track performance metrics and output in an intuitive dashboard.", icon: "activity" }
      ],
      pricing: [
        { tier: "Starter", price: "$29 / month", features: ["Core AI engine", "Up to 5 seats", "Standard support"] },
        { tier: "Pro", price: "$99 / month", features: ["Unlimited usage", "Priority execution", "24/7 dedicated support"] }
      ],
      testimonials: [
        {
          name: "Alex Rivera",
          role: "Head of Operations",
          quote: `${name} transformed our workflow completely. We saved 15+ hours in our very first week!`,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
        }
      ],
      faq: [
        { question: `How does ${name} solve our problem?`, answer: `We use specialized AI pipelines that automate the steps where "${idea.problem}".` }
      ],
      contactText: `Have questions? Contact our team at contact@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.ai`
    },
    chatHistory: [
      {
        sender: "ai",
        text: `Welcome to the strategy room for **${name}**! 🚀\n\nI have generated your complete startup strategy across all modules: **Identity**, **Market Research**, **Competitor SWOT**, **Business Model Canvas**, **12-Month Financial Projections**, **MVP Roadmap**, **Technical Architecture**, **PRD**, **Marketing GTM Strategy**, and **Pitch Deck**!\n\nHow can I help you refine your startup today?`,
        timestamp: "Just now"
      }
    ]
  };
}

/**
 * Converts a preset archetype from STARTUP_ARCHETYPES_CATALOG into a full Startup object.
 */
export function archetypeToStartup(archetype: StartupArchetype, user: User | null): Startup {
  const idea: StartupIdea = {
    industry: archetype.industry,
    problem: archetype.problem,
    targetAudience: archetype.targetAudience,
    budget: archetype.budget,
    country: archetype.country
  };

  return generateFullStartupStrategy(idea, user, archetype.name, archetype.tagline);
}
