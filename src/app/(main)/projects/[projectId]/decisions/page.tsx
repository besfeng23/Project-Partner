import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDecisions } from "@/lib/mock-data";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";

export default function DecisionsPage() {
  const sortedDecisions = [...mockDecisions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button>
          <PlusCircle />
          Log Decision
        </Button>
      </div>
      <div className="space-y-6">
        {sortedDecisions.map((decision) => (
          <Card key={decision.id}>
            <CardHeader>
              <CardTitle className="font-headline">{decision.title}</CardTitle>
              <CardDescription>
                Logged on {format(decision.createdAt, "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Context</h4>
                <p className="text-muted-foreground text-sm">{decision.context}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Decision</h4>
                <p className="text-muted-foreground text-sm">{decision.decision}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Consequences</h4>
                <p className="text-muted-foreground text-sm">{decision.consequences}</p>
              </div>
            </CardContent>
            {decision.supersedesDecisionId && (
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Supersedes decision: {decision.supersedesDecisionId}</p>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
