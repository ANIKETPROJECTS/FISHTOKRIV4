import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useCustomer } from "@/context/CustomerContext";
import { ArrowLeft, X, ShieldCheck } from "lucide-react";
import Lottie from "lottie-react";
import fishAnimation from "@assets/fish_1776404909449.json";
import flagImg from "@assets/flag_(1)_1776403319572.png";
import { FishTokriLogo } from "@/components/storefront/FishTokriLogo";

type Step = "phone" | "otp";

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
}

export function OtpModal({ open, onClose }: OtpModalProps) {
  const [step, setStep] = useState<Step>("phone");
  const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(10).fill(""));
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { refetch } = useCustomer();
  const [, navigate] = useLocation();

  const p0 = useRef<HTMLInputElement>(null);
  const p1 = useRef<HTMLInputElement>(null);
  const p2 = useRef<HTMLInputElement>(null);
  const p3 = useRef<HTMLInputElement>(null);
  const p4 = useRef<HTMLInputElement>(null);
  const p5 = useRef<HTMLInputElement>(null);
  const p6 = useRef<HTMLInputElement>(null);
  const p7 = useRef<HTMLInputElement>(null);
  const p8 = useRef<HTMLInputElement>(null);
  const p9 = useRef<HTMLInputElement>(null);
  const phoneRefs = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9];

  const o0 = useRef<HTMLInputElement>(null);
  const o1 = useRef<HTMLInputElement>(null);
  const o2 = useRef<HTMLInputElement>(null);
  const o3 = useRef<HTMLInputElement>(null);
  const otpRefs = [o0, o1, o2, o3];

  const phone = phoneDigits.join("");

  useEffect(() => {
    if (open) {
      setStep("phone");
      setPhoneDigits(Array(10).fill(""));
      setOtp(["", "", "", ""]);
      setTimeout(() => phoneRefs[0].current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }
  }, [step]);

  if (!open) return null;

  const handlePhoneDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...phoneDigits];
    next[index] = digit;
    setPhoneDigits(next);
    if (digit && index < 9) {
      phoneRefs[index + 1].current?.focus();
    }
  };

  const handlePhoneKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !phoneDigits[index] && index > 0) {
      phoneRefs[index - 1].current?.focus();
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 10);
    if (text.length > 0) {
      e.preventDefault();
      const next = Array(10).fill("");
      text.split("").forEach((d, i) => { next[i] = d; });
      setPhoneDigits(next);
      const focusIdx = Math.min(text.length, 9);
      phoneRefs[focusIdx].current?.focus();
    }
  };

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) {
      toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/customer/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to send OTP");
      }
      setStep("otp");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (text.length === 4) {
      e.preventDefault();
      setOtp(text.split(""));
      otpRefs[3].current?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      toast({ title: "Enter the 4-digit OTP", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/customer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      refetch();
      onClose();
      navigate("/profile");
      toast({ title: "Welcome to FishTokri! 🐟" });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filledCount = phoneDigits.filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-[400px] rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-300 overflow-hidden">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
          data-testid="button-close-otp-modal"
        >
          <X className="w-4 h-4" />
        </button>

        {step === "phone" ? (
          <div className="px-6 pt-7 pb-7">
            {/* Logo + Lottie */}
            <div className="flex flex-col items-center mb-5">
              <FishTokriLogo className="h-7 w-auto mb-2" />
              <div className="w-24 h-24 -my-1">
                <Lottie animationData={fishAnimation} loop autoplay />
              </div>
              <h2 className="text-xl font-bold text-slate-800 text-center mt-2">
                Login / Sign up
              </h2>
              <p className="text-sm text-slate-500 mt-1 text-center">
                Enter your mobile number to continue
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex gap-1 mb-3">
              {Array(10).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all duration-200"
                  style={{ background: i < filledCount ? "#364F9F" : "#e2e8f0" }}
                />
              ))}
            </div>

            {/* Phone boxes */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <img src={flagImg} alt="India" className="w-5 h-5 rounded-full object-cover shrink-0" />
                <span className="text-sm font-semibold text-slate-600 shrink-0">+91</span>
              </div>
              <div className="flex gap-1">
                {phoneRefs.map((ref, i) => (
                  <input
                    key={i}
                    ref={ref}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={phoneDigits[i]}
                    onChange={e => handlePhoneDigit(i, e.target.value)}
                    onKeyDown={e => handlePhoneKeyDown(i, e)}
                    onPaste={handlePhonePaste}
                    className="flex-1 min-w-0 h-10 text-center text-sm font-bold border-2 rounded-lg outline-none transition-all"
                    style={{
                      borderColor: phoneDigits[i] ? "#364F9F" : "#e2e8f0",
                      background: phoneDigits[i] ? "#364F9F0A" : "#f8fafc",
                      color: "#1e293b",
                    }}
                    data-testid={`input-phone-digit-${i}`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={loading || filledCount !== 10}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #364F9F 0%, #2a3d80 100%)" }}
              data-testid="button-send-otp"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending OTP...
                </span>
              ) : "Get My OTP →"}
            </button>

            <p className="text-[11px] text-center text-slate-400 mt-3">
              By continuing, you agree to our{" "}
              <span className="underline cursor-pointer" style={{ color: "#364F9F" }}>Terms</span>
              {" & "}
              <span className="underline cursor-pointer" style={{ color: "#364F9F" }}>Privacy Policy</span>
            </p>
          </div>
        ) : (
          <div className="px-6 pt-7 pb-7">
            <button
              onClick={() => setStep("phone")}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-5 -ml-1 transition-colors"
              data-testid="button-back-to-phone"
            >
              <ArrowLeft className="w-4 h-4" /> Change number
            </button>

            <div className="flex flex-col items-center mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "linear-gradient(135deg, #364F9F15, #364F9F30)" }}
              >
                <ShieldCheck className="w-7 h-7" style={{ color: "#364F9F" }} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center">Verify it's you!</h3>
              <p className="text-sm text-slate-400 mt-1 text-center">
                Code sent to{" "}
                <span className="font-semibold text-slate-700">+91 {phone}</span>
              </p>
            </div>

            <div className="flex gap-3 justify-center mb-5">
              {otpRefs.map((ref, i) => (
                <input
                  key={i}
                  ref={ref}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i]}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  onPaste={handleOtpPaste}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-2xl outline-none transition-all"
                  style={{
                    borderColor: otp[i] ? "#364F9F" : "#e2e8f0",
                    background: otp[i] ? "#364F9F08" : "#f8fafc",
                    color: "#1e293b",
                  }}
                  data-testid={`input-otp-digit-${i}`}
                />
              ))}
            </div>

            <button
              onClick={handleOtpSubmit}
              disabled={loading || otp.join("").length !== 4}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #364F9F 0%, #2a3d80 100%)" }}
              data-testid="button-verify-otp"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </span>
              ) : "Verify & Dive In 🐟"}
            </button>

            <div className="flex items-center justify-between mt-4">
              <p className="text-[11px] text-slate-400">
                Didn't get it?{" "}
                <span
                  className="font-semibold cursor-pointer"
                  style={{ color: "#F05B4E" }}
                  onClick={() => setStep("phone")}
                >
                  Resend
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Test: <span className="font-bold text-slate-600">1234</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
