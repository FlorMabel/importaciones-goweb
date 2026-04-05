import { useState, useCallback, useRef, useEffect } from 'react';
import * as adminApi from '../services/adminApi.js';

/**
 * Hook genérico para operaciones CRUD contra Supabase
 * 
 * @param {string} table - Nombre de la tabla
 * @param {Object} options - Opciones por defecto
 * @returns {Object} - { items, total, totalPages, loading, error, ... }
 * 
 * @example
 * const { items, loading, create, update, remove, refresh } = useCrud('products');
 */
export function useCrud(table, defaultOptions = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastOpts = useRef(defaultOptions);

  const fetchAll = useCallback(async (opts = {}) => {
    const merged = { ...lastOpts.current, ...opts };
    lastOpts.current = merged;
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.getAll(table, merged);
      setItems(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table]);

  const fetchById = useCallback(async (id, select) => {
    setLoading(true);
    setError(null);
    try {
      return await adminApi.getById(table, id, select);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table]);

  const createItem = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.create(table, data);
      await fetchAll();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table, fetchAll]);

  const updateItem = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.update(table, id, data);
      await fetchAll();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table, fetchAll]);

  const removeItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await adminApi.remove(table, id);
      await fetchAll();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [table, fetchAll]);

  const refresh = useCallback(() => fetchAll(), [fetchAll]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchAll(defaultOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items,
    total,
    totalPages,
    loading,
    error,
    fetchAll,
    fetchById,
    create: createItem,
    update: updateItem,
    remove: removeItem,
    refresh,
    setError,
  };
}
