"use client";

import { useEffect, useState } from "react";
import BrandTable from "@/components/admin/BrandTable";
import AddBrandModal from "@/components/admin/AddBrandModal";
import BrandViewModal from "@/components/admin/BrandViewModal";
import { apiClient } from "@/services/apiClient";
import { Plus } from "lucide-react";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewBrand, setViewBrand] = useState(null);
  const [editBrand, setEditBrand] = useState(null);

  const fetchBrand = async () => {
    try {
      const res = await apiClient("/brands");
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, []);

  const handleStatusToggle = async (brand) => {
    try {
      await apiClient(`/brands/${brand._id}`, {
        method: "PATCH",
        body: {
          name: brand.name,
          status: !brand.status,
        },
      });

      setBrands((prev) =>
        prev.map((b) =>
          b._id === brand._id ? { ...b, status: !b.status } : b,
        ),
      );
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handleDeleteBrand = async (brand) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${brand.name}"?`,
    );

    if (!confirmDelete) return;

    try {
      await apiClient(`/brands/${brand._id}`, {
        method: "DELETE",
      });

      setBrands((prev) => prev.filter((b) => b._id !== brand._id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete brand");
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEditBrand = (brand) => {
    setEditBrand(brand);
    setShowAddModal(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-white min-h-screen text-black">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b pb-6 border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Brands
          </h1>
          <p className="text-black/60 text-sm mt-1">
            Manage and monitor your brand partnerships.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[60%] border border-slate-300 px-4 py-3 rounded-xl text-black placeholder:text-black/40 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <BrandTable
          brands={filteredBrands}
          onStatusToggle={handleStatusToggle}
          onView={setViewBrand}
          loading={loading}
          onDelete={handleDeleteBrand}
          onEdit={handleEditBrand}
        />
      </div>

      {showAddModal && (
        <AddBrandModal
          initialData={editBrand}
          onClose={() => {
            setShowAddModal(false);
            setEditBrand(null);
          }}
          onSuccess={fetchBrand}
        />
      )}

      {viewBrand && (
        <BrandViewModal brand={viewBrand} onClose={() => setViewBrand(null)} />
      )}
    </div>
  );
}
