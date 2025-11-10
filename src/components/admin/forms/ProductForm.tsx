import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

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
  images?: Array<{ id?: string; image_url: string; alt_text?: string }>;
}

interface Category {
  id: string;
  name_en: string;
  name_fr?: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSave, onCancel, isLoading = false }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name_en, name_fr')
          .eq('is_active', true)
          .order('name_en');

        if (error) {
          console.error('Error loading categories:', error);
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const [formData, setFormData] = useState<Product>({
    name_en: product?.name_en || '',
    name_ar: product?.name_ar || '',
    name_fr: product?.name_fr || '',
    description_en: product?.description_en || '',
    description_ar: product?.description_ar || '',
    description_fr: product?.description_fr || '',
    price_dzd: product?.price_dzd || 0,
    sale_price_dzd: product?.sale_price_dzd,
    category_id: product?.category_id || '',
    sku: product?.sku || '',
    product_type: product?.product_type || 'ensemble',
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== undefined ? product.is_active : true,
    images: product?.images || []
  });

  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedImages: Array<{ id?: string; image_url: string; alt_text?: string; display_order: number; is_primary: boolean }> = [];

      for (const [index, file] of Array.from(files).entries()) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        uploadedImages.push({
          image_url: publicUrl,
          alt_text: formData.name_en || 'Product image',
          display_order: (formData.images?.length || 0) + index,
          is_primary: (formData.images?.length || 0) + index === 0 // First image is primary
        });
      }

      // Update form data with new images
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages]
      }));

    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Erreur lors du téléchargement des images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_en, name_fr')
        .eq('is_active', true)
        .order('name_en');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_en.trim()) {
      newErrors.name_en = 'Le nom anglais est requis';
    }

    if (!formData.description_en?.trim()) {
      newErrors.description_en = 'La description anglaise est requise';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'La catégorie est requise';
    }

    if (formData.price_dzd <= 0) {
      newErrors.price_dzd = 'Le prix doit être supérieur à 0';
    }

    if (formData.sale_price_dzd && formData.sale_price_dzd >= formData.price_dzd) {
      newErrors.sale_price_dzd = 'Le prix soldé doit être inférieur au prix normal';
    }

    // Ensure product_type is valid
    const validProductTypes = ['ensemble', 'perfume', 'makeup', 'gift_box'];
    if (!formData.product_type || !validProductTypes.includes(formData.product_type)) {
      newErrors.product_type = 'Le type de produit est invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted with data:', formData);
    console.log('📝 Product type before validation:', formData.product_type);

    if (validateForm()) {
      console.log('✅ Form validation passed, calling onSave');
      onSave(formData);
    } else {
      console.log('❌ Form validation failed');
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes?.includes(sizeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...(prev.sizes || []), sizeInput.trim()]
      }));
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.filter(s => s !== size) || []
    }));
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors?.includes(colorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), colorInput.trim()]
      }));
      setColorInput('');
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.filter(c => c !== color) || []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Modifier le Produit' : 'Nouveau Produit'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom (Anglais) *
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => handleInputChange('name_en', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold ${
                    errors.name_en ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nom du produit en anglais"
                />
                {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom (Français)
                </label>
                <input
                  type="text"
                  value={formData.name_fr || ''}
                  onChange={(e) => handleInputChange('name_fr', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  placeholder="Nom du produit en français"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Anglais) *
              </label>
              <textarea
                value={formData.description_en || ''}
                onChange={(e) => handleInputChange('description_en', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold ${
                  errors.description_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Description détaillée du produit"
              />
              {errors.description_en && <p className="text-red-500 text-sm mt-1">{errors.description_en}</p>}
            </div>

            {/* Prix et catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (DZD) *
                </label>
                <input
                  type="number"
                  value={formData.price_dzd}
                  onChange={(e) => handleInputChange('price_dzd', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold ${
                    errors.price_dzd ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price_dzd && <p className="text-red-500 text-sm mt-1">{errors.price_dzd}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix soldé (DZD)
                </label>
                <input
                  type="number"
                  value={formData.sale_price_dzd || ''}
                  onChange={(e) => handleInputChange('sale_price_dzd', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold ${
                    errors.sale_price_dzd ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Optionnel"
                  step="0.01"
                  min="0"
                />
                {errors.sale_price_dzd && <p className="text-red-500 text-sm mt-1">{errors.sale_price_dzd}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name_en} {category.name_fr && `(${category.name_fr})`}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
              </div>
            </div>

            {/* Type de produit et SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de produit
                </label>
                <select
                  value={formData.product_type}
                  onChange={(e) => handleInputChange('product_type', e.target.value as Product['product_type'])}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold ${
                    errors.product_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="ensemble">Ensemble</option>
                  <option value="perfume">Parfum</option>
                  <option value="makeup">Maquillage</option>
                  <option value="gift_box">Coffret cadeau</option>
                </select>
                {errors.product_type && <p className="text-red-500 text-sm mt-1">{errors.product_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU (Référence)
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  placeholder="Ex: RB-001"
                />
              </div>
            </div>

            {/* Images du produit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du produit
              </label>

              {/* Upload d'images */}
              <div className="mb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>⚠️ Configuration requise :</strong>
                  </p>
                    <div className="text-sm text-yellow-800 space-y-2">
                    <div>
                      <p><strong>📖 GUIDE COMPLET :</strong> Suivez les instructions dans <code>README_FIX.md</code> pour corriger tous les problèmes.</p>
                    </div>
                    <p className="text-xs mt-2 text-green-700 bg-green-50 p-2 rounded border">
                      <strong>✅ Solution inclut :</strong> RLS récursion, admin setup, stockage images
                    </p>
                    <p className="text-xs mt-2 text-red-600">
                      <strong>Important :</strong> Assurez-vous d'être connecté avec l'email admin@anais.com avant de tester.
                    </p>
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      <strong>⚠️ Statut actuel :</strong> Vous n'êtes pas connecté. Connectez-vous d'abord avec admin@anais.com !
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-anais-gold file:text-white hover:file:bg-anais-gold-dark disabled:opacity-50"
                />
                {uploadingImages && (
                  <p className="text-sm text-blue-600 mt-2">Téléchargement en cours...</p>
                )}
              </div>

              {/* Aperçu des images */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || 'Product image'}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tailles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tailles disponibles
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  placeholder="Ajouter une taille (ex: S, M, L)"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2 bg-anais-gold text-white rounded-md hover:bg-anais-gold-dark"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes?.map(size => (
                  <span
                    key={size}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Couleurs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleurs disponibles
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  placeholder="Ajouter une couleur (ex: Rouge, Bleu)"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-anais-gold text-white rounded-md hover:bg-anais-gold-dark"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors?.map(color => (
                  <span
                    key={color}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="rounded border-gray-300 text-anais-gold focus:ring-anais-gold"
                />
                <span className="ml-2 text-sm text-gray-700">Produit vedette</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-anais-gold focus:ring-anais-gold"
                />
                <span className="ml-2 text-sm text-gray-700">Produit actif</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-anais-gold text-white rounded-md hover:bg-anais-gold-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enregistrement...' : (product ? 'Modifier' : 'Créer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
