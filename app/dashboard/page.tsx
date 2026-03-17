"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Wallet, Send, ArrowDownToLine, ArrowUpFromLine, RefreshCw,
  Copy, ExternalLink, QrCode, TrendingUp, TrendingDown,
  Shield, Zap, Crown, Clock, CheckCircle2, XCircle,
  Plus, ChevronDown, Eye, EyeOff, Sparkles
} from "lucide-react"
import { GalaxyBackground } from "@/components/galaxy-background"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"
import { useWallet, SUPPORTED_TOKENS } from "@/lib/wallet-context"

// Token data with live prices (simulated)
const tokenData = [
  { symbol: "AXC", name: "Aurexia Coin", price: 1.42, change: 12.4, icon: "/aurexia-logo.png", color: "text-axc-gold" },
  { symbol: "ETH", name: "Ethereum", price: 3842.50, change: 2.8, icon: null, color: "text-axc-blue" },
  { symbol: "USDC", name: "USD Coin", price: 1.00, change: 0.01, icon: null, color: "text-axc-green" },
  { symbol: "DAI", name: "Dai Stablecoin", price: 1.00, change: -0.02, icon: null, color: "text-axc-purple" },
]

// Recent transactions (simulated)
const recentTransactions = [
  { id: "0x1a2b...3c4d", type: "receive", amount: "500 AXC", from: "0x8f4e...2a1b", time: "2 min ago", status: "confirmed" },
  { id: "0x5e6f...7g8h", type: "send", amount: "0.05 ETH", to: "0x3c4d...5e6f", time: "15 min ago", status: "confirmed" },
  { id: "0x9i0j...1k2l", type: "receive", amount: "1,200 AXC", from: "Staking Rewards", time: "1 hour ago", status: "confirmed" },
  { id: "0x3m4n...5o6p", type: "swap", amount: "100 USDC → 70 AXC", time: "3 hours ago", status: "confirmed" },
  { id: "0x7q8r...9s0t", type: "nft", amount: "NFT #2847", time: "Yesterday", status: "confirmed" },
]

// Staking info
const stakingInfo = {
  stakedAmount: "15,420 AXC",
  rewards: "847.32 AXC",
  apy: "24.5%",
  lockPeriod: "14 days remaining",
}

// NFT holdings
const nftHoldings = [
  { id: 1, name: "Auron the Eternal", video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%20a719b443-6e9d-400e-8ad4-d8a64f273888%20generated%20video-kU4izvFG7RQeZJ4CoFJp6evQEgxKW2.mp4", rarity: "Legendary", power: 9850 },
  { id: 2, name: "Nova Surge", video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%205bded015-01b7-44f0-8d16-e3e085f24649%20generated%20video-VZlfnEGk1GAvOrlehgAFlhYFkdoszu.mp4", rarity: "Legendary", power: 9100 },
]

export default function Dashboard() {
  const { 
    address, 
    isConnected, 
    connectWallet, 
    balances, 
    refreshBalances,
    sendTransaction,
    disconnectWallet 
  } = useWallet()
  
  const [showBalances, setShowBalances] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [sendForm, setSendForm] = useState({ to: "", amount: "", token: "AXC" })
  const [copied, setCopied] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalances()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSend = async () => {
    if (!sendForm.to || !sendForm.amount) return
    try {
      const txHash = await sendTransaction(sendForm.to, sendForm.amount, sendForm.token)
      alert(`Transaction sent!\nHash: ${txHash}`)
      setShowSendModal(false)
      setSendForm({ to: "", amount: "", token: "AXC" })
    } catch (err: any) {
      alert(`Transaction failed: ${err.message}`)
    }
  }

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    let total = 0
    tokenData.forEach(token => {
      const balance = parseFloat(balances[token.symbol] || "0")
      total += balance * token.price
    })
    return total.toFixed(2)
  }

  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-background scan-lines">
        <GalaxyBackground />
        <AXCNav />
        <main className="relative z-10 pt-28 pb-20 flex items-center justify-center min-h-[80vh]">
          <div className="hologram-card rounded-3xl p-8 max-w-md w-full text-center neon-border mx-4">
            <div className="w-20 h-20 rounded-full bg-axc-blue/20 flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-axc-blue" />
            </div>
            <h1 className="text-3xl font-bold hologram-text mb-4">Access Your Empire</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to access your sovereign dashboard. 
              View assets, manage crypto, and command your digital realm.
            </p>
            <button
              onClick={connectWallet}
              className="w-full cyber-btn py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Or <button className="text-axc-gold hover:underline">create a new wallet</button>
            </p>
          </div>
        </main>
        <AXCFooter />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background scan-lines">
      <GalaxyBackground />
      <AXCNav />

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="hologram-card rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ArrowUpFromLine className="w-5 h-5 text-axc-blue" />
              Send Crypto
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Token</label>
                <select
                  value={sendForm.token}
                  onChange={(e) => setSendForm({ ...sendForm, token: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50"
                >
                  {tokenData.map(t => (
                    <option key={t.symbol} value={t.symbol}>{t.symbol} - {t.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={sendForm.to}
                  onChange={(e) => setSendForm({ ...sendForm, to: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground font-mono mb-1 block">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={sendForm.amount}
                    onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary/50 font-mono"
                  />
                  <button 
                    onClick={() => setSendForm({ ...sendForm, amount: balances[sendForm.token] || "0" })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-axc-gold font-bold"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Available: {balances[sendForm.token] || "0"} {sendForm.token}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-3 rounded-xl font-medium text-muted-foreground bg-white/5 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 cyber-btn py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="hologram-card rounded-2xl p-6 max-w-md w-full text-center">
            <h3 className="text-xl font-bold mb-6 flex items-center justify-center gap-2">
              <ArrowDownToLine className="w-5 h-5 text-axc-green" />
              Receive Crypto
            </h3>
            
            <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-black" />
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">Your Wallet Address</p>
            <div className="flex items-center justify-center gap-2 bg-white/5 rounded-xl px-4 py-3 mb-4">
              <span className="font-mono text-sm truncate max-w-[200px]">{address}</span>
              <button onClick={handleCopyAddress} className="text-axc-blue hover:text-axc-gold transition-colors">
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground mb-6">
              Send any supported token to this address on Base Mainnet
            </p>
            
            <button
              onClick={() => setShowReceiveModal(false)}
              className="w-full py-3 rounded-xl font-medium text-muted-foreground bg-white/5 border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10 pt-28 pb-20">
        {/* Header */}
        <section className="px-4 max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 hologram-card rounded-full px-4 py-1.5 text-[10px] font-mono mb-3">
                <Crown className="w-3 h-3 text-axc-gold" />
                <span className="text-axc-gold">SOVEREIGN DASHBOARD</span>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-axc-green">BASE MAINNET</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold hologram-text">
                Welcome, Sovereign
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hologram-card p-3 rounded-xl hover:hologram-glow transition-all"
              >
                <RefreshCw className={`w-5 h-5 text-axc-blue ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              <div className="hologram-card rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-axc-green energy-pulse" />
                <span className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <button onClick={handleCopyAddress}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-axc-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Value */}
        <section className="px-4 max-w-7xl mx-auto mb-8">
          <div className="hologram-card rounded-2xl p-6 neon-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Total Portfolio Value</span>
                  <button onClick={() => setShowBalances(!showBalances)}>
                    {showBalances ? <Eye className="w-4 h-4 text-muted-foreground" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                <div className="text-4xl md:text-5xl font-bold hologram-text">
                  {showBalances ? `$${calculatePortfolioValue()}` : "••••••"}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-axc-green" />
                  <span className="text-sm text-axc-green">+$1,247.82 (8.4%) today</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSendModal(true)}
                  className="flex-1 md:flex-none cyber-btn px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                >
                  <ArrowUpFromLine className="w-4 h-4" />
                  Send
                </button>
                <button
                  onClick={() => setShowReceiveModal(true)}
                  className="flex-1 md:flex-none hologram-card px-6 py-3 rounded-xl font-bold text-foreground flex items-center justify-center gap-2 hover:hologram-glow transition-all"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  Receive
                </button>
                <Link
                  href="/staking"
                  className="flex-1 md:flex-none hologram-card px-6 py-3 rounded-xl font-bold text-axc-gold flex items-center justify-center gap-2 hover:hologram-glow transition-all border border-axc-gold/30"
                >
                  <Sparkles className="w-4 h-4" />
                  Stake
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Token Holdings */}
          <div className="lg:col-span-2">
            <div className="hologram-card rounded-2xl p-5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-axc-blue" />
                Your Assets
              </h3>
              
              <div className="space-y-3">
                {tokenData.map((token) => (
                  <div 
                    key={token.symbol}
                    className="glass-panel rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${token.symbol === "AXC" ? "" : "bg-white/10"} flex items-center justify-center overflow-hidden`}>
                          {token.icon ? (
                            <Image src={token.icon} alt={token.symbol} width={40} height={40} className="object-contain" />
                          ) : (
                            <span className={`text-lg font-bold ${token.color}`}>{token.symbol[0]}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold">{token.name}</div>
                          <div className="text-xs text-muted-foreground">{token.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold font-mono">
                          {showBalances ? (balances[token.symbol] || "0.00") : "••••"}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {showBalances ? `$${(parseFloat(balances[token.symbol] || "0") * token.price).toFixed(2)}` : "••••"}
                        </div>
                      </div>
                      
                      <div className="text-right min-w-[80px]">
                        <div className="font-mono text-sm">${token.price.toLocaleString()}</div>
                        <div className={`text-xs font-mono flex items-center justify-end gap-1 ${token.change >= 0 ? "text-axc-green" : "text-axc-red"}`}>
                          {token.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {token.change >= 0 ? "+" : ""}{token.change}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-3 rounded-xl text-sm font-medium text-axc-blue bg-axc-blue/10 border border-axc-blue/30 hover:bg-axc-blue/20 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Custom Token
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Staking Card */}
            <div className="hologram-card rounded-2xl p-5 border border-axc-gold/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-axc-gold" />
                Active Stake
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staked</span>
                  <span className="font-bold text-axc-gold">{stakingInfo.stakedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rewards</span>
                  <span className="font-bold text-axc-green">{stakingInfo.rewards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APY</span>
                  <span className="font-bold text-foreground">{stakingInfo.apy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lock</span>
                  <span className="font-mono text-xs text-muted-foreground">{stakingInfo.lockPeriod}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 cyber-btn py-2.5 rounded-xl text-sm font-bold text-white">
                Claim Rewards
              </button>
            </div>

            {/* NFT Holdings */}
            <div className="hologram-card rounded-2xl p-5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-axc-purple" />
                Your Legends
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {nftHoldings.map((nft) => (
                  <div key={nft.id} className="glass-panel rounded-xl overflow-hidden border border-white/10">
                    <div className="aspect-square relative">
                      <video src={nft.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-axc-gold/80 text-black">
                        {nft.rarity}
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-bold truncate">{nft.name}</div>
                      <div className="text-[10px] text-axc-gold font-mono">{nft.power.toLocaleString()} PWR</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/nft" className="block w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-center text-axc-purple bg-axc-purple/10 border border-axc-purple/30 hover:bg-axc-purple/20 transition-all">
                View All NFTs
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <section className="px-4 max-w-7xl mx-auto mt-6">
          <div className="hologram-card rounded-2xl p-5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-axc-blue" />
              Recent Activity
            </h3>
            
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "receive" ? "bg-axc-green/20" :
                      tx.type === "send" ? "bg-axc-red/20" :
                      tx.type === "swap" ? "bg-axc-purple/20" :
                      "bg-axc-gold/20"
                    }`}>
                      {tx.type === "receive" ? <ArrowDownToLine className="w-4 h-4 text-axc-green" /> :
                       tx.type === "send" ? <ArrowUpFromLine className="w-4 h-4 text-axc-red" /> :
                       tx.type === "swap" ? <RefreshCw className="w-4 h-4 text-axc-purple" /> :
                       <Crown className="w-4 h-4 text-axc-gold" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm capitalize">{tx.type}</div>
                      <div className="text-xs text-muted-foreground font-mono">{tx.id}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold text-sm ${tx.type === "receive" ? "text-axc-green" : ""}`}>
                      {tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}{tx.amount}
                    </div>
                    <div className="text-xs text-muted-foreground">{tx.time}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-axc-green" />
                    <a href="#" className="text-axc-blue hover:underline">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              View All Transactions
            </button>
          </div>
        </section>
      </main>

      <AXCFooter />
    </div>
  )
}
