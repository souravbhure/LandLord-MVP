# Land Monetization Path — Scoring Model (v1, rules-based)

## How it works
Each registered plot gets scored against **7 monetization paths**, using data already captured (or easily addable) during Land Registration. Every input factor contributes points to each path based on how well that factor supports that path. The path(s) with the highest total score become the primary recommendation; the next 1–2 highest become alternatives.

Score range per factor: **0 (irrelevant/negative) to 5 (ideal fit)**. Multiply by the factor's weight, sum across factors, normalize to 100.

---

## Step 1: Input Factors & Weights

| Factor | Weight | Data Source | Notes |
|---|---|---|---|
| Zoning / Land Use Type | 25% | User input (NA sanction, agricultural, residential, commercial, industrial) | Single biggest determinant of legal monetization options |
| Road Access (width) | 15% | User input ("wide of facing road") | Drives commercial/industrial/JV viability |
| Location Context | 20% | Map pin + reverse geocode (distance to highway, city limit, growth corridor, industrial zone) | Proxy for demand and price appreciation |
| Plot Size | 15% | Auto-calculated from map boundary | Determines which paths are even feasible at that scale |
| Utilities (water/electricity/drainage) | 10% | User input | Gatekeeper for lease/rental/structure paths |
| Title Clarity | 10% | Doc verification status | Disputed/inherited/multi-owner land restricts sale & JV until resolved |
| Owner Intent (optional field: "want to sell" / "want income" / "not sure") | 5% | New optional input | Tie-breaker between similar-scoring paths |

---

## Step 2: Path Suitability Matrix

Score each factor 0–5 **per path** based on the plot's actual value for that factor.

| Factor → Path | Outright Sale | Long-Term Lease (Agri/Warehousing) | Solar/Renewable Lease | Telecom/Hoarding Lease | Joint Development (JV) | Land Banking / Hold | Mortgage / Collateral | Structure Rental |
|---|---|---|---|---|---|---|---|---|
| **Zoning: NA-sanctioned, urban-adjacent** | 5 | 1 | 1 | 2 | 5 | 2 | 4 | 3 |
| **Zoning: Agricultural, large** | 2 | 5 | 5 | 1 | 1 | 3 | 3 | 0 |
| **Zoning: Commercial/Industrial** | 4 | 3 | 2 | 4 | 5 | 2 | 4 | 4 |
| **Road: Wide (>30ft), highway-facing** | 4 | 3 | 3 | 5 | 5 | 2 | 3 | 4 |
| **Road: Narrow (<15ft), interior** | 2 | 4 | 3 | 1 | 1 | 3 | 2 | 2 |
| **Location: Near growth corridor/city limit** | 5 | 2 | 1 | 3 | 5 | 4 | 4 | 3 |
| **Location: Remote/rural** | 1 | 4 | 5 | 2 | 1 | 3 | 2 | 1 |
| **Size: Small (<0.5 acre)** | 4 | 1 | 0 | 3 | 2 | 2 | 3 | 4 |
| **Size: Mid (0.5–5 acres)** | 4 | 4 | 3 | 3 | 5 | 3 | 4 | 3 |
| **Size: Large (>5 acres)** | 3 | 5 | 5 | 2 | 4 | 3 | 3 | 1 |
| **Utilities: Full (water+power)** | 4 | 3 | 2 | 3 | 5 | 2 | 4 | 5 |
| **Utilities: None** | 2 | 3 | 4 | 3 | 1 | 3 | 1 | 0 |
| **Title: Clean, single owner** | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| **Title: Disputed/multi-owner** | 0 | 1 | 1 | 1 | 0 | 3 | 0 | 1 |

> Title Clarity acts partly as a **gate**, not just a weighted score — below a minimum threshold (e.g., disputed or unverified), Sale, JV, and Mortgage paths should be suppressed entirely regardless of other scores, and the system should surface "Resolve title first" instead of a monetization recommendation.

---

## Step 3: Scoring Formula

For a given plot and path:

```
Path Score = Σ (Factor Score × Factor Weight) × 20
```

(×20 to normalize the weighted 0–5 scale to a 0–100 display score.)

**Example — 2 acre NA-sanctioned plot, 40ft road, near city limit, full utilities, clean title:**

| Factor | Score (Sale) | Weight | Contribution |
|---|---|---|---|
| Zoning (NA, urban-adjacent) | 5 | 0.25 | 1.25 |
| Road (wide) | 4 | 0.15 | 0.60 |
| Location (growth corridor) | 5 | 0.20 | 1.00 |
| Size (mid) | 4 | 0.15 | 0.60 |
| Utilities (full) | 4 | 0.10 | 0.40 |
| Title (clean) | 5 | 0.10 | 0.50 |
| **Weighted total** | | | **4.35 × 20 = 87/100** |

Repeat for all 7 paths → rank → **Sale (87)** and **Joint Development (84)** surface as top two, with a plain-language reason attached to each.

---

## Step 4: Output to User

```
🏆 Best fit: Outright Sale (87/100)
   Your plot is NA-sanctioned, fronts a 40ft road, and sits near an
   expanding city limit — conditions that typically maximize resale value.

🥈 Also worth considering: Joint Development (84/100)
   If you'd rather retain a stake and share upside, a developer
   partnership on this plot could work well given the same location strengths.
```

---

## v2 Ideas (not needed for launch)
- Replace fixed matrix scores with **regional calibration** — same zoning/road combo may score differently in Pune vs a Tier-3 town.
- Pull comparable transaction data (recent sale/lease prices nearby) to attach a **rough value estimate**, not just a path ranking.
- Add **owner intent** as a true tie-breaker weight once you have enough users answering that optional field.
- Move from fixed weights to a lightly-trained model once you have enough verified-outcome data (which path owners actually pursued and how it went).
