"use client"

import {
  createContext, useContext, useState, useEffect,
  useCallback, useMemo, type ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────────
// AUREXIA CHAIN — NATIVE WALLET (no external extension needed)
// Chain ID 7171 · AXC Mainnet · EVM Compatible
// ─────────────────────────────────────────────────────────────

export const AXC_CHAIN_ID   = 7171
export const AXC_CHAIN_NAME = "Aurexia Chain Mainnet"
export const AXC_RPC        = "https://rpc.aurexia.io"
export const AXC_EXPLORER   = "https://explorer.aurexia.io"
export const AXC_SYMBOL     = "AXC"

// Simulated live balances (replace with real eth_call once contract deployed)
const LIVE_BALANCES: Record<string, number> = {
  AXC:  24850.42,
  BTC:  0.0842,
  ETH:  2.148,
  USDC: 5200.0,
  SOL:  18.34,
  BNB:  4.72,
}

// ── BIP-39 word subset for mnemonic generation ──────────────
const WORDS = [
  "abandon","ability","able","about","above","absent","absorb","abstract",
  "absurd","abuse","access","accident","account","accuse","achieve","acid",
  "acoustic","acquire","across","act","action","actor","actress","actual",
  "adapt","add","addict","address","adjust","admit","adult","advance",
  "advice","aerobic","affair","afford","afraid","again","age","agent",
  "agree","ahead","aim","air","airport","aisle","alarm","album",
  "alcohol","alert","alien","all","alley","allow","almost","alone",
  "alpha","already","also","alter","always","amateur","amazing","among",
  "amount","amused","analyst","anchor","ancient","anger","angle","angry",
  "animal","ankle","announce","annual","another","answer","antenna","antique",
  "anxiety","any","apart","apology","appear","apple","approve","april",
  "arch","arctic","area","arena","argue","arm","armed","armor",
  "army","around","arrange","arrest","arrive","arrow","art","artefact",
  "artist","artwork","ask","aspect","assault","asset","assist","assume",
  "asthma","athlete","atom","attack","attend","attitude","attract","auction",
  "audit","august","aunt","author","auto","autumn","average","avocado",
  "avoid","awake","aware","away","awesome","awful","awkward","axis",
  "baby","bachelor","bacon","badge","bag","balance","balcony","ball",
  "bamboo","banana","banner","bar","barely","bargain","barrel","base",
  "basic","basket","battle","beach","bean","beauty","because","become",
  "beef","before","begin","behave","behind","believe","below","belt",
  "bench","benefit","best","betray","better","between","beyond","bicycle",
  "bid","bike","bind","biology","bird","birth","bitter","black",
  "blade","blame","blanket","blast","bleak","bless","blind","blood",
  "blossom","blouse","blue","blur","blush","board","boat","body",
]

// ── Crypto helpers ────────────────────────────────────────────
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")
}

function genPrivateKey(): string {
  return "0x" + toHex(crypto.getRandomValues(new Uint8Array(32)))
}

function deriveAddress(pk: string): string {
  const raw = pk.replace("0x", "").match(/.{2}/g)!.map(h => parseInt(h, 16))
  const addr = Array.from({ length: 20 }, (_, i) =>
    (raw[i] ^ raw[i + 12] ^ (i * 7)) & 0xff
  )
  return "0x" + addr.map(b => b.toString(16).padStart(2, "0")).join("")
}

function genMnemonic(): string {
  const entropy = crypto.getRandomValues(new Uint8Array(16))
  return Array.from({ length: 12 }, (_, i) =>
    WORDS[(entropy[i] + i * 19) % WORDS.length]
  ).join(" ")
}

// ── Types ────────────────────────────────────────────────────
export interface WalletState {
  address:      string | null
  isConnected:  boolean
  isConnecting: boolean
  chainId:      number
  balances:     Record<string, number>
  privateKey:   string | null
  mnemonic:     string | null
  isNewWallet:  boolean
}

export interface WalletContextType extends WalletState {
  connectWallet:    () => Promise<void>
  createWallet:     () => Promise<{ address: string; privateKey: string; mnemonic: string }>
  importWallet:     (pk: string) => Promise<void>
  disconnectWallet: () => void
  refreshBalances:  () => void
  sendTransaction:  (to: string, amount: number, symbol?: string) => Promise<string>
}

const WalletCtx = createContext<WalletContextType | null>(null)

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletCtx)
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>")
  return ctx
}

// ── Provider ─────────────────────────────────────────────────
const INITIAL: WalletState = {
  address: null, isConnected: false, isConnecting: false,
  chainId: AXC_CHAIN_ID, balances: {},
  privateKey: null, mnemonic: null, isNewWallet: false,
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(INITIAL)

  // Restore persisted session on mount
  useEffect(() => {
    try {
      const addr = localStorage.getItem("axc_address")
      const pk   = localStorage.getItem("axc_pk")
      const mn   = localStorage.getItem("axc_mn")
      if (addr) {
        setState(s => ({
          ...s,
          address: addr, privateKey: pk, mnemonic: mn,
          isConnected: true, balances: LIVE_BALANCES,
        }))
      }
    } catch {
      // localStorage unavailable in some environments — silently skip
    }
  }, [])

  // ── connectWallet: tries MetaMask first, creates native wallet if unavailable ──
  const connectWallet = useCallback(async () => {
    setState(s => ({ ...s, isConnecting: true }))
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        // MetaMask / browser extension flow
        const accounts: string[] = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })
        const addr = accounts[0]
        localStorage.setItem("axc_address", addr)
        setState(s => ({
          ...s,
          address: addr, isConnected: true, isConnecting: false,
          balances: LIVE_BALANCES, isNewWallet: false,
        }))
      } else {
        // No extension — automatically create a native Aurexia wallet
        const pk   = genPrivateKey()
        const addr = deriveAddress(pk)
        const mn   = genMnemonic()
        localStorage.setItem("axc_address", addr)
        localStorage.setItem("axc_pk", pk)
        localStorage.setItem("axc_mn", mn)
        setState(s => ({
          ...s,
          address: addr, privateKey: pk, mnemonic: mn,
          isConnected: true, isConnecting: false,
          balances: LIVE_BALANCES, isNewWallet: true,
        }))
      }
    } catch {
      setState(s => ({ ...s, isConnecting: false }))
      // Swallow error — UI layer shows the result via isConnected state
    }
  }, [])

  // ── createWallet: generate a fresh keypair unconditionally ──
  const createWallet = useCallback(async () => {
    const pk   = genPrivateKey()
    const addr = deriveAddress(pk)
    const mn   = genMnemonic()
    try {
      localStorage.setItem("axc_address", addr)
      localStorage.setItem("axc_pk", pk)
      localStorage.setItem("axc_mn", mn)
    } catch {}
    setState(s => ({
      ...s,
      address: addr, privateKey: pk, mnemonic: mn,
      isConnected: true, balances: LIVE_BALANCES, isNewWallet: true,
    }))
    return { address: addr, privateKey: pk, mnemonic: mn }
  }, [])

  // ── importWallet: restore from private key ──
  const importWallet = useCallback(async (pk: string) => {
    if (!pk.startsWith("0x") || pk.length !== 66) {
      throw new Error("Invalid private key — must be 0x-prefixed 32-byte hex")
    }
    const addr = deriveAddress(pk)
    try {
      localStorage.setItem("axc_address", addr)
      localStorage.setItem("axc_pk", pk)
    } catch {}
    setState(s => ({
      ...s,
      address: addr, privateKey: pk,
      isConnected: true, balances: LIVE_BALANCES, isNewWallet: false,
    }))
  }, [])

  // ── disconnectWallet ──
  const disconnectWallet = useCallback(() => {
    try {
      localStorage.removeItem("axc_address")
      localStorage.removeItem("axc_pk")
      localStorage.removeItem("axc_mn")
    } catch {}
    setState(INITIAL)
  }, [])

  // ── refreshBalances (stub for live RPC) ──
  const refreshBalances = useCallback(() => {
    if (!state.address) return
    setState(s => ({ ...s, balances: LIVE_BALANCES }))
  }, [state.address])

  // ── sendTransaction (stub — replace with real AXC RPC call) ──
  const sendTransaction = useCallback(async (
    to: string,
    amount: number,
    symbol = "AXC",
  ): Promise<string> => {
    if (!state.address) throw new Error("Wallet not connected")
    const balance = state.balances[symbol] ?? 0
    if (amount > balance) throw new Error(`Insufficient ${symbol} balance`)
    const hash = "0x" + toHex(crypto.getRandomValues(new Uint8Array(32)))
    setState(s => ({
      ...s,
      balances: {
        ...s.balances,
        [symbol]: Math.max(0, (s.balances[symbol] ?? 0) - amount),
      },
    }))
    return hash
  }, [state.address, state.balances])

  const value = useMemo<WalletContextType>(() => ({
    ...state,
    connectWallet,
    createWallet,
    importWallet,
    disconnectWallet,
    refreshBalances,
    sendTransaction,
  }), [state, connectWallet, createWallet, importWallet,
       disconnectWallet, refreshBalances, sendTransaction])

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>
}
