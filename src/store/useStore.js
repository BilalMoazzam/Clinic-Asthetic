import { create } from 'zustand';

const API_URL = 'http://localhost:3000';

// ==========================================
// STATIC OFFLINE FALLBACKS (from db.json)
// ==========================================
const FALLBACK_SERVICES = [
  {
    "id": "1",
    "title": "HydraFacial Pro",
    "category": "Skincare",
    "price": 240,
    "duration": "60 min",
    "description": "The ultimate skin detox. A multi-step treatment that cleanses, exfoliates, and extracts impurities while replenishing skin with vital nutrients.",
    "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
    "featured": true
  },
  {
    "id": "2",
    "title": "Velvet Massage",
    "category": "Wellness",
    "price": 185,
    "duration": "90 min",
    "description": "Our signature deep-tissue ritual. Using warm botanical oils and rhythmic pressure to melt away tension and restore your body's natural harmony.",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRzawJyID0vJSvxrYkSspBAQ_qZtzm92dTSw&s",
    "featured": true
  },
  {
    "id": "3",
    "title": "Diamond Glow",
    "category": "Facial",
    "price": 210,
    "duration": "45 min",
    "description": "Micro-diamond exfoliation combined with deep infusion of custom serums for an instant red-carpet radiance.",
    "image": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    "featured": true
  }
];

const FALLBACK_DEALS = [
  {
    "id": "1",
    "title": "Summer Glow Ritual",
    "subtitle": "Seasonal Sanctuary",
    "description": "A curated journey featuring our HydraFacial Pro followed by a 30-minute stress-relief massage. The perfect reset for your skin and spirit.",
    "duration": "90 min",
    "originalPrice": 425,
    "discountPrice": 299,
    "image": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
    "status": "Active",
    "tag": "Trending"
  }
];

const FALLBACK_VOUCHERS = [
  {
    "code": "WELCOME2026",
    "type": "Percentage",
    "value": 15,
    "expiryDate": "2026-12-31",
    "usageLimit": 100,
    "status": "active",
    "id": "v1"
  }
];

const FALLBACK_SETTINGS = {
  "brandName": "VLAS AESTHETIC",
  "primaryAccent": "#86626E",
  "typography": "Playfair Display",
  "workingHoursStart": "09:00 AM",
  "workingHoursEnd": "08:00 PM",
  "bufferTime": 10,
  "bookingWindow": 60,
  "onlineBookings": true,
  "staffOverrides": false,
  "secondaryWash": "#0f172a",
  "brandLogo": ""
};

export const useStore = create((set, get) => ({
  services: [],
  deals: [],
  bookings: [],
  customers: [],
  vouchers: [],
  settings: FALLBACK_SETTINGS,

  // Preload Images
  preloadImages: (list) => {
    if (typeof window !== 'undefined') {
      list.forEach(item => {
        if (item.image) {
          const img = new Image();
          img.src = item.image;
        }
      });
    }
  },

  fetchServices: async () => {
    try {
      const res = await fetch(`${API_URL}/services`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      set({ services: data });
      get().preloadImages(data);
      localStorage.setItem('vlas_services', JSON.stringify(data));
    } catch (e) {
      console.warn("Client App: Using offline fallback for services");
      const local = localStorage.getItem('vlas_services');
      if (local) {
        const parsed = JSON.parse(local);
        set({ services: parsed });
        get().preloadImages(parsed);
      } else {
        set({ services: FALLBACK_SERVICES });
        get().preloadImages(FALLBACK_SERVICES);
        localStorage.setItem('vlas_services', JSON.stringify(FALLBACK_SERVICES));
      }
    }
  },

  fetchDeals: async () => {
    try {
      const res = await fetch(`${API_URL}/deals`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      set({ deals: data });
      get().preloadImages(data);
      localStorage.setItem('vlas_deals', JSON.stringify(data));
    } catch (e) {
      console.warn("Client App: Using offline fallback for deals");
      const local = localStorage.getItem('vlas_deals');
      if (local) {
        const parsed = JSON.parse(local);
        set({ deals: parsed });
        get().preloadImages(parsed);
      } else {
        set({ deals: FALLBACK_DEALS });
        get().preloadImages(FALLBACK_DEALS);
        localStorage.setItem('vlas_deals', JSON.stringify(FALLBACK_DEALS));
      }
    }
  },

  fetchVouchers: async () => {
    try {
      const res = await fetch(`${API_URL}/vouchers`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      set({ vouchers: data });
      localStorage.setItem('vlas_vouchers', JSON.stringify(data));
    } catch (e) {
      console.warn("Client App: Using offline fallback for vouchers");
      const local = localStorage.getItem('vlas_vouchers');
      set({ vouchers: local ? JSON.parse(local) : FALLBACK_VOUCHERS });
    }
  },

  fetchSettings: async () => {
    try {
      const res = await fetch(`${API_URL}/settings`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      data.primaryAccent = "#86626E"; // Force overriding the DB or old cached value
      set({ settings: data });
      localStorage.setItem('vlas_settings', JSON.stringify(data));
    } catch (e) {
      console.warn("Client App: Using offline fallback for settings");
      const local = localStorage.getItem('vlas_settings');
      const parsed = local ? JSON.parse(local) : FALLBACK_SETTINGS;
      parsed.primaryAccent = "#86626E";
      set({ settings: parsed });
    }
  },

  fetchBookings: async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      set({ bookings: data });
      localStorage.setItem('vlas_bookings', JSON.stringify(data));
    } catch (e) {
      console.warn("Client App: Using offline fallback for bookings");
      const local = localStorage.getItem('vlas_bookings');
      set({ bookings: local ? JSON.parse(local) : [] });
    }
  },

  fetchCustomers: async () => {
    try {
      const res = await fetch(`${API_URL}/customers`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      set({ customers: data });
      localStorage.setItem('vlas_customers', JSON.stringify(data));
    } catch (e) {
      console.warn("Client App: Using offline fallback for customers");
      const local = localStorage.getItem('vlas_customers');
      set({ customers: local ? JSON.parse(local) : [] });
    }
  },

  addBooking: async (booking) => {
    const newItem = { ...booking, id: Date.now().toString() };
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (!res.ok) throw new Error("API failed");
      get().fetchBookings();
    } catch (e) {
      console.warn("Client App: Offline - added booking locally");
      const current = [...get().bookings, newItem];
      set({ bookings: current });
      localStorage.setItem('vlas_bookings', JSON.stringify(current));
    }
  },
  
  addCustomer: async (customer) => {
    const { customers, fetchCustomers } = get();
    await fetchCustomers();
    const existing = get().customers.find(c => c.email === customer.email);
    
    if (existing) {
      console.log("Client App: Customer already exists, updating tier if needed...");
      return;
    }

    const newItem = { ...customer, id: Date.now().toString() };
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (!res.ok) throw new Error("API failed");
      get().fetchCustomers();
    } catch (e) {
      console.warn("Client App: Offline - registered customer locally");
      const current = [...get().customers, newItem];
      set({ customers: current });
      localStorage.setItem('vlas_customers', JSON.stringify(current));
    }
  },

  validateVoucher: (code) => {
    const { vouchers } = get();
    const voucher = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase() && v.status === 'active');
    if (!voucher) return null;
    if (new Date(voucher.expiryDate) < new Date()) return null;
    return voucher;
  },

  initializeStore: () => {
    get().fetchServices();
    get().fetchDeals();
    get().fetchSettings();
    get().fetchVouchers();
    get().fetchBookings();
    get().fetchCustomers();
  }
}));
