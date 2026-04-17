import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1);
}

const client = new MongoClient(uri);

// Hub databases to migrate
const HUB_DBS = ["Thane", "Bandra"];

// Default shelf life in days for fresh products by category
const SHELF_LIFE_BY_CATEGORY = {
  "Fish":    2,
  "Prawns":  1.5,
  "Chicken": 2,
  "Mutton":  2,
  "Masalas": 180,
};
const DEFAULT_SHELF_LIFE = 2;

async function migrateHub(db) {
  const productsCol = db.collection("products");

  const products = await productsCol.find({
    isArchived: { $ne: true },
    $or: [
      { inventoryBatches: { $exists: false } },
      { inventoryBatches: { $size: 0 } },
    ],
  }).toArray();

  console.log(`  Found ${products.length} products needing migration.`);

  let migrated = 0;
  for (const product of products) {
    const qty = product.quantity ?? 0;
    if (qty <= 0) {
      console.log(`  Skipping "${product.name}" (quantity = ${qty})`);
      continue;
    }

    const category = product.category ?? "";
    const shelfLifeDays = SHELF_LIFE_BY_CATEGORY[category] ?? DEFAULT_SHELF_LIFE;
    const entryDate = product.updatedAt ?? new Date();

    const batch = {
      _id: new ObjectId(),
      quantity: qty,
      shelfLifeDays,
      entryDate,
    };

    await productsCol.updateOne(
      { _id: product._id },
      { $set: { inventoryBatches: [batch] } }
    );

    console.log(`  ✓ "${product.name}" → batch: qty=${qty}, shelf=${shelfLifeDays}d, entry=${entryDate.toISOString().slice(0, 10)}`);
    migrated++;
  }

  return migrated;
}

async function main() {
  await client.connect();
  console.log("Connected to MongoDB.\n");

  let total = 0;
  for (const dbName of HUB_DBS) {
    console.log(`=== Migrating hub: ${dbName} ===`);
    const db = client.db(dbName);
    const count = await migrateHub(db);
    total += count;
    console.log(`  Done. ${count} products migrated.\n`);
  }

  console.log(`Migration complete. Total: ${total} products updated.`);
  await client.close();
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
