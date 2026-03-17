"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search, Layers, ArrowRightLeft, Cpu, Activity,
  Users, Zap, BarChart2, Globe, ChevronRight,
  CheckCircle,
} from "lucide-react"
import { GalaxyBackground } from "@/components/galaxy-background"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"
import { cn } from "@/lib/utils"
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts"

// ── Seeded pseudo-random to avoid SSR/client mismatch ──
function seededRand(seed: number, min: number, max: number) {
  const s = Math.sin(seed) * 10000
  return min + Math.floor((s - Math.floor(s)) * (max - min + 1))
}

function genBlocks() {
  const validators = ["Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta"]
  return Array.from({ length: 20 }, (_, i) => ({
    height:  18472931 - i,
    txs:     seededRand(i * 3 + 1, 180, 420),
    validator: `AXC-Validator-${validators[i % 8]}`,
    reward:  (seededRand(i * 7 + 2, 10, 50) / 10).toFixed(2),
    size:    `${(seededRand(i * 11 + 3, 8, 18) / 10).toFixed(1)} MB`,
    gasUsed: seededRand(i * 13 + 4, 12000000, 22000000),
    gasLimit:25000000,
    time:    `${((i + 1) * 0.4).toFixed(1)}s ago`,
    hash:    "0x" + Array.from({ length: 12 }, (_, j) => "0123456789abcdef"[seededRand(i * 100 + j, 0, 15)]).join("") + "...",
  }))
}

function genTxs() {
  const types = ["Transfer","Swap","Stake","Bridge","Contract","NFT"]
  const protocols = ["AurexiaDEX","AXC Bridge","Staking Pool","AXC Lend","AurexiaNFT","Direct"]
  return Array.from({ length: 20 }, (_, i) => ({
    hash:     "0x" + Array.from({ length: 10 }, (_, j) => "0123456789abcdef"[seededRand(i * 50 + j, 0, 15)]).join("") + "...",
    from:     "0x" + Array.from({ length: 6 }, (_, j) => "0123456789abcdef"[seededRand(i * 70 + j, 0, 15)]).join("") + "...",
    to:       "0x" + Array.from({ length: 6 }, (_, j) => "0123456789abcdef"[i * 90 + j + 1]).join("") + "...",
    type:     types[i % types.length],
    protocol: protocols[i % protocols.length],
    value:    `${(seededRand(i * 17 + 5, 10, 50000) / 10).toFixed(1)} AXC`,
    fee:      `${(seededRand(i * 23 + 6, 1, 50) / 1000).toFixed(4)} AXC`,
    time:     `${seededRand(i * 29 + 7, 1, 59)}s ago`,
    status:   "success",
  }))
}

function genTpsData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time:   `${24 - i}h`,
    tps:    seededRand(i * 37 + 8, 38000, 52000),
    blocks: seededRand(i * 41 + 9, 8900, 9100),
  }))
}

// Static data — generated once at module scope with seeded values (no hydration mismatch)
const STATIC_BLOCKS = genBlocks()
const STATIC_TXS    = genTxs()
const STATIC_TPS    = genTpsData()
const BASE_BLOCK    = 18472931

const VALIDATORS = [
  { name: "AXC-Alpha Node",          staked: "2,400,000", commission: "3%",  apy: "18.4%", blocks: 284712, uptime: "100%" },
  { name: "Aurexia Staking Co.",     staked: "1,800,000", commission: "4%",  apy: "17.8%", blocks: 213421, uptime: "99.99%" },
  { name: "Galaxy Validator",        staked: "1,200,000", commission: "2%",  apy: "19.1%", blocks: 178224, uptime: "100%" },
  { name: "DeepSpace Node",          staked: "980,000",   commission: "5%",  apy: "17.2%", blocks: 142110, uptime: "99.97%" },
]

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery]   = useState("")
  const [activeView, setActiveView]     = useState<"blocks"|"txs">("blocks")
  const [searchResult, setSearchResult] = useState<string | null>(null)
  // Live counters — only updated client-side to avoid hydration mismatch
  const [extraBlocks, setExtraBlocks]   = useState(0)
  const [liveTps, setLiveTps]           = useState(48312)
  const [mounted, setMounted]           = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => {
      setExtraBlocks(n => n + 1)
      setLiveTps(t => Math.max(30000, Math.min(55000, t + seededRand(Date.now() % 9999, -800, 800))))
    }, 800)
    return () => clearInterval(id)
  }, [])

  const currentBlock = BASE_BLOCK + extraBlocks

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return
    if (searchQuery.startsWith("0x") && searchQuery.length > 30) {
      setSearchResult(`Transaction found: ${searchQuery.slice(0, 12)}...${searchQuery.slice(-8)}`)
    } else if (!isNaN(Number(searchQuery))) {
      setSearchResult(`Block #${Number(searchQuery).toLocaleString("en-US")} found on Aurexia Chain`)
    } else {
      setSearchResult(`Address ${searchQuery.slice(0, 12)}... found — 284 transactions`)
    }
  }

  const networkStats = [
    { label: "Block Height",  value: mounted ? `#${currentBlock.toLocaleString("en-US")}` : `#${BASE_BLOCK.toLocaleString("en-US")}`, icon: Layers,         color: "text-axc-blue",   change: "~0.4s blocks" },
    { label: "Live TPS",      value: mounted ? liveTps.toLocaleString("en-US") : "48,312",                                             icon: Zap,            color: "text-axc-gold",   change: "Peak: 52,841" },
    { label: "Validators",    value: "420",                                                                                              icon: Users,          color: "text-axc-purple", change: "100% active" },
    { label: "Avg Gas Price", value: "0.0012 AXC",                                                                                      icon: Cpu,            color: "text-axc-green",  change: "-8.3% (24h)" },
    { label: "Txs Today",     value: "1,847,291",                                                                                        icon: ArrowRightLeft, color: "text-axc-blue",   change: "+12.4%" },
    { label: "Active Wallets",value: "284,720",                                                                                          icon: Activity,       color: "text-axc-gold",   change: "+5.7% (7d)" },
  ]

  return (
    <div className="relative min-h-screen bg-background">
      <GalaxyBackground />
      <AXCNav />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Globe className="w-3.5 h-3.5 text-axc-green" />
            <span className="text-axc-green font-semibold">AUREXIA CHAIN MAINNET</span>
            <span className="w-px h-3 bg-border" />
            <span>Chain ID: 7171</span>
            <span className="w-px h-3 bg-border" />
            <span>EVM Compatible</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Block <span className="text-axc-blue">Explorer</span>
          </h1>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="glass-panel border border-white/10 rounded-2xl p-1.5 flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground ml-3 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by transaction hash, block number or wallet address..."
            className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none py-2.5"
          />
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0">
            Search
          </button>
        </form>

        {searchResult && (
          <div className="glass-panel border border-axc-green/30 bg-axc-green/5 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
            <CheckCircle className="w-4 h-4 text-axc-green flex-shrink-0" />
            <span className="text-foreground">{searchResult}</span>
            <button onClick={() => setSearchResult(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
          </div>
        )}

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {networkStats.map(s => (
            <div key={s.label} className="glass-panel border border-white/8 rounded-xl p-4 space-y-2 hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{s.label}</span>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground font-mono">{s.change}</div>
            </div>
          ))}
        </div>

        {/* TPS Chart */}
        <div className="glass-panel border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Network TPS — Last 24 Hours</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Transactions per second across all shards</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-axc-blue" /> TPS
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={STATIC_TPS}>
                <defs>
                  <linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="oklch(0.65 0.22 220)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 220)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.03 250 / 0.4)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "oklch(0.55 0.05 230)", fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.55 0.05 230)", fontFamily: "Space Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.09 0.018 260)", border: "1px solid oklch(0.18 0.03 250)", borderRadius: "8px", fontFamily: "Space Mono", fontSize: "11px" }}
                  labelStyle={{ color: "oklch(0.55 0.05 230)" }}
                  itemStyle={{ color: "oklch(0.65 0.22 220)" }}
                />
                <Area type="monotone" dataKey="tps" stroke="oklch(0.65 0.22 220)" strokeWidth={2} fill="url(#tpsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blocks / Txs Table */}
        <div className="glass-panel border border-white/8 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-1 p-3 border-b border-white/5">
            {(["blocks","txs"] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeView === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {v === "blocks" ? <><Layers className="w-3.5 h-3.5" /> Latest Blocks</> : <><ArrowRightLeft className="w-3.5 h-3.5" /> Latest Transactions</>}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            {activeView === "blocks" ? (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Block","Validator","Txs","Gas Used","Reward","Size","Age"].map(h => (
                      <th key={h} className={cn("p-4 text-muted-foreground font-medium uppercase tracking-wider", h !== "Block" && h !== "Validator" ? "text-right" : "text-left")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STATIC_BLOCKS.map((b, i) => (
                    <tr key={b.height} className={cn("border-b border-white/3 hover:bg-white/3 transition-colors", i === 0 && "bg-primary/5")}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full flex-shrink-0", i === 0 ? "bg-axc-green animate-pulse" : "bg-muted")} />
                          <span className="text-primary font-semibold">#{b.height.toLocaleString("en-US")}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{b.validator}</td>
                      <td className="p-4 text-right text-foreground">{b.txs}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-axc-blue rounded-full" style={{ width: `${Math.round((b.gasUsed / b.gasLimit) * 100)}%` }} />
                          </div>
                          <span className="text-muted-foreground">{Math.round((b.gasUsed / b.gasLimit) * 100)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-axc-gold">{b.reward} AXC</td>
                      <td className="p-4 text-right text-muted-foreground">{b.size}</td>
                      <td className="p-4 text-right text-muted-foreground">{b.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Hash","Type","From","To","Value","Fee","Age","Status"].map(h => (
                      <th key={h} className={cn("p-4 text-muted-foreground font-medium uppercase tracking-wider", ["Value","Fee","Age","Status"].includes(h) ? "text-right" : "text-left")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STATIC_TXS.map((tx, i) => (
                    <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                      <td className="p-4 text-primary">{tx.hash}</td>
                      <td className="p-4">
                        <span className={cn("px-2 py-0.5 rounded-full",
                          tx.type === "Swap"   ? "bg-axc-gold/15 text-axc-gold" :
                          tx.type === "Stake"  ? "bg-axc-blue/15 text-axc-blue" :
                          tx.type === "Bridge" ? "bg-axc-purple/15 text-axc-purple" :
                          "bg-white/8 text-muted-foreground"
                        )}>{tx.type}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">{tx.from}</td>
                      <td className="p-4 text-muted-foreground">{tx.to}</td>
                      <td className="p-4 text-right text-foreground font-semibold">{tx.value}</td>
                      <td className="p-4 text-right text-muted-foreground">{tx.fee}</td>
                      <td className="p-4 text-right text-muted-foreground">{tx.time}</td>
                      <td className="p-4 text-right">
                        <span className="bg-axc-green/15 text-axc-green px-1.5 py-0.5 rounded-full">success</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 border-t border-white/5 flex justify-center">
            <button className="text-xs font-mono text-primary hover:underline flex items-center gap-1">
              Load more <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Validators */}
        <div className="glass-panel border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Top Validators</h3>
            <span className="text-xs text-muted-foreground font-mono">420 active · 100% uptime</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {VALIDATORS.map(v => (
              <div key={v.name} className="glass-panel border border-white/8 rounded-xl p-4 space-y-3 hover:border-primary/20 transition-all cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{v.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">{v.name}</div>
                    <div className="text-xs text-axc-green">{v.uptime} uptime</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div><div className="text-muted-foreground">Staked</div><div className="text-foreground font-semibold">{(Number(v.staked.replace(/,/g,""))/1e6).toFixed(1)}M AXC</div></div>
                  <div><div className="text-muted-foreground">APY</div><div className="text-axc-green font-semibold">{v.apy}</div></div>
                  <div><div className="text-muted-foreground">Commission</div><div className="text-foreground">{v.commission}</div></div>
                  <div><div className="text-muted-foreground">Blocks</div><div className="text-foreground">{Math.round(v.blocks/1000)}k</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <AXCFooter />
    </div>
  )
}
