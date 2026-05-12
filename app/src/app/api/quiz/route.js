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

const FALLBACK_QUESTIONS = {
  questions: [
    {
      question: "What is the key tax advantage of a Roth IRA?",
      choices: [
        "Contributions are tax-deductible",
        "Withdrawals in retirement are tax-free",
        "You pay no taxes on dividends each year",
        "There are no contribution limits",
      ],
      correctIndex: 1,
      explanation: "Roth IRA contributions are made with after-tax dollars, so qualified withdrawals in retirement are completely tax-free.",
      source: "Roth IRA",
    },
    {
      question: "Which account is specifically designed to pay for medical expenses with triple tax advantages?",
      choices: ["FSA", "529 Plan", "HSA", "Roth 401(k)"],
      correctIndex: 2,
      explanation: "An HSA offers tax-free contributions, tax-free growth, and tax-free withdrawals for qualified medical expenses.",
      source: "HSA",
    },
    {
      question: "What is an ETF?",
      choices: [
        "A savings account with a fixed interest rate",
        "A loan you give to a company or government",
        "A bundle of stocks or bonds traded as a single ticker",
        "An account managed exclusively by a financial advisor",
      ],
      correctIndex: 2,
      explanation: "An ETF (Exchange-Traded Fund) holds a collection of assets like stocks or bonds and trades on an exchange like a single stock.",
      source: "ETF",
    },
    {
      question: "A 529 Plan is best used for which type of expense?",
      choices: ["Medical bills", "Retirement income", "Education costs", "Home purchases"],
      correctIndex: 2,
      explanation: "529 Plans grow tax-free and withdrawals are tax-free when used for qualified education expenses like tuition.",
      source: "529 Plan",
    },
    {
      question: "What distinguishes a Traditional IRA from a Roth IRA?",
      choices: [
        "Traditional IRA has higher contribution limits",
        "Traditional IRA contributions may be tax-deductible; you pay taxes on withdrawal",
        "Traditional IRA is only for self-employed individuals",
        "Traditional IRA has no early withdrawal penalty",
      ],
      correctIndex: 1,
      explanation: "Traditional IRA contributions can be tax-deductible, but withdrawals in retirement are taxed as ordinary income.",
      source: "Traditional IRA",
    },
    {
      question: "Which investment account has no contribution limits and no special tax advantages?",
      choices: ["Roth IRA", "401(k)", "Brokerage Account", "HSA"],
      correctIndex: 2,
      explanation: "A taxable brokerage account has no contribution caps or tax perks, but also has no restrictions on withdrawals.",
      source: "Brokerage Account",
    },
    {
      question: "What happens when you buy a bond?",
      choices: [
        "You become a part-owner of a company",
        "You loan money and receive interest payments in return",
        "You get a share of the company's profits",
        "You lock money in a bank for a guaranteed rate",
      ],
      correctIndex: 1,
      explanation: "A bond is a loan you make to a government or company; they pay you back with interest over a set period.",
      source: "Bonds",
    },
    {
      question: "What is micro-investing / round-up investing?",
      choices: [
        "Investing only in small-cap stocks",
        "Automatically investing spare change from everyday purchases",
        "Buying fractional shares of expensive stocks",
        "Investing a fixed $1 per day",
      ],
      correctIndex: 1,
      explanation: "Round-up investing rounds your purchases to the nearest dollar and invests the difference automatically.",
      source: "Round-up / Micro-invest",
    },
    {
      question: "Which account is best for a self-employed person who wants high retirement contribution limits?",
      choices: ["Traditional IRA", "Roth IRA", "Solo 401(k)", "UGMA"],
      correctIndex: 2,
      explanation: "A Solo 401(k) is designed for self-employed individuals and allows much higher annual contributions than an IRA.",
      source: "Solo 401(k)",
    },
    {
      question: "What is a Certificate of Deposit (CD)?",
      choices: [
        "A stock that pays regular dividends",
        "A government bond with a 10-year term",
        "A bank deposit that earns a fixed rate in exchange for leaving funds untouched for a set period",
        "A mutual fund focused on large-cap companies",
      ],
      correctIndex: 2,
      explanation: "A CD offers a guaranteed interest rate in exchange for agreeing not to withdraw your money until the term ends.",
      source: "CDs",
    },
  ],
};

export async function POST() {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(FALLBACK_QUESTIONS);
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
      return Response.json(FALLBACK_QUESTIONS);
    }
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return Response.json(FALLBACK_QUESTIONS);
    }
    return Response.json(parsed);
  } catch (err) {
    console.error("Quiz generation failed, using fallback questions:", err);
    return Response.json(FALLBACK_QUESTIONS);
  }
}
