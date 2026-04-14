import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
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
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'));
const TrackingPage = lazy(() => import('./pages/TrackingPage.jsx'));

// Admin dashboard — completely separate layout
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="text-text-muted text-sm italic">Preparando la experiencia...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

/**
 * Store layout — Header, Footer, WhatsApp for public pages
 */
function StoreLayout() {
  const { isCartDrawerOpen, setCartDrawerOpen } = useStore();
  const location = useLocation();
  
  return (
    <>
      <Header />
      <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <main className="flex-grow w-full overflow-hidden">
        <Suspense fallback={<Loading />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/categoria" element={<CategoryPage />} />
                <Route path="/categoria/:slug" element={<CategoryPage />} />
                <Route path="/producto/:slug" element={<ProductPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/favoritos" element={<WishlistPage />} />
                <Route path="/novedades" element={<NewArrivalsPage />} />
                <Route path="/ofertas" element={<DealsPage />} />
                <Route path="/nosotros" element={<AboutPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/seguimiento" element={<TrackingPage />} />
                <Route path="/terminos-y-condiciones" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
      <ThemeToggle />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  
  return (
    <>
      <ScrollToTop />
      {isAdmin ? (
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Suspense>
      ) : (
        <StoreLayout />
      )}
    </>
  );
}
