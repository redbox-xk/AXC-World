import type { Metadata, Viewport } from 'next'
import { Cinzel, Rajdhani } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { WalletProvider } from '@/lib/wallet-context'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'AUREXIA LEGENDS — Web3 Battle Arena',
  description:
    'Enter the arena. Command legendary champions. Battle for glory and AXC rewards on the blockchain. Your legend begins now.',
  keywords: [
    'AUREXIA', 'AXC', 'blockchain', 'Web3', 'NFT', 'gaming', 'battle arena',
    'champions', 'legends', 'play to earn', 'crypto gaming', 'LoL style',
  ],
  openGraph: {
    title: 'AUREXIA LEGENDS — Command. Conquer. Ascend.',
    description: 'The ultimate Web3 battle arena. 20 legendary champions await. Stake your claim to victory.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a12',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${cinzel.variable} ${rajdhani.variable} font-sans antialiased bg-background text-foreground`}>
        <WalletProvider>
          {children}
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
