import https from 'https';

// Test script to check if the deployed site is working
function testSite(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          html: data.substring(0, 500) // First 500 chars for inspection
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  console.log('🔍 Testing ANAIS E-commerce Site Functionality...\n');

  const baseUrl = 'https://master--anais-ecommerce.netlify.app';

  try {
    // Test homepage
    console.log('📄 Testing homepage...');
    const homeResult = await testSite(baseUrl);
    console.log(`✅ Homepage: ${homeResult.status === 200 ? 'OK' : 'FAILED'} (Status: ${homeResult.status})`);

    // Check if HTML contains expected content
    const hasTitle = homeResult.html.includes('ANAIS');
    const hasScripts = homeResult.html.includes('assets/index-');
    console.log(`📋 Content check: Title=${hasTitle}, Scripts=${hasScripts}`);

    // Test admin page
    console.log('\n📊 Testing admin page...');
    const adminResult = await testSite(`${baseUrl}/admin`);
    console.log(`✅ Admin page: ${adminResult.status === 200 ? 'OK' : 'FAILED'} (Status: ${adminResult.status})`);

    // Test assets
    console.log('\n🎨 Testing main JS asset...');
    const jsResult = await testSite(`${baseUrl}/assets/index-BMVC-vxT.js`);
    console.log(`✅ Main JS: ${jsResult.status === 200 ? 'OK' : 'FAILED'} (Size: ${jsResult.headers['content-length']} bytes)`);

    // Test CSS
    console.log('\n💅 Testing main CSS asset...');
    const cssResult = await testSite(`${baseUrl}/assets/index-Df2dWome.css`);
    console.log(`✅ Main CSS: ${cssResult.status === 200 ? 'OK' : 'FAILED'} (Size: ${cssResult.headers['content-length']} bytes)`);

    console.log('\n🎉 All tests completed!');
    console.log('\n💡 If the site appears broken in browser:');
    console.log('   1. Clear browser cache (Ctrl+F5)');
    console.log('   2. Try incognito mode');
    console.log('   3. Check browser console for JavaScript errors');
    console.log('   4. Verify internet connection');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
