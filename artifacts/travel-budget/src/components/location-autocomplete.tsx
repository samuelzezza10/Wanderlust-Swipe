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
