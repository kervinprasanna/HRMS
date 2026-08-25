import { create } from 'zustand';

const useAssetStore = create((set) => ({
  assets: [
    { id: 'AST-001', name: 'MacBook Pro 14"', type: 'Laptop', assignedTo: 'EMP-2048', assignedName: 'John Doe', status: 'Assigned', history: [{ date: '2024-01-15', action: 'Assigned to John Doe' }] },
    { id: 'AST-002', name: 'Dell UltraSharp Monitor', type: 'Accessories', assignedTo: null, assignedName: null, status: 'Available', history: [{ date: '2024-02-10', action: 'Added to inventory' }] },
    { id: 'AST-003', name: 'iPhone 13', type: 'Mobile', assignedTo: 'EMP-2049', assignedName: 'Jane Smith', status: 'Assigned', history: [{ date: '2024-03-01', action: 'Assigned to Jane Smith' }] },
  ],
  addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),
  updateAssetStatus: (id, newStatus, empId, empName, actionStr) => set((state) => ({
    assets: state.assets.map(a => {
      if (a.id === id) {
        return { 
          ...a, 
          status: newStatus, 
          assignedTo: empId, 
          assignedName: empName,
          history: [{ date: new Date().toISOString().split('T')[0], action: actionStr }, ...a.history] 
        };
      }
      return a;
    })
  }))
}));

export default useAssetStore;
