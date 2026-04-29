import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

let ordersConnection: mongoose.Connection | null = null;

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: null },
    name: { type: String, required: true },
    price: { type: Number, default: null },
    quantity: { type: Number, required: true },
    unit: { type: String, default: null },
  },
  { _id: false }
);

const orderAddressDetailSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    type: { type: String, default: "house" },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    building: { type: String, default: "" },
    street: { type: String, default: "" },
    area: { type: String, default: "" },
    pincode: { type: String, default: "" },
    instructions: { type: String, default: "" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderCouponSummarySchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, default: null },
    code: { type: String, default: null },
    title: { type: String, default: null },
    type: { type: String, default: null },
    discountValue: { type: Number, default: null },
    minOrderAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderPaymentSchema = new mongoose.Schema(
  {
    mode: { type: String, default: null },
    amount: { type: Number, default: 0 },
    reference: { type: String, default: "" },
    status: { type: String, default: "completed" },
    paidAt: { type: Date, default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: null },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  slotCharge: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  deliveryType: { type: String, default: "delivery" },
  address: { type: String, required: true },
  deliveryArea: { type: String, required: true },
  deliveryAddressDetail: { type: orderAddressDetailSchema, default: null },
  pickupLocation: { type: String, default: "" },
  notes: { type: String, default: null },
  status: { type: String, default: "pending" },
  source: { type: String, default: "storefront" },
  subHubId: { type: mongoose.Schema.Types.ObjectId, default: null },
  subHubName: { type: String, default: null },
  superHubId: { type: mongoose.Schema.Types.ObjectId, default: null },
  superHubName: { type: String, default: null },
  couponId: { type: mongoose.Schema.Types.ObjectId, default: null },
  couponCode: { type: String, default: null },
  couponTitle: { type: String, default: null },
  couponIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  couponCodes: { type: [String], default: [] },
  coupons: { type: [orderCouponSummarySchema], default: [] },
  paymentStatus: { type: String, default: "unpaid" },
  payments: { type: [orderPaymentSchema], default: [] },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  scheduleType: { type: String, default: "slot" },
  deliveryDate: { type: String, default: null },
  timeslotId: { type: mongoose.Schema.Types.ObjectId, default: null },
  timeslotLabel: { type: String, default: null },
  timeslotStart: { type: String, default: null },
  timeslotEnd: { type: String, default: null },
  instantDeliveryCharge: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  inventoryDeducted: { type: Boolean, default: false },
}, {
  versionKey: false,
  toJSON: {
    virtuals: false,
    transform: (_doc, ret: any) => {
      if (ret._id) ret._id = ret._id.toString();
      const idFields = [
        "customerId",
        "subHubId",
        "superHubId",
        "couponId",
        "timeslotId",
      ];
      for (const k of idFields) {
        if (ret[k]) ret[k] = ret[k].toString();
      }
      if (Array.isArray(ret.couponIds)) {
        ret.couponIds = ret.couponIds.map((id: any) => (id ? id.toString() : null));
      }
      if (Array.isArray(ret.coupons)) {
        ret.coupons = ret.coupons.map((c: any) => ({
          ...c,
          id: c?.id ? c.id.toString() : null,
        }));
      }
      delete ret.__v;
      return ret;
    },
  },
});

export async function connectOrdersDb() {
  if (!ordersConnection) {
    ordersConnection = mongoose.createConnection(MONGODB_URI, { dbName: "orders" });
    ordersConnection.on("connected", () => console.log("Connected to orders DB"));
    ordersConnection.on("error", (err) => console.error("Orders DB error:", err));
    await ordersConnection.asPromise();
  }
  return ordersConnection;
}

export function getOrderModel() {
  if (!ordersConnection) {
    throw new Error("Orders DB not connected. Call connectOrdersDb() first.");
  }
  return ordersConnection.models["Order"] || ordersConnection.model("Order", orderSchema);
}
