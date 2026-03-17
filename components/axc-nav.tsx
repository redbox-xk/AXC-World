"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useWallet } from "@/lib/wallet-context"
import {
  Wallet, BarChart3, Layers, Globe,
  Menu, X, ChevronDown, Zap, Gamepad2, ImageIcon,
  Plus, LogOut, RefreshCw, LayoutDashboard
} from "lucide-react"

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explorer", href: "/explorer", icon: BarChart3 },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Staking", href: "/staking", icon: Layers },
  { label: "NFT Market", href: "/nft", icon: ImageIcon },
  { label: "Game Panel", href: "/game", icon: Gamepad2 },
  { label: "Ecosystem", href: "/ecosystem", icon: Globe },
]

const networkStatus = { tps: 48312, latency: "0.4s", validators: 420 }

export function AXCNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const pathname = usePathname()
  
  const { 
    address, 
    isConnected, 
    isConnecting, 
    connectWallet, 
    createWallet, 
    disconnectWallet,
    balances 
  } = useWallet()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const [walletError, setWalletError] = useState<string | null>(null)
  const [newWalletInfo, setNewWalletInfo] = useState<{ address: string; privateKey: string; mnemonic: string } | null>(null)

  const handleConnectWallet = async () => {
    try {
      setWalletError(null)
      await connectWallet()
    } catch (e: any) {
      setWalletError(e?.message ?? "Connection failed")
    }
  }

  const handleCreateWallet = async () => {
    try {
      const result = await createWallet()
      setNewWalletInfo(result)
      setShowWalletMenu(false)
    } catch (e: any) {
      setWalletError(e?.message ?? "Wallet creation failed")
    }
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-panel border-b border-white/5 py-2"
            : "py-4 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 flex-shrink-0 hologram-float">
              <Image
                src="/aurexia-logo.png"
                alt="Aurexia Logo"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(100,150,255,0.8)]"
                priority
              />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight hologram-text">
                AUREXIA
              </span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-axc-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-axc-green" />
                </span>
                <span className="text-[9px] font-mono text-axc-green leading-none uppercase tracking-widest">Mainnet</span>
                <span className="text-[9px] font-mono text-muted-foreground leading-none">v2.4.1</span>
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-primary bg-primary/10 border border-primary/20 hologram-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-full border border-white/10 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-axc-green animate-pulse" />
              <span className="text-muted-foreground font-mono">{networkStatus.tps.toLocaleString()} TPS</span>
              <span className="w-px h-3 bg-border" />
              <Zap className="w-3 h-3 text-axc-gold" />
              <span className="text-muted-foreground font-mono">{networkStatus.latency}</span>
            </div>

            {isConnected && address ? (
              <div className="relative">
                <button 
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center gap-2 hologram-card border border-primary/30 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:hologram-glow transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-axc-green energy-pulse" />
                  <span className="font-mono">{truncate(address)}</span>
                  {balances.AXC && <span className="text-axc-gold">{balances.AXC} AXC</span>}
                  <ChevronDown className={cn("w-3 h-3 transition-transform", showWalletMenu && "rotate-180")} />
                </button>
                
                {showWalletMenu && (
                  <div className="absolute right-0 mt-2 w-48 hologram-card rounded-xl border border-white/10 py-2 shadow-2xl">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-white/5 transition-colors">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </Link>
                    <Link href="/wallet" className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-white/5 transition-colors">
                      <Wallet className="w-3.5 h-3.5" />
                      My Wallet
                    </Link>
                    <div className="border-t border-white/10 my-1" />
                    <button 
                      onClick={disconnectWallet}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-axc-red hover:bg-white/5 transition-colors w-full"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateWallet}
                  className="flex items-center gap-2 glass-panel border border-axc-gold/40 px-3 py-1.5 rounded-lg text-xs font-medium text-axc-gold hover:bg-axc-gold/10 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create
                </button>
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2 cyber-btn px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                >
                  {isConnecting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wallet className="w-3.5 h-3.5" />
                  )}
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden glass-panel border border-white/10 p-2 rounded-lg text-muted-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden hologram-card border-t border-white/5 mt-2 mx-4 rounded-xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => { handleCreateWallet(); setMobileOpen(false) }}
                className="w-full flex items-center justify-center gap-2 glass-panel border border-axc-gold/40 px-4 py-2.5 rounded-lg text-sm font-semibold text-axc-gold"
              >
                <Plus className="w-4 h-4" />
                Create New Wallet
              </button>
              <button
                onClick={() => { handleConnectWallet(); setMobileOpen(false) }}
                disabled={isConnecting}
                className="w-full flex items-center justify-center gap-2 cyber-btn px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
              >
                <Wallet className="w-4 h-4" />
                {isConnected && address ? truncate(address) : "Connect Wallet"}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Error toast */}
      {walletError && (
        <div className="fixed bottom-6 right-6 z-[200] glass-panel border border-axc-red/40 bg-axc-red/10 rounded-xl px-5 py-3 flex items-center gap-3 shadow-2xl max-w-sm">
          <span className="text-sm text-axc-red font-medium">{walletError}</span>
          <button onClick={() => setWalletError(null)} className="text-muted-foreground hover:text-foreground ml-2">✕</button>
        </div>
      )}

      {/* New wallet info modal */}
      {newWalletInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="hologram-card hologram-glow rounded-2xl p-8 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-axc-green">Wallet Created!</h2>
              <span className="text-xs font-mono text-axc-green bg-axc-green/10 px-2 py-1 rounded-full">Aurexia Chain</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="glass-panel rounded-xl p-3 space-y-1">
                <span className="text-xs text-muted-foreground font-mono uppercase">Address</span>
                <div className="font-mono text-xs text-foreground break-all">{newWalletInfo.address}</div>
              </div>
              <div className="glass-panel rounded-xl p-3 space-y-1">
                <span className="text-xs text-muted-foreground font-mono uppercase">Recovery Phrase</span>
                <div className="font-mono text-xs text-axc-gold break-words">{newWalletInfo.mnemonic}</div>
              </div>
              <div className="glass-panel rounded-xl p-3 space-y-1">
                <span className="text-xs text-muted-foreground font-mono uppercase">Private Key</span>
                <div className="font-mono text-xs text-axc-red break-all">{newWalletInfo.privateKey}</div>
              </div>
            </div>
            <p className="text-xs text-axc-red font-semibold">Save this information securely — it cannot be recovered!</p>
            <button
              onClick={() => setNewWalletInfo(null)}
              className="w-full cyber-btn text-white py-3 rounded-xl font-bold"
            >
              I have saved my keys
            </button>
          </div>
        </div>
      )}
    </>
  )
}
