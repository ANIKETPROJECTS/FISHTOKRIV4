import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { SavedAddress } from "@/components/storefront/CartDrawer";
import { ChevronLeft, Home, Briefcase, Tag, Navigation } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "house" as const, icon: <Home className="w-3.5 h-3.5" />, label: "House" },
  { value: "office" as const, icon: <Briefcase className="w-3.5 h-3.5" />, label: "Office" },
  { value: "other" as const, icon: <Tag className="w-3.5 h-3.5" />, label: "Other" },
];

const emptyForm = {
  name: "", phone: "", building: "", street: "", area: "",
  pincode: "", type: "house" as "house" | "office" | "other",
  label: "", instructions: "",
};

export default function AddAddress() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [useAccountDetails, setUseAccountDetails] = useState(false);
  const [profileData, setProfileData] = useState<{ name: string; phone: string } | null>(null);
  const [instructionLen, setInstructionLen] = useState(0);

  useEffect(() => {
    const profile = localStorage.getItem("fishtokri_profile");
    if (profile) {
      const p = JSON.parse(profile);
      setProfileData({ name: p.name || "", phone: p.phone || "" });
    }
  }, []);

  const handleUseAccount = (v: boolean) => {
    setUseAccountDetails(v);
    if (v && profileData) {
      setForm(f => ({ ...f, name: profileData.name, phone: profileData.phone }));
    }
  };

  const save = () => {
    if (!form.name || !form.phone || !form.building || !form.area) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const label =
      form.type === "other" ? (form.label || "Other") :
      form.type === "house" ? "Home" : "Office";
    const newAddr: SavedAddress = { ...form, label, id: Date.now().toString() };
    const existing: SavedAddress[] = JSON.parse(localStorage.getItem("fishtokri_addresses") || "[]");
    localStorage.setItem("fishtokri_addresses", JSON.stringify([...existing, newAddr]));
    toast({ title: "Address saved!" });
    navigate(-1 as any);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="sticky top-0 z-50 bg-white border-b border-border/30 px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1 as any)} className="rounded-full border border-border/40">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Add Delivery Address</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Use account details */}
        {profileData?.name && (
          <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-border/40">
            <Checkbox id="use-account" checked={useAccountDetails} onCheckedChange={v => handleUseAccount(!!v)} className="mt-0.5" />
            <div>
              <label htmlFor="use-account" className="text-sm font-semibold text-foreground cursor-pointer block">Use my account details</label>
              <p className="text-xs text-muted-foreground mt-0.5">{profileData.name}, {profileData.phone}</p>
            </div>
          </div>
        )}

        {!useAccountDetails && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Recipient name" className="rounded-xl h-12 border-border/60 text-base" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone *</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile number" className="rounded-xl h-12 border-border/60 text-base" type="tel" />
            </div>
          </div>
        )}

        {/* Map placeholder */}
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Navigation className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Set your location on map</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap to pin your exact delivery location</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-primary/40 text-primary font-semibold shrink-0 px-4">
            Open Map
          </Button>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground">Location Details</h2>

          {/* Type toggle */}
          <div className="flex gap-2">
            {TYPE_OPTIONS.map(opt => (
              <button key={opt.value} type="button" onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  form.type === opt.value ? "bg-foreground text-white border-foreground" : "bg-white text-muted-foreground border-border/50 hover:border-foreground/30"
                }`}>
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Building / Floor *</Label>
            <Input value={form.building} onChange={e => setForm(f => ({ ...f, building: e.target.value }))} placeholder="e.g. Kairali Park, Wing A, Floor 3" className="rounded-xl h-12 border-border/60 text-base" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Street <span className="normal-case font-normal text-muted-foreground/60">(Recommended)</span>
            </Label>
            <Input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="e.g. 205, MG Road" className="rounded-xl h-12 border-border/60 text-base" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Area *</Label>
              <Input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="e.g. Thane West" className="rounded-xl h-12 border-border/60 text-base" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pincode *</Label>
              <Input value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} placeholder="400001" type="tel" maxLength={6} className="rounded-xl h-12 border-border/60 text-base" />
            </div>
          </div>

          {form.type === "other" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Save Address As *</Label>
              <Input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Room, Gym, Parents Home" className="rounded-xl h-12 border-border/60 text-base" />
            </div>
          )}
        </div>

        {/* Delivery Instructions */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-foreground">Delivery Instructions</h2>
          <Textarea
            value={form.instructions}
            onChange={e => { setForm(f => ({ ...f, instructions: e.target.value })); setInstructionLen(e.target.value.length); }}
            placeholder="e.g. Take the first left near the red gate, ring the bell twice"
            className="rounded-xl border-border/60 resize-none min-h-[80px] text-base"
            maxLength={100}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Example: Take the first left next to red gate</p>
            <p className="text-xs text-muted-foreground">{instructionLen}/100</p>
          </div>
        </div>

        <Button onClick={save} className="w-full h-14 rounded-2xl font-bold text-base bg-primary text-white shadow-lg shadow-primary/20 mt-4">
          Save Address
        </Button>
      </div>
    </div>
  );
}
