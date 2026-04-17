import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI must be set.");

// ── Coupon definitions ────────────────────────────────────────────────────────
const COUPON_DEFINITIONS = [
  {
    code: "WELCOME100",
    title: "Welcome Gift",
    description: "₹100 off on your very first order — no minimum required!",
    type: "flat" as const,
    discountValue: 100,
    minOrderAmount: 0,
    maxUsage: null,
    isFirstTimeOnly: true,
    isActive: true,
    applicableCategories: [] as string[], // empty = all categories
    expiresAt: null,
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    code: "FISH10",
    title: "Fish Special",
    description: "10% off on all Fish products (min order ₹200)",
    type: "percentage" as const,
    discountValue: 10,
    minOrderAmount: 200,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: ["Fish"],
    expiresAt: null,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    code: "PRAWNS12",
    title: "Prawn Bonanza",
    description: "12% off on all Prawns (min order ₹300)",
    type: "percentage" as const,
    discountValue: 12,
    minOrderAmount: 300,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: ["Prawns"],
    expiresAt: null,
    color: "bg-pink-50 border-pink-200 text-pink-700",
  },
  {
    code: "CHICKEN8",
    title: "Chicken Deal",
    description: "8% off on all Chicken products (min order ₹200)",
    type: "percentage" as const,
    discountValue: 8,
    minOrderAmount: 200,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: ["Chicken"],
    expiresAt: null,
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },
  {
    code: "MUTTON10",
    title: "Mutton Special",
    description: "10% off on all Mutton & Keema (min order ₹300)",
    type: "percentage" as const,
    discountValue: 10,
    minOrderAmount: 300,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: ["Mutton", "Mutton Keema"],
    expiresAt: null,
    color: "bg-red-50 border-red-200 text-red-700",
  },
  {
    code: "SEAFOOD15",
    title: "Seafood Feast",
    description: "15% off on Crab, Squid, Lobster & Dried Fish (min ₹500)",
    type: "percentage" as const,
    discountValue: 15,
    minOrderAmount: 500,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: ["Crab", "Squid", "Lobster", "Dried Fish", "Eggs"],
    expiresAt: null,
    color: "bg-teal-50 border-teal-200 text-teal-700",
  },
  {
    code: "MASALA5",
    title: "Masala Magic",
    description: "5% off on all Masala products",
    type: "percentage" as const,
    discountValue: 5,
    minOrderAmount: 0,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: ["Masalas"],
    expiresAt: null,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    code: "SAVE15",
    title: "Save More",
    description: "15% off on orders above ₹500",
    type: "percentage" as const,
    discountValue: 15,
    minOrderAmount: 500,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: [] as string[],
    expiresAt: null,
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    code: "TOKRI20",
    title: "FishTokri Special",
    description: "20% off for FishTokri members on orders above ₹800",
    type: "percentage" as const,
    discountValue: 20,
    minOrderAmount: 800,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: [] as string[],
    expiresAt: null,
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    code: "BIGFEAST",
    title: "Big Feast Offer",
    description: "Flat ₹200 off on orders above ₹1200",
    type: "flat" as const,
    discountValue: 200,
    minOrderAmount: 1200,
    maxUsage: null,
    isFirstTimeOnly: false,
    isActive: true,
    applicableCategories: [] as string[],
    expiresAt: null,
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
];

// ── Category → coupon codes mapping ──────────────────────────────────────────
function getCouponCodesForCategory(category: string): string[] {
  const general = ["WELCOME100", "SAVE15", "TOKRI20", "BIGFEAST"];
  const categoryMap: Record<string, string[]> = {
    Fish: ["FISH10"],
    Prawns: ["PRAWNS12"],
    Chicken: ["CHICKEN8"],
    Mutton: ["MUTTON10"],
    "Mutton Keema": ["MUTTON10"],
    Crab: ["SEAFOOD15"],
    Squid: ["SEAFOOD15"],
    Lobster: ["SEAFOOD15"],
    "Dried Fish": ["SEAFOOD15"],
    Eggs: ["SEAFOOD15"],
    Masalas: ["MASALA5"],
  };
  const specific = categoryMap[category] ?? [];
  return [...specific, ...general];
}

// ── Schemas ───────────────────────────────────────────────────────────────────
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["flat", "percentage"], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  isFirstTimeOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  applicableCategories: { type: [String], default: [] },
  expiresAt: { type: Date, default: null },
  color: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  couponIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
}, { strict: false });

const subHubSchema = new mongoose.Schema({
  name: String,
  dbName: { type: String, required: true },
  status: String,
});

async function seedHub(dbName: string) {
  console.log(`\n── Processing hub DB: ${dbName} ──`);

  const conn = mongoose.createConnection(MONGODB_URI, { dbName });
  await new Promise<void>((resolve) => conn.once("connected", resolve));

  const CouponModel = conn.models.Coupon || conn.model("Coupon", couponSchema);
  const ProductModel = conn.models.Product || conn.model("Product", productSchema);

  // 1. Delete all existing coupons
  const deleted = await CouponModel.deleteMany({});
  console.log(`  Deleted ${deleted.deletedCount} existing coupons`);

  // 2. Insert new coupons
  const inserted = await CouponModel.insertMany(
    COUPON_DEFINITIONS.map((c) => ({ ...c, usedCount: 0, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`  Inserted ${inserted.length} new coupons`);

  // Build code → _id map
  const couponMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const doc of inserted) {
    couponMap[(doc as any).code] = (doc as any)._id;
  }

  // 3. Update every product with its coupon IDs
  const products = await ProductModel.find({}).lean() as any[];
  console.log(`  Found ${products.length} products to update`);

  let updatedCount = 0;
  for (const product of products) {
    const codes = getCouponCodesForCategory(product.category ?? "");
    const ids = codes.map((code) => couponMap[code]).filter(Boolean);
    await ProductModel.findByIdAndUpdate(product._id, { couponIds: ids });
    updatedCount++;
  }

  console.log(`  Updated ${updatedCount} products with coupon IDs`);
  await conn.close();
}

async function main() {
  console.log("Connecting to fishtokri_admin to discover hubs...");
  const adminConn = mongoose.createConnection(MONGODB_URI, { dbName: "fishtokri_admin" });
  await new Promise<void>((resolve) => adminConn.once("connected", resolve));

  const SubHubModel = adminConn.models.SubHub || adminConn.model("SubHub", subHubSchema, "sub_hubs");
  const hubs = await SubHubModel.find({ status: "Active" }).lean() as any[];
  console.log(`Found ${hubs.length} active hub(s): ${hubs.map((h: any) => h.dbName).join(", ")}`);

  await adminConn.close();

  for (const hub of hubs) {
    await seedHub(hub.dbName);
  }

  console.log("\nDone! All hubs seeded successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
