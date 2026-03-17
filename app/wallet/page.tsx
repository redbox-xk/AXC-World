"use client"

import { useState } from "react"
import {
  Wallet, Copy, ArrowUpRight, ArrowDownLeft, ArrowRightLeft,
  QrCode, Eye, EyeOff, Plus,
  Shield, CheckCircle, Clock, ExternalLink,
  Send, Download, RefreshCw, Sparkles, Star, Layers
} from "lucide-react"
import Image from "next/image"
import { GalaxyBackground } from "@/components/galaxy-background"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"
import { cn } from "@/lib/utils"
import { useWallet } from "@/lib/wallet-context"

function generateTxHash() {
  const chars = "0123456789abcdef"
  return "0x" + Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * 16)]).join("")
}

const txHistory = [
  { type: "receive", hash: generateTxHash(), from: "0xABCd...4412", to: "You", amount: "+500 AXC", usd: "+$711.00", time: "2 min ago", status: "confirmed" },
  { type: "send", hash: generateTxHash(), from: "You", to: "AXC Bridge", amount: "-1,000 AXC", usd: "-$1,420.00", time: "1 hour ago", status: "confirmed" },
  { type: "stake", hash: generateTxHash(), from: "You", to: "Staking Pool #12", amount: "-10,000 AXC", usd: "-$14,200.00", time: "3 hours ago", status: "confirmed" },
  { type: "receive", hash: generateTxHash(), from: "AurexiaDEX", to: "You", amount: "+142.88 AXC", usd: "+$202.89", time: "6 hours ago", status: "confirmed" },
  { type: "swap", hash: generateTxHash(), from: "2.0 ETH", to: "5,694 AXC", amount: "Swap", usd: "$7,684.00", time: "1 day ago", status: "confirmed" },
  { type: "send", hash: generateTxHash(), from: "You", to: "0x9f3c...7711", amount: "-250 AXC", usd: "-$355.00", time: "2 days ago", status: "confirmed" },
]

const TABS = ["Portfolio", "Transactions", "NFTs", "DeFi Positions"]

// Token definitions with static prices for display
const TOKEN_CONFIG = [
  { symbol: "AXC", name: "Aurexia Coin", priceUsd: 1.42, change: "+4.72%", positive: true, color: "text-axc-gold" },
  { symbol: "ETH", name: "Ethereum", priceUsd: 3842.50, change: "+2.14%", positive: true, color: "text-axc-blue" },
  { symbol: "USDC", name: "USD Coin", priceUsd: 1.00, change: "+0.01%", positive: true, color: "text-axc-green" },
  { symbol: "DAI", name: "Dai Stablecoin", priceUsd: 1.00, change: "-0.02%", positive: false, color: "text-axc-purple" },
]

export default function WalletPage() {
  const {
    isConnected,
    address,
    balances,
    connectWallet,
    createWallet,
    disconnectWallet,
  } = useWallet()

  const [activeTab, setActiveTab] = useState("Portfolio")
  const [hideBalance, setHideBalance] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sendOpen, setSendOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [sendAmount, setSendAmount] = useState("")
  const [sendTo, setSendTo] = useState("")
  const [sendSuccess, setSendSuccess] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const truncAddress = address
    ? `${address.slice(0, 8)}...${address.slice(-6)}`
    : "0x0000...000000"

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    setSendSuccess(true)
    setTimeout(() => {
      setSendSuccess(false)
      setSendOpen(false)
      setSendAmount("")
      setSendTo("")
    }, 2500)
  }

  // Build enriched token list from wallet balances
  const tokens = TOKEN_CONFIG.map((cfg) => {
    const balance = parseFloat(balances[cfg.symbol] || "0")
    return { ...cfg, balance, usd: balance * cfg.priceUsd }
  })

  const totalUsd = tokens.reduce((acc, t) => acc + t.usd, 0)
  const axcBalance = parseFloat(balances["AXC"] || "0")

  return (
    <div className="relative min-h-screen bg-background">
      <GalaxyBackground />
      <AXCNav />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {!isConnected ? (
          /* ─── Connect Wallet Screen ─── */
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
            <div className="hologram-card hologram-glow rounded-3xl p-12 max-w-md w-full space-y-8 scan-lines">
              <div className="relative w-24 h-24 mx-auto hologram-float">
                <Image
                  src="/aurexia-logo.png"
                  alt="Aurexia"
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(100,150,255,0.8)]"
                />
                <div className="absolute inset-0 rounded-full energy-pulse" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold hologram-text">AUREXIA WALLET</h1>
                <p className="text-muted-foreground leading-relaxed">
                  Enter the future of decentralized finance. Connect or create your Aurexia Chain wallet to unlock unlimited possibilities.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => connectWallet()}
                  className="w-full flex items-center justify-center gap-2 cyber-btn text-white px-6 py-4 rounded-xl text-base font-bold transition-all"
                >
                  <Wallet className="w-5 h-5" /> Connect Existing Wallet
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center justify-center gap-2 hologram-card border border-primary/30 hover:border-primary/60 px-6 py-3.5 rounded-xl text-sm font-semibold text-foreground transition-all neon-border"
                >
                  <Plus className="w-4 h-4" /> Create New Wallet
                </button>
              </div>
              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-axc-green" />
                <span>Non-custodial · Military-grade encryption · Your keys, your sovereignty</span>
              </div>
            </div>

            {/* Create Wallet Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="hologram-card hologram-glow rounded-2xl p-8 max-w-md w-full space-y-6 scan-lines">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold hologram-text">Create New Wallet</h2>
                    <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your wallet will be generated with military-grade cryptographic security. Store your recovery phrase safely — it can never be recovered if lost.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={() => { createWallet(); setShowCreateModal(false) }}
                      className="w-full cyber-btn text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" /> Generate Wallet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─── Wallet Dashboard ─── */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{truncAddress}</span>
                  <button onClick={copyAddress} className="text-muted-foreground hover:text-primary transition-colors">
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-axc-green" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span className="w-2 h-2 rounded-full bg-axc-green animate-pulse" />
                  <span className="text-xs font-mono text-axc-green">Aurexia Mainnet</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHideBalance(!hideBalance)}
                  className="flex items-center gap-2 glass-panel border border-white/10 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all"
                >
                  {hideBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {hideBalance ? "Show Balance" : "Hide Balance"}
                </button>
                <button
                  onClick={() => disconnectWallet()}
                  className="flex items-center gap-2 glass-panel border border-white/10 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-red-400 transition-all"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Balance Card */}
            <div className="gradient-border glass-panel rounded-2xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Total Balance */}
                <div className="lg:col-span-2 space-y-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Total Portfolio Value</span>
                  <div className="text-5xl font-bold font-mono text-primary">
                    {hideBalance ? "••••••" : `$${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-muted-foreground font-mono">
                      {hideBalance ? "•••••" : `${axcBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })} AXC`}
                    </span>
                    <span className="text-xs bg-axc-green/15 text-axc-green px-2 py-0.5 rounded-full font-mono">+$3,342.50 today</span>
                  </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-panel border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold font-mono text-axc-gold">
                      {hideBalance ? "••••" : "10,000"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">AXC Staked</div>
                  </div>
                  <div className="glass-panel border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold font-mono text-axc-green">
                      {hideBalance ? "••••" : "142.88"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Rewards Pending</div>
                  </div>
                  <div className="glass-panel border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold font-mono text-axc-blue">18.4%</div>
                    <div className="text-xs text-muted-foreground mt-1">APY Earned</div>
                  </div>
                  <div className="glass-panel border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold font-mono text-axc-purple">420</div>
                    <div className="text-xs text-muted-foreground mt-1">Validator Rank</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/5">
                <button
                  onClick={() => setSendOpen(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" /> Send AXC
                </button>
                <button
                  onClick={() => setReceiveOpen(true)}
                  className="flex items-center gap-2 glass-panel border border-white/15 hover:border-primary/30 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground transition-all"
                >
                  <Download className="w-4 h-4" /> Receive
                </button>
                <button className="flex items-center gap-2 glass-panel border border-white/15 hover:border-accent/40 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground transition-all">
                  <ArrowRightLeft className="w-4 h-4" /> Swap
                </button>
                <button className="flex items-center gap-2 glass-panel border border-white/15 hover:border-white/30 px-5 py-2.5 rounded-xl text-sm font-semibold text-foreground transition-all">
                  <RefreshCw className="w-4 h-4" /> Bridge
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 glass-panel border border-white/8 rounded-xl p-1 w-fit flex-wrap">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Portfolio" && (
              <div className="glass-panel border border-white/8 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Token</th>
                      <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">Balance</th>
                      <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">USD Value</th>
                      <th className="text-right p-4 text-xs font-mono text-muted-foreground uppercase tracking-wider">24h Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token) => (
                      <tr key={token.symbol} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center">
                              <span className={`text-xs font-bold ${token.color}`}>{token.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-foreground">{token.symbol}</div>
                              <div className="text-xs text-muted-foreground">{token.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono text-sm text-foreground">
                          {hideBalance ? "••••" : token.balance.toLocaleString("en-US", { maximumFractionDigits: 6 })}
                        </td>
                        <td className="p-4 text-right font-mono text-sm text-foreground">
                          {hideBalance ? "••••" : `$${token.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </td>
                        <td className="p-4 text-right">
                          <span className={`text-xs font-mono font-semibold ${token.positive ? "text-axc-green" : "text-axc-red"}`}>
                            {token.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Transactions" && (
              <div className="space-y-2.5">
                {txHistory.map((tx, i) => (
                  <div key={i} className="glass-panel border border-white/8 rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-all">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      tx.type === "receive" ? "bg-axc-green/15" :
                      tx.type === "send" ? "bg-axc-red/15" :
                      tx.type === "stake" ? "bg-axc-gold/15" : "bg-axc-blue/15"
                    )}>
                      {tx.type === "receive" ? <ArrowDownLeft className="w-5 h-5 text-axc-green" /> :
                       tx.type === "send" ? <ArrowUpRight className="w-5 h-5 text-axc-red" /> :
                       tx.type === "stake" ? <Layers className="w-5 h-5 text-axc-gold" /> :
                       <ArrowRightLeft className="w-5 h-5 text-axc-blue" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground capitalize">{tx.type}</span>
                        <span className="text-xs bg-axc-green/15 text-axc-green px-1.5 py-0.5 rounded font-mono">{tx.status}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                        {tx.from} → {tx.to}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-bold font-mono ${tx.type === "receive" ? "text-axc-green" : "text-foreground"}`}>
                        {hideBalance ? "••••" : tx.amount}
                      </div>
                      <div className="text-xs text-muted-foreground">{tx.time}</div>
                    </div>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "NFTs" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="glass-panel border border-white/8 rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                    <div
                      className="h-40 flex items-center justify-center relative"
                      style={{
                        background: `radial-gradient(ellipse at center, 
                          oklch(${0.3 + i * 0.05} ${0.18 + i * 0.02} ${(i * 47 + 220) % 360}) 0%, 
                          oklch(0.08 0.02 260) 100%)`
                      }}
                    >
                      <div className="text-4xl font-bold font-mono text-white/20">AXC</div>
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur rounded-md px-2 py-0.5 text-xs font-mono text-white">#00{i + 1}</div>
                      <div className="absolute bottom-2 left-2">
                        <Star className="w-3 h-3 text-axc-gold fill-current" />
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-semibold text-foreground">AXC Genesis #{i + 1}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">AurexiaNFT Collection</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-mono text-axc-gold">Floor: 45 AXC</span>
                        <span className="text-xs text-muted-foreground">Rank #{280 + i * 13}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "DeFi Positions" && (
              <div className="space-y-3">
                {[
                  { protocol: "AXC Staking", type: "Stake", deposited: "10,000 AXC", value: "$14,200", earned: "142.88 AXC", apy: "18.4%", color: "text-axc-blue", bg: "bg-axc-blue/10" },
                  { protocol: "AurexiaDEX", type: "Liquidity", deposited: "AXC/USDC LP", value: "$3,721", earned: "89.2 AXC", apy: "24.7%", color: "text-axc-gold", bg: "bg-axc-gold/10" },
                  { protocol: "AXC Lend", type: "Lending", deposited: "5,000 USDC", value: "$5,000", earned: "128.5 USDC", apy: "8.2%", color: "text-axc-green", bg: "bg-axc-green/10" },
                ].map((pos) => (
                  <div key={pos.protocol} className="glass-panel border border-white/8 rounded-xl p-5 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${pos.bg} flex items-center justify-center`}>
                          <span className={`text-xs font-bold ${pos.color}`}>{pos.protocol.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{pos.protocol}</div>
                          <div className="text-xs text-muted-foreground">{pos.type}</div>
                        </div>
                      </div>
                      <div className="flex gap-6 flex-wrap">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Deposited</div>
                          <div className="text-sm font-mono font-semibold text-foreground">{pos.deposited}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">USD Value</div>
                          <div className="text-sm font-mono font-semibold text-foreground">{pos.value}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Earned</div>
                          <div className="text-sm font-mono font-semibold text-axc-green">{pos.earned}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">APY</div>
                          <div className={`text-sm font-mono font-semibold ${pos.color}`}>{pos.apy}</div>
                        </div>
                      </div>
                      <button className="text-xs font-semibold text-primary hover:underline">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Send Modal ─── */}
        {sendOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-panel border border-white/15 rounded-2xl p-6 w-full max-w-md space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Send AXC</h3>
                <button onClick={() => setSendOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              {sendSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle className="w-16 h-16 text-axc-green mx-auto" />
                  <div className="text-xl font-bold text-foreground">Transaction Sent!</div>
                  <div className="text-sm text-muted-foreground font-mono">Broadcasting to Aurexia Chain mainnet...</div>
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Recipient Address</label>
                    <input
                      type="text"
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value)}
                      placeholder="0x..."
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground uppercase">Amount (AXC)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 pr-16 transition-colors"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary">MAX</button>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Available: {axcBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })} AXC
                    </div>
                  </div>
                  <div className="glass-panel border border-white/8 rounded-xl p-3 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span className="text-foreground">~0.002 AXC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Time</span>
                      <span className="text-axc-green">~0.4 seconds</span>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 rounded-xl font-bold transition-all">
                    Confirm &amp; Send
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ─── Receive Modal ─── */}
        {receiveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-panel border border-white/15 rounded-2xl p-6 w-full max-w-sm space-y-5 text-center">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Receive AXC</h3>
                <button onClick={() => setReceiveOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>
              <div className="w-48 h-48 mx-auto glass-panel border border-white/15 rounded-2xl flex items-center justify-center">
                <QrCode className="w-24 h-24 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-mono break-all">{address}</p>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 mx-auto text-xs text-primary hover:underline"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Address"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Only send AXC and ARC-20 tokens to this address on Aurexia Chain.</p>
            </div>
          </div>
        )}
      </main>

      <AXCFooter />
    </div>
  )
}
