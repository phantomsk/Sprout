"use client";

import { useState } from "react";
import { PixelSprite, SPROUT_PIXELS } from "./PixelSprite";
import { CADENCE_RATES, toMonthly, newSource, SourceRow } from "./IncomeSource";

export function Onboarding({ user, setUser, onDone }) {
  const [step, setStep] = useState(0);
  const steps = ["welcome", "snapshot", "risk", "budget", "accounts", "meet"];
  const cur = steps[step];
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => onDone();

  return (
    <div
      className="screen screen-enter"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="pad-h pad-v"
        style={{ paddingBottom: 0, flexShrink: 0 }}
      >
        <div className="row" style={{ gap: 6 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                background:
                  i <= step ? "var(--c-mid)" : "rgba(45, 80, 22, 0.12)",
                borderRadius: 999,
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
        <p
          className="tiny pixel center"
          style={{ marginTop: 10, color: "var(--c-dark)" }}
        >
          STEP {step + 1} OF {steps.length}
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {cur === "welcome" && <Welcome onNext={next} />}
        {cur === "snapshot" && (
          <Snapshot user={user} setUser={setUser} onNext={next} onBack={back} />
        )}
        {cur === "risk" && (
          <RiskQuiz user={user} setUser={setUser} onNext={next} onBack={back} />
        )}
        {cur === "budget" && (
          <BudgetSetup
            user={user}
            setUser={setUser}
            onNext={next}
            onBack={back}
          />
        )}
        {cur === "accounts" && (
          <ConnectAccounts onNext={next} onBack={back} />
        )}
        {cur === "meet" && (
          <MeetPlant
            user={user}
            setUser={setUser}
            onNext={finish}
            onBack={back}
          />
        )}
      </div>
    </div>
  );
}

function Welcome({ onNext }) {
  return (
    <div className="onboard-center stack">
      <div className="center">
        <PixelSprite pixels={SPROUT_PIXELS.seed} scale={8} />
      </div>
      <h1 className="pixel center">DEEP BREATH.</h1>
      <p className="body center" style={{ fontSize: 16, lineHeight: 1.5 }}>
        We&apos;ll ask a few gentle questions to set up your garden. Skip
        anything you&apos;re not sure about — you can fill it in later.
      </p>

      <div className="card stack-sm">
        <h3 className="pixel">★ THE DEAL</h3>
        <p className="body">→ ~3 minutes</p>
        <p className="body">→ Nothing leaves your phone yet</p>
        <p className="body">→ End it whenever you want</p>
      </div>

      <button className="btn full" onClick={onNext}>
        I&apos;M READY ▸
      </button>
    </div>
  );
}

function Snapshot({ user, setUser, onNext, onBack }) {
  const [sources, setSources] = useState(() => [newSource()]);
  const [tip, setTip] = useState(null);

  const totalMonthly = sources
    .filter((s) => s.active)
    .reduce((sum, s) => sum + toMonthly(s.amount, s.cadence), 0);

  const updateSource = (id, updated) =>
    setSources((prev) => prev.map((s) => (s.id === id ? updated : s)));
  const removeSource = (id) =>
    setSources((prev) => prev.filter((s) => s.id !== id));
  const addSource = () => setSources((prev) => [...prev, newSource()]);

  const handleNext = () => {
    setUser((u) => ({ ...u, incomeSources: sources, income: totalMonthly }));
    onNext();
  };

  return (
    <div className="onboard-center stack" style={{ overflowY: "auto" }}>
      <h2 className="pixel center">MONEY SNAPSHOT</h2>
      <p className="body center">Where does your money come from? Rough numbers are fine.</p>

      <div className="stack-sm">
        {sources.map((src) => (
          <SourceRow
            key={src.id}
            source={src}
            onChange={(updated) => updateSource(src.id, updated)}
            onRemove={() => removeSource(src.id)}
            canRemove={sources.length > 1}
          />
        ))}

        <button
          onClick={addSource}
          style={{
            width: "100%",
            padding: "10px 16px",
            border: "2px dashed rgba(45,80,22,0.3)",
            borderRadius: 10,
            background: "transparent",
            color: "var(--c-mid)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "inherit",
            letterSpacing: "0.5px",
          }}
        >
          + ADD INCOME SOURCE
        </button>
      </div>

      {totalMonthly > 0 && (
        <div
          className="card"
          style={{ background: "var(--c-mid)", padding: "10px 14px" }}
        >
          <div className="row between">
            <span className="pixel" style={{ color: "var(--c-bg)", fontSize: 11 }}>
              MONTHLY TOTAL
            </span>
            <span className="pixel" style={{ color: "var(--c-bg)", fontSize: 14 }}>
              ${totalMonthly}
            </span>
          </div>
        </div>
      )}

      <Field
        label="DEBTS (OPTIONAL)"
        infoKey="debt"
        onInfo={setTip}
        value={user.debt}
        onChange={(v) => setUser((u) => ({ ...u, debt: v }))}
        prefix="$"
      />
      <Field
        label="SAVINGS (OPTIONAL)"
        infoKey="savings"
        onInfo={setTip}
        value={user.savings}
        onChange={(v) => setUser((u) => ({ ...u, savings: v }))}
        prefix="$"
      />

      {tip && (
        <div className="card green" style={{ padding: 10 }}>
          <p className="body" style={{ color: "var(--c-bg)" }}>
            ♦ {tip === "debt" ? "Cards, loans, anything that has interest. Optional." : "Cash sitting around. Roughly fine — round to the nearest hundred."}
          </p>
        </div>
      )}

      <div className="row" style={{ gap: 8 }}>
        <button className="btn secondary" onClick={onBack}>
          ◂ BACK
        </button>
        <button className="btn full" onClick={handleNext}>
          NEXT ▸
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, prefix, infoKey, onInfo }) {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 6 }}>
        <label className="input-label" style={{ margin: 0 }}>
          {label}
        </label>
        {infoKey && (
          <button
            onClick={() => onInfo(infoKey)}
            style={{
              width: 20,
              height: 20,
              padding: 0,
              border: "none",
              borderRadius: 999,
              background: "var(--c-mid)",
              color: "var(--c-bg)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            ?
          </button>
        )}
      </div>
      <div
        className="row"
        style={{
          gap: 0,
          border: "1.5px solid rgba(45, 80, 22, 0.18)",
          borderRadius: 10,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {prefix && (
          <span
            style={{
              background: "var(--c-mid)",
              color: "var(--c-bg)",
              padding: "12px 14px",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {prefix}
          </span>
        )}
        <input
          className="input"
          style={{ border: "none", borderRadius: 0, background: "transparent" }}
          inputMode="numeric"
          value={value}
          onChange={(e) =>
            onChange(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)
          }
        />
      </div>
    </div>
  );
}

function RiskQuiz({ user, setUser, onNext, onBack }) {
  const questions = [
    {
      q: "When will you want this money?",
      sprite: "seed",
      opts: [
        { t: "Within 2 years", s: 1 },
        { t: "3–7 years", s: 2 },
        { t: "10+ years", s: 3 },
      ],
    },
    {
      q: "Your portfolio drops 20% overnight. You:",
      gif: "/animations/sprout.gif",
      opts: [
        { t: "Sell — get me out", s: 1 },
        { t: "Sweat, but hold", s: 2 },
        { t: "Buy more, on sale", s: 3 },
      ],
    },
    {
      q: "How much have you invested before?",
      gif: "/animations/sprout2.gif",
      opts: [
        { t: "Zero. New here.", s: 1 },
        { t: "A bit — 401k maybe", s: 2 },
        { t: "I read 10-Ks for fun", s: 3 },
      ],
    },
    {
      q: "What's the goal?",
      gif: "/animations/sun1.gif",
      opts: [
        { t: "Emergency fund", s: 1 },
        { t: "House / car", s: 2 },
        { t: "Retirement / wealth", s: 3 },
      ],
    },
    {
      q: "Pick a vibe:",
      gif: "/animations/rose1.gif",
      opts: [
        { t: "Slow & steady", s: 1 },
        { t: "Mostly chill, some spice", s: 2 },
        { t: "Send it", s: 3 },
      ],
    },
  ];
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const score = answers.reduce((a, b) => a + b, 0);
  const avg = answers.length ? score / answers.length : 0;
  let profile = "Moderate";
  let color = "var(--c-mid)";
  let desc = "";
  if (avg < 1.7) {
    profile = "Conservative";
    color = "var(--c-mid-light)";
    desc = "Steady ground. Lower swings, lower returns, fewer 3am cold sweats.";
  } else if (avg > 2.4) {
    profile = "Aggressive";
    color = "var(--c-dark)";
    desc = "Mostly stocks. Bigger ups, bigger downs, longer time horizon.";
  } else {
    profile = "Moderate";
    color = "var(--c-mid)";
    desc = "A balanced mix. The boring middle path — and it works.";
  }

  const pick = (s) => {
    setTransitioning(true);
    const a = [...answers, s];
    setAnswers(a);
    setTimeout(() => {
      if (qi < questions.length - 1) setQi(qi + 1);
      else setDone(true);
      setTransitioning(false);
    }, 250);
  };

  if (done) {
    return (
      <div className="onboard-center stack">
        <h2 className="pixel center">YOUR PROFILE</h2>
        <div
          className="card center quiz-pop"
          style={{ background: color, color: "var(--c-bg)", padding: 24 }}
        >
          <h1 className="pixel" style={{ color: "var(--c-bg)", fontSize: 28 }}>
            {profile.toUpperCase()}
          </h1>
          <p
            className="body"
            style={{ marginTop: 10, color: "var(--c-bg)", fontSize: 15 }}
          >
            {desc}
          </p>
        </div>
        <div className="card stack-sm">
          <h3 className="pixel">★ WHAT THIS MEANS</h3>
          <p className="body">
            → We&apos;ll suggest investments that match this comfort level.
          </p>
          <p className="body">→ You can retake this quiz anytime in Profile.</p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button
            className="btn secondary"
            onClick={() => {
              setDone(false);
              setQi(0);
              setAnswers([]);
            }}
          >
            RETAKE
          </button>
          <button
            className="btn full"
            onClick={() => {
              setUser((u) => ({ ...u, risk: profile }));
              onNext();
            }}
          >
            LOOKS RIGHT ▸
          </button>
        </div>
      </div>
    );
  }

  const Q = questions[qi];
  const progress = ((qi + 1) / questions.length) * 100;

  return (
    <div className="onboard-center" style={{ gap: 16 }}>
      <div style={{ textAlign: "center" }}>
        <h2 className="pixel center" style={{ fontSize: 18, marginBottom: 10 }}>
          RISK + GOALS
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 200,
              height: 8,
              background: "rgba(45, 80, 22, 0.1)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "var(--c-mid)",
                borderRadius: 999,
                transition: "width 0.35s ease",
              }}
            />
          </div>
          <span className="tiny pixel" style={{ color: "var(--c-dark)" }}>
            {qi + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div
        key={qi}
        className="card quiz-pop"
        style={{
          padding: "28px 22px",
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.95) translateY(6px)" : "scale(1) translateY(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          {Q.sprite ? (
            <PixelSprite pixels={SPROUT_PIXELS[Q.sprite]} scale={5} />
          ) : (
            <img
              src={Q.gif}
              alt=""
              draggable={false}
              style={{
                width: 72,
                height: 72,
                objectFit: "contain",
                imageRendering: "pixelated",
              }}
            />
          )}
        </div>
        <h3
          className="pixel"
          style={{
            fontSize: 16,
            marginBottom: 20,
            color: "var(--c-dark)",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {Q.q}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Q.opts.map((o, i) => (
            <button
              key={i}
              onClick={() => pick(o.s)}
              style={{
                width: "100%",
                padding: "14px 18px",
                border: "2px solid rgba(45, 80, 22, 0.15)",
                borderRadius: 12,
                background: "var(--c-bg)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "inherit",
                color: "var(--c-darkest)",
                textAlign: "left",
                transition: "border-color 0.15s, background 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--c-mid)";
                e.currentTarget.style.background = "var(--c-mid-light)";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(45, 80, 22, 0.15)";
                e.currentTarget.style.background = "var(--c-bg)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {o.t}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 4,
        }}
      >
        {questions.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === qi ? 20 : 8,
              height: 8,
              borderRadius: 999,
              background:
                i < qi
                  ? "var(--c-mid)"
                  : i === qi
                    ? "var(--c-dark)"
                    : "rgba(45, 80, 22, 0.15)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <div className="center">
        <button className="btn secondary small" onClick={onBack}>
          ◂ BACK
        </button>
      </div>
    </div>
  );
}

function BudgetSetup({ user, setUser, onNext, onBack }) {
  const { splits, income } = user;
  const set = (k, v) => {
    const remaining = 100 - v;
    const others = Object.keys(splits).filter((x) => x !== k);
    const otherSum = others.reduce((s, o) => s + splits[o], 0) || 1;
    const newSplits = { ...splits, [k]: v };
    others.forEach((o) => {
      newSplits[o] = Math.max(
        0,
        Math.round((splits[o] / otherSum) * remaining)
      );
    });
    const drift = 100 - (newSplits.needs + newSplits.wants + newSplits.save);
    newSplits[others[0]] += drift;
    setUser((u) => ({ ...u, splits: newSplits }));
  };

  const dollars = (pct) => Math.round((income * pct) / 100);
  const buckets = [
    {
      k: "needs",
      label: "NEEDS",
      ex: "rent · groceries · bills",
      color: "var(--c-dark)",
      light: "var(--c-mid)",
    },
    {
      k: "wants",
      label: "WANTS",
      ex: "eat-out · streaming · little joys",
      color: "var(--c-accent)",
      light: "#f7c75f",
    },
    {
      k: "save",
      label: "SAVE/INVEST",
      ex: "sprouts · emergency · future",
      color: "var(--c-mid-light)",
      light: "#c1e58a",
    },
  ];

  const off50 =
    Math.abs(splits.needs - 50) +
    Math.abs(splits.wants - 30) +
    Math.abs(splits.save - 20);

  return (
    <div className="onboard-center stack" style={{ overflowY: "auto" }}>
      <h2 className="pixel center">PAYCHECK SPLIT</h2>
      <p className="body center">
        We default to <b>50 / 30 / 20</b>. Drag to taste — gently.
      </p>

      <div
        style={{
          border: "1px solid rgba(45, 80, 22, 0.15)",
          height: 36,
          display: "flex",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {buckets.map((b) => (
          <div
            key={b.k}
            style={{
              width: splits[b.k] + "%",
              background: b.color,
              transition: "width 0.15s ease",
              borderRight:
                b.k !== "save"
                  ? "1px solid rgba(255, 255, 255, 0.18)"
                  : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--c-bg)",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.5px",
            }}
          >
            {splits[b.k]}%
          </div>
        ))}
      </div>

      {buckets.map((b) => (
        <div key={b.k} className="card stack-sm" style={{ padding: 10 }}>
          <div className="row between">
            <div>
              <h3 className="pixel">{b.label}</h3>
              <p
                className="tiny pixel"
                style={{ color: "var(--c-dark)", marginTop: 4 }}
              >
                {b.ex}
              </p>
            </div>
            <span
              className="chip"
              style={{ background: b.color, color: "var(--c-bg)" }}
            >
              ${dollars(splits[b.k])}/mo
            </span>
          </div>
          <input
            type="range"
            className="pix"
            min={0}
            max={100}
            step={5}
            value={splits[b.k]}
            onChange={(e) => set(b.k, Number(e.target.value))}
          />
        </div>
      ))}

      {off50 > 30 && (
        <div
          className="card"
          style={{
            background: "var(--c-accent)",
            borderColor: "var(--c-darkest)",
          }}
        >
          <p className="body">
            ♦ That&apos;s pretty far from 50/30/20. Totally fine — just making
            sure you saw it.
          </p>
        </div>
      )}

      <div className="row" style={{ gap: 8 }}>
        <button className="btn secondary" onClick={onBack}>
          ◂ BACK
        </button>
        <button className="btn full" onClick={onNext}>
          LOOKS GOOD ▸
        </button>
      </div>
    </div>
  );
}

function ConnectAccounts({ onNext, onBack }) {
  const [linked, setLinked] = useState(false);
  const [scanning, setScanning] = useState(false);

  const fakeLink = () => {
    setScanning(true);
    setTimeout(() => {
      setLinked(true);
      setScanning(false);
    }, 1600);
  };

  return (
    <div className="onboard-center stack">
      <h2 className="pixel center">CONNECT ACCOUNTS</h2>
      <p className="body center">
        Linking your bank lets us auto-sort transactions. Or skip — you can
        scan receipts by hand.
      </p>

      <div
        className="card stack-sm"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {scanning && <div className="scanline" />}
        <div className="row between">
          <h3 className="pixel">✦ BANK LINK</h3>
          {linked && (
            <span
              className="chip"
              style={{
                background: "var(--c-mid)",
                color: "var(--c-bg)",
              }}
            >
              LINKED
            </span>
          )}
        </div>
        <p className="body">Bank-grade encryption. Read-only.</p>
        {!linked ? (
          <button className="btn full dark" onClick={fakeLink}>
            {scanning ? "CONNECTING..." : "LINK A BANK"}
          </button>
        ) : (
          <p className="body" style={{ color: "var(--c-dark)" }}>
            ★ Sprout Federal Credit Union · ****4291
          </p>
        )}
      </div>

      <div className="card stack-sm" style={{ background: "var(--c-bg)" }}>
        <h3 className="pixel">▸ MANUAL MODE</h3>
        <p className="body">
          Snap photos of receipts. We&apos;ll OCR &amp; categorize them.
        </p>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn secondary" onClick={onBack}>
          ◂ BACK
        </button>
        <button className="btn full" onClick={onNext}>
          {linked ? "NEXT ▸" : "SKIP FOR NOW"}
        </button>
      </div>
    </div>
  );
}

function MeetPlant({ user, setUser, onNext, onBack }) {
  const [name, setName] = useState(user.plantName);
  const [planted, setPlanted] = useState(false);

  const plant = () => {
    setUser((u) => ({ ...u, plantName: name || "Sproutie" }));
    setPlanted(true);
    setTimeout(onNext, 1500);
  };

  if (planted) {
    return (
      <div className="onboard-center stack">
        <div className="center">
          <PixelSprite pixels={SPROUT_PIXELS.bud} scale={9} />
        </div>
        <h1 className="pixel center pop">
          {(name || "SPROUTIE").toUpperCase()}
          <br />
          IS GROWING!
        </h1>
        <p className="body center" style={{ fontSize: 16 }}>
          +$1 invested. First sprout planted.
        </p>
      </div>
    );
  }

  return (
    <div className="onboard-center stack">
      <h2 className="pixel center">MEET YOUR SPROUT</h2>
      <div className="center" style={{ padding: "12px 0" }}>
        <PixelSprite pixels={SPROUT_PIXELS.sprout} scale={8} />
      </div>
      <div className="card stack-sm">
        <p className="body">
          This is your first sprout. Every time you invest, a new one grows.
          Together they become your garden. 🌱
        </p>
        <label className="input-label">NAME YOUR PLANT</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 16))}
          placeholder="Sproutie"
        />
      </div>

      <div className="card green stack-sm">
        <h3 className="pixel" style={{ color: "var(--c-bg)" }}>
          ★ TINY FIRST INVESTMENT
        </h3>
        <p className="body" style={{ color: "var(--c-bg)" }}>
          Plant a $1 sprout to lock it in. It will track a diversified index —
          small but real.
        </p>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn secondary" onClick={onBack}>
          ◂ BACK
        </button>
        <button className="btn full" onClick={plant}>
          PLANT $1 ▸
        </button>
      </div>
    </div>
  );
}
