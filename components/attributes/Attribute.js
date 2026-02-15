'use client';

import { useState, useEffect } from 'react';
import { attributeApi, attributeSetApi } from '../../API/api';

export default function Attribute() {
  const [attributes, setAttributes] = useState([]);
  const [attributeSets, setAttributeSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    attribute_set_id: '',
    type: 'text',
    status: true,
  });
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Fetch attributes and attribute sets
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch attributes
      const params = {
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        searchQuery: search ? { name: { $regex: search, $options: 'i' } } : {},
      };

      const [attributesRes, setsRes] = await Promise.all([
        attributeApi.getAll(params),
        attributeSetApi.getAll({ limit: 100 })
      ]);

      setAttributes(attributesRes.data);
      console.log('Fetched Attributes:', attributesRes);
      setAttributeSets(setsRes.data);
      setPagination(prev => ({ ...prev, total: attributesRes.total }));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      if (editingAttribute) {
        await attributeApi.update(editingAttribute._id, formData);
        alert('Attribute updated successfully!');
      } else {
        await attributeApi.create(formData);
        alert('Attribute created successfully!');
      }
      setShowForm(false);
      setEditingAttribute(null);
      setFormData({ name: '', attribute_set_id: '', type: 'text', status: true });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  // Edit attribute
  const handleEdit = (attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      attribute_set_id: attribute.attribute_set_id._id || attribute.attribute_set_id,
      type: attribute.type,
      status: attribute.status,
    });
    setShowForm(true);
  };

  // Delete attribute
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this attribute?')) return;
    
    try {
      await attributeApi.delete(id);
      alert('Attribute deleted successfully!');
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const attributeTypes = [
    { value: 'text', label: 'Text' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'radio', label: 'Radio' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'color', label: 'Color Picker' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attributes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-gray-900"
        >
          {showForm ? 'Cancel' : 'Create New Attribute'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search attributes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            {editingAttribute ? 'Edit Attribute' : 'Create New Attribute'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attribute Set *
              </label>
              <select
                name="attribute_set_id"
                value={formData.attribute_set_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Select Attribute Set</option>
                {attributeSets.map((set) => (
                  <option key={set._id} value={set._id}>
                    {set.name} {!set.status && '(Inactive)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
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
                placeholder="e.g., Color, Size"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {attributeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
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
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingAttribute(null);
                setFormData({ name: '', attribute_set_id: '', type: 'text', status: true });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-gray-900"
            >
              {editingAttribute ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Attributes Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Attribute Set</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : attributes.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No attributes found
                </td>
              </tr>
            ) : (
              attributes.map((attr) => (
                <tr key={attr._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{attr.name}</td>
                  <td className="px-4 py-3 text-gray-900">
                    {attr.attribute_set_id?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm text-gray-900">
                      {attr.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        attr.status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {attr.status ? true : false}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(attr)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(attr._id)}
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