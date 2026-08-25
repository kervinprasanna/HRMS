import { create } from 'zustand';

// Mock initial data
const MOCK_DOCS = [
  {
    id: 'DOC-001',
    employeeId: 'EMP-2048',
    employeeName: 'John Doe',
    name: 'Aadhaar Card',
    type: 'ID Proof',
    uploadDate: '2024-03-01',
    status: 'Approved',
    fileUri: 'mock/path/aadhaar.pdf'
  },
  {
    id: 'DOC-002',
    employeeId: 'EMP-2048',
    employeeName: 'John Doe',
    name: 'B.Tech Degree',
    type: 'Qualification',
    uploadDate: '2024-03-05',
    status: 'Pending',
    fileUri: 'mock/path/degree.pdf'
  },
  {
    id: 'DOC-003',
    employeeId: 'EMP-2049',
    employeeName: 'Jane Smith',
    name: 'Offer Letter Signed',
    type: 'Employment',
    uploadDate: '2024-02-15',
    status: 'Approved',
    fileUri: 'mock/path/offer.pdf'
  }
];

const useDocumentStore = create((set, get) => ({
  documents: MOCK_DOCS,
  
  addDocument: (doc) => set((state) => {
    const newDoc = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...doc
    };
    return { documents: [...state.documents, newDoc] };
  }),

  updateDocumentStatus: (id, newStatus) => set((state) => ({
    documents: state.documents.map(doc => 
      doc.id === id ? { ...doc, status: newStatus } : doc
    )
  })),

  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== id)
  }))
}));

export default useDocumentStore;
