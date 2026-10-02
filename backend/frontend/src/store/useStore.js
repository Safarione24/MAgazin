import { useEffect, useState } from 'react';

const API = 'http://127.0.0.1:8000/api';

async function request(url, options = {}) {
  const r = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`HTTP ${r.status}: ${text.slice(0, 200)}`);
  }
  if (r.status === 204) return null;
  return r.json();
}

// CATEGORIES
export const getCategories = () => request('/categories/');
export const getCategory = (id) => request(`/categories/${id}/`);
export const createCategory = (data) =>
  request('/categories/', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id, data) =>
  request(`/categories/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteCategory = (id) =>
  request(`/categories/${id}/`, { method: 'DELETE' });

// PRODUCTS
export const getProducts = () => request('/products/');
export const getProduct = (id) => request(`/products/${id}/`);
export const createProduct = (data) =>
  request('/products/', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id, data) =>
  request(`/products/${id}/`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteProduct = (id) =>
  request(`/products/${id}/`, { method: 'DELETE' });

// HOOK
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    fetcher()
      .then((res) => { setData(res); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, deps);  // eslint-disable-line

  return { data, loading, error, refetch: load };
}