'use client';

import { useState, useRef } from 'react';
import { VIDEO_TYPES } from '@/components/products/productTypes';

export default function ProductMedia({ formData, updateFormData }) {
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);

  // Handle main image change
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    // Store the File object directly (for upload) AND create preview URL
    updateFormData('mainImage', file);

    // Create a preview URL for display only
    const previewUrl = URL.createObjectURL(file);
    updateFormData('mainImagePreview', previewUrl);
  };

  // Handle other images upload
  // Handle other images upload
  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate all files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Skipping.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB). Skipping.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Store File objects
    const currentFiles = Array.isArray(formData.otherImages)
      ? formData.otherImages.filter(item => item instanceof File)
      : [];
    const updatedFiles = [...currentFiles, ...validFiles];
    updateFormData('otherImages', updatedFiles);
    // Create preview URLs for display only
    const currentPreviews = Array.isArray(formData.otherImagesPreviews)
      ? formData.otherImagesPreviews
      : [];
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    updateFormData('otherImagesPreviews', [...currentPreviews, ...newPreviews]);
  };


  // Remove an image from other images
  const removeOtherImage = (index) => {
    const updatedImages = formData.otherImages.filter((_, i) => i !== index);
    const updatedPreviews = formData.otherImagesPreviews.filter((_, i) => i !== index);
    updateFormData('otherImages', updatedImages);
    updateFormData('otherImagesPreviews', updatedPreviews);
  };

  // Set an image as main image
  const setAsMainImage = (index) => {
    const selectedFile = formData.otherImages[index];
    const selectedPreview = formData.otherImagesPreviews[index];

    // Set as main image
    updateFormData('mainImage', selectedFile);
    updateFormData('mainImagePreview', selectedPreview);

    // Remove from other images
    removeOtherImage(index);
  };

  // Handle video change
  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    updateFormData('video', {
      ...formData.video,
      [name]: value
    });
  };

  // Handle video file upload
  const handleVideoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      alert('Video size should be less than 100MB');
      return;
    }

    // Simulate video upload
    setUploadingImages(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const objectUrl = URL.createObjectURL(file);
      updateFormData('video', {
        ...formData.video,
        videoType: 'self_hosted',
        file: objectUrl
      });

    } catch (error) {
      console.error('Video upload failed:', error);
      alert('Failed to upload video');
    } finally {
      setUploadingImages(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Render video preview based on type
  const renderVideoPreview = () => {
    if (!formData.video.videoType) return null;

    if (formData.video.videoType === 'youtube' || formData.video.videoType === 'vimeo') {
      if (!formData.video.url) return null;

      // Extract video ID from URL
      let videoId = '';
      if (formData.video.videoType === 'youtube') {
        const match = formData.video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        videoId = match ? match[1] : '';
      } else if (formData.video.videoType === 'vimeo') {
        const match = formData.video.url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
        videoId = match ? match[1] : '';
      }

      if (!videoId) return null;

      return (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h4>
          <div className="aspect-w-16 aspect-h-9">
            {formData.video.videoType === 'youtube' ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-48 rounded-lg"
                allowFullScreen
              />
            ) : (
              <iframe
                src={`https://player.vimeo.com/video/${videoId}`}
                className="w-full h-48 rounded-lg"
                allowFullScreen
              />
            )}
          </div>
        </div>
      );
    } else if (formData.video.videoType === 'self_hosted' && formData.video.file) {
      return (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h4>
          <video
            src={formData.video.file}
            controls
            className="w-full h-auto rounded-lg max-h-48"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Media</h2>

      <div className="space-y-8">
        {/* Main Image Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Main Product Image *</h3>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Preview */}
            <div className="md:w-1/3">
              <div className={`relative w-full h-64 border-2 border-dashed rounded-lg overflow-hidden ${formData.mainImage ? 'border-gray-700' : 'border-gray-400'
                }`}>
                {formData.mainImage ? (
                  <>
                    <img
                      src={formData.mainImagePreview}
                      alt="Main product"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => updateFormData('mainImage', '')}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No main image selected</p>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <input
                  type="file"
                  id="mainImage"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="mainImage"
                  className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {formData.mainImage ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
            </div>

            {/* Upload Progress & Instructions */}
            <div className="md:w-2/3">
              {uploadingImages && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Main Image Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• High-quality image, minimum 800x800 pixels</li>
                  <li>• Use square or nearly square aspect ratio (1:1)</li>
                  <li>• File format: JPG, PNG, or WebP</li>
                  <li>• Maximum file size: 5MB</li>
                  <li>• White background recommended</li>
                  <li>• Product should fill at least 85% of the image</li>
                </ul>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Tips for Best Results</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use natural lighting when possible</li>
                  <li>• Show product from multiple angles in gallery images</li>
                  <li>• Include product in context (in-use shots)</li>
                  <li>• Remove distracting backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Other Images Gallery */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Gallery Images</h3>
            <span className="text-sm text-gray-500">
              {formData.otherImages.length} image(s) uploaded
            </span>
          </div>

          <div className="mb-6">
            <input
              type="file"
              id="otherImages"
              accept="image/*"
              multiple
              onChange={handleOtherImagesChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add More Images
            </button>
            <p className="text-sm text-gray-500 mt-2">
              You can select multiple images at once (max 10 images total)
            </p>
          </div>

          {/* Gallery Grid */}
          {formData.otherImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {formData.otherImagesPreviews.map((previewUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-700">
                    <img
                      src={previewUrl}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setAsMainImage(index)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100"
                          title="Set as main image"
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeOtherImage(index)}
                          className="p-2 bg-white rounded-full hover:bg-gray-100"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No gallery images yet</p>
              <p className="text-xs text-gray-400 mt-1">Add images to show different angles of your product</p>
            </div>
          )}

          {/* Gallery Instructions */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Gallery Image Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium mb-1">Recommended Images:</p>
                <ul className="space-y-1">
                  <li>• Different angles and perspectives</li>
                  <li>• Close-ups of important details</li>
                  <li>• Product in use/context shots</li>
                  <li>• Size comparison images</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Avoid:</p>
                <ul className="space-y-1">
                  <li>• Blurry or low-quality images</li>
                  <li>• Images with text overlays</li>
                  <li>• Watermarked images</li>
                  <li>• Images with other brand logos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product Video Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Product Video</h3>

          <div className="space-y-4">
            {/* Video Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Source
              </label>
            <select
  name="videoType"
  value={formData.video.videoType || ''}
  onChange={handleVideoChange}
  className="w-full px-3 py-2 border border-gray-700 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
>
  {/* placeholder */}
  <option value="" className="text-gray-700">
    No Video
  </option>

  <option value={VIDEO_TYPES.YOUTUBE}>YouTube</option>
  <option value={VIDEO_TYPES.VIMEO}>Vimeo</option>
  <option value={VIDEO_TYPES.SELF_HOSTED}>Upload Video File</option>
</select>
            </div>

            {/* YouTube/Vimeo URL Input */}
            {(formData.video.videoType === VIDEO_TYPES.YOUTUBE || formData.video.videoType === VIDEO_TYPES.VIMEO) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.video.videoType === VIDEO_TYPES.YOUTUBE ? 'YouTube' : 'Vimeo'} Video URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.video.url || ''}
                  onChange={handleVideoChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${formData.video.videoType} video URL`}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Paste the full URL of your {formData.video.videoType} video
                </p>
              </div>
            )}

            {/* Self-Hosted Video Upload */}
            {formData.video.videoType === VIDEO_TYPES.SELF_HOSTED && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Video File
                </label>
                {formData.video.file ? (
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-700 rounded-md">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-md mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Video uploaded</p>
                        <p className="text-xs text-gray-500">Ready for preview</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => window.open(formData.video.file, '_blank')}
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
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Upload product video</p>
                    <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, etc. (max 100MB)</p>
                    <input
                      type="file"
                      id="videoUpload"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                      ref={videoFileInputRef}
                    />
                    <button
                      type="button"
                      onClick={() => videoFileInputRef.current?.click()}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Choose Video
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Video Preview */}
            {renderVideoPreview()}

            {/* Video Guidelines */}
            {formData.video.videoType && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Video Best Practices</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Keep videos under 2 minutes for best engagement</li>
                  <li>• Show product features and benefits clearly</li>
                  <li>• Include text overlays for key points</li>
                  <li>• Use good lighting and clear audio</li>
                  <li>• Start with your most compelling shot</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Media Optimization Tips */}
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Media Optimization Tips</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use image compression tools to reduce file sizes without losing quality</li>
                  <li>Consider creating a 360-degree view of your product</li>
                  <li>Add alt text to all images for SEO and accessibility</li>
                  <li>Use consistent lighting and background across all images</li>
                  <li>Test how images appear on both desktop and mobile devices</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}