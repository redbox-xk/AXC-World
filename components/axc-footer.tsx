import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, MessageCircle, BookOpen } from "lucide-react"

const footerLinks = {
  Blockchain: [
    { label: "Explorer", href: "/explorer" },
    { label: "Validators", href: "/staking" },
    { label: "Network Stats", href: "/explorer" },
    { label: "Block Time", href: "/explorer" },
  ],
  Ecosystem: [
    { label: "AXC Wallet", href: "/wallet" },
    { label: "Staking", href: "/staking" },
    { label: "DeFi Apps", href: "/ecosystem" },
    { label: "NFT Marketplace", href: "/ecosystem" },
  ],
  Developers: [
    { label: "Documentation", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "AXC SDK", href: "#" },
    { label: "Smart Contracts", href: "#" },
  ],
  Community: [
    { label: "Twitter / X", href: "#" },
    { label: "Discord", href: "#" },
    { label: "Telegram", href: "#" },
    { label: "Blog", href: "#" },
  ],
}

const chainInfo = [
  { label: "Chain ID", value: "7171" },
  { label: "Symbol", value: "AXC" },
  { label: "RPC", value: "rpc.aurexia.network" },
  { label: "Block Explorer", value: "scan.aurexia.network" },
]

export function AXCFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5 mt-24">
      <div className="glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          {/* Top section */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative w-12 h-12 hologram-float">
                  <Image
                    src="/aurexia-logo.png"
                    alt="Aurexia"
                    fill
                    className="object-contain drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]"
                  />
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight hologram-text">
                    AUREXIA
                  </div>
                  <div className="text-xs text-axc-green font-mono">AXC MAINNET LIVE</div>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aurexia Chain is a next-generation Layer-1 blockchain engineered for performance,
                security, and true decentralization. Powering the future of finance and digital ownership.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-2">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: MessageCircle, label: "Discord" },
                  { icon: Github, label: "GitHub" },
                  { icon: BookOpen, label: "Docs" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg glass-panel border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-axc-blue">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Chain info bar */}
          <div className="flex flex-wrap items-center gap-4 py-5 border-t border-b border-white/5 mb-8">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Network Config:</span>
            {chainInfo.map((info) => (
              <div key={info.label} className="flex items-center gap-2 glass-panel border border-white/10 px-3 py-1.5 rounded-full">
                <span className="text-xs text-muted-foreground font-mono">{info.label}:</span>
                <span className="text-xs text-primary font-mono font-semibold">{info.value}</span>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © 2025 Aurexia Foundation. All rights reserved. AXC is the native currency of the Aurexia Chain.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Audits</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
