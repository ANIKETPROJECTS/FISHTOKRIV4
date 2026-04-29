import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI must be set");

const ID_FIELDS = [
  "customerId",
  "subHubId",
  "superHubId",
  "couponId",
  "timeslotId",
];

function toObjectId(val) {
  if (val == null) return null;
  if (val instanceof mongoose.Types.ObjectId) return val;
  if (typeof val === "object" && val.$oid && typeof val.$oid === "string") {
    return mongoose.Types.ObjectId.isValid(val.$oid)
      ? new mongoose.Types.ObjectId(val.$oid)
      : null;
  }
  if (typeof val === "string" && mongoose.Types.ObjectId.isValid(val)) {
    return new mongoose.Types.ObjectId(val);
  }
  return null;
}

const conn = await mongoose.createConnection(uri, { dbName: "orders" }).asPromise();
const coll = conn.collection("orders");

const docs = await coll.find({}).toArray();
console.log(`Scanning ${docs.length} orders...`);

let updatedCount = 0;
for (const d of docs) {
  const set = {};
  const unset = {};
  let needsUpdate = false;

  for (const field of ID_FIELDS) {
    const cur = d[field];
    if (cur == null) continue;
    if (cur instanceof mongoose.Types.ObjectId) continue;
    const objId = toObjectId(cur);
    if (objId) {
      set[field] = objId;
      needsUpdate = true;
    }
  }

  if (Array.isArray(d.couponIds) && d.couponIds.length > 0) {
    const converted = d.couponIds
      .map((v) => toObjectId(v))
      .filter(Boolean);
    const allObjIds = d.couponIds.every((v) => v instanceof mongoose.Types.ObjectId);
    if (!allObjIds && converted.length > 0) {
      set.couponIds = converted;
      needsUpdate = true;
    }
  }

  if (Array.isArray(d.coupons) && d.coupons.length > 0) {
    let touched = false;
    const converted = d.coupons.map((c) => {
      if (!c) return c;
      if (c.id == null) return c;
      if (c.id instanceof mongoose.Types.ObjectId) return c;
      const objId = toObjectId(c.id);
      if (objId) {
        touched = true;
        return { ...c, id: objId };
      }
      return c;
    });
    if (touched) {
      set.coupons = converted;
      needsUpdate = true;
    }
  }

  if ("__v" in d) {
    unset.__v = "";
    needsUpdate = true;
  }

  if (typeof d.notes === "string") {
    const trimmed = d.notes.trim();
    if (trimmed !== d.notes) {
      set.notes = trimmed.length === 0 ? null : trimmed;
      needsUpdate = true;
    }
  }

  if (needsUpdate) {
    const update = {};
    if (Object.keys(set).length > 0) update.$set = set;
    if (Object.keys(unset).length > 0) update.$unset = unset;
    await coll.updateOne({ _id: d._id }, update);
    updatedCount++;
    console.log(
      `Updated ${d._id} (source=${d.source ?? "?"}, customer=${d.customerName ?? "?"})`,
    );
  }
}

console.log(`Migration complete. Updated ${updatedCount}/${docs.length} orders.`);
await conn.close();
