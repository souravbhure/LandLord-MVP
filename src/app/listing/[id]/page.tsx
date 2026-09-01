"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LandRegistration } from "@/lib/types";

export default function ListingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<LandRegistration | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("land_registrations")
        .select("*")
        .eq("id", params.id)
        .eq("status", "VERIFIED")
        .single();
      if (data) {
        setListing({
          id: data.id,
          ownerId: data.owner_id,
          surveyNumber: data.survey_number,
          latitude: data.latitude,
          longitude: data.longitude,
          areaSqFt: data.area_sq_ft,
          zoning: data.zoning,
          road: data.road,
          location: data.location,
          size: data.size,
          utilities: data.utilities,
          title: data.title,
          photos: data.photos ?? [],
          landDocs: [],
          ownerDocs: [],
          status: data.status,
          createdAt: data.created_at,
        });
      }
    }
    load();
  }, [params.id]);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("leads").insert({
      registration_id: params.id,
      name,
      phone,
    });
    setSubmitted(true);
  }

  if (!listing) return <p>Loading listing, or it&apos;s not yet verified.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plot — Survey No. {listing.surveyNumber}</h1>
        <p className="text-gray-500">{listing.areaSqFt.toLocaleString()} sq. ft.</p>
      </div>

      <div className="bg-white border rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
        <Info label="Zoning" value={listing.zoning} />
        <Info label="Road Access" value={listing.road} />
        <Info label="Location" value={listing.location} />
        <Info label="Utilities" value={listing.utilities} />
      </div>

      {!showLeadForm && !submitted && (
        <button
          onClick={() => setShowLeadForm(true)}
          className="bg-brand hover:bg-brand-dark text-white px-5 py-3 rounded-lg font-medium"
        >
          Get Owner Details
        </button>
      )}

      {showLeadForm && !submitted && (
        <form onSubmit={submitLead} className="space-y-3 max-w-sm">
          <input
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            required
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg font-medium"
          >
            Submit
          </button>
        </form>
      )}

      {submitted && (
        <p className="text-green-700">
          Thanks! The owner will be notified and can reach out to you directly.
        </p>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
