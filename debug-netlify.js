// Script de debug pour Netlify
console.log('=== DEBUG NETLIFY BUILD ===');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Vérifier les fichiers avant build
const fs = require('fs');
const path = require('path');

function listFiles(dir, prefix = '') {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${prefix}${file}/`);
        listFiles(fullPath, prefix + '  ');
      } else {
        console.log(`${prefix}${file} (${stat.size} bytes)`);
      }
    });
  } catch (error) {
    console.log(`${prefix}ERROR reading ${dir}: ${error.message}`);
  }
}

console.log('\n=== FICHIERS AVANT BUILD ===');
listFiles('.');

console.log('\n=== VARIABLES ENV ===');
console.log('CI:', process.env.CI);
console.log('BRANCH:', process.env.BRANCH);
console.log('HEAD:', process.env.HEAD);

console.log('\n=== VÉRIFICATION PACKAGE.JSON ===');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('Build script:', pkg.scripts?.build);
  console.log('Dependencies count:', Object.keys(pkg.dependencies || {}).length);
} catch (error) {
  console.log('ERROR reading package.json:', error.message);
}

console.log('\n=== DEBUG TERMINÉ ===');
