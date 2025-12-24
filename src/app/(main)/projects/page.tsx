import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProjects } from "@/lib/mock-data";
import { ArrowRight, PlusCircle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

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
        {mockProjects.map((project, index) => (
          <Card key={project.id} className="hover:border-primary/80 transition-colors flex flex-col group">
            <CardHeader>
              <CardTitle className="font-headline">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {project.status === 'Active' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                {project.status}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Progress</p>
                <Progress value={(index + 1) * 35} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {project.updatedAt.toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
               <Button variant="outline" className="w-full" asChild>
                 <Link href={`/projects/${project.id}/tasks`}>
                    View Project
                    <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                 </Link>
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
