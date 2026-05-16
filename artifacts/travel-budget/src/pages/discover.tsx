import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useGenerateTrips, useSaveTrip, useGetPreferences } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { MapPin, Plane, Hotel, Check, X, RotateCcw } from "lucide-react";
import { useAuth } from "@clerk/react";
import { useLocation } from "wouter";
import type { TripSuggestion } from "@workspace/api-client-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Discover() {
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const [trips, setTrips] = useState<TripSuggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const { data: prefs } = useGetPreferences({
    query: { enabled: !!isSignedIn, queryKey: ["preferences"] }
  });

  const generateTrips = useGenerateTrips();
  const saveTrip = useSaveTrip();

  useEffect(() => {
    loadTrips();
  }, [prefs]);

  const loadTrips = () => {
    generateTrips.mutate(
      {
        data: {
          budget: prefs?.defaultBudget || 2000,
          numberOfPeople: prefs?.defaultNumberOfPeople || 2,
          departureDate: new Date().toISOString(),
          returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          departureLocation: prefs?.defaultDepartureLocation || "New York",
          arrivalLocation: "Any",
          numberOfNights: 7,
          flightPreference: (prefs?.defaultFlightPreference as any) || "any",
        },
      },
      {
        onSuccess: (data) => {
          setTrips(data);
          setCurrentIndex(0);
          setHistory([]);
        },
      }
    );
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= trips.length) return;

    const trip = trips[currentIndex];

    if (direction === "right") {
      if (isSignedIn) {
        saveTrip.mutate({
          data: {
            tripData: trip,
            destination: trip.destination,
            totalPrice: trip.totalPrice,
            imageUrl: trip.imageUrl,
          },
        });
      } else {
        setLocation("/sign-up");
        return;
      }
    }

    setHistory([...history, currentIndex]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevIndex = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentIndex(prevIndex);
    }
  };

  if (generateTrips.isPending && trips.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Plane className="w-12 h-12 text-muted-foreground mb-4 animate-bounce" />
          <p className="text-muted-foreground font-medium">Finding perfect getaways...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= trips.length && trips.length > 0) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col p-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You've seen them all!</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          We can find more amazing destinations based on your preferences.
        </p>
        <Button onClick={loadTrips} size="lg" disabled={generateTrips.isPending}>
          Generate More Trips
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="relative w-full max-w-sm aspect-[3/4]">
        <AnimatePresence>
          {trips.slice(currentIndex, currentIndex + 3).reverse().map((trip, i) => {
            const isTop = i === trips.slice(currentIndex, currentIndex + 3).length - 1;
            return (
              <TripCard
                key={trip.id}
                trip={trip}
                isTop={isTop}
                index={i}
                onSwipe={handleSwipe}
              />
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full text-muted-foreground border-2"
          onClick={handleUndo}
          disabled={history.length === 0}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full text-danger border-2 border-danger/20 hover:bg-danger/10"
          onClick={() => handleSwipe("left")}
        >
          <X className="w-8 h-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-16 rounded-full text-green-500 border-2 border-green-500/20 hover:bg-green-500/10"
          onClick={() => handleSwipe("right")}
        >
          <Check className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}

function TripCard({ trip, isTop, index, onSwipe }: any) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [0, -100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-card rounded-3xl shadow-xl overflow-hidden border border-border"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: index,
        scale: 1 - (2 - index) * 0.05,
        y: (2 - index) * 10,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1 - (2 - index) * 0.05, opacity: 1 }}
      exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="relative h-full w-full">
        <img
          src={`${basePath}${trip.imageUrl.startsWith('/') ? '' : '/'}${trip.imageUrl}`}
          alt={trip.destination}
          className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
        
        {isTop && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-bold text-4xl px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none"
            >
              LIKE
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-8 right-8 border-4 border-danger text-danger font-bold text-4xl px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none"
            >
              NOPE
            </motion.div>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
          <h2 className="text-3xl font-bold mb-1">{trip.destination}</h2>
          <p className="text-white/80 font-medium mb-4">{trip.country}</p>
          
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <Plane className="w-4 h-4" />
              <span>${trip.transport.price}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <Hotel className="w-4 h-4" />
              <span>${trip.hotel.pricePerNight}/nt</span>
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <p className="text-sm text-white/80 line-clamp-2 pr-4">{trip.description}</p>
            <div className="text-right shrink-0">
              <p className="text-xs text-white/70 uppercase tracking-wider font-bold">Total</p>
              <p className="text-2xl font-bold">${trip.totalPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
