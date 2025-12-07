"use client";

import { useState } from "react";
import { mockProjects, categories, Project } from "@/lib/mockData";
import Link from "next/link";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModel, setSelectedModel] = useState<"all" | "sales" | "usage">("all");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connect wallet and read balance directly from Monad Testnet RPC
  const connectWallet = async () => {
    if (isConnecting) return;
    
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    
    setIsConnecting(true);
    try {
      // Get wallet address from MetaMask
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      console.log("Wallet address:", address);
      
      // Read balance directly from Monad Testnet RPC (not via MetaMask)
      const rpcResponse = await fetch("https://testnet-rpc.monad.xyz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1
        })
      });
      const rpcData = await rpcResponse.json();
      console.log("Monad Testnet balance response:", rpcData);
      
      const balanceWei = rpcData.result || "0x0";
      const balanceInMON = (parseInt(balanceWei, 16) / 1e18).toFixed(4);
      console.log("Balance in MON:", balanceInMON);
      
      setWalletAddress(address.slice(0, 6) + "..." + address.slice(-4));
      setWalletBalance(balanceInMON);
      setWalletConnected(true);
    } catch (error: any) {
      console.error("Connection failed:", error);
      if (error.code === -32002) {
        alert("MetaMask has a pending request. Please open MetaMask and complete it.");
      } else if (error.code === 4001) {
        alert("Connection rejected by user.");
      }
    }
    setIsConnecting(false);
  };

  
  const filteredProjects = mockProjects.filter((project) => {
    const matchCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchModel = selectedModel === "all" || project.revenueModel === selectedModel;
    const matchSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchModel && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔧</span>
              <h1 className="text-xl font-bold text-gray-900">MakerKit</h1>
              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                Monad Testnet
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                Explore
              </Link>
              <button 
                onClick={() => setShowMyProjects(!showMyProjects)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                My Projects
              </button>
              {walletConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg">
                    <span className="text-sm font-bold">{walletBalance} MON</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm font-medium">{walletAddress}</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hardware Creation & Revenue Share
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Share hardware designs, let others produce, earn on-chain royalties forever.
            <br />
            <span className="text-sm text-gray-500">Clone → Produce → Creator earns revenue share automatically</span>
            <br />
            <span className="text-red-600 font-medium mt-2 inline-block">Powered by Monad · x402 · thirdweb</span>
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search projects, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>
      </section>

      {/* My Projects Modal */}
      {showMyProjects && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMyProjects(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">My Projects</h3>
            {walletConnected ? (
              <div className="space-y-3">
                <p className="text-gray-600">You have cloned 3 projects</p>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500">Total earnings: <span className="text-green-600 font-medium">$1,234</span></p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Please connect wallet to view your projects</p>
            )}
            <button onClick={() => setShowMyProjects(false)} className="mt-4 w-full py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            {/* Revenue Model Filter */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Revenue Model</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedModel("all")}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedModel === "all" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                  }`}
                >
                  All Models
                </button>
                <button
                  onClick={() => setSelectedModel("sales")}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedModel === "sales" ? "bg-green-100 text-green-700 font-medium" : "text-green-600 hover:bg-green-50"
                  }`}
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  🏭 Hardware Sales
                </button>
                <button
                  onClick={() => setSelectedModel("usage")}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedModel === "usage" ? "bg-blue-100 text-blue-700 font-medium" : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  📊 Usage Revenue
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-gray-100 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Platform Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Clones</span>
                  <span className="font-medium">12,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Devices Produced</span>
                  <span className="font-medium">45,678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue Shared</span>
                  <span className="font-medium text-green-600">$123,456</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Project Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCategory === "All" ? "All Projects" : selectedCategory}
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredProjects.length})
                </span>
              </h3>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Newest</option>
                <option>Most Cloned</option>
                <option>Most Stars</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isFree = project.clonePrice === "0";
  const isSales = project.revenueModel === "sales";
  const borderColor = isSales ? "border-l-green-500" : "border-l-blue-500";
  
  return (
    <Link href={`/project/${project.id}`}>
      <div className={`bg-white rounded-lg border border-gray-200 border-l-4 ${borderColor} p-5 hover:shadow-md transition-all cursor-pointer`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{project.image}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">
                  {project.name}
                </h4>
                {project.onChainId > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    ⛓️ #{project.onChainId}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                by {project.creator}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-2 py-1 text-xs rounded font-medium ${
              isSales ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            }`}>
              {isSales ? "🏭 Sales" : "📊 Usage"}
            </span>
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
              {project.category}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-gray-50 text-gray-500 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-3 text-gray-500 text-xs">
            <span>⭐ {project.stars}</span>
            <span>📥 {project.totalClones}</span>
            <span>🏭 {project.totalProduced}</span>
          </div>
          <div className="text-right">
            {isFree ? (
              <span className="text-green-600 font-medium">Free Clone</span>
            ) : (
              <span className="text-gray-900 font-medium">{project.clonePrice} MON</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
