"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  z: number
  radius: number
  color: string
  twinkle: number
  twinkleSpeed: number
}

interface Nebula {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    // Generate stars
    const STAR_COUNT = 800
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      radius: Math.random() * 1.8 + 0.2,
      color: randomStarColor(),
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
    }))

    // Generate nebula clouds
    const nebulae: Nebula[] = [
      { x: width * 0.15, y: height * 0.25, radius: 320, color: "80,30,180", opacity: 0.08 },
      { x: width * 0.80, y: height * 0.15, radius: 250, color: "20,100,200", opacity: 0.10 },
      { x: width * 0.55, y: height * 0.75, radius: 280, color: "180,50,100", opacity: 0.07 },
      { x: width * 0.30, y: height * 0.80, radius: 200, color: "30,160,160", opacity: 0.06 },
      { x: width * 0.90, y: height * 0.60, radius: 180, color: "100,40,200", opacity: 0.08 },
    ]

    function randomStarColor() {
      const palette = [
        "#c8d8ff", // blue-white
        "#ffe8c8", // warm yellow
        "#ffd0d0", // red-pink
        "#d0ffea", // pale cyan
        "#ffffff",  // pure white
        "#e8d0ff", // pale violet
      ]
      return palette[Math.floor(Math.random() * palette.length)]
    }

    function drawNebulae() {
      nebulae.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius)
        grad.addColorStop(0, `rgba(${n.color},${n.opacity})`)
        grad.addColorStop(0.5, `rgba(${n.color},${n.opacity * 0.5})`)
        grad.addColorStop(1, `rgba(${n.color},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    function drawMilkyWayBand() {
      // Diagonal milky way streak
      const grad = ctx.createLinearGradient(0, height * 0.3, width, height * 0.7)
      grad.addColorStop(0, "rgba(30,50,120,0)")
      grad.addColorStop(0.3, "rgba(40,60,140,0.06)")
      grad.addColorStop(0.5, "rgba(50,80,160,0.08)")
      grad.addColorStop(0.7, "rgba(40,60,140,0.06)")
      grad.addColorStop(1, "rgba(30,50,120,0)")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)
    }

    function drawStars(t: number) {
      stars.forEach((star) => {
        star.twinkle += star.twinkleSpeed
        const brightness = 0.5 + 0.5 * Math.sin(star.twinkle)
        const alpha = 0.3 + brightness * 0.7

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = star.color

        // Larger stars get a glow
        if (star.radius > 1.4) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3)
          glow.addColorStop(0, star.color)
          glow.addColorStop(1, "transparent")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    function drawShootingStar(t: number) {
      const cycle = Math.floor(t / 300)
      const phase = (t % 300) / 300
      if (phase < 0.15 && width > 0 && height > 0) {
        // Deterministic position from cycle seed — avoids NaN
        const sx = ((cycle * 7919) % Math.max(width, 1))
        const sy = ((cycle * 3541) % Math.max(height * 0.5, 1))
        const progress = phase / 0.15
        const ex = sx + 120 * progress
        const ey = sy + 48 * progress

        // Guard against degenerate gradient (same start/end point)
        if (!isFinite(sx) || !isFinite(sy) || !isFinite(ex) || !isFinite(ey)) return
        if (sx === ex && sy === ey) return

        ctx.save()
        ctx.globalAlpha = (1 - progress) * 0.9
        const grad = ctx.createLinearGradient(sx, sy, ex, ey)
        grad.addColorStop(0, "rgba(255,255,255,0)")
        grad.addColorStop(1, "rgba(200,220,255,0.9)")
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
        ctx.stroke()
        ctx.restore()
      }
    }

    let lastTime = 0
    function animate(time: number) {
      const t = time * 0.3
      ctx.clearRect(0, 0, width, height)

      // Deep space background
      const bg = ctx.createLinearGradient(0, 0, width, height)
      bg.addColorStop(0, "rgb(4,6,18)")
      bg.addColorStop(0.5, "rgb(5,8,22)")
      bg.addColorStop(1, "rgb(3,5,14)")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      drawMilkyWayBand()
      drawNebulae()
      drawStars(t)
      drawShootingStar(t)

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      // Reposition nebulae
      nebulae[0] = { ...nebulae[0], x: width * 0.15, y: height * 0.25 }
      nebulae[1] = { ...nebulae[1], x: width * 0.80, y: height * 0.15 }
      nebulae[2] = { ...nebulae[2], x: width * 0.55, y: height * 0.75 }
      nebulae[3] = { ...nebulae[3], x: width * 0.30, y: height * 0.80 }
      nebulae[4] = { ...nebulae[4], x: width * 0.90, y: height * 0.60 }
      // Redistribute stars
      stars.forEach((s) => {
        s.x = Math.random() * width
        s.y = Math.random() * height
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
