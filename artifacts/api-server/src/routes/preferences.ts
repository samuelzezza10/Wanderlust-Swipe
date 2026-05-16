import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, userPreferencesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
};

const formatPrefs = (p: any) => ({
  id: p.id,
  clerkUserId: p.clerkUserId,
  language: p.language,
  defaultBudget: p.defaultBudget ? parseFloat(String(p.defaultBudget)) : null,
  defaultNumberOfPeople: p.defaultNumberOfPeople,
  defaultDepartureLocation: p.defaultDepartureLocation,
  defaultFlightPreference: p.defaultFlightPreference,
  cookieConsent: p.cookieConsent,
  onboardingCompleted: p.onboardingCompleted,
  createdAt: p.createdAt.toISOString(),
});

router.get("/preferences", requireAuth, async (req: any, res) => {
  try {
    const [prefs] = await db
      .select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.clerkUserId, req.userId));

    if (!prefs) return res.status(404).json({ error: "No preferences found" });
    return res.json(formatPrefs(prefs));
  } catch (err) {
    req.log.error({ err }, "Error fetching preferences");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/preferences", requireAuth, async (req: any, res) => {
  const {
    language,
    defaultBudget,
    defaultNumberOfPeople,
    defaultDepartureLocation,
    defaultFlightPreference,
    cookieConsent,
    onboardingCompleted,
  } = req.body;

  try {
    const existing = await db
      .select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.clerkUserId, req.userId));

    let prefs;
    if (existing.length === 0) {
      [prefs] = await db
        .insert(userPreferencesTable)
        .values({
          clerkUserId: req.userId,
          language: language ?? "en",
          defaultBudget: defaultBudget != null ? String(defaultBudget) : undefined,
          defaultNumberOfPeople: defaultNumberOfPeople ?? undefined,
          defaultDepartureLocation: defaultDepartureLocation ?? undefined,
          defaultFlightPreference: defaultFlightPreference ?? undefined,
          cookieConsent: cookieConsent ?? false,
          onboardingCompleted: onboardingCompleted ?? false,
        })
        .returning();
    } else {
      const updateData: Record<string, unknown> = {};
      if (language !== undefined) updateData.language = language;
      if (defaultBudget !== undefined) updateData.defaultBudget = defaultBudget != null ? String(defaultBudget) : null;
      if (defaultNumberOfPeople !== undefined) updateData.defaultNumberOfPeople = defaultNumberOfPeople;
      if (defaultDepartureLocation !== undefined) updateData.defaultDepartureLocation = defaultDepartureLocation;
      if (defaultFlightPreference !== undefined) updateData.defaultFlightPreference = defaultFlightPreference;
      if (cookieConsent !== undefined) updateData.cookieConsent = cookieConsent;
      if (onboardingCompleted !== undefined) updateData.onboardingCompleted = onboardingCompleted;

      [prefs] = await db
        .update(userPreferencesTable)
        .set(updateData)
        .where(eq(userPreferencesTable.clerkUserId, req.userId))
        .returning();
    }

    res.json(formatPrefs(prefs));
  } catch (err) {
    req.log.error({ err }, "Error saving preferences");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/usage", async (req: any, res) => {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    return res.json({ searchCount: 0, isPremium: false, freeLimit: 20 });
  }

  try {
    const [prefs] = await db
      .select()
      .from(userPreferencesTable)
      .where(eq(userPreferencesTable.clerkUserId, userId));

    return res.json({
      searchCount: prefs?.tripSearchCount ?? 0,
      isPremium: prefs?.isPremium ?? false,
      freeLimit: 20,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching usage");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
