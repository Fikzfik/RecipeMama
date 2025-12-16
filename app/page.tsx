"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { RecipeCard } from "@/components/RecipeCard";

// Types
interface Recipe {
  id: number;
  name: string;
  image: string;
  rating: number;
  cookTimeMinutes: number;
  difficulty: string;
  cuisine: string;
  tags: string[];
  ingredients?: string[];
  instructions?: string[];
  caloriesPerServing?: number;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [view, setView] = useState<"list" | "detail">("list");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch initial recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/recipes?limit=12");
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeClick = async (id: number) => {
    setLoading(true);
    try {
      // Fetch full detail for the specific recipe
      const response = await axios.get(`https://dummyjson.com/recipes/${id}`);
      setSelectedRecipe(response.data);
      setView("detail");
    } catch (error) {
      console.error("Error fetching recipe detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView("list");
    setSelectedRecipe(null);
  };

  // Filter recipes based on search
  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const images = [
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&auto=format&fit=crop&w=3387&q=80",
    "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3070&q=80",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80",
    "https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80",
    "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80",
    "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80",
    "https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2640&q=80",
    "https://images.unsplash.com/photo-1554080353-a576cf803bda?ixlib=rb-4.0.3&auto=format&fit=crop&w=3387&q=80",
    "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3070&q=80",
  ];

  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent cursor-pointer" onClick={handleBack}>
            Food Recipe Explorer
          </div>
          <div className="flex gap-4 items-center">
            {view === "list" && (
              <input
                type="text"
                placeholder="Search recipes..."
                className="bg-gray-100 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            )}
            <button className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
              About
            </button>
          </div>
        </div>
      </nav>

      {view === "list" ? (
        <>
          {/* Hero Section with Parallax */}
          <section className="pt-20 pb-10">
            <h1 className="text-center text-4xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
              Delicious Discoveries
            </h1>
            <p className="text-center text-gray-500 mb-8 max-w-xl mx-auto">
              Explore the finest recipes from around the world.
            </p>
            <div className="h-[500px] overflow-hidden relative border-y border-gray-100 bg-white">
              <ParallaxScroll images={images} className="h-full py-0" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent z-10" />
            </div>
          </section>

          {/* Recipe List Section */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Latest Recipes</h2>
              <span className="text-sm text-gray-500">{filteredRecipes.length} recipes found</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} onClick={handleRecipeClick} />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        /* Detail View */
        <section className="pt-24 pb-20 max-w-5xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors"
          >
            ← Back to recipes
          </button>

          {selectedRecipe && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative h-[400px] w-full">
                <div role="img" aria-label={selectedRecipe.name}
                  style={{ backgroundImage: `url(${selectedRecipe.image})` }}
                  className="w-full h-full bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-orange-500 rounded-full text-xs font-bold uppercase tracking-wide">
                      {selectedRecipe.cuisine}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/20">
                      {selectedRecipe.difficulty}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{selectedRecipe.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-200">
                    <span>⏱ {selectedRecipe.cookTimeMinutes} mins</span>
                    <span>★ {selectedRecipe.rating} ({selectedRecipe.caloriesPerServing} kcal)</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-12 p-8 md:p-12">
                <div className="md:col-span-1 border-r border-gray-100 pr-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                    Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients?.map((ing, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                        <span className="leading-relaxed">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold mb-6 text-gray-800">Instructions</h3>
                  <div className="space-y-8">
                    {selectedRecipe.instructions?.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </div>
                        <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
