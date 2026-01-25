'use client';

import { DOWNLOAD_LINK_TYPES } from '@/components/products/productTypes';
import { useState } from 'react';

export default function ProductDigital({ formData, updateFormData }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData(name, type === 'checkbox' ? checked : value);
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    updateFormData('video', {
      ...formData.video,
      [name]: value
    });
  };

  const handleDownloadLinkTypeChange = (value) => {
    updateFormData('downloadLinkType', value);
    // Reset download fields when type changes
    if (value === DOWNLOAD_LINK_TYPES.SELF_HOSTED) {
      updateFormData('downloadLink', '');
    } else if (value === DOWNLOAD_LINK_TYPES.ADD_LINK) {
      updateFormData('downloadFile', '');
    }
  };

  // Simulate file upload (in real app, integrate with file storage service)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // In real app: Upload to S3/Cloudinary/your storage
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/upload', { method: 'POST', body: formData });
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Update form with file URL
      updateFormData('downloadFile', `https://your-storage.com/files/${file.name}`);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setUploadProgress(0);
      alert('File upload failed. Please try again.');
    }
  };

  // Simulate video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Similar upload logic as above
    updateFormData('video', {
      ...formData.video,
      file: `https://your-storage.com/videos/${file.name}`,
      videoType: 'self_hosted'
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Digital Product Settings</h2>
      
      <div className="space-y-6">

        {formData.downloadAllowed && (
          <>
            {/* Download Link Type */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Download Configuration</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Download Method *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleDownloadLinkTypeChange(DOWNLOAD_LINK_TYPES.SELF_HOSTED)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      formData.downloadLinkType === DOWNLOAD_LINK_TYPES.SELF_HOSTED
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border mr-3 ${
                        formData.downloadLinkType === DOWNLOAD_LINK_TYPES.SELF_HOSTED
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">Self-Hosted File</p>
                        <p className="text-sm text-gray-500 mt-1">Upload file to your server</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadLinkTypeChange(DOWNLOAD_LINK_TYPES.ADD_LINK)}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      formData.downloadLinkType === DOWNLOAD_LINK_TYPES.ADD_LINK
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border mr-3 ${
                        formData.downloadLinkType === DOWNLOAD_LINK_TYPES.ADD_LINK
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">External Link</p>
                        <p className="text-sm text-gray-500 mt-1">Link to file hosted elsewhere</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Self-Hosted File Upload */}
              {formData.downloadLinkType === DOWNLOAD_LINK_TYPES.SELF_HOSTED && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload Digital File *
                  </label>
                  
                  {uploading ? (
                    <div className="space-y-3">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                    </div>
                  ) : formData.downloadFile ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-md mr-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">File uploaded</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{formData.downloadFile.split('/').pop()}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateFormData('downloadFile', '')}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Upload your digital file</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, ZIP, MP3, MP4, etc.</p>
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.zip,.mp3,.mp4,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Maximum file size: 100MB. Supported formats: PDF, ZIP, audio, video, documents.
                  </p>
                </div>
              )}

              {/* External Link Input */}
              {formData.downloadLinkType === DOWNLOAD_LINK_TYPES.ADD_LINK && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Download Link *
                  </label>
                  <input
                    type="url"
                    name="downloadLink"
                    value={formData.downloadLink}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/download/file.zip"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the direct download link for your digital product.
                  </p>
                </div>
              )}

              {/* Download Limits & Restrictions */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 mb-3">Download Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Download Expiry (Days)
                    </label>
                    <input
                      type="number"
                      name="downloadExpiry"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0 for unlimited"
                    />
                    <p className="text-xs text-gray-500 mt-1">Number of days download link is valid</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Download Limit
                    </label>
                    <input
                      type="number"
                      name="downloadLimit"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0 for unlimited"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum number of downloads per customer</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Product Video */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Product Video</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Type
            </label>
            <select
              name="videoType"
              value={formData.video.videoType}
              onChange={handleVideoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Video</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="self_hosted">Self-Hosted</option>
            </select>
          </div>

          {formData.video.videoType === 'youtube' || formData.video.videoType === 'vimeo' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                name="url"
                value={formData.video.url}
                onChange={handleVideoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${formData.video.videoType} video URL`}
              />
              <p className="text-sm text-gray-500 mt-2">
                Example: https://www.youtube.com/watch?v=VIDEO_ID
              </p>
            </div>
          ) : formData.video.videoType === 'self_hosted' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Video File
              </label>
              {formData.video.file ? (
                <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-md mr-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Video uploaded</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{formData.video.file.split('/').pop()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Preview video logic
                        window.open(formData.video.file, '_blank');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFormData('video', { ...formData.video, file: '' })}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Upload product video</p>
                  <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, etc.</p>
                  <input
                    type="file"
                    id="video-upload"
                    onChange={handleVideoUpload}
                    className="hidden"
                    accept="video/*"
                  />
                  <label
                    htmlFor="video-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Choose Video
                  </label>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Recommended: MP4 format, maximum file size: 500MB
              </p>
            </div>
          ) : null}
        </div>

        {/* Digital Product Notes */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notes for Digital Products</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ensure you have the rights to distribute the digital content</li>
                  <li>Large files may take time to upload and download</li>
                  <li>Consider using a CDN for faster delivery</li>
                  <li>Set appropriate download limits to prevent abuse</li>
                  <li>Test download functionality before publishing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Rights Management (Optional) */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Digital Rights Management (Optional)</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableDrm"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableDrm" className="ml-2 block text-sm text-gray-700">
                Enable DRM Protection
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="watermarkFiles"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="watermarkFiles" className="ml-2 block text-sm text-gray-700">
                Add Watermark to Files
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Agreement
              </label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter license terms for your digital product..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Customers must agree to these terms before downloading
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}