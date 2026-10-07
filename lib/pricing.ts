import type { ServiceType } from "@/app/generated/prisma/client";

export const RATES: Record<ServiceType, number> = {
  HUMAN: 0.08,
  AI: 0.015,
  AI_HUMAN_REVIEW: 0.035
};

export function calculatePrice(wordCount: number, serviceType: ServiceType) {
  const safeWords = Math.max(0, Math.floor(wordCount));
  return Number((safeWords * RATES[serviceType]).toFixed(2));
}

export function serviceLabel(service: ServiceType) {
  return service === "HUMAN" ? "Professional Human Translation" : service === "AI" ? "AI Translation" : "AI + Human Review";
}
