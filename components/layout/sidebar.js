'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  BarChart3,
  Package,
  FileText,
  Receipt,
  Users,
  Activity,
  Settings,
  Menu,
  Car,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['owner', 'admin', 'worker'] },
  { name: 'Inventory', href: '/inventory', icon: Package, roles: ['owner', 'admin', 'worker'] },
  { name: 'Job Cards', href: '/job-cards', icon: Car, roles: ['owner', 'admin', 'worker'] },
  { name: 'Invoices', href: '/invoices', icon: Receipt, roles: ['owner', 'admin'] },
  { name: 'Activity Logs', href: '/logs', icon: Activity, roles: ['owner', 'admin'] },
  { name: 'User Management', href: '/users', icon: Users, roles: ['owner'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    // Mock logout
    window.location.reload();
  };

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles)
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-6 border-b">
        <Car className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold">Workshop Pro</span>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col min-h-0 bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}