"use client"

import { useAccount, useBalance, useConfig } from "wagmi"

export function useWalletInfo() {
  const { address, isConnected, chain } = useAccount()
  const config = useConfig()
  const { data: balanceData } = useBalance({
    address: address,
  })

  return {
    address: address || null,
    isConnected,
    chainId: chain?.id,
    chainName: chain?.name || "Unknown Network",
    balance: balanceData ? balanceData.formatted : "0",
    symbol: balanceData ? balanceData.symbol : "ETH",
    chains: config.chains,
  }
}
