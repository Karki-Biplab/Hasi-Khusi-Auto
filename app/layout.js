import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/dashboard-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Workshop Management System',
  description: 'Complete workshop management solution',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </AuthProvider>
      </body>
    </html>
  );
}