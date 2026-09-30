import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../lib/db";
import {
  activity,
  agents,
  approvals,
  integrations,
  knowledge,
  missions,
  workspaces,
} from "../../../lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_AGENTS = [
  { slug: "atlas", name: "Atlas", role: "Chief of Staff", status: "Online", accent: "#FFBA45", avatar: "atlas" },
  { slug: "scout", name: "Scout", role: "Research", status: "Researching", accent: "#8A6CF6", avatar: "scout" },
  { slug: "milo", name: "Milo", role: "Growth", status: "Working", accent: "#52CFAD", avatar: "milo" },
  { slug: "nova", name: "Nova", role: "Operations", status: "Online", accent: "#6CA7FF", avatar: "nova" },
  { slug: "leo", name: "Leo", role: "Sales", status: "Working", accent: "#FF6F97", avatar: "leo" },
  { slug: "iris", name: "Iris", role: "Support", status: "Online", accent: "#5BBBEA", avatar: "iris" },
  { slug: "zara", name: "Zara", role: "Finance", status: "Reviewing", accent: "#88CE67", avatar: "zara" },
  { slug: "kael", name: "Kael", role: "Product", status: "Working", accent: "#FF9F4E", avatar: "kael" },
  { slug: "luna", name: "Luna", role: "Design", status: "Creating", accent: "#D681EA", avatar: "luna" },
  { slug: "echo", name: "Echo", role: "Content", status: "Online", accent: "#E8C16C", avatar: "echo" },
] as const;

const DEFAULT_MISSIONS = [
  { title: "Launch Q4 growth campaign", ownerSlug: "milo", progress: 72, status: "On track" },
  { title: "Research next market segment", ownerSlug: "scout", progress: 48, status: "In progress" },
  { title: "Refresh onboarding experience", ownerSlug: "luna", progress: 35, status: "In review" },
];

const DEFAULT_APPROVALS = [
  { title: "Send 12 personalized outreach emails", agentSlug: "leo", actionType: "External action" },
  { title: "Publish launch announcement", agentSlug: "echo", actionType: "Public content" },
  { title: "Move product review to Thursday", agentSlug: "nova", actionType: "Calendar change" },
];

const DEFAULT_ACTIVITY = [
  { agentSlug: "scout", message: "found 8 competitor positioning gaps" },
  { agentSlug: "milo", message: "built a new acquisition experiment" },
  { agentSlug: "luna", message: "delivered 3 launch visual directions" },
  { agentSlug: "nova", message: "reorganized the launch timeline" },
];

const DEFAULT_KNOWLEDGE = [
  { title: "Brand voice guide", kind: "Company knowledge" },
  { title: "Pricing & packaging", kind: "Company knowledge" },
  { title: "Customer interview notes", kind: "Founder note" },
  { title: "Launch playbook", kind: "Company knowledge" },
];

const DEFAULT_INTEGRATIONS = [
  { name: "Gmail", connected: true },
  { name: "Google Drive", connected: true },
  { name: "Calendar", connected: true },
  { name: "Slack", connected: false },
  { name: "Notion", connected: false },
  { name: "Stripe", connected: true },
];

function normalizeOwner(value: string | null) {
  return (value || "").trim().toLowerCase().slice(0, 320);
}

async function ensureWorkspace(ownerKey: string, displayName?: string) {
  const db = getDb();
  const existing = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerKey, ownerKey))
    .limit(1);

  let workspace = existing[0];
  let created = false;

  if (!workspace) {
    const fallbackName =
      displayName?.trim() ||
      ownerKey.split("@")[0]?.replace(/[._-]+/g, " ") ||
      "My company";

    const rows = await db
      .insert(workspaces)
      .values({
        ownerKey,
        name: fallbackName,
      })
      .returning();
    workspace = rows[0];
    created = true;
  }

  await db
    .insert(agents)
    .values(
      DEFAULT_AGENTS.map((agent) => ({
        workspaceId: workspace.id,
        ...agent,
      }))
    )
    .onConflictDoNothing();

  await db
    .insert(integrations)
    .values(
      DEFAULT_INTEGRATIONS.map((integration) => ({
        workspaceId: workspace.id,
        ...integration,
      }))
    )
    .onConflictDoNothing();

  const missionExists = await db
    .select({ id: missions.id })
    .from(missions)
    .where(eq(missions.workspaceId, workspace.id))
    .limit(1);

  if (!missionExists.length) {
    await db.insert(missions).values(
      DEFAULT_MISSIONS.map((mission) => ({
        workspaceId: workspace.id,
        ...mission,
      }))
    );
  }

  const approvalExists = await db
    .select({ id: approvals.id })
    .from(approvals)
    .where(eq(approvals.workspaceId, workspace.id))
    .limit(1);

  if (!approvalExists.length) {
    await db.insert(approvals).values(
      DEFAULT_APPROVALS.map((approval) => ({
        workspaceId: workspace.id,
        ...approval,
      }))
    );
  }

  const activityExists = await db
    .select({ id: activity.id })
    .from(activity)
    .where(eq(activity.workspaceId, workspace.id))
    .limit(1);

  if (!activityExists.length) {
    await db.insert(activity).values(
      DEFAULT_ACTIVITY.map((item) => ({
        workspaceId: workspace.id,
        ...item,
      }))
    );
  }

  const knowledgeExists = await db
    .select({ id: knowledge.id })
    .from(knowledge)
    .where(eq(knowledge.workspaceId, workspace.id))
    .limit(1);

  if (!knowledgeExists.length) {
    await db.insert(knowledge).values(
      DEFAULT_KNOWLEDGE.map((item) => ({
        workspaceId: workspace.id,
        ...item,
      }))
    );
  }

  return { db, workspace, created };
}

async function dashboardPayload(ownerKey: string, displayName?: string) {
  const { db, workspace } = await ensureWorkspace(ownerKey, displayName);

  const [agentRows, missionRows, approvalRows, activityRows, knowledgeRows, integrationRows] =
    await Promise.all([
      db.select().from(agents).where(eq(agents.workspaceId, workspace.id)),
      db
        .select()
        .from(missions)
        .where(eq(missions.workspaceId, workspace.id))
        .orderBy(desc(missions.createdAt)),
      db
        .select()
        .from(approvals)
        .where(
          and(
            eq(approvals.workspaceId, workspace.id),
            eq(approvals.status, "pending")
          )
        )
        .orderBy(desc(approvals.createdAt)),
      db
        .select()
        .from(activity)
        .where(eq(activity.workspaceId, workspace.id))
        .orderBy(desc(activity.createdAt))
        .limit(40),
      db
        .select()
        .from(knowledge)
        .where(eq(knowledge.workspaceId, workspace.id))
        .orderBy(desc(knowledge.createdAt)),
      db
        .select()
        .from(integrations)
        .where(eq(integrations.workspaceId, workspace.id)),
    ]);

  return {
    workspace,
    agents: agentRows,
    missions: missionRows,
    approvals: approvalRows,
    activity: activityRows,
    knowledge: knowledgeRows,
    integrations: Object.fromEntries(
      integrationRows.map((item) => [item.name, item.connected])
    ),
    metrics: {
      liveMissions: missionRows.filter((item) => item.progress < 100).length,
      agentsOnline: agentRows.length,
      tasksCompleted: 248 + activityRows.filter((item) => item.message.includes("complete")).length,
      hoursSaved: 96.4,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const ownerKey = normalizeOwner(request.nextUrl.searchParams.get("owner"));
    const name = request.nextUrl.searchParams.get("name") || undefined;

    if (!ownerKey) {
      return NextResponse.json({ error: "owner is required" }, { status: 400 });
    }

    return NextResponse.json(await dashboardPayload(ownerKey, name));
  } catch (error) {
    console.error("OneCrew dashboard GET failed", error);
    return NextResponse.json(
      {
        error: "database_unavailable",
        message:
          error instanceof Error ? error.message : "Could not load the OneCrew workspace",
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ownerKey = normalizeOwner(body.ownerKey);
    const displayName = typeof body.displayName === "string" ? body.displayName : undefined;

    if (!ownerKey) {
      return NextResponse.json({ error: "ownerKey is required" }, { status: 400 });
    }

    const { db, workspace } = await ensureWorkspace(ownerKey, displayName);
    const action = String(body.action || "");

    if (action === "create-mission") {
      const title = String(body.title || "").trim();
      const ownerSlug = String(body.ownerSlug || "atlas").toLowerCase();
      if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
      }

      const [mission] = await db
        .insert(missions)
        .values({
          workspaceId: workspace.id,
          title,
          ownerSlug,
          progress: 4,
          status: "Planning",
        })
        .returning();

      await db.insert(activity).values({
        workspaceId: workspace.id,
        agentSlug: "atlas",
        message: `created mission “${title}”`,
      });

      return NextResponse.json({ ok: true, mission });
    }

    if (action === "resolve-approval") {
      const id = String(body.id || "");
      const status = body.approved ? "approved" : "changes";
      const [approval] = await db
        .update(approvals)
        .set({ status, resolvedAt: new Date() })
        .where(
          and(
            eq(approvals.id, id),
            eq(approvals.workspaceId, workspace.id)
          )
        )
        .returning();

      if (approval) {
        await db.insert(activity).values({
          workspaceId: workspace.id,
          agentSlug: approval.agentSlug,
          message: body.approved
            ? `received approval for “${approval.title}”`
            : `received requested changes for “${approval.title}”`,
        });
      }

      return NextResponse.json({ ok: true, approval });
    }

    if (action === "add-knowledge") {
      const title = String(body.title || "").trim();
      if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
      }

      const [item] = await db
        .insert(knowledge)
        .values({
          workspaceId: workspace.id,
          title,
          kind: String(body.kind || "Company knowledge"),
        })
        .returning();

      return NextResponse.json({ ok: true, item });
    }

    if (action === "delete-knowledge") {
      const id = String(body.id || "");
      await db
        .delete(knowledge)
        .where(
          and(
            eq(knowledge.id, id),
            eq(knowledge.workspaceId, workspace.id)
          )
        );

      return NextResponse.json({ ok: true });
    }

    if (action === "toggle-integration") {
      const name = String(body.name || "").trim();
      const connected = Boolean(body.connected);
      if (!name) {
        return NextResponse.json({ error: "name is required" }, { status: 400 });
      }

      const [item] = await db
        .insert(integrations)
        .values({
          workspaceId: workspace.id,
          name,
          connected,
        })
        .onConflictDoUpdate({
          target: [integrations.workspaceId, integrations.name],
          set: { connected, updatedAt: new Date() },
        })
        .returning();

      return NextResponse.json({ ok: true, item });
    }

    if (action === "command") {
      const text = String(body.text || "").trim();
      if (!text) {
        return NextResponse.json({ error: "text is required" }, { status: 400 });
      }

      const [item] = await db
        .insert(activity)
        .values({
          workspaceId: workspace.id,
          agentSlug: "atlas",
          message: `is coordinating: “${text}”`,
        })
        .returning();

      return NextResponse.json({ ok: true, activity: item });
    }

    if (action === "set-theme") {
      const theme = body.theme === "dark" ? "dark" : "light";
      const [updated] = await db
        .update(workspaces)
        .set({ theme, updatedAt: new Date() })
        .where(eq(workspaces.id, workspace.id))
        .returning();

      return NextResponse.json({ ok: true, workspace: updated });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("OneCrew dashboard POST failed", error);
    return NextResponse.json(
      {
        error: "database_unavailable",
        message:
          error instanceof Error ? error.message : "Could not update the OneCrew workspace",
      },
      { status: 503 }
    );
  }
}
