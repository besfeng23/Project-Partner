"use client";

import { useState, useEffect } from "react";
import { Paperclip, SendHorizonal, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import type { ChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-provider";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const initialMessages: ChatMessage[] = [
    { id: '1', role: 'assistant', content: 'Hello! How can I help you with the project today?', createdAt: new Date(), writtenToMemory: true },
];

export function ChatPanel({ orgId, projectId, threadId }: { orgId: string; projectId: string; threadId: string }) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (!projectId || !orgId || !threadId) return;

        const messagesRef = collection(db, `orgs/${orgId}/projects/${projectId}/chatThreads/${threadId}/messages`);
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty && messages.length <= 1) { // Check length to avoid clearing optimistic updates
                setMessages(initialMessages);
                return;
            }
            const fetchedMessages: ChatMessage[] = querySnapshot.docs.map(doc => {
                 const data = doc.data();
                 return {
                    id: doc.id,
                    role: data.role,
                    content: data.content,
                    createdAt: data.createdAt?.toDate() ?? new Date(),
                    writtenToMemory: data.writtenToMemory,
                 } as ChatMessage
            });
            setMessages(fetchedMessages);
        }, (error) => {
            console.error("Error fetching chat messages:", error);
            const errorResponse: ChatMessage = {
                id: Date.now().toString() + 'err',
                role: 'assistant',
                content: 'Could not load chat history.',
                createdAt: new Date(),
                writtenToMemory: false
            };
            setMessages(prev => [...prev, errorResponse]);
        });

        return () => unsubscribe();
    }, [projectId, orgId, threadId]);

    const getInitials = (email?: string | null) => {
        if (!email) return 'U';
        return email.substring(0, 2).toUpperCase();
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !user) return;
        
        const currentInput = input;
        const optimisticMessage: ChatMessage = {
            id: `optimistic-${Date.now()}`,
            role: 'user',
            content: currentInput,
            createdAt: new Date(),
            writtenToMemory: false
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/partner/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    orgId, 
                    projectId, 
                    threadId, 
                    mode: 'plan', // TODO: Allow user to select mode
                    userMessage: currentInput,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'AI partner failed to respond.');
            }
            // onSnapshot will handle adding the new messages to the UI
        } catch (error: any) {
            console.error(error);
            // Remove optimistic message and add a temporary error message
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
            const errorResponse: ChatMessage = {
                id: Date.now().toString() + 'err',
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error.message}`,
                createdAt: new Date(),
                writtenToMemory: false
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-18rem)] bg-card border rounded-xl">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((message) => (
                    <div key={message.id} className={cn("flex items-start gap-4", message.role === 'user' && 'justify-end')}>
                        {message.role === 'assistant' && (
                             <Avatar className="h-8 w-8 border-2 border-primary/50">
                                <AvatarFallback className="bg-primary/20"><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn("max-w-md rounded-lg p-3", message.role === 'assistant' ? 'bg-secondary' : 'bg-primary text-primary-foreground')}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.photoURL ?? ""} />
                                <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8 border-2 border-primary/50">
                           <AvatarFallback className="bg-primary/20"><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-md rounded-lg p-3 bg-secondary flex items-center gap-2">
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                        </div>
                    </div>
                 )}
            </div>
            <div className="border-t p-4 bg-card rounded-b-xl">
                <form onSubmit={handleSendMessage} className="relative">
                    <Textarea 
                        placeholder="Ask the AI partner to plan, unblock, or optimize..." 
                        className="pr-28"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon" disabled={isLoading}>
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            <SendHorizonal className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
