"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { scoreLand, explainRecommendation, ScoringResult, LandInput } from "@/lib/scoring";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const { data, error } = await supabase
        .from("land_registrations")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      const input: LandInput = {
        zoning: data.zoning,
        road: data.road,
        location: data.location,
        size: data.size,
        utilities: data.utilities,
        title: data.title,
      };

      const scored = scoreLand(input);
      setResult(scored);
      if (scored.primary) {
        setReason(explainRecommendation(input, scored.primary));
      }
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return <p>Loading your recommendation...</p>;
  if (!result || !result.primary) return <p>Could not generate a recommendation.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Recommendation</h1>

      {result.gated && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg p-4 text-sm">
          Your title status is marked as disputed/multi-owner. Sale, Joint
          Development, and Mortgage paths are hidden until this is resolved —
          resolving title clarity first will unlock your best options.
        </div>
      )}

      <div className="bg-white border rounded-xl p-6 space-y-2">
        <p className="text-sm text-gray-500">Best fit</p>
        <h2 className="text-xl font-semibold">
          🏆 {result.primary.label} ({result.primary.score}/100)
        </h2>
        <p className="text-gray-700">{reason}</p>
      </div>

      {result.alternatives.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Also worth considering</p>
          {result.alternatives.map((alt) => (
            <div key={alt.path} className="bg-white border rounded-xl p-4">
              <p className="font-medium">
                {alt.label} ({alt.score}/100)
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        This recommendation is based on your submitted details. Document
        verification is still pending — your listing will go live once
        verified.
      </p>
    </div>
  );
}
