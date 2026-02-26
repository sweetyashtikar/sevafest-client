"use client";

import React, { useState } from 'react';
import { Upload, Download, Trash2, Info } from 'lucide-react';

const ProductBulkUpdate = () => {
  
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClear = () => {
    setFile(null);
    document.getElementById('file-upload').value = '';
  };

  return (
    <div className=" mx-auto my-8 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 font-sans">
      {/* Header */}
      <div className="bg-teal-600 p-4">
        <h1 className="text-white text-xl font-bold">Product Bulk Upload Form</h1>
      </div>

      <div className="p-6">
        {/* Warning Alert */}
        <div className="bg-pink-50 border-l-4 border-pink-500 p-4 mb-6">
          <p className="text-pink-700 text-sm font-medium">
            Always download and use new sample file
          </p>
        </div>

        {/* Instructions Section */}
        <section className="mb-8 space-y-4">
          <h2 className="font-bold text-gray-700 underline">Steps to bulk upload:</h2>
          <ol className="list-decimal ml-5 text-sm text-gray-600 space-y-1">
            <li>Firstly, read Notes carefully.</li>
            <li>Images will need to update later manually.</li>
            <li>Create / Edit .csv file for product as explain below:</li>
          </ol>

          <h2 className="font-bold text-gray-700 mt-4 underline">CSV Field Explanations:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-600">
            <p><span className="font-semibold text-gray-800">Product Name *</span> → Name of the product.</p>
            <p><span className="font-semibold text-gray-800">Brand ID *</span> → Find in Categories section.</p>
            <p><span className="font-semibold text-gray-800">Category ID *</span> → Find in Categories section.</p>
            <p><span className="font-semibold text-gray-800">Publish Status *</span> → 0 - Unpublish, 1 - Publish.</p>
            <p><span className="font-semibold text-gray-800">Popular Status *</span> → 0 - Unpopular, 1 - Popular.</p>
            <p><span className="font-semibold text-gray-800">Is Returnable *</span> → 0 - No, 1 - Yes.</p>
            <p><span className="font-semibold text-gray-800">Tax ID</span> → Find in Subcategories (0 if none).</p>
            <p><span className="font-semibold text-gray-800">FSSAI NO</span> → Must be 14 numeric digits.</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4">
            <p className="text-xs text-yellow-800">
              <span className="font-bold text-red-600">Note:</span> Do not set empty field. If you have no value, add "0" (zero) in that column.
            </p>
          </div>
        </section>

        <hr className="my-6 border-gray-200" />

        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">CSV File</h3>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">Select CSV File</label>
            <input 
              id="file-upload"
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border border-gray-300 rounded"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm font-semibold shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Download Sample File
            </button>
            
            <button className="flex items-center px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors text-sm font-semibold shadow-sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </button>

            <button 
              onClick={handleClear}
              className="flex items-center px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors text-sm font-semibold shadow-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBulkUpdate;