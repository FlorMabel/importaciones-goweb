import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import { useStore } from './context/StoreContext.jsx';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage.jsx'));
const DealsPage = lazy(() => import('./pages/DealsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-text-muted text-sm">Cargando...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
export default function App() {
  const { isCartDrawerOpen, setCartDrawerOpen } = useStore();
  
  return (
    <>
      <ScrollToTop />
      <Header />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <main className="flex-grow w-full">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categoria" element={<CategoryPage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/producto/:slug" element={<ProductPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/novedades" element={<NewArrivalsPage />} />
            <Route path="/ofertas" element={<DealsPage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
