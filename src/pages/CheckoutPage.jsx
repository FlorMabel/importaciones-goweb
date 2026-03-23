import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsByIds } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';

const DEPARTAMENTOS = [
  'Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco',
  'Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto',
  'Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali'
];

function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', dept: '', city: '', address: '' });
  const [payment, setPayment] = useState('yape');

  useEffect(() => {
    if (cart.length === 0) { setLoading(false); return; }
    const uniqueIds = [...new Set(cart.map(i => i.id))];
    getProductsByIds(uniqueIds).then(prods => { setProducts(prods); setLoading(false); });
  }, [cart]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>;
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <Helmet><title>Checkout | GO SHOPPING</title></Helmet>
        <h2 className="text-2xl font-serif text-accent mb-4">No hay productos en el carrito</h2>
        <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold">Ir a la tienda</button>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  const shipping = total >= 150 ? 0 : 15;
  const grandTotal = total + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, phone, dept, city, address } = form;

    try {
      // 1. Push order to Supabase database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: name,
          customer_phone: phone,
          department: dept,
          city: city,
          address: address,
          payment_method: payment,
          subtotal: total,
          shipping: shipping,
          total: grandTotal,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Push order items to Supabase database
      const orderItems = cart.map(item => {
        const p = products.find(pr => pr.id === item.id);
        return {
          order_id: orderData.id,
          product_id: p ? p.id : item.id,
          variant: item.variant || null,
          quantity: item.qty,
          unit_price: p ? p.price : 0
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Generate WhatsApp message
      let orderLines = cart.map(item => {
        const p = products.find(pr => pr.id === item.id);
        if (!p) return '';
        return `• ${p.name}${item.variant ? ` (${item.variant})` : ''} x${item.qty} = S/ ${(p.price * item.qty).toFixed(2)}`;
      }).filter(Boolean).join('\n');

      const msg = `🛍️ *NUEVO PEDIDO - GO SHOPPING*\n\n`
        + `🆔 *ID:* ${orderData.id.split('-')[0]}\n`
        + `👤 *Cliente:* ${sanitize(name)}\n📱 *Teléfono:* ${sanitize(phone)}\n📍 *Ubicación:* ${sanitize(city)}, ${sanitize(dept)}\n🏠 *Dirección:* ${sanitize(address)}\n💳 *Pago:* ${payment.toUpperCase()}\n\n`
        + `📦 *Productos:*\n${orderLines}\n\n`
        + `🚚 Envío: ${shipping === 0 ? 'GRATIS' : `S/ ${shipping.toFixed(2)}`}\n`
        + `💰 *TOTAL: S/ ${grandTotal.toFixed(2)}*\n\n`
        + `_Adjunto mi voucher de pago_ ✅`;

      window.open(`https://wa.me/51962810439?text=${encodeURIComponent(msg)}`, '_blank');
      
      clearCart();
      showToast('¡Pedido enviado! Te esperamos en WhatsApp 🎉');
      setTimeout(() => navigate('/'), 2000);
      
    } catch(err) {
      console.error('Error procesando pedido:', err);
      showToast('Hubo un error al procesar tu pedido. Intenta nuevamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <>
      <Helmet><title>Checkout | GO SHOPPING</title></Helmet>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-8 lg:py-12">
        <h1 className="text-3xl font-serif font-bold text-accent mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-accent mb-4">Datos de Envío</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-main mb-1">Nombre completo *</label>
                    <input type="text" required value={form.name} onChange={onChange('name')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-main mb-1">Teléfono *</label>
                    <input type="tel" required value={form.phone} onChange={onChange('phone')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="+51 999 999 999" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-main mb-1">Departamento *</label>
                    <select required value={form.dept} onChange={onChange('dept')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent">
                      <option value="">Seleccionar</option>
                      {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-main mb-1">Ciudad / Distrito *</label>
                    <input type="text" required value={form.city} onChange={onChange('city')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="Tu distrito" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-main mb-1">Dirección *</label>
                    <input type="text" required value={form.address} onChange={onChange('address')} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="Av./Jr./Calle, número, referencia" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-lg text-accent mb-4">Método de Pago</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${payment === 'yape' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent'}`}>
                    <input type="radio" name="payment" value="yape" checked={payment === 'yape'} onChange={() => setPayment('yape')} className="text-accent focus:ring-accent" />
                    <div><p className="text-sm font-bold text-accent">Yape</p><p className="text-[10px] text-text-muted">Pago instantáneo</p></div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${payment === 'plin' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent'}`}>
                    <input type="radio" name="payment" value="plin" checked={payment === 'plin'} onChange={() => setPayment('plin')} className="text-accent focus:ring-accent" />
                    <div><p className="text-sm font-bold">Plin</p><p className="text-[10px] text-text-muted">Pago rápido</p></div>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Confirmar Pedido por WhatsApp ({formatPrice(grandTotal)})
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h3 className="font-serif text-lg font-bold text-accent mb-4">Tu Pedido</h3>
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                {cart.map(item => {
                  const p = products.find(pr => pr.id === item.id);
                  if (!p) return null;
                  return (
                    <div key={`${item.id}__${item.variant || ''}`} className="flex items-center gap-3 py-2">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 p-1">
                        <img src={p.images?.[0] || ''} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text-main truncate">{p.name}</p>
                        {item.variant && <p className="text-[10px] text-accent">{item.variant}</p>}
                        <p className="text-[10px] text-text-muted">Cant: {item.qty}</p>
                      </div>
                      <span className="text-xs font-bold text-text-main">{formatPrice(p.price * item.qty)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span className="font-bold">{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Envío</span><span className={`font-bold ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span></div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-accent text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
