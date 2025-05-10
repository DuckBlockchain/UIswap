"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { config } from "@/config/rainbow-kit"
// Import CSS từ đường dẫn chính xác
import "@rainbow-me/rainbowkit/dist/index.css"

const queryClient = new QueryClient()

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use client-side rendering for WalletConnect to avoid SSR issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted ? (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: "#a855f7",
                accentColorForeground: "white",
                borderRadius: "medium",
                fontStack: "system",
                overlayBlur: "small",
              })}
              modalSize="compact"
            >
              <ThemeProvider attribute="class" defaultTheme="dark">
                {children}
                <Toaster />
              </ThemeProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      ) : (
        // Simple loading state while client-side code initializes
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </ThemeProvider>
      )}
    </>
  )
}
