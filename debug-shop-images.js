// Debug script pour ShopPage images
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zvyhuqkyeyzkjdvafdkx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyOTc0NzUsImV4cCI6MjA3Nzg3MzQ3NX0.6B9KC7Q5h4f9q3r9x8F7p2M5nL8jK9mN4pR6tV3wX1z'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugShopPage() {
  console.log('🐛 DEBUG SHOP PAGE IMAGES\n')

  try {
    // 1. Simuler exactement ce que fait ShopPage
    console.log('1. Fetching products...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('❌ Error fetching products:', productsError)
      return
    }

    console.log(`✅ Found ${productsData?.length || 0} products`)

    if (productsData && productsData.length > 0) {
      // 2. Récupérer les images comme le fait ShopPage
      console.log('\n2. Fetching images for products...')
      const productIds = productsData.map(p => p.id)
      const { data: imagesData, error: imagesError } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('display_order')

      if (imagesError) {
        console.error('❌ Error fetching images:', imagesError)
      } else {
        console.log(`✅ Found ${imagesData?.length || 0} images`)
      }

      // 3. Combiner comme le fait ShopPage
      console.log('\n3. Combining products with images...')
      const productsWithImages = productsData.map(product => {
        const productImages = imagesData?.filter(img => img.product_id === product.id) || []
        return {
          ...product,
          product_images: productImages
        }
      })

      // 4. Analyser chaque produit
      console.log('\n4. Analysis of each product:')
      productsWithImages.forEach((product, i) => {
        const hasImages = product.product_images && product.product_images.length > 0
        const primaryImage = product.product_images?.find(img => img.is_primary)
        const firstImage = product.product_images?.[0]

        console.log(`\n📦 Product ${i+1}: ${product.name_en}`)
        console.log(`   ID: ${product.id}`)
        console.log(`   Has image_url column: ${product.image_url ? '✅' : '❌'}`)
        console.log(`   Has product_images: ${hasImages ? `✅ (${product.product_images.length})` : '❌'}`)

        if (primaryImage) {
          console.log(`   Primary image URL: ${primaryImage.image_url.substring(0, 60)}...`)
        }

        if (firstImage) {
          console.log(`   First image URL: ${firstImage.image_url.substring(0, 60)}...`)
        }

        // Simuler ce que fait OptimizedImage dans ShopPage
        const imageSrc = product.product_images?.find(img => img.is_primary)?.image_url || product.product_images?.[0]?.image_url
        console.log(`   Image src that would be used: ${imageSrc ? imageSrc.substring(0, 60) + '...' : '❌ NULL'}`)
      })

      console.log('\n🎯 CONCLUSION:')
      console.log('   If images don\'t show, the problem is in the frontend rendering')
      console.log('   If image URLs are present, the problem is in OptimizedImage component')

    } else {
      console.log('❌ No products found')
    }

  } catch (error) {
    console.error('💥 Exception:', error)
  }
}

debugShopPage()
