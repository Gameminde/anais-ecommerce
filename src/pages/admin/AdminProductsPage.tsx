import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProductForm } from '../../components/admin/forms/ProductForm';
import { supabase } from '../../lib/supabase';

interface Product {
  id?: string;
  name_en: string;
  name_ar?: string;
  name_fr?: string;
  description_en?: string;
  description_ar?: string;
  description_fr?: string;
  price_dzd: number;
  sale_price_dzd?: number;
  category_id: string;
  sku?: string;
  product_type: 'ensemble' | 'perfume' | 'makeup' | 'gift_box';
  sizes?: string[];
  colors?: string[];
  is_featured: boolean;
  is_active: boolean;
  images?: any[];
  product_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
  created_at?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Modal states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [categoriesMap, setCategoriesMap] = useState<Map<string, any>>(new Map());

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use separate queries to avoid join issues
      // First get products
      let productsQuery = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit - 1);

      // Apply filters
      if (searchTerm) {
        productsQuery = productsQuery.or(`name_en.ilike.%${searchTerm}%,description_en.ilike.%${searchTerm}%`);
      }

      if (showActiveOnly !== null) {
        productsQuery = productsQuery.eq('is_active', showActiveOnly);
      }

      const { data: productsData, error: productsError, count } = await productsQuery;

      if (productsError) throw productsError;

      // Then get categories for the products that have category_id
      const categoryIds = productsData?.map(p => p.category_id).filter(id => id) || [];
      let newCategoriesMap = new Map();

      if (categoryIds.length > 0) {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name_en, name_fr, name_ar')
          .in('id', categoryIds);

        if (!categoriesError && categoriesData) {
          newCategoriesMap = new Map(categoriesData.map(cat => [cat.id, cat]));
        }
      }

      setCategoriesMap(newCategoriesMap);

      // Transform data
      const transformedProducts = productsData?.map(product => ({
        ...product,
        category: newCategoriesMap.get(product.category_id)?.name_en ||
                  newCategoriesMap.get(product.category_id)?.name_fr || 'N/A'
      })) || [];

      setProducts(transformedProducts);
      setPagination(prev => ({
        ...prev,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pagination.limit)
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, showActiveOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) throw error;

      // Refresh products
      fetchProducts();
    } catch (err) {
      console.error('Error updating product status:', err);
      alert('Erreur lors de la mise à jour du statut du produit');
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = async (product: Product) => {
    try {
      // Load product images
      const { data: images, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('display_order');

      if (error) {
        console.error('Error loading product images:', error);
      }

      // Add images to product data
      const productWithImages = {
        ...product,
        images: images || []
      };

      setEditingProduct(productWithImages);
      setShowProductForm(true);
    } catch (error) {
      console.error('Error preparing product for edit:', error);
      setEditingProduct(product); // Fallback without images
      setShowProductForm(true);
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      setSavingProduct(true);

      console.log('🔍 Product data received:', productData);
      console.log('🔍 Product type value:', productData.product_type);

        // Validate product_type - force string conversion and validation
        const validProductTypes = ['ensemble', 'perfume', 'makeup', 'gift_box'];
        let productType = String(productData.product_type || '').trim();

        // Ensure it's a valid type
        if (!validProductTypes.includes(productType)) {
          productType = 'ensemble'; // Default fallback
          console.warn('⚠️ Invalid product_type, using default:', productType);
        }

      console.log('✅ Validated product type:', productType, 'typeof:', typeof productType);
      console.log('📋 Final product data for DB:', {
        name_en: productData.name_en,
        category_id: productData.category_id,
        product_type: productType,
        price_dzd: productData.price_dzd,
      });

      // Convert form data to database format
      const dbProduct = {
        name_en: productData.name_en,
        name_ar: productData.name_ar || null,
        name_fr: productData.name_fr || null,
        description_en: productData.description_en || null,
        description_ar: productData.description_ar || null,
        description_fr: productData.description_fr || null,
        price_dzd: productData.price_dzd,
        sale_price_dzd: productData.sale_price_dzd || null,
        category_id: productData.category_id,
        sku: productData.sku || null,
        product_type: productType,
        sizes: productData.sizes || null,
        colors: productData.colors || null,
        is_featured: productData.is_featured,
        is_active: productData.is_active,
        updated_at: new Date().toISOString()
      };

      let productId = editingProduct?.id;

      if (editingProduct?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(dbProduct)
          .eq('id', editingProduct.id);

        if (error) throw error;

        // Handle images for existing product
        if (productData.images && productData.images.length > 0) {
          // First, delete existing images
          const { error: deleteError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', editingProduct.id);

          if (deleteError) {
            console.error('Error deleting existing images:', deleteError);
          }

          // Then insert new images
          const imageInserts = productData.images.map((image: any) => ({
            product_id: editingProduct.id,
            image_url: image.image_url,
            alt_text: image.alt_text || null,
            display_order: image.display_order || 0,
            is_primary: image.is_primary || false
          }));

          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(imageInserts);

          if (imagesError) {
            console.error('Error updating product images:', imagesError);
          }
        }
      } else {
        // Create new product - TEMPORARY: Try without RLS to test
        console.log('🗃️ Attempting to insert product:', dbProduct);

        // First try with normal client
        let { data, error } = await supabase
          .from('products')
          .insert(dbProduct)
          .select('id')
          .single();

        console.log('🗃️ Insert result with normal client:', { data, error });

        // If RLS error, try with service role (temporary test)
        if (error && error.code === '42501') {
          console.log('🔐 RLS policy blocking insert, this confirms the issue');
        }

        if (error) throw error;
        productId = data.id;

        // Handle images for new product
        if (productData.images && productData.images.length > 0 && productId) {
          const imageInserts = productData.images.map((image: any) => ({
            product_id: productId,
            image_url: image.image_url,
            alt_text: image.alt_text || null,
            display_order: image.display_order || 0,
            is_primary: image.is_primary || false
          }));

          const { error: imagesError } = await supabase
            .from('product_images')
            .insert(imageInserts);

          if (imagesError) {
            console.error('Error saving product images:', imagesError);
            // Don't throw here, product is already created
          }
        }
      }

      setShowProductForm(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Erreur lors de la sauvegarde du produit');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          is_active: !product.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;

      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error toggling product active status:', err);
      alert('Erreur lors de la modification du statut du produit');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-charcoal">Gestion des Produits</h1>
          <button
            onClick={handleNewProduct}
            className="bg-anais-gold hover:bg-anais-gold-dark text-white px-8 py-4 rounded-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 border-2 border-anais-gold hover:border-anais-gold-dark"
          >
            <span className="text-xl">+</span>
            <span className="text-lg">Nouveau Produit</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Nom du produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-anais-gold"
              />
            </div>
            {/* TODO: Add category filtering back when categories are properly loaded */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                <option value="">Filtrage par catégorie (bientôt disponible)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={showActiveOnly.toString()}
                onChange={(e) => setShowActiveOnly(e.target.value === 'true')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-anais-gold"
              >
                <option value="true">Actifs uniquement</option>
                <option value="false">Tous les produits</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowActiveOnly(true);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-gold mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">❌</div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              {/* Mobile Products View - Cards */}
              <div className="block md:hidden">
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            {product.product_images && product.product_images.length > 0 ? (
                              <img
                                src={product.product_images.find(img => img.is_primary)?.image_url ||
                                     product.product_images[0]?.image_url}
                                alt={product.name_en}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">📦</span>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {product.name_en}
                              </h3>
                              <p className="text-xs text-gray-500 truncate">
                                {product.sku && `SKU: ${product.sku}`}
                              </p>
                              <p className="text-sm font-bold text-gray-900 mt-1">
                                {new Intl.NumberFormat('fr-DZ', {
                                  style: 'currency',
                                  currency: 'DZD'
                                }).format(product.price_dzd)}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2 ml-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.is_active ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 min-h-[40px] inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => handleToggleActive(product)}
                              className={`flex-1 min-h-[40px] inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                                product.is_active
                                  ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                                  : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                              }`}
                            >
                              {product.is_active ? '🚫 Désactiver' : '✅ Activer'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Products View - Table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-charcoal">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-100 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={product.images[0].image_url}
                                  alt={product.name_en}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">📦</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-semibold text-charcoal">
                                {product.name_en}
                              </div>
                              <div className="text-sm text-warm-gray">
                                Créé le {formatDate(product.created_at)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-charcoal bg-warm-greige px-3 py-1 rounded-full">
                            {categoriesMap.get(product.category_id)?.name_en || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-success-green">
                            {formatCurrency(product.price_dzd)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-info-blue bg-desert-sand px-3 py-1 rounded-full">
                            Stock: N/A
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                            product.is_active
                              ? 'bg-success-green text-white'
                              : 'bg-alert-rose text-white'
                          }`}>
                            {product.is_active ? '✓ Actif' : '✗ Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="bg-anais-gold hover:bg-anais-gold-dark text-white px-3 py-1 rounded-md font-medium transition-colors"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => toggleProductStatus(product.id, product.is_active)}
                              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                                product.is_active
                                  ? 'bg-alert-rose hover:bg-red-700 text-white'
                                  : 'bg-success-green hover:bg-green-700 text-white'
                              }`}
                            >
                              {product.is_active ? '🚫 Désactiver' : '✅ Activer'}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-deep-plum hover:bg-red-800 text-white px-3 py-1 rounded-md font-medium transition-colors"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de{' '}
                        <span className="font-medium">
                          {(pagination.page - 1) * pagination.limit + 1}
                        </span>{' '}
                        à{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        sur{' '}
                        <span className="font-medium">{pagination.total}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          ‹
                        </button>
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, pagination.page - 2) + i;
                          if (pageNum > pagination.totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === pagination.page
                                  ? 'z-10 bg-anais-gold border-anais-gold text-white'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          ›
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          isLoading={savingProduct}
        />
      )}
    </AdminLayout>
  );
}
