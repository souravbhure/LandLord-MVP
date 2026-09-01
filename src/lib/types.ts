import { LandInput } from "./scoring";

export type VerificationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEEDS_CORRECTION"
  | "VERIFIED"
  | "REJECTED";

export interface LandRegistration extends LandInput {
  id: string;
  ownerId: string;
  surveyNumber: string;
  plotNumber?: string;
  latitude: number;
  longitude: number;
  areaSqFt: number;
  photos: string[]; // storage URLs
  landDocs: string[]; // storage URLs
  ownerDocs: string[]; // storage URLs
  status: VerificationStatus;
  correctionNote?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  registrationId: string;
  name: string;
  phone: string;
  message?: string;
  createdAt: string;
}
