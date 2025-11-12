import { chromium } from 'playwright';

async function testMobileSidebar() {
  console.log('🧪 Test de visibilité de la sidebar mobile...');

  try {
    // Test sur desktop (large screen)
    console.log('📺 Test sur desktop (1200px):');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });

    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    // Vérifier si la sidebar existe et est cachée
    const sidebarDesktop = await page.$('.mobile-bottom-nav-portal');
    if (sidebarDesktop) {
      const isVisibleDesktop = await page.evaluate(() => {
        const sidebar = document.querySelector('.mobile-bottom-nav-portal');
        return window.getComputedStyle(sidebar).display !== 'none' &&
               window.getComputedStyle(sidebar).visibility !== 'hidden' &&
               window.getComputedStyle(sidebar).opacity !== '0';
      });
      console.log(`   Sidebar visible sur desktop: ${isVisibleDesktop ? '❌ OUI (PROBLÈME)' : '✅ NON'}`);
    } else {
      console.log('   Sidebar non trouvée sur desktop: ✅ BON');
    }

    // Test sur mobile (small screen)
    console.log('📱 Test sur mobile (375px):');
    await page.setViewportSize({ width: 375, height: 667 });

    await page.reload();
    await page.waitForTimeout(2000);

    const sidebarMobile = await page.$('.mobile-bottom-nav-portal');
    if (sidebarMobile) {
      const isVisibleMobile = await page.evaluate(() => {
        const sidebar = document.querySelector('.mobile-bottom-nav-portal');
        return window.getComputedStyle(sidebar).display !== 'none' &&
               window.getComputedStyle(sidebar).visibility !== 'hidden' &&
               window.getComputedStyle(sidebar).opacity !== '0';
      });
      console.log(`   Sidebar visible sur mobile: ${isVisibleMobile ? '✅ OUI' : '❌ NON (PROBLÈME)'}`);
    } else {
      console.log('   Sidebar non trouvée sur mobile: ❌ PROBLÈME');
    }

    await browser.close();

    console.log('🎉 Test terminé!');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testMobileSidebar();
