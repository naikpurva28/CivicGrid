const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env.local or .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...vals] = trimmed.split('=');
          const value = vals.join('=').trim().replace(/^["']|["']$/g, '');
          if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      });
    }
  }
}

loadEnv();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error('❌ Error: PEXELS_API_KEY not found in .env.local or environment.');
  process.exit(1);
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    return {
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
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing db.json:', e);
    return { users: [], issues: [], alerts: [], notifications: [], preferences: {}, triageStats: {} };
  }
}

function writeDb(data) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function fetchPexelsPhoto(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const options = {
      hostname: 'api.pexels.com',
      path: `/v1/search?query=${encodedQuery}&per_page=1`,
      method: 'GET',
      headers: {
        'Authorization': PEXELS_API_KEY,
        'User-Agent': 'CivicGrid-Seeder/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`Pexels API HTTP ${res.statusCode}: ${data}`));
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.photos && parsed.photos.length > 0 && parsed.photos[0].src && parsed.photos[0].src.large) {
            resolve(parsed.photos[0].src.large);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CATEGORIES = [
  {
    category: 'Pothole Report',
    query: 'pothole road damage',
    type: 'POTHOLE',
    typeIcon: '🛣️',
    priorityScore: 9.2,
    department: 'Transportation',
    location: 'Linking Road near Khar Telephone Exchange, Bandra West, Mumbai',
    ward: 'Ward H-West',
    precinct: 'Bandra Central Sector 2',
    latitude: 19.0688,
    longitude: 72.8361,
    description: 'Large active crater/pothole approximately 8 inches deep causing vehicles and two-wheelers to swerve into oncoming traffic.',
    targetSLA: 'Within 4 Hours',
    impact: 'Critical Hazard',
    isUrgent: true
  },
  {
    category: 'Sewage/Drainage Leak',
    query: 'sewage overflow street',
    type: 'DRAINAGE',
    typeIcon: '💧',
    priorityScore: 8.8,
    department: 'Water Works',
    location: 'Dr. Annie Besant Road, Worli Naka, Mumbai',
    ward: 'Ward G-South',
    precinct: 'Worli Coastal Sector 4',
    latitude: 19.0084,
    longitude: 72.8172,
    description: 'Sub-surface drainage chamber overflowing across sidewalk and gutter line creating severe biohazard and odor.',
    targetSLA: 'Within 12 Hours',
    impact: 'Bio Hazard',
    isUrgent: true
  },
  {
    category: 'Broken Streetlight',
    query: 'broken street light night',
    type: 'STREETLIGHT',
    typeIcon: '💡',
    priorityScore: 7.4,
    department: 'Energy Services',
    location: 'S.V. Road near Andheri Subway, Andheri West, Mumbai',
    ward: 'Ward K-West',
    precinct: 'Andheri West Sector 1',
    latitude: 19.1197,
    longitude: 72.8468,
    description: 'Series of municipal street poles completely unlit causing a dark zone near the pedestrian underpass.',
    targetSLA: 'Within 24 Hours',
    impact: 'Safety Hazard',
    isUrgent: false
  },
  {
    category: 'Fallen Tree Branch on Power Line',
    query: 'fallen tree branch power line',
    type: 'TREE HAZARD',
    typeIcon: '🌳',
    priorityScore: 9.6,
    department: 'Public Works',
    location: 'Juhu Tara Road opposite Palm Beach Apartments, Juhu, Mumbai',
    ward: 'Ward K-West',
    precinct: 'Juhu Coastal Precinct 3',
    latitude: 19.0968,
    longitude: 72.8265,
    description: 'Heavy banyan branch snapped during high winds, currently resting on overhead power cables and blocking one traffic lane.',
    targetSLA: 'Within 2 Hours',
    impact: 'Critical Hazard',
    isUrgent: true
  },
  {
    category: 'Damaged Guardrail',
    query: 'damaged highway guardrail',
    type: 'GUARDRAIL',
    typeIcon: '🚧',
    priorityScore: 8.2,
    department: 'Transportation',
    location: 'Western Express Highway near Goregaon Flyover, Goregaon East, Mumbai',
    ward: 'Ward P-South',
    precinct: 'WEH Highway Sector 5',
    latitude: 19.1551,
    longitude: 72.8526,
    description: 'Metal crash barrier deformed and jutting into the fast lane following a vehicular collision.',
    targetSLA: 'Within 12 Hours',
    impact: 'Traffic Hazard',
    isUrgent: false
  },
  {
    category: 'Garbage/Debris Pile',
    query: 'overflowing garbage street',
    type: 'GARBAGE',
    typeIcon: '🗑️',
    priorityScore: 7.9,
    department: 'Sanitation',
    location: 'Hill Road Market Junction, Bandra West, Mumbai',
    ward: 'Ward H-West',
    precinct: 'Hill Road Commercial Sector',
    latitude: 19.0558,
    longitude: 72.8315,
    description: 'Uncollected commercial refuse and overflowed dump bin blocking pedestrian footpath near market entrance.',
    targetSLA: 'Within 24 Hours',
    impact: 'Sanitation Hazard',
    isUrgent: false
  },
  {
    category: 'Broken Traffic Signal',
    query: 'broken traffic light',
    type: 'TRAFFIC SIGNAL',
    typeIcon: '🚦',
    priorityScore: 9.3,
    department: 'Transportation',
    location: 'Dadar TT Circle 4-Way Junction, Dadar East, Mumbai',
    ward: 'Ward F-North',
    precinct: 'Dadar Central Grid 1',
    latitude: 19.0178,
    longitude: 72.8478,
    description: 'Complete electrical signal failure on all 4 aspects causing severe traffic gridlock and pedestrian crossing danger.',
    targetSLA: 'Immediate (1 Hour)',
    impact: 'Critical Hazard',
    isUrgent: true
  },
  {
    category: 'Exposed Electrical Cables',
    query: 'exposed electrical wires street',
    type: 'ELECTRICAL',
    typeIcon: '⚡',
    priorityScore: 9.5,
    department: 'Energy Services',
    location: 'Colaba Causeway near Regal Cinema, Colaba, Mumbai',
    ward: 'Ward A',
    precinct: 'Colaba Heritage Sector 1',
    latitude: 18.9220,
    longitude: 72.8319,
    description: 'Underground utility feeder box damaged with exposed live cables lying exposed near bus stop curb.',
    targetSLA: 'Immediate (1 Hour)',
    impact: 'Life Threatening',
    isUrgent: true
  },
  {
    category: 'Water Pipeline Burst',
    query: 'burst water pipe street flooding',
    type: 'WATER',
    typeIcon: '💧',
    priorityScore: 9.1,
    department: 'Water Works',
    location: 'LBS Marg near Kurla West Station, Kurla, Mumbai',
    ward: 'Ward L',
    precinct: 'Kurla Transport Hub',
    latitude: 19.0657,
    longitude: 72.8793,
    description: 'High-pressure potable water main ruptured, discharging large volumes of water and submerging the northbound carriageway.',
    targetSLA: 'Within 4 Hours',
    impact: 'Critical Hazard',
    isUrgent: true
  },
  {
    category: 'Damaged Crosswalk/Pedestrian Signal',
    query: 'broken pedestrian crossing light',
    type: 'PEDESTRIAN SIGNAL',
    typeIcon: '🚸',
    priorityScore: 8.4,
    department: 'Transportation',
    location: 'Marine Drive Promenade Crossing, Nariman Point, Mumbai',
    ward: 'Ward A',
    precinct: 'Marine Drive Sector 2',
    latitude: 18.9260,
    longitude: 72.8228,
    description: 'Pedestrian push-button signal head knocked down and crossing lines worn away, creating hazardous crossing for pedestrians.',
    targetSLA: 'Within 12 Hours',
    impact: 'Pedestrian Safety',
    isUrgent: false
  }
];

async function seedIssues() {
  console.log('🚀 Starting Pexels Photo Fetch & Issue Seeder...');
  console.log(`📋 Total categories to process: ${CATEGORIES.length}`);

  const db = readDb();
  if (!Array.isArray(db.issues)) db.issues = [];
  if (!db.triageStats) {
    db.triageStats = {
      totalReports: 0,
      pendingVerification: 0,
      highPriorityAlerts: 0,
      resolvedThisWeek: 0,
      slaOnTimePct: 100,
      avgResponseHours: 0,
      categories: [],
      resolutionTrend: []
    };
  }

  let successCount = 0;
  let skipCount = 0;
  const newIssues = [];
  const now = new Date();

  for (let i = 0; i < CATEGORIES.length; i++) {
    const item = CATEGORIES[i];
    console.log(`\n[${i + 1}/${CATEGORIES.length}] Fetching photo for: "${item.category}" (Query: "${item.query}")...`);

    try {
      const photoUrl = await fetchPexelsPhoto(item.query);

      if (!photoUrl) {
        console.warn(`⚠️ Warning: No photos found for query "${item.query}". Skipping category: ${item.category}`);
        skipCount++;
        continue;
      }

      const issueId = `CIV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const nowStr = now.toLocaleString();

      const newIssue = {
        id: issueId,
        type: item.type,
        typeIcon: item.typeIcon,
        title: item.category,
        description: item.description,
        location: item.location,
        address: item.location.split(',')[0].trim(),
        ward: item.ward,
        precinct: item.precinct,
        latitude: item.latitude,
        longitude: item.longitude,
        gpsAccuracy: 3.0,
        gpsLockStatus: 'Active Lock',
        priorityScore: item.priorityScore,
        status: item.isUrgent ? 'Flagged Urgent' : 'Submitted',
        impact: item.impact,
        confirmations: 0,
        time: 'Just now',
        update: 'Awaiting Triage Inspection',
        updateIcon: '⏱️',
        image: photoUrl,
        imageBadge: 'Photo',
        badgeColor: 'rgba(0,0,0,0.6)',
        photoBefore: photoUrl,
        photoAfter: null,
        resolvedAt: null,
        verification: null,
        department: item.department,
        assignedUnit: 'Unassigned',
        crewInitials: '--',
        targetSLA: item.targetSLA,
        jurisdiction: item.ward,
        isUrgent: item.isUrgent,
        history: [
          {
            status: item.isUrgent ? 'Flagged Urgent' : 'Submitted',
            time: nowStr,
            detail: `${item.description} (Geotagged photographic evidence attached)`,
            icon: '✓',
            active: true
          }
        ],
        reportedBy: 'citizen',
        date: nowStr
      };

      newIssues.push(newIssue);
      console.log(`  ✅ Success: Issue ${issueId} created with photo: ${photoUrl.substring(0, 60)}...`);
      successCount++;
    } catch (err) {
      console.warn(`⚠️ Warning: Failed to fetch/create issue for "${item.category}": ${err.message}`);
      skipCount++;
    }

    // 300ms rate-limit friendly delay between Pexels requests
    if (i < CATEGORIES.length - 1) {
      await delay(300);
    }
  }

  // Append new issues to db.json without deleting existing ones
  db.issues = [...newIssues, ...db.issues];

  // Update triageStats totals
  db.triageStats.totalReports = db.issues.length;
  db.triageStats.pendingVerification = db.issues.filter(i => i.status !== 'Resolved').length;
  db.triageStats.highPriorityAlerts = db.issues.filter(i => i.isUrgent || i.priorityScore >= 9.0).length;

  writeDb(db);

  console.log('\n========================================');
  console.log('🎉 SEEDING PROCESS COMPLETED SUMMARY');
  console.log('========================================');
  console.log(`✅ Successfully Created: ${successCount} issues`);
  console.log(`⚠️ Skipped/Failed:       ${skipCount} issues`);
  console.log(`📊 Total Database Issues: ${db.issues.length}`);
  console.log(`💾 Saved to:             ${DB_PATH}`);
  console.log('========================================\n');
}

seedIssues().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
