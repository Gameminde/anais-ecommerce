import { useState } from 'react';

interface Category {
  id?: string;
  name_en: string;
  name_ar?: string;
  name_fr?: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

interface CategoryFormProps {
  category?: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSave, onCancel, isLoading = false }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    name_en: '',
    name_ar: '',
    name_fr: '',
    slug: '',
    description: '',
    display_order: 0,
    is_active: true,
    ...category
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_en.trim()) {
      newErrors.name_en = 'Le nom anglais est requis';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Le slug est requis';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof Category, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-generate slug from English name
    if (field === 'name_en' && !category?.id) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
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
            {/* Noms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  placeholder="Nom en anglais"
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
                  placeholder="Nom en français"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom (Arabe)
                </label>
                <input
                  type="text"
                  value={formData.name_ar || ''}
                  onChange={(e) => handleInputChange('name_ar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  placeholder="Nom en arabe"
                />
              </div>
            </div>

            {/* Slug et ordre d'affichage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="url-friendly-slug"
                />
                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-anais-gold"
                placeholder="Description de la catégorie"
              />
            </div>

            {/* Options */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="rounded border-gray-300 text-anais-gold focus:ring-anais-gold"
                />
                <span className="ml-2 text-sm text-gray-700">Catégorie active</span>
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
                {isLoading ? 'Enregistrement...' : (category ? 'Modifier' : 'Créer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

