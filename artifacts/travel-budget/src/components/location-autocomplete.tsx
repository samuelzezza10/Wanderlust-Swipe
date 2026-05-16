import { useState, useRef, useEffect } from "react";
import { Plane, TrainFront, X } from "lucide-react";

type LocationKind = "airport" | "station";

interface Location {
  name: string;
  kind: LocationKind;
  code?: string;
  city: string;
}

const LOCATIONS: Location[] = [
  // ── Aeroporti italiani ──────────────────────────────────────────────────
  { name: "Milano Malpensa", code: "MXP", city: "Milano", kind: "airport" },
  { name: "Milano Linate", code: "LIN", city: "Milano", kind: "airport" },
  { name: "Roma Fiumicino", code: "FCO", city: "Roma", kind: "airport" },
  { name: "Roma Ciampino", code: "CIA", city: "Roma", kind: "airport" },
  { name: "Venezia Marco Polo", code: "VCE", city: "Venezia", kind: "airport" },
  { name: "Napoli Capodichino", code: "NAP", city: "Napoli", kind: "airport" },
  { name: "Bergamo Orio al Serio", code: "BGY", city: "Bergamo", kind: "airport" },
  { name: "Torino Caselle", code: "TRN", city: "Torino", kind: "airport" },
  { name: "Bologna Marconi", code: "BLQ", city: "Bologna", kind: "airport" },
  { name: "Catania Fontanarossa", code: "CTA", city: "Catania", kind: "airport" },
  { name: "Palermo Falcone-Borsellino", code: "PMO", city: "Palermo", kind: "airport" },
  { name: "Bari Karol Wojtyla", code: "BRI", city: "Bari", kind: "airport" },
  { name: "Firenze Vespucci", code: "FLR", city: "Firenze", kind: "airport" },
  { name: "Pisa Galileo Galilei", code: "PSA", city: "Pisa", kind: "airport" },
  { name: "Verona Catullo", code: "VRN", city: "Verona", kind: "airport" },
  { name: "Genova Cristoforo Colombo", code: "GOA", city: "Genova", kind: "airport" },
  // ── Aeroporti europei ───────────────────────────────────────────────────
  { name: "Londra Heathrow", code: "LHR", city: "Londra", kind: "airport" },
  { name: "Londra Gatwick", code: "LGW", city: "Londra", kind: "airport" },
  { name: "Parigi Charles de Gaulle", code: "CDG", city: "Parigi", kind: "airport" },
  { name: "Barcellona El Prat", code: "BCN", city: "Barcellona", kind: "airport" },
  { name: "Amsterdam Schiphol", code: "AMS", city: "Amsterdam", kind: "airport" },
  { name: "Francoforte", code: "FRA", city: "Francoforte", kind: "airport" },
  { name: "Monaco di Baviera", code: "MUC", city: "Monaco", kind: "airport" },
  { name: "Madrid Barajas", code: "MAD", city: "Madrid", kind: "airport" },
  { name: "Zurigo", code: "ZRH", city: "Zurigo", kind: "airport" },
  { name: "Vienna", code: "VIE", city: "Vienna", kind: "airport" },
  { name: "Bruxelles", code: "BRU", city: "Bruxelles", kind: "airport" },
  { name: "Lisbona Humberto Delgado", code: "LIS", city: "Lisbona", kind: "airport" },
  { name: "Atene Eleftherios Venizelos", code: "ATH", city: "Atene", kind: "airport" },
  { name: "Istanbul Ataturk", code: "IST", city: "Istanbul", kind: "airport" },
  { name: "Dubai", code: "DXB", city: "Dubai", kind: "airport" },
  { name: "New York JFK", code: "JFK", city: "New York", kind: "airport" },
  // ── Stazioni italiane ───────────────────────────────────────────────────
  { name: "Milano Centrale", city: "Milano", kind: "station" },
  { name: "Milano Porta Garibaldi", city: "Milano", kind: "station" },
  { name: "Roma Termini", city: "Roma", kind: "station" },
  { name: "Roma Tiburtina", city: "Roma", kind: "station" },
  { name: "Firenze Santa Maria Novella", city: "Firenze", kind: "station" },
  { name: "Venezia Santa Lucia", city: "Venezia", kind: "station" },
  { name: "Napoli Centrale", city: "Napoli", kind: "station" },
  { name: "Torino Porta Nuova", city: "Torino", kind: "station" },
  { name: "Bologna Centrale", city: "Bologna", kind: "station" },
  { name: "Genova Piazza Principe", city: "Genova", kind: "station" },
  { name: "Verona Porta Nuova", city: "Verona", kind: "station" },
  { name: "Padova Centrale", city: "Padova", kind: "station" },
  { name: "Trieste Centrale", city: "Trieste", kind: "station" },
  { name: "Bari Centrale", city: "Bari", kind: "station" },
  { name: "Palermo Centrale", city: "Palermo", kind: "station" },
  { name: "Reggio Calabria Centrale", city: "Reggio Calabria", kind: "station" },
  // ── Stazioni europee ────────────────────────────────────────────────────
  { name: "Parigi Gare de Lyon", city: "Parigi", kind: "station" },
  { name: "Parigi Gare du Nord", city: "Parigi", kind: "station" },
  { name: "Londra St Pancras", city: "Londra", kind: "station" },
  { name: "Barcellona Sants", city: "Barcellona", kind: "station" },
  { name: "Madrid Atocha", city: "Madrid", kind: "station" },
  { name: "Zurigo Hauptbahnhof", city: "Zurigo", kind: "station" },
  { name: "Vienna Hauptbahnhof", city: "Vienna", kind: "station" },
  { name: "Berlino Hauptbahnhof", city: "Berlino", kind: "station" },
  { name: "Monaco di Baviera Hauptbahnhof", city: "Monaco", kind: "station" },
  { name: "Bruxelles Midi", city: "Bruxelles", kind: "station" },
];

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  filter,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  filter?: LocationKind;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const sources = filter ? LOCATIONS.filter((l) => l.kind === filter) : LOCATIONS;

  const matches =
    query.trim().length >= 1
      ? sources
          .filter(
            (l) =>
              l.name.toLowerCase().includes(query.toLowerCase()) ||
              l.city.toLowerCase().includes(query.toLowerCase()) ||
              (l.code && l.code.toLowerCase().includes(query.toLowerCase())),
          )
          .slice(0, 7)
      : sources.slice(0, 7);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const handleSelect = (loc: Location) => {
    const label = loc.code ? `${loc.name} (${loc.code})` : loc.name;
    setQuery(label);
    onChange(label);
    setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange("");
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 pr-9"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {open && matches.length > 0 && (
        <div className="absolute z-[200] w-full mt-1 bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
          {matches.map((loc, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(loc)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60 text-left border-b border-border/40 last:border-0"
            >
              {loc.kind === "airport" ? (
                <Plane className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <TrainFront className="w-4 h-4 text-[hsl(25,90%,55%)] shrink-0" />
              )}
              <div className="min-w-0">
                <span className="font-medium">{loc.name}</span>
                {loc.code && (
                  <span className="ml-1.5 text-xs text-muted-foreground font-mono">({loc.code})</span>
                )}
                <p className="text-xs text-muted-foreground">{loc.city}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
