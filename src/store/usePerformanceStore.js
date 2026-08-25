import { create } from 'zustand';

// Mock initial data
const MOCK_REVIEWS = [
  { id: 'REV-001', employeeId: 'EMP-2048', date: '2024-03-01', score: 85, feedback: 'Great performance this quarter. Keep up the good work.' },
  { id: 'REV-002', employeeId: 'EMP-2048', date: '2023-12-01', score: 78, feedback: 'Solid work, but needs to improve communication.' }
];

const MOCK_GOALS = [
  { id: 'GOAL-001', employeeId: 'EMP-2048', title: 'Complete React Native Certification', progress: 75, status: 'In Progress' },
  { id: 'GOAL-002', employeeId: 'EMP-2048', title: 'Lead 3 Project Meetings', progress: 100, status: 'Completed' }
];

const MOCK_ACHIEVEMENTS = [
  { id: 'ACH-001', employeeId: 'EMP-2048', title: 'Employee of the Month', date: '2024-02-15' },
  { id: 'ACH-002', employeeId: 'EMP-2048', title: 'Spot Award - Client Delivery', date: '2023-11-20' }
];

// Helper to calculate current score
const calculateCurrentScore = (employeeId, reviews) => {
  const empReviews = reviews.filter(r => r.employeeId === employeeId).sort((a, b) => new Date(b.date) - new Date(a.date));
  return empReviews.length > 0 ? empReviews[0].score : 0;
};

const usePerformanceStore = create((set, get) => ({
  reviews: MOCK_REVIEWS,
  goals: MOCK_GOALS,
  achievements: MOCK_ACHIEVEMENTS,

  getEmployeeScore: (employeeId) => calculateCurrentScore(employeeId, get().reviews),
  
  addReview: (review) => set((state) => ({
    reviews: [{
      id: `REV-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      ...review
    }, ...state.reviews]
  })),

  addGoal: (goal) => set((state) => ({
    goals: [{
      id: `GOAL-${Math.floor(100 + Math.random() * 900)}`,
      progress: 0,
      status: 'Not Started',
      ...goal
    }, ...state.goals]
  })),

  updateGoalProgress: (id, progress) => set((state) => ({
    goals: state.goals.map(g => 
      g.id === id ? { ...g, progress, status: progress === 100 ? 'Completed' : 'In Progress' } : g
    )
  })),

  addAchievement: (achievement) => set((state) => ({
    achievements: [{
      id: `ACH-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      ...achievement
    }, ...state.achievements]
  }))
}));

export default usePerformanceStore;
