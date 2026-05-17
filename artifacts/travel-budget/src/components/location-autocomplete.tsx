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
  { name: "Cagliari Elmas", code: "CAG", city: "Cagliari", kind: "airport" },
  { name: "Olbia Costa Smeralda", code: "OLB", city: "Olbia", kind: "airport" },
  { name: "Alghero Riviera del Corallo", code: "AHO", city: "Alghero/Sassari", kind: "airport" },
  { name: "Ancona Falconara", code: "AOI", city: "Ancona", kind: "airport" },
  { name: "Pescara", code: "PSR", city: "Pescara", kind: "airport" },
  { name: "Trieste", code: "TRS", city: "Trieste", kind: "airport" },
  { name: "Brindisi", code: "BDS", city: "Brindisi", kind: "airport" },
  { name: "Lamezia Terme", code: "SUF", city: "Lamezia Terme", kind: "airport" },
  { name: "Reggio Calabria", code: "REG", city: "Reggio Calabria", kind: "airport" },
  { name: "Trapani Birgi", code: "TPS", city: "Trapani", kind: "airport" },
  { name: "Rimini Federico Fellini", code: "RMI", city: "Rimini", kind: "airport" },
  { name: "Perugia Sant'Egidio", code: "PEG", city: "Perugia", kind: "airport" },
  { name: "Salerno Costa d'Amalfi", code: "QSR", city: "Salerno", kind: "airport" },
  { name: "Comiso", code: "CIY", city: "Ragusa/Comiso", kind: "airport" },
  { name: "Foggia", code: "FOG", city: "Foggia", kind: "airport" },
  { name: "Crotone", code: "CRV", city: "Crotone", kind: "airport" },
  // ── Aeroporti europei ───────────────────────────────────────────────────
  { name: "Londra Heathrow", code: "LHR", city: "Londra", kind: "airport" },
  { name: "Londra Gatwick", code: "LGW", city: "Londra", kind: "airport" },
  { name: "Londra Stansted", code: "STN", city: "Londra", kind: "airport" },
  { name: "Parigi Charles de Gaulle", code: "CDG", city: "Parigi", kind: "airport" },
  { name: "Parigi Orly", code: "ORY", city: "Parigi", kind: "airport" },
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
  { name: "Istanbul", code: "IST", city: "Istanbul", kind: "airport" },
  { name: "Dubai", code: "DXB", city: "Dubai", kind: "airport" },
  { name: "New York JFK", code: "JFK", city: "New York", kind: "airport" },
  { name: "Stoccolma Arlanda", code: "ARN", city: "Stoccolma", kind: "airport" },
  { name: "Copenhagen", code: "CPH", city: "Copenaghen", kind: "airport" },
  { name: "Oslo Gardermoen", code: "OSL", city: "Oslo", kind: "airport" },
  { name: "Helsinki", code: "HEL", city: "Helsinki", kind: "airport" },
  { name: "Berlino Brandenburg", code: "BER", city: "Berlino", kind: "airport" },
  { name: "Amburgo", code: "HAM", city: "Amburgo", kind: "airport" },
  { name: "Düsseldorf", code: "DUS", city: "Düsseldorf", kind: "airport" },
  { name: "Stoccarda", code: "STR", city: "Stoccarda", kind: "airport" },
  { name: "Colonia/Bonn", code: "CGN", city: "Colonia", kind: "airport" },
  { name: "Hannover", code: "HAJ", city: "Hannover", kind: "airport" },
  { name: "Norimberga", code: "NUE", city: "Norimberga", kind: "airport" },
  { name: "Porto Francisco Sá Carneiro", code: "OPO", city: "Porto", kind: "airport" },
  { name: "Valencia Manises", code: "VLC", city: "Valencia", kind: "airport" },
  { name: "Siviglia", code: "SVQ", city: "Siviglia", kind: "airport" },
  { name: "Malaga", code: "AGP", city: "Malaga", kind: "airport" },
  { name: "Lione Saint-Exupéry", code: "LYS", city: "Lione", kind: "airport" },
  { name: "Marsiglia Provence", code: "MRS", city: "Marsiglia", kind: "airport" },
  { name: "Nizza Côte d'Azur", code: "NCE", city: "Nizza", kind: "airport" },
  { name: "Zagabria", code: "ZAG", city: "Zagabria", kind: "airport" },
  { name: "Belgrado Nikola Tesla", code: "BEG", city: "Belgrado", kind: "airport" },
  { name: "Sofia", code: "SOF", city: "Sofia", kind: "airport" },
  { name: "Varsavia Chopin", code: "WAW", city: "Varsavia", kind: "airport" },
  { name: "Praga Václav Havel", code: "PRG", city: "Praga", kind: "airport" },
  { name: "Budapest", code: "BUD", city: "Budapest", kind: "airport" },
  { name: "Bucarest Henri Coandă", code: "OTP", city: "Bucarest", kind: "airport" },

  // ── Stazioni intercity italiane ─────────────────────────────────────────
  { name: "Milano Centrale", city: "Milano", kind: "station" },
  { name: "Milano Porta Garibaldi", city: "Milano", kind: "station" },
  { name: "Milano Cadorna", city: "Milano", kind: "station" },
  { name: "Roma Termini", city: "Roma", kind: "station" },
  { name: "Roma Tiburtina", city: "Roma", kind: "station" },
  { name: "Roma Ostiense", city: "Roma", kind: "station" },
  { name: "Firenze Santa Maria Novella", city: "Firenze", kind: "station" },
  { name: "Firenze Campo di Marte", city: "Firenze", kind: "station" },
  { name: "Venezia Santa Lucia", city: "Venezia", kind: "station" },
  { name: "Venezia Mestre", city: "Venezia/Mestre", kind: "station" },
  { name: "Napoli Centrale", city: "Napoli", kind: "station" },
  { name: "Napoli Mergellina", city: "Napoli", kind: "station" },
  { name: "Torino Porta Nuova", city: "Torino", kind: "station" },
  { name: "Torino Porta Susa", city: "Torino", kind: "station" },
  { name: "Bologna Centrale", city: "Bologna", kind: "station" },
  { name: "Genova Piazza Principe", city: "Genova", kind: "station" },
  { name: "Genova Brignole", city: "Genova", kind: "station" },
  { name: "Verona Porta Nuova", city: "Verona", kind: "station" },
  { name: "Padova Centrale", city: "Padova", kind: "station" },
  { name: "Trieste Centrale", city: "Trieste", kind: "station" },
  { name: "Bari Centrale", city: "Bari", kind: "station" },
  { name: "Palermo Centrale", city: "Palermo", kind: "station" },

  // ── Stazioni regionali italiane (Nord) ─────────────────────────────────
  { name: "Como San Giovanni", city: "Como", kind: "station" },
  { name: "Varese", city: "Varese", kind: "station" },
  { name: "Lecco", city: "Lecco", kind: "station" },
  { name: "Monza", city: "Monza", kind: "station" },
  { name: "Brescia", city: "Brescia", kind: "station" },
  { name: "Bergamo", city: "Bergamo", kind: "station" },
  { name: "Pavia", city: "Pavia", kind: "station" },
  { name: "Piacenza", city: "Piacenza", kind: "station" },
  { name: "Cremona", city: "Cremona", kind: "station" },
  { name: "Mantova", city: "Mantova", kind: "station" },
  { name: "Vicenza", city: "Vicenza", kind: "station" },
  { name: "Treviso Centrale", city: "Treviso", kind: "station" },
  { name: "Udine", city: "Udine", kind: "station" },
  { name: "Gorizia Centrale", city: "Gorizia", kind: "station" },
  { name: "Pordenone", city: "Pordenone", kind: "station" },
  { name: "Belluno", city: "Belluno", kind: "station" },
  { name: "Trento", city: "Trento", kind: "station" },
  { name: "Bolzano", city: "Bolzano", kind: "station" },
  { name: "Merano", city: "Merano", kind: "station" },
  { name: "Reggio Emilia AV", city: "Reggio Emilia", kind: "station" },
  { name: "Modena", city: "Modena", kind: "station" },
  { name: "Parma", city: "Parma", kind: "station" },
  { name: "Ferrara", city: "Ferrara", kind: "station" },
  { name: "Rimini", city: "Rimini", kind: "station" },
  { name: "Ravenna", city: "Ravenna", kind: "station" },
  { name: "Forlì", city: "Forlì", kind: "station" },
  { name: "Cesena", city: "Cesena", kind: "station" },
  { name: "Savona", city: "Savona", kind: "station" },
  { name: "La Spezia Centrale", city: "La Spezia", kind: "station" },
  { name: "Novara", city: "Novara", kind: "station" },
  { name: "Alessandria", city: "Alessandria", kind: "station" },
  { name: "Asti", city: "Asti", kind: "station" },
  { name: "Cuneo", city: "Cuneo", kind: "station" },
  { name: "Aosta", city: "Aosta", kind: "station" },

  // ── Stazioni regionali italiane (Centro) ───────────────────────────────
  { name: "Livorno Centrale", city: "Livorno", kind: "station" },
  { name: "Prato Centrale", city: "Prato", kind: "station" },
  { name: "Pistoia", city: "Pistoia", kind: "station" },
  { name: "Lucca", city: "Lucca", kind: "station" },
  { name: "Arezzo", city: "Arezzo", kind: "station" },
  { name: "Siena", city: "Siena", kind: "station" },
  { name: "Grosseto", city: "Grosseto", kind: "station" },
  { name: "Perugia Fontivegge", city: "Perugia", kind: "station" },
  { name: "Ancona", city: "Ancona", kind: "station" },
  { name: "Pescara Centrale", city: "Pescara", kind: "station" },
  { name: "Chieti", city: "Chieti", kind: "station" },
  { name: "L'Aquila", city: "L'Aquila", kind: "station" },
  { name: "Terni", city: "Terni", kind: "station" },
  { name: "Viterbo", city: "Viterbo", kind: "station" },
  { name: "Frosinone", city: "Frosinone", kind: "station" },
  { name: "Latina", city: "Latina", kind: "station" },

  // ── Stazioni regionali italiane (Sud e Isole) ──────────────────────────
  { name: "Foggia", city: "Foggia", kind: "station" },
  { name: "Taranto", city: "Taranto", kind: "station" },
  { name: "Lecce", city: "Lecce", kind: "station" },
  { name: "Brindisi", city: "Brindisi", kind: "station" },
  { name: "Potenza Centrale", city: "Potenza", kind: "station" },
  { name: "Matera", city: "Matera", kind: "station" },
  { name: "Reggio Calabria Centrale", city: "Reggio Calabria", kind: "station" },
  { name: "Cosenza", city: "Cosenza", kind: "station" },
  { name: "Catanzaro Lido", city: "Catanzaro", kind: "station" },
  { name: "Messina Centrale", city: "Messina", kind: "station" },
  { name: "Catania Centrale", city: "Catania", kind: "station" },
  { name: "Siracusa", city: "Siracusa", kind: "station" },
  { name: "Agrigento Centrale", city: "Agrigento", kind: "station" },
  { name: "Trapani", city: "Trapani", kind: "station" },
  { name: "Cagliari", city: "Cagliari", kind: "station" },
  { name: "Sassari", city: "Sassari", kind: "station" },
  { name: "Olbia", city: "Olbia", kind: "station" },
  { name: "Oristano", city: "Oristano", kind: "station" },
  { name: "Nuoro", city: "Nuoro", kind: "station" },
  { name: "Salerno", city: "Salerno", kind: "station" },
  { name: "Benevento", city: "Benevento", kind: "station" },
  { name: "Caserta", city: "Caserta", kind: "station" },
  { name: "Avellino", city: "Avellino", kind: "station" },
  { name: "Campobasso", city: "Campobasso", kind: "station" },

  // ── Stazioni europee ────────────────────────────────────────────────────
  { name: "Parigi Gare de Lyon", city: "Parigi", kind: "station" },
  { name: "Parigi Gare du Nord", city: "Parigi", kind: "station" },
  { name: "Parigi Gare de l'Est", city: "Parigi", kind: "station" },
  { name: "Lione Part-Dieu", city: "Lione", kind: "station" },
  { name: "Marsiglia Saint-Charles", city: "Marsiglia", kind: "station" },
  { name: "Nizza Ville", city: "Nizza", kind: "station" },
  { name: "Londra St Pancras", city: "Londra", kind: "station" },
  { name: "Barcellona Sants", city: "Barcellona", kind: "station" },
  { name: "Madrid Atocha", city: "Madrid", kind: "station" },
  { name: "Zurigo Hauptbahnhof", city: "Zurigo", kind: "station" },
  { name: "Ginevra Cornavin", city: "Ginevra", kind: "station" },
  { name: "Berna", city: "Berna", kind: "station" },
  { name: "Basilea SBB", city: "Basilea", kind: "station" },
  { name: "Vienna Hauptbahnhof", city: "Vienna", kind: "station" },
  { name: "Vienna Westbahnhof", city: "Vienna", kind: "station" },
  { name: "Innsbruck Hauptbahnhof", city: "Innsbruck", kind: "station" },
  { name: "Salisburgo Hauptbahnhof", city: "Salisburgo", kind: "station" },
  { name: "Berlino Hauptbahnhof", city: "Berlino", kind: "station" },
  { name: "Monaco di Baviera Hauptbahnhof", city: "Monaco", kind: "station" },
  { name: "Francoforte Hauptbahnhof", city: "Francoforte", kind: "station" },
  { name: "Amburgo Hauptbahnhof", city: "Amburgo", kind: "station" },
  { name: "Colonia Hauptbahnhof", city: "Colonia", kind: "station" },
  { name: "Stoccarda Hauptbahnhof", city: "Stoccarda", kind: "station" },
  { name: "Bruxelles Midi", city: "Bruxelles", kind: "station" },
  { name: "Amsterdam Centraal", city: "Amsterdam", kind: "station" },
  { name: "Rotterdam Centraal", city: "Rotterdam", kind: "station" },
  { name: "Utrecht Centraal", city: "Utrecht", kind: "station" },
  { name: "Lisbona Santa Apolónia", city: "Lisbona", kind: "station" },
  { name: "Porto São Bento", city: "Porto", kind: "station" },
  { name: "Praga Hlavní nádraží", city: "Praga", kind: "station" },
  { name: "Budapest Keleti", city: "Budapest", kind: "station" },
  { name: "Varsavia Centralna", city: "Varsavia", kind: "station" },
  { name: "Ljubljana", city: "Lubiana", kind: "station" },
  { name: "Zagabria Glavni kolodvor", city: "Zagabria", kind: "station" },
  { name: "Belgrado Centrala", city: "Belgrado", kind: "station" },
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
          .slice(0, 8)
      : sources.slice(0, 8);

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
          <button type="button" onClick={handleClear} className="absolute right-3 text-muted-foreground hover:text-foreground">
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
                {loc.code && <span className="ml-1.5 text-xs text-muted-foreground font-mono">({loc.code})</span>}
                <p className="text-xs text-muted-foreground">{loc.city}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
