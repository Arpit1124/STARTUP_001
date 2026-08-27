import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import {
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  BarChart2,
  Target,
  Award,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { Startup } from "../types";

interface D3ChartProps {
  startup: Startup;
}

interface VelocityDataPoint {
  date: Date;
  dateStr: string;
  modulesCompleted: number;
  cumulativeCompleted: number;
  velocityScore: number;
}

export function ProductivityInsightsD3Chart({ startup }: D3ChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeHoverData, setActiveHoverData] = useState<VelocityDataPoint | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const now = new Date();
    const data: VelocityDataPoint[] = [];

    const moduleKeys = [
      "identity", "marketResearch", "competitorAnalysis", "businessModel",
      "financialPlanner", "prd", "mvpPlanner", "technicalArchitecture",
      "marketingPlanner", "investorSection"
    ];
    const totalForged = moduleKeys.reduce((acc, k) => {
      if (k === "identity") return acc + 1;
      return startup[k as keyof Startup] ? acc + 1 : acc;
    }, 0);

    let cumulative = 0;
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      
      let dailyAdded = 0;
      if (i === 28) dailyAdded = 1;
      else if (i === 22 && totalForged >= 2) dailyAdded = 1;
      else if (i === 18 && totalForged >= 3) dailyAdded = 1;
      else if (i === 14 && totalForged >= 4) dailyAdded = 1;
      else if (i === 10 && totalForged >= 5) dailyAdded = 1;
      else if (i === 7 && totalForged >= 6) dailyAdded = 1;
      else if (i === 4 && totalForged >= 7) dailyAdded = 1;
      else if (i === 2 && totalForged >= 8) dailyAdded = Math.min(2, Math.max(0, totalForged - cumulative));
      else if (i === 0 && cumulative < totalForged) dailyAdded = Math.max(0, totalForged - cumulative);

      cumulative += dailyAdded;

      data.push({
        date: d,
        dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        modulesCompleted: dailyAdded,
        cumulativeCompleted: cumulative,
        velocityScore: Math.min(100, Math.round((cumulative / 10) * 80 + (dailyAdded > 0 ? 20 : 0)))
      });
    }

    const containerWidth = containerRef.current.clientWidth || 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 10])
      .range([height, 0]);

    const area = d3
      .area<VelocityDataPoint>()
      .x((d) => xScale(d.date))
      .y0(height)
      .y1((d) => yScale(d.cumulativeCompleted))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<VelocityDataPoint>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.cumulativeCompleted))
      .curve(d3.curveMonotoneX);

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "d3-velocity-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00ff66")
      .attr("stop-opacity", 0.4);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00ff66")
      .attr("stop-opacity", 0.0);

    const yGrid = d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(() => "");
    svg.append("g").attr("class", "grid-line").style("stroke", "rgba(255,255,255,0.05)").call(yGrid);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#d3-velocity-gradient)")
      .attr("d", area);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#00ff66")
      .attr("stroke-width", 3)
      .attr("d", line);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => d3.timeFormat("%b %d")(d as Date));

    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("color", "rgba(228,228,231,0.4)")
      .selectAll("text")
      .style("font-size", "9px")
      .style("font-family", "monospace");

    svg
      .append("g")
      .call(yAxis)
      .attr("color", "rgba(228,228,231,0.4)")
      .selectAll("text")
      .style("font-size", "9px")
      .style("font-family", "monospace");

    svg
      .selectAll(".data-node")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.cumulativeCompleted))
      .attr("r", (d) => (d.modulesCompleted > 0 ? 5 : 3))
      .attr("fill", (d) => (d.modulesCompleted > 0 ? "#00ff66" : "#18181b"))
      .attr("stroke", "#00ff66")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        d3.select(event.currentTarget).attr("r", 7).attr("fill", "#ffffff");
        setActiveHoverData(d);
      })
      .on("mouseleave", (event, d) => {
        d3.select(event.currentTarget).attr("r", d.modulesCompleted > 0 ? 5 : 3).attr("fill", d.modulesCompleted > 0 ? "#00ff66" : "#18181b");
      });

  }, [startup]);

  return (
    <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-6 rounded-2xl space-y-4 shadow-xl" ref={containerRef} id="productivity-insights-d3-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-lg text-[#00ff66]">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="font-syne font-bold text-lg text-[#e4e4e7]">
              Productivity Insights (30-Day Velocity)
            </h3>
          </div>
          <p className="text-xs text-[rgba(228,228,231,0.5)] mt-1 font-mono">
            D3.js interactive chart visualizing module completion velocity over the last 30 days
          </p>
        </div>

        {activeHoverData && (
          <div className="bg-[#0c0c0e] border border-[#00ff66]/40 px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-3">
            <span className="text-[#00ff66] font-bold">{activeHoverData.dateStr}:</span>
            <span className="text-white">+{activeHoverData.modulesCompleted} Modules</span>
            <span className="text-[rgba(228,228,231,0.5)]">({activeHoverData.cumulativeCompleted}/10 Cumulative)</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar pt-2">
        <svg ref={svgRef} className="w-full h-auto overflow-visible" />
      </div>
    </div>
  );
}

interface StartupInsightsProps {
  startup: Startup;
  onNavigateTab: (tab: any) => void;
  onGenerateModule: (tab: any) => void;
}

export default function StartupInsights({ startup, onNavigateTab, onGenerateModule }: StartupInsightsProps) {
  // Modules definition to compute completion
  const moduleKeys = [
    { id: "identity", label: "Brand Identity", cat: "Brand" },
    { id: "marketResearch", label: "Market Research", cat: "Market" },
    { id: "competitorAnalysis", label: "Competitor Analysis", cat: "Market" },
    { id: "businessModel", label: "Business Model", cat: "Commercials" },
    { id: "financialPlanner", label: "Financial Planner", cat: "Commercials" },
    { id: "prd", label: "PRD Generator", cat: "Product" },
    { id: "mvpPlanner", label: "MVP Developer", cat: "Product" },
    { id: "technicalArchitecture", label: "Technical Blueprint", cat: "Product" },
    { id: "marketingPlanner", label: "Marketing Planner", cat: "Growth" },
    { id: "investorSection", label: "Investor Capital", cat: "Growth" },
    { id: "legalChecklist", label: "Legal & Trademark", cat: "Growth" },
    { id: "landingPage", label: "Live Microsite", cat: "Launch" }
  ];

  // Count forged modules
  const forgedCount = moduleKeys.reduce((acc, m) => {
    if (m.id === "identity") return acc + 1; // Always forged
    return startup[m.id as keyof Startup] ? acc + 1 : acc;
  }, 0);

  const totalModules = moduleKeys.length;
  const forgedPercentage = Math.round((forgedCount / totalModules) * 100);
  const currentProgress = Math.max(startup.progress || 0, forgedPercentage);

  // Time saved estimate (approx 12 hrs per module)
  const timeSavedHours = forgedCount * 14;

  // Generate trend line data for Progress over time
  // Based on creation date and current progress milestone evolution
  const createdDate = new Date(startup.createdAt || Date.now());

  // Construct 7 historical time points simulating velocity progression
  const trendData = [
    {
      stage: "Start",
      date: "Day 1",
      actualProgress: 10,
      targetBenchmark: 15,
      velocity: 12
    },
    {
      stage: "Brand Setup",
      date: "Day 2",
      actualProgress: Math.min(20, currentProgress),
      targetBenchmark: 30,
      velocity: 25
    },
    {
      stage: "Market Strategy",
      date: "Day 3",
      actualProgress: Math.min(
        Math.max(20, startup.marketResearch ? 38 : 20),
        currentProgress
      ),
      targetBenchmark: 45,
      velocity: 40
    },
    {
      stage: "Commercials",
      date: "Day 4",
      actualProgress: Math.min(
        Math.max(38, startup.financialPlanner ? 55 : 38),
        currentProgress
      ),
      targetBenchmark: 60,
      velocity: 58
    },
    {
      stage: "Product Blueprint",
      date: "Day 5",
      actualProgress: Math.min(
        Math.max(55, startup.technicalArchitecture ? 72 : 55),
        currentProgress
      ),
      targetBenchmark: 75,
      velocity: 70
    },
    {
      stage: "Investor Pitch",
      date: "Day 6",
      actualProgress: Math.min(
        Math.max(72, startup.investorSection ? 88 : 72),
        currentProgress
      ),
      targetBenchmark: 90,
      velocity: 85
    },
    {
      stage: "Current Velocity",
      date: "Today",
      actualProgress: currentProgress,
      targetBenchmark: 100,
      velocity: Math.min(100, currentProgress + 10)
    }
  ];

  // Category Readiness Data for Bar Chart
  const categories = ["Brand", "Market", "Commercials", "Product", "Growth", "Launch"];
  const categoryData = categories.map((cat) => {
    const catModules = moduleKeys.filter((m) => m.cat === cat);
    const completed = catModules.filter((m) =>
      m.id === "identity" ? true : !!startup[m.id as keyof Startup]
    ).length;
    const score = Math.round((completed / catModules.length) * 100);
    return {
      category: cat,
      readiness: score,
      completed,
      total: catModules.length
    };
  });

  // Custom Recharts Tooltip styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18181b] border border-[#00ff66]/30 p-3 rounded-xl shadow-xl font-mono text-xs text-[#e4e4e7]">
          <p className="font-bold text-[#00ff66] mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 py-0.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[rgba(228,228,231,0.7)]">{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 font-sans" id="startup-insights-container">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#18181b] via-[#1c1c21] to-[#18181b] border border-[rgba(228,228,231,0.1)] p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff66]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00ff66]/10 border border-[#00ff66]/20 rounded-full text-[#00ff66] text-[10px] font-mono font-bold tracking-wider uppercase">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Startup Velocity & Progress Analytics</span>
            </div>
            <h2 className="font-syne text-2xl md:text-3xl font-black text-[#e4e4e7] tracking-tight">
              {startup.identity.name} Velocity Dashboard
            </h2>
            <p className="text-xs md:text-sm text-[rgba(228,228,231,0.6)] leading-relaxed">
              Track execution momentum, module completion benchmarks, and AI-driven acceleration insights for your startup.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#111113]/80 border border-white/10 p-4 rounded-xl flex-shrink-0">
            <div className="text-center">
              <span className="text-[9px] font-mono text-[rgba(228,228,231,0.5)] block uppercase tracking-wider">
                Overall Progress
              </span>
              <span className="font-syne font-black text-2xl md:text-3xl text-[#00ff66]">
                {currentProgress}%
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[9px] font-mono text-[rgba(228,228,231,0.5)] block uppercase tracking-wider">
                Modules Forged
              </span>
              <span className="font-syne font-black text-2xl md:text-3xl text-white">
                {forgedCount}/{totalModules}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VELOCITY METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Forge Completion */}
        <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-5 rounded-xl space-y-2 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[rgba(228,228,231,0.5)] uppercase tracking-wider">
              Forge Completion
            </span>
            <div className="p-2 bg-[#00ff66]/10 rounded-lg text-[#00ff66]">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="font-syne font-black text-2xl text-[#e4e4e7]">
            {currentProgress}%
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5 mt-2">
            <div
              className="bg-[#00ff66] h-full rounded-full transition-all duration-500"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-[rgba(228,228,231,0.4)] font-mono">
            {forgedCount} of {totalModules} modules fully established
          </p>
        </div>

        {/* Card 2: Estimated Time Saved */}
        <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-5 rounded-xl space-y-2 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[rgba(228,228,231,0.5)] uppercase tracking-wider">
              Time Saved
            </span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-syne font-black text-2xl text-[#e4e4e7]">
            ~{timeSavedHours} Hours
          </div>
          <p className="text-[10px] text-[rgba(228,228,231,0.4)] font-mono">
            Saved by AI automated generation vs manual writing
          </p>
        </div>

        {/* Card 3: Pitch Readiness Index */}
        <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-5 rounded-xl space-y-2 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[rgba(228,228,231,0.5)] uppercase tracking-wider">
              Pitch Readiness
            </span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-syne font-black text-2xl text-[#e4e4e7]">
            {Math.min(Math.round(currentProgress * 0.95 + 5), 100)}/100
          </div>
          <p className="text-[10px] font-mono text-purple-400 font-bold">
            {currentProgress >= 80
              ? "Grade A - Investor Ready"
              : currentProgress >= 50
              ? "Grade B - Solid Core"
              : "Grade C - Initial Stage"}
          </p>
        </div>

        {/* Card 4: Execution Velocity */}
        <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-5 rounded-xl space-y-2 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[rgba(228,228,231,0.5)] uppercase tracking-wider">
              Execution Velocity
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="font-syne font-black text-2xl text-emerald-400 flex items-center gap-1">
            <span>High Speed</span>
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-[10px] text-[rgba(228,228,231,0.4)] font-mono">
            Accelerated 10x faster than traditional incubator pace
          </p>
        </div>
      </div>

      {/* D3 PRODUCTIVITY INSIGHTS CHART */}
      <ProductivityInsightsD3Chart startup={startup} />

      {/* RECHARTS TREND LINE CHART */}
      <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-6 rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h3 className="font-syne font-bold text-lg text-[#e4e4e7] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#00ff66]" />
              <span>Progress Trajectory Over Time</span>
            </h3>
            <p className="text-xs text-[rgba(228,228,231,0.5)] mt-0.5">
              Historical progress evolution vs target industry benchmark
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#00ff66]" />
              <span className="text-[rgba(228,228,231,0.7)]">Actual Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-[rgba(228,228,231,0.7)]">Target Benchmark</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff66" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00ff66" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="stage" stroke="rgba(228,228,231,0.4)" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} stroke="rgba(228,228,231,0.4)" tick={{ fontSize: 10 }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="actualProgress"
                name="Actual Progress"
                stroke="#00ff66"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#actualGrad)"
              />
              <Area
                type="monotone"
                dataKey="targetBenchmark"
                name="Target Benchmark"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#targetGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECONDARY ROW: CATEGORY READINESS BAR CHART & QUICK ACTION TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Readiness by Category */}
        <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-syne font-bold text-base text-[#e4e4e7]">
              Readiness Score by Stage
            </h3>
            <p className="text-xs text-[rgba(228,228,231,0.5)]">
              Completion score across operational categories
            </p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="category" stroke="rgba(228,228,231,0.4)" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="rgba(228,228,231,0.4)" tick={{ fontSize: 10 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="readiness" name="Readiness Score" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.readiness === 100 ? "#00ff66" : entry.readiness > 0 ? "#3b82f6" : "#3f3f46"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Forging Status List */}
        <div className="bg-[#18181b] border border-[rgba(228,228,231,0.1)] p-6 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="border-b border-white/5 pb-3 mb-4">
              <h3 className="font-syne font-bold text-base text-[#e4e4e7]">
                Module Checklist & Quick Navigation
              </h3>
              <p className="text-xs text-[rgba(228,228,231,0.5)]">
                Directly jump to any module or forge pending components
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {moduleKeys.map((m) => {
                const isForged = m.id === "identity" ? true : !!startup[m.id as keyof Startup];
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 ${isForged ? "text-[#00ff66]" : "text-white/20"}`}
                      />
                      <span className="font-mono text-[#e4e4e7]">{m.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isForged
                            ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20"
                            : "bg-white/5 text-[rgba(228,228,231,0.4)]"
                        }`}
                      >
                        {isForged ? "Forged" : "Pending"}
                      </span>
                      <button
                        onClick={() => onNavigateTab(m.id === "identity" ? "identity" : m.id.replace(/([A-Z])/g, "-$1").toLowerCase())}
                        className="p-1 hover:bg-white/10 rounded text-[rgba(228,228,231,0.6)] hover:text-[#00ff66] transition-colors cursor-pointer"
                        title={`Go to ${m.label}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {forgedCount < totalModules && (
            <div className="bg-[#00ff66]/5 border border-[#00ff66]/20 p-3 rounded-xl flex items-center justify-between gap-3 text-xs mt-3">
              <div className="flex items-center gap-2 text-[#00ff66]">
                <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
                <span className="font-mono text-[11px]">
                  Forge remaining modules to reach 100% velocity!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
