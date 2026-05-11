"use client";

import { useState, useContext } from "react";
import {
  PixelSprite,
  SPROUT_PIXELS,
  ICONS,
  TweaksContext,
  randomTint,
} from "./PixelSprite";

export function MainApp({ tab, setTab, user, setUser }) {
  return (
    <>
      <div className="screen has-nav">
        {tab === "home" && (
          <HomeTab user={user} setUser={setUser} setTab={setTab} />
        )}
        {tab === "budget" && <BudgetTab user={user} setUser={setUser} />}
        {tab === "invest" && <InvestTab user={user} setUser={setUser} />}
        {tab === "garden" && <GardenTab user={user} setUser={setUser} />}
        {tab === "profile" && <ProfileTab user={user} setUser={setUser} />}
      </div>
      <TabBar tab={tab} setTab={setTab} />
    </>
  );
}

function TabBar({ tab, setTab }) {
  const items = [
    { k: "home", label: "HOME", ico: ICONS.home },
    { k: "budget", label: "BUDGET", ico: ICONS.budget },
    { k: "invest", label: "INVEST", ico: ICONS.invest },
    { k: "garden", label: "GARDEN", ico: ICONS.garden },
    { k: "profile", label: "YOU", ico: ICONS.profile },
  ];
  return (
    <div className="tabbar">
      {items.map((i) => (
        <button
          key={i.k}
          className={"tab" + (tab === i.k ? " active" : "")}
          onClick={() => setTab(i.k)}
        >
          <PixelSprite pixels={i.ico} scale={2} bob={false} />
          <span>{i.label}</span>
        </button>
      ))}
    </div>
  );
}

function HomeTab({ user, setUser, setTab }) {
  const [mood, setMood] = useState(user.mood);
  const dollars = (pct) => Math.round((user.income * pct) / 100);
  const [spent] = useState({ needs: 0.62, wants: 0.78, save: 0.34 });

  const moods = [
    { e: "◕‿◕", label: "GOOD" },
    { e: "⊙_⊙", label: "MEH" },
    { e: "×_×", label: "BAD" },
  ];

  const insights = [
    "You've ordered delivery 6× this week — want a soft limit?",
    "Cool. You're $48 under in WANTS so far. Nice pacing.",
    "Reminder: payday Friday. Sprout will auto-plant $25.",
  ];

  return (
    <div className="screen-enter pad stack">
      <div className="row between">
        <div>
          <p className="tiny pixel" style={{ color: "var(--c-dark)" }}>
            GOOD MORNING
          </p>
          <h2 className="pixel" style={{ marginTop: 4 }}>
            HEY, PLAYER 1
          </h2>
        </div>
        <div style={{ marginRight: -4 }}>
          <PixelSprite pixels={SPROUT_PIXELS.sprout} scale={4} />
        </div>
      </div>

      <div className="card stack-sm">
        <div className="row between">
          <h3 className="pixel">★ TODAY&apos;S BUCKETS</h3>
          <span className="tiny pixel" style={{ color: "var(--c-dark)" }}>
            MAY 11
          </span>
        </div>
        <BucketRow
          color="var(--c-dark)"
          label="NEEDS"
          pct={spent.needs}
          cap={dollars(user.splits.needs)}
        />
        <BucketRow
          color="var(--c-accent)"
          label="WANTS"
          pct={spent.wants}
          cap={dollars(user.splits.wants)}
        />
        <BucketRow
          color="var(--c-mid-light)"
          label="SAVE"
          pct={spent.save}
          cap={dollars(user.splits.save)}
        />
      </div>

      <div
        className="card green"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div className="row between">
          <div>
            <h3 className="pixel" style={{ color: "var(--c-bg)" }}>
              YOUR GARDEN
            </h3>
            <p
              className="body"
              style={{ color: "var(--c-bg)", marginTop: 4 }}
            >
              {user.plants.length} plant
              {user.plants.length !== 1 ? "s" : ""} · est. $
              {user.plants.reduce((s, p) => s + p.value, 0).toFixed(2)}
            </p>
          </div>
          <button
            className="btn small dark"
            onClick={() => setTab("garden")}
          >
            VIEW ▸
          </button>
        </div>
        <div
          className="row"
          style={{ gap: 8, marginTop: 12, justifyContent: "flex-start" }}
        >
          <PixelSprite pixels={SPROUT_PIXELS.sprout} scale={4} />
          <PixelSprite pixels={SPROUT_PIXELS.seed} scale={4} />
          <PixelSprite pixels={SPROUT_PIXELS.seed} scale={4} bob={false} />
          <div
            style={{
              width: 44,
              height: 52,
              opacity: 0.4,
              border: "4px dashed var(--c-bg)",
            }}
          />
        </div>
      </div>

      {mood === null ? (
        <div className="card stack-sm">
          <h3 className="pixel">♦ HOW&apos;S MONEY FEEL TODAY?</h3>
          <div className="row" style={{ gap: 8 }}>
            {moods.map((m, i) => (
              <button
                key={i}
                className="btn secondary full"
                onClick={() => {
                  setMood(i);
                  setUser((u) => ({ ...u, mood: i }));
                }}
              >
                <span style={{ fontSize: 16 }}>{m.e}</span>
                <span style={{ marginLeft: 6 }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="card stack-sm"
          style={{ background: "var(--c-mid-light)" }}
        >
          <h3 className="pixel">♦ NOTED · {moods[mood].label}</h3>
          <p className="body">
            Thanks. We&apos;ll keep an eye out and ease off the nudges if
            you&apos;re stressed.
          </p>
        </div>
      )}

      <div className="row" style={{ gap: 8 }}>
        <button className="btn secondary full small">
          <span>▦ SCAN</span>
        </button>
        <button className="btn secondary full small">
          <span>+ LOG</span>
        </button>
        <button
          className="btn secondary full small"
          onClick={() => setTab("invest")}
        >
          <span>↑ INVEST</span>
        </button>
      </div>

      <h3 className="pixel" style={{ marginTop: 8 }}>
        ★ NUDGES
      </h3>
      <div className="stack-sm">
        {insights.map((t, i) => (
          <div key={i} className="card" style={{ padding: 10 }}>
            <p className="body">→ {t}</p>
          </div>
        ))}
      </div>

      <div style={{ height: 12 }} />
    </div>
  );
}

function BucketRow({ color, label, pct, cap }) {
  const used = Math.min(1, pct);
  return (
    <div>
      <div className="row between" style={{ marginBottom: 4 }}>
        <span className="tiny pixel">{label}</span>
        <span className="tiny pixel" style={{ color: "var(--c-dark)" }}>
          ${Math.round(cap * used)} / ${cap}
        </span>
      </div>
      <div className="pbar cream">
        <div
          className="fill"
          style={{ width: used * 100 + "%", background: color }}
        />
      </div>
    </div>
  );
}

function BudgetTab({ user }) {
  const [showScan, setShowScan] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const dollars = (pct) => Math.round((user.income * pct) / 100);

  const txns = [
    { name: "WHOLE FOODS", amt: -84.2, bucket: "NEEDS", flag: null, day: "Today" },
    { name: "DOORDASH", amt: -22.55, bucket: "WANTS", flag: "delivery", day: "Today" },
    { name: "PAYCHECK", amt: +1600, bucket: "IN", flag: null, day: "Yesterday" },
    { name: "STEAM", amt: -29.99, bucket: "WANTS", flag: "impulse", day: "Mon" },
    { name: "CON ED", amt: -78.0, bucket: "NEEDS", flag: null, day: "Mon" },
    { name: "DOORDASH", amt: -19.1, bucket: "WANTS", flag: "delivery", day: "Sun" },
    { name: "TRADER JOE'S", amt: -41.88, bucket: "NEEDS", flag: null, day: "Sun" },
  ];

  const fakeScan = () => {
    setScanStage(1);
    setTimeout(() => setScanStage(2), 1700);
  };

  return (
    <div className="screen-enter pad stack">
      <h2 className="pixel">BUDGET</h2>

      <div className="card stack-sm">
        <h3 className="pixel">★ MAY</h3>
        <BucketRow
          color="var(--c-dark)"
          label="NEEDS · 50%"
          pct={0.62}
          cap={dollars(user.splits.needs)}
        />
        <BucketRow
          color="var(--c-accent)"
          label="WANTS · 30%"
          pct={0.78}
          cap={dollars(user.splits.wants)}
        />
        <BucketRow
          color="var(--c-mid-light)"
          label="SAVE  · 20%"
          pct={0.34}
          cap={dollars(user.splits.save)}
        />
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn full" onClick={() => setShowScan(true)}>
          ▦ SCAN  RECEIPT
        </button>
        <button className="btn full secondary">+ MANUAL</button>
      </div>

      <h3 className="pixel" style={{ marginTop: 8 }}>
        ★ RECENT
      </h3>
      <div className="stack-sm">
        {txns.map((t, i) => (
          <TxnRow key={i} t={t} />
        ))}
      </div>

      <div className="card" style={{ background: "var(--c-mid-light)" }}>
        <p className="body">
          <b>♦ Pattern noticed:</b> 3 DoorDash hits this week. No judgment —
          just so you&apos;ve seen it.
        </p>
      </div>

      <div style={{ height: 12 }} />

      {showScan && (
        <ScanDialog
          stage={scanStage}
          onScan={fakeScan}
          onClose={() => {
            setShowScan(false);
            setScanStage(0);
          }}
        />
      )}
    </div>
  );
}

function TxnRow({ t }) {
  const flagColor = {
    impulse: "var(--c-danger)",
    delivery: "var(--c-accent)",
  };
  return (
    <div className="card" style={{ padding: 10 }}>
      <div className="row between">
        <div>
          <p className="pixel" style={{ fontSize: 10 }}>
            {t.name}
          </p>
          <p
            className="tiny pixel"
            style={{ color: "var(--c-dark)", marginTop: 4 }}
          >
            {t.day} · {t.bucket}
            {t.flag && (
              <span style={{ marginLeft: 6, color: flagColor[t.flag] }}>
                ♦ {t.flag}
              </span>
            )}
          </p>
        </div>
        <span
          className="pixel"
          style={{
            fontSize: 12,
            color: t.amt > 0 ? "var(--c-mid)" : "var(--c-darkest)",
          }}
        >
          {t.amt > 0 ? "+" : ""}${Math.abs(t.amt).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function ScanDialog({ stage, onScan, onClose }) {
  return (
    <div className="dialog-bg" onClick={onClose}>
      <div
        className="card stack"
        style={{ width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="pixel">SCAN RECEIPT</h2>

        {stage === 0 && (
          <>
            <div
              style={{
                height: 200,
                background:
                  "repeating-linear-gradient(45deg, var(--c-cream) 0 8px, var(--c-cream-shadow) 8px 16px)",
                border: "4px solid var(--c-darkest)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="pixel"
                style={{ fontSize: 10, color: "var(--c-dark)" }}
              >
                POINT AT RECEIPT
              </span>
            </div>
            <button className="btn full" onClick={onScan}>
              ● CAPTURE
            </button>
          </>
        )}

        {stage === 1 && (
          <>
            <div
              style={{
                height: 200,
                background: "var(--c-darkest)",
                border: "4px solid var(--c-darkest)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="scanline" />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="pixel shimmer"
                  style={{ fontSize: 10, color: "var(--c-bg)" }}
                >
                  READING...
                </span>
              </div>
            </div>
            <p className="body center">analyzing pixels…</p>
          </>
        )}

        {stage === 2 && (
          <>
            <div className="stack-sm">
              <h3 className="pixel">★ CONFIRM</h3>
              <div
                className="card"
                style={{ padding: 10, background: "var(--c-bg)" }}
              >
                <div className="row between">
                  <span className="body">Merchant</span>
                  <span className="body">
                    <b>WHOLE FOODS</b>
                  </span>
                </div>
                <div className="row between">
                  <span className="body">Total</span>
                  <span className="body">
                    <b>$84.20</b>
                  </span>
                </div>
                <div className="row between">
                  <span className="body">Bucket</span>
                  <select
                    className="input"
                    style={{ width: "auto", padding: "4px 6px", fontSize: 18 }}
                    defaultValue="NEEDS"
                  >
                    <option>NEEDS</option>
                    <option>WANTS</option>
                    <option>SAVE</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button
                className="btn secondary full small"
                onClick={onClose}
              >
                CANCEL
              </button>
              <button className="btn full" onClick={onClose}>
                SAVE ▸
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InvestTab({ user, setUser }) {
  const [confirm, setConfirm] = useState(null);

  const picks =
    {
      Conservative: [
        { sym: "BND", name: "Total Bond Index", why: "Steady. Pays you to sit still." },
        { sym: "VTI", name: "Total US Stock Index", why: "A slice of every public US company." },
        { sym: "VYM", name: "High-Dividend ETF", why: "Boring companies that pay you." },
      ],
      Moderate: [
        { sym: "VTI", name: "Total US Stock Index", why: "The classic core. Everybody owns this." },
        { sym: "VXUS", name: "International Stocks", why: "Diversify outside the US." },
        { sym: "BND", name: "Total Bond Index", why: "Ballast for the swings." },
      ],
      Aggressive: [
        { sym: "QQQ", name: "Nasdaq-100 ETF", why: "Big tech, more volatile." },
        { sym: "VTI", name: "Total US Stock Index", why: "Still a great core holding." },
        { sym: "AVUV", name: "Small-Cap Value", why: "Riskier, historically rewarded." },
      ],
    }[user.risk] || [];

  const plant = (p, amt) => {
    setUser((u) => ({
      ...u,
      plants: [
        ...u.plants,
        {
          id: Date.now(),
          type: amt < 25 ? "seed" : amt < 100 ? "sprout" : amt < 500 ? "bud" : "bloom",
          value: amt,
          weeks: 0,
          label: p.sym,
          tint: randomTint(),
        },
      ],
    }));
    setConfirm(null);
  };

  return (
    <div className="screen-enter pad stack">
      <h2 className="pixel">INVEST</h2>
      <div className="card green stack-sm">
        <div className="row between">
          <div>
            <h3 className="pixel" style={{ color: "var(--c-bg)" }}>
              ★ YOUR PROFILE
            </h3>
            <p
              className="body"
              style={{ color: "var(--c-bg)", fontSize: 22, marginTop: 4 }}
            >
              {user.risk.toUpperCase()}
            </p>
          </div>
          <PixelSprite pixels={SPROUT_PIXELS.bud} scale={4} />
        </div>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <div className="chip cream" style={{ flex: 1, justifyContent: "center" }}>
          ROTH IRA
        </div>
        <div className="chip" style={{ flex: 1, justifyContent: "center" }}>
          TAXABLE
        </div>
      </div>

      <h3 className="pixel">★ PICKS FOR YOU</h3>
      <div className="stack-sm">
        {picks.map((p) => (
          <div key={p.sym} className="card stack-sm">
            <div className="row between">
              <div>
                <p className="pixel" style={{ fontSize: 12 }}>
                  {p.sym}
                </p>
                <p
                  className="tiny pixel"
                  style={{ color: "var(--c-dark)", marginTop: 4 }}
                >
                  {p.name}
                </p>
              </div>
              <button className="btn small" onClick={() => setConfirm(p)}>
                + PLANT
              </button>
            </div>
            <p className="body">→ {p.why}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: "var(--c-cream)" }}>
        <h3 className="pixel">▢ MICRO-LESSON</h3>
        <p className="body" style={{ marginTop: 6 }}>
          <b>An ETF</b> is a basket of stocks you buy as one ticker.
          Diversification, on easy mode.
        </p>
      </div>

      <div style={{ height: 12 }} />

      {confirm && (
        <InvestConfirm
          pick={confirm}
          onCancel={() => setConfirm(null)}
          onPlant={plant}
        />
      )}
    </div>
  );
}

function InvestConfirm({ pick, onCancel, onPlant }) {
  const [amt, setAmt] = useState(25);
  const plantType =
    amt < 25 ? "seed" : amt < 100 ? "sprout" : amt < 500 ? "bud" : "bloom";
  return (
    <div className="dialog-bg" onClick={onCancel}>
      <div
        className="card stack"
        style={{ width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="pixel">PLANT {pick.sym}</h2>

        <div className="center" style={{ padding: 8 }}>
          <PixelSprite pixels={SPROUT_PIXELS[plantType]} scale={7} />
        </div>

        <div className="card" style={{ background: "var(--c-bg)", padding: 10 }}>
          <p className="body">{pick.why}</p>
        </div>

        <div>
          <label className="input-label">AMOUNT · ${amt}</label>
          <input
            type="range"
            className="pix"
            min={1}
            max={500}
            step={1}
            value={amt}
            onChange={(e) => setAmt(Number(e.target.value))}
          />
        </div>

        <div className="row wrap" style={{ gap: 6 }}>
          {[5, 25, 50, 100, 250].map((v) => (
            <button
              key={v}
              className="btn secondary small"
              onClick={() => setAmt(v)}
            >
              ${v}
            </button>
          ))}
        </div>

        <p className="tiny pixel" style={{ color: "var(--c-dark)" }}>
          ▢ TRADES SETTLE NEXT BUSINESS DAY · NOT ADVICE
        </p>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn secondary full small" onClick={onCancel}>
            CANCEL
          </button>
          <button className="btn full" onClick={() => onPlant(pick, amt)}>
            PLANT ${amt} ▸
          </button>
        </div>
      </div>
    </div>
  );
}

function GardenTab({ user }) {
  const tweaks = useContext(TweaksContext);
  const [yearsAhead, setYearsAhead] = useState(0);
  const [focused, setFocused] = useState(null);

  const growthRate =
    { Conservative: 0.05, Moderate: 0.07, Aggressive: 0.09 }[user.risk] || 0.07;
  const projected = (v) => v * Math.pow(1 + growthRate, yearsAhead);

  const total = user.plants.reduce((s, p) => s + p.value, 0);
  const futureTotal = user.plants.reduce(
    (s, p) => s + projected(p.value),
    0
  );

  const cols = 4;
  const rows = 4;
  const slots = Array.from(
    { length: cols * rows },
    (_, i) => user.plants[i] || null
  );

  const stageFor = (p) => {
    if (!p) return null;
    if (yearsAhead >= 10) return "tree";
    if (yearsAhead >= 5) return "bloom";
    if (yearsAhead >= 1) return "bud";
    return p.type;
  };

  return (
    <div className="screen-enter pad stack">
      <div className="row between">
        <h2 className="pixel">GARDEN</h2>
        <span className="chip gold">
          {user.plants.length} PLANT{user.plants.length !== 1 ? "S" : ""}
        </span>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            background:
              "linear-gradient(to bottom, var(--c-bg) 0%, var(--c-bg) 60%, var(--c-mid-light) 60%, var(--c-mid) 100%)",
            padding: 12,
            position: "relative",
          }}
        >
          <div
            className="cloud"
            style={{ top: 8, left: 24, animationDuration: "20s" }}
          />
          <div
            className="cloud"
            style={{
              top: 20,
              left: 180,
              animationDuration: "24s",
              animationDelay: "-10s",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 6,
              marginTop: 28,
            }}
          >
            {slots.map((p, i) => {
              const stage = stageFor(p);
              const tinted =
                tweaks.variety &&
                (stage === "bud" || stage === "bloom" || stage === "tree");
              return (
                <div
                  key={i}
                  className={"plot" + (p ? "" : " empty")}
                  onClick={() => p && setFocused(p)}
                >
                  {p && (
                    <PixelSprite
                      pixels={SPROUT_PIXELS[stage] || SPROUT_PIXELS.sprout}
                      scale={3.5}
                      tint={tinted ? p.tint : null}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card stack-sm">
        <div className="row between">
          <h3 className="pixel">▸ TIME TRAVEL</h3>
          <span
            className="chip"
            style={{ background: "var(--c-dark)", color: "var(--c-bg)" }}
          >
            +{yearsAhead}Y
          </span>
        </div>
        <input
          type="range"
          className="pix"
          min={0}
          max={30}
          step={1}
          value={yearsAhead}
          onChange={(e) => setYearsAhead(Number(e.target.value))}
        />
        <div className="row" style={{ gap: 6 }}>
          {[0, 1, 5, 10, 30].map((y) => (
            <button
              key={y}
              className="btn secondary small"
              onClick={() => setYearsAhead(y)}
            >
              +{y}Y
            </button>
          ))}
        </div>
        <div className="row between" style={{ marginTop: 4 }}>
          <span className="body">
            Today: <b>${total.toFixed(2)}</b>
          </span>
          <span className="body">
            +{yearsAhead}y:{" "}
            <b style={{ color: "var(--c-dark)" }}>
              ${futureTotal.toFixed(2)}
            </b>
          </span>
        </div>
        <p className="tiny pixel" style={{ color: "var(--c-dark)" }}>
          ▢ Based on {(growthRate * 100).toFixed(0)}%/yr — historical avg,
          not a promise.
        </p>
      </div>

      <h3 className="pixel">★ ACHIEVEMENTS</h3>
      <div className="row wrap" style={{ gap: 8 }}>
        <Achievement done label="FIRST SPROUT" />
        <Achievement done={user.plants.length >= 3} label="3-PLANT POT" />
        <Achievement done={false} label="7-DAY STREAK" />
        <Achievement done={false} label="$100 PLANTED" />
      </div>

      <div style={{ height: 12 }} />

      {focused && (
        <PlantDialog
          plant={focused}
          stage={stageFor(focused)}
          years={yearsAhead}
          proj={projected(focused.value)}
          tint={tweaks.variety ? focused.tint : null}
          onClose={() => setFocused(null)}
        />
      )}
    </div>
  );
}

function Achievement({ done, label }) {
  return (
    <div
      className="chip"
      style={{
        background: done ? "var(--c-mid)" : "var(--c-cream)",
        color: done ? "var(--c-bg)" : "var(--c-dark)",
        opacity: done ? 1 : 0.6,
      }}
    >
      {done ? "★" : "○"} {label}
    </div>
  );
}

function PlantDialog({ plant, stage, years, proj, tint, onClose }) {
  return (
    <div className="dialog-bg" onClick={onClose}>
      <div
        className="card stack"
        style={{ width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="row between">
          <h2 className="pixel">{plant.label}</h2>
          <button className="btn secondary small" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="center" style={{ padding: 8 }}>
          <PixelSprite
            pixels={SPROUT_PIXELS[stage] || SPROUT_PIXELS.sprout}
            scale={9}
            tint={tint}
          />
        </div>
        <div className="card" style={{ background: "var(--c-bg)" }}>
          <div className="row between">
            <span className="body">Planted</span>
            <span className="body">
              <b>${plant.value.toFixed(2)}</b>
            </span>
          </div>
          <div className="row between">
            <span className="body">+{years}y projection</span>
            <span className="body">
              <b style={{ color: "var(--c-dark)" }}>${proj.toFixed(2)}</b>
            </span>
          </div>
          <div className="row between">
            <span className="body">Stage</span>
            <span className="body">
              <b>{(stage || "sprout").toUpperCase()}</b>
            </span>
          </div>
        </div>
        <button className="btn full">+ WATER (ADD $)</button>
      </div>
    </div>
  );
}

function ProfileTab({ user }) {
  const rows = [
    { label: "GOALS", value: "Retirement · House" },
    { label: "RISK", value: user.risk },
    {
      label: "SPLIT",
      value: `${user.splits.needs}/${user.splits.wants}/${user.splits.save}`,
    },
    { label: "BANK", value: "Sprout FCU ****4291" },
  ];
  return (
    <div className="screen-enter pad stack">
      <div className="center" style={{ padding: "12px 0" }}>
        <PixelSprite pixels={SPROUT_PIXELS.bloom} scale={7} />
        <h2 className="pixel" style={{ marginTop: 12 }}>
          PLAYER 1
        </h2>
        <p
          className="tiny pixel"
          style={{ color: "var(--c-dark)", marginTop: 4 }}
        >
          GARDENING SINCE MAY 2026
        </p>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p className="pixel" style={{ fontSize: 14 }}>
            {user.plants.length}
          </p>
          <p
            className="tiny pixel"
            style={{ color: "var(--c-dark)", marginTop: 4 }}
          >
            PLANTS
          </p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p className="pixel" style={{ fontSize: 14 }}>
            3
          </p>
          <p
            className="tiny pixel"
            style={{ color: "var(--c-dark)", marginTop: 4 }}
          >
            STREAK
          </p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: "center" }}>
          <p className="pixel" style={{ fontSize: 14 }}>
            $1
          </p>
          <p
            className="tiny pixel"
            style={{ color: "var(--c-dark)", marginTop: 4 }}
          >
            INVESTED
          </p>
        </div>
      </div>

      <div className="card stack-sm">
        {rows.map((r, i) => (
          <div
            key={i}
            className="row between"
            style={{
              padding: "6px 0",
              borderBottom:
                i < rows.length - 1
                  ? "3px solid var(--c-cream-shadow)"
                  : "none",
            }}
          >
            <span className="tiny pixel" style={{ color: "var(--c-dark)" }}>
              {r.label}
            </span>
            <span className="body">{r.value}</span>
          </div>
        ))}
      </div>

      <button className="btn full">★ RETAKE RISK QUIZ</button>
      <button className="btn full secondary">⚙ SETTINGS</button>
      <button className="btn full secondary">? HELP &amp; SUPPORT</button>
      <button className="btn full danger">⎋ LOG OUT</button>

      <p
        className="tiny pixel center"
        style={{ color: "var(--c-dark)", marginTop: 8 }}
      >
        SPROUT v0.1 · ▢ NOT INVESTMENT ADVICE
      </p>
      <div style={{ height: 12 }} />
    </div>
  );
}
