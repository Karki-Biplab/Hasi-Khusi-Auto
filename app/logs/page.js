'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { dbService } from '@/lib/services/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Search, User, Package, Receipt, Car } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function ActivityLogsPage() {
  const { user, hasRole } = useAuth();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [user]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, filterAction]);

  const fetchLogs = async () => {
    try {
      const logData = await dbService.getActivityLogs(user?.role);
      setLogs(logData);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'ADD_PRODUCT':
      case 'UPDATE_PRODUCT':
      case 'DELETE_PRODUCT':
        return Package;
      case 'CREATE_JOB_CARD':
      case 'UPDATE_JOB_CARD_STATUS':
        return Car;
      case 'GENERATE_INVOICE':
        return Receipt;
      case 'ADD_USER':
      case 'UPDATE_USER':
        return User;
      default:
        return Activity;
    }
  };

  const getActionColor = (action) => {
    if (action.includes('ADD') || action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE')) return 'default';
    if (action.includes('DELETE')) return 'destructive';
    return 'secondary';
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
          <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
          <p className="text-gray-600">
            Track all activities in your workshop
            {user?.role === 'admin' && ' (Last 48 hours)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-500">
            {user?.role === 'owner' ? 'All Time' : 'Last 48 Hours'}
          </span>
        </div>
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
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="ADD_PRODUCT">Add Product</SelectItem>
                <SelectItem value="UPDATE_PRODUCT">Update Product</SelectItem>
                <SelectItem value="DELETE_PRODUCT">Delete Product</SelectItem>
                <SelectItem value="CREATE_JOB_CARD">Create Job Card</SelectItem>
                <SelectItem value="UPDATE_JOB_CARD_STATUS">Update Job Card</SelectItem>
                <SelectItem value="GENERATE_INVOICE">Generate Invoice</SelectItem>
                <SelectItem value="ADD_USER">Add User</SelectItem>
                <SelectItem value="UPDATE_USER">Update User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity History ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                const actionColor = getActionColor(log.action);
                
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ActionIcon className="h-4 w-4 text-gray-500" />
                        <Badge variant={actionColor} className="capitalize">
                          {log.action.replace(/_/g, ' ').toLowerCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.userName}</div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{log.details}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.entityType?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(log.timestamp?.toDate())}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}