import { Startup } from "../types";

/**
 * Escapes a field for CSV format following RFC 4180
 */
function escapeCSVField(field: any): string {
  if (field === null || field === undefined) return '""';
  const stringValue = String(field);
  // If field contains comma, newline, or double-quote, wrap in quotes and double any internal quotes
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"') || stringValue.includes("\r")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Triggers browser download of a CSV string
 */
export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports the 12-Month Financial Projections, Launch Budget, and Monthly Expenses
 */
export function exportFinancialProjectionsCSV(startup: Startup) {
  const { identity, idea, financialPlanner } = startup;
  const startupName = identity?.name || "Startup";
  const dateStr = new Date().toISOString().split("T")[0];

  const rows: string[][] = [
    ["STARTUP FINANCIAL PROJECTIONS & BUDGET MODEL"],
    ["Company Name", startupName],
    ["Industry", idea?.industry || "Technology"],
    ["Target Market", idea?.country || "Global"],
    ["Initial Budget", idea?.budget || "N/A"],
    ["Generated Date", dateStr],
    ["Currency", "USD ($)"],
    [],
    ["============================================================"],
    ["1. 12-MONTH FINANCIAL PROJECTIONS SUMMARY"],
    ["============================================================"],
    ["Month", "Revenue ($)", "Expenses ($)", "Net Profit/Loss ($)", "Net Margin (%)", "Cumulative Cash Flow ($)"]
  ];

  let cumulativeCash = 0;
  if (financialPlanner?.projections && financialPlanner.projections.length > 0) {
    financialPlanner.projections.forEach((p) => {
      cumulativeCash += p.profit;
      const margin = p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(1) + "%" : "0.0%";
      rows.push([
        p.month,
        p.revenue.toString(),
        p.expenses.toString(),
        p.profit.toString(),
        margin,
        cumulativeCash.toString()
      ]);
    });
  } else {
    rows.push(["Month 1", "0", "2500", "-2500", "0.0%", "-2500"]);
    rows.push(["Month 2", "1200", "2600", "-1400", "-116.7%", "-3900"]);
    rows.push(["Month 3", "3000", "2750", "250", "8.3%", "-3650"]);
  }

  rows.push([]);
  rows.push(["============================================================"]);
  rows.push(["2. KEY FINANCIAL PERFORMANCE METRICS"]);
  rows.push(["============================================================"]);
  rows.push(["Metric", "Value", "Notes"]);
  rows.push([
    "Break-Even Month",
    financialPlanner ? `Month ${financialPlanner.breakEvenMonths}` : "Month 5",
    "Estimated point of operational profitability"
  ]);
  rows.push([
    "Required Break-Even Monthly Revenue",
    financialPlanner ? `$${financialPlanner.breakEvenRevenue.toLocaleString()}` : "$3,000",
    "Target monthly recurring revenue to cover operating expenses"
  ]);
  rows.push([
    "Projected Year 1 Total Profit",
    financialPlanner ? `$${financialPlanner.profitProjectionYear1.toLocaleString()}` : "$35,000",
    "Cumulative 12-month net bottom-line profit"
  ]);
  rows.push([
    "Cash Flow Trajectory Assessment",
    financialPlanner?.cashFlowEstimate || "Positive unit economics with scalable recurring margins.",
    "Executive commentary"
  ]);

  rows.push([]);
  rows.push(["============================================================"]);
  rows.push(["3. STARTUP LAUNCH BUDGET ALLOCATION"]);
  rows.push(["============================================================"]);
  rows.push(["Item Description", "Category", "Allocated Cost ($)", "% of Total Budget"]);

  const budgetItems = financialPlanner?.budget || [
    { item: "Incorporation & Legal Setup", cost: 1500, category: "Legal" },
    { item: "Domain, Branding & Web Hosting", cost: 1000, category: "Setup" },
    { item: "MVP Development & Infrastructure", cost: 4500, category: "Operational" },
    { item: "Launch Marketing & Acquisition", cost: 2000, category: "Marketing" },
    { item: "Emergency Contingency Buffer", cost: 1000, category: "Other" }
  ];

  const totalBudget = budgetItems.reduce((acc, b) => acc + (b.cost || 0), 0);
  budgetItems.forEach((item) => {
    const pct = totalBudget > 0 ? ((item.cost / totalBudget) * 100).toFixed(1) + "%" : "0.0%";
    rows.push([item.item, item.category, item.cost.toString(), pct]);
  });
  rows.push(["TOTAL LAUNCH BUDGET", "All Categories", totalBudget.toString(), "100.0%"]);

  rows.push([]);
  rows.push(["============================================================"]);
  rows.push(["4. MONTHLY RECURRING OPERATIONAL EXPENSES"]);
  rows.push(["============================================================"]);
  rows.push(["Expense Item", "Category", "Monthly Cost ($)", "% of Monthly Burn"]);

  const monthlyExpenses = financialPlanner?.monthlyExpenses || [
    { item: "Cloud Servers, DB & AI API Compute", cost: 800, category: "Hosting/Software" },
    { item: "SaaS Tools & Productivity Software", cost: 350, category: "Hosting/Software" },
    { item: "Growth Marketing & Paid Search", cost: 950, category: "Marketing" },
    { item: "Contract Support & Engineering", cost: 500, category: "Salary" }
  ];

  const totalMonthly = monthlyExpenses.reduce((acc, m) => acc + (m.cost || 0), 0);
  monthlyExpenses.forEach((exp) => {
    const pct = totalMonthly > 0 ? ((exp.cost / totalMonthly) * 100).toFixed(1) + "%" : "0.0%";
    rows.push([exp.item, exp.category, exp.cost.toString(), pct]);
  });
  rows.push(["TOTAL MONTHLY OPERATIONAL RUN RATE", "All Categories", totalMonthly.toString(), "100.0%"]);

  const csvString = rows.map((r) => r.map(escapeCSVField).join(",")).join("\r\n");
  const filename = `${startupName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_financial_projections_${dateStr}.csv`;
  downloadCSV(filename, csvString);
}

/**
 * Exports the SWOT Quadrant Matrix, TAM/SAM/SOM sizing, and PESTLE dimensions into CSV
 */
export function exportSWOTAnalysisCSV(startup: Startup) {
  const { identity, idea, marketResearch } = startup;
  const startupName = identity?.name || "Startup";
  const dateStr = new Date().toISOString().split("T")[0];

  const rows: string[][] = [
    ["STARTUP SWOT ANALYSIS & MARKET STRATEGY SPREADSHEET"],
    ["Company Name", startupName],
    ["Industry Sector", idea?.industry || "Technology"],
    ["Target Problem", idea?.problem || "Workflow Inefficiencies"],
    ["Target Demographic", idea?.targetAudience || "Growth Teams"],
    ["Generated Date", dateStr],
    [],
    ["============================================================"],
    ["1. SWOT QUADRANT MATRIX"],
    ["============================================================"],
    ["Quadrant", "Dimension Type", "Item #", "Strategic Factor / Description", "Impact Level", "Recommended Strategic Action"]
  ];

  const swot = marketResearch?.swot || {
    strengths: ["Agile execution & custom tailored UX", "Low legacy tech debt", "Proprietary AI automation engine"],
    weaknesses: ["Early brand recognition", "Limited initial seed marketing budget", "Small initial team bandwidth"],
    opportunities: ["Untapped regional B2B vertical expansion", "High-margin SaaS subscription model", "Viral referral loop integration"],
    threats: ["Incumbent feature copying", "Macroeconomic tightening", "Search ad price hikes"]
  };

  swot.strengths.forEach((s, idx) => {
    rows.push([
      "Strengths",
      "Internal (Favorable)",
      `S-${idx + 1}`,
      s,
      "High Positive",
      "Leverage in marketing hooks, sales pitches, and onboarding"
    ]);
  });

  swot.weaknesses.forEach((w, idx) => {
    rows.push([
      "Weaknesses",
      "Internal (Unfavorable)",
      `W-${idx + 1}`,
      w,
      "Medium Risk",
      "Mitigate via lean outsourced talent and clear documentation"
    ]);
  });

  swot.opportunities.forEach((o, idx) => {
    rows.push([
      "Opportunities",
      "External (Favorable)",
      `O-${idx + 1}`,
      o,
      "High Growth Potential",
      "Prioritize in roadmap sprints and outbound partnership campaigns"
    ]);
  });

  swot.threats.forEach((t, idx) => {
    rows.push([
      "Threats",
      "External (Unfavorable)",
      `T-${idx + 1}`,
      t,
      "Monitoring Required",
      "Build defensible workflow moats and diversify acquisition channels"
    ]);
  });

  rows.push([]);
  rows.push(["============================================================"]);
  rows.push(["2. MARKET SIZING (TAM • SAM • SOM) & INDUSTRY MACRO CONTEXT"]);
  rows.push(["============================================================"]);
  rows.push(["Metric", "Estimated Market Value", "Definition & Method"]);
  rows.push([
    "TAM (Total Addressable Market)",
    marketResearch?.tam || "$12.5 Billion Global Market",
    "Total worldwide demand for solutions in this sector"
  ]);
  rows.push([
    "SAM (Serviceable Addressable Market)",
    marketResearch?.sam || "$2.8 Billion Target Segment",
    "Portion of TAM targeted by our product category and geography"
  ]);
  rows.push([
    "SOM (Serviceable Obtainable Market)",
    marketResearch?.som || "$150 Million Initial 3-Yr Target",
    "Realistic market share achievable within 36 months"
  ]);
  rows.push([
    "Industry CAGR & Growth Trends",
    marketResearch?.growthTrends || "Accelerating digital transformation and AI workflow adoption.",
    marketResearch?.industrySize || "Rapid sector expansion."
  ]);

  if (marketResearch?.pestle) {
    rows.push([]);
    rows.push(["============================================================"]);
    rows.push(["3. PESTLE MACRO-ENVIRONMENTAL AUDIT"]);
    rows.push(["============================================================"]);
    rows.push(["Pillar", "Strategic Factor Analysis"]);
    rows.push(["Political", marketResearch.pestle.political || "Favorable government policies supporting tech modernization."]);
    rows.push(["Economic", marketResearch.pestle.economic || "Focus on capital efficiency and high ROI software tools."]);
    rows.push(["Social", marketResearch.pestle.social || "Growing adoption of cloud workflows and self-serve business tools."]);
    rows.push(["Technological", marketResearch.pestle.technological || "Rapid advances in LLM APIs and real-time computing."]);
    rows.push(["Legal & Compliance", marketResearch.pestle.legal || "Data privacy mandates (GDPR, CCPA) requiring strict compliance."]);
    rows.push(["Environmental", marketResearch.pestle.environmental || "Cloud-native infrastructure with low physical footprint."]);
  }

  const csvString = rows.map((r) => r.map(escapeCSVField).join(",")).join("\r\n");
  const filename = `${startupName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_swot_analysis_${dateStr}.csv`;
  downloadCSV(filename, csvString);
}

/**
 * Combined Comprehensive CSV Export covering Financials, SWOT, Competitors, and Milestones
 */
export function exportCombinedStartupCSV(startup: Startup) {
  const { identity, idea, marketResearch, financialPlanner, milestones, competitorAnalysis, businessModel } = startup;
  const startupName = identity?.name || "Startup";
  const dateStr = new Date().toISOString().split("T")[0];

  const rows: string[][] = [
    ["STARTUP MASTER SPREADSHEET & BUSINESS BLUEPRINT"],
    ["Company Name", startupName],
    ["Tagline", identity?.tagline || ""],
    ["Mission", identity?.mission || ""],
    ["Unique Value Proposition", identity?.uvp || ""],
    ["Industry Sector", idea?.industry || ""],
    ["Target Problem", idea?.problem || ""],
    ["Target Audience", idea?.targetAudience || ""],
    ["Launch Budget", idea?.budget || ""],
    ["Export Timestamp", new Date().toLocaleString()],
    [],
    ["============================================================"],
    ["1. FINANCIAL PROJECTIONS (12 MONTHS)"],
    ["============================================================"],
    ["Month", "Revenue ($)", "Expenses ($)", "Profit ($)", "Cumulative ($)"]
  ];

  let cum = 0;
  (financialPlanner?.projections || []).forEach((p) => {
    cum += p.profit;
    rows.push([p.month, p.revenue.toString(), p.expenses.toString(), p.profit.toString(), cum.toString()]);
  });

  rows.push([]);
  rows.push(["============================================================"]);
  rows.push(["2. SWOT ANALYSIS MATRIX"],
    ["============================================================"],
    ["Quadrant", "Item Description"]
  );

  const swot = marketResearch?.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  swot.strengths.forEach((s) => rows.push(["Strength", s]));
  swot.weaknesses.forEach((w) => rows.push(["Weakness", w]));
  swot.opportunities.forEach((o) => rows.push(["Opportunity", o]));
  swot.threats.forEach((t) => rows.push(["Threat", t]));

  if (milestones && milestones.length > 0) {
    rows.push([]);
    rows.push(["============================================================"]);
    rows.push(["3. PROJECT DELIVERY TIMELINE & MILESTONES"]);
    rows.push(["============================================================"]);
    rows.push(["Milestone Title", "Category", "Target Delivery Date", "Priority", "Status", "Description"]);
    milestones.forEach((m) => {
      rows.push([m.title, m.category, m.targetDate, m.priority, m.status, m.description]);
    });
  }

  if (competitorAnalysis?.competitors && competitorAnalysis.competitors.length > 0) {
    rows.push([]);
    rows.push(["============================================================"]);
    rows.push(["4. COMPETITOR AUDIT"]);
    rows.push(["============================================================"]);
    rows.push(["Competitor Name", "Pricing", "Features", "Strengths", "Weaknesses", "Our Differentiation"]);
    competitorAnalysis.competitors.forEach((c) => {
      rows.push([
        c.name,
        c.pricing,
        c.features.join("; "),
        c.strengths.join("; "),
        c.weaknesses.join("; "),
        c.differentiation
      ]);
    });
  }

  const csvString = rows.map((r) => r.map(escapeCSVField).join(",")).join("\r\n");
  const filename = `${startupName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_master_workbook_${dateStr}.csv`;
  downloadCSV(filename, csvString);
}
