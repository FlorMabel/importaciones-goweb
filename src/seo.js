function setMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(property.startsWith('og:') || property.startsWith('twitter:') ? 'property' : 'name', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setJsonLd(data) {
  let el = document.getElementById('json-ld');
  if (!el) {
    el = document.createElement('script');
    el.id = 'json-ld';
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

const BASE_URL = 'https://goshopping.pe';

export function setHomeSeo() {
  document.title = 'GO SHOPPING | Premium Store — Productos Importados';
  setMeta('description', 'Tienda online premium de productos importados: anillos, humidificadores, esencias, quemadores, tecnología y más.');
  setMeta('og:title', 'GO SHOPPING | Premium Store');
  setMeta('og:description', 'Descubre nuestra colección exclusiva de artículos de lujo seleccionados.');
  setMeta('og:type', 'website');
  setMeta('og:url', BASE_URL);
  setMeta('twitter:card', 'summary_large_image');
  setJsonLd({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'GO SHOPPING', url: BASE_URL });
}

export function setCategorySeo(category) {
  if (!category) return;
  document.title = `${category.name} | GO SHOPPING`;
  setMeta('description', category.description);
  setMeta('og:title', `${category.name} | GO SHOPPING`);
  setMeta('og:description', category.description);
  setMeta('og:type', 'website');
  setJsonLd({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: category.name, description: category.description });
}

export function setProductSeo(product) {
  if (!product) return;
  document.title = `${product.name} | GO SHOPPING`;
  setMeta('description', product.description);
  setMeta('og:title', product.name);
  setMeta('og:description', product.description);
  setMeta('og:type', 'product');
  if (product.images?.[0]) setMeta('og:image', product.images[0]);
  setJsonLd({
    '@context': 'https://schema.org', '@type': 'Product', name: product.name,...(product.images?.[0] ? { image: product.images[0] } : {}),
    description: product.description,
    offers: { '@type': 'Offer', price: product.price, priceCurrency: 'PEN', availability: product.stock > 0 ? 'InStock' : 'OutOfStock' }
  });
}

export function setCartSeo() {
  document.title = 'Carrito de Compras | GO SHOPPING';
  setMeta('description', 'Revisa los productos en tu carrito de compras.');
}

export function setNewArrivalsSeo() {
  document.title = 'Novedades | GO SHOPPING';
  setMeta('description', 'Descubre los últimos productos importados en GO SHOPPING.');
}

export function setDealsSeo() {
  document.title = 'Ofertas | GO SHOPPING';
  setMeta('description', 'Las mejores ofertas y descuentos en productos importados premium.');
}

export function setAboutSeo() {
  document.title = 'Nosotros | GO SHOPPING';
  setMeta('description', 'Conoce la historia y valores de GO SHOPPING, tu tienda premium de productos importados.');
}

export function setContactSeo() {
  document.title = 'Contacto | GO SHOPPING';
  setMeta('description', 'Contáctanos por WhatsApp o formulario. Atención personalizada.');
}
