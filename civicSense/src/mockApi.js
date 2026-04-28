// Mock API data and functions
// This will be replaced with real API calls later

export const STATE_TENSION = {
  'Delhi': 82,
  'Uttar Pradesh': 75,
  'Maharashtra': 45,
  'Karnataka': 61,
  'West Bengal': 68,
  'Tamil Nadu': 29,
  'Telangana': 48,
  'Rajasthan': 55,
  'Gujarat': 41,
  'Haryana': 58,
  'Punjab': 71,
  'Madhya Pradesh': 39,
  'Bihar': 66,
  'Odisha': 33,
  'Kerala': 27,
}

export const CITY_DATA = [
  { id: 'delhi', name: 'Delhi', lat: 28.7041, lon: 77.1025, tension: 85 },
  { id: 'noida', name: 'Noida', lat: 28.5355, lon: 77.3910, tension: 72 },
  { id: 'greater-noida', name: 'Greater Noida', lat: 28.4744, lon: 77.5036, tension: 68 },
  { id: 'ghaziabad', name: 'Ghaziabad', lat: 28.6692, lon: 77.4538, tension: 61 },
  { id: 'faridabad', name: 'Faridabad', lat: 28.4089, lon: 77.3178, tension: 54 },
]

export const MOCK_COMPLAINTS = [
  {
    id: 'CS-001',
    issueType: 'Pothole',
    state: 'Uttar Pradesh',
    city: 'Noida',
    latitude: 28.627,
    longitude: 77.371,
    priority: 'CRITICAL',
    status: 'PENDING',
    citizenName: 'Rahul S.',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    description: 'Large pothole blocking hospital gate',
    upvoteCount: 34,
    tensionScore: 77,
    imageUrl: 'https://via.placeholder.com/400x300?text=Pothole',
  },
  {
    id: 'CS-002',
    issueType: 'Garbage Overflow',
    state: 'Delhi',
    city: 'Dwarka',
    latitude: 28.592,
    longitude: 77.059,
    priority: 'CRITICAL',
    status: 'PENDING',
    citizenName: 'Priya M.',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    description: 'Overflowing bins near market for 3 days',
    upvoteCount: 41,
    tensionScore: 82,
    imageUrl: 'https://via.placeholder.com/400x300?text=Garbage',
  },
  {
    id: 'CS-003',
    issueType: 'Water Leak',
    state: 'Uttar Pradesh',
    city: 'Noida',
    latitude: 28.570,
    longitude: 77.321,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    citizenName: 'Amit K.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    description: 'Burst pipe flooding the main road',
    upvoteCount: 27,
    tensionScore: 77,
    imageUrl: 'https://via.placeholder.com/400x300?text=Water+Leak',
  },
  {
    id: 'CS-004',
    issueType: 'Broken Light',
    state: 'Haryana',
    city: 'Gurgaon',
    latitude: 28.459,
    longitude: 77.026,
    priority: 'HIGH',
    status: 'PENDING',
    citizenName: 'Sunita R.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: 'Streetlight out near metro — night safety risk',
    upvoteCount: 18,
    tensionScore: 55,
    imageUrl: 'https://via.placeholder.com/400x300?text=Broken+Light',
  },
  {
    id: 'CS-005',
    issueType: 'Road Damage',
    state: 'Karnataka',
    city: 'Bangalore',
    latitude: 12.934,
    longitude: 77.624,
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    citizenName: 'Vikram P.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    description: 'Deep cracks on main road after rain',
    upvoteCount: 12,
    tensionScore: 61,
    imageUrl: 'https://via.placeholder.com/400x300?text=Road+Damage',
  },
  {
    id: 'CS-006',
    issueType: 'Drainage Block',
    state: 'Uttar Pradesh',
    city: 'Noida',
    latitude: 28.625,
    longitude: 77.374,
    priority: 'HIGH',
    status: 'PENDING',
    citizenName: 'Neha T.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    description: 'Blocked drain causing waterlogging near school',
    upvoteCount: 22,
    tensionScore: 77,
    imageUrl: 'https://via.placeholder.com/400x300?text=Drainage',
  },
  {
    id: 'CS-007',
    issueType: 'Pothole',
    state: 'Maharashtra',
    city: 'Mumbai',
    latitude: 19.119,
    longitude: 72.847,
    priority: 'MEDIUM',
    status: 'RESOLVED',
    citizenName: 'Raj M.',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    description: 'Pothole on SV Road near station',
    upvoteCount: 9,
    tensionScore: 45,
    imageUrl: 'https://via.placeholder.com/400x300?text=Pothole',
  },
  {
    id: 'CS-008',
    issueType: 'Sewage Leak',
    state: 'West Bengal',
    city: 'Kolkata',
    latitude: 22.572,
    longitude: 88.363,
    priority: 'CRITICAL',
    status: 'PENDING',
    citizenName: 'Ananya B.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    description: 'Sewage overflowing onto residential road',
    upvoteCount: 38,
    tensionScore: 68,
    imageUrl: 'https://via.placeholder.com/400x300?text=Sewage',
  },
  {
    id: 'CS-009',
    issueType: 'Fallen Tree',
    state: 'Punjab',
    city: 'Amritsar',
    latitude: 31.634,
    longitude: 74.872,
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    citizenName: 'Gurpreet S.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    description: 'Large tree blocking main road after storm',
    upvoteCount: 15,
    tensionScore: 71,
    imageUrl: 'https://via.placeholder.com/400x300?text=Tree+Down',
  },
]

export const LEADERBOARD_DATA = [
  { rank: 1, zone: 'Delhi', score: 98, reports: 24, change: '+6.4%' },
  { rank: 2, zone: 'Noida', score: 91, reports: 18, change: '+4.2%' },
  { rank: 3, zone: 'Greater Noida', score: 89, reports: 14, change: '+3.1%' },
  { rank: 4, zone: 'Ghaziabad', score: 84, reports: 11, change: '+1.8%' },
  { rank: 5, zone: 'Faridabad', score: 79, reports: 9, change: '+0.9%' },
]

export const mockApi = {
  // Get all complaints
  async getComplaints() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_COMPLAINTS), 500)
    })
  },

  // Get complaint by ID
  async getComplaintById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaint = MOCK_COMPLAINTS.find((c) => c.id === id)
        if (complaint) {
          resolve(complaint)
        } else {
          reject(new Error('Complaint not found'))
        }
      }, 300)
    })
  },

  // Get nearby complaints
  async getNearbyComplaints(latitude, longitude, radius = 5) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nearby = MOCK_COMPLAINTS.filter((complaint) => {
          const distance = Math.sqrt(
            Math.pow(complaint.latitude - latitude, 2) +
              Math.pow(complaint.longitude - longitude, 2)
          )
          return distance * 111 < radius
        })
        resolve(nearby)
      }, 300)
    })
  },

  // Submit complaint
  async submitComplaint(formData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComplaint = {
          id: Math.random().toString(36).substr(2, 9),
          ...formData,
          status: 'PENDING',
          upvoteCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        MOCK_COMPLAINTS.push(newComplaint)
        resolve(newComplaint)
      }, 1000)
    })
  },

  // Upvote complaint
  async upvoteComplaint(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaint = MOCK_COMPLAINTS.find((c) => c.id === id)
        if (complaint) {
          complaint.upvoteCount += 1
          resolve(complaint)
        } else {
          reject(new Error('Complaint not found'))
        }
      }, 200)
    })
  },

  // Update complaint status
  async updateComplaintStatus(id, status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const complaint = MOCK_COMPLAINTS.find((c) => c.id === id)
        if (complaint) {
          complaint.status = status
          complaint.updatedAt = new Date().toISOString()
          resolve(complaint)
        } else {
          reject(new Error('Complaint not found'))
        }
      }, 200)
    })
  },

  // Analyze image (mock AI)
  async analyzeImage(imageFile, latitude, longitude, zoneType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const issueTypes = ['Pothole', 'Garbage', 'Water Leak', 'Broken Light', 'Road Damage', 'Flooding']
        const randomIssue = issueTypes[Math.floor(Math.random() * issueTypes.length)]
        const tensorScore = Math.random() * 100
        const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]

        resolve({
          issueType: randomIssue,
          confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
          tensionScore: tensorScore.toFixed(1),
          priority: randomPriority,
        })
      }, 2000)
    })
  },

  // Get stats
  async getStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalComplaints: MOCK_COMPLAINTS.length,
          priorityDistribution: {
            CRITICAL: MOCK_COMPLAINTS.filter((c) => c.priority === 'CRITICAL').length,
            HIGH: MOCK_COMPLAINTS.filter((c) => c.priority === 'HIGH').length,
            MEDIUM: MOCK_COMPLAINTS.filter((c) => c.priority === 'MEDIUM').length,
            LOW: MOCK_COMPLAINTS.filter((c) => c.priority === 'LOW').length,
          },
          statusDistribution: {
            PENDING: MOCK_COMPLAINTS.filter((c) => c.status === 'PENDING').length,
            IN_PROGRESS: MOCK_COMPLAINTS.filter((c) => c.status === 'IN_PROGRESS').length,
            RESOLVED: MOCK_COMPLAINTS.filter((c) => c.status === 'RESOLVED').length,
          },
        }
        resolve(stats)
      }, 300)
    })
  },

  // Get leaderboard
  async getLeaderboard() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(LEADERBOARD_DATA)
      }, 300)
    })
  },
}
