"use client"

import { mockTasks } from "@/lib/mock-data";
import type { Task, TaskStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const KanbanColumn = ({ title, tasks }: { title: string, tasks: Task[] }) => (
    <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold font-headline capitalize">{title}</h2>
        <div className="space-y-4 rounded-lg bg-secondary/50 p-4 h-full">
            {tasks.length > 0 ? tasks.map(task => (
                <KanbanCard key={task.id} task={task} />
            )) : <p className="text-sm text-muted-foreground p-4 text-center">No tasks</p>}
        </div>
    </div>
);

const KanbanCard = ({ task }: { task: Task }) => (
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
);

export function KanbanBoard() {
    // In a real app, tasks would be fetched and state managed for drag-and-drop
    const tasksByStatus = {
        backlog: mockTasks.filter(t => t.status === 'backlog'),
        doing: mockTasks.filter(t => t.status === 'doing'),
        done: mockTasks.filter(t => t.status === 'done'),
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn title="Backlog" tasks={tasksByStatus.backlog} />
            <KanbanColumn title="Doing" tasks={tasksByStatus.doing} />
            <KanbanColumn title="Done" tasks={tasksByStatus.done} />
        </div>
    )
}
