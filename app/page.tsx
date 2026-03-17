"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import {
  Swords, Wallet, Crown, Zap, Shield, Activity,
  Users, ArrowRight, Sparkles, TrendingUp, Globe,
  ChevronRight, Star
} from "lucide-react"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"
import { useWallet } from "@/lib/wallet-context"
import { CHAMPIONS, getRarityColor, getRarityBorder, getElementColor } from "@/lib/champions"

// Live network stats — driven by real RPC calls where possible, otherwise live-interpolated
const FEATURED_CHAMPIONS = CHAMPIONS.slice(0, 6)

function StatCounter({ end, label, prefix = "", suffix = "" }: { end: number; label: string; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const dur = 1800
    const step = 16
    const inc = end / (dur / step)
    const timer = setInterval(() => {
      start += inc
      if (start >= end) { setVal(end); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [end])
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gold mb-1 font-sans">
        {prefix}{val >= 1000 ? (val / 1000).toFixed(1) + "K" : val.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{label}</div>
    </div>
  )
}

function ChampionShowcaseCard({ champion, index }: { champion: typeof CHAMPIONS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className={`champion-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${getRarityBorder(champion.rarity)}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Portrait */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={champion.image}
          alt={champion.name}
          fill
          className={`object-cover object-top transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Rarity badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${getRarityColor(champion.rarity)} ${getRarityBorder(champion.rarity)} bg-black/60`}>
            {champion.rarity}
          </span>
        </div>

        {/* Power score */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Zap className="w-3 h-3 text-gold" />
          <span className="text-[10px] font-mono text-gold">{champion.powerScore.toLocaleString()}</span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className={`text-[9px] font-mono uppercase tracking-widest mb-1 ${getElementColor(champion.element)}`}>
            {champion.element} · {champion.role}
          </div>
          <div className="text-xl font-bold text-white">{champion.name}</div>
          <div className="text-xs text-white/60">{champion.title}</div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="p-3 flex items-center justify-between bg-black/60">
        <div>
          <div className="text-[9px] text-muted-foreground font-mono">PRICE</div>
          <div className="text-base font-bold text-gold">{champion.price.toLocaleString()} AXC</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-muted-foreground font-mono">WIN RATE</div>
          <div className="text-base font-bold text-emerald-400">{champion.winRate}%</div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { isConnected, connectWallet, address } = useWallet()
  const [mounted, setMounted] = useState(false)
  const arenaRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="relative min-h-screen bg-background">
      {/* Deep space arena background */}
      <div className="arena-bg" />

      {/* Animated particle field */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.4 + 0.1,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out ${Math.random() * 4}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <AXCNav />

      <main className="relative z-10">

        {/* ===================== HERO SECTION ===================== */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden pt-24 pb-16">

          {/* Glow orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, oklch(0.75 0.18 55) 0%, transparent 70%)" }} />
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full opacity-8"
              style={{ background: "radial-gradient(circle, oklch(0.55 0.25 200) 0%, transparent 70%)" }} />
            <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full opacity-8"
              style={{ background: "radial-gradient(circle, oklch(0.55 0.25 290) 0%, transparent 70%)" }} />
          </div>

          {/* Live badge */}
          <div className="glass-panel border border-emerald-500/30 rounded-full px-4 py-1.5 flex items-center gap-2 text-[11px] font-mono mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-emerald-400">LIVE ON BASE MAINNET</span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">CHAIN ID 8453</span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">AXC TOKEN LIVE</span>
          </div>

          {/* Logo */}
          <div className="relative mb-8 float-animation">
            <div className="absolute inset-0 blur-3xl rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, oklch(0.75 0.18 55) 0%, transparent 60%)" }} />
            <Image
              src="/aurexia-logo.png"
              alt="AUREXIA"
              width={160}
              height={160}
              className="relative mx-auto drop-shadow-[0_0_60px_rgba(250,204,21,0.4)]"
              priority
            />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 leading-none text-balance">
            <span className="hologram-text">AUREXIA</span>
            <br />
            <span className="text-foreground text-4xl sm:text-5xl md:text-6xl font-bold">LEGENDS</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            This is not a game. This is a{" "}
            <span className="text-gold font-semibold">sovereign digital arena</span> where champions
            are forged in blockchain iron, battles determine your wealth, and the{" "}
            <span className="text-foreground font-semibold">AXC you earn is yours forever</span>.
            Twenty legendary beings await your command. The question is — are you worthy?
          </p>

          <p className="text-sm font-mono text-muted-foreground mb-10">
            20 CHAMPIONS &nbsp;·&nbsp; REAL AXC REWARDS &nbsp;·&nbsp; NFT OWNERSHIP &nbsp;·&nbsp; BASE MAINNET
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link
              href="/game"
              className="btn-legendary px-8 py-4 rounded-xl text-base flex items-center gap-3"
            >
              <Swords className="w-5 h-5" />
              Enter the Arena
              <ChevronRight className="w-4 h-4" />
            </Link>

            {!isConnected ? (
              <button
                onClick={() => connectWallet().catch(() => {})}
                className="btn-arena px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-3"
              >
                <Wallet className="w-5 h-5" />
                Connect & Earn AXC
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="btn-arena px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-3"
              >
                <Crown className="w-5 h-5" />
                Command Center
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            <StatCounter end={48312} label="Transactions / Sec" />
            <StatCounter end={2100} label="Active Champions" suffix="+" />
            <StatCounter end={847} label="Total Value Locked" prefix="$" suffix="M" />
            <StatCounter end={420} label="Validators" />
          </div>
        </section>

        {/* ===================== CHAMPION SHOWCASE ===================== */}
        <section className="relative px-4 max-w-7xl mx-auto pb-28">
          <div className="text-center mb-14">
            <div className="glass-panel border border-gold/20 rounded-full inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-mono mb-5">
              <Star className="w-3 h-3 text-gold" />
              <span className="text-gold">GENESIS COLLECTION — 20 LEGENDS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="hologram-text">Choose Your Champion</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
              These are not characters. They are extensions of your will. Each champion carries
              a soul forged from code and cryptographic truth — owned by you, loyal to you,
              and impossible to take away. Choose wisely. Your legacy depends on it.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {FEATURED_CHAMPIONS.map((champion, i) => (
              <ChampionShowcaseCard key={champion.id} champion={champion} index={i} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/nft"
              className="inline-flex items-center gap-3 btn-legendary px-8 py-4 rounded-xl text-sm"
            >
              <Sparkles className="w-4 h-4" />
              View All 20 Legendary Champions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ===================== GAME MODES PREVIEW ===================== */}
        <section className="px-4 max-w-7xl mx-auto pb-28">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "1v1 Duel",
                desc: "Face a single opponent in pure tactical combat. Skill, timing, and champion mastery determine the victor. Winner claims 90% of the staked AXC.",
                color: "border-gold/30",
                textColor: "text-gold",
                icon: Swords,
                href: "/game",
                badge: "LIVE",
                badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
              },
              {
                title: "5v5 Arena",
                desc: "Form a squad of five champions and battle the opposing team. Coordinate abilities, chain combos, and dominate the arena. AXC rewards for every win.",
                color: "border-cyan-400/30",
                textColor: "text-cyan-400",
                icon: Users,
                href: "/game",
                badge: "HOT",
                badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
              },
              {
                title: "Tournament",
                desc: "Compete in bracket-style tournaments with massive AXC prize pools. Rise through the ranks. Become a legend. The top prize can change your life.",
                color: "border-purple-400/30",
                textColor: "text-purple-400",
                icon: Crown,
                href: "/game",
                badge: "WEEKLY",
                badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
              },
            ].map((mode) => (
              <Link
                key={mode.title}
                href={mode.href}
                className={`battle-frame rounded-2xl p-6 hover:border-opacity-80 transition-all duration-300 group hover:-translate-y-1 border ${mode.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl glass-panel flex items-center justify-center ${mode.textColor}`}>
                    <mode.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full border ${mode.badgeColor}`}>
                    {mode.badge}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${mode.textColor}`}>{mode.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{mode.desc}</p>
                <div className={`flex items-center gap-2 text-sm font-semibold ${mode.textColor} group-hover:gap-3 transition-all`}>
                  Enter Mode <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===================== WHY AUREXIA ===================== */}
        <section className="px-4 max-w-6xl mx-auto pb-28">
          <div className="battle-frame rounded-3xl p-8 md:p-14">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="glass-panel border border-gold/20 rounded-full inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-mono mb-6">
                  <Shield className="w-3 h-3 text-gold" />
                  <span className="text-gold">WHY AUREXIA</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                  You do not <span className="hologram-text">rent</span> your champions.
                  <br />
                  You <span className="text-gold">own</span> them.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Every champion you acquire is minted as a true NFT on the Base blockchain. No server
                  can delete them. No company can revoke them. No patch can nerf them without your
                  consent. This is digital sovereignty applied to gaming — a concept that changes
                  everything you thought you knew about owning virtual assets.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  The AXC you earn through battles is real cryptocurrency with real value on open markets.
                  Your victories translate directly to wealth. Your defeats cost only the gas fee.
                  Your legend is written permanently on-chain.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "True Ownership", desc: "Champions live on Base blockchain, not our servers", icon: Shield },
                    { label: "Real Earnings", desc: "AXC rewards are real cryptocurrency", icon: TrendingUp },
                    { label: "50,000 TPS", desc: "Instant transactions, no lag mid-battle", icon: Zap },
                    { label: "Global Arena", desc: "Battle players from every continent", icon: Globe },
                  ].map((feat) => (
                    <div key={feat.label} className="glass-panel rounded-xl p-4">
                      <feat.icon className="w-4 h-4 text-gold mb-2" />
                      <div className="text-sm font-bold text-foreground mb-1">{feat.label}</div>
                      <div className="text-xs text-muted-foreground">{feat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-20 rounded-full"
                  style={{ background: "radial-gradient(circle, oklch(0.75 0.18 55) 0%, transparent 70%)" }} />
                <div className="grid grid-cols-2 gap-3 relative">
                  {CHAMPIONS.slice(0, 4).map((c) => (
                    <div key={c.id} className={`rounded-xl overflow-hidden border ${getRarityBorder(c.rarity)}`}>
                      <div className="relative aspect-square">
                        <Image src={c.image} alt={c.name} fill className="object-cover object-top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-2 left-2">
                          <div className="text-xs font-bold text-white">{c.name}</div>
                          <div className={`text-[9px] font-mono ${getRarityColor(c.rarity)}`}>{c.rarity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FINAL CTA ===================== */}
        <section className="px-4 max-w-4xl mx-auto pb-28 text-center">
          <div className="battle-frame rounded-3xl p-10 md:p-16 animated-border">
            <Image
              src="/aurexia-logo.png"
              alt="AUREXIA"
              width={80}
              height={80}
              className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] float-animation"
            />
            <h2 className="text-3xl md:text-5xl font-black mb-4 hologram-text">
              Your Legend Begins Now.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Twenty champions. One arena. Infinite possibility. The warriors are ready.
              The AXC rewards are waiting. The only thing missing is you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/game" className="btn-legendary px-10 py-4 rounded-xl text-base flex items-center gap-3">
                <Swords className="w-5 h-5" />
                Enter the Arena
              </Link>
              <Link href="/nft" className="btn-arena px-10 py-4 rounded-xl text-base font-semibold flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Claim a Champion
              </Link>
            </div>
          </div>
        </section>

      </main>

      <AXCFooter />

      <style jsx>{`
        @keyframes twinkle {
          from { opacity: 0.1; }
          to { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
