// components/coupon/CouponTable.jsx
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
  Tag,
  Calendar,
  Users,
  Percent,
  Copy,
  CheckCircle,
  XCircle
} from "lucide-react";
import { couponService } from "@/API/couponAPI";
import AddCouponModal from "./AddCouponModal";
import { 
  COUPON_TYPE_COLORS, 
  DISCOUNT_TYPE_COLORS,
  USER_TYPE_COLORS,
  COUPON_TYPE_OPTIONS,
  DISCOUNT_TYPE_OPTIONS,
  USER_TYPE_OPTIONS 
} from "@/components/coupon/couponConstants";

export default function CouponTable() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    couponType: '',
    discountType: '',
    userType: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Selected coupons for bulk actions
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Copy coupon code
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, [currentPage, itemsPerPage, filters]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(filters.status && { status: filters.status === 'active' }),
        ...(filters.couponType && { couponType: filters.couponType }),
        ...(filters.discountType && { discountType: filters.discountType }),
        ...(filters.userType && { userType: filters.userType }),
        ...(filters.search && { search: filters.search })
      };
      
      const response = await couponService.getCoupons(params);
      setCoupons(response.data || []);
      setTotalPages(response.pagination?.total_pages || 1);
      setTotalItems(response.pagination?.total_items || 0);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await couponService.getCouponStats();
      setStats(response.data || null);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await couponService.toggleStatus(id, !currentStatus);
      fetchCoupons();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await couponService.deleteCoupon(id);
        fetchCoupons();
        fetchStats();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleBulkDelete = async () => {
    if (selectedCoupons.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedCoupons.length} coupons?`)) {
      try {
        await couponService.bulkDeleteCoupons(selectedCoupons);
        setSelectedCoupons([]);
        setSelectAll(false);
        fetchCoupons();
        fetchStats();
      } catch (error) {
        console.error('Error bulk deleting coupons:', error);
      }
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedCoupons.length === 0) return;
    
    try {
      await couponService.bulkUpdateStatus(selectedCoupons, status);
      setSelectedCoupons([]);
      setSelectAll(false);
      fetchCoupons();
      fetchStats();
    } catch (error) {
      console.error('Error bulk updating status:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(coupons.map(c => c._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCoupon = (id) => {
    if (selectedCoupons.includes(id)) {
      setSelectedCoupons(selectedCoupons.filter(cId => cId !== id));
      setSelectAll(false);
    } else {
      setSelectedCoupons([...selectedCoupons, id]);
    }
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      couponType: '',
      discountType: '',
      userType: '',
      search: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header with Stats */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-black">Coupon Management</h2>
            <p className="text-sm text-black/40 mt-1">
              Create and manage discount coupons for your store
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all"
          >
            <Tag size={18} />
            Add New Coupon
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-blue-600 font-medium uppercase">Total Coupons</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.overall?.[0]?.totalCoupons || 0}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-xs text-green-600 font-medium uppercase">Active</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.overall?.[0]?.activeCoupons || 0}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-xs text-red-600 font-medium uppercase">Inactive</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{stats.overall?.[0]?.inactiveCoupons || 0}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <p className="text-xs text-orange-600 font-medium uppercase">Total Used</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">{stats.overall?.[0]?.totalUsedCount || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="text-xs text-purple-600 font-medium uppercase">Expiring Soon</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{stats.expiringSoon?.[0]?.count || 0}</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="text"
              placeholder="Search coupons by code, title or description..."
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
          {(filters.status || filters.couponType || filters.discountType || filters.userType) && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-3">
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
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1 block">
                Coupon Type
              </label>
              <select
                value={filters.couponType}
                onChange={(e) => setFilters({ ...filters, couponType: e.target.value, currentPage: 1 })}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-black outline-none focus:border-blue-500"
              >
                <option value="">All Types</option>
                {COUPON_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1 block">
                Discount Type
              </label>
              <select
                value={filters.discountType}
                onChange={(e) => setFilters({ ...filters, discountType: e.target.value, currentPage: 1 })}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-black outline-none focus:border-blue-500"
              >
                <option value="">All Discounts</option>
                {DISCOUNT_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black/40 mb-1 block">
                User Type
              </label>
              <select
                value={filters.userType}
                onChange={(e) => setFilters({ ...filters, userType: e.target.value, currentPage: 1 })}
                className="w-full border border-slate-200 px-3 py-2 rounded-lg text-black outline-none focus:border-blue-500"
              >
                <option value="">All Users</option>
                {USER_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedCoupons.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCoupons.length} coupon(s) selected
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
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Discount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                User Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Usage
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Expiry
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="10" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-black/40">Loading coupons...</p>
                  </div>
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Tag size={48} className="text-black/20 mb-3" />
                    <p className="text-black/60 font-medium">No coupons found</p>
                    <p className="text-sm text-black/40 mt-1">Create your first coupon to get started</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add New Coupon
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCoupons.includes(coupon._id)}
                      onChange={() => handleSelectCoupon(coupon._id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-black bg-slate-100 px-2 py-1 rounded-lg">
                        {coupon.couponCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.couponCode)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === coupon.couponCode ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="text-black/40" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-black">{coupon.title}</p>
                      <p className="text-xs text-black/40 truncate max-w-[200px]">
                        {coupon.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${DISCOUNT_TYPE_COLORS[coupon.discountType]}`}>
                      {coupon.discountType === 'percentage' ? (
                        <>{coupon.couponValue}%</>
                      ) : (
                        <>₹{coupon.couponValue}</>
                      )}
                      {coupon.maxDiscountAmount && coupon.discountType === 'percentage' && (
                        <span className="ml-1 text-xs opacity-75">
                          (upto ₹{coupon.maxDiscountAmount})
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${COUPON_TYPE_COLORS[coupon.couponType]}`}>
                      {coupon.couponType === 'single time valid' ? 'Single' : 'Multiple'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${USER_TYPE_COLORS[coupon.userType]}`}>
                      <Users size={12} className="mr-1" />
                      {coupon.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-black">
                        {coupon.totalUsedCount} / {coupon.totalUsageLimit || '∞'}
                      </p>
                      <p className="text-xs text-black/40">
                        {coupon.perUserUsageLimit} per user
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar size={14} className="text-black/40" />
                      <span className={coupon.isExpired ? 'text-red-600' : 'text-black/60'}>
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(coupon._id, coupon.status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        coupon.status
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {coupon.status ? (
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setShowModal(true);
                        }}
                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title="Edit coupon"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Delete coupon"
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
      {!loading && coupons.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-black/40">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} coupons
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

      {/* Coupon Modal */}
      {showModal && (
        <AddCouponModal
          onClose={() => {
            setShowModal(false);
            setEditingCoupon(null);
          }}
          initialData={editingCoupon}
          onSuccess={() => {
            fetchCoupons();
            fetchStats();
            setShowModal(false);
            setEditingCoupon(null);
          }}
        />
      )}
    </div>
  );
}