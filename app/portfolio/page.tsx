"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TokenProvider, useTokenContext } from "@/components/token-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, Search, Wallet, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useWalletInfo } from "@/hooks/use-wallet-info"
import { useWalletConnection } from "@/hooks/use-wallet-connection"

export default function PortfolioPage() {
  return (
    <TokenProvider>
      <PortfolioContent />
    </TokenProvider>
  )
}

function PortfolioContent() {
  const { tokens } = useTokenContext()
  const { isConnected, address } = useWalletInfo()
  const { openConnectModal } = useWalletConnection()
  const [searchQuery, setSearchQuery] = useState("")

  // Calculate total portfolio value
  const totalValue = tokens.reduce((sum, token) => sum + token.balance * token.price, 0)

  // Find USDC token for price reference
  const usdcToken = tokens.find((t) => t.id === "usd-coin") || tokens[1]

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardContent className="pt-6 pb-8 px-6 flex flex-col items-center text-center">
              <Wallet className="h-12 w-12 text-purple-400 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Connect Wallet</h1>
              <p className="text-slate-400 mb-6">Connect your wallet to view your portfolio</p>
              <Button
                onClick={() => openConnectModal?.()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Portfolio</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</div>
              <div className="text-sm text-slate-400 mt-1">
                {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rest of the component remains the same */}
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="bg-slate-700 mb-6">
            <TabsTrigger value="tokens" className="data-[state=active]:bg-slate-600">
              Tokens
            </TabsTrigger>
            <TabsTrigger value="nfts" className="data-[state=active]:bg-slate-600">
              NFTs
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-slate-600">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokens" className="mt-0">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Your Assets</CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search tokens"
                      className="pl-9 bg-slate-700 border-slate-600 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Asset</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Price</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Balance</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Value</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">24h</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTokens.map((token) => {
                        const tokenValue = token.balance * token.price
                        const percentage = (tokenValue / totalValue) * 100
                        // Generate random 24h change for demonstration
                        const change24h = Math.random() * 10 - 5 // Random between -5% and +5%

                        return (
                          <tr key={token.id} className="border-b border-slate-700">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={token.logo || "/placeholder.svg"}
                                  alt={token.name}
                                  className="h-8 w-8 rounded-full"
                                />
                                <div>
                                  <div className="font-medium text-white">{token.symbol}</div>
                                  <div className="text-xs text-slate-400">{token.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-white">${token.price.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="text-white">{token.balance.toFixed(4)}</div>
                              <div className="text-xs text-slate-400">{percentage.toFixed(1)}% of portfolio</div>
                            </td>
                            <td className="py-3 px-4 text-right text-white">${tokenValue.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <div
                                className={`flex items-center justify-end ${change24h >= 0 ? "text-green-400" : "text-red-400"}`}
                              >
                                {change24h >= 0 ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 mr-1" />
                                )}
                                <span>{Math.abs(change24h).toFixed(2)}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Link href={`/token/${token.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-700">
                                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nfts" className="mt-0">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 pb-8 px-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-slate-700 p-4 mb-4">
                  <img src="/placeholder.svg?key=qkrn9" alt="NFT" className="h-12 w-12" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No NFTs Found</h2>
                <p className="text-slate-400 mb-6">You don't have any NFTs in your wallet yet</p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Browse NFT Marketplace
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Details</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Date</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4 text-white">Swap</td>
                        <td className="py-3 px-4">
                          <div className="text-white">ETH → USDC</div>
                          <div className="text-xs text-slate-400">0x1234...5678</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-white">0.1 ETH</div>
                          <div className="text-xs text-slate-400">$350.00</div>
                        </td>
                        <td className="py-3 px-4 text-right text-white">5 minutes ago</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-700">
                            <ArrowUpRight className="h-4 w-4 text-slate-400" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4 text-white">Approve</td>
                        <td className="py-3 px-4">
                          <div className="text-white">UIS</div>
                          <div className="text-xs text-slate-400">0xabcd...efgh</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-white">∞ UIS</div>
                          <div className="text-xs text-slate-400">Unlimited</div>
                        </td>
                        <td className="py-3 px-4 text-right text-white">30 minutes ago</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-700">
                            <ArrowUpRight className="h-4 w-4 text-slate-400" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-3 px-4 text-white">Swap</td>
                        <td className="py-3 px-4">
                          <div className="text-white">USDC → UIS</div>
                          <div className="text-xs text-slate-400">0x9876...5432</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="text-white">100 USDC</div>
                          <div className="text-xs text-slate-400">$100.00</div>
                        </td>
                        <td className="py-3 px-4 text-right text-white">2 minutes ago</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-700">
                            <ArrowUpRight className="h-4 w-4 text-slate-400" />
                          </Button>
                        </td>
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
