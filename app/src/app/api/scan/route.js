import { GoogleGenAI, Type } from "@google/genai";

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    merchant: { type: Type.STRING },
    total: { type: Type.NUMBER },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          category: {
            type: Type.STRING,
            enum: ["NEEDS", "WANTS", "SAVE"],
          },
        },
        required: ["name", "price", "category"],
      },
    },
  },
  required: ["merchant", "total", "items"],
};

const PROMPT = `Analyze this receipt photo and extract:
- merchant: the store name (uppercase, max 24 chars)
- total: the total amount paid in dollars (number only, no $ sign)
- items: each line item with:
    - name: short uppercase name (max 24 chars)
    - price: number in dollars
    - category: one of NEEDS, WANTS, or SAVE

Category guide:
- NEEDS = groceries, household essentials, hygiene, medicine, utilities, fuel, basic transit
- WANTS = restaurants, snacks, alcohol, candy, entertainment, hobbies, treats
- SAVE = investments or savings transfers (rare on a purchase receipt)

When in doubt between NEEDS and WANTS, pick whichever is more likely. Skip lines that are tax, subtotal, discount, tip, or total.`;

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY is not set. Add it to .env.local." },
      { status: 500 }
    );
  }

  let file;
  try {
    const formData = await request.formData();
    file = formData.get("image");
  } catch {
    return Response.json({ error: "Invalid form data" }, { status: 400 });
  }

  if (!file || typeof file === "string") {
    return Response.json(
      { error: "No image file provided in 'image' field" },
      { status: 400 }
    );
  }

  const mimeType = file.type || "image/jpeg";
  if (!mimeType.startsWith("image/")) {
    return Response.json(
      { error: "File must be an image" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { inlineData: { mimeType, data: base64 } },
        PROMPT,
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) {
      return Response.json(
        { error: "Model returned no text" },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (err) {
    console.error("Receipt scan failed:", err);
    return Response.json(
      { error: err?.message || "Failed to analyze receipt" },
      { status: 500 }
    );
  }
}
