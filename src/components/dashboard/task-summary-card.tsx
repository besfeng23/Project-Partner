import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Task } from "@/lib/types";
import { AlertTriangle, ListTodo } from "lucide-react";

interface TaskSummaryCardProps {
    tasks: Task[];
}

const TaskItem = ({ task }: { task: Task }) => (
    <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium">{task.title}</p>
        <Badge variant={task.priority === 'p0' ? 'destructive' : 'secondary'} className="capitalize shrink-0">
            {task.priority}
        </Badge>
    </div>
)

export function TaskSummaryCard({ tasks }: TaskSummaryCardProps) {
    const nextUp = tasks.filter(t => t.status === 'backlog' && !t.blocked).slice(0, 3);
    const blockers = tasks.filter(t => t.blocked || (t.status === 'doing' && t.priority === 'p0')).slice(0, 3);

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-muted-foreground" />
                    Task Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Blockers & P0
                    </h3>
                    <div className="space-y-3">
                        {blockers.length > 0 ? blockers.map(task => <TaskItem key={task.id} task={task} />) : <p className="text-sm text-muted-foreground">No blockers. Keep up the momentum!</p>}
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Up (Backlog)</h3>
                    <div className="space-y-3">
                        {nextUp.length > 0 ? nextUp.map(task => <TaskItem key={task.id} task={task} />) : <p className="text-sm text-muted-foreground">Backlog is empty.</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
