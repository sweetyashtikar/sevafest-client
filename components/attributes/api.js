const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Attribute Set APIs
export const attributeSetApi = {
  getAll: (params = {}) => apiCall('/attributeSet', {
    method: 'GET',
    // headers: {
    //   'pagination-query': JSON.stringify(params)
    // }
  }),
  
  getById: (id) => apiCall(`/attributeSet/${id}`),
  
  create: (data) => apiCall('/attributeSet', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/attributeSet/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/attributeSet/${id}`, {
    method: 'DELETE',
  }),
};

// Attribute APIs
export const attributeApi = {
  getAll: (params = {}) => apiCall('/attribute', {
    method: 'GET',
    // headers: {
    //   'pagination-query': JSON.stringify(params)
    // }
  }),
  
  getById: (id) => apiCall(`/attribute/${id}`),

  create: (data) => apiCall('/attribute', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiCall(`/attribute/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id) => apiCall(`/attribute/${id}`, {
    method: 'DELETE',
  }),
};

// Attribute Value APIs
export const attributeValueApi = {
  getAll: (params = {}) => apiCall('/attributeValue', {
    method: 'GET',
    // headers: {
    //   'pagination-query': JSON.stringify(params)
    // }
  }),
  
  getById: (id) => apiCall(`/attributeValue/${id}`),
  
  create: (data) => apiCall('/attributeValue', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/attributeValue/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/attributeValue/${id}`, {
    method: 'DELETE',
  }),
};