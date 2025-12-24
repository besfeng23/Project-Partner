"use client"

import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { getFirebaseClientError, getFirebaseDb } from "@/lib/firebase";
import type { Task, TaskStatus } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useToast } from "@/hooks/use-toast";
import { AppError } from "./app-error";

const KanbanCard = ({ task, index }: { task: Task, index: number }) => (
    <Draggable draggableId={task.id} index={index}>
        {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <Card className="hover:border-primary/80 transition-colors cursor-grab active:cursor-grabbing">
                    <CardContent className="p-4 space-y-2">
                        <p className="font-semibold leading-tight">{task.title}</p>
                        <div className="flex items-center gap-2">
                            <Badge 
                                variant={task.priority === 'p0' ? 'destructive' : task.priority === 'p1' ? 'secondary' : 'outline'}
                                className={cn(task.priority === 'p1' && 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30')}
                            >
                                {task.priority.toUpperCase()}
                            </Badge>
                            {task.blocked && <Badge variant="destructive" className="bg-orange-600/80">Blocked</Badge>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
    </Draggable>
);

const KanbanColumn = ({ columnId, title, tasks }: { columnId: TaskStatus, title: string, tasks: Task[] }) => (
    <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold font-headline capitalize">{title}</h2>
        <Droppable droppableId={columnId}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                        "space-y-4 rounded-lg bg-secondary/50 p-4 h-full min-h-[200px] transition-colors",
                        snapshot.isDraggingOver && "bg-primary/20"
                    )}
                >
                    {tasks.length > 0 ? tasks.map((task, index) => (
                        <KanbanCard key={task.id} task={task} index={index} />
                    )) : (
                        !snapshot.isDraggingOver && <p className="text-sm text-muted-foreground p-4 text-center">No tasks</p>
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </div>
);

export function KanbanBoard({ orgId, projectId }: { orgId: string, projectId: string }) {
    const firebaseError = getFirebaseClientError();
    const db = getFirebaseDb();
    const { toast } = useToast();

    const tasksRef = db ? collection(db, `orgs/${orgId}/projects/${projectId}/tasks`) : null;
    const q = tasksRef ? query(tasksRef, orderBy("updatedAt", "desc")) : null;
    const [snapshot, loading, error] = useCollection(q);

    if (firebaseError) {
        return <AppError title="Could not load tasks" message={firebaseError.message} />;
    }

    if (!db) {
        return <AppError title="Could not load tasks" message={'Firebase client is unavailable.'} />;
    }

    const tasks = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)) || [];

    const tasksByStatus = {
        backlog: tasks.filter(t => t.status === 'backlog'),
        doing: tasks.filter(t => t.status === 'doing'),
        done: tasks.filter(t => t.status === 'done'),
    };
    
    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as TaskStatus;
        const taskRef = doc(db, `orgs/${orgId}/projects/${projectId}/tasks/${draggableId}`);
        
        try {
            await updateDoc(taskRef, {
                status: newStatus,
                updatedAt: new Date() // Use client-side timestamp for optimistic update
            });
            toast({
                title: "Task Updated",
                description: `Task moved to "${newStatus}".`
            });
        } catch (err: any) {
            console.error("Failed to update task status:", err);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update the task's status."
            });
            // NOTE: Here you might want to revert the optimistic UI update if you were managing state manually
        }
    };
    
    if (loading) return <p>Loading tasks...</p>;
    if (error) return <AppError title="Error loading tasks" message={error.message} />;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn columnId="backlog" title="Backlog" tasks={tasksByStatus.backlog} />
                <KanbanColumn columnId="doing" title="Doing" tasks={tasksByStatus.doing} />
                <KanbanColumn columnId="done" title="Done" tasks={tasksByStatus.done} />
            </div>
        </DragDropContext>
    )
}
