export interface StartupIdea {
  industry: string;
  problem: string;
  targetAudience: string;
  budget: string;
  country: string;
}

export interface StartupIdentity {
  name: string;
  tagline: string;
  mission: string;
  vision: string;
  elevatorPitch: string;
  uvp: string; // Unique Value Proposition
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  logoPrompt: string;
  brandVoice: string;
  domainIdeas: string[];
  socialHandles: {
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

export interface CustomerPersona {
  name: string;
  role: string;
  demographics: string;
  painPoints: string[];
  goals: string[];
  quote: string;
}

export interface MarketResearch {
  tam: string;
  sam: string;
  som: string;
  industrySize: string;
  growthTrends: string;
  customerPersonas: CustomerPersona[];
  painPoints: string[];
  opportunities: string[];
  risks: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pestle: {
    political: string;
    economic: string;
    social: string;
    technological: string;
    legal: string;
    environmental: string;
  };
}

export interface Competitor {
  name: string;
  pricing: string;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  positioning: string;
  differentiation: string;
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketOverview: string;
  opportunitiesToDifferentiate: string;
}

export interface BusinessModelCanvas {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface PricingPlan {
  tier: string;
  price: string;
  features: string[];
}

export interface BusinessModel {
  canvas: BusinessModelCanvas;
  revenueStreams: string[];
  pricingStrategy: PricingPlan[];
  costStructureDesc: string;
}

export interface BudgetItem {
  item: string;
  cost: number;
  category: "Setup" | "Operational" | "Marketing" | "Legal" | "Other";
}

export interface MonthlyExpense {
  item: string;
  cost: number;
  category: "Salary" | "Hosting/Software" | "Marketing" | "Rent/Office" | "Other";
}

export interface FinancialProjection {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FinancialPlanner {
  budget: BudgetItem[];
  monthlyExpenses: MonthlyExpense[];
  projections: FinancialProjection[];
  breakEvenMonths: number;
  breakEvenRevenue: number;
  profitProjectionYear1: number;
  cashFlowEstimate: string;
}

export interface MVPFeature {
  name: string;
  description: string;
  complexity: "Low" | "Medium" | "High";
  priority: "Must-Have" | "Should-Have" | "Nice-to-Have";
}

export interface UserStory {
  role: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
}

export interface SprintTask {
  title: string;
  duration: string;
  assignee: string;
}

export interface Sprint {
  name: string;
  goal: string;
  tasks: SprintTask[];
}

export interface MVPPlanner {
  features: MVPFeature[];
  userStories: UserStory[];
  roadmap: {
    phase1: string;
    phase2: string;
    phase3: string;
    phase4: string;
  };
  sprints: Sprint[];
  timelineWeeks: number;
}

export interface TechStackItem {
  layer: string;
  tech: string;
  reason: string;
}

export interface DatabaseTable {
  name: string;
  columns: { name: string; type: string; notes?: string }[];
}

export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  payload?: string;
  response?: string;
}

export interface TechnicalArchitecture {
  techStack: TechStackItem[];
  backendDetails: string;
  frontendDetails: string;
  databaseDesign: DatabaseTable[];
  apiList: APIEndpoint[];
  authFlow: string;
  deploymentPlan: string;
  cloudRecommendation: string;
}

export interface PRD {
  problemStatement: string;
  goals: string[];
  functionalRequirements: { id: string; req: string; priority: string }[];
  nonFunctionalRequirements: { id: string; req: string; type: string }[];
  userStories: string[];
  acceptanceCriteria: string;
  kpis: string[];
  risks: string[];
}

export interface MarketingPlanner {
  gtmStrategy: string;
  socialMediaPlan: {
    twitter: string[];
    linkedin: string[];
    instagram: string[];
  };
  launchChecklist: {
    preLaunch: string[];
    launchDay: string[];
    postLaunch: string[];
  };
  seoKeywords: string[];
  contentIdeas: string[];
  emailCampaign: {
    subject: string;
    body: string;
  }[];
  adIdeas: {
    platform: string;
    headline: string;
    copy: string;
  }[];
}

export interface InvestorSection {
  pitchDeckOutline: { slide: number; title: string; bullets: string[] }[];
  investmentAsk: number;
  useOfFunds: { item: string; percentage: number }[];
  financialHighlights: string;
  exitStrategy: string;
  executiveSummary: string;
}

export interface LegalChecklist {
  companyRegistration: string[];
  privacyPolicyOutline: string[];
  termsOfServiceOutline: string[];
  ipConsiderations: string[];
  trademarkChecklist: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LandingPage {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  features: { title: string; description: string; icon: string }[];
  pricing: PricingPlan[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  contactText: string;
}

export interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string; // YYYY-MM-DD or formatted date
  completedDate?: string;
  category: "Product" | "GTM & Marketing" | "Fundraising" | "Legal & Ops" | "Hiring";
  status: "Upcoming" | "In-Progress" | "Completed" | "Delayed";
  priority: "Critical" | "High" | "Medium" | "Low";
  assignee?: string;
  deliverables?: string[];
}

export interface AIInsightsSummary {
  executiveOverview: string;
  evolutionSummary: string;
  keyDecisions: {
    decision: string;
    context: string;
    impact: string;
    category?: string;
    timestamp?: string;
  }[];
  strategicTrajectory: {
    stage: string;
    focus: string;
    horizon: string;
  }[];
  criticalTakeaways: string[];
  actionableRecommendations: string[];
  generatedAt: string;
}

export interface Startup {
  id: string;
  ownerId: string;
  idea: StartupIdea;
  identity: StartupIdentity;
  marketResearch?: MarketResearch;
  competitorAnalysis?: CompetitorAnalysis;
  businessModel?: BusinessModel;
  financialPlanner?: FinancialPlanner;
  mvpPlanner?: MVPPlanner;
  technicalArchitecture?: TechnicalArchitecture;
  prd?: PRD;
  marketingPlanner?: MarketingPlanner;
  investorSection?: InvestorSection;
  legalChecklist?: LegalChecklist;
  landingPage?: LandingPage;
  milestones?: Milestone[];
  aiInsightsSummary?: AIInsightsSummary;
  createdAt: string;
  progress: number;
  previousDayProgress?: number;
  status?: "Drafting" | "In-Review" | "Refinement" | "Finalized";
  isFavorite: boolean;
  cardColor?: string;
  chatHistory: ChatMessage[];
  quickNotes?: { id: string; text: string; createdAt: string }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: "free" | "pro" | "enterprise";
  aiUsageLimit: number;
  aiUsageCount: number;
  recentActivity: { action: string; time: string }[];
  savedStartupsCount: number;
}
