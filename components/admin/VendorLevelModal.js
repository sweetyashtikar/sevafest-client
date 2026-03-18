import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { vendorLevelService } from "@/API/vendorLevelAPI";
import { toast } from "react-toastify";

export default function VendorLevelModal({ onClose, initialData, onSuccess, subscriptionId }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    levelName: "",
    salesThreshold: "",
    cashbackPercentage: "",
    description: "",
    isActive: true,
    subscriptionId: subscriptionId || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        salesThreshold: initialData.salesThreshold.toString(),
        cashbackPercentage: initialData.cashbackPercentage.toString(),
      });
    } else if (subscriptionId) {
        setFormData(prev => ({ ...prev, subscriptionId }));
    }
  }, [initialData, subscriptionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        salesThreshold: Number(formData.salesThreshold),
        cashbackPercentage: Number(formData.cashbackPercentage),
      };

      if (initialData) {
        await vendorLevelService.updateLevel(initialData._id, dataToSubmit);
        toast.success("Vendor level updated successfully");
      } else {
        await vendorLevelService.createLevel(dataToSubmit);
        toast.success("Vendor level created successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving vendor level:", error);
      toast.error(error.message || "Failed to save vendor level");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {initialData ? "Edit Vendor Level" : "Create Vendor Level"}
            </h2>
            <p className="text-sm text-slate-400 font-medium mt-1">
              Set sales targets and cashback rewards for vendors
            </p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                Level Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Silver Elite"
                value={formData.levelName}
                onChange={(e) => setFormData({ ...formData, levelName: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                Sales Threshold (₹)
              </label>
              <input
                required
                type="number"
                placeholder="50000"
                value={formData.salesThreshold}
                onChange={(e) => setFormData({ ...formData, salesThreshold: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                Cashback (%)
              </label>
              <input
                required
                type="number"
                step="0.1"
                placeholder="2.5"
                value={formData.cashbackPercentage}
                onChange={(e) => setFormData({ ...formData, cashbackPercentage: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                Description
              </label>
              <textarea
                placeholder="What benefits does this level provide?"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500/50 outline-none transition-all font-bold text-slate-700 resize-none h-24"
              />
            </div>

            <div className="flex items-center gap-4 px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl">
              <input
                type="checkbox"
                id="levelActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="levelActive" className="text-sm font-black text-slate-500 uppercase tracking-wider cursor-pointer">
                Set as Active
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : initialData ? "Update Level" : "Create Level"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
