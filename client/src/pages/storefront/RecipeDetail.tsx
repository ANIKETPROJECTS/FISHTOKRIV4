import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/storefront/Header";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { getDummyDetail } from "@/lib/productDummyData";
import { useProducts } from "@/hooks/use-products";
import { ChevronLeft, ChefHat, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import iconTotalTimeImg from "@assets/time_(1)_1777284567731.png";
import iconPrepTimeImg from "@assets/cooking-time_1777284757387.png";
import iconCookHatImg from "@assets/chef-hat_1777284777242.png";
import iconServingImg from "@assets/hot-food_(1)_1777284826021.png";

const BRAND_BLUE = "#364F9F";
const BRAND_ORANGE = "#F05B4E";

function MaskedIcon({ src, color = BRAND_BLUE, size = 24 }: { src: string; color?: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  if (!difficulty) return null;
  return (
    <span
      className="text-xs font-medium px-3 py-1 rounded-full text-white"
      style={{ backgroundColor: BRAND_BLUE }}
    >
      {difficulty}
    </span>
  );
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

  const stats: { icon: string; color: string; label: string; value?: string }[] = [
    { icon: iconTotalTimeImg, color: BRAND_BLUE, label: "Total Time", value: recipe.totalTime },
    { icon: iconPrepTimeImg, color: BRAND_ORANGE, label: "Prep Time", value: recipe.prepTime },
    { icon: iconCookHatImg, color: BRAND_BLUE, label: "Cook Time", value: recipe.cookTime },
    { icon: iconServingImg, color: BRAND_ORANGE, label: "Servings", value: recipe.servings ? `${recipe.servings} people` : undefined },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-light text-slate-500 hover:text-[#364F9F] mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to product
        </button>

        {/* Hero image */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-md mb-8 bg-white border border-slate-100 flex items-center justify-center">
          {recipe.image ? (
            <img src={recipe.image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <ChefHat className="w-16 h-16 text-slate-200" />
          )}
        </div>

        {/* Title + stats */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-2xl sm:text-4xl font-semibold text-[#364F9F] tracking-tight">{title}</h1>
            {recipe.difficulty && <DifficultyBadge difficulty={recipe.difficulty} />}
          </div>
          {recipe.description && (
            <p className="text-slate-500 text-base font-light mb-6 leading-relaxed">{recipe.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.filter(s => s.value).map(({ icon, color, label, value }) => (
              <div
                key={label}
                className="bg-white border rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-shadow hover:shadow-md"
                style={{ borderColor: `${color}33` }}
              >
                <MaskedIcon src={icon} color={color} size={28} />
                <span className="text-[11px] font-light uppercase tracking-wide text-slate-400">{label}</span>
                <span className="text-sm font-medium text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 mb-8" />

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#364F9F] mb-4 flex items-center gap-2 tracking-tight">
              <span className="w-1 h-5 rounded-full" style={{ backgroundColor: BRAND_ORANGE }} />
              Ingredients
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 hover:border-[#364F9F]/30 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: BRAND_ORANGE }} />
                  <span className="text-sm font-light text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.method && recipe.method.length > 0 && (
          <>
            <div className="w-full h-px bg-slate-100 mb-8" />
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-[#364F9F] mb-4 flex items-center gap-2 tracking-tight">
                <span className="w-1 h-5 rounded-full" style={{ backgroundColor: BRAND_ORANGE }} />
                Method
              </h2>
              <ol className="flex flex-col gap-4">
                {recipe.method.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div
                      className="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold"
                      style={{ backgroundColor: BRAND_BLUE }}
                    >
                      {i + 1}
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex-1">
                      <p className="text-sm font-light text-slate-700 leading-relaxed">{step}</p>
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
            <h2 className="text-xl font-semibold text-[#364F9F] mb-4 flex items-center gap-2 tracking-tight">
              <span className="w-1 h-5 rounded-full" style={{ backgroundColor: BRAND_ORANGE }} />
              More Recipes
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x">
              {otherRecipes.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectRecipe(idx)}
                  className="min-w-[220px] snap-start bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-[#364F9F]/40 hover:shadow-md transition-all"
                >
                  <div className="w-full h-32 bg-white flex items-center justify-center overflow-hidden">
                    {r.image ? (
                      <img src={r.image} alt={r.title || r.name} className="w-full h-full object-cover" />
                    ) : (
                      <ChefHat className="w-8 h-8 text-slate-200" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm text-slate-800 line-clamp-1">{r.title || r.name}</p>
                    <p className="text-xs font-light text-slate-500 mt-1 line-clamp-2">{r.description}</p>
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
