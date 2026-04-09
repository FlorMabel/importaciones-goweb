import { supabase } from '../../services/supabase.js';

// ─────────────────────────────────────────────
// CRUD GENÉRICO
// ─────────────────────────────────────────────

/**
 * Obtener todos los registros de una tabla con filtros, paginación y sorting
 */
export async function getAll(table, {
  page = 1,
  perPage = 20,
  sortBy = 'created_at',
  sortDir = 'desc',
  filters = {},        // { column: value }
  search = '',
  searchColumns = [],  // ['name', 'description']
  select = '*',
} = {}) {
  let query = supabase.from(table).select(select, { count: 'exact' });

  // Apply filters
  for (const [col, val] of Object.entries(filters)) {
    if (val !== '' && val !== null && val !== undefined) {
      query = query.eq(col, val);
    }
  }

  // Apply search
  if (search && searchColumns.length > 0) {
    const orClause = searchColumns.map(c => `${c}.ilike.%${search}%`).join(',');
    query = query.or(orClause);
  }

  // Sorting
  query = query.order(sortBy, { ascending: sortDir === 'asc' });

  // Pagination
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

/**
 * Obtener un registro por ID
 */
export async function getById(table, id, select = '*') {
  const { data, error } = await supabase
    .from(table)
    .select(select)
    .eq('id', id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * Crear un registro
 */
export async function create(table, data) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

/**
 * Actualizar un registro
 */
export async function update(table, id, data) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return result;
}

/**
 * Eliminar un registro
 */
export async function remove(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}

/**
 * Upsert (create or update)
 */
export async function upsert(table, data) {
  const { data: result, error } = await supabase
    .from(table)
    .upsert(data)
    .select()
    .single();
  if (error) throw error;
  return result;
}

// ─────────────────────────────────────────────
// PRODUCTOS (con relaciones)
// ─────────────────────────────────────────────

const PRODUCT_SELECT = '*, product_images(*), product_specs(*), product_colors(*), product_fragrances(*), product_tags:product_tags(tag), product_wholesale_tiers(*), product_variants(*)';

export async function getProducts(opts = {}) {
  return getAll('products', {
    ...opts,
    select: PRODUCT_SELECT,
    searchColumns: opts.searchColumns || ['name', 'slug', 'description'],
  });
}

export async function getProduct(id) {
  return getById('products', id, PRODUCT_SELECT);
}

export async function saveProduct(productData, relatedData = {}) {
  const { images, specs, colors, fragrances, tags, wholesale_tiers, variants, ...product } = productData;
  
  // 1. Upsert product (base table)
  // wholesale_enabled is included in ...product
  const saved = await upsert('products', product);
  const pid = saved.id;

  // 2. Sync images
  if (images !== undefined) {
    const { error: delErr } = await supabase.from('product_images').delete().eq('product_id', pid);
    if (delErr) throw new Error(`Error al borrar imágenes: ${delErr.message}`);
    
    if (images.length > 0) {
      const { error: insErr } = await supabase.from('product_images').insert(
        images.map((url, i) => ({ product_id: pid, image_url: url, sort_order: i }))
      );
      if (insErr) throw new Error(`Error al guardar imágenes: ${insErr.message}`);
    }
  }

  // 3. Sync specs
  if (specs !== undefined) {
    const { error: delErr } = await supabase.from('product_specs').delete().eq('product_id', pid);
    if (delErr) throw new Error(`Error al borrar especificaciones: ${delErr.message}`);
    
    if (specs.length > 0) {
      const { error: insErr } = await supabase.from('product_specs').insert(
        specs.map(s => ({ product_id: pid, label: s.label, value: s.value }))
      );
      if (insErr) throw new Error(`Error al guardar especificaciones: ${insErr.message}`);
    }
  }

  // 4. Sync colors
  if (colors !== undefined) {
    const { error: delErr } = await supabase.from('product_colors').delete().eq('product_id', pid);
    if (delErr) throw new Error(`Error al borrar colores: ${delErr.message}`);
    
    if (colors.length > 0) {
      const { error: insErr } = await supabase.from('product_colors').insert(
        colors.map(c => ({ product_id: pid, hex_color: c }))
      );
      if (insErr) throw new Error(`Error al guardar colores: ${insErr.message}`);
    }
  }

  // 5. Sync fragrances
  if (fragrances !== undefined) {
    const { error: delErr } = await supabase.from('product_fragrances').delete().eq('product_id', pid);
    if (delErr) throw new Error(`Error al borrar fragancias: ${delErr.message}`);
    
    if (fragrances.length > 0) {
      const { error: insErr } = await supabase.from('product_fragrances').insert(
        fragrances.map(f => ({
          product_id: pid,
          name: typeof f === 'string' ? f : f.name,
          description: typeof f === 'string' ? '' : (f.description || ''),
        }))
      );
      if (insErr) throw new Error(`Error al guardar fragancias: ${insErr.message}`);
    }
  }

  // 6. Sync tags
  if (tags !== undefined) {
    const { error: delErr } = await supabase.from('product_tags').delete().eq('product_id', pid);
    if (delErr) throw new Error(`Error al borrar etiquetas: ${delErr.message}`);
    
    if (tags.length > 0) {
      const { error: insErr } = await supabase.from('product_tags').insert(
        tags.map(t => ({ product_id: pid, tag: t }))
      );
      if (insErr) throw new Error(`Error al guardar etiquetas: ${insErr.message}`);
    }
  }

  // 7. Sync wholesale tiers
  if (wholesale_tiers !== undefined) {
    const { error: delErr } = await supabase.from('product_wholesale_tiers').delete().eq('product_id', pid);
    if (delErr) throw new Error(`Error al borrar niveles mayoristas: ${delErr.message}`);
    
    const validTiers = wholesale_tiers.filter(t => t.label && (t.discount_percent || t.fixed_price));
    if (validTiers.length > 0) {
      const { error: insErr } = await supabase.from('product_wholesale_tiers').insert(
        validTiers.map((t, i) => ({
          product_id: pid,
          label: t.label,
          min_qty: Number(t.min_qty) || 1,
          max_qty: t.max_qty ? Number(t.max_qty) : null,
          discount_percent: t.discount_percent ? Number(t.discount_percent) : null,
          fixed_price: t.fixed_price ? Number(t.fixed_price) : null,
          sort_order: i,
        }))
      );
      if (insErr) throw new Error(`Error al guardar niveles mayoristas: ${insErr.message}`);
    }
  }
  
  // 8. Sync variants
  if (variants !== undefined) {
    const { error: delErr } = await supabase.from('product_variants').delete().eq('product_id', pid);
    if (delErr) throw new Error(`Error al borrar tallas: ${delErr.message}`);
    
    if (variants.length > 0) {
      const { error: insErr } = await supabase.from('product_variants').insert(
        variants.map(v => ({
          product_id: pid,
          name: v.name,
          price: Number(v.price) || 0,
          stock: v.stock !== '' && v.stock !== undefined ? Number(v.stock) : 0,
        }))
      );
      if (insErr) throw new Error(`Error al guardar tallas: ${insErr.message}`);
    }
  }

  return getProduct(pid);
}

export async function duplicateProduct(id) {
  const original = await getProduct(id);
  if (!original) throw new Error('Producto no encontrado');
  
  const newId = `${original.id}-copy-${Date.now().toString(36)}`;
  const newSlug = `${original.slug}-copy`;
  
  const images = (original.product_images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(i => i.image_url);
  const specs = (original.product_specs || []).map(s => ({ label: s.label, value: s.value }));
  const colors = (original.product_colors || []).map(c => c.hex_color);
  const fragrances = (original.product_fragrances || []).map(f => ({ name: f.name, description: f.description }));
  const tags = (original.product_tags || []).map(t => t.tag);
  const wholesale_tiers = (original.product_wholesale_tiers || []).map(t => ({
    label: t.label, min_qty: t.min_qty, max_qty: t.max_qty,
    discount_percent: t.discount_percent, fixed_price: t.fixed_price,
  }));

  return saveProduct({
    id: newId,
    name: `${original.name} (Copia)`,
    slug: newSlug,
    category_id: original.category_id,
    price: original.price,
    old_price: original.old_price,
    currency: original.currency,
    badge: original.badge,
    description: original.description,
    rating: original.rating,
    reviews: 0,
    stock: original.stock,
    is_new: false,
    is_on_sale: original.is_on_sale,
    sale_percent: original.sale_percent,
    status: 'draft',
    images, specs, colors, fragrances, tags, wholesale_tiers,
  });
}

export async function deleteProduct(id) {
  return remove('products', id);
}

// ─────────────────────────────────────────────
// CATEGORÍAS
// ─────────────────────────────────────────────

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveCategory(cat) {
  return upsert('categories', cat);
}

export async function deleteCategory(id) {
  return remove('categories', id);
}

// ─────────────────────────────────────────────
// PEDIDOS
// ─────────────────────────────────────────────

export async function getOrders(opts = {}) {
  return getAll('orders', {
    ...opts,
    select: '*, order_items(*, products:product_id(name, slug))',
    sortBy: opts.sortBy || 'created_at',
    searchColumns: ['customer_name', 'customer_phone'],
  });
}

export async function getOrder(id) {
  return getById('orders', id, '*, order_items(*, products:product_id(name, slug, price))');
}

export async function updateOrderStatus(id, status) {
  return update('orders', id, { status });
}

// ─────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────

export async function getDashboardStats() {
  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: totalOrders },
    { data: recentOrders },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, stock, slug').lt('stock', 10).order('stock'),
  ]);

  // Revenue calculation
  const { data: orderTotals } = await supabase.from('orders').select('total, status');
  const totalRevenue = (orderTotals || [])
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return {
    totalProducts: totalProducts || 0,
    totalCategories: totalCategories || 0,
    totalOrders: totalOrders || 0,
    totalRevenue,
    recentOrders: recentOrders || [],
    lowStock: lowStock || [],
  };
}

// ─────────────────────────────────────────────
// ACTIVITY LOGS
// ─────────────────────────────────────────────

export async function logActivity(action, entityType, entityId, details = {}) {
  try {
    await supabase.from('activity_logs').insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
  } catch (e) {
    console.warn('Failed to log activity:', e);
  }
}

export async function getRecentActivity(limit = 10) {
  const { data } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}
