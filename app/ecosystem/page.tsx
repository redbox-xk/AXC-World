"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Globe, TrendingUp, Zap, ArrowRightLeft, Layers,
  Code, Shield, BookOpen, ExternalLink, ChevronRight,
  Flame, BarChart2, Users, DollarSign
} from "lucide-react"
import { GalaxyBackground } from "@/components/galaxy-background"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"
import { cn } from "@/lib/utils"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Bar
} from "recharts"

const categories = ["All", "DEX", "Lending", "Bridge", "NFT", "Launchpad", "Yield", "DAO", "Gaming"]

const dapps = [
  { name: "AurexiaDEX", category: "DEX", tvl: "$12.4M", users: "48,210", vol24h: "$3.8M", apy: "24.7%", verified: true, desc: "The native AMM + order book DEX on Aurexia Chain. Deep liquidity, zero MEV, real-time settlement.", chains: ["AXC"], color: "from-axc-blue/20 to-primary/10" },
  { name: "AXC Bridge", category: "Bridge", tvl: "$24.7M", users: "12,880", vol24h: "$8.2M", apy: "—", verified: true, desc: "Official trustless cross-chain bridge. Supports ETH, BNB, SOL, AVAX, MATIC, ARB, OP, BASE.", chains: ["AXC", "ETH", "BNB"], color: "from-axc-purple/20 to-axc-blue/10" },
  { name: "AXC Lend", category: "Lending", tvl: "$8.2M", users: "22,413", vol24h: "$1.4M", apy: "8.2%", verified: true, desc: "Over-collateralized lending protocol. Borrow stablecoins against AXC with 150% collateral ratio.", chains: ["AXC"], color: "from-axc-green/20 to-axc-blue/10" },
  { name: "AurexiaNFT", category: "NFT", tvl: "$3.1M", users: "31,200", vol24h: "$0.9M", apy: "—", verified: true, desc: "Royalty-enforcing NFT marketplace. Support for ARC-721, ARC-1155, lazy minting, and batch transfers.", chains: ["AXC"], color: "from-axc-gold/20 to-axc-purple/10" },
  { name: "AurexiaPad", category: "Launchpad", tvl: "$5.6M", users: "8,840", vol24h: "$2.1M", apy: "—", verified: true, desc: "Token launchpad for Aurexia Chain projects. IDO, IFO, and fair launch options with anti-bot protection.", chains: ["AXC"], color: "from-axc-red/20 to-axc-gold/10" },
  { name: "AXC Vault", category: "Yield", tvl: "$6.9M", users: "14,220", vol24h: "$0.6M", apy: "Up to 34%", verified: true, desc: "Auto-compounding yield vaults. Strategies deployed across AurexiaDEX, AXC Lend, and external protocols.", chains: ["AXC"], color: "from-axc-blue/20 to-axc-green/10" },
  { name: "AurexiaDAO", category: "DAO", tvl: "$2.4M", users: "18,440", vol24h: "—", apy: "—", verified: true, desc: "On-chain governance for Aurexia Chain protocol parameters, treasury, and ecosystem grants.", chains: ["AXC"], color: "from-axc-purple/20 to-axc-blue/10" },
  { name: "StarRealms", category: "Gaming", tvl: "$1.8M", users: "42,100", vol24h: "$0.4M", apy: "—", verified: false, desc: "Fully on-chain RPG built on Aurexia Chain. NFT characters, land, weapons, and P2E mechanics.", chains: ["AXC"], color: "from-axc-gold/20 to-axc-red/10" },
  { name: "AxSwap", category: "DEX", tvl: "$4.2M", users: "9,800", vol24h: "$1.2M", apy: "19.4%", verified: false, desc: "Concentrated liquidity DEX with Uniswap V3-style positions on Aurexia Chain.", chains: ["AXC"], color: "from-axc-blue/20 to-axc-purple/10" },
]

function generateBurnData(months: number) {
  return Array.from({ length: months }, (_, i) => ({
    month: new Date(2024, i, 1).toLocaleDateString("en-US", { month: "short" }),
    burned: Math.floor(Math.random() * 8000 + 4000),
    supply: 10000000 - Math.floor(i * 14000 + Math.random() * 5000),
  }))
}

const burnData = generateBurnData(12)
const roadmap = [
  { q: "Q1 2024", label: "Genesis", done: true, items: ["Mainnet Launch", "Genesis Block #1", "420 Validators Online", "AXC Wallet v1.0", "AurexiaDEX v1 Launch"] },
  { q: "Q2 2024", label: "Growth", done: true, items: ["AXC Bridge Live", "AXC Lend Protocol", "50,000 Wallet Users", "Cross-chain TVL $10M+", "Audit by CertiK"] },
  { q: "Q3 2024", label: "Scale", done: true, items: ["AurexiaNFT Launch", "AXC Vault Protocol", "100,000 Users", "AurexiaDAO Governance", "Developer SDK v2"] },
  { q: "Q4 2024", label: "Ecosystem", done: true, items: ["AurexiaPad Launches", "TVL $60M Milestone", "Mobile Wallet App", "EIP-4337 Account Abstraction", "250,000 Wallets"] },
  { q: "Q1 2025", label: "Expansion", done: false, items: ["AXC DeFi Aggregator", "zkRollup Testnet", "Institutional Staking API", "AXC Options Protocol", "1M Wallet Target"] },
  { q: "Q2 2025", label: "Layer 2", done: false, items: ["zkRollup Mainnet", "Cross-chain Messaging v2", "On-chain Identity (DID)", "Decentralized Oracle Network", "AXC Mobile DeFi Suite"] },
]

export default function EcosystemPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const filtered = activeCategory === "All" ? dapps : dapps.filter((d) => d.category === activeCategory)

  return (
    <div className="relative min-h-screen bg-background scan-lines">
      <GalaxyBackground />
      <AXCNav />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto hologram-float mb-6">
            <Image
              src="/aurexia-logo.png"
              alt="Aurexia"
              fill
              className="object-contain drop-shadow-[0_0_30px_rgba(100,150,255,0.8)]"
            />
          </div>
          <div className="inline-flex items-center gap-2 hologram-card rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-axc-blue" /> Aurexia Chain Ecosystem
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-balance hologram-text">
            The Aurexia Universe
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Over 60 protocols, $60M+ TVL, 284,720 active users — the fastest-growing DeFi ecosystem
            on any Layer-1 blockchain. All powered by AXC.
          </p>
        </div>

        {/* Ecosystem stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total DApps", value: "60+", sub: "+8 this month", icon: Globe, color: "text-axc-blue" },
            { label: "Total Value Locked", value: "$60.4M", sub: "+12.4% (7d)", icon: DollarSign, color: "text-axc-gold" },
            { label: "Monthly Users", value: "284,720", sub: "+5.7%", icon: Users, color: "text-axc-green" },
            { label: "Daily Volume", value: "$18.6M", sub: "All protocols", icon: BarChart2, color: "text-axc-purple" },
          ].map((s) => (
            <div key={s.label} className="glass-panel border border-white/8 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground font-mono">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* dApps Directory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-foreground">DApp Directory</h2>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "glass-panel border border-white/10 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((app) => (
              <div
                key={app.name}
                className="glass-panel border border-white/8 rounded-2xl overflow-hidden hover:border-primary/20 transition-all hover:scale-[1.01] group"
              >
                {/* Card header gradient */}
                <div className={`h-20 bg-gradient-to-br ${app.color} flex items-end px-5 pb-3`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-background/60 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                      <span className="text-sm font-bold text-foreground">{app.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-foreground">{app.name}</span>
                        {app.verified && (
                          <span className="w-4 h-4 rounded-full bg-axc-blue flex items-center justify-center">
                            <span className="text-white text-[8px] font-bold">✓</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{app.category}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{app.desc}</p>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="glass-panel border border-white/8 rounded-lg p-2 text-center">
                      <div className="text-muted-foreground">TVL</div>
                      <div className="text-axc-green font-semibold">{app.tvl}</div>
                    </div>
                    <div className="glass-panel border border-white/8 rounded-lg p-2 text-center">
                      <div className="text-muted-foreground">Users</div>
                      <div className="text-foreground font-semibold">{Number(app.users.replace(/,/g, "")).toLocaleString()}</div>
                    </div>
                    <div className="glass-panel border border-white/8 rounded-lg p-2 text-center">
                      <div className="text-muted-foreground">24h Vol</div>
                      <div className="text-foreground font-semibold">{app.vol24h}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-1">
                      {app.chains.map((c) => (
                        <span key={c} className="text-xs glass-panel border border-white/10 px-1.5 py-0.5 rounded font-mono text-muted-foreground">{c}</span>
                      ))}
                    </div>
                    <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                      Launch <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tokenomics */}
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">
              AXC <span className="text-axc-gold text-glow-gold">Tokenomics</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Deflationary mechanics, staking rewards, and governance — all encoded at the protocol level.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Burn chart */}
            <div className="glass-panel border border-white/8 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-axc-red" />
                <h3 className="text-sm font-semibold text-foreground">Monthly AXC Burned</h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={burnData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.03 250 / 0.4)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.55 0.05 230)", fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(0.55 0.05 230)", fontFamily: "Space Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: "oklch(0.09 0.018 260)", border: "1px solid oklch(0.18 0.03 250)", borderRadius: "8px", fontSize: "11px", fontFamily: "Space Mono" }}
                      formatter={(v: number) => [`${v.toLocaleString()} AXC`, "Burned"]}
                    />
                    <Bar dataKey="burned" fill="oklch(0.55 0.22 15)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
                <span className="text-muted-foreground">Total Burned to Date</span>
                <span className="text-axc-red font-bold">167,559 AXC</span>
              </div>
            </div>

            {/* Tokenomics breakdown */}
            <div className="glass-panel border border-white/8 rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-semibold text-foreground">Supply Allocation</h3>
              <div className="space-y-4">
                {[
                  { label: "Staking Rewards", pct: 40, amount: "4,000,000", color: "bg-axc-blue", desc: "Distributed over 10 years to validators and delegators" },
                  { label: "Ecosystem Fund", pct: 25, amount: "2,500,000", color: "bg-axc-gold", desc: "Grants, developer incentives, and protocol development" },
                  { label: "Team & Advisors", pct: 15, amount: "1,500,000", color: "bg-axc-purple", desc: "4-year vesting with 1-year cliff" },
                  { label: "Public Sale", pct: 12, amount: "1,200,000", color: "bg-axc-green", desc: "IDO, exchange listings, and liquidity provision" },
                  { label: "Strategic Reserve", pct: 8, amount: "800,000", color: "bg-axc-red", desc: "Emergency fund, partnerships, and protocol security" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <div>
                        <span className="text-foreground font-medium">{item.label}</span>
                        <span className="text-muted-foreground ml-2">— {item.desc}</span>
                      </div>
                      <span className="text-foreground font-semibold flex-shrink-0 ml-2">{item.pct}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs font-mono">
                <div className="glass-panel border border-white/10 rounded-lg p-3">
                  <div className="text-muted-foreground">Total Supply</div>
                  <div className="text-foreground font-bold mt-0.5">10,000,000 AXC</div>
                </div>
                <div className="glass-panel border border-white/10 rounded-lg p-3">
                  <div className="text-muted-foreground">Fully Diluted Cap</div>
                  <div className="text-foreground font-bold mt-0.5">$28,470,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">
              Development <span className="text-axc-blue text-glow-blue">Roadmap</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A transparent, milestone-driven development plan for the Aurexia Chain ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmap.map((phase) => (
              <div
                key={phase.q}
                className={cn(
                  "glass-panel border rounded-2xl p-6 space-y-4",
                  phase.done ? "border-axc-green/20" : "border-white/8"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">{phase.q}</div>
                    <div className="text-base font-bold text-foreground">{phase.label}</div>
                  </div>
                  <span className={cn(
                    "text-xs font-mono px-2 py-1 rounded-full",
                    phase.done ? "bg-axc-green/15 text-axc-green" : "bg-axc-blue/15 text-axc-blue"
                  )}>
                    {phase.done ? "Completed" : "Upcoming"}
                  </span>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs font-mono">
                      <span className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold",
                        phase.done ? "bg-axc-green text-background" : "border border-axc-blue/30 text-axc-blue"
                      )}>
                        {phase.done ? "✓" : "○"}
                      </span>
                      <span className={phase.done ? "text-foreground" : "text-muted-foreground"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Developer section */}
        <div className="gradient-border glass-panel rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-axc-blue" />
                <span className="text-xs font-mono text-axc-blue uppercase tracking-wider">For Developers</span>
              </div>
              <h2 className="text-3xl font-bold text-balance">Build on Aurexia Chain</h2>
              <p className="text-muted-foreground leading-relaxed">
                Full EVM compatibility means your existing Solidity contracts deploy with zero changes.
                Leverage AXC's 50,000 TPS, 0.4s block time, and rich DeFi ecosystem for your dApp.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                  <BookOpen className="w-4 h-4" /> Documentation
                </button>
                <button className="flex items-center gap-2 glass-panel border border-white/15 hover:border-primary/30 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground transition-all">
                  <Code className="w-4 h-4" /> GitHub SDK
                </button>
              </div>
            </div>
            <div className="glass-panel border border-white/10 rounded-2xl p-5 font-mono text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-axc-red" />
                <div className="w-2.5 h-2.5 rounded-full bg-axc-gold" />
                <div className="w-2.5 h-2.5 rounded-full bg-axc-green" />
                <span className="text-xs ml-1">axc-network.config.js</span>
              </div>
              <div className="text-muted-foreground">// Add Aurexia Chain to your config</div>
              <div><span className="text-axc-purple">const</span> <span className="text-foreground">network</span> <span className="text-axc-blue">=</span> {"{"}</div>
              <div className="pl-4"><span className="text-axc-gold">name</span>: <span className="text-axc-green">'aurexia-mainnet'</span>,</div>
              <div className="pl-4"><span className="text-axc-gold">chainId</span>: <span className="text-axc-blue">7171</span>,</div>
              <div className="pl-4"><span className="text-axc-gold">rpcUrl</span>: <span className="text-axc-green">'https://rpc.aurexia.network'</span>,</div>
              <div className="pl-4"><span className="text-axc-gold">symbol</span>: <span className="text-axc-green">'AXC'</span>,</div>
              <div className="pl-4"><span className="text-axc-gold">explorer</span>: <span className="text-axc-green">'https://scan.aurexia.network'</span>,</div>
              <div className="pl-4"><span className="text-axc-gold">blockTime</span>: <span className="text-axc-blue">400</span>, <span className="text-muted-foreground">// ms</span></div>
              <div>{"};"}</div>
            </div>
          </div>
        </div>
      </main>

      <AXCFooter />
    </div>
  )
}
