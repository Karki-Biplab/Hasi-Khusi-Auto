import { 
  mockProducts, 
  mockJobCards, 
  mockInvoices, 
  mockActivityLogs, 
  mockUsers 
} from '../mock-data';

// Mock database service for demo purposes
export const dbService = {
  // Products
  async getProducts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },

  async addProduct(product) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProduct = {
      id: Date.now().toString(),
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockProducts.push(newProduct);
    return { id: newProduct.id };
  },

  async updateProduct(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...updates, updatedAt: new Date() };
    }
    return true;
  },

  async deleteProduct(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts.splice(index, 1);
    }
    return true;
  },

  // Job Cards
  async getJobCards() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockJobCards;
  },

  async addJobCard(jobCard) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newJobCard = {
      id: `JC${String(mockJobCards.length + 1).padStart(3, '0')}`,
      ...jobCard,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockJobCards.push(newJobCard);
    return { id: newJobCard.id };
  },

  async updateJobCard(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockJobCards.findIndex(jc => jc.id === id);
    if (index !== -1) {
      mockJobCards[index] = { ...mockJobCards[index], ...updates, updatedAt: new Date() };
    }
    return true;
  },

  // Invoices
  async getInvoices() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInvoices;
  },

  async addInvoice(invoice) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newInvoice = {
      id: `INV${String(mockInvoices.length + 1).padStart(3, '0')}`,
      ...invoice,
      createdAt: new Date()
    };
    mockInvoices.push(newInvoice);
    return { id: newInvoice.id };
  },

  // Users
  async getUsers() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  },

  async addUser(user) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newUser = {
      id: Date.now().toString(),
      ...user,
      createdAt: new Date()
    };
    mockUsers.push(newUser);
    return { id: newUser.id };
  },

  async updateUser(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date() };
    }
    return true;
  },

  // Activity Logs
  async getActivityLogs(userRole = 'owner') {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (userRole === 'admin') {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      return mockActivityLogs.filter(log => log.timestamp >= twoDaysAgo);
    }
    
    return mockActivityLogs;
  },

  async addActivityLog(log) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newLog = {
      id: Date.now().toString(),
      ...log,
      timestamp: new Date()
    };
    mockActivityLogs.unshift(newLog);
    return { id: newLog.id };
  },

  // Dashboard Stats
  async getDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const completedJobs = mockJobCards.filter(job => job.status === 'completed');
    const pendingJobs = mockJobCards.filter(job => job.status === 'pending');
    const lowStockItems = mockProducts.filter(product => product.quantity <= product.minStock);
    
    const totalRevenue = mockInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyRevenue = mockInvoices
      .filter(invoice => invoice.createdAt >= thisMonth)
      .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

    return {
      totalJobs: mockJobCards.length,
      completedJobs: completedJobs.length,
      pendingJobs: pendingJobs.length,
      totalRevenue,
      monthlyRevenue,
      lowStockItems: lowStockItems.length,
      activeUsers: mockUsers.length
    };
  }
};