"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import OneCrewLogo from "../../components/OneCrewLogo";

type Session = { name: string; email: string };
type Mission = { id: string; title: string; owner: string; progress: number; status: string };
type Approval = { id: string; title: string; agent: string; type: string };
type ActivityItem = { id: string; agent: string; text: string; time: string };
type KnowledgeItem = { id: string; title: string; kind: string };
type Agent = { name: string; role: string; image: string; status: string; accent: string };

const BASE_AGENTS: Agent[] = [
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

const FALLBACK_MISSIONS: Mission[] = [
  { id: "m1", title: "Launch Q4 growth campaign", owner: "Milo", progress: 72, status: "On track" },
  { id: "m2", title: "Research next market segment", owner: "Scout", progress: 48, status: "In progress" },
  { id: "m3", title: "Refresh onboarding experience", owner: "Luna", progress: 35, status: "In review" },
];

const FALLBACK_APPROVALS: Approval[] = [
  { id: "a1", title: "Send 12 personalized outreach emails", agent: "Leo", type: "External action" },
  { id: "a2", title: "Publish launch announcement", agent: "Echo", type: "Public content" },
  { id: "a3", title: "Move product review to Thursday", agent: "Nova", type: "Calendar change" },
];

const FALLBACK_ACTIVITY: ActivityItem[] = [
  { id: "x1", agent: "Scout", text: "found 8 competitor positioning gaps", time: "2m" },
  { id: "x2", agent: "Milo", text: "built a new acquisition experiment", time: "12m" },
  { id: "x3", agent: "Luna", text: "delivered 3 launch visual directions", time: "28m" },
  { id: "x4", agent: "Nova", text: "reorganized the launch timeline", time: "43m" },
];

function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const shapes: Record<string, ReactNode> = {
    pulse: <path d="M3 12h4l2.3-6 4.2 12 2.4-6H21" />,
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
    moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    logout: <><path d="M9 5H5v14h4M13 8l4 4-4 4M17 12H9" /></>,
    cloud: <><path d="M7 18a5 5 0 0 1 .7-9.95A6 6 0 0 1 19 10.5 3.5 3.5 0 0 1 18.5 18H7Z" /></>,
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

function timeAgo(value: string | Date | undefined) {
  if (!value) return "now";
  const time = new Date(value).getTime();
  const diff = Math.max(0, Date.now() - time);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return mins + "m";
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + "h";
  return Math.floor(hours / 24) + "d";
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [active, setActive] = useState("pulse");
  const [agents, setAgents] = useState<Agent[]>(BASE_AGENTS);
  const [missions, setMissions] = useState<Mission[]>(FALLBACK_MISSIONS);
  const [approvals, setApprovals] = useState<Approval[]>(FALLBACK_APPROVALS);
  const [activity, setActivity] = useState<ActivityItem[]>(FALLBACK_ACTIVITY);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([
    { id: "k1", title: "Brand voice guide", kind: "Company knowledge" },
    { id: "k2", title: "Pricing & packaging", kind: "Company knowledge" },
    { id: "k3", title: "Customer interview notes", kind: "Founder note" },
    { id: "k4", title: "Launch playbook", kind: "Company knowledge" },
  ]);
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    Gmail: true, "Google Drive": true, Calendar: true, Slack: false, Notion: false, Stripe: true,
  });
  const [metrics, setMetrics] = useState({ liveMissions: 8, agentsOnline: 10, tasksCompleted: 248, hoursSaved: 96.4 });
  const [selectedAgent, setSelectedAgent] = useState<Agent>(BASE_AGENTS[0]);
  const [query, setQuery] = useState("");
  const [command, setCommand] = useState("");
  const [showMission, setShowMission] = useState(false);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionOwner, setMissionOwner] = useState("Atlas");
  const [knowledgeDraft, setKnowledgeDraft] = useState("");
  const [forgeGoal, setForgeGoal] = useState("");
  const [atelierItems, setAtelierItems] = useState(["Launch hero copy", "Q4 announcement", "Founder story"]);
  const [toast, setToast] = useState("");
  const [dbState, setDbState] = useState<"loading" | "connected" | "offline">("loading");

  useEffect(() => {
    const raw = window.localStorage.getItem("onecrew_session");
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Session;
      setSession(parsed);
      void loadDashboard(parsed);
    } catch {
      window.localStorage.removeItem("onecrew_session");
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  async function loadDashboard(current: Session) {
    setDbState("loading");
    try {
      const params = new URLSearchParams({ owner: current.email, name: current.name });
      const response = await fetch("/api/dashboard?" + params.toString(), { cache: "no-store" });
      if (!response.ok) throw new Error("database unavailable");
      const data = await response.json();

      const order = new Map(BASE_AGENTS.map((agent, index) => [agent.image, index]));
      const dbAgents: Agent[] = (data.agents || []).map((agent: any) => ({
        name: agent.name,
        role: agent.role,
        image: agent.avatar || agent.slug,
        status: agent.status,
        accent: agent.accent,
      })).sort((a: Agent, b: Agent) => (order.get(a.image) ?? 99) - (order.get(b.image) ?? 99));

      if (dbAgents.length) {
        setAgents(dbAgents);
        setSelectedAgent(dbAgents[0]);
      }

      setMissions((data.missions || []).map((mission: any) => ({
        id: mission.id,
        title: mission.title,
        owner: BASE_AGENTS.find((a) => a.image === mission.ownerSlug)?.name || mission.ownerSlug,
        progress: mission.progress,
        status: mission.status,
      })));

      setApprovals((data.approvals || []).map((approval: any) => ({
        id: approval.id,
        title: approval.title,
        agent: BASE_AGENTS.find((a) => a.image === approval.agentSlug)?.name || approval.agentSlug,
        type: approval.actionType,
      })));

      setActivity((data.activity || []).map((item: any) => ({
        id: item.id,
        agent: BASE_AGENTS.find((a) => a.image === item.agentSlug)?.name || item.agentSlug,
        text: item.message,
        time: timeAgo(item.createdAt),
      })));

      setKnowledge((data.knowledge || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        kind: item.kind,
      })));

      setIntegrations(data.integrations || {});
      if (data.metrics) setMetrics(data.metrics);
      if (data.workspace?.theme === "dark" || data.workspace?.theme === "light") {
        setTheme(data.workspace.theme);
      }
      setDbState("connected");
    } catch {
      setDbState("offline");
    }
  }

  async function dbAction(action: string, payload: Record<string, unknown> = {}) {
    if (!session) throw new Error("No session");
    const response = await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        ownerKey: session.email,
        displayName: session.name,
        ...payload,
      }),
    });
    if (!response.ok) throw new Error("Database action failed");
    const data = await response.json();
    await loadDashboard(session);
    return data;
  }

  const filteredActivity = useMemo(() => {
    if (!query.trim()) return activity;
    const q = query.toLowerCase();
    return activity.filter((a) => (a.agent + " " + a.text).toLowerCase().includes(q));
  }, [activity, query]);

  async function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      await dbAction("set-theme", { theme: next });
    } catch {
      window.localStorage.setItem("onecrew_theme", next);
    }
  }

  async function createMission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = missionTitle.trim();
    if (!title) return;
    setShowMission(false);
    setMissionTitle("");
    try {
      await dbAction("create-mission", { title, ownerSlug: missionOwner.toLowerCase() });
      setToast("Mission created and saved to Neon.");
    } catch {
      const next: Mission = { id: String(Date.now()), title, owner: missionOwner, progress: 4, status: "Planning" };
      setMissions((items) => [next, ...items]);
      setToast("Mission created locally. Neon is not connected yet.");
    }
  }

  async function resolveApproval(id: string, approved: boolean) {
    try {
      await dbAction("resolve-approval", { id, approved });
      setToast(approved ? "Approved. The crew can continue." : "Sent back for changes.");
    } catch {
      setApprovals((items) => items.filter((item) => item.id !== id));
      setToast("Updated locally. Neon is not connected yet.");
    }
  }

  async function sendCommand(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = command.trim();
    if (!text) return;
    setCommand("");
    try {
      await dbAction("command", { text });
      setToast("Atlas received your command.");
    } catch {
      setActivity((items) => [{ id: String(Date.now()), agent: "Atlas", text: "is coordinating: “" + text + "”", time: "now" }, ...items]);
      setToast("Atlas received the command locally.");
    }
  }

  async function addKnowledge(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = knowledgeDraft.trim();
    if (!title) return;
    setKnowledgeDraft("");
    try {
      await dbAction("add-knowledge", { title });
      setToast("Added to the Neon company memory.");
    } catch {
      setKnowledge((items) => [{ id: String(Date.now()), title, kind: "Company knowledge" }, ...items]);
      setToast("Saved locally. Neon is not connected yet.");
    }
  }

  async function removeKnowledge(id: string) {
    try {
      await dbAction("delete-knowledge", { id });
      setToast("Removed from company memory.");
    } catch {
      setKnowledge((items) => items.filter((item) => item.id !== id));
    }
  }

  async function setIntegration(name: string, connected: boolean) {
    setIntegrations((items) => ({ ...items, [name]: connected }));
    try {
      await dbAction("toggle-integration", { name, connected });
      setToast((connected ? "Connected " : "Disconnected ") + name + ".");
    } catch {
      setToast("Changed locally. Neon is not connected yet.");
    }
  }

  async function forgeMission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = forgeGoal.trim();
    if (!title) return;
    setForgeGoal("");
    try {
      await dbAction("create-mission", { title, ownerSlug: "atlas" });
      setActive("missions");
      setToast("Atlas forged the goal into a Neon-backed mission.");
    } catch {
      setMissions((items) => [{ id: String(Date.now()), title, owner: "Atlas", progress: 4, status: "Planning" }, ...items]);
      setActive("missions");
    }
  }

  async function createAtelierDraft() {
    const names = ["Customer launch email", "Product update story", "Social launch kit", "Sales enablement page"];
    const title = names[atelierItems.length % names.length];
    setAtelierItems((items) => [title, ...items]);
    try {
      await dbAction("add-knowledge", { title, kind: "Creative draft" });
      setToast("Luna and Echo saved a new creative draft.");
    } catch {
      setToast("Creative draft created locally.");
    }
  }

  function signOut() {
    window.localStorage.removeItem("onecrew_session");
    router.push("/login");
  }

  if (!session) {
    return (
      <div className="dashboard-loading">
        <div className="loader-mark"><span /><span /><span /></div>
        <p>Opening OneCrew…</p>
      </div>
    );
  }

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
              <Icon name={icon} />
              <span>{label}</span>
              {key === "signals" && <em>3</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-promo">
          <div className="promo-spark">✦</div>
          <b>Your crew never clocks out.</b>
          <span>10 specialists, one shared company brain.</span>
        </div>

        <button className="sidebar-user" onClick={signOut}>
          <span className="user-monogram">{session.name.slice(0, 1).toUpperCase()}</span>
          <span><b>{session.name}</b><small>{session.email}</small></span>
          <Icon name="logout" size={17} />
        </button>
      </aside>

      <section className="dash-main">
        <header className="dash-topbar">
          <div className="dash-search">
            <Icon name="search" size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search agents, missions, activity…" />
            <kbd>⌘ K</kbd>
          </div>
          <div className="top-actions">
            <span className={"neon-db-badge " + dbState}>
              <Icon name="cloud" size={14} />
              {dbState === "connected" ? "Neon live" : dbState === "loading" ? "Neon syncing" : "Neon pending"}
            </span>
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              <Icon name={theme === "dark" ? "sun" : "moon"} />
            </button>
            <button className="notification-btn">●</button>
            <button className="mini-profile">
              <span>{session.name.slice(0, 1).toUpperCase()}</span>
              <div><b>{session.name}</b><small>Founder</small></div>
            </button>
          </div>
        </header>

        <div className="dash-content">
          <div className="dash-heading">
            <div>
              <div className="page-kicker">{active === "pulse" ? "PULSE" : nav.find((n) => n[0] === active)?.[1]?.toUpperCase()}</div>
              <h1>{active === "pulse" ? <>Good morning, <span>{session.name.split(" ")[0]}.</span></> : nav.find((n) => n[0] === active)?.[1]}</h1>
              <p>{active === "pulse" ? "Your crew is moving the company forward while you focus on the decisions that matter." : "Everything here stays connected to your crew, missions, and company memory."}</p>
            </div>
            <button className="new-mission" onClick={() => setShowMission(true)}>
              <Icon name="plus" size={17} /> New mission
            </button>
          </div>

          {active === "pulse" && (
            <>
              <div className="metric-grid">
                <article className="metric violet"><div className="metric-icon"><Icon name="command" /></div><span>Live missions</span><b>{metrics.liveMissions}</b><small>Neon-backed workspace</small></article>
                <article className="metric mint"><div className="metric-icon"><Icon name="crew" /></div><span>Agents online</span><b>{metrics.agentsOnline}/10</b><small>All systems running</small></article>
                <article className="metric coral"><div className="metric-icon"><Icon name="check" /></div><span>Tasks completed</span><b>{metrics.tasksCompleted}</b><small>↑ 32% this month</small></article>
                <article className="metric blue"><div className="metric-icon"><Icon name="signals" /></div><span>Hours saved</span><b>{metrics.hoursSaved}h</b><small>↑ 18h this week</small></article>
              </div>

              <div className="dash-grid primary-grid">
                <article className="featured-mission">
                  <div className="feature-label">✦ FEATURED MISSION</div>
                  <h2>{missions[0]?.title || "Build your first mission"}</h2>
                  <p>Your crew is researching, creating and coordinating the work across the business.</p>
                  <div className="mission-progress"><span style={{ width: (missions[0]?.progress || 4) + "%" }} /></div>
                  <div className="mission-meta"><span>✓ Shared company context</span><span>✓ Crew handoffs enabled</span><span>● {missions[0]?.owner || "Atlas"} is leading</span></div>
                  <button onClick={() => setActive("missions")}>View mission <Icon name="arrow" size={15} /></button>
                  <div className="featured-crew">{["milo","scout","echo","luna"].map((x) => <AgentAvatar key={x} image={x} size={46} />)}</div>
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
                    {filteredActivity.slice(0, 5).map((item) => {
                      const agent = agents.find((a) => a.name.toLowerCase() === item.agent.toLowerCase()) || agents[0];
                      return (
                        <div className="activity-row" key={item.id}>
                          <AgentAvatar image={agent.image} size={35} />
                          <div><b>{item.agent}</b><span>{item.text}</span></div>
                          <small>{item.time}</small>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>

              <div className="dash-grid secondary-grid">
                <article className="crew-card">
                  <div className="card-title"><h3>Your AI crew</h3><button onClick={() => setActive("crew")}>Manage crew →</button></div>
                  <div className="crew-row">
                    {agents.slice(0, 7).map((agent) => (
                      <button key={agent.name} onClick={() => { setSelectedAgent(agent); setActive("crew"); }}>
                        <AgentAvatar image={agent.image} size={58} />
                        <b>{agent.name}</b><small>{agent.role}</small><em>● {agent.status}</em>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="approval-card">
                  <div className="card-title"><h3>Needs approval</h3><span className="count-badge">{approvals.length}</span></div>
                  {approvals.slice(0, 3).map((item) => (
                    <div className="approval-row" key={item.id}>
                      <div><b>{item.title}</b><small>{item.agent} · {item.type}</small></div>
                      <div>
                        <button className="approve" onClick={() => resolveApproval(item.id, true)}>Approve</button>
                        <button onClick={() => resolveApproval(item.id, false)}>Changes</button>
                      </div>
                    </div>
                  ))}
                  {!approvals.length && <div className="empty-state">✓ You are all caught up.</div>}
                </article>
              </div>
            </>
          )}

          {active === "missions" && (
            <section className="section-panel">
              <div className="panel-toolbar"><h2>Mission Control</h2><button onClick={() => setShowMission(true)}><Icon name="plus" size={16}/> Create mission</button></div>
              <div className="mission-list-full">
                {missions.map((mission) => (
                  <article key={mission.id}>
                    <div className="mission-symbol">◎</div>
                    <div className="mission-copy"><h3>{mission.title}</h3><span>Lead: {mission.owner} · {mission.status}</span><div className="full-progress"><i style={{ width: mission.progress + "%" }} /></div></div>
                    <b>{mission.progress}%</b><button><Icon name="arrow" /></button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {active === "crew" && (
            <section className="section-panel crewline-panel">
              <div className="panel-toolbar"><h2>Crewline</h2><span>{agents.length} specialists · {agents.length} online</span></div>
              <div className="crewline-layout">
                <div className="agent-grid">
                  {agents.map((agent) => (
                    <button className={selectedAgent.name === agent.name ? "selected" : ""} onClick={() => setSelectedAgent(agent)} key={agent.name}>
                      <AgentAvatar image={agent.image} size={72} /><b>{agent.name}</b><span>{agent.role}</span><em>● {agent.status}</em>
                    </button>
                  ))}
                </div>
                <div className="agent-detail">
                  <AgentAvatar image={selectedAgent.image} size={92}/>
                  <div><span className="agent-state">● {selectedAgent.status}</span><h2>{selectedAgent.name}</h2><p>{selectedAgent.role}</p></div>
                  <hr/>
                  <h4>Current objective</h4>
                  <p>Move the company forward with clear, high-quality work and escalate only the decisions that need the founder.</p>
                  <div className="agent-stats"><div><b>42</b><span>Tasks</span></div><div><b>96%</b><span>Success</span></div><div><b>7.8h</b><span>Saved</span></div></div>
                  <button className="agent-chat" onClick={() => setToast("Opening a direct thread with " + selectedAgent.name + ".")}>Chat with {selectedAgent.name} →</button>
                </div>
              </div>
            </section>
          )}

          {active === "forge" && (
            <section className="section-panel forge-panel">
              <div className="panel-toolbar"><div><h2>Forge</h2><span>Turn one outcome into coordinated work.</span></div></div>
              <form className="forge-composer" onSubmit={forgeMission}>
                <span className="forge-star">✦</span>
                <textarea value={forgeGoal} onChange={(e) => setForgeGoal(e.target.value)} placeholder="What should your company accomplish? e.g. Get our first 25 agency customers" />
                <div><span>Atlas will plan the work, choose the crew and request approval before external actions.</span><button>Forge mission →</button></div>
              </form>
              <div className="forge-flow">
                <article><span>01</span><b>Understand outcome</b><small>Atlas clarifies the goal and success metric.</small></article><i>→</i>
                <article><span>02</span><b>Assemble crew</b><small>Specialists are chosen for the mission.</small></article><i>→</i>
                <article><span>03</span><b>Build plan</b><small>Work becomes tasks, dependencies and reviews.</small></article><i>→</i>
                <article><span>04</span><b>Execute</b><small>Your crew works and escalates decisions.</small></article>
              </div>
            </section>
          )}

          {active === "orbit" && (
            <section className="section-panel orbit-panel">
              <div className="panel-toolbar"><div><h2>Orbit</h2><span>Your company graph, live.</span></div><span>{agents.length} agents · {missions.length} missions · {knowledge.length} memory sources</span></div>
              <div className="orbit-canvas">
                <div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/>
                <button className="orbit-founder"><span>{session.name.slice(0,1).toUpperCase()}</span><b>{session.name.split(" ")[0]}</b><small>Founder</small></button>
                {agents.slice(0, 8).map((agent, index) => (
                  <button key={agent.name} className={"orbit-agent orbit-agent-" + index} onClick={() => { setSelectedAgent(agent); setActive("crew"); }}>
                    <AgentAvatar image={agent.image} size={52}/><b>{agent.name}</b><small>{agent.role}</small>
                  </button>
                ))}
                <div className="orbit-caption">Every mission, agent and memory source stays connected to one company context.</div>
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
                <article><span>Founder time saved</span><b>{metrics.hoursSaved}h</b><em>+21h vs last month</em></article>
              </div>
              <div className="big-chart"><svg viewBox="0 0 900 260" preserveAspectRatio="none"><path className="gridline" d="M0 52H900M0 130H900M0 208H900"/><path className="line" d="M0 210 C100 140 160 180 225 122 S355 78 420 118 S540 170 610 92 S735 85 900 42"/><path className="line mint-line" d="M0 228 C100 205 155 212 240 168 S350 170 440 138 S590 120 690 130 S790 95 900 82"/></svg></div>
            </section>
          )}

          {active === "vault" && (
            <section className="section-panel vault-panel">
              <div className="panel-toolbar"><div><h2>Vault</h2><span>The shared memory behind every agent.</span></div><span>{knowledge.length} sources</span></div>
              <form className="vault-add" onSubmit={addKnowledge}><Icon name="plus" size={17}/><input value={knowledgeDraft} onChange={(e) => setKnowledgeDraft(e.target.value)} placeholder="Add a note, URL, policy or company fact…" /><button>Add to memory</button></form>
              <div className="vault-grid">
                {knowledge.map((item, index) => (
                  <article key={item.id}>
                    <div className="vault-file">{index % 3 === 0 ? "Aa" : index % 3 === 1 ? "↗" : "▤"}</div>
                    <div><b>{item.title}</b><span>{item.kind} · Available to crew</span></div>
                    <button onClick={() => removeKnowledge(item.id)}>×</button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {active === "prism" && (
            <section className="section-panel prism-panel">
              <div className="panel-toolbar"><div><h2>Prism</h2><span>Patterns your crew thinks you should notice.</span></div><span>Updated now</span></div>
              <div className="insight-hero">
                <div className="insight-glow"/><span>✦ HIGHEST-LEVERAGE INSIGHT</span>
                <h2>Your fastest-growing customers are small agencies with 3–8 people.</h2>
                <p>Scout found the segment converts 2.4× better, while Milo found CAC is 31% lower than your current average.</p>
                <button onClick={() => { setMissionTitle("Build an agency-focused growth campaign"); setMissionOwner("Milo"); setShowMission(true); }}>Turn into mission →</button>
              </div>
              <div className="prism-grid"><article><span>Acquisition</span><b>Organic search is compounding</b><p>Branded search is up 38% in 30 days.</p></article><article><span>Product</span><b>Activation bottleneck found</b><p>Users who invite an agent in day one retain 1.8× better.</p></article><article><span>Sales</span><b>Founder-led outreach wins</b><p>Personalized follow-up is producing the highest reply rate.</p></article></div>
            </section>
          )}

          {active === "dock" && (
            <section className="section-panel dock-panel">
              <div className="panel-toolbar"><div><h2>Dock</h2><span>Control what your crew can read and do.</span></div><span>{Object.values(integrations).filter(Boolean).length} connected</span></div>
              <div className="integration-grid">
                {Object.entries(integrations).map(([name, connected], index) => (
                  <article key={name}>
                    <div className={"integration-logo int-" + index}>{name.slice(0,1)}</div>
                    <div><b>{name}</b><span>{connected ? "Connected · Crew access enabled" : "Not connected"}</span></div>
                    <button className={connected ? "connected" : ""} onClick={() => setIntegration(name, !connected)}>{connected ? "Connected ✓" : "Connect"}</button>
                  </article>
                ))}
              </div>
              <div className="permission-note"><Icon name="vault" size={18}/><div><b>Permission-first by default</b><span>Agents can only take actions that match the access level you approve.</span></div></div>
            </section>
          )}

          {active === "atelier" && (
            <section className="section-panel atelier-panel">
              <div className="panel-toolbar"><div><h2>Atelier</h2><span>Where Luna + Echo turn strategy into creative work.</span></div><button onClick={createAtelierDraft}><Icon name="plus" size={16}/> New draft</button></div>
              <div className="atelier-grid">
                {atelierItems.map((item, index) => (
                  <article key={item + index} className={"atelier-card art-" + (index % 4)}>
                    <div className="atelier-preview"><span>{index % 2 === 0 ? "Aa" : "✦"}</span><small>{item}</small></div>
                    <div><b>{item}</b><span>{index % 2 === 0 ? "Echo · Copy" : "Luna · Design"} · edited just now</span></div>
                    <button onClick={() => setToast("Opened “" + item + "” in Atelier.")}>Open →</button>
                  </article>
                ))}
              </div>
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
            <label><span>Mission lead</span><select value={missionOwner} onChange={(e) => setMissionOwner(e.target.value)}>{agents.map((agent) => <option key={agent.name}>{agent.name}</option>)}</select></label>
            <div className="modal-actions"><button type="button" onClick={() => setShowMission(false)}>Cancel</button><button className="create-btn">Create & delegate →</button></div>
          </form>
        </div>
      )}

      {toast && <div className="dash-toast"><Icon name="check" size={16}/>{toast}</div>}
    </main>
  );
}
