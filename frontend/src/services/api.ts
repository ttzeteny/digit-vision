const API_URL = "http://127.0.0.1:8000";

export interface PredictionResponse {
  prediction: number;
  confidence: number;
}

export async function predictDigit(
  imageBlob: Blob,
): Promise<PredictionResponse> {
  const formData = new FormData();

  formData.append("file", imageBlob, "digit.png");

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Prediction request failed.");
  }

  return response.json();
}