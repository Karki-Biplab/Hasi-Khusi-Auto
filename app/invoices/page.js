'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { dbService } from '@/lib/services/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Receipt, Download, Eye, Plus } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import jsPDF from 'jspdf';

export default function InvoicesPage() {
  const { user, hasRole } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchJobCards();
  }, []);

  const fetchInvoices = async () => {
    try {
      const invoiceData = await dbService.getInvoices();
      setInvoices(invoiceData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobCards = async () => {
    try {
      const jobCardData = await dbService.getJobCards();
      setJobCards(jobCardData.filter(job => job.status === 'completed'));
    } catch (error) {
      console.error('Error fetching job cards:', error);
    }
  };

  const generateInvoice = async (jobCard) => {
    if (!hasRole(['owner', 'admin'])) {
      alert('You do not have permission to generate invoices');
      return;
    }

    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const taxRate = 0.08; // 8% tax
      const subtotal = jobCard.totalAmount;
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;

      const invoice = {
        jobCardId: jobCard.id,
        invoiceNumber,
        customerName: jobCard.customerName,
        customerPhone: jobCard.customerPhone,
        vehicleNumber: jobCard.vehicleNumber,
        items: [
          ...jobCard.partsUsed.map(part => ({
            description: part.productName,
            quantity: part.quantity,
            unitPrice: part.unitPrice,
            totalPrice: part.totalPrice,
          })),
          {
            description: 'Labor',
            quantity: 1,
            unitPrice: jobCard.laborCost,
            totalPrice: jobCard.laborCost,
          }
        ],
        subtotal,
        taxAmount,
        totalAmount,
        generatedBy: user.uid,
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };

      await dbService.addInvoice(invoice);
      await dbService.updateJobCard(jobCard.id, { status: 'invoiced' });
      
      await dbService.addActivityLog({
        userId: user.uid,
        userName: user.name,
        action: 'GENERATE_INVOICE',
        details: `Generated invoice ${invoiceNumber} for job card ${jobCard.id}`,
        entityType: 'invoice',
      });

      fetchInvoices();
      fetchJobCards();
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  const downloadInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${formatDateTime(invoice.createdAt?.toDate())}`, 20, 50);
    doc.text(`Due Date: ${formatDateTime(invoice.dueDate?.toDate())}`, 20, 60);
    
    // Customer Info
    doc.text('Bill To:', 20, 80);
    doc.text(invoice.customerName, 20, 90);
    doc.text(invoice.customerPhone, 20, 100);
    doc.text(`Vehicle: ${invoice.vehicleNumber}`, 20, 110);
    
    // Items
    doc.text('Description', 20, 140);
    doc.text('Qty', 100, 140);
    doc.text('Unit Price', 130, 140);
    doc.text('Total', 170, 140);
    
    let yPosition = 150;
    invoice.items.forEach(item => {
      doc.text(item.description, 20, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(formatCurrency(item.unitPrice), 130, yPosition);
      doc.text(formatCurrency(item.totalPrice), 170, yPosition);
      yPosition += 10;
    });
    
    // Totals
    yPosition += 10;
    doc.text(`Subtotal: ${formatCurrency(invoice.subtotal)}`, 130, yPosition);
    doc.text(`Tax: ${formatCurrency(invoice.taxAmount)}`, 130, yPosition + 10);
    doc.setFontSize(14);
    doc.text(`Total: ${formatCurrency(invoice.totalAmount)}`, 130, yPosition + 20);
    
    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'overdue':
        return 'destructive';
      default:
        return 'default';
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
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-gray-600">Generate and manage customer invoices</p>
        </div>
      </div>

      {/* Available Job Cards for Invoicing */}
      {hasRole(['owner', 'admin']) && jobCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ready for Invoicing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {jobCards.map(jobCard => (
                <div key={jobCard.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{jobCard.customerName} - {jobCard.vehicleNumber}</p>
                    <p className="text-sm text-gray-500">{jobCard.vehicleModel}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{formatCurrency(jobCard.totalAmount)}</p>
                    <Button onClick={() => generateInvoice(jobCard)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.customerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.vehicleNumber}</TableCell>
                  <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(invoice.status)} className="capitalize">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(invoice.createdAt?.toDate())}</TableCell>
                  <TableCell>{formatDateTime(invoice.dueDate?.toDate())}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => downloadInvoicePDF(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusColor(selectedInvoice.status)} className="capitalize">
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedInvoice.customerName}</p>
                  <p className="text-sm text-gray-500">{selectedInvoice.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">{selectedInvoice.vehicleNumber}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Items</p>
                <div className="border rounded-lg p-4">
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.unitPrice)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <p>Subtotal:</p>
                  <p>{formatCurrency(selectedInvoice.subtotal)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax:</p>
                  <p>{formatCurrency(selectedInvoice.taxAmount)}</p>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <p>Total:</p>
                  <p>{formatCurrency(selectedInvoice.totalAmount)}</p>
                </div>
              </div>
              <Button onClick={() => downloadInvoicePDF(selectedInvoice)} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}