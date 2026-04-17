import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1);
}

const client = new MongoClient(uri);

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// Per-product batch definitions: [{ qty, shelfLifeDays, daysAgoAdded }]
const PRODUCT_BATCHES = {
  "Shark": [
    { qty: 20, shelfLifeDays: 3,   daysAgo: 2 },
    { qty: 15, shelfLifeDays: 2.5, daysAgo: 1 },
    { qty: 18, shelfLifeDays: 2,   daysAgo: 0 },
  ],
  "Chicken Curry Cut": [
    { qty: 15, shelfLifeDays: 2,   daysAgo: 2 },
    { qty: 12, shelfLifeDays: 1.5, daysAgo: 1 },
    { qty: 20, shelfLifeDays: 2,   daysAgo: 0 },
  ],
  "Tiger Prawn": [
    { qty: 10, shelfLifeDays: 1.5, daysAgo: 1 },
    { qty: 12, shelfLifeDays: 1,   daysAgo: 0 },
  ],
  "Goat Curry Cut": [
    { qty: 12, shelfLifeDays: 2,   daysAgo: 2 },
    { qty: 10, shelfLifeDays: 2.5, daysAgo: 1 },
    { qty: 15, shelfLifeDays: 2,   daysAgo: 0 },
  ],
  "Malvani Masala": [
    { qty: 25, shelfLifeDays: 180, daysAgo: 30 },
    { qty: 20, shelfLifeDays: 180, daysAgo: 10 },
    { qty: 22, shelfLifeDays: 180, daysAgo: 0  },
  ],
  "Fresh Crab": [
    { qty: 10, shelfLifeDays: 1.5, daysAgo: 1 },
    { qty: 15, shelfLifeDays: 2,   daysAgo: 0 },
  ],
  "Fresh Squid": [
    { qty: 12, shelfLifeDays: 2,   daysAgo: 1 },
    { qty: 18, shelfLifeDays: 1.5, daysAgo: 0 },
  ],
  "Whole Lobster": [
    { qty: 6,  shelfLifeDays: 2,   daysAgo: 1 },
    { qty: 9,  shelfLifeDays: 2,   daysAgo: 0 },
  ],
  "Dried Bombil": [
    { qty: 20, shelfLifeDays: 30,  daysAgo: 15 },
    { qty: 15, shelfLifeDays: 30,  daysAgo: 5  },
    { qty: 18, shelfLifeDays: 30,  daysAgo: 0  },
  ],
  "Farm Eggs (Tray of 30)": [
    { qty: 30, shelfLifeDays: 14,  daysAgo: 7  },
    { qty: 25, shelfLifeDays: 14,  daysAgo: 3  },
    { qty: 28, shelfLifeDays: 14,  daysAgo: 0  },
  ],
  "Goat Kheema 500g": [
    { qty: 15, shelfLifeDays: 2,   daysAgo: 1 },
    { qty: 12, shelfLifeDays: 1.5, daysAgo: 0 },
  ],
};

const HUB_DBS = ["Thane", "Bandra"];

async function seedHub(db) {
  const col = db.collection("products");
  const products = await col.find({ isArchived: { $ne: true } }).toArray();

  console.log(`  Found ${products.length} products.`);
  let updated = 0;

  for (const product of products) {
    const spec = PRODUCT_BATCHES[product.name];
    if (!spec) {
      console.log(`  — No batch spec for "${product.name}", skipping.`);
      continue;
    }

    const batches = spec.map(b => ({
      _id: new ObjectId(),
      quantity: b.qty,
      shelfLifeDays: b.shelfLifeDays,
      entryDate: daysAgo(b.daysAgo),
    }));

    const totalQty = batches.reduce((s, b) => s + b.quantity, 0);

    await col.updateOne(
      { _id: product._id },
      { $set: { inventoryBatches: batches, quantity: totalQty, updatedAt: new Date() } }
    );

    const batchSummary = batches
      .map(b => `${b.quantity}u/${b.shelfLifeDays}d`)
      .join(', ');
    console.log(`  ✓ "${product.name}" → [${batchSummary}] = ${totalQty} total`);
    updated++;
  }

  return updated;
}

async function main() {
  await client.connect();
  console.log("Connected to MongoDB.\n");

  let total = 0;
  for (const dbName of HUB_DBS) {
    console.log(`=== Hub: ${dbName} ===`);
    const count = await seedHub(client.db(dbName));
    total += count;
    console.log(`  ${count} products seeded.\n`);
  }

  console.log(`Done. ${total} products updated across all hubs.`);
  await client.close();
}

main().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
