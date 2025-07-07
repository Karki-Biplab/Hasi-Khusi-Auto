'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { dbService } from '@/lib/services/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Plus, Edit, Eye, Search } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function JobCardsPage() {
  const { user, hasRole } = useAuth();
  const [jobCards, setJobCards] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredJobCards, setFilteredJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [newJobCard, setNewJobCard] = useState({
    customerName: '',
    customerPhone: '',
    vehicleNumber: '',
    vehicleModel: '',
    issueDescription: '',
    partsUsed: [],
    servicesProvided: [],
    laborCost: 0,
    notes: '',
    estimatedCompletion: '',
  });

  useEffect(() => {
    fetchJobCards();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterJobCards();
  }, [jobCards, searchTerm, filterStatus]);

  const fetchJobCards = async () => {
    try {
      const jobCardData = await dbService.getJobCards();
      setJobCards(jobCardData);
    } catch (error) {
      console.error('Error fetching job cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productData = await dbService.getProducts();
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterJobCards = () => {
    let filtered = jobCards;

    if (searchTerm) {
      filtered = filtered.filter(jobCard =>
        jobCard.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobCard.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobCard.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(jobCard => jobCard.status === filterStatus);
    }

    setFilteredJobCards(filtered);
  };

  const handleAddJobCard = async () => {
    try {
      const totalAmount = newJobCard.partsUsed.reduce((sum, part) => sum + part.totalPrice, 0) + newJobCard.laborCost;
      
      await dbService.addJobCard({
        ...newJobCard,
        totalAmount,
        status: 'pending',
        createdBy: user.uid,
      });
      
      await dbService.addActivityLog({
        userId: user.uid,
        userName: user.name,
        action: 'CREATE_JOB_CARD',
        details: `Created job card for ${newJobCard.customerName} - ${newJobCard.vehicleNumber}`,
        entityType: 'job_card',
      });

      setNewJobCard({
        customerName: '',
        customerPhone: '',
        vehicleNumber: '',
        vehicleModel: '',
        issueDescription: '',
        partsUsed: [],
        servicesProvided: [],
        laborCost: 0,
        notes: '',
        estimatedCompletion: '',
      });
      setIsAddDialogOpen(false);
      fetchJobCards();
    } catch (error) {
      console.error('Error adding job card:', error);
    }
  };

  const handleUpdateJobCardStatus = async (jobCardId, newStatus) => {
    if (!hasRole(['owner', 'admin'])) {
      alert('You do not have permission to update job card status');
      return;
    }

    try {
      await dbService.updateJobCard(jobCardId, {
        status: newStatus,
        approvedBy: user.uid,
        actualCompletion: newStatus === 'completed' ? new Date() : null,
      });
      
      await dbService.addActivityLog({
        userId: user.uid,
        userName: user.name,
        action: 'UPDATE_JOB_CARD_STATUS',
        details: `Changed job card status to ${newStatus}`,
        entityType: 'job_card',
        entityId: jobCardId,
      });

      fetchJobCards();
    } catch (error) {
      console.error('Error updating job card status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'success';
      case 'invoiced':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const addPartToJobCard = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const existingPart = newJobCard.partsUsed.find(p => p.productId === productId);
      if (existingPart) {
        setNewJobCard({
          ...newJobCard,
          partsUsed: newJobCard.partsUsed.map(part =>
            part.productId === productId
              ? { ...part, quantity: part.quantity + 1, totalPrice: (part.quantity + 1) * part.unitPrice }
              : part
          )
        });
      } else {
        setNewJobCard({
          ...newJobCard,
          partsUsed: [...newJobCard.partsUsed, {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.unitPrice,
            totalPrice: product.unitPrice,
          }]
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Cards</h2>
          <p className="text-gray-600">Manage customer service requests and repairs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Job Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Card</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newJobCard.customerName}
                    onChange={(e) => setNewJobCard({ ...newJobCard, customerName: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Customer Phone</Label>
                  <Input
                    id="customerPhone"
                    value={newJobCard.customerPhone}
                    onChange={(e) => setNewJobCard({ ...newJobCard, customerPhone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    value={newJobCard.vehicleNumber}
                    onChange={(e) => setNewJobCard({ ...newJobCard, vehicleNumber: e.target.value })}
                    placeholder="Enter vehicle number"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    value={newJobCard.vehicleModel}
                    onChange={(e) => setNewJobCard({ ...newJobCard, vehicleModel: e.target.value })}
                    placeholder="Enter vehicle model"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="issueDescription">Issue Description</Label>
                <Textarea
                  id="issueDescription"
                  value={newJobCard.issueDescription}
                  onChange={(e) => setNewJobCard({ ...newJobCard, issueDescription: e.target.value })}
                  placeholder="Describe the issue"
                />
              </div>
              <div>
                <Label>Parts Used</Label>
                <div className="border rounded-lg p-4 space-y-2">
                  <Select onValueChange={addPartToJobCard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add parts to job card" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.unitPrice)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newJobCard.partsUsed.length > 0 && (
                    <div className="space-y-1">
                      {newJobCard.partsUsed.map((part, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span>{part.productName} x {part.quantity}</span>
                          <span>{formatCurrency(part.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="laborCost">Labor Cost</Label>
                <Input
                  id="laborCost"
                  type="number"
                  step="0.01"
                  value={newJobCard.laborCost}
                  onChange={(e) => setNewJobCard({ ...newJobCard, laborCost: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newJobCard.notes}
                  onChange={(e) => setNewJobCard({ ...newJobCard, notes: e.target.value })}
                  placeholder="Additional notes"
                />
              </div>
              <Button onClick={handleAddJobCard} className="w-full">
                Create Job Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer, vehicle number, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="invoiced">Invoiced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Cards ({filteredJobCards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobCards.map((jobCard) => (
                <TableRow key={jobCard.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{jobCard.customerName}</div>
                      <div className="text-sm text-gray-500">{jobCard.customerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{jobCard.vehicleNumber}</div>
                      <div className="text-sm text-gray-500">{jobCard.vehicleModel}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{jobCard.issueDescription}</TableCell>
                  <TableCell>{formatCurrency(jobCard.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(jobCard.status)} className="capitalize">
                      {jobCard.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(jobCard.createdAt?.toDate())}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedJobCard(jobCard);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {hasRole(['owner', 'admin']) && jobCard.status !== 'invoiced' && (
                        <Select 
                          value={jobCard.status} 
                          onValueChange={(value) => handleUpdateJobCardStatus(jobCard.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="invoiced">Invoiced</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Job Card Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Card Details</DialogTitle>
          </DialogHeader>
          {selectedJobCard && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer Name</Label>
                  <p className="font-medium">{selectedJobCard.customerName}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="font-medium">{selectedJobCard.customerPhone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vehicle Number</Label>
                  <p className="font-medium">{selectedJobCard.vehicleNumber}</p>
                </div>
                <div>
                  <Label>Vehicle Model</Label>
                  <p className="font-medium">{selectedJobCard.vehicleModel}</p>
                </div>
              </div>
              <div>
                <Label>Issue Description</Label>
                <p className="font-medium">{selectedJobCard.issueDescription}</p>
              </div>
              <div>
                <Label>Parts Used</Label>
                <div className="border rounded-lg p-4">
                  {selectedJobCard.partsUsed?.length > 0 ? (
                    selectedJobCard.partsUsed.map((part, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <span>{part.productName} x {part.quantity}</span>
                        <span>{formatCurrency(part.totalPrice)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No parts used</p>
                  )}
                </div>
              </div>
              <div>
                <Label>Labor Cost</Label>
                <p className="font-medium">{formatCurrency(selectedJobCard.laborCost)}</p>
              </div>
              <div>
                <Label>Total Amount</Label>
                <p className="font-medium text-lg">{formatCurrency(selectedJobCard.totalAmount)}</p>
              </div>
              {selectedJobCard.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="font-medium">{selectedJobCard.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}