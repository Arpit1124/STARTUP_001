import React, { useState } from "react";
import { Download, Copy, Check, FileText, Code, BarChart, Presentation, Send, AlertCircle, FileSpreadsheet, Table } from "lucide-react";
import { Startup } from "../types";
import { exportFinancialProjectionsCSV, exportSWOTAnalysisCSV, exportCombinedStartupCSV } from "../utils/csvExport";

interface ExportDocsProps {
  startup: Startup;
}

export default function ExportDocs({ startup }: ExportDocsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (docId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(docId);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDownload = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName.toLowerCase().replace(/\s+/g, "_")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compile individual documents dynamically from the startup modules
  const compileBusinessPlan = () => {
    const { identity, idea, marketResearch, businessModel, financialPlanner } = startup;
    return `# BUSINESS PLAN: ${identity.name.toUpperCase()}
*Generated via StartupForge AI on ${new Date().toLocaleDateString()}*

## 1. Executive Summary
**Tagline:** ${identity.tagline}
**Mission:** ${identity.mission}
**Vision:** ${identity.vision}
**Elevator Pitch:**
${identity.elevatorPitch}

**Unique Value Proposition (UVP):**
${identity.uvp}

## 2. Market Sizing & Context
* **Industry:** ${idea.industry}
* **Target Audience:** ${idea.targetAudience}
* **Country Target:** ${idea.country}
* **Launch Budget:** ${idea.budget}

${marketResearch ? `
### TAM, SAM, SOM Estimates
* **TAM (Total Addressable Market):** ${marketResearch.tam}
* **SAM (Serviceable Addressable Market):** ${marketResearch.sam}
* **SOM (Serviceable Obtainable Market):** ${marketResearch.som}

### SWOT Quadrant Matrix
* **Strengths:**
${marketResearch.swot.strengths.map((s) => `  * ${s}`).join("\n")}
* **Weaknesses:**
${marketResearch.swot.weaknesses.map((w) => `  * ${w}`).join("\n")}
* **Opportunities:**
${marketResearch.swot.opportunities.map((o) => `  * ${o}`).join("\n")}
* **Threats:**
${marketResearch.swot.threats.map((t) => `  * ${t}`).join("\n")}
` : "*(Deep Market Research details not yet generated in workspace)*"}

## 3. Revenue Strategy & Pricing Models
${businessModel ? `
### Business Canvas Structure
* **Key Partners:** ${businessModel.canvas.keyPartners.join(", ")}
* **Key Activities:** ${businessModel.canvas.keyActivities.join(", ")}
* **Key Resources:** ${businessModel.canvas.keyResources.join(", ")}
* **Channels:** ${businessModel.canvas.channels.join(", ")}

### Active Pricing Plans
${businessModel.pricingStrategy.map((tier) => `* **${tier.tier}:** ${tier.price}\n  * Features: ${tier.features.join(", ")}`).join("\n")}
` : "*(Pricing & Business canvas not yet generated)*"}

## 4. Financial Outlook (12-Month)
${financialPlanner ? `
* **Estimated Year-1 Total Profits:** $${financialPlanner.profitProjectionYear1.toLocaleString()}
* **Monthly Break-Even Metric:** $${financialPlanner.breakEvenRevenue.toLocaleString()} in Month ${financialPlanner.breakEvenMonths}
* **Summary Analysis:** ${financialPlanner.cashFlowEstimate}
` : "*(Financial model not yet generated)*"}

---
*End of Document. Powered by StartupForge AI.*
`;
  };

  const compilePRD = () => {
    const { identity, prd, mvpPlanner } = startup;
    return `# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Product: ${identity.name} MVP Concept
*Author: Core Product Team / AI Architect*

## 1. Problem Statement & Scope
${prd?.problemStatement || "This PRD defines the operational requirements, MVP priorities, user stories, and acceptance criteria for launching."}

## 2. Core Functional Requirements
${prd ? prd.functionalRequirements.map((r) => `* **${r.id}:** ${r.req} (Priority: ${r.priority})`).join("\n") : "*(Module details not yet generated)*"}

## 3. MVP Scoped Features
${mvpPlanner ? mvpPlanner.features.map((f) => `* **${f.name}:** ${f.description}\n  * Complexity: ${f.complexity} | Priority: ${f.priority}`).join("\n") : "*(MVP Planner features not yet generated)*"}

## 4. User Stories & Acceptance Tests
${prd ? prd.userStories.map((story) => `* ${story}`).join("\n") : "*(User stories not yet generated)*"}

### Detailed Acceptance Criteria
${prd?.acceptanceCriteria || "*(Acceptance criteria not yet generated)*"}

## 5. Key Performance Indicators (KPIs)
${prd ? prd.kpis.map((kpi) => `* ${kpi}`).join("\n") : "*(KPIs not yet generated)*"}
`;
  };

  const compileTechDocs = () => {
    const { identity, technicalArchitecture } = startup;
    if (!technicalArchitecture) {
      return `# TECHNICAL DESIGN DOCUMENT: ${identity.name.toUpperCase()}
*(Technical architecture not yet generated in workspace)*`;
    }

    return `# TECHNICAL DESIGN DOCUMENT: ${identity.name.toUpperCase()}
*Architecture Design & Infrastructure Specifications*

## 1. Core Technology Stack Selection
${technicalArchitecture.techStack.map((item) => `* **${item.layer}:** ${item.tech} \n  * Reason: ${item.reason}`).join("\n")}

## 2. System Overview
* **Backend Architecture:** ${technicalArchitecture.backendDetails}
* **Frontend Design:** ${technicalArchitecture.frontendDetails}
* **Authentication Scheme:** ${technicalArchitecture.authFlow}

## 3. Database Table Design
${technicalArchitecture.databaseDesign.map((table) => `
### Table: ${table.name}
${table.columns.map((col) => `* **${col.name}:** ${col.type} ${col.notes ? `(${col.notes})` : ""}`).join("\n")}
`).join("\n")}

## 4. Core System Endpoints
${technicalArchitecture.apiList.map((api) => `* **${api.method} ${api.path}:** ${api.description}\n  * Payload: \`${api.payload || "N/A"}\`\n  * Response: \`${api.response || "N/A"}\``).join("\n")}

## 5. Deployment Strategy & Hosting Cloud
* **Cloud Infrastructure:** ${technicalArchitecture.cloudRecommendation}
* **CI/CD Pipeline Details:** ${technicalArchitecture.deploymentPlan}
`;
  };

  const compilePitchDeck = () => {
    const { identity, investorSection } = startup;
    if (!investorSection) {
      return `# INVESTOR PITCH DECK OUTLINE: ${identity.name.toUpperCase()}
*(Investor slides not yet generated in workspace)*`;
    }

    return `# INVESTOR PITCH DECK OUTLINE: ${identity.name.toUpperCase()}
*Investor Relations, Capital Scoping, Slide Outlines*

## 1. Strategic Funding Summary
* **Investment Capital Ask:** $${investorSection.investmentAsk.toLocaleString()}
* **Strategic Exit Strategy:** ${investorSection.exitStrategy}
* **Financial Highlights Summary:** ${investorSection.financialHighlights}

## 2. Itemized Use of Investment Funds
${investorSection.useOfFunds.map((item) => `* **${item.item}:** ${item.percentage}% of total round`).join("\n")}

## 3. Comprehensive One-Page Executive Summary
${investorSection.executiveSummary}

## 4. Slide-By-Slide Investor Deck Structure
${investorSection.pitchDeckOutline.map((slide) => `
### Slide ${slide.slide}: ${slide.title}
${slide.bullets.map((b) => `* ${b}`).join("\n")}
`).join("\n")}
`;
  };

  const exportDocs = [
    {
      id: "business_plan",
      title: "Complete Business Plan",
      desc: "Covers SWOT, PESTLE, TAM calculations, executive summaries, and pricing plans.",
      length: "~5 min read",
      icon: FileText,
      compile: compileBusinessPlan,
      fileName: `${startup.identity.name}_Business_Plan`
    },
    {
      id: "prd",
      title: "Product Requirement Document (PRD)",
      desc: "Outlines functional requirements, acceptance criteria, user stories, and product KPIs.",
      length: "~3 min read",
      icon: Code,
      compile: compilePRD,
      fileName: `${startup.identity.name}_PRD`
    },
    {
      id: "tech_design",
      title: "Technical Design Document",
      desc: "Lists full tech stack, backend flow, database tables, schema columns, and API routes.",
      length: "~4 min read",
      icon: Code,
      compile: compileTechDocs,
      fileName: `${startup.identity.name}_Tech_Design`
    },
    {
      id: "pitch_deck",
      title: "Investor Pitch Deck Outlines",
      desc: "Slide-by-slide slide details, capital ask, exits, and VC-ready summaries.",
      length: "~3 min read",
      icon: Presentation,
      compile: compilePitchDeck,
      fileName: `${startup.identity.name}_Investor_Deck`
    }
  ];

  return (
    <div className="space-y-6" id="export-workspace">
      <div className="bg-slate-900/40 p-5 border border-slate-800 rounded-2xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          The Document Generator compiles all currently forged modules from your startup workspace into clean, professional, fully markdown-formatted files that you can import directly into Notion, Obsidian, GitHub, or print as PDFs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="export-grid">
        {exportDocs.map((doc) => {
          const content = doc.compile();
          const isCopied = copiedId === doc.id;

          return (
            <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 bg-cyan-950/40 border border-cyan-800/30 rounded-xl flex items-center justify-center text-cyan-400">
                    <doc.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">{doc.length}</span>
                </div>

                <div>
                  <h5 className="font-bold text-white text-sm">{doc.title}</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{doc.desc}</p>
                </div>
              </div>

              <div className="flex gap-2.5 mt-6 pt-5 border-t border-slate-850/60">
                <button
                  onClick={() => handleCopy(doc.id, content)}
                  className="flex-1 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-slate-300"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Markdown
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownload(doc.fileName, content)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-500/5 hover:shadow-cyan-500/10"
                >
                  <Download className="w-3.5 h-3.5" /> Download .md
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SPREADSHEET & CSV EXPORT SECTION */}
      <div className="pt-4 border-t border-slate-800 space-y-4" id="csv-export-section">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-syne font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#00ff66]" />
              <span>Spreadsheet & Financial Model Exports (CSV)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Download clean, comma-separated spreadsheet data ready to open in Excel, Google Sheets, or Numbers.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-[10px] font-bold font-mono">
            RFC 4180 Format
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CSV 1: Financial Projections & Budget */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-white text-sm">Financial Projections Table</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                12-month revenue, expense run rate, net margin %, break-even analysis, and startup budget allocations.
              </p>
            </div>

            <button
              onClick={() => exportFinancialProjectionsCSV(startup)}
              className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Financials .csv</span>
            </button>
          </div>

          {/* CSV 2: SWOT Matrix & Market Data */}
          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Table className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-white text-sm">SWOT & Market Sizing</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                4-quadrant SWOT matrix (Strengths, Weaknesses, Opportunities, Threats), TAM/SAM/SOM, and PESTLE audit.
              </p>
            </div>

            <button
              onClick={() => exportSWOTAnalysisCSV(startup)}
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export SWOT .csv</span>
            </button>
          </div>

          {/* CSV 3: Master Workbook */}
          <div className="bg-slate-900 border border-slate-800 hover:border-[#00ff66]/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66]">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-white text-sm">Master Startup Workbook</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive spreadsheet bundle merging Financials, SWOT, Competitors, and Milestones in one sheet.
              </p>
            </div>

            <button
              onClick={() => exportCombinedStartupCSV(startup)}
              className="w-full bg-[#00ff66] hover:bg-[#00cc52] text-black font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#00ff66]/10"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Export Master .csv</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
