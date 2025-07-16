import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { tools } from '@/lib/data';
import { Bot, Cpu, GripVertical, Save, Settings, Wand2, Wrench } from 'lucide-react';

export default function AgentBuilderPage({ params }: { params: { agentId?: string[] } }) {
  const isEditing = params.agentId && params.agentId.length > 0;

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
            <Button>
                <Save />
                Save Agent
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
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="agent-name">Agent Name</Label>
                        <Input id="agent-name" placeholder="e.g., Customer Support Bot" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="agent-description">Agent Description</Label>
                        <Textarea id="agent-description" placeholder="Describe what your agent does." rows={3} />
                    </div>
                    <Separator />
                     <div className="space-y-2">
                        <Label>System Prompt</Label>
                        <Textarea placeholder="You are a helpful assistant..." rows={6} />
                        <p className="text-xs text-muted-foreground">This prompt sets the context and personality for your agent.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
