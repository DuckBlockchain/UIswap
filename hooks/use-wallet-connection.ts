"use client"

import { useConnectModal, useAccountModal, useChainModal } from "@rainbow-me/rainbowkit"

export function useWalletConnection() {
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()

  return {
    openConnectModal,
    openAccountModal,
    openChainModal,
  }
}
