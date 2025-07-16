'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, KeyRound, LayoutGrid, PlusCircle } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
            AgentVerse
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <SidebarMenuButton
                isActive={isActive('/')}
                tooltip="Dashboard"
              >
                <LayoutGrid />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/builder">
              <SidebarMenuButton
                isActive={isActive('/builder')}
                tooltip="Create Agent"
              >
                <PlusCircle />
                <span>Create Agent</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <Link href="/keys">
              <SidebarMenuButton
                isActive={isActive('/keys')}
                tooltip="API Keys"
              >
                <KeyRound />
                <span>API Keys</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
         <div className="p-4 bg-muted/50 rounded-lg text-center space-y-2">
            <h3 className="font-semibold">Upgrade to Pro</h3>
            <p className="text-sm text-muted-foreground">Get more agents, tools, and advanced features.</p>
            <Button size="sm" className="w-full">Upgrade</Button>
         </div>
      </SidebarFooter>
    </Sidebar>
  );
}
