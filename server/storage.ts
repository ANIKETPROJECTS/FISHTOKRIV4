import { UserModel } from "./adminDb";
import { getOrderModel } from "./ordersDb";
import { CustomerDbModel } from "./customerDb";
import type {
  User,
  InsertUser,
  OrderRequest,
  InsertOrderRequest,
  Customer,
  InsertCustomer,
  UpdateCustomer,
  CustomerAddress,
  EmbeddedOrder,
} from "@shared/schema";

function toUser(doc: any): User {
  return {
    id: doc._id.toString(),
    username: doc.username,
    password: doc.password,
  };
}

function toCustomer(doc: any): Customer {
  return {
    id: doc._id.toString(),
    phone: doc.phone,
    name: doc.name ?? null,
    email: doc.email ?? null,
    dateOfBirth: doc.dateOfBirth ?? null,
    addresses: (doc.addresses ?? []).map((a: any, i: number) => ({
      id: a?._id ? a._id.toString() : `idx-${i}`,
      label: a?.label ?? "Home",
      type: (a?.type ?? "house") as "house" | "office" | "other",
      name: a?.name ?? "",
      phone: a?.phone ?? "",
      building: a?.building ?? "",
      street: a?.street ?? "",
      area: a?.area ?? "",
      pincode: a?.pincode ?? "",
      instructions: a?.instructions ?? "",
      isDefault: !!a?.isDefault,
    })),
    orders: (doc.orders ?? []).map((o: any) => ({
      orderId: o.orderId,
      customerName: o.customerName,
      phone: o.phone,
      deliveryArea: o.deliveryArea,
      address: o.address,
      items: o.items,
      status: o.status ?? "pending",
      notes: o.notes ?? null,
      total: o.total ?? null,
      placedAt: o.placedAt,
      updatedAt: o.updatedAt,
    })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function toOrder(doc: any): OrderRequest {
  const items = (doc.items ?? []).map((it: any) => ({
    productId: it.productId ?? null,
    name: it.name,
    price: it.price ?? null,
    quantity: it.quantity,
    unit: it.unit ?? null,
    imageUrl: it.imageUrl ?? null,
  }));

  const subtotal = doc.subtotal ?? items.reduce(
    (s: number, it: any) => s + ((it.price ?? 0) * (it.quantity ?? 1)),
    0,
  );
  const discount = doc.discount ?? doc.coupon?.discountAmount ?? 0;
  const slotCharge = doc.slotCharge ?? doc.instantDeliveryCharge ?? 0;
  const total = doc.total ?? Math.max(0, subtotal - discount + slotCharge);

  const detail = doc.deliveryAddressDetail
    ? {
        id: doc.deliveryAddressDetail._id ? doc.deliveryAddressDetail._id.toString() : "",
        label: doc.deliveryAddressDetail.label ?? "Home",
        type: (doc.deliveryAddressDetail.type ?? "house") as "house" | "office" | "other",
        name: doc.deliveryAddressDetail.name ?? "",
        phone: doc.deliveryAddressDetail.phone ?? "",
        building: doc.deliveryAddressDetail.building ?? "",
        street: doc.deliveryAddressDetail.street ?? "",
        area: doc.deliveryAddressDetail.area ?? "",
        pincode: doc.deliveryAddressDetail.pincode ?? "",
        instructions: doc.deliveryAddressDetail.instructions ?? "",
        isDefault: !!doc.deliveryAddressDetail.isDefault,
      }
    : null;

  const coupons = (doc.coupons ?? []).map((c: any) => ({
    id: c.id?.toString() ?? "",
    code: c.code ?? "",
    title: c.title ?? "",
    type: c.type ?? "",
    discountValue: c.discountValue ?? 0,
    minOrderAmount: c.minOrderAmount ?? 0,
  }));

  return {
    id: doc._id.toString(),
    customerId: doc.customerId?.toString() ?? null,
    customerName: doc.customerName,
    phone: doc.phone,
    email: doc.email ?? null,
    items,
    subtotal,
    discount,
    slotCharge,
    total,
    deliveryType: doc.deliveryType ?? null,
    address: doc.address,
    deliveryArea: doc.deliveryArea,
    deliveryAddressDetail: detail,
    pickupLocation: doc.pickupLocation ?? "",
    notes: doc.notes ?? null,
    status: doc.status,
    source: doc.source ?? null,
    subHubId: doc.subHubId?.toString() ?? null,
    subHubName: doc.subHubName ?? null,
    superHubId: doc.superHubId?.toString() ?? null,
    superHubName: doc.superHubName ?? null,
    couponId: doc.couponId?.toString() ?? doc.coupon?.couponId?.toString() ?? null,
    couponCode: doc.couponCode ?? doc.coupon?.code ?? null,
    couponTitle: doc.couponTitle ?? null,
    couponIds: (doc.couponIds ?? []).map((x: any) => x.toString()),
    couponCodes: doc.couponCodes ?? [],
    coupons,
    paymentStatus: doc.paymentStatus ?? "unpaid",
    payments: doc.payments ?? [],
    paidAmount: doc.paidAmount ?? 0,
    dueAmount: doc.dueAmount ?? total,
    scheduleType: doc.scheduleType ?? null,
    deliveryDate: doc.deliveryDate ?? null,
    timeslotId: doc.timeslotId?.toString() ?? null,
    timeslotLabel: doc.timeslotLabel ?? null,
    timeslotStart: doc.timeslotStart ?? null,
    timeslotEnd: doc.timeslotEnd ?? null,
    instantDeliveryCharge: doc.instantDeliveryCharge ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt ?? doc.createdAt ?? null,
    inventoryDeducted: !!doc.inventoryDeducted,
    coupon: doc.coupon
      ? {
          couponId: doc.coupon.couponId?.toString() ?? null,
          code: doc.coupon.code,
          discountType: doc.coupon.discountType,
          discountValue: doc.coupon.discountValue,
          discountAmount: doc.coupon.discountAmount,
        }
      : null,
  };
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getOrderRequests(): Promise<OrderRequest[]>;
  getOrdersByPhone(phone: string): Promise<OrderRequest[]>;
  getOrderRequest(id: string): Promise<OrderRequest | undefined>;
  createOrderRequest(order: InsertOrderRequest): Promise<OrderRequest>;
  updateOrderRequestStatus(id: string, status: string): Promise<OrderRequest | undefined>;

  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  createCustomer(data: InsertCustomer): Promise<Customer>;
  upsertCustomer(phone: string, data: Partial<InsertCustomer>): Promise<Customer>;
  updateCustomer(phone: string, updates: UpdateCustomer): Promise<Customer | undefined>;
  addCustomerAddress(phone: string, address: Omit<CustomerAddress, "id">): Promise<Customer | undefined>;
  updateCustomerAddress(phone: string, addrId: string, updates: Partial<Omit<CustomerAddress, "id">>): Promise<Customer | undefined>;
  deleteCustomerAddress(phone: string, addrId: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  pushOrderToCustomer(phone: string, order: Omit<EmbeddedOrder, "updatedAt">): Promise<void>;
  updateCustomerOrderStatus(phone: string, orderId: string, status: string): Promise<void>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const doc = await UserModel.findById(id).lean();
    return doc ? toUser(doc) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const doc = await UserModel.findOne({ username }).lean();
    return doc ? toUser(doc) : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const doc = await UserModel.create(user);
    return toUser(doc);
  }

  async getOrderRequests(): Promise<OrderRequest[]> {
    const docs = await getOrderModel().find().sort({ createdAt: -1 }).lean();
    return docs.map(toOrder);
  }

  async getOrdersByPhone(phone: string): Promise<OrderRequest[]> {
    const docs = await getOrderModel().find({ phone }).sort({ createdAt: -1 }).lean();
    return docs.map(toOrder);
  }

  async getOrderRequest(id: string): Promise<OrderRequest | undefined> {
    try {
      const doc = await getOrderModel().findById(id).lean();
      return doc ? toOrder(doc) : undefined;
    } catch {
      return undefined;
    }
  }

  async createOrderRequest(order: InsertOrderRequest & {
    customerId?: string | null;
    email?: string | null;
    subtotal?: number;
    discount?: number;
    slotCharge?: number;
    total?: number;
    source?: string;
    couponId?: string | null;
    couponCode?: string | null;
    couponTitle?: string | null;
    couponIds?: string[];
    couponCodes?: string[];
    coupons?: any[];
    superHubName?: string | null;
    inventoryDeducted?: boolean;
  }): Promise<OrderRequest> {
    const items = (order.items ?? []).map((it: any) => ({
      productId: it.productId ?? null,
      name: it.name,
      price: it.price ?? null,
      quantity: it.quantity,
      unit: it.unit ?? null,
    }));

    const subtotal = order.subtotal ?? items.reduce(
      (s: number, it: any) => s + ((it.price ?? 0) * (it.quantity ?? 1)),
      0,
    );
    const discount = order.discount ?? 0;
    const slotCharge = order.slotCharge ?? order.instantDeliveryCharge ?? 0;
    const total = order.total ?? Math.max(0, subtotal - discount + slotCharge);

    const isInstant = order.deliveryType === "instant" || order.scheduleType === "instant";
    const scheduleType = order.scheduleType ?? (isInstant ? "instant" : "slot");
    const deliveryType = isInstant ? "delivery" : (order.deliveryType === "next-day" ? "delivery" : (order.deliveryType ?? "delivery"));

    const detail = order.deliveryAddressDetail
      ? {
          label: order.deliveryAddressDetail.label ?? "Home",
          type: order.deliveryAddressDetail.type ?? "house",
          name: order.deliveryAddressDetail.name ?? "",
          phone: order.deliveryAddressDetail.phone ?? "",
          building: order.deliveryAddressDetail.building ?? "",
          street: order.deliveryAddressDetail.street ?? "",
          area: order.deliveryAddressDetail.area ?? "",
          pincode: order.deliveryAddressDetail.pincode ?? "",
          instructions: order.deliveryAddressDetail.instructions ?? "",
          isDefault: !!order.deliveryAddressDetail.isDefault,
        }
      : null;

    const now = new Date();
    const Model = getOrderModel();

    const toObjectId = (val: any): mongoose.Types.ObjectId | null => {
      if (!val) return null;
      try {
        if (val instanceof mongoose.Types.ObjectId) return val;
        if (typeof val === "string" && mongoose.Types.ObjectId.isValid(val)) {
          return new mongoose.Types.ObjectId(val);
        }
      } catch {
        return null;
      }
      return null;
    };

    const orderedDoc: Record<string, any> = {
      customerId: toObjectId(order.customerId),
      customerName: order.customerName,
      phone: order.phone,
      email: order.email ?? null,
      items,
      subtotal,
      discount,
      slotCharge,
      total,
      deliveryType,
      address: order.address,
      deliveryArea: order.deliveryArea,
      deliveryAddressDetail: detail,
      pickupLocation: "",
      notes: order.notes ?? null,
      status: "pending",
      source: order.source ?? "storefront",
      subHubId: toObjectId(order.subHubId),
      subHubName: order.subHubName ?? null,
      superHubId: toObjectId(order.superHubId),
      superHubName: order.superHubName ?? null,
      couponId: toObjectId(order.couponId),
      couponCode: order.couponCode ?? null,
      couponTitle: order.couponTitle ?? null,
      couponIds: (order.couponIds ?? []).map(toObjectId).filter(Boolean),
      couponCodes: order.couponCodes ?? [],
      coupons: (order.coupons ?? []).map((c: any) => ({
        id: toObjectId(c.id),
        code: c.code,
        title: c.title,
        type: c.type,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount ?? 0,
      })),
      paymentStatus: "unpaid",
      payments: [],
      paidAmount: 0,
      dueAmount: total,
      scheduleType,
      deliveryDate: order.deliveryDate ?? null,
      timeslotId: toObjectId(order.timeslotId),
      timeslotLabel: order.timeslotLabel ?? null,
      timeslotStart: order.timeslotStart ?? null,
      timeslotEnd: order.timeslotEnd ?? null,
      instantDeliveryCharge: isInstant ? (order.instantDeliveryCharge ?? null) : null,
      createdAt: now,
      updatedAt: now,
      inventoryDeducted: !!order.inventoryDeducted,
      __v: 0,
    };

    const result = await Model.collection.insertOne(orderedDoc as any);
    const doc = await Model.findById(result.insertedId).lean();
    return toOrder(doc);
  }

  async updateOrderRequestStatus(id: string, status: string): Promise<OrderRequest | undefined> {
    try {
      const doc = await getOrderModel().findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true },
      ).lean();
      return doc ? toOrder(doc) : undefined;
    } catch {
      return undefined;
    }
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    const doc = await CustomerDbModel.findOne({ phone }).lean();
    return doc ? toCustomer(doc) : undefined;
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    const now = new Date();
    const ordered = {
      name: data.name ?? null,
      email: data.email ?? null,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth ?? null,
      addresses: [] as any[],
      orders: [] as any[],
      usedCoupons: [] as any[],
      createdAt: now,
      updatedAt: now,
      __v: 0,
    };
    const result = await CustomerDbModel.collection.insertOne(ordered as any);
    const doc = await CustomerDbModel.findById(result.insertedId).lean();
    return toCustomer(doc);
  }

  async upsertCustomer(phone: string, data: Partial<InsertCustomer>): Promise<Customer> {
    const existing = await CustomerDbModel.findOne({ phone }).lean();
    if (existing) {
      const { phone: _ignored, ...rest } = data as any;
      const setFields: Record<string, any> = { updatedAt: new Date() };
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) setFields[k] = v;
      }
      const doc = await CustomerDbModel.findOneAndUpdate(
        { phone },
        { $set: setFields },
        { new: true }
      ).lean();
      return toCustomer(doc);
    }
    return this.createCustomer({ ...data, phone } as InsertCustomer);
  }

  async updateCustomer(phone: string, updates: UpdateCustomer): Promise<Customer | undefined> {
    const doc = await CustomerDbModel.findOneAndUpdate(
      { phone },
      { $set: { ...updates, updatedAt: new Date() } },
      { new: true }
    ).lean();
    return doc ? toCustomer(doc) : undefined;
  }

  async addCustomerAddress(phone: string, address: Omit<CustomerAddress, "id">): Promise<Customer | undefined> {
    const ordered = {
      label: address.label ?? "Home",
      type: address.type ?? "house",
      name: address.name ?? "",
      phone: address.phone ?? "",
      building: address.building ?? "",
      street: address.street ?? "",
      area: address.area ?? "",
      pincode: address.pincode ?? "",
      instructions: address.instructions ?? "",
      isDefault: !!address.isDefault,
    };
    const doc = await CustomerDbModel.findOneAndUpdate(
      { phone },
      { $push: { addresses: ordered }, $set: { updatedAt: new Date() } },
      { new: true }
    ).lean();
    return doc ? toCustomer(doc) : undefined;
  }

  async updateCustomerAddress(phone: string, addrId: string, updates: Partial<Omit<CustomerAddress, "id">>): Promise<Customer | undefined> {
    // Synthetic id ("idx-N") for legacy addresses without _id — match by array position.
    if (addrId.startsWith("idx-")) {
      const idx = parseInt(addrId.slice(4), 10);
      if (Number.isNaN(idx) || idx < 0) return undefined;
      const setFields: Record<string, any> = { updatedAt: new Date() };
      for (const [k, v] of Object.entries(updates)) {
        setFields[`addresses.${idx}.${k}`] = v;
      }
      const doc = await CustomerDbModel.findOneAndUpdate(
        { phone },
        { $set: setFields },
        { new: true }
      ).lean();
      return doc ? toCustomer(doc) : undefined;
    }

    const setFields: Record<string, any> = { updatedAt: new Date() };
    for (const [k, v] of Object.entries(updates)) {
      setFields[`addresses.$.${k}`] = v;
    }
    const doc = await CustomerDbModel.findOneAndUpdate(
      { phone, "addresses._id": addrId },
      { $set: setFields },
      { new: true }
    ).lean();
    return doc ? toCustomer(doc) : undefined;
  }

  async deleteCustomerAddress(phone: string, addrId: string): Promise<Customer | undefined> {
    // Synthetic id ("idx-N") for legacy addresses without _id — unset by position then compact.
    if (addrId.startsWith("idx-")) {
      const idx = parseInt(addrId.slice(4), 10);
      if (Number.isNaN(idx) || idx < 0) return undefined;
      await CustomerDbModel.updateOne(
        { phone },
        { $unset: { [`addresses.${idx}`]: 1 } }
      );
      const doc = await CustomerDbModel.findOneAndUpdate(
        { phone },
        { $pull: { addresses: null as any }, $set: { updatedAt: new Date() } },
        { new: true }
      ).lean();
      return doc ? toCustomer(doc) : undefined;
    }

    const doc = await CustomerDbModel.findOneAndUpdate(
      { phone },
      { $pull: { addresses: { _id: addrId } }, $set: { updatedAt: new Date() } },
      { new: true }
    ).lean();
    return doc ? toCustomer(doc) : undefined;
  }

  async getAllCustomers(): Promise<Customer[]> {
    const docs = await CustomerDbModel.find().sort({ createdAt: -1 }).lean();
    return docs.map(toCustomer);
  }

  async pushOrderToCustomer(phone: string, order: Omit<EmbeddedOrder, "updatedAt">): Promise<void> {
    try {
      const embeddedOrder = { ...order, updatedAt: new Date() };
      const existing = await CustomerDbModel.findOne({ phone }).lean();
      if (!existing) {
        const now = new Date();
        await CustomerDbModel.collection.insertOne({
          name: null,
          email: null,
          phone,
          dateOfBirth: null,
          addresses: [],
          orders: [embeddedOrder],
          usedCoupons: [],
          createdAt: now,
          updatedAt: now,
          __v: 0,
        } as any);
        return;
      }
      await CustomerDbModel.findOneAndUpdate(
        { phone },
        {
          $push: { orders: embeddedOrder },
          $set: { updatedAt: new Date() },
        }
      );
    } catch (err) {
      console.error("Failed to push order to customer document:", err);
    }
  }

  async updateCustomerOrderStatus(phone: string, orderId: string, status: string): Promise<void> {
    try {
      await CustomerDbModel.findOneAndUpdate(
        { phone, "orders.orderId": orderId },
        {
          $set: {
            "orders.$.status": status,
            "orders.$.updatedAt": new Date(),
            updatedAt: new Date(),
          },
        }
      );
    } catch (err) {
      console.error("Failed to update customer order status:", err);
    }
  }
}

export const storage = new MongoStorage();
