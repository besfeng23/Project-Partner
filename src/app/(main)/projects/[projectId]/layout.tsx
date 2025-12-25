"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { getFirebaseClientError, getFirebaseDb } from "@/lib/firebase";
import type { Project } from "@/lib/types";
import type { ReactNode } from "react";
import { AppError } from "@/components/app-error";

const projectTabs = [
  { name: "Overview", href: "" },
  { name: "Tasks", href: "/tasks" },
  { name: "Decisions", href: "/decisions" },
  { name: "Artifacts", href: "/artifacts" },
  { name: "AI Partner", href: "/chat" },
];

export default function ProjectLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string;
  // Canonical org-scoped path for this app.
  const orgId = "default";
  const firebaseError = getFirebaseClientError();
  const db = getFirebaseDb();

  const projectRef = db ? doc(db, `orgs/${orgId}/projects/${projectId}`) : null;
  const [snapshot, loading, error] = useDocument(projectRef);

  if (firebaseError) {
    return <AppError title="Could not load project" message={firebaseError.message} />;
  }

  if (!db) {
    return <AppError title="Could not load project" message={'Firebase client is unavailable.'} />;
  }
  
  const project = snapshot?.exists() ? { id: snapshot.id, ...snapshot.data() } as Project : null;

  const basePath = `/projects/${projectId}`;
  // Determine active tab by finding the most specific match
  const activeTab = projectTabs.slice().reverse().find(tab => pathname.startsWith(`${basePath}${tab.href}`))?.href ?? "";
  
  if (loading) {
    return <p>Loading project...</p>
  }

  if (error) {
    return <AppError title="Error loading project" message={error.message} />
  }
  
  if (!project) {
    return <p>Project not found.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground">Project details and management.</p>
      </div>
      <Tabs value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {projectTabs.map((tab) => (
             <TabsTrigger value={tab.href} key={tab.name} asChild>
                <Link href={`${basePath}${tab.href}`}>{tab.name}</Link>
             </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div>
        {children}
      </div>
    </div>
  );
}
