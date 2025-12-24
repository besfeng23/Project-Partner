import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Project, VercelConnector } from "@/lib/types";
import { CheckCircle2, GitBranch, Zap, XCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Timestamp } from "firebase/firestore";

interface ConnectionHealthCardProps {
    project: Project;
    vercelConnector?: VercelConnector | null;
}

const StatusItem = ({ label, connected, detail }: { label: string; connected: boolean; detail?: string }) => (
    <div className="flex items-center justify-between text-sm">
        <p className="flex items-center gap-2">
            {connected ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
            {label}
        </p>
        <p className={cn("text-muted-foreground", connected && "text-foreground")}>{detail ?? (connected ? 'Connected' : 'Not Connected')}</p>
    </div>
)

export function ConnectionHealthCard({ project, vercelConnector }: ConnectionHealthCardProps) {
    const formatDetail = (timestamp?: Timestamp) => {
        if (!timestamp) return 'Never';
        return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
    }

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                    Connection Health
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <StatusItem 
                    label="GitHub" 
                    connected={false} // Replace with real data
                />
                <StatusItem 
                    label="Vercel" 
                    connected={!!vercelConnector}
                />
                <StatusItem 
                    label="Last Deploy" 
                    connected={!!project.health?.lastDeployAt}
                    detail={formatDetail(project.health?.lastDeployAt)}
                />
                <StatusItem 
                    label="Last AI Run" 
                    connected={!!project.health?.lastAiRunAt}
                    detail={formatDetail(project.health?.lastAiRunAt)}
                />
            </CardContent>
        </Card>
    );
}
