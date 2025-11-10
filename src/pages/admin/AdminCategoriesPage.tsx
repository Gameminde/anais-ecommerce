import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { CategoryForm } from '../../components/admin/forms/CategoryForm';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name_en: string;
  name_fr?: string;
  name_ar?: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name_en', { ascending: true });

      if (error) throw error;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleSaveCategory = async (categoryData: any) => {
    try {
      setSavingCategory(true);

      const dbCategory = {
        name_en: categoryData.name_en,
        name_ar: categoryData.name_ar || null,
        name_fr: categoryData.name_fr || null,
        slug: categoryData.slug,
        description: categoryData.description || null,
        display_order: categoryData.display_order,
        is_active: categoryData.is_active,
        updated_at: new Date().toISOString()
      };

      if (editingCategory?.id) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(dbCategory)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert(dbCategory);

        if (error) throw error;
      }

      setShowCategoryForm(false);
      setEditingCategory(null);
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Erreur lors de la sauvegarde de la catégorie');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    // Check if category has products
    try {
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId);

      if (countError) throw countError;

      if (count && count > 0) {
        alert(`Impossible de supprimer cette catégorie car elle contient ${count} produit(s).`);
        return;
      }
    } catch (err) {
      console.error('Error checking category products:', err);
      alert('Erreur lors de la vérification des produits');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', categoryId);

      if (error) throw error;

      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error('Error updating category status:', err);
      alert('Erreur lors de la mise à jour du statut de la catégorie');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
          <button
            onClick={handleNewCategory}
            className="bg-anais-gold hover:bg-anais-gold-dark text-white px-4 py-2 rounded-lg font-medium"
          >
            + Nouvelle Catégorie
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anais-gold mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des catégories...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">❌</div>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ordre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créée le
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name_en}
                          </div>
                          {category.name_fr && (
                            <div className="text-sm text-gray-500">
                              FR: {category.name_fr}
                            </div>
                          )}
                          {category.name_ar && (
                            <div className="text-sm text-gray-500">
                              AR: {category.name_ar}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-mono">
                            {category.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {category.display_order}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {formatDate(category.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => toggleCategoryStatus(category.id, category.is_active)}
                              className={`${
                                category.is_active
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {category.is_active ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {categories.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Aucune catégorie trouvée</p>
                  <button
                    onClick={handleNewCategory}
                    className="mt-4 bg-anais-gold hover:bg-anais-gold-dark text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Créer la première catégorie
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Category Form Modal */}
        {showCategoryForm && (
          <CategoryForm
            category={editingCategory}
            onSave={handleSaveCategory}
            onCancel={() => {
              setShowCategoryForm(false);
              setEditingCategory(null);
            }}
            isLoading={savingCategory}
          />
        )}
      </div>
    </AdminLayout>
  );
}

