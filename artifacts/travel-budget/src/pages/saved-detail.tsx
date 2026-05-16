import { useGetSavedTrip, useDeleteSavedTrip, getGetSavedTripsQueryKey } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Calendar, MapPin, Share, Trash2, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SavedDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  
  const { data: savedTrip, isLoading } = useGetSavedTrip(id, {
    query: { enabled: !!id, queryKey: ["saved-trip", id] }
  });
  
  const deleteTrip = useDeleteSavedTrip();

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading trip details...</div>;
  if (!savedTrip) return <div className="p-8 text-center text-muted-foreground">Trip not found</div>;

  const trip = savedTrip.tripData;

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this trip?")) {
      deleteTrip.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSavedTripsQueryKey() });
          setLocation("/saved");
        }
      });
    }
  };

  const handleShare = () => {
    // Simple copy to clipboard for now
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="flex flex-col bg-background min-h-[100dvh]">
      <div className="relative h-64 md:h-96 shrink-0">
        <img
          src={`${basePath}${savedTrip.imageUrl.startsWith('/') ? '' : '/'}${savedTrip.imageUrl}`}
          alt={savedTrip.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button variant="outline" size="icon" className="bg-background/20 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black" onClick={() => setLocation("/saved")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-background/20 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black" onClick={handleShare}>
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="bg-danger/80 backdrop-blur-md border-danger text-white hover:bg-danger" onClick={handleDelete} disabled={deleteTrip.isPending}>
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 text-white">
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
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{trip.description}</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Highlights</h2>
            <ul className="space-y-3">
              {trip.highlights?.map((h, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-primary mb-1">${savedTrip.totalPrice}</div>
            <div className="text-sm text-muted-foreground mb-6">Total estimated cost</div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">{trip.transport.company}</div>
                  <div className="text-sm text-muted-foreground">Flight • {trip.transport.duration}</div>
                  <div className="text-sm font-medium mt-1">${trip.transport.price}</div>
                </div>
              </div>
              
              <div className="h-px bg-border w-full" />
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent/20 text-accent-foreground rounded-lg shrink-0">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">{trip.hotel.name}</div>
                  <div className="text-sm text-muted-foreground">{trip.hotel.stars} stars • {trip.hotel.distanceFromCenter}km from center</div>
                  <div className="text-sm font-medium mt-1">${trip.hotel.pricePerNight} / night</div>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-8" size="lg">Book Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
