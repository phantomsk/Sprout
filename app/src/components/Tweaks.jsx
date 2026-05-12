"use client";

import { TweaksContext } from "./PixelSprite";

const MEADOW_VARS = {
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
};

const TWEAKS = {
  aesthetic: "soft",
  palette: "meadow",
  variety: true,
  radius: 11,
};

export function TweaksRoot({ children }) {
  return (
    <TweaksContext.Provider value={TWEAKS}>
      <div
        className="phone soft"
        style={{ ...MEADOW_VARS, "--radius": TWEAKS.radius + "px" }}
      >
        {children}
      </div>
    </TweaksContext.Provider>
  );
}
