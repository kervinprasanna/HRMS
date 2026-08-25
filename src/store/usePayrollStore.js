import { create } from 'zustand';

// Pre-populate some history for EMP-2048 (John Doe)
const INITIAL_PAYSLIPS = [
  { 
    id: 'PAY-003', 
    employeeId: 'EMP-2048',
    month: 'March 2024', 
    earnings: { basic: 3000, hra: 1000, allowance: 1240 },
    deductions: { tax: 0, pf: 0, other: 0 },
    net: '₹5,240.00', 
    status: 'Paid', 
    date: 'Mar 31, 2024' 
  },
  { 
    id: 'PAY-002', 
    employeeId: 'EMP-2048',
    month: 'February 2024', 
    earnings: { basic: 3000, hra: 1000, allowance: 1240 },
    deductions: { tax: 0, pf: 0, other: 0 },
    net: '₹5,240.00', 
    status: 'Paid', 
    date: 'Feb 28, 2024' 
  },
];

const usePayrollStore = create((set) => ({
  payslips: INITIAL_PAYSLIPS,
  
  addPayslip: (payslip) => set((state) => ({
    payslips: [{ ...payslip, id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Paid', date: new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) }, ...state.payslips]
  })),

  getPayslipsByEmployee: (employeeId) => (state) => {
    return state.payslips.filter(p => p.employeeId === employeeId);
  }
}));

export default usePayrollStore;
