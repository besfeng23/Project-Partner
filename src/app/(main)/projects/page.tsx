import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProjects } from "@/lib/mock-data";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects or create a new one.
          </p>
        </div>
        <Button>
          <PlusCircle />
          New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Link href={`/projects/${project.id}/tasks`} key={project.id}>
            <Card className="hover:border-primary transition-colors h-full flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{project.name}</CardTitle>
                <CardDescription>Status: {project.status}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Last updated: {project.updatedAt.toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                 <Button variant="secondary" className="w-full">View Project</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
