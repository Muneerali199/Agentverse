# AgentVerse - AI Agent Builder

Welcome to AgentVerse, a platform for building, managing, and interacting with custom AI agents. This application, built with Firebase Studio, provides a user-friendly interface to create sophisticated agents with various tools and capabilities.

## ✨ Features

- **Agent Dashboard**: View and manage all your default and custom-built AI agents in one place.
- **Custom Agent Builder**: Create new agents by defining their name, description, personality (via system prompts), and the underlying AI provider.
- **API Key Management**: Securely store and manage your API keys for different AI providers (like Google's Gemini) in your browser's local storage.
- **Interactive Chat Interface**: Chat with your created agents, with support for both text and image-based (multi-modal) conversations.
- **Client-Side Storage**: Your custom agents and API keys are saved in your browser, ensuring your data is private and persistent across sessions.

## 🚀 Tech Stack

This project is built with a modern, robust tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

This project is designed to run seamlessly within Firebase Studio.

1.  **Add your API Key**:
    -   Navigate to the **API Keys** page using the sidebar.
    -   Click "Add New Key", select "Gemini" as the provider, and paste your [Google AI Studio API key](https://aistudio.google.com/app/apikey).
    -   Save the key. The key will be securely stored in your browser's local storage.

2.  **Create a New Agent**:
    -   Navigate to the **Create Agent** page.
    -   Fill in the agent's details, including its name, description, and a system prompt to define its personality.
    -   The API key you just added will be used automatically for any Gemini-based agent.
    -   Click "Save Agent".

3.  **Chat with Your Agent**:
    -   From the main **Dashboard**, find the agent you just created.
    -   Click the "Chat" button to open the chat interface and start your conversation!

## 📂 Project Structure

-   `src/app/`: Contains the main pages and layouts of the application, following the Next.js App Router structure.
-   `src/components/`: Shared React components used throughout the application, including UI components from ShadCN.
-   `src/ai/`: Holds the AI-related logic, powered by Genkit flows.
-   `src/lib/`: Includes utility functions, data definitions (`types.ts`), and initial static data.
-   `public/`: Static assets.