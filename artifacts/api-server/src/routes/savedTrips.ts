import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, savedTripsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";

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

router.get("/saved-trips", requireAuth, async (req: any, res) => {
  try {
    const trips = await db
      .select()
      .from(savedTripsTable)
      .where(eq(savedTripsTable.clerkUserId, req.userId))
      .orderBy(desc(savedTripsTable.createdAt));

    res.json(
      trips.map((t) => ({
        id: t.id,
        clerkUserId: t.clerkUserId,
        destination: t.destination,
        totalPrice: parseFloat(String(t.totalPrice)),
        imageUrl: t.imageUrl,
        shareToken: t.shareToken,
        createdAt: t.createdAt.toISOString(),
        tripData: t.tripData,
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Error fetching saved trips");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/saved-trips", requireAuth, async (req: any, res) => {
  const { tripData, destination, totalPrice, imageUrl } = req.body;

  if (!tripData || !destination || totalPrice === undefined || !imageUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const shareToken = crypto.randomBytes(8).toString("hex");
    const [trip] = await db
      .insert(savedTripsTable)
      .values({
        clerkUserId: req.userId,
        destination,
        totalPrice: String(totalPrice),
        imageUrl,
        shareToken,
        tripData,
      })
      .returning();

    return res.status(201).json({
      id: trip.id,
      clerkUserId: trip.clerkUserId,
      destination: trip.destination,
      totalPrice: parseFloat(String(trip.totalPrice)),
      imageUrl: trip.imageUrl,
      shareToken: trip.shareToken,
      createdAt: trip.createdAt.toISOString(),
      tripData: trip.tripData,
    });
  } catch (err) {
    req.log.error({ err }, "Error saving trip");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/saved-trips/:id", requireAuth, async (req: any, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    const [trip] = await db
      .select()
      .from(savedTripsTable)
      .where(and(eq(savedTripsTable.id, id), eq(savedTripsTable.clerkUserId, req.userId)));

    if (!trip) return res.status(404).json({ error: "Not found" });

    return res.json({
      id: trip.id,
      clerkUserId: trip.clerkUserId,
      destination: trip.destination,
      totalPrice: parseFloat(String(trip.totalPrice)),
      imageUrl: trip.imageUrl,
      shareToken: trip.shareToken,
      createdAt: trip.createdAt.toISOString(),
      tripData: trip.tripData,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching saved trip");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/saved-trips/:id", requireAuth, async (req: any, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  try {
    await db
      .delete(savedTripsTable)
      .where(and(eq(savedTripsTable.id, id), eq(savedTripsTable.clerkUserId, req.userId)));
    return res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Error deleting saved trip");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
