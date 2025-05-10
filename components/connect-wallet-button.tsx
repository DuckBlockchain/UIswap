"use client"

import { useState, useEffect } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConnectWalletButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg">
        <Wallet className="h-5 w-5 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className="connect-wallet-wrapper"
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-purple-500/20"
                  >
                    <Wallet className="h-5 w-5" />
                    <span className="font-medium">Connect Wallet</span>
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    className="bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all duration-200"
                  >
                    {chain.iconUrl && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          alt={chain.name}
                          src={chain.iconUrl || "/placeholder.svg"}
                          style={{ width: 12, height: 12 }}
                        />
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="bg-slate-700 border border-slate-600 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200"
                  >
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                    <span>{account.displayName}</span>
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
