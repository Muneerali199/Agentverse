
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { agents as defaultAgents, tools } from '@/lib/data';
import { Agent } from '@/lib/types';
import { Bot, Cpu, GripVertical, KeyRound, Save, Settings, Wand2, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AgentBuilderPage({ params }: { params: { agentId?: string[] } }) {
  const router = useRouter();
  const { toast } = useToast();
  const agentId = params.agentId?.[0];
  const isEditing = !!agentId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [allAgents, setAllAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const storedAgents = localStorage.getItem('customAgents');
    const customAgents = storedAgents ? JSON.parse(storedAgents) : [];
    const combinedAgents = [...defaultAgents, ...customAgents];
    setAllAgents(combinedAgents);

    if (isEditing) {
      const agentToEdit = combinedAgents.find(a => a.id === agentId);
      if (agentToEdit) {
        setName(agentToEdit.name);
        setDescription(agentToEdit.description);
        setSystemPrompt(agentToEdit.systemPrompt || '');
        setProvider(agentToEdit.provider || 'gemini');
        setApiKey(agentToEdit.apiKey || '');
      }
    }
  }, [agentId, isEditing]);

  const handleSaveAgent = () => {
    if (!name || !description) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide a name and description for your agent.",
        });
        return;
    }

    const newAgent: Agent = {
        id: isEditing ? agentId! : `agent-${Date.now()}`,
        name,
        description,
        systemPrompt,
        provider,
        apiKey,
        avatar: 'https://placehold.co/128x128.png',
        tools: [],
        performance: { accuracy: 0, response_time: 0 },
        isDeployed: false,
    };

    const storedAgents = localStorage.getItem('customAgents');
    let customAgents: Agent[] = storedAgents ? JSON.parse(storedAgents) : [];

    if (isEditing) {
        const agentIndex = customAgents.findIndex(a => a.id === agentId);
        if (agentIndex > -1) {
            customAgents[agentIndex] = newAgent;
        } else {
            const defaultAgentIndex = defaultAgents.findIndex(a => a.id === agentId);
            if (defaultAgentIndex > -1) {
                newAgent.id = `agent-${Date.now()}`;
                customAgents.push(newAgent);
            }
        }
    } else {
        customAgents.push(newAgent);
    }
    
    localStorage.setItem('customAgents', JSON.stringify(customAgents));

    toast({
        title: `Agent ${isEditing ? 'updated' : 'saved'}!`,
        description: `${name} has been successfully saved.`,
    });

    router.push('/');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Edit Agent' : 'Create New Agent'}
          </h1>
          <p className="text-muted-foreground">
            Build and customize your agent using the tools below.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Settings />
                Settings
            </Button>
            <Button onClick={handleSaveAgent}>
                <Save />
                {isEditing ? 'Save Changes' : 'Save Agent'}
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 flex-1">
        {/* Tools Panel */}
        <div className="md:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Wrench className="h-5 w-5" /> Tools</CardTitle>
                    <CardDescription>Drag tools to the canvas to add them to your agent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {tools.map(tool => (
                        <div key={tool.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted cursor-grab active:cursor-grabbing transition-colors">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                            <tool.icon className="h-6 w-6 text-primary" />
                            <div>
                                <h3 className="font-semibold">{tool.name}</h3>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        {/* Canvas Panel */}
        <div className="md:col-span-5 flex items-center justify-center">
            <Card className="w-full h-full border-dashed border-2 flex flex-col items-center justify-center text-center p-6">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full">
                        <Cpu className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="mt-4">Agent Canvas</CardTitle>
                    <CardDescription>Drag and drop tools here to build your agent's workflow.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary">
                        <Wand2 className="mr-2 h-4 w-4"/>
                        Auto-configure
                    </Button>
                </CardContent>
            </Card>
        </div>

        {/* Configuration Panel */}
        <div className="md:col-span-4">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="text-lg">Configuration</CardTitle>
                    <CardDescription>Define your agent's identity and parameters.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
                        <div className="space-y-2">
                            <Label htmlFor="api-provider">AI Provider</Label>
                            <Select value={provider} onValueChange={setProvider}>
                                <SelectTrigger id="api-provider">
                                    <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gemini">Gemini</SelectItem>
                                    <SelectItem value="openai">OpenAI</SelectItem>
                                    <SelectItem value="claude">Claude</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <Input id="api-key" type="password" placeholder="Enter your API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                             <p className="text-xs text-muted-foreground">
                                Alternatively, manage keys on the{' '}
                                <Link href="/keys" className="text-primary underline">
                                    API Keys page.
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="agent-name">Agent Name</Label>
                        <Input id="agent-name" placeholder="e.g., Customer Support Bot" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="agent-description">Agent Description</Label>
                        <Textarea id="agent-description" placeholder="Describe what your agent does." rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <Separator />
                     <div className="space-y-2">
                        <Label>System Prompt</Label>
                        <Textarea placeholder="You are a helpful assistant..." rows={6} value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}/>
                        <p className="text-xs text-muted-foreground">This prompt sets the context and personality for your agent.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
