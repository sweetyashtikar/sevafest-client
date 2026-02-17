'use client';

import { useState, useEffect } from 'react';
import { attributeValueApi, attributeApi } from './api';

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

  const fetchData = async () => {
    setLoading(true);
    try {
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'swatche_type' && { swatche_value: '' }),
    }));
  };

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

  const toggleStatus = async (val) => {
    try {
      await attributeValueApi.update(val._id, { status: !val.status });
      alert('Status updated!');
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attribute Values</h1>
              <p className="text-gray-600 mt-2">
                Manage your product attribute values
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Attribute Value
              </button>
              <button
                onClick={fetchData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">All Attributes</option>
            {attributes.map((attr) => (
              <option key={attr._id} value={attr._id}>
                {attr.name}
              </option>
            ))}
          </select>
        </div>

        {/* Attribute Values Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Value
                      </th>

                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Attribute
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Swatch
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Filterable
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {values.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No attribute values found
                        </td>
                      </tr>
                    ) : (
                      values.map((val) => (
                        <tr key={val._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{val.value}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {val.attribute_id?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {renderSwatchPreview(val.swatche_type, val.swatche_value)}
                              <span className="text-xs text-gray-500 capitalize">
                                {val.swatche_type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${val.filterable
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {val.filterable ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleStatus(val)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${val.status ? 'bg-green-600' : 'bg-gray-200'
                                }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${val.status ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => handleEdit(val)}
                              className="inline-flex items-center p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(val._id)}
                              className="inline-flex items-center p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-sm font-bold text-gray-700 text-gray-700">
                      Showing <span className="font-medium">{values.length}</span> of{' '}
                      <span className="font-medium">{pagination.total}</span> attribute values
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className={`px-3 py-1 rounded-md ${pagination.page > 1
                          ? 'bg-gray-200 hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                      className={`px-3 py-1 rounded-md ${pagination.total > pagination.page * pagination.limit
                          ? 'bg-gray-200 hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Next
                    </button>
                    <select
                      value={pagination.limit}
                      onChange={(e) =>
                        setPagination(prev => ({
                          ...prev,
                          limit: parseInt(e.target.value),
                          page: 1,
                        }))
                      }
                      className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-gray-900"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="25">25 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {(showForm || editingValue) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingValue ? 'Edit Attribute Value' : 'Create New Attribute Value'}
                </h3>
                <button
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
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attribute <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="attribute_id"
                      value={formData.attribute_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                      Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                        {formData.swatche_type === 'color' ? 'Color Code' : 'Image URL'}
                      </label>
                      <input
                        type={formData.swatche_type === 'color' ? 'color' : 'url'}
                        name="swatche_value"
                        value={formData.swatche_value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder={
                          formData.swatche_type === 'color'
                            ? '#000000'
                            : 'https://example.com/image.jpg'
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-6 pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="filterable"
                        checked={formData.filterable}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Filterable</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingValue ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}