import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export function RecommendedActionCard() {
    return (
        <Card className="col-span-1 md:col-span-3 bg-primary/10 border-primary/50 shadow-lg shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium font-headline text-primary">Recommended Next Action</CardTitle>
                <Lightbulb className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold font-headline text-foreground">
                    Define acceptance criteria for the "Implement authentication" task.
                </p>
                <p className="text-muted-foreground mt-2">
                    This is currently the highest priority (p0) task in the 'Doing' column and needs clear requirements to proceed.
                </p>
                <div className="mt-4 flex gap-2">
                    <Button>Go to Task</Button>
                    <Button variant="ghost">Dismiss</Button>
                </div>
            </CardContent>
        </Card>
    );
}
