import { GoogleGenAI, Type } from "@google/genai";

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          source: { type: Type.STRING },
        },
        required: [
          "question",
          "choices",
          "correctIndex",
          "explanation",
          "source",
        ],
      },
    },
  },
  required: ["questions"],
};

const CURRICULUM = `
RETIREMENT SAVINGS:
- Traditional IRA: Pre-tax contributions now; pay taxes when you withdraw later.
- Roth IRA: Pay taxes now; withdrawals in retirement are tax-free.
- Solo 401(k): High contribution limits for self-employed individuals with no employees.
- Roth 401(k): Like a Roth IRA but offered through an employer.

FLEXIBLE INVESTING & CASH:
- Brokerage Account: No contribution/withdrawal limits, no special tax breaks.
- Cash Management: Works like a checking account but lets you easily invest idle cash.
- Round-up / Micro-invest: Automatically invests spare change from everyday purchases.
- High-Yield Savings (HYSA): A savings account that earns more interest than a regular bank account.

GOAL-SPECIFIC SAVINGS:
- 529 Plan: Tax-free growth specifically for education expenses (K-12, college).
- Health Savings Account (HSA): Triple tax-advantaged (tax-free in, tax-free growth, tax-free out) for medical costs.
- Custodial (UGMA/UTMA): A taxable investment account you control on behalf of a child until they reach adulthood.

GROWTH ASSETS:
- Stocks: Buying a tiny piece of a company.
- ETFs: A bundle of different stocks or bonds traded as one ticker.
- Mutual Funds: Similar to ETFs but actively managed by a professional fund manager.

BONDS & CDS:
- Bonds: You loan money to a government or company for a set period; they pay you back plus interest.
- CDs (Certificates of Deposit): You agree to leave money in the bank for a fixed time in exchange for a guaranteed interest rate.
`;

const PROMPT = `Generate exactly 10 unique multiple-choice quiz questions based on the curriculum below. Requirements:
- Each question tests understanding (concepts, trade-offs, "which is best for X"), not pure memorization.
- 4 plausible answer choices per question, only ONE clearly correct.
- correctIndex is 0-based (0..3).
- explanation: 1 short sentence explaining why the correct answer is correct.
- source: the specific topic the question targets (e.g., "Roth IRA", "ETF", "HSA").

Spread questions across all five categories. Mix easy and medium difficulty. Avoid duplicating questions from a typical run — be creative. Make wrong answers plausible but clearly distinguishable.

CURRICULUM:
${CURRICULUM}`;

export async function POST() {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY is not set. Add it to .env.local." },
      { status: 500 }
    );
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
        temperature: 0.9,
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
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return Response.json(
        { error: "Model returned no questions" },
        { status: 502 }
      );
    }
    return Response.json(parsed);
  } catch (err) {
    console.error("Quiz generation failed:", err);
    return Response.json(
      { error: err?.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
