'use client';

import { useState, useEffect } from 'react';
import { attributeSetApi } from './api';

export default function AttributeSet() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    status: true,
  });
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Fetch attribute sets
  const fetchSets = async () => {
    setLoading(true);
    try {
      const params = {
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        searchQuery: search ? { name: { $regex: search, $options: 'i' } } : {},
      };

      const response = await attributeSetApi.getAll(params);
      setSets(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, [pagination.page, search]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSet) {
        await attributeSetApi.update(editingSet._id, formData);
        alert('Attribute set updated successfully!');
      } else {
        await attributeSetApi.create(formData);
        alert('Attribute set created successfully!');
      }
      setShowForm(false);
      setEditingSet(null);
      setFormData({ name: '', status: true });
      fetchSets();
    } catch (error) {
      alert(error.message);
    }
  };

  // Edit attribute set
  const handleEdit = (set) => {
    setEditingSet(set);
    setFormData({
      name: set.name,
      status: set.status,
    });
    setShowForm(true);
  };

  // Delete attribute set
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this attribute set?')) return;
    
    try {
      await attributeSetApi.delete(id);
      alert('Attribute set deleted successfully!');
      fetchSets();
    } catch (error) {
      alert(error.message);
    }
  };

  // Toggle status
  const toggleStatus = async (set) => {
    try {
      await attributeSetApi.update(set._id, { status: !set.status });
      alert('Status updated!');
      fetchSets();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attribute Sets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-gray-900"
        >
          {showForm ? 'Cancel' : 'Create New Set'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search attribute sets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50 text-gray-900">
          <h3 className="text-lg font-semibold mb-4">
            {editingSet ? 'Edit Attribute Set' : 'Create New Attribute Set'}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="e.g., Specification, Quality"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingSet(null);
                setFormData({ name: '', status: true });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingSet ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Attribute Sets Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created At</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : sets.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No attribute sets found
                </td>
              </tr>
            ) : (
              sets.map((set) => (
                <tr key={set._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{set.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        set.status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {set.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(set.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(set)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(set)}
                      className={`px-3 py-1 text-sm rounded ${
                        set.status
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {set.status ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(set._id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}