// Mock data for demo purposes
export const mockUser = {
  uid: 'demo-user-1',
  name: 'John Smith',
  email: 'john@workshop.com',
  role: 'owner'
};

export const mockProducts = [
  {
    id: '1',
    name: 'Brake Pads',
    type: 'part',
    category: 'Brakes',
    quantity: 25,
    unitPrice: 45.99,
    minStock: 5,
    brand: 'Bosch',
    description: 'High-quality ceramic brake pads',
    lastUpdatedBy: 'demo-user-1',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Engine Oil',
    type: 'part',
    category: 'Engine',
    quantity: 3,
    unitPrice: 29.99,
    minStock: 5,
    brand: 'Mobil 1',
    description: '5W-30 Synthetic Motor Oil',
    lastUpdatedBy: 'demo-user-1',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Air Filter',
    type: 'part',
    category: 'Engine',
    quantity: 15,
    unitPrice: 19.99,
    minStock: 10,
    brand: 'K&N',
    description: 'High-flow air filter',
    lastUpdatedBy: 'demo-user-1',
    createdAt: new Date('2024-01-12'),
  }
];

export const mockJobCards = [
  {
    id: 'JC001',
    customerName: 'Alice Johnson',
    customerPhone: '+1-555-0123',
    vehicleNumber: 'ABC-123',
    vehicleModel: '2020 Honda Civic',
    issueDescription: 'Brake noise and vibration when stopping',
    partsUsed: [
      {
        productId: '1',
        productName: 'Brake Pads',
        quantity: 1,
        unitPrice: 45.99,
        totalPrice: 45.99
      }
    ],
    servicesProvided: ['Brake inspection', 'Brake pad replacement'],
    laborCost: 120.00,
    totalAmount: 165.99,
    status: 'completed',
    createdBy: 'demo-user-1',
    notes: 'Customer reported grinding noise. Replaced front brake pads.',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'JC002',
    customerName: 'Bob Wilson',
    customerPhone: '+1-555-0456',
    vehicleNumber: 'XYZ-789',
    vehicleModel: '2019 Toyota Camry',
    issueDescription: 'Oil change and general inspection',
    partsUsed: [
      {
        productId: '2',
        productName: 'Engine Oil',
        quantity: 1,
        unitPrice: 29.99,
        totalPrice: 29.99
      }
    ],
    servicesProvided: ['Oil change', 'Multi-point inspection'],
    laborCost: 50.00,
    totalAmount: 79.99,
    status: 'pending',
    createdBy: 'demo-user-1',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  }
];

export const mockInvoices = [
  {
    id: 'INV001',
    jobCardId: 'JC001',
    invoiceNumber: 'INV-2024-001',
    customerName: 'Alice Johnson',
    customerPhone: '+1-555-0123',
    vehicleNumber: 'ABC-123',
    items: [
      {
        description: 'Brake Pads',
        quantity: 1,
        unitPrice: 45.99,
        totalPrice: 45.99
      },
      {
        description: 'Labor',
        quantity: 1,
        unitPrice: 120.00,
        totalPrice: 120.00
      }
    ],
    subtotal: 165.99,
    taxAmount: 13.28,
    totalAmount: 179.27,
    generatedBy: 'demo-user-1',
    status: 'paid',
    createdAt: new Date('2024-01-20'),
    dueDate: new Date('2024-02-19'),
  }
];

export const mockActivityLogs = [
  {
    id: '1',
    userId: 'demo-user-1',
    userName: 'John Smith',
    action: 'CREATE_JOB_CARD',
    details: 'Created job card for Alice Johnson - ABC-123',
    entityType: 'job_card',
    entityId: 'JC001',
    timestamp: new Date('2024-01-20T10:30:00'),
  },
  {
    id: '2',
    userId: 'demo-user-1',
    userName: 'John Smith',
    action: 'UPDATE_PRODUCT',
    details: 'Updated product: Brake Pads',
    entityType: 'product',
    entityId: '1',
    timestamp: new Date('2024-01-20T11:15:00'),
  },
  {
    id: '3',
    userId: 'demo-user-1',
    userName: 'John Smith',
    action: 'GENERATE_INVOICE',
    details: 'Generated invoice INV-2024-001 for job card JC001',
    entityType: 'invoice',
    entityId: 'INV001',
    timestamp: new Date('2024-01-20T14:45:00'),
  }
];

export const mockUsers = [
  {
    id: 'demo-user-1',
    name: 'John Smith',
    email: 'john@workshop.com',
    role: 'owner',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-01-22'),
  },
  {
    id: 'demo-user-2',
    name: 'Sarah Davis',
    email: 'sarah@workshop.com',
    role: 'admin',
    createdAt: new Date('2024-01-05'),
    lastLogin: new Date('2024-01-21'),
  },
  {
    id: 'demo-user-3',
    name: 'Mike Johnson',
    email: 'mike@workshop.com',
    role: 'worker',
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-22'),
  }
];