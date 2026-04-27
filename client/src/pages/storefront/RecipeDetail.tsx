import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Header } from "@/components/storefront/Header";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { getDummyDetail } from "@/lib/productDummyData";
import { useProducts } from "@/hooks/use-products";
import { ChevronLeft, ChefHat, Check, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import iconTotalTimeImg from "@assets/time_(1)_1777284567731.png";
import iconPrepTimeImg from "@assets/cooking-time_1777284757387.png";
import iconCookHatImg from "@assets/chef-hat_1777284777242.png";
import iconServingImg from "@assets/hot-food_(1)_1777284826021.png";

const BRAND_BLUE = "#364F9F";
const BRAND_ORANGE = "#F05B4E";

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

  const stats: { icon: string; label: string; value?: string }[] = [
    { icon: iconTotalTimeImg, label: "Total Time", value: recipe.totalTime },
    { icon: iconPrepTimeImg, label: "Prep Time", value: recipe.prepTime },
    { icon: iconCookHatImg, label: "Cook Time", value: recipe.cookTime },
    { icon: iconServingImg, label: "Servings", value: recipe.servings ? `${recipe.servings} people` : undefined },
  ];

  const recipeKey = title;
  const ingredientCount = recipe.ingredients?.length ?? 0;
  const methodCount = recipe.method?.length ?? 0;

  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState<number>(0);

  // Reset interactive state when recipe changes
  useEffect(() => {
    setCheckedIngredients(new Set());
    setCompletedSteps(new Set());
    setActiveStep(0);
  }, [recipeKey]);

  const toggleIngredient = (i: number) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const toggleStep = (i: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
        // auto-advance the active step indicator
        if (activeStep === i && i + 1 < methodCount) setActiveStep(i + 1);
      }
      return next;
    });
  };

  const ingredientProgress = ingredientCount > 0 ? Math.round((checkedIngredients.size / ingredientCount) * 100) : 0;
  const methodProgress = methodCount > 0 ? Math.round((completedSteps.size / methodCount) * 100) : 0;
  const allIngredientsChecked = ingredientCount > 0 && checkedIngredients.size === ingredientCount;
  const allStepsDone = methodCount > 0 && completedSteps.size === methodCount;

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
            <h1 className="text-2xl sm:text-4xl font-semibold text-black tracking-tight">{title}</h1>
            {recipe.difficulty && <DifficultyBadge difficulty={recipe.difficulty} />}
          </div>
          {recipe.description && (
            <p className="text-black/70 text-base font-light mb-6 leading-relaxed">{recipe.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.filter(s => s.value).map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-shadow hover:shadow-md"
              >
                <img src={icon} alt="" aria-hidden className="w-7 h-7 object-contain" />
                <span className="text-[11px] font-light uppercase tracking-wide text-black/50">{label}</span>
                <span className="text-sm font-medium text-black">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 mb-8" />

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="text-xl font-semibold text-black flex items-center gap-2 tracking-tight">
                <span className="w-1 h-5 rounded-full" style={{ backgroundColor: BRAND_ORANGE }} />
                Ingredients
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-black/60" data-testid="text-ingredients-progress">
                  {checkedIngredients.size}/{ingredientCount}
                </span>
                {checkedIngredients.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setCheckedIngredients(new Set())}
                    className="text-xs font-medium text-[#364F9F] hover:text-[#F05B4E] flex items-center gap-1 transition-colors"
                    data-testid="button-reset-ingredients"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
            </div>
            <Progress
              value={ingredientProgress}
              className="h-1.5 mb-4 bg-slate-100 [&>div]:bg-[#364F9F]"
              data-testid="progress-ingredients"
            />
            {allIngredientsChecked && (
              <p className="mb-3 text-xs font-medium text-[#F05B4E]" data-testid="text-ingredients-ready">
                All set — you're ready to cook!
              </p>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((item, i) => {
                const checked = checkedIngredients.has(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => toggleIngredient(i)}
                      className={`w-full text-left flex items-start gap-3 rounded-xl px-4 py-3 border transition-all ${
                        checked
                          ? "bg-[#364F9F]/5 border-[#364F9F]/40"
                          : "bg-white border-slate-200 hover:border-[#F05B4E]/40"
                      }`}
                      data-testid={`button-ingredient-${i}`}
                      aria-pressed={checked}
                    >
                      <span
                        className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          checked ? "bg-[#364F9F] border-[#364F9F]" : "border-slate-300 bg-white"
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </span>
                      <span
                        className={`text-sm font-light transition-colors ${
                          checked ? "text-black/40 line-through" : "text-black"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {recipe.method && recipe.method.length > 0 && (
          <>
            <div className="w-full h-px bg-slate-100 mb-8" />
            <section className="mb-10">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-black flex items-center gap-2 tracking-tight">
                  <span className="w-1 h-5 rounded-full" style={{ backgroundColor: BRAND_ORANGE }} />
                  Method
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-black/60" data-testid="text-method-progress">
                    {completedSteps.size}/{methodCount}
                  </span>
                  {completedSteps.size > 0 && (
                    <button
                      type="button"
                      onClick={() => { setCompletedSteps(new Set()); setActiveStep(0); }}
                      className="text-xs font-medium text-[#364F9F] hover:text-[#F05B4E] flex items-center gap-1 transition-colors"
                      data-testid="button-reset-method"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>
              </div>
              <Progress
                value={methodProgress}
                className="h-1.5 mb-4 bg-slate-100 [&>div]:bg-[#F05B4E]"
                data-testid="progress-method"
              />
              {allStepsDone && (
                <p className="mb-3 text-xs font-medium text-[#F05B4E]" data-testid="text-method-done">
                  Recipe complete — enjoy your meal!
                </p>
              )}
              <ol className="flex flex-col gap-3">
                {recipe.method.map((step, i) => {
                  const done = completedSteps.has(i);
                  const isActive = !done && i === activeStep;
                  return (
                    <li key={i} className="flex gap-3 items-stretch">
                      <button
                        type="button"
                        onClick={() => toggleStep(i)}
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          done
                            ? "bg-[#364F9F] text-white"
                            : isActive
                              ? "bg-[#F05B4E] text-white ring-4 ring-[#F05B4E]/20"
                              : "bg-white text-black border-2 border-slate-300 hover:border-[#F05B4E]/60"
                        }`}
                        aria-pressed={done}
                        aria-label={done ? `Step ${i + 1} completed` : `Mark step ${i + 1} done`}
                        data-testid={`button-step-${i}`}
                      >
                        {done ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStep(i)}
                        className={`flex-1 text-left rounded-xl px-4 py-3 border transition-all ${
                          done
                            ? "bg-[#364F9F]/5 border-[#364F9F]/30"
                            : isActive
                              ? "bg-white border-[#F05B4E]/50"
                              : "bg-white border-slate-200 hover:border-[#F05B4E]/40"
                        }`}
                        data-testid={`button-step-text-${i}`}
                      >
                        <p className={`text-sm font-light leading-relaxed transition-colors ${done ? "text-black/40 line-through" : "text-black"}`}>
                          {step}
                        </p>
                      </button>
                    </li>
                  );
                })}
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
