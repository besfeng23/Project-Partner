import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Decision } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { GanttChart } from "lucide-react";

interface DecisionSummaryCardProps {
    decisions: Decision[];
}

export function DecisionSummaryCard({ decisions }: DecisionSummaryCardProps) {
    const recentDecisions = decisions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 3);

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
                    <GanttChart className="h-5 w-5 text-muted-foreground" />
                    Recent Decisions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentDecisions.length > 0 ? recentDecisions.map(decision => (
                        <div key={decision.id}>
                            <p className="text-sm font-medium">{decision.title}</p>
                            <p className="text-sm text-muted-foreground">{formatDistanceToNow(decision.createdAt, { addSuffix: true })}</p>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">No decisions logged yet.</p>}
                </div>
            </CardContent>
        </Card>
    );
}
