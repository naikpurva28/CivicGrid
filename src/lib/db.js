import fs from 'fs';
import path from 'path';
import { mumbaiIssues } from './mumbaiSeedData.js';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const TMP_PATH = path.join('/tmp', 'db.json');

// Ensure directory exists safely
function ensureDbDir(filePath) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (e) {
    // Ignore directory creation errors on read-only environments
  }
}

// Initial Seed Data (permanently clean & empty)
const initialSeed = {
  users: [
    {
      id: "u_citizen_1",
      name: "Maya Lin",
      email: "citizen@metropolis.gov",
      role: "citizen",
      ward: "Ward K-West",
      community: "Mumbai Civic Zone",
      precinctId: "#BOM-4092",
      activeIssuesCount: 0,
      avgResponseHours: 0
    },
    {
      id: "u_officer_1",
      name: "Supv. Kowalski",
      email: "officer@metropolis.gov",
      role: "authority",
      badgeNumber: "#9042",
      department: "MCGM Municipal Operations",
      jurisdiction: "Greater Mumbai Region"
    }
  ],
  issues: [],
  alerts: [],
  notifications: [],
  preferences: {
    u_citizen_1: {
      statusShifts: true,
      safetyAdvisories: true,
      nearbyUpvotes: false
    }
  },
  triageStats: {
    totalReports: 0,
    pendingVerification: 0,
    highPriorityAlerts: 0,
    resolvedThisWeek: 0,
    slaOnTimePct: 100,
    avgResponseHours: 0,
    categories: [],
    resolutionTrend: []
  }
};

export function readDb() {
  // 1. Check /tmp on serverless environments if it has been updated
  if (fs.existsSync(TMP_PATH)) {
    try {
      const raw = fs.readFileSync(TMP_PATH, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading from /tmp/db.json:', e.message);
    }
  }

  // 2. Read from primary DB_PATH
  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading primary db.json:', err.message);
      return initialSeed;
    }
  }

  // 3. Fallback: create primary or /tmp db
  try {
    ensureDbDir(DB_PATH);
    fs.writeFileSync(DB_PATH, JSON.stringify(initialSeed, null, 2));
  } catch (err) {
    try {
      ensureDbDir(TMP_PATH);
      fs.writeFileSync(TMP_PATH, JSON.stringify(initialSeed, null, 2));
    } catch (e) {
      // ignore
    }
  }
  return initialSeed;
}

export function writeDb(data) {
  let written = false;

  // 1. Try writing to primary DB_PATH (works in local dev)
  try {
    ensureDbDir(DB_PATH);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    written = true;
  } catch (err) {
    console.warn('Primary DB write failed (read-only filesystem on Vercel):', err.message);
  }

  // 2. Write to /tmp on serverless environments
  try {
    ensureDbDir(TMP_PATH);
    fs.writeFileSync(TMP_PATH, JSON.stringify(data, null, 2));
    written = true;
  } catch (err) {
    console.warn('/tmp write failed:', err.message);
  }

  // 3. If Vercel KV / Upstash Redis environment variables are configured, sync to Cloud KV asynchronously
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    try {
      fetch(`${kvUrl}/set/civicgrid_db`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch(e => console.warn('KV sync error:', e.message));
    } catch (e) {
      // ignore
    }
  }

  return written;
}

// Distance helper function (Haversine formula in meters)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
}
