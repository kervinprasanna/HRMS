import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null, // { id, name, role: 'HR' | 'Employee', email }
  isAuthenticated: false,
  
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;
