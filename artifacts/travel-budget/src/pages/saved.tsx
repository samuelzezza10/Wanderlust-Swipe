import { useGetSavedTrips } from "@workspace/api-client-react";
import { Link, Redirect } from "wouter";
import { Card } from "@/components/ui/card";
import { Plane, Hotel, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Saved() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data: savedTrips, isLoading } = useGetSavedTrips({ query: { enabled: !!isSignedIn, queryKey: ["saved-trips"] } });
  const { t } = useI18n();

  if (!isLoaded) return <div className="p-8 text-center text-muted-foreground">{t.saved.loading}</div>;
  if (!isSignedIn) return <Redirect to="/sign-in" />;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">{t.saved.loading}</div>;
  }

  if (!savedTrips?.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Plane className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t.saved.empty}</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">{t.saved.emptySub}</p>
        <Link href="/discover" className="text-primary font-medium hover:underline">
          {t.saved.goToDiscover}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">{t.saved.title}</h1>

      <div className="grid gap-6">
        {savedTrips.map((saved) => (
          <Link key={saved.id} href={`/saved/${saved.id}`}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-border group">
              <div className="flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-48 h-48 sm:h-auto relative shrink-0">
                  <img
                    src={`${basePath}${saved.imageUrl.startsWith("/") ? "" : "/"}${saved.imageUrl}`}
                    alt={saved.destination}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{saved.destination}</h3>
                      <p className="text-muted-foreground text-sm">{saved.tripData.country}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">€{saved.totalPrice.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{t.saved.total}</div>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{saved.tripData.durationDays} {t.saved.days}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4" />
                      <span className="truncate">{saved.tripData.transport.company}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Hotel className="w-4 h-4" />
                      <span className="truncate">{saved.tripData.hotel.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
