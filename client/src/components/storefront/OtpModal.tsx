import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCustomer } from "@/context/CustomerContext";
import Lottie from "lottie-react";
import fishAnimation from "@assets/fish_1776404909449.json";
import otpAnimation from "@assets/animation-original_1776421716629.json";
import successAnimation from "@assets/animation-original_(1)_1776422004368.json";
import flagImg from "@assets/flag_(1)_1776403319572.png";
import { FishTokriLogo } from "@/components/storefront/FishTokriLogo";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { motion, AnimatePresence } from "framer-motion";

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
}

export function OtpModal({ open, onClose }: OtpModalProps) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { toast } = useToast();
  const { refetch } = useCustomer();

  const phoneRef = useRef<HTMLInputElement>(null);
  const o0 = useRef<HTMLInputElement>(null);
  const o1 = useRef<HTMLInputElement>(null);
  const o2 = useRef<HTMLInputElement>(null);
  const o3 = useRef<HTMLInputElement>(null);
  const otpRefs = [o0, o1, o2, o3];

  useEffect(() => {
    if (open) {
      setPhone("");
      setOtpSent(false);
      setShowSuccess(false);
      setOtp(["", "", "", ""]);
      setTimeout(() => phoneRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (otpSent) {
      setTimeout(() => otpRefs[0].current?.focus(), 350);
    }
  }, [otpSent]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
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
      setOtpSent(true);
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
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const digitCount = phone.length;
  const isFull = digitCount === 10;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] p-0 overflow-y-auto border-0 shadow-2xl bg-white flex flex-col"
        data-testid="auth-sheet"
        aria-describedby={undefined}
      >
        <VisuallyHidden>
          <SheetTitle>Login to FishTokri</SheetTitle>
        </VisuallyHidden>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center"
            >
              <div className="w-56 h-56">
                <Lottie animationData={successAnimation} loop={false} autoplay />
              </div>
              <p className="text-xl font-bold text-slate-800 mt-2">Welcome to FishTokri!</p>
              <p className="text-sm text-slate-400 mt-1">Fresh seafood & meat at your doorstep 🐟</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col flex-1 px-7 pt-10 pb-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <FishTokriLogo className="h-16 w-auto mb-1" />
            <div className="w-24 h-24">
              <Lottie animationData={fishAnimation} loop autoplay />
            </div>
            <h2 className="text-[22px] font-bold text-slate-800 text-center leading-snug mt-1">
              Welcome!{" "}
              <span style={{ color: "#364F9F" }}>Fresh seafood & meat</span>
              <br />at your doorstep
            </h2>
            <p className="text-sm text-slate-400 mt-2 text-center">
              Enter your mobile number to continue
            </p>
          </div>

          {/* Phone Input — no card, open style */}
          <div className="mb-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 transition-all duration-200"
              style={{ borderColor: focused ? "#364F9F" : isFull ? "#364F9F66" : "#e2e8f0" }}
            >
              {/* Flag + code */}
              <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-200">
                <img src={flagImg} alt="India" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-base font-bold text-slate-700">+91</span>
              </div>

              {/* Input */}
              <input
                ref={phoneRef}
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="0000000000"
                disabled={otpSent}
                className="flex-1 bg-transparent outline-none text-3xl font-bold tracking-[0.12em] text-slate-800 placeholder:text-slate-300 placeholder:font-light placeholder:text-2xl disabled:opacity-60 w-full"
                data-testid="input-phone"
                style={{ caretColor: "#364F9F" }}
              />
            </div>

            {/* Digit progress dots — 10 fixed dots */}
            <div className="flex gap-[5px] mt-2 pl-[72px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    backgroundColor: i < digitCount ? "#364F9F" : "#e2e8f0",
                    scaleX: i === digitCount - 1 ? [1, 1.5, 1] : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex-1 h-[3px] rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Get OTP button */}
          <AnimatePresence>
            {!otpSent && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={handlePhoneSubmit}
                  disabled={loading || !isFull}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP Section — slides in below */}
          <AnimatePresence>
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {/* OTP lottie + header */}
                <div className="flex flex-col items-center mb-5">
                  <div className="w-28 h-28 -mt-2">
                    <Lottie animationData={otpAnimation} loop autoplay />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 text-center -mt-1">Verify it's you!</h3>
                  {/* Phone + Change number inline */}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-500">
                      Code sent to{" "}
                      <span className="font-semibold text-slate-700">+91 {phone}</span>
                    </p>
                    <button
                      className="text-xs font-semibold underline transition-colors"
                      style={{ color: "#364F9F" }}
                      onClick={() => { setOtpSent(false); setOtp(["", "", "", ""]); }}
                      data-testid="button-back-to-phone"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* OTP Boxes */}
                <div className="flex gap-3 justify-center mb-5">
                  {otpRefs.map((ref, i) => (
                    <motion.input
                      key={i}
                      ref={ref}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i]}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.07, duration: 0.2, ease: "backOut" }}
                      whileFocus={{ scale: 1.08 }}
                      className="w-[62px] h-[62px] text-center text-2xl font-bold border-2 rounded-2xl outline-none transition-colors"
                      style={{
                        borderColor: otp[i] ? "#364F9F" : "#e2e8f0",
                        background: otp[i] ? "#364F9F0A" : "#f8fafc",
                        color: "#1e293b",
                      }}
                      data-testid={`input-otp-digit-${i}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleOtpSubmit}
                  disabled={loading || otp.join("").length !== 4}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
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

                <p className="text-[11px] text-center text-slate-400 mt-4">
                  Didn't get it?{" "}
                  <span
                    className="font-semibold cursor-pointer"
                    style={{ color: "#F05B4E" }}
                    onClick={handlePhoneSubmit}
                  >
                    Resend OTP
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
