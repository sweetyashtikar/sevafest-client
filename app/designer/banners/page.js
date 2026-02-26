"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import { Plus, Search, Loader2 } from "lucide-react";

import BannerTable from "@/components/designer/BannerTable";
import ViewBannerModal from "@/components/designer/ViewBannerModal";

const Page = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editBanner, setEditBanner] = useState(null);

  const handleView = (item) => {
    setSelectedBanner(item);
    setOpenView(true);
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await apiClient("/banners");
      setBanners(res.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleStatusChange = async (item) => {
    try {
      const updatedStatus = !item.status;
      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === item._id
            ? { ...banner, status: updatedStatus }
            : banner,
        ),
      );

      await apiClient(`/banners/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: updatedStatus }),
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === item._id ? { ...banner, status: item.status } : banner,
        ),
      );
    }
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?",
    );

    if (!confirmDelete) return;

    try {
      await apiClient(`/banners/${item._id}`, {
        method: "DELETE",
      });

      setBanners((prev) => prev.filter((banner) => banner._id !== item._id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete banner");
    }
  };

  const handleEdit = (item) => {
    setEditBanner(item);
    setOpenForm(true);
  };

  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl mb-1 font-black text-slate-900">
            Manage Banners
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            View and organize your application banners
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-black
               focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <button
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700
             text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
            onClick={() => {
              setEditBanner(null);
              setOpenForm(true);
            }}
          >
            <Plus size={18} strokeWidth={3} />
            <span>Add Banner</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-100">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <p className="text-slate-500 font-medium animate-pulse">
            Fetching records...
          </p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <BannerTable
            data={filteredBanners}
            onStatusChange={handleStatusChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <ViewBannerModal
        isOpen={openView}
        banner={selectedBanner}
        onClose={() => setOpenView(false)}
      />
    </div>
  );
};

export default Page;
