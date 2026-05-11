"use client";

import { useEffect, useState } from "react";
import { TweaksContext } from "./PixelSprite";

const PALETTES = {
  meadow: {
    name: "Meadow",
    vars: {
      "--c-bg": "#f0f7e8",
      "--c-mid-light": "#b8d99b",
      "--c-mid": "#7aaf5e",
      "--c-dark": "#4a7a3a",
      "--c-darkest": "#1f3a1a",
      "--c-cream": "#ffffff",
      "--c-cream-shadow": "#ebe8d8",
      "--c-accent": "#e89b71",
      "--c-pink": "#f4a8b8",
      "--c-pink-dark": "#d97a8e",
      "--c-purple": "#c89dd9",
      "--c-purple-dark": "#9d7ec4",
      "--c-yellow": "#f5d76e",
    },
  },
  gameboy: {
    name: "Game Boy",
    vars: {
      "--c-bg": "#c4e89e",
      "--c-mid-light": "#9ed46b",
      "--c-mid": "#6ba344",
      "--c-dark": "#2d5016",
      "--c-darkest": "#0f2410",
      "--c-cream": "#f4ecd0",
      "--c-cream-shadow": "#d9c98f",
      "--c-accent": "#f2b134",
      "--c-pink": "#e89bb8",
      "--c-pink-dark": "#c46a8a",
      "--c-purple": "#a285c4",
      "--c-purple-dark": "#7a5a9c",
      "--c-yellow": "#fde890",
    },
  },
  sunrise: {
    name: "Sunrise",
    vars: {
      "--c-bg": "#fff4e8",
      "--c-mid-light": "#a8d8b9",
      "--c-mid": "#6fb392",
      "--c-dark": "#3d7a5c",
      "--c-darkest": "#1e3a2e",
      "--c-cream": "#ffffff",
      "--c-cream-shadow": "#f2dcc8",
      "--c-accent": "#ee9b6b",
      "--c-pink": "#f4a890",
      "--c-pink-dark": "#d97560",
      "--c-purple": "#c89dd9",
      "--c-purple-dark": "#9d7ec4",
      "--c-yellow": "#f5c66e",
    },
  },
  lavender: {
    name: "Lavender",
    vars: {
      "--c-bg": "#f5f0fa",
      "--c-mid-light": "#a8c89e",
      "--c-mid": "#739a6e",
      "--c-dark": "#4a6747",
      "--c-darkest": "#2a2940",
      "--c-cream": "#ffffff",
      "--c-cream-shadow": "#e5e0ea",
      "--c-accent": "#c89dd9",
      "--c-pink": "#e8a8c4",
      "--c-pink-dark": "#b878a0",
      "--c-purple": "#b89dd9",
      "--c-purple-dark": "#7d5ca8",
      "--c-yellow": "#f5d76e",
    },
  },
};

const PALETTE_SWATCHES = {
  meadow: ["#4a7a3a", "#b8d99b", "#f4a8b8", "#fff4e8"],
  gameboy: ["#0f2410", "#2d5016", "#6ba344", "#c4e89e"],
  sunrise: ["#3d7a5c", "#a8d8b9", "#f4a890", "#fff4e8"],
  lavender: ["#2a2940", "#a8c89e", "#c89dd9", "#f5f0fa"],
};

const DEFAULTS = {
  aesthetic: "soft",
  palette: "meadow",
  variety: true,
  radius: 11,
};

export function TweaksRoot({ children }) {
  const [t, setT] = useState(DEFAULTS);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const phone = document.querySelector(".phone");
    if (!phone) return;
    const palette = PALETTES[t.palette] || PALETTES.meadow;
    Object.entries(palette.vars).forEach(([k, v]) =>
      phone.style.setProperty(k, v)
    );
    phone.style.setProperty("--radius", (t.radius || 0) + "px");
    phone.classList.toggle("soft", t.aesthetic === "soft");
  }, [t]);

  const set = (k, v) => setT((p) => ({ ...p, [k]: v }));

  return (
    <TweaksContext.Provider value={t}>
      <div className="phone">{children}</div>

      {!open && (
        <button className="twk-launcher" onClick={() => setOpen(true)}>
          ✦ TWEAKS
        </button>
      )}

      {open && (
        <div className="twk-panel">
          <div className="twk-hd">
            <b>Tweaks</b>
            <button
              className="twk-x"
              aria-label="Close tweaks"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="twk-body">
            <div className="twk-sect">Vibe</div>
            <div className="twk-row">
              <div className="twk-lbl">
                <span>Style</span>
                <span className="twk-val">{t.aesthetic}</span>
              </div>
              <div className="twk-seg" role="radiogroup">
                {["pixel", "soft"].map((opt) => (
                  <button
                    key={opt}
                    role="radio"
                    aria-checked={t.aesthetic === opt}
                    data-on={t.aesthetic === opt ? "1" : "0"}
                    onClick={() => set("aesthetic", opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="twk-row">
              <div className="twk-lbl">
                <span>Corner radius</span>
                <span className="twk-val">{t.radius}px</span>
              </div>
              <input
                type="range"
                className="twk-slider"
                min={0}
                max={24}
                step={1}
                value={t.radius}
                onChange={(e) => set("radius", Number(e.target.value))}
              />
            </div>

            <div className="twk-sect">Palette</div>
            <div className="twk-row">
              <div className="twk-lbl">
                <span>Palette</span>
                <span className="twk-val">{PALETTES[t.palette]?.name}</span>
              </div>
              <div className="twk-palettes">
                {Object.keys(PALETTES).map((k) => (
                  <button
                    key={k}
                    className="twk-palette"
                    data-on={k === t.palette ? "1" : "0"}
                    onClick={() => set("palette", k)}
                  >
                    <div className="row-sw">
                      {PALETTE_SWATCHES[k].map((c, i) => (
                        <i key={i} style={{ background: c }} />
                      ))}
                    </div>
                    <span>{PALETTES[k].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="twk-sect">Garden</div>
            <div className="twk-row h">
              <div className="twk-lbl">
                <span>Flower variety</span>
              </div>
              <button
                className="twk-toggle"
                data-on={t.variety ? "1" : "0"}
                role="switch"
                aria-checked={t.variety}
                onClick={() => set("variety", !t.variety)}
              >
                <i />
              </button>
            </div>
          </div>
        </div>
      )}
    </TweaksContext.Provider>
  );
}
