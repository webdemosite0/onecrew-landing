"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OneCrewLogo from "../../components/OneCrewLogo";

type Session = { name: string; email: string };
type Mission = { id: number; title: string; owner: string; progress: number; status: string };
type Approval = { id: number; title: string; agent: string; type: string };
type Activity = { id: number; agent: string; text: string; time: string };

const agents = [
  { name: "Atlas", role: "Chief of Staff", image: "atlas", status: "Online", accent: "#ffba45" },
  { name: "Scout", role: "Research", image: "scout", status: "Researching", accent: "#8a6cf6" },
  { name: "Milo", role: "Growth", image: "milo", status: "Working", accent: "#52cfad" },
  { name: "Nova", role: "Operations", image: "nova", status: "Online", accent: "#6ca7ff" },
  { name: "Leo", role: "Sales", image: "leo", status: "Working", accent: "#ff6f97" },
  { name: "Iris", role: "Support", image: "iris", status: "Online", accent: "#5bbbea" },
  { name: "Zara", role: "Finance", image: "zara", status: "Reviewing", accent: "#88ce67" },
  { name: "Kael", role: "Product", image: "kael", status: "Working", accent: "#ff9f4e" },
  { name: "Luna", role: "Design", image: "luna", status: "Creating", accent: "#d681ea" },
  { name: "Echo", role: "Content", image: "echo", status: "Online", accent: "#e8c16c" },
];

const initialMissions: Mission[] = [
  { id: 1, title: "Launch Q4 growth campaign", owner: "Milo", progress: 72, status: "On track" },
  { id: 2, title: "Research next market segment", owner: "Scout", progress: 48, status: "In progress" },
  { id: 3, title: "Refresh onboarding experience", owner: "Luna", progress: 35, status: "In review" },
];

const initialApprovals: Approval[] = [
  { id: 1, title: "Send 12 personalized outreach emails", agent: "Leo", type: "External action" },
  { id: 2, title: "Publish launch announcement", agent: "Echo", type: "Public content" },
  { id: 3, title: "Move product review to Thursday", agent: "Nova", type: "Calendar change" },
];

const initialActivity: Activity[] = [
  { id: 1, agent: "Scout", text: "found 8 competitor positioning gaps", time: "2m" },
  { id: 2, agent: "Milo", text: "built a new acquisition experiment", time: "12m" },
  { id: 3, agent: "Luna", text: "delivered 3 launch visual directions", time: "28m" },
  { id: 4, agent: "Nova", text: "reorganized the launch timeline", time: "43m" },
];

function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<string, ReactNode> = {
    pulse: <><path d="M3 12h4l2.3-6 4.2 12 2.4-6H21" /></>,
    command: <><path d="M12 3v18M3 12h18" /><circle cx="12" cy="12" r="8" /></>,
    orbit: <><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-28 12 12)" /></>,
    crew: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3.5 20c.7-4 2.8-6 5.5-6s4.8 2 5.5 6M14 15c2.9-.7 5.4 1 6 4" /></>,
    forge: <><path d="M4 20 20 4M8 4h12v12" /></>,
    signals: <><path d="M4 18V9M9 18V5M14 18v-7M19 18V3" /></>,
    vault: <><rect x="3" y="5" width="18" height="15" rx="3" /><path d="M7 5V3h10v2M8 10h8M8 14h5" /></>,
    prism: <><path d="m12 3 8 16H4L12 3Z" /><path d="m8.5 12 3.5 7 3.5-7" /></>,
    dock: <><path d="M4 6h16v12H4z" /><path d="M8 10h8M8 14h5" /></>,
    atelier: <><path d="M5 19 19 5M14 5h5v5" /><path d="M4 14c3 0 6 3 6 6" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    moon: <><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    arrow: <><path d="m9 18 6-6-6-6" /></>,
    logout: <><path d="M9 5H5v14h4M13 8l4 4-4 4M17 12H9" /></>,
  };
  return <svg {...common}>{shapes[name] || shapes.pulse}</svg>;
}

function AgentAvatar({ image, size = 42 }: { image: string; size?: number }) {
  return (
    <span className="clean-avatar" style={{ width: size, height: size }}>
      <img src={"/crew/" + image + ".jpg"} alt="" />
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [active, setActive] = useState("pulse");
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [activity, setActivity] = useState<Activity[]>(initialActivity);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [query, setQuery] = useState("");
  const [command, setCommand] = useState("");
  const [showMission, setShowMission] = useState(false);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionOwner, setMissionOwner] = useState("Atlas");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("onecrew_session");
    if (!raw) {
      router.replace("/login");
      return;
    }
    setSession(JSON.parse(raw));
    const savedTheme = localStorage.getItem("onecrew_theme") === "dark" ? "dark" : "light";
    setTheme(savedTheme);
    const savedMissions = localStorage.getItem("onecrew_missions");
    if (savedMissions) setMissions(JSON.parse(savedMissions));
  }, [router]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const filteredActivity = useMemo(() => {
    if (!query.trim()) return activity;
    const q = query.toLowerCase();
    return activity.filter((a) => (a.agent + " " + a.text).toLowerCase().includes(q));
  }, [activity, query]);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("onecrew_theme", next);
  }

  function createMission(e: FormEvent) {
    e.preventDefault();
    if (!missionTitle.trim()) return;
    const next = [{ id: Date.now(), title: missionTitle.trim(), owner: missionOwner, progress: 4, status: "Planning" }, ...missions];
    setMissions(next);
    localStorage.setItem("onecrew_missions", JSON.stringify(next));
    setActivity((a) => [{ id: Date.now(), agent: "Atlas", text: "created mission “" + missionTitle.trim() + "”", time: "now" }, ...a]);
    setMissionTitle("");
    setShowMission(false);
    setToast("Mission created and delegated to " + missionOwner + ".");
  }

  function resolveApproval(id: number, approved: boolean) {
    const item = approvals.find((a) => a.id === id);
    setApprovals((a) => a.filter((x) => x.id !== id));
    if (item) {
      setActivity((a) => [{ id: Date.now(), agent: item.agent, text: approved ? "received approval for “" + item.title + "”" : "received requested changes for “" + item.title + "”", time: "now" }, ...a]);
      setToast(approved ? "Approved. The agent can continue." : "Sent back for changes.");
    }
  }

  function sendCommand(e: FormEvent) {
    e.preventDefault();
    const value = command.trim();
    if (!value) return;
    setActivity((a) => [{ id: Date.now(), agent: "Atlas", text: "is coordinating: “" + value + "”", time: "now" }, ...a]);
    setCommand("");
    setToast("Atlas is coordinating the crew.");
  }

  function signOut() {
    localStorage.removeItem("onecrew_session");
    router.push("/login");
  }

  if (!session) return <div className="dashboard-loading"><div className="loader-mark"><span /><span /><span /></div><p>Opening OneCrew…</p></div>;

  const nav = [
    ["pulse", "Pulse", "pulse"],
    ["missions", "Mission Control", "command"],
    ["orbit", "Orbit", "orbit"],
    ["crew", "Crewline", "crew"],
    ["forge", "Forge", "forge"],
    ["signals", "Signals", "signals"],
    ["vault", "Vault", "vault"],
    ["prism", "Prism", "prism"],
    ["dock", "Dock", "dock"],
    ["atelier", "Atelier", "atelier"],
  ];

  return (
    <main className={"dashboard-app " + theme}>
      <aside className="dash-sidebar">
        <OneCrewLogo href="/dashboard" />
        <nav className="dash-nav">
          {nav.map(([key, label, icon]) => (
            <button key={key} className={active === key ? "active" : ""} onClick={() => setActive(key)}>
              <Icon name={icon} /><span>{label}</span>{key === "signals" && <em>3</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-promo">
          <div className="promo-spark">✦</div>
          <b>Your crew never clocks out.</b>
          <span>10 specialists, one shared context.</span>
        </div>
        <button className="sidebar-user" onClick={signOut}>
          <span className="user-monogram">{session.name.slice(0, 1).toUpperCase()}</span>
          <span><b>{session.name}</b><small>{session.email}</small></span>
          <Icon name="logout" size={17} />
        </button>
      </aside>

      <section className="dash-main">
        <header className="dash-topbar">
          <div className="dash-search"><Icon name="search" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search agents, missions, activity…" /><kbd>⌘ K</kbd></div>
          <div className="top-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme"><Icon name={theme === "dark" ? "sun" : "moon"} /></button>
            <button className="notification-btn">●</button>
            <button className="mini-profile"><span>{session.name.slice(0, 1).toUpperCase()}</span><div><b>{session.name}</b><small>Founder</small></div></button>
          </div>
        </header>

        <div className="dash-content">
          <div className="dash-heading">
            <div>
              <div className="page-kicker">{active === "pulse" ? "PULSE" : nav.find((n) => n[0] === active)?.[1]?.toUpperCase()}</div>
              <h1>{active === "pulse" ? <>Good morning, <span>{session.name.split(" ")[0]}.</span></> : nav.find((n) => n[0] === active)?.[1]}</h1>
              <p>{active === "pulse" ? "Your AI crew is running the company while you focus on what matters." : "Everything here is connected to your crew, missions, and company memory."}</p>
            </div>
            <button className="new-mission" onClick={() => setShowMission(true)}><Icon name="plus" size={17} /> New mission</button>
          </div>

          {active === "pulse" && (
            <>
              <div className="metric-grid">
                <article className="metric violet"><div className="metric-icon"><Icon name="command" /></div><span>Live missions</span><b>{missions.length + 5}</b><small>↑ 2 this week</small></article>
                <article className="metric mint"><div className="metric-icon"><Icon name="crew" /></div><span>Agents online</span><b>10/10</b><small>All systems running</small></article>
                <article className="metric coral"><div className="metric-icon"><Icon name="check" /></div><span>Tasks completed</span><b>248</b><small>↑ 32% this month</small></article>
                <article className="metric blue"><div className="metric-icon"><Icon name="signals" /></div><span>Hours saved</span><b>96.4h</b><small>↑ 18h this week</small></article>
              </div>

              <div className="dash-grid primary-grid">
                <article className="featured-mission">
                  <div className="feature-label">✦ FEATURED MISSION</div>
                  <h2>{missions[0]?.title || "Launch growth campaign"}</h2>
                  <p>Your crew is researching, creating and coordinating the work across the business.</p>
                  <div className="mission-progress"><span style={{ width: (missions[0]?.progress || 72) + "%" }} /></div>
                  <div className="mission-meta"><span>✓ Strategy brief complete</span><span>✓ Research in motion</span><span>● {missions[0]?.owner || "Milo"} is leading</span></div>
                  <button onClick={() => setActive("missions")}>View mission <Icon name="arrow" size={15} /></button>
                  <div className="featured-crew">
                    {["milo","scout","echo","luna"].map((x) => <AgentAvatar key={x} image={x} size={46} />)}
                  </div>
                </article>

                <article className="performance-card">
                  <div className="card-head"><div><span>Weekly performance</span><h3>$12,480 <em>+24%</em></h3></div><button>Last 7 days⌄</button></div>
                  <div className="chart">
                    <svg viewBox="0 0 420 160" preserveAspectRatio="none">
                      <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7367ff" stopOpacity=".28"/><stop offset="1" stopColor="#7367ff" stopOpacity="0"/></linearGradient></defs>
                      <path className="gridline" d="M0 32H420M0 80H420M0 128H420" />
                      <path className="area" d="M0 130 C45 80 65 105 95 83 S150 38 190 70 S245 100 275 60 S335 45 365 31 S400 37 420 20 L420 160 L0 160Z" />
                      <path className="line" d="M0 130 C45 80 65 105 95 83 S150 38 190 70 S245 100 275 60 S335 45 365 31 S400 37 420 20" />
                      <path className="line mint-line" d="M0 149 C55 130 80 138 110 118 S170 95 205 108 S255 126 295 94 S355 90 420 66" />
                    </svg>
                  </div>
                  <div className="chart-legend"><span><i className="violet-dot" /> Revenue lift</span><span><i className="mint-dot" /> Tasks completed</span></div>
                </article>

                <article className="activity-card">
                  <div className="card-title"><h3>Live activity</h3><span>● Live</span></div>
                  <div className="activity-list">
                    {filteredActivity.slice(0,5).map((a) => {
                      const ag = agents.find((x) => x.name === a.agent) || agents[0];
                      return <div className="activity-row" key={a.id}><AgentAvatar image={ag.image} size={35}/><div><b>{a.agent}</b><span>{a.text}</span></div><small>{a.time}</small></div>;
                    })}
                  </div>
                </article>
              </div>

              <div className="dash-grid secondary-grid">
                <article className="crew-card">
                  <div className="card-title"><h3>Your AI crew</h3><button onClick={() => setActive("crew")}>Manage crew →</button></div>
                  <div className="crew-row">
                    {agents.slice(0,7).map((a) => <button key={a.name} onClick={() => { setSelectedAgent(a); setActive("crew"); }}><AgentAvatar image={a.image} size={58}/><b>{a.name}</b><small>{a.role}</small><em>● {a.status}</em></button>)}
                  </div>
                </article>
                <article className="approval-card">
                  <div className="card-title"><h3>Needs approval</h3><span className="count-badge">{approvals.length}</span></div>
                  {approvals.slice(0,3).map((a) => <div className="approval-row" key={a.id}><div><b>{a.title}</b><small>{a.agent} · {a.type}</small></div><div><button className="approve" onClick={() => resolveApproval(a.id,true)}>Approve</button><button onClick={() => resolveApproval(a.id,false)}>Changes</button></div></div>)}
                  {!approvals.length && <div className="empty-state">✓ You are all caught up.</div>}
                </article>
              </div>
            </>
          )}

          {active === "missions" && (
            <section className="section-panel">
              <div className="panel-toolbar"><h2>Mission Control</h2><button onClick={() => setShowMission(true)}><Icon name="plus" size={16}/> Create mission</button></div>
              <div className="mission-list-full">
                {missions.map((m) => <article key={m.id}><div className="mission-symbol">◎</div><div className="mission-copy"><h3>{m.title}</h3><span>Lead: {m.owner} · {m.status}</span><div className="full-progress"><i style={{width:m.progress+"%"}}/></div></div><b>{m.progress}%</b><button><Icon name="arrow" /></button></article>)}
              </div>
            </section>
          )}

          {active === "crew" && (
            <section className="section-panel crewline-panel">
              <div className="panel-toolbar"><h2>Crewline</h2><span>10 specialists · 10 online</span></div>
              <div className="crewline-layout">
                <div className="agent-grid">
                  {agents.map((a) => <button className={selectedAgent.name === a.name ? "selected" : ""} onClick={() => setSelectedAgent(a)} key={a.name}><AgentAvatar image={a.image} size={72}/><b>{a.name}</b><span>{a.role}</span><em>● {a.status}</em></button>)}
                </div>
                <div className="agent-detail">
                  <AgentAvatar image={selectedAgent.image} size={92}/>
                  <div><span className="agent-state">● {selectedAgent.status}</span><h2>{selectedAgent.name}</h2><p>{selectedAgent.role}</p></div>
                  <hr/>
                  <h4>Current objective</h4><p>Move the company forward with clear, high-quality work and escalate only decisions that need the founder.</p>
                  <div className="agent-stats"><div><b>42</b><span>Tasks</span></div><div><b>96%</b><span>Success</span></div><div><b>7.8h</b><span>Saved</span></div></div>
                  <button className="agent-chat" onClick={() => setToast("Opening a direct thread with " + selectedAgent.name + ".")}>Chat with {selectedAgent.name} →</button>
                </div>
              </div>
            </section>
          )}

          {active === "signals" && (
            <section className="section-panel">
              <div className="panel-toolbar"><h2>Signals</h2><span>Business intelligence from your crew</span></div>
              <div className="signal-grid">
                <article><span>Revenue influenced</span><b>$18.4K</b><em>+24% this month</em></article>
                <article><span>Qualified leads</span><b>126</b><em>+18% this month</em></article>
                <article><span>Conversion</span><b>4.8%</b><em>+0.7 pts</em></article>
                <article><span>Founder time saved</span><b>96h</b><em>+21h vs last month</em></article>
              </div>
              <div className="big-chart"><svg viewBox="0 0 900 260" preserveAspectRatio="none"><path className="gridline" d="M0 52H900M0 130H900M0 208H900"/><path className="line" d="M0 210 C100 140 160 180 225 122 S355 78 420 118 S540 170 610 92 S735 85 900 42"/><path className="line mint-line" d="M0 228 C100 205 155 212 240 168 S350 170 440 138 S590 120 690 130 S790 95 900 82"/></svg></div>
            </section>
          )}

          {["orbit","forge","vault","prism","dock","atelier"].includes(active) && (
            <section className="section-panel utility-panel">
              <div className={"utility-icon " + active}><Icon name={nav.find((n)=>n[0]===active)?.[2] || "orbit"} size={28}/></div>
              <h2>{nav.find((n) => n[0] === active)?.[1]}</h2>
              <p>{active === "orbit" && "A live map of how agents, goals, knowledge and tools connect across your company."}{active === "forge" && "Turn a goal into a mission, tasks and an assigned crew."}{active === "vault" && "Your company memory: products, decisions, documents and customer knowledge."}{active === "prism" && "See the patterns your agents are finding across customers, competitors and performance."}{active === "dock" && "Connect the tools your crew can safely read from and act inside."}{active === "atelier" && "A shared creative workspace for campaigns, copy, visuals and launch assets."}</p>
              {active === "forge" ? <button className="utility-action" onClick={() => setShowMission(true)}>Forge a mission →</button> : <button className="utility-action" onClick={() => setToast("This workspace is ready for your next integration.")}>Open workspace →</button>}
            </section>
          )}
        </div>

        <form className="command-bar" onSubmit={sendCommand}>
          <span className="command-star">✦</span>
          <input value={command} onChange={(e) => setCommand(e.target.value)} placeholder="Tell your crew what to do… e.g. “prepare next week’s launch plan”" />
          <button>Send ↑</button>
        </form>
      </section>

      {showMission && (
        <div className="modal-backdrop" onMouseDown={() => setShowMission(false)}>
          <form className="mission-modal" onSubmit={createMission} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-icon"><Icon name="command" /></div>
            <h2>Start a new mission</h2>
            <p>Describe the outcome. OneCrew will break it down and coordinate the right agents.</p>
            <label><span>Mission</span><input autoFocus value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} placeholder="Launch our new Pro plan" /></label>
            <label><span>Mission lead</span><select value={missionOwner} onChange={(e) => setMissionOwner(e.target.value)}>{agents.map((a) => <option key={a.name}>{a.name}</option>)}</select></label>
            <div className="modal-actions"><button type="button" onClick={() => setShowMission(false)}>Cancel</button><button className="create-btn">Create & delegate →</button></div>
          </form>
        </div>
      )}

      {toast && <div className="dash-toast"><Icon name="check" size={16}/>{toast}</div>}
    </main>
  );
}
