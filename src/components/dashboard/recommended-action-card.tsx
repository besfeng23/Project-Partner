import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from "lucide-react";

export function RecommendedActionCard() {
    return (
        <Card className="col-span-1 lg:col-span-3 bg-primary/10 border-primary/50 flex flex-col justify-between">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium font-headline text-primary">Recommended Next Action</CardTitle>
                    <Lightbulb className="h-5 w-5 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-2xl lg:text-3xl font-bold font-headline text-foreground leading-tight">
                    Define acceptance criteria for "Implement authentication"
                </p>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    This is currently the highest priority (p0) task in the 'Doing' column and needs clear requirements to proceed.
                </p>
            </CardContent>
            <div className="p-6 pt-0">
                <Button>
                    Go to Task
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
}
