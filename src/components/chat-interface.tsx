'use client';

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { ChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Paperclip, Send, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Textarea } from './ui/textarea';

interface ChatInterfaceProps {
  agentName: string;
  agentAvatar: string;
}

export function ChatInterface({ agentName, agentAvatar }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'agent', content: `Hello! I am ${agentName}. How can I assist you today?` },
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      ...(imagePreview && { image: imagePreview }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    removeImage();

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: `This is a simulated response based on your input: "${input}".`,
      };
      setMessages((prev) => [...prev, agentResponse]);
    }, 1000);

    // Here you would call the processMultiModalInput AI flow
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
                  <AvatarImage src={agentAvatar} alt={agentName} />
                  <AvatarFallback>{agentName.charAt(0)}</AvatarFallback>
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
              placeholder={`Chat with ${agentName}...`}
              className="pr-24 min-h-[48px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
              }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 right-3 flex gap-1">
                <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Button type="submit" size="icon">
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
