"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TokenProvider, useTokenContext } from "@/components/token-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Plus, ArrowUpRight, Wallet } from "lucide-react"
import Link from "next/link"
import { AddLiquidityModal } from "@/components/add-liquidity-modal"
import { useWalletInfo } from "@/hooks/use-wallet-info"
import { useWalletConnection } from "@/hooks/use-wallet-connection"

// Define pool types
interface Pool {
  id: string
  token0: {
    id: string
    symbol: string
    logo: string
  }
  token1: {
    id: string
    symbol: string
    logo: string
  }
  tvl: number
  apr: number
  volume24h: number
  userLiquidity: number
  userShare: number
}

export default function PoolsPage() {
  return (
    <TokenProvider>
      <PoolsContent />
    </TokenProvider>
  )
}

function PoolsContent() {
  const { tokens } = useTokenContext()
  const { isConnected } = useWalletInfo()
  const { openConnectModal } = useWalletConnection()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false)

  // Sample pool data
  const pools: Pool[] = [
    {
      id: "eth-usdc",
      token0: {
        id: "ethereum",
        symbol: "ETH",
        logo: "/ethereum-crystal.png",
      },
      token1: {
        id: "usd-coin",
        symbol: "USDC",
        logo: "/usdc-digital-currency.png",
      },
      tvl: 5600000,
      apr: 12.5,
      volume24h: 1200000,
      userLiquidity: isConnected ? 2500 : 0,
      userShare: isConnected ? 0.045 : 0,
    },
    {
      id: "eth-uis",
      token0: {
        id: "ethereum",
        symbol: "ETH",
        logo: "/ethereum-crystal.png",
      },
      token1: {
        id: "uiswap",
        symbol: "UIS",
        logo: "/placeholder.svg?key=8swhu",
      },
      tvl: 2800000,
      apr: 18.2,
      volume24h: 750000,
      userLiquidity: isConnected ? 1200 : 0,
      userShare: isConnected ? 0.043 : 0,
    },
    {
      id: "btc-usdc",
      token0: {
        id: "bitcoin",
        symbol: "BTC",
        logo: "/placeholder.svg?key=w1leb",
      },
      token1: {
        id: "usd-coin",
        symbol: "USDC",
        logo: "/usdc-digital-currency.png",
      },
      tvl: 4200000,
      apr: 9.8,
      volume24h: 980000,
      userLiquidity: isConnected ? 0 : 0,
      userShare: 0,
    },
    {
      id: "uis-usdc",
      token0: {
        id: "uiswap",
        symbol: "UIS",
        logo: "/placeholder.svg?key=vgljz",
      },
      token1: {
        id: "usd-coin",
        symbol: "USDC",
        logo: "/usdc-digital-currency.png",
      },
      tvl: 1500000,
      apr: 22.5,
      volume24h: 450000,
      userLiquidity: isConnected ? 800 : 0,
      userShare: isConnected ? 0.053 : 0,
    },
  ]

  // Filter pools based on search query
  const filteredPools = pools.filter(
    (pool) =>
      pool.token0.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.token1.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort pools - user pools first, then by TVL
  const sortedPools = [...filteredPools].sort((a, b) => {
    if (a.userLiquidity > 0 && b.userLiquidity === 0) return -1
    if (a.userLiquidity === 0 && b.userLiquidity > 0) return 1
    return b.tvl - a.tvl
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">Liquidity Pools</h1>
          <Button
            onClick={() => (isConnected ? setIsAddLiquidityOpen(true) : openConnectModal?.())}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Liquidity
          </Button>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 mb-1">Total Value Locked</span>
                <span className="text-2xl font-bold text-white">
                  ${(pools.reduce((sum, pool) => sum + pool.tvl, 0) / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 mb-1">24h Trading Volume</span>
                <span className="text-2xl font-bold text-white">
                  ${(pools.reduce((sum, pool) => sum + pool.volume24h, 0) / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-400 mb-1">Your Total Liquidity</span>
                {isConnected ? (
                  <span className="text-2xl font-bold text-white">
                    ${pools.reduce((sum, pool) => sum + pool.userLiquidity, 0).toLocaleString()}
                  </span>
                ) : (
                  <Button
                    onClick={() => openConnectModal?.()}
                    variant="outline"
                    className="mt-1 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the component remains the same */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-slate-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-600">
                All Pools
              </TabsTrigger>
              <TabsTrigger value="my" className="data-[state=active]:bg-slate-600">
                My Pools
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search pools"
                className="pl-9 bg-slate-700 border-slate-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Pool</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">TVL</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">APR</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">Volume (24h)</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium">My Liquidity</th>
                        <th className="text-right py-3 px-4 text-slate-400 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPools.length > 0 ? (
                        sortedPools.map((pool) => (
                          <tr key={pool.id} className="border-b border-slate-700">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="flex -space-x-2 mr-3">
                                  <img
                                    src={pool.token0.logo || "/placeholder.svg"}
                                    alt={pool.token0.symbol}
                                    className="h-8 w-8 rounded-full ring-2 ring-slate-800"
                                  />
                                  <img
                                    src={pool.token1.logo || "/placeholder.svg"}
                                    alt={pool.token1.symbol}
                                    className="h-8 w-8 rounded-full ring-2 ring-slate-800"
                                  />
                                </div>
                                <span className="font-medium text-white">
                                  {pool.token0.symbol}/{pool.token1.symbol}
                                </span>
                                {pool.userLiquidity > 0 && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                                    My Pool
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right text-white">${pool.tvl.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right text-green-400">{pool.apr.toFixed(1)}%</td>
                            <td className="py-3 px-4 text-right text-white">${pool.volume24h.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">
                              {pool.userLiquidity > 0 ? (
                                <div>
                                  <div className="text-white">${pool.userLiquidity.toLocaleString()}</div>
                                  <div className="text-xs text-slate-400">
                                    {(pool.userShare * 100).toFixed(2)}% share
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Link href={`/pools/${pool.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-700">
                                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No pools found matching your search
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my" className="mt-0">
            {isConnected ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-400 font-medium">Pool</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">TVL</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">APR</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">My Liquidity</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium">My Share</th>
                          <th className="text-right py-3 px-4 text-slate-400 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPools.filter((pool) => pool.userLiquidity > 0).length > 0 ? (
                          sortedPools
                            .filter((pool) => pool.userLiquidity > 0)
                            .map((pool) => (
                              <tr key={pool.id} className="border-b border-slate-700">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="flex -space-x-2 mr-3">
                                      <img
                                        src={pool.token0.logo || "/placeholder.svg"}
                                        alt={pool.token0.symbol}
                                        className="h-8 w-8 rounded-full ring-2 ring-slate-800"
                                      />
                                      <img
                                        src={pool.token1.logo || "/placeholder.svg"}
                                        alt={pool.token1.symbol}
                                        className="h-8 w-8 rounded-full ring-2 ring-slate-800"
                                      />
                                    </div>
                                    <span className="font-medium text-white">
                                      {pool.token0.symbol}/{pool.token1.symbol}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right text-white">${pool.tvl.toLocaleString()}</td>
                                <td className="py-3 px-4 text-right text-green-400">{pool.apr.toFixed(1)}%</td>
                                <td className="py-3 px-4 text-right text-white">
                                  ${pool.userLiquidity.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right text-white">
                                  {(pool.userShare * 100).toFixed(2)}%
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Link href={`/pools/${pool.id}`}>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full hover:bg-slate-700"
                                    >
                                      <ArrowUpRight className="h-4 w-4 text-slate-400" />
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400">
                              You don't have any liquidity positions yet
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="pt-6 pb-8 px-6 flex flex-col items-center text-center">
                  <Wallet className="h-12 w-12 text-purple-400 mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
                  <p className="text-slate-400 mb-6">Connect your wallet to view your liquidity positions</p>
                  <Button
                    onClick={() => openConnectModal?.()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />

      <AddLiquidityModal open={isAddLiquidityOpen} onOpenChange={setIsAddLiquidityOpen} />
    </div>
  )
}
