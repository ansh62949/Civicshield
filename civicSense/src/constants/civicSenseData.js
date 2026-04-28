/**
 * CivicSense Mock Data
 * All data is hardcoded for the demo
 */

// Mock feed posts - Instagram-style social feed
export const FEED_POSTS = [
  {
    id: 1,
    type: "CIVIC",
    user: "Rahul Sharma",
    avatar: "RS",
    avatarBg: "#FAEEDA",
    avatarColor: "#854F0B",
    verified: true,
    time: "8 min ago",
    area: "Sector 62, Noida",
    distance: "0.3km",
    text: "Large pothole outside Apollo Hospital gate. Ambulances struggling to pass. Third report this week — NMMC still no action. This is a life safety issue.",
    hasPhoto: true,
    photoLabel: "Pothole photo — AI: Pothole detected · Severity: CRITICAL · Location verified ✓",
    civicImpact: "-3 pts",
    upvotes: 34,
    comments: 12,
    aiTag: "Pothole · CRITICAL"
  },
  {
    id: 2,
    type: "GEO_ALERT",
    user: "GeoTrade AI",
    avatar: "GT",
    avatarBg: "#0f172a",
    avatarColor: "#1D9E75",
    verified: true,
    time: "22 min ago",
    area: "Delhi NCR",
    distance: "regional",
    text: "Farmers protest route passes through NH-24 today 2–6PM. Expect heavy traffic disruption across Noida sectors 62, 63, 137. Crime index elevated +12 pts in affected zones. Recommend alternate routes via Expressway.",
    hasPhoto: false,
    civicImpact: null,
    upvotes: null,
    comments: 89,
    aiTag: null,
    views: "1.2k"
  },
  {
    id: 3,
    type: "CRIME",
    user: "Priya Mehta",
    avatar: "PM",
    avatarBg: "#FCEBEB",
    avatarColor: "#A32D2D",
    verified: false,
    time: "1 hr ago",
    area: "Sector 18, Noida",
    distance: "2.1km",
    text: "Two chain snatching incidents reported near City Centre metro exit last night around 10PM. Women please avoid that stretch after dark. Police complaint filed — ref #DEL2024-8821. Stay safe everyone.",
    hasPhoto: false,
    civicImpact: "-5 pts Safety",
    upvotes: 218,
    comments: 44,
    aiTag: "Crime report · Verification pending"
  },
  {
    id: 4,
    type: "ENVIRONMENT",
    user: "Amit Kumar",
    avatar: "AK",
    avatarBg: "#EAF3DE",
    avatarColor: "#3B6D11",
    verified: true,
    time: "2 hrs ago",
    area: "Sector 62, Noida",
    distance: "0.8km",
    text: "Illegal garbage dumping happening daily behind the DLF mall service road. Mosquito breeding ground. Multiple dengue cases in the area this month. BMC complaint lodged but no response in 10 days.",
    hasPhoto: true,
    photoLabel: "Garbage dump — AI: Illegal dumping · Severity: HIGH · Health risk detected",
    civicImpact: "-4 pts Environment",
    upvotes: 67,
    comments: 23,
    aiTag: "Garbage · HIGH · Health Risk"
  },
  {
    id: 5,
    type: "SAFETY",
    user: "Sunita Rawat",
    avatar: "SR",
    avatarBg: "#FAEEDA",
    avatarColor: "#854F0B",
    verified: true,
    time: "3 hrs ago",
    area: "Greater Noida West",
    distance: "8km",
    text: "The pedestrian bridge near Gaur City mall has dangerous missing railings for 2 months now. Kids nearly fell last week. Posting photos as evidence. Corporation please take immediate action.",
    hasPhoto: true,
    photoLabel: "Bridge photo — AI: Infrastructure hazard · Missing railing · Severity: HIGH",
    civicImpact: "-2 pts Infrastructure",
    upvotes: 143,
    comments: 31,
    aiTag: "Safety Hazard · HIGH"
  },
  {
    id: 6,
    type: "NEWS",
    user: "Vikram Patel",
    avatar: "VP",
    avatarBg: "#EEEDFE",
    avatarColor: "#534AB7",
    verified: true,
    time: "4 hrs ago",
    area: "Noida",
    distance: "city-wide",
    text: "Great news — Noida Authority has approved ₹45 crore for road repair across 12 sectors. Work begins next month. Sectors 62, 63, 78 are priority. Civic score expected to improve by 8-12 points.",
    hasPhoto: false,
    civicImpact: "+8 pts Infrastructure",
    upvotes: 312,
    comments: 78,
    aiTag: "Policy · Positive"
  }
];

// Area story circles for Stories row
export const AREA_STORIES = [
  { area: "Sec 62", tension: 77, posts: 4 },
  { area: "Delhi", tension: 82, posts: 12 },
  { area: "Mumbai", tension: 45, posts: 6 },
  { area: "Gurugram", tension: 55, posts: 8 },
  { area: "Noida W", tension: 71, posts: 5 },
  { area: "Chennai", tension: 29, posts: 3 }
];

// Feed filter options
export const FEED_FILTERS = [
  { id: "all", label: "All", icon: "" },
  { id: "critical", label: "🔴 Critical", icon: "🔴" },
  { id: "safety", label: "⚠ Safety", icon: "⚠" },
  { id: "crime", label: "🚨 Crime", icon: "🚨" },
  { id: "geo", label: "🌍 Geo News", icon: "🌍" },
  { id: "civic", label: "🏗 Civic", icon: "🏗" },
  { id: "environment", label: "🌿 Environment", icon: "🌿" }
];

// State civic scores for globe
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
  Rajasthan: {
    total: 61,
    infra: 58,
    safety: 60,
    civic: 67,
    tension: 55,
    env: 55,
    govt: 58
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
  }
};

// Current area data (Sector 62, Noida)
export const CURRENT_AREA_DATA = {
  name: "Sector 62, Noida",
  score: 73,
  trend: 2,
  trendPeriod: "this week",
  subscores: {
    infrastructure: 68,
    safety: 74,
    civicEngagement: 81,
    geoTension: 23,
    environment: 71,
    govtResponse: 58
  },
  scoreTrend: [65, 67, 70, 68, 71, 73],
  monthLabels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  properties: {
    crimeRate: { label: "Crime Rate", value: "Low", status: "good" },
    floodRisk: { label: "Flood Risk", value: "Medium", status: "moderate" },
    roadQuality: { label: "Road Quality", value: "Good", status: "good" },
    waterSupply: { label: "Water Supply", value: "95%", status: "good" },
    geoTension: { label: "Geo-Tension", value: "High", status: "poor" },
    civicScore: { label: "Civic Score", value: "A+", status: "good" }
  },
  comparisons: [
    "Safer than 68% of Noida",
    "Score ↑4 pts this month",
    "3 flood complaints active"
  ],
  aiInsight:
    "Sector 62 is a good choice for property investment. Strong civic engagement suggests issues get reported and resolved faster than surrounding areas. Key risk: elevated geo-tension may affect property value during political events. Recommend checking again post-election season."
};

// User profile mock data
export const CURRENT_USER = {
  name: "Rahul Sharma",
  area: "Sector 62, Noida",
  avatar: "RS",
  avatarBg: "#FAEEDA",
  avatarColor: "#854F0B",
  posts: 12,
  upvotesReceived: 284,
  civicPoints: 1840,
  verified: true,
  contributionScore: 4,
  contributionPeriod: "this month",
  badges: ["Street Guardian", "First Reporter"],
  userPosts: FEED_POSTS.slice(0, 4) // Use first 4 posts as user's posts
};

// Right sidebar data
export const RIGHT_SIDEBAR_DATA = {
  areaScoreWidget: {
    area: "Sector 62",
    score: 73,
    status: "Good",
    trend: "↑",
    subscores: [
      { label: "Infrastructure", value: 68 },
      { label: "Safety", value: 74 },
      { label: "Engagement", value: 81 },
      { label: "Geo-Tension", value: 23 }
    ]
  },
  alerts: [
    { id: 1, dot: "🔴", text: "Protest route: NH-24 affected 2–6PM", time: "22m" },
    {
      id: 2,
      dot: "🟠",
      text: "Heavy rain alert: drain complaints up 40%",
      time: "1h"
    },
    {
      id: 3,
      dot: "🟡",
      text: "Maintenance crew deployed: Sector 62 roads",
      time: "2h"
    }
  ],
  leaderboard: [
    { rank: 1, area: "Kerala", score: 79, trend: "↑" },
    { rank: 2, area: "Tamil Nadu", score: 74, trend: "↑" },
    { rank: 3, area: "Maharashtra", score: 71, trend: "→" },
    { rank: 4, area: "Gujarat", score: 72, trend: "↑" },
    { rank: 5, area: "Bangalore", score: 68, trend: "↓" }
  ],
  trendingIssues: [
    { topic: "Potholes", count: 23 },
    { topic: "Water Leak", count: 18 },
    { topic: "Crime", count: 14 },
    { topic: "Garbage", count: 11 },
    { topic: "Lighting", count: 8 }
  ]
};

/**
 * CivicSense Score Calculation Logic
 * (Documented but not implemented - for reference)
 *
 * function calculateCivicScore(posts, area) {
 *   // Each post type affects specific sub-scores:
 *   // - CIVIC posts → infrastructure score (negative if complaint, positive if resolved)
 *   // - CRIME posts → safety score (negative)
 *   // - ENVIRONMENT posts → environment score (negative)
 *   // - NEWS posts (positive) → civic engagement (positive)
 *   // - Upvotes amplify impact (more upvotes = more score change)
 *   // - AI verified posts have 2x weight
 *   // - Government response → govt score (positive when resolved fast)
 *   // - Score range: 0-100, weighted average of 6 sub-scores
 *   // - Geo-tension from GeoTrade NLP (inverted: high tension = low score contribution)
 * }
 */

// Map post type to badge class
export const getPostTypeBadge = (type) => {
  const badges = {
    CIVIC: "badge-civic",
    SAFETY: "badge-safety",
    CRIME: "badge-crime",
    ENVIRONMENT: "badge-environment",
    NEWS: "badge-news",
    GEO_ALERT: "badge-geo-alert"
  };
  return badges[type] || "badge-civic";
};

// Get score color based on value
export const getScoreColor = (score) => {
  if (score > 70) return "good";
  if (score >= 50) return "moderate";
  return "poor";
};

// Get tension ring color for stories
export const getTensionRingColor = (tension) => {
  if (tension > 70) return "rgba(226, 75, 74, 0.8)"; // red
  if (tension >= 40) return "rgba(239, 159, 39, 0.8)"; // orange
  return "rgba(29, 158, 117, 0.8)"; // teal
};
