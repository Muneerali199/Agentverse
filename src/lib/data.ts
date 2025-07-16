import { Cpu, Globe, MemoryStick } from "lucide-react";
import type { Agent, Tool } from "./types";

export const tools: Tool[] = [
  {
    id: "memory",
    name: "Memory",
    description: "Retain information from previous interactions.",
    icon: MemoryStick,
  },
  {
    id: "web-browser",
    name: "Web Browser",
    description: "Access real-time information from the web.",
    icon: Globe,
  },
  {
    id: "api-tool",
    name: "API Tool",
    description: "Connect to external APIs to fetch data.",
    icon: Cpu,
  },
];

export const agents: Agent[] = [
  {
    id: "1",
    name: "Market Analyst",
    description: "An AI agent that analyzes market trends and provides insights.",
    avatar: "https://placehold.co/128x128.png",
    tools: [tools[1], tools[2]],
    performance: {
      accuracy: 92,
      response_time: 1.2,
    },
    isDeployed: true,
  },
  {
    id: "2",
    name: "Customer Support",
    description: "Handles customer queries and resolves issues with empathy.",
    avatar: "https://placehold.co/128x128.png",
    tools: [tools[0]],
    performance: {
      accuracy: 88,
      response_time: 0.8,
    },
    isDeployed: false,
  },
  {
    id: "3",
    name: "Creative Writer",
    description: "Generates creative content, from poems to scripts.",
    avatar: "https://placehold.co/128x128.png",
    tools: [tools[0], tools[1]],
    performance: {
      accuracy: 95,
      response_time: 2.5,
    },
    isDeployed: true,
  },
    {
    id: "4",
    name: "Code Assistant",
    description: "Helps developers with code snippets and debugging.",
    avatar: "https://placehold.co/128x128.png",
    tools: [tools[0], tools[2]],
    performance: {
      accuracy: 97,
      response_time: 0.5,
    },
    isDeployed: false,
  },
];
