"use client";

import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import { Plus, Download, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import BrandTable from "@/components/admin/BrandTable";
import BrandViewModal from "@/components/admin/BrandViewModal";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [viewBrand, setViewBrand] = useState(null);

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
      toast.success(
        `Brand ${!brand.status ? "Activated" : "Deactivated"} successfully `,
      );
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status ");
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
      toast.success("Brand deleted successfully");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete brand");
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEditBrand = (brand) => {
    router.push(`/admin/brands/create?id=${brand._id}`);
  };

  const handleExportXLS = () => {
    if (!brands || brands.length === 0) {
      toast.error("No brands available to export!");
      return;
    }

    const excelData = brands.map((brand, index) => ({
      "Sr. No.": index + 1,
      "Brand Name": brand.name || "N/A",
      Status: brand.status ? "Active" : "Inactive",
      "Logo URL": brand.icon || "No Logo",

      "Created Date": brand.createdAt
        ? new Date(brand.createdAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",

      "Updated Date": brand.updatedAt
        ? new Date(brand.updatedAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Brands");

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 30 },
      { wch: 15 },
      { wch: 60 },
      { wch: 20 },
      { wch: 20 },
    ];

    XLSX.writeFile(
      workbook,
      `Brands_Export_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );

    toast.success("Excel file exported successfully!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8  min-h-screen text-black -ml-16">
      <div className="flex items-center justify-between pb-6 border-slate-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Brands
          </h1>
          <p className="text-black/60 text-sm mt-1">
            Manage and monitor your brand partnerships.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button
            onClick={handleExportXLS}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium 
            transition-all shadow-sm active:scale-95"
          >
            <Download size={18} />
            <span>Export XLS</span>
          </button>

          {/* Import Button */}
          <button
            onClick={() => router.push("/admin/brands/bulkimport")}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium
             transition-all shadow-sm active:scale-95"
          >
            <Upload size={18} />
            <span>Import</span>
          </button>

          {/* Add Button */}
          <button
            onClick={() => router.push("/admin/brands/create")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium 
            transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <input
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[60%] border-none px-4 py-3 rounded-xl text-black placeholder:text-black/40 outline-none transition-all
          focus:ring-2 focus:ring-blue-500 shadow-sm"
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

      {viewBrand && (
        <BrandViewModal brand={viewBrand} onClose={() => setViewBrand(null)} />
      )}
    </div>
  );
}
