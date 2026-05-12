# 🌱 Sprout — Plant the Seeds of Financial Freedom

> **Built for FidHacks**

---

## The Problem

For many first-year college women, especially first-generation earners, this is the first time managing money, career decisions, and independence all at once. They're navigating budgets, debt anxiety, investing fear, and career uncertainty without a playbook. Traditional financial tools are either too intimidating, too jargon-heavy, or simply not built for them.

**The result:** analysis paralysis, avoidance, and missed early compounding years that can never be recovered.

---

## Our Solution: Sprout

Sprout is a **gamified financial education and micro-investing platform** that meets Gen-Z women where they are, while making money management feel as natural, low-stakes, and visually rewarding as tending a virtual garden.

Instead of dashboards full of numbers, Sprout turns every dollar invested into a growing pixel-art plant. Instead of overwhelming financial jargon, AI-generated lessons and a conversational onboarding flow guide users toward their first real money moves in under five minutes.

**Core philosophy:** Small actions compound. A seed planted today becomes a bloom in ten years. Sprout makes that visible, tangible, and *fun*.

---

## Features

### Personalized Onboarding
A 6-step guided setup that feels like a conversation, not a form:
1. **Welcome** — sets the tone: no judgment, just growth
2. **Money Snapshot** — income sources (hourly, bi-weekly, semester stipend, etc.) + optional debt and savings
3. **Risk Quiz** — 5 scenario-based questions that determine a Conservative / Moderate / Aggressive investment profile
4. **Budget Setup** — customizable 50/30/20 split (Needs / Wants / Save) with interactive sliders
5. **Connect Accounts** — bank linking via Plaid or manual receipt entry
6. **Meet Your Plant** — name your first sprout and plant $1 to start

### Smart Budgeting
- Upload a receipt photo → Gemini Vision AI extracts line items and auto-categorizes each as **NEEDS**, **WANTS**, or **SAVE**
- Manual transaction entry with the same categorization logic
- Pattern-detection nudges ("You've hit DoorDash 6x this week")
- Monthly income tracker with support for variable-cadence income (hourly, bi-weekly, semester, annual)
- Visual budget breakdown with pie charts and progress bars

### Personalized Micro-Investing
- Risk-profile-matched ETF picks (Conservative → BND/VTI/VYM · Moderate → VTI/VXUS/BND · Aggressive → QQQ/VTI/AVUV)
- Live price data with sparkline charts (1D / 1W / 1M / 3M windows)
- Market open/closed status with real-time refresh
- Inline micro-lessons explaining each investment type in plain language
- Full Field Guide with 5 curriculum sections (retirement, flexible investing, goal savings, growth assets, bonds) and an AI-generated 10-question quiz

### The Garden — Visual Wealth Tracker
- Every investment becomes a pixel-art plant in a 4×2 garden grid
- Plant growth stage tied to investment size: **Seed** (<$25) → **Sprout** → **Bud** → **Bloom** ($500+)
- Time-travel slider: project your garden 1, 5, 10, or 30 years into the future
- Compound growth visualization (5% / 7% / 9% annual return based on risk profile)
- "Water" a plant to add more funds and watch it grow

### Community & Gamification
- Weekly leaderboard of top community growers
- Achievement badges: First Sprout, 3-Plant Pot, 7-Day Streak, $100 Planted
- Community directory with user profiles, bios, and specialties
- Direct messaging to peers and mentors
- Social proof through shared gardens

### Profile & Progress
- At-a-glance stats: plants grown, days active, total invested
- Risk profile card with one-tap re-quiz
- Budget split and goals summary

---

## Technical Architecture

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Auth & Database | Supabase (PostgreSQL + Auth) |
| AI | Google Gemini (`@google/genai`) |
| Market Data | Alpaca Markets API |
| Fonts | Press Start 2P (pixel), Nunito, Inter |
| Bundler | Turbopack |

### API Integrations

#### Google Gemini AI
Gemini powers two distinct intelligent features:

**Receipt Scanner** (`/api/scan`)
- Accepts a receipt image and sends it to Gemini's multimodal vision model
- Extracts merchant name, line items, prices, and totals
- Classifies each item as NEEDS / WANTS / SAVE using structured JSON schema output
- Enables habit-aware budgeting without manual data entry

**AI Quiz Generator** (`/api/quiz`)
- Dynamically generates 10 multiple-choice financial literacy questions on each session
- Curriculum spans: IRAs/401(k)s, ETFs, bonds, HSAs/529s, CDs, and flexible investing
- Temperature tuned (0.9) for variety; enforced response schema guarantees correct answer index + explanation
- Ensures no two learning sessions feel identical

#### Alpaca Markets API
**Real-Time & Historical Stock Data** (`/api/stocks`)
- Fetches live snapshots (current bid/ask/last price) for 6 tracked ETFs: BND, VTI, VYM, VXUS, QQQ, AVUV
- Provides OHLCV bar data across four time windows: 1D (1-hour bars), 1W, 1M, 3M (1-day bars)
- Detects NYSE market open/closed status based on Eastern Time
- Data refreshed every 60 seconds; labeled as 15-minute delayed per market data provider rules

#### Supabase
**Auth & Backend** (`/lib/supabase/`)
- Email/password signup with email verification flow
- Secure server-side session management via SSR-aware middleware
- User metadata storage (display name, preferences)
- PostgreSQL database ready for transaction persistence, plant portfolios, and community data
- Row-level security (RLS) for per-user data isolation
- **Apple Sign-In** — one-tap auth for iPhone users; reduces friction for mobile-first Gen-Z users
- **Google / Gmail Sign-In** — OAuth via Supabase's built-in Google provider; leverages existing `.edu` accounts common at universities

### Pixel Art System
Sprout's visual identity is built on a custom pixel sprite engine:
- Plant sprites are defined as 2D character arrays mapped to CSS color variables
- Growth stages (seed → sprout → bud → bloom → tree) are distinct sprite definitions
- Hue rotation via CSS `filter` creates infinite flower color variety from a single sprite
- Flower types (rose, sunflower) with tint overrides (pink, yellow, purple, white, coral) give each plant a unique identity

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/sprout.git
cd sprout/app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in: SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY,
#          ALPACA_API_KEY, ALPACA_SECRET_KEY

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start growing.

---

## Roadmap

### Financial Integrations
- **Plaid** — live bank account linking for automatic transaction import
- **Real brokerage connection** — route micro-investments through a regulated broker API (e.g., Alpaca trading)

### Community & Mentorship
- **Mentor matching** — pair first-year students with upper-classwomen or early-career professionals based on major, goals, and risk profile
- **Group gardens** — shared investment goals with collaborative contributions
- **Workshop integration** — in-app events calendar tied to on-campus financial literacy workshops

### AI & Personalization
- **Spending personality insights** — weekly Gemini-generated report based on transaction patterns
- **Goal-based planting** — connect each plant to a named goal (emergency fund, laptop, study abroad)
- **Negotiation simulator** — AI role-play for salary negotiation practice

---

## Team

Built with care at FidHacks · 2025

> *"The best time to plant a tree was 20 years ago. The second best time is now."*
> — and with Sprout, you don't have to wait to start.

---

*v0.1 · NOT INVESTMENT ADVICE · For educational purposes only*
