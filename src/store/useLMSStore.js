import { create } from 'zustand';

// Mock initial data
const MOCK_COURSES = [
  { id: 'C-001', title: 'Cybersecurity Fundamentals', duration: '2h 30m', modules: 5 },
  { id: 'C-002', title: 'Workplace Etiquette', duration: '1h 15m', modules: 3 },
  { id: 'C-003', title: 'Advanced React Native', duration: '5h 00m', modules: 10 }
];

const MOCK_ENROLLMENTS = [
  { employeeId: 'EMP-2048', courseId: 'C-002', progress: 40, status: 'In Progress' },
  { employeeId: 'EMP-2048', courseId: 'C-003', progress: 100, status: 'Completed' }
];

const MOCK_ANNOUNCEMENTS = [
  { id: 'ANN-001', title: 'Q3 Townhall Meeting', date: 'Oct 15, 2024', content: 'Join us for the Q3 townhall where we will discuss company growth and upcoming projects.' },
  { id: 'ANN-002', title: 'New Office Policy', date: 'Oct 01, 2024', content: 'Please review the updated office dress code policy on the company portal.' }
];

const MOCK_POLLS = [
  { 
    id: 'POLL-001', 
    question: 'Where should we go for the next team building event?', 
    options: [
      { id: 'O-1', text: 'Beach Resort', votes: 12 },
      { id: 'O-2', text: 'Mountain Cabin', votes: 8 },
      { id: 'O-3', text: 'City Escape Room', votes: 4 }
    ],
    voted: false
  }
];

const useLMSStore = create((set, get) => ({
  courses: MOCK_COURSES,
  enrollments: MOCK_ENROLLMENTS,
  announcements: MOCK_ANNOUNCEMENTS,
  polls: MOCK_POLLS,

  enrollCourse: (courseId, employeeId) => set((state) => ({
    enrollments: [...state.enrollments, { employeeId, courseId, progress: 0, status: 'In Progress' }]
  })),

  updateCourseProgress: (courseId, employeeId, progress) => set((state) => ({
    enrollments: state.enrollments.map(e => 
      (e.courseId === courseId && e.employeeId === employeeId) 
        ? { ...e, progress, status: progress === 100 ? 'Completed' : 'In Progress' } 
        : e
    )
  })),

  addAnnouncement: (ann) => set((state) => ({
    announcements: [{
      id: `ANN-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...ann
    }, ...state.announcements]
  })),

  addPoll: (poll) => set((state) => ({
    polls: [{
      id: `POLL-${Math.floor(100 + Math.random() * 900)}`,
      options: poll.options.map((text, i) => ({ id: `O-${i+1}`, text, votes: 0 })),
      voted: false,
      ...poll
    }, ...state.polls]
  })),

  votePoll: (pollId, optionId) => set((state) => ({
    polls: state.polls.map(p => {
      if (p.id === pollId && !p.voted) {
        return {
          ...p,
          voted: true,
          options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        };
      }
      return p;
    })
  }))
}));

export default useLMSStore;
