"use client";

import { useState, useEffect } from "react";
import { 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Image as ImageIcon,
  Calendar,
  Tag,
  Layout
} from "lucide-react";
import Image from "next/image";
import { bannerService } from "@/API/bannerAPI";
import AddBannerModal from "@/components/banner/bannerAddModel";

const BANNER_TYPE_COLORS = {
  'deal of the day': 'bg-orange-100 text-orange-700 border-orange-200',
  'home': 'bg-blue-100 text-blue-700 border-blue-200',
  'header': 'bg-purple-100 text-purple-700 border-purple-200',
  'footer': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'coupons': 'bg-green-100 text-green-700 border-green-200',
  'about us': 'bg-pink-100 text-pink-700 border-pink-200',
  'category': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'products': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'contact us': 'bg-rose-100 text-rose-700 border-rose-200'
};

const BANNER_TYPE_ICONS = {
  'deal of the day': '🎯',
  'home': '🏠',
  'header': '📌',
  'footer': '📍',
  'coupons': '🏷️',
  'about us': '📋',
  'category': '📂',
  'products': '📦',
  'contact us': '📞'
};

export default function BannerTable() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanners, setTotalBanners] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState({
    bannerType: '',
    status: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Selected banners for bulk actions
  const [selectedBanners, setSelectedBanners] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchCategories();
  }, [currentPage, itemsPerPage, filters]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(filters.bannerType && { bannerType: filters.bannerType }),
        ...(filters.status !== '' && { status: filters.status === 'active' }),
        ...(filters.search && { search: filters.search })
      };
      
      const response = await bannerService.getBanners(params);
      setBanners(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalBanners(response.total || 0);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await bannerService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleStatusToggle = async (bannerId, currentStatus) => {
    try {
      await bannerService.updateStatus(bannerId, !currentStatus);
      fetchBanners();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerService.deleteBanner(bannerId);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBanners.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedBanners.length} banners?`)) {
      try {
        await bannerService.bulkDeleteBanners(selectedBanners);
        setSelectedBanners([]);
        setSelectAll(false);
        fetchBanners();
      } catch (error) {
        console.error('Error bulk deleting banners:', error);
      }
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedBanners.length === 0) return;
    
    try {
      await bannerService.bulkUpdateStatus(selectedBanners, status);
      setSelectedBanners([]);
      setSelectAll(false);
      fetchBanners();
    } catch (error) {
      console.error('Error bulk updating status:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(banners.map(b => b._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectBanner = (bannerId) => {
    if (selectedBanners.includes(bannerId)) {
      setSelectedBanners(selectedBanners.filter(id => id !== bannerId));
      setSelectAll(false);
    } else {
      setSelectedBanners([...selectedBanners, bannerId]);
    }
  };

  const getCategoryName = (category) => {
    if (!category) return '-';
    return typeof category === 'object' ? category.name : 
           categories.find(c => c._id === category)?.name || '-';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-black">Banner Management</h2>
            <p className="text-sm text-black/40 mt-1">
              Manage your website banners and promotions
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBanner(null);
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <Layout size={18} />
            Add New Banner
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="text"
              placeholder="Search banners by title..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, currentPage: 1 })}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-black placeholder:text-black/20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'border-slate-200 text-black/40 hover:bg-slate-50'
            }`}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1 block">
                Banner Type
              </label>
              <select
                value={filters.bannerType}
                onChange={(e) => setFilters({ ...filters, bannerType: e.target.value, currentPage: 1 })}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-black outline-none focus:border-blue-500"
              >
                <option value="">All Types</option>
                {Object.keys(BANNER_TYPE_COLORS).map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1 block">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, currentPage: 1 })}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-black outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedBanners.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedBanners.length} banner(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Activate All
              </button>
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Deactivate All
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-y border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Banner
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-black/40">Loading banners...</p>
                  </div>
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Layout size={48} className="text-black/20 mb-3" />
                    <p className="text-black/60 font-medium">No banners found</p>
                    <p className="text-sm text-black/40 mt-1">Create your first banner to get started</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add New Banner
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBanners.includes(banner._id)}
                      onChange={() => handleSelectBanner(banner._id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title || 'Banner'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={20} className="text-black/20" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${BANNER_TYPE_COLORS[banner.bannerType] || 'bg-slate-100 text-slate-700'}`}>
                      <span className="mr-1">{BANNER_TYPE_ICONS[banner.bannerType] || '📄'}</span>
                      {banner.bannerType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-black">
                        {banner.title || 'Untitled'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {banner.bannerType === 'category' ? (
                      <span className="inline-flex items-center gap-1 text-sm text-black/60">
                        <Tag size={14} className="text-black/40" />
                        {getCategoryName(banner.category)}
                      </span>
                    ) : (
                      <span className="text-sm text-black/40">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(banner._id, banner.status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        banner.status
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {banner.status ? (
                        <>
                          <Eye size={14} />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-black/60">
                      <Calendar size={14} className="text-black/40" />
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBanner(banner);
                          setShowModal(true);
                        }}
                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title="Edit banner"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Delete banner"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-black/40 transition-colors"
                        title="More options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && banners.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-black/40">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalBanners)} of {totalBanners} banners
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-black outline-none focus:border-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-black px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {showModal && (
        <AddBannerModal
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
          }}
          initialData={editingBanner}
          onSuccess={() => {
            fetchBanners();
            setShowModal(false);
            setEditingBanner(null);
          }}
          categories={categories}
        />
      )}
    </div>
  );
}