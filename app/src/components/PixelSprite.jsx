"use client";

import { createContext } from "react";

export const SPROUT_PIXELS = {
  seed: [
    "...........",
    "...........",
    "...........",
    "...........",
    "...........",
    "...........",
    "...........",
    "...........",
    "....DDD....",
    "...DGGGD...",
    "..DGMMMGD..",
    "..DGGGGGD..",
    "...DDDDD...",
  ],
  sprout: [
    "...........",
    "...........",
    "...........",
    "....DDD....",
    "...DGMD....",
    "....DGMD...",
    ".DDD.DMD...",
    "DGMDDDMD...",
    "DMMMMMMD...",
    ".DDDDMDD...",
    "....DMD....",
    "....DGD....",
    "....DDD....",
  ],
  bud: [
    "...........",
    "....DDD....",
    "...DGMGD...",
    "..DGMLMGD..",
    "..DMLLLMD..",
    "..DGMLMGD..",
    "...DGMGD...",
    "....DSD....",
    "..D.DSD.D..",
    ".DGDDSDDGD.",
    "..DGMSMGD..",
    "...DGSGD...",
    "....DDD....",
  ],
  bloom: [
    "...DDD.....",
    "..DMLMD....",
    ".DMLLLMD...",
    "DMLLBLLMD..",
    "DMLLLLLMD.D",
    "DMLLBLLMDDD",
    ".DMLLLMDLD.",
    "..DMLMDGD..",
    "...DSGSD...",
    ".D.DSGSD.D.",
    "DGD.DSD.DGD",
    "DGMD.S.DMGD",
    ".DDDDSDDDD.",
  ],
  tree: [
    "....DDD....",
    "...DLLLD...",
    "..DLLMLLD..",
    ".DLMMLMMLD.",
    "DLMLLLLLMLD",
    "DMLLBLLBLMD",
    "DMLLLLLLLMD",
    ".DMMLLLMMD.",
    "..DMMMMMD..",
    "...DDSDD...",
    "....DSD....",
    "....DSD....",
    "....DDD....",
  ],
};

export const PIXEL_COLORS = {
  D: "var(--c-darkest)",
  G: "var(--c-dark)",
  M: "var(--c-mid)",
  L: "var(--c-mid-light)",
  B: "var(--c-bg)",
  S: "var(--c-dark)",
  Y: "var(--c-accent)",
  R: "var(--c-danger)",
  C: "var(--c-cream)",
};

// Petal tints override M (outer petals) and L (inner petals).
export const TINT_PALETTES = {
  green: null,
  pink: { M: "var(--c-pink-dark)", L: "var(--c-pink)" },
  yellow: { M: "var(--c-accent)", L: "var(--c-yellow)" },
  purple: { M: "var(--c-purple-dark)", L: "var(--c-purple)" },
  white: { M: "var(--c-cream-shadow)", L: "#ffffff" },
  coral: { M: "#d96b5b", L: "#f5a896" },
};

export const TINT_POOL = ["pink", "yellow", "purple", "white", "coral"];
export const randomTint = () =>
  TINT_POOL[Math.floor(Math.random() * TINT_POOL.length)];

export function PixelSprite({
  pixels,
  scale = 6,
  color = PIXEL_COLORS,
  tint = null,
  style = {},
  bob = true,
}) {
  const finalColors =
    tint && TINT_PALETTES[tint] ? { ...color, ...TINT_PALETTES[tint] } : color;
  const rows = pixels.length;
  const cols = pixels[0].length;
  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ch = pixels[y][x];
      if (ch === "." || !ch) continue;
      cells.push(
        <div
          key={y + "-" + x}
          style={{
            position: "absolute",
            left: x * scale + "px",
            top: y * scale + "px",
            width: scale + "px",
            height: scale + "px",
            background: finalColors[ch] || ch,
          }}
        />
      );
    }
  }
  return (
    <div
      className={bob ? "sprout" : ""}
      style={{
        position: "relative",
        width: cols * scale + "px",
        height: rows * scale + "px",
        ...style,
      }}
    >
      {cells}
    </div>
  );
}

export const ICONS = {
  home: [
    "............",
    ".....DD.....",
    "....DMMD....",
    "...DMLLMD...",
    "..DMLBBLMD..",
    ".DMLBBBBLMD.",
    "DDDDDDDDDDDD",
    "D..DMMMMD..D",
    "D..DMLLMD..D",
    "D..DMLLMD..D",
    "DDDDDDDDDDDD",
    "............",
  ],
  budget: [
    "............",
    ".DDDDDDDDDD.",
    ".DCCCCCCCCD.",
    ".DCDDDDDDCD.",
    ".DCDMMMMDCD.",
    ".DCDDDDDDCD.",
    ".DCDLLLLDCD.",
    ".DCDDDDDDCD.",
    ".DCDMMDDDCD.",
    ".DCCCCCCCCD.",
    ".DDDDDDDDDD.",
    "............",
  ],
  invest: [
    "............",
    "..........DD",
    "........DDLD",
    ".......DLLD.",
    "D.....DLLD..",
    "DD...DLLD...",
    "DLD.DLLD....",
    "DLLDLLD.....",
    "DLLLLD......",
    "DLLLD.......",
    "DDDD........",
    "D...........",
  ],
  garden: [
    "....DD......",
    "...DMLD.....",
    "..DMLLD.....",
    ".DMLLDDDD...",
    "DMLLDLLMMD..",
    "DLLDLBLLMD..",
    "DDDDLBLLMD..",
    "..DDDLMMMD..",
    "....DDDDDD..",
    "....DSSSD...",
    "....DSSSD...",
    "....DDDDD...",
  ],
  profile: [
    "............",
    "....DDDD....",
    "...DMLLMD...",
    "..DMLBBLMD..",
    "..DMLBBLMD..",
    "...DMLLMD...",
    "....DDDD....",
    "..DDDDDDDD..",
    ".DMLLLLLLMD.",
    "DMLLLLLLLLMD",
    "DDDDDDDDDDDD",
    "............",
  ],
  community: [
    "............",
    "..DDD..DDD..",
    ".DMLD..DMLD.",
    ".DBLD..DBLD.",
    "..DD....DD..",
    "DDDDD..DDDDD",
    "DMLLD..DMLLD",
    "DLLLD..DLLLD",
    "DDDDD..DDDDD",
    "............",
    "............",
    "............",
  ],
};

export const TweaksContext = createContext({
  aesthetic: "soft",
  palette: "meadow",
  variety: true,
  radius: 11,
});
