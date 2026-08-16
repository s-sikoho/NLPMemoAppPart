import type { TrainResult } from "@/types";

const CLASSIFIER_API = "http://localhost:8000/classifier";

export async function trainClassifier(): Promise<TrainResult> {
  const response = await fetch(`${CLASSIFIER_API}/train`, {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.detail ?? "再学習に失敗しました");
  }

  return result;
}
