"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { RecipeCard } from "@/components/RecipeCard";
import { foodImages, tooltipPeople, heroImage } from "@/lib/constants";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

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
            window.scrollTo({ top: 0, behavior: "smooth" });
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

    const scrollToRecipes = () => {
        const element = document.getElementById("recipe-list");
        element?.scrollIntoView({ behavior: "smooth" });
    };

    const [selectedCategory, setSelectedCategory] = useState("All");

    // Filter recipes based on search and category
    const filteredRecipes = recipes.filter((r) => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || r.cuisine === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories from recipes, limit to top 8 to avoid clutter if many
    const categories = ["All", ...Array.from(new Set(recipes.map((r) => r.cuisine))).slice(0, 8)];


    // State for interactions
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<Array<{ user: string, text: string, date: string }>>([
        { user: "ChefGordon", text: "Absolutely stunning dish! The flavors are balanced perfectly.", date: "2 days ago" },
        { user: "FoodieJane", text: "Tried this yesterday, my family loved it! replacing salt with soy sauce worked wonders.", date: "5 days ago" },
    ]);
    const [commentText, setCommentText] = useState("");

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setComments([...comments, { user: "You", text: commentText, date: "Just now" }]);
        setCommentText("");
    };

    const relatedRecipes = selectedRecipe
        ? recipes.filter(r => r.cuisine === selectedRecipe.cuisine && r.id !== selectedRecipe.id).slice(0, 4)
        : [];

    return (
        <main className="min-h-screen bg-neutral-50 font-sans text-gray-800">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleBack}>
                        <div className="bg-orange-500 text-white p-1.5 rounded-lg shadow-orange-200 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent tracking-tight">
                            RecipeMama
                        </span>
                    </div>
                    <div className="flex gap-6 items-center">
                        <button className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">
                            Favorites
                        </button>
                        <button className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors">
                            About
                        </button>
                    </div>
                </div>
            </nav>

            {view === "list" ? (
                <>
                    {/* Enhanced Hero Section */}
                    <section className="pt-28 pb-10 px-6 max-w-7xl mx-auto min-h-[90vh] flex flex-col md:flex-row items-center gap-12 lg:gap-20">

                        {/* Left Column: Text & Search */}
                        <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-700 w-full">
                            <div className="space-y-4">
                                <span className="inline-block py-1.5 px-4 rounded-full bg-orange-50 text-orange-600 text-sm font-bold tracking-wide border border-orange-100">
                                    ✨ #1 Recipe Discovery Platform
                                </span>
                                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                                    Cook Like a <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                                        Master Chef
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                                    Discover thousands of easy-to-follow recipes, save your favorites, and turn every meal into a masterpiece.
                                </p>
                            </div>

                            {/* Prominent Search Bar */}
                            <div className="relative max-w-md w-full group pt-2">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative flex items-center bg-white rounded-full shadow-xl overflow-hidden border border-gray-100 p-1.5">
                                    <div className="pl-4 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search for pasta, burger, etc..."
                                        className="w-full px-4 py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 font-medium h-12 text-lg"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button
                                        onClick={scrollToRecipes}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 rounded-full h-12 font-bold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>

                            {/* Social Proof with AnimatedTooltip */}
                            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                                <div className="flex flex-row items-center justify-center w-full max-w-[200px]">
                                    <AnimatedTooltip items={tooltipPeople} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-lg">10k+ Happy Cooks</span>
                                    <div className="flex text-yellow-500 text-sm">★★★★★</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Visual Single Image */}
                        <div className="flex-1 relative w-full h-[400px] md:h-[600px] animate-in slide-in-from-right duration-700 delay-200 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/heroo.png"
                                    alt="Hero Food"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                    </section>

                    {/* Inspiration Gallery (Parallax moved here) */}
                    <section className="bg-neutral-900 py-20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-50 to-transparent z-10"></div>
                        <div className="max-w-7xl mx-auto px-6 mb-10 text-center relative z-20">
                            <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-2 block">Inspiration</span>
                            <h2 className="text-4xl font-bold text-white mb-4">Visual Feast</h2>
                            <p className="text-neutral-400 max-w-2xl mx-auto">Get inspired by our gallery of mouth-watering dishes crafted by top chefs around the globe.</p>
                        </div>
                        <div className="h-[600px] relative">
                            <ParallaxScroll images={foodImages} className="h-full py-0" />
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent z-10 pointer-events-none" />
                        </div>
                    </section>

                    {/* Recipe List Section */}
                    <section id="recipe-list" className="max-w-7xl mx-auto px-6 py-24 bg-white rounded-t-[60px] shadow-[0_-40px_80px_rgba(0,0,0,0.03)] border-t border-gray-50 mt-10 relative z-30">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                            <div>
                                <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-2 block">Our Collection</span>
                                <h2 className="text-4xl font-bold text-gray-800">Fresh from the Kitchen</h2>
                            </div>
                            <div className="flex-1 md:flex-none flex flex-wrap gap-2 justify-start md:justify-end">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${selectedCategory === category
                                            ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                                            : "bg-white text-gray-500 border-gray-200 hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                    <div key={n} className="flex flex-col gap-3">
                                        <div className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
                                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                                        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                                {filteredRecipes.length > 0 ? (
                                    filteredRecipes.map((recipe) => (
                                        <RecipeCard key={recipe.id} recipe={recipe} onClick={handleRecipeClick} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                        <div className="text-6xl mb-6">🍳</div>
                                        <h3 className="text-xl font-bold text-gray-600 mb-2">No recipes found for "{search}"</h3>
                                        <p className="text-gray-400 mb-6">Try searching for something else like "Chicken", "Pasta" or "Cake"</p>
                                        <button onClick={() => setSearch("")} className="px-6 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                                            Clear Search
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </>
            ) : (
                /* Detail View */
                <section className="pt-24 pb-20 max-w-6xl mx-auto px-6 animate-in zoom-in-95 duration-300">
                    <button
                        onClick={handleBack}
                        className="mb-8 group flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors px-5 py-2.5 rounded-full hover:bg-orange-50 w-fit font-medium bg-white shadow-sm border border-gray-100"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to recipes
                    </button>

                    {selectedRecipe && (
                        <div className="space-y-12">
                            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                                {/* Image Header */}
                                <div className="relative h-[500px] w-full group">
                                    <div role="img" aria-label={selectedRecipe.name}
                                        style={{ backgroundImage: `url(${selectedRecipe.image})` }}
                                        className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                    <div className="absolute top-8 right-8 z-10">
                                        <button
                                            onClick={() => setIsLiked(!isLiked)}
                                            className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all active:scale-95 group/heart"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={isLiked ? "#ef4444" : "none"} stroke={isLiked ? "#ef4444" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 text-white">
                                        <div className="flex flex-wrap gap-3 mb-6 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100">
                                            <span className="px-4 py-1.5 bg-orange-500 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30">
                                                {selectedRecipe.cuisine}
                                            </span>
                                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold border border-white/20">
                                                {selectedRecipe.difficulty}
                                            </span>
                                        </div>
                                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight shadow-black/50 drop-shadow-lg tracking-tight">
                                            {selectedRecipe.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm md:text-base text-gray-100 font-medium animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200">
                                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {selectedRecipe.cookTimeMinutes} Minutes
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                                                <span className="text-yellow-400 text-lg">★</span> {selectedRecipe.rating}
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                                                <span>🔥</span> {selectedRecipe.caloriesPerServing} kcal
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-12 gap-12 p-8 md:p-14">
                                    <div className="md:col-span-4 space-y-8">
                                        <div className="bg-orange-50/50 p-8 rounded-[32px] border border-orange-100">
                                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                                                <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700">🥕</div>
                                                Ingredients
                                            </h3>
                                            <ul className="space-y-4">
                                                {selectedRecipe.ingredients?.map((ing, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                                                        <input type="checkbox" className="mt-1.5 w-5 h-5 rounded-md border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer" />
                                                        <span className="leading-relaxed">{ing}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="md:col-span-8">
                                        <h3 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 text-sm">📝</div>
                                            Cooking Instructions
                                        </h3>
                                        <div className="space-y-8">
                                            {selectedRecipe.instructions?.map((step, i) => (
                                                <div key={i} className="flex gap-6 group p-4 rounded-2xl hover:bg-gray-50 transition-colors items-start">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border-2 border-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all shadow-sm">
                                                        {i + 1}
                                                    </div>
                                                    <div className="pt-2">
                                                        <p className="text-gray-700 text-lg leading-relaxed">{step}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Comments & Discussion */}
                                <div className="bg-gray-50 p-8 md:p-14 border-t border-gray-100">
                                    <h3 className="text-2xl font-bold mb-8 text-gray-900">Community Comments ({comments.length})</h3>
                                    <div className="max-w-3xl space-y-8">
                                        {comments.map((comment, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 shrink-0">
                                                    {comment.user.charAt(0)}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900">{comment.user}</span>
                                                        <span className="text-xs text-gray-500">• {comment.date}</span>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}

                                        <form onSubmit={handlePostComment} className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 shrink-0">Y</div>
                                            <div className="flex-1">
                                                <textarea
                                                    className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 focus:outline-none transition-all resize-none"
                                                    placeholder="Share your thoughts or tips..."
                                                    rows={3}
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                />
                                                <button type="submit" className="mt-2 bg-orange-500 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors">
                                                    Post Comment
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>

                            {/* Related Recipes */}
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold mb-6 text-gray-800">You Might Also Like</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {relatedRecipes.length > 0 ? (
                                        relatedRecipes.map((recipe) => (
                                            <RecipeCard key={recipe.id} recipe={recipe} onClick={handleRecipeClick} />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-10 text-center text-gray-500 italic bg-gray-50 rounded-2xl border border-gray-100">
                                            No similar recipes found in this category.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </section>
            )}
            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-orange-500 text-white p-1.5 rounded-lg shadow-orange-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent tracking-tight">
                                    RecipeMama
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm text-center md:text-left max-w-xs">
                                Discover, cook, and share delicious recipes from around the world. Join our community of happy cooks!
                            </p>
                        </div>
                        <div className="flex gap-8 text-sm font-medium text-gray-600">
                            <a href="#" className="hover:text-orange-500 transition-colors">About Us</a>
                            <a href="#" className="hover:text-orange-500 transition-colors">Careers</a>
                            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                    <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
                        © {new Date().getFullYear()} RecipeMama. All rights reserved. Made with ❤️ by Fikz.
                    </div>
                </div>
            </footer>
        </main>
    );
}
