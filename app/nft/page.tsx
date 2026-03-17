"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Star, Flame, Filter, Search, ArrowRight, Zap,
  Shield, Eye, Heart, TrendingUp, Crown, Sword,
  RefreshCw, ChevronDown
} from "lucide-react"
import { GalaxyBackground } from "@/components/galaxy-background"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"

const VIDEO_1 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%20a719b443-6e9d-400e-8ad4-d8a64f273888%20generated%20video-kU4izvFG7RQeZJ4CoFJp6evQEgxKW2.mp4"
const VIDEO_2 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trim_9F5E5DEB-28EC-459A-AED0-809F8227A056-VVEkJrT1LNAXvBGnPWaPWdAolz8j4h.mp4"
const VIDEO_3 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%20b10f6db8-dc5a-4abc-859c-1d9904f78fbb%20generated%20video-DeBbOiFpFWwA9njLA4yuAPvSO3ovIq.mp4"
const VIDEO_4 = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%205bded015-01b7-44f0-8d16-e3e085f24649%20generated%20video-VZlfnEGk1GAvOrlehgAFlhYFkdoszu.mp4"

type Rarity = "All" | "Legendary" | "Mythic" | "Epic" | "Rare" | "Common"
type Category = "All" | "Warrior" | "Mage" | "Guardian" | "Phantom" | "Oracle"

const rarityConfig = {
  Legendary: { color: "text-axc-gold", bg: "bg-axc-gold/10", border: "border-axc-gold/40", glow: "shadow-[0_0_30px_rgba(200,150,40,0.25)]" },
  Mythic:    { color: "text-axc-purple", bg: "bg-axc-purple/10", border: "border-axc-purple/40", glow: "shadow-[0_0_30px_rgba(150,60,220,0.25)]" },
  Epic:      { color: "text-axc-blue", bg: "bg-axc-blue/10", border: "border-axc-blue/40", glow: "shadow-[0_0_30px_rgba(60,130,255,0.25)]" },
  Rare:      { color: "text-axc-green", bg: "bg-axc-green/10", border: "border-axc-green/40", glow: "shadow-[0_0_20px_rgba(40,180,120,0.2)]" },
  Common:    { color: "text-muted-foreground", bg: "bg-white/5", border: "border-white/15", glow: "" },
}

const allNFTs = [
  {
    id: 1, name: "Auron the Eternal", title: "Guardian of the Chain",
    rarity: "Legendary" as const, category: "Guardian",
    power: 9850, price: 2400, floorPrice: 2100, owners: 1,
    video: VIDEO_1,
    stats: { attack: 98, defense: 94, speed: 87, magic: 99 },
    desc: "Born in the first block of Aurexia Genesis. A living monument to the dawn of a new civilization. Only 1 exists in all of existence.",
    traits: ["Genesis Block", "Eternal Flame", "Cosmic Will", "Unbreakable"],
    views: 84210, likes: 12440,
  },
  {
    id: 2, name: "Seraphine Void", title: "Keeper of Zero Knowledge",
    rarity: "Mythic" as const, category: "Oracle",
    power: 8720, price: 1800, floorPrice: 1550, owners: 3,
    video: VIDEO_2,
    stats: { attack: 85, defense: 90, speed: 96, magic: 97 },
    desc: "She emerged from the ZK proof layer — a being of pure cryptographic truth. No secret escapes her sight. No lie survives her gaze.",
    traits: ["ZK Oracle", "Shadow Walk", "Mind Fracture", "Quantum Sight"],
    views: 61820, likes: 9300,
  },
  {
    id: 3, name: "Khal Nexus", title: "Warlord of Validators",
    rarity: "Epic" as const, category: "Warrior",
    power: 7400, price: 950, floorPrice: 820, owners: 12,
    video: VIDEO_3,
    stats: { attack: 92, defense: 97, speed: 74, magic: 78 },
    desc: "Commander of the 420 Validator Nodes. Every block he seals is a fortress. Every transaction he confirms is an oath in cryptographic stone.",
    traits: ["Block Seal", "Validator Lord", "Iron Shield", "Consensus Strike"],
    views: 44200, likes: 7120,
  },
  {
    id: 4, name: "Nova Surge", title: "Quantum Speed Incarnate",
    rarity: "Legendary" as const, category: "Phantom",
    power: 9100, price: 2100, floorPrice: 1900, owners: 2,
    video: VIDEO_4,
    stats: { attack: 88, defense: 82, speed: 100, magic: 94 },
    desc: "She moves at the speed of finality — 400 milliseconds and the world is changed forever. She is the reason Aurexia never sleeps.",
    traits: ["Light Speed", "Temporal Shift", "Phase Strike", "Infinite Run"],
    views: 72500, likes: 11200,
  },
  {
    id: 5, name: "Axiom Prime", title: "First Validator Node",
    rarity: "Mythic" as const, category: "Guardian",
    power: 8200, price: 1600, floorPrice: 1400, owners: 5,
    video: VIDEO_1,
    stats: { attack: 80, defense: 99, speed: 70, magic: 91 },
    desc: "The very first validator node ever brought online on Aurexia mainnet. His existence is the proof of the chain's immortality.",
    traits: ["First Node", "Unbreakable", "Genesis Seal", "Eternal Guard"],
    views: 55000, likes: 8800,
  },
  {
    id: 6, name: "Lyra Eclipse", title: "Architect of Dark Pools",
    rarity: "Epic" as const, category: "Mage",
    power: 7100, price: 880, floorPrice: 740, owners: 18,
    video: VIDEO_2,
    stats: { attack: 94, defense: 71, speed: 88, magic: 95 },
    desc: "She built the dark liquidity pools from nothing — places where value flows unseen, where whales move silently through the cosmic ocean.",
    traits: ["Dark Pool", "Liquidity Weave", "Shadow Depth", "AMM Master"],
    views: 38800, likes: 6100,
  },
  {
    id: 7, name: "Ryzen Crypt", title: "The Silent Consensus",
    rarity: "Rare" as const, category: "Phantom",
    power: 5800, price: 340, floorPrice: 280, owners: 64,
    video: VIDEO_3,
    stats: { attack: 76, defense: 78, speed: 84, magic: 72 },
    desc: "He reaches consensus without a word. In silence he validates. In stillness he secures. The quietest force in the entire Aurexia universe.",
    traits: ["Silent Vote", "Stealth Confirm", "Ghost Finality"],
    views: 22100, likes: 3800,
  },
  {
    id: 8, name: "Vela Dawn", title: "Oracle of Futures",
    rarity: "Rare" as const, category: "Oracle",
    power: 5600, price: 310, floorPrice: 260, owners: 79,
    video: VIDEO_4,
    stats: { attack: 68, defense: 72, speed: 82, magic: 96 },
    desc: "She sees every transaction before it is signed. Every price before it moves. Every block before it is mined. The future is her present.",
    traits: ["Price Oracle", "Future Sight", "Market Prophet"],
    views: 19400, likes: 3200,
  },
  {
    id: 9, name: "Drex Omega", title: "The Bridge Walker",
    rarity: "Common" as const, category: "Warrior",
    power: 3200, price: 80, floorPrice: 55, owners: 892,
    video: VIDEO_1,
    stats: { attack: 60, defense: 58, speed: 62, magic: 45 },
    desc: "He walks between chains — a courier of value, a messenger of trust. Every bridge he crosses strengthens the bond between worlds.",
    traits: ["Bridge Walker", "Chain Hop"],
    views: 8100, likes: 980,
  },
  {
    id: 10, name: "Asha Core", title: "The Smart Contract Weaver",
    rarity: "Epic" as const, category: "Mage",
    power: 6800, price: 720, floorPrice: 620, owners: 31,
    video: VIDEO_2,
    stats: { attack: 78, defense: 74, speed: 79, magic: 99 },
    desc: "With a single thought, she deploys contracts that outlive empires. Her code never breaks. Her logic never bends. Her will is executable.",
    traits: ["EVM Master", "Unbreakable Logic", "Solidity Soul", "Gas Optimizer"],
    views: 31200, likes: 5400,
  },
  {
    id: 11, name: "Xerion Blaze", title: "The Burn Protocol",
    rarity: "Mythic" as const, category: "Warrior",
    power: 8500, price: 1700, floorPrice: 1480, owners: 4,
    video: VIDEO_3,
    stats: { attack: 99, defense: 78, speed: 91, magic: 86 },
    desc: "Every AXC he touches turns to flame. The embodiment of the deflationary mechanism itself — beautiful, unstoppable, and ultimately victorious.",
    traits: ["Token Burner", "Deflationary Aura", "Flame Strike", "Supply Destroyer"],
    views: 48900, likes: 7800,
  },
  {
    id: 12, name: "Zara Null", title: "Phantom of the Mempool",
    rarity: "Common" as const, category: "Phantom",
    power: 2900, price: 65, floorPrice: 45, owners: 1240,
    video: VIDEO_4,
    stats: { attack: 55, defense: 48, speed: 78, magic: 40 },
    desc: "She haunts the mempool — watching unconfirmed transactions drift like ghosts until she decides which ones deserve to live.",
    traits: ["Mempool Ghost", "TX Watcher"],
    views: 6700, likes: 720,
  },
]

function VideoNFTCard({ nft, onSelect }: { nft: typeof allNFTs[0]; onSelect: (n: typeof allNFTs[0]) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cfg = rarityConfig[nft.rarity]

  return (
    <div
      className={`glass-panel border ${cfg.border} rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:scale-[1.02] ${cfg.glow} group`}
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 } }}
      onClick={() => onSelect(nft)}
    >
      {/* Video */}
      <div className="relative aspect-[3/4]">
        <video ref={videoRef} src={nft.video} muted loop playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.border} ${cfg.color} backdrop-blur-sm`}>
            <Star className="w-2.5 h-2.5 fill-current" />{nft.rarity}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 border border-white/10 text-foreground backdrop-blur-sm">
            <Flame className="w-2.5 h-2.5 text-axc-gold" />{nft.power.toLocaleString()}
          </span>
        </div>

        <div className="absolute bottom-2.5 left-3 right-3">
          <div className={`text-[9px] font-mono uppercase tracking-widest ${cfg.color} mb-0.5`}>{nft.title}</div>
          <h3 className="text-sm font-bold text-foreground">{nft.name}</h3>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 space-y-2.5">
        <div className="grid grid-cols-4 gap-1.5">
          {Object.entries(nft.stats).map(([k, v]) => (
            <div key={k} className="text-center">
              <div className="text-[9px] text-muted-foreground uppercase font-mono">{k.slice(0,3)}</div>
              <div className={`text-xs font-bold font-mono ${cfg.color}`}>{v}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
          <div>
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Price</div>
            <div className={`text-sm font-bold font-mono ${cfg.color}`}>{nft.price.toLocaleString()} AXC</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Heart className="w-3 h-3" />{(nft.likes / 1000).toFixed(1)}k
            </span>
            <button
              onClick={(e) => { e.stopPropagation() }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${cfg.bg} ${cfg.border} ${cfg.color} hover:scale-105 transition-all`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NFTDetailModal({ nft, onClose }: { nft: typeof allNFTs[0]; onClose: () => void }) {
  const cfg = rarityConfig[nft.rarity]
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`glass-panel border ${cfg.border} rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${cfg.glow}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Video */}
          <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[500px]">
            <video src={nft.video} autoPlay muted loop playsInline className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" />
            <div className="absolute bottom-4 left-4">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border} ${cfg.color} backdrop-blur-sm`}>
                <Star className="w-3 h-3 fill-current" />{nft.rarity}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            <div>
              <div className={`text-xs font-mono uppercase tracking-widest ${cfg.color} mb-1`}>{nft.category} — #{nft.id.toString().padStart(4, "0")}</div>
              <h2 className="text-2xl font-bold text-foreground">{nft.name}</h2>
              <p className={`text-sm ${cfg.color} font-medium`}>{nft.title}</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{nft.desc}</p>

            {/* Power */}
            <div className="flex items-center gap-2 glass-panel border border-white/10 rounded-xl p-3">
              <Flame className="w-5 h-5 text-axc-gold" />
              <div>
                <div className="text-xs text-muted-foreground">Combat Power</div>
                <div className="text-xl font-bold font-mono text-axc-gold">{nft.power.toLocaleString()}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-muted-foreground tracking-wider">Attribute Stats</div>
              {Object.entries(nft.stats).map(([k, v]) => (
                <div key={k} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground capitalize">{k}</span>
                    <span className={`font-bold ${cfg.color}`}>{v}/100</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.bg.replace("/10", "/60")}`} style={{ width: `${v}%`, background: undefined }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-muted-foreground tracking-wider">Traits</div>
              <div className="flex flex-wrap gap-1.5">
                {nft.traits.map((t) => (
                  <span key={t} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.bg} ${cfg.border} ${cfg.color}`}>{t}</span>
                ))}
              </div>
            </div>

            {/* Price + actions */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-mono">Current Price</div>
                  <div className={`text-2xl font-bold font-mono ${cfg.color}`}>{nft.price.toLocaleString()} AXC</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground font-mono">Floor</div>
                  <div className="text-sm font-bold font-mono text-foreground">{nft.floorPrice.toLocaleString()} AXC</div>
                </div>
              </div>
              <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border ${cfg.bg} ${cfg.border} ${cfg.color} hover:scale-[1.02] transition-all ${cfg.glow}`}>
                <Zap className="w-4 h-4" />
                Acquire {nft.name}
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground glass-panel border border-white/10 hover:border-white/20 transition-all">
                Make an Offer
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{nft.views.toLocaleString()} views</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{nft.likes.toLocaleString()} likes</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" />{nft.owners} owner{nft.owners > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CATEGORIES: Category[] = ["All", "Warrior", "Mage", "Guardian", "Phantom", "Oracle"]
const RARITIES: Rarity[] = ["All", "Legendary", "Mythic", "Epic", "Rare", "Common"]
const SORT_OPTIONS = ["Price: Low to High", "Price: High to Low", "Power: Highest", "Most Liked", "Newest"]

export default function NFTMarketplace() {
  const [selectedRarity, setSelectedRarity] = useState<Rarity>("All")
  const [selectedCategory, setSelectedCategory] = useState<Category>("All")
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[2])
  const [search, setSearch] = useState("")
  const [selectedNFT, setSelectedNFT] = useState<typeof allNFTs[0] | null>(null)

  const filtered = allNFTs
    .filter((n) => selectedRarity === "All" || n.rarity === selectedRarity)
    .filter((n) => selectedCategory === "All" || n.category === selectedCategory)
    .filter((n) => n.name.toLowerCase().includes(search.toLowerCase()) || n.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price
      if (sortBy === "Price: High to Low") return b.price - a.price
      if (sortBy === "Power: Highest") return b.power - a.power
      if (sortBy === "Most Liked") return b.likes - a.likes
      return b.id - a.id
    })

  const totalVolume = allNFTs.reduce((s, n) => s + n.price, 0)
  const floorPrice = Math.min(...allNFTs.map((n) => n.floorPrice))

  return (
    <div className="relative min-h-screen bg-background scan-lines">
      <GalaxyBackground />
      <AXCNav />

      {selectedNFT && <NFTDetailModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />}

      <main className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="relative w-20 h-20 mx-auto hologram-float mb-6">
              <Image
                src="/aurexia-logo.png"
                alt="Aurexia"
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(200,150,40,0.8)]"
              />
            </div>
            <div className="inline-flex items-center gap-2 hologram-card rounded-full px-4 py-1.5 text-xs font-mono text-axc-gold uppercase tracking-wider neon-border">
              <Star className="w-3 h-3 fill-current" /> Aurexia NFT Marketplace
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-balance leading-tight hologram-text">
              Own a Legend.
              <br />
              Change Your Fate.
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed text-pretty">
              10,000 unique Aurexia Legends — each one a living character, a playable warrior, and a
              stake in the most ambitious blockchain civilization ever built. This is not collecting.
              This is claiming your place in history.
            </p>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Volume", value: `${totalVolume.toLocaleString()} AXC`, icon: TrendingUp, color: "text-axc-green" },
              { label: "Floor Price", value: `${floorPrice} AXC`, icon: Crown, color: "text-axc-gold" },
              { label: "Total NFTs", value: "10,000", icon: Star, color: "text-axc-blue" },
              { label: "Active Listings", value: `${allNFTs.length} shown`, icon: Zap, color: "text-axc-purple" },
            ].map((s) => (
              <div key={s.label} className="glass-panel border border-white/8 rounded-2xl p-4 space-y-2">
                <div className={`flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase`}>
                  <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  {s.label}
                </div>
                <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="glass-panel border border-white/8 rounded-2xl p-4 mb-8 space-y-4">
            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search legends by name or title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-primary/50 cursor-pointer min-w-[200px]"
                >
                  {SORT_OPTIONS.map((o) => <option key={o} value={o} className="bg-background">{o}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Rarity filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <Filter className="w-3 h-3" /> Rarity
              </div>
              <div className="flex flex-wrap gap-2">
                {RARITIES.map((r) => {
                  const cfg = r !== "All" ? rarityConfig[r] : null
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRarity(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedRarity === r
                          ? cfg ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "bg-primary/10 border-primary/40 text-primary"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                      }`}
                    >
                      {r !== "All" && <Star className="w-2.5 h-2.5 inline mr-1 fill-current" />}{r}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Category filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <Sword className="w-3 h-3" /> Category
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedCategory === c
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground font-mono">
              Showing <span className="text-foreground font-bold">{filtered.length}</span> of {allNFTs.length} legends
            </p>
            <button
              onClick={() => { setSelectedRarity("All"); setSelectedCategory("All"); setSearch("") }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((nft) => (
              <VideoNFTCard key={nft.id} nft={nft} onSelect={setSelectedNFT} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <Search className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-lg">No legends found matching your criteria.</p>
              <p className="text-muted-foreground text-sm">Perhaps the legend you seek has not yet been minted.</p>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-16 space-y-4">
            <h2 className="text-2xl font-bold text-balance">
              Your Legend is Waiting.
              <span className="text-axc-gold"> Will You Claim It?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Every moment you wait, someone else steps into the story that was meant to be yours.
              The Aurexia universe is expanding. The rarest legends will never return.
            </p>
            <Link
              href="/wallet"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(100,150,255,0.4)] hover:scale-105"
            >
              Connect Wallet to Begin
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <AXCFooter />
    </div>
  )
}
