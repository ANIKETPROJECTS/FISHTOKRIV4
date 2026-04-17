export interface RecipeDetail {
  name: string;
  description: string;
  image: string;
  totalTime: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  method: string[];
}

export interface ProductDummyDetail {
  description: string;
  pieces: string;
  serves: string;
  discountPct: number;
  coupons: { code: string; desc: string; color: string }[];
  nutrition: { label: string; value: string; icon: string }[];
  recipes: RecipeDetail[];
}

const COUPONS = [
  { code: "FRESH10", desc: "10% off on your first order", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { code: "SAVE15", desc: "15% off on orders above ₹500", color: "bg-green-50 border-green-200 text-green-700" },
  { code: "TOKRI20", desc: "20% off for FishTokri members", color: "bg-blue-50 border-blue-200 text-blue-700" },
];

export const CATEGORY_DUMMY: Record<string, ProductDummyDetail> = {
  Fish: {
    description:
      "Freshly sourced from the Arabian Sea, this premium fish is cleaned and dressed by our expert handlers. Rich in Omega-3 fatty acids and high-quality protein, it's perfect for curries, fries, or grills. Delivered fresh to your doorstep every morning.",
    pieces: "2–3 Pieces",
    serves: "Serves 3",
    discountPct: 10,
    coupons: COUPONS,
    nutrition: [
      { label: "Calories", value: "150 kcal", icon: "🔥" },
      { label: "Protein", value: "26 g", icon: "💪" },
      { label: "Fat", value: "4 g", icon: "🫒" },
      { label: "Carbs", value: "0 g", icon: "🌾" },
      { label: "Omega-3", value: "1.8 g", icon: "🐟" },
      { label: "Sodium", value: "80 mg", icon: "🧂" },
    ],
    recipes: [
      {
        name: "Malvani Fish Curry",
        description: "A fiery coastal curry bursting with coconut and whole spices — the soul of the Konkan coast.",
        image: "https://picsum.photos/seed/malvani-fish/600/400",
        totalTime: "45 min", prepTime: "15 min", cookTime: "30 min", servings: 4, difficulty: "Medium",
        ingredients: ["500g fish fillets", "1 cup grated coconut", "2 onions (sliced)", "3 tbsp Malvani masala", "2 tomatoes (chopped)", "6 dried red chillies", "1 tsp turmeric", "2 tbsp oil", "Salt to taste", "Coriander leaves"],
        method: ["Grind coconut and red chillies into a smooth paste.", "Heat oil; sauté onions until golden brown.", "Add tomatoes and cook until soft.", "Stir in Malvani masala and turmeric; cook 2 minutes.", "Pour in coconut paste and 1.5 cups water; bring to a boil.", "Add fish pieces and simmer 15 minutes until cooked through.", "Garnish with coriander and serve hot with rice."],
      },
      {
        name: "Crispy Fish Fry",
        description: "Golden, crunchy fish coated in a spiced semolina crust — ready in 20 minutes.",
        image: "https://picsum.photos/seed/crispy-fish/600/400",
        totalTime: "25 min", prepTime: "10 min", cookTime: "15 min", servings: 3, difficulty: "Easy",
        ingredients: ["4 fish steaks", "3 tbsp rava (semolina)", "1 tbsp rice flour", "1 tsp red chilli powder", "1 tsp turmeric", "1 tsp ginger-garlic paste", "1 tbsp lemon juice", "Salt to taste", "Oil for shallow frying"],
        method: ["Marinate fish with chilli, turmeric, ginger-garlic paste, lemon juice, and salt for 20 minutes.", "Mix rava and rice flour on a plate.", "Coat each fish piece thoroughly in the rava mixture.", "Heat oil in a pan over medium-high heat.", "Fry fish 3–4 minutes per side until golden and crispy.", "Drain on paper towels and serve hot with lime wedges."],
      },
      {
        name: "Fish Koliwada",
        description: "Juicy batter-fried fish in the iconic Mumbai Koliwada style with carom and chaat masala.",
        image: "https://picsum.photos/seed/koliwada-fish/600/400",
        totalTime: "30 min", prepTime: "15 min", cookTime: "15 min", servings: 3, difficulty: "Easy",
        ingredients: ["400g boneless fish", "4 tbsp gram flour (besan)", "2 tbsp rice flour", "1 tsp ajwain (carom seeds)", "1 tsp red chilli powder", "½ tsp turmeric", "1 tbsp ginger-garlic paste", "Chaat masala to sprinkle", "Oil for deep frying"],
        method: ["Make a smooth batter with besan, rice flour, ajwain, chilli, turmeric, and ginger-garlic paste.", "Dip fish pieces in batter ensuring full coverage.", "Heat oil to 180°C.", "Deep fry fish in batches for 4–5 minutes until golden.", "Remove and sprinkle with chaat masala.", "Serve with green chutney and sliced onions."],
      },
      {
        name: "Steamed Fish with Ginger",
        description: "Light and healthy steamed fish infused with ginger, garlic, and soy for a clean, delicate flavour.",
        image: "https://picsum.photos/seed/steamed-fish/600/400",
        totalTime: "30 min", prepTime: "10 min", cookTime: "20 min", servings: 2, difficulty: "Easy",
        ingredients: ["2 whole fish (cleaned)", "2 tbsp soy sauce", "1 tbsp sesame oil", "2-inch ginger (julienned)", "4 garlic cloves (sliced)", "2 spring onions", "1 red chilli (sliced)", "Coriander to garnish"],
        method: ["Score the fish with 3 diagonal cuts on each side.", "Rub with soy sauce inside and out.", "Place ginger and garlic inside the fish cavity.", "Steam over boiling water for 15–18 minutes.", "Heat sesame oil until smoking; pour over fish.", "Garnish with spring onions, chilli, and coriander."],
      },
      {
        name: "Fish Biryani",
        description: "Fragrant basmati rice layered with spiced fish, saffron, and fried onions in a traditional dum style.",
        image: "https://picsum.photos/seed/fish-biryani/600/400",
        totalTime: "75 min", prepTime: "25 min", cookTime: "50 min", servings: 5, difficulty: "Hard",
        ingredients: ["500g fish fillets", "2 cups basmati rice", "2 onions (thinly sliced)", "½ cup yoghurt", "2 tbsp biryani masala", "Saffron in warm milk", "Mint leaves", "Ghee", "Whole spices (bay leaf, cardamom, cloves)", "Salt"],
        method: ["Marinate fish in yoghurt and biryani masala for 30 minutes.", "Parboil rice with whole spices until 70% done.", "Fry onions until golden-brown.", "Layer marinated fish at the bottom of a heavy pot.", "Add a layer of partially cooked rice.", "Drizzle saffron milk and ghee; top with fried onions and mint.", "Seal pot and cook on dum (low heat) for 25 minutes.", "Gently fluff and serve."],
      },
      {
        name: "Fish Soup",
        description: "A hearty, warming broth packed with vegetables and tender fish — perfect for a light meal.",
        image: "https://picsum.photos/seed/fish-soup/600/400",
        totalTime: "35 min", prepTime: "10 min", cookTime: "25 min", servings: 4, difficulty: "Easy",
        ingredients: ["300g fish pieces", "1 carrot (diced)", "1 potato (cubed)", "2 tomatoes", "1 onion", "4 garlic cloves", "1 tsp black pepper", "1 tsp cumin", "Parsley", "2 tbsp olive oil", "Salt"],
        method: ["Sauté onion and garlic in olive oil until softened.", "Add tomatoes, carrots, and potato; cook 5 minutes.", "Pour in 4 cups water; bring to a boil.", "Add fish pieces and all spices.", "Simmer 15 minutes until vegetables are tender.", "Taste and adjust seasoning.", "Garnish with fresh parsley and serve hot."],
      },
      {
        name: "Tandoori Fish",
        description: "Smoky, charred fish marinated in tandoori spices and yoghurt — a grill-master classic.",
        image: "https://picsum.photos/seed/tandoori-fish/600/400",
        totalTime: "50 min", prepTime: "30 min", cookTime: "20 min", servings: 3, difficulty: "Medium",
        ingredients: ["500g fish steaks", "½ cup thick yoghurt", "2 tbsp tandoori masala", "1 tbsp lemon juice", "1 tsp red food colour (optional)", "Ginger-garlic paste", "Oil for basting", "Chaat masala", "Lemon wedges"],
        method: ["Mix yoghurt, tandoori masala, ginger-garlic paste, lemon juice, and colour.", "Marinate fish in this mixture for at least 30 minutes.", "Preheat grill or oven to 220°C.", "Place fish on a greased rack; baste with oil.", "Grill 8–10 minutes per side, basting regularly.", "Sprinkle chaat masala and serve with mint chutney."],
      },
      {
        name: "Fish Tikka",
        description: "Smoky, spiced fish morsels grilled on skewers — a perfect appetiser or starter.",
        image: "https://picsum.photos/seed/fish-tikka/600/400",
        totalTime: "40 min", prepTime: "20 min", cookTime: "20 min", servings: 3, difficulty: "Medium",
        ingredients: ["400g boneless fish cubes", "½ cup yoghurt", "1 tbsp tikka masala", "1 tsp cumin", "1 tsp coriander powder", "Capsicum and onion cubes", "2 tbsp mustard oil", "Lemon juice", "Salt"],
        method: ["Marinate fish in yoghurt, tikka masala, cumin, coriander, mustard oil, and lemon.", "Thread fish, capsicum, and onion alternately on skewers.", "Preheat grill to high heat.", "Grill skewers for 5–6 minutes each side, turning once.", "Baste with butter during cooking.", "Serve with coriander chutney and onion rings."],
      },
    ],
  },

  Prawns: {
    description:
      "Hand-picked and deveined Tiger Prawns from certified coastal farms. Juicy, tender and versatile — perfect for starters, mains, and biryanis. Each batch is quality-checked for freshness before delivery.",
    pieces: "20–25 Pieces",
    serves: "Serves 3",
    discountPct: 12,
    coupons: COUPONS,
    nutrition: [
      { label: "Calories", value: "99 kcal", icon: "🔥" },
      { label: "Protein", value: "24 g", icon: "💪" },
      { label: "Fat", value: "0.3 g", icon: "🫒" },
      { label: "Carbs", value: "0.2 g", icon: "🌾" },
      { label: "Iodine", value: "35 mcg", icon: "🌊" },
      { label: "Sodium", value: "111 mg", icon: "🧂" },
    ],
    recipes: [
      {
        name: "Prawn Masala Curry",
        description: "A rich, coconut-based prawn curry with warming spices — made for steamed rice.",
        image: "https://picsum.photos/seed/prawn-masala/600/400",
        totalTime: "35 min", prepTime: "10 min", cookTime: "25 min", servings: 4, difficulty: "Medium",
        ingredients: ["500g prawns (cleaned)", "1 cup coconut milk", "2 onions", "2 tomatoes", "3 green chillies", "2 tbsp prawn masala", "Curry leaves", "1 tbsp oil", "Salt", "Coriander"],
        method: ["Heat oil; sauté onions and curry leaves until golden.", "Add tomatoes and green chillies; cook until mushy.", "Stir in prawn masala and cook for 2 minutes.", "Add prawns and toss to coat in the masala.", "Pour in coconut milk; simmer 10 minutes.", "Garnish with coriander and serve with rice."],
      },
      {
        name: "Garlic Butter Prawns",
        description: "Pan-seared prawns drenched in garlic butter and herbs — ready in just 15 minutes.",
        image: "https://picsum.photos/seed/garlic-prawns/600/400",
        totalTime: "15 min", prepTime: "5 min", cookTime: "10 min", servings: 2, difficulty: "Easy",
        ingredients: ["300g large prawns", "4 tbsp butter", "6 garlic cloves (minced)", "1 tsp chilli flakes", "Parsley", "Lemon juice", "Salt and pepper"],
        method: ["Melt butter in a large pan over medium heat.", "Add garlic and sauté until fragrant (1 minute).", "Add prawns in a single layer; season with salt and chilli flakes.", "Cook 2 minutes each side until pink.", "Squeeze lemon juice over prawns.", "Toss with parsley and serve immediately."],
      },
      {
        name: "Prawn Biryani",
        description: "Fragrant saffron rice layered with spiced prawns and crispy fried onions — a true celebration dish.",
        image: "https://picsum.photos/seed/prawn-biryani/600/400",
        totalTime: "70 min", prepTime: "20 min", cookTime: "50 min", servings: 5, difficulty: "Hard",
        ingredients: ["500g prawns", "2 cups basmati rice", "2 onions (fried)", "½ cup yoghurt", "2 tbsp biryani masala", "Saffron milk", "Mint", "Ghee", "Whole spices"],
        method: ["Marinate prawns in yoghurt and biryani masala for 30 minutes.", "Parboil rice with whole spices till 70% done.", "Layer prawns at the bottom of pot.", "Cover with rice, saffron milk, mint, and fried onions.", "Seal with foil and cook on dum 20 minutes.", "Rest 5 minutes before serving."],
      },
      {
        name: "Koliwada Prawns",
        description: "Mumbai street-style batter-fried prawns with ajwain and chaat masala — an irresistible snack.",
        image: "https://picsum.photos/seed/koliwada-prawn/600/400",
        totalTime: "25 min", prepTime: "10 min", cookTime: "15 min", servings: 3, difficulty: "Easy",
        ingredients: ["300g medium prawns", "5 tbsp besan", "2 tbsp rice flour", "1 tsp ajwain", "1 tsp chilli powder", "½ tsp turmeric", "Ginger-garlic paste", "Chaat masala", "Oil for frying"],
        method: ["Make thick batter with besan, rice flour, ajwain, chilli, turmeric, and ginger-garlic paste.", "Coat prawns well in batter.", "Deep fry in hot oil for 3–4 minutes until golden.", "Drain and sprinkle with chaat masala.", "Serve with mint chutney."],
      },
      {
        name: "Prawn Fried Rice",
        description: "Wok-tossed prawn fried rice with egg, vegetables, and soy sauce for a quick weeknight meal.",
        image: "https://picsum.photos/seed/prawn-rice/600/400",
        totalTime: "25 min", prepTime: "10 min", cookTime: "15 min", servings: 3, difficulty: "Easy",
        ingredients: ["200g prawns", "2 cups cooked rice (cold)", "2 eggs", "Spring onions", "2 tbsp soy sauce", "1 tsp sesame oil", "Carrot and peas", "Garlic", "Ginger", "Oil"],
        method: ["Heat oil in wok over high heat; scramble eggs and set aside.", "Stir-fry garlic and ginger until fragrant.", "Add prawns; cook until pink (2 minutes).", "Add vegetables; stir-fry 2 minutes.", "Add cold rice and break up lumps.", "Pour soy sauce and sesame oil; toss vigorously.", "Fold in eggs and spring onions; serve hot."],
      },
      {
        name: "Prawn Pasta",
        description: "Creamy garlic prawn pasta with white wine, cream, and fresh herbs — restaurant-quality at home.",
        image: "https://picsum.photos/seed/prawn-pasta/600/400",
        totalTime: "30 min", prepTime: "10 min", cookTime: "20 min", servings: 2, difficulty: "Medium",
        ingredients: ["200g prawns", "200g spaghetti", "½ cup heavy cream", "¼ cup white wine", "4 garlic cloves", "Parmesan", "Basil", "Butter", "Chilli flakes", "Salt and pepper"],
        method: ["Cook pasta until al dente; reserve ½ cup pasta water.", "Sauté garlic in butter; add prawns and cook 2 minutes.", "Deglaze with white wine; reduce by half.", "Pour in cream and simmer until thickened.", "Toss pasta in sauce adding pasta water to loosen.", "Serve with Parmesan, basil, and chilli flakes."],
      },
      {
        name: "Prawn Soup",
        description: "A warming Tom Yum-inspired prawn soup with lemongrass, galangal, and kaffir lime.",
        image: "https://picsum.photos/seed/prawn-soup/600/400",
        totalTime: "30 min", prepTime: "10 min", cookTime: "20 min", servings: 4, difficulty: "Medium",
        ingredients: ["300g prawns", "4 cups stock", "2 lemongrass stalks", "Galangal slices", "4 kaffir lime leaves", "Mushrooms", "2 tbsp fish sauce", "Lime juice", "Coriander", "Red chillies"],
        method: ["Simmer stock with lemongrass, galangal, and kaffir lime for 10 minutes.", "Add mushrooms and cook 5 minutes.", "Add prawns; cook until pink (3 minutes).", "Season with fish sauce and lime juice.", "Taste and balance sweet, sour, salty.", "Serve in bowls topped with coriander and chilli."],
      },
    ],
  },

  Chicken: {
    description:
      "Farm-fresh antibiotic-free chicken, processed under hygienic conditions and cut to your preferred size. High in lean protein, low in fat — ideal for everyday meals. Pre-cleaned and ready to cook.",
    pieces: "2–4 Pieces",
    serves: "Serves 4",
    discountPct: 15,
    coupons: COUPONS,
    nutrition: [
      { label: "Calories", value: "165 kcal", icon: "🔥" },
      { label: "Protein", value: "31 g", icon: "💪" },
      { label: "Fat", value: "3.6 g", icon: "🫒" },
      { label: "Carbs", value: "0 g", icon: "🌾" },
      { label: "Iron", value: "1 mg", icon: "⚡" },
      { label: "Sodium", value: "74 mg", icon: "🧂" },
    ],
    recipes: [
      {
        name: "Butter Chicken",
        description: "The iconic creamy tomato gravy with tender chicken — silky, rich, and deeply satisfying.",
        image: "https://picsum.photos/seed/butter-chicken/600/400",
        totalTime: "50 min", prepTime: "20 min", cookTime: "30 min", servings: 4, difficulty: "Medium",
        ingredients: ["500g chicken (cubed)", "½ cup butter", "1 cup tomato purée", "½ cup heavy cream", "2 tsp garam masala", "1 tbsp honey", "Ginger-garlic paste", "Kasuri methi", "Salt"],
        method: ["Marinate chicken in yoghurt and spices; cook in oven at 200°C for 20 minutes.", "Melt butter; add ginger-garlic paste and cook 1 minute.", "Pour in tomato purée; cook 10 minutes.", "Add cream, garam masala, honey, and kasuri methi.", "Add cooked chicken; simmer 10 minutes.", "Serve with naan or rice."],
      },
      {
        name: "Chicken Biryani",
        description: "Dum-cooked basmati rice with spiced chicken, saffron, and caramelised onions — a festive classic.",
        image: "https://picsum.photos/seed/chicken-biryani/600/400",
        totalTime: "80 min", prepTime: "30 min", cookTime: "50 min", servings: 5, difficulty: "Hard",
        ingredients: ["750g chicken", "3 cups basmati rice", "3 onions (fried)", "1 cup yoghurt", "3 tbsp biryani masala", "Saffron milk", "Mint", "Ghee", "Whole spices"],
        method: ["Marinate chicken in yoghurt and biryani masala for 1 hour.", "Parboil rice with whole spices.", "Layer chicken at the bottom of a heavy pot.", "Cover with rice, saffron milk, mint, and fried onions.", "Seal and cook on dum for 30 minutes.", "Serve with raita."],
      },
      {
        name: "Tandoori Chicken",
        description: "Smoky, charred chicken marinated overnight in spiced yoghurt and cooked in a fiery tandoor.",
        image: "https://picsum.photos/seed/tandoori-chicken/600/400",
        totalTime: "60 min", prepTime: "40 min", cookTime: "20 min", servings: 4, difficulty: "Medium",
        ingredients: ["1 whole chicken (cut)", "1 cup yoghurt", "3 tbsp tandoori masala", "1 tbsp lemon juice", "Ginger-garlic paste", "Red food colour (optional)", "Oil", "Chaat masala"],
        method: ["Score chicken deeply; marinate in all ingredients for minimum 4 hours.", "Preheat grill to 220°C.", "Grill chicken, basting with oil, 10 minutes per side.", "Ensure internal temperature reaches 75°C.", "Sprinkle chaat masala; serve with coriander chutney."],
      },
      {
        name: "Chicken Curry",
        description: "A homestyle onion-tomato chicken curry — fragrant, spiced, and made for Sunday lunches.",
        image: "https://picsum.photos/seed/chicken-curry/600/400",
        totalTime: "45 min", prepTime: "15 min", cookTime: "30 min", servings: 4, difficulty: "Easy",
        ingredients: ["500g chicken", "3 onions", "3 tomatoes", "2 tsp garam masala", "1 tsp turmeric", "1 tsp chilli", "Ginger-garlic paste", "Coriander", "Oil", "Salt"],
        method: ["Fry onions until deep brown.", "Add ginger-garlic paste; cook 1 minute.", "Add tomatoes; cook until oil separates.", "Add all spices; stir 1 minute.", "Add chicken; sear on high heat 5 minutes.", "Add water; cover and simmer 25 minutes.", "Garnish with coriander."],
      },
      {
        name: "Chicken 65",
        description: "Spicy, deep-fried chicken bites with curry leaves and green chillies — a legendary Indian starter.",
        image: "https://picsum.photos/seed/chicken65/600/400",
        totalTime: "35 min", prepTime: "20 min", cookTime: "15 min", servings: 3, difficulty: "Medium",
        ingredients: ["400g boneless chicken", "2 tbsp cornflour", "1 egg", "2 tsp chilli powder", "1 tsp garam masala", "Curry leaves", "3 green chillies", "Red colour (optional)", "Lemon juice", "Oil"],
        method: ["Marinate chicken with all spices, cornflour, egg, and lemon juice for 20 minutes.", "Deep fry in hot oil until crisp and cooked through.", "In a separate pan, sauté curry leaves and slit green chillies in 1 tsp oil.", "Toss fried chicken in this tempering.", "Serve hot as a starter."],
      },
      {
        name: "Chicken Keema",
        description: "Spiced minced chicken with peas and fresh herbs — great as a filling or standalone dry curry.",
        image: "https://picsum.photos/seed/chicken-keema/600/400",
        totalTime: "30 min", prepTime: "10 min", cookTime: "20 min", servings: 4, difficulty: "Easy",
        ingredients: ["400g chicken mince", "1 cup green peas", "2 onions", "3 tomatoes", "2 tsp keema masala", "Ginger-garlic paste", "Coriander", "Green chillies", "Oil"],
        method: ["Sauté onions until golden.", "Add ginger-garlic paste and green chillies.", "Add tomatoes; cook until dry.", "Add keema; cook on high heat breaking lumps.", "Add peas; cook 10 minutes.", "Finish with keema masala and coriander.", "Serve with pav or roti."],
      },
      {
        name: "Grilled Lemon Herb Chicken",
        description: "Juicy grilled chicken infused with lemon zest, garlic, and Mediterranean herbs.",
        image: "https://picsum.photos/seed/lemon-chicken/600/400",
        totalTime: "40 min", prepTime: "20 min", cookTime: "20 min", servings: 4, difficulty: "Easy",
        ingredients: ["4 chicken breasts", "Juice and zest of 2 lemons", "4 garlic cloves (minced)", "2 tbsp olive oil", "1 tsp dried oregano", "1 tsp thyme", "1 tsp rosemary", "Salt and pepper"],
        method: ["Combine lemon juice, zest, garlic, olive oil, and herbs.", "Marinate chicken at least 30 minutes.", "Preheat grill or pan to medium-high.", "Cook chicken 6–7 minutes per side until done.", "Rest 5 minutes before slicing.", "Serve with salad and crusty bread."],
      },
    ],
  },

  Mutton: {
    description:
      "Premium cuts from locally sourced free-range goats, aged and butchered by skilled craftsmen. Rich, flavourful meat that delivers restaurant-quality results at home. Ideal for slow-cooked curries and biryanis.",
    pieces: "6–8 Pieces",
    serves: "Serves 4",
    discountPct: 8,
    coupons: COUPONS,
    nutrition: [
      { label: "Calories", value: "258 kcal", icon: "🔥" },
      { label: "Protein", value: "25 g", icon: "💪" },
      { label: "Fat", value: "17 g", icon: "🫒" },
      { label: "Carbs", value: "0 g", icon: "🌾" },
      { label: "Iron", value: "2.7 mg", icon: "⚡" },
      { label: "Sodium", value: "72 mg", icon: "🧂" },
    ],
    recipes: [
      {
        name: "Mutton Rogan Josh",
        description: "A Kashmiri slow-cooked mutton curry with whole spices and Kashmiri chilli — deeply aromatic.",
        image: "https://picsum.photos/seed/rogan-josh/600/400",
        totalTime: "80 min", prepTime: "20 min", cookTime: "60 min", servings: 5, difficulty: "Hard",
        ingredients: ["750g mutton", "1 cup yoghurt", "4 Kashmiri dried chillies", "2 tbsp Rogan Josh masala", "1 tsp fennel powder", "Whole spices", "Ghee", "Onion paste", "Asafoetida"],
        method: ["Sear mutton in ghee on high heat until browned all over.", "Add asafoetida and whole spices; cook 1 minute.", "Add Kashmiri chillies and onion paste; cook 10 minutes.", "Whisk yoghurt with masala; add to pan.", "Cook stirring until oil separates.", "Add water; pressure cook 25 minutes.", "Finish with fennel powder and serve."],
      },
      {
        name: "Mutton Biryani",
        description: "The crown jewel of Indian cuisine — dum-cooked mutton biryani with caramelised onions.",
        image: "https://picsum.photos/seed/mutton-biryani/600/400",
        totalTime: "100 min", prepTime: "30 min", cookTime: "70 min", servings: 6, difficulty: "Hard",
        ingredients: ["750g mutton", "3 cups basmati rice", "3 onions (fried)", "1 cup yoghurt", "3 tbsp biryani masala", "Saffron milk", "Mint", "Ghee", "Whole spices", "Kewra water"],
        method: ["Marinate mutton for 2 hours in yoghurt and masala.", "Parboil rice till 60% done.", "Cook marinated mutton with fried onions until tender.", "Layer mutton gravy and rice alternately.", "Drizzle saffron milk, kewra, ghee, mint on top.", "Seal and cook on dum for 30 minutes.", "Serve with raita and salad."],
      },
      {
        name: "Mutton Keema Pav",
        description: "Street-style minced mutton tossed with spices and served with buttered bread rolls.",
        image: "https://picsum.photos/seed/keema-pav/600/400",
        totalTime: "45 min", prepTime: "15 min", cookTime: "30 min", servings: 4, difficulty: "Medium",
        ingredients: ["400g mutton mince", "2 onions", "3 tomatoes", "1 cup peas", "2 tsp keema masala", "1 tsp garam masala", "Ginger-garlic paste", "Butter", "Pav bread", "Coriander"],
        method: ["Heat oil; sauté onions until golden.", "Add ginger-garlic paste; cook 1 minute.", "Add mutton mince; cook on high until browned.", "Add tomatoes and all spices; cook 10 minutes.", "Add peas; simmer 10 minutes.", "Toast pav with butter.", "Serve keema in a bowl with pav alongside."],
      },
      {
        name: "Paya Soup",
        description: "A slow-cooked trotters soup, rich in collagen and spices — an old-world restorative recipe.",
        image: "https://picsum.photos/seed/paya-soup/600/400",
        totalTime: "150 min", prepTime: "20 min", cookTime: "130 min", servings: 4, difficulty: "Medium",
        ingredients: ["4 paya (trotters)", "3 onions", "4 tomatoes", "3 tbsp paya masala", "1 tsp turmeric", "Ginger-garlic paste", "Whole spices", "Coriander", "Lemon", "Oil"],
        method: ["Clean paya thoroughly and blanch in boiling water.", "Heat oil; brown onions deeply.", "Add ginger-garlic paste and whole spices.", "Add paya; sear on high heat.", "Add tomatoes and masala; cook 5 minutes.", "Add 6 cups water; pressure cook 60–90 minutes until paya is soft.", "Serve with naan and lemon."],
      },
      {
        name: "Mutton Korma",
        description: "Mughlai-style mutton in a creamy cashew and yoghurt gravy — mildly spiced and indulgent.",
        image: "https://picsum.photos/seed/mutton-korma/600/400",
        totalTime: "70 min", prepTime: "20 min", cookTime: "50 min", servings: 4, difficulty: "Medium",
        ingredients: ["500g mutton", "½ cup cashew paste", "1 cup yoghurt", "2 onions", "2 tsp korma masala", "Rose water", "Saffron", "Cream", "Ghee", "Whole spices"],
        method: ["Brown onions in ghee; blend into a smooth paste.", "Marinate mutton in yoghurt and korma masala.", "Cook mutton with onion paste until browned.", "Add cashew paste and 1 cup water.", "Simmer 30–40 minutes until tender.", "Finish with cream, rose water, and saffron.", "Serve with rumali roti."],
      },
      {
        name: "Seekh Kebab",
        description: "Juicy minced mutton seekh kebabs grilled on skewers with fresh herbs and green chillies.",
        image: "https://picsum.photos/seed/seekh-kebab/600/400",
        totalTime: "40 min", prepTime: "20 min", cookTime: "20 min", servings: 4, difficulty: "Medium",
        ingredients: ["400g mutton mince", "1 onion (grated)", "3 green chillies", "1 tsp garam masala", "Coriander and mint leaves", "1 tsp cumin", "2 tbsp raw papaya paste", "Salt", "Oil for basting"],
        method: ["Mix mince with all ingredients; knead well.", "Refrigerate for 30 minutes to firm up.", "Mould around flat skewers in cylindrical shapes.", "Grill over charcoal or in oven at 220°C.", "Turn and baste with oil every 5 minutes.", "Cook 15–18 minutes until charred at edges.", "Serve with mint chutney and sliced onions."],
      },
      {
        name: "Mutton Stew",
        description: "A gentle, coconut milk mutton stew with vegetables — the Kerala heirloom recipe.",
        image: "https://picsum.photos/seed/mutton-stew/600/400",
        totalTime: "60 min", prepTime: "15 min", cookTime: "45 min", servings: 4, difficulty: "Easy",
        ingredients: ["500g mutton", "400ml coconut milk", "Potatoes", "Carrots", "2 onions", "Green chillies", "Ginger", "Whole spices", "Coconut oil", "Curry leaves"],
        method: ["Cook mutton with onion, ginger, spices, and water until tender.", "Add potato and carrot pieces; cook 10 minutes.", "Pour in coconut milk; simmer gently (do not boil).", "Temper coconut oil with curry leaves and whole spices.", "Pour tempering over stew.", "Serve with appam or idiyappam."],
      },
    ],
  },

  Masalas: {
    description:
      "Authentic hand-ground masala blends crafted from the finest whole spices. No artificial colours, preservatives or fillers — just pure flavour in every pinch. Formulated by our in-house chef to complement FishTokri's premium seafood.",
    pieces: "1 Pack",
    serves: "Serves 8",
    discountPct: 5,
    coupons: COUPONS.slice(0, 2),
    nutrition: [
      { label: "Calories", value: "310 kcal", icon: "🔥" },
      { label: "Carbs", value: "55 g", icon: "🌾" },
      { label: "Protein", value: "10 g", icon: "💪" },
      { label: "Fat", value: "8 g", icon: "🫒" },
      { label: "Fibre", value: "18 g", icon: "🌿" },
      { label: "Sodium", value: "40 mg", icon: "🧂" },
    ],
    recipes: [
      {
        name: "Malvani Fish Curry",
        description: "Classic coastal curry where this masala really shines — coconut, tamarind, and fire.",
        image: "https://picsum.photos/seed/malvani-masala/600/400",
        totalTime: "40 min", prepTime: "10 min", cookTime: "30 min", servings: 4, difficulty: "Easy",
        ingredients: ["500g fish", "2 tbsp this masala", "1 cup coconut milk", "Onion", "Tomato", "Tamarind water", "Oil", "Salt", "Coriander"],
        method: ["Sauté onion until golden.", "Add 2 tbsp masala; cook 2 minutes.", "Add tomatoes and tamarind water.", "Pour coconut milk; bring to a simmer.", "Add fish; cook 12 minutes.", "Serve with steamed rice."],
      },
      {
        name: "Koliwada Fried Fish",
        description: "A Mumbai-style spiced coating using this masala blend for the perfect fried fish crust.",
        image: "https://picsum.photos/seed/koliwada-masala/600/400",
        totalTime: "25 min", prepTime: "10 min", cookTime: "15 min", servings: 3, difficulty: "Easy",
        ingredients: ["400g fish steaks", "2 tbsp this masala", "3 tbsp besan", "1 tbsp rice flour", "Ajwain", "Lemon juice", "Oil for frying"],
        method: ["Mix masala, besan, rice flour, ajwain, and lemon juice into a thick batter.", "Coat fish well.", "Deep fry in hot oil until golden and crispy.", "Drain and serve with chutney."],
      },
      {
        name: "Malvani Chicken Rassa",
        description: "A bold, dark-coloured chicken curry made with this authentic Malvani blend.",
        image: "https://picsum.photos/seed/malvani-chicken/600/400",
        totalTime: "50 min", prepTime: "15 min", cookTime: "35 min", servings: 4, difficulty: "Medium",
        ingredients: ["500g chicken", "3 tbsp this masala", "2 onions", "1 cup grated coconut (roasted)", "Tomato", "Ginger-garlic paste", "Oil", "Salt"],
        method: ["Dry-roast coconut until dark golden; blend smooth.", "Fry onions until dark; add ginger-garlic paste.", "Add chicken and sear well.", "Mix masala with coconut paste; add to chicken.", "Cook with water until oil floats on top.", "Serve with bhakri or rice."],
      },
      {
        name: "Spiced Prawn Stir-fry",
        description: "Quick wok-tossed prawns with this masala, peppers, and onions — done in under 20 minutes.",
        image: "https://picsum.photos/seed/spiced-prawn/600/400",
        totalTime: "20 min", prepTime: "5 min", cookTime: "15 min", servings: 2, difficulty: "Easy",
        ingredients: ["250g prawns", "1.5 tbsp this masala", "1 onion (diced)", "1 capsicum", "2 tomatoes", "Oil", "Coriander", "Lemon juice"],
        method: ["Heat oil in wok on high heat.", "Add onions and capsicum; stir-fry 2 minutes.", "Add prawns; cook 3 minutes.", "Add tomatoes and masala; toss well.", "Cook 5 more minutes.", "Finish with lemon juice and coriander."],
      },
      {
        name: "Mutton Sukka",
        description: "Dry mutton preparation with coconut and this masala — a coastal favourite.",
        image: "https://picsum.photos/seed/mutton-sukka/600/400",
        totalTime: "70 min", prepTime: "15 min", cookTime: "55 min", servings: 4, difficulty: "Medium",
        ingredients: ["500g mutton", "2 tbsp this masala", "1 cup grated coconut", "2 onions", "Curry leaves", "Oil", "Salt"],
        method: ["Pressure cook mutton until tender.", "Fry onions and curry leaves in oil until dark.", "Add masala and cooked mutton.", "Toss on high heat until dry.", "Add coconut; mix and stir-fry 5 minutes.", "Serve as a dry side dish."],
      },
      {
        name: "Egg Masala Curry",
        description: "Boiled eggs simmered in a rich, spiced masala gravy — simple but intensely flavourful.",
        image: "https://picsum.photos/seed/egg-masala/600/400",
        totalTime: "30 min", prepTime: "10 min", cookTime: "20 min", servings: 3, difficulty: "Easy",
        ingredients: ["6 hard-boiled eggs", "2 tbsp this masala", "2 onions", "3 tomatoes", "Ginger-garlic paste", "Oil", "Coriander", "Salt"],
        method: ["Fry onions and ginger-garlic paste until golden.", "Add tomatoes; cook until oil separates.", "Add masala; stir 2 minutes.", "Add 1 cup water; bring to boil.", "Halve eggs; add to curry.", "Simmer 8 minutes; garnish with coriander."],
      },
      {
        name: "Vegetable Masala Curry",
        description: "Mixed vegetables cooked in a rich masala base — perfect for a meatless weekday meal.",
        image: "https://picsum.photos/seed/veg-masala/600/400",
        totalTime: "35 min", prepTime: "15 min", cookTime: "20 min", servings: 4, difficulty: "Easy",
        ingredients: ["Mixed vegetables (potato, carrot, beans)", "2 tbsp this masala", "Onion", "Tomato", "Coconut milk", "Oil", "Salt", "Coriander"],
        method: ["Sauté onions in oil until soft.", "Add masala and tomatoes; cook 5 minutes.", "Add vegetables and toss well.", "Pour in coconut milk and ½ cup water.", "Cover and cook 15 minutes until vegetables are tender.", "Garnish and serve with chapati."],
      },
    ],
  },
};

export function getDummyDetail(category: string): ProductDummyDetail {
  return CATEGORY_DUMMY[category] ?? CATEGORY_DUMMY["Fish"];
}

export function getStrikePrice(price: number, discountPct: number): number {
  return Math.round(price / (1 - discountPct / 100));
}
