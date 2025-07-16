import { ChatInterface } from '@/components/chat-interface';
import { agents } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const agent = agents.find((a) => a.id === params.agentId);

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
