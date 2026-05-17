'use strict';

/* ═══════════════════════════════════════════════════
   TRIP DATA
═══════════════════════════════════════════════════ */
const TRIPS = [
  {
    id: 't1', destination: 'Roma', country: 'Italia', flag: '🇮🇹',
    description: 'La Città Eterna ti aspetta con il Colosseo, il Vaticano, la Fontana di Trevi e una cucina straordinaria. Un viaggio nel tempo tra storia millenaria e vita moderna.',
    price: 420, duration: 4, transport: 'Treno', company: 'Trenitalia', rating: 4.8,
    hotel: 'Hotel Pantheon Roma', stars: 4, tags: ['storia', 'cultura', 'cibo', 'romantico'],
    image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&q=80',
    highlights: ['Colosseo', 'Vaticano', 'Fontana di Trevi', 'Campo de\' Fiori'],
  },
  {
    id: 't2', destination: 'Barcellona', country: 'Spagna', flag: '🇪🇸',
    description: 'La capitale catalana unisce l\'architettura visionaria di Gaudí con spiagge meravigliose, tapas irresistibili e una vita notturna leggendaria.',
    price: 580, duration: 5, transport: 'Volo', company: 'Vueling', rating: 4.7,
    hotel: 'Hotel Arts Barcelona', stars: 5, tags: ['spiaggia', 'arte', 'cibo', 'nightlife'],
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80',
    highlights: ['Sagrada Família', 'Park Güell', 'Las Ramblas', 'Barceloneta'],
  },
  {
    id: 't3', destination: 'Parigi', country: 'Francia', flag: '🇫🇷',
    description: 'La Ville Lumière: Tour Eiffel, Louvre, Montmartre, caffè sui boulevard. Romanticismo, alta cucina e moda in un\'unica città senza rivali.',
    price: 650, duration: 5, transport: 'Treno', company: 'TGV / Eurostar', rating: 4.9,
    hotel: 'Le Marais Boutique Hotel', stars: 4, tags: ['romantico', 'arte', 'moda', 'cultura'],
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    highlights: ['Torre Eiffel', 'Louvre', 'Notre-Dame', 'Montmartre'],
  },
  {
    id: 't4', destination: 'Amsterdam', country: 'Olanda', flag: '🇳🇱',
    description: 'Canali pittoreschi, musei di fama mondiale come il Rijksmuseum e la casa di Anna Frank. Una città accogliente e ciclabile con un\'atmosfera unica.',
    price: 490, duration: 4, transport: 'Volo', company: 'KLM', rating: 4.6,
    hotel: 'Canal House Amsterdam', stars: 4, tags: ['cultura', 'arte', 'bici', 'canali'],
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80',
    highlights: ['Rijksmuseum', 'Anne Frank House', 'Vondelpark', 'Jordaan'],
  },
  {
    id: 't5', destination: 'Praga', country: 'Repubblica Ceca', flag: '🇨🇿',
    description: 'La città d\'oro: un centro storico medievale intatto, il Castello di Praga, ponti in pietra e una birra locale tra le migliori d\'Europa.',
    price: 350, duration: 4, transport: 'Volo', company: 'Czech Airlines', rating: 4.7,
    hotel: 'Old Town Square Hotel', stars: 4, tags: ['storia', 'medievale', 'birra', 'economico'],
    image: 'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=600&q=80',
    highlights: ['Castello di Praga', 'Ponte Carlo', 'Piazza della Città Vecchia', 'Vicolo d\'Oro'],
  },
  {
    id: 't6', destination: 'Vienna', country: 'Austria', flag: '🇦🇹',
    description: 'La capitale imperiale degli Asburgo: palazzi barocchi, caffè storici, Mozart, opera lirica e i musei più ricchi d\'Europa.',
    price: 480, duration: 4, transport: 'Treno', company: 'Railjet', rating: 4.8,
    hotel: 'Hotel Imperial Vienna', stars: 5, tags: ['imperiale', 'musica', 'arte', 'caffè'],
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80',
    highlights: ['Palazzo di Schönbrunn', 'Museo di Storia dell\'Arte', 'Opera di Stato', 'Ringstrasse'],
  },
  {
    id: 't7', destination: 'Budapest', country: 'Ungheria', flag: '🇭🇺',
    description: 'La "Parigi dell\'Est" sul Danubio: terme termali, il grandioso Parlamento, il Castello di Buda e una scena culinaria in rapida crescita.',
    price: 380, duration: 4, transport: 'Volo', company: 'Wizz Air', rating: 4.6,
    hotel: 'Aria Hotel Budapest', stars: 5, tags: ['terme', 'danubio', 'storia', 'economico'],
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
    highlights: ['Bagni Széchenyi', 'Parlamento', 'Bastione dei Pescatori', 'Ruin Bar'],
  },
  {
    id: 't8', destination: 'Lisbona', country: 'Portogallo', flag: '🇵🇹',
    description: 'Colline, tram gialli, Fado malinconico, pastéis de nata e l\'oceano Atlantico. Una capitale affascinante e sorprendentemente autentica.',
    price: 440, duration: 5, transport: 'Volo', company: 'TAP Air Portugal', rating: 4.7,
    hotel: 'Bairro Alto Hotel', stars: 5, tags: ['oceano', 'fado', 'tram', 'autunno'],
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80',
    highlights: ['Belém', 'Alfama', 'Tram 28', 'Time Out Market'],
  },
  {
    id: 't9', destination: 'Tokyo', country: 'Giappone', flag: '🇯🇵',
    description: 'La metropoli del futuro: neon di Shinjuku, templi di Asakusa, sushi di altissimo livello, anime, manga e la tecnologia più avanzata del pianeta.',
    price: 1200, duration: 10, transport: 'Volo', company: 'Japan Airlines', rating: 4.9,
    hotel: 'Park Hyatt Tokyo', stars: 5, tags: ['cultura', 'tecnologia', 'sushi', 'avventura'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    highlights: ['Shinjuku', 'Templo Senso-ji', 'Shibuya Crossing', 'Akihabara'],
  },
  {
    id: 't10', destination: 'Bali', country: 'Indonesia', flag: '🇮🇩',
    description: 'L\'isola degli Dei: terrazze di riso, templi antichi tra la giungla, spiagge di sabbia nera, surf e spiritualità. Un\'oasi di pace tropicale.',
    price: 980, duration: 10, transport: 'Volo', company: 'Singapore Airlines', rating: 4.8,
    hotel: 'COMO Uma Ubud', stars: 5, tags: ['spiaggia', 'spirituale', 'surf', 'yoga'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    highlights: ['Ubud', 'Tegallalang', 'Seminyak', 'Tanah Lot'],
  },
  {
    id: 't11', destination: 'Santorini', country: 'Grecia', flag: '🇬🇷',
    description: 'Case bianche con cupole blu affacciate sul mare vulcanico. I tramonti di Oia sono tra i più belli del mondo. Vino locale, pesce fresco e romantismo allo stato puro.',
    price: 850, duration: 6, transport: 'Volo', company: 'Aegean Airlines', rating: 4.9,
    hotel: 'Canaves Oia Epitome', stars: 5, tags: ['romantico', 'tramonti', 'isola', 'lusso'],
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
    highlights: ['Oia', 'Fira', 'Spiaggia Rossa', 'Caldera'],
  },
  {
    id: 't12', destination: 'Dubrovnik', country: 'Croazia', flag: '🇭🇷',
    description: 'La "Perla dell\'Adriatico": mura medievali sul mare cristallino, calli antiche e un\'atmosfera da Game of Thrones. Mare pulitissimo e cucina mediterranea.',
    price: 520, duration: 5, transport: 'Volo', company: 'Croatia Airlines', rating: 4.7,
    hotel: 'Villa Orsula', stars: 5, tags: ['mare', 'medievale', 'adriatico', 'Game of Thrones'],
    image: 'https://images.unsplash.com/photo-1555990793-da11153b4b27?w=600&q=80',
    highlights: ['Mura cittadine', 'Città Vecchia', 'Isola di Lokrum', 'Cavo Slavo'],
  },
  {
    id: 't13', destination: 'Marrakech', country: 'Marocco', flag: '🇲🇦',
    description: 'I colori della medina, la magia di Jemaa el-Fna, i riad nascosti, i souq profumati di spezie. Un viaggio sensoriale alle porte del Sahara.',
    price: 420, duration: 5, transport: 'Volo', company: 'Royal Air Maroc', rating: 4.5,
    hotel: 'La Mamounia', stars: 5, tags: ['cultura', 'deserto', 'spezie', 'avventura'],
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80',
    highlights: ['Jemaa el-Fna', 'Souq', 'Giardini Majorelle', 'Bahia Palace'],
  },
  {
    id: 't14', destination: 'Dubai', country: 'Emirati Arabi', flag: '🇦🇪',
    description: 'Il futuro nel deserto: il Burj Khalifa, centri commerciali da record, spiagge artificiali, safari nel deserto e lusso sfrenato. Una città di superlativii.',
    price: 950, duration: 6, transport: 'Volo', company: 'Emirates', rating: 4.6,
    hotel: 'Atlantis The Palm', stars: 5, tags: ['lusso', 'moderno', 'deserto', 'shopping'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari'],
  },
  {
    id: 't15', destination: 'New York', country: 'USA', flag: '🇺🇸',
    description: 'La Grande Mela: Times Square, Central Park, i grattacieli di Manhattan, i musei più grandi del mondo e una scena gastronomica che non ha uguali.',
    price: 1350, duration: 8, transport: 'Volo', company: 'Delta Airlines', rating: 4.8,
    hotel: 'The Plaza Hotel', stars: 5, tags: ['metropoli', 'arte', 'shopping', 'grattacieli'],
    image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=600&q=80',
    highlights: ['Central Park', 'Times Square', 'Brooklyn Bridge', 'MoMA'],
  },
];

/* ═══════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════ */
let currentPage = 'landing';
let currentIndex = 0;
let savedTrips = JSON.parse(localStorage.getItem('wls_saved') || '[]');
let skippedCount = parseInt(localStorage.getItem('wls_skipped') || '0');
let seenCount = parseInt(localStorage.getItem('wls_seen') || '0');
let history = [];
let viewMode = 'swipe';
let currentModalTrip = null;

/* ═══════════════════════════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════════════════════════ */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');

  const nav = document.getElementById('bottom-nav');
  if (page === 'landing') {
    nav.classList.add('hidden');
    document.body.style.paddingBottom = '0';
  } else {
    nav.classList.remove('hidden');
  }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  currentPage = page;

  if (page === 'discover') renderDeck();
  if (page === 'saved') renderSaved();
  if (page === 'profile') renderProfile();
}

/* ═══════════════════════════════════════════════════
   DECK / SWIPE
═══════════════════════════════════════════════════ */
function renderDeck() {
  updateCounter();
  const seenAll = document.getElementById('seen-all');
  const swipeView = document.getElementById('swipe-view');

  if (currentIndex >= TRIPS.length) {
    seenAll.classList.remove('hidden');
    swipeView.classList.add('hidden');
    return;
  }
  seenAll.classList.add('hidden');
  swipeView.classList.remove('hidden');

  const container = document.getElementById('deck-container');
  container.innerHTML = '';

  const depths = [0, 1, 2];
  depths.forEach(depth => {
    const tripIndex = currentIndex + depth;
    if (tripIndex >= TRIPS.length) return;
    const trip = TRIPS[tripIndex];
    const card = createCard(trip, depth);
    container.appendChild(card);
  });

  if (currentIndex + depths.length - 1 < TRIPS.length) {
    attachDragHandlers(container.querySelector('.depth-0'));
  }

  document.getElementById('btn-undo').disabled = history.length === 0;
  updateUndoButton();

  if (viewMode === 'list') renderList();
}

function createCard(trip, depth) {
  const card = document.createElement('div');
  card.className = `trip-card depth-${depth}`;
  card.dataset.id = trip.id;

  const tagsHtml = trip.tags.slice(0, 3).map(t =>
    `<span class="card-tag">${t}</span>`
  ).join('');

  card.innerHTML = `
    <div class="card-back">
      <div class="card-img">
        <img src="${trip.image}" alt="${trip.destination}" loading="lazy" onerror="this.parentElement.style.background='hsl(220,30%,20%)'">
      </div>
      <div class="card-gradient"></div>
    </div>
    ${depth === 0 ? `<button class="card-info-btn" onclick="openModal('${trip.id}')">ℹ</button>` : ''}
    <div class="card-content">
      <div class="card-tags">${tagsHtml}</div>
      <div class="card-destination">${trip.destination}</div>
      <div class="card-country">${trip.flag} ${trip.country}</div>
      <div class="card-stats">
        <div class="card-stat card-price">€${trip.price.toLocaleString()}</div>
        <div class="card-stat">📅 ${trip.duration} giorni</div>
        <div class="card-stat">⭐ ${trip.rating}</div>
      </div>
    </div>
  `;
  return card;
}

/* ─── Drag / Swipe ─────────────────────────────── */
function attachDragHandlers(card) {
  if (!card) return;

  let startX = 0, startY = 0, currentX = 0;
  let isDragging = false;

  const hintLeft = document.getElementById('hint-left');
  const hintRight = document.getElementById('hint-right');

  function onStart(e) {
    isDragging = true;
    const point = e.touches ? e.touches[0] : e;
    startX = point.clientX;
    startY = point.clientY;
    card.classList.add('is-dragging');
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    currentX = point.clientX - startX;

    const rotate = currentX * 0.08;
    const opacity = Math.min(Math.abs(currentX) / 80, 1);

    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

    if (currentX > 40) {
      hintRight.style.opacity = opacity;
      hintLeft.style.opacity = 0;
    } else if (currentX < -40) {
      hintLeft.style.opacity = opacity;
      hintRight.style.opacity = 0;
    } else {
      hintLeft.style.opacity = 0;
      hintRight.style.opacity = 0;
    }
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('is-dragging');
    hintLeft.style.opacity = 0;
    hintRight.style.opacity = 0;

    const threshold = window.innerWidth * 0.3;

    if (currentX > threshold) {
      doSwipe(card, 'right');
    } else if (currentX < -threshold) {
      doSwipe(card, 'left');
    } else {
      card.style.transform = '';
    }
    currentX = 0;
  }

  card.addEventListener('mousedown', onStart);
  card.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
}

function doSwipe(card, direction) {
  const trip = TRIPS[currentIndex];
  history.push({ index: currentIndex, trip, direction });

  card.classList.add(direction === 'right' ? 'swipe-out-right' : 'swipe-out-left');

  if (direction === 'right') {
    saveTrip(trip);
    showToast('💾 ' + trip.destination + ' salvato!', 'success');
  } else {
    skippedCount++;
    localStorage.setItem('wls_skipped', skippedCount);
    showToast('⏭ Saltato', '');
  }

  seenCount++;
  localStorage.setItem('wls_seen', seenCount);
  currentIndex++;

  setTimeout(() => {
    renderDeck();
  }, 380);
}

function handleSwipe(direction) {
  const card = document.querySelector('.trip-card.depth-0');
  if (!card) return;
  doSwipe(card, direction);
}

function undoSwipe() {
  if (history.length === 0) return;
  const last = history.pop();

  if (last.direction === 'right') {
    removeSavedTrip(last.trip.id);
  } else {
    skippedCount = Math.max(0, skippedCount - 1);
    localStorage.setItem('wls_skipped', skippedCount);
  }
  seenCount = Math.max(0, seenCount - 1);
  localStorage.setItem('wls_seen', seenCount);

  currentIndex = last.index;
  renderDeck();
  showToast('↩ Annullato');
}

function nextCard() {
  if (currentIndex >= TRIPS.length - 1) return;
  handleSwipe('left');
}
function prevCard() {
  undoSwipe();
}

function resetDeck() {
  currentIndex = 0;
  history = [];
  renderDeck();
}

function updateCounter() {
  const el = document.getElementById('card-counter');
  if (el) el.textContent = `${Math.min(currentIndex + 1, TRIPS.length)} / ${TRIPS.length}`;

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if (btnPrev) btnPrev.disabled = currentIndex === 0;
  if (btnNext) btnNext.disabled = currentIndex >= TRIPS.length - 1;
}

function updateUndoButton() {
  const btn = document.getElementById('btn-undo');
  if (btn) btn.disabled = history.length === 0;
}

/* ─── View mode ──────────────────────────────── */
function setViewMode(mode) {
  viewMode = mode;
  document.getElementById('swipe-view').classList.toggle('hidden', mode !== 'swipe');
  document.getElementById('list-view').classList.toggle('hidden', mode !== 'list');
  document.getElementById('toggle-swipe').classList.toggle('active', mode === 'swipe');
  document.getElementById('toggle-list').classList.toggle('active', mode === 'list');
  if (mode === 'list') renderList();
  else renderDeck();
}

function renderList() {
  const container = document.getElementById('trip-list');
  if (!container) return;
  const remaining = TRIPS.slice(currentIndex);
  if (!remaining.length) { container.innerHTML = '<p style="color:rgba(255,255,255,.6);text-align:center;padding:20px">Nessun viaggio da mostrare</p>'; return; }

  container.innerHTML = remaining.map(trip => `
    <div class="trip-list-card" onclick="openModal('${trip.id}')">
      <div class="trip-list-img">
        <img src="${trip.image}" alt="${trip.destination}" loading="lazy" onerror="this.style.display='none'">
      </div>
      <div class="trip-list-body">
        <div>
          <div class="trip-list-name">${trip.destination}</div>
          <div class="trip-list-meta">${trip.flag} ${trip.country} · ${trip.duration} giorni</div>
        </div>
        <div class="trip-list-footer">
          <div class="trip-list-price">€${trip.price.toLocaleString()}</div>
          <div class="trip-list-actions">
            <button class="trip-list-btn btn-info-sm" onclick="event.stopPropagation();openModal('${trip.id}')">Info</button>
            <button class="trip-list-btn btn-save-sm" onclick="event.stopPropagation();quickSaveTrip('${trip.id}')">Salva</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function quickSaveTrip(id) {
  const trip = TRIPS.find(t => t.id === id);
  if (!trip) return;
  saveTrip(trip);
  showToast('💾 ' + trip.destination + ' salvato!', 'success');
}

function showFilters() {
  const trip = TRIPS[currentIndex];
  if (trip) openModal(trip.id);
}

/* ═══════════════════════════════════════════════════
   SAVED TRIPS
═══════════════════════════════════════════════════ */
function saveTrip(trip) {
  if (!savedTrips.find(s => s.id === trip.id)) {
    savedTrips.unshift({ ...trip, savedAt: Date.now() });
    localStorage.setItem('wls_saved', JSON.stringify(savedTrips));
    updateNavBadge();
  }
}

function removeSavedTrip(id) {
  savedTrips = savedTrips.filter(s => s.id !== id);
  localStorage.setItem('wls_saved', JSON.stringify(savedTrips));
  updateNavBadge();
  renderSaved();
}

function updateNavBadge() {
  const badge = document.getElementById('nav-saved-badge');
  if (!badge) return;
  if (savedTrips.length > 0) {
    badge.textContent = savedTrips.length;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderSaved() {
  const container = document.getElementById('saved-container');
  const empty = document.getElementById('saved-empty');

  if (!savedTrips.length) {
    container.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }

  container.classList.remove('hidden');
  empty.classList.add('hidden');

  container.innerHTML = savedTrips.map(trip => `
    <div class="saved-card" onclick="openModal('${trip.id}')">
      <div class="saved-card-img">
        <img src="${trip.image}" alt="${trip.destination}" loading="lazy" onerror="this.style.display='none'">
      </div>
      <div class="saved-card-body">
        <div>
          <div class="saved-card-title">${trip.destination}</div>
          <div class="saved-card-sub">${trip.flag} ${trip.country}</div>
          <div class="saved-card-meta">
            <span>📅 ${trip.duration} giorni</span>
            <span>⭐ ${trip.rating}</span>
          </div>
        </div>
        <div class="saved-card-footer">
          <div class="saved-card-price">€${trip.price.toLocaleString()}</div>
          <button class="remove-btn" onclick="event.stopPropagation(); removeSavedTrip('${trip.id}')" title="Rimuovi">✕</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════════ */
function renderProfile() {
  const statSaved = document.getElementById('stat-saved');
  const statSeen = document.getElementById('stat-seen');
  const statSkipped = document.getElementById('stat-skipped');
  if (statSaved) statSaved.textContent = savedTrips.length;
  if (statSeen) statSeen.textContent = seenCount;
  if (statSkipped) statSkipped.textContent = skippedCount;
}

function resetAll() {
  if (!confirm('Vuoi davvero reimpostare tutto? I dati salvati verranno persi.')) return;
  savedTrips = [];
  skippedCount = 0;
  seenCount = 0;
  currentIndex = 0;
  history = [];
  localStorage.clear();
  updateNavBadge();
  renderProfile();
  showToast('✓ Dati reimpostati');
}

/* ═══════════════════════════════════════════════════
   TRIP DETAIL MODAL
═══════════════════════════════════════════════════ */
function openModal(id) {
  const trip = TRIPS.find(t => t.id === id) || savedTrips.find(t => t.id === id);
  if (!trip) return;
  currentModalTrip = trip;

  const isSaved = !!savedTrips.find(s => s.id === trip.id);
  const transportIcon = trip.transport === 'Treno' ? '🚂' : '✈️';

  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div class="modal-hero" style="position:relative">
      <img src="${trip.image}" alt="${trip.destination}" loading="lazy" onerror="this.style.display='none'">
      <div class="modal-hero-overlay">
        <div class="modal-hero-title">${trip.destination}</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-price-row">
        <div class="modal-price">€${trip.price.toLocaleString()}</div>
        <div class="modal-duration">📅 ${trip.duration} giorni</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Descrizione</div>
        <p class="modal-description">${trip.description}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Dettagli</div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">${transportIcon}</span>
          <div>
            <div class="modal-detail-label">Trasporto</div>
            <div class="modal-detail-value">${trip.transport} — ${trip.company}</div>
          </div>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">🏨</span>
          <div>
            <div class="modal-detail-label">Hotel</div>
            <div class="modal-detail-value">${trip.hotel} ${'★'.repeat(trip.stars)}</div>
          </div>
        </div>
        <div class="modal-detail-row">
          <span class="modal-detail-icon">⭐</span>
          <div>
            <div class="modal-detail-label">Valutazione</div>
            <div class="modal-detail-value">${trip.rating} / 5.0</div>
          </div>
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Da non perdere</div>
        <div class="modal-tags">
          ${trip.highlights.map(h => `<span class="modal-tag">📍 ${h}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Tags</div>
        <div class="modal-tags">
          ${trip.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
    <div class="modal-cta">
      ${isSaved
        ? `<button class="btn btn-outline" onclick="removeSavedTrip('${trip.id}'); closeModal()">✕ Rimuovi dai salvati</button>`
        : `<button class="btn btn-primary" onclick="saveTrip(TRIPS.find(t=>t.id==='${trip.id}')||savedTrips.find(t=>t.id==='${trip.id}')); closeModal(); showToast('💾 ${trip.destination} salvato!', 'success')">💾 Salva viaggio</button>`
      }
    </div>
  `;

  document.getElementById('trip-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('trip-modal')) return;
  document.getElementById('trip-modal').classList.add('hidden');
  document.body.style.overflow = '';
  currentModalTrip = null;
}

/* ═══════════════════════════════════════════════════
   PREMIUM MODAL
═══════════════════════════════════════════════════ */
function showPremiumModal() {
  document.getElementById('premium-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closePremiumModal(e) {
  if (e && e.target !== document.getElementById('premium-modal')) return;
  document.getElementById('premium-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast' + (type ? ' toast-' + type : '');
  toast.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

/* ═══════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
═══════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (currentPage !== 'discover') return;
  if (document.getElementById('trip-modal').classList.contains('hidden') === false) {
    if (e.key === 'Escape') closeModal();
    return;
  }
  if (e.key === 'ArrowLeft') handleSwipe('left');
  if (e.key === 'ArrowRight') handleSwipe('right');
  if (e.key === 'z' || e.key === 'Z') undoSwipe();
});

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
function init() {
  updateNavBadge();
}

init();
