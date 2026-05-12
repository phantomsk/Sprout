"use client";

import { useState, useContext } from "react";
import {
  PixelSprite,
  SPROUT_PIXELS,
  ICONS,
  TweaksContext,
  randomTint,
} from "./PixelSprite";

export function MainApp({ tab, setTab, user, setUser, onSignOut }) {
  return (
    <>
      <div className="screen has-nav">
        {tab === "home" && (
          <HomeTab user={user} setUser={setUser} setTab={setTab} />
        )}
        {tab === "budget" && <BudgetTab user={user} setUser={setUser} />}
        {tab === "invest" && <InvestTab user={user} setUser={setUser} />}
        {tab === "garden" && <GardenTab user={user} setUser={setUser} />}
        {tab === "profile" && (
          <ProfileTab user={user} setUser={setUser} onSignOut={onSignOut} />
        )}
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
  const [nudgeIdx, setNudgeIdx] = useState(0);

  const moods = [
    { e: "◕‿◕", label: "GOOD" },
    { e: "⊙_⊙", label: "MEH" },
    { e: "×_×", label: "BAD" },
  ];

  const nudges = [
    { icon: "🍕", text: "Delivery 6× this week — soft limit?", color: "var(--c-accent)" },
    { icon: "✓", text: "$48 under in WANTS. Nice pacing!", color: "var(--c-mid)" },
    { icon: "💰", text: "Payday Fri — auto-plant $25", color: "var(--c-dark)" },
  ];

  const totalSpent = Math.round(
    dollars(user.splits.needs) * spent.needs +
    dollars(user.splits.wants) * spent.wants +
    dollars(user.splits.save) * spent.save
  );
  const totalInvested = user.plants.reduce((s, p) => s + p.value, 0);
  const firstName = (user.name || "Player 1").split(" ")[0];

  return (
    <div
      className="screen-enter pad"
      style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "auto" }}
    >
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img
          src="/animated-logo.gif"
          alt="Sprout"
          style={{ width: 300, height: 200, objectFit: "contain", marginTop: -16, marginBottom: -30 }}
        />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", width: "100%" }}>
          <h2 className="pixel" style={{ fontSize: 20 }}>
            HEY, {firstName.toUpperCase()}
          </h2>
          <p className="tiny pixel" style={{ color: "var(--c-dark)", textAlign: "right" }}>
            GROW YOUR<br />WEALTH
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          className="btn small"
          style={{ flex: 1, background: "var(--c-accent)", color: "var(--c-darkest)", borderColor: "var(--c-accent)" }}
          onClick={() => setTab("budget")}
        >
          ▦ SCAN
        </button>
        <button
          className="btn small"
          style={{ flex: 1, background: "var(--c-mid)", color: "var(--c-bg)", borderColor: "var(--c-mid)" }}
          onClick={() => setTab("budget")}
        >
          + LOG
        </button>
        <button
          className="btn small"
          style={{ flex: 1, background: "var(--c-dark)", color: "var(--c-bg)", borderColor: "var(--c-dark)" }}
          onClick={() => setTab("invest")}
        >
          ↑ INVEST
        </button>
      </div>

      {/* Main widget area */}
      <div style={{ flex: 1, paddingTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <StatWidget
            value={`$${totalSpent}`}
            label="SPENT"
            sub={`of $${user.income}`}
            onClick={() => setTab("budget")}
          />
          <StatWidget
            value={`$${totalInvested.toFixed(0)}`}
            label="INVESTED"
            sub={`${user.plants.length} plant${user.plants.length !== 1 ? "s" : ""}`}
            onClick={() => setTab("invest")}
          />
          <StatWidget
            value={`${Math.round((1 - (totalSpent / user.income)) * 100)}%`}
            label="LEFT"
            sub={`$${user.income - totalSpent}`}
            onClick={() => setTab("budget")}
          />
        </div>

        {/* 2-col widget grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
          {/* Budget widget — spans 2 rows */}
          <div
            className="card"
            style={{ padding: 14, cursor: "pointer", gridRow: "span 2", display: "flex", flexDirection: "column" }}
            onClick={() => setTab("budget")}
          >
            <p className="tiny pixel" style={{ color: "var(--c-dark)", marginBottom: 10 }}>
              BUDGET
            </p>
            <div style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center" }}>
              <MiniPie splits={user.splits} income={user.income} />
            </div>
            <div style={{ marginTop: 10 }}>
              <MiniBar label="N" pct={spent.needs} amt={`$${Math.round(dollars(user.splits.needs) * spent.needs)}`} color="var(--c-dark)" />
              <MiniBar label="W" pct={spent.wants} amt={`$${Math.round(dollars(user.splits.wants) * spent.wants)}`} color="var(--c-accent)" />
              <MiniBar label="S" pct={spent.save} amt={`$${Math.round(dollars(user.splits.save) * spent.save)}`} color="var(--c-mid-light)" />
            </div>
          </div>

          {/* Garden widget */}
          <div
            className="card green"
            style={{ padding: 14, cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column" }}
            onClick={() => setTab("garden")}
          >
            <p className="tiny pixel" style={{ color: "var(--c-bg)", marginBottom: 8 }}>
              GARDEN
            </p>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flex: 1, alignItems: "center" }}>
              <PixelSprite pixels={SPROUT_PIXELS.sprout} scale={3} />
              <PixelSprite pixels={SPROUT_PIXELS.seed} scale={3} />
              <PixelSprite pixels={SPROUT_PIXELS.seed} scale={3} bob={false} />
            </div>
            <p className="tiny pixel" style={{ color: "var(--c-bg)", marginTop: 6, textAlign: "center" }}>
              {user.plants.length} PLANT{user.plants.length !== 1 ? "S" : ""} · ${totalInvested.toFixed(2)}
            </p>
          </div>

          {/* Mood widget */}
          <div className="card" style={{ padding: 14, display: "flex", flexDirection: "column" }}>
            {mood === null ? (
              <>
                <p className="tiny pixel" style={{ color: "var(--c-dark)", marginBottom: 8 }}>
                  VIBE CHECK
                </p>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flex: 1, alignItems: "center" }}>
                  {moods.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => { setMood(i); setUser((u) => ({ ...u, mood: i })); }}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        border: "none",
                        background: "var(--c-cream)",
                        cursor: "pointer",
                        fontSize: 15,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {m.e}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="tiny pixel" style={{ color: "var(--c-dark)", marginBottom: 4 }}>
                  VIBE
                </p>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ fontSize: 28, lineHeight: 1 }}>{moods[mood].e}</p>
                  <p className="tiny pixel" style={{ color: "var(--c-dark)", marginTop: 6 }}>
                    {moods[mood].label}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Nudge ticker */}
        <div
          className="card"
          style={{
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => setNudgeIdx((i) => (i + 1) % nudges.length)}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: nudges[nudgeIdx].color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {nudges[nudgeIdx].icon}
          </span>
          <p className="body" style={{ fontSize: 13, lineHeight: 1.35, flex: 1 }}>
            {nudges[nudgeIdx].text}
          </p>
          <span className="tiny pixel" style={{ color: "var(--c-cream-shadow)", flexShrink: 0 }}>
            {nudgeIdx + 1}/{nudges.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ value, label, sub, onClick }) {
  return (
    <div
      className="card"
      style={{ textAlign: "center", padding: "12px 6px", cursor: "pointer" }}
      onClick={onClick}
    >
      <p className="pixel" style={{ fontSize: 15, color: "var(--c-darkest)" }}>
        {value}
      </p>
      <p className="tiny pixel" style={{ color: "var(--c-dark)", marginTop: 3 }}>
        {label}
      </p>
      <p
        className="body"
        style={{ fontSize: 11, color: "var(--c-mid)", marginTop: 2, fontWeight: 600 }}
      >
        {sub}
      </p>
    </div>
  );
}

function MiniPie({ splits, income }) {
  const data = [
    { value: splits.needs, color: "var(--c-dark)" },
    { value: splits.wants, color: "var(--c-accent)" },
    { value: splits.save, color: "var(--c-mid-light)" },
  ].filter((d) => d.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 48;
  const cx = r;
  const cy = r;
  const vb = r * 2;
  let cum = -Math.PI / 2;
  return (
    <svg width="100%" viewBox={`0 0 ${vb} ${vb}`} style={{ maxWidth: 140, display: "block" }}>
      {data.length === 1 ? (
        <circle cx={cx} cy={cy} r={r} fill={data[0].color} />
      ) : (
        data.map((d, i) => {
          const angle = (d.value / total) * 2 * Math.PI;
          const a0 = cum;
          cum += angle;
          const a1 = cum;
          const x0 = cx + r * Math.cos(a0);
          const y0 = cy + r * Math.sin(a0);
          const x1 = cx + r * Math.cos(a1);
          const y1 = cy + r * Math.sin(a1);
          const large = angle > Math.PI ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
              fill={d.color}
              stroke="#fff"
              strokeWidth="1.5"
            />
          );
        })
      )}
      <circle cx={cx} cy={cy} r={r * 0.38} fill="var(--c-cream)" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--c-dark)">
        ${(income / 1000).toFixed(1)}K
      </text>
    </svg>
  );
}

function MiniBar({ label, pct, amt, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
      <span className="tiny pixel" style={{ color: "var(--c-dark)", width: 12 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: "var(--c-cream-shadow)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(1, pct) * 100}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      {amt && <span style={{ fontSize: 9, fontWeight: 600, color: "var(--c-dark)", minWidth: 28, textAlign: "right" }}>{amt}</span>}
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

function BudgetTab({ user, setUser }) {
  const [showScan, setShowScan] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const dollars = (pct) => Math.round((user.income * pct) / 100);

  const baseTxns = [
    { name: "WHOLE FOODS", amt: -84.2, bucket: "NEEDS", flag: null, day: "Today", order: 7 },
    { name: "DOORDASH", amt: -22.55, bucket: "WANTS", flag: "delivery", day: "Today", order: 6 },
    { name: "PAYCHECK", amt: +1600, bucket: "IN", flag: null, day: "Yesterday", order: 5 },
    { name: "STEAM", amt: -29.99, bucket: "WANTS", flag: "impulse", day: "Mon", order: 4 },
    { name: "CON ED", amt: -78.0, bucket: "NEEDS", flag: null, day: "Mon", order: 3 },
    { name: "DOORDASH", amt: -19.1, bucket: "WANTS", flag: "delivery", day: "Sun", order: 2 },
    { name: "TRADER JOE'S", amt: -41.88, bucket: "NEEDS", flag: null, day: "Sun", order: 1 },
  ];

  const userTxns = (user.txns || []).map((t) => ({
    id: t.id,
    name: t.name,
    amt: -Math.abs(Number(t.price) || 0),
    bucket: t.category,
    flag: t.source,
    day: t.day || "Today",
    order: t.id, // numeric id timestamp = chronological
  }));

  const allTxns = [...userTxns, ...baseTxns].sort((a, b) => b.order - a.order);

  const q = query.trim().toLowerCase();
  const filtered = allTxns.filter((t) => {
    if (filter !== "ALL" && t.bucket !== filter) return false;
    if (q && !t.name.toLowerCase().includes(q)) return false;
    return true;
  });

  const onScanned = (result) => {
    const items = result.items.map((it, idx) => ({
      id: Date.now() + idx,
      name: it.name,
      price: Number(it.price) || 0,
      category: it.category,
      merchant: result.merchant,
      day: "Today",
      source: "scanned",
    }));
    setUser((u) => ({ ...u, txns: [...items, ...(u.txns || [])] }));
  };

  const onManual = (item) => {
    const t = { ...item, id: Date.now(), source: "manual", day: "Today" };
    setUser((u) => ({ ...u, txns: [t, ...(u.txns || [])] }));
  };

  return (
    <div className="screen-enter pad stack">
      <h2 className="pixel">BUDGET</h2>

      <div className="card stack-sm">
        <h3 className="pixel">★ MAY</h3>
        <BucketPie splits={user.splits} income={user.income} />
        <div className="stack-sm" style={{ marginTop: 4 }}>
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
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button className="btn full" onClick={() => setShowScan(true)}>
          ▦ SCAN  RECEIPT
        </button>
        <button
          className="btn full secondary"
          onClick={() => setShowManual(true)}
        >
          + MANUAL
        </button>
      </div>

      <h3 className="pixel" style={{ marginTop: 8 }}>
        ★ RECENT
      </h3>

      <input
        className="input"
        placeholder="Search items…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ fontSize: 14, padding: "10px 12px" }}
      />

      <div className="row wrap" style={{ gap: 6 }}>
        {["ALL", "NEEDS", "WANTS", "SAVE", "IN"].map((cat) => {
          const on = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="chip"
              style={{
                cursor: "pointer",
                background: on ? "var(--c-dark)" : "var(--c-cream)",
                color: on ? "var(--c-bg)" : "var(--c-dark)",
                border: on
                  ? "1px solid var(--c-dark)"
                  : "1px solid rgba(45,80,22,0.12)",
              }}
            >
              {cat}
            </button>
          );
        })}
        <span
          className="tiny pixel grow"
          style={{ color: "var(--c-dark)", textAlign: "right" }}
        >
          {filtered.length} OF {allTxns.length}
        </span>
      </div>

      <div className="stack-sm">
        {filtered.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 20,
              textAlign: "center",
              background: "transparent",
              border: "1.5px dashed rgba(45,80,22,0.18)",
              boxShadow: "none",
            }}
          >
            <p className="body" style={{ color: "var(--c-dark)" }}>
              No transactions match.
            </p>
          </div>
        ) : (
          filtered.map((t, i) => (
            <TxnRow key={t.id ?? `base-${i}`} t={t} />
          ))
        )}
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
          onClose={() => setShowScan(false)}
          onSave={onScanned}
        />
      )}
      {showManual && (
        <ManualDialog
          onClose={() => setShowManual(false)}
          onSave={onManual}
        />
      )}
    </div>
  );
}

function BucketPie({ splits, income }) {
  const data = [
    { label: "NEEDS", value: splits.needs, color: "var(--c-dark)" },
    { label: "WANTS", value: splits.wants, color: "var(--c-accent)" },
    { label: "SAVE", value: splits.save, color: "var(--c-mid-light)" },
  ].filter((d) => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const size = 132;
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  let cum = -Math.PI / 2;

  return (
    <div
      className="row"
      style={{ gap: 16, alignItems: "center", marginTop: 4 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ flexShrink: 0 }}
      >
        {data.length === 1 ? (
          <circle cx={cx} cy={cy} r={r} fill={data[0].color} />
        ) : (
          data.map((d, i) => {
            const angle = (d.value / total) * 2 * Math.PI;
            const a0 = cum;
            cum += angle;
            const a1 = cum;
            const x0 = cx + r * Math.cos(a0);
            const y0 = cy + r * Math.sin(a0);
            const x1 = cx + r * Math.cos(a1);
            const y1 = cy + r * Math.sin(a1);
            const large = angle > Math.PI ? 1 : 0;
            const path = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
            return (
              <path
                key={d.label}
                d={path}
                fill={d.color}
                stroke="#fff"
                strokeWidth="2"
              />
            );
          })
        )}
        <circle cx={cx} cy={cy} r={r * 0.42} fill="var(--c-cream)" />
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--c-dark)"
        >
          ${(income / 1000).toFixed(1)}K
        </text>
      </svg>
      <div className="stack-sm" style={{ flex: 1, minWidth: 0 }}>
        {data.map((d) => (
          <div
            key={d.label}
            className="row"
            style={{ gap: 8, alignItems: "center" }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                background: d.color,
                borderRadius: 3,
                flexShrink: 0,
              }}
            />
            <span
              className="tiny pixel"
              style={{ color: "var(--c-dark)", flexShrink: 0 }}
            >
              {d.label}
            </span>
            <span
              className="tiny pixel grow"
              style={{ textAlign: "right", color: "var(--c-darkest)" }}
            >
              {d.value}% · ${Math.round((income * d.value) / 100)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManualDialog({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("NEEDS");
  const valid = name.trim().length > 0 && Number(price) > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      name: name.trim().toUpperCase(),
      price: Number(price),
      category,
    });
    onClose();
  };

  return (
    <div className="dialog-bg" onClick={onClose}>
      <div className="card stack" onClick={(e) => e.stopPropagation()}>
        <div className="row between">
          <h2 className="pixel">ADD MANUALLY</h2>
          <button className="btn secondary small" onClick={onClose}>
            ✕
          </button>
        </div>

        <div>
          <label className="input-label">ITEM</label>
          <input
            className="input"
            placeholder="e.g. Whole Foods"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className="input-label">AMOUNT ($)</label>
          <input
            className="input"
            type="number"
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="input-label">CATEGORY</label>
          <div className="row" style={{ gap: 6 }}>
            {["NEEDS", "WANTS", "SAVE"].map((c) => (
              <button
                key={c}
                className={"btn small" + (category === c ? "" : " secondary")}
                style={{ flex: 1 }}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <button className="btn secondary full small" onClick={onClose}>
            CANCEL
          </button>
          <button className="btn full" onClick={submit} disabled={!valid}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}

function TxnRow({ t }) {
  const flagColor = {
    impulse: "var(--c-danger)",
    delivery: "var(--c-accent)",
    scanned: "var(--c-mid)",
    manual: "var(--c-dark)",
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

function ScanDialog({ onClose, onSave }) {
  const [stage, setStage] = useState("pick");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const analyze = async () => {
    if (!file) return;
    setStage("loading");
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/scan", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      if (!data.items || data.items.length === 0)
        throw new Error("No items detected in this receipt");
      setResult(data);
      setStage("review");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setStage("error");
    }
  };

  const updateItem = (i, patch) => {
    setResult((r) => ({
      ...r,
      items: r.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }));
  };
  const removeItem = (i) => {
    setResult((r) => ({
      ...r,
      items: r.items.filter((_, idx) => idx !== i),
    }));
  };

  const commit = () => {
    if (onSave) onSave(result);
    onClose();
  };

  return (
    <div className="dialog-bg" onClick={onClose}>
      <div className="card stack" onClick={(e) => e.stopPropagation()}>
        <div className="row between">
          <h2 className="pixel">SCAN RECEIPT</h2>
          <button className="btn secondary small" onClick={onClose}>
            ✕
          </button>
        </div>

        {stage === "pick" && (
          <>
            {!preview ? (
              <label
                className="card"
                style={{
                  cursor: "pointer",
                  padding: 28,
                  textAlign: "center",
                  background: "transparent",
                  border: "1.5px dashed rgba(45, 80, 22, 0.25)",
                  boxShadow: "none",
                }}
              >
                <p className="body" style={{ fontWeight: 600 }}>
                  Tap to pick a receipt photo
                </p>
                <p
                  className="tiny pixel"
                  style={{ color: "var(--c-dark)", marginTop: 6 }}
                >
                  JPG OR PNG · CAMERA OPENS ON MOBILE
                </p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </label>
            ) : (
              <img
                src={preview}
                alt="receipt preview"
                style={{
                  width: "100%",
                  maxHeight: 320,
                  objectFit: "contain",
                  borderRadius: 10,
                  border: "1px solid rgba(45, 80, 22, 0.12)",
                  background: "#fff",
                }}
              />
            )}
            {preview && (
              <div className="row" style={{ gap: 8 }}>
                <label
                  className="btn secondary full small"
                  style={{ cursor: "pointer" }}
                >
                  REPLACE
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={handleFile}
                  />
                </label>
                <button className="btn full" onClick={analyze}>
                  ANALYZE ▸
                </button>
              </div>
            )}
          </>
        )}

        {stage === "loading" && (
          <div
            className="center"
            style={{ padding: 28, display: "grid", gap: 8 }}
          >
            <p className="body shimmer" style={{ fontWeight: 600 }}>
              analyzing receipt…
            </p>
            <p className="tiny pixel" style={{ color: "var(--c-dark)" }}>
              USUALLY A FEW SECONDS
            </p>
          </div>
        )}

        {stage === "error" && (
          <>
            <div
              className="card"
              style={{
                background: "var(--c-danger)",
                color: "var(--c-cream)",
                borderColor: "transparent",
              }}
            >
              <p className="body" style={{ color: "var(--c-cream)" }}>
                ♦ {error}
              </p>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button
                className="btn secondary full small"
                onClick={onClose}
              >
                CLOSE
              </button>
              <button
                className="btn full"
                onClick={() => setStage("pick")}
              >
                TRY AGAIN
              </button>
            </div>
          </>
        )}

        {stage === "review" && result && (
          <>
            <div className="row between">
              <div>
                <p className="tiny pixel" style={{ color: "var(--c-dark)" }}>
                  MERCHANT
                </p>
                <p className="body" style={{ fontWeight: 700 }}>
                  {result.merchant}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="tiny pixel" style={{ color: "var(--c-dark)" }}>
                  TOTAL
                </p>
                <p className="body" style={{ fontWeight: 700 }}>
                  ${Number(result.total).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="stack-sm">
              {result.items.map((it, i) => (
                <ItemRow
                  key={i}
                  item={it}
                  onChange={(patch) => updateItem(i, patch)}
                  onRemove={() => removeItem(i)}
                />
              ))}
            </div>
            <p
              className="tiny pixel center"
              style={{ color: "var(--c-dark)" }}
            >
              ▢ AI-GUESSED CATEGORIES · TAP TO ADJUST
            </p>
            <div className="row" style={{ gap: 8 }}>
              <button
                className="btn secondary full small"
                onClick={onClose}
              >
                CANCEL
              </button>
              <button
                className="btn full"
                onClick={commit}
                disabled={!result.items.length}
              >
                SAVE {result.items.length} ITEM
                {result.items.length !== 1 ? "S" : ""}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ItemRow({ item, onChange, onRemove }) {
  const cats = ["NEEDS", "WANTS", "SAVE"];
  return (
    <div className="card" style={{ padding: 10 }}>
      <div className="row" style={{ gap: 8 }}>
        <input
          className="input"
          style={{ fontSize: 14, padding: "8px 10px", flex: 1 }}
          value={item.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <input
          className="input"
          type="number"
          step="0.01"
          style={{ fontSize: 14, padding: "8px 10px", width: 86 }}
          value={item.price}
          onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
        />
      </div>
      <div className="row" style={{ gap: 6, marginTop: 8 }}>
        {cats.map((cat) => (
          <button
            key={cat}
            className={"btn small" + (item.category === cat ? "" : " secondary")}
            style={{ flex: 1, padding: "8px 6px" }}
            onClick={() => onChange({ category: cat })}
          >
            {cat}
          </button>
        ))}
        <button
          className="btn small secondary"
          style={{ padding: "8px 10px" }}
          onClick={onRemove}
          aria-label="Remove item"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const LEARN_SECTIONS = [
  {
    title: "RETIREMENT SAVINGS",
    sub: "Long-term growth with tax benefits.",
    icon: "★",
    items: [
      {
        name: "Traditional IRA",
        desc: "Pre-tax contributions now; pay taxes when you withdraw later.",
      },
      {
        name: "Roth IRA",
        desc: "Pay taxes now; withdrawals in retirement are tax-free.",
      },
      {
        name: "Solo 401(k)",
        desc: "High contribution limits for self-employed individuals with no employees.",
      },
      {
        name: "Roth 401(k)",
        desc: "Like a Roth IRA but through an employer.",
      },
    ],
  },
  {
    title: "FLEXIBLE INVESTING & CASH",
    sub: "Short-to-medium-term goals or general wealth building.",
    icon: "✦",
    items: [
      {
        name: "Brokerage Account",
        desc: "No limits on contributions or withdrawals — no special tax breaks either.",
      },
      {
        name: "Cash Management",
        desc: "Works like a checking account but lets you easily invest sitting cash.",
      },
      {
        name: "Round-up / Micro-invest",
        desc: "Automatically invests your spare change from everyday purchases.",
      },
      {
        name: "High-Yield Savings (HYSA)",
        desc: "A savings account that earns more interest than a regular bank account.",
      },
    ],
  },
  {
    title: "GOAL-SPECIFIC SAVINGS",
    sub: "Dedicated accounts for health and education.",
    icon: "▢",
    items: [
      {
        name: "529 Plan",
        desc: "Tax-free growth specifically for education expenses (K-12, college).",
      },
      {
        name: "Health Savings Account (HSA)",
        desc: "Triple tax-advantaged (tax-free in, growth, and out) for medical costs.",
      },
      {
        name: "Custodial (UGMA / UTMA)",
        desc: "A taxable investment account you control on behalf of a child until adulthood.",
      },
    ],
  },
  {
    title: "GROWTH ASSETS",
    sub: "Higher risk, higher reward.",
    icon: "▲",
    items: [
      { name: "Stocks", desc: "Buying a tiny piece of a company." },
      {
        name: "ETFs",
        desc: "A cluster of different stocks or bonds bundled together.",
      },
      {
        name: "Mutual Funds",
        desc: "Similar to ETFs but managed by a professional fund manager.",
      },
    ],
  },
  {
    title: "BONDS & CDS",
    sub: "Steadier, lower-risk income.",
    icon: "♦",
    items: [
      {
        name: "Bonds",
        desc: "You loan money to a government or company for a set period; they pay you back plus interest.",
      },
      {
        name: "CDs (Certificates of Deposit)",
        desc: "Agree to leave money in the bank for a fixed time in exchange for a guaranteed interest rate.",
      },
    ],
  },
];

const PICK_INFO = {
  BND: {
    type: "Bond ETF",
    more: "Holds thousands of U.S. investment-grade bonds — both government and corporate. Bonds pay regular interest, so this gives you steady income. Lower long-term returns than stocks, but far less volatile.",
  },
  VTI: {
    type: "U.S. Stock ETF",
    more: "Owns a slice of nearly every publicly traded U.S. company — from giants like Apple down to tiny ones. One ticker, very broad diversification across the U.S. market.",
  },
  VYM: {
    type: "Dividend ETF",
    more: "Focuses on established U.S. companies that consistently pay dividends. Tends to be less volatile than the broader market and produces cash flow you can reinvest or spend.",
  },
  VXUS: {
    type: "International Stock ETF",
    more: "Stocks from companies outside the U.S. — Europe, Japan, emerging markets, and more. Pairs nicely with VTI to round out exposure beyond just American companies.",
  },
  QQQ: {
    type: "Tech-Heavy ETF",
    more: "Tracks the Nasdaq-100 — the largest non-financial companies on the Nasdaq, heavily weighted toward big tech (Apple, Microsoft, Nvidia, Google, Amazon). Bigger swings than a broad index.",
  },
  AVUV: {
    type: "Small-Cap Value ETF",
    more: "Smaller U.S. companies trading at lower valuations. Historically rewarded over long timeframes, but bumpy in the short term.",
  },
};

function InvestTab({ user, setUser }) {
  const [confirm, setConfirm] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);
  const [openPick, setOpenPick] = useState(null);

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
              style={{ color: "var(--c-bg)", fontSize: 18, fontWeight: 700, marginTop: 4 }}
            >
              {user.risk.toUpperCase()}
            </p>
          </div>
          <PixelSprite pixels={SPROUT_PIXELS.bud} scale={4} />
        </div>
      </div>

      <div className="row between" style={{ marginTop: 4 }}>
        <h3 className="pixel">★ PICKS FOR YOU</h3>
        <button
          onClick={() => setShowInfo(true)}
          aria-label="What are these picks?"
          style={{
            width: 22,
            height: 22,
            padding: 0,
            border: "none",
            borderRadius: 999,
            background: "var(--c-mid)",
            color: "var(--c-bg)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          ?
        </button>
      </div>
      <div className="stack-sm">
        {picks.map((p) => {
          const info = PICK_INFO[p.sym] || {};
          const isOpen = openPick === p.sym;
          return (
            <div
              key={p.sym}
              className="card"
              onClick={() => setOpenPick(isOpen ? null : p.sym)}
              style={{ cursor: "pointer", padding: 16 }}
              role="button"
              aria-expanded={isOpen}
            >
              <div
                className="row between"
                style={{ alignItems: "flex-start", gap: 12 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="row"
                    style={{
                      gap: 6,
                      alignItems: "center",
                      marginBottom: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      className="pixel"
                      style={{
                        fontSize: 18,
                        letterSpacing: 0.5,
                        color: "var(--c-darkest)",
                      }}
                    >
                      {p.sym}
                    </p>
                    {info.type && (
                      <span
                        className="chip"
                        style={{
                          background: "var(--c-mid-light)",
                          color: "var(--c-dark)",
                          border: "1px solid rgba(45, 80, 22, 0.12)",
                        }}
                      >
                        {info.type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p
                    className="body"
                    style={{
                      color: "var(--c-dark)",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    {p.name}
                  </p>
                  <p className="body">{p.why}</p>
                </div>
                <button
                  className="btn small"
                  style={{ flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm(p);
                  }}
                >
                  + PLANT
                </button>
              </div>

              {isOpen && info.more && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(45, 80, 22, 0.1)",
                  }}
                >
                  <p
                    className="tiny pixel"
                    style={{ color: "var(--c-mid)", marginBottom: 6 }}
                  >
                    ▸ WHAT IS THIS?
                  </p>
                  <p className="body" style={{ color: "var(--c-dark)" }}>
                    {info.more}
                  </p>
                </div>
              )}

              <div
                className="row"
                style={{
                  marginTop: 14,
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >
                <span
                  className="tiny pixel"
                  style={{ color: "var(--c-dark)" }}
                >
                  {isOpen ? "LESS" : "MORE INFO"}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    background: "var(--c-mid-light)",
                    color: "var(--c-dark)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: 1,
                    transition: "transform 0.15s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ background: "var(--c-cream)" }}>
        <h3 className="pixel">▢ MICRO-LESSON</h3>
        <p className="body" style={{ marginTop: 6 }}>
          <b>An ETF</b> is a basket of stocks you buy as one ticker.
          Diversification, on easy mode.
        </p>
      </div>

      <h3 className="pixel" style={{ marginTop: 8 }}>
        ▤ LEARN
      </h3>
      <p
        className="body"
        style={{ color: "var(--c-dark)", marginTop: -4 }}
      >
        A quick guide to account types and assets. Tap to expand.
      </p>
      <div className="stack-sm">
        {LEARN_SECTIONS.map((s, i) => (
          <LearnCard
            key={s.title}
            section={s}
            open={openIdx === i}
            onToggle={() => setOpenIdx((cur) => (cur === i ? null : i))}
          />
        ))}
      </div>

      <div style={{ height: 12 }} />

      {confirm && (
        <InvestConfirm
          pick={confirm}
          onCancel={() => setConfirm(null)}
          onPlant={plant}
        />
      )}
      {showInfo && (
        <PicksInfoDialog user={user} onClose={() => setShowInfo(false)} />
      )}
    </div>
  );
}

function LearnCard({ section, open, onToggle }) {
  return (
    <div className="card" style={{ padding: 0 }}>
      <button
        onClick={onToggle}
        style={{
          background: "transparent",
          border: "none",
          padding: 14,
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          display: "block",
        }}
      >
        <div className="row between" style={{ alignItems: "flex-start" }}>
          <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
            <span
              className="pixel"
              style={{ color: "var(--c-mid)", fontSize: 14, lineHeight: 1.4 }}
            >
              {section.icon}
            </span>
            <div>
              <h3 className="pixel">{section.title}</h3>
              <p
                className="tiny pixel"
                style={{ color: "var(--c-dark)", marginTop: 4 }}
              >
                {section.sub}
              </p>
            </div>
          </div>
          <span
            aria-hidden="true"
            style={{
              color: "var(--c-dark)",
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1,
              marginTop: 2,
            }}
          >
            {open ? "−" : "+"}
          </span>
        </div>
      </button>
      {open && (
        <div
          className="stack-sm"
          style={{
            padding: "0 14px 14px 14px",
            borderTop: "1px solid rgba(45, 80, 22, 0.08)",
            paddingTop: 12,
          }}
        >
          {section.items.map((it) => (
            <div key={it.name}>
              <p
                className="body"
                style={{ fontWeight: 700, color: "var(--c-darkest)" }}
              >
                {it.name}
              </p>
              <p className="body" style={{ color: "var(--c-dark)" }}>
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PicksInfoDialog({ user, onClose }) {
  return (
    <div className="dialog-bg" onClick={onClose}>
      <div className="card stack" onClick={(e) => e.stopPropagation()}>
        <div className="row between">
          <h2 className="pixel">PICKS FOR YOU</h2>
          <button className="btn secondary small" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="body">
          These suggestions are matched to your{" "}
          <b>{user.risk.toUpperCase()}</b> risk profile from the quiz.
        </p>
        <div className="card" style={{ background: "var(--c-bg)" }}>
          <p className="body">
            We surface a small set of well-known, low-cost ETFs that line up
            with how comfortable you are with ups and downs. It&apos;s a
            starting point — not a locked-in plan.
          </p>
        </div>
        <p className="body">
          <b>Want to dig deeper?</b> The <b>LEARN</b> section below has quick
          definitions for every account type (Roth IRA, 401k, HSA, 529…) and
          asset kind (stocks, bonds, ETFs…) we touch.
        </p>
        <p className="tiny pixel" style={{ color: "var(--c-dark)" }}>
          ▢ NOT INVESTMENT ADVICE
        </p>
        <button className="btn full" onClick={onClose}>
          GOT IT
        </button>
      </div>
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

function ProfileTab({ user, onSignOut }) {
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
          {(user.name || "PLAYER 1").toUpperCase()}
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
      <button className="btn full danger" onClick={onSignOut}>
        ⎋ LOG OUT
      </button>

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
