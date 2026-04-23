import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Lottie from "lottie-react";
import { Header } from "@/components/storefront/Header";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import profileAnim1 from "@/assets/lottie/profile1.json";
import profileAnim2 from "@/assets/lottie/profile2.json";
import logoutAnim from "@/assets/lottie/logout.json";
import iconHomeImg from "@assets/home_1776927604826.png";
import iconEditImg from "@assets/edit_1776927607777.png";
import iconBinImg from "@assets/bin_1776927610776.png";
import iconBriefcaseImg from "@assets/briefcase_1776927648499.png";
import headerUserImg from "@assets/user_(1)_1774707188827.png";
import headerCartImg from "@assets/shopping-bag_1774706595493.png";
import headerLocationImg from "@assets/placeholder_(1)_1774706943633.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCustomer } from "@/context/CustomerContext";
import { useHub } from "@/context/HubContext";
import { OtpModal } from "@/components/storefront/OtpModal";
import { apiRequest } from "@/lib/queryClient";
import type { Customer, CustomerAddress, OrderRequest, Product } from "@shared/schema";
import fishImg from "@assets/Gemini_Generated_Image_w6wqkkw6wqkkw6wq_(1)_1772713077919.png";
import prawnsImg from "@assets/Gemini_Generated_Image_5xy0sd5xy0sd5xy0_1772713090650.png";
import chickenImg from "@assets/Gemini_Generated_Image_g0ecb4g0ecb4g0ec_1772713219972.png";
import muttonImg from "@assets/Gemini_Generated_Image_8fq0338fq0338fq0_1772713565349.png";
import masalaImg from "@assets/Gemini_Generated_Image_4e60a64e60a64e60_1772713888468.png";
import {
  User, MapPin, Plus, Pencil, Trash2,
  CheckCircle2, ChevronLeft, Home, Briefcase, Tag, Navigation,
  ShoppingBag, Clock, Truck, PackageCheck, ChevronDown, ChevronUp,
  Receipt, Package, AlertCircle, LogOut, LayoutGrid, List,
  Search, X, ChevronRight, Navigation2
} from "lucide-react";

function getFallbackImage(category: string): string {
  switch (category) {
    case "Prawns": return prawnsImg;
    case "Chicken": return chickenImg;
    case "Mutton": return muttonImg;
    case "Masalas": return masalaImg;
    default: return fishImg;
  }
}

const TYPE_OPTIONS = [
  { value: "house" as const, iconImg: iconHomeImg, label: "House" },
  { value: "office" as const, iconImg: iconBriefcaseImg, label: "Office" },
  { value: "other" as const, iconImg: null, label: "Other" },
];

const addressTypeColors: Record<string, string> = {
  house: "bg-pink-100 text-pink-700",
  office: "bg-purple-100 text-purple-700",
  other: "bg-amber-100 text-amber-700",
};

type EmptyAddress = Omit<CustomerAddress, "id">;
const emptyAddress: EmptyAddress = {
  name: "", phone: "", building: "", street: "", area: "",
  pincode: "", type: "house", label: "Home", instructions: "",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:          { label: "Order Placed",      color: "bg-yellow-100 text-yellow-700 border-yellow-200",  icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed:        { label: "Confirmed",          color: "bg-blue-100 text-blue-700 border-blue-200",        icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  out_for_delivery: { label: "Out for Delivery",   color: "bg-orange-100 text-orange-700 border-orange-200",  icon: <Truck className="w-3.5 h-3.5" /> },
  delivered:        { label: "Delivered",          color: "bg-green-100 text-green-700 border-green-200",     icon: <PackageCheck className="w-3.5 h-3.5" /> },
  cancelled:        { label: "Cancelled",          color: "bg-red-100 text-red-700 border-red-200",           icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

interface OrderItem {
  productId: string | number;
  quantity: number;
  name: string;
  price: number;
  imageUrl?: string | null;
}

const TABS = ["Profile & Addresses", "My Orders"] as const;
type Tab = typeof TABS[number];
type OrdersSubTab = "current" | "previous";

const ORDERS_PER_PAGE = 5;

function getOrderTotal(order: OrderRequest) {
  const items: OrderItem[] = Array.isArray(order.items) ? order.items as OrderItem[] : [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 49;
  const discount = (order as any).coupon?.discountAmount ?? 0;
  return subtotal + deliveryFee - discount;
}

const TRACK_STEPS = [
  { status: "pending",          label: "Order Placed",      desc: "We've received your order",       icon: ShoppingBag },
  { status: "confirmed",        label: "Confirmed",          desc: "Store confirmed your order",       icon: CheckCircle2 },
  { status: "out_for_delivery", label: "Out for Delivery",  desc: "Your order is on the way",         icon: Truck },
  { status: "delivered",        label: "Delivered",          desc: "Order delivered successfully",     icon: PackageCheck },
];
const TRACK_STATUS_ORDER = ["pending", "confirmed", "out_for_delivery", "delivered"];

function TrackOrderModal({ order, onClose }: { order: OrderRequest; onClose: () => void }) {
  const currentIdx = TRACK_STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  }) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Navigation2 className="w-4 h-4 text-primary" />
                <p className="text-sm font-bold text-foreground">Track Order</p>
              </div>
              <p className="text-xs text-muted-foreground">#{order.id}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{date}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground hover:bg-slate-200 transition-colors shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-5">
          {isCancelled ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm font-bold text-red-600">Order Cancelled</p>
              <p className="text-xs text-muted-foreground text-center">This order has been cancelled.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {TRACK_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isDone = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const isUpcoming = idx > currentIdx;
                const isLast = idx === TRACK_STEPS.length - 1;

                return (
                  <div key={step.status} className="flex gap-4">
                    {/* Icon column */}
                    <div className="flex flex-col items-center">
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isDone    ? "bg-primary text-white" :
                        isCurrent ? "bg-primary/10 text-primary ring-2 ring-primary/30" :
                                    "bg-slate-100 text-slate-300"
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <StepIcon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
                        )}
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-full ring-4 ring-primary/20 animate-ping" />
                        )}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 flex-1 my-1 min-h-[28px] rounded-full transition-all ${
                          isDone ? "bg-primary" : "bg-slate-200"
                        }`} />
                      )}
                    </div>

                    {/* Content column */}
                    <div className={`pt-2 pb-6 ${isLast ? "pb-2" : ""}`}>
                      <p className={`text-sm font-bold leading-none mb-1 ${
                        isDone ? "text-primary" : isCurrent ? "text-foreground" : "text-slate-300"
                      }`}>
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Current
                          </span>
                        )}
                      </p>
                      <p className={`text-xs ${isDone || isCurrent ? "text-muted-foreground" : "text-slate-300"}`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-0">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Delivering to</p>
              <p className="text-xs font-semibold text-foreground truncate">{order.address}, {order.deliveryArea}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, productImageMap }: { order: OrderRequest; productImageMap: Record<string, string> }) {
  const [expanded, setExpanded] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const items: OrderItem[] = Array.isArray(order.items) ? order.items as OrderItem[] : [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 49;
  const discount = (order as any).coupon?.discountAmount ?? 0;
  const total = subtotal + deliveryFee - discount;
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  }) : "";

  return (
    <>
    {showTrack && <TrackOrderModal order={order} onClose={() => setShowTrack(false)} />}
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden" data-testid={`card-order-${order.id}`}>
      <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">Order #{order.id}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowTrack(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors"
            data-testid={`button-track-${order.id}`}
          >
            <Navigation2 className="w-3 h-3" />
            Track
          </button>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${status.color}`}>
            {status.icon}
            {status.label}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        {items.slice(0, expanded ? items.length : 2).map((item, i) => {
          const resolvedImage = item.imageUrl || productImageMap[String(item.productId)] || getFallbackImage('');
          return (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                <img src={resolvedImage} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <span className="text-sm text-foreground truncate block">{item.name}</span>
                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-foreground shrink-0">₹{((item.price ?? 0) * item.quantity).toLocaleString()}</span>
          </div>
          );
        })}
        {!expanded && items.length > 2 && (
          <p className="text-xs text-muted-foreground">+{items.length - 2} more item{items.length - 2 > 1 ? "s" : ""}</p>
        )}
      </div>

      <div className="px-4 pb-3 flex items-start gap-2">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">{order.address}, {order.deliveryArea}</p>
      </div>

      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-base font-bold text-foreground">₹{total.toLocaleString()}</span>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          data-testid={`button-invoice-${order.id}`}
        >
          <Receipt className="w-3.5 h-3.5" />
          {expanded ? "Hide Invoice" : "View Invoice"}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-foreground uppercase tracking-widest">Tax Invoice</p>
                <p className="text-[11px] text-muted-foreground">FishTokri · Mumbai</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-foreground">#{String(order.id).padStart(6, "0")}</p>
                <p className="text-[11px] text-muted-foreground">{date}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 space-y-0.5">
              <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wide">Bill To</p>
              <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
              <p className="text-xs text-muted-foreground">{order.phone}</p>
              <p className="text-xs text-muted-foreground">{order.address}, {order.deliveryArea}</p>
            </div>

            <div>
              <div className="flex text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pb-1.5 border-b border-slate-100">
                <span className="flex-1">Item</span>
                <span className="w-10 text-center">Qty</span>
                <span className="w-20 text-right">Rate</span>
                <span className="w-20 text-right">Amount</span>
              </div>
              <div className="space-y-0">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center py-2 border-b border-slate-50 text-sm">
                    <span className="flex-1 text-foreground">{item.name}</span>
                    <span className="w-10 text-center text-muted-foreground">{item.quantity}</span>
                    <span className="w-20 text-right text-muted-foreground">₹{item.price.toLocaleString()}</span>
                    <span className="w-20 text-right font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount ({(order as any).coupon?.code})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST (5%)</span><span>Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-slate-200">
                <span>Total Paid</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {order.notes && (
              <div className="bg-amber-50 rounded-lg p-2.5">
                <p className="text-[11px] font-semibold text-amber-700 mb-0.5">Order Notes</p>
                <p className="text-xs text-amber-600">{order.notes}</p>
              </div>
            )}
            <p className="text-[11px] text-center text-muted-foreground pt-1">Thank you for shopping with FishTokri! 🐟</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

function OrderGridCard({ order, productImageMap }: { order: OrderRequest; productImageMap: Record<string, string> }) {
  const items: OrderItem[] = Array.isArray(order.items) ? order.items as OrderItem[] : [];
  const total = getOrderTotal(order);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  }) : "";
  const time = order.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit"
  }) : "";

  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col" data-testid={`card-grid-order-${order.id}`}>
      <div className="px-3 pt-3 pb-2 flex items-center justify-between gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Package className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      <div className="px-3 pb-2 flex-1 space-y-1">
        <p className="text-[11px] font-bold text-foreground truncate">#{String(order.id).slice(-8)}</p>
        <p className="text-[10px] text-muted-foreground">{date} · {time}</p>
        <div className="pt-1 space-y-1.5">
          {items.slice(0, 2).map((item, i) => {
            const resolvedImage = item.imageUrl || productImageMap[String(item.productId)] || getFallbackImage('');
            return (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                <img src={resolvedImage} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-foreground truncate">
                <span className="text-muted-foreground">{item.quantity}×</span> {item.name}
              </p>
            </div>
            );
          })}
          {items.length > 2 && (
            <p className="text-[10px] text-muted-foreground">+{items.length - 2} more</p>
          )}
        </div>
      </div>

      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">₹{total.toLocaleString()}</span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[70px]">{order.deliveryArea}</span>
        </div>
      </div>
    </div>
  );
}

interface OrderFilters {
  search: string;
  status: string;
}

type OrderSort = "newest" | "oldest" | "highest" | "lowest";

const emptyFilters: OrderFilters = { search: "", status: "" };

const STATUS_PILLS = [
  { value: "", label: "All" },
  { value: "pending", label: "Placed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "out_for_delivery", label: "On the way" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const SORT_OPTIONS: { value: OrderSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
];

function applyFilters(orders: OrderRequest[], filters: OrderFilters): OrderRequest[] {
  return orders.filter(order => {
    const items: OrderItem[] = Array.isArray(order.items) ? order.items as OrderItem[] : [];
    if (filters.status && order.status !== filters.status) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchId = String(order.id).toLowerCase().includes(q);
      const matchItem = items.some(i => i.name.toLowerCase().includes(q));
      if (!matchId && !matchItem) return false;
    }
    return true;
  });
}

function applySorting(orders: OrderRequest[], sort: OrderSort): OrderRequest[] {
  return [...orders].sort((a, b) => {
    if (sort === "newest" || sort === "oldest") {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sort === "newest" ? db - da : da - db;
    }
    const ta = getOrderTotal(a);
    const tb = getOrderTotal(b);
    return sort === "highest" ? tb - ta : ta - tb;
  });
}

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { customer, isLoading: customerLoading, refetch, logout } = useCustomer();
  const { selectedSubHub } = useHub();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("Profile & Addresses");
  const [ordersSubTab, setOrdersSubTab] = useState<OrdersSubTab>("current");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState({ name: "", email: "", dateOfBirth: "" });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addressForm, setAddressForm] = useState<EmptyAddress>(emptyAddress);
  const [useAccountDetails, setUseAccountDetails] = useState(false);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState<OrderFilters>(emptyFilters);
  const [sort, setSort] = useState<OrderSort>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const hasActiveFilters = filters.search !== "" || filters.status !== "";

  const updateFilter = (key: keyof OrderFilters, value: string) => {
    setFilters(f => ({ ...f, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (customer) {
      setDraftProfile({
        name: customer.name || "",
        email: customer.email || "",
        dateOfBirth: customer.dateOfBirth || "",
      });
    }
  }, [customer]);

  useEffect(() => {
    setCurrentPage(1);
  }, [ordersSubTab]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderRequest[]>({
    queryKey: ["/api/customer/me/orders"],
    queryFn: async () => {
      const res = await fetch("/api/customer/me/orders");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!customer && activeTab === "My Orders",
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedSubHub?.dbName],
    enabled: !!customer && activeTab === "My Orders" && !!selectedSubHub,
    staleTime: 60 * 1000,
  });

  const productImageMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const p of products) map[p.id] = p.imageUrl || getFallbackImage(p.category || '');
    return map;
  }, [products]);

  const currentOrders = useMemo(() => orders.filter(o => ["pending", "confirmed", "out_for_delivery"].includes(o.status)), [orders]);
  const previousOrders = useMemo(() => orders.filter(o => ["delivered", "cancelled"].includes(o.status)), [orders]);

  const activeOrders = ordersSubTab === "current" ? currentOrders : previousOrders;
  const filteredOrders = useMemo(() => applySorting(applyFilters(activeOrders, filters), sort), [activeOrders, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string | null; email?: string | null; dateOfBirth?: string | null }) =>
      apiRequest("PATCH", "/api/customer/me", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/me"] });
      setEditingProfile(false);
      toast({ title: "Profile updated" });
    },
    onError: () => toast({ title: "Failed to update profile", variant: "destructive" }),
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: EmptyAddress) => apiRequest("POST", "/api/customer/me/addresses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/me"] });
      cancelForm();
      toast({ title: "Address added" });
    },
    onError: () => toast({ title: "Failed to add address", variant: "destructive" }),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmptyAddress> }) =>
      apiRequest("PATCH", `/api/customer/me/addresses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/me"] });
      cancelForm();
      toast({ title: "Address updated" });
    },
    onError: () => toast({ title: "Failed to update address", variant: "destructive" }),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/customer/me/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/me"] });
      toast({ title: "Address removed" });
    },
    onError: () => toast({ title: "Failed to remove address", variant: "destructive" }),
  });

  const openAddForm = () => {
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setUseAccountDetails(false);
    setShowAddressForm(true);
  };

  const openEditForm = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setAddressForm({
      name: addr.name, phone: addr.phone, building: addr.building,
      street: addr.street, area: addr.area, pincode: addr.pincode || "",
      type: addr.type, label: addr.label, instructions: addr.instructions,
    });
    setUseAccountDetails(false);
    setShowAddressForm(true);
  };

  const cancelForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressForm(emptyAddress);
    setUseAccountDetails(false);
  };

  const handleUseAccountDetails = (v: boolean) => {
    setUseAccountDetails(v);
    if (v) setAddressForm(f => ({
      ...f,
      name: customer?.name || "",
      phone: customer?.phone || "",
    }));
  };

  const saveAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.building || !addressForm.area) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(addressForm.phone.trim())) {
      toast({ title: "Enter a valid 10-digit mobile number", variant: "destructive" });
      return;
    }
    const label = addressForm.type === "other"
      ? (addressForm.label || "Other")
      : addressForm.type === "house" ? "Home" : "Office";
    const entry = { ...addressForm, label };
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data: entry });
    } else {
      addAddressMutation.mutate(entry);
    }
  };

  if (customerLoading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to continue</h1>
            <p className="text-muted-foreground text-sm">Login with your mobile number to view your profile and orders.</p>
          </div>
          <Button
            onClick={() => setOtpModalOpen(true)}
            className="rounded-xl bg-primary text-white px-8 font-semibold"
            data-testid="button-login"
          >
            Login / Sign up
          </Button>
        </main>
        <OtpModal open={otpModalOpen} onClose={() => setOtpModalOpen(false)} />
      </div>
    );
  }

  const addresses = customer.addresses || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back + Centered Title with Lottie animations */}
        <div className="relative flex items-center justify-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="absolute left-0 rounded-full border border-border/50 bg-white"
            data-testid="button-profile-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 sm:gap-4">
            <Lottie
              animationData={profileAnim1}
              loop
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0"
            />
            <h1 className="text-xl sm:text-2xl font-medium text-foreground tracking-tight">My Profile</h1>
            <Lottie
              animationData={profileAnim2}
              loop
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ backgroundColor: isActive ? "#364F9F" : "#F05B4E" }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
                data-testid={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {tab === "Profile & Addresses" && (
                  <img src={headerUserImg} alt="" className="w-4 h-4 object-contain brightness-0 invert" />
                )}
                {tab === "My Orders" && (
                  <img src={headerCartImg} alt="" className="w-4 h-4 object-contain brightness-0 invert" />
                )}
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── Profile & Addresses Tab ── */}
        {activeTab === "Profile & Addresses" && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <img src={headerUserImg} alt="" className="w-5 h-5 object-contain" />
                  <h2 className="text-base font-medium text-foreground">Profile Details</h2>
                </div>
                {!editingProfile && (
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => {
                      setDraftProfile({ name: customer.name || "", email: customer.email || "", dateOfBirth: customer.dateOfBirth || "" });
                      setEditingProfile(true);
                    }}
                    className="rounded-full text-muted-foreground hover:text-[#364F9F]"
                    data-testid="button-edit-profile"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {editingProfile ? (
                <div className="space-y-5">
                  {([
                    { field: "name" as const, label: "Full Name", placeholder: "Your name", type: "text" },
                    { field: "email" as const, label: "Email", placeholder: "you@example.com", type: "email" },
                  ] as const).map(({ field, label, placeholder, type }) => (
                    <div key={field} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{label}</Label>
                      <input
                        type={type}
                        value={draftProfile[field]}
                        onChange={e => setDraftProfile(p => ({ ...p, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors"
                        data-testid={`input-profile-${field}`}
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                    <input
                      type="date"
                      value={draftProfile.dateOfBirth}
                      onChange={e => setDraftProfile(p => ({ ...p, dateOfBirth: e.target.value }))}
                      onClick={(e) => {
                        const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                        if (typeof el.showPicker === "function") el.showPicker();
                      }}
                      className="dob-input w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors cursor-pointer"
                      data-testid="input-profile-dob"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 rounded-xl text-white hover:opacity-90"
                      style={{ backgroundColor: "#F05B4E" }}
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 rounded-xl text-white hover:opacity-90"
                      style={{ backgroundColor: "#364F9F" }}
                      disabled={updateProfileMutation.isPending}
                      onClick={() => {
                        if (draftProfile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draftProfile.email.trim())) {
                          toast({ title: "Enter a valid email address", variant: "destructive" });
                          return;
                        }
                        updateProfileMutation.mutate({
                          name: draftProfile.name || null,
                          email: draftProfile.email || null,
                          dateOfBirth: draftProfile.dateOfBirth || null,
                        });
                      }}
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {[
                    { label: "Phone", value: customer.phone, verified: true },
                    { label: "Name", value: customer.name },
                    { label: "Email", value: customer.email },
                    {
                      label: "Date of Birth",
                      value: customer.dateOfBirth
                        ? new Date(customer.dateOfBirth).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : null,
                    },
                  ].map(({ label, value, verified }) => (
                    <div key={label} className="py-3">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      {value
                        ? <p className="font-bold text-foreground">{value}</p>
                        : <p className="font-normal italic text-muted-foreground text-sm">Not set</p>}
                      {verified && <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Verified</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Addresses section */}
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <img src={headerLocationImg} alt="" className="w-5 h-5 object-contain" />
                  <h2 className="text-base font-medium text-foreground">Saved Addresses</h2>
                </div>
                {!showAddressForm ? (
                  <Button
                    variant="ghost" size="sm"
                    onClick={openAddForm}
                    className="gap-1.5 rounded-xl text-xs hover:opacity-90"
                    style={{ color: "#364F9F" }}
                    data-testid="button-add-address"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </Button>
                ) : null}
              </div>

              {showAddressForm && (
                <div className="space-y-3 mb-5 pb-5 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{editingAddress ? "Edit Address" : "New Address"}</p>
                    <Button variant="ghost" size="icon" onClick={cancelForm} className="w-7 h-7 rounded-full text-muted-foreground">
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {customer.name && (
                    <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3 border border-border/40">
                      <Checkbox id="use-account-profile" checked={useAccountDetails} onCheckedChange={v => handleUseAccountDetails(!!v)} className="mt-0.5" />
                      <div>
                        <label htmlFor="use-account-profile" className="text-sm font-semibold text-foreground cursor-pointer">Use my account details</label>
                        <p className="text-xs text-muted-foreground mt-0.5">{customer.name} · {customer.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Full Name *</Label>
                      <input
                        value={addressForm.name}
                        onChange={e => setAddressForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Recipient name"
                        className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors"
                        data-testid="input-address-name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Phone *</Label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={addressForm.phone}
                        onChange={e => setAddressForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                        placeholder="10-digit mobile"
                        className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors"
                        data-testid="input-address-phone"
                      />
                      {addressForm.phone && !/^[6-9]\d{9}$/.test(addressForm.phone) && (
                        <p className="text-[10px] mt-0.5" style={{ color: "#F05B4E" }}>Enter a valid 10-digit number</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Building / Flat No *</Label>
                    <input
                      value={addressForm.building}
                      onChange={e => setAddressForm(f => ({ ...f, building: e.target.value }))}
                      placeholder="Wing A, Flat 302, Building Name"
                      className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors"
                      data-testid="input-address-building"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Street / Locality</Label>
                    <input
                      value={addressForm.street}
                      onChange={e => setAddressForm(f => ({ ...f, street: e.target.value }))}
                      placeholder="Street name or society"
                      className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors"
                      data-testid="input-address-street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Area / Suburb *</Label>
                      <input
                        value={addressForm.area}
                        onChange={e => setAddressForm(f => ({ ...f, area: e.target.value }))}
                        placeholder="e.g. Thane West"
                        className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors"
                        data-testid="input-address-area"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Pincode</Label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={6}
                        value={addressForm.pincode}
                        onChange={e => setAddressForm(f => ({ ...f, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                        placeholder="400601"
                        className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm transition-colors"
                        data-testid="input-address-pincode"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Address Type</Label>
                    <div className="flex gap-2">
                      {TYPE_OPTIONS.map(opt => {
                        const selected = addressForm.type === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setAddressForm(f => ({
                              ...f, type: opt.value,
                              label: opt.value === "house" ? "Home" : opt.value === "office" ? "Office" : f.label,
                            }))}
                            style={{ backgroundColor: selected ? "#364F9F" : "#F05B4E", borderColor: selected ? "#364F9F" : "#F05B4E" }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border text-white transition-all hover:opacity-90"
                            data-testid={`button-address-type-${opt.value}`}
                          >
                            {opt.iconImg && (
                              <img src={opt.iconImg} alt="" className="w-3.5 h-3.5 object-contain brightness-0 invert" />
                            )}
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    {addressForm.type === "other" && (
                      <Input
                        value={addressForm.label}
                        onChange={e => setAddressForm(f => ({ ...f, label: e.target.value }))}
                        placeholder='Custom label (e.g. "Parents Home")'
                        className="rounded-xl border-border/60 text-sm"
                        data-testid="input-address-custom-label"
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Delivery Instructions</Label>
                    <textarea
                      value={addressForm.instructions}
                      onChange={e => setAddressForm(f => ({ ...f, instructions: e.target.value }))}
                      placeholder="Leave at door, ring bell twice, etc."
                      rows={2}
                      className="w-full bg-transparent border-0 border-b border-border/60 focus:border-[#364F9F] focus:outline-none px-0 py-1.5 text-sm resize-none transition-colors"
                      data-testid="input-address-instructions"
                    />
                  </div>
                  <div className="flex gap-2 pt-3">
                    <Button
                      onClick={cancelForm}
                      className="flex-1 rounded-xl text-white font-medium hover:opacity-90"
                      style={{ backgroundColor: "#F05B4E" }}
                      data-testid="button-cancel-address"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={saveAddress}
                      disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                      className="flex-1 rounded-xl text-white font-medium hover:opacity-90"
                      style={{ backgroundColor: "#364F9F" }}
                      data-testid="button-save-address"
                    >
                      {(addAddressMutation.isPending || updateAddressMutation.isPending) ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                    </Button>
                  </div>
                </div>
              )}

              {addresses.length === 0 && !showAddressForm ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">No saved addresses yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="rounded-2xl border border-border/50 bg-slate-50/50 p-4" data-testid={`card-address-${addr.id}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          {(addr.type === "house" || addr.type === "office") && (
                            <div className="mt-0.5 shrink-0">
                              <img
                                src={addr.type === "house" ? iconHomeImg : iconBriefcaseImg}
                                alt=""
                                className="w-4 h-4 object-contain opacity-70"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-foreground">{addr.name}</p>
                              <Badge className={`text-[10px] font-semibold px-2 py-0 h-4 ${addressTypeColors[addr.type] || "bg-slate-100 text-slate-600"}`}>{addr.label}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {[addr.building, addr.street, addr.area, addr.pincode].filter(Boolean).join(", ")}
                            </p>
                            {addr.instructions && (
                              <p className="text-[11px] text-muted-foreground/70 mt-1 italic">{addr.instructions}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-full hover:bg-slate-100" onClick={() => openEditForm(addr)} data-testid={`button-edit-address-${addr.id}`}>
                            <img src={iconEditImg} alt="Edit" className="w-4 h-4 object-contain opacity-70" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="w-7 h-7 rounded-full hover:bg-slate-100"
                            disabled={deleteAddressMutation.isPending}
                            onClick={() => deleteAddressMutation.mutate(addr.id)}
                            data-testid={`button-delete-address-${addr.id}`}
                          >
                            <img src={iconBinImg} alt="Delete" className="w-4 h-4 object-contain opacity-70" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout button — bottom of Profile & Addresses tab */}
            <button
              onClick={() => setLogoutConfirmOpen(true)}
              style={{ backgroundColor: "#F05B4E" }}
              className="w-full rounded-2xl shadow-sm px-5 py-4 flex items-center justify-center gap-3 hover:opacity-90 transition-all"
              data-testid="button-logout"
            >
              <div className="w-9 h-9 shrink-0 rounded-full bg-white/15 flex items-center justify-center">
                <Lottie
                  animationData={logoutAnim}
                  loop
                  className="w-7 h-7"
                />
              </div>
              <span className="text-base font-medium text-white">Logout</span>
            </button>
          </div>
        )}

        {/* ── My Orders Tab ── */}
        {activeTab === "My Orders" && (
          <div className="space-y-3">
            {/* Active / Previous sub-tabs */}
            <div className="flex gap-1 bg-white rounded-2xl p-1 border border-border/40 shadow-sm">
              {(["current", "previous"] as OrdersSubTab[]).map(sub => (
                <button
                  key={sub}
                  onClick={() => setOrdersSubTab(sub)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    ordersSubTab === sub ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`tab-orders-${sub}`}
                >
                  {sub === "current" ? "Active" : "Previous"}
                  {sub === "current" && currentOrders.length > 0 && (
                    <span className="ml-1.5 bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{currentOrders.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Search + Sort row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={filters.search}
                  onChange={e => updateFilter("search", e.target.value)}
                  placeholder="Search by order ID or item name…"
                  className="pl-9 pr-8 h-10 rounded-xl border-border/60 bg-white text-sm"
                  data-testid="input-filter-search"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter("search", "")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-clear-search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <select
                value={sort}
                onChange={e => { setSort(e.target.value as OrderSort); setCurrentPage(1); }}
                className="h-10 text-sm rounded-xl border border-border/60 bg-white px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 shrink-0"
                data-testid="select-sort"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {STATUS_PILLS.map(pill => (
                <button
                  key={pill.value}
                  onClick={() => { updateFilter("status", pill.value); }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    filters.status === pill.value
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
                  }`}
                  data-testid={`pill-status-${pill.value || "all"}`}
                >
                  {pill.label}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="shrink-0 ml-1 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                  data-testid="button-clear-filters"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Results header: count + view toggle */}
            <div className="flex items-center justify-between px-0.5">
              <p className="text-xs text-muted-foreground">
                {filteredOrders.length === 0 ? "No orders found" : `${filteredOrders.length} order${filteredOrders.length !== 1 ? "s" : ""}${hasActiveFilters ? " (filtered)" : ""}`}
              </p>
              <div className="flex items-center gap-1 bg-white rounded-xl border border-border/40 p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  data-testid="button-view-list"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  data-testid="button-view-grid"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Orders list / grid */}
            {ordersLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "space-y-4"}>
                {[1, 2, 3].map(i => <Skeleton key={i} className={viewMode === "grid" ? "h-44 rounded-2xl" : "h-40 w-full rounded-2xl"} />)}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 bg-white rounded-2xl border border-border/50 shadow-sm">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {hasActiveFilters ? "No orders match your filters" : ordersSubTab === "current" ? "No active orders" : "No previous orders"}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary font-semibold">Clear filters</button>
                )}
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {paginatedOrders.map(order => <OrderCard key={order.id} order={order} productImageMap={productImageMap} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {paginatedOrders.map(order => <OrderGridCard key={order.id} order={order} productImageMap={productImageMap} />)}
              </div>
            )}

            {/* Pagination */}
            {!ordersLoading && filteredOrders.length > ORDERS_PER_PAGE && (
              <div className="flex items-center justify-between bg-white rounded-2xl border border-border/40 shadow-sm px-4 py-2.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  data-testid="button-page-prev"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                        currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-slate-100"
                      }`}
                      data-testid={`button-page-${page}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  data-testid="button-page-next"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Logout confirmation dialog */}
      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent className="rounded-3xl max-w-sm">
          <div className="flex justify-center -mt-2 mb-1">
            <Lottie animationData={logoutAnim} loop className="w-24 h-24" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-medium" style={{ color: "#364F9F" }}>
              Logout from FishTokri?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm">
              You'll need to login again to view your orders, addresses and continue shopping.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 sm:gap-2 sm:justify-center mt-2">
            <AlertDialogCancel
              className="flex-1 mt-0 rounded-xl border-border/60 font-medium"
              data-testid="button-logout-cancel"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => { await logout(); navigate("/"); }}
              className="flex-1 rounded-xl text-white font-medium hover:opacity-90"
              style={{ backgroundColor: "#F05B4E" }}
              data-testid="button-logout-confirm"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
