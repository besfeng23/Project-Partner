"use client";

import { ChatPanel } from "@/components/chat-panel";
import { useParams } from "next/navigation";

export default function ChatPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    // For MVP, using static IDs. In a real app, these would come from user context and DB.
    const orgId = "mock-org-id";
    const threadId = "default-thread"; 
    
    return (
        <div>
            <ChatPanel orgId={orgId} projectId={projectId} threadId={threadId} />
        </div>
    );
}
