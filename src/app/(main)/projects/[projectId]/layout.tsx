"use client"

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProjects } from "@/lib/mock-data";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

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
  const project = mockProjects.find(p => p.id === projectId) ?? mockProjects[0];
  
  const basePath = `/projects/${projectId}`;
  const activeTab = pathname.substring(basePath.length) || "";

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
      <Card>
        {children}
      </Card>
    </div>
  );
}
