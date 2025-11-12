import { chromium } from 'playwright';

async function testSidebarFix() {
  console.log('🧪 Test final de la sidebar mobile...\n');

  const browser = await chromium.launch();

  try {
    // Test Desktop (1200px)
    console.log('📺 Test DESKTOP (1200px):');
    const desktopPage = await browser.newPage();
    await desktopPage.setViewportSize({ width: 1200, height: 800 });

    await desktopPage.goto('http://localhost:5173');
    await desktopPage.waitForTimeout(3000);

    const sidebarDesktop = await desktopPage.$('.mobile-bottom-nav-portal');
    if (sidebarDesktop) {
      const desktopStyles = await desktopPage.evaluate(() => {
        const sidebar = document.querySelector('.mobile-bottom-nav-portal');
        const computed = window.getComputedStyle(sidebar);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity
        };
      });

      console.log(`   Display: ${desktopStyles.display}`);
      console.log(`   Visibility: ${desktopStyles.visibility}`);
      console.log(`   Opacity: ${desktopStyles.opacity}`);

      const isHidden = desktopStyles.display === 'none' ||
                      desktopStyles.visibility === 'hidden' ||
                      desktopStyles.opacity === '0';

      console.log(`   ✅ Caché sur desktop: ${isHidden ? 'OUI' : 'NON - PROBLÈME!'}`);
    } else {
      console.log('   ❌ Sidebar non trouvée');
    }

    await desktopPage.close();

    console.log('\n📱 Test MOBILE (375px):');
    const mobilePage = await browser.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });

    await mobilePage.goto('http://localhost:5173');
    await mobilePage.waitForTimeout(3000);

    const sidebarMobile = await mobilePage.$('.mobile-bottom-nav-portal');
    if (sidebarMobile) {
      const mobileStyles = await mobilePage.evaluate(() => {
        const sidebar = document.querySelector('.mobile-bottom-nav-portal');
        const computed = window.getComputedStyle(sidebar);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          position: computed.position,
          bottom: computed.bottom,
          height: computed.height
        };
      });

      console.log(`   Display: ${mobileStyles.display}`);
      console.log(`   Visibility: ${mobileStyles.visibility}`);
      console.log(`   Opacity: ${mobileStyles.opacity}`);
      console.log(`   Position: ${mobileStyles.position}`);
      console.log(`   Bottom: ${mobileStyles.bottom}`);
      console.log(`   Height: ${mobileStyles.height}`);

      const isVisible = mobileStyles.display === 'block' &&
                       mobileStyles.visibility === 'visible' &&
                       mobileStyles.opacity === '1' &&
                       mobileStyles.position === 'fixed';

      console.log(`   ✅ Visible sur mobile: ${isVisible ? 'OUI' : 'NON - PROBLÈME!'}`);
    } else {
      console.log('   ❌ Sidebar non trouvée');
    }

    await mobilePage.close();

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await browser.close();
  }

  console.log('\n🎉 Test terminé!');
}

testSidebarFix();
