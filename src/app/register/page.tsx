"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapPicker from "@/components/MapPicker";
import { supabase } from "@/lib/supabaseClient";
import {
  LandInput,
  ZoningType,
  RoadType,
  LocationType,
  SizeType,
  UtilitiesType,
  TitleType,
} from "@/lib/scoring";

export default function RegisterPage() {
  const router = useRouter();
  const [surveyNumber, setSurveyNumber] = useState("");
  const [mapData, setMapData] = useState<{ lat: number; lng: number; areaSqFt: number } | null>(null);
  const [form, setForm] = useState<LandInput>({
    zoning: "NA_URBAN",
    road: "WIDE",
    location: "GROWTH_CORRIDOR",
    size: "MID",
    utilities: "FULL",
    title: "CLEAN",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof LandInput>(key: K, value: LandInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!mapData) {
      setError("Please draw your plot boundary on the map first.");
      return;
    }
    if (!surveyNumber) {
      setError("Survey number is required.");
      return;
    }

    setSubmitting(true);
    const { data: userData } = await supabase.auth.getUser();
    const ownerId = userData?.user?.id;

    if (!ownerId) {
      setError("Please log in first.");
      setSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("land_registrations")
      .insert({
        owner_id: ownerId,
        survey_number: surveyNumber,
        latitude: mapData.lat,
        longitude: mapData.lng,
        area_sq_ft: mapData.areaSqFt,
        zoning: form.zoning,
        road: form.road,
        location: form.location,
        size: form.size,
        utilities: form.utilities,
        title: form.title,
        status: "SUBMITTED",
      })
      .select()
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/register/result?id=${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold">Register Your Land</h1>

      <div>
        <label className="block text-sm font-medium mb-1">Survey Number</label>
        <input
          value={surveyNumber}
          onChange={(e) => setSurveyNumber(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="e.g. 142/3"
        />
      </div>

      <MapPicker onChange={setMapData} />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Zoning"
          value={form.zoning}
          onChange={(v) => updateField("zoning", v as ZoningType)}
          options={[
            ["NA_URBAN", "NA-sanctioned / Urban-adjacent"],
            ["AGRI_LARGE", "Agricultural (large)"],
            ["COMMERCIAL_INDUSTRIAL", "Commercial / Industrial"],
          ]}
        />
        <Select
          label="Road Access"
          value={form.road}
          onChange={(v) => updateField("road", v as RoadType)}
          options={[
            ["WIDE", "Wide (>30ft), highway-facing"],
            ["NARROW", "Narrow (<15ft), interior"],
          ]}
        />
        <Select
          label="Location Context"
          value={form.location}
          onChange={(v) => updateField("location", v as LocationType)}
          options={[
            ["GROWTH_CORRIDOR", "Near growth corridor / city limit"],
            ["REMOTE", "Remote / rural"],
          ]}
        />
        <Select
          label="Plot Size"
          value={form.size}
          onChange={(v) => updateField("size", v as SizeType)}
          options={[
            ["SMALL", "Small (<0.5 acre)"],
            ["MID", "Mid (0.5-5 acres)"],
            ["LARGE", "Large (>5 acres)"],
          ]}
        />
        <Select
          label="Utilities"
          value={form.utilities}
          onChange={(v) => updateField("utilities", v as UtilitiesType)}
          options={[
            ["FULL", "Full (water + power)"],
            ["NONE", "None"],
          ]}
        />
        <Select
          label="Title Status"
          value={form.title}
          onChange={(v) => updateField("title", v as TitleType)}
          options={[
            ["CLEAN", "Clean, single owner"],
            ["DISPUTED", "Disputed / multi-owner"],
          ]}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand hover:bg-brand-dark text-white px-5 py-3 rounded-lg font-medium disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Get My Recommendation"}
      </button>
    </form>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md px-3 py-2"
      >
        {options.map(([val, text]) => (
          <option key={val} value={val}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
