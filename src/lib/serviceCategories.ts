export const SERVICE_CATEGORIES = [
  "Model Rambut",
  "Potong Rambut",
  "Pewarnaan",
  "Treatment",
  "Lainnya",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const DEFAULT_SERVICE_CATEGORY: ServiceCategory = "Model Rambut";
