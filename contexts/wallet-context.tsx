"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { useAccount, useSwitchChain, useConfig } from "wagmi"

// Define wallet types with their icons and names
export const walletTypes = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/metamask-fox-logo.png",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "/abstract-crypto-wallet.png",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    icon: "/colorful-wallet-icon.png",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "/stylized-shield-logo.png",
  },
]

// Define network types
export const networks = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "/ethereum-crystal.png",
    iconBackground: "#627EEA",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "/polygon-abstract-network.png",
    iconBackground: "#8247E5",
  },
  {
    id: "optimism",
    name: "Optimism",
    icon: "/optimistic-circuit.png",
    iconBackground: "#FF0420",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "/arbitrum-network-abstract.png",
    iconBackground: "#28A0F0",
  },
]

interface WalletContextType {
  address: string | null
  isConnected: boolean
  network: (typeof networks)[0]
  balance: string
  connect: (walletType: string) => void
  disconnect: () => void
  switchNetwork: (networkId: string) => void
  openConnectModal: () => void
  openAccountModal: () => void
  openChainModal: () => void
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  modalView: "connect" | "account" | "chain"
  setModalView: (view: "connect" | "account" | "chain") => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chain } = useAccount()
  const { chains } = useConfig()
  const { switchChain } = useSwitchChain()

  const [network, setNetwork] = useState(networks[0])
  const [balance, setBalance] = useState("0.0")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalView, setModalView] = useState<"connect" | "account" | "chain">("connect")

  // Update network when chain changes
  useEffect(() => {
    if (chain) {
      const chainNetwork = networks.find((n) => n.name.toLowerCase() === chain.name.toLowerCase()) || networks[0]
      setNetwork(chainNetwork)
    }
  }, [chain])

  // Generate a random balance when the network changes
  useEffect(() => {
    if (address) {
      const randomBalance = (Math.random() * 10).toFixed(4)
      setBalance(randomBalance)
    }
  }, [network, address])

  const connect = (walletType: string) => {
    // Mock wallet connection
    const mockAddresses: Record<string, string> = {
      metamask: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      coinbase: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      rainbow: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      trust: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    }

    const selectedAddress = mockAddresses[walletType] || "0x1234567890123456789012345678901234567890"

    // This is just for mock purposes - in reality, RainbowKit handles this
    toast({
      title: "Wallet Connected",
      description: `Connected to ${walletType} wallet`,
    })
  }

  const disconnect = () => {
    // This is just for mock purposes - in reality, RainbowKit handles this
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const switchNetwork = (networkId: string) => {
    const newNetwork = networks.find((n) => n.id === networkId) || networks[0]
    setNetwork(newNetwork)

    // Find the corresponding chain in wagmi config
    const targetChain = chains.find((c) => c.name.toLowerCase().includes(networkId))
    if (targetChain) {
      switchChain({ chainId: targetChain.id })
    }

    toast({
      title: "Network Changed",
      description: `Switched to ${newNetwork.name}`,
    })
  }

  const openConnectModal = () => {
    setModalView("connect")
    setIsModalOpen(true)
  }

  const openAccountModal = () => {
    setModalView("account")
    setIsModalOpen(true)
  }

  const openChainModal = () => {
    setModalView("chain")
    setIsModalOpen(true)
  }

  return (
    <WalletContext.Provider
      value={{
        address: address || null,
        isConnected: !!address,
        network,
        balance,
        connect,
        disconnect,
        switchNetwork,
        openConnectModal,
        openAccountModal,
        openChainModal,
        isModalOpen,
        setIsModalOpen,
        modalView,
        setModalView,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
