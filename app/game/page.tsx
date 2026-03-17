"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Swords, Shield, Zap, Trophy, Users, Crown, 
  Target, Flame, Star, Clock, Gift, ArrowRight,
  Play, Pause, Volume2, VolumeX, Maximize,
  ChevronRight, Lock, Unlock, Sparkles
} from "lucide-react"
import { GalaxyBackground } from "@/components/galaxy-background"
import { AXCNav } from "@/components/axc-nav"
import { AXCFooter } from "@/components/axc-footer"
import { useWallet } from "@/lib/wallet-context"

// Character videos for the game
const characterVideos = [
  { id: 1, name: "Auron the Eternal", video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%20a719b443-6e9d-400e-8ad4-d8a64f273888%20generated%20video-kU4izvFG7RQeZJ4CoFJp6evQEgxKW2.mp4", power: 9850, class: "Guardian" },
  { id: 2, name: "Seraphine Void", video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/trim_9F5E5DEB-28EC-459A-AED0-809F8227A056-VVEkJrT1LNAXvBGnPWaPWdAolz8j4h.mp4", power: 8720, class: "Oracle" },
  { id: 3, name: "Khal Nexus", video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%20b10f6db8-dc5a-4abc-859c-1d9904f78fbb%20generated%20video-DeBbOiFpFWwA9njLA4yuAPvSO3ovIq.mp4", power: 7400, class: "Warrior" },
  { id: 4, name: "Nova Surge", video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/users%2078989d7e-eb06-4919-ab2a-e1a82da13ad5%20generated%205bded015-01b7-44f0-8d16-e3e085f24649%20generated%20video-VZlfnEGk1GAvOrlehgAFlhYFkdoszu.mp4", power: 9100, class: "Speedster" },
]

// Game modes
const gameModes = [
  {
    id: "arena",
    name: "Battle Arena",
    description: "Face warriors from across the cosmos in 1v1 combat. Climb the ranks. Claim glory.",
    icon: Swords,
    reward: "500-2000 AXC",
    players: "1v1",
    duration: "5-10 min",
    color: "text-axc-red",
    bgColor: "bg-axc-red/10",
    borderColor: "border-axc-red/30",
    unlocked: true,
  },
  {
    id: "raid",
    name: "Cosmic Raid",
    description: "Join forces with 4 allies to defeat ancient blockchain titans and claim legendary rewards.",
    icon: Users,
    reward: "1000-5000 AXC",
    players: "5 Players",
    duration: "20-30 min",
    color: "text-axc-purple",
    bgColor: "bg-axc-purple/10",
    borderColor: "border-axc-purple/30",
    unlocked: true,
  },
  {
    id: "tournament",
    name: "Grand Tournament",
    description: "The ultimate test of skill. 64 warriors enter. One emerges as the Sovereign Champion.",
    icon: Trophy,
    reward: "10,000 AXC Pool",
    players: "64 Players",
    duration: "Weekly Event",
    color: "text-axc-gold",
    bgColor: "bg-axc-gold/10",
    borderColor: "border-axc-gold/30",
    unlocked: false,
    unlockRequirement: "Reach Arena Rank 10",
  },
  {
    id: "conquest",
    name: "Territory Conquest",
    description: "Stake your claim on the blockchain frontier. Conquer regions. Earn passive rewards forever.",
    icon: Target,
    reward: "Passive AXC/day",
    players: "Guild Wars",
    duration: "Ongoing",
    color: "text-axc-blue",
    bgColor: "bg-axc-blue/10",
    borderColor: "border-axc-blue/30",
    unlocked: true,
  },
]

// Leaderboard data
const leaderboard = [
  { rank: 1, name: "CryptoSamurai", power: 98500, wins: 847, losses: 23, reward: "5,000 AXC" },
  { rank: 2, name: "BlockchainBeast", power: 94200, wins: 792, losses: 41, reward: "3,000 AXC" },
  { rank: 3, name: "DefiDragon", power: 91800, wins: 756, losses: 58, reward: "2,000 AXC" },
  { rank: 4, name: "TokenTitan", power: 88400, wins: 701, losses: 72, reward: "1,500 AXC" },
  { rank: 5, name: "ChainChampion", power: 85900, wins: 678, losses: 89, reward: "1,000 AXC" },
  { rank: 6, name: "Web3Warrior", power: 82100, wins: 623, losses: 104, reward: "750 AXC" },
  { rank: 7, name: "CoinConqueror", power: 79800, wins: 589, losses: 118, reward: "500 AXC" },
  { rank: 8, name: "NFTNinja", power: 76500, wins: 542, losses: 135, reward: "400 AXC" },
]

// Daily quests
const dailyQuests = [
  { id: 1, name: "Win 3 Arena Battles", reward: "150 AXC", progress: 2, total: 3, icon: Swords },
  { id: 2, name: "Deal 50,000 Damage", reward: "100 AXC", progress: 38420, total: 50000, icon: Flame },
  { id: 3, name: "Complete 1 Raid", reward: "200 AXC", progress: 0, total: 1, icon: Users },
  { id: 4, name: "Play for 30 Minutes", reward: "75 AXC", progress: 22, total: 30, icon: Clock },
]

export default function GamePanel() {
  const { address, isConnected, connectWallet, balances } = useWallet()
  const [selectedCharacter, setSelectedCharacter] = useState(characterVideos[0])
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [matchFound, setMatchFound] = useState(false)
  const [searchTime, setSearchTime] = useState(0)

  // Simulate matchmaking
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSearching && !matchFound) {
      interval = setInterval(() => {
        setSearchTime(prev => {
          if (prev >= 5) {
            setMatchFound(true)
            setIsSearching(false)
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isSearching, matchFound])

  const startMatchmaking = (modeId: string) => {
    if (!isConnected) {
      connectWallet().catch(() => {})
      return
    }
    setSelectedMode(modeId)
    setIsSearching(true)
    setMatchFound(false)
    setSearchTime(0)
  }

  const cancelMatchmaking = () => {
    setIsSearching(false)
    setSelectedMode(null)
    setSearchTime(0)
  }

  const playerStats = {
    rank: 142,
    wins: 87,
    losses: 34,
    winRate: "71.9%",
    totalEarnings: "12,450 AXC",
    seasonRank: "Gold III",
  }

  return (
    <div className="relative min-h-screen bg-background scan-lines">
      <GalaxyBackground />
      <AXCNav />

      <main className="relative z-10 pt-28 pb-20">
        {/* Header */}
        <section className="px-4 max-w-7xl mx-auto mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 hologram-card rounded-full px-4 py-1.5 text-[10px] font-mono mb-4">
                <Swords className="w-3 h-3 text-axc-red" />
                <span className="text-axc-red">BATTLE ARENA ONLINE</span>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-axc-green">12,847 WARRIORS ACTIVE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold hologram-text mb-3">
                Game Command Center
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Enter the arena. Command your legends. 
                <span className="text-foreground"> Earn real AXC rewards</span> for every victory. 
                Your skill translates directly to wealth.
              </p>
            </div>

            {isConnected && (
              <div className="hologram-card rounded-2xl p-4 min-w-[280px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-axc-gold/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-axc-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-mono">SEASON RANK</div>
                    <div className="text-lg font-bold text-axc-gold">{playerStats.seasonRank}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-axc-green">{playerStats.wins}</div>
                    <div className="text-[9px] text-muted-foreground">WINS</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-axc-red">{playerStats.losses}</div>
                    <div className="text-[9px] text-muted-foreground">LOSSES</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{playerStats.winRate}</div>
                    <div className="text-[9px] text-muted-foreground">WIN RATE</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Character Selection */}
        <section className="px-4 max-w-7xl mx-auto mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-axc-blue" />
            Select Your Champion
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {characterVideos.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`hologram-card rounded-2xl overflow-hidden transition-all duration-300 ${
                  selectedCharacter.id === char.id 
                    ? "ring-2 ring-axc-gold hologram-glow" 
                    : "hover:ring-1 ring-white/20"
                }`}
              >
                <div className="aspect-[3/4] relative">
                  <video 
                    src={char.video} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {selectedCharacter.id === char.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-axc-gold flex items-center justify-center">
                      <Star className="w-3 h-3 text-black fill-current" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-[10px] font-mono text-axc-gold">{char.class}</div>
                    <div className="text-sm font-bold text-white truncate">{char.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3 text-axc-gold" />
                      <span className="text-xs font-mono text-axc-gold">{char.power.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Game Modes */}
        <section className="px-4 max-w-7xl mx-auto mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-axc-purple" />
            Choose Your Battle
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {gameModes.map((mode) => (
              <div
                key={mode.id}
                className={`hologram-card rounded-2xl p-5 transition-all duration-300 ${
                  mode.unlocked ? "hover:hologram-glow cursor-pointer" : "opacity-60"
                } ${mode.borderColor} border`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${mode.bgColor} flex items-center justify-center`}>
                      <mode.icon className={`w-6 h-6 ${mode.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">{mode.name}</h3>
                        {!mode.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{mode.players} | {mode.duration}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground font-mono">REWARD</div>
                    <div className={`text-sm font-bold ${mode.color}`}>{mode.reward}</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{mode.description}</p>
                
                {mode.unlocked ? (
                  <button
                    onClick={() => startMatchmaking(mode.id)}
                    disabled={isSearching}
                    className={`w-full cyber-btn py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${
                      isSearching && selectedMode === mode.id ? "animate-pulse" : ""
                    }`}
                  >
                    {isSearching && selectedMode === mode.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finding Match... {searchTime}s
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Enter Battle
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-3 rounded-xl font-medium text-center text-muted-foreground bg-white/5 border border-white/10 text-sm">
                    {mode.unlockRequirement}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Match Found Modal */}
        {matchFound && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="hologram-card rounded-3xl p-8 max-w-md w-full text-center neon-border">
              <div className="w-20 h-20 rounded-full bg-axc-green/20 flex items-center justify-center mx-auto mb-6 energy-pulse">
                <Swords className="w-10 h-10 text-axc-green" />
              </div>
              <h2 className="text-3xl font-bold hologram-text mb-2">MATCH FOUND!</h2>
              <p className="text-muted-foreground mb-6">Your opponent awaits. Prepare for battle.</p>
              
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-axc-blue/20 flex items-center justify-center mb-2 mx-auto">
                    <Crown className="w-8 h-8 text-axc-blue" />
                  </div>
                  <div className="text-sm font-bold">You</div>
                  <div className="text-xs text-axc-gold">{selectedCharacter.power.toLocaleString()} PWR</div>
                </div>
                <div className="text-2xl font-bold text-axc-red">VS</div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-axc-red/20 flex items-center justify-center mb-2 mx-auto">
                    <Swords className="w-8 h-8 text-axc-red" />
                  </div>
                  <div className="text-sm font-bold">Opponent</div>
                  <div className="text-xs text-axc-gold">8,420 PWR</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setMatchFound(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-muted-foreground bg-white/5 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setMatchFound(false)
                    alert("Battle simulation started! In production, this would launch the game client.")
                  }}
                  className="flex-1 cyber-btn py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  FIGHT!
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {/* Daily Quests */}
          <div className="lg:col-span-1">
            <div className="hologram-card rounded-2xl p-5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-axc-gold" />
                Daily Quests
              </h3>
              <div className="space-y-3">
                {dailyQuests.map((quest) => {
                  const progress = typeof quest.progress === 'number' && quest.total > 100 
                    ? Math.floor((quest.progress / quest.total) * 100) 
                    : Math.floor((quest.progress / quest.total) * 100)
                  const isComplete = quest.progress >= quest.total
                  
                  return (
                    <div key={quest.id} className="glass-panel rounded-xl p-3 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <quest.icon className={`w-4 h-4 ${isComplete ? "text-axc-green" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">{quest.name}</span>
                        </div>
                        <span className={`text-xs font-bold ${isComplete ? "text-axc-green" : "text-axc-gold"}`}>
                          {quest.reward}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isComplete ? "bg-axc-green" : "power-bar"}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 text-right">
                        {quest.progress.toLocaleString()} / {quest.total.toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </div>
              <button className="w-full mt-4 py-2 rounded-xl text-sm font-medium text-axc-gold bg-axc-gold/10 border border-axc-gold/30 hover:bg-axc-gold/20 transition-all">
                Claim All Rewards
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="hologram-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-axc-gold" />
                  Season Leaderboard
                </h3>
                <Link href="/leaderboard" className="text-xs text-axc-blue hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-muted-foreground font-mono uppercase border-b border-white/10">
                      <th className="text-left py-2 px-2">Rank</th>
                      <th className="text-left py-2 px-2">Player</th>
                      <th className="text-right py-2 px-2">Power</th>
                      <th className="text-right py-2 px-2">W/L</th>
                      <th className="text-right py-2 px-2">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((player) => (
                      <tr 
                        key={player.rank} 
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            player.rank === 1 ? "bg-axc-gold/20 text-axc-gold" :
                            player.rank === 2 ? "bg-white/20 text-white" :
                            player.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                            "bg-white/5 text-muted-foreground"
                          }`}>
                            {player.rank}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium">{player.name}</td>
                        <td className="py-3 px-2 text-right font-mono text-axc-gold">{player.power.toLocaleString()}</td>
                        <td className="py-3 px-2 text-right font-mono">
                          <span className="text-axc-green">{player.wins}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-axc-red">{player.losses}</span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-axc-gold text-sm">{player.reward}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AXCFooter />
    </div>
  )
}
