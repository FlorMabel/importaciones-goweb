import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet><title>Página no encontrada | GO SHOPPING</title></Helmet>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-text-muted">search_off</span>
        <h2 className="text-2xl font-serif font-bold text-accent">Página no encontrada</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary-dark transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </>
  );
}
