
'use client';

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { ChatMessage, Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Paperclip, Send, ThumbsDown, ThumbsUp, X, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Textarea } from './ui/textarea';
import { processMultiModalInput } from '@/ai/flows/process-multi-modal-input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface ChatInterfaceProps {
  agent: Agent;
}

function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function ChatInterface({ agent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'agent', content: `Hello! I am ${agent.name}. How can I assist you today?` },
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFeedback = (messageId: string, feedback: 'good' | 'bad') => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
    // Here you would call the analyzeAgentFeedback AI flow
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      ...(imagePreview && { image: imagePreview }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    removeImage();

    try {
        let apiKeyToUse = agent.apiKey;

        if (!apiKeyToUse) {
            const storedKeys = localStorage.getItem('apiKeys');
            const apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
            const geminiKey = apiKeys.find((k: any) => k.provider === 'gemini');
            apiKeyToUse = geminiKey?.keyRaw;
        }

        if (!apiKeyToUse) {
          toast({
            variant: "destructive",
            title: "Gemini API Key Not Found",
            description: (
              <p>
                Please add an API key for this agent in the builder or add a general key on the{' '}
                <Link href="/keys" className="underline">
                  API Keys page
                </Link>
                .
              </p>
            ),
          });
          setMessages(prev => prev.slice(0, -1));
          setIsLoading(false);
          return;
        }

        let imageDataUri: string | undefined;
        if (image) {
            imageDataUri = await fileToDataUri(image);
        }

        const result = await processMultiModalInput({
            text: input,
            imageDataUri,
            apiKey: apiKeyToUse,
        });

        const agentResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: result.response,
        };
        setMessages((prev) => [...prev, agentResponse]);

    } catch(error: any) {
        console.error("Error processing request:", error);
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: error.message || "Please try again later.",
        });
        setMessages(prev => prev.slice(0, -1)); // Remove the user message on error
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-0">
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4',
                message.role === 'user' && 'justify-end'
              )}
            >
              {message.role === 'agent' && (
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn('max-w-lg space-y-2', message.role === 'user' && 'items-end flex flex-col')}>
                <div
                  className={cn(
                    'rounded-lg p-3 w-fit',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.image && (
                    <Image
                      src={message.image}
                      alt="User upload"
                      width={300}
                      height={200}
                      className="rounded-md mb-2"
                      data-ai-hint="object detection"
                    />
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'agent' && (
                    <div className="flex items-center justify-start gap-1">
                        <Button variant="ghost" size="icon" className={cn("h-7 w-7", message.feedback === 'good' && "bg-accent/50 text-accent-foreground")} onClick={() => handleFeedback(message.id, 'good')}>
                            <ThumbsUp className="h-4 w-4"/>
                        </Button>
                         <Button variant="ghost" size="icon" className={cn("h-7 w-7", message.feedback === 'bad' && "bg-destructive/20 text-destructive")} onClick={() => handleFeedback(message.id, 'bad')}>
                            <ThumbsDown className="h-4 w-4"/>
                        </Button>
                    </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src="https://placehold.co/32x32.png" alt="User" data-ai-hint="person face" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
              <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="max-w-lg space-y-2">
                      <div className="rounded-lg p-3 w-fit bg-muted">
                           <Loader className="h-5 w-5 animate-spin" />
                      </div>
                  </div>
              </div>
          )}
        </div>
        <div className="border-t p-4 bg-background">
          <form onSubmit={handleSubmit} className="relative">
            {imagePreview && (
              <div className="absolute bottom-full mb-2 bg-muted p-2 rounded-md border">
                <div className="relative">
                    <Image src={imagePreview} alt="Preview" width={80} height={80} className="rounded" />
                    <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeImage}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            )}
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Chat with ${agent.name}...`}
              className="pr-24 min-h-[48px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
              }}
              disabled={isLoading}
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-3 flex gap-1">
                <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || (!input.trim() && !image)}>
                    <Send className="h-5 w-5" />
                </Button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
