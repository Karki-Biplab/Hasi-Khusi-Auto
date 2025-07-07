export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'worker';
  createdAt: Date;
  lastLogin?: Date;
}

export interface Product {
  id: string;
  name: string;
  type: 'part' | 'accessory' | 'service';
  category: string;
  quantity: number;
  unitPrice: number;
  minStock: number;
  description?: string;
  brand?: string;
  lastUpdatedBy: string;
  lastUpdated: Date;
  createdAt: Date;
}

export interface JobCard {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleNumber: string;
  vehicleModel: string;
  issueDescription: string;
  partsUsed: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  servicesProvided: string[];
  laborCost: number;
  totalAmount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'invoiced';
  createdBy: string;
  approvedBy?: string;
  notes?: string;
  images?: string[];
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  jobCardId: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleNumber: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  generatedBy: string;
  pdfUrl?: string;
  createdAt: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  entityType: 'product' | 'job_card' | 'invoice' | 'user';
  entityId?: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface DashboardStats {
  totalJobs: number;
  pendingJobs: number;
  completedJobs: number;
  totalRevenue: number;
  monthlyRevenue: number;
  lowStockItems: number;
  activeUsers: number;
}