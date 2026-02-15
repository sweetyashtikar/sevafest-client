'use client';

import { useState, useEffect } from 'react';
import { attributeValueApi, attributeApi } from '../../API/api';

export default function AttributeValue() {
  const [values, setValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingValue, setEditingValue] = useState(null);
  const [formData, setFormData] = useState({
    attribute_id: '',
    value: '',
    swatche_type: 'text',
    swatche_value: '',
    filterable: false,
    status: true,
  });
  const [search, setSearch] = useState('');
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const swatcheTypes = [
    { value: 'text', label: 'Text' },
    { value: 'color', label: 'Color' },
    { value: 'image', label: 'Image' },
  ];

  // Fetch attribute values and attributes
  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query
      let searchQuery = {};
      if (search) {
        searchQuery.value = { $regex: search, $options: 'i' };
      }
      if (selectedAttribute) {
        searchQuery.attribute_id = selectedAttribute;
      }

      const params = {
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
        searchQuery,
      };

      const [valuesRes, attributesRes] = await Promise.all([
        attributeValueApi.getAll(params),
        attributeApi.getAll({ limit: 100 })
      ]);

      setValues(valuesRes.data);
      setAttributes(attributesRes.data);
      setPagination(prev => ({ ...prev, total: valuesRes.total }));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, search, selectedAttribute]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset swatch value when type changes
      ...(name === 'swatche_type' && { swatche_value: '' }),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingValue) {
        await attributeValueApi.update(editingValue._id, formData);
        alert('Attribute value updated successfully!');
      } else {
        await attributeValueApi.create(formData);
        alert('Attribute value created successfully!');
      }
      setShowForm(false);
      setEditingValue(null);
      setFormData({
        attribute_id: '',
        value: '',
        swatche_type: 'text',
        swatche_value: '',
        filterable: false,
        status: true,
      });
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  // Edit attribute value
  const handleEdit = (value) => {
    setEditingValue(value);
    setFormData({
      attribute_id: value.attribute_id._id || value.attribute_id,
      value: value.value,
      swatche_type: value.swatche_type,
      swatche_value: value.swatche_value,
      filterable: value.filterable,
      status: value.status,
    });
    setShowForm(true);
  };

  // Delete attribute value
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this attribute value?')) return;
    
    try {
      await attributeValueApi.delete(id);
      alert('Attribute value deleted successfully!');
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  // Render swatch preview
  const renderSwatchPreview = (type, value) => {
    if (!value) return null;
    
    switch (type) {
      case 'color':
        return (
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: value }}
            title={value}
          />
        );
      case 'image':
        return (
          <img
            src={value}
            alt="Swatch"
            className="w-6 h-6 object-cover rounded"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attribute Values</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-gray-900"
        >
          {showForm ? 'Cancel' : 'Create New Value'}
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search values..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        
        <select
          value={selectedAttribute}
          onChange={(e) => setSelectedAttribute(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="">All Attributes</option>
          {attributes.map((attr) => (
            <option key={attr._id} value={attr._id}>
              {attr.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {editingValue ? 'Edit Attribute Value' : 'Create New Attribute Value'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attribute *
              </label>
              <select
                name="attribute_id"
                value={formData.attribute_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Select Attribute</option>
                {attributes.map((attr) => (
                  <option key={attr._id} value={attr._id}>
                    {attr.name} {!attr.status && '(Inactive)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value *
              </label>
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="e.g., Small, Red, 1kg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Swatch Type
              </label>
              <select
                name="swatche_type"
                value={formData.swatche_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {swatcheTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.swatche_type !== 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.swatche_type === 'color' ? 'Color Code (e.g., #000000)' : 'Image URL'}
                </label>
                <input
                  type={formData.swatche_type === 'color' ? 'color' : 'url'}
                  name="swatche_value"
                  value={formData.swatche_value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder={
                    formData.swatche_type === 'color' 
                      ? '#000000' 
                      : 'https://example.com/image.jpg'
                  }
                />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="filterable"
                  checked={formData.filterable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Filterable in Sidebar</span>
              </label>
              
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
                setEditingValue(null);
                setFormData({
                  attribute_id: '',
                  value: '',
                  swatche_type: 'text',
                  swatche_value: '',
                  filterable: false,
                  status: true,
                });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingValue ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Attribute Values Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Attribute</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Swatch</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Filterable</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : values.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No attribute values found
                </td>
              </tr>
            ) : (
              values.map((val) => (
                <tr key={val._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{val.value}</td>
                  <td className="px-4 py-3 text-gray-900">
                    {val.attribute_id?.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {renderSwatchPreview(val.swatche_type, val.swatche_value)}
                      <span className="text-sm text-gray-500">
                        {val.swatche_type}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        val.filterable
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {val.filterable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        val.status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {val.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(val)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(val._id)}
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