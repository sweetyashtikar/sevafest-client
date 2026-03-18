import { useState, useEffect } from "react";
import { Plus, Trophy, IndianRupee, Edit2, Trash2 } from "lucide-react";
import { vendorLevelService } from "@/API/vendorLevelAPI";
import { subscriptionService } from "@/API/subscriptionAPI";
import { toast } from "react-toastify";
import VendorLevelModal from "./VendorLevelModal";

export default function VendorLevelTable() {
  const [plans, setPlans] = useState([]);
  const [levelsByPlan, setLevelsByPlan] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [targetSubscriptionId, setTargetSubscriptionId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch all subscription plans
      const subsResponse = await subscriptionService.adminGetAllSubscriptions();
      const vendorPlans = (subsResponse.data || []).filter(plan => plan.type === 'vendor');
      setPlans(vendorPlans);

      // 2. Fetch all levels
      const levelsResponse = await vendorLevelService.getAllLevels();
      const allLevels = levelsResponse.data || [];

      // 3. Group levels by subscriptionId
      const grouped = {};
      allLevels.forEach(level => {
        if (!grouped[level.subscriptionId]) {
          grouped[level.subscriptionId] = [];
        }
        grouped[level.subscriptionId].push(level);
      });
      setLevelsByPlan(grouped);
    } catch {
      toast.error("Failed to load levels and plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this level?")) {
      try {
        await vendorLevelService.deleteLevel(id);
        toast.success("Level deleted successfully");
        fetchData();
      } catch {
        toast.error("Failed to delete level");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Synchronizing Levels...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {plans.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-10 text-center border border-slate-100 shadow-sm">
           <Trophy size={64} className="text-slate-200 mx-auto mb-4" />
           <p className="text-slate-400 font-bold text-xl">No Vendor Subscription Plans found</p>
           <p className="text-slate-300">Create a vendor subscription plan first to add levels.</p>
        </div>
      ) : (
        plans.map((plan) => (
          <div key={plan._id} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                   <IndianRupee size={20} className="stroke-[3]" />
                </div>
                <h2 className="text-xl font-black text-purple-700 uppercase tracking-tight">
                  {plan.name} LEVEL SETTINGS
                </h2>
              </div>
              <button
                onClick={() => {
                  setTargetSubscriptionId(plan._id);
                  setSelectedLevel(null);
                  setShowModal(true);
                }}
                className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-95 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Level
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">Sl No</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">Level</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">Bonus(%)</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">Limits (Sales Target)</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">Category</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {(!levelsByPlan[plan._id] || levelsByPlan[plan._id].length === 0) ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-300 font-bold italic">
                        No levels configured for this plan
                      </td>
                    </tr>
                  ) : (
                    levelsByPlan[plan._id].sort((a,b) => a.salesThreshold - b.salesThreshold).map((level, index) => (
                      <tr key={level._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5 text-sm font-bold text-slate-500">{index + 1}</td>
                        <td className="px-6 py-5 text-sm font-black text-slate-700">{level.levelName}</td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-600">
                          {level.cashbackPercentage}%
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-600">
                           ₹{level.salesThreshold.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-500 bg-slate-50/50">
                           {plan.name}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => {
                                setTargetSubscriptionId(plan._id);
                                setSelectedLevel(level);
                                setShowModal(true);
                              }}
                              className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 group/edit"
                              title="Edit Level"
                            >
                              <Edit2 size={16} className="stroke-[2.5]" />
                            </button>
                            <button
                              onClick={() => handleDelete(level._id)}
                              className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 group/del"
                              title="Delete Level"
                            >
                              <Trash2 size={16} className="stroke-[2.5]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <VendorLevelModal
          subscriptionId={targetSubscriptionId}
          onClose={() => {
            setShowModal(false);
            setSelectedLevel(null);
            setTargetSubscriptionId(null);
          }}
          initialData={selectedLevel}
          onSuccess={() => {
            setShowModal(false);
            setSelectedLevel(null);
            setTargetSubscriptionId(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
