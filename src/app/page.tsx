
'use client';

import { AgentCard } from '@/components/agent-card';
import { Button } from '@/components/ui/button';
import { agents as defaultAgents } from '@/lib/data';
import { Agent } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);

  useEffect(() => {
    const storedAgents = localStorage.getItem('customAgents');
    if (storedAgents) {
      const customAgents = JSON.parse(storedAgents);
      // A simple way to avoid duplicates if this effect runs multiple times.
      const combinedAgentIds = new Set(defaultAgents.map(a => a.id));
      const uniqueCustomAgents = customAgents.filter((agent: Agent) => !combinedAgentIds.has(agent.id));
      setAgents([...defaultAgents, ...uniqueCustomAgents]);
    }
  }, []);
  
  const handleDeleteAgent = (agentId: string) => {
    const storedAgents = localStorage.getItem('customAgents');
    if (storedAgents) {
        let customAgents: Agent[] = JSON.parse(storedAgents);
        customAgents = customAgents.filter(agent => agent.id !== agentId);
        localStorage.setItem('customAgents', JSON.stringify(customAgents));
        setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Agent Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and monitor your AI agents.
            </p>
        </div>
        <Link href="/builder" passHref>
          <Button>
            <PlusCircle />
            Create Agent
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onDelete={handleDeleteAgent} />
        ))}
      </div>
    </div>
  );
}
