import Image from "next/image";

interface Recipe {
    id: number;
    name: string;
    image: string;
    rating: number;
    cookTimeMinutes: number;
    difficulty: string;
    cuisine: string;
    tags: string[];
}

export function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: (id: number) => void }) {
    return (
        <div
            onClick={() => onClick(recipe.id)}
            className="group relative cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={recipe.image}
                    alt={recipe.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {recipe.cookTimeMinutes} min
                </div>
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">{recipe.cuisine}</span>
                    <div className="flex items-center text-yellow-500 text-xs">
                        ★ {recipe.rating}
                    </div>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1 leading-snug group-hover:text-orange-600 transition-colors">
                    {recipe.name}
                </h3>
                <p className="text-gray-500 text-sm mb-3 capitalize">
                    {recipe.difficulty} difficulty
                </p>
                <div className="flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
