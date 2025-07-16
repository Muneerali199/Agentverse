import { AgentCard } from '@/components/agent-card';
import { Button } from '@/components/ui/button';
import { agents } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
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
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
