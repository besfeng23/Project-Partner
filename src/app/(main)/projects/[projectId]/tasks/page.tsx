"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useToast } from "@/hooks/use-toast";
import type { TaskPriority } from "@/lib/types";

const ORG_ID = "default";

function NewTaskDialog({ orgId, projectId }: { orgId: string; projectId: string }) {
    const { idToken } = useAuth();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("p2");

    const handleAddTask = async () => {
        if (!title || !idToken) {
            toast({ variant: "destructive", title: "Title is required." });
            return;
        }

        try {
            // Note: This API route doesn't exist yet but will be created.
            const response = await fetch(`/api/orgs/${orgId}/projects/${projectId}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    status: 'backlog',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create task.");
            }

            toast({ title: "Task Created", description: `Task "${title}" has been added to the backlog.` });
            setIsOpen(false);
            setTitle("");
            setDescription("");
            setPriority("p2");
        } catch (error: any) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Task</DialogTitle>
                    <DialogDescription>Fill in the details for the new task.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                            <SelectTrigger id="priority">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="p0">P0 (Highest)</SelectItem>
                                <SelectItem value="p1">P1 (High)</SelectItem>
                                <SelectItem value="p2">P2 (Medium)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddTask}>Add Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function TasksPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <NewTaskDialog orgId={ORG_ID} projectId={projectId} />
      </div>
      <KanbanBoard orgId={ORG_ID} projectId={projectId} />
    </div>
  );
}
