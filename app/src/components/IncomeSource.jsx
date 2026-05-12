"use client";

export const CADENCE_RATES = {
  WK: 52 / 12,
  "BI-WK": 26 / 12,
  MO: 1,
  SEM: 1 / 4.5,
  YR: 1 / 12,
};

export function toMonthly(amount, cadence) {
  return Math.round(amount * (CADENCE_RATES[cadence] ?? 1));
}

let _nextId = 1;
export function newSource() {
  return { id: _nextId++, active: true, label: "", amount: 0, cadence: "MO" };
}

export function SourceRow({ source, onChange, onRemove, canRemove }) {
  const monthly = toMonthly(source.amount, source.cadence);
  return (
    <div
      style={{
        border: "1.5px solid rgba(45, 80, 22, 0.18)",
        borderRadius: 10,
        padding: "10px 12px",
        background: source.active ? "#fff" : "rgba(45,80,22,0.04)",
        opacity: source.active ? 1 : 0.5,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div className="row between" style={{ gap: 8, alignItems: "center" }}>
        <button
          onClick={() => onChange({ ...source, active: !source.active })}
          style={{
            width: 22,
            height: 22,
            flexShrink: 0,
            border: "2px solid var(--c-mid)",
            borderRadius: 4,
            background: source.active ? "var(--c-mid)" : "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--c-bg)",
            fontSize: 13,
            fontWeight: 700,
            padding: 0,
          }}
        >
          {source.active ? "✓" : ""}
        </button>
        <input
          className="input"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            padding: "4px 6px",
            fontSize: 13,
          }}
          placeholder="Campus job, tutoring, aid…"
          value={source.label}
          onChange={(e) => onChange({ ...source, label: e.target.value })}
        />
        {canRemove && (
          <button
            onClick={onRemove}
            style={{
              width: 22,
              height: 22,
              flexShrink: 0,
              border: "none",
              borderRadius: 4,
              background: "rgba(180,60,60,0.12)",
              color: "#b43c3c",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              padding: 0,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>
      <div className="row" style={{ gap: 6, alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            border: "1.5px solid rgba(45,80,22,0.18)",
            borderRadius: 8,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              background: "var(--c-mid)",
              color: "var(--c-bg)",
              padding: "6px 10px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            $
          </span>
          <input
            className="input"
            style={{
              border: "none",
              borderRadius: 0,
              width: 72,
              background: "transparent",
              padding: "6px 8px",
              fontSize: 13,
            }}
            inputMode="numeric"
            value={source.amount || ""}
            placeholder="0"
            onChange={(e) =>
              onChange({
                ...source,
                amount: Number(e.target.value.replace(/[^0-9]/g, "")) || 0,
              })
            }
          />
        </div>
        <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
          {Object.keys(CADENCE_RATES).map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...source, cadence: c })}
              style={{
                padding: "4px 8px",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "inherit",
                border: "1.5px solid var(--c-mid)",
                borderRadius: 6,
                cursor: "pointer",
                background: source.cadence === c ? "var(--c-mid)" : "transparent",
                color: source.cadence === c ? "var(--c-bg)" : "var(--c-mid)",
                transition: "all 0.1s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        {source.amount > 0 && source.cadence !== "MO" && (
          <span
            style={{
              fontSize: 11,
              color: "var(--c-dark)",
              whiteSpace: "nowrap",
              marginLeft: "auto",
            }}
          >
            ≈ ${monthly}/mo
          </span>
        )}
      </div>
    </div>
  );
}
