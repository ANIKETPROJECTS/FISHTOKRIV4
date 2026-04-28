import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  subCategory: { type: String, default: null },
  status: { type: String, default: "available" },
  limitedStockNote: { type: String, default: null },
  price: { type: Number, default: null },
  originalPrice: { type: Number, default: null },
  unit: { type: String, default: null },
  imageUrl: { type: String, default: null },
  isArchived: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  sectionId: { type: mongoose.Schema.Types.Mixed, default: null },
  description: { type: String, default: null },
  grossWeight: { type: String, default: null },
  netWeight: { type: String, default: null },
  pieces: { type: String, default: null },
  serves: { type: String, default: null },
  discountPct: { type: Number, default: null },
  quantity: { type: Number, default: null },
  couponIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
});

const PRAWN_PRODUCTS = [
  {
    name: "White Prawn",
    subCategory: "White Prawn",
    price: 850,
    originalPrice: 950,
    grossWeight: "500 g",
    netWeight: "350 g",
    pieces: "25-30 Pieces",
    serves: "Serves 3",
    description: "Fresh, sweet white prawns — perfect for curries and rice dishes.",
    quantity: 35,
  },
  {
    name: "Red Prawn",
    subCategory: "Red Prawn",
    price: 920,
    originalPrice: 1050,
    grossWeight: "500 g",
    netWeight: "350 g",
    pieces: "20-25 Pieces",
    serves: "Serves 3",
    description: "Vibrant red prawns with rich flavor — great for grilling and stir-fry.",
    quantity: 28,
  },
  {
    name: "Freshwater Prawn",
    subCategory: "Freshwater Prawn",
    price: 1100,
    originalPrice: 1300,
    grossWeight: "750 g",
    netWeight: "500 g",
    pieces: "10-12 Pieces",
    serves: "Serves 4",
    description: "Large, meaty freshwater prawns — ideal for tandoor and butter garlic.",
    quantity: 20,
  },
  {
    name: "Scampi Prawn",
    subCategory: "Scampi Prawn",
    price: 1450,
    originalPrice: 1600,
    grossWeight: "500 g",
    netWeight: "350 g",
    pieces: "8-10 Pieces",
    serves: "Serves 3",
    description: "Premium scampi with sweet, delicate meat — a true delicacy.",
    quantity: 15,
  },
  {
    name: "Jumbo Prawn",
    subCategory: "Jumbo Prawn",
    price: 1850,
    originalPrice: 2100,
    grossWeight: "1 kg",
    netWeight: "700 g",
    pieces: "12-14 Pieces",
    serves: "Serves 5",
    description: "Show-stopping jumbo prawns for special occasions and BBQs.",
    quantity: 12,
  },
  {
    name: "Kardi Prawn",
    subCategory: "Kardi",
    price: 480,
    originalPrice: 580,
    grossWeight: "500 g",
    netWeight: "350 g",
    pieces: "60-70 Pieces",
    serves: "Serves 4",
    description: "Tiny, flavorful kardi prawns — classic for koliwada fry.",
    quantity: 40,
  },
  {
    name: "Lobster",
    subCategory: "Lobsters",
    price: 2400,
    originalPrice: 2700,
    grossWeight: "1 kg",
    netWeight: "650 g",
    pieces: "1-2 Pieces",
    serves: "Serves 4",
    description: "Live-quality lobster — buttery, sweet, and luxurious.",
    quantity: 8,
  },
];

async function seed() {
  for (const dbName of ["Thane", "Bandra"]) {
    const conn = mongoose.createConnection(MONGODB_URI, { dbName });
    await new Promise((res, rej) => {
      conn.once("connected", res);
      conn.once("error", rej);
    });
    const Product = conn.model("Product", productSchema);

    for (const p of PRAWN_PRODUCTS) {
      const existing = await Product.findOne({ name: p.name, category: "Prawns" });
      if (existing) {
        console.log(`[${dbName}] skip (exists): ${p.name}`);
        continue;
      }
      const discountPct = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      await Product.create({
        ...p,
        category: "Prawns",
        unit: "per kg",
        discountPct,
      });
      console.log(`[${dbName}] inserted: ${p.name} (${p.subCategory})`);
    }

    await conn.close();
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
