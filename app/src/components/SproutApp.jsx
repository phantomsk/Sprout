"use client";

import { useState, useEffect } from "react";
import { PixelSprite, SPROUT_PIXELS } from "./PixelSprite";
import { Onboarding } from "./Onboarding";
import { MainApp } from "./MainApp";

export function SproutApp() {
  const [route, setRoute] = useState("auth");
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
    let cancelled = false;
    (async () => {
      try {
        const { getSupabaseBrowser } = await import("@/lib/supabase/client");
        const supabase = getSupabaseBrowser();
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session) {
          const meta = data.session.user?.user_metadata;
          if (meta?.full_name) {
            setUser((u) => ({ ...u, name: meta.full_name }));
          }
          setRoute("app");
        }
      } catch {
        // No Supabase configured yet — stay on auth.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (route === "app" && user.plants.length === 0) {
      setUser((u) => ({
        ...u,
        plants: [
          {
            id: 1,
            type: "sprout",
            value: 1,
            weeks: 0,
            label: u.plantName,
            flowerType: "rose",
          },
        ],
      }));
    }
  }, [route, user.plants.length]);

  const onSignOut = async () => {
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setRoute("auth");
  };

  const handleLogin = async () => {
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowser();
      const { data } = await supabase.auth.getSession();
      const meta = data?.session?.user?.user_metadata;
      if (meta?.full_name) {
        setUser((u) => ({ ...u, name: meta.full_name }));
      }
    } catch {}
    setRoute("app");
  };

  let body;
  if (route === "auth")
    body = (
      <Auth
        onLogin={handleLogin}
        onSignup={(name) => {
          if (name) setUser((u) => ({ ...u, name }));
          setRoute("onboarding");
        }}
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
      <MainApp
        tab={tab}
        setTab={setTab}
        user={user}
        setUser={setUser}
        onSignOut={onSignOut}
      />
    );

  return body;
}

function Auth({ onLogin, onSignup }) {
  const [mode, setMode] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const submit = async (e) => {
    e?.preventDefault?.();
    setError(null);
    setInfo(null);
    if (mode === "signup" && !fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowser();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;
        if (!data.session) {
          setInfo("Check your email to confirm, then come back to log in.");
          setMode("login");
          return;
        }
        onSignup(fullName.trim());
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        onLogin();
      }
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const oauthTodo = () =>
    setError(
      "Google / Apple sign-in isn't wired up yet — use email + password for now."
    );

  return (
    <div className="screen screen-enter pad stack narrow">
      <div
        className="center"
        style={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/animated-logo.gif"
          alt="Sprout"
          style={{
            width: 420,
            height: 200,
            objectFit: "contain",
          }}
        />
        <h1 className="pixel" style={{ marginTop: 8 }}>
          {mode === "signup" ? "PLANT YOUR SEED" : "WELCOME BACK"}
        </h1>
      </div>

      <div
        className="row"
        style={{
          gap: 4,
          padding: 4,
          background: "rgba(45, 80, 22, 0.08)",
          border: "1px solid rgba(45, 80, 22, 0.12)",
          borderRadius: 12,
        }}
      >
        <button
          onClick={() => {
            setMode("signup");
            setError(null);
            setInfo(null);
          }}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.3,
            borderRadius: 8,
            background: mode === "signup" ? "var(--c-dark)" : "transparent",
            color: mode === "signup" ? "var(--c-bg)" : "var(--c-dark)",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          SIGN UP
        </button>
        <button
          onClick={() => {
            setMode("login");
            setError(null);
            setInfo(null);
          }}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.3,
            borderRadius: 8,
            background: mode === "login" ? "var(--c-dark)" : "transparent",
            color: mode === "login" ? "var(--c-bg)" : "var(--c-dark)",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          LOG IN
        </button>
      </div>

      <form onSubmit={submit} className="stack" noValidate>
        {mode === "signup" && (
          <div>
            <label className="input-label">YOUR NAME</label>
            <input
              className="input"
              type="text"
              autoComplete="name"
              placeholder="What should we call you?"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="input-label">EMAIL</label>
          <input
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">PASSWORD</label>
          <input
            className="input"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div
            className="card"
            style={{
              background: "var(--c-danger)",
              borderColor: "transparent",
              padding: 10,
            }}
          >
            <p className="body" style={{ color: "var(--c-cream)" }}>
              ♦ {error}
            </p>
          </div>
        )}
        {info && (
          <div
            className="card"
            style={{ background: "var(--c-mid-light)", padding: 10 }}
          >
            <p className="body">★ {info}</p>
          </div>
        )}

        <button className="btn full" type="submit" disabled={busy}>
          {busy
            ? "WORKING…"
            : mode === "signup"
              ? "START GROWING ▸"
              : "ENTER GARDEN ▸"}
        </button>
      </form>

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
        onClick={oauthTodo}
        type="button"
      >
        ▣ CONTINUE WITH GOOGLE
      </button>
      <button
        className="btn full secondary"
        onClick={oauthTodo}
        type="button"
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
