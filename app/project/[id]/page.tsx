"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockProjects } from "@/lib/mockData";

// Transaction log type
interface TxLog {
  action: string;
  amount: string;
  txHash: string;
  time: string;
  status: "pending" | "success" | "failed";
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const project = mockProjects.find((p) => p.id === projectId);
  
  const [isCloning, setIsCloning] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [liveTxLogs, setLiveTxLogs] = useState<TxLog[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const [productionQty, setProductionQty] = useState(1);

  const isFree = project?.clonePrice === "0";
  const EXPLORER_URL = "https://explorer.monad.xyz";
  const RPC_URL = "https://testnet-rpc.monad.xyz";
  
  // Demo creator address to receive payments (a normal test address)
  const CREATOR_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f5bE21";

  // Connect wallet on mount
  useEffect(() => {
    const connectWallet = async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        try {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            await updateBalance(accounts[0]);
          }
        } catch (e) {
          console.error("Auto-connect failed:", e);
        }
      }
    };
    connectWallet();
  }, []);

  // Fetch balance from Monad Testnet RPC
  const updateBalance = async (address: string) => {
    try {
      const res = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", method: "eth_getBalance", params: [address, "latest"], id: 1
        })
      });
      const data = await res.json();
      const bal = (parseInt(data.result || "0x0", 16) / 1e18).toFixed(4);
      setWalletBalance(bal);
    } catch (e) {
      console.error("Balance fetch failed:", e);
    }
  };

  // Add transaction log
  const addTxLog = (log: TxLog) => {
    setLiveTxLogs(prev => [log, ...prev]);
    console.log(`📝 TX Log: ${log.action} | ${log.amount} | ${log.txHash}`);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  // Check and switch to Monad Testnet
  const switchToMonad = async () => {
    const ethereum = (window as any).ethereum;
    
    // Get current chain ID
    const currentChainId = await ethereum.request({ method: "eth_chainId" });
    console.log("📍 Current Chain ID:", currentChainId, "= decimal:", parseInt(currentChainId, 16));
    
    // Monad Testnet is 10143 = 0x279F (NOT 0x27AF!)
    const MONAD_CHAIN_ID_HEX = "0x279f"; // 10143 in lowercase hex
    const MONAD_CHAIN_ID_DEC = 10143;
    
    // Check if already on Monad Testnet (check various formats)
    const currentDec = parseInt(currentChainId, 16);
    if (currentDec === MONAD_CHAIN_ID_DEC) {
      console.log("✅ Already on Monad Testnet!");
      return true;
    }
    
    console.log("🔄 Switching to Monad Testnet...");
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_CHAIN_ID_HEX }],
      });
      return true;
    } catch (switchError: any) {
      console.log("Switch error:", switchError);
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: MONAD_CHAIN_ID_HEX,
              chainName: "Monad Testnet",
              nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
              rpcUrls: ["https://testnet-rpc.monad.xyz"],
              blockExplorerUrls: ["https://explorer.monad.xyz"]
            }]
          });
          return true;
        } catch (addError) {
          console.error("Failed to add Monad Testnet:", addError);
          return false;
        }
      }
      return false;
    }
  };

  // REAL Clone Transaction
  const handleClone = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    
    // First, switch to Monad Testnet
    console.log("🔄 Switching to Monad Testnet...");
    const switched = await switchToMonad();
    if (!switched) {
      alert("Please switch to Monad Testnet in MetaMask!");
      return;
    }
    console.log("✅ Now on Monad Testnet");
    
    if (!walletAddress) {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    }

    setIsCloning(true);
    const cloneAmount = isFree ? "0" : project.clonePrice;
    const valueInWei = "0x" + (parseFloat(cloneAmount) * 1e18).toString(16);
    
    console.log("🚀 Initiating Clone Transaction...");
    console.log(`   Amount: ${cloneAmount} MON`);
    console.log(`   To: ${CREATOR_ADDRESS}`);
    
    try {
      // Send real transaction via MetaMask
      const txHashResult = await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: walletAddress || (await ethereum.request({ method: "eth_accounts" }))[0],
          to: CREATOR_ADDRESS,
          value: valueInWei,
          data: "0x636c6f6e65" // "clone" in hex
        }]
      });
      
      console.log("✅ Transaction sent:", txHashResult);
      setTxHash(txHashResult);
      
      addTxLog({
        action: "Clone",
        amount: `${cloneAmount} MON`,
        txHash: txHashResult,
        time: new Date().toLocaleTimeString(),
        status: "success"
      });
      
      setCloneSuccess(true);
      await updateBalance(walletAddress);
      
    } catch (error: any) {
      console.error("❌ Transaction failed:", error);
      addTxLog({
        action: "Clone (Failed)",
        amount: `${cloneAmount} MON`,
        txHash: "--",
        time: new Date().toLocaleTimeString(),
        status: "failed"
      });
      alert(`Transaction failed: ${error.message || error}`);
    }
    setIsCloning(false);
  };

  // REAL Production Report Transaction
  const handleReportProduction = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum || !walletAddress) {
      alert("Please connect wallet first!");
      return;
    }

    // Switch to Monad Testnet first
    const switched = await switchToMonad();
    if (!switched) {
      alert("Please switch to Monad Testnet!");
      return;
    }

    setIsReporting(true);
    const totalFee = parseFloat(project.productionFee) * productionQty;
    const valueInWei = "0x" + (totalFee * 1e18).toString(16);
    
    console.log("🏭 Reporting Production...");
    console.log(`   Quantity: ${productionQty} units`);
    console.log(`   Fee: ${totalFee} MON`);
    
    try {
      const txHashResult = await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: walletAddress,
          to: CREATOR_ADDRESS,
          value: valueInWei,
          data: "0x70726f64" // "prod" in hex
        }]
      });
      
      console.log("✅ Production reported:", txHashResult);
      
      addTxLog({
        action: `Production (${productionQty} units)`,
        amount: `${totalFee} MON`,
        txHash: txHashResult,
        time: new Date().toLocaleTimeString(),
        status: "success"
      });
      
      await updateBalance(walletAddress);
      alert(`Production reported! TX: ${txHashResult.slice(0, 20)}...`);
      
    } catch (error: any) {
      console.error("❌ Production report failed:", error);
      alert(`Failed: ${error.message || error}`);
    }
    setIsReporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left: Project Info */}
          <div className="col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-5xl">{project.image}</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {project.name}
                      </h1>
                      {project.onChainId > 0 && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                          ⛓️ On-chain
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1">
                      by{" "}
                      <span className="text-gray-700 font-medium">
                        {project.creator}
                      </span>{" "}
                      · {project.creatorAddress}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    project.revenueModel === "sales" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {project.revenueModel === "sales" ? "🏭 Sales" : "📊 Usage"}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-gray-600 leading-relaxed">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-full border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Files */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📁 Project Files
              </h2>
              <div className="space-y-2">
                {project.files.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">📄</span>
                      <span className="text-gray-700">{file}</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {cloneSuccess ? "✓ Unlocked" : "🔒 Clone to access"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Project Stats
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {project.stars}
                  </p>
                  <p className="text-gray-500 text-sm">Stars</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {project.totalClones}
                  </p>
                  <p className="text-gray-500 text-sm">Clones</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {project.totalProduced}
                  </p>
                  <p className="text-gray-500 text-sm">Produced</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    $
                    {(
                      project.totalClones * parseFloat(project.clonePrice) * 3000 +
                      project.totalProduced * parseFloat(project.productionFee) * 3000
                    ).toFixed(0)}
                  </p>
                  <p className="text-gray-500 text-sm">Creator Earnings</p>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📈 Revenue Growth
              </h2>
              <div className="h-48 flex items-end justify-between gap-3 border-b border-gray-200 pb-2">
                {project.revenueHistory.map((item, idx) => {
                  const maxAmount = Math.max(...project.revenueHistory.map(h => h.amount));
                  const height = Math.max((item.amount / maxAmount) * 100, 10);
                  const isSales = project.revenueModel === "sales";
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center">
                      <p className="text-xs font-bold mb-1 text-gray-700">${item.amount}</p>
                      <div 
                        className={`w-full rounded-t transition-all ${isSales ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">{item.month}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Growth: +{((project.revenueHistory[5].amount / project.revenueHistory[0].amount - 1) * 100).toFixed(0)}%</span>
                <span className={project.revenueModel === "sales" ? "text-green-600" : "text-blue-600"}>
                  {project.revenueModel === "sales" ? "🏭 Hardware Sales" : "📊 Usage Revenue"}
                </span>
              </div>
            </div>

            {/* Live Transaction Logs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                ⛓️ Live On-Chain Activity
              </h2>
              
              {/* Your Live Transactions */}
              {liveTxLogs.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-green-600 font-medium mb-2">🔴 YOUR TRANSACTIONS (LIVE)</p>
                  <div className="space-y-2">
                    {liveTxLogs.map((tx, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                        tx.status === "success" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full animate-pulse ${
                            tx.status === "success" ? "bg-green-500" : "bg-red-500"
                          }`}></span>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{tx.action}</p>
                            <p className="text-xs text-gray-400">{tx.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{tx.amount}</p>
                          {tx.txHash !== "--" && (
                            <a href={`${EXPLORER_URL}/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline font-mono">
                              {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historical Mock Transactions */}
              <p className="text-xs text-gray-400 font-medium mb-2">HISTORICAL</p>
              <div className="space-y-2">
                {project.txLogs.slice(0, 3).map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        tx.action === "Clone" ? "bg-purple-500" : 
                        tx.action === "Production" ? "bg-green-500" : "bg-blue-500"
                      }`}></span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{tx.action}</p>
                        <p className="text-xs text-gray-400">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{tx.amount}</p>
                      <span className="text-xs text-gray-400 font-mono">{tx.txHash}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Powered by Monad Testnet · x402 · thirdweb
              </p>
            </div>
          </div>

          {/* Right: Clone Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Clone This Project
              </h3>

              {/* Free Clone Badge */}
              {isFree && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    ✨ Free to Clone
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Get files free! Pay revenue share when you produce.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Clone Fee</span>
                  <span className={`font-medium ${isFree ? "text-green-600" : "text-gray-900"}`}>
                    {isFree ? "FREE" : `${project.clonePrice} MON`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Production Fee/unit</span>
                  <span className="font-medium text-gray-900">
                    {project.productionFee} MON
                  </span>
                </div>

                <hr className="border-gray-200" />

                {cloneSuccess ? (
                  <div className="text-center py-4">
                    <span className="text-4xl">✅</span>
                    <p className="text-green-600 font-medium mt-2">Clone Successful!</p>
                    <p className="text-gray-500 text-sm mt-1">Files unlocked</p>
                    <p className="text-xs text-gray-400 mt-2 font-mono">{txHash}</p>
                  </div>
                ) : (
                  <button
                    onClick={handleClone}
                    disabled={isCloning}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isCloning ? "bg-gray-200 text-gray-500 cursor-wait" : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {isCloning ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Calling Monad...
                      </span>
                    ) : isFree ? "Clone Free →" : `Clone · ${project.clonePrice} MON`}
                  </button>
                )}

                <p className="text-xs text-gray-400 text-center">
                  Powered by x402 Protocol · Monad Testnet
                </p>
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span>✅</span>
                  <span className="text-gray-600">
                    Full project files (3D/PCB/Code)
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>✅</span>
                  <span className="text-gray-600">
                    Commercial license included
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>✅</span>
                  <span className="text-gray-600">
                    On-chain record, fully traceable
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue Model with Help */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">💰 Revenue Model</h3>
                <button 
                  onClick={() => setShowHelp(!showHelp)}
                  className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs hover:bg-gray-300"
                >?
                </button>
              </div>
              
              {showHelp && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium text-gray-700 mb-2">Two Revenue Models:</p>
                  <p className="text-gray-600 mb-1"><strong>1. Hardware Sales</strong>: Earn per unit produced by cloners</p>
                  <p className="text-gray-600"><strong>2. Usage Revenue Share</strong>: Earn continuously when devices are used (DePIN)</p>
                </div>
              )}
              
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="font-medium text-green-700">🏭 Hardware Sales</p>
                  <p className="text-green-600">Per unit produced → +{project.productionFee} MON</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="font-medium text-blue-700">📊 Usage Revenue Share</p>
                  <p className="text-blue-600">Device usage → Continuous earnings</p>
                </div>
              </div>
            </div>

            {/* Why Clone */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-3">🚀 Why Clone?</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Get full design files instantly</li>
                <li>• Produce & sell → pay revenue share</li>
                <li>• Deploy & use → earn from data</li>
                <li>• On-chain tracking, transparent</li>
              </ul>
            </div>

            {/* Production Report Panel */}
            {cloneSuccess && (
              <div className="bg-white rounded-lg border-2 border-green-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">🏭 Report Production</h3>
                <p className="text-sm text-gray-600 mb-4">Already cloned! Now report when you produce units.</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => setProductionQty(Math.max(1, productionQty - 1))}
                    className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200"
                  >-</button>
                  <input 
                    type="number" 
                    value={productionQty}
                    onChange={(e) => setProductionQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border rounded p-1"
                  />
                  <button 
                    onClick={() => setProductionQty(productionQty + 1)}
                    className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200"
                  >+</button>
                  <span className="text-gray-500 text-sm">units</span>
                </div>
                
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Fee ({project.productionFee} × {productionQty})</span>
                  <span className="font-bold text-gray-900">{(parseFloat(project.productionFee) * productionQty).toFixed(4)} MON</span>
                </div>
                
                <button
                  onClick={handleReportProduction}
                  disabled={isReporting}
                  className={`w-full py-3 rounded-lg font-medium ${
                    isReporting ? "bg-gray-200 text-gray-500" : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isReporting ? "Sending to Monad..." : "Report Production →"}
                </button>
              </div>
            )}

            {/* Contract Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm">
              <p className="text-gray-500">Network: <span className="text-gray-700 font-medium">Monad Testnet</span></p>
              <p className="text-gray-500">Project ID: <span className="font-mono">#{project.onChainId || "--"}</span></p>
              {walletAddress && (
                <>
                  <hr className="my-2" />
                  <p className="text-gray-500">Your Wallet: <span className="font-mono text-xs">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</span></p>
                  <p className="text-gray-500">Balance: <span className="font-bold text-green-600">{walletBalance} MON</span></p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
