
'use client';

import { ChatInterface } from '@/components/chat-interface';
import { agents as defaultAgents } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Agent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AgentPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agentId) {
        const storedAgents = localStorage.getItem('customAgents');
        const customAgents = storedAgents ? JSON.parse(storedAgents) : [];
        const allAgents = [...defaultAgents, ...customAgents];
        const foundAgent = allAgents.find((a) => a.id === agentId);
        
        if (foundAgent) {
          setAgent(foundAgent);
        }
    }
    setLoading(false);
  }, [agentId]);

  if (loading) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-9" />
                <div className="space-y-1">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-5 w-60" />
                </div>
            </div>
            <Skeleton className="h-[calc(100vh-12rem)] w-full" />
        </div>
    );
  }

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/" passHref>
            <Button variant="outline" size="icon" className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{agent.name}</h1>
            <p className="text-muted-foreground">
                You are now chatting with {agent.name}.
            </p>
        </div>
      </div>
      <ChatInterface agent={agent} />
    </div>
  );
}
