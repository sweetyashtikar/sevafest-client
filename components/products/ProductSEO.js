'use client';

import { useState } from 'react';

export default function ProductSEO({ formData, updateFormData }) {
  const [keywordInput, setKeywordInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('seo.')) {
      const field = name.replace('seo.', '');
      updateFormData('seo', {
        ...formData.seo,
        [field]: value
      });
    } else {
      updateFormData(name, value);
    }
  };

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !formData.seo.metaKeywords.includes(keywordInput.trim())) {
      updateFormData('seo', {
        ...formData.seo,
        metaKeywords: [...formData.seo.metaKeywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleKeywordRemove = (keywordToRemove) => {
    updateFormData('seo', {
      ...formData.seo,
      metaKeywords: formData.seo.metaKeywords.filter(keyword => keyword !== keywordToRemove)
    });
  };

  // Auto-generate meta title from product name
  const generateMetaTitle = () => {
    if (!formData.name) return '';
    const title = `${formData.name} | ${formData.brand || 'Product'}`;
    return title.substring(0, 60); // Limit to 60 chars
  };

  // Auto-generate meta description
  const generateMetaDescription = () => {
    if (!formData.shortDescription) return '';
    const desc = formData.shortDescription.substring(0, 160);
    return desc;
  };

  // Character counter
  const charCounter = (text, max) => (
    <span className={`text-xs ${text.length > max ? 'text-red-600' : 'text-gray-500'}`}>
      {text.length}/{max} characters
    </span>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">SEO Settings</h2>
      
      <div className="space-y-8">
        {/* Meta Title */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Meta Title</h3>
            <button
              type="button"
              onClick={() => updateFormData('seo', {
                ...formData.seo,
                metaTitle: generateMetaTitle()
              })}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Auto-generate
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title for Search Engines *
            </label>
            <input
              type="text"
              name="seo.metaTitle"
              value={formData.seo.metaTitle}
              onChange={handleChange}
              maxLength="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meta title (appears in search results)"
            />
            <div className="flex justify-between mt-2">
              {charCounter(formData.seo.metaTitle, 60)}
              <span className="text-xs text-gray-500">Recommended: 50-60 characters</span>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Search Result Preview</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-blue-700 text-lg truncate">
                {formData.seo.metaTitle || generateMetaTitle() || 'Your page title will appear here'}
              </div>
              <div className="text-green-700 text-sm truncate mt-1">
                https://yourwebsite.com/products/{formData.slug || 'product-slug'}
              </div>
              <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                {formData.seo.metaDescription || generateMetaDescription() || 'Your meta description will appear here'}
              </div>
            </div>
          </div>
        </div>

        {/* Meta Description */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Meta Description</h3>
            <button
              type="button"
              onClick={() => updateFormData('seo', {
                ...formData.seo,
                metaDescription: generateMetaDescription()
              })}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Auto-generate
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description for Search Engines
            </label>
            <textarea
              name="seo.metaDescription"
              value={formData.seo.metaDescription}
              onChange={handleChange}
              rows="3"
              maxLength="160"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meta description (appears under title in search results)"
            />
            <div className="flex justify-between mt-2">
              {charCounter(formData.seo.metaDescription, 160)}
              <span className="text-xs text-gray-500">Recommended: 150-160 characters</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Tips for effective meta descriptions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Include primary keywords naturally</li>
              <li>Describe what makes your product unique</li>
              <li>Include a call-to-action (e.g., &quot;Buy now&quot;, &quot;Learn more&quot;)</li>
              <li>Keep it concise and compelling</li>
            </ul>
          </div>
        </div>

        {/* Meta Keywords */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Meta Keywords</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords for Search Engines
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleKeywordAdd())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a keyword and press Enter"
              />
              <button
                type="button"
                onClick={handleKeywordAdd}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Add relevant keywords that describe your product
            </p>
            
            {/* Keywords Display */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.seo.metaKeywords.map(keyword => (
                <span key={keyword} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleKeywordRemove(keyword)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.seo.metaKeywords.length === 0 && (
                <p className="text-gray-500 text-sm">No keywords added yet</p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Keyword Best Practices:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use 5-10 relevant keywords maximum</li>
              <li>Include variations of your main keywords</li>
              <li>Avoid keyword stuffing</li>
              <li>Focus on terms your customers would search for</li>
              <li>Include long-tail keywords (e.g., &quot;organic cotton t-shirt for men&quot;)</li>
            </ul>
          </div>
        </div>

        {/* URL Slug */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">URL Slug</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                https://yourwebsite.com/products/
              </span>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="product-name"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This will be auto-generated from the product name if left empty
            </p>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">URL Best Practices:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use lowercase letters</li>
              <li>Separate words with hyphens (not underscores)</li>
              <li>Keep it short and descriptive</li>
              <li>Include primary keywords</li>
              <li>Avoid special characters and spaces</li>
            </ul>
          </div>
        </div>

        {/* SEO Analysis */}
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-4">SEO Analysis</h3>
          
          <div className="space-y-4">
            {/* Title Check */}
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                formData.seo.metaTitle.length >= 50 && formData.seo.metaTitle.length <= 60
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {formData.seo.metaTitle.length >= 50 && formData.seo.metaTitle.length <= 60 ? '✓' : '!'}
              </div>
              <div>
                <p className="font-medium text-blue-800">Meta Title Length</p>
                <p className="text-sm text-blue-700">
                  {formData.seo.metaTitle.length < 50 
                    ? 'Too short (aim for 50-60 characters)' 
                    : formData.seo.metaTitle.length > 60 
                    ? 'Too long (max 60 characters recommended)' 
                    : 'Perfect length!'}
                </p>
              </div>
            </div>

            {/* Description Check */}
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                formData.seo.metaDescription.length >= 150 && formData.seo.metaDescription.length <= 160
                  ? 'bg-green-100 text-green-600'
                  : formData.seo.metaDescription.length === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {formData.seo.metaDescription.length >= 150 && formData.seo.metaDescription.length <= 160 ? '✓' : 
                 formData.seo.metaDescription.length === 0 ? '-' : '!'}
              </div>
              <div>
                <p className="font-medium text-blue-800">Meta Description Length</p>
                <p className="text-sm text-blue-700">
                  {formData.seo.metaDescription.length === 0
                    ? 'No description provided'
                    : formData.seo.metaDescription.length < 150
                    ? 'Consider making it longer (150-160 characters recommended)'
                    : formData.seo.metaDescription.length > 160
                    ? 'Too long (max 160 characters)'
                    : 'Perfect length!'}
                </p>
              </div>
            </div>

            {/* Keywords Check */}
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                formData.seo.metaKeywords.length > 0 && formData.seo.metaKeywords.length <= 10
                  ? 'bg-green-100 text-green-600'
                  : formData.seo.metaKeywords.length === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {formData.seo.metaKeywords.length > 0 && formData.seo.metaKeywords.length <= 10 ? '✓' : 
                 formData.seo.metaKeywords.length === 0 ? '-' : '!'}
              </div>
              <div>
                <p className="font-medium text-blue-800">Keywords</p>
                <p className="text-sm text-blue-700">
                  {formData.seo.metaKeywords.length === 0
                    ? 'No keywords added'
                    : formData.seo.metaKeywords.length > 10
                    ? 'Too many keywords (5-10 recommended)'
                    : 'Good keyword count!'}
                </p>
              </div>
            </div>

            {/* URL Check */}
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                formData.slug && formData.slug.length <= 100
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {formData.slug && formData.slug.length <= 100 ? '✓' : '!'}
              </div>
              <div>
                <p className="font-medium text-blue-800">URL Slug</p>
                <p className="text-sm text-blue-700">
                  {!formData.slug
                    ? 'Will be auto-generated'
                    : formData.slug.length > 100
                    ? 'URL is too long'
                    : 'Good URL structure!'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-300">
            <h4 className="font-medium text-blue-800 mb-2">SEO Score</h4>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }} />
              </div>
              <span className="text-lg font-bold text-blue-800">75%</span>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Good! Your SEO is mostly optimized. Focus on improving your meta description.
            </p>
          </div>
        </div>

        {/* Additional SEO Fields */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Advanced SEO</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                name="canonicalUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/canonical-url"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use if this page has duplicate content elsewhere
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Robots Meta Tag
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="index, follow">index, follow (Default)</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Control how search engines index this page
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Structured Data (JSON-LD)
              </label>
              <textarea
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder='{"@context":"https://schema.org/","@type":"Product","name":"Product Name"}'
              />
              <p className="text-xs text-gray-500 mt-1">
                Add JSON-LD structured data for rich search results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}