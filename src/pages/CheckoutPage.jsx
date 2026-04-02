import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsByIds } from '../services/api';
import { formatPrice, getItemPrice } from '../utils';
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
  const { cart, clearCart, getCartTotal } = useStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', dept: '', city: '', address: '' });
  const [payment, setPayment] = useState('yape');

  useEffect(() => {
    if (cart.length === 0) {
      const timer = setTimeout(() => {
        if (cart.length === 0) navigate('/carrito');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cart, navigate]);

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

  const total = getCartTotal();
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
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        variant: item.variant || null,
        quantity: item.qty,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Generate WhatsApp message
      let orderLines = cart.map(item => 
        `• ${item.name}${item.variant ? ` (${item.variant})` : ''} x${item.qty} = S/ ${(item.price * item.qty).toFixed(2)}`
      ).join('\n');

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
      <div className="bg-beige-soft min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12 lg:py-20">
          <div className="mb-12">
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-1 block">Pasarela de</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-accent italic">Finalizar Pedido</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Shipping Info Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-soft border border-border-light relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="size-10 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                      <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <h3 className="text-xl font-bold text-accent">Detalles del Destinatario</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">Nombre de Prestigio *</label>
                       <input type="text" required value={form.name} onChange={onChange('name')} className="w-full bg-beige-light border-border-light rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40" placeholder="Ej: Julian Casablancas" />
                    </div>
                    
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">Contacto Directo *</label>
                       <input type="tel" required value={form.phone} onChange={onChange('phone')} className="w-full bg-beige-light border-border-light rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40" placeholder="+51 999 999 999" />
                    </div>

                    <div>
                       <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">Departamento *</label>
                       <select required value={form.dept} onChange={onChange('dept')} className="w-full bg-beige-light border-border-light rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer">
                         <option value="">Seleccionar Ubicación</option>
                         {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>

                    <div>
                       <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">Distrito / Ciudad *</label>
                       <input type="text" required value={form.city} onChange={onChange('city')} className="w-full bg-beige-light border-border-light rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40" placeholder="Tu distrito" />
                    </div>

                    <div className="md:col-span-2">
                       <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">Dirección Exacta / Referencias *</label>
                       <input type="text" required value={form.address} onChange={onChange('address')} className="w-full bg-beige-light border-border-light rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-muted/40" placeholder="Ciudad, Calle, Nº de casa y referencia" />
                    </div>
                  </div>
                </div>

                {/* Payment Methods Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-soft border border-border-light relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-8">
                    <div className="size-10 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <h3 className="text-xl font-bold text-accent">Preferencia de Pago</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'yape', name: 'Yape', desc: 'Confirmación instantánea' },
                      { id: 'plin', name: 'Plin', desc: 'Transferencia directa' }
                    ].map(p => (
                      <label key={p.id} className={`group flex flex-col p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative ${payment === p.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border-light bg-beige-light hover:border-border-strong'}`}>
                        <div className="flex justify-between items-start mb-4">
                           <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${payment === p.id ? 'border-primary bg-primary' : 'border-border-strong bg-white'}`}>
                             {payment === p.id && <div className="size-2 bg-white rounded-full"></div>}
                           </div>
                           <span className="material-symbols-outlined text-text-muted/20 group-hover:text-primary/30 transition-colors">qr_code_2</span>
                        </div>
                        <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="sr-only" />
                        <span className={`font-bold block ${payment === p.id ? 'text-primary' : 'text-text-main'}`}>{p.name}</span>
                        <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest mt-1">{p.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Final Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-3xl transition-all shadow-glow flex flex-col items-center justify-center gap-1 disabled:opacity-50 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined animate-bounce">send</span>
                    <span className="uppercase tracking-[0.2em] text-xs">Confirmar por WhatsApp</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-light italic">Se enviará el detalle de tu selección</span>
                </button>
              </form>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-strong border border-border-light">
                <h3 className="font-serif text-2xl font-bold text-accent mb-8 italic">Resumen de Pedido</h3>
                
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                  {cart.map(item => (
                    <div key={`${item.id}__${item.variant || ''}`} className="flex items-center gap-5 group">
                      <div className="size-16 rounded-[1.2rem] bg-beige-light border border-border-light overflow-hidden flex-shrink-0 p-2 group-hover:scale-105 transition-transform">
                        <img src={item.images?.[0] || ''} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-text-main truncate group-hover:text-primary transition-colors">{item.name}</h4>
                        {item.variant && <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">{item.variant}</p>}
                        <p className="text-[10px] text-text-muted mt-1">Cantidad de {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-accent">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-border-light">
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-text-muted uppercase tracking-widest">Subtotal de Compra</span>
                     <span className="text-text-main">{formatPrice(total)}</span>
                   </div>
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-text-muted uppercase tracking-widest">Logística de Envío</span>
                     <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-text-main'}`}>
                       {shipping === 0 ? 'CORTESÍA' : formatPrice(shipping)}
                     </span>
                   </div>
                   
                   <div className="pt-6 mt-4 border-t-2 border-border-light flex justify-between items-baseline">
                     <div>
                       <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1">Total a Invertir</p>
                       <p className="font-serif text-3xl font-bold text-accent">Pago Final</p>
                     </div>
                     <div className="text-right">
                       <p className="text-3xl font-bold text-accent">{formatPrice(grandTotal)}</p>
                       <p className="text-[9px] text-text-muted italic">Incluye impuestos y gestión</p>
                     </div>
                   </div>
                </div>

                <div className="mt-10 p-6 bg-beige-light rounded-[2rem] border border-border-light space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                    <p className="text-[10px] text-text-muted leading-relaxed font-medium">
                      Tu pedido está protegido. Al confirmar, un personal shopper te guiará para finalizar el pago y coordinar la entrega.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
