"use client";

import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFirebaseClientError, getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/context/auth-provider";
import type { Project } from "@/lib/types";
import { ArrowRight, PlusCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppError } from "@/components/app-error";

function NewProjectDialog({ orgId }: { orgId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const { toast } = useToast();

    const handleCreateProject = async () => {
        if (!name.trim()) {
            toast({
                variant: "destructive",
                title: "Project name is required.",
            });
            return;
        }

        const projectsRef = collection(db, `orgs/${orgId}/projects`);
        try {
            await addDoc(projectsRef, {
                name,
                status: 'planning',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            toast({
                title: "Project Created",
                description: `Project "${name}" has been successfully created.`,
            });
            setIsOpen(false);
            setName("");
        } catch (error: any) {
            console.error("Error creating project:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not create the project.",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    New Project
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input 
                        id="project-name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Q3 Marketing Campaign"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateProject}>Create Project</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ProjectsPage() {
  const { user } = useAuth();
  // For now, we use a mock orgId. This would come from user's session/claims in a real app.
  const orgId = "mock-org-id";
  const firebaseError = getFirebaseClientError();
  const db = getFirebaseDb();
  const projectsRef = db ? collection(db, `orgs/${orgId}/projects`) : null;
  const [snapshot, loading, error] = useCollection(projectsRef);

  if (firebaseError) {
    return <AppError title="Could not load projects" message={firebaseError.message} />;
  }

  if (!db) {
    return <AppError title="Could not load projects" message={'Firebase client is unavailable.'} />;
  }

  const projects = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects or create a new one.
          </p>
        </div>
        {user && <NewProjectDialog orgId={orgId} />}
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <AppError title="Error loading projects" message={error.message} />}
      
      {!loading && projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold">No Projects Yet</h3>
          <p className="text-muted-foreground mb-4">Create your first project to get started.</p>
          {user && <NewProjectDialog orgId={orgId} />}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={project.id} className="hover:border-primary/80 transition-colors flex flex-col group">
            <CardHeader>
              <CardTitle className="font-headline">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 capitalize">
                {project.status === 'active' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                {project.status}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Progress</p>
                <Progress value={(index + 1) * 35} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {project.updatedAt?.toDate().toLocaleDateString() || "N/A"}
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
