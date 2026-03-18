"use client";

import { useEffect, useState } from "react";
import { 
  Wallet, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  IndianRupee, 
  CreditCard, 
  Zap, 
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletPage() {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchWallet = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoading(true);
      }
      
      const [walletRes, transRes] = await Promise.all([
        apiClient("/wallet/me"),
        apiClient("/wallet/transactions?page=1&limit=10")
      ]);

      if (walletRes.success) {
        setWalletData(walletRes.data);
      }
      if (transRes.success) {
        setTransactions(transRes.data.transactions);
        setHasMore(transRes.data.pagination.page < transRes.data.pagination.pages);
      }
    } catch (err) {
      console.error("Failed to fetch wallet data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await apiClient(`/wallet/transactions?page=${nextPage}&limit=10`);
      
      if (res.success) {
        setTransactions(prev => [...prev, ...res.data.transactions]);
        setPage(nextPage);
        setHasMore(res.data.pagination.page < res.data.pagination.pages);
      }
    } catch (err) {
      console.error("Failed to load more transactions", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#fdd835] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">Loading your assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#1a1c24] flex items-center gap-3 tracking-tight">
              My Wallet
            </h1>
            <p className="text-gray-500 font-medium mt-1">Manage your earnings and track every transaction.</p>
          </div>
          <button
            onClick={() => fetchWallet(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#fdd835] text-[#1a1c24] rounded-2xl font-black text-sm shadow-xl shadow-[#fdd835]/20 hover:bg-[#ebc72e] transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Updating..." : "Refresh Wallet"}
          </button>
        </div>

        {/* MAIN CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* BALANCE CARD */}
          <motion.div 
            variants={cardVars}
            className="lg:col-span-2 relative overflow-hidden bg-[#1a1c24] rounded-[2.5rem] p-10 text-white shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-sm pointer-events-none">
              <Wallet size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/10 rounded-xl">
                  <CreditCard size={24} className="text-[#fdd835]" />
                </div>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Available Balance</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6">
                <h2 className="text-7xl font-black tracking-tighter flex items-center">
                  <IndianRupee size={50} className="text-[#fdd835] -mr-1" />
                  {walletData?.balance?.toLocaleString() || "0"}
                </h2>
               
              </div>

              {/* <div className="mt-10 pt-10 border-t border-white/10 flex flex-wrap gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Total Cash Received</p>
                  <p className="text-xl font-bold flex items-center gap-1">
                    <IndianRupee size={16} className="text-gray-400" />
                    {(walletData?.totalCashReceived || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Total Transactions</p>
                  <p className="text-xl font-bold">{walletData?.transactions?.length || 0}</p>
                </div>
              </div> */}
            </div>
          </motion.div>

          
        </div>

        {/* TRANSACTIONS LIST */}
        <motion.div 
          variants={cardVars}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          <div className="px-10 py-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 text-gray-600 rounded-2xl">
                <History size={22} />
              </div>
              <h2 className="text-xl font-black text-[#1a1c24]">Transaction History</h2>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#fdd835] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..."
                className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#fdd835]/20 focus:bg-white transition-all w-full md:w-80"
              />
            </div>
          </div>

          <div className="p-4 md:p-8">
            <div className="space-y-4">
              <AnimatePresence>
                {transactions.length > 0 ? (
                  transactions.map((tx, idx) => (
                    <motion.div
                      key={tx._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-lg hover:shadow-gray-200/40 border border-gray-50 hover:border-[#fdd835]/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-6 flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          tx.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                        }`}>
                          {tx.type === "credit" ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#1a1c24] line-clamp-1">{tx.message}</p>
                          <div className="flex items-center gap-3 mt-1.5 font-bold">
                            <span className="text-[10px] uppercase text-gray-400">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                            <span className="text-[10px] uppercase text-gray-400">{new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-10 mt-6 md:mt-0">
                        <div className="text-right">
                          <p className={`text-2xl font-black ${
                            tx.type === "credit" ? "text-green-600" : "text-red-500"
                          }`}>
                            {tx.type === "credit" ? "+" : "-"} ₹{parseFloat(tx.amount?.$numberDecimal || tx.amount).toLocaleString()}
                          </p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-500 block">{tx.status || 'SUCCESS'}</span>
                        </div>
                        <ChevronRight className="text-gray-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" size={24} />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="p-6 bg-gray-50 rounded-full mb-6">
                      <History size={40} className="text-gray-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-400 tracking-tight">No Transactions Yet</h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-xs font-medium">Your financial history will appear here once you start earning or spending.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button 
                  onClick={loadMoreTransactions}
                  disabled={loadingMore}
                  className="px-10 py-4 bg-gray-100 text-[#1a1c24] rounded-2xl font-black text-sm hover:bg-gray-200 transition-all active:scale-95 shadow-sm disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load Full History"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
