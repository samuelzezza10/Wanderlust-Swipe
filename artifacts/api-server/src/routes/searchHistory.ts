import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, searchHistoryTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
};

router.get("/search-history", requireAuth, async (req: any, res) => {
  try {
    const rows = await db
      .select()
      .from(searchHistoryTable)
      .where(eq(searchHistoryTable.clerkUserId, req.userId))
      .orderBy(desc(searchHistoryTable.createdAt))
      .limit(10);

    return res.json(rows.map((r) => ({
      id: r.id,
      departureLocation: r.departureLocation,
      arrivalLocation: r.arrivalLocation,
      departureDate: r.departureDate,
      returnDate: r.returnDate,
      budget: r.budget,
      numberOfPeople: r.numberOfPeople,
      numberOfNights: r.numberOfNights,
      tripType: r.tripType,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch search history");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/search-history", requireAuth, async (req: any, res) => {
  try {
    const {
      departureLocation, arrivalLocation, departureDate, returnDate,
      budget, numberOfPeople, numberOfNights, tripType,
    } = req.body;

    // Keep only last 10 per user — prune oldest first
    const existing = await db
      .select({ id: searchHistoryTable.id })
      .from(searchHistoryTable)
      .where(eq(searchHistoryTable.clerkUserId, req.userId))
      .orderBy(desc(searchHistoryTable.createdAt));

    if (existing.length >= 10) {
      const toDelete = existing.slice(9).map((r) => r.id);
      for (const id of toDelete) {
        await db.delete(searchHistoryTable).where(eq(searchHistoryTable.id, id));
      }
    }

    const [inserted] = await db
      .insert(searchHistoryTable)
      .values({
        clerkUserId: req.userId,
        departureLocation: departureLocation ?? null,
        arrivalLocation: arrivalLocation ?? null,
        departureDate: departureDate ?? null,
        returnDate: returnDate ?? null,
        budget: budget ?? null,
        numberOfPeople: numberOfPeople ?? null,
        numberOfNights: numberOfNights ?? null,
        tripType: tripType ?? null,
      })
      .returning();

    return res.status(201).json({
      id: inserted.id,
      departureLocation: inserted.departureLocation,
      arrivalLocation: inserted.arrivalLocation,
      departureDate: inserted.departureDate,
      returnDate: inserted.returnDate,
      budget: inserted.budget,
      numberOfPeople: inserted.numberOfPeople,
      numberOfNights: inserted.numberOfNights,
      tripType: inserted.tripType,
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save search history");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
