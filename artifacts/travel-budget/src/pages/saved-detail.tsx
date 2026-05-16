import { useState } from "react";
import { useGetSavedTrip, useDeleteSavedTrip, getGetSavedTripsQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Calendar, MapPin, Share2, Trash2, ArrowLeft, TrainFront, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SavedDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useAuth();
  const { t } = useI18n();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: savedTrip, isLoading } = useGetSavedTrip(id, {
    query: { enabled: !!id && !!isSignedIn, queryKey: ["saved-trip", id] },
  });

  const deleteTrip = useDeleteSavedTrip();

  if (!isLoaded) return <div className="p-8 text-center text-muted-foreground">{t.saved.loading}</div>;
  if (!isSignedIn) return <Redirect to="/sign-in" />;

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">{t.saved.loading}</div>;
  if (!savedTrip) return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-[60vh]">
      <p className="text-muted-foreground mb-4">{t.savedDetail.notFound}</p>
      <Button variant="outline" onClick={() => setLocation("/saved")}>
        <ArrowLeft className="w-4 h-4 mr-2" /> {t.savedDetail.backToSaved}
      </Button>
    </div>
  );

  const trip = savedTrip.tripData;
  const isFlightTrip = trip.transport.company?.toLowerCase().includes("air") ||
    trip.transport.type === "flight" ||
    !trip.transport.type?.includes("train");

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success(t.savedDetail.linkCopied);
    });
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    deleteTrip.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSavedTripsQueryKey() });
        toast.success(t.savedDetail.deleted);
        setLocation("/saved");
      },
      onError: () => {
        toast.error(t.savedDetail.deleteError);
        setConfirmDelete(false);
      },
    });
  };

  return (
    <div className="flex flex-col bg-background min-h-[100dvh]">
      <div className="relative h-64 md:h-96 shrink-0">
        <img
          src={`${basePath}${savedTrip.imageUrl.startsWith("/") ? "" : "/"}${savedTrip.imageUrl}`}
          alt={savedTrip.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="icon"
            className="bg-background/20 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black"
            onClick={() => setLocation("/saved")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-background/20 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={confirmDelete
                ? "bg-red-600 backdrop-blur-md border-red-500 text-white hover:bg-red-700"
                : "bg-background/20 backdrop-blur-md border-white/20 text-white hover:bg-red-600 hover:border-red-500"}
              onClick={handleDeleteClick}
              disabled={deleteTrip.isPending}
            >
              {confirmDelete ? <CheckCircle className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          {confirmDelete && (
            <p className="text-sm bg-red-600/80 rounded-lg px-3 py-1.5 mb-3 inline-block">
              {t.savedDetail.confirmDelete}
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{savedTrip.destination}</h1>
          <div className="flex items-center gap-2 text-white/80 text-lg">
            <MapPin className="w-5 h-5" />
            <span>{trip.country}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">{t.savedDetail.overview}</h2>
            <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
          </section>

          {trip.highlights && trip.highlights.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">{t.savedDetail.highlights}</h2>
              <ul className="space-y-3">
                {trip.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-primary mb-1">
              €{Number(savedTrip.totalPrice).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mb-6">{t.savedDetail.totalCost}</div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0">
                  {isFlightTrip ? <Plane className="w-5 h-5" /> : <TrainFront className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold">{trip.transport.company}</div>
                  <div className="text-sm text-muted-foreground">
                    {isFlightTrip ? t.savedDetail.flight : t.savedDetail.train} • {trip.transport.duration}
                  </div>
                  <div className="text-sm font-medium mt-1">€{Number(trip.transport.price).toLocaleString()}</div>
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent/20 text-accent-foreground rounded-lg shrink-0">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">{trip.hotel.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {"★".repeat(trip.hotel.stars)} • {trip.hotel.distanceFromCenter}km {t.savedDetail.fromCenter}
                  </div>
                  <div className="text-sm font-medium mt-1">
                    €{Number(trip.hotel.pricePerNight).toLocaleString()} / {t.savedDetail.night}
                  </div>
                </div>
              </div>

              <div className="h-px bg-border w-full" />

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{trip.durationDays} {t.savedDetail.nights}</span>
              </div>
            </div>

            <a
              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(savedTrip.destination)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-6"
            >
              <Button className="w-full" size="lg">{t.savedDetail.bookNow}</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
