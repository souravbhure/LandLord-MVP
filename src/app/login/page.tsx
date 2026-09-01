"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function sendOtp() {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setOtpSent(true);
  }

  async function verifyOtp() {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/register");
  }

  return (
    <div className="max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Log in / Sign up</h1>
      <p className="text-sm text-gray-500">
        Requires Supabase phone auth (Twilio or MSG91) configured on your
        project. See README for setup.
      </p>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91XXXXXXXXXX"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {!otpSent ? (
        <button
          onClick={sendOtp}
          disabled={loading || !phone}
          className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <button
            onClick={verifyOtp}
            disabled={loading || !otp}
            className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
