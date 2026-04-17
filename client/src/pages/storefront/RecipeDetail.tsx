import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/storefront/Header";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { getDummyDetail } from "@/lib/productDummyData";
import { useProducts } from "@/hooks/use-products";
import { ChevronLeft, Clock, Users, ChefHat, Flame, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  if (!difficulty) return null;
  const color =
    difficulty === "Easy" ? "bg-green-100 text-green-700" :
    difficulty === "Hard" ? "bg-red-100 text-red-700" :
    "bg-yellow-100 text-yellow-700";
  return <span className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>{difficulty}</span>;
}

function RecipeDetailView({
  recipe,
  onBack,
  otherRecipes,
  onSelectRecipe,
}: {
  recipe: {
    title?: string; name?: string; description?: string; image?: string;
    totalTime?: string; prepTime?: string; cookTime?: string;
    servings?: number; difficulty?: string;
    ingredients?: string[]; method?: string[];
  };
  onBack: () => void;
  otherRecipes: { title?: string; name?: string; description?: string; image?: string }[];
  onSelectRecipe: (idx: number) => void;
}) {
  const title = recipe.title || recipe.name || "Recipe";

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to product
        </button>

        {/* Hero image */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg mb-8 bg-muted/20 flex items-center justify-center">
          {recipe.image ? (
            <img src={recipe.image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <ChefHat className="w-16 h-16 text-muted-foreground/30" />
          )}
        </div>

        {/* Title + stats */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-3">{title}</h1>
          {recipe.description && (
            <p className="text-muted-foreground text-base mb-5 leading-relaxed">{recipe.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Clock className="w-5 h-5 text-accent" />, label: "Total Time", value: recipe.totalTime },
              { icon: <Flame className="w-5 h-5 text-orange-500" />, label: "Prep Time", value: recipe.prepTime },
              { icon: <ChefHat className="w-5 h-5 text-primary" />, label: "Cook Time", value: recipe.cookTime },
              { icon: <Users className="w-5 h-5 text-blue-500" />, label: "Servings", value: recipe.servings ? `${recipe.servings} people` : undefined },
            ].filter(s => s.value).map(({ icon, label, value }) => (
              <div key={label} className="bg-muted/30 border border-border/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                {icon}
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-bold text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {recipe.difficulty && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Difficulty:</span>
              <DifficultyBadge difficulty={recipe.difficulty} />
            </div>
          )}
        </div>

        <div className="w-full h-px bg-border/40 mb-8" />

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">🧂</span> Ingredients
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-muted/20 border border-border/20 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.method && recipe.method.length > 0 && (
          <>
            <div className="w-full h-px bg-border/40 mb-8" />
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">👨‍🍳</span> Method
              </h2>
              <ol className="flex flex-col gap-5">
                {recipe.method.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="bg-muted/20 border border-border/20 rounded-xl px-4 py-3 flex-1">
                      <p className="text-sm text-foreground leading-relaxed">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}

        {/* More recipes */}
        {otherRecipes.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="text-2xl">🍴</span> More Recipes
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x">
              {otherRecipes.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectRecipe(idx)}
                  className="min-w-[220px] snap-start bg-card border border-border/30 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-full h-32 bg-muted/20 flex items-center justify-center overflow-hidden">
                    {r.image ? (
                      <img src={r.image} alt={r.title || r.name} className="w-full h-full object-cover" />
                    ) : (
                      <ChefHat className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-foreground line-clamp-1">{r.title || r.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <CartDrawer />
    </div>
  );
}

export default function RecipeDetail() {
  const [, productParams] = useRoute("/recipe/product/:productId/:recipeIndex");
  const [, categoryParams] = useRoute("/recipe/:category/:index");
  const [, setLocation] = useLocation();

  const { data: products, isLoading } = useProducts();

  // ── Product-based route ──
  if (productParams) {
    const productId = productParams.productId;
    const recipeIndex = Number(productParams.recipeIndex ?? 0);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="w-full aspect-video rounded-3xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
          <CartDrawer />
        </div>
      );
    }

    const product = products?.find(p => p.id === productId);
    const recipes = product?.recipes ?? [];
    const recipe = recipes[recipeIndex];

    if (!product || !recipe) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Recipe not found.</p>
          </div>
          <CartDrawer />
        </div>
      );
    }

    const otherRecipes = recipes.filter((_, i) => i !== recipeIndex);
    const otherOriginalIndices = recipes
      .map((r, i) => ({ r, i }))
      .filter(({ i }) => i !== recipeIndex);

    return (
      <RecipeDetailView
        recipe={recipe}
        onBack={() => setLocation(`/product/${productId}`)}
        otherRecipes={otherRecipes}
        onSelectRecipe={(filteredIdx) => {
          const originalIdx = otherOriginalIndices[filteredIdx]?.i ?? 0;
          setLocation(`/recipe/product/${productId}/${originalIdx}`);
        }}
      />
    );
  }

  // ── Category-based route (old dummy data) ──
  const category = decodeURIComponent(categoryParams?.category ?? "Fish");
  const index = Number(categoryParams?.index ?? 0);
  const dummy = getDummyDetail(category);
  const recipe = dummy.recipes[index];

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Recipe not found.</p>
        </div>
        <CartDrawer />
      </div>
    );
  }

  const otherDummy = dummy.recipes.filter((_, idx) => idx !== index);

  return (
    <RecipeDetailView
      recipe={{ ...recipe, title: recipe.name }}
      onBack={() => history.back()}
      otherRecipes={otherDummy}
      onSelectRecipe={(filteredIdx) => {
        const original = dummy.recipes.find(x => x.name === otherDummy[filteredIdx]?.name);
        const originalIdx = dummy.recipes.indexOf(original!);
        setLocation(`/recipe/${encodeURIComponent(category)}/${originalIdx}`);
      }}
    />
  );
}
