import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });
  }

  const { image } = req.body || {};
  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    return res.status(400).json({ error: "A base64 image data URL is required." });
  }

  if (image.length > 12_000_000) {
    return res.status(413).json({ error: "Image is too large. Please use a smaller photo." });
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_VISION_MODEL || "gpt-5.6",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `You are a nutrition logging assistant. Analyze this meal photo and estimate the visible foods, portions, calories, protein, carbohydrates, fat, and fiber.

Rules:
- Be conservative and realistic about portion sizes.
- Break the meal into separate food items when possible.
- Account for likely cooking oil, dressing, sauces, cheese, butter, or other calorie-dense additions only when visually plausible. If uncertain, mention that uncertainty in note.
- Do not claim medical or laboratory-level precision.
- Return ONLY valid JSON with this exact shape and no markdown:
{
  "foods": [
    {
      "name": "string",
      "serving": "string",
      "cal": number,
      "p": number,
      "c": number,
      "f": number,
      "fiber": number
    }
  ],
  "note": "short string describing key uncertainties"
}`
            },
            {
              type: "input_image",
              image_url: image,
              detail: "high"
            }
          ]
        }
      ]
    });

    let text = (response.output_text || "").trim();
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: "The model returned an invalid nutrition estimate. Please try again." });
    }

    if (!Array.isArray(parsed.foods)) {
      return res.status(502).json({ error: "The model did not return food items. Please try again." });
    }

    const foods = parsed.foods.slice(0, 20).map((food) => ({
      name: String(food?.name || "Food item").slice(0, 120),
      serving: String(food?.serving || "").slice(0, 120),
      cal: clampNumber(food?.cal, 0, 5000),
      p: clampNumber(food?.p, 0, 500),
      c: clampNumber(food?.c, 0, 1000),
      f: clampNumber(food?.f, 0, 500),
      fiber: clampNumber(food?.fiber, 0, 200)
    }));

    return res.status(200).json({
      foods,
      note: String(parsed.note || "Photo-based nutrition is an estimate. Verify portions, oils, sauces, and packaged-food labels when possible.").slice(0, 500)
    });
  } catch (error) {
    console.error("Meal analysis failed:", error);
    return res.status(500).json({ error: "Meal analysis failed. Please try again." });
  }
}

function clampNumber(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(Math.min(max, Math.max(min, n)) * 10) / 10;
}
