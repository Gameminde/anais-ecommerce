import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    // Get image info
    const metadata = await sharp(inputPath).metadata();

    // Optimize based on image type and size
    let pipeline = sharp(inputPath);

    if (metadata.width > 1200) {
      pipeline = pipeline.resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Compress based on format
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      pipeline = pipeline.jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true
      });
    } else if (metadata.format === 'png') {
      pipeline = pipeline.png({
        compressionLevel: 9,
        quality: 85
      });
    }

    await pipeline.toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${reduction}% reduction)`);

  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeAllImages() {
  try {
    const files = fs.readdirSync(inputDir);

    console.log('🚀 Starting image optimization...\n');

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);

        await optimizeImage(inputPath, outputPath);

        // Also create WebP version
        const webpOutputPath = path.join(outputDir, file.replace(ext, '.webp'));
        try {
          await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(webpOutputPath);
          console.log(`🖼️  WebP created: ${path.basename(webpOutputPath)}`);
        } catch (webpError) {
          console.warn(`⚠️  Could not create WebP for ${file}`);
        }
      }
    }

    console.log('\n🎉 Image optimization completed!');
    console.log(`📁 Optimized images saved to: ${outputDir}`);
    console.log('\n💡 Next steps:');
    console.log('1. Replace images in public/images/ with optimized versions');
    console.log('2. Update image references to use .webp when possible');
    console.log('3. Consider using a CDN for better performance');

  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

// Run optimization
optimizeAllImages();
