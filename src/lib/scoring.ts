// Land Monetization Path Scoring Engine
// Implements the weighted rules-based model drafted for MVP v1.
// See: land-monetization-scoring-model.md for the full rationale.

export type ZoningType = "NA_URBAN" | "AGRI_LARGE" | "COMMERCIAL_INDUSTRIAL";
export type RoadType = "WIDE" | "NARROW";
export type LocationType = "GROWTH_CORRIDOR" | "REMOTE";
export type SizeType = "SMALL" | "MID" | "LARGE";
export type UtilitiesType = "FULL" | "NONE";
export type TitleType = "CLEAN" | "DISPUTED";

export interface LandInput {
  zoning: ZoningType;
  road: RoadType;
  location: LocationType;
  size: SizeType;
  utilities: UtilitiesType;
  title: TitleType;
}

export type MonetizationPath =
  | "SALE"
  | "LONG_TERM_LEASE"
  | "SOLAR_LEASE"
  | "TELECOM_HOARDING_LEASE"
  | "JOINT_DEVELOPMENT"
  | "LAND_BANKING"
  | "MORTGAGE_COLLATERAL"
  | "STRUCTURE_RENTAL";

export const PATH_LABELS: Record<MonetizationPath, string> = {
  SALE: "Outright Sale",
  LONG_TERM_LEASE: "Long-Term Lease (Agri/Warehousing)",
  SOLAR_LEASE: "Solar / Renewable Lease",
  TELECOM_HOARDING_LEASE: "Telecom / Hoarding Lease",
  JOINT_DEVELOPMENT: "Joint Development (JV)",
  LAND_BANKING: "Land Banking / Hold",
  MORTGAGE_COLLATERAL: "Mortgage / Collateral",
  STRUCTURE_RENTAL: "Structure Rental",
};

const ALL_PATHS: MonetizationPath[] = [
  "SALE",
  "LONG_TERM_LEASE",
  "SOLAR_LEASE",
  "TELECOM_HOARDING_LEASE",
  "JOINT_DEVELOPMENT",
  "LAND_BANKING",
  "MORTGAGE_COLLATERAL",
  "STRUCTURE_RENTAL",
];

// Weights per factor (must sum to 1.0)
const WEIGHTS = {
  zoning: 0.25,
  road: 0.15,
  location: 0.2,
  size: 0.15,
  utilities: 0.1,
  title: 0.1,
};

// Suitability matrix: factor value -> path -> score (0-5)
const MATRIX: Record<string, Record<MonetizationPath, number>> = {
  "zoning:NA_URBAN": { SALE: 5, LONG_TERM_LEASE: 1, SOLAR_LEASE: 1, TELECOM_HOARDING_LEASE: 2, JOINT_DEVELOPMENT: 5, LAND_BANKING: 2, MORTGAGE_COLLATERAL: 4, STRUCTURE_RENTAL: 3 },
  "zoning:AGRI_LARGE": { SALE: 2, LONG_TERM_LEASE: 5, SOLAR_LEASE: 5, TELECOM_HOARDING_LEASE: 1, JOINT_DEVELOPMENT: 1, LAND_BANKING: 3, MORTGAGE_COLLATERAL: 3, STRUCTURE_RENTAL: 0 },
  "zoning:COMMERCIAL_INDUSTRIAL": { SALE: 4, LONG_TERM_LEASE: 3, SOLAR_LEASE: 2, TELECOM_HOARDING_LEASE: 4, JOINT_DEVELOPMENT: 5, LAND_BANKING: 2, MORTGAGE_COLLATERAL: 4, STRUCTURE_RENTAL: 4 },

  "road:WIDE": { SALE: 4, LONG_TERM_LEASE: 3, SOLAR_LEASE: 3, TELECOM_HOARDING_LEASE: 5, JOINT_DEVELOPMENT: 5, LAND_BANKING: 2, MORTGAGE_COLLATERAL: 3, STRUCTURE_RENTAL: 4 },
  "road:NARROW": { SALE: 2, LONG_TERM_LEASE: 4, SOLAR_LEASE: 3, TELECOM_HOARDING_LEASE: 1, JOINT_DEVELOPMENT: 1, LAND_BANKING: 3, MORTGAGE_COLLATERAL: 2, STRUCTURE_RENTAL: 2 },

  "location:GROWTH_CORRIDOR": { SALE: 5, LONG_TERM_LEASE: 2, SOLAR_LEASE: 1, TELECOM_HOARDING_LEASE: 3, JOINT_DEVELOPMENT: 5, LAND_BANKING: 4, MORTGAGE_COLLATERAL: 4, STRUCTURE_RENTAL: 3 },
  "location:REMOTE": { SALE: 1, LONG_TERM_LEASE: 4, SOLAR_LEASE: 5, TELECOM_HOARDING_LEASE: 2, JOINT_DEVELOPMENT: 1, LAND_BANKING: 3, MORTGAGE_COLLATERAL: 2, STRUCTURE_RENTAL: 1 },

  "size:SMALL": { SALE: 4, LONG_TERM_LEASE: 1, SOLAR_LEASE: 0, TELECOM_HOARDING_LEASE: 3, JOINT_DEVELOPMENT: 2, LAND_BANKING: 2, MORTGAGE_COLLATERAL: 3, STRUCTURE_RENTAL: 4 },
  "size:MID": { SALE: 4, LONG_TERM_LEASE: 4, SOLAR_LEASE: 3, TELECOM_HOARDING_LEASE: 3, JOINT_DEVELOPMENT: 5, LAND_BANKING: 3, MORTGAGE_COLLATERAL: 4, STRUCTURE_RENTAL: 3 },
  "size:LARGE": { SALE: 3, LONG_TERM_LEASE: 5, SOLAR_LEASE: 5, TELECOM_HOARDING_LEASE: 2, JOINT_DEVELOPMENT: 4, LAND_BANKING: 3, MORTGAGE_COLLATERAL: 3, STRUCTURE_RENTAL: 1 },

  "utilities:FULL": { SALE: 4, LONG_TERM_LEASE: 3, SOLAR_LEASE: 2, TELECOM_HOARDING_LEASE: 3, JOINT_DEVELOPMENT: 5, LAND_BANKING: 2, MORTGAGE_COLLATERAL: 4, STRUCTURE_RENTAL: 5 },
  "utilities:NONE": { SALE: 2, LONG_TERM_LEASE: 3, SOLAR_LEASE: 4, TELECOM_HOARDING_LEASE: 3, JOINT_DEVELOPMENT: 1, LAND_BANKING: 3, MORTGAGE_COLLATERAL: 1, STRUCTURE_RENTAL: 0 },

  "title:CLEAN": { SALE: 5, LONG_TERM_LEASE: 5, SOLAR_LEASE: 5, TELECOM_HOARDING_LEASE: 5, JOINT_DEVELOPMENT: 5, LAND_BANKING: 5, MORTGAGE_COLLATERAL: 5, STRUCTURE_RENTAL: 5 },
  "title:DISPUTED": { SALE: 0, LONG_TERM_LEASE: 1, SOLAR_LEASE: 1, TELECOM_HOARDING_LEASE: 1, JOINT_DEVELOPMENT: 0, LAND_BANKING: 3, MORTGAGE_COLLATERAL: 0, STRUCTURE_RENTAL: 1 },
};

// Paths gated off entirely when title is disputed, regardless of score
const TITLE_GATED_PATHS: MonetizationPath[] = ["SALE", "JOINT_DEVELOPMENT", "MORTGAGE_COLLATERAL"];

export interface PathResult {
  path: MonetizationPath;
  label: string;
  score: number; // 0-100
}

export interface ScoringResult {
  gated: boolean; // true if title issues suppress recommendations
  results: PathResult[]; // sorted descending by score
  primary: PathResult | null;
  alternatives: PathResult[];
}

export function scoreLand(input: LandInput): ScoringResult {
  const factorKeys = [
    { key: `zoning:${input.zoning}`, weight: WEIGHTS.zoning },
    { key: `road:${input.road}`, weight: WEIGHTS.road },
    { key: `location:${input.location}`, weight: WEIGHTS.location },
    { key: `size:${input.size}`, weight: WEIGHTS.size },
    { key: `utilities:${input.utilities}`, weight: WEIGHTS.utilities },
    { key: `title:${input.title}`, weight: WEIGHTS.title },
  ];

  const scores: PathResult[] = ALL_PATHS.map((path) => {
    let weighted = 0;
    for (const factor of factorKeys) {
      const factorScores = MATRIX[factor.key];
      const raw = factorScores ? factorScores[path] : 0;
      weighted += raw * factor.weight;
    }
    return { path, label: PATH_LABELS[path], score: Math.round(weighted * 20) };
  });

  const gated = input.title === "DISPUTED";
  const eligible = gated
    ? scores.filter((s) => !TITLE_GATED_PATHS.includes(s.path))
    : scores;

  const sorted = [...eligible].sort((a, b) => b.score - a.score);

  return {
    gated,
    results: sorted,
    primary: sorted[0] ?? null,
    alternatives: sorted.slice(1, 3),
  };
}

// Plain-language reasoning generator for the top result.
export function explainRecommendation(input: LandInput, result: PathResult): string {
  const bits: string[] = [];
  if (input.zoning === "NA_URBAN") bits.push("is NA-sanctioned and urban-adjacent");
  if (input.zoning === "AGRI_LARGE") bits.push("is agricultural and sizeable");
  if (input.zoning === "COMMERCIAL_INDUSTRIAL") bits.push("is zoned commercial/industrial");
  if (input.road === "WIDE") bits.push("fronts a wide road");
  if (input.location === "GROWTH_CORRIDOR") bits.push("sits near a growth corridor or city limit");
  if (input.utilities === "FULL") bits.push("has full utility access");

  const reason = bits.length > 0 ? bits.join(", ") : "matches this path's typical profile";
  return `Your plot ${reason} — conditions that typically favor ${result.label.toLowerCase()}.`;
}
