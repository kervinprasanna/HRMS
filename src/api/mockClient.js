const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_EMPLOYEES = [
  { id: 'EMP-2048', name: 'John Doe', role: 'Software Engineer', dept: 'Engineering', status: 'Present', email: 'john@aioninnotech.com', phone: '+1 (555) 123-4567', location: 'Bhubaneswar', manager: 'Banita Maharana', joiningDate: '14-10-2024', type: 'Permanent', maritalStatus: 'Unmarried', address: '1124543212' },
  { id: 'EMP-2049', name: 'Jane Smith', role: 'UI/UX Designer', dept: 'Design', status: 'Present', email: 'jane@aioninnotech.com', phone: '+1 (555) 234-5678', location: 'Remote', manager: 'John Doe', joiningDate: '01-08-2023', type: 'Contract', maritalStatus: 'Married', address: '987654321' },
  { id: 'EMP-2050', name: 'Michael Brown', role: 'Product Manager', dept: 'Product', status: 'Absent', email: 'michael@aioninnotech.com', phone: '+1 (555) 345-6789', location: 'Bhubaneswar', manager: 'Banita Maharana', joiningDate: '15-05-2022', type: 'Permanent', maritalStatus: 'Married', address: '123456789' },
];

export const mockClient = {
  // Auth API
  loginUser: async (email, password) => {
    await delay(1000); // Simulate network latency
    const role = email.toLowerCase().includes('hr') ? 'HR' : 'Employee';
    return {
      id: '1',
      name: role === 'HR' ? 'HR Admin' : 'John Doe',
      email: email,
      role: role
    };
  },

  // Employee API
  fetchEmployees: async () => {
    await delay(800);
    return [...MOCK_EMPLOYEES];
  },

  createEmployee: async (employeeData) => {
    await delay(600);
    return { 
      ...employeeData, 
      id: `EMP-${Math.floor(2000 + Math.random() * 1000)}`, 
      status: 'Present' 
    };
  },

  deleteEmployee: async (id) => {
    await delay(500);
    return true;
  }
};
