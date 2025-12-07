"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockProjects } from "@/lib/mockData";

export default function ProjectPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const project = mockProjects.find((p) => p.id === projectId);
  
  const [isCloning, setIsCloning] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showTxModal, setShowTxModal] = useState(false);
  const [productionQty, setProductionQty] = useState(10);
  const [isReporting, setIsReporting] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  const isFree = project.clonePrice === "0";

  // Clone project - calls smart contract
  const handleClone = async () => {
    setIsCloning(true);
    // Simulate x402 payment + Monad contract call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const hash = "0x" + Math.random().toString(16).slice(2, 18) + "...";
    setTxHash(hash);
    setIsCloning(false);
    setCloneSuccess(true);
    setShowTxModal(true);
  };

  // Report production - calls smart contract
  const handleReportProduction = async () => {
    setIsReporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const hash = "0x" + Math.random().toString(16).slice(2, 18) + "...";
    setTxHash(hash);
    setIsReporting(false);
    setShowTxModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Transaction Modal */}
      {showTxModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTxModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <span className="text-5xl">✅</span>
              <h3 className="text-lg font-semibold mt-3">Transaction Successful!</h3>
              <p className="text-gray-500 text-sm mt-2">Your transaction has been confirmed on Monad.</p>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Transaction Hash</p>
                <p className="text-sm font-mono text-gray-700 break-all">{txHash}</p>
              </div>
              <a 
                href={`https://explorer.devnet.monad.xyz/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-blue-600 hover:underline"
              >
                View on Monad Explorer →
              </a>
            </div>
            <button onClick={() => setShowTxModal(false)} className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← Back to Projects
            </Link>
            {project.onChainId > 0 && (
              <a 
                href={`https://explorer.devnet.monad.xyz/address/0x...`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Contract on Monad →
              </a>
            )}
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
                          ⛓️ On-chain #{project.onChainId}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1">
                      by <span className="text-gray-700 font-medium">{project.creator}</span> · {project.creatorAddress}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {project.hasRevenueShare && (
                    <span className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full font-medium">
                      💰 Revenue Share
                    </span>
                  )}
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
                    {cloneSuccess ? (
                      <button className="text-blue-600 text-sm hover:underline">
                        Download ↓
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">🔒 Clone to access</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats & Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Project Stats
              </h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{project.stars}</p>
                  <p className="text-gray-500 text-sm">Stars</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{project.totalClones}</p>
                  <p className="text-gray-500 text-sm">Clones</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{project.totalProduced}</p>
                  <p className="text-gray-500 text-sm">Produced</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    ${(project.totalProduced * parseFloat(project.productionFee) * 3000).toFixed(0)}
                  </p>
                  <p className="text-gray-500 text-sm">Creator Earnings</p>
                </div>
              </div>

              {/* Revenue Chart */}
              <h3 className="font-medium text-gray-700 mb-3">📈 Revenue Growth</h3>
              <div className="h-32 flex items-end justify-between gap-1">
                {project.revenueHistory.map((item) => {
                  const maxAmount = Math.max(...project.revenueHistory.map(h => h.amount));
                  const height = (item.amount / maxAmount) * 100;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                        style={{ height: `${height}%` }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-1">{item.month}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Report Production (if cloned) */}
            {cloneSuccess && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  🏭 Report Production
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Produced devices? Report to trigger automatic revenue share to the creator.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={productionQty}
                    onChange={(e) => setProductionQty(parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    min="1"
                  />
                  <span className="text-gray-500">units × {project.productionFee} MON = </span>
                  <span className="font-medium">{(productionQty * parseFloat(project.productionFee)).toFixed(4)} MON</span>
                </div>
                <button
                  onClick={handleReportProduction}
                  disabled={isReporting}
                  className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300"
                >
                  {isReporting ? "Submitting to Monad..." : "Report Production & Pay Revenue"}
                </button>
              </div>
            )}
          </div>

          {/* Right: Clone Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Clone This Project
              </h3>

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
                    <p className="text-gray-500 text-sm mt-1">Files unlocked. Start producing!</p>
                  </div>
                ) : (
                  <button
                    onClick={handleClone}
                    disabled={isCloning}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isCloning
                        ? "bg-gray-200 text-gray-500 cursor-wait"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {isCloning ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Calling Monad Contract...
                      </span>
                    ) : isFree ? (
                      "Clone Free →"
                    ) : (
                      `Clone · ${project.clonePrice} MON`
                    )}
                  </button>
                )}

                <p className="text-xs text-gray-400 text-center">
                  x402 Payment · Monad Contract · thirdweb
                </p>
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span>✅</span>
                  <span className="text-gray-600">Full project files (3D/PCB/Code)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>✅</span>
                  <span className="text-gray-600">Production & commercial use</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span>✅</span>
                  <span className="text-gray-600">On-chain record, fully traceable</span>
                </div>
              </div>
            </div>

            {/* Revenue Model */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">💰 How Revenue Works</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">1. Clone Project</p>
                  <p className="text-gray-500">Get design files, pay {isFree ? "nothing" : "clone fee"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">2. Produce Devices</p>
                  <p className="text-gray-500">Manufacture and sell</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-700">3. Report & Share</p>
                  <p className="text-green-600">Pay {project.productionFee} MON/unit → Creator earns</p>
                </div>
              </div>
            </div>

            {/* Smart Contract Info */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-3">⛓️ Smart Contract</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Network</span>
                  <span className="text-white">Monad Devnet</span>
                </div>
                <div className="flex justify-between">
                  <span>Contract</span>
                  <span className="font-mono text-xs">0x...Registry</span>
                </div>
                <div className="flex justify-between">
                  <span>Project ID</span>
                  <span className="text-white">#{project.onChainId || "Not deployed"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
