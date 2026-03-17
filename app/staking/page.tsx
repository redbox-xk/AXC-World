"use client"

import { useState } from "react"
import {
  Layers, TrendingUp, Shield, Users, ChevronDown, CheckCircle,
  Lock, Unlock, BarChart2, Zap, Clock, ArrowRight, Info
} from "lucide-react"
import { GalaxyBackground } from "@/components/galaxy-background"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"
import { cn } from "@/lib/utils"
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const validators = [
  { name: "AXC-Alpha Node", staked: "2.4M", commission: "3%", apy: "18.4%", delegators: 8421, status: "active", color: "text-axc-blue" },
  { name: "Aurexia Staking Co.", staked: "1.8M", commission: "4%", apy: "17.8%", delegators: 6214, status: "active", color: "text-axc-gold" },
  { name: "Galaxy Validator", staked: "1.2M", commission: "2%", apy: "19.1%", delegators: 4888, status: "active", color: "text-axc-green" },
  { name: "DeepSpace Node", staked: "980K", commission: "5%", apy: "17.2%", delegators: 3241, status: "active", color: "text-axc-purple" },
  { name: "Nebula Staking", staked: "840K", commission: "3.5%", apy: "18.0%", delegators: 2817, status: "active", color: "text-axc-blue" },
  { name: "Cosmic Validator", staked: "720K", commission: "4.5%", apy: "17.5%", delegators: 2412, status: "active", color: "text-axc-gold" },
]

const stakingPools = [
  {
    id: 1,
    name: "Flexible Staking",
    apy: "12.8%",
    lockup: "No lock",
    minStake: "100 AXC",
    tvl: "$28.4M",
    reward: "AXC",
    tag: "Most Flexible",
    tagColor: "bg-axc-green/15 text-axc-green",
    icon: Unlock,
    desc: "Stake and unstake any time. Lower APY but maximum liquidity for your AXC holdings.",
  },
  {
    id: 2,
    name: "30-Day Staking",
    apy: "15.4%",
    lockup: "30 Days",
    minStake: "500 AXC",
    tvl: "$14.2M",
    reward: "AXC",
    tag: "Popular",
    tagColor: "bg-axc-blue/15 text-axc-blue",
    icon: Clock,
    desc: "Lock AXC for 30 days to earn enhanced rewards. Auto-compounding enabled.",
  },
  {
    id: 3,
    name: "90-Day Staking",
    apy: "18.4%",
    lockup: "90 Days",
    minStake: "1,000 AXC",
    tvl: "$21.7M",
    reward: "AXC + AXLP",
    tag: "Best APY",
    tagColor: "bg-axc-gold/15 text-axc-gold",
    icon: Lock,
    desc: "Maximum rewards for committed holders. Earn AXC plus liquidity pool tokens.",
  },
  {
    id: 4,
    name: "Validator Delegation",
    apy: "Up to 19.1%",
    lockup: "Unbonding: 21d",
    minStake: "10 AXC",
    tvl: "$47.8M",
    reward: "AXC",
    tag: "Decentralized",
    tagColor: "bg-axc-purple/15 text-axc-purple",
    icon: Users,
    desc: "Delegate to any of 420 validators. Directly support network security while earning.",
  },
]

const supplyData = [
  { name: "Staked", value: 62.4, fill: "oklch(0.65 0.22 220)" },
  { name: "Liquid", value: 24.2, fill: "oklch(0.72 0.18 55)" },
  { name: "Locked", value: 8.6, fill: "oklch(0.58 0.20 290)" },
  { name: "Burned", value: 4.8, fill: "oklch(0.55 0.22 15)" },
]

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState<number | null>(null)
  const [stakeAmount, setStakeAmount] = useState("")
  const [stakeSuccess, setStakeSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<"pools" | "validators" | "my">("pools")

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault()
    setStakeSuccess(true)
    setTimeout(() => { setStakeSuccess(false); setSelectedPool(null); setStakeAmount("") }, 3000)
  }

  const pool = stakingPools.find((p) => p.id === selectedPool)
  const estimatedRewards = stakeAmount
    ? ((Number(stakeAmount) * (parseFloat(pool?.apy ?? "18") / 100)) / 365).toFixed(4)
    : "0"

  return (
    <div className="relative min-h-screen bg-background">
      <GalaxyBackground />
      <AXCNav />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 glass-panel border border-white/10 rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-axc-gold" /> AurexiaPoS Staking
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            Earn with <span className="text-axc-gold text-glow-gold">AXC Staking</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Participate in Aurexia Chain consensus, secure the network, and earn up to 19.1% APY.
            Over 6.2M AXC staked by 284,720 delegators worldwide.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Staked", value: "6,240,000 AXC", sub: "62.4% of supply", icon: Lock, color: "text-axc-blue" },
            { label: "Total Stakers", value: "284,720", sub: "+5.7% this week", icon: Users, color: "text-axc-gold" },
            { label: "Best APY", value: "19.1%", sub: "Galaxy Validator", icon: TrendingUp, color: "text-axc-green" },
            { label: "Total Rewards Paid", value: "$12.4M", sub: "All time", icon: BarChart2, color: "text-axc-purple" },
          ].map((s) => (
            <div key={s.label} className="glass-panel border border-white/8 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground font-mono">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Supply Breakdown + APY Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supply donut */}
          <div className="glass-panel border border-white/8 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">AXC Supply Distribution</h3>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supplyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {supplyData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "oklch(0.09 0.018 260)", border: "1px solid oklch(0.18 0.03 250)", borderRadius: "8px", fontSize: "11px", fontFamily: "Space Mono" }}
                    formatter={(v: number) => [`${v}%`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {supplyData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="text-foreground font-semibold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* APY Calculator */}
          <div className="lg:col-span-2 glass-panel border border-white/8 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-foreground">Rewards Calculator</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Amount to Stake (AXC)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Staking Pool</label>
                <select
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:border-primary"
                  value={selectedPool ?? ""}
                  onChange={(e) => setSelectedPool(Number(e.target.value))}
                >
                  <option value="">Select pool...</option>
                  {stakingPools.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.apy}</option>
                  ))}
                </select>
              </div>
            </div>
            {stakeAmount && selectedPool && (
              <div className="glass-panel border border-primary/20 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Estimated Returns</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Daily", value: `${estimatedRewards} AXC` },
                    { label: "Weekly", value: `${(Number(estimatedRewards) * 7).toFixed(3)} AXC` },
                    { label: "Monthly", value: `${(Number(estimatedRewards) * 30).toFixed(2)} AXC` },
                    { label: "Yearly", value: `${(Number(estimatedRewards) * 365).toFixed(1)} AXC` },
                  ].map((r) => (
                    <div key={r.label} className="text-center glass-panel border border-white/8 rounded-xl p-3">
                      <div className="text-xs text-muted-foreground font-mono">{r.label}</div>
                      <div className="text-sm font-bold font-mono text-axc-green mt-1">{r.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Estimates based on current APY. Actual rewards may vary with network conditions.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 glass-panel border border-white/8 rounded-xl p-1 w-fit">
          {(["pools", "validators", "my"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {tab === "my" ? "My Staking" : tab === "pools" ? "Staking Pools" : "Validators"}
            </button>
          ))}
        </div>

        {/* Staking Pools */}
        {activeTab === "pools" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stakingPools.map((pool) => (
              <div
                key={pool.id}
                className={cn(
                  "glass-panel border rounded-2xl p-6 space-y-4 cursor-pointer transition-all hover:scale-[1.01]",
                  selectedPool === pool.id ? "border-primary/40 bg-primary/5" : "border-white/8 hover:border-white/20"
                )}
                onClick={() => setSelectedPool(selectedPool === pool.id ? null : pool.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <pool.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-foreground">{pool.name}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${pool.tagColor}`}>{pool.tag}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-axc-green">{pool.apy}</div>
                    <div className="text-xs text-muted-foreground">APY</div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{pool.desc}</p>

                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="glass-panel border border-white/8 rounded-lg p-2 text-center">
                    <div className="text-muted-foreground">Lock-up</div>
                    <div className="text-foreground font-semibold mt-0.5">{pool.lockup}</div>
                  </div>
                  <div className="glass-panel border border-white/8 rounded-lg p-2 text-center">
                    <div className="text-muted-foreground">Min Stake</div>
                    <div className="text-foreground font-semibold mt-0.5">{pool.minStake}</div>
                  </div>
                  <div className="glass-panel border border-white/8 rounded-lg p-2 text-center">
                    <div className="text-muted-foreground">TVL</div>
                    <div className="text-foreground font-semibold mt-0.5">{pool.tvl}</div>
                  </div>
                </div>

                {selectedPool === pool.id && (
                  <form onSubmit={handleStake} className="space-y-3 pt-2 border-t border-white/5">
                    {stakeSuccess ? (
                      <div className="flex items-center justify-center gap-3 py-4 text-axc-green">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-semibold">Staking transaction submitted!</span>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder={`Min ${pool.minStake}`}
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            required
                            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary pr-14"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">AXC</span>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-bold text-sm transition-all"
                        >
                          Stake Now — Earn {pool.apy}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Validators */}
        {activeTab === "validators" && (
          <div className="glass-panel border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Validator</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Staked</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">APY</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Commission</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Delegators</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {validators.map((v) => (
                  <tr key={v.name} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className={`text-xs font-bold ${v.color}`}>{v.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{v.name}</div>
                          <div className="flex items-center gap-1 text-xs text-axc-green">
                            <span className="w-1.5 h-1.5 rounded-full bg-axc-green" />
                            {v.status}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-foreground">{v.staked} AXC</td>
                    <td className="p-4 text-right font-mono font-bold text-axc-green">{v.apy}</td>
                    <td className="p-4 text-right font-mono text-muted-foreground">{v.commission}</td>
                    <td className="p-4 text-right font-mono text-foreground">{v.delegators.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <button className="text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all">
                        Delegate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* My Staking */}
        {activeTab === "my" && (
          <div className="space-y-4">
            <div className="gradient-border glass-panel rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-foreground">My Staking Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Staked", value: "10,000 AXC", usd: "$28,470", color: "text-axc-blue" },
                  { label: "Total Earned", value: "142.88 AXC", usd: "$406.61", color: "text-axc-green" },
                  { label: "Avg APY", value: "18.4%", usd: "Current rate", color: "text-axc-gold" },
                  { label: "Next Reward", value: "~24 hrs", usd: "Est. 2.4 AXC", color: "text-axc-purple" },
                ].map((s) => (
                  <div key={s.label} className="glass-panel border border-white/10 rounded-xl p-4 text-center">
                    <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{s.usd}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel border border-white/8 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Active Positions</h3>
              {[
                { pool: "90-Day Staking", amount: "10,000 AXC", apy: "18.4%", unlock: "61 days remaining", earned: "142.88 AXC", color: "text-axc-gold" },
              ].map((pos) => (
                <div key={pos.pool} className="glass-panel border border-axc-gold/20 rounded-xl p-5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-axc-gold/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-axc-gold" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{pos.pool}</div>
                        <div className="text-xs text-muted-foreground">{pos.unlock}</div>
                      </div>
                    </div>
                    <div className="flex gap-6 flex-wrap text-center text-xs font-mono">
                      <div>
                        <div className="text-muted-foreground">Staked</div>
                        <div className="text-foreground font-bold">{pos.amount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">APY</div>
                        <div className="text-axc-green font-bold">{pos.apy}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Earned</div>
                        <div className="text-axc-green font-bold">{pos.earned}</div>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-axc-green border border-axc-green/30 hover:bg-axc-green/10 px-3 py-1.5 rounded-lg transition-all">
                      Claim Rewards
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AXCFooter />
    </div>
  )
}
