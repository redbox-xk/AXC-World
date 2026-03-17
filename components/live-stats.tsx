"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, Activity, Users, Layers, Zap } from "lucide-react"

function useFlicker(base: number, variance: number, interval = 2000) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    const id = setInterval(() => {
      const delta = (Math.random() - 0.48) * variance
      setValue((v) => Math.max(0, +(v + delta).toFixed(4)))
    }, interval)
    return () => clearInterval(id)
  }, [base, variance, interval])
  return value
}

export function LiveStats() {
  const price = useFlicker(2.847, 0.08, 3000)
  const [prevPrice, setPrevPrice] = useState(2.847)
  const [priceDir, setPriceDir] = useState<"up" | "down">("up")

  useEffect(() => {
    if (price > prevPrice) setPriceDir("up")
    else setPriceDir("down")
    setPrevPrice(price)
  }, [price])

  const tps = useFlicker(48312, 800, 1500)
  const tvl = useFlicker(847.3, 2.5, 4000)
  const staked = useFlicker(6240000, 5000, 5000)
  const blocks = useFlicker(18472931, 1, 400)

  const stats = [
    {
      label: "AXC Price",
      value: `$${price.toFixed(4)}`,
      sub: priceDir === "up" ? "+4.72%" : "-0.31%",
      subPositive: priceDir === "up",
      icon: priceDir === "up" ? TrendingUp : TrendingDown,
      highlight: true,
      iconColor: priceDir === "up" ? "text-axc-green" : "text-axc-red",
    },
    {
      label: "Network TPS",
      value: Math.floor(tps).toLocaleString(),
      sub: "Real-time",
      subPositive: true,
      icon: Zap,
      iconColor: "text-axc-gold",
    },
    {
      label: "Total Value Locked",
      value: `$${tvl.toFixed(1)}M`,
      sub: "+12.4% (7d)",
      subPositive: true,
      icon: Layers,
      iconColor: "text-axc-blue",
    },
    {
      label: "AXC Staked",
      value: Math.floor(staked).toLocaleString(),
      sub: "62.4% of supply",
      subPositive: true,
      icon: Users,
      iconColor: "text-axc-purple",
    },
    {
      label: "Block Height",
      value: `#${Math.floor(blocks).toLocaleString()}`,
      sub: "~0.4s avg",
      subPositive: true,
      icon: Activity,
      iconColor: "text-axc-green",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`glass-panel border rounded-xl p-4 space-y-2 transition-all hover:border-primary/30 ${
            s.highlight ? "border-primary/20" : "border-white/8"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              {s.label}
            </span>
            <s.icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
          </div>
          <div className={`text-xl font-bold font-mono ${s.highlight ? "text-glow-blue text-primary" : "text-foreground"}`}>
            {s.value}
          </div>
          <div className={`text-xs font-mono ${s.subPositive ? "text-axc-green" : "text-axc-red"}`}>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
