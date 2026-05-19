/* =========================================================================
   WanderlustSwipe — TravelBudget  |  Complete static SPA
   ========================================================================= */
'use strict';

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */
const IC = {
  plane:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 6.2 6.3c.4.4.9.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>`,
  hotel:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M9 22V12h6v10"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/></svg>`,
  train:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>`,
  compass:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  heart:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  user:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  bell:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  crown:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 6.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 7.02a.5.5 0 0 1 .798-.519l4.276 2.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>`,
  x:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  check:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  undo:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
  info:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  share:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  mapPin:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  sliders:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="6" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="4" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="8" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="12" y2="12"/><line x1="17" x2="23" y1="16" y2="16"/></svg>`,
  chevronR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  chevronL: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  star:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  zap:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
  refresh:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  shield:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
  award:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  map:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>`,
  search:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  clock:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  logOut:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  pencil:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  dice:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg>`,
  lock:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  unlock:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
  users:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  banknote: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`,
  trash:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  arrowL:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  wifi:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`,
  wifiOff:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 16 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`,
  listLayout:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/></svg>`,
  layers:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  externalL:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  copy:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  msgCircle:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  moon:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,
  wallet:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`,
  paw:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>`,
  coffee:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
  car:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17H5"/><path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="M15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/><path d="M5 17V7l3-3h8l3 3v10"/><path d="M3 9h2"/><path d="M19 9h2"/></svg>`,
  bath:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/></svg>`,
  building: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
  baby:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>`,
  loader:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>`,
  globe:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  xcircle:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
};

/* ─── Translations ──────────────────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    landing: { title:"Wanderlust made effortless", subtitle:"Swipe through curated trip suggestions like a glossy travel magazine. Find your next adventure on a whim.", getStarted:"Get Started", logIn:"Log In", continueAsGuest:"Continue as Guest" },
    nav: { discover:"Discover", saved:"Saved", profile:"Profile", logOut:"Log out", premium:"Premium", signIn:"Sign in", signUp:"Sign up", guestLabel:"Guest" },
    discover: { loading:"Finding perfect getaways...", seenAll:"You've seen them all!", seenAllSub:"We can find more amazing destinations based on your preferences.", generateMore:"Generate More Trips", total:"Total", like:"LIKE", nope:"NOPE", rateLimitError:"Too many requests. Please wait a moment.", rateLimitHint:"Our system detected unusual activity.", searchError:"Something went wrong", searchErrorHint:"Please try again or adjust your filters", searchErrorRetry:"Try again", signUpToSave:"Sign up to save your favourite trips!", shareTrip:"Share trip", shareWhatsapp:"WhatsApp", shareFacebook:"Facebook", shareCopy:"Copy text", copied:"Copied!", discoverTitle:"Where do you want to go?", discoverSub:"Set your filters to discover trips that fit your budget", setFilters:"Set filters", welcomeTitle:"Welcome to TravelBudget", welcomeSub:"Discover the journey of your dreams", welcomeStart:"Start exploring", noDirectTrainTitle:"No direct train from here! 😅", noDirectTrain:"Sadly, no direct trains leave from your station… Try 'With connections'! 🚂", loadingMore:"Loading more results…", infoBtn:"Info" },
    premium: { title:"Upgrade to Premium", subtitle:"You've used all your free searches", guestSubtitle:"You've used all 5 guest searches. Sign up for 20 free searches!", price:"€3/month", benefit1:"80 searches per day", benefit2:"Advanced destination filters", benefit3:"Priority results", cta:"Activate Premium", ctaSub:"Cancel anytime · Billed monthly", orSignUp:"Sign up for 20 free searches", searchesLeft:"of 20 free daily searches used", limitReachedTitle:"Daily limit reached", perDay:"searches/day", planFree:"Free Plan", planPremium:"Premium Plan", upgradeNow:"Upgrade now", currentPlan:"Your plan", managePlan:"Manage", freePlanDesc:"20 searches per day, free forever", premiumPlanDesc:"80 searches per day, full experience", downgrade:"Downgrade to free", alreadyMember:"You are already a Premium member 🎉", unlockFor:"Unlock everything for only €3/month", activePlan:"Premium plan active", signUpFirst:"Sign up — then choose Premium" },
    offline: { banner:"No internet connection", title:"You're offline 🌐", subtitle:"Showing your last loaded trips.", noCache:"Connect to the internet to discover trips", searchDisabled:"Search requires an internet connection", reconnected:"Connection restored! 🚀", showingCached:"Showing cached trips ✈️" },
    tripDetail: { overview:"Overview", highlights:"Highlights", transport:"Transport", hotel:"Hotel", totalCost:"Total cost", direct:"Direct", withStops:"With stops", nights:"nights", stars:"stars", kmFromCenter:"km from centre", perNight:"/ night", amenities:"Amenities", rating:"Rating", signUpCta:"Create an account to save this trip", departure:"Departure", arrival:"Arrival", duration:"Duration", perPerson:"Per person", close:"Close", flight:"Flight", train:"Train", outbound:"Outbound", returnJourney:"Return", totalHotel:"Hotel total", saveTrip:"Save trip", bookTitle:"Book your trip", bookSubtitle:"Affiliate links — no extra cost for you", bookHotel:"Hotel on Booking", bookTransport:"Transport on Omio", bookFlight:"Flights on Skyscanner", budgetRemaining:"Remaining", overBudget:"over budget", cityCenter:"City Centre", centralArea:"Central Area", connectedArea:"Well Connected", outskirts:"Outskirts" },
    saved: { title:"Saved Trips", loading:"Loading saved trips...", empty:"No saved trips yet", emptySub:"Head over to Discover and start swiping to build your dream itinerary.", goToDiscover:"Go to Discover", total:"total", days:"days" },
    savedDetail: { notFound:"Trip not found.", backToSaved:"Back to Saved", overview:"Overview", highlights:"Highlights", totalCost:"Total estimated cost", flight:"Flight", train:"Train", fromCenter:"from center", night:"night", nights:"nights", bookNow:"Book Now", linkCopied:"Link copied to clipboard!", deleted:"Trip removed.", deleteError:"Failed to remove trip.", confirmDelete:"Tap again to confirm delete" },
    profile: { title:"Profile", traveler:"Traveler", tripsSaved:"Trips Saved", avgTripPrice:"Avg Trip Price", settings:"Settings", updatePreferences:"Update Travel Preferences", notSet:"Not set", privacyPolicy:"Privacy Policy", termsOfService:"Terms of Service", legalSection:"Legal", loading:"Loading...", signOut:"Sign Out", recentSearches:"Recent Searches", noRecentSearches:"No searches yet — start exploring!", preferences:"My Preferences", editPreferences:"Edit", save:"Save", cancel:"Cancel", repeatSearch:"Repeat", searchesUsed:"Searches used", departureFrom:"From", night:"night", nights:"nights", people:"people", guestMessage:"Sign in to view your profile and save trips.", viewSwipe:"Swipe", viewList:"List", tripsCount:"trips" },
    onboarding: { budget:"What's your budget?", travelers:"Who's traveling?", flight:"Flight preferences", totalBudget:"Total budget (€)", departureCity:"Departure City", numberOfPeople:"Number of People", flightType:"Flight Type", directOnly:"Direct only", withStops:"With stops", any:"Any", back:"Back", next:"Next", complete:"Complete" },
    cookie: { title:"We value your privacy", description:'We use cookies to enhance your browsing experience. By clicking "Accept All", you consent to our use of cookies.', decline:"Decline", acceptAll:"Accept All" },
    notFound: { title:"404 Page Not Found", sub:"Did you forget to add the page to the router?" },
    filters: { title:"Filters", apply:"Search trips", edit:"Edit filters", activeFilters:"Active filters", noResults:"No trips found with current filters", noResultsSub:"Try adjusting the filters to broaden your search.", reset:"Reset", budget:"Maximum budget", travelers:"Travellers", children:"Children", pets:"Pets", departureDate:"Departure date", returnDate:"Return date", tripTypeLabel:"Trip type", oneWay:"One-way", roundTrip:"Round-trip", oneWayHint:"Planning your one-way adventure ✈️", roundTripHint:"Building your round-trip journey 🔄", nights:"Nights", flightType:"Flight type", directOnly:"Direct only", withStops:"With stops", anyFlight:"No preference", maxAirportDist:"Max airport → hotel (km)", maxCenterDist:"Max from city centre (km)", noLimit:"No limit", accommodation:"Accommodation", budgetAcc:"Budget", standardAcc:"Standard", luxuryAcc:"Luxury", anyAcc:"No preference", persons:"persons", perPerson:"per person", departureAirport:"Departure airport", arrivalAirport:"Arrival airport", departureStation:"Departure station", arrivalStation:"Arrival station", hotelStars:"Hotel stars", trainType:"Train type", trainDirect:"Direct only", trainWithChanges:"With connections", budgetIncludes:"Total per person — includes round-trip transport + hotel", budgetIncludesOneWay:"Total per person — includes one-way transport + hotel", budgetTransport:"Transport", budgetHotel:"Accommodation", budgetBuffer:"Buffer", sortBy:"Sort by", sortBestValue:"Best Value", sortCheapest:"Cheapest", sortFastest:"Fastest", sortBestRating:"Best Rated", departureTime:"Departure Time", morning:"Morning", afternoon:"Afternoon", evening:"Evening", maxTravelTime:"Max Travel Time", hostelOnly:"Hostel", hotelFeatures:"Hotel features", freeCancellation:"Free cancellation", breakfastIncluded:"Breakfast included", parkingAvailable:"Parking", ratingFilter:"Minimum rating", minLabel:"Min", maxLabel:"Max", ratingAbove8:"Rating ≥ 8/10", privateBathroom:"Private bathroom", propertyType:"Property type", hotelOnly:"Hotel", apartmentOnly:"Apartment", onlinePayment:"Online payment", elevator:"Elevator", petFriendly:"Pets allowed", validationTitle:"Some details are missing 👀", validationSubtitle:"Fill in the highlighted fields to find your perfect trips", missingDeparture:"Where are you leaving from? Add at least one departure airport or station ✈️", missingArrival:"We can't plan a trip without knowing where you want to go 😅", missingDepartureDate:"When do you leave? Even our AI needs a date ✈️", missingReturnDate:"And when are you coming back? Hopefully not never 😄", returnBeforeDeparture:"Your return date is before departure… time travel not included! ⏰", sameLocation:"Departure and destination are the same… unless teleportation exists 🚀", invalidBudget:"Your budget is missing… sadly airlines don't accept hope as payment 💸" },
    fun: { loadingMessages:["Searching for the perfect trip… 🔍✈️","Consulting the flight oracles… 🧙‍♂️","Negotiating with hotels on your behalf… 🏨","Checking if your budget is realistic… 👀","Scanning all of Europe for you… 🌍","Calculating the best possible trip… 🧠","Almost found something interesting… 🔥"], noResultsMessages:["With this budget we're asking too much of the universe… 😅","Even Sherlock Holmes couldn't find a trip here 🔎","Try increasing your budget… or pray a little ✈️🙏","The hotels are laughing at your budget 😭","We searched everywhere… literally EVERYWHERE 🌍","Maybe you're asking for a superhero-mode trip 🦸","We found nothing… but we won't give up 💪"], lowBudgetMessages:["This budget is more creative than realistic 😄","We're working with magic, not mathematics 🪄","We might find something… but no promises 👀","Small budget, big dreams ✨"], successMessages:["Found it! This trip is a gem 🔥","Now that's a good deal 💸","I'd book this trip myself 😎","Perfect match found ✈️✨"], captions:["Perfect weekend escape 😎","Luxury but still legal for your budget 💸","Budget-friendly chaos trip 😂","Your wallet said yes — barely 💚","Adventure awaits, bank account permitting ✈️","Escape plan: activated 🚀","Your next story starts here 📖","Sun, sea & surprisingly affordable ☀️"], savingsMessages:["Psst… you're pocketing {amount}! 🎉","Your wallet is throwing a party: {amount} saved! 💃","Who said travel was expensive? {amount} left over! 💪"], trainNotDirectMessages:["No direct train? Pack snacks — you've got connections! 🚂😄","This train stops more than a tourist with a selfie stick 📸🚂"] },
    notifications: { title:"Notifications", empty:"No notifications yet", clearAll:"Clear all", markRead:"Mark all as read", tripSaved:"Trip saved to your wishlist! ✈️", limitWarning:"Almost at your search limit" },
    smartSuggestions: { title:"Try these suggestions", increaseBudget:"Increase budget to €{amount}", allowFlightStops:"Allow connecting flights", allowTrainStops:"Allow train connections", fewerNights:"Try {n} nights", removeAccFilter:"Remove accommodation filter", editFilters:"Edit filters manually", changeDates:"Try different travel dates", removeFilters:"Remove advanced filters" },
    legal: { termsOfService:"Terms of Service", privacyPolicy:"Privacy Policy", lastUpdated:"Last updated", priceDisclaimer:"Prices and availability may change in real time. Final booking prices are confirmed only at the moment of reservation on the partner's website.", bookingDisclaimer:"Bookings are completed on partner websites. TravelBudget acts as a discovery and comparison platform.", liability:"TravelBudget is not responsible for price changes, availability, or errors by travel providers.", terms:{ acceptanceTitle:"Acceptance of Terms", acceptance:"By accessing or using TravelBudget, you agree to be bound by these Terms of Service.", serviceTitle:"Service Description", service:"TravelBudget is a travel discovery and comparison platform. We do not sell flights, hotels, or travel services directly.", pricesTitle:"Prices and Availability", prices1:"All prices displayed on TravelBudget are estimates only.", prices2:"Prices and availability may change in real time.", prices3:"Some flights, trains, or hotels shown may be sold out or unavailable.", thirdPartyTitle:"Third-Party Providers", thirdParty:"Some travel information may come from third-party data providers and may change without notice.", bookingTitle:"Booking Process", booking:"Booking links redirect to partner websites. TravelBudget may receive an affiliate commission at no extra cost to you.", accountTitle:"User Account", account:"You are responsible for maintaining the confidentiality of your account credentials.", liabilityTitle:"Limitation of Liability", liability1:"TravelBudget provides this service 'as is' and makes no warranties regarding accuracy.", liability2:"TravelBudget is not responsible for price changes, booking errors, cancellations, or delays.", changesTitle:"Changes to Terms", changes:"We may update these Terms of Service from time to time.", contactTitle:"Contact", contact:"For questions about these Terms, please contact us through the app." }, privacy:{ collectTitle:"Information We Collect", collect:"We collect your travel preferences and basic account information (email) via Clerk authentication.", useTitle:"How We Use Your Information", use:"Your data is used solely to generate relevant travel suggestions and maintain your saved trips.", cookiesTitle:"Cookies and Session Data", cookies:"We use essential cookies to maintain your login session and store your privacy consent preferences.", thirdPartyTitle:"Third-Party Services", thirdParty:"We use Clerk for authentication. Booking links may redirect you to third-party platforms.", securityTitle:"Data Security", security:"We take reasonable measures to protect your data. Your credentials are encrypted and managed by Clerk.", rightsTitle:"Your Rights", rights:"You may request access to, correction of, or deletion of your personal data at any time.", liabilityTitle:"Limitation of Liability", liability:"TravelBudget is not responsible for data breaches caused by factors outside our control.", changesTitle:"Changes to This Policy", changes:"We may update this Privacy Policy from time to time." } },
    surprise: { title:"Surprise Trip 🎲", subtitle:"Set your filters and we'll find 3 mystery destinations for you.", howItWorksTitle:"How it works", howItWorks1:"3 mystery trips generated based on your filters", howItWorks2:"Each destination is hidden — reveal it for just €1", howItWorks3:"After revealing, we tell you exactly where you can go!", howItWorksBadge:"€1 per reveal · 3 available", button:"Surprise Me!", buttonSub:"3 mystery trips · €1 each to reveal", cardLabel:"Mystery #", destination:"??? Mystery Destination", destinationHidden:"Destination hidden — tap to reveal for €1", transport:"Transport details hidden", hotel:"Mystery hotel", revealBtn:"Reveal for €1 🎲", paying:"Processing…", revealed:"Destination revealed!", loading:"The AI is finding your surprises…", noResults:"No surprise trips found within this budget. Try increasing it!", disclaimer:"Simulated payment · €1 per destination", generate:"Generate Surprises", regenerate:"New Surprises", filtersTitle:"Your trip preferences", budgetLabel:"Budget", peopleLabel:"Travellers", nightsLabel:"Nights", fromLabel:"From", datesLabel:"Dates", perReveal:"per destination", mysteryImage:"Mystery destination", budgetExceeded:"Within budget", saveRevealed:"Save trip", departureAirport:"Departure airport", departureStation:"Departure station", childrenLabel:"Children", petsLabel:"Pets", amenitiesLabel:"Hotel amenities", freeCancellation:"Free cancellation", breakfastIncluded:"Breakfast", parkingAvailable:"Parking", privateBathroom:"Private bathroom", elevator:"Elevator", petFriendly:"Pet friendly", onlinePayment:"Online payment" },
  },
};

// Italian (full, from source)
TRANSLATIONS.it = {
  landing: { title:"Viaggiare senza pensieri", subtitle:"Scorri i suggerimenti di viaggio curati come una rivista patinata. Trova la tua prossima avventura d'impulso.", getStarted:"Inizia ora", logIn:"Accedi", continueAsGuest:"Continua come ospite" },
  nav: { discover:"Scopri", saved:"Salvati", profile:"Profilo", logOut:"Esci", premium:"Premium", signIn:"Accedi", signUp:"Registrati", guestLabel:"Ospite" },
  discover: { loading:"Cerchiamo le mete perfette...", seenAll:"Hai visto tutto!", seenAllSub:"Possiamo trovare altre destinazioni fantastiche in base alle tue preferenze.", generateMore:"Genera altri viaggi", total:"Totale", like:"MI PIACE", nope:"NO", rateLimitError:"Troppe richieste. Attendi qualche istante.", rateLimitHint:"Il sistema ha rilevato attività insolita.", searchError:"Qualcosa è andato storto", searchErrorHint:"Riprova tra qualche secondo o modifica i filtri", searchErrorRetry:"Riprova", signUpToSave:"Registrati per salvare i tuoi viaggi preferiti!", shareTrip:"Condividi viaggio", shareWhatsapp:"WhatsApp", shareFacebook:"Facebook", shareCopy:"Copia testo", copied:"Copiato!", discoverTitle:"Dove vuoi andare?", discoverSub:"Imposta i filtri per scoprire i viaggi perfetti per il tuo budget", setFilters:"Scegli i filtri", welcomeTitle:"Benvenuto su TravelBudget", welcomeSub:"Scopri il viaggio dei tuoi sogni", welcomeStart:"Inizia a scoprire", noDirectTrainTitle:"Nessun diretto da qui! 😅", noDirectTrain:"Purtroppo dalla tua stazione non parte nessun treno diretto… Prova 'Con cambio'! 🚂", loadingMore:"Caricamento nuovi risultati…", infoBtn:"Info" },
  premium: { title:"Passa a Premium", subtitle:"Hai esaurito tutte le ricerche gratuite", guestSubtitle:"Hai usato le 5 ricerche ospite. Registrati per 20 ricerche gratuite!", price:"€3/mese", benefit1:"80 ricerche al giorno", benefit2:"Filtri destinazione avanzati", benefit3:"Risultati prioritari", cta:"Attiva Premium", ctaSub:"Disdici quando vuoi · Fatturazione mensile", orSignUp:"Registrati per 20 ricerche gratuite", searchesLeft:"di 20 ricerche giornaliere gratuite usate", limitReachedTitle:"Limite giornaliero raggiunto", perDay:"ricerche/giorno", planFree:"Piano Free", planPremium:"Piano Premium", upgradeNow:"Passa a Premium", currentPlan:"Il tuo piano", managePlan:"Gestisci", freePlanDesc:"20 ricerche al giorno, sempre gratis", premiumPlanDesc:"80 ricerche al giorno, esperienza completa", downgrade:"Torna al piano gratuito", alreadyMember:"Sei già membro Premium 🎉", unlockFor:"Sblocca tutto per soli €3/mese", activePlan:"Piano Premium attivo", signUpFirst:"Registrati — poi scegli Premium" },
  offline: { banner:"Nessuna connessione internet", title:"Sei offline 🌐", subtitle:"Mostro gli ultimi viaggi caricati.", noCache:"Connettiti a internet per scoprire i viaggi", searchDisabled:"La ricerca richiede una connessione internet", reconnected:"Connessione ripristinata! 🚀", showingCached:"Mostro i viaggi salvati ✈️" },
  tripDetail: { overview:"Panoramica", highlights:"Punti salienti", transport:"Trasporto", hotel:"Hotel", totalCost:"Costo totale", direct:"Diretto", withStops:"Con scali", nights:"notti", stars:"stelle", kmFromCenter:"km dal centro", perNight:"/ notte", amenities:"Servizi", rating:"Valutazione", signUpCta:"Crea un account per salvare questo viaggio", departure:"Partenza", arrival:"Arrivo", duration:"Durata", perPerson:"Per persona", close:"Chiudi", flight:"Volo", train:"Treno", outbound:"Andata", returnJourney:"Ritorno", totalHotel:"Totale hotel", saveTrip:"Salva viaggio", bookTitle:"Prenota il tuo viaggio", bookSubtitle:"Link affiliati — nessun costo extra per te", bookHotel:"Hotel su Booking", bookTransport:"Trasporto su Omio", bookFlight:"Voli su Skyscanner", budgetRemaining:"Rimanente", overBudget:"sopra budget", cityCenter:"Centro città", centralArea:"Area centrale", connectedArea:"Ben collegato", outskirts:"Periferia" },
  saved: { title:"Viaggi salvati", loading:"Caricamento viaggi salvati...", empty:"Nessun viaggio salvato ancora", emptySub:"Vai su Scopri e inizia a scorrere per creare il tuo itinerario dei sogni.", goToDiscover:"Vai a Scopri", total:"totale", days:"giorni" },
  savedDetail: { notFound:"Viaggio non trovato.", backToSaved:"Torna ai salvati", overview:"Panoramica", highlights:"Punti salienti", totalCost:"Costo totale stimato", flight:"Volo", train:"Treno", fromCenter:"dal centro", night:"notte", nights:"notti", bookNow:"Prenota ora", linkCopied:"Link copiato!", deleted:"Viaggio rimosso.", deleteError:"Impossibile rimuovere il viaggio.", confirmDelete:"Tocca di nuovo per confermare" },
  profile: { title:"Profilo", traveler:"Viaggiatore", tripsSaved:"Viaggi salvati", avgTripPrice:"Prezzo medio viaggio", settings:"Impostazioni", updatePreferences:"Aggiorna preferenze di viaggio", notSet:"Non impostato", privacyPolicy:"Privacy Policy", termsOfService:"Termini di servizio", legalSection:"Legale", loading:"Caricamento...", signOut:"Esci", recentSearches:"Ricerche recenti", noRecentSearches:"Nessuna ricerca ancora — inizia a esplorare!", preferences:"Le mie preferenze", editPreferences:"Modifica", save:"Salva", cancel:"Annulla", repeatSearch:"Ripeti", searchesUsed:"Ricerche usate", departureFrom:"Da", night:"notte", nights:"notti", people:"persone", guestMessage:"Accedi per vedere il tuo profilo e salvare i viaggi.", viewSwipe:"Scorri", viewList:"Lista", tripsCount:"viaggi" },
  onboarding: { budget:"Qual è il tuo budget?", travelers:"Chi viaggia?", flight:"Preferenze di volo", totalBudget:"Budget totale (€)", departureCity:"Città di partenza", numberOfPeople:"Numero di persone", flightType:"Tipo di volo", directOnly:"Solo diretto", withStops:"Con scali", any:"Qualsiasi", back:"Indietro", next:"Avanti", complete:"Completa" },
  cookie: { title:"Rispettiamo la tua privacy", description:'Usiamo i cookie per migliorare la tua esperienza. Cliccando "Accetta tutto" acconsenti all\'uso dei cookie.', decline:"Rifiuta", acceptAll:"Accetta tutto" },
  notFound: { title:"404 Pagina non trovata", sub:"Hai dimenticato di aggiungere la pagina al router?" },
  filters: { title:"Filtri", apply:"Cerca viaggi", edit:"Modifica filtri", activeFilters:"Filtri attivi", noResults:"Nessun viaggio trovato con i filtri attuali", noResultsSub:"Prova a modificare i filtri per ampliare la ricerca.", reset:"Reset", budget:"Budget massimo", travelers:"Viaggiatori", children:"Bambini", pets:"Animali", departureDate:"Data di partenza", returnDate:"Data di ritorno", tripTypeLabel:"Tipo di viaggio", oneWay:"Solo andata", roundTrip:"Andata e ritorno", oneWayHint:"Pianificando la tua avventura di sola andata ✈️", roundTripHint:"Costruendo il tuo viaggio di andata e ritorno 🔄", nights:"Notti", flightType:"Tipo di volo", directOnly:"Solo diretto", withStops:"Con scali", anyFlight:"Nessuna preferenza", maxAirportDist:"Massimo aeroporto → hotel (km)", maxCenterDist:"Massimo dal centro città (km)", noLimit:"Nessun limite", accommodation:"Alloggio", budgetAcc:"Economico", standardAcc:"Standard", luxuryAcc:"Lusso", anyAcc:"Nessuna preferenza", persons:"persone", perPerson:"per persona", departureAirport:"Aeroporto di partenza", arrivalAirport:"Aeroporto di arrivo", departureStation:"Stazione di partenza", arrivalStation:"Stazione di arrivo", hotelStars:"Stelle hotel", trainType:"Tipo di treno", trainDirect:"Solo diretto", trainWithChanges:"Con cambi", budgetIncludes:"Totale per persona — include trasporto A/R + hotel", budgetIncludesOneWay:"Totale per persona — include trasporto solo andata + hotel", budgetTransport:"Trasporto", budgetHotel:"Alloggio", budgetBuffer:"Buffer", sortBy:"Ordina per", sortBestValue:"Miglior rapporto", sortCheapest:"Più economico", sortFastest:"Più veloce", sortBestRating:"Meglio valutato", departureTime:"Orario di partenza", morning:"Mattina", afternoon:"Pomeriggio", evening:"Sera", maxTravelTime:"Tempo massimo di viaggio", hostelOnly:"Ostello", hotelFeatures:"Servizi hotel", freeCancellation:"Cancellazione gratuita", breakfastIncluded:"Colazione inclusa", parkingAvailable:"Parcheggio", ratingFilter:"Valutazione minima", minLabel:"Min", maxLabel:"Max", ratingAbove8:"Valutazione ≥ 8/10", privateBathroom:"Bagno privato", propertyType:"Tipo di struttura", hotelOnly:"Hotel", apartmentOnly:"Appartamento", onlinePayment:"Pagamento online", elevator:"Ascensore", petFriendly:"Animali ammessi", validationTitle:"Mancano alcuni dettagli 👀", validationSubtitle:"Compila i campi evidenziati per trovare i tuoi viaggi perfetti", missingDeparture:"Da dove parti? Aggiungi almeno un aeroporto o stazione di partenza ✈️", missingArrival:"Non possiamo pianificare un viaggio senza sapere dove vuoi andare 😅", missingDepartureDate:"Quando parti? Anche la nostra IA ha bisogno di una data ✈️", missingReturnDate:"E quando torni? Speriamo non sia per sempre 😄", returnBeforeDeparture:"La data di ritorno è prima della partenza… viaggio nel tempo non incluso! ⏰", sameLocation:"Partenza e destinazione uguali… a meno che non esista il teletrasporto 🚀", invalidBudget:"Manca il budget… purtroppo le compagnie aeree non accettano la speranza come pagamento 💸" },
  fun: { loadingMessages:["Cerchiamo il viaggio perfetto… 🔍✈️","Consultando gli oracoli dei voli… 🧙‍♂️","Trattando con gli hotel per te… 🏨","Verificando se il tuo budget è realistico… 👀","Scansionando tutta l'Europa per te… 🌍","Calcolando il miglior viaggio possibile… 🧠","Quasi trovato qualcosa di interessante… 🔥"], noResultsMessages:["Con questo budget chiediamo troppo all'universo… 😅","Neanche Sherlock Holmes troverebbe un viaggio qui 🔎","Prova ad aumentare il budget… o prega un po' ✈️🙏","Gli hotel stanno ridendo del tuo budget 😭","Abbiamo cercato ovunque… letteralmente OVUNQUE 🌍","Forse stai chiedendo un viaggio in modalità supereroe 🦸","Non abbiamo trovato nulla… ma non ci arrendiamo 💪"], lowBudgetMessages:["Questo budget è più creativo che realistico 😄","Stiamo lavorando con la magia, non con la matematica 🪄","Potremmo trovare qualcosa… ma senza promesse 👀","Budget piccolo, sogni grandi ✨"], successMessages:["Trovato! Questo viaggio è un gioiello 🔥","Ecco un ottimo affare 💸","Prenoterei questo viaggio anche io 😎","Match perfetto trovato ✈️✨"], captions:["Fuga perfetta del weekend 😎","Lusso ma ancora legale per il tuo budget 💸","Viaggio caotico ed economico 😂","Il tuo portafoglio ha detto sì — per un pelo 💚","L'avventura aspetta, conto corrente permettendo ✈️","Piano di fuga: attivato 🚀","La tua prossima storia inizia qui 📖","Sole, mare e sorprendentemente conveniente ☀️"], savingsMessages:["Psst… ti stai mettendo in tasca {amount}! 🎉","Il tuo portafoglio fa festa: {amount} risparmiati! 💃","Chi ha detto che viaggiare è caro? Avanzano {amount}! 💪"], trainNotDirectMessages:["Nessun diretto? Prepara snack — hai i cambi! 🚂😄","Questo treno si ferma più di un turista con il selfie stick 📸🚂"] },
  notifications: { title:"Notifiche", empty:"Nessuna notifica ancora", clearAll:"Cancella tutto", markRead:"Segna come lette", tripSaved:"Viaggio salvato nella lista! ✈️", limitWarning:"Quasi al limite di ricerche" },
  smartSuggestions: { title:"Prova questi suggerimenti", increaseBudget:"Aumenta budget a €{amount}", allowFlightStops:"Consenti voli con scali", allowTrainStops:"Consenti treni con coincidenze", fewerNights:"Prova con {n} notti", removeAccFilter:"Rimuovi filtro alloggio", editFilters:"Modifica filtri manualmente", changeDates:"Prova date di viaggio diverse", removeFilters:"Rimuovi filtri avanzati" },
  legal: TRANSLATIONS.en.legal,
  surprise: { title:"Viaggio Sorpresa 🎲", subtitle:"Configura i filtri e troveremo 3 destinazioni misteriose per te.", howItWorksTitle:"Come funziona", howItWorks1:"3 viaggi misteriosi generati in base ai tuoi filtri", howItWorks2:"Ogni destinazione è nascosta — rivelala per soli €1", howItWorks3:"Dopo la rivelazione, ti diciamo esattamente dove puoi andare!", howItWorksBadge:"€1 per rivelare · 3 disponibili", button:"Sorprendimi!", buttonSub:"3 viaggi misteriosi · €1 ciascuno", cardLabel:"Mistero #", destination:"??? Destinazione Misteriosa", destinationHidden:"Destinazione nascosta — tocca per rivelare per €1", transport:"Dettagli trasporto nascosti", hotel:"Hotel misterioso", revealBtn:"Rivela per €1 🎲", paying:"Elaborazione…", revealed:"Destinazione rivelata!", loading:"L'IA sta cercando le tue sorprese…", noResults:"Nessun viaggio sorpresa trovato con questo budget. Prova ad aumentarlo!", disclaimer:"Pagamento simulato · €1 per destinazione", generate:"Genera Sorprese", regenerate:"Nuove Sorprese", filtersTitle:"Le tue preferenze di viaggio", budgetLabel:"Budget", peopleLabel:"Viaggiatori", nightsLabel:"Notti", fromLabel:"Da", datesLabel:"Date", perReveal:"per destinazione", mysteryImage:"Destinazione misteriosa", budgetExceeded:"Nei limiti del budget", saveRevealed:"Salva viaggio", departureAirport:"Aeroporto di partenza", departureStation:"Stazione di partenza", childrenLabel:"Bambini", petsLabel:"Animali", amenitiesLabel:"Servizi hotel", freeCancellation:"Cancellazione gratuita", breakfastIncluded:"Colazione", parkingAvailable:"Parcheggio", privateBathroom:"Bagno privato", elevator:"Ascensore", petFriendly:"Animali ammessi", onlinePayment:"Pagamento online" },
};

// Copy missing keys from English
function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const k of Object.keys(source)) {
    if (!(k in out)) out[k] = source[k];
    else if (typeof source[k] === 'object' && !Array.isArray(source[k]) && typeof out[k] === 'object' && !Array.isArray(out[k])) {
      out[k] = deepMerge(out[k], source[k]);
    }
  }
  return out;
}

// Spanish translations (abbreviated, falling back to English for missing)
TRANSLATIONS.es = deepMerge({
  landing: { title:"Viajar sin esfuerzo", subtitle:"Desliza sugerencias de viaje seleccionadas como una revista de lujo. Encuentra tu próxima aventura.", getStarted:"Comenzar", logIn:"Iniciar sesión", continueAsGuest:"Continuar como invitado" },
  nav: { discover:"Descubrir", saved:"Guardados", profile:"Perfil", logOut:"Cerrar sesión", premium:"Premium", signIn:"Iniciar sesión", signUp:"Registrarse", guestLabel:"Invitado" },
  discover: { discoverTitle:"¿Adónde quieres ir?", discoverSub:"Configura los filtros para descubrir viajes perfectos para tu presupuesto", setFilters:"Elegir filtros", like:"ME GUSTA", nope:"NO", welcomeSub:"Descubre el viaje de tus sueños", welcomeStart:"Empezar a explorar", generateMore:"Generar más viajes", seenAll:"¡Lo has visto todo!", infoBtn:"Info" },
  premium: { title:"Pasa a Premium", cta:"Activar Premium", price:"€3/mes", benefit1:"80 búsquedas al día", benefit2:"Filtros de destino avanzados", benefit3:"Resultados prioritarios" },
  saved: { title:"Viajes guardados", empty:"Aún no hay viajes guardados", goToDiscover:"Ir a Descubrir" },
  profile: { title:"Perfil", signOut:"Cerrar sesión", save:"Guardar", cancel:"Cancelar" },
  filters: { title:"Filtros", apply:"Buscar viajes", reset:"Restablecer" },
  cookie: { title:"Valoramos tu privacidad", description:'Usamos cookies para mejorar tu experiencia. Al hacer clic en "Aceptar todo", aceptas el uso de cookies.', decline:"Rechazar", acceptAll:"Aceptar todo" },
  surprise: { title:"Viaje Sorpresa 🎲", generate:"Generar Sorpresas", revealed:"¡Destino revelado!" },
}, TRANSLATIONS.en);

// French
TRANSLATIONS.fr = deepMerge({
  landing: { title:"Le voyage sans effort", subtitle:"Faites défiler des suggestions de voyage soigneusement sélectionnées. Trouvez votre prochaine aventure.", getStarted:"Commencer", logIn:"Se connecter", continueAsGuest:"Continuer en tant qu'invité" },
  nav: { discover:"Découvrir", saved:"Enregistrés", profile:"Profil", logOut:"Se déconnecter", premium:"Premium", signIn:"Se connecter", signUp:"S'inscrire", guestLabel:"Invité" },
  discover: { discoverTitle:"Où voulez-vous aller ?", discoverSub:"Configurez les filtres pour découvrir des voyages parfaits pour votre budget", setFilters:"Choisir les filtres", like:"J'AIME", nope:"NON", welcomeSub:"Découvrez le voyage de vos rêves", welcomeStart:"Commencer à explorer", generateMore:"Générer plus de voyages", seenAll:"Vous avez tout vu !", infoBtn:"Info" },
  premium: { title:"Passer à Premium", cta:"Activer Premium", price:"3€/mois", benefit1:"80 recherches par jour", benefit2:"Filtres de destination avancés", benefit3:"Résultats prioritaires" },
  saved: { title:"Voyages enregistrés", empty:"Pas encore de voyages enregistrés", goToDiscover:"Aller à Découvrir" },
  profile: { title:"Profil", signOut:"Se déconnecter", save:"Enregistrer", cancel:"Annuler" },
  filters: { title:"Filtres", apply:"Rechercher des voyages", reset:"Réinitialiser" },
  cookie: { title:"Nous respectons votre vie privée", description:'Nous utilisons des cookies pour améliorer votre expérience. En cliquant "Accepter tout", vous consentez à l\'utilisation des cookies.', decline:"Refuser", acceptAll:"Accepter tout" },
  surprise: { title:"Voyage Surprise 🎲", generate:"Générer des Surprises", revealed:"Destination révélée !" },
}, TRANSLATIONS.en);

// German
TRANSLATIONS.de = deepMerge({
  landing: { title:"Reisen leicht gemacht", subtitle:"Wischen Sie durch kuratierte Reisevorschläge wie ein glänzendes Reisemagazin. Finden Sie Ihr nächstes Abenteuer.", getStarted:"Loslegen", logIn:"Anmelden", continueAsGuest:"Als Gast fortfahren" },
  nav: { discover:"Entdecken", saved:"Gespeichert", profile:"Profil", logOut:"Abmelden", premium:"Premium", signIn:"Anmelden", signUp:"Registrieren", guestLabel:"Gast" },
  discover: { discoverTitle:"Wohin möchten Sie reisen?", discoverSub:"Filter einstellen, um Reisen innerhalb Ihres Budgets zu entdecken", setFilters:"Filter wählen", like:"MAG ICH", nope:"NEIN", welcomeSub:"Entdecken Sie die Reise Ihrer Träume", welcomeStart:"Entdecken starten", generateMore:"Mehr Reisen generieren", seenAll:"Du hast alles gesehen!", infoBtn:"Info" },
  premium: { title:"Auf Premium upgraden", cta:"Premium aktivieren", price:"3€/Monat", benefit1:"80 Suchen pro Tag", benefit2:"Erweiterte Zielfilter", benefit3:"Prioritätsergebnisse" },
  saved: { title:"Gespeicherte Reisen", empty:"Noch keine gespeicherten Reisen", goToDiscover:"Zu Entdecken" },
  profile: { title:"Profil", signOut:"Abmelden", save:"Speichern", cancel:"Abbrechen" },
  filters: { title:"Filter", apply:"Reisen suchen", reset:"Zurücksetzen" },
  cookie: { title:"Wir schätzen Ihre Privatsphäre", description:'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern. Durch Klicken auf "Alle akzeptieren" stimmen Sie zu.', decline:"Ablehnen", acceptAll:"Alle akzeptieren" },
  surprise: { title:"Überraschungsreise 🎲", generate:"Überraschungen generieren", revealed:"Ziel enthüllt!" },
}, TRANSLATIONS.en);

// Chinese
TRANSLATIONS.zh = deepMerge({
  landing: { title:"轻松实现旅行梦想", subtitle:"像翻阅旅行杂志一样滑动精选旅行建议，随性发现您的下一段冒险。", getStarted:"立即开始", logIn:"登录", continueAsGuest:"以游客身份继续" },
  nav: { discover:"探索", saved:"收藏", profile:"个人", logOut:"退出", premium:"高级版", signIn:"登录", signUp:"注册", guestLabel:"访客" },
  discover: { discoverTitle:"您想去哪里？", discoverSub:"设置筛选条件，发现适合您预算的行程", setFilters:"设置筛选", like:"喜欢", nope:"跳过", welcomeSub:"发现您梦寐以求的旅行", welcomeStart:"开始探索", generateMore:"生成更多行程", seenAll:"您已看完所有！", infoBtn:"详情" },
  premium: { title:"升级到高级版", cta:"激活高级版", price:"€3/月", benefit1:"每天80次搜索", benefit2:"高级目的地筛选", benefit3:"优先结果" },
  saved: { title:"收藏的行程", empty:"暂无收藏行程", goToDiscover:"前往探索" },
  profile: { title:"个人资料", signOut:"退出登录", save:"保存", cancel:"取消" },
  filters: { title:"筛选", apply:"搜索行程", reset:"重置" },
  cookie: { title:"我们重视您的隐私", description:'我们使用Cookie来增强您的浏览体验。点击"全部接受"即表示您同意使用Cookie。', decline:"拒绝", acceptAll:"全部接受" },
  surprise: { title:"惊喜之旅 🎲", generate:"生成惊喜", revealed:"目的地已揭晓！" },
}, TRANSLATIONS.en);

const LANGUAGES = [
  { code:'it', label:'Italiano', flag:'🇮🇹' },
  { code:'en', label:'English', flag:'🇬🇧' },
  { code:'es', label:'Español', flag:'🇪🇸' },
  { code:'fr', label:'Français', flag:'🇫🇷' },
  { code:'de', label:'Deutsch', flag:'🇩🇪' },
  { code:'zh', label:'中文', flag:'🇨🇳' },
];

/* ─── App State ─────────────────────────────────────────────────────────── */
const State = {
  lang: localStorage.getItem('tb_lang') || 'it',
  get t() { return TRANSLATIONS[this.lang] || TRANSLATIONS.it; },
  route: location.hash.replace('#','') || '/',
  // Auth
  user: JSON.parse(localStorage.getItem('tb_user') || 'null'),
  get isSignedIn() { return !!this.user; },
  // Saved trips
  savedTrips: JSON.parse(localStorage.getItem('tb_saved') || '[]'),
  // Notifications
  notifications: JSON.parse(localStorage.getItem('tb_notif') || '[]'),
  // Guest search count
  guestCount: parseInt(localStorage.getItem('guestSearchCount') || '0'),
  // Premium
  get isPremium() { return this.user?.isPremium || false; },
  // Discover state
  trips: [],
  currentIndex: 0,
  swipeHistory: [],
  filters: JSON.parse(localStorage.getItem('tb_discover_filters') || 'null') || getDefaultFilters(),
  hasSearched: false,
  viewMode: 'swipe',
  detailTrip: null,
  shareTrip: null,
  // Onboarding
  onboardingStep: 1,
  onboardingData: { budget:2000, numberOfPeople:2, departureLocation:'', flightPreference:'any' },
  // Surprise
  surpriseTrips: [],
  surpriseFilters: getDefaultSurpriseFilters(),
  surpriseRevealed: {},
  surprisePaying: {},
  surpriseHasSearched: false,
  // Recent searches (simulated)
  recentSearches: JSON.parse(localStorage.getItem('tb_searches') || '[]'),
  // Profile edit
  editingPrefs: false,
  prefs: JSON.parse(localStorage.getItem('tb_prefs') || 'null') || {},
  // Confirm delete
  confirmDeleteId: null,
};

function getDefaultFilters() {
  return { budget:3000, numberOfPeople:2, numberOfChildren:0, numberOfPets:0, departureDate:'', returnDate:'', numberOfNights:7, flightPreference:'any', trainPreference:'any', maxDistanceFromAirportKm:null, maxHotelDistanceFromCenterKm:null, accommodationType:null, departureAirport:'', arrivalAirport:'', departureStation:'', arrivalStation:'', hotelStarsMin:1, hotelStarsMax:5, freeCancellation:false, breakfastIncluded:false, parkingAvailable:false, minHotelRating:null, privateBathroom:false, propertyType:'any', onlinePayment:false, elevator:false, petFriendly:false, tripType:'round_trip', sortBy:'cheapest', maxTravelTimeHours:null, departureTimeSlot:'any' };
}

function getDefaultSurpriseFilters() {
  return { budget:2000, numberOfPeople:2, numberOfChildren:0, numberOfPets:0, numberOfNights:7, departureAirport:'', departureStation:'', departureDate:'', returnDate:'', tripType:'round_trip', flightPreference:'any', trainPreference:'any', accommodationType:null, hotelStarsMin:null, hotelStarsMax:null, minHotelRating:null, freeCancellation:false, breakfastIncluded:false, parkingAvailable:false, privateBathroom:false, elevator:false, petFriendly:false, onlinePayment:false };
}

function saveState() {
  if (State.user) localStorage.setItem('tb_user', JSON.stringify(State.user));
  else localStorage.removeItem('tb_user');
  localStorage.setItem('tb_saved', JSON.stringify(State.savedTrips));
  localStorage.setItem('tb_notif', JSON.stringify(State.notifications));
  localStorage.setItem('tb_lang', State.lang);
  localStorage.setItem('tb_discover_filters', JSON.stringify(State.filters));
  localStorage.setItem('tb_searches', JSON.stringify(State.recentSearches));
  localStorage.setItem('tb_prefs', JSON.stringify(State.prefs));
}

/* ─── Mock Airports / Stations ──────────────────────────────────────────── */
const AIRPORTS = [
  { name:'Roma Fiumicino', code:'FCO', country:'Italy' },
  { name:'Milano Malpensa', code:'MXP', country:'Italy' },
  { name:'Milano Linate', code:'LIN', country:'Italy' },
  { name:'Venezia Marco Polo', code:'VCE', country:'Italy' },
  { name:'Napoli', code:'NAP', country:'Italy' },
  { name:'Catania', code:'CTA', country:'Italy' },
  { name:'Palermo', code:'PMO', country:'Italy' },
  { name:'Torino', code:'TRN', country:'Italy' },
  { name:'Bologna', code:'BLQ', country:'Italy' },
  { name:'Firenze', code:'FLR', country:'Italy' },
  { name:'Bari', code:'BRI', country:'Italy' },
  { name:'London Heathrow', code:'LHR', country:'UK' },
  { name:'Paris Charles de Gaulle', code:'CDG', country:'France' },
  { name:'Madrid Barajas', code:'MAD', country:'Spain' },
  { name:'Barcelona El Prat', code:'BCN', country:'Spain' },
  { name:'Amsterdam Schiphol', code:'AMS', country:'Netherlands' },
  { name:'Frankfurt', code:'FRA', country:'Germany' },
  { name:'Berlin Brandenburg', code:'BER', country:'Germany' },
  { name:'Vienna', code:'VIE', country:'Austria' },
  { name:'Zurich', code:'ZRH', country:'Switzerland' },
  { name:'Lisbon', code:'LIS', country:'Portugal' },
  { name:'Athens', code:'ATH', country:'Greece' },
  { name:'Dubai', code:'DXB', country:'UAE' },
  { name:'Tokyo Narita', code:'NRT', country:'Japan' },
  { name:'New York JFK', code:'JFK', country:'USA' },
  { name:'Any destination', code:'ANY', country:'' },
];

const STATIONS = [
  { name:'Roma Termini', code:'IT-ROM', country:'Italy' },
  { name:'Milano Centrale', code:'IT-MIL', country:'Italy' },
  { name:'Venezia Santa Lucia', code:'IT-VCE', country:'Italy' },
  { name:'Firenze Santa Maria Novella', code:'IT-FLR', country:'Italy' },
  { name:'Napoli Centrale', code:'IT-NAP', country:'Italy' },
  { name:'Torino Porta Nuova', code:'IT-TRN', country:'Italy' },
  { name:'Bologna Centrale', code:'IT-BLQ', country:'Italy' },
  { name:'Paris Gare de Lyon', code:'FR-PAR', country:'France' },
  { name:'Barcelona Sants', code:'ES-BCN', country:'Spain' },
  { name:'Madrid Atocha', code:'ES-MAD', country:'Spain' },
  { name:'Amsterdam Centraal', code:'NL-AMS', country:'Netherlands' },
  { name:'Vienna Hauptbahnhof', code:'AT-VIE', country:'Austria' },
  { name:'Berlin Hbf', code:'DE-BER', country:'Germany' },
  { name:'Frankfurt Hbf', code:'DE-FRA', country:'Germany' },
  { name:'Zurich HB', code:'CH-ZRH', country:'Switzerland' },
  { name:'London St Pancras', code:'GB-LON', country:'UK' },
  { name:'Any station', code:'ANY', country:'' },
];

/* ─── Mock Trips ────────────────────────────────────────────────────────── */
const MOCK_TRIPS = [
  { id:'trip-1', destination:'Bali', country:'Indonesia', totalPrice:1250, durationDays:10, description:'Paradise island with stunning temples, lush rice terraces, and pristine beaches. Experience spiritual ceremonies, world-class surfing, and vibrant nightlife.', highlights:['Visit Tegallalang Rice Terraces at sunrise','Temple hopping at Uluwatu and Tanah Lot','Surfing lessons at Kuta Beach','Traditional Balinese cooking class','Mount Batur sunrise trek'], imageUrl:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', transport:{ type:'flight', company:'Qatar Airways', price:580, duration:'14h 30m', direct:false, departureTime:'10:30', arrivalTime:'00:55+1' }, hotel:{ name:'Kuta Beach Hotel', stars:4, pricePerNight:67, distanceFromCenter:1.2, rating:8.4, amenities:['WiFi','Pool','Breakfast','Air conditioning'] }, returnTransport:{ company:'Qatar Airways', price:490, duration:'13h 45m', direct:false } },
  { id:'trip-2', destination:'Parigi', country:'Francia', totalPrice:890, durationDays:5, description:'La Ville Lumière awaits with its iconic Eiffel Tower, world-famous cuisine, and unparalleled art scene. Stroll along the Seine and lose yourself in Montmartre.', highlights:['Eiffel Tower at sunset','Louvre Museum highlights tour','Morning croissants in Montmartre','Seine River cruise by night','Shopping on Champs-Élysées'], imageUrl:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', transport:{ type:'flight', company:'Air France', price:220, duration:'2h 10m', direct:true, departureTime:'07:15', arrivalTime:'09:25' }, hotel:{ name:'Hotel Le Marais', stars:4, pricePerNight:134, distanceFromCenter:0.8, rating:8.7, amenities:['WiFi','Breakfast','Bar','Air conditioning'] }, returnTransport:{ company:'Air France', price:195, duration:'2h 05m', direct:true } },
  { id:'trip-3', destination:'Tokyo', country:'Giappone', totalPrice:1890, durationDays:12, description:'A mesmerizing fusion of ancient tradition and cutting-edge modernity. From serene temples to neon-lit streets, Tokyo is an unforgettable sensory experience.', highlights:['Shibuya crossing at rush hour','Senso-ji Temple at dawn','Robot Restaurant show','Day trip to Mount Fuji','Sushi master class in Tsukiji'], imageUrl:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', transport:{ type:'flight', company:'ANA', price:790, duration:'13h 20m', direct:false, departureTime:'13:00', arrivalTime:'09:20+1' }, hotel:{ name:'Shinjuku Grand Hotel', stars:4, pricePerNight:92, distanceFromCenter:0.5, rating:8.9, amenities:['WiFi','Gym','Breakfast','City view'] }, returnTransport:{ company:'ANA', price:740, duration:'12h 55m', direct:false } },
  { id:'trip-4', destination:'Lisbona', country:'Portogallo', totalPrice:680, durationDays:5, description:'A city of nostalgic fado music, colourful azulejo tiles, and dramatic Atlantic views. Ride the iconic yellow trams through historic neighbourhoods.', highlights:['Belém Tower and Jerónimos Monastery','Tram 28 through Alfama','Pastéis de Belém at the original bakery','Sintra day trip','Sunset at Cabo da Roca'], imageUrl:'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=600&q=80', transport:{ type:'flight', company:'TAP Air Portugal', price:180, duration:'2h 30m', direct:true, departureTime:'08:00', arrivalTime:'10:30' }, hotel:{ name:'Bairro Alto Hotel', stars:3, pricePerNight:75, distanceFromCenter:0.3, rating:8.2, amenities:['WiFi','Breakfast','Terrace'] }, returnTransport:{ company:'TAP Air Portugal', price:165, duration:'2h 40m', direct:true } },
  { id:'trip-5', destination:'Santorini', country:'Grecia', totalPrice:1120, durationDays:7, description:'Iconic blue-domed churches, whitewashed cliffs, and the most spectacular sunsets on earth. The perfect romantic escape in the Cyclades.', highlights:['Oia sunset — world-famous views','Caldera boat tour','Wine tasting at local vineyards','Black sand beach at Perissa','Akrotiri archaeological site'], imageUrl:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', transport:{ type:'flight', company:'Aegean Airlines', price:310, duration:'2h 50m', direct:false, departureTime:'09:00', arrivalTime:'13:45' }, hotel:{ name:'Oia Sunset Villas', stars:4, pricePerNight:98, distanceFromCenter:1.5, rating:9.1, amenities:['WiFi','Pool','Caldera view','Breakfast'] }, returnTransport:{ company:'Aegean Airlines', price:295, duration:'2h 45m', direct:false } },
  { id:'trip-6', destination:'New York', country:'USA', totalPrice:1650, durationDays:8, description:'The city that never sleeps — from Times Square to Central Park, Brooklyn Bridge to the Met. Iconic skyline, world-class food, and endless energy.', highlights:['Sunrise at Top of the Rock','Central Park bicycle tour','Brooklyn Bridge walk','MoMA and Metropolitan Museum','Broadway show experience'], imageUrl:'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', transport:{ type:'flight', company:'Delta Airlines', price:690, duration:'10h 20m', direct:true, departureTime:'11:30', arrivalTime:'14:50' }, hotel:{ name:'Midtown Manhattan Hotel', stars:4, pricePerNight:145, distanceFromCenter:0.4, rating:8.3, amenities:['WiFi','Gym','City view','24h service'] }, returnTransport:{ company:'Delta Airlines', price:650, duration:'10h 05m', direct:true } },
  { id:'trip-7', destination:'Barcellona', country:'Spagna', totalPrice:750, durationDays:5, description:'Gaudí\'s architectural masterpieces, vibrant La Rambla, and sun-soaked beaches make Barcelona one of Europe\'s most exciting cities.', highlights:['Sagrada Família interior tour','Park Güell mosaic terraces','Tapas crawl in El Born','Barceloneta Beach afternoon','Picasso Museum'], imageUrl:'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80', transport:{ type:'flight', company:'Vueling', price:145, duration:'2h 05m', direct:true, departureTime:'06:45', arrivalTime:'09:00' }, hotel:{ name:'Gothic Quarter Hotel', stars:3, pricePerNight:89, distanceFromCenter:0.2, rating:8.5, amenities:['WiFi','Rooftop bar','Air conditioning'] }, returnTransport:{ company:'Vueling', price:130, duration:'2h 10m', direct:true } },
  { id:'trip-8', destination:'Praga', country:'Repubblica Ceca', totalPrice:560, durationDays:4, description:'The "City of a Hundred Spires" enchants with its fairy-tale Old Town, medieval bridges, and legendary beer culture.', highlights:['Charles Bridge at dawn','Prague Castle complex','Astronomical Clock show','Old Town Square dinner','Czech brewery tour'], imageUrl:'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=600&q=80', transport:{ type:'train', company:'Trenitalia + ÖBB', price:210, duration:'9h 30m', direct:false, departureTime:'07:00', arrivalTime:'16:30' }, hotel:{ name:'Malá Strana Boutique', stars:3, pricePerNight:72, distanceFromCenter:0.7, rating:8.0, amenities:['WiFi','Breakfast','Historic building'] }, returnTransport:{ company:'ÖBB + Trenitalia', price:200, duration:'9h 45m', direct:false } },
  { id:'trip-9', destination:'Amsterdam', country:'Paesi Bassi', totalPrice:720, durationDays:5, description:'Canals, tulips, and world-class museums. Cycle through historic streets and discover hidden gems at every turn in this uniquely charming city.', highlights:['Anne Frank House visit','Rijksmuseum Rembrandt collection','Canal boat tour','Keukenhof flower gardens','Vondelpark morning cycle'], imageUrl:'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=600&q=80', transport:{ type:'flight', company:'KLM', price:180, duration:'2h 15m', direct:true, departureTime:'08:30', arrivalTime:'10:45' }, hotel:{ name:'Canal View Hotel', stars:3, pricePerNight:110, distanceFromCenter:0.6, rating:8.2, amenities:['WiFi','Canal view','Breakfast'] }, returnTransport:{ company:'KLM', price:165, duration:'2h 20m', direct:true } },
  { id:'trip-10', destination:'Dubai', country:'Emirati Arabi', totalPrice:1450, durationDays:7, description:'Where futuristic skyscrapers meet ancient desert culture. Burj Khalifa views, desert safaris, luxury malls, and pristine beaches in one extraordinary destination.', highlights:['Burj Khalifa observation deck','Desert safari with dinner show','Gold Souk and Spice Souk','Dubai Frame and Museum of the Future','Palm Jumeirah tour'], imageUrl:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', transport:{ type:'flight', company:'Emirates', price:480, duration:'5h 45m', direct:true, departureTime:'03:15', arrivalTime:'09:00' }, hotel:{ name:'Downtown Dubai Hotel', stars:5, pricePerNight:145, distanceFromCenter:0.3, rating:9.0, amenities:['WiFi','Pool','Spa','Burj view','Breakfast'] }, returnTransport:{ company:'Emirates', price:460, duration:'5h 55m', direct:true } },
  { id:'trip-11', destination:'Roma', country:'Italia', totalPrice:480, durationDays:4, description:'Eternal city of ancient wonders, Renaissance art, and unbeatable cuisine. The Colosseum, Vatican, and countless piazzas await your discovery.', highlights:['Colosseum and Roman Forum','Vatican Museums and Sistine Chapel','Trevi Fountain coin toss','Pasta-making class in Trastevere','Borghese Gallery visit'], imageUrl:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', transport:{ type:'train', company:'Trenitalia', price:45, duration:'3h 00m', direct:true, departureTime:'09:00', arrivalTime:'12:00' }, hotel:{ name:'Hotel Campo de\' Fiori', stars:3, pricePerNight:95, distanceFromCenter:0.4, rating:8.1, amenities:['WiFi','Rooftop terrace','Historic centre'] }, returnTransport:{ company:'Trenitalia', price:45, duration:'3h 00m', direct:true } },
  { id:'trip-12', destination:'Maldive', country:'Repubblica delle Maldive', totalPrice:2800, durationDays:10, description:'Crystal-clear turquoise waters, overwater bungalows, and spectacular coral reefs. The ultimate luxury escape to paradise.', highlights:['Snorkelling with manta rays','Sunset dolphin cruise','Private sandbank picnic','Underwater restaurant dinner','Island hopping by speedboat'], imageUrl:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', transport:{ type:'flight', company:'Sri Lankan Airlines', price:890, duration:'11h 20m', direct:false, departureTime:'14:00', arrivalTime:'03:20+1' }, hotel:{ name:'Overwater Paradise Resort', stars:5, pricePerNight:190, distanceFromCenter:0.0, rating:9.4, amenities:['WiFi','Overwater villa','Snorkelling','All-inclusive','Spa'] }, returnTransport:{ company:'Sri Lankan Airlines', price:840, duration:'11h 05m', direct:false } },
  { id:'trip-13', destination:'Kyoto', country:'Giappone', totalPrice:1650, durationDays:9, description:'Ancient temples, bamboo forests, and geisha districts — Kyoto preserves Japan\'s soul. A timeless journey through centuries of culture and tradition.', highlights:['Fushimi Inari 10,000 torii gates hike','Arashiyama Bamboo Grove at dawn','Geisha sighting in Gion district','Traditional tea ceremony','Nijo Castle gardens'], imageUrl:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', transport:{ type:'flight', company:'Lufthansa', price:680, duration:'13h 10m', direct:false, departureTime:'15:45', arrivalTime:'11:55+1' }, hotel:{ name:'Gion Ryokan', stars:4, pricePerNight:98, distanceFromCenter:1.0, rating:9.0, amenities:['WiFi','Traditional room','Japanese breakfast','Garden view'] }, returnTransport:{ company:'Lufthansa', price:640, duration:'12h 45m', direct:false } },
  { id:'trip-14', destination:'Vienna', country:'Austria', totalPrice:740, durationDays:5, description:'Imperial palaces, world-class opera, legendary coffeehouse culture, and Beethoven\'s footsteps. Vienna is sophistication at its finest.', highlights:['Schönbrunn Palace and gardens','Vienna State Opera evening performance','Belvedere Museum — Klimt\'s The Kiss','Naschmarkt fresh food tour','Wiener Schnitzel at a historic Gasthof'], imageUrl:'https://images.unsplash.com/photo-1516550893885-985c836c5cd4?w=600&q=80', transport:{ type:'train', company:'ÖBB Railjet', price:180, duration:'11h 30m', direct:false, departureTime:'06:30', arrivalTime:'18:00' }, hotel:{ name:'Ringstrasse Grand Hotel', stars:4, pricePerNight:112, distanceFromCenter:0.4, rating:8.6, amenities:['WiFi','Spa','Opera view','Breakfast'] }, returnTransport:{ company:'ÖBB Railjet', price:170, duration:'11h 45m', direct:false } },
  { id:'trip-15', destination:'Costiera Amalfitana', country:'Italia', totalPrice:920, durationDays:6, description:'Dramatic cliffs plunging into azure waters, pastel-coloured villages, and the intoxicating scent of lemons. Italy\'s most spectacular coastline.', highlights:['Positano cliff-side walk','Ravello Villa Cimbrone gardens','Boat trip to Grotta dello Smeraldo','Limoncello distillery visit','Seafood dinner in Amalfi town'], imageUrl:'https://images.unsplash.com/photo-1616693494-2c5bb0c96a61?w=600&q=80', transport:{ type:'train', company:'Trenitalia + Ferry', price:95, duration:'5h 30m', direct:false, departureTime:'08:00', arrivalTime:'13:30' }, hotel:{ name:'Hotel Villa Rufolo', stars:4, pricePerNight:135, distanceFromCenter:0.2, rating:8.8, amenities:['WiFi','Sea view','Pool','Restaurant'] }, returnTransport:{ company:'Ferry + Trenitalia', price:90, duration:'5h 45m', direct:false } },
  { id:'trip-16', destination:'Marrakech', country:'Marocco', totalPrice:640, durationDays:5, description:'A sensory explosion of spice markets, mosaic-covered palaces, and labyrinthine medinas. Marrakech is one of the world\'s most captivating cities.', highlights:['Djemaa el-Fna square at dusk','Majorelle Garden and YSL Museum','Bahia Palace intricate tilework','Hammam and argan oil spa','Camel ride at Palmeraie'], imageUrl:'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80', transport:{ type:'flight', company:'Ryanair', price:185, duration:'2h 40m', direct:true, departureTime:'07:30', arrivalTime:'10:10' }, hotel:{ name:'Riad Atlas Medina', stars:3, pricePerNight:75, distanceFromCenter:0.3, rating:8.3, amenities:['WiFi','Rooftop terrace','Pool','Traditional breakfast'] }, returnTransport:{ company:'Ryanair', price:170, duration:'2h 50m', direct:true } },
  { id:'trip-17', destination:'Berlino', country:'Germania', totalPrice:580, durationDays:4, description:'Europe\'s coolest capital — where history, art, and cutting-edge culture collide. From the Brandenburg Gate to underground techno clubs.', highlights:['Berlin Wall memorial and East Side Gallery','Reichstag glass dome with city views','Museum Island — Pergamon collection','Street art tour in Kreuzberg','Club night in legendary Berghain area'], imageUrl:'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80', transport:{ type:'flight', company:'easyJet', price:120, duration:'2h 00m', direct:true, departureTime:'07:00', arrivalTime:'09:00' }, hotel:{ name:'Mitte Design Hotel', stars:3, pricePerNight:89, distanceFromCenter:0.5, rating:8.0, amenities:['WiFi','Bar','Bicycle rental','Air conditioning'] }, returnTransport:{ company:'easyJet', price:115, duration:'2h 05m', direct:true } },
  { id:'trip-18', destination:'Reykjavík', country:'Islanda', totalPrice:1380, durationDays:6, description:'Land of fire and ice — witness the Northern Lights, soak in geothermal hot springs, and explore otherworldly volcanic landscapes.', highlights:['Northern Lights hunting tour','Blue Lagoon geothermal spa','Golden Circle — Geysir and Gullfoss','Snæfellsjökull glacier hike','Whale watching from Reykjavík harbour'], imageUrl:'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&q=80', transport:{ type:'flight', company:'Icelandair', price:420, duration:'3h 30m', direct:true, departureTime:'09:45', arrivalTime:'12:15' }, hotel:{ name:'City Center Guesthouse', stars:3, pricePerNight:125, distanceFromCenter:0.4, rating:8.5, amenities:['WiFi','Breakfast','Northern Lights alert'] }, returnTransport:{ company:'Icelandair', price:395, duration:'3h 45m', direct:true } },
];

/* ─── Router ─────────────────────────────────────────────────────────────── */
function navigate(path) {
  State.route = path;
  location.hash = path;
  render();
}

window.addEventListener('hashchange', () => {
  const p = location.hash.replace('#','') || '/';
  State.route = p;
  render();
});

/* ─── Toast System ──────────────────────────────────────────────────────── */
function toast(message, options = {}) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  const type = options.type || (options.error ? 'error' : options.success ? 'success' : 'info');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <div class="toast-content">
      <div>${message}</div>
      ${options.description ? `<div class="toast-desc">${options.description}</div>` : ''}
      ${options.action ? `<button class="btn-link text-xs mt-1" style="padding:0" onclick="${options.actionClick}">${options.action}</button>` : ''}
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
  `;
  container.appendChild(el);
  const dur = options.duration || 4000;
  setTimeout(() => { if (el.parentNode) el.remove(); }, dur);
}
window.showToast = toast;

/* ─── Overlay / Sheet helpers ───────────────────────────────────────────── */
function showOverlay(onclick) {
  const ov = document.getElementById('overlay');
  ov.classList.remove('hidden');
  ov._clickHandler = onclick;
  ov.onclick = onclick;
}
function hideOverlay() {
  const ov = document.getElementById('overlay');
  ov.classList.add('hidden');
  ov.onclick = null;
}

function openSheet(id, onClose) {
  const sheet = document.getElementById(id);
  sheet.classList.remove('hidden');
  sheet.classList.add('visible');
  showOverlay(() => closeSheet(id, onClose));
  document.body.style.overflow = 'hidden';
}
function closeSheet(id, onClose) {
  const sheet = document.getElementById(id);
  sheet.classList.add('hidden');
  sheet.classList.remove('visible');
  hideOverlay();
  document.body.style.overflow = '';
  if (onClose) onClose();
}

function openModal(id) {
  const m = document.getElementById(id);
  m.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById(id);
  m.classList.add('hidden');
  document.body.style.overflow = '';
}

/* ─── Cookie Banner ─────────────────────────────────────────────────────── */
function initCookieBanner() {
  if (localStorage.getItem('tb_cookie')) return;
  const t = State.t.cookie;
  document.getElementById('cookie-title').textContent = t.title;
  document.getElementById('cookie-desc').textContent = t.description;
  document.getElementById('cookie-decline').textContent = t.decline;
  document.getElementById('cookie-accept').textContent = t.acceptAll;
  document.getElementById('cookie-banner').classList.remove('hidden');
  document.getElementById('cookie-accept').onclick = () => {
    localStorage.setItem('tb_cookie', 'accepted');
    document.getElementById('cookie-banner').classList.add('hidden');
  };
  document.getElementById('cookie-decline').onclick = () => {
    localStorage.setItem('tb_cookie', 'declined');
    document.getElementById('cookie-banner').classList.add('hidden');
  };
}

/* ─── Language Sheet ────────────────────────────────────────────────────── */
function openLangSheet() {
  const container = document.getElementById('lang-options');
  container.innerHTML = LANGUAGES.map(l => `
    <div class="lang-option ${l.code === State.lang ? 'selected' : ''}" onclick="selectLang('${l.code}')">
      <span class="lang-flag">${l.flag}</span>
      <span>${l.label}</span>
      ${l.code === State.lang ? `<span style="margin-left:auto;color:var(--primary)">${IC.check}</span>` : ''}
    </div>
  `).join('');
  document.getElementById('lang-close').onclick = () => closeSheet('lang-sheet');
  openSheet('lang-sheet');
}
window.selectLang = function(code) {
  State.lang = code;
  saveState();
  closeSheet('lang-sheet');
  render();
};
window.openLangSheet = openLangSheet;

/* ─── Nav HTML ──────────────────────────────────────────────────────────── */
function renderNav() {
  const t = State.t;
  const r = State.route;
  const notifCount = State.notifications.filter(n => !n.read).length;
  return `
    <nav class="mobile-nav">
      <a class="mobile-nav-item ${r.startsWith('/discover') ? 'active' : ''}" onclick="navigate('/discover')">
        ${IC.compass}
        <span>${t.nav.discover}</span>
      </a>
      <button class="mobile-nav-item premium-nav" onclick="openPremiumModal()">
        <div class="nav-crown">${IC.crown}</div>
        <span>${t.nav.premium}</span>
      </button>
      <a class="mobile-nav-item ${r.startsWith('/saved') ? 'active' : ''}" onclick="navigate('/saved')">
        ${IC.heart}
        <span>${t.nav.saved}</span>
      </a>
      <a class="mobile-nav-item ${r.startsWith('/profile') ? 'active' : ''}" onclick="navigate('/profile')">
        ${IC.user}
        <span>${t.nav.profile}</span>
      </a>
      <button class="mobile-nav-item" onclick="openNotifPanel()" style="position:relative">
        <div style="position:relative;display:inline-flex">
          ${IC.bell}
          ${notifCount > 0 ? `<span class="nav-badge">${notifCount > 9 ? '9+' : notifCount}</span>` : ''}
        </div>
        <span>${t.notifications.title}</span>
      </button>
    </nav>
  `;
}
window.openPremiumModal = function() {
  renderPremiumModal();
  openModal('premium-modal');
};
window.openNotifPanel = function() {
  renderNotifPanel();
  openModal('notif-panel');
};

/* ─── Premium Modal ─────────────────────────────────────────────────────── */
function renderPremiumModal() {
  const t = State.t;
  const isPremium = State.isPremium;
  document.getElementById('premium-content').innerHTML = `
    <button class="modal-close" onclick="closeModal('premium-modal')">${IC.x}</button>
    <div class="modal-handle"></div>
    <div class="modal-crown-icon">${IC.crown}</div>
    <h2 class="text-2xl font-black text-center mb-1">${t.premium.title}</h2>
    <p class="text-sm text-muted text-center" style="margin-bottom:20px">${State.isSignedIn ? t.premium.subtitle : t.premium.guestSubtitle}</p>

    <div class="plan-compare">
      <div class="plan-box ${!isPremium ? 'active' : ''}">
        <p class="plan-box-label free ${!isPremium ? 'hl' : ''}">Free</p>
        <p class="plan-box-num ${!isPremium ? 'text-primary' : ''}">20</p>
        <p class="plan-box-per">${t.premium.perDay}</p>
      </div>
      <div class="plan-box ${isPremium ? 'premium-active' : ''}">
        ${isPremium ? `<svg class="plan-box-crown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 6.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 7.02a.5.5 0 0 1 .798-.519l4.276 2.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>` : ''}
        <p class="plan-box-label prem ${isPremium ? '' : ''}">Premium</p>
        <p class="plan-box-num ${isPremium ? '' : ''}" style="color:${isPremium ? 'var(--amber)' : 'var(--fg)'}">80</p>
        <p class="plan-box-per">${t.premium.perDay}</p>
      </div>
    </div>

    <div class="premium-benefits">
      ${[{icon:IC.zap,text:t.premium.benefit1},{icon:IC.sliders,text:t.premium.benefit2},{icon:IC.sparkles,text:t.premium.benefit3}].map(b => `
        <div class="premium-benefit">
          <div class="premium-benefit-icon">${b.icon}</div>
          <span>${b.text}</span>
        </div>
      `).join('')}
    </div>

    ${isPremium ? `
      <div style="display:flex;align-items:center;gap:8px;padding:14px;background:rgba(218,165,32,0.1);border-radius:var(--radius-xl);margin-bottom:12px">
        <span style="color:var(--amber)">${IC.zap}</span>
        <span class="font-semibold text-sm" style="color:var(--amber)">${t.premium.activePlan}</span>
      </div>
      <button class="btn-ghost w-full btn-sm text-xs" onclick="handleDowngrade()">${t.premium.downgrade}</button>
    ` : `
      <button class="btn-gradient w-full btn-lg" onclick="handleUpgrade()">
        ${t.premium.cta} — ${t.premium.price}
      </button>
      <p class="text-xs text-muted text-center mt-2 mb-3">${t.premium.ctaSub}</p>
      ${!State.isSignedIn ? `<button class="btn-outline w-full btn-sm" onclick="closeModal('premium-modal');navigate('/sign-up')">${t.premium.orSignUp}</button>` : ''}
    `}
  `;
  document.getElementById('premium-backdrop').onclick = () => closeModal('premium-modal');
}
window.handleUpgrade = function() {
  if (!State.isSignedIn) { closeModal('premium-modal'); navigate('/sign-up'); return; }
  State.user = { ...State.user, isPremium: true };
  saveState();
  closeModal('premium-modal');
  toast(State.t.premium.planPremium, { type:'success' });
  render();
};
window.handleDowngrade = function() {
  State.user = { ...State.user, isPremium: false };
  saveState();
  closeModal('premium-modal');
  toast(State.t.premium.planFree, { type:'info' });
  render();
};

/* ─── Notification Panel ─────────────────────────────────────────────────── */
function renderNotifPanel() {
  const t = State.t;
  const notifs = State.notifications;
  const unread = notifs.filter(n => !n.read).length;
  document.getElementById('notif-content').innerHTML = `
    <div class="notif-header">
      <div class="font-bold text-base" style="display:flex;align-items:center;gap:8px">
        ${t.notifications.title}
        ${unread > 0 ? `<span style="background:var(--primary);color:#fff;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700">${unread}</span>` : ''}
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        ${notifs.length > 0 ? `
          ${unread > 0 ? `<button class="btn-link text-xs" onclick="markAllNotifRead()">${t.notifications.markRead}</button>` : ''}
          <button class="icon-btn" onclick="clearAllNotifs()">${IC.trash}</button>
        ` : ''}
        <button class="icon-btn" onclick="closeModal('notif-panel')">${IC.x}</button>
      </div>
    </div>
    <div class="notif-body">
      ${notifs.length === 0 ? `
        <div class="notif-empty">
          ${IC.bell}
          <p class="text-sm">${t.notifications.empty}</p>
        </div>
      ` : notifs.map(n => `
        <div class="notif-item ${n.read ? 'read' : 'unread'}">
          <div class="notif-item-icon ${n.type === 'trip_saved' ? 'saved' : n.type === 'limit_warning' ? 'warning' : 'info'}">
            ${n.type === 'trip_saved' ? '✈️' : n.type === 'limit_warning' ? '⚠️' : 'ℹ️'}
          </div>
          <div class="notif-item-text">
            <p class="notif-item-msg ${n.read ? '' : 'bold'}">${n.message}</p>
            <p class="notif-item-time">${new Date(n.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</p>
          </div>
          ${!n.read ? '<div class="notif-dot"></div>' : ''}
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('notif-backdrop').onclick = () => closeModal('notif-panel');
}
function addNotification(message, type = 'info') {
  State.notifications.unshift({ id: Date.now() + Math.random(), message, type, read: false, timestamp: Date.now() });
  if (State.notifications.length > 20) State.notifications = State.notifications.slice(0, 20);
  saveState();
  renderNav && document.getElementById('mobile-nav-el') && (document.getElementById('mobile-nav-el').innerHTML = renderNav());
}
window.markAllNotifRead = function() {
  State.notifications.forEach(n => n.read = true);
  saveState();
  renderNotifPanel();
};
window.clearAllNotifs = function() {
  State.notifications = [];
  saveState();
  renderNotifPanel();
};

/* ─── Welcome Splash ────────────────────────────────────────────────────── */
function renderSplash() {
  const t = State.t;
  return `
    <div class="splash">
      <div class="splash-blob1"></div>
      <div class="splash-blob2"></div>
      <div class="splash-icons">
        <div class="splash-icon sm"><svg style="width:32px;height:32px;color:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 6.2 6.3c.4.4.9.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg></div>
        <div class="splash-icon md"><svg style="width:40px;height:40px;color:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M9 22V12h6v10"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/></svg></div>
        <div class="splash-icon sm"><svg style="width:32px;height:32px;color:#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg></div>
      </div>
      <div class="splash-text">
        <h1 class="splash-title">Travel<span class="splash-orange">Budget</span></h1>
        <p class="splash-sub">${t.discover.welcomeSub}</p>
      </div>
      <button class="splash-cta" onclick="dismissSplash()">${t.discover.welcomeStart} ✈</button>
    </div>
  `;
}
window.dismissSplash = function() {
  sessionStorage.setItem('splashSeen', '1');
  // Auto-discover on splash dismiss: show all default trips immediately
  // (does not consume the guest search count)
  if (!State.hasSearched) {
    const filtered = getFilteredTrips();
    State.trips = filtered;
    State.currentIndex = 0;
    State.swipeHistory = [];
    State.hasSearched = true;
    State.viewMode = 'swipe';
    if (State.guestCount === 0) {
      State.guestCount = 1;
      localStorage.setItem('guestSearchCount', '1');
    }
  }
  render();
};

/* ─── Landing Page ──────────────────────────────────────────────────────── */
function renderLanding() {
  const t = State.t;
  const lang = LANGUAGES.find(l => l.code === State.lang);
  return `
    <div class="landing-page">
      <button class="lang-btn-landing" onclick="openLangSheet()">
        ${lang.flag} ${lang.label}
      </button>

      <div class="landing-logo">
        <svg style="width:40px;height:40px;color:var(--primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5c-1.5-1.5-3.5-1.5-5 0L11 6 2.8 4.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 6.2 6.3c.4.4.9.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>
      </div>

      <h1>${t.landing.title}</h1>
      <p>${t.landing.subtitle}</p>

      <div class="landing-btns">
        <button class="btn-primary w-full" onclick="navigate('/sign-up')">${t.landing.getStarted}</button>
        <button class="btn-outline w-full" onclick="navigate('/sign-in')">${t.landing.logIn}</button>
      </div>

      <div style="margin-top:28px">
        <button class="btn-link" onclick="navigate('/discover')" style="text-decoration:none;color:var(--fg-muted);font-size:14px;font-weight:500">${t.landing.continueAsGuest}</button>
      </div>

      <div class="landing-legal">
        <a onclick="navigate('/privacy')">${t.legal.privacyPolicy}</a>
        <span>·</span>
        <a onclick="navigate('/terms')">${t.legal.termsOfService}</a>
      </div>
    </div>
  `;
}

/* ─── Sign In / Sign Up ─────────────────────────────────────────────────── */
function renderSignIn() {
  const t = State.t;
  return `
    <div class="auth-page">
      <div style="width:100%;max-width:400px">
        <div class="auth-back" onclick="navigate('/')">
          ${IC.arrowL} <span style="font-size:14px">${t.landing.logIn}</span>
        </div>
        <div class="auth-card">
          <h2>${t.landing.logIn}</h2>
          <p class="text-muted">Accedi al tuo account TravelBudget</p>
          <div class="auth-form" id="signin-form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" id="signin-email" placeholder="tu@email.com" autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="signin-password" placeholder="••••••••" autocomplete="current-password" />
            </div>
            <div id="signin-error" class="auth-error hidden"></div>
            <button class="btn-primary w-full btn-lg" onclick="handleSignIn()">
              ${t.landing.logIn}
            </button>
          </div>
          <div class="divider">oppure</div>
          <button class="btn-outline w-full" style="margin-top:4px" onclick="handleGoogleAuth()">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continua con Google
          </button>
          <p class="auth-switch">Non hai un account? <a onclick="navigate('/sign-up')" style="cursor:pointer">${t.landing.getStarted}</a></p>
        </div>
      </div>
    </div>
  `;
}

function renderSignUp() {
  const t = State.t;
  return `
    <div class="auth-page">
      <div style="width:100%;max-width:400px">
        <div class="auth-back" onclick="navigate('/')">
          ${IC.arrowL} <span style="font-size:14px">Indietro</span>
        </div>
        <div class="auth-card">
          <h2>${t.landing.getStarted}</h2>
          <p class="text-muted">Crea il tuo account gratuito</p>
          <div class="auth-form">
            <div class="form-group">
              <label class="form-label">Nome</label>
              <input type="text" id="signup-name" placeholder="Il tuo nome" autocomplete="given-name" />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" id="signup-email" placeholder="tu@email.com" autocomplete="email" />
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="signup-password" placeholder="Min. 6 caratteri" autocomplete="new-password" />
            </div>
            <div id="signup-error" class="auth-error hidden"></div>
            <button class="btn-primary w-full btn-lg" onclick="handleSignUp()">
              Crea account
            </button>
          </div>
          <div class="divider">oppure</div>
          <button class="btn-outline w-full" style="margin-top:4px" onclick="handleGoogleAuth()">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continua con Google
          </button>
          <p class="auth-switch">Hai già un account? <a onclick="navigate('/sign-in')" style="cursor:pointer">${t.landing.logIn}</a></p>
        </div>
      </div>
    </div>
  `;
}

window.handleSignIn = function() {
  const email = document.getElementById('signin-email')?.value?.trim();
  const pass = document.getElementById('signin-password')?.value;
  const err = document.getElementById('signin-error');
  if (!email || !pass) { err.textContent = 'Inserisci email e password.'; err.classList.remove('hidden'); return; }
  if (pass.length < 3) { err.textContent = 'Password non valida.'; err.classList.remove('hidden'); return; }
  State.user = { name: email.split('@')[0], email, isPremium: false };
  saveState();
  toast('Accesso effettuato! 👋', { type:'success' });
  navigate('/discover');
};

window.handleSignUp = function() {
  const name = document.getElementById('signup-name')?.value?.trim();
  const email = document.getElementById('signup-email')?.value?.trim();
  const pass = document.getElementById('signup-password')?.value;
  const err = document.getElementById('signup-error');
  if (!name || !email || !pass) { err.textContent = 'Compila tutti i campi.'; err.classList.remove('hidden'); return; }
  if (pass.length < 6) { err.textContent = 'La password deve avere almeno 6 caratteri.'; err.classList.remove('hidden'); return; }
  if (!email.includes('@')) { err.textContent = 'Email non valida.'; err.classList.remove('hidden'); return; }
  State.user = { name, email, isPremium: false };
  saveState();
  toast('Account creato! Benvenuto 🎉', { type:'success' });
  navigate('/onboarding');
};

window.handleGoogleAuth = function() {
  State.user = { name: 'Utente Google', email: 'user@gmail.com', isPremium: false };
  saveState();
  toast('Accesso con Google effettuato! 👋', { type:'success' });
  navigate('/discover');
};

/* ─── Onboarding ────────────────────────────────────────────────────────── */
function renderOnboarding() {
  const t = State.t;
  const step = State.onboardingStep;
  const d = State.onboardingData;
  const steps = [t.onboarding.budget, t.onboarding.travelers, t.onboarding.flight];

  let stepContent = '';
  if (step === 1) {
    stepContent = `
      <div class="auth-form" style="gap:16px">
        <div class="form-group">
          <label class="form-label">${t.onboarding.totalBudget}</label>
          <input type="number" id="ob-budget" value="${d.budget}" min="50" max="20000" placeholder="2000" />
        </div>
        <div class="form-group">
          <label class="form-label">${t.onboarding.departureCity}</label>
          <input type="text" id="ob-departure" value="${d.departureLocation}" placeholder="Es: Roma, Milano..." />
        </div>
      </div>
    `;
  } else if (step === 2) {
    stepContent = `
      <div class="form-group">
        <label class="form-label">${t.onboarding.numberOfPeople}</label>
        <input type="number" id="ob-people" value="${d.numberOfPeople}" min="1" max="20" />
      </div>
    `;
  } else {
    stepContent = `
      <div class="radio-group">
        ${[{v:'direct',l:t.onboarding.directOnly},{v:'with_stops',l:t.onboarding.withStops},{v:'any',l:t.onboarding.any}].map(o => `
          <div class="radio-item ${d.flightPreference === o.v ? 'selected' : ''}" onclick="selectFlightPref('${o.v}')">
            <div class="radio-dot"></div>
            <span>${o.l}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="onboarding-page with-nav">
      <div class="onboarding-card">
        <div class="step-dots">
          ${[1,2,3].map(s => `<div class="step-dot ${s === step ? 'active' : ''}"></div>`).join('')}
        </div>
        <h2>${steps[step-1]}</h2>
        ${stepContent}
        <div class="onboarding-footer">
          <button class="btn-outline btn-sm" onclick="obBack()" ${step === 1 ? 'disabled style="opacity:0.4"' : ''}>${t.onboarding.back}</button>
          <button class="btn-primary btn-sm" onclick="obNext()">${step === 3 ? t.onboarding.complete : t.onboarding.next}</button>
        </div>
      </div>
    </div>
    ${renderNav()}
  `;
}
window.selectFlightPref = function(v) {
  State.onboardingData.flightPreference = v;
  document.querySelectorAll('.radio-item').forEach(el => el.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
};
window.obBack = function() { if (State.onboardingStep > 1) { State.onboardingStep--; render(); } };
window.obNext = function() {
  const step = State.onboardingStep;
  if (step === 1) {
    State.onboardingData.budget = parseInt(document.getElementById('ob-budget')?.value) || 2000;
    State.onboardingData.departureLocation = document.getElementById('ob-departure')?.value || '';
  } else if (step === 2) {
    State.onboardingData.numberOfPeople = parseInt(document.getElementById('ob-people')?.value) || 2;
  }
  if (step < 3) { State.onboardingStep++; render(); }
  else {
    // Save preferences and go to discover
    State.prefs = { defaultBudget: State.onboardingData.budget, defaultDepartureLocation: State.onboardingData.departureLocation, defaultNumberOfPeople: State.onboardingData.numberOfPeople, defaultFlightPreference: State.onboardingData.flightPreference };
    State.filters.budget = State.onboardingData.budget;
    State.filters.numberOfPeople = State.onboardingData.numberOfPeople;
    if (State.onboardingData.departureLocation) State.filters.departureAirport = State.onboardingData.departureLocation;
    State.filters.flightPreference = State.onboardingData.flightPreference;
    saveState();
    toast('Preferenze salvate! 🎉', { type:'success' });
    navigate('/discover');
  }
};

/* ─── Trip Variation Generator ──────────────────────────────────────────── */
// Expands 1-2 base trips into `targetCount` realistic deterministic variants.
// Same destination, different airlines / times / prices / hotels.
function generateTripVariations(baseTrips, targetCount) {
  if (!baseTrips || baseTrips.length === 0) return [];
  const result = [...baseTrips];

  const flightCos  = ['Ryanair','easyJet','Vueling','Iberia','Air Europa','Volotea','Wizz Air','Jet2','Transavia','Norwegian'];
  const trainCos   = ['Trenitalia','Italo','ÖBB','FlixTrain','Intercity Express','TGV','Renfe','Thalys'];
  const depTimes   = ['06:00','07:15','08:30','09:45','11:00','12:30','14:00','15:30','17:00','18:45','20:00','21:30','06:45','08:00','10:15','13:00','16:15','19:30'];
  const hotelSfx   = ['Grand','Boutique','Plaza','Palace','Suites','Central','Classic','Premium','Riviera','Prestige','Lux','Garden','View','Select','Elite'];
  const mults      = [0.82,0.88,0.93,0.97,1.00,1.03,1.07,1.12,1.17,1.22,0.85,0.91,0.96,1.01,1.06,1.10,1.15,1.20,0.87,0.94];

  while (result.length < targetCount) {
    const vi   = result.length;
    const base = baseTrips[vi % baseTrips.length];
    const mult = mults[vi % mults.length];
    const dep  = depTimes[vi % depTimes.length];

    // Calculate arrival time
    const durStr = base.transport.duration || '2h 00m';
    const durH   = parseInt(durStr.split('h')[0]) || 2;
    const durM   = parseInt((durStr.split('h')[1] || '00').replace(/\D/g,'')) || 0;
    const [dH,dM] = dep.split(':').map(Number);
    const arrMins = dH*60 + dM + durH*60 + durM;
    const arr    = `${String(Math.floor(arrMins/60)%24).padStart(2,'0')}:${String(arrMins%60).padStart(2,'0')}`;

    const isFlight = base.transport.type !== 'train';
    const company  = isFlight ? flightCos[vi % flightCos.length] : trainCos[vi % trainCos.length];
    const isDirect = (vi % 3) !== 1;                            // ~2/3 direct
    const starsDelta = vi % 3 === 0 ? 1 : vi % 3 === 1 ? -1 : 0;
    const stars    = Math.max(1, Math.min(5, base.hotel.stars + starsDelta));
    const rating   = Math.min(9.8, Math.max(6.5, +( base.hotel.rating + (vi%5-2)*0.15 ).toFixed(1)));

    result.push({
      ...base,
      id: `${base.id}-v${vi}`,
      totalPrice:  Math.round(base.totalPrice          * mult / 10) * 10,
      transport: {
        ...base.transport,
        company, departureTime: dep, arrivalTime: arr,
        direct: isDirect,
        price:  Math.round(base.transport.price * mult / 5) * 5,
      },
      hotel: {
        ...base.hotel,
        name: `${base.destination} ${hotelSfx[vi % hotelSfx.length]}`,
        stars, rating,
        pricePerNight: Math.round(base.hotel.pricePerNight * mult),
      },
    });
  }
  return result;
}

/* ─── Discover Page ─────────────────────────────────────────────────────── */
function getFilteredTrips() {
  let trips = [...MOCK_TRIPS];
  const f = State.filters;
  // Budget: demo mode — show all trips regardless of price
  // Flight/train preference
  if (f.flightPreference === 'direct') trips = trips.filter(tr => tr.transport.type !== 'train' ? tr.transport.direct : true);
  if (f.trainPreference === 'direct') trips = trips.filter(tr => tr.transport.type === 'train' ? tr.transport.direct : true);
  // Hotel stars
  trips = trips.filter(tr => tr.hotel.stars >= (f.hotelStarsMin || 1) && tr.hotel.stars <= (f.hotelStarsMax || 5));
  // Accommodation type
  if (f.accommodationType === 'budget') trips = trips.filter(tr => tr.hotel.pricePerNight < 80);
  else if (f.accommodationType === 'standard') trips = trips.filter(tr => tr.hotel.pricePerNight >= 80 && tr.hotel.pricePerNight < 140);
  else if (f.accommodationType === 'luxury') trips = trips.filter(tr => tr.hotel.stars >= 4 && tr.hotel.pricePerNight >= 140);
  // Arrival/destination — STRICT: if destination set, show ONLY that destination
  const arr = f.arrivalAirport || f.arrivalStation;
  if (arr && arr.toLowerCase() !== 'any' && arr.length > 2) {
    const arrLow = arr.toLowerCase().replace(/\s*\([^)]*\)/g,'').trim();
    const matched = trips.filter(tr =>
      tr.destination.toLowerCase().includes(arrLow) ||
      tr.country.toLowerCase().includes(arrLow)
    );
    if (matched.length > 0) {
      // Expand to 20 realistic variations of the matched destination
      trips = generateTripVariations(matched, 20);
    }
    // If zero exact matches → keep all trips as "alternative destinations" (rule: never empty)
  }
  // Sort
  if (f.sortBy === 'cheapest') trips.sort((a,b) => a.totalPrice - b.totalPrice);
  else if (f.sortBy === 'best_rating') trips.sort((a,b) => b.hotel.rating - a.hotel.rating);
  else if (f.sortBy === 'fastest') trips.sort((a,b) => {
    const getDur = tr => { const d = tr.transport.duration || ''; const [h,m] = d.split(/[hm]/).filter(Boolean).map(Number); return (h||0)*60+(m||0); };
    return getDur(a) - getDur(b);
  });
  // Max 20 cards
  return trips.slice(0, 20);
}

function renderDiscover() {
  const t = State.t;
  // Check splash
  if (!sessionStorage.getItem('splashSeen')) return renderSplash();

  if (!State.hasSearched) {
    return renderDiscoverPreSearch();
  }

  const trips = State.trips;
  const idx = State.currentIndex;

  if (trips.length === 0) {
    return renderDiscoverNoResults();
  }

  if (idx >= trips.length) {
    return renderDiscoverSeenAll();
  }

  if (State.viewMode === 'list') {
    return renderDiscoverList(trips);
  }

  return renderDiscoverSwipe(trips, idx);
}

function renderDiscoverPreSearch() {
  const t = State.t;
  const f = State.filters;
  const dep = f.departureAirport || f.departureStation || '';
  const recent = State.recentSearches.slice(0, 3);

  return `
    <div class="discover-bg with-nav">
      ${renderAppHeader()}
      ${renderUsageBadge()}

      <!-- Surprise banner -->
      <div class="surprise-banner" onclick="navigate('/surprise')">
        <div class="surprise-banner-icon">🎲</div>
        <div class="surprise-banner-text">
          <strong>${t.surprise.title}</strong>
          <span>${t.surprise.subtitle}</span>
        </div>
        <span style="color:rgba(255,255,255,0.7);font-size:18px">›</span>
      </div>

      <div class="pre-search">
        <div class="discover-icons" style="margin-bottom:28px">
          <div class="disc-icon sm">${IC.plane}</div>
          <div class="disc-icon md" style="color:hsl(25,90%,70%)">${IC.hotel}</div>
          <div class="disc-icon sm">${IC.train}</div>
        </div>
        <h2>${t.discover.discoverTitle}</h2>
        <p>${t.discover.discoverSub}</p>
        <button class="btn-white" onclick="openFilterSheet()" style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
          ${IC.sliders} ${t.discover.setFilters}
        </button>

        ${recent.length > 0 ? `
          <div class="recent-searches">
            <p class="recent-label">${t.profile.recentSearches}</p>
            ${recent.map((s,i) => `
              <div class="recent-item" onclick="repeatSearch(${i})">
                <div>
                  <p class="recent-item-label">${buildSearchLabel(s, t)}</p>
                  ${s.tripType ? `<p class="recent-item-sub">${s.tripType === 'one_way' ? '→ ' + t.filters.oneWay : '⇌ ' + t.filters.roundTrip}</p>` : ''}
                </div>
                <span style="color:rgba(255,255,255,0.55);font-size:14px">↺</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
    ${renderNav()}
  `;
}

function buildSearchLabel(s, t) {
  const parts = [];
  if (s.departureLocation) parts.push(`${t.profile.departureFrom} ${s.departureLocation}`);
  if (s.arrivalLocation && s.arrivalLocation !== 'Any') parts.push(`→ ${s.arrivalLocation}`);
  if (s.numberOfNights) parts.push(`${s.numberOfNights} ${s.numberOfNights === 1 ? t.profile.night : t.profile.nights}`);
  if (s.budget) parts.push(`€${s.budget}`);
  return parts.join(' · ') || '—';
}

window.repeatSearch = function(idx) {
  const entry = State.recentSearches[idx];
  if (!entry) return;
  if (entry.budget) State.filters.budget = entry.budget;
  if (entry.numberOfPeople) State.filters.numberOfPeople = entry.numberOfPeople;
  if (entry.numberOfNights) State.filters.numberOfNights = entry.numberOfNights;
  if (entry.departureLocation) State.filters.departureAirport = entry.departureLocation;
  if (entry.arrivalLocation && entry.arrivalLocation !== 'Any') State.filters.arrivalAirport = entry.arrivalLocation;
  if (entry.tripType) State.filters.tripType = entry.tripType;
  doSearch();
};

/* ─── App Header (area utente persistente) ──────────────────────────────── */
function renderAppHeader() {
  const t = State.t;
  const isSignedIn = State.isSignedIn;
  const userName = isSignedIn ? (State.user.name || State.user.email || t.nav.profile || 'User') : (t.nav.guestLabel || 'Ospite');
  const initials = (userName || 'G').trim().split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'G';
  return `
    <header style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px 8px;background:rgba(0,0,0,0.25);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);flex-shrink:0;border-bottom:1px solid rgba(255,255,255,0.1)">
      <div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="navigate('/discover')">
        <div style="width:28px;height:28px;background:white;border-radius:8px;display:flex;align-items:center;justify-content:center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 1-5.5 2.5L10 10 1.8 8.2c-.5-.1-.9.3-.8.8l1.8 8.3c.1.5.6.9 1.1 1l8.1 1.8c.5.1 1-.3.9-.8L11.5 11"/></svg>
        </div>
        <span style="font-weight:800;font-size:15px;color:white;letter-spacing:-0.3px">TravelBudget</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="navigate('/saved')" style="background:rgba(255,255,255,0.15);border:none;border-radius:20px;padding:5px 10px;color:white;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px">
          ${IC.heart} ${t.nav.saved}
        </button>
        <button onclick="navigate('/profile')" style="display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.15);border:none;border-radius:20px;padding:5px 10px;cursor:pointer">
          <div style="width:22px;height:22px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:var(--primary);flex-shrink:0">${initials}</div>
          <span style="color:white;font-size:12px;font-weight:600;max-width:70px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${isSignedIn ? userName.split(' ')[0] : t.nav.signIn}</span>
        </button>
      </div>
    </header>
  `;
}

function renderUsageBadge() {
  const t = State.t;
  let count = null;
  if (State.isSignedIn) {
    const used = State.user.searchCount || 0;
    if (used > 0 && !State.isPremium) count = used;
  } else {
    if (State.guestCount > 0) count = State.guestCount;
  }
  if (!count) return '';
  return `
    <div class="usage-badge-discover">
      ${IC.sparkles}
      <span>${count} ${State.t.premium.searchesLeft}</span>
    </div>
  `;
}

function renderDiscoverNoResults() {
  const t = State.t;
  const f = State.filters;
  const isNoDirectTrain = f.trainPreference === 'direct' && !!f.departureStation;
  return `
    <div class="discover-bg with-nav" style="overflow-y:auto">
      ${renderAppHeader()}
      ${renderUsageBadge()}
      <div class="deck-seen-all">
        ${isNoDirectTrain ? `
          <div class="emoji">🚂</div>
          <h2>${t.discover.noDirectTrainTitle}</h2>
          <p>${t.discover.noDirectTrain}</p>
          <button class="btn-white" onclick="doTryTrainStops()">${t.filters.trainWithChanges}</button>
        ` : `
          <div class="emoji">😅</div>
          <h2>${t.filters.noResults}</h2>
          <p>${t.filters.noResultsSub}</p>
        `}
        <button class="btn-white" style="margin-top:12px" onclick="openFilterSheet()">${t.filters.edit}</button>
      </div>
    </div>
    ${renderNav()}
  `;
}
window.doTryTrainStops = function() {
  State.filters.trainPreference = 'with_stops';
  doSearch();
};

function renderDiscoverSeenAll() {
  const t = State.t;
  return `
    <div class="discover-bg with-nav">
      ${renderUsageBadge()}
      <div class="deck-seen-all">
        <div class="emoji">🎉</div>
        <h2>${t.discover.seenAll}</h2>
        <p>${t.discover.seenAllSub}</p>
        <button class="btn-white" onclick="doSearch()">${t.discover.generateMore}</button>
        <button class="btn-white" style="margin-top:12px;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);color:#fff" onclick="openFilterSheet()">${t.filters.edit}</button>
      </div>
    </div>
    ${renderNav()}
  `;
}

function renderDiscoverSwipe(trips, idx) {
  const t = State.t;
  const f = State.filters;
  const dep = f.departureAirport || f.departureStation || '';
  const isFlight = (tr) => tr.transport.type !== 'train';

  // Filter bar summary
  const filterSummary = dep
    ? `${dep.split(' (')[0]} · €${f.budget.toLocaleString()} · ${f.numberOfPeople}p · ${f.numberOfNights}n`
    : `€${f.budget.toLocaleString()} · ${f.numberOfPeople}p · ${f.numberOfNights}n`;

  // Active chip count
  const activeCount = countActiveFilters(f);

  const captions = t.fun.captions;
  function caption(tr) {
    const hash = tr.id.split('').reduce((a,c) => a + c.charCodeAt(0), 0);
    return captions[hash % captions.length];
  }

  // Render top 3 visible cards
  const cardHtml = trips.slice(idx, idx + 3).map((tr, ci) => {
    const isTop = ci === 0;
    const isBehind = ci === 1;
    const isThird = ci === 2;
    const cls = isTop ? 'top' : isBehind ? 'behind' : 'third';
    const bf = isFlight(tr);
    return `
      <div class="swipe-card ${cls}" id="card-${ci}" data-trip="${tr.id}" style="background:#1a2540">
        <img class="card-img" src="${tr.imageUrl}" alt="${tr.destination}" loading="lazy" onerror="this.style.display='none'" />
        <div class="card-img-gradient"></div>
        <div class="card-like-label" id="label-like-${ci}">${t.discover.like}</div>
        <div class="card-nope-label" id="label-nope-${ci}">${t.discover.nope}</div>

        <div class="card-caption">
          <span class="card-flag">🌍 ${tr.country}</span>
          ${isTop ? `<button class="card-info-btn" onclick="openTripDetail('${tr.id}')">${t.discover.infoBtn}</button>` : ''}
        </div>

        <div class="card-body">
          <div class="card-dest">${tr.destination}</div>
          <div class="card-country">${IC.mapPin} ${tr.country}</div>
          <div class="card-chips" style="margin-bottom:6px">
            <span class="card-chip" style="${tr.transport.direct ? 'background:rgba(34,197,94,0.65)' : ''}">${bf ? IC.plane : IC.train} ${tr.transport.company.split(' ')[0]}</span>
            <span class="card-chip" style="${tr.transport.direct ? 'background:rgba(34,197,94,0.65)' : ''}">${tr.transport.direct ? '✓ Diretto' : '~ Scali'}</span>
            ${tr.transport.departureTime ? `<span class="card-chip">${IC.clock} ${tr.transport.departureTime}${tr.transport.arrivalTime ? ' → ' + tr.transport.arrivalTime : ''}</span>` : ''}
          </div>
          <div class="card-chips" style="margin-bottom:8px">
            <span class="card-chip">${IC.clock} ${tr.transport.duration}</span>
            <span class="card-chip">${IC.hotel} ${'★'.repeat(tr.hotel.stars)}</span>
            <span class="card-chip">🌙 ${f.numberOfNights}n</span>
          </div>
          <div class="card-price-row" style="margin-bottom:0">
            <div>
              <span class="card-price">€${tr.totalPrice.toLocaleString()}</span>
              <span class="card-price-label">${t.discover.total}</span>
            </div>
          </div>
          ${isTop ? `
          <button
            class="prenota-cta-btn"
            onclick="event.stopPropagation();openTripDetail('${tr.id}')"
            style="width:100%;margin-top:10px;padding:10px;background:white;color:var(--primary);font-weight:700;border-radius:12px;font-size:13px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(0,0,0,0.18)"
          >
            ✈ Prenota ora
          </button>` : ''}
        </div>
      </div>
    `;
  }).reverse().join('');

  return `
    <div class="discover-bg with-nav" style="overflow:hidden">
      ${renderAppHeader()}
      ${renderUsageBadge()}

      <!-- Filter bar -->
      <div class="filter-bar-wrap">
        <button class="filter-bar-btn" onclick="openFilterSheet()">
          <div class="filter-bar-icon">${IC.sliders}</div>
          <div class="filter-bar-text">
            <strong>${t.filters.title}</strong>
            <span>${filterSummary}</span>
          </div>
          ${activeCount > 0 ? `<span class="filter-count-badge">${activeCount}</span>` : `<span style="color:var(--fg-muted);font-size:14px">›</span>`}
        </button>
      </div>

      <!-- View toggle + counter -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0 16px 4px;flex-shrink:0">
        <div class="view-toggle">
          <button class="view-toggle-btn ${State.viewMode==='swipe'?'active':''}" onclick="setViewMode('swipe')">${IC.layers} Swipe</button>
          <button class="view-toggle-btn ${State.viewMode==='list'?'active':''}" onclick="setViewMode('list')">${IC.listLayout} Lista</button>
        </div>
        <span class="deck-counter">Card ${idx + 1} su ${trips.length}</span>
      </div>

      <!-- Deck -->
      <div class="deck-area" id="deck-area">
        ${cardHtml}
      </div>

      <!-- Actions -->
      <div class="swipe-actions">
        <button class="action-btn undo" onclick="handleUndo()" title="Undo">${IC.undo}</button>
        <button class="action-btn nope" onclick="handleSwipe('left')" title="${t.discover.nope}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <button class="action-btn like" onclick="handleSwipe('right')" title="${t.discover.like}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button class="action-btn share-a" onclick="openShareModal('${trips[idx]?.id}')" title="Share">${IC.share}</button>
      </div>
    </div>
    ${renderNav()}
  `;
}

function renderDiscoverList(trips) {
  const t = State.t;
  const f = State.filters;
  return `
    <div class="discover-bg with-nav" style="overflow:hidden">
      ${renderAppHeader()}
      ${renderUsageBadge()}
      <!-- Filter bar -->
      <div class="filter-bar-wrap">
        <button class="filter-bar-btn" onclick="openFilterSheet()">
          <div class="filter-bar-icon">${IC.sliders}</div>
          <div class="filter-bar-text">
            <strong>${t.filters.title}</strong>
            <span>€${f.budget.toLocaleString()} · ${f.numberOfPeople}p · ${f.numberOfNights}n</span>
          </div>
        </button>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0 16px 4px;flex-shrink:0">
        <div class="view-toggle">
          <button class="view-toggle-btn" onclick="setViewMode('swipe')">${IC.layers} ${t.profile.viewSwipe}</button>
          <button class="view-toggle-btn active" onclick="setViewMode('list')">${IC.listLayout} ${t.profile.viewList}</button>
        </div>
        <span class="deck-counter">${trips.length} ${t.profile.tripsCount}</span>
      </div>
      <div class="list-mode-wrap">
        ${trips.map(tr => `
          <div class="list-trip-card" onclick="openTripDetail('${tr.id}')">
            <img class="list-trip-img" src="${tr.imageUrl}" alt="${tr.destination}" loading="lazy" onerror="this.style.background='#1e3a5f'" />
            <div class="list-trip-body">
              <div>
                <div class="list-trip-dest">${tr.destination}</div>
                <div class="list-trip-country">${tr.country}</div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
                  <span style="font-size:11px;background:rgba(var(--primary-rgb,79,70,229),0.1);color:var(--primary);padding:2px 8px;border-radius:20px;font-weight:600">${tr.transport.type==='train'?'🚂':'✈'} ${tr.transport.company.split(' ')[0]}</span>
                  <span style="font-size:11px;background:${tr.transport.direct?'rgba(34,197,94,0.12)':'rgba(0,0,0,0.06)'};color:${tr.transport.direct?'#16a34a':'#555'};padding:2px 8px;border-radius:20px;font-weight:600">${tr.transport.direct?'✓ Diretto':'~ Scali'}</span>
                  ${tr.transport.departureTime?`<span style="font-size:11px;background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:20px;color:#555">⏱ ${tr.transport.departureTime}${tr.transport.arrivalTime?' → '+tr.transport.arrivalTime:''}</span>`:''}
                  <span style="font-size:11px;background:rgba(0,0,0,0.06);padding:2px 8px;border-radius:20px;color:#555">⏳ ${tr.transport.duration}</span>
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px">
                <div>
                  <div class="list-trip-price">€${tr.totalPrice.toLocaleString()}</div>
                  <div class="list-trip-meta">${IC.hotel} ${'★'.repeat(tr.hotel.stars)} · ${tr.durationDays}gg</div>
                </div>
                <button onclick="event.stopPropagation();openTripDetail('${tr.id}')" style="padding:8px 16px;background:var(--primary);color:white;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">✈ Prenota</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ${renderNav()}
  `;
}

window.setViewMode = function(mode) {
  State.viewMode = mode;
  render();
};

function countActiveFilters(f) {
  let n = 0;
  if (f.budget !== 3000) n++;
  if (f.numberOfPeople !== 2) n++;
  if (f.numberOfChildren > 0) n++;
  if (f.numberOfPets > 0) n++;
  if (f.departureDate) n++;
  if (f.returnDate) n++;
  if (f.numberOfNights !== 7) n++;
  if (f.flightPreference !== 'any') n++;
  if (f.trainPreference !== 'any') n++;
  if (f.maxDistanceFromAirportKm !== null) n++;
  if (f.maxHotelDistanceFromCenterKm !== null) n++;
  if (f.accommodationType !== null) n++;
  if (f.departureAirport) n++;
  if (f.arrivalAirport) n++;
  if (f.departureStation) n++;
  if (f.arrivalStation) n++;
  if (f.hotelStarsMin !== 1 || f.hotelStarsMax !== 5) n++;
  if (f.freeCancellation) n++;
  if (f.breakfastIncluded) n++;
  if (f.parkingAvailable) n++;
  if (f.minHotelRating !== null) n++;
  if (f.privateBathroom) n++;
  if (f.propertyType !== 'any') n++;
  if (f.onlinePayment) n++;
  if (f.elevator) n++;
  if (f.petFriendly) n++;
  if (f.tripType === 'one_way') n++;
  if (f.sortBy !== 'best_value') n++;
  if (f.maxTravelTimeHours !== null) n++;
  if (f.departureTimeSlot !== 'any') n++;
  return n;
}

function doSearch() {
  const GUEST_LIMIT = 5;
  const FREE_LIMIT = 20;

  // Check limits
  if (!State.isSignedIn) {
    if (State.guestCount >= GUEST_LIMIT) {
      renderPremiumModal();
      openModal('premium-modal');
      return;
    }
  } else {
    const used = State.user.searchCount || 0;
    const limit = State.isPremium ? 80 : FREE_LIMIT;
    if (used >= limit) {
      renderPremiumModal();
      openModal('premium-modal');
      return;
    }
  }

  // Increment count
  if (!State.isSignedIn) {
    State.guestCount++;
    localStorage.setItem('guestSearchCount', State.guestCount);
  } else {
    State.user.searchCount = (State.user.searchCount || 0) + 1;
  }

  // Get filtered trips
  const f = State.filters;
  const filtered = getFilteredTrips();
  State.trips = filtered;
  State.currentIndex = 0;
  State.swipeHistory = [];
  State.hasSearched = true;
  State.viewMode = 'swipe';

  // Save search to history
  const dep = f.departureAirport || f.departureStation || null;
  const arr = f.arrivalAirport || f.arrivalStation || null;
  if (dep || arr) {
    State.recentSearches.unshift({ id: Date.now(), departureLocation: dep, arrivalLocation: arr, budget: f.budget, numberOfPeople: f.numberOfPeople, numberOfNights: f.numberOfNights, tripType: f.tripType, departureDate: f.departureDate || null, returnDate: f.returnDate || null, createdAt: new Date().toISOString() });
    if (State.recentSearches.length > 5) State.recentSearches = State.recentSearches.slice(0, 5);
  }

  saveState();

  // Show success toast
  if (filtered.length > 0) {
    const msgs = State.t.fun.successMessages;
    toast(msgs[Math.floor(Math.random() * msgs.length)], { type:'success', duration:3000 });
  }

  render();
}
window.doSearch = doSearch;

/* ─── Swipe Mechanics ───────────────────────────────────────────────────── */
let swipeState = { dragging:false, startX:0, startY:0, currentX:0, card:null };

function initSwipe() {
  const topCard = document.querySelector('.swipe-card.top');
  if (!topCard) return;

  const onStart = (e) => {
    const pt = e.touches ? e.touches[0] : e;
    swipeState = { dragging:true, startX:pt.clientX, startY:pt.clientY, currentX:pt.clientX, card:topCard };
    topCard.style.transition = 'none';
  };
  const onMove = (e) => {
    if (!swipeState.dragging) return;
    e.preventDefault();
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - swipeState.startX;
    const dy = pt.clientY - swipeState.startY;
    const rot = dx * 0.08;
    topCard.style.transform = `translateX(${dx}px) translateY(${dy*0.2}px) rotate(${rot}deg)`;

    // Show like/nope labels
    const like = topCard.querySelector('.card-like-label');
    const nope = topCard.querySelector('.card-nope-label');
    if (like) like.style.opacity = Math.max(0, dx / 80);
    if (nope) nope.style.opacity = Math.max(0, -dx / 80);
    swipeState.currentX = pt.clientX;
  };
  const onEnd = () => {
    if (!swipeState.dragging) return;
    swipeState.dragging = false;
    const dx = swipeState.currentX - swipeState.startX;
    topCard.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    if (dx > 80) {
      // Like
      topCard.style.transform = `translateX(200%) rotate(25deg)`;
      topCard.style.opacity = '0';
      setTimeout(() => { handleSwipe('right'); }, 280);
    } else if (dx < -80) {
      // Nope
      topCard.style.transform = `translateX(-200%) rotate(-25deg)`;
      topCard.style.opacity = '0';
      setTimeout(() => { handleSwipe('left'); }, 280);
    } else {
      // Reset
      topCard.style.transform = '';
      const like = topCard.querySelector('.card-like-label');
      const nope = topCard.querySelector('.card-nope-label');
      if (like) like.style.opacity = '0';
      if (nope) nope.style.opacity = '0';
    }
  };

  topCard.addEventListener('mousedown', onStart);
  topCard.addEventListener('touchstart', onStart, { passive:false });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive:false });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
}

window.handleSwipe = function(direction) {
  const idx = State.currentIndex;
  if (idx >= State.trips.length) return;
  const trip = State.trips[idx];

  if (direction === 'right') {
    if (State.isSignedIn) {
      saveTrip(trip);
      addNotification(State.t.notifications.tripSaved, 'trip_saved');
    } else {
      const t = State.t;
      const tEl = document.createElement('div');
      tEl.className = 'toast info';
      tEl.innerHTML = `
        <div class="toast-content">
          <div>${t.discover.signUpToSave}</div>
          <button class="btn-link text-xs mt-1" onclick="navigate('/sign-up')">${t.landing.getStarted}</button>
        </div>
        <button class="toast-close" onclick="this.closest('.toast').remove()">✕</button>
      `;
      document.getElementById('toast-container').appendChild(tEl);
      setTimeout(() => tEl.remove(), 5000);
    }
  }

  State.swipeHistory.push(idx);
  State.currentIndex = idx + 1;
  saveState();
  render();
};

window.handleUndo = function() {
  if (State.swipeHistory.length > 0) {
    const prev = State.swipeHistory.pop();
    State.currentIndex = prev;
    render();
  }
};

function saveTrip(trip) {
  const existing = State.savedTrips.find(s => s.id === trip.id || (s.tripData && s.tripData.destination === trip.destination));
  if (existing) { toast('Viaggio già salvato!', { type:'info' }); return; }
  const saved = {
    id: Date.now(),
    destination: trip.destination,
    imageUrl: trip.imageUrl,
    totalPrice: trip.totalPrice,
    tripData: trip,
  };
  State.savedTrips.push(saved);
  saveState();
  toast(State.t.notifications.tripSaved, { type:'success' });
}
window.saveTrip = saveTrip;

/* ─── Trip Detail ───────────────────────────────────────────────────────── */
window.openTripDetail = function(tripId) {
  const trip = State.trips.find(t => t.id === tripId) || MOCK_TRIPS.find(t => t.id === tripId);
  if (!trip) return;
  State.detailTrip = trip;

  const t = State.t;
  const td = t.tripDetail;
  const bf = trip.transport.type !== 'train';
  const budget = State.filters.budget || 3000;
  const remaining = budget - trip.totalPrice;
  const overBudget = remaining < 0;

  const hotelBooUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(trip.destination)}`;
  const omioUrl = `https://www.omio.com/`;
  const skyUrl = `https://www.skyscanner.it/`;

  const detailContent = `
    <div style="display:flex;flex-direction:column;height:100%">
      <!-- Hero -->
      <div class="detail-hero" style="flex-shrink:0;position:relative;height:240px">
        <img src="${trip.imageUrl}" alt="${trip.destination}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.background='#1e3a5f'" />
        <div class="detail-hero-gradient"></div>
        <button class="detail-back" onclick="closeTripDetail()">←</button>
        <div class="detail-header-btns">
          <button class="detail-header-btn" onclick="openShareModal('${trip.id}')">⤴</button>
          ${State.isSignedIn ? `<button class="detail-header-btn" onclick="saveTripFromDetail('${trip.id}')">♡</button>` : ''}
        </div>
        <div class="detail-info">
          <div class="detail-dest">${trip.destination}</div>
          <div class="detail-country">${IC.mapPin} ${trip.country}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="detail-tabs" id="detail-tabs">
        <button class="detail-tab active" onclick="switchDetailTab('overview',this)">${td.overview}</button>
        <button class="detail-tab" onclick="switchDetailTab('highlights',this)">${td.highlights}</button>
        <button class="detail-tab" onclick="switchDetailTab('transport',this)">${td.transport}</button>
        <button class="detail-tab" onclick="switchDetailTab('hotel',this)">${td.hotel}</button>
      </div>

      <!-- Body -->
      <div class="detail-body" style="flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch">

        <!-- Cost card -->
        <div class="detail-cost-card">
          <div class="detail-cost-label">${td.totalCost}</div>
          <div class="detail-cost-value">€${trip.totalPrice.toLocaleString()}</div>
          <div class="detail-cost-sub">${td.perPerson}</div>
          <div class="detail-cost-breakdown">
            <div class="detail-cost-row"><span>${bf ? td.flight : td.train}</span><strong>€${trip.transport.price.toLocaleString()}</strong></div>
            ${trip.returnTransport && State.filters.tripType !== 'one_way' ? `<div class="detail-cost-row"><span>${td.returnJourney}</span><strong>€${trip.returnTransport.price.toLocaleString()}</strong></div>` : ''}
            <div class="detail-cost-row"><span>${td.totalHotel}</span><strong>€${(trip.hotel.pricePerNight * (State.filters.numberOfNights || trip.durationDays)).toLocaleString()}</strong></div>
          </div>
          <div class="detail-budget-remaining">
            <span class="remaining-label">${overBudget ? td.overBudget : td.budgetRemaining}</span>
            <span class="${overBudget ? 'over-budget' : 'remaining-value'}">€${Math.abs(remaining).toLocaleString()}</span>
          </div>
        </div>

        <!-- Tab panels -->
        <div id="detail-panel-overview" class="detail-section">
          <div class="detail-overview-text">${trip.description}</div>
        </div>

        <div id="detail-panel-highlights" class="detail-section" style="display:none">
          <div class="detail-highlights">
            ${(trip.highlights || []).map(h => `
              <div class="detail-highlight">
                <div class="detail-highlight-dot"></div>
                <span>${h}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="detail-panel-transport" class="detail-section" style="display:none">
          <div class="detail-transport-card">
            <div class="detail-transport-row">
              <div class="detail-transport-icon ${bf ? 'transport-bg-flight flight-icon' : 'transport-bg-train train-icon'}">
                ${bf ? IC.plane : IC.train}
              </div>
              <div class="detail-transport-info">
                <div class="detail-transport-company">${trip.transport.company}</div>
                <div class="detail-transport-meta">
                  <span>${td.outbound}</span>
                  <span>⏱ ${trip.transport.duration}</span>
                  <span>${trip.transport.direct ? td.direct : td.withStops}</span>
                  ${trip.transport.departureTime ? `<span>🕐 ${trip.transport.departureTime}</span>` : ''}
                </div>
              </div>
              <div class="detail-transport-price">€${trip.transport.price.toLocaleString()}</div>
            </div>
          </div>
          ${trip.returnTransport && State.filters.tripType !== 'one_way' ? `
            <div class="detail-return-section" style="margin-top:10px">
              <div class="detail-transport-card">
                <div class="detail-transport-row">
                  <div class="detail-transport-icon ${bf ? 'transport-bg-flight flight-icon' : 'transport-bg-train train-icon'}">
                    ${bf ? IC.plane : IC.train}
                  </div>
                  <div class="detail-transport-info">
                    <div class="detail-transport-company">${trip.returnTransport.company}</div>
                    <div class="detail-transport-meta"><span>${td.returnJourney}</span><span>⏱ ${trip.returnTransport.duration}</span></div>
                  </div>
                  <div class="detail-transport-price">€${trip.returnTransport.price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ` : (State.filters.tripType === 'one_way' ? `<div style="margin:8px 0 0;padding:10px;background:var(--primary-dim);border-radius:var(--radius-lg);font-size:12px;color:var(--primary)">✈️ ${State.t.filters.oneWayHint}</div>` : '')}
        </div>

        <div id="detail-panel-hotel" class="detail-section" style="display:none">
          <div class="detail-hotel-card">
            <div class="detail-hotel-name">${trip.hotel.name}</div>
            <div class="detail-stars">${'★'.repeat(trip.hotel.stars)}${'☆'.repeat(5-trip.hotel.stars)}</div>
            <div class="detail-hotel-meta">
              ${IC.mapPin} ${trip.hotel.distanceFromCenter} ${td.kmFromCenter} ·
              ⭐ ${trip.hotel.rating}/10
            </div>
            <div class="detail-hotel-price">€${trip.hotel.pricePerNight.toLocaleString()}${td.perNight}</div>
            ${trip.hotel.amenities?.length ? `
              <div class="detail-amenities">
                ${trip.hotel.amenities.map(a => `<span class="detail-amenity">${a}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Save / Book -->
        <div style="padding:16px 20px 8px">
          ${State.isSignedIn ? `
            <button class="btn-gradient w-full" onclick="saveTripFromDetail('${trip.id}')" style="margin-bottom:10px">
              ${IC.heart} ${td.saveTrip}
            </button>
          ` : `
            <div class="detail-signup-cta" onclick="navigate('/sign-up')">
              ${IC.user} ${td.signUpCta}
            </div>
          `}
        </div>

        <!-- Booking links -->
        <div class="detail-book-section">
          <div class="detail-book-title">${td.bookTitle}</div>
          <div class="detail-book-sub">${td.bookSubtitle}</div>
          <div class="detail-book-links">
            <a href="${hotelBooUrl}" target="_blank" rel="noopener" class="detail-book-link">
              <span>🏨 ${td.bookHotel}</span> ${IC.externalL}
            </a>
            <a href="${omioUrl}" target="_blank" rel="noopener" class="detail-book-link">
              <span>🚆 ${td.bookTransport}</span> ${IC.externalL}
            </a>
            <a href="${skyUrl}" target="_blank" rel="noopener" class="detail-book-link">
              <span>✈️ ${td.bookFlight}</span> ${IC.externalL}
            </a>
          </div>
        </div>

        <div style="height:32px"></div>
      </div>
    </div>
  `;

  document.getElementById('detail-content').innerHTML = detailContent;
  openSheet('detail-sheet', () => { State.detailTrip = null; });
};

window.closeTripDetail = function() {
  closeSheet('detail-sheet');
  State.detailTrip = null;
};

window.switchDetailTab = function(tab, btn) {
  document.querySelectorAll('.detail-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['overview','highlights','transport','hotel'].forEach(p => {
    const el = document.getElementById(`detail-panel-${p}`);
    if (el) el.style.display = p === tab ? '' : 'none';
  });
};

window.saveTripFromDetail = function(tripId) {
  const trip = State.trips.find(t => t.id === tripId) || MOCK_TRIPS.find(t => t.id === tripId);
  if (trip) { saveTrip(trip); addNotification(State.t.notifications.tripSaved, 'trip_saved'); }
};

/* ─── Share Modal ───────────────────────────────────────────────────────── */
window.openShareModal = function(tripId) {
  const trip = State.trips.find(t => t.id === tripId) || MOCK_TRIPS.find(t => t.id === tripId) || State.savedTrips.find(s => s.id == tripId || s.tripData?.id === tripId);
  if (!trip) return;
  const t = State.t;
  const td = trip.tripData || trip;
  const dest = trip.destination || td.destination;
  const country = trip.country || td.country;
  const price = trip.totalPrice || td.totalPrice;
  const shareText = `✈️ ${dest}, ${country} — a soli €${price?.toLocaleString()}/persona! Scoperto su TravelBudget 🌍`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}&quote=${encodeURIComponent(shareText)}`;

  document.getElementById('share-content').innerHTML = `
    <div style="padding:20px">
      <div class="sheet-header" style="padding:0 0 14px;border-bottom:1px solid var(--border)">
        <span class="sheet-title">${t.discover.shareTrip}</span>
        <button class="icon-btn" onclick="closeSheet('share-sheet')">${IC.x}</button>
      </div>
      <div style="padding-top:16px">
        <div class="share-trip-preview">
          <img src="${trip.imageUrl || td.imageUrl}" alt="${dest}" style="width:56px;height:56px;border-radius:var(--radius-lg);object-fit:cover;flex-shrink:0" onerror="this.style.background='#1e3a5f'" />
          <div>
            <p class="font-bold text-sm">${dest}</p>
            <p class="text-xs text-muted">${country}</p>
          </div>
        </div>
        <div class="share-btns">
          <a href="${waUrl}" target="_blank" rel="noopener" class="share-btn wa">
            ${IC.msgCircle}<span>${t.discover.shareWhatsapp}</span>
          </a>
          <a href="${fbUrl}" target="_blank" rel="noopener" class="share-btn fb">
            ${IC.facebook}<span>${t.discover.shareFacebook}</span>
          </a>
          <button class="share-btn cp" onclick="copyShareText('${encodeURIComponent(shareText)}')">
            ${IC.copy}<span id="copy-label">${t.discover.shareCopy}</span>
          </button>
        </div>
      </div>
    </div>
  `;
  openSheet('share-sheet');
};

window.copyShareText = function(encodedText) {
  const text = decodeURIComponent(encodedText);
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  const lbl = document.getElementById('copy-label');
  if (lbl) { lbl.textContent = State.t.discover.copied; setTimeout(() => { if (lbl) lbl.textContent = State.t.discover.shareCopy; }, 2000); }
};

/* ─── Filter Sheet ──────────────────────────────────────────────────────── */
let draftFilters = {};
let filterErrors = {};
let filterTried = false;

window.openFilterSheet = function() {
  draftFilters = { ...State.filters };
  filterErrors = {};
  filterTried = false;
  renderFilterBody();
  document.getElementById('filter-apply').textContent = State.t.filters.apply;
  document.getElementById('filter-apply').onclick = applyFilters;
  document.getElementById('filter-reset').textContent = State.t.filters.reset;
  document.getElementById('filter-reset').onclick = () => {
    draftFilters = getDefaultFilters();
    filterErrors = {};
    filterTried = false;
    renderFilterBody();
  };
  document.getElementById('filter-close').onclick = () => closeSheet('filter-sheet');
  openSheet('filter-sheet');
};

function renderFilterBody() {
  const t = State.t;
  const f = draftFilters;

  const sortOptions = [
    { v:'best_value', e:'🏆', l:t.filters.sortBestValue },
    { v:'cheapest', e:'💰', l:t.filters.sortCheapest },
    { v:'fastest', e:'⚡', l:t.filters.sortFastest },
    { v:'best_rating', e:'⭐', l:t.filters.sortBestRating },
  ];

  const body = `
    <!-- Trip type -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.tripTypeLabel}</p>
      <div class="filter-tab-group">
        <button class="filter-tab ${f.tripType==='round_trip'?'active':''}" onclick="setFilterDraft('tripType','round_trip')">🔄 ${t.filters.roundTrip}</button>
        <button class="filter-tab ${f.tripType==='one_way'?'active':''}" onclick="setFilterDraft('tripType','one_way')">✈️ ${t.filters.oneWay}</button>
      </div>
      <p class="text-xs text-muted" style="margin-top:6px">${f.tripType==='one_way' ? t.filters.oneWayHint : t.filters.roundTripHint}</p>
    </div>

    <!-- Validation error -->
    ${filterTried && Object.keys(filterErrors).length > 0 ? `
      <div class="filter-error-banner">
        <span style="font-size:18px">⚠️</span>
        <div>
          <p class="text-sm font-semibold" style="color:hsl(0,70%,65%)">${t.filters.validationTitle}</p>
          <p class="text-xs" style="color:hsl(0,70%,65%)">${t.filters.validationSubtitle}</p>
        </div>
      </div>
    ` : ''}

    <!-- Sort -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.sortBy}</p>
      <div class="filter-grid-2">
        ${sortOptions.map(o => `
          <button class="filter-grid-btn ${f.sortBy===o.v?'active':''}" onclick="setFilterDraft('sortBy','${o.v}')">
            <span>${o.e}</span><span>${o.l}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Departure airport -->
    <div class="filter-section" id="fs-departure">
      <p class="filter-section-label">${t.filters.departureAirport}</p>
      ${renderLocationInput('departureAirport', f.departureAirport, t.filters.departureAirport, 'airport', filterErrors['departure'])}
      ${renderLocationInput('departureStation', f.departureStation, t.filters.departureStation, 'station')}
      ${filterErrors['departure'] ? `<p class="filter-error">⚠️ ${filterErrors['departure']}</p>` : ''}
    </div>

    <!-- Arrival -->
    <div class="filter-section" id="fs-arrival">
      <p class="filter-section-label">${t.filters.arrivalAirport}</p>
      ${renderLocationInput('arrivalAirport', f.arrivalAirport, t.filters.arrivalAirport, 'airport', filterErrors['arrival'])}
      ${renderLocationInput('arrivalStation', f.arrivalStation, t.filters.arrivalStation, 'station')}
      ${filterErrors['arrival'] ? `<p class="filter-error">⚠️ ${filterErrors['arrival']}</p>` : ''}
    </div>

    <!-- Budget -->
    <div class="filter-section" id="fs-budget">
      <p class="filter-section-label">${t.filters.budget}</p>
      <div class="filter-budget-input">
        <span>€</span>
        <input type="number" id="fb-budget" value="${f.budget}" min="50" max="20000" placeholder="1000"
          oninput="setFilterDraft('budget', Math.max(50,Math.min(20000,parseInt(this.value)||50)))" />
      </div>
      <p class="text-xs text-muted" style="margin-top:4px">
        ${f.tripType === 'one_way' ? t.filters.budgetIncludesOneWay : t.filters.budgetIncludes}
      </p>
      ${filterErrors['budget'] ? `<p class="filter-error">⚠️ ${filterErrors['budget']}</p>` : ''}
    </div>

    <!-- Dates -->
    <div class="filter-section" id="fs-dates">
      <p class="filter-section-label">${t.filters.departureDate}${f.tripType !== 'one_way' ? ' / ' + t.filters.returnDate : ''}</p>
      <div class="date-grid ${f.tripType !== 'one_way' ? 'two-col' : ''}">
        <div>
          <label class="date-label">${t.filters.departureDate} ✈️</label>
          <input type="date" value="${f.departureDate}" min="${new Date().toISOString().split('T')[0]}"
            onchange="setFilterDraft('departureDate', this.value)"
            class="${filterErrors['departureDate'] ? 'ring-error' : ''}" />
          ${filterErrors['departureDate'] ? `<p class="filter-error" style="margin-top:4px">⚠️ ${filterErrors['departureDate']}</p>` : ''}
        </div>
        ${f.tripType !== 'one_way' ? `
          <div>
            <label class="date-label">${t.filters.returnDate} 🏠</label>
            <input type="date" value="${f.returnDate}" min="${f.departureDate || new Date().toISOString().split('T')[0]}"
              onchange="setFilterDraft('returnDate', this.value)"
              class="${filterErrors['returnDate'] ? 'ring-error' : ''}" />
            ${filterErrors['returnDate'] ? `<p class="filter-error" style="margin-top:4px">⚠️ ${filterErrors['returnDate']}</p>` : ''}
          </div>
        ` : ''}
      </div>
    </div>

    <!-- People -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.travelers}</p>
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        ${renderStepper('numberOfPeople', t.filters.travelers, f.numberOfPeople, 1, 12)}
        ${renderStepper('numberOfChildren', t.filters.children, f.numberOfChildren, 0, 10)}
        ${renderStepper('numberOfPets', t.filters.pets, f.numberOfPets, 0, 5)}
      </div>
    </div>

    <!-- Nights -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.nights}</p>
      <div class="slider-row">
        <input type="range" min="1" max="30" value="${f.numberOfNights}"
          oninput="setFilterDraft('numberOfNights', parseInt(this.value)); this.nextElementSibling.textContent = this.value + ' ' + '${t.filters.nights.toLowerCase()}'" />
        <span class="slider-val">${f.numberOfNights} ${t.filters.nights.toLowerCase()}</span>
      </div>
    </div>

    <!-- Flight type -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.flightType}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[{v:'any',l:t.filters.anyFlight},{v:'direct',l:t.filters.directOnly},{v:'with_stops',l:t.filters.withStops}].map(o => `
          <button class="filter-tab ${f.flightPreference===o.v?'active':''}" style="flex:1;min-width:80px" onclick="setFilterDraft('flightPreference','${o.v}')">${o.l}</button>
        `).join('')}
      </div>
    </div>

    <!-- Train type -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.trainType}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[{v:'any',l:t.filters.anyFlight},{v:'direct',l:t.filters.trainDirect},{v:'with_stops',l:t.filters.trainWithChanges}].map(o => `
          <button class="filter-tab ${f.trainPreference===o.v?'active':''}" style="flex:1;min-width:80px" onclick="setFilterDraft('trainPreference','${o.v}')">${o.l}</button>
        `).join('')}
      </div>
    </div>

    <!-- Hotel stars -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.hotelStars} (${f.hotelStarsMin}–${f.hotelStarsMax} ⭐)</p>
      <div>
        <label class="date-label">${t.filters.minLabel}</label>
        <div class="stars-row">
          ${[1,2,3,4,5].map(s => `
            <button class="star-btn ${s <= f.hotelStarsMin ? 'active' : ''}" onclick="setFilterDraft('hotelStarsMin', ${s}); renderFilterBody()">★</button>
          `).join('')}
        </div>
      </div>
      <div style="margin-top:8px">
        <label class="date-label">${t.filters.maxLabel}</label>
        <div class="stars-row">
          ${[1,2,3,4,5].map(s => `
            <button class="star-btn ${s <= f.hotelStarsMax ? 'active' : ''}" onclick="setFilterDraft('hotelStarsMax', ${s}); renderFilterBody()">★</button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Accommodation type -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.accommodation}</p>
      <div class="prop-type-grid">
        ${[{v:null,e:'🏠',l:t.filters.anyAcc},{v:'budget',e:'💰',l:t.filters.budgetAcc},{v:'standard',e:'🏨',l:t.filters.standardAcc},{v:'luxury',e:'✨',l:t.filters.luxuryAcc}].map(o => `
          <button class="prop-btn ${f.accommodationType===o.v?'active':''}" onclick="setFilterDraft('accommodationType',${JSON.stringify(o.v)})">
            <span class="emoji">${o.e}</span><span>${o.l}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Property type -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.propertyType}</p>
      <div class="prop-type-grid">
        ${[{v:'any',e:'🏠',l:t.filters.anyAcc},{v:'hotel',e:'🏨',l:t.filters.hotelOnly},{v:'apartment',e:'🏢',l:t.filters.apartmentOnly},{v:'hostel',e:'🛏',l:t.filters.hostelOnly}].map(o => `
          <button class="prop-btn ${f.propertyType===o.v?'active':''}" onclick="setFilterDraft('propertyType','${o.v}')">
            <span class="emoji">${o.e}</span><span>${o.l}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Hotel features -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.hotelFeatures}</p>
      <div class="feature-toggles">
        ${[
          {k:'freeCancellation',l:t.filters.freeCancellation,e:'✅'},
          {k:'breakfastIncluded',l:t.filters.breakfastIncluded,e:'🍳'},
          {k:'parkingAvailable',l:t.filters.parkingAvailable,e:'🅿'},
          {k:'privateBathroom',l:t.filters.privateBathroom,e:'🚿'},
          {k:'petFriendly',l:t.filters.petFriendly,e:'🐾'},
          {k:'elevator',l:t.filters.elevator,e:'🛗'},
          {k:'onlinePayment',l:t.filters.onlinePayment,e:'💳'},
        ].map(o => `
          <button class="feature-toggle ${f[o.k]?'active':''}" onclick="toggleFilterDraft('${o.k}')">${o.e} ${o.l}</button>
        `).join('')}
      </div>
    </div>

    <!-- Sort by time -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.maxTravelTime}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[{v:null,l:t.filters.noLimit},{v:4,l:'≤ 4h'},{v:8,l:'≤ 8h'},{v:12,l:'≤ 12h'},{v:24,l:'≤ 24h'}].map(o => `
          <button class="filter-tab ${f.maxTravelTimeHours===o.v?'active':''}" style="flex:1;min-width:60px;font-size:12px" onclick="setFilterDraft('maxTravelTimeHours',${JSON.stringify(o.v)})">${o.l}</button>
        `).join('')}
      </div>
    </div>

    <!-- Departure time slot -->
    <div class="filter-section">
      <p class="filter-section-label">${t.filters.departureTime}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[{v:'any',l:t.filters.anyFlight},{v:'morning',l:'🌅 '+t.filters.morning},{v:'afternoon',l:'☀️ '+t.filters.afternoon},{v:'evening',l:'🌙 '+t.filters.evening}].map(o => `
          <button class="filter-tab ${f.departureTimeSlot===o.v?'active':''}" style="flex:1;min-width:80px;font-size:12px" onclick="setFilterDraft('departureTimeSlot','${o.v}')">${o.l}</button>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('filter-body').innerHTML = body;
}

function renderLocationInput(key, value, placeholder, type, hasError) {
  const list = type === 'airport' ? AIRPORTS : STATIONS;
  const inputId = `fl-${key}`;
  return `
    <div class="location-autocomplete" style="margin-bottom:8px">
      <input type="text" id="${inputId}" value="${escHtml(value)}" placeholder="${escHtml(placeholder)}"
        class="${hasError ? 'ring-error' : ''}"
        oninput="onLocationInput('${inputId}', '${key}', '${type}')"
        onfocus="showLocationDropdown('${inputId}','${key}','${type}')"
        onblur="setTimeout(()=>hideDropdown('${inputId}'),200)"
      />
      <div class="location-autocomplete-dropdown hidden" id="${inputId}-dd"></div>
    </div>
  `;
}

function renderStepper(key, label, value, min, max) {
  return `
    <div class="stepper">
      <div class="stepper-label">${label}</div>
      <div class="stepper-controls">
        <button class="stepper-btn" onclick="stepFilter('${key}',-1,${min},${max})" ${value <= min ? 'disabled' : ''}>−</button>
        <span class="stepper-val" id="step-${key}">${value}</span>
        <button class="stepper-btn" onclick="stepFilter('${key}',1,${min},${max})" ${value >= max ? 'disabled' : ''}>+</button>
      </div>
    </div>
  `;
}

window.setFilterDraft = function(key, val) {
  draftFilters[key] = val;
  if (filterTried) validateFilters();
  renderFilterBody();
};

window.toggleFilterDraft = function(key) {
  draftFilters[key] = !draftFilters[key];
  renderFilterBody();
};

window.stepFilter = function(key, delta, min, max) {
  draftFilters[key] = Math.max(min, Math.min(max, (draftFilters[key] || 0) + delta));
  renderFilterBody();
};

window.onLocationInput = function(inputId, key, type) {
  const val = document.getElementById(inputId)?.value || '';
  draftFilters[key] = val;
  showLocationDropdown(inputId, key, type);
};

window.showLocationDropdown = function(inputId, key, type) {
  const val = (document.getElementById(inputId)?.value || '').toLowerCase();
  const list = type === 'airport' ? AIRPORTS : STATIONS;
  const dd = document.getElementById(inputId + '-dd');
  if (!dd) return;
  if (!val) { dd.classList.add('hidden'); return; }
  const matches = list.filter(l => l.name.toLowerCase().includes(val) || l.code.toLowerCase().includes(val)).slice(0, 6);
  if (matches.length === 0) { dd.classList.add('hidden'); return; }
  dd.innerHTML = matches.map(m => `
    <div class="location-option" onclick="selectLocation('${inputId}','${key}','${escHtml(m.name)} (${m.code})')">
      <div class="location-option-name">${m.name}</div>
      <div class="location-option-sub">${m.code}${m.country ? ' · ' + m.country : ''}</div>
    </div>
  `).join('');
  dd.classList.remove('hidden');
};

window.hideDropdown = function(inputId) {
  const dd = document.getElementById(inputId + '-dd');
  if (dd) dd.classList.add('hidden');
};

window.selectLocation = function(inputId, key, value) {
  draftFilters[key] = value;
  const input = document.getElementById(inputId);
  if (input) input.value = value;
  hideDropdown(inputId);
  renderFilterBody();
};

function validateFilters() {
  const f = draftFilters;
  const t = State.t;
  filterErrors = {};
  const dep = f.departureAirport || f.departureStation;
  const arr = f.arrivalAirport || f.arrivalStation;
  if (!dep) filterErrors['departure'] = t.filters.missingDeparture;
  if (!arr) filterErrors['arrival'] = t.filters.missingArrival;
  if (!f.departureDate) filterErrors['departureDate'] = t.filters.missingDepartureDate;
  if (f.tripType !== 'one_way' && !f.returnDate) filterErrors['returnDate'] = t.filters.missingReturnDate;
  if (f.departureDate && f.returnDate && f.returnDate < f.departureDate) filterErrors['returnDate'] = t.filters.returnBeforeDeparture;
  if (dep && arr) {
    const dc = dep.split(' (')[0].trim().toLowerCase();
    const ac = arr.split(' (')[0].trim().toLowerCase();
    if (dc === ac) filterErrors['arrival'] = t.filters.sameLocation;
  }
  if (!f.budget || f.budget <= 0) filterErrors['budget'] = t.filters.invalidBudget;
  return Object.keys(filterErrors).length === 0;
}

function applyFilters() {
  filterTried = true;
  // Sync budget from input
  const budgetInput = document.getElementById('fb-budget');
  if (budgetInput) draftFilters.budget = Math.max(50, Math.min(20000, parseInt(budgetInput.value) || 50));

  // Relax validation: always apply filters and search
  filterErrors = {};
  filterTried = false;
  State.filters = { ...draftFilters };
  saveState();
  closeSheet('filter-sheet');
  doSearch();
}

/* ─── Saved Page ────────────────────────────────────────────────────────── */
function renderSaved() {
  const t = State.t;
  if (!State.isSignedIn) {
    return `
      <div class="saved-empty with-nav" style="flex:1">
        <div class="saved-empty-icon">${IC.heart}</div>
        <h2 style="margin-bottom:8px">${t.saved.empty}</h2>
        <p>${t.landing.logIn} per vedere i tuoi viaggi salvati</p>
        <button class="btn-primary btn-sm" style="margin-top:16px" onclick="navigate('/sign-in')">${t.landing.logIn}</button>
      </div>
      ${renderNav()}
    `;
  }

  const saved = State.savedTrips;
  if (saved.length === 0) {
    return `
      <div class="page-scroll with-nav" style="flex:1;display:flex;flex-direction:column">
        <div class="saved-empty" style="flex:1">
          <div class="saved-empty-icon">${IC.plane}</div>
          <h2>${t.saved.empty}</h2>
          <p>${t.saved.emptySub}</p>
          <button class="btn-primary btn-sm" onclick="navigate('/discover')">${t.saved.goToDiscover}</button>
        </div>
      </div>
      ${renderNav()}
    `;
  }

  return `
    <div class="page-scroll with-nav">
      <div class="saved-page">
        <h1>${t.saved.title}</h1>
        <div class="saved-grid">
          ${saved.map(s => {
            const td = s.tripData || s;
            return `
              <div class="saved-card" onclick="navigate('/saved/${s.id}')">
                <img class="saved-card-img" src="${s.imageUrl || td.imageUrl || ''}" alt="${s.destination}" loading="lazy" onerror="this.style.background='#1e3a5f'" />
                <div class="saved-card-body">
                  <div class="saved-card-head">
                    <div>
                      <div class="saved-card-dest">${s.destination}</div>
                      <div class="saved-card-country">${td.country || ''}</div>
                    </div>
                    <div style="text-align:right">
                      <div class="saved-card-price">€${Number(s.totalPrice || 0).toLocaleString()}</div>
                      <div class="saved-card-price-label">${t.saved.total}</div>
                    </div>
                  </div>
                  <div class="saved-card-meta">
                    <div class="saved-card-meta-item">${IC.calendar} ${td.durationDays || '?'} ${t.saved.days}</div>
                    <div class="saved-card-meta-item">${IC.plane} ${td.transport?.company || ''}</div>
                    <div class="saved-card-meta-item full">${IC.hotel} ${td.hotel?.name || ''}</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
    ${renderNav()}
  `;
}

/* ─── Saved Detail ──────────────────────────────────────────────────────── */
function renderSavedDetail(id) {
  const t = State.t;
  const saved = State.savedTrips.find(s => s.id == id);

  if (!State.isSignedIn) return `<div style="padding:24px;text-align:center">${t.landing.logIn}<br><button class="btn-primary btn-sm" style="margin-top:12px" onclick="navigate('/sign-in')">${t.landing.logIn}</button></div>`;
  if (!saved) return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;padding:24px;text-align:center">
      <p class="text-muted" style="margin-bottom:16px">${t.savedDetail.notFound}</p>
      <button class="btn-outline btn-sm" onclick="navigate('/saved')">${IC.arrowL} ${t.savedDetail.backToSaved}</button>
    </div>
    ${renderNav()}
  `;

  const trip = saved.tripData || saved;
  const bf = !trip.transport?.type?.includes('train');

  const confirmDel = State.confirmDeleteId === id;

  return `
    <div class="detail-full-page">
      <!-- Hero -->
      <div class="detail-full-hero">
        <img src="${saved.imageUrl || trip.imageUrl || ''}" alt="${saved.destination}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.background='#1e3a5f'" />
        <div class="detail-full-grad"></div>
        <div class="detail-full-nav">
          <button class="detail-full-nav-btn" onclick="navigate('/saved')">←</button>
          <div style="display:flex;gap:8px">
            <button class="detail-full-nav-btn" onclick="shareSavedTrip(${id})">⤴</button>
            <button class="detail-full-nav-btn ${confirmDel ? 'danger' : ''}" onclick="deleteSavedTrip(${id})">
              ${confirmDel ? '✓' : '🗑'}
            </button>
          </div>
        </div>
        ${confirmDel ? `<div style="position:absolute;bottom:80px;left:16px;background:rgba(220,50,50,0.8);border-radius:8px;padding:8px 14px;font-size:13px;color:#fff">${t.savedDetail.confirmDelete}</div>` : ''}
        <div class="detail-full-title">
          <h1>${saved.destination}</h1>
          <p>${IC.mapPin} ${trip.country || ''}</p>
        </div>
      </div>

      <!-- Body -->
      <div class="detail-full-body with-nav" style="overflow-y:auto;flex:1">
        <div class="detail-full-main">
          <h2 class="detail-full-section-title">${t.savedDetail.overview}</h2>
          <p class="detail-full-desc">${trip.description || ''}</p>
          ${trip.highlights?.length ? `
            <div class="detail-full-hl-list">
              ${trip.highlights.map(h => `
                <div class="detail-full-hl">
                  <div class="detail-full-hl-dot"></div>
                  <span>${h}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="detail-full-sidebar">
          <div class="detail-full-cost-card">
            <div class="detail-full-price">€${Number(saved.totalPrice || 0).toLocaleString()}</div>
            <div class="detail-full-price-sub">${t.savedDetail.totalCost}</div>

            <div class="detail-full-transport">
              <div class="detail-full-transport-icon ${bf ? 'flight-bg' : 'train-bg'}">
                ${bf ? IC.plane : IC.train}
              </div>
              <div>
                <div class="font-bold text-sm">${trip.transport?.company || ''}</div>
                <div class="text-xs text-muted" style="margin-top:2px">
                  ${bf ? t.savedDetail.flight : t.savedDetail.train} · ${trip.transport?.duration || ''}
                </div>
                <div class="font-semibold text-sm" style="margin-top:4px;color:var(--primary)">€${Number(trip.transport?.price || 0).toLocaleString()}</div>
              </div>
            </div>

            <div class="detail-full-divider"></div>

            <div class="detail-full-transport">
              <div class="detail-full-transport-icon" style="background:rgba(218,165,32,0.12)">
                ${IC.hotel}
              </div>
              <div>
                <div class="font-bold text-sm">${trip.hotel?.name || ''}</div>
                <div class="text-xs text-muted" style="margin-top:2px">
                  ${'★'.repeat(trip.hotel?.stars || 0)} · ${trip.hotel?.distanceFromCenter || 0}km ${t.savedDetail.fromCenter}
                </div>
                <div class="font-semibold text-sm" style="margin-top:4px;color:var(--primary)">€${Number(trip.hotel?.pricePerNight || 0).toLocaleString()} / ${t.savedDetail.night}</div>
              </div>
            </div>

            <div class="detail-full-divider"></div>

            <div style="display:flex;align-items:center;gap:10px;font-size:13px;color:var(--fg-muted)">
              ${IC.calendar} ${trip.durationDays || '?'} ${t.savedDetail.nights}
            </div>

            <a href="https://www.booking.com/searchresults.html?ss=${encodeURIComponent(saved.destination)}" target="_blank" rel="noopener" style="margin-top:20px;display:block">
              <button class="btn-primary w-full btn-lg">${t.savedDetail.bookNow}</button>
            </a>
          </div>
        </div>
      </div>
    </div>
    ${renderNav()}
  `;
}

window.deleteSavedTrip = function(id) {
  if (State.confirmDeleteId !== id) {
    State.confirmDeleteId = id;
    render();
    setTimeout(() => { State.confirmDeleteId = null; if (State.route === `/saved/${id}`) render(); }, 4000);
    return;
  }
  State.savedTrips = State.savedTrips.filter(s => s.id != id);
  State.confirmDeleteId = null;
  saveState();
  toast(State.t.savedDetail.deleted, { type:'success' });
  navigate('/saved');
};

window.shareSavedTrip = function(id) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(location.href).then(() => {
      toast(State.t.savedDetail.linkCopied, { type:'success' });
    });
  }
};

/* ─── Profile Page ──────────────────────────────────────────────────────── */
function renderProfile() {
  const t = State.t;
  if (!State.isSignedIn) {
    return `
      <div class="page-scroll with-nav">
        <div class="saved-empty" style="flex:1;display:flex">
          <div class="saved-empty-icon">${IC.user}</div>
          <h2>${t.profile.title}</h2>
          <p>${t.profile.guestMessage}</p>
          <button class="btn-primary btn-sm" style="margin-top:12px" onclick="navigate('/sign-in')">${t.landing.logIn}</button>
          <button class="btn-ghost btn-sm" style="margin-top:8px" onclick="navigate('/sign-up')">${t.landing.getStarted}</button>
        </div>
      </div>
      ${renderNav()}
    `;
  }

  const user = State.user;
  const prefs = State.prefs;
  const saved = State.savedTrips;
  const avgPrice = saved.length > 0 ? Math.round(saved.reduce((a,s) => a + (s.totalPrice||0), 0) / saved.length) : 0;
  const searchCount = user.searchCount || 0;
  const freeLimit = 20, premLimit = 80;
  const limit = State.isPremium ? premLimit : freeLimit;
  const initials = (user.name?.[0] || user.email?.[0] || '?').toUpperCase();

  return `
    <div class="page-scroll with-nav">
      <div class="profile-page">
        <h1>${t.profile.title}</h1>

        <!-- Avatar -->
        <div class="profile-avatar-card">
          <div class="profile-avatar">${initials}</div>
          <div>
            <div class="profile-name">${user.name || t.profile.traveler}</div>
            <div class="profile-email">${user.email || ''}</div>
            ${State.isPremium ? `<div class="profile-premium-badge">${IC.zap} Premium</div>` : ''}
          </div>
        </div>

        <!-- Stats -->
        <div class="profile-stats">
          <div class="profile-stat">
            ${IC.award}
            <div class="profile-stat-value">${saved.length}</div>
            <div class="profile-stat-label">${t.profile.tripsSaved}</div>
          </div>
          <div class="profile-stat">
            ${IC.map}
            <div class="profile-stat-value">€${avgPrice}</div>
            <div class="profile-stat-label">${t.profile.avgTripPrice}</div>
          </div>
          <div class="profile-stat">
            ${IC.search}
            <div class="profile-stat-value">${searchCount}</div>
            <div class="profile-stat-label">${t.profile.searchesUsed}</div>
          </div>
        </div>

        <!-- Plan -->
        <div class="profile-section" style="margin-bottom:16px">
          <div class="profile-section-header">
            <div class="profile-section-title">${IC.crown} ${t.premium.currentPlan}</div>
          </div>
          <div class="profile-section-body">
            <div style="display:flex;gap:10px;margin-bottom:14px">
              <div class="plan-box ${!State.isPremium?'active':''}" style="padding:10px;border-radius:var(--radius-lg)">
                <p class="plan-box-label free ${!State.isPremium?'hl':''}">Free</p>
                <p class="plan-box-num ${!State.isPremium?'text-primary':''}">20</p>
                <p class="plan-box-per">${t.premium.perDay}</p>
              </div>
              <div class="plan-box ${State.isPremium?'premium-active':''}" style="padding:10px;border-radius:var(--radius-lg)">
                <p class="plan-box-label prem">Premium</p>
                <p class="plan-box-num" style="color:${State.isPremium?'var(--amber)':'var(--fg)'}">80</p>
                <p class="plan-box-per">${t.premium.perDay}</p>
              </div>
            </div>
            <div style="font-size:12px;color:var(--fg-muted);margin-bottom:8px;display:flex;justify-content:space-between">
              <span>${searchCount} / ${limit} ${t.premium.perDay}</span>
              ${!State.isPremium && searchCount >= freeLimit ? `<span style="color:var(--danger);font-weight:600">${t.premium.limitReachedTitle}</span>` : ''}
            </div>
            <div class="progress-bar">
              <div class="progress-fill ${!State.isPremium && searchCount >= freeLimit ? 'danger' : State.isPremium ? 'amber' : 'primary'}"
                style="width:${Math.min(100,(searchCount/limit)*100)}%"></div>
            </div>
            ${!State.isPremium ? `
              <button class="btn-gradient w-full btn-sm" style="margin-top:12px" onclick="openPremiumModal()">
                ${t.premium.upgradeNow} — ${t.premium.price}
              </button>
            ` : `
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
                <span style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--amber)">${IC.zap} ${t.premium.planPremium}</span>
                <button class="btn-link text-xs" onclick="handleDowngrade()">${t.premium.downgrade}</button>
              </div>
            `}
          </div>
        </div>

        <!-- Preferences -->
        <div class="profile-section" style="margin-bottom:16px">
          <div class="profile-section-header">
            <div class="profile-section-title">${IC.settings} ${t.profile.preferences}</div>
            ${!State.editingPrefs ? `<button class="btn-link text-xs" onclick="toggleEditPrefs()" style="display:flex;align-items:center;gap:4px">${IC.pencil} ${t.profile.editPreferences}</button>` : ''}
          </div>
          <div class="profile-section-body">
            ${State.editingPrefs ? renderPrefsEditor(t) : `
              <div class="profile-pref-row">
                <span class="profile-pref-key">${IC.banknote} Budget</span>
                <span class="profile-pref-val">${prefs.defaultBudget ? '€'+prefs.defaultBudget : t.profile.notSet}</span>
              </div>
              <div class="profile-pref-row">
                <span class="profile-pref-key">${IC.plane} ${t.onboarding.departureCity}</span>
                <span class="profile-pref-val">${prefs.defaultDepartureLocation || t.profile.notSet}</span>
              </div>
              <div class="profile-pref-row">
                <span class="profile-pref-key">${IC.users} ${t.onboarding.numberOfPeople}</span>
                <span class="profile-pref-val">${prefs.defaultNumberOfPeople || t.profile.notSet}</span>
              </div>
              <div class="profile-pref-row">
                <span class="profile-pref-key">${IC.plane} ${t.onboarding.flight}</span>
                <span class="profile-pref-val">${prefs.defaultFlightPreference === 'direct' ? t.onboarding.directOnly : prefs.defaultFlightPreference === 'with_stops' ? t.onboarding.withStops : t.onboarding.any}</span>
              </div>
            `}
          </div>
        </div>

        <!-- Recent searches -->
        <div class="profile-section" style="margin-bottom:16px">
          <div class="profile-section-header">
            <div class="profile-section-title">${IC.clock} ${t.profile.recentSearches}</div>
          </div>
          <div class="profile-section-body">
            ${State.recentSearches.length === 0 ? `<p class="text-sm text-muted">${t.profile.noRecentSearches}</p>` :
              State.recentSearches.map((s,i) => `
                <div class="profile-search-item">
                  <div style="min-width:0;flex:1">
                    <div class="profile-search-label truncate">${buildSearchLabel(s, t)}</div>
                    <div class="profile-search-date">
                      ${IC.calendar}
                      ${new Date(s.createdAt || Date.now()).toLocaleDateString(undefined,{month:'short',day:'numeric'})}
                      ${s.tripType ? `<span style="margin-left:4px;padding:2px 6px;background:var(--primary-dim);color:var(--primary);font-size:10px;border-radius:999px;font-weight:600">${s.tripType==='one_way'?'→':'⇌'}</span>` : ''}
                    </div>
                  </div>
                  <button class="profile-search-repeat" onclick="repeatSearchFromProfile(${i})">
                    ${t.profile.repeatSearch} ${IC.chevronR}
                  </button>
                </div>
              `).join('')}
          </div>
        </div>

        <!-- Legal -->
        <div class="profile-section" style="margin-bottom:16px">
          <div class="profile-legal-label">${t.profile.legalSection}</div>
          <div class="profile-legal-item" onclick="navigate('/privacy')">
            <div class="profile-legal-item-left">${IC.shield} ${t.profile.privacyPolicy}</div>
            ${IC.chevronR}
          </div>
          <div class="profile-legal-item" onclick="navigate('/terms')">
            <div class="profile-legal-item-left">${IC.fileText} ${t.profile.termsOfService}</div>
            ${IC.chevronR}
          </div>
        </div>

        <!-- Sign out -->
        <button class="btn-outline w-full" style="margin-top:4px" onclick="handleSignOut()">
          ${IC.logOut} ${t.profile.signOut}
        </button>

        <div style="margin-top:24px;padding-top:16px;border-top:1px solid var(--border);display:flex;gap:16px;justify-content:center;font-size:12px">
          <a onclick="navigate('/privacy')" style="color:var(--fg-muted);cursor:pointer">${t.legal.privacyPolicy}</a>
          <span style="color:var(--border)">·</span>
          <a onclick="navigate('/terms')" style="color:var(--fg-muted);cursor:pointer">${t.legal.termsOfService}</a>
        </div>
      </div>
    </div>
    ${renderNav()}
  `;
}

function renderPrefsEditor(t) {
  const prefs = State.prefs;
  return `
    <div class="profile-prefs-form">
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:4px;font-size:12px">${IC.banknote} Budget (€)</label>
        <input type="number" id="pref-budget" value="${prefs.defaultBudget || ''}" placeholder="${t.profile.notSet}" />
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:4px;font-size:12px">${IC.plane} ${t.onboarding.departureCity}</label>
        <input type="text" id="pref-dep" value="${prefs.defaultDepartureLocation || ''}" placeholder="${t.profile.notSet}" />
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:4px;font-size:12px">${IC.users} ${t.onboarding.numberOfPeople}</label>
        <input type="number" min="1" max="20" id="pref-people" value="${prefs.defaultNumberOfPeople || ''}" placeholder="${t.profile.notSet}" />
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:4px;font-size:12px">${IC.plane} ${t.onboarding.flight}</label>
        <select id="pref-flight">
          <option value="any" ${prefs.defaultFlightPreference==='any'?'selected':''}>${t.onboarding.any}</option>
          <option value="direct" ${prefs.defaultFlightPreference==='direct'?'selected':''}>${t.onboarding.directOnly}</option>
          <option value="with_stops" ${prefs.defaultFlightPreference==='with_stops'?'selected':''}>${t.onboarding.withStops}</option>
        </select>
      </div>
      <div class="profile-prefs-btns">
        <button class="btn-primary btn-sm" style="flex:1" onclick="savePreferences()">
          ${IC.check} ${t.profile.save}
        </button>
        <button class="btn-outline btn-sm" style="flex:1" onclick="cancelEditPrefs()">
          ${IC.x} ${t.profile.cancel}
        </button>
      </div>
    </div>
  `;
}

window.toggleEditPrefs = function() { State.editingPrefs = true; render(); };
window.cancelEditPrefs = function() { State.editingPrefs = false; render(); };
window.savePreferences = function() {
  State.prefs = {
    defaultBudget: parseInt(document.getElementById('pref-budget')?.value) || null,
    defaultDepartureLocation: document.getElementById('pref-dep')?.value || null,
    defaultNumberOfPeople: parseInt(document.getElementById('pref-people')?.value) || null,
    defaultFlightPreference: document.getElementById('pref-flight')?.value || 'any',
  };
  State.editingPrefs = false;
  saveState();
  toast(State.t.profile.save, { type:'success' });
  render();
};

window.repeatSearchFromProfile = function(idx) {
  const entry = State.recentSearches[idx];
  if (!entry) return;
  if (entry.budget) State.filters.budget = entry.budget;
  if (entry.numberOfPeople) State.filters.numberOfPeople = entry.numberOfPeople;
  if (entry.numberOfNights) State.filters.numberOfNights = entry.numberOfNights;
  if (entry.departureLocation) State.filters.departureAirport = entry.departureLocation;
  if (entry.arrivalLocation && entry.arrivalLocation !== 'Any') State.filters.arrivalAirport = entry.arrivalLocation;
  if (entry.tripType) State.filters.tripType = entry.tripType;
  navigate('/discover');
  setTimeout(doSearch, 100);
};

window.handleSignOut = function() {
  State.user = null;
  State.savedTrips = [];
  State.notifications = [];
  State.guestCount = 0;
  localStorage.removeItem('tb_user');
  localStorage.removeItem('tb_saved');
  localStorage.removeItem('guestSearchCount');
  toast('Disconnesso!', { type:'info' });
  navigate('/');
};

/* ─── Surprise Page ─────────────────────────────────────────────────────── */
function renderSurprise() {
  const t = State.t;
  const f = State.surpriseFilters;
  const trips = State.surpriseTrips;

  return `
    <div class="surprise-page with-nav">
      <div class="surprise-header">
        <div class="surprise-header-top">
          <button class="btn-icon" onclick="navigate('/discover')">${IC.arrowL}</button>
          <div style="display:flex;align-items:center;gap:8px">
            ${IC.dice}
            <h1>${t.surprise.title}</h1>
          </div>
        </div>
        <p class="surprise-subtitle">${t.surprise.subtitle}</p>
      </div>

      <div class="surprise-scroll">
        <!-- How it works -->
        <div class="surprise-how-card">
          <div class="surprise-how-header">
            <strong>${t.surprise.howItWorksTitle}</strong>
            <span class="badge badge-primary text-xs">${t.surprise.howItWorksBadge}</span>
          </div>
          <ol class="surprise-how-list">
            ${[t.surprise.howItWorks1, t.surprise.howItWorks2, t.surprise.howItWorks3].map((step, i) => `
              <li class="surprise-how-item">
                <span class="surprise-how-num">${i+1}</span>
                <span>${step}</span>
              </li>
            `).join('')}
          </ol>
        </div>

        <!-- Filter card -->
        <div class="surprise-filter-card">
          <!-- Budget -->
          <div class="surprise-filter-row">
            <div class="surprise-filter-label">${IC.wallet} ${t.surprise.budgetLabel}</div>
            <div style="display:flex;align-items:center;gap:8px">
              <button class="counter-minus" onclick="surpriseStep('budget',-200,300)" ${f.budget<=300?'disabled':''}>−</button>
              <span class="surprise-budget-val">€${f.budget.toLocaleString()}</span>
              <button class="counter-plus" onclick="surpriseStep('budget',200,20000)">+</button>
            </div>
          </div>

          <!-- People + Nights -->
          <div class="surprise-two-cols">
            <div class="surprise-filter-row" style="flex:1">
              <div class="surprise-filter-label">${IC.users} ${t.surprise.peopleLabel}</div>
              <div class="counter-btn">
                <button class="counter-minus" onclick="surpriseStep('numberOfPeople',-1,1)" ${f.numberOfPeople<=1?'disabled':''}>−</button>
                <span class="counter-val">${f.numberOfPeople}</span>
                <button class="counter-plus" onclick="surpriseStep('numberOfPeople',1,12)">+</button>
              </div>
            </div>
            <div class="surprise-divider"></div>
            <div class="surprise-filter-row" style="flex:1">
              <div class="surprise-filter-label">${IC.moon} ${t.surprise.nightsLabel}</div>
              <div class="counter-btn">
                <button class="counter-minus" onclick="surpriseStep('numberOfNights',-1,1)" ${f.numberOfNights<=1?'disabled':''}>−</button>
                <span class="counter-val">${f.numberOfNights}</span>
                <button class="counter-plus" onclick="surpriseStep('numberOfNights',1,30)">+</button>
              </div>
            </div>
          </div>

          <!-- Children + Pets -->
          <div class="surprise-two-cols">
            <div class="surprise-filter-row" style="flex:1">
              <div class="surprise-filter-label">${IC.baby} ${t.surprise.childrenLabel}</div>
              <div class="counter-btn">
                <button class="counter-minus" onclick="surpriseStep('numberOfChildren',-1,0)" ${f.numberOfChildren<=0?'disabled':''}>−</button>
                <span class="counter-val">${f.numberOfChildren}</span>
                <button class="counter-plus" onclick="surpriseStep('numberOfChildren',1,8)">+</button>
              </div>
            </div>
            <div class="surprise-divider"></div>
            <div class="surprise-filter-row" style="flex:1">
              <div class="surprise-filter-label">${IC.paw} ${t.surprise.petsLabel}</div>
              <div class="counter-btn">
                <button class="counter-minus" onclick="surpriseStep('numberOfPets',-1,0)" ${f.numberOfPets<=0?'disabled':''}>−</button>
                <span class="counter-val">${f.numberOfPets}</span>
                <button class="counter-plus" onclick="surpriseStep('numberOfPets',1,4)">+</button>
              </div>
            </div>
          </div>

          <!-- Trip type -->
          <div style="display:flex;gap:8px">
            <button class="filter-tab ${f.tripType==='round_trip'?'active':''}" onclick="setSurpriseFilter('tripType','round_trip')">🔄 ${t.filters.roundTrip}</button>
            <button class="filter-tab ${f.tripType==='one_way'?'active':''}" onclick="setSurpriseFilter('tripType','one_way')">✈️ ${t.filters.oneWay}</button>
          </div>

          <!-- Dates -->
          <div class="date-grid ${f.tripType !== 'one_way' ? 'two-col' : ''}">
            <div>
              <label class="date-label">${t.filters.departureDate} ✈️</label>
              <input type="date" value="${f.departureDate}" min="${new Date().toISOString().split('T')[0]}"
                onchange="setSurpriseFilter('departureDate', this.value)" />
            </div>
            ${f.tripType !== 'one_way' ? `
              <div>
                <label class="date-label">${t.filters.returnDate} 🏠</label>
                <input type="date" value="${f.returnDate}" min="${f.departureDate || new Date().toISOString().split('T')[0]}"
                  onchange="setSurpriseFilter('returnDate', this.value)" />
              </div>
            ` : ''}
          </div>

          <!-- Amenities -->
          <div>
            <p class="surprise-filter-label" style="margin-bottom:8px">${IC.building} ${t.surprise.amenitiesLabel}</p>
            <div class="amenity-toggle-wrap">
              ${[
                {k:'petFriendly',i:IC.paw,l:t.surprise.petFriendly},
                {k:'elevator',i:IC.building,l:t.surprise.elevator},
                {k:'breakfastIncluded',i:IC.coffee,l:t.surprise.breakfastIncluded},
                {k:'freeCancellation',i:IC.xcircle,l:t.surprise.freeCancellation},
                {k:'parkingAvailable',i:IC.car,l:t.surprise.parkingAvailable},
                {k:'privateBathroom',i:IC.bath,l:t.surprise.privateBathroom},
                {k:'onlinePayment',i:IC.wifi,l:t.surprise.onlinePayment},
              ].map(a => `
                <button class="amenity-toggle ${f[a.k]?'active':''}" onclick="toggleSurpriseFilter('${a.k}')">
                  ${a.i} ${a.l}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Generate button -->
          <button class="btn-gradient w-full btn-lg" onclick="generateSurprise()">
            ${IC.sparkles} ${State.surpriseHasSearched ? t.surprise.regenerate : t.surprise.generate}
          </button>
        </div>

        <!-- Results -->
        ${State.surpriseHasSearched && trips.length === 0 ? `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;text-align:center">
            <div style="font-size:56px;margin-bottom:12px">😔</div>
            <p class="text-muted">${t.surprise.noResults}</p>
          </div>
        ` : ''}

        ${trips.length > 0 ? `
          <div class="mystery-cards">
            ${trips.map((tr, idx) => renderMysteryCard(tr, idx, t)).join('')}
          </div>
          <p style="text-align:center;font-size:11px;color:var(--fg-faint);padding:8px 20px 16px">${t.surprise.disclaimer}</p>
        ` : ''}
      </div>
    </div>
    ${renderNav()}
  `;
}

function renderMysteryCard(trip, idx, t) {
  const isRevealed = State.surpriseRevealed[trip.id];
  const isPaying = State.surprisePaying[trip.id];
  const gradients = ['g1','g2','g3'];
  const emojis = ['🏝️','🏔️','🌆'];
  const gr = gradients[idx % 3];
  const em = emojis[idx % 3];

  return `
    <div class="mystery-card" id="mystery-${trip.id}">
      <div class="mystery-img-area">
        ${isRevealed ? `
          <img src="${trip.imageUrl}" alt="${trip.destination}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.background='#1e3a5f'" />
          <div class="mystery-revealed-overlay"></div>
          <div class="mystery-revealed-info">
            <div class="mystery-revealed-badge">
              <span class="badge badge-green">${IC.unlock} ${t.surprise.revealed}</span>
            </div>
            <div class="mystery-revealed-dest">${trip.destination}</div>
            <div class="mystery-revealed-country">${trip.country}</div>
          </div>
        ` : `
          <div class="mystery-gradient ${gr}">
            <div class="mystery-emoji">${em}</div>
            <div class="mystery-lock">${IC.lock}<span>???</span></div>
            <p class="mystery-hidden-label">${t.surprise.destinationHidden}</p>
          </div>
          <div class="mystery-card-num"><span class="badge badge-white">${t.surprise.cardLabel}${idx+1}</span></div>
        `}
      </div>

      <div class="mystery-card-body">
        <div class="mystery-price-row">
          <div class="mystery-price">€${trip.totalPrice.toLocaleString()}<span>/ ${State.surpriseFilters.numberOfPeople} ${t.surprise.peopleLabel.toLowerCase()}</span></div>
          <span class="badge badge-green text-xs">${t.surprise.budgetExceeded}</span>
        </div>

        <div class="mystery-transport-row">
          ${trip.transport.type === 'train' ? IC.train : IC.plane}
          <span>${isRevealed ? trip.transport.company : t.surprise.transport} · ${trip.transport.duration}</span>
        </div>

        ${isRevealed ? `
          <button class="btn-primary mystery-save-btn w-full btn-sm" onclick="saveSurpriseTrip('${trip.id}')">
            ${IC.heart} ${t.surprise.saveRevealed}
          </button>
        ` : `
          <button class="mystery-reveal-btn" onclick="revealSurprise('${trip.id}')" ${isPaying?'disabled':''}>
            ${isPaying ? `${IC.loader} ${t.surprise.paying}` : t.surprise.revealBtn}
          </button>
        `}
      </div>
    </div>
  `;
}

window.setSurpriseFilter = function(key, val) {
  State.surpriseFilters[key] = val;
  render();
};

window.toggleSurpriseFilter = function(key) {
  State.surpriseFilters[key] = !State.surpriseFilters[key];
  render();
};

window.surpriseStep = function(key, delta, minOrMax) {
  const f = State.surpriseFilters;
  if (delta > 0) f[key] = Math.min(minOrMax, f[key] + Math.abs(delta));
  else f[key] = Math.max(minOrMax, f[key] + delta);
  render();
};

window.generateSurprise = function() {
  const f = State.surpriseFilters;
  // Use mock trips filtered by budget, shuffle, take 3
  let pool = MOCK_TRIPS.filter(tr => tr.totalPrice <= f.budget);
  if (pool.length === 0) pool = [...MOCK_TRIPS].sort((a,b) => a.totalPrice - b.totalPrice).slice(0, 3);
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  State.surpriseTrips = pool.slice(0, 3);
  State.surpriseRevealed = {};
  State.surprisePaying = {};
  State.surpriseHasSearched = true;
  render();
};

window.revealSurprise = function(tripId) {
  if (State.surprisePaying[tripId] || State.surpriseRevealed[tripId]) return;
  State.surprisePaying[tripId] = true;
  render();
  setTimeout(() => {
    State.surprisePaying[tripId] = false;
    State.surpriseRevealed[tripId] = true;
    toast(State.t.surprise.revealed, { type:'success' });
    render();
  }, 1600);
};

window.saveSurpriseTrip = function(tripId) {
  const trip = State.surpriseTrips.find(t => t.id === tripId);
  if (!trip) return;
  if (!State.isSignedIn) { navigate('/sign-up'); return; }
  saveTrip(trip);
  addNotification(State.t.notifications.tripSaved, 'trip_saved');
};

/* ─── Privacy / Terms ───────────────────────────────────────────────────── */
function renderPrivacy() {
  const t = State.t;
  const p = t.legal.privacy;
  return `
    <div class="page-scroll with-nav">
      <div class="legal-page">
        <div class="legal-back" onclick="navigate('/profile')">← ${t.savedDetail.backToSaved.replace('Saved','Profilo')}</div>
        <h1>${t.legal.privacyPolicy}</h1>
        <p class="legal-date">${t.legal.lastUpdated}: Gennaio 2025</p>
        <div class="legal-disclaimer">${t.legal.priceDisclaimer}</div>
        <h2>${p.collectTitle}</h2><p>${p.collect}</p>
        <h2>${p.useTitle}</h2><p>${p.use}</p>
        <h2>${p.cookiesTitle}</h2><p>${p.cookies}</p>
        <h2>${p.thirdPartyTitle}</h2><p>${p.thirdParty}</p>
        <h2>${p.securityTitle}</h2><p>${p.security}</p>
        <h2>${p.rightsTitle}</h2><p>${p.rights}</p>
        <h2>${p.liabilityTitle}</h2><p>${p.liability}</p>
        <h2>${p.changesTitle}</h2><p>${p.changes}</p>
      </div>
    </div>
    ${renderNav()}
  `;
}

function renderTerms() {
  const t = State.t;
  const tr = t.legal.terms;
  return `
    <div class="page-scroll with-nav">
      <div class="legal-page">
        <div class="legal-back" onclick="navigate('/profile')">← Profilo</div>
        <h1>${t.legal.termsOfService}</h1>
        <p class="legal-date">${t.legal.lastUpdated}: Gennaio 2025</p>
        <div class="legal-disclaimer">${t.legal.liability}</div>
        <h2>${tr.acceptanceTitle}</h2><p>${tr.acceptance}</p>
        <h2>${tr.serviceTitle}</h2><p>${tr.service}</p>
        <h2>${tr.pricesTitle}</h2><p>${tr.prices1}</p><p>${tr.prices2}</p><p>${tr.prices3}</p>
        <h2>${tr.thirdPartyTitle}</h2><p>${tr.thirdParty}</p>
        <h2>${tr.bookingTitle}</h2><p>${tr.booking}</p>
        <h2>${tr.accountTitle}</h2><p>${tr.account}</p>
        <h2>${tr.liabilityTitle}</h2><p>${tr.liability1}</p><p>${tr.liability2}</p>
        <h2>${tr.changesTitle}</h2><p>${tr.changes}</p>
        <h2>${tr.contactTitle}</h2><p>${tr.contact}</p>
      </div>
    </div>
    ${renderNav()}
  `;
}

/* ─── 404 ───────────────────────────────────────────────────────────────── */
function renderNotFound() {
  const t = State.t;
  return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center">
      <div style="font-size:64px;margin-bottom:16px">😵</div>
      <h1 style="font-size:24px;font-weight:900;margin-bottom:8px">${t.notFound.title}</h1>
      <p style="color:var(--fg-muted);margin-bottom:24px">${t.notFound.sub}</p>
      <button class="btn-primary btn-sm" onclick="navigate('/')">← Home</button>
    </div>
  `;
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── Main Render ───────────────────────────────────────────────────────── */
function render() {
  const app = document.getElementById('app');
  const r = State.route;

  // Update html lang
  document.documentElement.lang = State.lang;

  let html = '';

  if (r === '/' || r === '') {
    html = renderLanding();
  } else if (r === '/sign-in') {
    html = renderSignIn();
  } else if (r === '/sign-up') {
    html = renderSignUp();
  } else if (r === '/onboarding') {
    html = renderOnboarding();
  } else if (r === '/discover') {
    html = `<div class="page">${renderDiscover()}</div>`;
  } else if (r === '/saved') {
    html = `<div class="page">${renderSaved()}</div>`;
  } else if (r.startsWith('/saved/')) {
    const id = r.split('/saved/')[1];
    html = `<div class="page">${renderSavedDetail(id)}</div>`;
  } else if (r === '/profile') {
    html = `<div class="page">${renderProfile()}</div>`;
  } else if (r === '/privacy') {
    html = `<div class="page">${renderPrivacy()}</div>`;
  } else if (r === '/terms') {
    html = `<div class="page">${renderTerms()}</div>`;
  } else if (r === '/surprise') {
    html = `<div class="page">${renderSurprise()}</div>`;
  } else {
    html = renderNotFound();
  }

  app.innerHTML = html;

  // Init swipe if on discover page with swipe mode
  if (r === '/discover' && State.hasSearched && State.viewMode === 'swipe' && State.currentIndex < State.trips.length) {
    requestAnimationFrame(initSwipe);
  }
}

/* ─── Init ──────────────────────────────────────────────────────────────── */
function init() {
  // Cookie banner
  initCookieBanner();

  // Close sheets on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSheet('filter-sheet');
      closeSheet('detail-sheet');
      closeSheet('share-sheet');
      closeSheet('lang-sheet');
      closeModal('premium-modal');
      closeModal('notif-panel');
    }
  });

  // Initial render
  render();

  // If no hash, go to /
  if (!location.hash) {
    navigate('/');
  }
}

// Start
document.addEventListener('DOMContentLoaded', init);
