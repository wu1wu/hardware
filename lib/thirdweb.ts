import { createThirdwebClient, defineChain } from "thirdweb";

// Create thirdweb client
// In production, use environment variable: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
export const client = createThirdwebClient({
  clientId: "demo-client-id", // Replace with real client ID from thirdweb dashboard
});

// Define Monad Testnet chain (official)
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpc: "https://testnet-rpc.monad.xyz",
  blockExplorers: [
    {
      name: "Monad Explorer",
      url: "https://explorer.monad.xyz",
    },
  ],
});

// Wallet connection config
export const walletConfig = {
  chain: monadTestnet,
  client,
};
