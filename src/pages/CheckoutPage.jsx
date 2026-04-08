import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsByIds } from '../services/api';
import { formatPrice, getItemPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../services/supabase';

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
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-20 py-24 animate-pulse">
        <div className="flex flex-col gap-12">
          <div className="h-20 w-1/3 bg-gray-100 rounded-3xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 h-[600px] bg-gray-50 rounded-[3rem]"></div>
            <div className="lg:col-span-5 h-[400px] bg-gray-50 rounded-[3rem]"></div>
          </div>
        </div>
      </div>
    );
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
        + ` *ID:* ${orderData.id.split('-')[0]}\n`
        + ` *Cliente:* ${sanitize(name)}\n *Teléfono:* ${sanitize(phone)}\n *Ubicación:* ${sanitize(city)}, ${sanitize(dept)}\n🏠 *Dirección:* ${sanitize(address)}\n💳 *Pago:* ${payment.toUpperCase()}\n\n`
        + ` *Productos:*\n${orderLines}\n\n`
        + ` Envío: ${shipping === 0 ? 'GRATIS' : `S/ ${shipping.toFixed(2)}`}\n`
        + ` *TOTAL: S/ ${grandTotal.toFixed(2)}*\n\n`
        + `🚚 *Sigue tu pedido aquí:* ${window.location.origin}/seguimiento?id=${orderData.id}&phone=${phone}\n\n`
        + `_Adjunto mi voucher de pago_ `;

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
      <div className="bg-background-soft min-h-screen font-display antialiased text-text-main">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-16">
          <div className="mb-12">
            <span className="text-muted font-bold tracking-[0.2em] text-[10px] uppercase mb-1 block">Pasarela de</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-accent italic">Finalizar Pedido</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Form */}
            <div className="lg:col-span-7 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-surface-light rounded-[2.5rem] p-8 md:p-10 border border-border-light shadow-soft transition-shadow hover:shadow-medium">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-background-soft flex items-center justify-center text-accent">
                      <span className="material-symbols-outlined text-2xl">local_shipping</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-accent tracking-tight">Detalles de Envío</h3>
                      <p className="text-sm text-text-muted">¿Dónde entregaremos tu pedido?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">Nombre completo</label>
                       <input type="text" required value={form.name} onChange={onChange('name')} className="w-full bg-background-soft border-transparent rounded-2xl px-5 py-4 text-base focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200" placeholder="Ej: Julian Casablancas" />
                    </div>
                    
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2 ml-1">Teléfono móvil</label>
                       <input type="tel" required value={form.phone} onChange={onChange('phone')} className="w-full bg-background-soft border-transparent rounded-2xl px-5 py-4 text-base focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200" placeholder="999 999 999" />
                    </div>

                    <div>
                       <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Departamento</label>
                       <div className="relative">
                         <select required value={form.dept} onChange={onChange('dept')} className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-base focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                           <option value="">Seleccionar</option>
                           {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                         </select>
                         <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Distrito / Ciudad</label>
                       <input type="text" required value={form.city} onChange={onChange('city')} className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-base focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200" placeholder="Tu distrito" />
                    </div>

                    <div className="md:col-span-2">
                       <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">Dirección y Referencias</label>
                       <input type="text" required value={form.address} onChange={onChange('address')} className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-base focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200" placeholder="Ej: Av. Larco 123, frente al parque" />
                    </div>
                  </div>
                </div>

                <div className="bg-surface-light rounded-[2.5rem] p-8 md:p-10 border border-border-light shadow-soft transition-shadow hover:shadow-medium">
                   <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-background-soft flex items-center justify-center text-accent">
                      <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-accent tracking-tight">Método de Pago</h3>
                      <p className="text-sm text-text-muted">Selecciona tu billetera digital</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { 
                        id: 'yape', 
                        name: 'Yape', 
                        desc: 'Pago al instante',
                        logo: 'https://res.cloudinary.com/dod8hhjoo/image/upload/v1775624260/logo_yape_p7ahcl.webp'
                      },
                      { 
                        id: 'plin', 
                        name: 'Plin', 
                        desc: 'Transferencia fácil',
                        logo: 'https://res.cloudinary.com/dod8hhjoo/image/upload/v1775624260/logo_plin_sajhqs.webp'
                      }
                    ].map(p => (
                      <label key={p.id} className={`group flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-all duration-300 relative ${payment === p.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border-light bg-background-soft/50 hover:border-border-strong cursor-pointer'}`}>
                        <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="sr-only" />
                        
                        {/* Logo ampliado un 20% adicional */}
                        <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-sm">
                          <img src={p.logo} alt={p.name} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex-1">
                          <span className={`text-base font-bold block leading-none transition-colors ${payment === p.id ? 'text-text-main' : 'text-text-muted'}`}>{p.name}</span>
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5 block">{p.desc}</span>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payment === p.id ? 'border-primary bg-primary' : 'border-border-strong bg-white'}`}>
                           {payment === p.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Bloque Informativo Estilo Apple con Paleta Brand */}
                  <div className="mt-10 p-8 rounded-[2rem] bg-background-soft border border-border-light space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-accent mb-1">Finaliza tu pago</h4>
                      <p className="text-sm text-text-muted font-medium italic">Envía el monto total al siguiente número:</p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 bg-white rounded-3xl border border-primary/20 shadow-soft group hover:border-primary transition-colors cursor-pointer">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Número Autorizado</span>
                      <span className="text-4xl font-black tracking-tighter text-text-main select-all group-hover:scale-105 transition-transform">962 810 439</span>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] pt-2">Pasos a seguir:</h5>
                      <ul className="space-y-5">
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 shadow-soft">1</div>
                          <p className="text-sm text-text-secondary font-medium leading-snug pt-0.5">Usa <b>Yape o Plin</b> para enviar el monto total al número de arriba.</p>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 shadow-soft">2</div>
                          <p className="text-sm text-text-secondary font-medium leading-snug pt-0.5">Toma una <b>captura de pantalla</b> de tu comprobante.</p>
                        </li>
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 shadow-soft">3</div>
                          <p className="text-sm text-text-secondary font-medium leading-snug pt-0.5">Dale al botón verde para <b>enviar la captura</b> por WhatsApp.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-5 md:py-7 rounded-[2.5rem] transition-all duration-300 shadow-strong hover:shadow-glow active:scale-95 flex flex-col items-center justify-center gap-1 disabled:opacity-50 group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-3xl transition-transform group-hover:translate-x-1">send</span>
                      <span className="text-xl uppercase tracking-widest">Enviar Pedido</span>
                    </div>
                    <span className="text-[10px] text-white/90 font-bold uppercase tracking-[0.2em] italic">Redirección segura a WhatsApp Business</span>
                  </button>
                  
                  <p className="text-center text-[10px] text-text-muted font-bold max-w-xs mx-auto leading-relaxed border-t border-border-light pt-6">
                    <span className="material-symbols-outlined text-xs inline-block align-middle mr-1">security</span>
                    Sincronización manual verificada para tu total satisfacción.
                  </p>
                </div>
              </form>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-10">
              <div className="bg-surface-light rounded-[3rem] p-8 md:p-10 border border-border-light shadow-soft transition-shadow hover:shadow-medium">
                <h3 className="text-2xl font-bold text-accent italic tracking-tight mb-10">Resumen Luxury</h3>
                
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                  {cart.map(item => (
                    <div key={`${item.id}__${item.variant || ''}`} className="flex items-center gap-4 group">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 overflow-hidden flex-shrink-0 p-2 shadow-sm">
                        <img src={item.images?.[0] || ''} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-gray-400 font-medium">Cant. {item.qty}</span>
                          {item.variant && (
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded-md">{item.variant}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-5 pt-8 border-t border-border-light">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-text-muted">Valor de Selección</span>
                     <span className="text-text-main">{formatPrice(total)}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-text-muted">Gestión de Envío</span>
                     <span className={`font-black ${shipping === 0 ? 'text-success' : 'text-text-main'}`}>
                       {shipping === 0 ? 'CORTESÍA' : formatPrice(shipping)}
                     </span>
                   </div>
                   
                   <div className="pt-8 mt-4 border-t-2 border-dashed border-border-light flex justify-between items-baseline">
                     <p className="text-xl font-black text-accent uppercase tracking-tighter">Total Inversión</p>
                     <p className="text-4xl font-black tracking-tighter text-text-main">{formatPrice(grandTotal)}</p>
                   </div>
                </div>

                <div className="mt-10 space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50">
                    <span className="material-symbols-outlined text-blue-500">verified_user</span>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                      Tu información está protegida. La transferencia es directa para tu total seguridad.
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
