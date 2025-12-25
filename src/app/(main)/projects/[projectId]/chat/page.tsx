"use client";

import { ChatPanel } from "@/components/chat-panel";
import { useParams } from "next/navigation";

const ORG_ID = "default";

export default function ChatPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    // For MVP, using static IDs. In a real app, this would come from user context and DB.
    const threadId = "default-thread"; 
    
    return (
        <div>
            <ChatPanel orgId={ORG_ID} projectId={projectId} threadId={threadId} />
        </div>
    );
}
