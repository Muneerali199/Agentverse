import type { LucideIcon } from "lucide-react";

export type Agent = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  tools: Tool[];
  performance: {
    accuracy: number;
    response_time: number;
  };
  isDeployed: boolean;
  provider?: string;
  apiKey?: string;
  systemPrompt?: string;
};

export type Tool = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'agent';
  content: string;
  image?: string;
  feedback?: 'good' | 'bad';
};
