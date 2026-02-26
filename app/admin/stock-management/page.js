// pages/StockManagement.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { stockService } from '@/API/stockAPI';
import DataTable from '@/components/admin/DataTable';
import StockAdjustmentModal from '@/components/stock/stockAdjustModel';

const StockManagement = () => {
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    category: '',
    seller: '',
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: -1
  });

  // Filter options
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [summary, setSummary] = useState(null);
  
  // Selected rows for bulk actions
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch stock data
  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await stockService.getStockSalesView(filters);
      const responseData = response.data;
      console.log("response tock", responseData)
      
      setData(responseData.tableRows || []);
      setPagination({
        currentPage: responseData.pagination?.currentPage || 1,
        totalPages: responseData.pagination?.totalPages || 1,
        totalItems: responseData.pagination?.totalItems || 0,
        hasNextPage: responseData.pagination?.currentPage < responseData.pagination?.totalPages
      });
      
      // Set filter options
      setCategories(responseData.filters?.categories || []);
      setSellers(responseData.filters?.sellers || []);
      setSummary(responseData.summary || null);
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchStockData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', e.target.search.value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle export
  const handleExport = async (format = 'csv') => {
    try {
      const response = await stockService.exportStockSalesData({
        ...filters,
        format
      });
      
      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `stock-management-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  // Open stock adjustment modal
  const openStockModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Handle stock update
  const handleStockUpdate = async (updateData) => {
    try {
      if (updateData.variantId) {
        await stockService.updateVariantStock(
          updateData.productId,
          updateData.variantId,
          {
            adjustmentType: updateData.adjustmentType,
            quantity: updateData.quantity,
            reason: updateData.reason,
            notes: updateData.notes
          }
        );
      } else {
        await stockService.updateSimpleProductStock(
          updateData.productId,
          {
            adjustmentType: updateData.adjustmentType,
            quantity: updateData.quantity,
            reason: updateData.reason,
            notes: updateData.notes
          }
        );
      }
      
      // Refresh data
      fetchStockData();
      setModalOpen(false);
      alert('Stock updated successfully!');
    } catch (error) {
      console.error('Stock update failed:', error);
      alert('Failed to update stock');
    }
  };

  // Handle bulk delete (if needed)
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} items?`)) {
      // Implement bulk delete logic here if needed
      setSelectedRows([]);
    }
  };

  // Define table columns
  const columns = [
    {
      key: 'index',
      label: '#',
      render: (_, row, index) => (
        <span className="text-gray-500">
          {(filters.page - 1) * filters.limit + index + 1}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <div className="flex items-center">
          <img 
            src={row.image} 
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover mr-3"
            // onError={(e) => {
            //   e.target.src = '/placeholder-image.jpg';
            // }}
          />
          <div>
            <div className="font-medium text-gray-900">{row.shortName || row.name}</div>
            {row.variation && (
              <div className="text-xs text-gray-500">{row.variation}</div>
            )}
            <div className="text-xs text-gray-400">SKU: {row.sku || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'seller',
      label: 'Seller',
      render: (_, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.seller}</div>
          <div className="text-xs text-gray-500">ID: {row.sellerId?.slice(-6)}</div>
        </div>
      )
    },
     {
      key: 'productType',
      label: 'Product Type',
      render: (_, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.productType}</div>
        </div>
      )
    },
    {
      key: 'variation',
      label: 'Variation',
      render: (_, row) => (
        <span className="text-sm text-gray-600">
          {row.variation || 'Default'}
        </span>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (_, row) => {
        const stockClass = 
          row.stock === 0 ? 'bg-red-100 text-red-800' :
          row.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800';
        
        return (
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockClass}`}>
              {row.stockDisplay}
            </span>
            <button
              onClick={() => openStockModal(row)}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              Adjust
            </button>
          </div>
        );
      }
    },
    {
      key: 'sales',
      label: 'Sales',
      render: (_, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.sales || 0} units</div>
          {row.revenue > 0 && (
            <div className="text-xs text-gray-500">₹{row.revenue?.toLocaleString()}</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => {
        const statusClass = row.status === true 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
            {row.status || false}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => window.location.href = `/products/${row.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={() => openStockModal(row)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Stock
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">View Stock Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track inventory across all products
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Stock</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalStock}</p>
            <p className="text-xs text-gray-400 mt-1">Across all products</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">{summary.totalSales}</p>
            <p className="text-xs text-green-600 mt-1">+{summary.totalSales} units sold</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{summary.totalRevenue?.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">From all sales</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Low Stock Alert</p>
            <p className="text-2xl font-bold text-yellow-600">{summary.lowStock}</p>
            <p className="text-xs text-gray-400 mt-1">Products below threshold</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Filter By Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Seller Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Filter By Seller
            </label>
            <select
              value={filters.seller}
              onChange={(e) => handleFilterChange('seller', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sellers</option>
              `{console.log("seller", sellers)}`
              {sellers.map(seller => (
                <option key={seller._id} value={seller._id}>{seller.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Search
            </label>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                name="search"
                placeholder="Search by product name or SKU..."
                defaultValue={filters.search}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button
              onClick={fetchStockData}
              className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowSelect={setSelectedRows}
        selectedRows={selectedRows}
        onBulkDelete={handleBulkDelete}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onUpdate={handleStockUpdate}
      />
    </div>
  );
};

export default StockManagement;