
import Link from 'next/link';
import { Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Edit, Globe, MoreVertical, PlayCircle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface AgentCardProps {
  agent: Agent;
  onDelete: (agentId: string) => void;
}

export function AgentCard({ agent, onDelete }: AgentCardProps) {
  const isDefaultAgent = ['1', '2', '3', '4'].includes(agent.id);

  const handleDelete = () => {
    onDelete(agent.id);
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={agent.avatar} alt={agent.name} data-ai-hint="robot face" />
          <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>{agent.name}</CardTitle>
          <CardDescription>{agent.description}</CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className='h-8 w-8 shrink-0'>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/builder/${agent.id}`}>
                    <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>View Analytics</span>
                </DropdownMenuItem>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onSelect={(e) => e.preventDefault()}
                            disabled={isDefaultAgent}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            agent.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Continue
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>

      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
          {agent.tools.map((tool) => (
            <Badge key={tool.id} variant="secondary" className="font-normal">
              <tool.icon className="mr-1.5 h-3 w-3" />
              {tool.name}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div className='flex flex-col'>
                <span className='text-muted-foreground'>Accuracy</span>
                <span className='font-medium'>{agent.performance.accuracy}%</span>
            </div>
             <div className='flex flex-col'>
                <span className='text-muted-foreground'>Response Time</span>
                <span className='font-medium'>{agent.performance.response_time}s</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/agent/${agent.id}`} className="flex-1" passHref>
          <Button className="w-full">
            <PlayCircle />
            Chat
          </Button>
        </Link>
        <Button variant="outline" disabled={agent.isDeployed}>
          <Globe />
          {agent.isDeployed ? 'Deployed' : 'Deploy'}
        </Button>
      </CardFooter>
    </Card>
  );
}
