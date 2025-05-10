"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TokenProvider, useTokenContext } from "@/components/token-provider"
import SwapInterface from "@/components/swap-interface"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PairPage() {
  return (
    <TokenProvider>
      <WalletWrapper>
        <PairPageContent />
      </WalletWrapper>
    </TokenProvider>
  )
}

// This is needed to avoid "useWallet must be used within a WalletProvider" error
function WalletWrapper({ children }: { children: React.ReactNode }) {
  "use client"
  // Import WalletProvider dynamically to avoid SSR issues
  const { WalletProvider } = require("@/contexts/wallet-context")

  return <WalletProvider>{children}</WalletProvider>
}

function PairPageContent() {
  const params = useParams()
  const { tokens } = useTokenContext()
  const [baseToken, setBaseToken] = useState(tokens[0])
  const [quoteToken, setQuoteToken] = useState(tokens[1])

  // Find tokens based on URL params
  useEffect(() => {
    if (params.baseToken && params.quoteToken) {
      const base = tokens.find((t) => t.id === params.baseToken) || tokens[0]
      const quote = tokens.find((t) => t.id === params.quoteToken) || tokens[1]
      setBaseToken(base)
      setQuoteToken(quote)
    }
  }, [params, tokens])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Swap
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg font-medium">
                {baseToken.symbol}/{quoteToken.symbol} Price
              </h2>
              <div className="text-lg font-semibold text-white">${baseToken.price.toFixed(2)}</div>
            </div>
          </div>
          <div>
            <SwapInterface initialBaseToken={baseToken} initialQuoteToken={quoteToken} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
