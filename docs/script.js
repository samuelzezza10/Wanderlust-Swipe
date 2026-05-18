'use strict';

/* ══════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════ */
const T = {
  it: {
    landingTitle: 'Viaggiare senza pensieri',
    landingSub: 'Scorri i suggerimenti di viaggio curati come una rivista patinata. Trova la tua prossima avventura d\'impulso.',
    landingStart: 'Inizia ora', landingLogin: 'Accedi', landingGuest: 'Continua come ospite',
    savedTitle: 'Viaggi Salvati', savedEmpty: 'Nessun viaggio salvato',
    savedEmptySub: 'Fai swipe verso destra sulle destinazioni che ti piacciono per salvarle qui.',
    goDiscover: 'Scopri destinazioni',
    profileTitle: 'Profilo', profileGuest: 'Ospite',
    profileSub: 'Accedi per salvare i tuoi viaggi nel cloud',
    statSaved: 'Salvati', statSeen: 'Visti', statSkip: 'Saltati',
    planName: 'Piano gratuito', planDesc: '20 ricerche al giorno',
    planUpgrade: '👑 Premium', privacy: 'Informativa sulla privacy',
    terms: 'Termini di servizio', reset: 'Reimposta tutto',
    navDiscover: 'Scopri', navPremium: 'Premium', navSaved: 'Salvati',
    navProfile: 'Profilo', navNotif: 'Notifiche',
    seenTitle: 'Hai visto tutto!', seenSub: 'Puoi ricominciare per trovare nuove destinazioni.',
    overview: 'Panoramica', highlights: 'Da non perdere',
    transportTitle: 'Trasporto', hotel: 'Hotel',
    nights: 'notti', people: 'persone', total: 'Totale',
    totalCost: 'COSTO TOTALE', departure: 'Partenza', arrival: 'Arrivo',
    direct: 'Diretto', withStops: 'Con fermate',
    bookTitle: 'Prenota ora', bookSub: 'Ti portiamo sui migliori siti di prenotazione',
    bookHotel: 'Prenota Hotel', bookFlight: 'Cerca Voli', bookTrain: 'Cerca Treni',
    shareTrip: 'Condividi', saveTrip: 'Salva viaggio',
    perDay: 'al giorno', premiumPrice: '€3/mese',
    premiumTitle: 'Passa a Premium', premiumSub: 'Sblocca tutto per soli €3/mese',
    perk1: '80 ricerche al giorno', perk2: 'Filtri avanzati sbloccati', perk3: 'Risultati AI prioritari',
    premiumCta: 'Abbonati — €3/mese', premiumFine: 'Annulla in qualsiasi momento · Nessun impegno',
    filterTitle: 'Filtri', fBudget: 'Budget totale (€)', fPeople: 'Numero di persone',
    fNights: 'Numero di notti', fDep: 'Partenza da', fDest: 'Destinazione (opzionale)',
    fType: 'Tipo viaggio', fReset: 'Reimposta', fApply: 'Applica',
    shareTitle: 'Condividi viaggio', copyText: 'Copia testo', copied: 'Copiato!',
    notifTitle: 'Notifiche', notifEmpty: 'Nessuna notifica',
    like: 'LIKE', nope: 'NOPE',
    oneWay: 'Solo andata', roundTrip: 'Andata e ritorno',
    toastSaved: (d) => `💾 ${d} salvato!`, toastSkip: '⏭ Saltato', toastUndo: '↩ Annullato',
  },
  en: {
    landingTitle: 'Travel without worries',
    landingSub: 'Swipe through curated trip suggestions like a glossy magazine. Find your next spontaneous adventure.',
    landingStart: 'Get started', landingLogin: 'Log in', landingGuest: 'Continue as guest',
    savedTitle: 'Saved Trips', savedEmpty: 'No saved trips',
    savedEmptySub: 'Swipe right on destinations you like to save them here.',
    goDiscover: 'Discover destinations',
    profileTitle: 'Profile', profileGuest: 'Guest',
    profileSub: 'Sign in to save your trips to the cloud',
    statSaved: 'Saved', statSeen: 'Seen', statSkip: 'Skipped',
    planName: 'Free plan', planDesc: '20 searches per day',
    planUpgrade: '👑 Premium', privacy: 'Privacy Policy',
    terms: 'Terms of Service', reset: 'Reset everything',
    navDiscover: 'Discover', navPremium: 'Premium', navSaved: 'Saved',
    navProfile: 'Profile', navNotif: 'Notifications',
    seenTitle: 'You\'ve seen everything!', seenSub: 'Restart to find new destinations.',
    overview: 'Overview', highlights: 'Must-see',
    transportTitle: 'Transport', hotel: 'Hotel',
    nights: 'nights', people: 'people', total: 'Total',
    totalCost: 'TOTAL COST', departure: 'Departure', arrival: 'Arrival',
    direct: 'Direct', withStops: 'With stops',
    bookTitle: 'Book now', bookSub: 'We take you to the best booking sites',
    bookHotel: 'Book Hotel', bookFlight: 'Search Flights', bookTrain: 'Search Trains',
    shareTrip: 'Share', saveTrip: 'Save trip',
    perDay: 'per day', premiumPrice: '€3/month',
    premiumTitle: 'Go Premium', premiumSub: 'Unlock everything for just €3/month',
    perk1: '80 searches per day', perk2: 'Advanced filters unlocked', perk3: 'Priority AI results',
    premiumCta: 'Subscribe — €3/month', premiumFine: 'Cancel anytime · No commitment',
    filterTitle: 'Filters', fBudget: 'Total budget (€)', fPeople: 'Number of people',
    fNights: 'Number of nights', fDep: 'Departure from', fDest: 'Destination (optional)',
    fType: 'Trip type', fReset: 'Reset', fApply: 'Apply',
    shareTitle: 'Share trip', copyText: 'Copy text', copied: 'Copied!',
    notifTitle: 'Notifications', notifEmpty: 'No notifications',
    like: 'LIKE', nope: 'NOPE',
    oneWay: 'One-way', roundTrip: 'Round-trip',
    toastSaved: (d) => `💾 ${d} saved!`, toastSkip: '⏭ Skipped', toastUndo: '↩ Undone',
  },
  es: {
    landingTitle: 'Viajar sin preocupaciones',
    landingSub: 'Desliza sugerencias de viaje curadas como una revista. Encuentra tu próxima aventura espontánea.',
    landingStart: 'Comenzar', landingLogin: 'Iniciar sesión', landingGuest: 'Continuar como invitado',
    savedTitle: 'Viajes Guardados', savedEmpty: 'Ningún viaje guardado',
    savedEmptySub: 'Desliza a la derecha en los destinos que te gustan para guardarlos aquí.',
    goDiscover: 'Descubrir destinos',
    profileTitle: 'Perfil', profileGuest: 'Invitado',
    profileSub: 'Inicia sesión para guardar tus viajes en la nube',
    statSaved: 'Guardados', statSeen: 'Vistos', statSkip: 'Saltados',
    planName: 'Plan gratuito', planDesc: '20 búsquedas al día',
    planUpgrade: '👑 Premium', privacy: 'Política de privacidad',
    terms: 'Términos de servicio', reset: 'Restablecer todo',
    navDiscover: 'Descubrir', navPremium: 'Premium', navSaved: 'Guardados',
    navProfile: 'Perfil', navNotif: 'Notificaciones',
    seenTitle: '¡Lo has visto todo!', seenSub: 'Reinicia para encontrar nuevos destinos.',
    overview: 'Descripción', highlights: 'No te pierdas',
    transportTitle: 'Transporte', hotel: 'Hotel',
    nights: 'noches', people: 'personas', total: 'Total',
    totalCost: 'COSTO TOTAL', departure: 'Salida', arrival: 'Llegada',
    direct: 'Directo', withStops: 'Con escalas',
    bookTitle: 'Reservar ahora', bookSub: 'Te llevamos a los mejores sitios de reserva',
    bookHotel: 'Reservar Hotel', bookFlight: 'Buscar Vuelos', bookTrain: 'Buscar Trenes',
    shareTrip: 'Compartir', saveTrip: 'Guardar viaje',
    perDay: 'al día', premiumPrice: '€3/mes',
    premiumTitle: 'Hazte Premium', premiumSub: 'Desbloquea todo por solo €3/mes',
    perk1: '80 búsquedas al día', perk2: 'Filtros avanzados desbloqueados', perk3: 'Resultados de IA prioritarios',
    premiumCta: 'Suscribirse — €3/mes', premiumFine: 'Cancela cuando quieras · Sin compromiso',
    filterTitle: 'Filtros', fBudget: 'Presupuesto total (€)', fPeople: 'Número de personas',
    fNights: 'Número de noches', fDep: 'Salida desde', fDest: 'Destino (opcional)',
    fType: 'Tipo de viaje', fReset: 'Restablecer', fApply: 'Aplicar',
    shareTitle: 'Compartir viaje', copyText: 'Copiar texto', copied: '¡Copiado!',
    notifTitle: 'Notificaciones', notifEmpty: 'Sin notificaciones',
    like: 'LIKE', nope: 'NOPE',
    oneWay: 'Solo ida', roundTrip: 'Ida y vuelta',
    toastSaved: (d) => `💾 ${d} guardado!`, toastSkip: '⏭ Saltado', toastUndo: '↩ Deshecho',
  },
  fr: {
    landingTitle: 'Voyager sans soucis',
    landingSub: 'Faites défiler des suggestions de voyages curatées. Trouvez votre prochaine aventure spontanée.',
    landingStart: 'Commencer', landingLogin: 'Se connecter', landingGuest: 'Continuer comme invité',
    savedTitle: 'Voyages Sauvegardés', savedEmpty: 'Aucun voyage sauvegardé',
    savedEmptySub: 'Glissez à droite sur les destinations que vous aimez pour les sauvegarder ici.',
    goDiscover: 'Découvrir des destinations',
    profileTitle: 'Profil', profileGuest: 'Invité',
    profileSub: 'Connectez-vous pour sauvegarder vos voyages dans le cloud',
    statSaved: 'Sauvegardés', statSeen: 'Vus', statSkip: 'Passés',
    planName: 'Plan gratuit', planDesc: '20 recherches par jour',
    planUpgrade: '👑 Premium', privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation', reset: 'Réinitialiser tout',
    navDiscover: 'Découvrir', navPremium: 'Premium', navSaved: 'Sauvegardés',
    navProfile: 'Profil', navNotif: 'Notifications',
    seenTitle: 'Vous avez tout vu !', seenSub: 'Recommencez pour trouver de nouvelles destinations.',
    overview: 'Aperçu', highlights: 'À ne pas manquer',
    transportTitle: 'Transport', hotel: 'Hôtel',
    nights: 'nuits', people: 'personnes', total: 'Total',
    totalCost: 'COÛT TOTAL', departure: 'Départ', arrival: 'Arrivée',
    direct: 'Direct', withStops: 'Avec escales',
    bookTitle: 'Réserver maintenant', bookSub: 'Nous vous emmenons sur les meilleurs sites de réservation',
    bookHotel: 'Réserver Hôtel', bookFlight: 'Chercher Vols', bookTrain: 'Chercher Trains',
    shareTrip: 'Partager', saveTrip: 'Sauvegarder',
    perDay: 'par jour', premiumPrice: '€3/mois',
    premiumTitle: 'Passer à Premium', premiumSub: 'Débloquez tout pour seulement €3/mois',
    perk1: '80 recherches par jour', perk2: 'Filtres avancés débloqués', perk3: 'Résultats IA prioritaires',
    premiumCta: 'S\'abonner — €3/mois', premiumFine: 'Annulez à tout moment · Sans engagement',
    filterTitle: 'Filtres', fBudget: 'Budget total (€)', fPeople: 'Nombre de personnes',
    fNights: 'Nombre de nuits', fDep: 'Départ de', fDest: 'Destination (optionnel)',
    fType: 'Type de voyage', fReset: 'Réinitialiser', fApply: 'Appliquer',
    shareTitle: 'Partager voyage', copyText: 'Copier le texte', copied: 'Copié !',
    notifTitle: 'Notifications', notifEmpty: 'Aucune notification',
    like: 'LIKE', nope: 'NOPE',
    oneWay: 'Aller simple', roundTrip: 'Aller-retour',
    toastSaved: (d) => `💾 ${d} sauvegardé !`, toastSkip: '⏭ Passé', toastUndo: '↩ Annulé',
  },
  de: {
    landingTitle: 'Reisen ohne Sorgen',
    landingSub: 'Entdecke kuratierte Reisevorschläge. Finde dein nächstes spontanes Abenteuer.',
    landingStart: 'Jetzt starten', landingLogin: 'Anmelden', landingGuest: 'Als Gast fortfahren',
    savedTitle: 'Gespeicherte Reisen', savedEmpty: 'Keine gespeicherten Reisen',
    savedEmptySub: 'Wische bei Reisezielen, die dir gefallen, nach rechts, um sie hier zu speichern.',
    goDiscover: 'Reiseziele entdecken',
    profileTitle: 'Profil', profileGuest: 'Gast',
    profileSub: 'Melde dich an, um deine Reisen in der Cloud zu speichern',
    statSaved: 'Gespeichert', statSeen: 'Gesehen', statSkip: 'Übersprungen',
    planName: 'Kostenloser Plan', planDesc: '20 Suchen pro Tag',
    planUpgrade: '👑 Premium', privacy: 'Datenschutzrichtlinie',
    terms: 'Nutzungsbedingungen', reset: 'Alles zurücksetzen',
    navDiscover: 'Entdecken', navPremium: 'Premium', navSaved: 'Gespeichert',
    navProfile: 'Profil', navNotif: 'Benachrichtigungen',
    seenTitle: 'Du hast alles gesehen!', seenSub: 'Starte neu, um neue Ziele zu finden.',
    overview: 'Übersicht', highlights: 'Sehenswürdigkeiten',
    transportTitle: 'Transport', hotel: 'Hotel',
    nights: 'Nächte', people: 'Personen', total: 'Gesamt',
    totalCost: 'GESAMTKOSTEN', departure: 'Abfahrt', arrival: 'Ankunft',
    direct: 'Direkt', withStops: 'Mit Umsteigen',
    bookTitle: 'Jetzt buchen', bookSub: 'Wir bringen dich zu den besten Buchungsseiten',
    bookHotel: 'Hotel buchen', bookFlight: 'Flüge suchen', bookTrain: 'Züge suchen',
    shareTrip: 'Teilen', saveTrip: 'Reise speichern',
    perDay: 'pro Tag', premiumPrice: '€3/Monat',
    premiumTitle: 'Zu Premium wechseln', premiumSub: 'Schalte alles für nur €3/Monat frei',
    perk1: '80 Suchen pro Tag', perk2: 'Erweiterte Filter freigeschaltet', perk3: 'KI-Prioritätsergebnisse',
    premiumCta: 'Abonnieren — €3/Monat', premiumFine: 'Jederzeit kündbar · Keine Verpflichtung',
    filterTitle: 'Filter', fBudget: 'Gesamtbudget (€)', fPeople: 'Anzahl der Personen',
    fNights: 'Anzahl der Nächte', fDep: 'Abfahrt von', fDest: 'Reiseziel (optional)',
    fType: 'Reisetyp', fReset: 'Zurücksetzen', fApply: 'Anwenden',
    shareTitle: 'Reise teilen', copyText: 'Text kopieren', copied: 'Kopiert!',
    notifTitle: 'Benachrichtigungen', notifEmpty: 'Keine Benachrichtigungen',
    like: 'LIKE', nope: 'NOPE',
    oneWay: 'Einfache Fahrt', roundTrip: 'Hin- und Rückfahrt',
    toastSaved: (d) => `💾 ${d} gespeichert!`, toastSkip: '⏭ Übersprungen', toastUndo: '↩ Rückgängig',
  },
  zh: {
    landingTitle: '无忧旅行',
    landingSub: '像翻阅精美杂志一样浏览精心策划的旅行建议。找到你的下一段冒险。',
    landingStart: '开始探索', landingLogin: '登录', landingGuest: '以访客身份继续',
    savedTitle: '已保存的旅行', savedEmpty: '没有保存的旅行',
    savedEmptySub: '向右滑动你喜欢的目的地，将其保存在这里。',
    goDiscover: '发现目的地',
    profileTitle: '个人资料', profileGuest: '访客',
    profileSub: '登录以将旅行保存到云端',
    statSaved: '已保存', statSeen: '已查看', statSkip: '已跳过',
    planName: '免费方案', planDesc: '每天20次搜索',
    planUpgrade: '👑 Premium', privacy: '隐私政策',
    terms: '服务条款', reset: '重置全部',
    navDiscover: '探索', navPremium: 'Premium', navSaved: '已保存',
    navProfile: '个人资料', navNotif: '通知',
    seenTitle: '您已看完全部！', seenSub: '重新开始以发现新目的地。',
    overview: '概览', highlights: '不可错过',
    transportTitle: '交通', hotel: '酒店',
    nights: '晚', people: '人', total: '总计',
    totalCost: '总费用', departure: '出发', arrival: '到达',
    direct: '直达', withStops: '有中转',
    bookTitle: '立即预订', bookSub: '我们带您去最佳预订网站',
    bookHotel: '预订酒店', bookFlight: '搜索航班', bookTrain: '搜索火车',
    shareTrip: '分享', saveTrip: '保存旅行',
    perDay: '每天', premiumPrice: '€3/月',
    premiumTitle: '升级至Premium', premiumSub: '仅需€3/月解锁全部功能',
    perk1: '每天80次搜索', perk2: '高级筛选器已解锁', perk3: 'AI优先结果',
    premiumCta: '订阅 — €3/月', premiumFine: '随时取消 · 无需承诺',
    filterTitle: '筛选', fBudget: '总预算 (€)', fPeople: '人数',
    fNights: '晚数', fDep: '出发地', fDest: '目的地（可选）',
    fType: '旅行类型', fReset: '重置', fApply: '应用',
    shareTitle: '分享旅行', copyText: '复制文本', copied: '已复制！',
    notifTitle: '通知', notifEmpty: '没有通知',
    like: '喜欢', nope: '跳过',
    oneWay: '单程', roundTrip: '往返',
    toastSaved: (d) => `💾 ${d} 已保存！`, toastSkip: '⏭ 已跳过', toastUndo: '↩ 已撤销',
  },
};

/* ══════════════════════════════════════════════════
   TRIP DATA
══════════════════════════════════════════════════ */
const TRIPS = [
  {
    id:'t1', destination:'Roma', country:'Italia', flag:'🇮🇹',
    description:'La Città Eterna ti aspetta con il Colosseo, il Vaticano, la Fontana di Trevi e una cucina straordinaria. Un viaggio nel tempo tra storia millenaria e vita moderna.',
    totalPrice:420, durationDays:4,
    image:'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=640&q=80',
    transport:{type:'train',company:'Trenitalia',duration:'2h 30m',departureTime:'07:45',arrivalTime:'10:15',isDirect:true,price:89},
    hotel:{name:'Hotel Pantheon Roma',stars:4,rating:8.6,pricePerNight:95,distanceFromCenter:0.4,amenities:['Wi-Fi','Colazione inclusa']},
    highlights:['Colosseo','Vaticano','Fontana di Trevi','Campo de\' Fiori'],
    tags:['storia','cultura','cibo','romantico'], tripType:'round_trip',
    caption:'🏛️ La Città Eterna ti chiama!',
  },
  {
    id:'t2', destination:'Barcellona', country:'Spagna', flag:'🇪🇸',
    description:'La capitale catalana unisce l\'architettura visionaria di Gaudí con spiagge meravigliose, tapas irresistibili e una vita notturna leggendaria.',
    totalPrice:580, durationDays:5,
    image:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=640&q=80',
    transport:{type:'flight',company:'Vueling',duration:'2h 10m',departureTime:'08:20',arrivalTime:'10:30',isDirect:true,price:120},
    hotel:{name:'Hotel Arts Barcelona',stars:5,rating:9.1,pricePerNight:130,distanceFromCenter:1.2,amenities:['Piscina','Wi-Fi','Spa']},
    highlights:['Sagrada Família','Park Güell','Las Ramblas','Barceloneta'],
    tags:['spiaggia','arte','cibo','nightlife'], tripType:'round_trip',
    caption:'🌊 Gaudí + spiagge = perfezione',
  },
  {
    id:'t3', destination:'Parigi', country:'Francia', flag:'🇫🇷',
    description:'La Ville Lumière: Tour Eiffel, Louvre, Montmartre, caffè sui boulevard. Romanticismo, alta cucina e moda in un\'unica città senza rivali.',
    totalPrice:650, durationDays:5,
    image:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=640&q=80',
    transport:{type:'train',company:'TGV / Eurostar',duration:'3h 45m',departureTime:'06:13',arrivalTime:'09:58',isDirect:true,price:145},
    hotel:{name:'Le Marais Boutique Hotel',stars:4,rating:8.8,pricePerNight:115,distanceFromCenter:1.8,amenities:['Wi-Fi','Bar']},
    highlights:['Torre Eiffel','Louvre','Notre-Dame','Montmartre'],
    tags:['romantico','arte','moda','cultura'], tripType:'round_trip',
    caption:'🗼 La città dell\'amore ti aspetta',
  },
  {
    id:'t4', destination:'Amsterdam', country:'Olanda', flag:'🇳🇱',
    description:'Canali pittoreschi, musei di fama mondiale come il Rijksmuseum e la casa di Anna Frank. Una città accogliente e ciclabile con un\'atmosfera unica.',
    totalPrice:490, durationDays:4,
    image:'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=640&q=80',
    transport:{type:'flight',company:'KLM',duration:'2h 20m',departureTime:'09:55',arrivalTime:'12:15',isDirect:true,price:98},
    hotel:{name:'Canal House Amsterdam',stars:4,rating:8.4,pricePerNight:105,distanceFromCenter:0.9,amenities:['Wi-Fi','Colazione']},
    highlights:['Rijksmuseum','Casa di Anna Frank','Vondelpark','Quartiere Jordaan'],
    tags:['cultura','arte','bici','canali'], tripType:'round_trip',
    caption:'🚲 In bici lungo i canali!',
  },
  {
    id:'t5', destination:'Praga', country:'Rep. Ceca', flag:'🇨🇿',
    description:'La città d\'oro: un centro storico medievale intatto, il Castello di Praga, ponti in pietra e una birra locale tra le migliori d\'Europa.',
    totalPrice:350, durationDays:4,
    image:'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=640&q=80',
    transport:{type:'flight',company:'Czech Airlines',duration:'1h 55m',departureTime:'11:30',arrivalTime:'13:25',isDirect:true,price:72},
    hotel:{name:'Old Town Square Hotel',stars:4,rating:8.7,pricePerNight:75,distanceFromCenter:0.2,amenities:['Wi-Fi','Bar','Colazione']},
    highlights:['Castello di Praga','Ponte Carlo','Piazza Città Vecchia','Vicolo d\'Oro'],
    tags:['storia','medievale','birra','economico'], tripType:'round_trip',
    caption:'🏰 Fiaba medievale a portata di volo',
  },
  {
    id:'t6', destination:'Vienna', country:'Austria', flag:'🇦🇹',
    description:'La capitale imperiale degli Asburgo: palazzi barocchi, caffè storici, Mozart, opera lirica e i musei più ricchi d\'Europa.',
    totalPrice:480, durationDays:4,
    image:'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=640&q=80',
    transport:{type:'train',company:'Railjet',duration:'4h 15m',departureTime:'07:05',arrivalTime:'11:20',isDirect:true,price:85},
    hotel:{name:'Hotel Imperial Vienna',stars:5,rating:9.3,pricePerNight:120,distanceFromCenter:0.7,amenities:['Concierge','Wi-Fi','Spa','Bar']},
    highlights:['Schönbrunn','Museo di Storia dell\'Arte','Opera di Stato','Ringstrasse'],
    tags:['imperiale','musica','arte','caffè'], tripType:'round_trip',
    caption:'🎶 Mozart e Sachertorte ti aspettano',
  },
  {
    id:'t7', destination:'Budapest', country:'Ungheria', flag:'🇭🇺',
    description:'La "Parigi dell\'Est" sul Danubio: terme termali, il grandioso Parlamento, il Castello di Buda e una scena culinaria in rapida crescita.',
    totalPrice:380, durationDays:4,
    image:'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=640&q=80',
    transport:{type:'flight',company:'Wizz Air',duration:'1h 50m',departureTime:'14:40',arrivalTime:'16:30',isDirect:true,price:65},
    hotel:{name:'Aria Hotel Budapest',stars:5,rating:9.4,pricePerNight:95,distanceFromCenter:0.3,amenities:['Rooftop Bar','Wi-Fi','Terme']},
    highlights:['Terme Széchenyi','Parlamento','Bastione dei Pescatori','Ruin Bar'],
    tags:['terme','danubio','storia','economico'], tripType:'round_trip',
    caption:'🛁 Terme e architettura a prezzo imbattibile',
  },
  {
    id:'t8', destination:'Lisbona', country:'Portogallo', flag:'🇵🇹',
    description:'Colline, tram gialli, Fado malinconico, pastéis de nata e l\'oceano Atlantico. Una capitale affascinante e sorprendentemente autentica.',
    totalPrice:440, durationDays:5,
    image:'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=640&q=80',
    transport:{type:'flight',company:'TAP Air Portugal',duration:'2h 40m',departureTime:'10:05',arrivalTime:'12:45',isDirect:true,price:88},
    hotel:{name:'Bairro Alto Hotel',stars:5,rating:9.0,pricePerNight:110,distanceFromCenter:0.5,amenities:['Terrazza','Wi-Fi','Bar']},
    highlights:['Belém','Alfama','Tram 28','Time Out Market'],
    tags:['oceano','fado','tram','autentica'], tripType:'round_trip',
    caption:'🚃 Il tram 28 è un\'esperienza imperdibile',
  },
  {
    id:'t9', destination:'Santorini', country:'Grecia', flag:'🇬🇷',
    description:'Case bianche con cupole blu affacciate sul mare vulcanico. I tramonti di Oia sono tra i più belli del mondo. Vino locale e romanticismo allo stato puro.',
    totalPrice:850, durationDays:6,
    image:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=640&q=80',
    transport:{type:'flight',company:'Aegean Airlines',duration:'1h 55m',departureTime:'09:30',arrivalTime:'11:25',isDirect:true,price:160},
    hotel:{name:'Canaves Oia Epitome',stars:5,rating:9.6,pricePerNight:195,distanceFromCenter:0.1,amenities:['Piscina Infinity','Wi-Fi','Spa']},
    highlights:['Oia al tramonto','Fira','Spiaggia Rossa','Caldera'],
    tags:['romantico','tramonti','isola','lusso'], tripType:'round_trip',
    caption:'🌅 Il tramonto più bello del mondo',
  },
  {
    id:'t10', destination:'Dubrovnik', country:'Croazia', flag:'🇭🇷',
    description:'La "Perla dell\'Adriatico": mura medievali sul mare cristallino, calli antiche e un\'atmosfera da Game of Thrones. Mare pulitissimo e cucina mediterranea.',
    totalPrice:520, durationDays:5,
    image:'https://images.unsplash.com/photo-1555990793-da11153b4b27?w=640&q=80',
    transport:{type:'flight',company:'Croatia Airlines',duration:'1h 30m',departureTime:'07:15',arrivalTime:'08:45',isDirect:true,price:95},
    hotel:{name:'Villa Orsula',stars:5,rating:9.1,pricePerNight:125,distanceFromCenter:0.8,amenities:['Spiaggia Privata','Wi-Fi','Ristorante']},
    highlights:['Mura cittadine','Città Vecchia','Isola di Lokrum','Cavo Slavo'],
    tags:['mare','medievale','adriatico','GoT'], tripType:'round_trip',
    caption:'⚔️ Winterfell o Dubrovnik? Entrambe!',
  },
  {
    id:'t11', destination:'Tokyo', country:'Giappone', flag:'🇯🇵',
    description:'La metropoli del futuro: neon di Shinjuku, templi di Asakusa, sushi di altissimo livello, anime, manga e la tecnologia più avanzata del pianeta.',
    totalPrice:1200, durationDays:10,
    image:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&q=80',
    transport:{type:'flight',company:'Japan Airlines',duration:'12h 30m',departureTime:'11:10',arrivalTime:'07:40',isDirect:true,price:580},
    hotel:{name:'Park Hyatt Tokyo',stars:5,rating:9.4,pricePerNight:280,distanceFromCenter:2.1,amenities:['Vista città','Piscina','Spa','Wi-Fi']},
    highlights:['Shinjuku','Tempio Senso-ji','Shibuya Crossing','Akihabara'],
    tags:['cultura','tecnologia','sushi','avventura'], tripType:'round_trip',
    caption:'🍜 Ramen, sushi e neon — benvenuto nel futuro',
  },
  {
    id:'t12', destination:'Bali', country:'Indonesia', flag:'🇮🇩',
    description:'L\'isola degli Dei: terrazze di riso, templi antichi tra la giungla, spiagge di sabbia nera, surf e spiritualità. Un\'oasi di pace tropicale.',
    totalPrice:980, durationDays:10,
    image:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=640&q=80',
    transport:{type:'flight',company:'Singapore Airlines',duration:'13h 55m',departureTime:'22:05',arrivalTime:'14:00',isDirect:false,price:520},
    hotel:{name:'COMO Uma Ubud',stars:5,rating:9.5,pricePerNight:165,distanceFromCenter:1.5,amenities:['Piscina Infinity','Yoga','Spa','Wi-Fi']},
    highlights:['Ubud','Terrazze di Tegallalang','Seminyak','Tanah Lot'],
    tags:['spiaggia','spirituale','surf','yoga'], tripType:'round_trip',
    caption:'🌺 Trova il tuo inner peace a Bali',
  },
  {
    id:'t13', destination:'Marrakech', country:'Marocco', flag:'🇲🇦',
    description:'I colori della medina, la magia di Jemaa el-Fna, i riad nascosti, i souq profumati di spezie. Un viaggio sensoriale alle porte del Sahara.',
    totalPrice:420, durationDays:5,
    image:'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=640&q=80',
    transport:{type:'flight',company:'Royal Air Maroc',duration:'2h 20m',departureTime:'13:45',arrivalTime:'16:05',isDirect:true,price:79},
    hotel:{name:'La Mamounia',stars:5,rating:9.3,pricePerNight:195,distanceFromCenter:0.3,amenities:['Piscina','Hammam','Giardini']},
    highlights:['Jemaa el-Fna','Souq','Giardini Majorelle','Bahia Palace'],
    tags:['cultura','deserto','spezie','avventura'], tripType:'round_trip',
    caption:'🌶️ Spezie, souq e tramonti sul deserto',
  },
  {
    id:'t14', destination:'Dubai', country:'Emirati Arabi', flag:'🇦🇪',
    description:'Il futuro nel deserto: il Burj Khalifa, centri commerciali da record, spiagge artificiali, safari nel deserto e lusso sfrenato.',
    totalPrice:950, durationDays:6,
    image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=640&q=80',
    transport:{type:'flight',company:'Emirates',duration:'5h 40m',departureTime:'02:20',arrivalTime:'08:00',isDirect:true,price:290},
    hotel:{name:'Atlantis The Palm',stars:5,rating:8.9,pricePerNight:220,distanceFromCenter:8.5,amenities:['Waterpark','Spiaggia Privata','Piscine','Wi-Fi']},
    highlights:['Burj Khalifa','Dubai Mall','Palm Jumeirah','Desert Safari'],
    tags:['lusso','moderno','deserto','shopping'], tripType:'round_trip',
    caption:'🏙️ Dove il futuro è già realtà',
  },
  {
    id:'t15', destination:'New York', country:'USA', flag:'🇺🇸',
    description:'La Grande Mela: Times Square, Central Park, i grattacieli di Manhattan, i musei più grandi del mondo e una scena gastronomica che non ha uguali.',
    totalPrice:1350, durationDays:8,
    image:'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=640&q=80',
    transport:{type:'flight',company:'Delta Airlines',duration:'9h 15m',departureTime:'10:25',arrivalTime:'14:40',isDirect:true,price:620},
    hotel:{name:'The Plaza Hotel',stars:5,rating:9.2,pricePerNight:280,distanceFromCenter:0.5,amenities:['Concierge','Spa','Bar','Wi-Fi']},
    highlights:['Central Park','Times Square','Brooklyn Bridge','MoMA'],
    tags:['metropoli','arte','shopping','grattacieli'], tripType:'round_trip',
    caption:'🗽 The city that never sleeps!',
  },
];

const CAPTIONS = [
  '🌍 La tua prossima avventura!', '✈️ Pronto a partire?', '🏖️ Meritati una pausa!',
  '🎒 L\'estate chiama!', '🗺️ Scopri il mondo con noi', '🌟 Un\'esperienza indimenticabile',
  '🚀 Parti subito!', '💫 Sogno o realtà? Entrambe!',
];

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
let lang = localStorage.getItem('wls_lang') || 'it';
let t = T[lang];
let currentPage = 'landing';
let prevPage = 'landing';
let currentIndex = 0;
let savedTrips = JSON.parse(localStorage.getItem('wls_saved') || '[]');
let seenCount = parseInt(localStorage.getItem('wls_seen') || '0');
let skipCount = parseInt(localStorage.getItem('wls_skip') || '0');
let swipeHistory = [];
let viewMode = 'swipe';
let currentDetailTrip = null;
let notifications = JSON.parse(localStorage.getItem('wls_notif') || '[]');
let filterState = { budget: 2000, people: 2, nights: 5, departure: '', arrival: '', tripType: 'round_trip' };

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */
function init() {
  applyLang();
  setLangActive();
  updateNavBadge();
  if (!localStorage.getItem('wls_cookie')) {
    setTimeout(() => document.getElementById('cookie-banner').classList.remove('hidden'), 800);
  }
}

/* ══════════════════════════════════════════════════
   LANGUAGE
══════════════════════════════════════════════════ */
function setLang(l) {
  lang = l;
  t = T[lang];
  localStorage.setItem('wls_lang', lang);
  applyLang();
  setLangActive();
  if (currentPage === 'discover') renderDeck();
}

function setLangActive() {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('lang-' + lang);
  if (btn) btn.classList.add('active');
}

function applyLang() {
  const ids = {
    't-landing-title': 'landingTitle', 't-landing-sub': 'landingSub',
    't-landing-start': 'landingStart', 't-landing-login': 'landingLogin',
    't-landing-guest': 'landingGuest',
    't-saved-title': 'savedTitle', 't-saved-empty': 'savedEmpty',
    't-saved-empty-sub': 'savedEmptySub', 't-go-discover': 'goDiscover',
    't-profile-title': 'profileTitle', 't-profile-guest': 'profileGuest',
    't-profile-sub': 'profileSub',
    't-stat-saved': 'statSaved', 't-stat-seen': 'statSeen', 't-stat-skip': 'statSkip',
    't-plan-name': 'planName', 't-plan-desc': 'planDesc', 't-plan-upgrade': 'planUpgrade',
    't-privacy': 'privacy', 't-terms': 'terms', 't-reset': 'reset',
    't-nav-discover': 'navDiscover', 't-nav-premium': 'navPremium',
    't-nav-saved': 'navSaved', 't-nav-profile': 'navProfile', 't-nav-notif': 'navNotif',
    't-seen-title': 'seenTitle', 't-seen-sub': 'seenSub',
    't-overview': 'overview', 't-highlights': 'highlights',
    't-transport-label': 'transportTitle', 't-hotel': 'hotel',
    't-nights': 'nights', 't-people': 'people', 't-total': 'total',
    't-total-cost': 'totalCost', 't-dep': 'departure', 't-arr': 'arrival',
    't-book-title': 'bookTitle', 't-book-sub': 'bookSub',
    't-share-trip': 'shareTrip', 't-save-trip': 'saveTrip',
    't-per-day': 'perDay', 't-per-day2': 'perDay', 't-premium-price': 'premiumPrice',
    't-premium-title': 'premiumTitle', 't-premium-sub': 'premiumSub',
    't-perk1': 'perk1', 't-perk2': 'perk2', 't-perk3': 'perk3',
    't-premium-cta': 'premiumCta', 't-premium-fine': 'premiumFine',
    't-filter-title': 'filterTitle', 't-f-budget': 'fBudget', 't-f-people': 'fPeople',
    't-f-nights': 'fNights', 't-f-dep': 'fDep', 't-f-dest': 'fDest',
    't-f-type': 'fType', 't-f-reset': 'fReset', 't-f-apply': 'fApply',
    't-share-title': 'shareTitle', 't-copy': 'copyText',
    't-notif-title': 'notifTitle', 't-notif-empty': 'notifEmpty',
  };
  for (const [id, key] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el && typeof t[key] === 'string') el.textContent = t[key];
  }
}

/* ══════════════════════════════════════════════════
   PAGE NAV
══════════════════════════════════════════════════ */
function showPage(page) {
  prevPage = currentPage;
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('page-active');
    p.style.display = '';
  });
  const el = document.getElementById('page-' + page);
  if (el) { el.classList.add('page-active'); el.style.display = 'flex'; }

  const nav = document.getElementById('bottom-nav');
  const showNav = page !== 'landing';
  nav.classList.toggle('hidden', !showNav);

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const nb = document.getElementById('nav-' + page);
  if (nb) nb.classList.add('active');

  currentPage = page;

  if (page === 'discover') renderDeck();
  if (page === 'saved') renderSaved();
  if (page === 'profile') renderProfile();
}

function goBack() {
  showPage(prevPage || 'landing');
}

/* ══════════════════════════════════════════════════
   DECK / SWIPE
══════════════════════════════════════════════════ */
function renderDeck() {
  updateCounter();
  const seenAll = document.getElementById('seen-all');
  const swipeView = document.getElementById('swipe-view');
  const listView = document.getElementById('list-view');

  if (currentIndex >= TRIPS.length) {
    seenAll.classList.remove('hidden');
    swipeView.classList.add('hidden');
    listView.classList.add('hidden');
    return;
  }
  seenAll.classList.add('hidden');
  swipeView.classList.toggle('hidden', viewMode !== 'swipe');
  listView.classList.toggle('hidden', viewMode !== 'list');

  if (viewMode === 'swipe') buildDeck();
  else buildList();

  const undoBtn = document.getElementById('btn-undo');
  if (undoBtn) undoBtn.disabled = swipeHistory.length === 0;
}

function buildDeck() {
  const container = document.getElementById('deck-container');
  container.innerHTML = '';

  for (let i = 2; i >= 0; i--) {
    const idx = currentIndex + i;
    if (idx >= TRIPS.length) continue;
    const card = makeCard(TRIPS[idx], i);
    container.appendChild(card);
  }
  attachPointerSwipe(container.querySelector('.card-depth-0'));
}

function makeCard(trip, depth) {
  const div = document.createElement('div');
  div.className = `trip-card card-depth-${depth}`;
  div.dataset.id = trip.id;

  const caption = trip.caption || CAPTIONS[trip.id.charCodeAt(trip.id.length-1) % CAPTIONS.length];

  div.innerHTML = `
    <div class="card-img-wrap">
      <img src="${trip.image}" alt="${trip.destination}" loading="lazy" onerror="this.style.opacity='.3'">
    </div>
    <div class="card-gradient"></div>
    ${depth === 0 ? `
      <div class="card-caption">${caption}</div>
      <div class="card-top-btns">
        <button class="card-top-btn" onclick="openShareTrip('${trip.id}')" title="Condividi">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        </button>
        <button class="card-top-btn" onclick="openDetail('${trip.id}')" title="Info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </button>
      </div>
      <div class="card-stamp-like" id="stamp-like-${trip.id}">${t.like}</div>
      <div class="card-stamp-nope" id="stamp-nope-${trip.id}">${t.nope}</div>
    ` : ''}
    <div class="card-bottom">
      <h2 class="card-dest">${trip.destination}</h2>
      <p class="card-country">${trip.flag} ${trip.country}</p>
      <div class="card-pills">
        <span class="card-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${trip.transport.type==='train'?'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>':'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-1 0-1.5.5-1.5.5L14 8 5.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 4.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'}</svg>
          ${trip.transport.duration}
        </span>
        <span class="card-pill card-pill-amber">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${trip.hotel.rating}
        </span>
        <span class="card-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v15"/><path d="M2 22h20"/></svg>
          €${trip.hotel.pricePerNight}/nt
        </span>
      </div>
      <div class="card-total-row">
        <p class="card-duration-type">${trip.durationDays}n · ${trip.tripType==='one_way'?'→':'↕'}</p>
        <div class="card-total-col">
          <p class="card-total-label">${t.total}</p>
          <p class="card-total-price">€${(trip.totalPrice * filterState.people).toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;
  return div;
}

function buildList() {
  const container = document.getElementById('trip-list');
  if (!container) return;
  const remaining = TRIPS.slice(currentIndex);
  container.innerHTML = remaining.map(trip => `
    <div class="list-card" onclick="openDetail('${trip.id}')">
      <div class="list-card-img">
        <img src="${trip.image}" alt="${trip.destination}" loading="lazy">
        <div class="list-card-price-badge">€${(trip.totalPrice*filterState.people).toLocaleString()}</div>
      </div>
      <div class="list-card-body">
        <div>
          <p class="list-card-name">${trip.destination}</p>
          <p class="list-card-country">${trip.flag} ${trip.country}</p>
          <div class="list-pills">
            <span class="list-pill">⏱ ${trip.transport.duration}</span>
            <span class="list-pill">⭐ ${trip.hotel.rating}</span>
            <span class="list-pill">📍 ${trip.hotel.distanceFromCenter}km</span>
          </div>
          <p class="list-card-hotel">🏨 ${trip.hotel.name} · ${trip.durationDays}n</p>
        </div>
        <div class="list-card-actions">
          <button class="list-btn list-btn-info" onclick="event.stopPropagation();openDetail('${trip.id}')">ℹ Info</button>
          <button class="list-btn list-btn-save" onclick="event.stopPropagation();listSave('${trip.id}')">✓ ${t.saveTrip}</button>
        </div>
      </div>
    </div>
  `).join('');
}

function listSave(id) {
  const trip = TRIPS.find(x => x.id === id);
  if (!trip) return;
  doSave(trip);
  showToast(t.toastSaved(trip.destination), 'success');
}

/* ── Pointer drag swipe ──────────────────────────── */
function attachPointerSwipe(card) {
  if (!card) return;
  let startX = 0, curX = 0, dragging = false;
  const hintLike = document.getElementById('hint-like');
  const hintNope = document.getElementById('hint-nope');
  const trip = TRIPS[currentIndex];
  const stampLike = document.getElementById('stamp-like-' + trip?.id);
  const stampNope = document.getElementById('stamp-nope-' + trip?.id);

  const onStart = (e) => {
    if (!card.classList.contains('card-depth-0')) return;
    dragging = true;
    startX = (e.touches ? e.touches[0] : e).clientX;
    card.classList.add('is-dragging');
  };
  const onMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    curX = (e.touches ? e.touches[0] : e).clientX - startX;
    const r = curX * 0.07;
    card.style.transform = `translateX(${curX}px) rotate(${r}deg)`;
    const p = Math.min(Math.abs(curX) / 80, 1);
    if (curX > 30) {
      hintLike.style.opacity = p; hintNope.style.opacity = 0;
      if (stampLike) stampLike.style.opacity = p;
      if (stampNope) stampNope.style.opacity = 0;
    } else if (curX < -30) {
      hintNope.style.opacity = p; hintLike.style.opacity = 0;
      if (stampNope) stampNope.style.opacity = p;
      if (stampLike) stampLike.style.opacity = 0;
    } else {
      hintLike.style.opacity = 0; hintNope.style.opacity = 0;
      if (stampLike) stampLike.style.opacity = 0;
      if (stampNope) stampNope.style.opacity = 0;
    }
  };
  const onEnd = () => {
    if (!dragging) return;
    dragging = false;
    card.classList.remove('is-dragging');
    hintLike.style.opacity = 0; hintNope.style.opacity = 0;
    if (stampLike) stampLike.style.opacity = 0;
    if (stampNope) stampNope.style.opacity = 0;
    const thresh = window.innerWidth * 0.28;
    if (curX > thresh) exitCard(card, 'right');
    else if (curX < -thresh) exitCard(card, 'left');
    else card.style.transform = '';
    curX = 0;
  };

  card.addEventListener('mousedown', onStart);
  card.addEventListener('touchstart', onStart, {passive:true});
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, {passive:false});
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
}

function exitCard(card, direction) {
  const trip = TRIPS[currentIndex];
  swipeHistory.push({ idx: currentIndex, trip, direction });
  card.classList.add(direction === 'right' ? 'swipe-exit-right' : 'swipe-exit-left');
  if (direction === 'right') {
    doSave(trip);
    showToast(t.toastSaved(trip.destination), 'success');
  } else {
    skipCount++; localStorage.setItem('wls_skip', skipCount);
    showToast(t.toastSkip);
  }
  seenCount++; localStorage.setItem('wls_seen', seenCount);
  currentIndex++;
  setTimeout(() => renderDeck(), 370);
}

function handleSwipe(dir) {
  if (currentIndex >= TRIPS.length) return;
  const card = document.querySelector('.trip-card.card-depth-0');
  if (!card) return;
  exitCard(card, dir);
}

function undoSwipe() {
  if (!swipeHistory.length) return;
  const last = swipeHistory.pop();
  if (last.direction === 'right') removeSaved(last.trip.id, false);
  else { skipCount = Math.max(0, skipCount-1); localStorage.setItem('wls_skip', skipCount); }
  seenCount = Math.max(0, seenCount-1);
  localStorage.setItem('wls_seen', seenCount);
  currentIndex = last.idx;
  renderDeck();
  showToast(t.toastUndo);
}

function nextCard() { if (currentIndex < TRIPS.length-1) handleSwipe('left'); }
function prevCard() { undoSwipe(); }

function resetDeck() { currentIndex = 0; swipeHistory = []; renderDeck(); }

function updateCounter() {
  const el = document.getElementById('card-counter');
  if (el) el.textContent = `${Math.min(currentIndex+1,TRIPS.length)} / ${TRIPS.length}`;
  const prev = document.getElementById('btn-prev');
  const next = document.getElementById('btn-next');
  if (prev) prev.disabled = currentIndex === 0;
  if (next) next.disabled = currentIndex >= TRIPS.length-1;
  const undo = document.getElementById('btn-undo');
  if (undo) undo.disabled = swipeHistory.length === 0;
}

function setViewMode(mode) {
  viewMode = mode;
  document.getElementById('toggle-swipe').classList.toggle('active', mode==='swipe');
  document.getElementById('toggle-list').classList.toggle('active', mode==='list');
  renderDeck();
}

/* ══════════════════════════════════════════════════
   SAVE / REMOVE
══════════════════════════════════════════════════ */
function doSave(trip) {
  if (!savedTrips.find(s => s.id === trip.id)) {
    savedTrips.unshift({...trip, savedAt: Date.now()});
    localStorage.setItem('wls_saved', JSON.stringify(savedTrips));
    addNotification(`✈️ ${trip.destination} salvato nei preferiti!`, 'saved');
    updateNavBadge();
  }
}

function removeSaved(id, rerender = true) {
  savedTrips = savedTrips.filter(s => s.id !== id);
  localStorage.setItem('wls_saved', JSON.stringify(savedTrips));
  updateNavBadge();
  if (rerender) renderSaved();
}

function updateNavBadge() {
  const badge = document.getElementById('nav-saved-badge');
  if (!badge) return;
  const n = savedTrips.length;
  badge.textContent = n;
  badge.classList.toggle('hidden', n === 0);
}

/* ══════════════════════════════════════════════════
   SAVED PAGE
══════════════════════════════════════════════════ */
function renderSaved() {
  const list = document.getElementById('saved-list');
  const empty = document.getElementById('saved-empty');
  if (!savedTrips.length) {
    list.innerHTML = '';
    list.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }
  list.classList.remove('hidden');
  empty.classList.add('hidden');
  list.innerHTML = savedTrips.map(trip => `
    <div class="saved-card" onclick="openDetail('${trip.id}')">
      <div class="saved-card-img">
        <img src="${trip.image}" alt="${trip.destination}" loading="lazy">
      </div>
      <div class="saved-card-body">
        <div>
          <p class="saved-card-name">${trip.destination}</p>
          <p class="saved-card-sub">${trip.flag} ${trip.country}</p>
          <div class="saved-card-meta">
            <span>📅 ${trip.durationDays} ${t.nights}</span>
            <span>⭐ ${trip.hotel.rating}</span>
          </div>
        </div>
        <div class="saved-card-footer">
          <p class="saved-card-price">€${(trip.totalPrice*filterState.people).toLocaleString()}</p>
          <button class="remove-btn" onclick="event.stopPropagation();removeSaved('${trip.id}')" title="Rimuovi">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════ */
function renderProfile() {
  const s = document.getElementById('stat-saved');
  const se = document.getElementById('stat-seen');
  const sk = document.getElementById('stat-skip');
  if (s) s.textContent = savedTrips.length;
  if (se) se.textContent = seenCount;
  if (sk) sk.textContent = skipCount;
}

function confirmReset() {
  if (!confirm('Vuoi davvero reimpostare tutto?')) return;
  savedTrips = []; seenCount = 0; skipCount = 0; currentIndex = 0;
  swipeHistory = []; notifications = [];
  localStorage.clear();
  localStorage.setItem('wls_lang', lang);
  updateNavBadge(); renderProfile(); renderSaved();
  showToast('✓ Dati reimpostati');
}

/* ══════════════════════════════════════════════════
   TRIP DETAIL SHEET
══════════════════════════════════════════════════ */
function openDetail(id) {
  const trip = TRIPS.find(x => x.id === id) || savedTrips.find(x => x.id === id);
  if (!trip) return;
  currentDetailTrip = trip;
  const numPeople = filterState.people;
  const total = trip.totalPrice * numPeople;

  document.getElementById('detail-img').src = trip.image;
  document.getElementById('detail-img').alt = trip.destination;
  document.getElementById('detail-dest').textContent = trip.destination;
  document.getElementById('detail-country').textContent = `📍 ${trip.country}`;
  document.getElementById('detail-price').textContent = `€${total.toLocaleString()}`;
  document.getElementById('detail-desc').textContent = trip.description;
  document.getElementById('detail-trip-type').textContent = trip.tripType === 'one_way' ? `→ ${t.oneWay}` : `↕ ${t.roundTrip}`;

  // Highlights
  const hl = document.getElementById('detail-highlights');
  const hlSection = document.getElementById('detail-highlights-section');
  if (trip.highlights?.length) {
    hlSection.style.display = '';
    hl.innerHTML = trip.highlights.map(h => `<span class="detail-tag">📍 ${h}</span>`).join('');
  } else {
    hlSection.style.display = 'none';
  }

  // Transport
  const tp = trip.transport;
  document.getElementById('detail-company').textContent = tp.company;
  document.getElementById('detail-direct').textContent = tp.isDirect ? t.direct : t.withStops;
  document.getElementById('detail-dep-time').textContent = tp.departureTime || '—';
  document.getElementById('detail-arr-time').textContent = tp.arrivalTime || '—';
  document.getElementById('detail-duration').textContent = tp.duration;
  const transportTitle = document.getElementById('t-transport-label');
  if (transportTitle) transportTitle.textContent = tp.type === 'train' ? '🚂 ' + t.transportTitle : '✈️ ' + t.transportTitle;

  // Hotel
  document.getElementById('detail-hotel-name').textContent = trip.hotel.name;
  document.getElementById('detail-hotel-price').textContent = `€${trip.hotel.pricePerNight}/nt`;
  document.getElementById('detail-hotel-total').textContent = `€${trip.hotel.pricePerNight * trip.durationDays} ${t.total.toLowerCase()}`;
  const starsEl = document.getElementById('detail-hotel-stars');
  starsEl.innerHTML = [1,2,3,4,5].map(s => `<span class="${s<=trip.hotel.stars?'star-filled':'star-empty'}">★</span>`).join('');
  document.getElementById('detail-hotel-dist').textContent = `📍 ${trip.hotel.distanceFromCenter}km`;
  document.getElementById('detail-hotel-rating').textContent = `⭐ ${trip.hotel.rating}/10`;
  const amenEl = document.getElementById('detail-amenities');
  amenEl.innerHTML = (trip.hotel.amenities||[]).map(a => `<span class="amenity-chip">🛜 ${a}</span>`).join('');

  // Stats 3-row
  document.getElementById('detail-nights').textContent = trip.durationDays;
  document.getElementById('detail-people').textContent = numPeople;
  document.getElementById('detail-total-num').textContent = `€${total.toLocaleString()}`;

  // Booking links
  const bookEl = document.getElementById('detail-booking-links');
  bookEl.innerHTML = `
    <a href="https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.destination)}" target="_blank" rel="noopener" class="booking-link booking-booking">
      <span class="booking-link-left">🏨 ${t.bookHotel}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.7"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
    </a>
    ${tp.type === 'train'
      ? `<a href="https://www.omio.com/?destination=${encodeURIComponent(trip.destination)}" target="_blank" rel="noopener" class="booking-link booking-omio">
          <span class="booking-link-left">🚂 ${t.bookTrain}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.7"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        </a>`
      : `<a href="https://www.skyscanner.it/voli?destination=${encodeURIComponent(trip.destination)}" target="_blank" rel="noopener" class="booking-link booking-skyscanner">
          <span class="booking-link-left">✈️ ${t.bookFlight}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.7"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
        </a>`
    }
  `;

  // Save button
  const saveBtn = document.getElementById('detail-save-btn');
  const isSaved = !!savedTrips.find(s => s.id === trip.id);
  saveBtn.onclick = () => {
    if (isSaved) { removeSaved(trip.id); closeDetail(); }
    else { doSave(trip); showToast(t.toastSaved(trip.destination), 'success'); closeDetail(); }
  };
  saveBtn.innerHTML = isSaved
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Rimuovi`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ${t.saveTrip}`;

  document.getElementById('detail-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetail(e) {
  if (e && e.target !== document.getElementById('detail-overlay')) return;
  document.getElementById('detail-overlay').classList.add('hidden');
  document.body.style.overflow = '';
  currentDetailTrip = null;
}

function openShareForCurrent() {
  if (currentDetailTrip) openShareTrip(currentDetailTrip.id);
}

/* ══════════════════════════════════════════════════
   SHARE
══════════════════════════════════════════════════ */
function openShareTrip(id) {
  const trip = TRIPS.find(x => x.id === id) || savedTrips.find(x => x.id === id);
  if (!trip) return;
  const total = trip.totalPrice * filterState.people;
  const text = `✈️ ${trip.destination}, ${trip.country} — ${trip.durationDays} notti a €${total}/persona! Scoperto su WanderlustSwipe 🌍`;

  document.getElementById('share-preview').innerHTML = `
    <img class="share-preview-img" src="${trip.image}" alt="${trip.destination}" onerror="this.style.display='none'">
    <div><p class="share-preview-name">${trip.destination}</p><p class="share-preview-sub">${trip.country}</p></div>
  `;
  document.getElementById('share-wa').href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  document.getElementById('share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.origin)}&quote=${encodeURIComponent(text)}`;
  document.getElementById('btn-copy').dataset.text = text;
  document.getElementById('share-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeShare(e) {
  if (e && e.target !== document.getElementById('share-overlay')) return;
  document.getElementById('share-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

async function copyShareText() {
  const btn = document.getElementById('btn-copy');
  const text = btn.dataset.text || '';
  try {
    await navigator.clipboard.writeText(text);
    const span = document.getElementById('t-copy');
    if (span) { span.textContent = t.copied; setTimeout(() => { span.textContent = t.copyText; }, 2000); }
  } catch(e) {
    showToast('Copia fallita', 'error');
  }
}

/* ══════════════════════════════════════════════════
   PREMIUM MODAL
══════════════════════════════════════════════════ */
function showPremiumModal() {
  document.getElementById('premium-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closePremium(e) {
  if (e && e.target !== document.getElementById('premium-overlay')) return;
  document.getElementById('premium-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════════════
   FILTER SHEET
══════════════════════════════════════════════════ */
function showFilterSheet() {
  document.getElementById('filter-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeFilterSheet(e) {
  if (e && e.target !== document.getElementById('filter-overlay')) return;
  document.getElementById('filter-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}
function stepFilter(id, delta) {
  const inp = document.getElementById(id);
  if (!inp) return;
  const min = parseInt(inp.min) || 1;
  const max = parseInt(inp.max) || 99;
  inp.value = Math.min(max, Math.max(min, parseInt(inp.value||'1') + delta));
}
function resetFilters() {
  document.getElementById('f-budget').value = '2000';
  document.getElementById('f-people').value = '2';
  document.getElementById('f-nights').value = '5';
  document.getElementById('f-departure').value = '';
  document.getElementById('f-arrival').value = '';
  document.querySelector('input[name="trip-type"][value="round_trip"]').checked = true;
}
function applyFilters() {
  filterState.budget = parseInt(document.getElementById('f-budget').value)||2000;
  filterState.people = parseInt(document.getElementById('f-people').value)||2;
  filterState.nights = parseInt(document.getElementById('f-nights').value)||5;
  filterState.departure = document.getElementById('f-departure').value;
  filterState.arrival = document.getElementById('f-arrival').value;
  filterState.tripType = document.querySelector('input[name="trip-type"]:checked')?.value||'round_trip';
  closeFilterSheet();
  currentIndex = 0; swipeHistory = [];
  renderDeck();
  showToast('✓ Filtri applicati');
}

/* ══════════════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════════════ */
function addNotification(msg, type) {
  notifications.unshift({ id: Date.now(), message: msg, type, timestamp: Date.now(), read: false });
  if (notifications.length > 20) notifications = notifications.slice(0,20);
  localStorage.setItem('wls_notif', JSON.stringify(notifications));
  const unread = notifications.filter(n => !n.read).length;
  const badge = document.getElementById('nav-notif-badge');
  if (badge) { badge.textContent = unread; badge.classList.toggle('hidden', unread===0); }
}
function showNotifPanel() {
  notifications.forEach(n => n.read = true);
  localStorage.setItem('wls_notif', JSON.stringify(notifications));
  const badge = document.getElementById('nav-notif-badge');
  if (badge) badge.classList.add('hidden');
  renderNotifs();
  document.getElementById('notif-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeNotif(e) {
  if (e && e.target !== document.getElementById('notif-overlay')) return;
  document.getElementById('notif-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}
function renderNotifs() {
  const list = document.getElementById('notif-list');
  if (!notifications.length) {
    list.innerHTML = `<div class="notif-empty"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:.3;margin-bottom:12px"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><p>${t.notifEmpty}</p></div>`;
    return;
  }
  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.read?'read':'unread'}">
      <div class="notif-icon ${n.type}">${n.type==='saved'?'✈️':'⚠️'}</div>
      <div><p class="notif-text">${n.message}</p><p class="notif-time">${new Date(n.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p></div>
      ${!n.read?'<div class="notif-dot"></div>':''}
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════
   COOKIE BANNER
══════════════════════════════════════════════════ */
function acceptCookies() {
  localStorage.setItem('wls_cookie', 'accepted');
  document.getElementById('cookie-banner').classList.add('hidden');
}
function rejectCookies() {
  localStorage.setItem('wls_cookie', 'rejected');
  document.getElementById('cookie-banner').classList.add('hidden');
}

/* ══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg, type='') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (type?' '+type:'');
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
}

/* ══════════════════════════════════════════════════
   KEYBOARD
══════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (!document.getElementById('detail-overlay').classList.contains('hidden')) {
    if (e.key === 'Escape') closeDetail(); return;
  }
  if (!document.getElementById('premium-overlay').classList.contains('hidden')) {
    if (e.key === 'Escape') closePremium(); return;
  }
  if (!document.getElementById('share-overlay').classList.contains('hidden')) {
    if (e.key === 'Escape') closeShare(); return;
  }
  if (!document.getElementById('filter-overlay').classList.contains('hidden')) {
    if (e.key === 'Escape') closeFilterSheet(); return;
  }
  if (!document.getElementById('notif-overlay').classList.contains('hidden')) {
    if (e.key === 'Escape') closeNotif(); return;
  }
  if (currentPage === 'discover') {
    if (e.key === 'ArrowRight') handleSwipe('right');
    if (e.key === 'ArrowLeft') handleSwipe('left');
    if (e.key === 'z' || e.key === 'Z') undoSwipe();
  }
});

/* ══════════════════════════════════════════════════
   START
══════════════════════════════════════════════════ */
init();
