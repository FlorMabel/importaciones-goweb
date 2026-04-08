import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabase';

// Mapeado de estados según requerimiento
const STATUS_STEPS = {
  'pending': 1,
  'verifying': 2,
  'paid': 3,
  'shipped': 4
};

const STEPS = [
  { id: 1, label: 'Pedido recibido' },
  { id: 2, label: 'Pago en verificación' },
  { id: 3, label: 'Confirmado' },
  { id: 4, label: 'Enviado' }
];

export default function TrackingPage() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si vienen parámetros en la URL, se ejecuta la búsqueda automáticamente
    if (searchParams.get('id') && searchParams.get('phone')) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!orderId || !phone) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // Mejora UX: Buscamos por teléfono y filtramos en memoria por el prefijo del ID
      // Esto evita errores de tipo UUID en PostgreSQL al usar IDs cortos
      const { data: ordersData, error: queryError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_phone', phone.trim())
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      // Buscamos el pedido cuyo ID comience con lo ingresado (soporta ID corto y ID completo)
      const data = ordersData?.find(o => 
        o.id.toLowerCase().startsWith(orderId.trim().toLowerCase())
      ) || null;

      if (queryError || !data) {
        throw new Error('No encontramos tu pedido. Por favor, revisa que el ID y el número de teléfono sean correctos.');
      }

      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? (STATUS_STEPS[order.status] || 1) : 0;
  const progressWidth = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#F5F5DC] font-sans text-gray-900 pb-20">
      <Helmet>
        <title>Sigue tu pedido | GO SHOPPING</title>
      </Helmet>

      {/* Header Estilo Apple */}
      <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Sigue tu pedido</h1>
        <p className="text-gray-500 text-lg md:text-xl font-medium">Consulta el estado de tu pedido en tiempo real</p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Formulario de consulta */}
        <div className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6B21A8]">search</span>
              Buscar pedido
            </h2>
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">ID del pedido</label>
                <input
                  type="text"
                  placeholder="Ej: f47ac10b-58cc-4372-a567..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-[#6B21A8]/10 focus:border-[#6B21A8] transition-all duration-300 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Teléfono de contacto</label>
                <input
                  type="tel"
                  placeholder="Ej: 999 999 999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-[#6B21A8]/10 focus:border-[#6B21A8] transition-all duration-300 outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6B21A8] text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-[#6B21A8]/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">query_stats</span>
                    Consultar pedido
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="mt-6 p-6 bg-white rounded-3xl border border-red-50 text-center animate-fade-in">
              <span className="material-symbols-outlined text-red-400 text-3xl mb-2">error</span>
              <p className="text-gray-600 text-sm leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Resultado del Seguimiento */}
        <div className="w-full">
          {order ? (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 animate-slide-up">
              <div className="space-y-10">
                {/* Header Resultado */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-50 pb-8">
                  <div>
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-1 block">Detalles del Pedido</span>
                    <h3 className="text-2xl font-bold tracking-tighter">ID: {order.id.split('-')[0]}...</h3>
                    <p className="text-gray-400 text-sm font-medium mt-1">Realizado el {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-[#6B21A8]/5 px-4 py-2 rounded-xl">
                    <span className="text-[#6B21A8] text-xs font-bold uppercase tracking-widest">{STEPS.find(s => s.id === currentStep)?.label}</span>
                  </div>
                </div>

                {/* Timeline visual */}
                <div className="relative py-12 px-2">
                  {/* Barra de progreso de fondo */}
                  <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                    {/* Mejora UX estilo Apple: Animación suave con Dorado */}
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                      style={{ width: `${progressWidth}%` }}
                    ></div>
                  </div>

                  {/* Puntos de los estados */}
                  <div className="relative flex justify-between">
                    {STEPS.map((step) => {
                      const isActive = step.id <= currentStep;
                      return (
                        <div key={step.id} className="flex flex-col items-center group">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 z-10
                            ${isActive ? 'bg-[#6B21A8] scale-125 shadow-lg shadow-[#6B21A8]/30' : 'bg-white border-2 border-gray-200'}
                          `}>
                            {isActive && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                          </div>
                          <div className="absolute top-10 flex flex-col items-center w-max">
                            <span className={`
                              text-[10px] font-bold uppercase tracking-widest transition-colors duration-500
                              ${isActive ? 'text-gray-900' : 'text-gray-400'}
                            `}>
                              {step.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mensajes de Ayuda */}
                <div className="mt-20 pt-10 border-t border-gray-50 space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50/50">
                    <span className="material-symbols-outlined text-[#6B21A8]">info</span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Información de interés</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {order.status === 'verifying' 
                          ? "Si ya realizaste el pago, estamos validando tu comprobante con el banco. Te notificaremos pronto." 
                          : "Actualizamos el progreso de tu pedido en tiempo real para que sepas exactamente dónde está."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50/30 rounded-[2.5rem] border-2 border-dashed border-gray-100">
               <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">analytics</span>
               <p className="text-gray-400 font-medium italic">Ingresa tus datos para ver el progreso...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
