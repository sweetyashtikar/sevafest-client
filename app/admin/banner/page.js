// app/admin/banner/page.js
"use client";

import { useState, useEffect } from 'react';
import AddBannerModal from '@/components/banner/bannerAddModel';
import BannerTable from '@/components/banner/bannerTable'; // You need to create this or use the table I provided earlier
import { apiClient } from '@/services/apiClient';

export default function BannerPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories for dropdown
  useEffect(() => {
    fetchCategories();
    fetchBanners();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient('/category/status-true', { method: 'GET' });
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await apiClient('/banners', { method: 'GET' });
      setBanners(response.data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (newBanner) => {
    fetchBanners(); // Refresh the banner list
    setShowModal(false);
    setEditingBanner(null);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await apiClient(`/banners/${id}`, { method: 'DELETE' });
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await apiClient(`/banners/${id}/status`, {
        method: 'PATCH',
        body: { status: !currentStatus }
      });
      fetchBanners();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Banner Management</h1>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Banner
        </button>
      </div>

      {/* Banner Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-black/40">Loading banners...</p>
          </div>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/20 mb-3">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <p className="text-black/60 font-medium">No banners found</p>
            <p className="text-sm text-black/40 mt-1">Create your first banner to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add New Banner
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-y border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Image</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Category</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Created</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {banners.map((banner) => (
                <tr key={banner._id} className="hover:bg-slate-50 transition-colors">
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/20">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                            <line x1="23" y1="1" x2="1" y2="23"></line>
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
                      {banner.bannerType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-black">
                    {banner.title || 'Untitled'}
                  </td>
                  <td className="px-6 py-4 text-black/60">
                    {banner.bannerType === 'category' && banner.category ? (
                      typeof banner.category === 'object' ? banner.category.name : 'Category'
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(banner._id, banner.status)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        banner.status
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {banner.status ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-black/60">
                    {new Date(banner.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          onSuccess={handleSuccess}
          categories={categories}
        />
      )}
    </div>
  );
}