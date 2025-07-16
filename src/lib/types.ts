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
