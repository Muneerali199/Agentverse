import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/sidebar-nav';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'AgentVerse',
  description: 'Build, manage, and deploy your custom AI agents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layout = cookies().get('sidebar_state');
  const defaultOpen = layout ? layout.value === 'true' : true;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <SidebarProvider defaultOpen={defaultOpen}>
          <SidebarNav />
          <SidebarInset>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
