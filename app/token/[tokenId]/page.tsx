"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TokenProvider, useTokenContext, type Token } from "@/components/token-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ExternalLink, Wallet, DollarSign, BarChart3 } from "lucide-react"
import Link from "next/link"
import { WalletProvider } from "@/contexts/wallet-context"

export default function TokenPage() {
  return (
    <TokenProvider>
      <WalletProvider>
        <TokenPageContent />
      </WalletProvider>
    </TokenProvider>
  )
}

function TokenPageContent() {
  const params = useParams()
  const { tokens } = useTokenContext()
  const [token, setToken] = useState<Token | null>(null)
  const [usdcToken, setUsdcToken] = useState<Token | null>(null)

  // Find token based on URL params
  useEffect(() => {
    if (params.tokenId) {
      const foundToken = tokens.find((t) => t.id === params.tokenId) || null
      setToken(foundToken)

      // Find USDC token for price reference
      const usdc = tokens.find((t) => t.id === "usd-coin") || null
      setUsdcToken(usdc)
    }
  }, [params, tokens])

  if (!token || !usdcToken) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-white">Token not found</h1>
            <Link href="/" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
              Return to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const tokenValue = token.balance * token.price

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Swap
        </Link>

        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="flex items-center gap-4">
            <img src={token.logo || "/placeholder.svg"} alt={token.name} className="h-16 w-16 rounded-full" />
            <div>
              <h1 className="text-3xl font-bold text-white">{token.name}</h1>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-lg">{token.symbol}</span>
                <a
                  href={`https://etherscan.io/token/${token.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex-grow mt-4 md:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-slate-400">Price</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-bold text-white">${token.price.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-slate-400">Your Balance</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-bold text-white">
                      {token.balance.toFixed(4)} {token.symbol}
                    </div>
                    <div className="text-sm text-slate-400">${tokenValue.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-slate-400">Market Cap</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-bold text-white">
                      $
                      {(
                        token.price *
                        (token.id === "bitcoin" ? 19000000 : token.id === "ethereum" ? 120000000 : 1000000000)
                      ).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="bg-slate-700 mb-6">
            <TabsTrigger value="chart" className="data-[state=active]:bg-slate-600">
              Price Chart
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-slate-600">
              About
            </TabsTrigger>
            <TabsTrigger value="markets" className="data-[state=active]:bg-slate-600">
              Markets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="mt-0">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Price Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-400">Current Price</span>
                    <span className="text-white font-medium">${token.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-400">24h Change</span>
                    <span className="text-green-400">+2.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-400">7d Change</span>
                    <span className="text-red-400">-1.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-slate-400">All-time High</span>
                    <span className="text-white font-medium">${(token.price * 1.5).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>About {token.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  {token.id === "ethereum"
                    ? "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization."
                    : token.id === "bitcoin"
                      ? "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries."
                      : token.id === "uiswap"
                        ? "UIswap is the native token of the UIswap decentralized exchange. It's used for governance, staking, and providing liquidity incentives across the platform."
                        : `${token.name} (${token.symbol}) is a digital asset traded on various cryptocurrency exchanges.`}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Token Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Symbol</span>
                        <span className="text-white">{token.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Price</span>
                        <span className="text-white">${token.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Market Cap</span>
                        <span className="text-white">
                          $
                          {(
                            token.price *
                            (token.id === "bitcoin" ? 19000000 : token.id === "ethereum" ? 120000000 : 1000000000)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Links</h3>
                    <div className="space-y-2">
                      <a href="#" className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
                        <ExternalLink className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
                        <ExternalLink className="h-4 w-4" />
                        <span>Explorer</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
                        <ExternalLink className="h-4 w-4" />
                        <span>Community</span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="mt-0">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Exchange</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Pair</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Price</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">24h Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4 text-white">UIswap</td>
                        <td className="py-3 px-4 text-white">{token.symbol}/USDC</td>
                        <td className="py-3 px-4 text-white text-right">${token.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-white text-right">$1,245,678</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4 text-white">Binance</td>
                        <td className="py-3 px-4 text-white">{token.symbol}/USDT</td>
                        <td className="py-3 px-4 text-white text-right">${(token.price * 0.998).toFixed(2)}</td>
                        <td className="py-3 px-4 text-white text-right">$3,456,789</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4 text-white">Coinbase</td>
                        <td className="py-3 px-4 text-white">{token.symbol}/USD</td>
                        <td className="py-3 px-4 text-white text-right">${(token.price * 1.002).toFixed(2)}</td>
                        <td className="py-3 px-4 text-white text-right">$2,345,678</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
