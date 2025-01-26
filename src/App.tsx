import React, { useState } from 'react';
import { Recipe, RecipeFormData, AdminState } from './types';
import { defaultRecipes } from './data/defaultRecipes';
import { RecipeCard } from './components/RecipeCard';
import { RecipeForm } from './components/RecipeForm';
import { RecipeDetail } from './components/RecipeDetail';
import { AdminPanel } from './components/AdminPanel';
import { Plus, Search, Shield, Menu, X, MapPin, Phone, Mail, Sprout, Book, ShoppingBag, ChefHat } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | 'all'>('all');
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: ''
  });
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Recipe filtering logic
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const isVisible = recipe.status === 'approved' || adminState.isAdmin;
    return matchesSearch && matchesCategory && isVisible;
  });

  const pendingRecipes = recipes.filter(recipe => recipe.status === 'pending');

  const handleAddRecipe = (formData: RecipeFormData) => {
    const newRecipe: Recipe = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isCustom: true,
      status: 'pending'
    };
    setRecipes(prev => [...prev, newRecipe]);
    setShowForm(false);
  };

  const handleAdminLogin = (password: string) => {
    if (password === 'admin123') {
      setAdminState({ isAdmin: true, password });
    }
  };

  const handleRecipeAction = (recipeId: string, action: 'approve' | 'reject' | 'delete') => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        if (action === 'delete') {
          return null;
        }
        return {
          ...recipe,
          status: action === 'approve' ? 'approved' : 'rejected'
        };
      }
      return recipe;
    }).filter(Boolean) as Recipe[]);
  };

  const recipeCategories = [
    { id: 'all', label: 'All Recipes', count: filteredRecipes.length },
    { id: 'agar', label: 'Agar Recipes', count: filteredRecipes.filter(r => r.category === 'agar').length },
    { id: 'liquid-culture', label: 'Liquid Culture', count: filteredRecipes.filter(r => r.category === 'liquid-culture').length },
    { id: 'substrate', label: 'Substrate', count: filteredRecipes.filter(r => r.category === 'substrate').length },
    { id: 'other', label: 'Other', count: filteredRecipes.filter(r => r.category === 'other').length }
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Hero Section */}
      {activeSection === 'home' && (
        <section className="relative h-[600px] bg-cover bg-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542827387-4c54ff0b7b0e?auto=format&fit=crop&q=80')"
        }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">MushRoomService</h1>
              <p className="text-xl mb-8">Fresh Mushrooms & Professional Growing Supplies in Edenton, NC</p>
              <button 
                onClick={() => setActiveSection('shop')}
                className="bg-amber-600 text-white px-8 py-3 rounded-md hover:bg-amber-700 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {activeSection === 'home' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Image placeholders for featured products */}
              <ProductCard
                title="Fresh Blue Oyster Mushrooms"
                price={12.99}
                imagePlaceholder="Add product image URL here"
                description="Locally grown, fresh Blue Oyster mushrooms. Available in 1lb packages."
              />
              <ProductCard
                title="Complete Growing Kit"
                price={49.99}
                imagePlaceholder="Add growing kit image URL here"
                description="Everything you need to start growing gourmet mushrooms at home."
              />
              <ProductCard
                title="Premium Spawn Bags"
                price={24.99}
                imagePlaceholder="Add spawn bags image URL here"
                description="Professional-grade spawn bags for mushroom cultivation."
              />
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-amber-900 mb-6">About MushRoomService</h2>
                <p className="text-gray-700 mb-4">
                  Located in the heart of Edenton, North Carolina, MushRoomService is your premier source for fresh gourmet mushrooms and professional cultivation supplies.
                </p>
                <p className="text-gray-700 mb-4">
                  Our state-of-the-art growing facility produces the highest quality mushrooms, while our shop provides everything you need to start your own cultivation journey.
                </p>
                <div className="space-y-4 mt-8">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-amber-600 mr-3" />
                    <span>123 Mushroom Lane, Edenton, NC 27932</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-amber-600 mr-3" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-amber-600 mr-3" />
                    <span>info@mushroomservice.com</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 h-[400px] rounded-lg">
                {/* Placeholder for about page image */}
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Add company image here
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shop Section */}
      {activeSection === 'shop' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-amber-900 mb-8">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-amber-800">Fresh Mushrooms</h3>
                <div className="grid gap-6">
                  <ProductCard
                    title="Blue Oyster Mushrooms"
                    price={12.99}
                    imagePlaceholder="Add product image URL here"
                    description="Fresh, locally grown Blue Oyster mushrooms"
                  />
                  <ProductCard
                    title="Lion's Mane Mushrooms"
                    price={15.99}
                    imagePlaceholder="Add product image URL here"
                    description="Fresh, locally grown Lion's Mane mushrooms"
                  />
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-amber-800">Growing Supplies</h3>
                <div className="grid gap-6">
                  <ProductCard
                    title="Sterilized Grain Spawn"
                    price={24.99}
                    imagePlaceholder="Add product image URL here"
                    description="Professional grade grain spawn bags"
                  />
                  <ProductCard
                    title="Substrate Blocks"
                    price={19.99}
                    imagePlaceholder="Add product image URL here"
                    description="Ready-to-fruit substrate blocks"
                  />
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-amber-800">Equipment</h3>
                <div className="grid gap-6">
                  <ProductCard
                    title="Flow Hood"
                    price={599.99}
                    imagePlaceholder="Add product image URL here"
                    description="Professional laminar flow hood"
                  />
                  <ProductCard
                    title="Pressure Cooker"
                    price={299.99}
                    imagePlaceholder="Add product image URL here"
                    description="23qt Pressure cooker for sterilization"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recipes Section */}
      {activeSection === 'recipes' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-amber-900">Cultivation Recipes</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Recipe
                </button>
                {adminState.isAdmin && (
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Admin Panel
                    {pendingRecipes.length > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {pendingRecipes.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {recipeCategories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id as Recipe['category'] | 'all')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-amber-700 text-white'
                            : 'hover:bg-amber-100 text-amber-900'
                        }`}
                      >
                        <span>{category.label}</span>
                        <span className="float-right bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-md border-amber-200 shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => setSelectedRecipe(recipe)}
                      isAdmin={adminState.isAdmin}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Submit New Recipe</h2>
            <RecipeForm
              onSubmit={handleAddRecipe}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <RecipeDetail
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            isAdmin={adminState.isAdmin}
          />
        </div>
      )}

      {showAdminPanel && adminState.isAdmin && (
        <AdminPanel
          recipes={pendingRecipes}
          onClose={() => setShowAdminPanel(false)}
          onAction={handleRecipeAction}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;