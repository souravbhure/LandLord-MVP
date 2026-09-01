"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LandRegistration, VerificationStatus } from "@/lib/types";

// Minimal internal review screen. For MVP, verification is done manually by
// the founder — this screen just needs to make approve/reject/correction
// fast, not pretty. Swap for Retool later if this becomes a bottleneck.
export default function AdminPage() {
  const [registrations, setRegistrations] = useState<LandRegistration[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  async function load() {
    const { data } = await supabase
      .from("land_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setRegistrations(
        data.map((d: any) => ({
          id: d.id,
          ownerId: d.owner_id,
          surveyNumber: d.survey_number,
          latitude: d.latitude,
          longitude: d.longitude,
          areaSqFt: d.area_sq_ft,
          zoning: d.zoning,
          road: d.road,
          location: d.location,
          size: d.size,
          utilities: d.utilities,
          title: d.title,
          photos: d.photos ?? [],
          landDocs: d.land_docs ?? [],
          ownerDocs: d.owner_docs ?? [],
          status: d.status,
          correctionNote: d.correction_note,
          createdAt: d.created_at,
        }))
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: VerificationStatus, note?: string) {
    await supabase
      .from("land_registrations")
      .update({ status, correction_note: note ?? null })
      .eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin — Verification Queue</h1>

      {registrations.length === 0 && <p>No submissions yet.</p>}

      {registrations.map((reg) => (
        <div key={reg.id} className="bg-white border rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Survey No. {reg.surveyNumber}</p>
              <p className="text-sm text-gray-500">
                {reg.areaSqFt.toLocaleString()} sq. ft. — {reg.zoning}
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{reg.status}</span>
          </div>

          <textarea
            placeholder="Correction note (e.g. name doesn't match owner ID doc)"
            value={noteDrafts[reg.id] ?? ""}
            onChange={(e) =>
              setNoteDrafts((prev) => ({ ...prev, [reg.id]: e.target.value }))
            }
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows={2}
          />

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => updateStatus(reg.id, "VERIFIED")}
              className="bg-green-600 text-white px-3 py-1.5 rounded-md"
            >
              Approve & List
            </button>
            <button
              onClick={() => updateStatus(reg.id, "NEEDS_CORRECTION", noteDrafts[reg.id])}
              className="bg-yellow-500 text-white px-3 py-1.5 rounded-md"
            >
              Needs Correction
            </button>
            <button
              onClick={() => updateStatus(reg.id, "REJECTED", noteDrafts[reg.id])}
              className="bg-red-600 text-white px-3 py-1.5 rounded-md"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
