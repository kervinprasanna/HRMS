import { create } from 'zustand';

const useAttendanceStore = create((set, get) => ({
  attendanceRecords: [
    { id: 'ATT-001', employeeId: 'EMP-2048', employeeName: 'John Doe', date: '2024-03-10', checkIn: '09:02 AM', checkOut: '05:15 PM', status: 'Present', hours: '8h 13m' },
    { id: 'ATT-002', employeeId: 'EMP-2048', employeeName: 'John Doe', date: '2024-03-09', checkIn: '08:55 AM', checkOut: '05:00 PM', status: 'Present', hours: '8h 5m' },
    { id: 'ATT-003', employeeId: 'EMP-2048', employeeName: 'John Doe', date: '2024-03-08', checkIn: null, checkOut: null, status: 'Absent', hours: '0h 0m' },
  ],
  todayStatus: {
    checkIn: null,
    checkOut: null,
    isActive: false,
  },
  checkIn: () => set((state) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      todayStatus: { ...state.todayStatus, checkIn: time, isActive: true }
    };
  }),
  checkOut: () => set((state) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      todayStatus: { ...state.todayStatus, checkOut: time, isActive: false }
    };
  })
}));

export default useAttendanceStore;
