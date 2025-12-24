"use client";

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { UserNav } from '@/components/user-nav';

export default function MainLayout({ children }: { children: ReactNode }) {
  // Middleware and AuthProvider handle loading and redirection.
  // This component can assume a user is authenticated if it renders.
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
