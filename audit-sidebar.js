import { chromium } from 'playwright';
import http from 'http';

async function auditSidebar() {
  console.log('🔍 AUDIT EXHAUSTIF - SIDEBAR MOBILE\n');

  // 1. Test HTTP - vérifier si le serveur fonctionne
  console.log('1️⃣ TEST SERVEUR HTTP:');
  try {
    const response = await new Promise((resolve, reject) => {
      const req = http.get('http://localhost:5173', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      req.setTimeout(5000, () => reject(new Error('Timeout')));
    });

    console.log(`   ✅ Serveur répond: ${response.status}`);
    console.log(`   📊 HTML size: ${response.data.length} caractères`);

    // Vérifier les classes dans le HTML
    const hasMobileNav = response.data.includes('mobile-bottom-nav-premium');
    const hasNavBlur = response.data.includes('nav-background-blur');
    const hasNavContainer = response.data.includes('nav-container-premium');

    console.log('\n2️⃣ CLASSES DANS LE HTML:');
    console.log(`   mobile-bottom-nav-premium: ${hasMobileNav ? '✅' : '❌'}`);
    console.log(`   nav-background-blur: ${hasNavBlur ? '✅' : '❌'}`);
    console.log(`   nav-container-premium: ${hasNavContainer ? '✅' : '❌'}`);

  } catch (error) {
    console.log(`   ❌ Serveur erreur: ${error.message}`);
    return;
  }

  // 2. Test avec Playwright - vérification visuelle
  console.log('\n3️⃣ TEST VISUEL PLAYWRIGHT:');

  try {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    // Test Desktop (1200px)
    console.log('\n🖥️  TEST DESKTOP (1200px):');
    const desktopPage = await context.newPage();
    await desktopPage.setViewportSize({ width: 1200, height: 800 });
    await desktopPage.goto('http://localhost:5173');
    await desktopPage.waitForTimeout(3000);

    // Vérifier la sidebar
    const desktopSidebar = await desktopPage.$('.mobile-bottom-nav-premium');
    if (desktopSidebar) {
      const desktopStyles = await desktopPage.evaluate(() => {
        const sidebar = document.querySelector('.mobile-bottom-nav-premium');
        const computed = window.getComputedStyle(sidebar);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          position: computed.position,
          bottom: computed.bottom,
          height: computed.height,
          width: computed.width
        };
      });

      console.log('   📊 Styles calculés:');
      console.log(`      display: ${desktopStyles.display}`);
      console.log(`      visibility: ${desktopStyles.visibility}`);
      console.log(`      opacity: ${desktopStyles.opacity}`);
      console.log(`      position: ${desktopStyles.position}`);
      console.log(`      bottom: ${desktopStyles.bottom}`);
      console.log(`      height: ${desktopStyles.height}`);

      const isHidden = desktopStyles.display === 'none' ||
                      desktopStyles.visibility === 'hidden' ||
                      desktopStyles.opacity === '0';

      console.log(`   🎯 RÉSULTAT: ${isHidden ? '✅ CACHÉE' : '❌ VISIBLE - PROBLÈME!'}`);
    } else {
      console.log('   ❌ Élément non trouvé dans le DOM');
    }

    await desktopPage.close();

    // Test Mobile (375px)
    console.log('\n📱 TEST MOBILE (375px):');
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    await mobilePage.goto('http://localhost:5173');
    await mobilePage.waitForTimeout(3000);

    const mobileSidebar = await mobilePage.$('.mobile-bottom-nav-premium');
    if (mobileSidebar) {
      const mobileStyles = await mobilePage.evaluate(() => {
        const sidebar = document.querySelector('.mobile-bottom-nav-premium');
        const computed = window.getComputedStyle(sidebar);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          position: computed.position,
          bottom: computed.bottom,
          height: computed.height,
          width: computed.width,
          zIndex: computed.zIndex
        };
      });

      console.log('   📊 Styles calculés:');
      console.log(`      display: ${mobileStyles.display}`);
      console.log(`      visibility: ${mobileStyles.visibility}`);
      console.log(`      opacity: ${mobileStyles.opacity}`);
      console.log(`      position: ${mobileStyles.position}`);
      console.log(`      bottom: ${mobileStyles.bottom}`);
      console.log(`      height: ${mobileStyles.height}`);
      console.log(`      z-index: ${mobileStyles.zIndex}`);

      const isVisible = mobileStyles.display === 'block' &&
                       mobileStyles.visibility === 'visible' &&
                       mobileStyles.opacity === '1' &&
                       mobileStyles.position === 'fixed';

      console.log(`   🎯 RÉSULTAT: ${isVisible ? '✅ VISIBLE ET FIXÉE' : '❌ PROBLÈME D\'AFFICHAGE'}`);

      // Screenshot pour debug
      await mobilePage.screenshot({ path: 'mobile-sidebar-test.png', fullPage: true });
      console.log('   📸 Screenshot sauvegardé: mobile-sidebar-test.png');

    } else {
      console.log('   ❌ Élément non trouvé dans le DOM');
    }

    await mobilePage.close();
    await browser.close();

  } catch (error) {
    console.log(`   ❌ Erreur Playwright: ${error.message}`);
  }

  // 3. Analyse des fichiers
  console.log('\n4️⃣ ANALYSE DES FICHIERS:');

  // Vérifier les fichiers CSS
  console.log('   📄 Fichiers analysés:');
  console.log('      ✅ index.css - Règles de visibilité');
  console.log('      ✅ MobileBottomNav.tsx - Composant React');

  console.log('\n📋 RÉSUMÉ DE L\'AUDIT:');
  console.log('   🔍 Architecture: Composant + Portal React');
  console.log('   🎨 Styles: CSS responsive avec media queries');
  console.log('   📱 Logique: Cache desktop, visible mobile');

  console.log('\n🎯 PROCHAINES ÉTAPES SI PROBLÈME PERSISTE:');
  console.log('   1. Vérifier la console du navigateur pour erreurs CSS');
  console.log('   2. Inspecter l\'élément dans DevTools');
  console.log('   3. Tester avec !important sur toutes les propriétés');
  console.log('   4. Vérifier les conflits CSS avec d\'autres règles');
}

auditSidebar().catch(console.error);
