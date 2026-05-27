import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
  { name: "Brescia Montichiari", code: "VBS", city: "Brescia", kind: "airport" },
  { name: "Parma Giuseppe Verdi", code: "PMF", city: "Parma", kind: "airport" },
  { name: "Forlì Luigi Ridolfi", code: "FRL", city: "Forlì", kind: "airport" },
  { name: "Bolzano", code: "BZO", city: "Bolzano", kind: "airport" },
  // Città > 50k senza aeroporto diretto — indicano il più vicino
  { name: "Padova (aeroporto Venezia)", code: "VCE", city: "Padova", kind: "airport" },
  { name: "Modena (aeroporto Bologna)", code: "BLQ", city: "Modena", kind: "airport" },
  { name: "Prato (aeroporto Firenze)", code: "FLR", city: "Prato", kind: "airport" },
  { name: "Reggio Emilia (aeroporto Bologna)", code: "BLQ", city: "Reggio Emilia", kind: "airport" },
  { name: "Messina (aeroporto Catania)", code: "CTA", city: "Messina", kind: "airport" },
  { name: "Taranto (aeroporto Bari)", code: "BRI", city: "Taranto", kind: "airport" },
  { name: "Ravenna (aeroporto Bologna)", code: "BLQ", city: "Ravenna", kind: "airport" },
  { name: "Ferrara (aeroporto Bologna)", code: "BLQ", city: "Ferrara", kind: "airport" },
  { name: "Sassari (aeroporto Alghero)", code: "AHO", city: "Sassari", kind: "airport" },
  { name: "Siracusa (aeroporto Catania)", code: "CTA", city: "Siracusa", kind: "airport" },
  { name: "Monza (aeroporto Milano)", code: "MXP", city: "Monza", kind: "airport" },
  { name: "Vicenza (aeroporto Venezia)", code: "VCE", city: "Vicenza", kind: "airport" },
  { name: "Trento (aeroporto Verona)", code: "VRN", city: "Trento", kind: "airport" },
  { name: "Novara (aeroporto Milano)", code: "MXP", city: "Novara", kind: "airport" },
  { name: "Piacenza (aeroporto Bologna)", code: "BLQ", city: "Piacenza", kind: "airport" },
  { name: "Livorno (aeroporto Pisa)", code: "PSA", city: "Livorno", kind: "airport" },
  { name: "Udine (aeroporto Trieste)", code: "TRS", city: "Udine", kind: "airport" },
  { name: "Terni (aeroporto Perugia)", code: "PEG", city: "Terni", kind: "airport" },
  { name: "La Spezia (aeroporto Genova)", code: "GOA", city: "La Spezia", kind: "airport" },
  { name: "Lecce (aeroporto Brindisi)", code: "BDS", city: "Lecce", kind: "airport" },
  { name: "Catanzaro (aeroporto Lamezia)", code: "SUF", city: "Catanzaro", kind: "airport" },
  { name: "Como (aeroporto Milano)", code: "MXP", city: "Como", kind: "airport" },
  { name: "Pesaro (aeroporto Ancona)", code: "AOI", city: "Pesaro", kind: "airport" },
  { name: "Arezzo (aeroporto Firenze)", code: "FLR", city: "Arezzo", kind: "airport" },
  { name: "Pistoia (aeroporto Firenze)", code: "FLR", city: "Pistoia", kind: "airport" },
  { name: "Cosenza (aeroporto Lamezia)", code: "SUF", city: "Cosenza", kind: "airport" },
  { name: "Caserta (aeroporto Napoli)", code: "NAP", city: "Caserta", kind: "airport" },
  { name: "L'Aquila (aeroporto Pescara)", code: "PSR", city: "L'Aquila", kind: "airport" },
  { name: "Andria (aeroporto Bari)", code: "BRI", city: "Andria", kind: "airport" },
  { name: "Barletta (aeroporto Bari)", code: "BRI", city: "Barletta", kind: "airport" },
  { name: "Giugliano (aeroporto Napoli)", code: "NAP", city: "Giugliano", kind: "airport" },
  { name: "Alessandria (aeroporto Torino)", code: "TRN", city: "Alessandria", kind: "airport" },
  { name: "Vicenza (aeroporto Verona)", code: "VRN", city: "Vicenza", kind: "airport" },
  { name: "Bergamo città (aeroporto Orio)", code: "BGY", city: "Bergamo", kind: "airport" },
  // ── Città italiane 20k+ ab. senza aeroporto proprio — aeroporto più vicino ─
  { name: "Mantova (aeroporto Verona)", code: "VRN", city: "Mantova", kind: "airport" },
  { name: "Cremona (aeroporto Brescia)", code: "VBS", city: "Cremona", kind: "airport" },
  { name: "Varese (aeroporto Malpensa)", code: "MXP", city: "Varese", kind: "airport" },
  { name: "Busto Arsizio (aeroporto Malpensa)", code: "MXP", city: "Busto Arsizio", kind: "airport" },
  { name: "Gallarate (aeroporto Malpensa)", code: "MXP", city: "Gallarate", kind: "airport" },
  { name: "Saronno (aeroporto Malpensa)", code: "MXP", city: "Saronno", kind: "airport" },
  { name: "Legnano (aeroporto Malpensa)", code: "MXP", city: "Legnano", kind: "airport" },
  { name: "Rho (aeroporto Malpensa)", code: "MXP", city: "Rho", kind: "airport" },
  { name: "Sesto San Giovanni (aeroporto Linate)", code: "LIN", city: "Sesto San Giovanni", kind: "airport" },
  { name: "Cinisello Balsamo (aeroporto Linate)", code: "LIN", city: "Cinisello Balsamo", kind: "airport" },
  { name: "Cologno Monzese (aeroporto Linate)", code: "LIN", city: "Cologno Monzese", kind: "airport" },
  { name: "Pavia (aeroporto Malpensa)", code: "MXP", city: "Pavia", kind: "airport" },
  { name: "Lodi (aeroporto Linate)", code: "LIN", city: "Lodi", kind: "airport" },
  { name: "Lecco (aeroporto Bergamo)", code: "BGY", city: "Lecco", kind: "airport" },
  { name: "Vigevano (aeroporto Torino)", code: "TRN", city: "Vigevano", kind: "airport" },
  { name: "Asti (aeroporto Torino)", code: "TRN", city: "Asti", kind: "airport" },
  { name: "Cuneo (aeroporto Torino)", code: "TRN", city: "Cuneo", kind: "airport" },
  { name: "Biella (aeroporto Torino)", code: "TRN", city: "Biella", kind: "airport" },
  { name: "Vercelli (aeroporto Torino)", code: "TRN", city: "Vercelli", kind: "airport" },
  { name: "Verbania (aeroporto Malpensa)", code: "MXP", city: "Verbania", kind: "airport" },
  { name: "Aosta (aeroporto Torino)", code: "TRN", city: "Aosta", kind: "airport" },
  { name: "Casale Monferrato (aeroporto Torino)", code: "TRN", city: "Casale Monferrato", kind: "airport" },
  { name: "Savona (aeroporto Genova)", code: "GOA", city: "Savona", kind: "airport" },
  { name: "Imperia (aeroporto Genova)", code: "GOA", city: "Imperia", kind: "airport" },
  { name: "Sanremo (aeroporto Genova)", code: "GOA", city: "Sanremo", kind: "airport" },
  { name: "Treviso Sant'Angelo", code: "TSF", city: "Treviso", kind: "airport" },
  { name: "Mestre (aeroporto Venezia)", code: "VCE", city: "Mestre", kind: "airport" },
  { name: "Chioggia (aeroporto Venezia)", code: "VCE", city: "Chioggia", kind: "airport" },
  { name: "Bassano del Grappa (aeroporto Venezia)", code: "VCE", city: "Bassano del Grappa", kind: "airport" },
  { name: "Rovigo (aeroporto Venezia)", code: "VCE", city: "Rovigo", kind: "airport" },
  { name: "Belluno (aeroporto Venezia)", code: "VCE", city: "Belluno", kind: "airport" },
  { name: "Pordenone (aeroporto Venezia)", code: "VCE", city: "Pordenone", kind: "airport" },
  { name: "Gorizia (aeroporto Trieste)", code: "TRS", city: "Gorizia", kind: "airport" },
  { name: "Rovereto (aeroporto Verona)", code: "VRN", city: "Rovereto", kind: "airport" },
  { name: "Merano (aeroporto Bolzano)", code: "BZO", city: "Merano", kind: "airport" },
  { name: "Latina (aeroporto Roma Fiumicino)", code: "FCO", city: "Latina", kind: "airport" },
  { name: "Frosinone (aeroporto Roma Fiumicino)", code: "FCO", city: "Frosinone", kind: "airport" },
  { name: "Viterbo (aeroporto Roma Fiumicino)", code: "FCO", city: "Viterbo", kind: "airport" },
  { name: "Rieti (aeroporto Roma Fiumicino)", code: "FCO", city: "Rieti", kind: "airport" },
  { name: "Civitavecchia (aeroporto Roma Fiumicino)", code: "FCO", city: "Civitavecchia", kind: "airport" },
  { name: "Guidonia Montecelio (aeroporto Roma Fiumicino)", code: "FCO", city: "Guidonia", kind: "airport" },
  { name: "Tivoli (aeroporto Roma Fiumicino)", code: "FCO", city: "Tivoli", kind: "airport" },
  { name: "Pomezia (aeroporto Roma Ciampino)", code: "CIA", city: "Pomezia", kind: "airport" },
  { name: "Aprilia (aeroporto Roma Ciampino)", code: "CIA", city: "Aprilia", kind: "airport" },
  { name: "Velletri (aeroporto Roma Ciampino)", code: "CIA", city: "Velletri", kind: "airport" },
  { name: "Grosseto", code: "GRS", city: "Grosseto", kind: "airport" },
  { name: "Siena (aeroporto Firenze)", code: "FLR", city: "Siena", kind: "airport" },
  { name: "Massa (aeroporto Pisa)", code: "PSA", city: "Massa", kind: "airport" },
  { name: "Carrara (aeroporto Pisa)", code: "PSA", city: "Carrara", kind: "airport" },
  { name: "Lucca (aeroporto Pisa)", code: "PSA", city: "Lucca", kind: "airport" },
  { name: "Empoli (aeroporto Firenze)", code: "FLR", city: "Empoli", kind: "airport" },
  { name: "Foligno (aeroporto Perugia)", code: "PEG", city: "Foligno", kind: "airport" },
  { name: "Spoleto (aeroporto Perugia)", code: "PEG", city: "Spoleto", kind: "airport" },
  { name: "Ascoli Piceno (aeroporto Pescara)", code: "PSR", city: "Ascoli Piceno", kind: "airport" },
  { name: "Macerata (aeroporto Ancona)", code: "AOI", city: "Macerata", kind: "airport" },
  { name: "Fermo (aeroporto Ancona)", code: "AOI", city: "Fermo", kind: "airport" },
  { name: "Senigallia (aeroporto Ancona)", code: "AOI", city: "Senigallia", kind: "airport" },
  { name: "Chieti (aeroporto Pescara)", code: "PSR", city: "Chieti", kind: "airport" },
  { name: "Teramo (aeroporto Pescara)", code: "PSR", city: "Teramo", kind: "airport" },
  { name: "Lanciano (aeroporto Pescara)", code: "PSR", city: "Lanciano", kind: "airport" },
  { name: "Matera (aeroporto Bari)", code: "BRI", city: "Matera", kind: "airport" },
  { name: "Potenza (aeroporto Napoli)", code: "NAP", city: "Potenza", kind: "airport" },
  { name: "Battipaglia (aeroporto Napoli)", code: "NAP", city: "Battipaglia", kind: "airport" },
  { name: "Torre del Greco (aeroporto Napoli)", code: "NAP", city: "Torre del Greco", kind: "airport" },
  { name: "Pozzuoli (aeroporto Napoli)", code: "NAP", city: "Pozzuoli", kind: "airport" },
  { name: "Agrigento (aeroporto Comiso)", code: "CIY", city: "Agrigento", kind: "airport" },
  { name: "Caltanissetta (aeroporto Palermo)", code: "PMO", city: "Caltanissetta", kind: "airport" },
  { name: "Enna (aeroporto Catania)", code: "CTA", city: "Enna", kind: "airport" },
  { name: "Marsala (aeroporto Palermo)", code: "PMO", city: "Marsala", kind: "airport" },
  { name: "Mazara del Vallo (aeroporto Palermo)", code: "PMO", city: "Mazara del Vallo", kind: "airport" },
  { name: "Vittoria (aeroporto Comiso)", code: "CIY", city: "Vittoria", kind: "airport" },
  { name: "Gela (aeroporto Comiso)", code: "CIY", city: "Gela", kind: "airport" },
  { name: "Nuoro (aeroporto Olbia)", code: "OLB", city: "Nuoro", kind: "airport" },
  { name: "Oristano (aeroporto Cagliari)", code: "CAG", city: "Oristano", kind: "airport" },
  { name: "Iglesias (aeroporto Cagliari)", code: "CAG", city: "Iglesias", kind: "airport" },
  { name: "Quartu Sant'Elena (aeroporto Cagliari)", code: "CAG", city: "Quartu Sant'Elena", kind: "airport" },
  // ── Aeroporti europei — Regno Unito e Irlanda ───────────────────────────
  { name: "Londra Heathrow", code: "LHR", city: "Londra", kind: "airport" },
  { name: "Londra Gatwick", code: "LGW", city: "Londra", kind: "airport" },
  { name: "Londra Stansted", code: "STN", city: "Londra", kind: "airport" },
  { name: "Londra Luton", code: "LTN", city: "Londra", kind: "airport" },
  { name: "Londra London City", code: "LCY", city: "Londra", kind: "airport" },
  { name: "Manchester", code: "MAN", city: "Manchester", kind: "airport" },
  { name: "Birmingham", code: "BHX", city: "Birmingham", kind: "airport" },
  { name: "Edimburgo", code: "EDI", city: "Edimburgo", kind: "airport" },
  { name: "Glasgow", code: "GLA", city: "Glasgow", kind: "airport" },
  { name: "Bristol", code: "BRS", city: "Bristol", kind: "airport" },
  { name: "Leeds Bradford", code: "LBA", city: "Leeds", kind: "airport" },
  { name: "Newcastle", code: "NCL", city: "Newcastle", kind: "airport" },
  { name: "Liverpool John Lennon", code: "LPL", city: "Liverpool", kind: "airport" },
  { name: "Dublino", code: "DUB", city: "Dublino", kind: "airport" },
  { name: "Cork", code: "ORK", city: "Cork", kind: "airport" },

  // ── Aeroporti europei — Francia ─────────────────────────────────────────
  { name: "Parigi Charles de Gaulle", code: "CDG", city: "Parigi", kind: "airport" },
  { name: "Parigi Orly", code: "ORY", city: "Parigi", kind: "airport" },
  { name: "Lione Saint-Exupéry", code: "LYS", city: "Lione", kind: "airport" },
  { name: "Marsiglia Provence", code: "MRS", city: "Marsiglia", kind: "airport" },
  { name: "Nizza Côte d'Azur", code: "NCE", city: "Nizza", kind: "airport" },
  { name: "Toulouse Blagnac", code: "TLS", city: "Tolosa", kind: "airport" },
  { name: "Bordeaux Mérignac", code: "BOD", city: "Bordeaux", kind: "airport" },
  { name: "Nantes Atlantique", code: "NTE", city: "Nantes", kind: "airport" },
  { name: "Strasbourg", code: "SXB", city: "Strasburgo", kind: "airport" },
  { name: "Montpellier", code: "MPL", city: "Montpellier", kind: "airport" },
  { name: "Lille Lesquin", code: "LIL", city: "Lille", kind: "airport" },
  { name: "Rennes Saint-Jacques", code: "RNS", city: "Rennes", kind: "airport" },

  // ── Aeroporti europei — Spagna e Portogallo ─────────────────────────────
  { name: "Madrid Barajas", code: "MAD", city: "Madrid", kind: "airport" },
  { name: "Barcellona El Prat", code: "BCN", city: "Barcellona", kind: "airport" },
  { name: "Valencia Manises", code: "VLC", city: "Valencia", kind: "airport" },
  { name: "Siviglia", code: "SVQ", city: "Siviglia", kind: "airport" },
  { name: "Malaga", code: "AGP", city: "Malaga", kind: "airport" },
  { name: "Bilbao", code: "BIO", city: "Bilbao", kind: "airport" },
  { name: "Zaragoza", code: "ZAZ", city: "Saragozza", kind: "airport" },
  { name: "Alicante", code: "ALC", city: "Alicante", kind: "airport" },
  { name: "Palma de Mallorca", code: "PMI", city: "Palma di Maiorca", kind: "airport" },
  { name: "Ibiza", code: "IBZ", city: "Ibiza", kind: "airport" },
  { name: "Las Palmas Gran Canaria", code: "LPA", city: "Las Palmas", kind: "airport" },
  { name: "Tenerife Sur", code: "TFS", city: "Tenerife", kind: "airport" },
  { name: "Tenerife Norte", code: "TFN", city: "Tenerife", kind: "airport" },
  { name: "Fuerteventura", code: "FUE", city: "Fuerteventura", kind: "airport" },
  { name: "Lanzarote", code: "ACE", city: "Lanzarote", kind: "airport" },
  { name: "Lisbona Humberto Delgado", code: "LIS", city: "Lisbona", kind: "airport" },
  { name: "Porto Francisco Sá Carneiro", code: "OPO", city: "Porto", kind: "airport" },
  { name: "Faro", code: "FAO", city: "Faro/Algarve", kind: "airport" },

  // ── Aeroporti europei — Germania e Austria ──────────────────────────────
  { name: "Francoforte", code: "FRA", city: "Francoforte", kind: "airport" },
  { name: "Monaco di Baviera", code: "MUC", city: "Monaco", kind: "airport" },
  { name: "Berlino Brandenburg", code: "BER", city: "Berlino", kind: "airport" },
  { name: "Amburgo", code: "HAM", city: "Amburgo", kind: "airport" },
  { name: "Düsseldorf", code: "DUS", city: "Düsseldorf", kind: "airport" },
  { name: "Stoccarda", code: "STR", city: "Stoccarda", kind: "airport" },
  { name: "Colonia/Bonn", code: "CGN", city: "Colonia", kind: "airport" },
  { name: "Hannover", code: "HAJ", city: "Hannover", kind: "airport" },
  { name: "Norimberga", code: "NUE", city: "Norimberga", kind: "airport" },
  { name: "Brema", code: "BRE", city: "Brema", kind: "airport" },
  { name: "Dresda", code: "DRS", city: "Dresda", kind: "airport" },
  { name: "Lipsia/Halle", code: "LEJ", city: "Lipsia", kind: "airport" },
  { name: "Dortmund", code: "DTM", city: "Dortmund", kind: "airport" },
  { name: "Vienna", code: "VIE", city: "Vienna", kind: "airport" },
  { name: "Salisburgo", code: "SZG", city: "Salisburgo", kind: "airport" },
  { name: "Innsbruck", code: "INN", city: "Innsbruck", kind: "airport" },
  { name: "Linz", code: "LNZ", city: "Linz", kind: "airport" },
  { name: "Graz", code: "GRZ", city: "Graz", kind: "airport" },
  { name: "Klagenfurt", code: "KLU", city: "Klagenfurt", kind: "airport" },

  // ── Aeroporti europei — Svizzera e Benelux ──────────────────────────────
  { name: "Zurigo", code: "ZRH", city: "Zurigo", kind: "airport" },
  { name: "Ginevra Cointrin", code: "GVA", city: "Ginevra", kind: "airport" },
  { name: "Basilea EuroAirport", code: "BSL", city: "Basilea", kind: "airport" },
  { name: "Berna Belp", code: "BRN", city: "Berna", kind: "airport" },
  { name: "Bruxelles", code: "BRU", city: "Bruxelles", kind: "airport" },
  { name: "Bruxelles Charleroi", code: "CRL", city: "Bruxelles/Charleroi", kind: "airport" },
  { name: "Liegi", code: "LGG", city: "Liegi", kind: "airport" },
  { name: "Amsterdam Schiphol", code: "AMS", city: "Amsterdam", kind: "airport" },
  { name: "Rotterdam L'Aia", code: "RTM", city: "Rotterdam", kind: "airport" },
  { name: "Eindhoven", code: "EIN", city: "Eindhoven", kind: "airport" },

  // ── Aeroporti europei — Scandinavia e Finlandia ─────────────────────────
  { name: "Stoccolma Arlanda", code: "ARN", city: "Stoccolma", kind: "airport" },
  { name: "Göteborg Landvetter", code: "GOT", city: "Göteborg", kind: "airport" },
  { name: "Malmö Sturup", code: "MMX", city: "Malmö", kind: "airport" },
  { name: "Copenhagen", code: "CPH", city: "Copenaghen", kind: "airport" },
  { name: "Oslo Gardermoen", code: "OSL", city: "Oslo", kind: "airport" },
  { name: "Bergen Flesland", code: "BGO", city: "Bergen", kind: "airport" },
  { name: "Trondheim Værnes", code: "TRD", city: "Trondheim", kind: "airport" },
  { name: "Helsinki", code: "HEL", city: "Helsinki", kind: "airport" },
  { name: "Tampere", code: "TMP", city: "Tampere", kind: "airport" },
  { name: "Reykjavik Keflavik", code: "KEF", city: "Reykjavik", kind: "airport" },

  // ── Aeroporti europei — Polonia e Paesi Baltici ─────────────────────────
  { name: "Varsavia Chopin", code: "WAW", city: "Varsavia", kind: "airport" },
  { name: "Cracovia", code: "KRK", city: "Cracovia", kind: "airport" },
  { name: "Danzica Lech Wałęsa", code: "GDN", city: "Danzica", kind: "airport" },
  { name: "Breslavia", code: "WRO", city: "Breslavia", kind: "airport" },
  { name: "Katowice", code: "KTW", city: "Katowice", kind: "airport" },
  { name: "Poznań", code: "POZ", city: "Poznań", kind: "airport" },
  { name: "Riga", code: "RIX", city: "Riga", kind: "airport" },
  { name: "Tallinn", code: "TLL", city: "Tallinn", kind: "airport" },
  { name: "Vilnius", code: "VNO", city: "Vilnius", kind: "airport" },

  // ── Aeroporti europei — Europa Centrale e Balcani ───────────────────────
  { name: "Praga Václav Havel", code: "PRG", city: "Praga", kind: "airport" },
  { name: "Budapest", code: "BUD", city: "Budapest", kind: "airport" },
  { name: "Bratislava", code: "BTS", city: "Bratislava", kind: "airport" },
  { name: "Lubiana Jože Pučnik", code: "LJU", city: "Lubiana", kind: "airport" },
  { name: "Zagabria", code: "ZAG", city: "Zagabria", kind: "airport" },
  { name: "Spalato", code: "SPU", city: "Spalato", kind: "airport" },
  { name: "Dubrovnik", code: "DBV", city: "Dubrovnik", kind: "airport" },
  { name: "Sarajevo", code: "SJJ", city: "Sarajevo", kind: "airport" },
  { name: "Belgrado Nikola Tesla", code: "BEG", city: "Belgrado", kind: "airport" },
  { name: "Podgorica", code: "TGD", city: "Podgorica", kind: "airport" },
  { name: "Tirana Rinas", code: "TIA", city: "Tirana", kind: "airport" },
  { name: "Skopje", code: "SKP", city: "Skopje", kind: "airport" },
  { name: "Pristina", code: "PRN", city: "Pristina", kind: "airport" },

  // ── Aeroporti europei — Europa dell'Est e Baltico ───────────────────────
  { name: "Sofia", code: "SOF", city: "Sofia", kind: "airport" },
  { name: "Bucarest Henri Coandă", code: "OTP", city: "Bucarest", kind: "airport" },
  { name: "Cluj-Napoca", code: "CLJ", city: "Cluj-Napoca", kind: "airport" },
  { name: "Atene Eleftherios Venizelos", code: "ATH", city: "Atene", kind: "airport" },
  { name: "Salonicco", code: "SKG", city: "Salonicco", kind: "airport" },
  { name: "Heraklion Creta", code: "HER", city: "Heraklion", kind: "airport" },
  { name: "Rodi", code: "RHO", city: "Rodi", kind: "airport" },
  { name: "Corfù", code: "CFU", city: "Corfù", kind: "airport" },
  { name: "Kyiv Boryspil", code: "KBP", city: "Kiev", kind: "airport" },
  { name: "Leopoli Danylo Halytskyi", code: "LWO", city: "Leopoli", kind: "airport" },
  { name: "Chișinău", code: "KIV", city: "Chișinău", kind: "airport" },
  { name: "Tbilisi", code: "TBS", city: "Tbilisi", kind: "airport" },
  { name: "Yerevan Zvartnots", code: "EVN", city: "Yerevan", kind: "airport" },
  { name: "Baku Heydar Aliyev", code: "GYD", city: "Baku", kind: "airport" },
  { name: "Malta", code: "MLA", city: "Malta", kind: "airport" },
  { name: "Istanbul", code: "IST", city: "Istanbul", kind: "airport" },
  { name: "Ankara Esenboğa", code: "ESB", city: "Ankara", kind: "airport" },
  { name: "Smirne Adnan Menderes", code: "ADB", city: "Smirne", kind: "airport" },
  { name: "Antalya", code: "AYT", city: "Antalya", kind: "airport" },
  { name: "Bodrum Milas", code: "BJV", city: "Bodrum", kind: "airport" },

  // ── Aeroporti Medio Oriente ─────────────────────────────────────────────
  { name: "Dubai", code: "DXB", city: "Dubai", kind: "airport" },
  { name: "Abu Dhabi", code: "AUH", city: "Abu Dhabi", kind: "airport" },
  { name: "Doha Hamad", code: "DOH", city: "Doha", kind: "airport" },
  { name: "Kuwait City", code: "KWI", city: "Kuwait City", kind: "airport" },
  { name: "Riyad", code: "RUH", city: "Riyad", kind: "airport" },
  { name: "Jeddah", code: "JED", city: "Jeddah", kind: "airport" },
  { name: "Muscat", code: "MCT", city: "Muscat", kind: "airport" },
  { name: "Bahrain", code: "BAH", city: "Manama", kind: "airport" },
  { name: "Tel Aviv Ben Gurion", code: "TLV", city: "Tel Aviv", kind: "airport" },
  { name: "Amman Queen Alia", code: "AMM", city: "Amman", kind: "airport" },
  { name: "Beirut", code: "BEY", city: "Beirut", kind: "airport" },
  { name: "Cairo", code: "CAI", city: "Il Cairo", kind: "airport" },

  // ── Aeroporti Africa ────────────────────────────────────────────────────
  { name: "Casablanca Mohammed V", code: "CMN", city: "Casablanca", kind: "airport" },
  { name: "Marrakech Ménara", code: "RAK", city: "Marrakech", kind: "airport" },
  { name: "Agadir Al Massira", code: "AGA", city: "Agadir", kind: "airport" },
  { name: "Tunisi Carthage", code: "TUN", city: "Tunisi", kind: "airport" },
  { name: "Algeri Houari Boumédiène", code: "ALG", city: "Algeri", kind: "airport" },
  { name: "Nairobi Jomo Kenyatta", code: "NBO", city: "Nairobi", kind: "airport" },
  { name: "Addis Abeba Bole", code: "ADD", city: "Addis Abeba", kind: "airport" },
  { name: "Dakar Léopold Sédar Senghor", code: "DSS", city: "Dakar", kind: "airport" },
  { name: "Accra Kotoka", code: "ACC", city: "Accra", kind: "airport" },
  { name: "Lagos Murtala Muhammed", code: "LOS", city: "Lagos", kind: "airport" },
  { name: "Dar es Salaam", code: "DAR", city: "Dar es Salaam", kind: "airport" },
  { name: "Zanzibar", code: "ZNZ", city: "Zanzibar", kind: "airport" },
  { name: "Johannesburg OR Tambo", code: "JNB", city: "Johannesburg", kind: "airport" },
  { name: "Città del Capo", code: "CPT", city: "Città del Capo", kind: "airport" },
  { name: "Durban King Shaka", code: "DUR", city: "Durban", kind: "airport" },
  { name: "Mauritius", code: "MRU", city: "Mauritius", kind: "airport" },
  { name: "Mombasa Moi", code: "MBA", city: "Mombasa", kind: "airport" },
  { name: "Kigali", code: "KGL", city: "Kigali", kind: "airport" },
  { name: "Lusaka Kenneth Kaunda", code: "LUN", city: "Lusaka", kind: "airport" },

  // ── Aeroporti Nord America ──────────────────────────────────────────────
  { name: "New York JFK", code: "JFK", city: "New York", kind: "airport" },
  { name: "New York Newark", code: "EWR", city: "New York/Newark", kind: "airport" },
  { name: "Los Angeles", code: "LAX", city: "Los Angeles", kind: "airport" },
  { name: "Chicago O'Hare", code: "ORD", city: "Chicago", kind: "airport" },
  { name: "Chicago Midway", code: "MDW", city: "Chicago", kind: "airport" },
  { name: "Miami", code: "MIA", city: "Miami", kind: "airport" },
  { name: "Boston Logan", code: "BOS", city: "Boston", kind: "airport" },
  { name: "Washington Dulles", code: "IAD", city: "Washington DC", kind: "airport" },
  { name: "San Francisco", code: "SFO", city: "San Francisco", kind: "airport" },
  { name: "Las Vegas", code: "LAS", city: "Las Vegas", kind: "airport" },
  { name: "Atlanta Hartsfield", code: "ATL", city: "Atlanta", kind: "airport" },
  { name: "Dallas/Fort Worth", code: "DFW", city: "Dallas", kind: "airport" },
  { name: "Houston George Bush", code: "IAH", city: "Houston", kind: "airport" },
  { name: "Seattle-Tacoma", code: "SEA", city: "Seattle", kind: "airport" },
  { name: "Denver", code: "DEN", city: "Denver", kind: "airport" },
  { name: "Phoenix Sky Harbor", code: "PHX", city: "Phoenix", kind: "airport" },
  { name: "Orlando", code: "MCO", city: "Orlando", kind: "airport" },
  { name: "Toronto Pearson", code: "YYZ", city: "Toronto", kind: "airport" },
  { name: "Montréal Trudeau", code: "YUL", city: "Montréal", kind: "airport" },
  { name: "Vancouver", code: "YVR", city: "Vancouver", kind: "airport" },
  { name: "Città del Messico", code: "MEX", city: "Città del Messico", kind: "airport" },
  { name: "Cancún", code: "CUN", city: "Cancún", kind: "airport" },
  { name: "Guadalajara", code: "GDL", city: "Guadalajara", kind: "airport" },

  // ── Aeroporti Centro e Sud America ──────────────────────────────────────
  { name: "São Paulo Guarulhos", code: "GRU", city: "São Paulo", kind: "airport" },
  { name: "São Paulo Congonhas", code: "CGH", city: "São Paulo", kind: "airport" },
  { name: "Rio de Janeiro Galeão", code: "GIG", city: "Rio de Janeiro", kind: "airport" },
  { name: "Buenos Aires Ezeiza", code: "EZE", city: "Buenos Aires", kind: "airport" },
  { name: "Bogotá El Dorado", code: "BOG", city: "Bogotá", kind: "airport" },
  { name: "Lima Jorge Chávez", code: "LIM", city: "Lima", kind: "airport" },
  { name: "Santiago Arturo Merino Benítez", code: "SCL", city: "Santiago del Cile", kind: "airport" },
  { name: "Medellín José María Córdova", code: "MDE", city: "Medellín", kind: "airport" },
  { name: "Cartagena Rafael Núñez", code: "CTG", city: "Cartagena", kind: "airport" },
  { name: "Montevideo Carrasco", code: "MVD", city: "Montevideo", kind: "airport" },
  { name: "Quito Mariscal Sucre", code: "UIO", city: "Quito", kind: "airport" },
  { name: "Guayaquil José Joaquín de Olmedo", code: "GYE", city: "Guayaquil", kind: "airport" },
  { name: "Havana José Martí", code: "HAV", city: "L'Avana", kind: "airport" },
  { name: "Santo Domingo Las Américas", code: "SDQ", city: "Santo Domingo", kind: "airport" },
  { name: "Punta Cana", code: "PUJ", city: "Punta Cana", kind: "airport" },

  // ── Aeroporti Asia — Est e Sud-Est ─────────────────────────────────────
  { name: "Tokyo Narita", code: "NRT", city: "Tokyo", kind: "airport" },
  { name: "Tokyo Haneda", code: "HND", city: "Tokyo", kind: "airport" },
  { name: "Osaka Kansai", code: "KIX", city: "Osaka", kind: "airport" },
  { name: "Seoul Incheon", code: "ICN", city: "Seoul", kind: "airport" },
  { name: "Pechino Capital", code: "PEK", city: "Pechino", kind: "airport" },
  { name: "Pechino Daxing", code: "PKX", city: "Pechino", kind: "airport" },
  { name: "Shanghai Pudong", code: "PVG", city: "Shanghai", kind: "airport" },
  { name: "Shanghai Hongqiao", code: "SHA", city: "Shanghai", kind: "airport" },
  { name: "Hong Kong", code: "HKG", city: "Hong Kong", kind: "airport" },
  { name: "Taipei Taoyuan", code: "TPE", city: "Taipei", kind: "airport" },
  { name: "Bangkok Suvarnabhumi", code: "BKK", city: "Bangkok", kind: "airport" },
  { name: "Bangkok Don Mueang", code: "DMK", city: "Bangkok", kind: "airport" },
  { name: "Singapore Changi", code: "SIN", city: "Singapore", kind: "airport" },
  { name: "Kuala Lumpur", code: "KUL", city: "Kuala Lumpur", kind: "airport" },
  { name: "Jakarta Soekarno-Hatta", code: "CGK", city: "Giacarta", kind: "airport" },
  { name: "Bali Ngurah Rai", code: "DPS", city: "Bali/Denpasar", kind: "airport" },
  { name: "Manila Ninoy Aquino", code: "MNL", city: "Manila", kind: "airport" },
  { name: "Ho Chi Minh City", code: "SGN", city: "Ho Chi Minh City", kind: "airport" },
  { name: "Hanoi Noi Bai", code: "HAN", city: "Hanoi", kind: "airport" },
  { name: "Da Nang", code: "DAD", city: "Da Nang", kind: "airport" },
  { name: "Phuket", code: "HKT", city: "Phuket", kind: "airport" },
  { name: "Chiang Mai", code: "CNX", city: "Chiang Mai", kind: "airport" },

  // ── Aeroporti Asia — Sud ────────────────────────────────────────────────
  { name: "Delhi Indira Gandhi", code: "DEL", city: "Delhi", kind: "airport" },
  { name: "Mumbai Chhatrapati Shivaji", code: "BOM", city: "Mumbai", kind: "airport" },
  { name: "Bangalore Kempegowda", code: "BLR", city: "Bangalore", kind: "airport" },
  { name: "Chennai", code: "MAA", city: "Chennai", kind: "airport" },
  { name: "Kolkata Subhas Chandra Bose", code: "CCU", city: "Calcutta", kind: "airport" },
  { name: "Hyderabad Rajiv Gandhi", code: "HYD", city: "Hyderabad", kind: "airport" },
  { name: "Colombo Bandaranaike", code: "CMB", city: "Colombo", kind: "airport" },
  { name: "Kathmandu Tribhuvan", code: "KTM", city: "Kathmandu", kind: "airport" },
  { name: "Malé Velana", code: "MLE", city: "Malé/Maldive", kind: "airport" },
  { name: "Dhaka Shahjalal", code: "DAC", city: "Dhaka", kind: "airport" },
  { name: "Islamabad", code: "ISB", city: "Islamabad", kind: "airport" },

  // ── Aeroporti Oceania ───────────────────────────────────────────────────
  { name: "Sydney Kingsford Smith", code: "SYD", city: "Sydney", kind: "airport" },
  { name: "Melbourne Tullamarine", code: "MEL", city: "Melbourne", kind: "airport" },
  { name: "Brisbane", code: "BNE", city: "Brisbane", kind: "airport" },
  { name: "Perth", code: "PER", city: "Perth", kind: "airport" },
  { name: "Adelaide", code: "ADL", city: "Adelaide", kind: "airport" },
  { name: "Auckland", code: "AKL", city: "Auckland", kind: "airport" },

  // ── Stazioni AV/intercity italiane ─────────────────────────────────────
  { name: "Milano Centrale", city: "Milano", kind: "station" },
  { name: "Milano Porta Garibaldi", city: "Milano", kind: "station" },
  { name: "Milano Cadorna", city: "Milano", kind: "station" },
  { name: "Milano Rogoredo", city: "Milano", kind: "station" },
  { name: "Roma Termini", city: "Roma", kind: "station" },
  { name: "Roma Tiburtina", city: "Roma", kind: "station" },
  { name: "Roma Ostiense", city: "Roma", kind: "station" },
  { name: "Roma Trastevere", city: "Roma", kind: "station" },
  { name: "Firenze Santa Maria Novella", city: "Firenze", kind: "station" },
  { name: "Firenze Campo di Marte", city: "Firenze", kind: "station" },
  { name: "Venezia Santa Lucia", city: "Venezia", kind: "station" },
  { name: "Venezia Mestre", city: "Venezia/Mestre", kind: "station" },
  { name: "Napoli Centrale", city: "Napoli", kind: "station" },
  { name: "Napoli Mergellina", city: "Napoli", kind: "station" },
  { name: "Napoli Afragola", city: "Napoli", kind: "station" },
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

  // ── Stazioni italiane — Piemonte ────────────────────────────────────────
  { name: "Novara", city: "Novara", kind: "station" },
  { name: "Alessandria", city: "Alessandria", kind: "station" },
  { name: "Asti", city: "Asti", kind: "station" },
  { name: "Cuneo", city: "Cuneo", kind: "station" },
  { name: "Biella San Paolo", city: "Biella", kind: "station" },
  { name: "Vercelli", city: "Vercelli", kind: "station" },
  { name: "Ivrea", city: "Ivrea", kind: "station" },
  { name: "Pinerolo", city: "Pinerolo", kind: "station" },
  { name: "Moncalieri", city: "Moncalieri", kind: "station" },
  { name: "Rivoli", city: "Rivoli", kind: "station" },
  { name: "Chivasso", city: "Chivasso", kind: "station" },
  { name: "Carmagnola", city: "Carmagnola", kind: "station" },
  { name: "Settimo Torinese", city: "Settimo Torinese", kind: "station" },
  { name: "Fossano", city: "Fossano", kind: "station" },
  { name: "Alba", city: "Alba", kind: "station" },
  { name: "Bra", city: "Bra", kind: "station" },
  { name: "Mondovì", city: "Mondovì", kind: "station" },
  { name: "Casale Monferrato", city: "Casale Monferrato", kind: "station" },
  { name: "Tortona", city: "Tortona", kind: "station" },
  { name: "Acqui Terme", city: "Acqui Terme", kind: "station" },
  { name: "Borgomanero", city: "Borgomanero", kind: "station" },
  { name: "Arona", city: "Arona", kind: "station" },
  { name: "Ciriè", city: "Ciriè", kind: "station" },
  { name: "Aosta", city: "Aosta", kind: "station" },
  { name: "Domodossola", city: "Domodossola", kind: "station" },
  { name: "Verbania-Pallanza", city: "Verbania", kind: "station" },
  { name: "Stresa", city: "Stresa", kind: "station" },
  { name: "Omegna", city: "Omegna", kind: "station" },

  // ── Stazioni italiane — Liguria ─────────────────────────────────────────
  { name: "Savona", city: "Savona", kind: "station" },
  { name: "La Spezia Centrale", city: "La Spezia", kind: "station" },
  { name: "Sanremo", city: "Sanremo", kind: "station" },
  { name: "Imperia Oneglia", city: "Imperia", kind: "station" },
  { name: "Ventimiglia", city: "Ventimiglia", kind: "station" },
  { name: "Chiavari", city: "Chiavari", kind: "station" },
  { name: "Rapallo", city: "Rapallo", kind: "station" },
  { name: "Sestri Levante", city: "Sestri Levante", kind: "station" },
  { name: "Albenga", city: "Albenga", kind: "station" },
  { name: "Alassio", city: "Alassio", kind: "station" },

  // ── Stazioni italiane — Lombardia ───────────────────────────────────────
  { name: "Como San Giovanni", city: "Como", kind: "station" },
  { name: "Varese", city: "Varese", kind: "station" },
  { name: "Lecco", city: "Lecco", kind: "station" },
  { name: "Monza", city: "Monza", kind: "station" },
  { name: "Brescia", city: "Brescia", kind: "station" },
  { name: "Bergamo", city: "Bergamo", kind: "station" },
  { name: "Pavia", city: "Pavia", kind: "station" },
  { name: "Cremona", city: "Cremona", kind: "station" },
  { name: "Mantova", city: "Mantova", kind: "station" },
  { name: "Busto Arsizio Nord", city: "Busto Arsizio", kind: "station" },
  { name: "Gallarate", city: "Gallarate", kind: "station" },
  { name: "Saronno", city: "Saronno", kind: "station" },
  { name: "Legnano", city: "Legnano", kind: "station" },
  { name: "Rho", city: "Rho", kind: "station" },
  { name: "Lodi", city: "Lodi", kind: "station" },
  { name: "Vigevano", city: "Vigevano", kind: "station" },
  { name: "Voghera", city: "Voghera", kind: "station" },
  { name: "Crema", city: "Crema", kind: "station" },
  { name: "Seregno", city: "Seregno", kind: "station" },
  { name: "Desio", city: "Desio", kind: "station" },
  { name: "Cantù", city: "Cantù", kind: "station" },
  { name: "Treviglio", city: "Treviglio", kind: "station" },
  { name: "Desenzano del Garda", city: "Desenzano del Garda", kind: "station" },
  { name: "Sondrio", city: "Sondrio", kind: "station" },
  { name: "Piacenza", city: "Piacenza", kind: "station" },
  { name: "Sesto San Giovanni", city: "Sesto San Giovanni", kind: "station" },
  { name: "Cinisello Balsamo", city: "Cinisello Balsamo", kind: "station" },
  { name: "Viadana", city: "Viadana", kind: "station" },
  { name: "Castiglione delle Stiviere", city: "Castiglione delle Stiviere", kind: "station" },
  { name: "Palazzolo sull'Oglio", city: "Palazzolo sull'Oglio", kind: "station" },
  { name: "Chiari", city: "Chiari", kind: "station" },
  { name: "Montichiari", city: "Montichiari", kind: "station" },
  { name: "Pioltello", city: "Pioltello", kind: "station" },
  { name: "Magenta", city: "Magenta", kind: "station" },
  { name: "Abbiategrasso", city: "Abbiategrasso", kind: "station" },
  { name: "Cesano Maderno", city: "Cesano Maderno", kind: "station" },
  { name: "Sesto Calende", city: "Sesto Calende", kind: "station" },
  { name: "Cologno Monzese", city: "Cologno Monzese", kind: "station" },
  { name: "San Giuliano Milanese", city: "San Giuliano Milanese", kind: "station" },
  { name: "Melegnano", city: "Melegnano", kind: "station" },
  { name: "Corsico", city: "Corsico", kind: "station" },
  { name: "Segrate", city: "Segrate", kind: "station" },
  { name: "Meda", city: "Meda", kind: "station" },
  { name: "Settimo Milanese", city: "Settimo Milanese", kind: "station" },

  // ── Stazioni italiane — Trentino-Alto Adige e Friuli ────────────────────
  { name: "Trento", city: "Trento", kind: "station" },
  { name: "Bolzano", city: "Bolzano", kind: "station" },
  { name: "Merano", city: "Merano", kind: "station" },
  { name: "Rovereto", city: "Rovereto", kind: "station" },
  { name: "Bressanone", city: "Bressanone", kind: "station" },
  { name: "Udine", city: "Udine", kind: "station" },
  { name: "Pordenone", city: "Pordenone", kind: "station" },
  { name: "Gorizia Centrale", city: "Gorizia", kind: "station" },
  { name: "Belluno", city: "Belluno", kind: "station" },

  // ── Stazioni italiane — Veneto ──────────────────────────────────────────
  { name: "Vicenza", city: "Vicenza", kind: "station" },
  { name: "Treviso Centrale", city: "Treviso", kind: "station" },
  { name: "Rovigo", city: "Rovigo", kind: "station" },
  { name: "Bassano del Grappa", city: "Bassano del Grappa", kind: "station" },
  { name: "Castelfranco Veneto", city: "Castelfranco Veneto", kind: "station" },
  { name: "Conegliano", city: "Conegliano", kind: "station" },
  { name: "Montebelluna", city: "Montebelluna", kind: "station" },
  { name: "San Donà di Piave", city: "San Donà di Piave", kind: "station" },
  { name: "Chioggia", city: "Chioggia", kind: "station" },
  { name: "Jesolo", city: "Jesolo", kind: "station" },
  { name: "Portogruaro", city: "Portogruaro", kind: "station" },
  { name: "Schio", city: "Schio", kind: "station" },
  { name: "Thiene", city: "Thiene", kind: "station" },
  { name: "Valdagno", city: "Valdagno", kind: "station" },

  // ── Stazioni italiane — Emilia-Romagna ──────────────────────────────────
  { name: "Reggio Emilia AV", city: "Reggio Emilia", kind: "station" },
  { name: "Modena", city: "Modena", kind: "station" },
  { name: "Parma", city: "Parma", kind: "station" },
  { name: "Ferrara", city: "Ferrara", kind: "station" },
  { name: "Rimini", city: "Rimini", kind: "station" },
  { name: "Ravenna", city: "Ravenna", kind: "station" },
  { name: "Forlì", city: "Forlì", kind: "station" },
  { name: "Cesena", city: "Cesena", kind: "station" },
  { name: "Imola", city: "Imola", kind: "station" },
  { name: "Faenza", city: "Faenza", kind: "station" },
  { name: "Carpi", city: "Carpi", kind: "station" },
  { name: "Sassuolo", city: "Sassuolo", kind: "station" },
  { name: "Fidenza", city: "Fidenza", kind: "station" },
  { name: "Castelfranco Emilia", city: "Castelfranco Emilia", kind: "station" },
  { name: "Lugo", city: "Lugo", kind: "station" },
  { name: "Cento", city: "Cento", kind: "station" },
  { name: "Vignola", city: "Vignola", kind: "station" },
  { name: "Fiorenzuola d'Arda", city: "Fiorenzuola d'Arda", kind: "station" },

  // ── Stazioni italiane — Toscana ─────────────────────────────────────────
  { name: "Livorno Centrale", city: "Livorno", kind: "station" },
  { name: "Prato Centrale", city: "Prato", kind: "station" },
  { name: "Pistoia", city: "Pistoia", kind: "station" },
  { name: "Lucca", city: "Lucca", kind: "station" },
  { name: "Arezzo", city: "Arezzo", kind: "station" },
  { name: "Siena", city: "Siena", kind: "station" },
  { name: "Grosseto", city: "Grosseto", kind: "station" },
  { name: "Empoli", city: "Empoli", kind: "station" },
  { name: "Pontedera-Casciana T.", city: "Pontedera", kind: "station" },
  { name: "Massa Centro", city: "Massa", kind: "station" },
  { name: "Carrara-Avenza", city: "Carrara", kind: "station" },
  { name: "Piombino Marittima", city: "Piombino", kind: "station" },
  { name: "Follonica", city: "Follonica", kind: "station" },
  { name: "Poggibonsi-San Gimignano", city: "Poggibonsi", kind: "station" },
  { name: "Viareggio", city: "Viareggio", kind: "station" },

  // ── Stazioni italiane — Umbria e Marche ────────────────────────────────
  { name: "Perugia Fontivegge", city: "Perugia", kind: "station" },
  { name: "Terni", city: "Terni", kind: "station" },
  { name: "Foligno", city: "Foligno", kind: "station" },
  { name: "Spoleto", city: "Spoleto", kind: "station" },
  { name: "Ancona", city: "Ancona", kind: "station" },
  { name: "Pesaro", city: "Pesaro", kind: "station" },
  { name: "Fano", city: "Fano", kind: "station" },
  { name: "Senigallia", city: "Senigallia", kind: "station" },
  { name: "Fabriano", city: "Fabriano", kind: "station" },
  { name: "Civitanova Marche", city: "Civitanova Marche", kind: "station" },
  { name: "Macerata", city: "Macerata", kind: "station" },
  { name: "Ascoli Piceno", city: "Ascoli Piceno", kind: "station" },
  { name: "San Benedetto del Tronto", city: "San Benedetto del Tronto", kind: "station" },
  { name: "Jesi", city: "Jesi", kind: "station" },

  // ── Stazioni italiane — Lazio e Abruzzo ────────────────────────────────
  { name: "Viterbo", city: "Viterbo", kind: "station" },
  { name: "Frosinone", city: "Frosinone", kind: "station" },
  { name: "Latina", city: "Latina", kind: "station" },
  { name: "Civitavecchia", city: "Civitavecchia", kind: "station" },
  { name: "Velletri", city: "Velletri", kind: "station" },
  { name: "Cassino", city: "Cassino", kind: "station" },
  { name: "Colleferro", city: "Colleferro", kind: "station" },
  { name: "Sora", city: "Sora", kind: "station" },
  { name: "Pescara Centrale", city: "Pescara", kind: "station" },
  { name: "Chieti", city: "Chieti", kind: "station" },
  { name: "L'Aquila", city: "L'Aquila", kind: "station" },
  { name: "Teramo", city: "Teramo", kind: "station" },
  { name: "Lanciano", city: "Lanciano", kind: "station" },
  { name: "Sulmona", city: "Sulmona", kind: "station" },
  { name: "Avezzano", city: "Avezzano", kind: "station" },
  { name: "Vasto-San Salvo", city: "Vasto", kind: "station" },
  { name: "Fiumicino", city: "Fiumicino", kind: "station" },
  { name: "Anzio", city: "Anzio", kind: "station" },
  { name: "Nettuno", city: "Nettuno", kind: "station" },
  { name: "Ladispoli-Cerveteri", city: "Ladispoli", kind: "station" },
  { name: "Pomezia-Santa Palomba", city: "Pomezia", kind: "station" },
  { name: "Frascati", city: "Frascati", kind: "station" },
  { name: "Albano Laziale", city: "Albano Laziale", kind: "station" },
  { name: "Genzano di Roma", city: "Genzano di Roma", kind: "station" },
  { name: "Isernia", city: "Isernia", kind: "station" },

  // ── Stazioni italiane — Campania ───────────────────────────────────────
  { name: "Salerno", city: "Salerno", kind: "station" },
  { name: "Caserta", city: "Caserta", kind: "station" },
  { name: "Benevento", city: "Benevento", kind: "station" },
  { name: "Avellino", city: "Avellino", kind: "station" },
  { name: "Torre del Greco", city: "Torre del Greco", kind: "station" },
  { name: "Castellammare di Stabia", city: "Castellammare di Stabia", kind: "station" },
  { name: "Portici-Ercolano", city: "Portici", kind: "station" },
  { name: "Torre Annunziata Centrale", city: "Torre Annunziata", kind: "station" },
  { name: "Pompei Scavi", city: "Pompei", kind: "station" },
  { name: "Battipaglia", city: "Battipaglia", kind: "station" },
  { name: "Nocera Inferiore", city: "Nocera Inferiore", kind: "station" },
  { name: "Cava de' Tirreni", city: "Cava de' Tirreni", kind: "station" },
  { name: "Eboli", city: "Eboli", kind: "station" },
  { name: "Nola", city: "Nola", kind: "station" },
  { name: "Capua", city: "Capua", kind: "station" },
  { name: "Pozzuoli", city: "Pozzuoli", kind: "station" },
  { name: "Campobasso", city: "Campobasso", kind: "station" },
  { name: "Aversa", city: "Aversa", kind: "station" },
  { name: "Afragola", city: "Afragola", kind: "station" },
  { name: "Scafati", city: "Scafati", kind: "station" },
  { name: "Maddaloni", city: "Maddaloni", kind: "station" },
  { name: "Giugliano-Qualiano", city: "Giugliano in Campania", kind: "station" },

  // ── Stazioni italiane — Puglia ─────────────────────────────────────────
  { name: "Foggia", city: "Foggia", kind: "station" },
  { name: "Taranto", city: "Taranto", kind: "station" },
  { name: "Lecce", city: "Lecce", kind: "station" },
  { name: "Brindisi", city: "Brindisi", kind: "station" },
  { name: "Andria", city: "Andria", kind: "station" },
  { name: "Barletta", city: "Barletta", kind: "station" },
  { name: "Trani", city: "Trani", kind: "station" },
  { name: "Molfetta", city: "Molfetta", kind: "station" },
  { name: "Monopoli", city: "Monopoli", kind: "station" },
  { name: "Corato", city: "Corato", kind: "station" },
  { name: "Cerignola Campagna", city: "Cerignola", kind: "station" },
  { name: "San Severo", city: "San Severo", kind: "station" },
  { name: "Manfredonia", city: "Manfredonia", kind: "station" },
  { name: "Altamura", city: "Altamura", kind: "station" },
  { name: "Gravina in Puglia", city: "Gravina in Puglia", kind: "station" },
  { name: "Bisceglie", city: "Bisceglie", kind: "station" },
  { name: "Fasano", city: "Fasano", kind: "station" },
  { name: "Ostuni", city: "Ostuni", kind: "station" },
  { name: "Francavilla Fontana", city: "Francavilla Fontana", kind: "station" },
  { name: "Massafra", city: "Massafra", kind: "station" },
  { name: "Manduria", city: "Manduria", kind: "station" },
  { name: "Gioia del Colle", city: "Gioia del Colle", kind: "station" },
  { name: "Ruvo di Puglia", city: "Ruvo di Puglia", kind: "station" },
  { name: "Mesagne", city: "Mesagne", kind: "station" },
  { name: "Trinitapoli", city: "Trinitapoli", kind: "station" },

  // ── Stazioni italiane — Basilicata e Calabria ───────────────────────────
  { name: "Potenza Centrale", city: "Potenza", kind: "station" },
  { name: "Matera", city: "Matera", kind: "station" },
  { name: "Reggio Calabria Centrale", city: "Reggio Calabria", kind: "station" },
  { name: "Cosenza", city: "Cosenza", kind: "station" },
  { name: "Catanzaro Lido", city: "Catanzaro", kind: "station" },
  { name: "Lamezia Terme Centrale", city: "Lamezia Terme", kind: "station" },
  { name: "Corigliano-Rossano", city: "Corigliano-Rossano", kind: "station" },
  { name: "Paola", city: "Paola", kind: "station" },
  { name: "Crotone", city: "Crotone", kind: "station" },
  { name: "Castrovillari", city: "Castrovillari", kind: "station" },
  { name: "Vibo Valentia", city: "Vibo Valentia", kind: "station" },
  { name: "Palmi", city: "Palmi", kind: "station" },
  { name: "Villa San Giovanni", city: "Villa San Giovanni", kind: "station" },
  { name: "Gioia Tauro", city: "Gioia Tauro", kind: "station" },
  { name: "Locri", city: "Locri", kind: "station" },
  { name: "Siderno", city: "Siderno", kind: "station" },
  { name: "Rosarno", city: "Rosarno", kind: "station" },
  { name: "Melito di Porto Salvo", city: "Melito di Porto Salvo", kind: "station" },
  { name: "Pisticci", city: "Pisticci", kind: "station" },
  { name: "Lavello", city: "Lavello", kind: "station" },

  // ── Stazioni italiane — Sicilia ─────────────────────────────────────────
  { name: "Messina Centrale", city: "Messina", kind: "station" },
  { name: "Catania Centrale", city: "Catania", kind: "station" },
  { name: "Siracusa", city: "Siracusa", kind: "station" },
  { name: "Agrigento Centrale", city: "Agrigento", kind: "station" },
  { name: "Trapani", city: "Trapani", kind: "station" },
  { name: "Marsala", city: "Marsala", kind: "station" },
  { name: "Ragusa", city: "Ragusa", kind: "station" },
  { name: "Caltanissetta Centrale", city: "Caltanissetta", kind: "station" },
  { name: "Vittoria", city: "Vittoria", kind: "station" },
  { name: "Gela", city: "Gela", kind: "station" },
  { name: "Bagheria", city: "Bagheria", kind: "station" },
  { name: "Modica", city: "Modica", kind: "station" },
  { name: "Acireale", city: "Acireale", kind: "station" },
  { name: "Caltagirone", city: "Caltagirone", kind: "station" },
  { name: "Mazara del Vallo", city: "Mazara del Vallo", kind: "station" },
  { name: "Sciacca", city: "Sciacca", kind: "station" },
  { name: "Alcamo", city: "Alcamo", kind: "station" },
  { name: "Barcellona Pozzo di Gotto", city: "Barcellona P.G.", kind: "station" },
  { name: "Milazzo", city: "Milazzo", kind: "station" },
  { name: "Licata", city: "Licata", kind: "station" },
  { name: "Ribera", city: "Ribera", kind: "station" },
  { name: "Comiso", city: "Comiso", kind: "station" },
  { name: "Noto", city: "Noto", kind: "station" },

  // ── Stazioni italiane — Sardegna ────────────────────────────────────────
  { name: "Cagliari", city: "Cagliari", kind: "station" },
  { name: "Sassari", city: "Sassari", kind: "station" },
  { name: "Olbia", city: "Olbia", kind: "station" },
  { name: "Oristano", city: "Oristano", kind: "station" },
  { name: "Nuoro", city: "Nuoro", kind: "station" },
  { name: "Quartu Sant'Elena", city: "Quartu Sant'Elena", kind: "station" },
  { name: "Iglesias", city: "Iglesias", kind: "station" },
  { name: "Carbonia", city: "Carbonia", kind: "station" },
  { name: "Porto Torres", city: "Porto Torres", kind: "station" },
  { name: "Alghero", city: "Alghero", kind: "station" },
  { name: "Tempio Pausania", city: "Tempio Pausania", kind: "station" },

  // ── Stazioni europee — Francia ──────────────────────────────────────────
  { name: "Parigi Gare de Lyon", city: "Parigi", kind: "station" },
  { name: "Parigi Gare du Nord", city: "Parigi", kind: "station" },
  { name: "Parigi Gare de l'Est", city: "Parigi", kind: "station" },
  { name: "Parigi Gare Montparnasse", city: "Parigi", kind: "station" },
  { name: "Lione Part-Dieu", city: "Lione", kind: "station" },
  { name: "Marsiglia Saint-Charles", city: "Marsiglia", kind: "station" },
  { name: "Nizza Ville", city: "Nizza", kind: "station" },
  { name: "Toulouse Matabiau", city: "Tolosa", kind: "station" },
  { name: "Bordeaux Saint-Jean", city: "Bordeaux", kind: "station" },
  { name: "Nantes", city: "Nantes", kind: "station" },
  { name: "Strasbourg", city: "Strasburgo", kind: "station" },
  { name: "Montpellier Saint-Roch", city: "Montpellier", kind: "station" },
  { name: "Lille Flandres", city: "Lille", kind: "station" },
  { name: "Rennes", city: "Rennes", kind: "station" },
  { name: "Grenoble", city: "Grenoble", kind: "station" },
  { name: "Reims", city: "Reims", kind: "station" },
  { name: "Nancy", city: "Nancy", kind: "station" },
  { name: "Metz-Ville", city: "Metz", kind: "station" },
  { name: "Dijon-Ville", city: "Dijon", kind: "station" },
  { name: "Le Havre", city: "Le Havre", kind: "station" },
  { name: "Rouen Rive Droite", city: "Rouen", kind: "station" },
  { name: "Amiens", city: "Amiens", kind: "station" },
  { name: "Tours", city: "Tours", kind: "station" },
  { name: "Orléans", city: "Orléans", kind: "station" },
  { name: "Caen", city: "Caen", kind: "station" },
  { name: "Clermont-Ferrand", city: "Clermont-Ferrand", kind: "station" },
  { name: "Angers Saint-Laud", city: "Angers", kind: "station" },
  { name: "Brest", city: "Brest", kind: "station" },
  { name: "Perpignan", city: "Perpignan", kind: "station" },
  { name: "Avignon TGV", city: "Avignone", kind: "station" },
  { name: "Toulon", city: "Tolone", kind: "station" },
  { name: "Aix-en-Provence TGV", city: "Aix-en-Provence", kind: "station" },
  { name: "Metz TGV", city: "Metz", kind: "station" },
  { name: "Mulhouse", city: "Mulhouse", kind: "station" },
  { name: "Pau", city: "Pau", kind: "station" },
  { name: "Biarritz/Bayonne", city: "Bayonne", kind: "station" },
  { name: "Limoges-Bénédictins", city: "Limoges", kind: "station" },
  { name: "Poitiers", city: "Poitiers", kind: "station" },
  { name: "La Rochelle Ville", city: "La Rochelle", kind: "station" },
  { name: "Valenciennes", city: "Valenciennes", kind: "station" },
  { name: "Dunkerque", city: "Dunkerque", kind: "station" },
  { name: "Metz", city: "Metz", kind: "station" },

  // ── Stazioni europee — Spagna e Portogallo ──────────────────────────────
  { name: "Madrid Atocha", city: "Madrid", kind: "station" },
  { name: "Madrid Chamartín", city: "Madrid", kind: "station" },
  { name: "Barcellona Sants", city: "Barcellona", kind: "station" },
  { name: "Valencia Joaquín Sorolla", city: "Valencia", kind: "station" },
  { name: "Siviglia Santa Justa", city: "Siviglia", kind: "station" },
  { name: "Malaga Maria Zambrano", city: "Malaga", kind: "station" },
  { name: "Zaragoza Delicias", city: "Saragozza", kind: "station" },
  { name: "Alicante Terminal", city: "Alicante", kind: "station" },
  { name: "Valladolid Campo Grande", city: "Valladolid", kind: "station" },
  { name: "Murcia del Carmen", city: "Murcia", kind: "station" },
  { name: "Vigo Guixar", city: "Vigo", kind: "station" },
  { name: "A Coruña", city: "A Coruña", kind: "station" },
  { name: "Bilbao Abando", city: "Bilbao", kind: "station" },
  { name: "San Sebastián-Donostia", city: "San Sebastián", kind: "station" },
  { name: "Santander", city: "Santander", kind: "station" },
  { name: "Oviedo", city: "Oviedo", kind: "station" },
  { name: "Gijón", city: "Gijón", kind: "station" },
  { name: "Granada", city: "Granada", kind: "station" },
  { name: "Córdoba Central", city: "Córdoba", kind: "station" },
  { name: "Albacete Los Llanos", city: "Albacete", kind: "station" },
  { name: "Tarragona", city: "Tarragona", kind: "station" },
  { name: "Girona", city: "Girona", kind: "station" },
  { name: "Lleida", city: "Lleida", kind: "station" },
  { name: "Lisbona Santa Apolónia", city: "Lisbona", kind: "station" },
  { name: "Porto São Bento", city: "Porto", kind: "station" },
  { name: "Porto Campanhã", city: "Porto", kind: "station" },
  { name: "Coimbra B", city: "Coimbra", kind: "station" },
  { name: "Braga", city: "Braga", kind: "station" },
  { name: "Setúbal", city: "Setúbal", kind: "station" },
  { name: "Faro", city: "Faro", kind: "station" },
  { name: "Funchal", city: "Funchal", kind: "station" },

  // ── Stazioni europee — Germania ─────────────────────────────────────────
  { name: "Berlino Hauptbahnhof", city: "Berlino", kind: "station" },
  { name: "Monaco di Baviera Hauptbahnhof", city: "Monaco", kind: "station" },
  { name: "Francoforte Hauptbahnhof", city: "Francoforte", kind: "station" },
  { name: "Amburgo Hauptbahnhof", city: "Amburgo", kind: "station" },
  { name: "Colonia Hauptbahnhof", city: "Colonia", kind: "station" },
  { name: "Stoccarda Hauptbahnhof", city: "Stoccarda", kind: "station" },
  { name: "Düsseldorf Hauptbahnhof", city: "Düsseldorf", kind: "station" },
  { name: "Hannover Hauptbahnhof", city: "Hannover", kind: "station" },
  { name: "Norimberga Hauptbahnhof", city: "Norimberga", kind: "station" },
  { name: "Dresda Hauptbahnhof", city: "Dresda", kind: "station" },
  { name: "Lipsia Hauptbahnhof", city: "Lipsia", kind: "station" },
  { name: "Dortmund Hauptbahnhof", city: "Dortmund", kind: "station" },
  { name: "Essen Hauptbahnhof", city: "Essen", kind: "station" },
  { name: "Brema Hauptbahnhof", city: "Brema", kind: "station" },
  { name: "Bochum Hauptbahnhof", city: "Bochum", kind: "station" },
  { name: "Wuppertal Hauptbahnhof", city: "Wuppertal", kind: "station" },
  { name: "Bielefeld Hauptbahnhof", city: "Bielefeld", kind: "station" },
  { name: "Bonn Hauptbahnhof", city: "Bonn", kind: "station" },
  { name: "Mannheim Hauptbahnhof", city: "Mannheim", kind: "station" },
  { name: "Karlsruhe Hauptbahnhof", city: "Karlsruhe", kind: "station" },
  { name: "Augsburg Hauptbahnhof", city: "Augsburg", kind: "station" },
  { name: "Wiesbaden Hauptbahnhof", city: "Wiesbaden", kind: "station" },
  { name: "Braunschweig Hauptbahnhof", city: "Braunschweig", kind: "station" },
  { name: "Kiel Hauptbahnhof", city: "Kiel", kind: "station" },
  { name: "Magdeburgo Hauptbahnhof", city: "Magdeburgo", kind: "station" },
  { name: "Erfurt Hauptbahnhof", city: "Erfurt", kind: "station" },
  { name: "Friburgo in Brisgovia", city: "Friburgo", kind: "station" },
  { name: "Lubecca Hauptbahnhof", city: "Lubecca", kind: "station" },
  { name: "Rostock Hauptbahnhof", city: "Rostock", kind: "station" },
  { name: "Magonza Hauptbahnhof", city: "Magonza", kind: "station" },
  { name: "Kassel Hauptbahnhof", city: "Kassel", kind: "station" },
  { name: "Halle (Saale) Hauptbahnhof", city: "Halle", kind: "station" },
  { name: "Chemnitz Hauptbahnhof", city: "Chemnitz", kind: "station" },
  { name: "Aachen Hauptbahnhof", city: "Aquisgrana", kind: "station" },
  { name: "Oberhausen Hauptbahnhof", city: "Oberhausen", kind: "station" },
  { name: "Krefeld Hauptbahnhof", city: "Krefeld", kind: "station" },
  { name: "Hagen Hauptbahnhof", city: "Hagen", kind: "station" },
  { name: "Saarbrücken Hauptbahnhof", city: "Saarbrücken", kind: "station" },
  { name: "Hamm Hauptbahnhof", city: "Hamm", kind: "station" },
  { name: "Gelsenkirchen Hauptbahnhof", city: "Gelsenkirchen", kind: "station" },
  { name: "Mülheim an der Ruhr Hbf", city: "Mülheim", kind: "station" },
  { name: "Heidelberg Hauptbahnhof", city: "Heidelberg", kind: "station" },
  { name: "Koblenz Hauptbahnhof", city: "Coblenza", kind: "station" },

  // ── Stazioni europee — Austria e Svizzera ───────────────────────────────
  { name: "Vienna Hauptbahnhof", city: "Vienna", kind: "station" },
  { name: "Vienna Westbahnhof", city: "Vienna", kind: "station" },
  { name: "Salisburgo Hauptbahnhof", city: "Salisburgo", kind: "station" },
  { name: "Innsbruck Hauptbahnhof", city: "Innsbruck", kind: "station" },
  { name: "Graz Hauptbahnhof", city: "Graz", kind: "station" },
  { name: "Linz Hauptbahnhof", city: "Linz", kind: "station" },
  { name: "Klagenfurt Hauptbahnhof", city: "Klagenfurt", kind: "station" },
  { name: "Villach Hauptbahnhof", city: "Villach", kind: "station" },
  { name: "Zurigo Hauptbahnhof", city: "Zurigo", kind: "station" },
  { name: "Ginevra Cornavin", city: "Ginevra", kind: "station" },
  { name: "Berna", city: "Berna", kind: "station" },
  { name: "Basilea SBB", city: "Basilea", kind: "station" },
  { name: "Losanna", city: "Losanna", kind: "station" },
  { name: "Lucerna", city: "Lucerna", kind: "station" },
  { name: "San Gallo", city: "San Gallo", kind: "station" },
  { name: "Lugano", city: "Lugano", kind: "station" },
  { name: "Winterthur", city: "Winterthur", kind: "station" },
  { name: "Bellinzona", city: "Bellinzona", kind: "station" },

  // ── Stazioni europee — Benelux ──────────────────────────────────────────
  { name: "Bruxelles Midi", city: "Bruxelles", kind: "station" },
  { name: "Bruxelles Nord", city: "Bruxelles", kind: "station" },
  { name: "Anversa Centraal", city: "Anversa", kind: "station" },
  { name: "Gand Sint-Pieters", city: "Gand", kind: "station" },
  { name: "Liegi Guillemins", city: "Liegi", kind: "station" },
  { name: "Bruges", city: "Bruges", kind: "station" },
  { name: "Amsterdam Centraal", city: "Amsterdam", kind: "station" },
  { name: "Rotterdam Centraal", city: "Rotterdam", kind: "station" },
  { name: "Utrecht Centraal", city: "Utrecht", kind: "station" },
  { name: "L'Aia Centraal", city: "L'Aia", kind: "station" },
  { name: "Eindhoven", city: "Eindhoven", kind: "station" },
  { name: "Tilburg", city: "Tilburg", kind: "station" },
  { name: "Groningen", city: "Groningen", kind: "station" },
  { name: "Breda", city: "Breda", kind: "station" },
  { name: "Nijmegen", city: "Nimega", kind: "station" },
  { name: "Arnhem Centraal", city: "Arnhem", kind: "station" },
  { name: "Enschede", city: "Enschede", kind: "station" },
  { name: "Lussemburgo", city: "Lussemburgo", kind: "station" },

  // ── Stazioni europee — Regno Unito ─────────────────────────────────────
  { name: "Londra St Pancras", city: "Londra", kind: "station" },
  { name: "Londra Waterloo", city: "Londra", kind: "station" },
  { name: "Londra Paddington", city: "Londra", kind: "station" },
  { name: "Londra Liverpool Street", city: "Londra", kind: "station" },
  { name: "Londra Victoria", city: "Londra", kind: "station" },
  { name: "Manchester Piccadilly", city: "Manchester", kind: "station" },
  { name: "Birmingham New Street", city: "Birmingham", kind: "station" },
  { name: "Leeds", city: "Leeds", kind: "station" },
  { name: "Edimburgo Waverley", city: "Edimburgo", kind: "station" },
  { name: "Glasgow Central", city: "Glasgow", kind: "station" },
  { name: "Bristol Temple Meads", city: "Bristol", kind: "station" },
  { name: "Liverpool Lime Street", city: "Liverpool", kind: "station" },
  { name: "Sheffield", city: "Sheffield", kind: "station" },
  { name: "Newcastle Central", city: "Newcastle", kind: "station" },
  { name: "Cardiff Central", city: "Cardiff", kind: "station" },
  { name: "Norwich", city: "Norwich", kind: "station" },
  { name: "Nottingham", city: "Nottingham", kind: "station" },
  { name: "Leicester", city: "Leicester", kind: "station" },
  { name: "Coventry", city: "Coventry", kind: "station" },
  { name: "Southampton Central", city: "Southampton", kind: "station" },
  { name: "Brighton", city: "Brighton", kind: "station" },
  { name: "Reading", city: "Reading", kind: "station" },
  { name: "Plymouth", city: "Plymouth", kind: "station" },
  { name: "Exeter St Davids", city: "Exeter", kind: "station" },
  { name: "York", city: "York", kind: "station" },
  { name: "Cambridge", city: "Cambridge", kind: "station" },
  { name: "Oxford", city: "Oxford", kind: "station" },
  { name: "Aberdeen", city: "Aberdeen", kind: "station" },
  { name: "Dundee", city: "Dundee", kind: "station" },
  { name: "Dublino Heuston", city: "Dublino", kind: "station" },
  { name: "Dublino Connolly", city: "Dublino", kind: "station" },
  { name: "Cork Kent", city: "Cork", kind: "station" },

  // ── Stazioni europee — Scandinavia ─────────────────────────────────────
  { name: "Stoccolma Centrale", city: "Stoccolma", kind: "station" },
  { name: "Göteborg Centrale", city: "Göteborg", kind: "station" },
  { name: "Malmö Centrale", city: "Malmö", kind: "station" },
  { name: "Uppsala Centrale", city: "Uppsala", kind: "station" },
  { name: "Copenaghen H", city: "Copenaghen", kind: "station" },
  { name: "Aarhus", city: "Aarhus", kind: "station" },
  { name: "Odense", city: "Odense", kind: "station" },
  { name: "Oslo S", city: "Oslo", kind: "station" },
  { name: "Bergen", city: "Bergen", kind: "station" },
  { name: "Stavanger", city: "Stavanger", kind: "station" },
  { name: "Helsinki Centrale", city: "Helsinki", kind: "station" },
  { name: "Tampere", city: "Tampere", kind: "station" },
  { name: "Turku", city: "Turku", kind: "station" },
  { name: "Oulu", city: "Oulu", kind: "station" },

  // ── Stazioni europee — Polonia ──────────────────────────────────────────
  { name: "Varsavia Centralna", city: "Varsavia", kind: "station" },
  { name: "Cracovia Główny", city: "Cracovia", kind: "station" },
  { name: "Wrocław Główny", city: "Breslavia", kind: "station" },
  { name: "Poznań Główny", city: "Poznań", kind: "station" },
  { name: "Danzica Główny", city: "Danzica", kind: "station" },
  { name: "Katowice", city: "Katowice", kind: "station" },
  { name: "Łódź Fabryczna", city: "Łódź", kind: "station" },
  { name: "Lublin Główny", city: "Lublino", kind: "station" },
  { name: "Białystok", city: "Białystok", kind: "station" },
  { name: "Szczecin Główny", city: "Stettino", kind: "station" },
  { name: "Bydgoszcz Główna", city: "Bydgoszcz", kind: "station" },
  { name: "Toruń Główny", city: "Toruń", kind: "station" },
  { name: "Rzeszów Główny", city: "Rzeszów", kind: "station" },

  // ── Stazioni europee — Rep. Ceca, Slovacchia, Ungheria ─────────────────
  { name: "Praga Hlavní nádraží", city: "Praga", kind: "station" },
  { name: "Brno Hlavní nádraží", city: "Brno", kind: "station" },
  { name: "Ostrava Hlavní nádraží", city: "Ostrava", kind: "station" },
  { name: "Bratislava Hlavná stanica", city: "Bratislava", kind: "station" },
  { name: "Budapest Keleti", city: "Budapest", kind: "station" },
  { name: "Budapest Nyugati", city: "Budapest", kind: "station" },
  { name: "Debrecen", city: "Debrecen", kind: "station" },
  { name: "Miskolc", city: "Miskolc", kind: "station" },
  { name: "Győr", city: "Győr", kind: "station" },
  { name: "Pécs", city: "Pécs", kind: "station" },

  // ── Stazioni europee — Romania, Bulgaria, Grecia ────────────────────────
  { name: "Bucarest Nord", city: "Bucarest", kind: "station" },
  { name: "Cluj-Napoca", city: "Cluj-Napoca", kind: "station" },
  { name: "Timișoara Nord", city: "Timișoara", kind: "station" },
  { name: "Iași", city: "Iași", kind: "station" },
  { name: "Brașov", city: "Brașov", kind: "station" },
  { name: "Craiova", city: "Craiova", kind: "station" },
  { name: "Costanza", city: "Costanza", kind: "station" },
  { name: "Sofia Centrale", city: "Sofia", kind: "station" },
  { name: "Plovdiv", city: "Plovdiv", kind: "station" },
  { name: "Varna", city: "Varna", kind: "station" },
  { name: "Salonicco", city: "Salonicco", kind: "station" },
  { name: "Larissa", city: "Larissa", kind: "station" },

  // ── Stazioni europee — Paesi Baltici e Est Europa ───────────────────────
  { name: "Riga Centrale", city: "Riga", kind: "station" },
  { name: "Tallinn Balti jaam", city: "Tallinn", kind: "station" },
  { name: "Vilnius", city: "Vilnius", kind: "station" },
  { name: "Minsk Centrale", city: "Minsk", kind: "station" },
  { name: "Kiev Pasazhyrskyi", city: "Kiev", kind: "station" },
  { name: "Leopoli Centrale", city: "Leopoli", kind: "station" },
  { name: "Chișinău Centrale", city: "Chișinău", kind: "station" },

  // ── Stazioni europee — Balcani ───────────────────────────────────────────
  { name: "Ljubljana", city: "Lubiana", kind: "station" },
  { name: "Maribor", city: "Maribor", kind: "station" },
  { name: "Zagabria Glavni kolodvor", city: "Zagabria", kind: "station" },
  { name: "Spalato", city: "Spalato", kind: "station" },
  { name: "Rijeka", city: "Rijeka", kind: "station" },
  { name: "Sarajevo", city: "Sarajevo", kind: "station" },
  { name: "Belgrado Centrala", city: "Belgrado", kind: "station" },
  { name: "Novi Sad", city: "Novi Sad", kind: "station" },
  { name: "Niš", city: "Niš", kind: "station" },
  { name: "Skopje", city: "Skopje", kind: "station" },
  { name: "Tirana", city: "Tirana", kind: "station" },
  { name: "Podgorica", city: "Podgorica", kind: "station" },
  { name: "Istanbul Sirkeci", city: "Istanbul", kind: "station" },
  { name: "Ankara Garı", city: "Ankara", kind: "station" },
  { name: "Smirne Basmane", city: "Smirne", kind: "station" },
  { name: "Antalya", city: "Antalya", kind: "station" },
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

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

  /* Update dropdown position whenever it opens or user scrolls */
  useLayoutEffect(() => {
    if (!open || !inputRef.current) return;
    function updatePos() {
      if (!inputRef.current) return;
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownMaxH = 240;
      const openUpward = spaceBelow < dropdownMaxH + 8 && rect.top > dropdownMaxH;
      setDropdownStyle({
        position: "fixed",
        ...(openUpward
          ? { bottom: viewportHeight - rect.top + 4 }
          : { top: rect.bottom + 4 }),
        left: rect.left,
        width: rect.width,
        maxHeight: dropdownMaxH,
        zIndex: 9999,
      });
    }
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

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

  const dropdown = open && matches.length > 0
    ? (
        <div
          data-autocomplete-dropdown="true"
          style={{ ...dropdownStyle, overflowY: "auto" }}
          className="bg-white border border-gray-200 rounded-2xl shadow-2xl"
        >
          {matches.map((loc, i) => (
            <button
              key={i}
              type="button"
              onPointerDown={(e) => {
                // onPointerDown fires for BOTH mouse and touch, before blur.
                // preventDefault keeps the input focused so the Sheet doesn't
                // interpret this as an outside-click and close itself.
                e.preventDefault();
                handleSelect(loc);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 active:bg-gray-100 text-left border-b border-gray-100 last:border-0 transition-colors"
            >
              {loc.kind === "airport" ? (
                <Plane className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <TrainFront className="w-4 h-4 text-orange-500 shrink-0" />
              )}
              <div className="min-w-0">
                <span className="font-semibold text-gray-900">{loc.name}</span>
                {loc.code && <span className="ml-1.5 text-xs text-gray-500 font-mono">({loc.code})</span>}
                <p className="text-xs text-gray-500 mt-0.5">{loc.city}</p>
              </div>
            </button>
          ))}
        </div>
      )
    : null;

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
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
      {dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
