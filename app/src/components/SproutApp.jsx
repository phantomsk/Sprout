"use client";

import { useState, useEffect } from "react";
import { PixelSprite, SPROUT_PIXELS } from "./PixelSprite";
import { Onboarding } from "./Onboarding";
import { MainApp } from "./MainApp";

export function SproutApp() {
  const [route, setRoute] = useState("intro");
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState({
    name: "",
    income: 3200,
    debt: 0,
    savings: 600,
    risk: "Moderate",
    splits: { needs: 50, wants: 30, save: 20 },
    plantName: "Sproutie",
    plants: [],
    mood: null,
  });

  useEffect(() => {
    if (route === "app" && user.plants.length === 0) {
      setUser((u) => ({
        ...u,
        plants: [
          { id: 1, type: "sprout", value: 1, weeks: 0, label: u.plantName },
        ],
      }));
    }
  }, [route, user.plants.length]);

  let body;
  if (route === "intro")
    body = <Intro onNext={() => setRoute("auth")} />;
  else if (route === "auth")
    body = (
      <Auth
        onLogin={() => setRoute("app")}
        onSignup={() => setRoute("onboarding")}
      />
    );
  else if (route === "onboarding")
    body = (
      <Onboarding
        user={user}
        setUser={setUser}
        onDone={() => setRoute("app")}
      />
    );
  else if (route === "app")
    body = (
      <MainApp tab={tab} setTab={setTab} user={user} setUser={setUser} />
    );

  return body;
}

function Intro({ onNext }) {
  const [slide, setSlide] = useState(0);
  const pillars = [
    {
      sprite: SPROUT_PIXELS.seed,
      title: "BUDGET",
      body: "Split your paycheck into needs, wants, and savings. We do the math.",
    },
    {
      sprite: SPROUT_PIXELS.sprout,
      title: "INVEST",
      body: "Plant a sprout for every investment. Watch a tiny portfolio bloom.",
    },
    {
      sprite: SPROUT_PIXELS.tree,
      title: "GROW",
      body: "A calm, guided home base for the long, weird road to wealth.",
    },
  ];

  return (
    <div className="screen screen-enter" style={{ background: "var(--c-bg)" }}>
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        <div className="cloud" style={{ top: 30, left: 30 }} />
        <div
          className="cloud"
          style={{ top: 70, left: 180, animationDelay: "-7s" }}
        />
        <div
          className="cloud"
          style={{ top: 110, left: 60, animationDelay: "-3s" }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <PixelSprite pixels={pillars[slide].sprite} scale={9} />
        </div>

        <div className="grass-strip" style={{ bottom: 0 }} />
      </div>

      <div className="pad stack">
        <div className="center">
          <h1 className="pixel" style={{ color: "var(--c-darkest)" }}>
            SPROUT
          </h1>
          <p
            className="body"
            style={{ marginTop: 6, color: "var(--c-dark)" }}
          >
            Money stuff is stressful.
            <br />
            Take it one step at a time.
          </p>
        </div>

        <div className="card stack-sm">
          <h3 className="pixel" style={{ color: "var(--c-dark)" }}>
            ★ {pillars[slide].title}
          </h3>
          <p className="body">{pillars[slide].body}</p>

          <div
            className="row"
            style={{ justifyContent: "center", gap: 6, marginTop: 6 }}
          >
            {pillars.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={"slide " + (i + 1)}
                style={{
                  width: 12,
                  height: 12,
                  background:
                    i === slide ? "var(--c-dark)" : "var(--c-cream-shadow)",
                  border: "2px solid var(--c-darkest)",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        <button className="btn full" onClick={onNext}>
          GET STARTED
        </button>
        <button className="btn full secondary" onClick={onNext}>
          I HAVE AN ACCOUNT
        </button>

        <p
          className="tiny pixel center"
          style={{ color: "var(--c-dark)", marginTop: 8 }}
        >
          v0.1 · made with ♥ + photosynthesis
        </p>
      </div>
    </div>
  );
}

function Auth({ onLogin, onSignup }) {
  const [mode, setMode] = useState("signup");
  return (
    <div className="screen screen-enter pad stack">
      <div className="center" style={{ marginTop: 8 }}>
        <PixelSprite pixels={SPROUT_PIXELS.sprout} scale={7} />
        <h1 className="pixel" style={{ marginTop: 8 }}>
          {mode === "signup" ? "PLANT YOUR SEED" : "WELCOME BACK"}
        </h1>
      </div>

      <div
        className="row"
        style={{ gap: 0, border: "4px solid var(--c-darkest)" }}
      >
        <button
          className="pixel"
          onClick={() => setMode("signup")}
          style={{
            flex: 1,
            padding: 10,
            border: "none",
            cursor: "pointer",
            fontSize: 9,
            letterSpacing: 1,
            background:
              mode === "signup" ? "var(--c-dark)" : "var(--c-cream)",
            color: mode === "signup" ? "var(--c-bg)" : "var(--c-darkest)",
          }}
        >
          SIGN UP
        </button>
        <button
          className="pixel"
          onClick={() => setMode("login")}
          style={{
            flex: 1,
            padding: 10,
            border: "none",
            cursor: "pointer",
            fontSize: 9,
            letterSpacing: 1,
            background:
              mode === "login" ? "var(--c-dark)" : "var(--c-cream)",
            color: mode === "login" ? "var(--c-bg)" : "var(--c-darkest)",
          }}
        >
          LOG IN
        </button>
      </div>

      <div className="stack">
        <div>
          <label className="input-label">EMAIL</label>
          <input className="input" defaultValue="player1@sprout.fun" />
        </div>
        <div>
          <label className="input-label">PASSWORD</label>
          <input
            className="input"
            type="password"
            defaultValue="••••••••"
          />
        </div>

        <button
          className="btn full"
          onClick={mode === "signup" ? onSignup : onLogin}
        >
          {mode === "signup" ? "START GROWING ▸" : "ENTER GARDEN ▸"}
        </button>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <div
          style={{
            flex: 1,
            height: 4,
            background: "var(--c-cream-shadow)",
          }}
        />
        <span className="tiny pixel" style={{ color: "var(--c-dark)" }}>
          OR
        </span>
        <div
          style={{
            flex: 1,
            height: 4,
            background: "var(--c-cream-shadow)",
          }}
        />
      </div>

      <button
        className="btn full secondary"
        onClick={mode === "signup" ? onSignup : onLogin}
      >
        ▣ CONTINUE WITH GOOGLE
      </button>
      <button
        className="btn full secondary"
        onClick={mode === "signup" ? onSignup : onLogin}
      >
         CONTINUE WITH APPLE
      </button>

      <p className="tiny pixel center" style={{ color: "var(--c-dark)" }}>
        by continuing you agree to the
        <br />
        TERMS &amp; PRIVACY POLICY
      </p>
    </div>
  );
}
