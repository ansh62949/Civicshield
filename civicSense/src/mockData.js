export const CURRENT_USER = {
  id: "u1",
  name: "Rahul Sharma",
  initials: "RS",
  area: "Sector 62, Noida",
  city: "Noida",
  state: "Uttar Pradesh",
  posts: 12,
  upvotes: 284,
  points: 1840,
  badges: ["Street Guardian", "First Reporter", "Safety Watcher"],
  isVerified: true,
  verificationRate: 94
};

export const POSTS = [
  {
    id: "p1",
    type: "CIVIC",
    userName: "Rahul Sharma",
    userInitials: "RS",
    avatarBg: "#FAEEDA",
    avatarColor: "#854F0B",
    isVerified: true,
    timeAgo: "8 min ago",
    area: "Sector 62, Noida",
    distance: "0.3km",
    text: "Large pothole outside Apollo Hospital gate. Ambulances are struggling to pass. This is the third complaint this week — NMMC still no action. This is a life safety issue that needs immediate attention.",
    hasPhoto: true,
    photoCaption: "AI detected: Pothole · Severity: CRITICAL · Location verified ✓",
    aiTag: "Pothole · CRITICAL",
    civicImpact: "-3 pts Infrastructure",
    upvotes: 34,
    comments: 12,
    isUpvoted: false,
    lat: 28.627,
    lon: 77.371
  },
  {
    id: "p2",
    type: "GEO_ALERT",
    userName: "GeoTrade AI",
    userInitials: "GT",
    avatarBg: "#0f172a",
    avatarColor: "#1D9E75",
    isVerified: true,
    timeAgo: "22 min ago",
    area: "Delhi NCR",
    distance: "Regional",
    text: "⚡ Farmers protest route confirmed through NH-24 today 2PM–6PM. Heavy traffic disruption expected across Noida Sectors 62, 63, 137. Crime index elevated +12 pts in affected zones. Alternative route: DND Flyway recommended.",
    hasPhoto: false,
    aiTag: null,
    civicImpact: null,
    upvotes: null,
    comments: 89,
    views: "1.2k",
    lat: 28.614,
    lon: 77.209
  },
  {
    id: "p3",
    type: "CRIME",
    userName: "Priya Mehta",
    userInitials: "PM",
    avatarBg: "#FCEBEB",
    avatarColor: "#A32D2D",
    isVerified: false,
    timeAgo: "1 hr ago",
    area: "Sector 18, Noida",
    distance: "2.1km",
    text: "Two chain snatching incidents near City Centre metro exit last night around 10PM. Women please avoid that stretch after dark. Police complaint filed — ref #DEL2024-8821. Please share so people stay safe.",
    hasPhoto: false,
    aiTag: "Crime report · Verification pending",
    civicImpact: "-5 pts Safety",
    upvotes: 218,
    comments: 44,
    isUpvoted: false,
    lat: 28.57,
    lon: 77.321
  },
  {
    id: "p4",
    type: "ENVIRONMENT",
    userName: "Amit Kumar",
    userInitials: "AK",
    avatarBg: "#EAF3DE",
    avatarColor: "#3B6D11",
    isVerified: true,
    timeAgo: "2 hrs ago",
    area: "Sector 62, Noida",
    distance: "0.8km",
    text: "Illegal garbage dumping behind DLF Mall service road happening daily for 2 weeks. Mosquito breeding ground — 3 dengue cases confirmed nearby this month. BMC complaint lodged 10 days ago, zero response.",
    hasPhoto: true,
    photoCaption: "AI detected: Illegal dumping · Severity: HIGH · Health risk flagged",
    aiTag: "Garbage Dumping · HIGH · Health Risk",
    civicImpact: "-4 pts Environment",
    upvotes: 67,
    comments: 23,
    isUpvoted: false,
    lat: 28.625,
    lon: 77.374
  },
  {
    id: "p5",
    type: "SAFETY",
    userName: "Sunita Rawat",
    userInitials: "SR",
    avatarBg: "#FAEEDA",
    avatarColor: "#854F0B",
    isVerified: true,
    timeAgo: "3 hrs ago",
    area: "Greater Noida West",
    distance: "8km",
    text: "Pedestrian bridge near Gaur City Mall has dangerous missing railings for 2 months. A child nearly fell last week. Corporation has ignored 3 complaints. Posting photos as legal evidence. This needs urgent action.",
    hasPhoto: true,
    photoCaption: "AI detected: Infrastructure hazard · Missing railing · Severity: HIGH",
    aiTag: "Safety Hazard · HIGH",
    civicImpact: "-2 pts Infrastructure",
    upvotes: 143,
    comments: 31,
    isUpvoted: false,
    lat: 28.635,
    lon: 77.431
  },
  {
    id: "p6",
    type: "NEWS",
    userName: "Vikram Patel",
    userInitials: "VP",
    avatarBg: "#EEEDFE",
    avatarColor: "#534AB7",
    isVerified: true,
    timeAgo: "4 hrs ago",
    area: "Noida",
    distance: "City-wide",
    text: "Great news! Noida Authority approved ₹45 crore for road repair across 12 sectors. Work begins next month. Sectors 62, 63, 78 are top priority. Civic score for these areas expected to improve by 8-12 points.",
    hasPhoto: false,
    aiTag: "Policy Update · Positive Impact",
    civicImpact: "+8 pts Infrastructure",
    upvotes: 312,
    comments: 78,
    isUpvoted: false,
    lat: 28.535,
    lon: 77.391
  },
  {
    id: "p7",
    type: "CIVIC",
    userName: "Neha Tiwari",
    userInitials: "NT",
    avatarBg: "#E6F1FB",
    avatarColor: "#185FA5",
    isVerified: true,
    timeAgo: "5 hrs ago",
    area: "Sector 62, Noida",
    distance: "0.6km",
    text: "Water supply disrupted in B-block Sector 62 for the past 48 hours. Jal Board complaint filed — no response. Summer is here and families with kids are suffering. Please escalate.",
    hasPhoto: false,
    aiTag: "Water Supply · CRITICAL",
    civicImpact: "-4 pts Infrastructure",
    upvotes: 89,
    comments: 34,
    isUpvoted: false,
    lat: 28.626,
    lon: 77.372
  },
  {
    id: "p8",
    type: "CRIME",
    userName: "Ravi Shankar",
    userInitials: "RS2",
    avatarBg: "#FCEBEB",
    avatarColor: "#A32D2D",
    isVerified: true,
    timeAgo: "6 hrs ago",
    area: "Delhi",
    distance: "Far",
    text: "Car theft spike in Dwarka Sector 10 — 4 cars stolen this week alone. Police have registered FIRs but no arrests yet. If you live in Dwarka please use steering locks and park in lit areas.",
    hasPhoto: false,
    aiTag: "Crime · Vehicle Theft · HIGH",
    civicImpact: "-6 pts Safety",
    upvotes: 445,
    comments: 92,
    isUpvoted: false,
    lat: 28.592,
    lon: 77.059
  }
];

export const STORIES = [
  { area: "Sec 62", tension: 77, posts: 4, city: "Noida" },
  { area: "Delhi", tension: 82, posts: 12, city: "Delhi" },
  { area: "Mumbai", tension: 45, posts: 6, city: "Mumbai" },
  { area: "Gurugram", tension: 55, posts: 8, city: "Haryana" },
  { area: "Noida W", tension: 71, posts: 5, city: "Noida" },
  { area: "Chennai", tension: 29, posts: 3, city: "Tamil Nadu" }
];

export const AREA_SCORES = {
  "Sector 62, Noida": {
    total: 73,
    infra: 68,
    safety: 74,
    civic: 81,
    tension: 77,
    env: 71,
    govt: 58,
    trend: "UP",
    weeklyChange: 2,
    posts: 847,
    city: "Noida",
    state: "Uttar Pradesh"
  },
  "Sector 18, Noida": {
    total: 69,
    infra: 65,
    safety: 71,
    civic: 78,
    tension: 70,
    env: 68,
    govt: 62,
    trend: "UP",
    weeklyChange: 1,
    posts: 623,
    city: "Noida",
    state: "Uttar Pradesh"
  },
  "Greater Noida West": {
    total: 61,
    infra: 58,
    safety: 63,
    civic: 72,
    tension: 65,
    env: 55,
    govt: 51,
    trend: "DOWN",
    weeklyChange: -1,
    posts: 412,
    city: "Greater Noida",
    state: "Uttar Pradesh"
  },
  "Dwarka, Delhi": {
    total: 55,
    infra: 50,
    safety: 44,
    civic: 65,
    tension: 80,
    env: 48,
    govt: 55,
    trend: "DOWN",
    weeklyChange: -3,
    posts: 934,
    city: "Delhi",
    state: "Delhi"
  },
  "Koramangala, Bangalore": {
    total: 78,
    infra: 80,
    safety: 75,
    civic: 82,
    tension: 45,
    env: 74,
    govt: 77,
    trend: "UP",
    weeklyChange: 3,
    posts: 1203,
    city: "Bangalore",
    state: "Karnataka"
  }
};

export const STATE_SCORES = {
  "Uttar Pradesh": {
    total: 58,
    infra: 52,
    safety: 55,
    civic: 71,
    tension: 77,
    env: 48,
    govt: 45
  },
  Delhi: {
    total: 49,
    infra: 44,
    safety: 38,
    civic: 68,
    tension: 82,
    env: 35,
    govt: 52
  },
  Maharashtra: {
    total: 71,
    infra: 74,
    safety: 69,
    civic: 75,
    tension: 45,
    env: 66,
    govt: 72
  },
  Karnataka: {
    total: 68,
    infra: 70,
    safety: 65,
    civic: 72,
    tension: 61,
    env: 62,
    govt: 68
  },
  "West Bengal": {
    total: 55,
    infra: 51,
    safety: 52,
    civic: 65,
    tension: 68,
    env: 49,
    govt: 50
  },
  "Tamil Nadu": {
    total: 74,
    infra: 76,
    safety: 72,
    civic: 78,
    tension: 29,
    env: 71,
    govt: 74
  },
  Telangana: {
    total: 66,
    infra: 68,
    safety: 63,
    civic: 69,
    tension: 48,
    env: 60,
    govt: 65
  },
  Gujarat: {
    total: 72,
    infra: 74,
    safety: 70,
    civic: 73,
    tension: 41,
    env: 68,
    govt: 71
  },
  Haryana: {
    total: 60,
    infra: 57,
    safety: 56,
    civic: 68,
    tension: 58,
    env: 52,
    govt: 57
  },
  Punjab: {
    total: 57,
    infra: 55,
    safety: 52,
    civic: 63,
    tension: 71,
    env: 50,
    govt: 54
  },
  Kerala: {
    total: 79,
    infra: 80,
    safety: 78,
    civic: 82,
    tension: 27,
    env: 76,
    govt: 80
  },
  Rajasthan: {
    total: 61,
    infra: 58,
    safety: 60,
    civic: 67,
    tension: 55,
    env: 55,
    govt: 58
  }
};

export const LEADERBOARD = [
  {
    rank: 1,
    area: "Sector 62, Noida",
    score: 9840,
    resolution: 91,
    reports: 142,
    trend: "UP"
  },
  {
    rank: 2,
    area: "Koramangala, Bangalore",
    score: 8920,
    resolution: 88,
    reports: 203,
    trend: "UP"
  },
  {
    rank: 3,
    area: "Bandra, Mumbai",
    score: 8210,
    resolution: 85,
    reports: 167,
    trend: "STABLE"
  },
  {
    rank: 4,
    area: "Sector 18, Noida",
    score: 7430,
    resolution: 78,
    reports: 118,
    trend: "UP"
  },
  {
    rank: 5,
    area: "Anna Nagar, Chennai",
    score: 6890,
    resolution: 82,
    reports: 134,
    trend: "UP"
  },
  {
    rank: 6,
    area: "Salt Lake, Kolkata",
    score: 5920,
    resolution: 71,
    reports: 98,
    trend: "DOWN"
  },
  {
    rank: 7,
    area: "Dwarka, Delhi",
    score: 4380,
    resolution: 61,
    reports: 203,
    trend: "DOWN"
  }
];

export const TRENDING_ISSUES = [
  { issue: "Potholes", count: 23, icon: "🚗" },
  { issue: "Water Leak", count: 18, icon: "💧" },
  { issue: "Crime Alert", count: 14, icon: "🚨" },
  { issue: "Garbage", count: 11, icon: "🗑️" },
  { issue: "Broken Lights", count: 8, icon: "💡" }
];

export const MOCK_COMMENTS = {
  p1: [
    {
      user: "Anjali K.",
      text: "This is so frustrating, been reporting the same issue for months!",
      time: "5 min ago"
    },
    {
      user: "Mohit P.",
      text: "I can confirm this — saw it this morning on my commute",
      time: "15 min ago"
    },
    {
      user: "Neha S.",
      text: "Escalated to ward councillor. Let's see if they respond.",
      time: "32 min ago"
    }
  ],
  p3: [
    {
      user: "Deepak R.",
      text: "This area has become unsafe. Authorities need to increase police presence",
      time: "20 min ago"
    },
    {
      user: "Sarah M.",
      text: "Thank you for warning everyone. Please stay safe!",
      time: "40 min ago"
    },
    {
      user: "Vikram S.",
      text: "I live nearby and can corroborate this report",
      time: "45 min ago"
    }
  ]
};

export const ALERT_DATA = [
  { icon: "🔴", text: "NH-24 protest — heavy traffic 2–6PM", time: "22m" },
  { icon: "🟠", text: "Rain alert: drain overload risk +40%", time: "1h" },
  { icon: "🟢", text: "Road repairs begin: Sec 62 roads", time: "2h" }
];

// Utility to detect post type from text
export const detectPostType = (text) => {
  const textLower = text.toLowerCase();
  if (
    textLower.includes("pothole") ||
    textLower.includes("road") ||
    textLower.includes("crack")
  ) {
    return { type: "Pothole", category: "CIVIC" };
  }
  if (
    textLower.includes("crime") ||
    textLower.includes("theft") ||
    textLower.includes("stolen") ||
    textLower.includes("snatch")
  ) {
    return { type: "Crime Report", category: "CRIME" };
  }
  if (
    textLower.includes("garbage") ||
    textLower.includes("dump") ||
    textLower.includes("waste")
  ) {
    return { type: "Garbage", category: "ENVIRONMENT" };
  }
  if (
    textLower.includes("water") ||
    textLower.includes("pipe") ||
    textLower.includes("leak") ||
    textLower.includes("supply")
  ) {
    return { type: "Water Issue", category: "CIVIC" };
  }
  if (
    textLower.includes("light") ||
    textLower.includes("streetlight") ||
    textLower.includes("darkness")
  ) {
    return { type: "Infrastructure", category: "CIVIC" };
  }
  return { type: "Civic Issue", category: "CIVIC" };
};

export const detectSeverity = (text) => {
  const textLower = text.toLowerCase();
  if (
    textLower.includes("urgent") ||
    textLower.includes("critical") ||
    textLower.includes("ambulance") ||
    textLower.includes("hospital") ||
    textLower.includes("danger") ||
    textLower.includes("accident")
  ) {
    return "HIGH";
  }
  return "MEDIUM";
};
