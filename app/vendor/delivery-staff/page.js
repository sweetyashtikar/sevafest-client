// app/vendor/delivery-staff/page.js
// app/vendor/delivery-staff/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { deliveryBoyService } from '@/API/deliveryAPI';
import AddDeliveryBoyModal from '@/components/vendor/deliveryStaff/AddDeliveryBoyModel';
import DeliveryBoyTable from '@/components/vendor/DeliveryBoyTable';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  RefreshCw,
  Truck,
  Star,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSelector } from "react-redux";

const DeliveryStaffPage = () => {
  // Get vendor ID from localStorage or auth context
  const [vendor, setVendor] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useSelector((a) => a.auth);
  console.log("user", user)

    // ✅ Sync vendor state with Redux user
  useEffect(() => {
    if (user?.id) {
      setVendor(user);
    }
  }, [user]);

 const fetchDeliveryBoys = async () => {
  console.log("user.id", user?.id)
    if (!vendor?.id) {
      console.log('No vendor ID available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const vendorId = vendor._id || vendor.id;
      
      // ✅ Build params object
      const params = {
        page: currentPage,
        limit: 10,
        // search: searchTerm || undefined,
        // status: statusFilter === 'all' ? undefined : statusFilter === 'active'
      };
      
      console.log('Fetching with params:', { vendorId, params });
      
      const response = await deliveryBoyService.getVendorDeliveryBoys(vendorId);
      console.log("Response fetch delivery boys:", response);
      
      // ✅ Safely set state with fallbacks
      setDeliveryBoys(response?.data || []);
      setStats(response?.stats || {});
      setPagination(response?.pagination || {
        current_page: currentPage,
        total_pages: 1,
        total_items: 0,
        items_per_page: 10
      });
      
    } catch (err) {
      console.error('Fetch error details:', err);
      setError(err?.message || 'Failed to fetch delivery boys');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when dependencies change
  useEffect(() => {
    fetchDeliveryBoys();
  }, [vendor, currentPage, searchTerm, statusFilter]); // ✅ Added all dependencies

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddDeliveryBoy = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const vendorId = user._id || user.id;
      const response = await deliveryBoyService.createDeliveryBoy({
        ...formData,
        vendor_id: vendorId,
        role: 'delivery_boy'
      });

      if(response.success === true){
 alert("Delivery boy created successfully!")
      setSuccess('Delivery boy created successfully!');
      setIsModalOpen(false);
      }
     
      
      // Refresh the list
      fetchDeliveryBoys();
    } catch (err) {
      setError(err.message || 'Failed to create delivery boy');
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await deliveryBoyService.updateStatus(id, !currentStatus);
      
<<<<<<< HEAD
      // Update local state
=======

>>>>>>> 83ee919e76c7a582c04ebc4e7accb2b6b62fe26d
      setDeliveryBoys(prev => 
        prev.map(boy => 
          boy._id === id 
            ? { ...boy, employment: { ...boy.employment, status: !currentStatus } }
            : boy
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        active_delivery_boys: currentStatus 
          ? (prev.active_delivery_boys - 1) 
          : (prev.active_delivery_boys + 1)
      }));
    } catch (err) {
      setError(err.message || 'Failed to update status');
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this delivery boy?')) return;
    
    try {
      await deliveryBoyService.deleteDeliveryBoy(id);
      
      // Remove from local state
      setDeliveryBoys(prev => prev.filter(boy => boy._id !== id));
      setPagination(prev => ({ ...prev, total_items: prev.total_items - 1 }));
      // setStats(prev => ({
      //   ...prev,
      //   total_delivery_boys: (prev.total_delivery_boys || 0) - 1,
      //   active_delivery_boys: prev.active_delivery_boys - 
      //     (deliveryBoys.find(b => b._id === id)?.employment?.status ? 1 : 0)
      // }));
      
      setSuccess('Delivery boy deactivated successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete delivery boy');
      console.error('Delete error:', err);
    }
  };

  const handleRefresh = () => {
    fetchDeliveryBoys();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const vendorId = vendor?._id || vendor?.id;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Delivery Staff Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your delivery team, add new delivery boys, and track their performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Delivery Boys</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_delivery_boys || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Now</p>
              <p className="text-2xl font-bold text-green-600">
                {stats?.active_delivery_boys || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Now</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.available_delivery_boys || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats?.avg_rating_vendor?.toFixed(1) || '0.0'}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            {error}
          </p>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add Delivery Boy
            </button>
            
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, mobile..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="px-4 pb-4 border-t pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
        {/* Filter Options */}
        {showFilters && (
          <div className="px-4 pb-4 border-t pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Boys Table */}
      <DeliveryBoyTable
        deliveryBoys={deliveryBoys}
        loading={loading}
        onStatusToggle={handleStatusToggle}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={setCurrentPage}
      />

      {/* Add Delivery Boy Modal */}
      <AddDeliveryBoyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDeliveryBoy}
        loading={loading}
      />
    </div>
  );
};

export default DeliveryStaffPage;