import { predictionIds, type PredictionId } from "@/i18n/translations";

const STORAGE_KEY = "seren.prediction.v1";

export function pickPredictionId(random = crypto.getRandomValues.bind(crypto)): PredictionId {
  const bytes = new Uint32Array(1);
  random(bytes);
  return predictionIds[bytes[0] % predictionIds.length];
}

export function getSessionPrediction(
  storage: Storage = window.sessionStorage,
  random = crypto.getRandomValues.bind(crypto),
): PredictionId {
  const existing = storage.getItem(STORAGE_KEY);
  if (existing && predictionIds.includes(existing as PredictionId)) {
    return existing as PredictionId;
  }

  const selected = pickPredictionId(random);
  storage.setItem(STORAGE_KEY, selected);
  return selected;
}

export function hasSessionPrediction(storage: Storage = window.sessionStorage): boolean {
  const existing = storage.getItem(STORAGE_KEY);
  return Boolean(existing && predictionIds.includes(existing as PredictionId));
}
