'use client';

import { useState } from 'react';
import AttributeSet from '@/components/attributes/AttributeSet';
import Attribute from '@/components/attributes/Attribute';
import AttributeValue from '@/components/attributes/AttributeValue';

export default function AttributesPage() {
  const [activeTab, setActiveTab] = useState('attribute-sets');

  const tabs = [
    { id: 'attribute-sets', label: 'Attribute Sets' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'attribute-values', label: 'Attribute Values' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 -ml-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Attribute Management
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your attribute sets, attributes, and attribute values in one place.
        </p>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'attribute-sets' && <AttributeSet />}
          {activeTab === 'attributes' && <Attribute />}
          {activeTab === 'attribute-values' && <AttributeValue />}
        </div>
      </div>
    </div>
  );
}