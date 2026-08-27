import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "dummy_key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Helper to generate tailored fallback data when Gemini API hits quota limits or errors
function getFallbackModuleData(module: string, idea: any, identity: any) {
  const ind = idea?.industry || "Technology & Software";
  const prob = idea?.problem || "manual workflow inefficiencies and high costs";
  const aud = idea?.targetAudience || "industry professionals and growth teams";
  const bud = idea?.budget || "$10,000";
  const country = idea?.country || "United States";
  const name = identity?.name || (ind ? `${ind.split(" ")[0]}Sync` : "NexusFlow");
  const tagline = identity?.tagline || `Automated intelligence for ${ind}`;
  const uvp = identity?.uvp || `Sub-2 minute automated response times for ${aud}`;

  switch (module) {
    case "identity":
      return {
        name,
        tagline,
        mission: `To empower ${aud} by solving ${prob} through automated intelligence.`,
        vision: `To become the leading platform for ${ind} solutions globally.`,
        elevatorPitch: `We are building ${name}, designed for ${aud}. By solving ${prob}, we enable users to lower operational overhead by up to 70%.`,
        uvp,
        brandColors: { primary: "#0f172a", secondary: "#3b82f6", accent: "#10b981", bg: "#f8fafc" },
        typography: { heading: "Space Grotesk", body: "Inter" },
        logoPrompt: `A minimalist modern line-art vector icon for ${name} in ${ind}`,
        brandVoice: "Professional, authoritative, visionary",
        domainIdeas: [`get${name.toLowerCase()}.com`, `${name.toLowerCase()}.ai`, `use${name.toLowerCase()}.io`, `${name.toLowerCase()}app.com`],
        socialHandles: { twitter: `@${name.toLowerCase()}`, linkedin: `company/${name.toLowerCase()}`, instagram: `${name.toLowerCase()}.ai` }
      };

    case "market-research":
      return {
        tam: "$12.5 Billion Global Addressable Market",
        sam: "$2.8 Billion Target Vertical Market",
        som: "$150 Million Initial 3-Year Obtainable Market",
        industrySize: `The ${ind} market is currently valued at $25B+ with a 16.8% CAGR.`,
        growthTrends: `Secular shift toward AI automation and cloud workflows among ${aud}.`,
        customerPersonas: [
          {
            name: "Early Adopter Leader",
            role: `Head of Operations in ${ind}`,
            demographics: `30-45 yrs, Tech-savvy, ${country}`,
            painPoints: [prob, "High error rate from manual tools", "Lack of real-time insights"],
            goals: ["Streamline operational workflows", "Reduce weekly labor hours", "Improve ROI"],
            quote: `"We spend way too many hours every week on manual work that should be automated."`
          },
          {
            name: "Growth Manager",
            role: "Strategy Director",
            demographics: "35-50 yrs, Key decision maker",
            painPoints: ["High customer churn", "Slow onboarding cycles", "Fragmented software stack"],
            goals: ["Increase profit margins", "Scale client volume", "Centralize team data"],
            quote: `"I need a platform that gives our entire team immediate visibility."`
          }
        ],
        painPoints: [prob, "High cost of legacy enterprise platforms", "Fragile spreadsheet workflows", "Slow adoption of legacy software"],
        opportunities: ["Automated AI-driven analysis", "B2B SaaS integration ecosystem", "Expansion into international markets"],
        risks: ["Slow enterprise procurement cycles", "Rising digital advertising CAC", "Evolving regulatory standards"],
        swot: {
          strengths: ["Agile execution", "Custom-tailored UX for target domain", "Low legacy tech debt", "Sub-second automation"],
          weaknesses: ["Early brand recognition", "Limited initial seed marketing budget", "Small initial team"],
          opportunities: ["Untapped regional expansion", "High-margin SaaS subscription model", "Viral user referral loops"],
          threats: ["Incumbent feature copying", "Macroeconomic tightening", "Search ad price hikes"]
        },
        pestle: {
          political: "Favorable government policies promoting tech adoption and data infrastructure.",
          economic: "Capital market focus on high-efficiency tools with rapid ROI.",
          social: "Growing adoption of self-serve software in the modern workforce.",
          technological: "Rapid advances in Generative AI and cloud API reliability.",
          legal: "Strict adherence to user data privacy standards (GDPR, CCPA).",
          environmental: "Cloud-native operations minimize physical resource usage."
        }
      };

    case "competitor-analysis":
      return {
        competitors: [
          {
            name: "Legacy Enterprise Incumbent",
            pricing: "$199 - $999 / month",
            features: ["Manual data input", "Legacy SQL database", "Basic PDF reports"],
            strengths: ["Brand history", "Large sales team"],
            weaknesses: ["Cluttered outdated UI", "Expensive seat pricing", "No automated AI"],
            positioning: "Traditional heavyweight provider",
            differentiation: "10x faster setup with automated AI workflows at a fraction of the cost."
          },
          {
            name: "Niche Alt SaaS",
            pricing: "$49 - $149 / month",
            features: ["Basic dashboard", "Zapier integrations", "Standard support"],
            strengths: ["Simple interface", "Lower cost"],
            weaknesses: ["Lacks deep vertical automation", "Limited export tools"],
            positioning: "Generic mid-market software",
            differentiation: `Optimized specifically for ${ind} with tailored AI models.`
          },
          {
            name: "Manual Spreadsheets / Status Quo",
            pricing: "Cost of employee hours ($50+/hr)",
            features: ["Manual Excel formulas", "Email attachments"],
            strengths: ["Zero license cost", "Familiarity"],
            weaknesses: ["High human error rate", "Fragile", "No real-time collaboration"],
            positioning: "Default status quo habit",
            differentiation: "Automates manual formula work into single-click web dashboards."
          }
        ],
        marketOverview: `The ${ind} sector contains bloated incumbents, leaving a wide opening for an agile, modern platform.`,
        opportunitiesToDifferentiate: "Winning through speed, intuitive UX, and automated AI insights built for end users."
      };

    case "business-model":
      return {
        canvas: {
          keyPartners: ["Cloud Infrastructure (GCP)", "Payment Processing (Stripe)", "Industry Consultants"],
          keyActivities: ["Software Development", "Customer Onboarding", "Inbound Content Marketing"],
          keyResources: ["Proprietary AI Prompts & Engines", "Core Dev Team", "User Analytics"],
          valuePropositions: ["Automate manual tasks", "Drastically reduce overhead", "Instant actionable intelligence"],
          customerRelationships: ["Self-serve onboarding", "24/7 AI chat assistance", "Dedicated Enterprise Support"],
          channels: ["Direct Web Portal", "SEO & Content Marketing", "Targeted B2B Outreach"],
          customerSegments: [aud, "Growth-stage startups", "Mid-sized enterprise teams"],
          costStructure: ["Hosting & AI API compute", "Engineering talent", "Marketing & CAC"],
          revenueStreams: ["Monthly/Annual Subscriptions", "Usage add-ons", "Custom Enterprise plans"]
        },
        revenueStreams: ["Tiered SaaS Subscriptions (Hobby, Pro, Enterprise)", "Priority API usage overages"],
        pricingStrategy: [
          { tier: "Starter", price: "$0 / mo", features: ["1 Active Workspace", "Standard AI Generation", "Community Support"] },
          { tier: "Pro", price: "$29 / mo", features: ["Unlimited Workspaces", "Full AI Suite", "PDF & Markdown Exports", "Priority Support"] },
          { tier: "Enterprise", price: "$199 / mo", features: ["Dedicated Instance", "Custom SLA", "Team Roles & SSO", "Custom Integration"] }
        ],
        costStructureDesc: "High gross margin SaaS model (85%+ margins) with compute costs scaling predictably with user volume."
      };

    case "financial-planner": {
      const numBud = parseInt(bud.replace(/[^0-9]/g, "")) || 10000;
      const mExp = Math.round(numBud * 0.25);
      return {
        budget: [
          { item: "Incorporation & Legal Setup", cost: Math.round(numBud * 0.15), category: "Legal" },
          { item: "Branding, Domain & Web Infrastructure", cost: Math.round(numBud * 0.10), category: "Setup" },
          { item: "Initial MVP Development & APIs", cost: Math.round(numBud * 0.35), category: "Operational" },
          { item: "Launch Marketing & Ads", cost: Math.round(numBud * 0.25), category: "Marketing" },
          { item: "Emergency Reserve Buffer", cost: Math.round(numBud * 0.15), category: "Other" }
        ],
        monthlyExpenses: [
          { item: "Server Compute, Database & AI APIs", cost: Math.round(mExp * 0.3), category: "Hosting/Software" },
          { item: "Productivity Tools & CRM", cost: Math.round(mExp * 0.15), category: "Hosting/Software" },
          { item: "Growth Marketing & Search Ads", cost: Math.round(mExp * 0.35), category: "Marketing" },
          { item: "Contract Support & Operations", cost: Math.round(mExp * 0.2), category: "Salary" }
        ],
        projections: Array.from({ length: 12 }, (_, i) => {
          const m = `Month ${i + 1}`;
          const rev = Math.round(i === 0 ? 0 : Math.pow(i, 1.8) * (numBud * 0.12));
          const exp = Math.round(mExp * (1 + i * 0.05));
          return { month: m, revenue: rev, expenses: exp, profit: rev - exp };
        }),
        breakEvenMonths: 5,
        breakEvenRevenue: Math.round(mExp * 1.2),
        profitProjectionYear1: Math.round(numBud * 3.5),
        cashFlowEstimate: `With an initial capital base of $${numBud.toLocaleString()}, cash flow breakeven is projected by Month 5. High SaaS gross margins support compounding profitability in H2.`
      };
    }

    case "mvp-planner":
      return {
        features: [
          { name: "User Onboarding & Workspace", description: "Centralized workspace with project creation wizards.", complexity: "Low", priority: "Must-Have" },
          { name: "Core Automation Engine", description: `Primary engine solving ${prob}.`, complexity: "Medium", priority: "Must-Have" },
          { name: "Real-time Analytics & Dashboards", description: "Interactive metrics, SVG charts, and trend data.", complexity: "Medium", priority: "Should-Have" },
          { name: "Export Suite", description: "Export projects to PDF, Markdown, or copyable text.", complexity: "Low", priority: "Should-Have" },
          { name: "Team Collaboration", description: "Invite team members with role permissions.", complexity: "High", priority: "Nice-to-Have" }
        ],
        userStories: [
          { role: "As a user", action: "I want to generate a startup plan in under 3 minutes", benefit: "so I can evaluate business viability quickly", acceptanceCriteria: ["Instant wizard setup", "Structured JSON output", "Zero technical setup"] },
          { role: "As a founder", action: "I want to export summary files to PDF", benefit: "so I can present them to investors", acceptanceCriteria: ["Clean PDF layout", "Branded headers", "Formatted tables"] }
        ],
        roadmap: {
          phase1: "Phase 1: Architecture & UI Setup - Database schema, authentication, responsive navigation (Weeks 1-3)",
          phase2: "Phase 2: Core Engine Development - Core feature workflows and data processing (Weeks 4-7)",
          phase3: "Phase 3: Beta Testing & Feedback - Invite initial cohort of target users (Weeks 8-10)",
          phase4: "Phase 4: Public Launch & GTM - Activate subscription checkout and ad campaign (Weeks 11-12)"
        },
        sprints: [
          { name: "Sprint 1: Foundation", goal: "Set up repository, database schema, auth routes, and UI layout.", tasks: [{ title: "Setup repo & DB", duration: "3 days", assignee: "Fullstack Dev" }, { title: "Auth flow", duration: "2 days", assignee: "Backend Dev" }] },
          { name: "Sprint 2: Core Workflows", goal: "Build core user dashboard and AI endpoints.", tasks: [{ title: "Core UI views", duration: "4 days", assignee: "Frontend Dev" }, { title: "Backend processing API", duration: "4 days", assignee: "Backend Dev" }] }
        ],
        timelineWeeks: 12
      };

    case "technical-architecture":
      return {
        techStack: [
          { layer: "Frontend", tech: "React 18, TypeScript, Tailwind CSS, Vite", reason: "Ultra-fast single-page application with modern responsive layout." },
          { layer: "Backend", tech: "Node.js (Express) server", reason: "Lightweight, scalable REST API layer for business logic and integrations." },
          { layer: "Database", tech: "PostgreSQL (Supabase / Cloud SQL)", reason: "Relational integrity, JSONB support, and secure access policies." },
          { layer: "Authentication", tech: "JWT / OAuth 2.0", reason: "Stateless, secure session management across web and mobile interfaces." },
          { layer: "AI Processing", tech: "Google Gemini API via @google/genai SDK", reason: "State-of-the-art language intelligence for automated workflows." }
        ],
        backendDetails: "Node.js Express application running behind an NGINX proxy on Cloud Run with full CORS, rate limiting, and structured logging.",
        frontendDetails: "React SPA structured with modular functional components, Lucide icons, Framer Motion animations, and local state sync.",
        databaseDesign: [
          { name: "users", columns: [{ name: "id", type: "UUID (PK)", notes: "Primary Key" }, { name: "email", type: "VARCHAR(255)", notes: "User Email" }, { name: "subscription_tier", type: "VARCHAR(50)", notes: "free, pro, enterprise" }] },
          { name: "startups", columns: [{ name: "id", type: "UUID (PK)", notes: "Startup ID" }, { name: "user_id", type: "UUID (FK)", notes: "Owner reference" }, { name: "idea", type: "JSONB", notes: "Intake form details" }] }
        ],
        apiList: [
          { method: "POST", path: "/api/auth/login", description: "User login endpoint", payload: "{ email, password }", response: "{ token, user }" },
          { method: "POST", path: "/api/generate-module", description: "AI generation endpoint", payload: "{ idea, module }", response: "Module JSON" }
        ],
        authFlow: "JWT tokens issued on authentication, saved securely in client storage, and attached to bearer headers.",
        deploymentPlan: "Continuous deployment via GitHub connected to Docker containers hosted on Cloud Run with automated SSL.",
        cloudRecommendation: "Google Cloud Platform (Cloud Run + Cloud SQL) for zero-downtime auto-scaling."
      };

    case "prd":
      return {
        problemStatement: `Target users in ${ind} currently suffer from ${prob}. Existing solutions are complex and expensive.`,
        goals: ["Reduce task completion time by 75%", "Achieve 80%+ 30-day user retention", "Maintain 99.9% platform availability"],
        functionalRequirements: [
          { id: "FR-1", req: "Concept Intake & Guided Setup Wizard", priority: "High" },
          { id: "FR-2", req: "Interactive Dashboard & Business Module Canvas", priority: "High" },
          { id: "FR-3", req: "Export to PDF, Markdown & Shareable links", priority: "Medium" }
        ],
        nonFunctionalRequirements: [
          { id: "NFR-1", req: "Sub-1.5 second page load time", type: "Performance" },
          { id: "NFR-2", req: "End-to-end HTTPS TLS 1.3 encryption", type: "Security" }
        ],
        userStories: [
          "As a user, I want to quickly generate an end-to-end plan so I can evaluate my startup idea.",
          "As a founder, I want to export my plan to PDF so I can share it with investors."
        ],
        acceptanceCriteria: "All core modules load cleanly, render accurate data, and export without formatting breaks.",
        kpis: ["Active Users", "Module Completion Rate", "Export Frequency"],
        risks: ["Target audience adoption speed", "API quota limits", "Market competition"]
      };

    case "marketing-planner":
      return {
        gtmStrategy: `Launch via targeted product-led growth (PLG), SEO content marketing targeting ${prob}, and direct community engagement.`,
        socialMediaPlan: {
          twitter: [`🚀 Launching the ultimate tool for ${ind}! Say goodbye to ${prob}. Check it out now!`],
          linkedin: [`Excited to announce our new platform solving ${prob}. Designed specifically for ${aud}.`],
          instagram: [`Visual infographic explaining how to solve ${prob} in 3 simple steps.`]
        },
        launchChecklist: {
          preLaunch: ["Build landing page & waitlist", "Set up social media handles", "Prepare launch email campaign"],
          launchDay: ["Post on Product Hunt & Hacker News", "Send announcement email", "Run initial social ad campaign"],
          postLaunch: ["Engage early users", "Collect customer feedback", "Publish case studies"]
        },
        seoKeywords: [`${ind} automation`, `best tool for ${aud}`, "how to solve operational friction", "startup management software"],
        contentIdeas: ["Comprehensive guide to solving industry friction", "Top 5 mistakes teams make in growth"],
        emailCampaign: [{ subject: `Welcome to the future of ${ind}`, body: `Hi there!\n\nWe built ${name} to solve ${prob} once and for all.\n\nGet started today!` }],
        adIdeas: [{ platform: "Google Search", headline: "Stop wasting time on manual work", copy: `Automate your ${ind} workflow with our modern platform. Try it free today!` }]
      };

    case "investor-section":
      return {
        pitchDeckOutline: [
          { slide: 1, title: "Title & Hook", bullets: [name, tagline, "Founder Intro"] },
          { slide: 2, title: "The Problem", bullets: [prob, "Impact on target audience", "Why current options fail"] },
          { slide: 3, title: "The Solution", bullets: ["Our modern platform overview", "Automated workflows", "Key user benefits"] },
          { slide: 4, title: "Market Opportunity", bullets: ["$10B+ TAM", "Rapid industry growth rate", "Secular market tailwinds"] },
          { slide: 5, title: "Business Model", bullets: ["SaaS subscription tiers ($29-$199/mo)", "High gross margins", "Predictable recurring revenue"] },
          { slide: 6, title: "Traction & Roadmap", bullets: ["Product live in beta", "Initial user cohort feedback", "12-week development milestone plan"] },
          { slide: 7, title: "Financial Projections", bullets: ["Breakeven projected in Month 5", "Year 1 profitability target", "Compounding year-over-year margins"] },
          { slide: 8, title: "The Ask", bullets: ["$150,000 Seed Capital Ask", "Product engineering & GTM allocation", "18-month runway to Series A"] }
        ],
        investmentAsk: 150000,
        useOfFunds: [
          { item: "Product Engineering & R&D", percentage: 50 },
          { item: "Growth Marketing & Customer Acquisition", percentage: 30 },
          { item: "Legal, Compliance & Operations", percentage: 20 }
        ],
        financialHighlights: "Projected to reach cash-flow positivity within 5 months, scaling to $300k+ ARR by Year 2.",
        exitStrategy: "Strategic acquisition target by major enterprise software players in 4-5 years.",
        executiveSummary: `${name} is a modern SaaS platform addressing ${prob} for ${aud}. Seeking $150k seed funding to accelerate GTM.`
      };

    case "legal-checklist":
      return {
        companyRegistration: ["Incorporate as Delaware C-Corp or LLC", "Obtain IRS EIN Tax ID", "Open dedicated business bank account"],
        privacyPolicyOutline: ["Data collection scope (user inputs, email, cookies)", "Data security standards & encryption", "GDPR & CCPA compliance rights"],
        termsOfServiceOutline: ["User responsibilities & acceptable use", "IP Ownership: Users retain 100% rights to generated concepts", "Limitation of liability & advisory disclaimers"],
        ipConsiderations: ["Founders IP assignment agreements", "Proprietary algorithm protection", "Third-party license auditing"],
        trademarkChecklist: ["USPTO database search for name conflicts", "Domain name registration", "Social media handle securing"]
      };

    case "landing-page":
      return {
        hero: {
          headline: tagline,
          subheadline: `Say goodbye to ${prob}. Our platform empowers ${aud} to achieve 10x faster results.`,
          ctaText: "Start Forging Free"
        },
        features: [
          { title: "Automated Workflows", description: "Streamline complex operations with one click.", icon: "Zap" },
          { title: "Real-time Intelligence", description: "Get instant actionable insights tailored to your business.", icon: "Activity" },
          { title: "Seamless Integration", description: "Export to PDF, Markdown, or connect to existing tools.", icon: "Download" }
        ],
        pricing: [
          { tier: "Starter", price: "$0 / month", features: ["1 Active Workspace", "Standard AI Generation", "Community Support"] },
          { tier: "Pro", price: "$29 / month", features: ["Unlimited Workspaces", "Full AI Suite", "Export to PDF & MD", "Priority Support"] }
        ],
        testimonials: [
          { name: "Alex Rivera", role: "Founder, TechFlow", quote: "This platform saved us months of planning and research. Unbelievable value!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" },
          { name: "Elena Rostova", role: "Head of Product", quote: "The AI generated data is surprisingly accurate and actionable. Highly recommended!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" }
        ],
        faq: [
          { question: "What is StartupForge?", answer: "An all-in-one AI platform to build, analyze, and scale startup concepts instantly." },
          { question: "Who owns the IP?", answer: "You retain 100% complete ownership of all generated business plans and assets." }
        ],
        contactText: "Questions? Contact our team at hello@startupforge.ai"
      };

    case "mock-interview":
      return {
        questions: [
          `What is the primary defensible moat for ${name} against legacy incumbents?`,
          `How do you plan to acquire your first 100 paying customers for ${name} given your initial budget of ${bud}?`,
          `Can you walk me through your unit economics, expected CAC, and lifetime value (LTV) estimates?`,
          `What is the biggest operational risk that could prevent ${name} from scaling, and how will you mitigate it?`,
          `Where do you see ${name} in 3 years, and what is your exit or long-term growth strategy?`
        ]
      };

    default:
      return { status: "ok" };
  }
}

// Helper to make Gemini API calls with robust transient-error retry logic
async function callGeminiWithRetry<T>(
  apiCall: () => Promise<T>,
  retries = 3,
  delay = 1500
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    const errorStr = JSON.stringify(error) || "";
    const isQuotaExceeded =
      errorStr.includes("Quota exceeded") ||
      errorStr.includes("RESOURCE_EXHAUSTED") ||
      (error.message && (error.message.includes("Quota exceeded") || error.message.includes("RESOURCE_EXHAUSTED")));

    // Fail fast on quota limits so local fallback generator handles it immediately
    if (isQuotaExceeded) {
      throw error;
    }

    const isTransient = 
      error.status === 503 || 
      error.status === "UNAVAILABLE" || 
      error.code === 503 || 
      error.status === 429 || 
      error.status === "RESOURCE_EXHAUSTED" || 
      error.code === 429 ||
      (error.message && (
        error.message.includes("503") || 
        error.message.includes("429") || 
        error.message.includes("UNAVAILABLE") || 
        error.message.includes("RESOURCE_EXHAUSTED") ||
        error.message.includes("high demand")
      )) ||
      errorStr.includes("503") ||
      errorStr.includes("429") ||
      errorStr.includes("UNAVAILABLE") ||
      errorStr.includes("RESOURCE_EXHAUSTED") ||
      errorStr.includes("high demand");

    if (retries > 0 && isTransient) {
      console.warn(`[Transient Gemini Error] Retrying in ${delay}ms... (${retries} retries left). Error details:`, error.message || error);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return callGeminiWithRetry(apiCall, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Single core AI generation endpoint
app.post("/api/generate-module", async (req, res) => {
  try {
    const { idea, identity, module } = req.body;
    if (!idea) {
      return res.status(400).json({ error: "Startup idea is required" });
    }

    const ai = getAI();
    let prompt = "";
    let systemInstruction = "You are a professional business consultant, SaaS founder, startup lawyer, and venture capitalist. Generate high-quality, realistic, detailed business data in JSON format.";

    const ideaStr = `Industry: ${idea.industry}
Problem: ${idea.problem}
Target Audience: ${idea.targetAudience}
Budget: ${idea.budget}
Country: ${idea.country}`;

    const identityStr = identity ? `Startup Name: ${identity.name}
Tagline: ${identity.tagline}
Mission: ${identity.mission}
Vision: ${identity.vision}
Elevator Pitch: ${identity.elevatorPitch}
UVP: ${identity.uvp}` : "";

    if (req.body.prompt) {
      prompt = req.body.prompt;
    } else {
      switch (module) {
      case "identity":
        prompt = `Based on this startup idea, generate a professional brand identity.
Idea context:
${ideaStr}

You MUST return a JSON object with this exact shape:
{
  "name": "Creative and memorable name for this startup",
  "tagline": "Short, catchy tagline",
  "mission": "A clear and inspiring mission statement",
  "vision": "A compelling long-term vision statement",
  "elevatorPitch": "A persuasive 30-second elevator pitch",
  "uvp": "Unique Value Proposition (what makes it different/better)",
  "brandColors": {
    "primary": "Hex code for a sleek modern brand primary color (e.g. #0f172a)",
    "secondary": "Hex code for a professional secondary color (e.g. #3b82f6)",
    "accent": "Hex code for a vibrant accent color (e.g. #f43f5e)",
    "bg": "Hex code for a soft background tint (e.g. #f8fafc)"
  },
  "typography": {
    "heading": "Heading font recommendation (e.g. Space Grotesk or Outfit)",
    "body": "Body font recommendation (e.g. Inter or Plus Jakarta Sans)"
  },
  "logoPrompt": "A detailed, beautiful prompt for generating a minimalist, high-quality logo for this brand using Midjourney, DALL-E, or Imagen",
  "brandVoice": "Tone of voice description (e.g. Professional yet friendly, technical and authoritative)",
  "domainIdeas": ["list", "of", "4", "available-feeling", "dot-com", "or", "dot-ai", "domains"],
  "socialHandles": {
    "twitter": "@startupname",
    "linkedin": "company/startupname",
    "instagram": "startupname.ai"
  }
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "market-research":
        prompt = `Perform comprehensive market research and analysis for the following startup.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "tam": "Estimated Total Addressable Market (TAM) with valuation and high-level explanation",
  "sam": "Estimated Serviceable Addressable Market (SAM) with valuation and details",
  "som": "Estimated Serviceable Obtainable Market (SOM) with valuation and realistic initial capture target",
  "industrySize": "Global or national industry size and current state",
  "growthTrends": "Key secular trends, compounding annual growth rate (CAGR), or shift driving this space",
  "customerPersonas": [
    {
      "name": "Persona 1 Name (e.g. Early Adopter Dave)",
      "role": "Title/Role (e.g. Independent Organic Farmer)",
      "demographics": "Age, Location, Income details",
      "painPoints": ["at least 3 key pain points"],
      "goals": ["at least 3 goals/desires"],
      "quote": "A realistic quote summarizing their core challenge"
    },
    {
      "name": "Persona 2 Name (e.g. Enterprise Emily)",
      "role": "Title/Role",
      "demographics": "Age, Location, Company details",
      "painPoints": ["at least 3 key pain points"],
      "goals": ["at least 3 goals/desires"],
      "quote": "A realistic quote"
    }
  ],
  "painPoints": ["list of 4 major general industry pain points"],
  "opportunities": ["list of 3 key emerging opportunities in this space"],
  "risks": ["list of 3 significant risks or barriers to entry"],
  "swot": {
    "strengths": ["list of 4 internal strengths"],
    "weaknesses": ["list of 4 potential internal weaknesses"],
    "opportunities": ["list of 4 external opportunities"],
    "threats": ["list of 4 external threats"]
  },
  "pestle": {
    "political": "Political factors (regulations, tariffs, trade, stability)",
    "economic": "Economic factors (inflation, interest rates, capital availability, target market purchasing power)",
    "social": "Social factors (demographics, consumer behaviors, lifestyle changes, culture)",
    "technological": "Technological factors (automation, emerging tech, internet penetration, integrations)",
    "legal": "Legal factors (industry regulation, employment laws, consumer protection, health & safety)",
    "environmental": "Environmental factors (sustainability, carbon offset, waste, physical resources)"
  }
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "competitor-analysis":
        prompt = `Create a rigorous competitor analysis for this startup.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "competitors": [
    {
      "name": "Competitor 1 Name",
      "pricing": "Estimated pricing details (e.g. $49-$299/mo, free tier available)",
      "features": ["3 key features of theirs"],
      "strengths": ["2 major strengths of theirs"],
      "weaknesses": ["2 major weaknesses of theirs"],
      "positioning": "How they position themselves in the market",
      "differentiation": "Specific angle on how we can beat them or win our share"
    },
    {
      "name": "Competitor 2 Name",
      "pricing": "Estimated pricing details",
      "features": ["3 key features"],
      "strengths": ["2 strengths"],
      "weaknesses": ["2 weaknesses"],
      "positioning": "Their positioning",
      "differentiation": "How we differentiate"
    },
    {
      "name": "Competitor 3 Name (or Traditional Status Quo, e.g., Excel/Manual work)",
      "pricing": "Cost of doing nothing or manual cost",
      "features": ["how they currently handle it"],
      "strengths": ["incumbency strengths"],
      "weaknesses": ["pain of manual process"],
      "positioning": "Market status quo",
      "differentiation": "Our modern automated differentiator"
    }
  ],
  "marketOverview": "High-level overview of the competitive intensity and landscape",
  "opportunitiesToDifferentiate": "Strategic summary of the wide-open gaps we can exploit"
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "business-model":
        prompt = `Draft a Business Model Canvas and pricing strategy for this startup.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "canvas": {
    "keyPartners": ["list of 3-4 key partners needed"],
    "keyActivities": ["list of 3-4 key operations, sales, or dev tasks"],
    "keyResources": ["list of 3-4 key physical, IP, human, or financial assets"],
    "valuePropositions": ["list of 3-4 value statements we deliver to customers"],
    "customerRelationships": ["list of 2-3 ways we interact (e.g. self-serve, dedicated support)"],
    "channels": ["list of 3 distribution channels (e.g. SEO, direct sales, word-of-mouth)"],
    "customerSegments": ["list of 3 distinct customer target segments"],
    "costStructure": ["list of 3-4 main cost drivers"],
    "revenueStreams": ["list of 3 potential revenue generation methods"]
  },
  "revenueStreams": ["Detailed description of revenue stream 1", "Detailed description of revenue stream 2"],
  "pricingStrategy": [
    {
      "tier": "Free / Hobby / Starter",
      "price": "$0 / Free Trial / Cheap Entry",
      "features": ["3-4 tier-specific features"]
    },
    {
      "tier": "Pro / Growth / Essential",
      "price": "$29-$99 / Mid range standard price",
      "features": ["4-5 tier-specific features, key value"]
    },
    {
      "tier": "Enterprise / Custom",
      "price": "Custom / Contact Sales",
      "features": ["Security, SLA, Dedicated support, unlimited usage"]
    }
  ],
  "costStructureDesc": "Detailed explanation of the startup's cost structure, hosting costs, client acquisition costs (CAC), and operational overhead."
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "financial-planner":
        prompt = `Generate a comprehensive initial financial model for this startup. Make the numbers highly realistic based on the budget constraint and industry.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "budget": [
    { "item": "Incorporation & legal setup", "cost": 1000, "category": "Legal" },
    { "item": "Domain, Brand Asset & Initial website setup", "cost": 500, "category": "Setup" },
    { "item": "V1 product hosting, API costs & tools", "cost": 1200, "category": "Operational" },
    { "item": "Initial Marketing, Ads & Launch budget", "cost": 2500, "category": "Marketing" },
    { "item": "Emergency reserve buffer", "cost": 1000, "category": "Other" }
  ],
  "monthlyExpenses": [
    { "item": "Core cloud hosting, database & LLM/APIs", "cost": 300, "category": "Hosting/Software" },
    { "item": "SaaS productivity tools & CRM", "cost": 100, "category": "Hosting/Software" },
    { "item": "Growth Ads (Google/Meta/LinkedIn)", "cost": 1000, "category": "Marketing" },
    { "item": "Contract developer / support helper", "cost": 2000, "category": "Salary" },
    { "item": "Workspace, internet, miscellaneous", "cost": 150, "category": "Rent/Office" }
  ],
  "projections": [
    { "month": "Month 1", "revenue": 0, "expenses": 3550, "profit": -3550 },
    { "month": "Month 2", "revenue": 500, "expenses": 3550, "profit": -3050 },
    { "month": "Month 3", "revenue": 1200, "expenses": 3600, "profit": -2400 },
    { "month": "Month 4", "revenue": 2400, "expenses": 3600, "profit": -1200 },
    { "month": "Month 5", "revenue": 3800, "expenses": 3700, "profit": 100 },
    { "month": "Month 6", "revenue": 5200, "expenses": 3800, "profit": 1400 },
    { "month": "Month 7", "revenue": 7000, "expenses": 4000, "profit": 3000 },
    { "month": "Month 8", "revenue": 9000, "expenses": 4200, "profit": 4800 },
    { "month": "Month 9", "revenue": 11500, "expenses": 4500, "profit": 7000 },
    { "month": "Month 10", "revenue": 14000, "expenses": 4800, "profit": 9200 },
    { "month": "Month 11", "revenue": 17000, "expenses": 5200, "profit": 11800 },
    { "month": "Month 12", "revenue": 21000, "expenses": 5600, "profit": 15400 }
  ],
  "breakEvenMonths": 5,
  "breakEvenRevenue": 3700,
  "profitProjectionYear1": 41550,
  "cashFlowEstimate": "Based on year 1 projections, the cumulative cash flow bottoms out at negative $10,200 in month 4, before starting to compound positively. We project a year-end cash balance of over $30,000, assuming we retain all initial profits. High gross margins (80%+) typical of this industry model support rapid capital accumulation after initial setup."
}

Ensure the projection values and lists of budget items match the startup idea. Do not write dummy codes, write the actual realistic estimations as numbers! Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "mvp-planner":
        prompt = `Plan the MVP (Minimum Viable Product), user stories, and roadmap for this startup.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "features": [
    {
      "name": "Feature 1 (e.g. Single-click farmer intake portal)",
      "description": "Short description of what the feature does, how it works, and technology used",
      "complexity": "Low (or Medium or High)",
      "priority": "Must-Have (or Should-Have or Nice-to-Have)"
    },
    { "name": "Feature 2", "description": "...", "complexity": "Medium", "priority": "Must-Have" },
    { "name": "Feature 3", "description": "...", "complexity": "Medium", "priority": "Should-Have" },
    { "name": "Feature 4", "description": "...", "complexity": "High", "priority": "Should-Have" },
    { "name": "Feature 5", "description": "...", "complexity": "Low", "priority": "Nice-to-Have" }
  ],
  "userStories": [
    {
      "role": "e.g. As a crop consultant",
      "action": "I want to upload soil scan logs into a simple dashboard",
      "benefit": "so I can generate AI recommendations for fertilizer in under 2 minutes",
      "acceptanceCriteria": [
        "Dashboard accepts CSV, Excel, and image scans",
        "AI output displays actionable recommendation in clear text",
        "Report can be exported to PDF easily"
      ]
    },
    {
      "role": "As an early adopter client",
      "action": "...",
      "benefit": "...",
      "acceptanceCriteria": ["...", "..."]
    }
  ],
  "roadmap": {
    "phase1": "Phase 1: Design & Core Database architecture - Setting up database, auth flow, and basic user interface layout (Weeks 1-3)",
    "phase2": "Phase 2: Core Feature Implementation - API connections, model processing, and core user dashboards (Weeks 4-7)",
    "phase3": "Phase 3: Beta Launch & Integrations - Launching to a small cohort of early adopters, gathering feedback, polishing bugs (Weeks 8-10)",
    "phase4": "Phase 4: Launch & GTM rollout - Polishing paid tier checkout, analytics, and scaling (Weeks 11-12)"
  },
  "sprints": [
    {
      "name": "Sprint 1: The Foundation",
      "goal": "Build responsive database schemas, authentication flow, and initial mockup of dashboard views.",
      "tasks": [
        { "title": "Setup repository, database schema, and project structure", "duration": "3 days", "assignee": "Fullstack Dev" },
        { "title": "Implement email & social authentication routes with JWT", "duration": "2 days", "assignee": "Backend Dev" },
        { "title": "Design interactive UX wireframe in React & Tailwind", "duration": "4 days", "assignee": "Frontend/UI Dev" }
      ]
    },
    {
      "name": "Sprint 2: Core Engine",
      "goal": "Connect frontend client to backend AI generation logic.",
      "tasks": [
        { "title": "Setup server-side LLM processing route with context templates", "duration": "4 days", "assignee": "AI Engineer" },
        { "title": "Build dynamic dashboards, file upload handlers & forms in React", "duration": "5 days", "assignee": "Frontend/UI Dev" }
      ]
    }
  ],
  "timelineWeeks": 12
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "technical-architecture":
        prompt = `Design a bulletproof technical architecture, database schema, and API structure for this startup.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "techStack": [
    { "layer": "Frontend", "tech": "React, TypeScript, Tailwind CSS, Vite", "reason": "Provides a high-performance, responsive single-page experience with ultra-fast loads." },
    { "layer": "Backend", "tech": "Node.js (Express) or Python (FastAPI)", "reason": "Allows robust, rapid development, native handling of JSON payloads, and clean async processing." },
    { "layer": "Database", "tech": "PostgreSQL (Supabase/Neon)", "reason": "Excellent handling of relational schemas, user accounts, transactional security, and scalability." },
    { "layer": "Cache & Queue", "tech": "Redis", "reason": "Saves expensive API data and manages rate-limits / task queues." },
    { "layer": "AI / LLM Engine", "tech": "Gemini API via @google/genai SDK", "reason": "Provides state-of-the-art text and multimodal synthesis with high speed and low cost." }
  ],
  "backendDetails": "A stateless server-side REST API that handles auth, user roles, startup storage, and proxies AI generation to hidden secret SDK keys.",
  "frontendDetails": "A bento-grid UI workspace that stores user progress locally or in DB, utilizes Framer Motion for smooth tab transitions, and renders rich tables & SVG charts.",
  "databaseDesign": [
    {
      "name": "users",
      "columns": [
        { "name": "id", "type": "UUID (PK)", "notes": "Auto-generated unique user identifier" },
        { "name": "email", "type": "VARCHAR(255)", "notes": "Unique email address for login" },
        { "name": "subscription_tier", "type": "VARCHAR(50)", "notes": "free, pro, or enterprise" }
      ]
    },
    {
      "name": "startups",
      "columns": [
        { "name": "id", "type": "UUID (PK)" },
        { "name": "user_id", "type": "UUID (FK -> users.id)" },
        { "name": "idea_payload", "type": "JSONB", "notes": "The intake form details (problem, target, etc)" },
        { "name": "identity", "type": "JSONB" },
        { "name": "market_research", "type": "JSONB" }
      ]
    }
  ],
  "apiList": [
    { "method": "POST", "path": "/api/auth/register", "description": "Register a new user account with secure password hashing", "payload": "{ email, password, name }", "response": "{ token, user }" },
    { "method": "POST", "path": "/api/startups", "description": "Create a new startup concept from intake idea", "payload": "{ industry, problem, audience, budget }", "response": "{ id, createdAt }" },
    { "method": "GET", "path": "/api/startups/:id", "description": "Retrieve full saved startup details including generated data", "response": "{ startup }" }
  ],
  "authFlow": "Authentication is handled using secure JWT tokens. The client registers or logs in, gets a JWT token, stores it in LocalStorage, and includes it as a Bearer token in the Authorization header of all API calls.",
  "deploymentPlan": "Continuous integration (CI) via GitHub Actions. Frontend is deployed as a static SPA on Vercel or Cloudflare Pages for instant CDN delivery. Backend is running in scaled Cloud Run containers connected to a Cloud SQL PostgreSQL database.",
  "cloudRecommendation": "Google Cloud Platform (GCP) or Supabase. GCP Cloud Run offers unmatched scale-to-zero pricing for small containers, keeping maintenance costs near zero until active traffic scales."
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "prd":
        prompt = `Generate a full Product Requirement Document (PRD) for this startup product.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "problemStatement": "A highly descriptive, empathetic explanation of the exact problem this product is solving, who suffers from it, and why current solutions fall short.",
  "goals": ["at least 3 high-level product goals / metrics (e.g. reduce time by 80%)"],
  "functionalRequirements": [
    { "id": "FR-1", "req": "User Intake Wizard & Concept generation", "priority": "High" },
    { "id": "FR-2", "req": "Interactive visual business model dashboard and editing canvas", "priority": "High" },
    { "id": "FR-3", "req": "One-click PDF/MD export capability for business summaries", "priority": "Medium" }
  ],
  "nonFunctionalRequirements": [
    { "id": "NFR-1", "req": "Sub-2 second page transition and chart loads under normal load", "type": "Performance" },
    { "id": "NFR-2", "req": "Full TLS encryption for user sessions and database data at rest", "type": "Security" }
  ],
  "userStories": ["list of 3 user stories in standard format"],
  "acceptanceCriteria": "Detailed acceptance criteria, listing what must work for the PRD to be considered fully met.",
  "kpis": ["Daily Active Users (DAU)", "Conversion rate of startup intake to export", "NPS / User retention"],
  "risks": ["Cold-start user friction", "Cost of API operations", "Changing regulatory guidelines"]
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "marketing-planner":
        prompt = `Create a robust Go-To-Market and Marketing Plan for this startup.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "gtmStrategy": "Comprehensive description of the GTM (Go-To-Market) strategy, including positioning, channel selection, and initial launch tactics.",
  "socialMediaPlan": {
    "twitter": ["3 distinct ready-to-post Twitter threads or single tweets with hashtags"],
    "linkedin": ["2 professional ready-to-post LinkedIn posts discussing the industry problem"],
    "instagram": ["2 visual content ideas with captions and image layout descriptions"]
  },
  "launchChecklist": {
    "preLaunch": ["Task 1", "Task 2", "Task 3"],
    "launchDay": ["Task 1", "Task 2"],
    "postLaunch": ["Task 1", "Task 2"]
  },
  "seoKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
  "contentIdeas": ["Blog post idea 1 with brief outline", "Youtube/TikTok short script concept"],
  "emailCampaign": [
    {
      "subject": "Launch announcement email subject line",
      "body": "Hi [Name],\\n\\nIntro to problem...\\n\\nIntroducing our solution...\\n\\nCTA Link"
    }
  ],
  "adIdeas": [
    {
      "platform": "Google Search / Facebook Ads / LinkedIn Ads",
      "headline": "Punchy ad headline under 50 characters",
      "copy": "Engaging primary text ad copy that targets the core customer segment's pain point and drives clickthrough."
    }
  ]
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "investor-section":
        prompt = `Generate an investor-ready section, including pitch deck slides, investment ask, and executive summary.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "pitchDeckOutline": [
    { "slide": 1, "title": "The Hook & Title", "bullets": ["Startup Name", "The core tagline", "Presenter intro"] },
    { "slide": 2, "title": "The Problem", "bullets": ["Describe the massive pain in the industry", "Provide a real demographic / scenario", "Why current fixes fail"] },
    { "slide": 3, "title": "Our Solution", "bullets": ["A clean summary of our product", "How we solve the pain", "The immediate benefit"] },
    { "slide": 4, "title": "The Market Size (TAM/SAM/SOM)", "bullets": ["Provide actual calculations", "Why this market is growing rapidly", "Secular tailwinds"] },
    { "slide": 5, "title": "Business & Pricing Model", "bullets": ["How we make money", "Pricing plans", "LTV / CAC projections"] },
    { "slide": 6, "title": "Competitor Analysis", "bullets": ["Who is currently in the market", "Our unique defensible moat / UVP", "Market position map"] },
    { "slide": 7, "title": "Marketing & Traction", "bullets": ["Go-to-market channels", "Early success / milestones", "Acquisition plan"] },
    { "slide": 8, "title": "Product Roadmap & MVP", "bullets": ["Features currently live", "Future scaling plans", "Sprints / Release schedule"] },
    { "slide": 9, "title": "Financial Highlights", "bullets": ["12-month projections", "Cost vs Revenue breakout", "Path to profitability"] },
    { "slide": 10, "title": "The Ask & Team", "bullets": ["Capital amount requested", "Itemized use of funds", "Call to action details"] }
  ],
  "investmentAsk": 150000,
  "useOfFunds": [
    { "item": "Core Engineering & Product dev", "percentage": 45 },
    { "item": "Go-To-Market Ads & Customer Acquisition", "percentage": 30 },
    { "item": "Legal, Operations & Workspace setup", "percentage": 15 },
    { "item": "Buffer / Emergency reserves", "percentage": 10 }
  ],
  "financialHighlights": "We project reaching cash-flow positivity in Month 5 with a Year-end cash profit of over $40,000, compounding to $350,000+ in Year 2 as word of mouth and enterprise clients reduce our average CAC.",
  "exitStrategy": "Targeting acquisition within 4-5 years by larger software players looking to consolidate their position in this expanding vertical, or a strategic IPO as revenues compound beyond $50M.",
  "executiveSummary": "A powerful one-page executive summary that sums up the core pain, product, traction, financial metrics, and team experience, serving as a clean leave-behind document for venture capital funds."
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "legal-checklist":
        prompt = `Draft a realistic legal setup, trademark checklist, and legal policy outline.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "companyRegistration": ["Step 1: Choose business entity (e.g., Delaware C-Corp for VCs or LLC for bootstrap)", "Step 2: Obtain Employer Identification Number (EIN) from IRS", "Step 3: Establish a separate business bank account"],
  "privacyPolicyOutline": ["Section 1: Data We Collect (email, workspace interactions, analytics cookies)", "Section 2: How We Use Data (to forge concepts, maintain server performance, billing)", "Section 3: CCPA/GDPR user rights and how to request deletion"],
  "termsOfServiceOutline": ["Section 1: Acceptable Use (no reverse engineering AI, no illicit inputs)", "Section 2: Intellectual Property (You retain complete ownership of all AI-generated startup concepts)", "Section 3: Disclaimers (AI outputs are advisory business plans, not legal/financial guarantees)"],
  "ipConsiderations": ["Ensure clean written agreements with all founders and contract developers assigning IP to the corporate entity.", "Configure strict open-source software license auditing before production release.", "Draft proprietary NDAs for strategic client discussions."],
  "trademarkChecklist": ["Conduct USPTO / local trade register name search", "Search domain names and active social handles to prevent confusion", "Register core brand name and logo in target primary markets", "Add trademark notice (™ or ®) to footer and marketing collateral"]
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "landing-page":
        prompt = `Generate a high-converting Landing Page copy and layout content for this startup.
Idea context:
${ideaStr}
${identityStr}

You MUST return a JSON object with this exact shape:
{
  "hero": {
    "headline": "A bold, benefits-focused headline (under 10 words) (e.g. Revolutionize Soil Health with Instant AI)",
    "subheadline": "An engaging, explanatory subheadline describing how it works and the primary value proposition (1-2 sentences)",
    "ctaText": "Primary high-converting Call to Action (e.g. Start Forging Free)"
  },
  "features": [
    { "title": "Instant AI Analysis", "description": "Describe feature 1 benefits simply and beautifully", "icon": "Zap" },
    { "title": "Real-time Dashboard", "description": "Describe feature 2 benefits", "icon": "Activity" },
    { "title": "One-click Exports", "description": "Describe feature 3 benefits", "icon": "Download" }
  ],
  "pricing": [
    { "tier": "Free / Hobby", "price": "$0 / month", "features": ["Feature A", "Feature B", "Basic dashboards"] },
    { "tier": "Pro / Growth", "price": "$49 / month", "features": ["Feature A", "Feature B", "Feature C", "Unlimited PDF Exports", "Shared workspaces"] }
  ],
  "testimonials": [
    { "name": "Sarah Jenkins", "role": "Head of Operations at Agritech Solutions", "quote": "This software completely transformed how we pitch and scope projects. We went from manual spreadsheets to a fully documented plan in under five minutes. Outstanding business value!", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
    { "name": "Marcus Chen", "role": "Co-founder, FarmFlow", "quote": "Saves hundreds of hours in legal research, financial modeling, and roadmap outlining. A complete startup kit in a box.", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" }
  ],
  "faq": [
    { "question": "What exactly do I own?", "answer": "You retain 100% intellectual property ownership of all business canvas layouts, PRDs, and materials generated on this platform." },
    { "question": "Are the financial numbers accurate?", "answer": "The financial model is a highly calibrated estimate calculated based on standard SaaS/industry averages for similar startups. You can customize them in your dashboard." },
    { "question": "Can I export my plan to VCs?", "answer": "Absolutely! The document generator creates VC-ready executive summaries, marketing plans, and technical architectures in high-quality format." }
  ],
  "contactText": "Have questions about forging your company? Reach out to our 24/7 strategic team at hello@startupforge.ai."
}

Do not include any extra text. Return ONLY the JSON.`;
        break;

      case "mock-interview":
        prompt = `Generate a set of 5 mock investor interview questions for this startup.
Idea context:
${ideaStr}
${identityStr}

Return JSON with format:
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ]
}`;
        break;

      default:
        return res.status(400).json({ error: "Invalid module requested" });
    }
  }

    const modelName = "gemini-3.6-flash";
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 1,
          responseMimeType: "application/json"
        }
      })
    );

    const text = response.text;
    if (!text) {
      throw new Error("No text generated by Gemini");
    }

    // Try parsing to verify it is valid JSON
    const parsed = JSON.parse(text);
    return res.json(parsed);

  } catch (error: any) {
    console.warn("[AI Generation Fallback Triggered]:", error.message || error);
    const fallbackData = getFallbackModuleData(req.body.module, req.body.idea, req.body.identity);
    return res.json(fallbackData);
  }
});

// Chat assistant endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, startup, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAI();

    // Build chat context with high fidelity
    let startupContext = "";
    if (startup) {
      startupContext = `We are talking about the startup "${startup.identity.name}".
Tagline: ${startup.identity.tagline}
Industry: ${startup.idea.industry}
Problem being solved: ${startup.idea.problem}
Target Audience: ${startup.idea.targetAudience}
UVP: ${startup.identity.uvp}
Elevator pitch: ${startup.identity.elevatorPitch}
Budget Constraint: ${startup.idea.budget}
Country Location: ${startup.idea.country}
`;

      // Dynamically append contextual info about already forged modules
      let modulesContext = "";
      if (startup.marketResearch) {
        const painPoints = startup.marketResearch.painPoints || [];
        modulesContext += `\n[Market Size]: TAM ${startup.marketResearch.tam || "N/A"}, SAM ${startup.marketResearch.sam || "N/A"}, SOM ${startup.marketResearch.som || "N/A"}.\n[Pain Points]: ${painPoints.slice(0, 4).join(", ")}.`;
      }
      if (startup.competitorAnalysis && startup.competitorAnalysis.competitors) {
        const compNames = startup.competitorAnalysis.competitors.map((c: any) => c.name).join(", ");
        modulesContext += `\n[Competitors]: ${compNames}.\n[Differentiation Vector]: ${startup.competitorAnalysis.opportunitiesToDifferentiate || "N/A"}.`;
      }
      if (startup.businessModel) {
        const streams = startup.businessModel.revenueStreams || [];
        const tiers = (startup.businessModel.pricingStrategy || []).map((p: any) => `${p.tier} ($${p.price})`).join(", ");
        modulesContext += `\n[Revenue Model]: ${streams.join(", ")}.\n[Pricing Strategy]: ${tiers || "N/A"}.`;
      }
      if (startup.financialPlanner) {
        modulesContext += `\n[Break-even Plan]: Estimated ${startup.financialPlanner.breakEvenMonths || "N/A"} months to reach breakeven.\n[Year 1 Profit Projection]: $${(startup.financialPlanner.profitProjectionYear1 || 0).toLocaleString()}.`;
      }
      if (startup.mvpPlanner && startup.mvpPlanner.features) {
        const features = startup.mvpPlanner.features.slice(0, 4).map((f: any) => f.name).join(", ");
        modulesContext += `\n[MVP Backlog]: ${features || "N/A"}.\n[Dev Timeline]: ${startup.mvpPlanner.timelineWeeks || "N/A"} weeks.`;
      }
      if (startup.technicalArchitecture && startup.technicalArchitecture.techStack) {
        const techs = startup.technicalArchitecture.techStack.map((t: any) => `${t.layer}: ${t.tech}`).join("; ");
        modulesContext += `\n[Architecture]: ${techs}.\n[Infrastructure]: ${startup.technicalArchitecture.deploymentPlan || "N/A"}.`;
      }
      if (startup.prd && startup.prd.kpis) {
        modulesContext += `\n[PRD Metrics]: ${startup.prd.kpis.slice(0, 3).join(", ")}.`;
      }
      if (startup.marketingPlanner && startup.marketingPlanner.seoKeywords) {
        modulesContext += `\n[GTM Channels & SEO]: ${startup.marketingPlanner.seoKeywords.slice(0, 5).join(", ")}.`;
      }
      if (startup.investorSection) {
        const funds = (startup.investorSection.useOfFunds || []).map((u: any) => `${u.item} (${u.percentage}%)`).join(", ");
        modulesContext += `\n[Funding Goal]: Ask of $${(startup.investorSection.investmentAsk || 0).toLocaleString()}.\n[Use of Funds]: ${funds || "N/A"}.`;
      }

      if (modulesContext) {
        startupContext += `\nESTABLISHED STARTUP BLUEPRINTS (Reference this actual data directly when the user asks related questions):${modulesContext}\n`;
      }
    }

    const systemInstruction = `You are the StartupForge AI Strategist, an elite, highly critical business consultant, Y-Combinator partner, and product mentor.
Use the provided context about the user's startup and already generated business modules to formulate incredibly tailored, razor-sharp, practical advice.

CRITICAL INSTRUCTIONS:
1. NEVER hallucinate parameters that contradict the user's established blueprint modules listed above. If they have a tech stack of React/Node, don't recommend PHP. If they have a pricing plan, refer to it.
2. Give extremely specific, numerical, real-world tactics. Don't speak in fluffy generalities (avoid "focus on customer success" — say "create a Discord community and offer 1-on-1 onboarding sessions").
3. Use realistic metrics and GTM hacks fitting their actual budget constraints.
4. Structure your advice beautifully with clear headers, bullet points, bold accents, and inline code terms. Keep blocks scannable.`;

    const modelName = "gemini-3.6-flash";

    // Format chat history correctly for the Google GenAI SDK (role must be "user" or "model")
    const chatHistory: any[] = [];
    if (history && history.length > 0) {
      for (const msg of history) {
        // Skip connection errors or system-like notices if they sneaked into history
        if (msg.text && !msg.text.includes("Connection Error")) {
          chatHistory.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        }
      }
    }

    // Standard chat sendMessage takes history
    const chat = ai.chats.create({
      model: modelName,
      history: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.8
      }
    });

    const response = await callGeminiWithRetry(() => chat.sendMessage({ message }));
    return res.json({ text: response.text });

  } catch (error: any) {
    console.warn("[Chat API Fallback Triggered]:", error.message || error);
    const sName = req.body.startup?.identity?.name || "your startup concept";
    return res.json({
      text: `Strategic Analysis for **${sName}**:\n\n1. **Core Value Proposition**: Maintain strict focus on your UVP to stand out against incumbents.\n2. **Go-to-Market Execution**: Leverage SEO, community-building, and direct outreach to optimize user acquisition within your budget.\n3. **Metrics & Roadmap**: Focus on tracking active retention and user feedback before expanding paid channels.`
    });
  }
});

// Customer concern and support assistant endpoint
app.post("/api/support-chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAI();

    const systemInstruction = `You are the StartupForge Support AI Assistant, a compassionate, helpful, and extremely competent platform guide.
Your mission is to resolve every single customer concern, problem, or question about using StartupForge.

Key Platform Information:
1. Creating a concept: Click the "Forge New Concept" button on the home screen, and follow the 3-step wizard.
2. What is generated: A complete startup package comprising Business Identity (name, tagline, logo theme, UVP, elevator pitch), Competitor Analysis, Year-1 Financial models, SQL DB Schema layouts, Legal/ToS outlines, and custom interactive Landing Page copy.
3. Exporting data: Click "Export Documents" in the upper right corner of the dashboard workspace to download or copy beautiful Markdown files.
4. IP & Sandbox Rights: Users retain 100% complete intellectual property ownership of all AI-generated business assets.
5. Saving/Durable state: Workspaces are persisted locally in your browser (using "sf_startups" key). Signing in updates user info and subscription tier safely.
6. Administrative Sandbox: A dedicated dashboard at the bottom of the home screen allows you to check token usage, toggle Premium features, seed database models, and clear/reset local storage if any errors occur.

Support Guidelines:
- Address concerns, feedback, or potential bugs with high empathy and immediate clarity.
- Give exact step-by-step guidance on how to navigate the UI, retry generation, or reset state using the Administrative Sandbox if they run into a bug.
- Keep answers polite, warm, concise, and professional. Use clean Markdown (bullet points, bold text) for optimal readability.`;

    const modelName = "gemini-3.6-flash";

    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const response = await callGeminiWithRetry(() => chat.sendMessage({ message }));
    return res.json({ text: response.text });

  } catch (error: any) {
    console.warn("[Support Chat Fallback Triggered]:", error.message || error);
    return res.json({
      text: `Hello! I am the StartupForge Support AI Assistant. You can forge new concepts with the 3-step wizard, explore generated modules (Market Research, Financial Models, SQL Schemas, Legal, Landing Page), and export documents using the **Export Documents** button. If you ever run into any issues, you can also use the **Administrative Sandbox** at the bottom of the home screen to manage state or clear local cache!`
    });
  }
});

// Specialized Executive AI Insights Summary Agent endpoint
app.post("/api/ai-insights-summary", async (req, res) => {
  try {
    const { startup } = req.body;
    if (!startup) {
      return res.status(400).json({ error: "Startup context is required" });
    }

    const ai = getAI();
    const name = startup.identity?.name || "The Startup";
    const tagline = startup.identity?.tagline || "";
    const industry = startup.idea?.industry || "Technology";
    const problem = startup.idea?.problem || "operational friction";
    const targetAudience = startup.idea?.targetAudience || "growth teams";
    const budget = startup.idea?.budget || "$10,000";
    const country = startup.idea?.country || "United States";
    const chatHistory = startup.chatHistory || [];

    // Format chat transcript
    let chatTranscript = "No prior chat messages recorded.";
    if (chatHistory.length > 0) {
      chatTranscript = chatHistory
        .map((m: any, i: number) => `[Message ${i + 1}] (${m.sender.toUpperCase()} - ${m.timestamp || "Time"}): ${m.text}`)
        .join("\n\n");
    }

    // Build modules context
    const forgedModules: string[] = [];
    if (startup.marketResearch) forgedModules.push("Market Research & TAM/SAM/SOM");
    if (startup.competitorAnalysis) forgedModules.push("Competitor Flanking & Positioning");
    if (startup.businessModel) forgedModules.push("Business Model Canvas & Pricing Architecture");
    if (startup.financialPlanner) forgedModules.push("12-Month Financial Projections & Budget");
    if (startup.mvpPlanner) forgedModules.push("MVP Backlog & Sprint Scope");
    if (startup.technicalArchitecture) forgedModules.push("Technical Architecture & Database Design");
    if (startup.prd) forgedModules.push("Product Requirements (PRD)");
    if (startup.marketingPlanner) forgedModules.push("Go-To-Market Strategy & SEO Keywords");
    if (startup.investorSection) forgedModules.push("Investor Deck & Capital Ask");
    if (startup.legalChecklist) forgedModules.push("Legal & Trademark Checklist");

    const prompt = `You are a Senior Venture Partner & Chief Strategy Officer specializing in synthesizing startup trajectory, project evolution, and strategic decisions.

Analyze the entire history, conversational brainstorming, and established strategic modules for this startup:
STARTUP PROFILE:
- Name: ${name}
- Tagline: ${tagline}
- Industry: ${industry}
- Core Problem Addressed: ${problem}
- Target Audience: ${targetAudience}
- Budget Constraint: ${budget}
- Target Geography: ${country}
- Established Modules: ${forgedModules.join(", ") || "Initial Concept Ingestion"}

FULL ADVISOR CHAT HISTORY & STRATEGIC DISCUSSIONS:
${chatTranscript}

YOUR OBJECTIVE:
Conduct a rigorous, executive-level retrospective analysis. Trace how the project has evolved from an initial concept into a structured business, identifying key decisions, pivotal choices discussed in the chat or reflected in modules, and current strategic posture.

You MUST return a JSON object with this exact schema:
{
  "executiveOverview": "A concise, authoritative 2-3 sentence executive synopsis evaluating ${name}'s current viability, core UVP, and defensibility.",
  "evolutionSummary": "A chronological, multi-paragraph synthesis detailing how the concept transitioned from initial problem definition into scoped MVP, competitive flanking, and monetization strategy based on founder discussions.",
  "keyDecisions": [
    {
      "decision": "Title of strategic choice (e.g. 'Targeted Competitor Flank against Legacy Incumbents' or 'Tiered B2B SaaS Monetization Model')",
      "context": "What situation or chat discussion prompted this direction",
      "impact": "How it de-risks execution or accelerates growth",
      "category": "GTM / Product Scope / Commercials / Tech Architecture / Fundraising",
      "timestamp": "Stage / Phase"
    }
  ],
  "strategicTrajectory": [
    {
      "stage": "Phase 1: MVP Core Build",
      "focus": "Immediate deliverable and primary milestone",
      "horizon": "Weeks 1-6"
    },
    {
      "stage": "Phase 2: Closed Alpha / Beta Pilot",
      "focus": "Validation metric and customer onboarding",
      "horizon": "Weeks 7-12"
    },
    {
      "stage": "Phase 3: Commercial GTM & Scale",
      "focus": "Revenue expansion and acquisition loop",
      "horizon": "Month 4-12"
    }
  ],
  "criticalTakeaways": [
    "Top high-priority bullet point 1",
    "Top high-priority bullet point 2",
    "Top high-priority bullet point 3",
    "Top high-priority bullet point 4"
  ],
  "actionableRecommendations": [
    "Immediate high-leverage next step 1",
    "Immediate high-leverage next step 2",
    "Immediate high-leverage next step 3"
  ]
}

Ensure at least 3-5 key decisions are extracted and explained. Return ONLY valid JSON.`;

    const systemInstruction = `You are the StartupForge Executive AI Strategy Agent. Always produce rigorous, analytical, non-fluffy executive intelligence in valid JSON format.`;

    const modelName = "gemini-3.6-flash";
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      })
    );

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI insights agent");
    }

    const parsed = JSON.parse(text);
    return res.json({
      ...parsed,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.warn("[AI Insights Summary Fallback Triggered]:", error.message || error);
    const sName = req.body.startup?.identity?.name || "The Venture";
    const ind = req.body.startup?.idea?.industry || "Technology";
    const prob = req.body.startup?.idea?.problem || "manual workflow inefficiencies";
    const aud = req.body.startup?.idea?.targetAudience || "growth teams";
    const bud = req.body.startup?.idea?.budget || "$10,000";

    const fallbackSummary = {
      executiveOverview: `${sName} has established a defensible, high-leverage positioning within the ${ind} space. By solving ${prob} for ${aud}, the venture balances a capital-efficient launch budget (${bud}) with scalable SaaS unit economics.`,
      evolutionSummary: `The project originated from an acute observation of ${prob} impacting ${aud}. Through iterative strategic consultation, ${sName} evolved from a raw concept into a structured product blueprint. Early exploratory sessions established the core value proposition, followed by quantitative TAM/SAM/SOM sizing and competitor flanking audits. \n\nThe strategy then progressed into modular operational planning—defining an MVP backlog that avoids scope creep while prioritizing high-conversion features. Financial modeling projects a rapid 5-month pathway to operational cash-flow positivity, supported by low-overhead cloud infrastructure.`,
      keyDecisions: [
        {
          decision: "Aggressive Focus on Core Automated Workflows",
          context: `Target audience (${aud}) suffers from bloated incumbent tools with steep learning curves.`,
          impact: "Reduces onboarding time to under 3 minutes and lowers initial customer acquisition costs (CAC).",
          category: "Product Scope",
          timestamp: "Concept Ingestion"
        },
        {
          decision: "Tiered SaaS Pricing with Self-Serve Starter Tier",
          context: "Balancing rapid early adoption with enterprise expansion revenue.",
          impact: "Enables viral bottom-up developer/team adoption while capturing high LTV on Pro tiers.",
          category: "Commercials",
          timestamp: "Business Modeling"
        },
        {
          decision: "Lean Cloud-Native Architecture with Modular APIs",
          context: `Keeping launch overhead well within the initial ${bud} capital constraint.`,
          impact: "Minimizes fixed burn rate and maintains 85%+ gross profit margins on software subscriptions.",
          category: "Tech Architecture",
          timestamp: "Technical Scoping"
        },
        {
          decision: "Organic Content & Community-Led GTM Strategy",
          context: "Avoiding expensive paid ad auctions in early market entry.",
          impact: "Builds compounding organic SEO search authority and sticky community user referral loops.",
          category: "GTM",
          timestamp: "GTM Playbook"
        }
      ],
      strategicTrajectory: [
        {
          stage: "Phase 1: MVP Core Build & Polish",
          focus: `Deploy streamlined solution solving ${prob} with responsive web UI.`,
          horizon: "Weeks 1-4"
        },
        {
          stage: "Phase 2: Closed Beta & Initial Feedback Loops",
          focus: "Onboard 50 high-affinity beta users from target demographic to calibrate retention.",
          horizon: "Weeks 5-8"
        },
        {
          stage: "Phase 3: Public GTM Launch & Subscription Activation",
          focus: "Launch on Product Hunt/social channels and begin recurring revenue compounding.",
          horizon: "Weeks 9-16"
        }
      ],
      criticalTakeaways: [
        `High value-to-cost ratio: Addressing ${prob} delivers immediate measurable ROI to ${aud}.`,
        "Defensible agility: Fast iteration speed and low tech debt provide a strong flank against legacy incumbents.",
        "Healthy financial runway: Projected breakeven in 5 months allows self-sustaining growth with minimal external dilution.",
        "Clear expansion vectors: Opportunity to introduce enterprise team collaboration and automated API integrations."
      ],
      actionableRecommendations: [
        "Finalize the 1-page executive brief and share with target advisors or early angel investors.",
        "Launch a pre-release waitlist microsite to capture early user intent ahead of public launch.",
        "Set up sprint milestones to track weekly engineering delivery against target launch dates."
      ],
      generatedAt: new Date().toISOString()
    };

    return res.json(fallbackSummary);
  }
});

// Setup Vite or Static File Serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StartupForge AI running on http://localhost:${PORT}`);
  });
}

setupServer();
