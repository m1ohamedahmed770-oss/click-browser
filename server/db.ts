import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tasks, agentSessions, executionHistory, bookmarks, Task, AgentSession, ExecutionHistory, Bookmark } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Task management functions
export async function createTask(userId: number, title: string, description: string, taskType: string, input: Record<string, unknown>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(tasks).values({
    userId,
    title,
    description,
    taskType,
    input,
    status: "pending",
  });

  return result;
}

export async function getUserTasks(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(tasks).where(eq(tasks.userId, userId));
}

export async function updateTaskStatus(taskId: number, status: "pending" | "running" | "completed" | "failed", result?: Record<string, unknown>, error?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };

  if (status === "completed") {
    updateData.result = result;
    updateData.completedAt = new Date();
  } else if (status === "failed") {
    updateData.error = error;
    updateData.completedAt = new Date();
  }

  return await db.update(tasks).set(updateData).where(eq(tasks.id, taskId));
}

// Agent session functions
export async function createAgentSession(userId: number, sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(agentSessions).values({
    userId,
    sessionId,
    status: "idle",
  });
}

export async function getUserSessions(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(agentSessions).where(eq(agentSessions.userId, userId));
}

export async function updateSessionStatus(sessionId: string, status: "active" | "idle" | "closed", currentUrl?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: Record<string, unknown> = {
    status,
    updatedAt: new Date(),
  };

  if (currentUrl) {
    updateData.currentUrl = currentUrl;
  }

  if (status === "closed") {
    updateData.closedAt = new Date();
  }

  return await db.update(agentSessions).set(updateData).where(eq(agentSessions.sessionId, sessionId));
}

// Execution history functions
export async function logExecution(taskId: number, sessionId: number, action: string, details: Record<string, unknown>, success: boolean = true, errorMessage?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(executionHistory).values({
    taskId,
    sessionId,
    action,
    details,
    success: success ? "true" : "false",
    errorMessage,
  });
}

export async function getTaskExecutionHistory(taskId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(executionHistory).where(eq(executionHistory.taskId, taskId));
}

// Bookmark functions
export async function createBookmark(userId: number, title: string, url: string, folder: string = "default") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(bookmarks).values({
    userId,
    title,
    url,
    folder,
  });
}

export async function getUserBookmarks(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
}

export async function deleteBookmark(bookmarkId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(bookmarks).where(eq(bookmarks.id, bookmarkId));
}
