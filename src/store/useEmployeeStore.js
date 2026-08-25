import { create } from 'zustand';
import { mockClient } from '../api/mockClient';

const useEmployeeStore = create((set) => ({
  employees: [],
  isLoading: false,

  fetchEmployees: async () => {
    set({ isLoading: true });
    try {
      const data = await mockClient.fetchEmployees();
      set({ employees: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },
  
  addEmployee: async (employee) => {
    set({ isLoading: true });
    try {
      const newEmp = await mockClient.createEmployee(employee);
      set((state) => ({
        employees: [...state.employees, newEmp],
        isLoading: false
      }));
    } catch (e) {
      set({ isLoading: false });
    }
  },
  
  updateEmployee: (id, updatedData) => set((state) => ({
    employees: state.employees.map(emp => 
      emp.id === id ? { ...emp, ...updatedData } : emp
    )
  })),

  deleteEmployee: async (id) => {
    set({ isLoading: true });
    try {
      await mockClient.deleteEmployee(id);
      set((state) => ({
        employees: state.employees.filter(emp => emp.id !== id),
        isLoading: false
      }));
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));

export default useEmployeeStore;
