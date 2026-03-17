"use client"

import { useState, useEffect } from "react"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"

function generatePriceHistory(days: number, basePrice: number) {
  const data = []
  let price = basePrice * 0.6
  const now = Date.now()
  for (let i = days; i >= 0; i--) {
    price += (Math.random() - 0.46) * price * 0.04
    price = Math.max(price, 0.1)
    const date = new Date(now - i * 24 * 60 * 60 * 1000)
    data.push({
      time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: +price.toFixed(4),
      volume: +(Math.random() * 50 + 10).toFixed(2),
    })
  }
  return data
}

const ranges = ["1D", "7D", "1M", "3M", "1Y", "ALL"]
const dayMap: Record<string, number> = { "1D": 1, "7D": 7, "1M": 30, "3M": 90, "1Y": 365, "ALL": 730 }

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-panel border border-white/15 rounded-lg px-3 py-2.5 text-xs font-mono">
        <div className="text-muted-foreground">{payload[0]?.payload?.time}</div>
        <div className="text-primary font-bold">${payload[0]?.value?.toFixed(4)}</div>
        <div className="text-muted-foreground">Vol: ${payload[0]?.payload?.volume}M</div>
      </div>
    )
  }
  return null
}

export function AXCPriceChart() {
  const [range, setRange] = useState("1M")
  const [data, setData] = useState(() => generatePriceHistory(30, 2.847))

  useEffect(() => {
    setData(generatePriceHistory(dayMap[range], 2.847))
  }, [range])

  const firstPrice = data[0]?.price ?? 0
  const lastPrice = data[data.length - 1]?.price ?? 0
  const change = ((lastPrice - firstPrice) / firstPrice) * 100
  const isPositive = change >= 0

  return (
    <div className="glass-panel border border-white/8 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">${lastPrice.toFixed(4)}</span>
            <span className={`text-sm font-mono font-semibold px-2 py-0.5 rounded-md ${isPositive ? "bg-axc-green/15 text-axc-green" : "bg-axc-red/15 text-axc-red"}`}>
              {isPositive ? "+" : ""}{change.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-mono">AXC / USD · Aurexia Chain Mainnet</p>
        </div>
        <div className="flex items-center gap-1 glass-panel border border-white/10 rounded-lg p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                range === r
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="axcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.22 220)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.65 0.22 220)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.03 250 / 0.4)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "oklch(0.55 0.05 230)", fontFamily: "Space Mono" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "oklch(0.55 0.05 230)", fontFamily: "Space Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v.toFixed(2)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="oklch(0.65 0.22 220)"
              strokeWidth={2}
              fill="url(#axcGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
        {[
          { label: "Market Cap", value: "$28.47M" },
          { label: "24h Volume", value: "$4.21M" },
          { label: "Circulating", value: "9,832,441 AXC" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-xs text-muted-foreground font-mono">{s.label}</div>
            <div className="text-sm font-semibold font-mono text-foreground mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
