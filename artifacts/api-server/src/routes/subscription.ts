import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, userPreferencesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
};

router.post("/subscription/upgrade", requireAuth, async (req: any, res) => {
  try {
    const [existing] = await db
      .select({ id: userPreferencesTable.id })
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.clerkUserId, req.userId));

    if (existing) {
      await db
        .update(userPreferencesTable)
        .set({ isPremium: true })
        .where(eq(userPreferencesTable.clerkUserId, req.userId));
    } else {
      await db.insert(userPreferencesTable).values({
        clerkUserId: req.userId,
        isPremium: true,
      });
    }

    return res.json({ isPremium: true, plan: "premium" });
  } catch (err) {
    req.log.error({ err }, "Error upgrading subscription");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/subscription/downgrade", requireAuth, async (req: any, res) => {
  try {
    await db
      .update(userPreferencesTable)
      .set({ isPremium: false })
      .where(eq(userPreferencesTable.clerkUserId, req.userId));

    return res.json({ isPremium: false, plan: "free" });
  } catch (err) {
    req.log.error({ err }, "Error downgrading subscription");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
