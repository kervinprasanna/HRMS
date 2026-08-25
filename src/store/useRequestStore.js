import { create } from 'zustand';

const useRequestStore = create((set) => ({
  requests: [
    { id: 'REQ-001', employeeId: 'EMP-2048', employeeName: 'John Doe', type: 'Sick Leave', description: 'Feeling unwell, have a fever.', status: 'Pending', date: '2024-03-10' },
    { id: 'REQ-002', employeeId: 'EMP-2049', employeeName: 'Jane Smith', type: 'Vacation', description: 'Family trip to Hawaii.', status: 'Approved', date: '2024-03-08' },
    { id: 'REQ-003', employeeId: 'EMP-2050', employeeName: 'Michael Brown', type: 'Work From Home', description: 'Plumbing issues at apartment.', status: 'Rejected', date: '2024-03-05' },
  ],
  addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),
  updateRequestStatus: (id, newStatus, remark) => set((state) => ({
    requests: state.requests.map(req => 
      req.id === id ? { ...req, status: newStatus, remark: remark } : req
    )
  })),
}));

export default useRequestStore;
