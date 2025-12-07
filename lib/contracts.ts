// Monad Testnet Configuration
export const MONAD_TESTNET = {
  chainId: 10143, // Monad Testnet
  name: "Monad Testnet",
  rpcUrl: "https://testnet-rpc.monad.xyz",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  blockExplorer: "https://explorer.monad.xyz",
};

// Contract addresses (deployed on Monad Devnet)
export const CONTRACTS = {
  // ProjectRegistry contract - manages projects, clones, revenue
  PROJECT_REGISTRY: "0x0000000000000000000000000000000000000000", // TODO: Deploy and update
};

// Contract ABI for ProjectRegistry
export const PROJECT_REGISTRY_ABI = [
  {
    name: "createProject",
    type: "function",
    inputs: [
      { name: "name", type: "string" },
      { name: "metadataURI", type: "string" },
      { name: "clonePrice", type: "uint256" },
      { name: "productionFee", type: "uint256" },
    ],
    outputs: [{ name: "projectId", type: "uint256" }],
  },
  {
    name: "cloneProject",
    type: "function",
    inputs: [{ name: "projectId", type: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    name: "reportProduction",
    type: "function",
    inputs: [
      { name: "projectId", type: "uint256" },
      { name: "quantity", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    name: "getProject",
    type: "function",
    inputs: [{ name: "projectId", type: "uint256" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "name", type: "string" },
      { name: "clonePrice", type: "uint256" },
      { name: "productionFee", type: "uint256" },
      { name: "totalClones", type: "uint256" },
      { name: "totalProduced", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    name: "getCreatorEarnings",
    type: "function",
    inputs: [{ name: "creator", type: "address" }],
    outputs: [{ name: "earnings", type: "uint256" }],
    stateMutability: "view",
  },
  {
    name: "ProjectCreated",
    type: "event",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
    ],
  },
  {
    name: "ProjectCloned",
    type: "event",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "cloner", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "ProductionReported",
    type: "event",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "reporter", type: "address", indexed: true },
      { name: "quantity", type: "uint256", indexed: false },
      { name: "totalFee", type: "uint256", indexed: false },
    ],
  },
] as const;

// Helper to format MON amount
export function formatMON(wei: bigint): string {
  const mon = Number(wei) / 1e18;
  return mon.toFixed(4);
}

// Helper to parse MON to wei
export function parseMON(mon: string): bigint {
  return BigInt(Math.floor(parseFloat(mon) * 1e18));
}
