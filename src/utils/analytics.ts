import ReactGA from 'react-ga4';

const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Remplacer par votre ID Google Analytics
const FB_PIXEL_ID = 'YOUR_PIXEL_ID'; // Remplacer par votre ID Facebook Pixel

// Google Analytics
export const initGA = () => {
  if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    ReactGA.initialize(GA_TRACKING_ID);
    console.log('✅ Google Analytics initialisé');
  }
};

export const logPageView = (path: string) => {
  if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

export const logEvent = (category: string, action: string, label?: string, value?: number) => {
  if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
  }
};

// Events e-commerce spécifiques
export const logAddToCart = (productId: string, productName: string, price: number) => {
  logEvent('Ecommerce', 'Add to Cart', productName, price);
};

export const logRemoveFromCart = (productId: string, productName: string) => {
  logEvent('Ecommerce', 'Remove from Cart', productName);
};

export const logViewProduct = (productId: string, productName: string, price: number) => {
  logEvent('Ecommerce', 'View Product', productName, price);
};

export const logInitiateCheckout = (cartTotal: number, itemCount: number) => {
  logEvent('Ecommerce', 'Initiate Checkout', `Items: ${itemCount}`, cartTotal);
};

export const logPurchase = (orderId: string, total: number, items: any[]) => {
  logEvent('Ecommerce', 'Purchase', orderId, total);

  // Enhanced Ecommerce tracking (si configuré)
  if (GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    ReactGA.event('purchase', {
      transaction_id: orderId,
      value: total,
      currency: 'DZD',
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.product?.name_en || 'Product',
        price: item.price,
        quantity: item.quantity
      }))
    });
  }
};

export const logUserSignup = (method: string = 'email') => {
  logEvent('User', 'Sign Up', method);
};

export const logUserLogin = (method: string = 'email') => {
  logEvent('User', 'Login', method);
};

// Facebook Pixel
declare global {
  interface Window {
    fbq: any;
  }
}

export const initFacebookPixel = () => {
  if (FB_PIXEL_ID && FB_PIXEL_ID !== 'YOUR_PIXEL_ID' && typeof window !== 'undefined') {
    // Initialize Facebook Pixel
    if (!window.fbq) {
      (function(f: any, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(t, s);
        }
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js'));
    }

    window.fbq('init', FB_PIXEL_ID);
    window.fbq('track', 'PageView');
    console.log('✅ Facebook Pixel initialisé');
  }
};

export const trackFBEvent = (eventName: string, data?: any) => {
  if (FB_PIXEL_ID && FB_PIXEL_ID !== 'YOUR_PIXEL_ID' && typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
};

// Events Facebook Pixel spécifiques
export const trackFBViewContent = (productId: string, productName: string, price: number) => {
  trackFBEvent('ViewContent', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency: 'DZD'
  });
};

export const trackFBAddToCart = (productId: string, productName: string, price: number) => {
  trackFBEvent('AddToCart', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency: 'DZD'
  });
};

export const trackFBInitiateCheckout = (value: number, numItems: number) => {
  trackFBEvent('InitiateCheckout', {
    value: value,
    currency: 'DZD',
    num_items: numItems
  });
};

export const trackFBPurchase = (orderId: string, value: number) => {
  trackFBEvent('Purchase', {
    value: value,
    currency: 'DZD',
    content_type: 'product',
    order_id: orderId
  });
};

export const trackFBCompleteRegistration = (method: string = 'email') => {
  trackFBEvent('CompleteRegistration', {
    content_name: 'User Registration',
    status: 'completed',
    method: method
  });
};

// Fonction utilitaire pour tracker les événements automatiquement
export const trackEvent = (eventType: string, data?: any) => {
  switch (eventType) {
    case 'page_view':
      logPageView(data?.path || window.location.pathname);
      break;
    case 'add_to_cart':
      logAddToCart(data.productId, data.productName, data.price);
      trackFBAddToCart(data.productId, data.productName, data.price);
      break;
    case 'view_product':
      logViewProduct(data.productId, data.productName, data.price);
      trackFBViewContent(data.productId, data.productName, data.price);
      break;
    case 'initiate_checkout':
      logInitiateCheckout(data.total, data.itemCount);
      trackFBInitiateCheckout(data.total, data.itemCount);
      break;
    case 'purchase':
      logPurchase(data.orderId, data.total, data.items);
      trackFBPurchase(data.orderId, data.total);
      break;
    case 'signup':
      logUserSignup(data.method);
      trackFBCompleteRegistration(data.method);
      break;
    case 'login':
      logUserLogin(data.method);
      break;
    default:
      console.log('Unknown event type:', eventType);
  }
};
