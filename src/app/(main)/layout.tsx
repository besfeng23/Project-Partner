"use client";

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { UserNav } from '@/components/user-nav';
import { useAuth } from '@/context/auth-provider';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // The middleware handles the redirect, but this is a fallback for client-side navigation
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
          <Sidebar collapsible="icon">
              <MainSidebar />
          </Sidebar>
          <div className="flex flex-1 flex-col">
              <header className="flex h-16 items-center justify-end gap-4 border-b bg-background px-6 shrink-0">
                  <UserNav />
              </header>
              <SidebarInset>
                  <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                  </main>
              </SidebarInset>
          </div>
      </div>
    </SidebarProvider>
  );
}
