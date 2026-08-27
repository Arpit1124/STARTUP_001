import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { TrendingUp, RefreshCw, Sparkles, BarChart3, Info, CheckCircle2, ChevronRight, Zap, Target } from "lucide-react";
import { Startup } from "../types";

interface MarketGrowthProjectionProps {
  startup: Startup;
  className?: string;
}

interface ProjectionDataPoint {
  year: number;
  yearLabel: string;
  marketSize: number; // in Billions USD
  startupProjectedSom: number; // in Millions USD
  growthRate: number; // percentage
  milestone?: string;
}

// Fallback industry CAGR lookup table if not specified in market research text
const INDUSTRY_CAGR_MAP: Record<string, { cagr: number; defaultTamBillion: number; narrative: string }> = {
  "ai": { cagr: 28.4, defaultTamBillion: 184, narrative: "Driven by ubiquitous LLM reasoning, agentic automation, and enterprise workflow restructuring." },
  "artificial intelligence": { cagr: 28.4, defaultTamBillion: 184, narrative: "Driven by ubiquitous LLM reasoning, agentic automation, and enterprise workflow restructuring." },
  "saas": { cagr: 18.2, defaultTamBillion: 232, narrative: "Cloud software proliferation, micro-vertical tools, and automated enterprise subscription consolidation." },
  "fintech": { cagr: 19.8, defaultTamBillion: 310, narrative: "Accelerated cross-border settlement, embedded finance API infrastructure, and real-time payments." },
  "healthtech": { cagr: 17.5, defaultTamBillion: 260, narrative: "Decentralized diagnostics, remote biometric telemetry, and automated clinical administrative workflows." },
  "edtech": { cagr: 15.6, defaultTamBillion: 125, narrative: "Adaptive cognitive tutoring, lifelong upskilling modules, and micro-credential verification." },
  "climatetech": { cagr: 24.2, defaultTamBillion: 95, narrative: "Global net-zero regulatory mandates, carbon tracking requirements, and grid modernization." },
  "ecommerce": { cagr: 13.4, defaultTamBillion: 420, narrative: "Autonomous fulfillment networks, omnichannel personalization, and social commerce integration." },
  "logistics": { cagr: 14.1, defaultTamBillion: 190, narrative: "Real-time routing optimization, predictive freight matching, and multi-modal transparency." },
  "cybersecurity": { cagr: 14.8, defaultTamBillion: 215, narrative: "Zero-trust compliance mandates, quantum-resilient encryption, and automated anomaly detection." },
  "biotech": { cagr: 16.3, defaultTamBillion: 140, narrative: "High-throughput computational drug discovery, mRNA platforms, and synthetic biology applications." },
  "gaming": { cagr: 11.5, defaultTamBillion: 220, narrative: "Cloud streaming gaming, user-generated content economies, and procedural world synthesis." },
  "proptech": { cagr: 12.8, defaultTamBillion: 85, narrative: "Smart building telemetry, algorithmic asset valuation, and digital transaction registries." },
  "web3": { cagr: 22.0, defaultTamBillion: 75, narrative: "Decentralized physical infrastructure (DePIN), tokenized real-world assets, and verifiable credentials." }
};

export default function MarketGrowthProjection({ startup, className = "" }: MarketGrowthProjectionProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<"conservative" | "expected" | "aggressive">("expected");
  const [hoveredPoint, setHoveredPoint] = useState<ProjectionDataPoint | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Parse or compute Industry CAGR and initial Market Size
  const { baseCagr, baseTamBillion, industryNarrative, detectedIndustry } = useMemo(() => {
    const rawIndustry = (startup.idea.industry || "SaaS / Tech").toLowerCase();
    
    // Check if industry matches dictionary
    let matched = Object.entries(INDUSTRY_CAGR_MAP).find(([key]) => rawIndustry.includes(key));
    let fallback = matched ? matched[1] : { cagr: 17.5, defaultTamBillion: 150, narrative: "Expanding baseline technology adoption and digitization across key commercial verticals." };

    // Try to extract parsed percentage from marketResearch text if available
    let parsedCagr = fallback.cagr;
    const textPool = `${startup.marketResearch?.industrySize || ""} ${startup.marketResearch?.growthTrends || ""} ${startup.marketResearch?.tam || ""}`;
    const cagrMatch = textPool.match(/(\d{1,2}(?:\.\d{1,2})?)\s*%\s*(?:CAGR|annual|growth|compound)/i) || textPool.match(/(?:CAGR|growth of)\s*(?:around|approx|approximately)?\s*(\d{1,2}(?:\.\d{1,2})?)\s*%/i);
    
    if (cagrMatch && parseFloat(cagrMatch[1]) > 3 && parseFloat(cagrMatch[1]) < 65) {
      parsedCagr = parseFloat(cagrMatch[1]);
    }

    // Try to extract TAM in billions
    let parsedTam = fallback.defaultTamBillion;
    const tamMatch = textPool.match(/\$(\d+(?:\.\d+)?)\s*(?:B|billion|Billion)/i);
    if (tamMatch && parseFloat(tamMatch[1]) > 0.5) {
      parsedTam = parseFloat(tamMatch[1]);
    }

    return {
      baseCagr: parsedCagr,
      baseTamBillion: parsedTam,
      industryNarrative: startup.marketResearch?.growthTrends || fallback.narrative,
      detectedIndustry: startup.idea.industry || "Technology & Software"
    };
  }, [startup]);

  // Adjust CAGR multiplier by scenario
  const effectiveCagr = useMemo(() => {
    if (selectedScenario === "conservative") return Math.max(4, +(baseCagr * 0.72).toFixed(1));
    if (selectedScenario === "aggressive") return +(baseCagr * 1.35).toFixed(1);
    return baseCagr;
  }, [baseCagr, selectedScenario]);

  // Generate 6-year trajectory data
  const trajectoryData: ProjectionDataPoint[] = useMemo(() => {
    const startYear = 2025;
    const points: ProjectionDataPoint[] = [];
    let currentMarketSize = baseTamBillion;
    // Estimated startup SOM penetration from 0.05% to 0.45% of SAM
    let startupSomMil = 1.2;

    const milestones = [
      "Baseline Benchmark",
      "Early Sector Adopters",
      "Inflection & Scale Point",
      "Mainstream Standard",
      "Enterprise Expansion",
      "Market Maturity Plateau"
    ];

    for (let i = 0; i < 6; i++) {
      const year = startYear + i;
      const rate = effectiveCagr;
      if (i > 0) {
        currentMarketSize = +(currentMarketSize * (1 + rate / 100)).toFixed(1);
        startupSomMil = +(startupSomMil * (1 + (rate * 1.6) / 100)).toFixed(2);
      }

      points.push({
        year,
        yearLabel: `Y${i + 1} (${year})`,
        marketSize: currentMarketSize,
        startupProjectedSom: startupSomMil,
        growthRate: rate,
        milestone: milestones[i]
      });
    }

    return points;
  }, [baseTamBillion, effectiveCagr]);

  // Terminal stats
  const totalGrowthMultiplier = useMemo(() => {
    if (trajectoryData.length < 2) return "1.0x";
    const start = trajectoryData[0].marketSize;
    const end = trajectoryData[trajectoryData.length - 1].marketSize;
    return (end / start).toFixed(1) + "x";
  }, [trajectoryData]);

  const netExpansionBillions = useMemo(() => {
    if (trajectoryData.length < 2) return 0;
    const start = trajectoryData[0].marketSize;
    const end = trajectoryData[trajectoryData.length - 1].marketSize;
    return (end - start).toFixed(1);
  }, [trajectoryData]);

  // D3 Render Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawing

    const containerWidth = containerRef.current.clientWidth || 600;
    const height = 280;
    const margin = { top: 30, right: 35, bottom: 40, left: 55 };
    const width = Math.max(320, containerWidth);

    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("width", "100%")
       .attr("height", height);

    // Color definitions
    const accentColor = selectedScenario === "aggressive" ? "#10b981" : selectedScenario === "conservative" ? "#f59e0b" : "#00ff66";
    const gradientId = `growth-gradient-${animationKey}`;
    const glowFilterId = `glow-${animationKey}`;

    // Defs for gradients and glow filter
    const defs = svg.append("defs");

    // Area fill gradient
    const areaGradient = defs.append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");

    areaGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", accentColor)
      .attr("stop-opacity", 0.35);

    areaGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", accentColor)
      .attr("stop-opacity", 0.0);

    // Glow filter
    const filter = defs.append("filter")
      .attr("id", glowFilterId)
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Scales
    const xScale = d3.scalePoint<number>()
      .domain(trajectoryData.map(d => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const maxVal = d3.max(trajectoryData, d => d.marketSize) || 100;
    const minVal = (d3.min(trajectoryData, d => d.marketSize) || 10) * 0.85;

    const yScale = d3.scaleLinear()
      .domain([Math.max(0, minVal), maxVal * 1.12])
      .range([height - margin.bottom, margin.top]);

    // Horizontal Grid Lines
    const yTicks = yScale.ticks(5);
    const gridGroup = svg.append("g").attr("class", "grid-lines");

    yTicks.forEach(tickVal => {
      gridGroup.append("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", yScale(tickVal))
        .attr("y2", yScale(tickVal))
        .attr("stroke", "rgba(228, 228, 231, 0.08)")
        .attr("stroke-dasharray", "3 3");

      gridGroup.append("text")
        .attr("x", margin.left - 10)
        .attr("y", yScale(tickVal) + 3)
        .attr("fill", "rgba(228, 228, 231, 0.4)")
        .attr("font-size", "9px")
        .attr("font-family", "ui-monospace, monospace")
        .attr("text-anchor", "end")
        .text(`$${tickVal >= 1000 ? (tickVal / 1000).toFixed(1) + 'T' : Math.round(tickVal) + 'B'}`);
    });

    // X Axis Labels
    const xAxisGroup = svg.append("g").attr("class", "x-axis");
    trajectoryData.forEach(d => {
      const xPos = xScale(d.year) || margin.left;
      xAxisGroup.append("text")
        .attr("x", xPos)
        .attr("y", height - margin.bottom + 20)
        .attr("fill", "rgba(228, 228, 231, 0.6)")
        .attr("font-size", "10px")
        .attr("font-family", "ui-monospace, monospace")
        .attr("font-weight", "600")
        .attr("text-anchor", "middle")
        .text(d.year);
    });

    // D3 Line & Area Generators
    const lineGenerator = d3.line<ProjectionDataPoint>()
      .x(d => xScale(d.year) || margin.left)
      .y(d => yScale(d.marketSize))
      .curve(d3.curveMonotoneX);

    const areaGenerator = d3.area<ProjectionDataPoint>()
      .x(d => xScale(d.year) || margin.left)
      .y0(height - margin.bottom)
      .y1(d => yScale(d.marketSize))
      .curve(d3.curveMonotoneX);

    // Render Area Fill
    const areaPath = svg.append("path")
      .datum(trajectoryData)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", areaGenerator)
      .attr("opacity", 0);

    areaPath.transition()
      .duration(1000)
      .attr("opacity", 1);

    // Render Line Path
    const linePath = svg.append("path")
      .datum(trajectoryData)
      .attr("fill", "none")
      .attr("stroke", accentColor)
      .attr("stroke-width", 2.75)
      .attr("filter", `url(#${glowFilterId})`)
      .attr("d", lineGenerator);

    // Animated Path Drawing using stroke-dashoffset
    const totalLength = (linePath.node() as SVGPathElement)?.getTotalLength() || 1000;

    linePath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    // Render Data Point Dots and Interactive Touch Areas
    const pointsGroup = svg.append("g").attr("class", "data-points");

    trajectoryData.forEach((d, idx) => {
      const cx = xScale(d.year) || margin.left;
      const cy = yScale(d.marketSize);
      const isLast = idx === trajectoryData.length - 1;

      // Outer ripple ring for terminal year
      if (isLast) {
        pointsGroup.append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 10)
          .attr("fill", "none")
          .attr("stroke", accentColor)
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.6)
          .attr("class", "animate-ping");
      }

      // Visible Core Dot
      const circle = pointsGroup.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 0)
        .attr("fill", "#0c0c0e")
        .attr("stroke", accentColor)
        .attr("stroke-width", 2.5)
        .attr("cursor", "pointer");

      circle.transition()
        .delay(idx * 160 + 300)
        .duration(400)
        .ease(d3.easeBackOut)
        .attr("r", isLast ? 6 : 4.5);

      // Value label on hover or key points
      pointsGroup.append("text")
        .attr("x", cx)
        .attr("y", cy - 12)
        .attr("fill", isLast ? accentColor : "rgba(228, 228, 231, 0.8)")
        .attr("font-size", "9px")
        .attr("font-family", "ui-monospace, monospace")
        .attr("font-weight", isLast ? "bold" : "500")
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .text(`$${d.marketSize >= 1000 ? (d.marketSize / 1000).toFixed(1) + 'T' : Math.round(d.marketSize) + 'B'}`)
        .transition()
        .delay(idx * 160 + 600)
        .duration(300)
        .attr("opacity", 1);

      // Transparent interactive hit area for mouse hover / touch
      pointsGroup.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 20)
        .attr("fill", "transparent")
        .attr("cursor", "pointer")
        .on("mouseenter", () => {
          setHoveredPoint(d);
          circle.attr("r", 7).attr("fill", accentColor);
        })
        .on("mouseleave", () => {
          setHoveredPoint(null);
          circle.attr("r", isLast ? 6 : 4.5).attr("fill", "#0c0c0e");
        });
    });

  }, [trajectoryData, selectedScenario, animationKey]);

  return (
    <div
      ref={containerRef}
      className={`bg-white border border-slate-200 p-6 rounded-2xl space-y-5 shadow-sm text-slate-900 ${className}`}
      id="market-growth-projection-card"
    >
      {/* Header with Title and CAGR Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
              Market Growth Projection (CAGR Model)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Dynamic D3 predictive growth curve based on {detectedIndustry} expansion dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Active CAGR Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-mono text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{effectiveCagr}% CAGR</span>
          </div>

          {/* Re-play animation button */}
          <button
            onClick={() => setAnimationKey(k => k + 1)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Replay D3 Curve Animation"
            id="replay-growth-curve-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Narrative & High-Level Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Current TAM (2025)</span>
          <span className="text-sm md:text-base font-black text-slate-800 font-mono mt-0.5 block">
            ${baseTamBillion >= 1000 ? (baseTamBillion / 1000).toFixed(2) + 'T' : baseTamBillion + 'B'}
          </span>
          <span className="text-[9px] text-slate-400 font-mono">Baseline addressable</span>
        </div>

        <div className="p-3.5 bg-emerald-50/60 border border-emerald-150 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-emerald-600 block font-semibold">Projected TAM (2030)</span>
          <span className="text-sm md:text-base font-black text-emerald-700 font-mono mt-0.5 block">
            ${trajectoryData[trajectoryData.length - 1]?.marketSize >= 1000 
              ? (trajectoryData[trajectoryData.length - 1]?.marketSize / 1000).toFixed(2) + 'T' 
              : trajectoryData[trajectoryData.length - 1]?.marketSize + 'B'}
          </span>
          <span className="text-[9px] text-emerald-600 font-mono">5-Year horizon</span>
        </div>

        <div className="p-3.5 bg-blue-50/60 border border-blue-150 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-blue-600 block font-semibold">Expansion Factor</span>
          <span className="text-sm md:text-base font-black text-blue-700 font-mono mt-0.5 block">
            {totalGrowthMultiplier}
          </span>
          <span className="text-[9px] text-blue-600 font-mono">Value multiplier</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Net New Capital</span>
          <span className="text-sm md:text-base font-black text-slate-800 font-mono mt-0.5 block">
            +${netExpansionBillions}B
          </span>
          <span className="text-[9px] text-slate-400 font-mono">Sector inflow</span>
        </div>
      </div>

      {/* Scenario Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <span>Forecast Scenario:</span>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            onClick={() => setSelectedScenario("conservative")}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
              selectedScenario === "conservative"
                ? "bg-white text-amber-700 shadow-xs border border-amber-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Conservative ({(baseCagr * 0.72).toFixed(1)}%)
          </button>
          <button
            onClick={() => setSelectedScenario("expected")}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
              selectedScenario === "expected"
                ? "bg-white text-emerald-700 shadow-xs border border-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Expected ({baseCagr}%)
          </button>
          <button
            onClick={() => setSelectedScenario("aggressive")}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
              selectedScenario === "aggressive"
                ? "bg-white text-emerald-700 shadow-xs border border-emerald-300"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Aggressive ({(baseCagr * 1.35).toFixed(1)}%)
          </button>
        </div>
      </div>

      {/* D3 Canvas Container */}
      <div className="bg-[#0e0e11] border border-slate-850 rounded-xl p-3 relative overflow-hidden shadow-inner">
        {/* SVG Render Target */}
        <svg ref={svgRef} className="w-full overflow-visible" />

        {/* Hover Point Float Card */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-[#18181b]/95 backdrop-blur-md border border-[#00ff66]/40 p-3 rounded-xl shadow-xl text-white text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 pointer-events-none z-20">
            <div className="text-[10px] text-[#00ff66] font-bold uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{hoveredPoint.milestone}</span>
            </div>
            <div className="text-slate-200 font-bold text-sm">
              Year {hoveredPoint.year}: ${hoveredPoint.marketSize >= 1000 ? (hoveredPoint.marketSize / 1000).toFixed(2) + 'T' : hoveredPoint.marketSize + 'B'}
            </div>
            <div className="text-[10px] text-slate-400">
              Projected Startup SOM: ~${hoveredPoint.startupProjectedSom}M ARR
            </div>
          </div>
        )}
      </div>

      {/* Narrative Context Footer */}
      <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800 block text-[11px]">Strategic Sector Context</span>
          <p className="text-[11px] leading-relaxed text-slate-600">{industryNarrative}</p>
        </div>
      </div>
    </div>
  );
}
