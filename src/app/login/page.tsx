"use client";

import { useEffect, useMemo, useState } from "react";\nimport type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OneCrewLogo from "../../components/OneCrewLogo";

type Account = { name: string; email: string; passwordHash: string };

async function hashPassword(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("founder@onecrew.app");
  const [password, setPassword] = useState("onecrew");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("onecrew_session")) router.replace("/dashboard");
  }, [router]);

  const copy = useMemo(() => mode === "signup"
    ? { title: "Build your first AI crew.", sub: "Create a workspace and start delegating in minutes.", cta: "Create workspace" }
    : { title: "Welcome back.", sub: "Your crew is ready to keep the company moving.", cta: "Enter OneCrew" }, [mode]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "signup" && name.trim().length < 2) return setError("Tell us your name.");

    setBusy(true);
    try {
      const hash = await hashPassword(password);
      const accounts: Record<string, Account> = JSON.parse(localStorage.getItem("onecrew_accounts") || "{}");
      const existing = accounts[cleanEmail];

      if (mode === "login") {
        if (existing && existing.passwordHash !== hash) {
          setError("That password does not match this local workspace.");
          return;
        }
        const account = existing || { name: cleanEmail.split("@")[0], email: cleanEmail, passwordHash: hash };
        if (!existing) {
          accounts[cleanEmail] = account;
          localStorage.setItem("onecrew_accounts", JSON.stringify(accounts));
        }
        localStorage.setItem("onecrew_session", JSON.stringify({ name: account.name, email: cleanEmail, signedInAt: Date.now() }));
      } else {
        if (existing) {
          setError("This email already has a workspace. Switch to Sign in.");
          return;
        }
        accounts[cleanEmail] = { name: name.trim(), email: cleanEmail, passwordHash: hash };
        localStorage.setItem("onecrew_accounts", JSON.stringify(accounts));
        localStorage.setItem("onecrew_session", JSON.stringify({ name: name.trim(), email: cleanEmail, signedInAt: Date.now() }));
      }
      router.push("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-nav">
        <OneCrewLogo />
        <Link href="/" className="auth-back">← Back to site</Link>
      </div>

      <section className="auth-shell">
        <div className="auth-art">
          <div className="auth-orb auth-orb-a" />
          <div className="auth-orb auth-orb-b" />
          <div className="auth-kicker">ONE FOUNDER. A WHOLE CREW.</div>
          <h1>Work feels lighter<br />when your team is <span>always on.</span></h1>
          <p>Research, growth, operations, support and product — coordinated from one calm workspace.</p>
          <div className="auth-crew">
            {["atlas","scout","milo","nova","leo","iris"].map((agent, i) => (
              <div className="clean-avatar auth-avatar" key={agent} style={{ zIndex: 10 - i }}>
                <img src={"/crew/" + agent + ".jpg"} alt="" />
              </div>
            ))}
          </div>
          <div className="auth-proof">
            <div><b>10</b><span>specialists</span></div>
            <div><b>24/7</b><span>crew availability</span></div>
            <div><b>1</b><span>shared company brain</span></div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
              <button className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); }}>Create account</button>
            </div>
            <div className="auth-heading">
              <h2>{copy.title}</h2>
              <p>{copy.sub}</p>
            </div>
            <form onSubmit={submit}>
              {mode === "signup" && (
                <label>
                  <span>Your name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Waseem" autoComplete="name" />
                </label>
              )}
              <label>
                <span>Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" type="email" autoComplete="email" />
              </label>
              <label>
                <span>Password</span>
                <div className="password-field">
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Hide" : "Show"}</button>
                </div>
              </label>
              {error && <div className="auth-error">{error}</div>}
              <button className="auth-submit" disabled={busy}>{busy ? "Opening workspace…" : copy.cta + " →"}</button>
            </form>
            <div className="auth-note">
              <span className="mini-dot" />
              Demo authentication is stored only in this browser.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
