import React, { useState } from 'react';
import Modal from './Model';
// import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const BulkUploadModal = ({ isOpen, onClose, onUpload, template, entityName }) => {
  const [bulkData, setBulkData] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState([]);

  const handleDataChange = (e) => {
    setBulkData(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      if (Array.isArray(parsed)) {
        setPreview(parsed.slice(0, 3)); // Show first 3 items as preview
        setError('');
      } else {
        setError('Data must be an array');
        setPreview([]);
      }
    } catch (err) {
      setError('Invalid JSON format');
      setPreview([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(bulkData);
      if (Array.isArray(parsed)) {
        onUpload(parsed);
        setBulkData('');
        setPreview([]);
      } else {
        setError('Data must be an array');
      }
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityName}_template.json`;
    a.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bulk Upload ${entityName}`} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-medium">
              Paste JSON Data
            </label>
            <button
              type="button"
              onClick={downloadTemplate}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              {/* <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> */}
              Download Template
            </button>
          </div>
          <textarea
            value={bulkData}
            onChange={handleDataChange}
            rows="10"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder='[{"name": "Example"}, ...]'
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {preview.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (first {preview.length} items):</h4>
            <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!!error}
          >
            Upload
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkUploadModal;