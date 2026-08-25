import { create } from 'zustand';

const useRecruitmentStore = create((set) => ({
  jobs: [
    { id: 'JOB-01', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', applicants: 12, status: 'Open' },
    { id: 'JOB-02', title: 'Product Marketing Manager', department: 'Marketing', location: 'New York', applicants: 5, status: 'Open' },
  ],
  candidates: [
    { id: 'CAN-101', jobId: 'JOB-01', name: 'Alice Walker', role: 'Senior Frontend Engineer', experience: '5 Years', status: 'Interview', dateApplied: '2024-03-01', phone: '+1 555-0101', email: 'alice@example.com' },
    { id: 'CAN-102', jobId: 'JOB-01', name: 'Bob Smith', role: 'Senior Frontend Engineer', experience: '3 Years', status: 'Shortlisted', dateApplied: '2024-03-05', phone: '+1 555-0202', email: 'bob@example.com' },
    { id: 'CAN-103', jobId: 'JOB-02', name: 'Charlie Davis', role: 'Product Marketing Manager', experience: '7 Years', status: 'Applied', dateApplied: '2024-03-10', phone: '+1 555-0303', email: 'charlie@example.com' },
  ],
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateCandidateStatus: (id, newStatus) => set((state) => ({
    candidates: state.candidates.map(c => c.id === id ? { ...c, status: newStatus } : c)
  }))
}));

export default useRecruitmentStore;
