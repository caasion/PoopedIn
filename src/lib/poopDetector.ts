interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RoboflowResponse {
  predictions: RoboflowPrediction[];
  error?: string;
}

export interface PoopDetectionResult {
  detected: boolean;
  bristolType: string | null;
  confidence: number | null;
}

export async function detectPoop(buffer: Buffer): Promise<PoopDetectionResult> {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("ROBOFLOW_API_KEY is not configured");
  }

  const base64 = buffer.toString("base64");

  const res = await fetch(
    `https://serverless.roboflow.com/bristol-stool-slqqx/2?api_key=${apiKey}&confidence=30`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: base64,
    }
  );

  if (!res.ok) {
    throw new Error(`Roboflow API error: ${res.status} ${res.statusText}`);
  }

  const data: RoboflowResponse = await res.json();

  if (!data.predictions || data.predictions.length === 0) {
    return { detected: false, bristolType: null, confidence: null };
  }

  // Highest-confidence detection wins
  const best = [...data.predictions].sort((a, b) => b.confidence - a.confidence)[0];

  // Normalize class name: "Type1" → "Type 1", "Type 4" stays "Type 4"
  const bristolType = best.class.replace(/^Type(\d)$/, "Type $1");

  return { detected: true, bristolType, confidence: best.confidence };
}
