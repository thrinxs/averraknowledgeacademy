// ── SINGLE SOURCE OF TRUTH FOR PRICING PLANS ─────────────────────────────────
export const ONLINE_PLANS = [
  { name: 'Lite',     price: 20000,  period: '30 min',              slotDuration: 30,  sessions: 1, maxPerWeek: 3, multiPerDay: true,  isVip: false },
  { name: 'Basic',    price: 35000,  period: '1 hour',              slotDuration: 60,  sessions: 1, maxPerWeek: 3, multiPerDay: true,  isVip: false },
  { name: 'Standard', price: 80000,  period: '1 day · up to 2 hrs', slotDuration: 120, sessions: 1, maxPerWeek: 3, multiPerDay: false, isVip: false },
]

export const PHYSICAL_PLANS = [
  { name: 'Lite',     price: 25000,  period: '30 min',              slotDuration: 30,  sessions: 1, maxPerWeek: 3, multiPerDay: true,  isVip: false },
  { name: 'Basic',    price: 40000,  period: '1 hour',              slotDuration: 60,  sessions: 1, maxPerWeek: 3, multiPerDay: true,  isVip: false },
  { name: 'Standard', price: 110000, period: '1 day · up to 2 hrs', slotDuration: 120, sessions: 1, maxPerWeek: 3, multiPerDay: false, isVip: false },
]
