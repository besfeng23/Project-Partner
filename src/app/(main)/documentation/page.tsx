import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocumentationPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Documentation
        </h1>
        <p className="text-muted-foreground">
          Everything you need to know about using Project Partner.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to Project Partner! This documentation will guide you through the features and functionalities of the application.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Core Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
           <ul className="list-disc pl-6 space-y-2">
            <li><strong>Projects:</strong> The main container for all your work.</li>
            <li><strong>Tasks:</strong> Actionable items within a project.</li>
            <li><strong>Decisions:</strong> A log of important choices made.</li>
            <li><strong>AI Partner:</strong> Your copilot for planning, unblocking, and optimizing your project.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
