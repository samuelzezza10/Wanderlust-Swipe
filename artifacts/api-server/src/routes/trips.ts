import { Router } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

interface DestinationData {
  destination: string;
  country: string;
  description: string;
  highlights: string[];
  tags: string[];
  imageUrl: string;
  aliases: string[];
  flightRequired: boolean; // island/overseas — no train option
  hotels: { budget: string[]; standard: string[]; luxury: string[]; apartments: string[] };
}

const DESTINATIONS: DestinationData[] = [
  {
    destination: "Rome",
    country: "Italy",
    description: "The Eternal City: 2800 years of history, iconic ruins, world-class art, and pasta that will ruin all future pasta for you.",
    highlights: ["Colosseum", "Vatican Museums", "Trevi Fountain", "Pantheon"],
    tags: ["culture", "history", "food", "romantic"],
    imageUrl: "/destinations/rome.png",
    flightRequired: false,
    aliases: ["roma", "rome", "fco", "ciampino", "termini", "tiburtina", "ostiense"],
    hotels: {
      budget: ["Hostel Campo de' Fiori", "Rome Budget Inn", "Trastevere Hostel", "Pigneto Backpackers"],
      standard: ["Hotel Quirinale", "Boutique Navona", "The Roman Terrace", "Hotel Locarno"],
      luxury: ["Hotel de Russie", "Hassler Roma", "St. Regis Rome", "Portrait Roma"],
      apartments: ["Trastevere Studio", "Navona Apartment", "Monti Loft", "Prati Flat"],
    },
  },
  {
    destination: "Milan",
    country: "Italy",
    description: "Italy's fashion and finance capital — Duomo architecture by day, aperitivo cocktails and designer shopping by night.",
    highlights: ["Duomo di Milano", "The Last Supper", "Brera District", "Galleria Vittorio Emanuele"],
    tags: ["fashion", "food", "culture", "city"],
    imageUrl: "/destinations/milan.png",
    flightRequired: false,
    aliases: ["milano", "milan", "mxp", "linate", "centrale", "garibaldi", "porta garibaldi", "lambrate"],
    hotels: {
      budget: ["Ostello Bello", "Milan Budget Stay", "The Zebra Hostel", "Navigli Hostel"],
      standard: ["Nhow Milano", "Brera Boutique Hotel", "Hotel Cavour", "Maison Milano"],
      luxury: ["Armani Hotel Milano", "Park Hyatt Milan", "Bulgari Hotel Milano", "Mandarin Oriental Milano"],
      apartments: ["Navigli Apartment", "Brera Studio", "Isola Loft", "Tortona Flat"],
    },
  },
  {
    destination: "Florence",
    country: "Italy",
    description: "The cradle of the Renaissance: Michelangelo's David, Brunelleschi's Dome, and bistecca fiorentina thicker than your wrist.",
    highlights: ["Uffizi Gallery", "Florence Cathedral", "Ponte Vecchio", "Piazzale Michelangelo"],
    tags: ["art", "culture", "history", "romantic"],
    imageUrl: "/destinations/florence.png",
    flightRequired: false,
    aliases: ["firenze", "florence", "flo", "smn", "santa maria novella", "campo di marte", "peretola"],
    hotels: {
      budget: ["Academy Hostel", "Firenze Budget Inn", "Oltrarno Hostel", "Santa Croce Hostel"],
      standard: ["Hotel Davanzati", "Rivoli Boutique Hotel", "Palazzo Guadagni", "Hotel Orto de' Medici"],
      luxury: ["Portrait Firenze", "Lungarno Suites", "Continentale Hotel", "Four Seasons Florence"],
      apartments: ["Oltrarno Studio", "Santa Croce Apartment", "Bardini Loft", "Duomo View Flat"],
    },
  },
  {
    destination: "Venice",
    country: "Italy",
    description: "The floating city: gondolas, labyrinthine canals, Carnival masks, and zero cars. Getting lost here is mandatory.",
    highlights: ["Grand Canal", "St. Mark's Basilica", "Doge's Palace", "Burano Island"],
    tags: ["romantic", "culture", "scenic", "unique"],
    imageUrl: "/destinations/venice.png",
    flightRequired: false,
    aliases: ["venezia", "venice", "vce", "marco polo", "santa lucia", "mestre", "treviso", "treviso airport"],
    hotels: {
      budget: ["Generator Venice", "Foresteria Valdese", "Venice Hostel", "Cannaregio Budget Stay"],
      standard: ["Hotel Danieli Classic", "Ca' Sagredo", "Palazzo Barbarigo", "Hotel Giorgione"],
      luxury: ["Belmond Hotel Cipriani", "Gritti Palace", "Aman Venice", "The St. Regis Venice"],
      apartments: ["Cannaregio Apartment", "Dorsoduro Studio", "San Polo Loft", "Castello Flat"],
    },
  },
  {
    destination: "Naples",
    country: "Italy",
    description: "The birthplace of pizza, home of Vesuvius, gateway to the Amalfi Coast — chaotic, loud, and utterly unforgettable.",
    highlights: ["Pompeii", "Pizza Margherita", "Castel Nuovo", "Spaccanapoli"],
    tags: ["food", "history", "culture", "adventure"],
    imageUrl: "/destinations/naples.png",
    flightRequired: false,
    aliases: ["napoli", "naples", "nap", "capodichino", "centrale napoli", "naples central"],
    hotels: {
      budget: ["Spaccanapoli Hostel", "Naples Budget Inn", "Quartieri Spagnoli Stay", "Vomero Hostel"],
      standard: ["Grand Hotel Vesuvio Classic", "Hotel Piazza Bellini", "Romeo Boutique", "Palazzo Decumani"],
      luxury: ["Grand Hotel Parker's", "Palazzo Caracciolo", "Hotel Santa Lucia", "Romeo Hotel"],
      apartments: ["Chiaia Apartment", "Posillipo Studio", "Vomero Loft", "Tondo di Capodimonte Flat"],
    },
  },
  {
    destination: "Turin",
    country: "Italy",
    description: "Italy's automotive soul, birthplace of Fiat and the Shroud — elegant Baroque squares and the best chocolate in Europe.",
    highlights: ["Mole Antonelliana", "Egyptian Museum", "Royal Palace", "Piazza Castello"],
    tags: ["culture", "food", "history", "city"],
    imageUrl: "/destinations/turin.png",
    flightRequired: false,
    aliases: ["torino", "turin", "tro", "caselle", "porta nuova", "porta susa"],
    hotels: {
      budget: ["Turin Hostel", "Porta Nuova Budget Inn", "Crocetta Stay"],
      standard: ["Hotel Victoria Torino", "NH Lingotto", "Hotel Boston Torino"],
      luxury: ["Golden Palace Torino", "NH Collection Torino Piazza Carlina", "Principi di Piemonte"],
      apartments: ["Vanchiglia Studio", "San Salvario Loft", "Crocetta Apartment"],
    },
  },
  {
    destination: "Bologna",
    country: "Italy",
    description: "La Grassa, La Dotta, La Rossa — fat, learned and red: mortadella, the oldest university, and terracotta porticoes.",
    highlights: ["Two Towers", "Basilica di San Petronio", "Piazza Maggiore", "Porticoes of Bologna"],
    tags: ["food", "culture", "university", "city"],
    imageUrl: "/destinations/bologna.png",
    flightRequired: false,
    aliases: ["bologna", "blq", "marconi", "centrale bologna", "bologna centrale"],
    hotels: {
      budget: ["Al Cappello Rosso Hostel", "Bologna Budget Inn", "Due Torri Hostel"],
      standard: ["Hotel Internazionale Bologna", "Grand Hotel Majestic", "Art Hotel Orologio"],
      luxury: ["I Portici Hotel", "Grand Hotel Majestic già Baglioni", "Savoia Hotel Regency"],
      apartments: ["Quadrilatero Apartment", "Bolognina Studio", "Santo Stefano Loft"],
    },
  },
  {
    destination: "Paris",
    country: "France",
    description: "The City of Light awaits with world-class cuisine, iconic landmarks, and unmatched romance.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre"],
    tags: ["romantic", "culture", "food", "art"],
    imageUrl: "/destinations/paris.png",
    flightRequired: false,
    aliases: ["paris", "parigi", "cdg", "orly", "gare du nord", "gare de lyon", "gare de l'est", "paris nord"],
    hotels: {
      budget: ["Generator Paris", "St Christopher's Inn", "Oops Paris Hostel", "BVJ Paris"],
      standard: ["Grand Hotel Metropole", "Boutique Lumière", "The Urban Lodge", "Hotel du Temps"],
      luxury: ["Four Seasons Paris", "Le Bristol Paris", "Ritz Paris", "Plaza Athénée"],
      apartments: ["Studio Montmartre", "Appartement Marais", "Loft République", "Pigalle Studio"],
    },
  },
  {
    destination: "Barcelona",
    country: "Spain",
    description: "Gaudí's architectural masterpieces, lively tapas bars, and sun-kissed Mediterranean beaches.",
    highlights: ["Sagrada Família", "Park Güell", "Las Ramblas", "Gothic Quarter"],
    tags: ["culture", "food", "beach", "architecture"],
    imageUrl: "/destinations/barcelona.png",
    flightRequired: false,
    aliases: ["barcelona", "barcellona", "bcn", "el prat", "sants", "passeig de gracia", "barcelona sants"],
    hotels: {
      budget: ["Barcelona Hostel", "Gothic Budget Inn", "Barceloneta Hostel", "Kabul Party Hostel"],
      standard: ["Barcelona Modernisme", "Gothic Quarter Inn", "Barceloneta Suites", "Hotel Praktik Rambla"],
      luxury: ["Hotel Arts Barcelona", "W Barcelona", "Mandarin Oriental Barcelona", "Majestic Hotel Barcelona"],
      apartments: ["Eixample Apartment", "Born Studio", "Gràcia Loft", "Barceloneta Flat"],
    },
  },
  {
    destination: "Madrid",
    country: "Spain",
    description: "Velázquez, flamenco, churros with chocolate, and nightlife that starts when Paris goes to bed.",
    highlights: ["Prado Museum", "Retiro Park", "Gran Vía", "El Rastro Market"],
    tags: ["culture", "food", "nightlife", "art"],
    imageUrl: "/destinations/madrid.png",
    flightRequired: false,
    aliases: ["madrid", "mad", "barajas", "adolfo suarez", "atocha", "chamartin", "madrid atocha"],
    hotels: {
      budget: ["The Hat Madrid", "Cats Hostel", "Artiem Madrid", "Way Hostel"],
      standard: ["Hotel Único", "Only You Hotel", "Hyatt Regency Hesperia", "Vincci Soho"],
      luxury: ["Hotel Ritz", "Four Seasons Madrid", "Villa Magna", "Mandarin Oriental Ritz"],
      apartments: ["Malasaña Studio", "Chueca Apartment", "La Latina Loft", "Lavapiés Flat"],
    },
  },
  {
    destination: "Lisbon",
    country: "Portugal",
    description: "A sun-drenched city of colorful tiles, Fado music, and breathtaking hilltop views.",
    highlights: ["Alfama District", "Belem Tower", "Sintra Day Trip", "LX Factory"],
    tags: ["culture", "food", "scenic", "affordable"],
    imageUrl: "/destinations/lisbon.png",
    flightRequired: false,
    aliases: ["lisbon", "lisbona", "lis", "humberto delgado", "santa apolonia", "oriente", "rossio"],
    hotels: {
      budget: ["Lisbon Budget Stay", "Alfama Hostel", "Central Lisbon Inn", "Sunset Destination Hostel"],
      standard: ["Lisbon Heritage Hotel", "Alfama Terrace", "Belem River Lodge", "Santiago de Alfama"],
      luxury: ["Bairro Alto Hotel", "Memmo Alfama", "Four Seasons Ritz Lisbon", "Torel Palace"],
      apartments: ["Alfama Apartment", "Bairro Alto Studio", "Mouraria Loft", "Príncipe Real Flat"],
    },
  },
  {
    destination: "Porto",
    country: "Portugal",
    description: "Port wine cellars, azulejo tiles, and dramatic bridges over the Douro River.",
    highlights: ["Dom Luís I Bridge", "Livraria Lello", "Ribeira District", "Port Wine Cellars"],
    tags: ["culture", "wine", "scenic", "affordable"],
    imageUrl: "/destinations/porto.png",
    flightRequired: false,
    aliases: ["porto", "oporto", "opo", "sá carneiro", "campanha", "são bento", "porto sao bento"],
    hotels: {
      budget: ["Pilot Design Hostel", "Gallery Hostel", "Porto Budget Stay", "Yes! Porto Hostel"],
      standard: ["Torel 1884", "Hotel da Bolsa", "Maison Albar Hotels", "Vincci Porto"],
      luxury: ["Yeatman Hotel", "Infante Sagres", "Belas Artes Hotel", "Casa de Juste"],
      apartments: ["Ribeira Studio", "Bonfim Apartment", "Foz Loft", "Baixa Porto Flat"],
    },
  },
  {
    destination: "London",
    country: "United Kingdom",
    description: "Fish & chips, red double-deckers, Buckingham Palace, and pubs serving warm beer with cold charm.",
    highlights: ["Big Ben", "Tower of London", "British Museum", "Hyde Park"],
    tags: ["culture", "history", "city", "shopping"],
    imageUrl: "/destinations/london.png",
    flightRequired: false,
    aliases: ["london", "londra", "lhr", "gatwick", "stansted", "luton", "heathrow", "london victoria", "st pancras", "paddington", "london bridge", "waterloo"],
    hotels: {
      budget: ["Generator London", "YHA London", "Clink261 Hostel", "St. Christopher's Village"],
      standard: ["The Hoxton Shoreditch", "Z Hotel Soho", "Citizen M Tower", "Hotel Indigo London"],
      luxury: ["The Savoy", "Claridge's", "Four Seasons Park Lane", "The Connaught"],
      apartments: ["Shoreditch Studio", "Notting Hill Apartment", "Covent Garden Loft", "South Bank Flat"],
    },
  },
  {
    destination: "Amsterdam",
    country: "Netherlands",
    description: "Canals, tulips, Van Gogh, and the world's most beloved bicycle infrastructure.",
    highlights: ["Rijksmuseum", "Anne Frank House", "Canal Belt", "Vondelpark"],
    tags: ["culture", "scenic", "art", "city"],
    imageUrl: "/destinations/amsterdam.png",
    flightRequired: false,
    aliases: ["amsterdam", "ams", "schiphol", "centraal", "amsterdam centraal", "amsterdam airport"],
    hotels: {
      budget: ["Stayokay Amsterdam", "The Flying Pig", "ClinkNOORD Hostel", "Hans Brinker Budget Hotel"],
      standard: ["Hotel V Nesplein", "The Toren", "Kimpton de Witt", "Hotel Not Hotel"],
      luxury: ["Hotel Pulitzer", "Waldorf Astoria Amsterdam", "Conservatorium Hotel", "Soho House Amsterdam"],
      apartments: ["Jordaan Studio", "De Pijp Apartment", "Canal View Loft", "NDSM Flat"],
    },
  },
  {
    destination: "Prague",
    country: "Czech Republic",
    description: "Gothic spires, medieval Old Town, world-famous Czech beer, and a fairy-tale castle above the city.",
    highlights: ["Prague Castle", "Charles Bridge", "Old Town Square", "Josefov District"],
    tags: ["history", "culture", "affordable", "scenic"],
    imageUrl: "/destinations/prague.png",
    flightRequired: false,
    aliases: ["prague", "praga", "prg", "vaclav havel", "hlavni nadrazi", "holesovice"],
    hotels: {
      budget: ["Sir Toby's Hostel", "Post Hostel Prague", "Mosaic House", "Czech Inn"],
      standard: ["Hotel Josef", "Augustine Hotel", "Iron Gate Hotel", "Design Hotel Neruda"],
      luxury: ["Mandarin Oriental Prague", "Four Seasons Prague", "Hotel Aria", "Alcron Hotel"],
      apartments: ["Old Town Studio", "Vinohrady Apartment", "Malá Strana Loft", "Žižkov Flat"],
    },
  },
  {
    destination: "Vienna",
    country: "Austria",
    description: "Mozart, Klimt, Schnitzel and Sachertorte — Europe's most imperial city delivers culture by the kilo.",
    highlights: ["Schönbrunn Palace", "Kunsthistorisches Museum", "Opera House", "Naschmarkt"],
    tags: ["culture", "classical music", "food", "art"],
    imageUrl: "/destinations/vienna.png",
    flightRequired: false,
    aliases: ["vienna", "wien", "vie", "schwechat", "westbahnhof", "wien hauptbahnhof", "wien meidling"],
    hotels: {
      budget: ["Wombat's Vienna", "DO Step Inn", "Hostel Ruthensteiner", "Meininger Wien"],
      standard: ["Hotel Rathaus Wine", "Hollmann Beletage", "Fleming's Deluxe Hotel", "Hotel am Brillantengrund"],
      luxury: ["Hotel Sacher", "Imperial Hotel Vienna", "Grand Hotel Wien", "Palais Hansen Kempinski"],
      apartments: ["Innere Stadt Studio", "Leopoldstadt Apartment", "Naschmarkt Loft", "Neubau Flat"],
    },
  },
  {
    destination: "Budapest",
    country: "Hungary",
    description: "Twin cities on the Danube, thermal baths, ruin bars, and some of Europe's most stunning architecture.",
    highlights: ["Parliament Building", "Széchenyi Thermal Baths", "Fisherman's Bastion", "Ruin Bars"],
    tags: ["culture", "nightlife", "affordable", "scenic"],
    imageUrl: "/destinations/budapest.png",
    flightRequired: false,
    aliases: ["budapest", "bud", "ferihegy", "liszt ferenc", "keleti", "nyugati", "deli", "budapest keleti"],
    hotels: {
      budget: ["Maverick Hostel", "Retox Party Hostel", "Buda's Backpackers", "Unity Hostel"],
      standard: ["Aria Hotel Budapest", "Prestige Hotel", "Lanchid 19 Design Hotel", "Hotel Clark"],
      luxury: ["Four Seasons Gresham", "Kempinski Hotel Corvinus", "Matild Palace", "Dorothea Hotel"],
      apartments: ["Pest Studio", "Buda Castle Apartment", "Andrássy Loft", "Corvin Flat"],
    },
  },
  {
    destination: "Berlin",
    country: "Germany",
    description: "Art, history, techno clubs, and currywurst — the city that constantly reinvents itself.",
    highlights: ["Brandenburg Gate", "Berlin Wall Memorial", "Museum Island", "Alexanderplatz"],
    tags: ["culture", "nightlife", "history", "art"],
    imageUrl: "/destinations/berlin.png",
    flightRequired: false,
    aliases: ["berlin", "berlino", "ber", "tegel", "schonefeld", "hauptbahnhof berlin", "ostbahnhof", "berlin hbf"],
    hotels: {
      budget: ["Generator Berlin", "Circus Hostel", "EastSeven Berlin Hostel", "Meininger Berlin"],
      standard: ["Soho House Berlin", "Hotel de Rome", "Michelberger Hotel", "Provocateur Berlin"],
      luxury: ["Regent Berlin", "Adlon Kempinski", "Das Stue", "Rocco Forte Hotel de Rome"],
      apartments: ["Mitte Studio", "Prenzlauer Berg Apartment", "Kreuzberg Loft", "Neukölln Flat"],
    },
  },
  {
    destination: "Dubrovnik",
    country: "Croatia",
    description: "Game of Thrones' King's Landing in real life — a walled medieval city on the Adriatic's most dramatic cliffs.",
    highlights: ["Old Town Walls", "Fort Lovrijenac", "Lokrum Island", "Stradun"],
    tags: ["scenic", "history", "beach", "culture"],
    imageUrl: "/destinations/dubrovnik.png",
    flightRequired: true,
    aliases: ["dubrovnik", "ragusa", "dbv", "cilipi", "dubrovnik airport"],
    hotels: {
      budget: ["Dubrovnik Hostel", "Old Town Hostel", "Ragusa Budget Stay", "Full Moon Hostel"],
      standard: ["Hotel Excelsior", "Villa Orsula", "Boutique Hotel Stari Grad", "Hotel Lero"],
      luxury: ["Hotel Dubrovnik Palace", "Villa Dubrovnik", "Sun Gardens Dubrovnik", "Hotel Bellevue"],
      apartments: ["Old Town Apartment", "Lapad Studio", "Pile Gate Loft", "Ploče Flat"],
    },
  },
  {
    destination: "Santorini",
    country: "Greece",
    description: "Iconic blue-domed churches, volcanic beaches, and spectacular Aegean sunsets.",
    highlights: ["Oia Village", "Akrotiri Ruins", "Red Beach", "Caldera Views"],
    tags: ["romantic", "scenic", "beach", "luxury"],
    imageUrl: "/destinations/santorini.png",
    flightRequired: true,
    aliases: ["santorini", "thira", "jtr", "fira", "oia", "imerovigli", "akrotiri"],
    hotels: {
      budget: ["Santorini Guesthouse", "Aegean Budget Stay", "Oia Hostel", "Thira Budget Lodge"],
      standard: ["Santorini Dream Suites", "Caldera Blue Hotel", "Aegean Cliff Lodge", "Iliovasilema Suites"],
      luxury: ["Grace Hotel Santorini", "Canaves Oia", "Mystique Hotel", "Andronis Luxury Suites"],
      apartments: ["Oia Cave Apartment", "Fira Studio", "Imerovigli Loft", "Emporio Flat"],
    },
  },
  {
    destination: "Mykonos",
    country: "Greece",
    description: "Windmills, whitewashed houses, world-class beaches, and a nightlife scene that invented the concept of 'fashionably late'.",
    highlights: ["Little Venice", "Windmills", "Paradise Beach", "Chora Town"],
    tags: ["beach", "nightlife", "scenic", "luxury"],
    imageUrl: "/destinations/mykonos.png",
    flightRequired: true,
    aliases: ["mykonos", "jmk", "chora", "mykonos town", "mykonos airport"],
    hotels: {
      budget: ["Mykonos Budget Stay", "Chora Hostel", "Windmill Guesthouse"],
      standard: ["Mykonos No. 1", "Branco Mykonos", "Kivotos Hotel"],
      luxury: ["Mykonos Grand Hotel", "Bill & Coo Suites", "Cavo Tagoo"],
      apartments: ["Chora Studio", "Ornos Apartment", "Psarou Loft"],
    },
  },
  {
    destination: "Bali",
    country: "Indonesia",
    description: "A tropical paradise blending lush rice terraces, ancient temples, and pristine beaches.",
    highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Mount Batur"],
    tags: ["beach", "nature", "spiritual", "adventure"],
    imageUrl: "/destinations/bali.png",
    flightRequired: true,
    aliases: ["bali", "denpasar", "dps", "ngurah rai", "ubud", "seminyak", "kuta", "canggu", "nusa dua"],
    hotels: {
      budget: ["Backpacker Paradise Bali", "Bali Budget Lodge", "Eco Hostel Ubud", "Pinktomato Hostel"],
      standard: ["Sunset Paradise Resort", "Bali Eco Retreat", "Villa Lotus Ubud", "Alaya Resort"],
      luxury: ["Four Seasons Bali", "COMO Uma Ubud", "Amandari Resort", "Capella Ubud"],
      apartments: ["Bali Villa Ubud", "Canggu Apartment", "Seminyak Loft", "Pererenan Flat"],
    },
  },
  {
    destination: "Tokyo",
    country: "Japan",
    description: "Where ancient tradition meets ultramodern innovation in the world's most dynamic city.",
    highlights: ["Shibuya Crossing", "Senso-ji Temple", "Tsukiji Market", "Akihabara"],
    tags: ["culture", "food", "technology", "shopping"],
    imageUrl: "/destinations/tokyo.png",
    flightRequired: true,
    aliases: ["tokyo", "tokio", "nrt", "haneda", "narita", "shinjuku", "shibuya", "ueno", "akihabara", "asakusa"],
    hotels: {
      budget: ["Tokyo Budget Hotel", "Shinjuku Capsule Inn", "Asakusa Inn", "J-Hoppers Tokyo"],
      standard: ["Tokyo Garden Hotel", "Shinjuku Grand", "Akihabara Inn", "Dormy Inn Shinjuku"],
      luxury: ["Park Hyatt Tokyo", "Aman Tokyo", "The Peninsula Tokyo", "Andaz Tokyo"],
      apartments: ["Shinjuku Studio", "Harajuku Flat", "Akihabara Loft", "Shimokitazawa Apartment"],
    },
  },
  {
    destination: "Dubai",
    country: "UAE",
    description: "Futuristic skylines, world's tallest building, desert safaris, and gold-plated everything.",
    highlights: ["Burj Khalifa", "Dubai Mall", "Desert Safari", "Palm Jumeirah"],
    tags: ["luxury", "shopping", "architecture", "adventure"],
    imageUrl: "/destinations/dubai.png",
    flightRequired: true,
    aliases: ["dubai", "dxb", "dubai airport", "dubai international", "al maktoum"],
    hotels: {
      budget: ["Dubai Budget Inn", "Deira Hostel", "Al Rigga Budget Hotel", "Premier Inn Al Jaddaf"],
      standard: ["Rove Downtown", "Premier Inn Dubai", "Citymax Hotel Bur Dubai", "Copthorne Hotel"],
      luxury: ["Burj Al Arab", "Atlantis The Palm", "Four Seasons Dubai", "Jumeirah Zabeel Saray"],
      apartments: ["Downtown Dubai Studio", "Marina Apartment", "JBR Loft", "DIFC Flat"],
    },
  },
  {
    destination: "Maldives",
    country: "Maldives",
    description: "Crystal-clear turquoise waters, overwater bungalows, and pristine coral reefs.",
    highlights: ["Overwater Bungalows", "Snorkeling", "Sunset Cruises", "Dolphin Watching"],
    tags: ["luxury", "beach", "romantic", "nature"],
    imageUrl: "/destinations/maldives.png",
    flightRequired: true,
    aliases: ["maldives", "maldive", "mle", "male", "velana", "maledive"],
    hotels: {
      budget: ["Maldives Guesthouse Maafushi", "Island Budget Lodge", "Coral Hostel", "Kuredu Island"],
      standard: ["Overwater Paradise Villa", "Blue Lagoon Resort", "Coral Garden Lodge", "Safari Island Resort"],
      luxury: ["Soneva Jani", "Gili Lankanfushi", "Four Seasons Maldives", "Six Senses Laamu"],
      apartments: ["Maldives Beach House", "Lagoon Apartment", "Dhoni Loft", "Sandbank Villa"],
    },
  },
  {
    destination: "New York",
    country: "United States",
    description: "The city that never sleeps — a vertical metropolis of culture, food, and limitless energy.",
    highlights: ["Central Park", "Times Square", "Brooklyn Bridge", "The Met"],
    tags: ["city", "culture", "food", "shopping"],
    imageUrl: "/destinations/new-york.png",
    flightRequired: true,
    aliases: ["new york", "new york city", "nyc", "ny", "jfk", "laguardia", "newark", "manhattan", "brooklyn", "penn station", "new york penn"],
    hotels: {
      budget: ["NYC Budget Inn", "Manhattan Hostel", "Brooklyn B&B", "HI NYC Hostel"],
      standard: ["Manhattan View Hotel", "Brooklyn Boutique", "SoHo Grand Inn", "The Assemblage"],
      luxury: ["The Mark NYC", "Mandarin Oriental NY", "Four Seasons Manhattan", "The Peninsula New York"],
      apartments: ["SoHo Loft", "Brooklyn Apartment", "Midtown Studio", "West Village Flat"],
    },
  },
  {
    destination: "Marrakech",
    country: "Morocco",
    description: "Souks, spices, snake charmers, and breathtaking riads hidden behind plain walls.",
    highlights: ["Jemaa el-Fna", "Majorelle Garden", "The Medina", "Bahia Palace"],
    tags: ["culture", "adventure", "exotic", "food"],
    imageUrl: "/destinations/marrakech.png",
    flightRequired: true,
    aliases: ["marrakech", "marrakesh", "marrakesh menara", "rak", "menara", "marrakech menara"],
    hotels: {
      budget: ["Marrakech Budget Riad", "Medina Hostel", "Souk Backpackers", "Riad Monceau"],
      standard: ["Riad Be", "Riad 72", "Les Jardins de la Koutoubia", "Riad Kniza"],
      luxury: ["La Mamounia", "Royal Mansour", "Four Seasons Resort Marrakech", "Amanjena"],
      apartments: ["Medina Studio", "Gueliz Apartment", "Palmeraie Villa", "Hivernage Loft"],
    },
  },
];

const AIRLINES = ["Air France", "Ryanair", "Vueling", "EasyJet", "British Airways", "Lufthansa", "Emirates", "Qatar Airways", "ITA Airways", "Wizz Air", "Swiss", "KLM"];
const TRAINS = ["Eurostar", "TGV", "Thalys", "Renfe AVE", "Trenitalia", "Italo", "FlixTrain", "Railjet", "IC Bus"];

const BASE_AMENITIES = ["WiFi", "24h Reception"];

const FEATURE_PROBS = {
  budget: { free_cancellation: 0.3, breakfast: 0.15, parking: 0.2, private_bathroom: 0.5, elevator: 0.3, pet_friendly: 0.2, online_payment: 0.6, pool: 0.1, spa: 0.0, gym: 0.1 },
  standard: { free_cancellation: 0.55, breakfast: 0.45, parking: 0.5, private_bathroom: 0.85, elevator: 0.65, pet_friendly: 0.35, online_payment: 0.85, pool: 0.4, spa: 0.2, gym: 0.35 },
  luxury: { free_cancellation: 0.8, breakfast: 0.75, parking: 0.75, private_bathroom: 1.0, elevator: 0.9, pet_friendly: 0.5, online_payment: 1.0, pool: 0.9, spa: 0.85, gym: 0.8 },
};

function randomBetween(min: number, max: number) {
  if (min >= max) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fmt(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

type AccommodationType = "budget" | "standard" | "luxury" | null;
type Tier = "budget" | "standard" | "luxury";

function generateHotelFeatures(tier: Tier): { amenities: string[]; features: Set<string> } {
  const probs = FEATURE_PROBS[tier];
  const features = new Set<string>();
  const amenities = [...BASE_AMENITIES];
  for (const [feat, prob] of Object.entries(probs)) {
    if (Math.random() < prob) {
      features.add(feat);
      if (feat === "breakfast") amenities.push("Breakfast Included");
      else if (feat === "parking") amenities.push("Parking");
      else if (feat === "pool") amenities.push("Pool");
      else if (feat === "spa") amenities.push("Spa");
      else if (feat === "gym") amenities.push("Gym");
      else if (feat === "free_cancellation") amenities.push("Free Cancellation");
      else if (feat === "private_bathroom") amenities.push("Private Bathroom");
      else if (feat === "elevator") amenities.push("Elevator");
      else if (feat === "pet_friendly") amenities.push("Pets Allowed");
      else if (feat === "online_payment") amenities.push("Online Payment");
    }
  }
  return { amenities, features };
}

/* ─── City extraction & destination matching ─────────────────────────────── */

function extractCityName(location: string): string {
  if (!location || location === "Any") return "";
  return location
    .replace(/\([^)]*\)/g, "") // strip (XXX) airport codes
    .replace(/\b(airport|aeroporto|stazione|station|centrale|termini|international|intl|hauptbahnhof|hbf|gare|gare de|gare du)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(",")[0]
    .trim();
}

function matchDestination(arrivalLocation: string): DestinationData {
  if (!arrivalLocation || arrivalLocation === "Any") {
    return DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
  }

  const cleaned = extractCityName(arrivalLocation).toLowerCase();
  if (!cleaned) return DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];

  // 1. Exact alias match
  for (const dest of DESTINATIONS) {
    if (dest.aliases.some((a) => a.toLowerCase() === cleaned)) return dest;
  }

  // 2. Alias contains cleaned (or vice-versa)
  for (const dest of DESTINATIONS) {
    if (dest.aliases.some((a) => {
      const al = a.toLowerCase();
      return cleaned.includes(al) || al.includes(cleaned);
    })) return dest;
  }

  // 3. Destination name match
  for (const dest of DESTINATIONS) {
    const dname = dest.destination.toLowerCase();
    if (dname === cleaned || dname.includes(cleaned) || cleaned.includes(dname)) return dest;
  }

  // 4. Unknown city — generate dynamic destination
  return createDynamicDestination(extractCityName(arrivalLocation));
}

function createDynamicDestination(cityName: string): DestinationData {
  const name = cityName || "Unknown City";
  return {
    destination: name,
    country: "",
    description: `Discover the best of ${name} — culture, food, and unique local experiences await you.`,
    highlights: [`${name} City Center`, "Local Markets", "Historical District", "Scenic Viewpoints"],
    tags: ["culture", "adventure", "city"],
    imageUrl: "/destinations/default.png",
    flightRequired: false,
    aliases: [name.toLowerCase()],
    hotels: {
      budget: [`${name} Budget Hotel`, `City Hostel`, `${name} Inn`, `Central Hostel`],
      standard: [`${name} Central Hotel`, `Boutique ${name}`, `${name} Grand`, `Hotel du Parc`],
      luxury: [`${name} Palace Hotel`, `Grand Suite ${name}`, `Luxury Resort ${name}`, `The Grand ${name}`],
      apartments: [`${name} City Studio`, `Center Apartment`, `${name} Loft`, `Downtown Flat`],
    },
  };
}

/* ─── Trip generator ─────────────────────────────────────────────────────── */

function generateTrip(
  dest: DestinationData,
  departureCity: string,
  budget: number,
  numberOfPeople: number,
  numberOfNights: number,
  flightPreference: string,
  trainPreference: string,
  accommodationType: AccommodationType,
  propertyType: string,
  id: string,
  tripType: "one_way" | "round_trip" = "round_trip",
) {
  // ─── Budget is always TOTAL for the whole trip ────────────────
  const budgetPerPerson = Math.floor(budget / numberOfPeople);

  // ─── Accommodation tier ───────────────────────────────────────
  let stars: number;
  let hotelList: string[];
  let hotelShare: number;
  let tier: Tier;

  if (accommodationType === "budget") {
    stars = randomBetween(2, 3);
    hotelList = propertyType === "apartment" ? dest.hotels.apartments : dest.hotels.budget;
    hotelShare = 0.28;
    tier = "budget";
  } else if (accommodationType === "luxury") {
    stars = randomBetween(4, 5);
    hotelList = propertyType === "apartment" ? dest.hotels.apartments : dest.hotels.luxury;
    hotelShare = 0.55;
    tier = "luxury";
  } else {
    stars = randomBetween(3, 4);
    hotelList = propertyType === "apartment" ? dest.hotels.apartments : dest.hotels.standard;
    hotelShare = 0.42;
    tier = "standard";
  }

  // ─── Hotel cost (based on per-person budget share) ────────────
  const hotelBudgetPerPerson = Math.floor(budgetPerPerson * hotelShare);
  const maxPerNight = Math.max(25, Math.floor(hotelBudgetPerPerson / numberOfNights));
  const minPerNight = Math.max(15, Math.floor(maxPerNight * 0.55));
  const pricePerNight = randomBetween(minPerNight, maxPerNight);
  const hotelTotalPerPerson = pricePerNight * numberOfNights;

  // ─── Transport cost (per person) ─────────────────────────────
  const isOneWay = tripType === "one_way";
  const transportBudgetPerPerson = budgetPerPerson - hotelTotalPerPerson;
  if (transportBudgetPerPerson < 40) return null;

  // One-way: only one leg, so more budget headroom for outbound
  const maxOutbound = Math.floor(transportBudgetPerPerson * (isOneWay ? 0.88 : 0.52));
  const minOutbound = Math.max(20, Math.floor(transportBudgetPerPerson * (isOneWay ? 0.48 : 0.30)));
  if (maxOutbound < minOutbound) return null;

  const outboundPrice = randomBetween(minOutbound, maxOutbound);
  const returnPrice = isOneWay ? 0 : Math.floor(outboundPrice * (0.80 + Math.random() * 0.35));
  const totalTransportPerPerson = outboundPrice + returnPrice;
  const totalPerPerson = totalTransportPerPerson + hotelTotalPerPerson;

  // ─── STRICT budget check: total price MUST NOT exceed budget ──
  const totalPrice = Math.round(totalPerPerson * numberOfPeople);
  const hotelTotalCost = Math.round(hotelTotalPerPerson * numberOfPeople);
  if (totalPrice > budget) return null;

  // ─── Transport type — flight vs train ─────────────────────────
  // Train not available for islands / overseas; flight always available
  const trainPossible = !dest.flightRequired && trainPreference !== "direct"; // never force "direct train" for overseas
  const useTrainRandom = trainPossible && Math.random() > 0.55;

  let transportType: "flight" | "train";
  if (flightPreference !== "any" || dest.flightRequired) {
    transportType = "flight";
  } else if (trainPreference !== "any" && trainPossible) {
    transportType = "train";
  } else {
    transportType = useTrainRandom ? "train" : "flight";
  }

  const isDirect = flightPreference === "direct" || trainPreference === "direct" ||
    ((flightPreference !== "with_stops" && trainPreference !== "with_stops") && Math.random() > 0.4);
  const isReturnDirect = flightPreference === "direct" || trainPreference === "direct" ||
    ((flightPreference !== "with_stops" && trainPreference !== "with_stops") && Math.random() > 0.4);

  const getCompany = () =>
    transportType === "train"
      ? TRAINS[randomBetween(0, TRAINS.length - 1)]
      : AIRLINES[randomBetween(0, AIRLINES.length - 1)];

  // Outbound
  const outDurH = randomBetween(1, transportType === "train" ? 8 : 14);
  const outDurM = randomBetween(0, 59);
  const outDepH = randomBetween(5, 22);
  const outArrH = (outDepH + outDurH) % 24;

  // Return
  const retDurH = randomBetween(1, transportType === "train" ? 8 : 14);
  const retDurM = randomBetween(0, 59);
  const retDepH = randomBetween(5, 22);
  const retArrH = (retDepH + retDurH) % 24;

  // ─── Hotel ────────────────────────────────────────────────────
  const hotelName = hotelList[randomBetween(0, hotelList.length - 1)];
  const { amenities: amenitySet, features } = generateHotelFeatures(tier);
  const distanceFromCenter = parseFloat((Math.random() * 4 + 0.3).toFixed(1));
  const transportToHotelKm = parseFloat((Math.random() * 28 + 2).toFixed(1));
  const ratingMin = tier === "luxury" ? 7.5 : tier === "standard" ? 6.0 : 3.5;
  const ratingMax = tier === "luxury" ? 10 : tier === "standard" ? 8.8 : 7.5;
  const rating = parseFloat((ratingMin + Math.random() * (ratingMax - ratingMin)).toFixed(1));

  const fromCity = departureCity || "origin";
  const company = getCompany();

  return {
    id,
    destination: dest.destination,
    country: dest.country,
    departureCity: fromCity,
    tripType,
    totalPrice,
    pricePerPerson: totalPerPerson,
    transport: {
      type: transportType,
      company,
      duration: `${outDurH}h ${outDurM}m`,
      price: outboundPrice,
      isDirect,
      departureTime: fmt(outDepH, randomBetween(0, 59)),
      arrivalTime: fmt(outArrH, randomBetween(0, 59)),
      from: fromCity,
      to: dest.destination,
    },
    ...(isOneWay ? {} : {
      returnTransport: {
        type: transportType,
        company: getCompany(),
        duration: `${retDurH}h ${retDurM}m`,
        price: returnPrice,
        isDirect: isReturnDirect,
        departureTime: fmt(retDepH, randomBetween(0, 59)),
        arrivalTime: fmt(retArrH, randomBetween(0, 59)),
        from: dest.destination,
        to: fromCity,
      },
    }),
    hotel: {
      name: hotelName,
      stars,
      pricePerNight,
      distanceFromCenter,
      amenities: amenitySet,
      rating,
      imageUrl: null,
    },
    hotelTotalCost,
    description: dest.description,
    highlights: dest.highlights,
    imageUrl: dest.imageUrl,
    durationDays: numberOfNights + 1,
    transportToHotelKm,
    tags: dest.tags,
    _features: features,
  };
}

/* ─── Route ──────────────────────────────────────────────────────────────── */

router.post("/trips/surprise", (req, res) => {
  const {
    budget = 2000,
    numberOfPeople = 2,
    numberOfNights = 7,
    flightPreference = "any",
    trainPreference = "any",
    departureLocation = "Any",
    accommodationType = null,
    propertyType = "any",
    hotelStarsMin = null,
    hotelStarsMax = null,
    minHotelRating = null,
  } = req.body;

  const cleanDeparture = extractCityName(departureLocation as string);

  // Pick 3 diverse random destinations from different countries/regions
  const shuffled = [...DESTINATIONS].sort(() => Math.random() - 0.5);
  const picked: DestinationData[] = [];
  const usedCountries = new Set<string>();

  for (const dest of shuffled) {
    if (picked.length >= 3) break;
    if (!usedCountries.has(dest.country)) {
      picked.push(dest);
      usedCountries.add(dest.country);
    }
  }
  // Fill remaining slots with any unused destination
  for (const dest of shuffled) {
    if (picked.length >= 3) break;
    if (!picked.includes(dest)) picked.push(dest);
  }

  const results: ReturnType<typeof generateTrip>[] = [];

  for (const dest of picked) {
    let found = false;
    for (let attempt = 0; attempt < 150 && !found; attempt++) {
      const trip = generateTrip(
        dest,
        cleanDeparture,
        budget,
        numberOfPeople,
        numberOfNights,
        flightPreference,
        trainPreference,
        accommodationType as AccommodationType,
        propertyType,
        `surprise-${Date.now()}-${attempt}`,
        "round_trip",
      );

      if (!trip) continue;
      if (trip.totalPrice > budget) continue;
      if (hotelStarsMin != null && trip.hotel.stars < hotelStarsMin) continue;
      if (hotelStarsMax != null && trip.hotel.stars > hotelStarsMax) continue;
      if (minHotelRating != null && trip.hotel.rating < minHotelRating) continue;

      const { _features, ...tripOut } = trip;
      results.push(tripOut as typeof trip);
      found = true;
    }
  }

  return res.json(results);
});

const FREE_SEARCH_LIMIT = 20;

router.post("/trips/generate", async (req, res) => {
  const {
    budget = 2000,
    numberOfPeople = 2,
    numberOfNights = 7,
    flightPreference = "any",
    trainPreference = "any",
    arrivalLocation = "Any",
    departureLocation = "Any",
    hotelDistanceKm = null,
    maxDistanceFromAirportKm = null,
    accommodationType = null,
    propertyType = "any",
    hotelAmenities = [],
    minHotelRating = null,
    hotelStarsMin = null,
    hotelStarsMax = null,
    tripType = "round_trip",
  } = req.body;

  // ─── Freemium: check search limit for authenticated users ──────
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (userId) {
    try {
      const { db, userPreferencesTable } = await import("@workspace/db");
      const { eq } = await import("drizzle-orm");

      const [prefs] = await db
        .select()
        .from(userPreferencesTable)
        .where(eq(userPreferencesTable.clerkUserId, userId));

      const count = prefs?.tripSearchCount ?? 0;
      const premium = prefs?.isPremium ?? false;

      if (!premium && count >= FREE_SEARCH_LIMIT) {
        return res.status(403).json({
          error: "limit_reached",
          searchCount: count,
          isPremium: false,
          freeLimit: FREE_SEARCH_LIMIT,
        });
      }
    } catch (err) {
      req.log.warn({ err }, "Error checking search limit — allowing request");
    }
  }

  // ─── Strict destination match ─────────────────────────────────
  const matchedDest = matchDestination(arrivalLocation as string);
  const cleanDeparture = extractCityName(departureLocation as string);

  // ─── Generate 20 variants of the SAME destination ────────────
  // Dedup key: hotel name + price band (allows same hotel at meaningfully different prices)
  const seenKeys = new Set<string>();
  const results: ReturnType<typeof generateTrip>[] = [];
  let attempts = 0;
  const MAX_ATTEMPTS = 400;

  while (results.length < 20 && attempts < MAX_ATTEMPTS) {
    attempts++;

    const trip = generateTrip(
      matchedDest,
      cleanDeparture,
      budget,
      numberOfPeople,
      numberOfNights,
      flightPreference,
      trainPreference,
      accommodationType as AccommodationType,
      propertyType,
      `trip-${Date.now()}-${attempts}`,
      tripType as "one_way" | "round_trip",
    );

    if (!trip) continue;
    // Allow same hotel only if total price differs by >5% (different room/conditions)
    const dedupKey = `${trip.hotel.name}|${Math.round(trip.totalPrice / (budget * 0.05))}`;
    if (seenKeys.has(dedupKey)) continue;

    // ─── Apply strict transport filters ─────────────────────────
    if (flightPreference === "direct" && trip.transport.type === "flight" && !trip.transport.isDirect) continue;
    if (flightPreference === "with_stops" && trip.transport.type === "flight" && trip.transport.isDirect) continue;
    if (trainPreference === "direct" && trip.transport.type === "train" && !trip.transport.isDirect) continue;
    if (trainPreference === "with_stops" && trip.transport.type === "train" && trip.transport.isDirect) continue;

    // ─── Apply strict hotel filters ──────────────────────────────
    if (hotelDistanceKm != null && trip.hotel.distanceFromCenter > hotelDistanceKm) continue;
    if (maxDistanceFromAirportKm != null && trip.transportToHotelKm > maxDistanceFromAirportKm) continue;
    if (accommodationType === "budget" && trip.hotel.stars > 3) continue;
    if (accommodationType === "standard" && (trip.hotel.stars < 3 || trip.hotel.stars > 4)) continue;
    if (accommodationType === "luxury" && trip.hotel.stars < 4) continue;
    if (hotelStarsMin != null && trip.hotel.stars < hotelStarsMin) continue;
    if (hotelStarsMax != null && trip.hotel.stars > hotelStarsMax) continue;
    if (minHotelRating != null && trip.hotel.rating < minHotelRating) continue;

    // ─── Amenity filters ──────────────────────────────────────────
    const requiredAmenities: string[] = Array.isArray(hotelAmenities) ? hotelAmenities : [];
    if (requiredAmenities.length > 0) {
      const hasAll = requiredAmenities.every((a: string) => trip._features.has(a));
      if (!hasAll) continue;
    }

    seenKeys.add(dedupKey);
    const { _features, ...tripOut } = trip;
    results.push(tripOut as typeof trip);
  }

  // ─── Freemium: increment search count (fire-and-forget) ───────
  if (userId && results.length > 0) {
    Promise.all([import("@workspace/db"), import("drizzle-orm")])
      .then(([{ db, userPreferencesTable }, { eq }]) =>
        db.select({ count: userPreferencesTable.tripSearchCount })
          .from(userPreferencesTable)
          .where(eq(userPreferencesTable.clerkUserId, userId!))
          .then(([row]) => {
            if (!row) return;
            return db.update(userPreferencesTable)
              .set({ tripSearchCount: (row.count ?? 0) + 1 })
              .where(eq(userPreferencesTable.clerkUserId, userId!));
          })
      )
      .catch(() => {});
  }

  return res.json(results);
});

router.get("/trips/stats", async (req, res) => {
  const auth = getAuth(req);
  const userId = auth?.userId;

  if (!userId) {
    return res.json({ totalSaved: 0, totalSpent: 0, topDestinations: [], averagePrice: 0, mostRecentTrip: null });
  }

  try {
    const { db } = await import("@workspace/db");
    const { savedTripsTable } = await import("@workspace/db");
    const { eq, desc } = await import("drizzle-orm");

    const trips = await db
      .select()
      .from(savedTripsTable)
      .where(eq(savedTripsTable.clerkUserId, userId))
      .orderBy(desc(savedTripsTable.createdAt));

    const totalSaved = trips.length;
    const totalSpent = trips.reduce((sum, t) => sum + parseFloat(String(t.totalPrice)), 0);
    const averagePrice = totalSaved > 0 ? totalSpent / totalSaved : 0;
    const topDestinations = [...new Set(trips.map((t) => t.destination))].slice(0, 3);
    const mostRecentTrip = trips[0]?.destination ?? null;

    return res.json({ totalSaved, totalSpent, topDestinations, averagePrice, mostRecentTrip });
  } catch {
    return res.json({ totalSaved: 0, totalSpent: 0, topDestinations: [], averagePrice: 0, mostRecentTrip: null });
  }
});

export default router;
