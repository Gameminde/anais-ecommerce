// Script pour mesurer les métriques de performance
// À exécuter dans le navigateur

console.log('=== LIGHTHOUSE PERFORMANCE TEST ===');

// Simuler les métriques Core Web Vitals
const measureVitals = () => {
  // LCP - Largest Contentful Paint
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log(`LCP: ${lastEntry.startTime}ms`);
  }).observe({entryTypes: ['largest-contentful-paint']});

  // FID - First Input Delay
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
    }
  }).observe({entryTypes: ['first-input']});

  // CLS - Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log(`CLS: ${clsValue}`);
  }).observe({entryTypes: ['layout-shift']});
};

// Mesurer les temps de chargement
const measureLoadTimes = () => {
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page Load Time: ${loadTime}ms`);

    // Time to Interactive (approximation)
    setTimeout(() => {
      const tti = performance.now();
      console.log(`Time to Interactive: ${tti}ms`);
    }, 100);
  });
};

// Analyser les ressources
const analyzeResources = () => {
  setTimeout(() => {
    const resources = performance.getEntriesByType('resource');

    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imageSize = 0;

    resources.forEach(resource => {
      totalSize += resource.transferSize || 0;

      if (resource.name.includes('.js')) jsSize += resource.transferSize || 0;
      if (resource.name.includes('.css')) cssSize += resource.transferSize || 0;
      if (resource.name.match(/\.(jpg|jpeg|png|webp|gif|svg)/)) imageSize += resource.transferSize || 0;
    });

    console.log(`Total resources: ${(totalSize / 1024).toFixed(1)} KB`);
    console.log(`JS size: ${(jsSize / 1024).toFixed(1)} KB`);
    console.log(`CSS size: ${(cssSize / 1024).toFixed(1)} KB`);
    console.log(`Images size: ${(imageSize / 1024).toFixed(1)} KB`);
  }, 2000);
};

// Test de l'accessibilité
const testAccessibility = () => {
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  const buttonsWithoutText = document.querySelectorAll('button:not([aria-label]):empty');
  const linksWithoutText = document.querySelectorAll('a:not([aria-label]):empty');

  console.log(`Images without alt: ${imagesWithoutAlt.length}`);
  console.log(`Buttons without text: ${buttonsWithoutText.length}`);
  console.log(`Links without text: ${linksWithoutText.length}`);
};

// Lancer tous les tests
measureVitals();
measureLoadTimes();
analyzeResources();
testAccessibility();

console.log('Tests lancés - Attendez le chargement complet de la page...');
