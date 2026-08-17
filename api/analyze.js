import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://tcheresh.github.io";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });

  const { image } = req.body || {};
  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    return res.status(400).json({ error: "A base64 image data URL is required." });
  }
  if (image.length > 12_000_000) return res.status(413).json({ error: "Image is too large." });

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_VISION_MODEL || "gpt-5",
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Analyze this meal photo for a calorie tracker. Identify the foods you can reasonably see and estimate portions plus calories, protein, carbohydrates, fat, and fiber.

Return ONLY valid JSON with this shape:
{"foods":[{"name":"string","serving":"string","cal":0,"p":0,"c":0,"f":0,"fiber":0}],"note":"string"}

Guidance:
- Break the meal into separate ingredients/items when practical.
- Estimate visible portion sizes conservatively.
- Include likely oils, sauces, dressings, cheese, butter, or other calorie-dense additions only when visually plausible.
- If ingredients or amounts are uncertain, say so briefly in note.
- Nutrition from a photo is an estimate; do not imply laboratory precision.`
          },
          { type: "input_image", image_url: image, detail: "high" }
        ]
      }]
    });

    let text = (response.output_text || "").trim();
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

    let parsed;
    try { parsed = JSON.parse(text); }
    catch { return res.status(502).json({ error: "Invalid nutrition estimate returned. Please try again." }); }

    if (!Array.isArray(parsed.foods)) return res.status(502).json({ error: "No food items returned." });

    const foods = parsed.foods.slice(0, 20).map(food => ({
      name: String(food?.name || "Food item").slice(0, 120),
      serving: String(food?.serving || "").slice(0, 120),
      cal: clamp(food?.cal, 0, 5000),
      p: clamp(food?.p, 0, 500),
      c: clamp(food?.c, 0, 1000),
      f: clamp(food?.f, 0, 500),
      fiber: clamp(food?.fiber, 0, 200)
    }));

    return res.status(200).json({
      foods,
      note: String(parsed.note || "Photo nutrition is an estimate; verify portions, oils, sauces, and labels when possible.").slice(0, 500)
    });
  } catch (error) {
    console.error("Meal analysis failed:", error);
    return res.status(500).json({ error: "Meal analysis failed. Please try again." });
  }
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(Math.min(max, Math.max(min, n)) * 10) / 10;
}
