#!/usr/bin/env node

/**
 * PRODUCTION READINESS TEST SUITE
 * Tests automatisés pour vérifier la conformité avant déploiement
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductionTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  log(message, status = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const colors = {
      success: '\x1b[32m',
      error: '\x1b[31m',
      warning: '\x1b[33m',
      info: '\x1b[36m',
      reset: '\x1b[0m'
    };

    console.log(`${colors[status]}[${timestamp}] ${message}${colors.reset}`);
  }

  test(name, testFn) {
    try {
      const result = testFn();
      if (result === true) {
        this.results.passed++;
        this.results.tests.push({ name, status: 'passed' });
        this.log(`✅ ${name}`, 'success');
        return true;
      } else if (result === 'warning') {
        this.results.warnings++;
        this.results.tests.push({ name, status: 'warning' });
        this.log(`⚠️  ${name}`, 'warning');
        return true;
      } else {
        this.results.failed++;
        this.results.tests.push({ name, status: 'failed' });
        this.log(`❌ ${name}`, 'error');
        return false;
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'failed', error: error.message });
      this.log(`❌ ${name}: ${error.message}`, 'error');
      return false;
    }
  }

  // Test des fichiers critiques
  testCriticalFiles() {
    const criticalFiles = [
      'package.json',
      'src/App.tsx',
      'src/main.tsx',
      'index.html',
      'vite.config.ts'
    ];

    criticalFiles.forEach(file => {
      this.test(`Fichier critique existe: ${file}`, () => {
        return fs.existsSync(path.join(__dirname, file));
      });
    });
  }

  // Test des dépendances
  testDependencies() {
    this.test('package.json est valide', () => {
      try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        return packageJson.name && packageJson.version;
      } catch (error) {
        console.log('JSON parse error:', error.message);
        return false;
      }
    });

    this.test('Dépendances React installées', () => {
      try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        return deps.react && deps['react-dom'] && deps.typescript;
      } catch {
        return false;
      }
    });
  }

  // Test de configuration Vite
  testViteConfig() {
    this.test('Vite config existe', () => {
      return fs.existsSync(path.join(__dirname, 'vite.config.ts'));
    });

    this.test('PWA configuré', () => {
      const config = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
      return config.includes('VitePWA') && config.includes('registerType');
    });

    this.test('Build optimisé', () => {
      const config = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
      return config.includes('manualChunks') && config.includes('minify');
    });
  }

  // Test des composants critiques
  testComponents() {
    const components = [
      'src/components/Header.tsx',
      'src/components/Footer.tsx',
      'src/pages/HomePage.tsx',
      'src/pages/ShopPage.tsx',
      'src/pages/CheckoutPage.tsx',
      'src/contexts/AuthContext.tsx',
      'src/contexts/CartContext.tsx'
    ];

    components.forEach(component => {
      this.test(`Composant existe: ${component}`, () => {
        return fs.existsSync(path.join(__dirname, component));
      });
    });
  }

  // Test des formulaires
  testForms() {
    this.test('Validation téléphone algérien', () => {
      const constantsFile = fs.readFileSync(path.join(__dirname, 'src/lib/constants.ts'), 'utf8');
      return constantsFile.includes('validateAlgerianPhone') &&
             constantsFile.includes('0[5-7]') &&
             constantsFile.includes('+213[5-7]');
    });

    this.test('Liste wilayas complète', () => {
      const constantsFile = fs.readFileSync(path.join(__dirname, 'src/lib/constants.ts'), 'utf8');
      return constantsFile.includes('Adrar') &&
             constantsFile.includes('Alger') &&
             constantsFile.includes('Oran') &&
             constantsFile.length > 2000; // Liste complète
    });

    this.test('Composant Select', () => {
      return fs.existsSync(path.join(__dirname, 'src/components/ui/Select.tsx'));
    });
  }

  // Test Analytics
  testAnalytics() {
    this.test('Google Analytics configuré', () => {
      const analyticsFile = fs.readFileSync(path.join(__dirname, 'src/utils/analytics.ts'), 'utf8');
      return analyticsFile.includes('GA_TRACKING_ID') &&
             analyticsFile.includes('ReactGA.initialize');
    });

    this.test('Facebook Pixel configuré', () => {
      const htmlFile = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
      return htmlFile.includes('connect.facebook.net') &&
             htmlFile.includes('fbevents.js');
    });

    this.test('Events e-commerce trackés', () => {
      const analyticsFile = fs.readFileSync(path.join(__dirname, 'src/utils/analytics.ts'), 'utf8');
      return analyticsFile.includes('trackEvent') &&
             analyticsFile.includes('add_to_cart') &&
             analyticsFile.includes('purchase');
    });
  }

  // Test Edge Functions
  testEdgeFunctions() {
    this.test('Edge Function create-order existe', () => {
      return fs.existsSync(path.join(__dirname, '../supabase/functions/create-order/index.ts'));
    });

    this.test('Edge Function déployée', () => {
      // Cette fonction devrait être testée manuellement après déploiement
      return 'warning'; // Warning car nécessite vérification manuelle
    });
  }

  // Test Images
  testImages() {
    this.test('Composant OptimizedImage', () => {
      return fs.existsSync(path.join(__dirname, 'src/components/ui/OptimizedImage.tsx'));
    });

    this.test('Script d\'optimisation', () => {
      return fs.existsSync(path.join(__dirname, '../scripts/optimize-images.js'));
    });

    this.test('Lazy loading configuré', () => {
      const imageComponent = fs.readFileSync(path.join(__dirname, 'src/components/ui/OptimizedImage.tsx'), 'utf8');
      return imageComponent.includes('LazyLoadImage') &&
             imageComponent.includes('threshold');
    });
  }

  // Test Sécurité
  testSecurity() {
    this.test('Supabase configuré', () => {
      return fs.existsSync(path.join(__dirname, 'src/lib/supabase.ts'));
    });

    this.test('Auth context sécurisé', () => {
      const authFile = fs.readFileSync(path.join(__dirname, 'src/contexts/AuthContext.tsx'), 'utf8');
      return authFile.includes('supabase.auth') &&
             authFile.includes('session');
    });

    this.test('Routes protégées', () => {
      const appFile = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');
      return appFile.includes('ProtectedRoute') &&
             appFile.includes('AdminRoute');
    });
  }

  // Test Performance
  testPerformance() {
    this.test('Lazy loading des pages', () => {
      const appFile = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');
      return appFile.includes('lazy(') && appFile.includes('Suspense');
    });

    this.test('Code splitting configuré', () => {
      const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
      return viteConfig.includes('manualChunks');
    });

    this.test('Service Worker PWA', () => {
      const viteConfig = fs.readFileSync(path.join(__dirname, 'vite.config.ts'), 'utf8');
      return viteConfig.includes('workbox') && viteConfig.includes('runtimeCaching');
    });
  }

  // Test Accessibilité
  testAccessibility() {
    this.test('ARIA labels présents', () => {
      // Vérification basique - devrait être fait manuellement pour être complet
      return 'warning';
    });

    this.test('Navigation clavier', () => {
      // Test manuel requis
      return 'warning';
    });
  }

  // Test Mobile
  testMobile() {
    this.test('Viewport configuré', () => {
      const htmlFile = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
      return htmlFile.includes('viewport') &&
             htmlFile.includes('width=device-width');
    });

    this.test('Navigation mobile (bottom nav)', () => {
      const headerFile = fs.readFileSync(path.join(__dirname, 'src/components/Header.tsx'), 'utf8');
      return headerFile.includes('MobileBottomNav') &&
             headerFile.includes('fixed bottom-0');
    });

    this.test('PWA manifest', () => {
      return fs.existsSync(path.join(__dirname, 'public/manifest.webmanifest'));
    });
  }

  runAllTests() {
    console.log('🚀 DÉMARRAGE DES TESTS DE PRODUCTION\n');

    this.testCriticalFiles();
    console.log('');

    this.testDependencies();
    console.log('');

    this.testViteConfig();
    console.log('');

    this.testComponents();
    console.log('');

    this.testForms();
    console.log('');

    this.testAnalytics();
    console.log('');

    this.testEdgeFunctions();
    console.log('');

    this.testImages();
    console.log('');

    this.testSecurity();
    console.log('');

    this.testPerformance();
    console.log('');

    this.testAccessibility();
    console.log('');

    this.testMobile();
    console.log('');

    this.printSummary();
  }

  printSummary() {
    const { passed, failed, warnings } = this.results;
    const total = passed + failed + warnings;
    const score = Math.round((passed / total) * 100);

    console.log('📊 RÉSULTATS FINAUX\n');
    console.log(`Total des tests: ${total}`);
    console.log(`✅ Réussis: ${passed}`);
    console.log(`❌ Échoués: ${failed}`);
    console.log(`⚠️  Avertissements: ${warnings}`);
    console.log(`📈 Score: ${score}%\n`);

    if (score >= 90) {
      this.log(`🎉 SCORE EXCELLENT: ${score}% - PRÊT POUR PRODUCTION!`, 'success');
    } else if (score >= 75) {
      this.log(`⚠️ SCORE BON: ${score}% - QUELQUES AMÉLIORATIONS REQUISES`, 'warning');
    } else {
      this.log(`❌ SCORE INSUFFISANT: ${score}% - TRAVAIL SUPPLÉMENTAIRE NÉCESSAIRE`, 'error');
    }

    if (failed > 0) {
      console.log('\n❌ TESTS ÉCHOUÉS:');
      this.results.tests
        .filter(test => test.status === 'failed')
        .forEach(test => console.log(`   - ${test.name}`));
    }

    if (warnings > 0) {
      console.log('\n⚠️ AVERTISSEMENTS:');
      this.results.tests
        .filter(test => test.status === 'warning')
        .forEach(test => console.log(`   - ${test.name}`));
    }
  }
}

// Exécuter les tests
const tester = new ProductionTester();
tester.runAllTests();
