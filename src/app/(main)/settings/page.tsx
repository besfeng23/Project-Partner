

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { doc, setDoc } from "firebase/firestore";
import { getFirebaseClientError, getFirebaseDb } from "@/lib/firebase";
import { AppError } from "@/components/app-error";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [vercelProjectId, setVercelProjectId] = useState('');
  const firebaseError = getFirebaseClientError();
  const db = getFirebaseDb();

  if (firebaseError || !db) {
    return <AppError title="Unable to load settings" message={firebaseError?.message ?? 'Firebase client is unavailable.'} />;
  }
  
  // Hardcoded for now
  const orgId = "default";
  const projectId = "proj_1";

  const handleVercelConnect = async () => {
    if (!user || !vercelProjectId) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please enter a Vercel Project ID.",
        });
        return;
    }
    
    // In a real app, this would be an API call to a secure backend endpoint
    // For now, writing directly to Firestore from client for simplicity
    try {
        const connectorRef = doc(db, `orgs/${orgId}/projects/${projectId}/connectors/vercel`);
        await setDoc(connectorRef, {
            vercelProjectId,
            connectedAt: new Date(),
            connectedBy: user.uid,
        }, { merge: true });

        toast({
          title: "Vercel Connection Updated",
          description: "Your Vercel Project ID has been saved.",
        });
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Connection Failed",
            description: error.message || "Could not save Vercel Project ID.",
        });
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization, members, and integrations.
        </p>
      </div>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your organization's settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Organization settings form will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Roles</CardTitle>
              <CardDescription>Manage member access and roles.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Member list and role management will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Connectors</CardTitle>
              <CardDescription>Connect with GitHub and Vercel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                  <h3 className="text-lg font-medium font-headline">Vercel</h3>
                  <p className="text-sm text-muted-foreground">Connect your Vercel project to sync deployments.</p>
               </div>
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vercel-project-id">Vercel Project ID</Label>
                  <Input 
                    id="vercel-project-id" 
                    placeholder="prj_..." 
                    value={vercelProjectId}
                    onChange={(e) => setVercelProjectId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">This is used to fetch project details from the Vercel API. The access token is configured on the server.</p>
                </div>
               </div>
                <CardFooter className="border-t px-0 py-4">
                    <Button onClick={handleVercelConnect}>Connect Vercel</Button>
                </CardFooter>
                
                <Separator />

                <div>
                  <h3 className="text-lg font-medium font-headline">GitHub</h3>
                  <p className="text-sm text-muted-foreground">Connect your GitHub repository.</p>
               </div>
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-repo-url">GitHub Repository URL</Label>
                  <Input 
                    id="github-repo-url" 
                    placeholder="https://github.com/org/repo" 
                  />
                </div>
               </div>
               <CardFooter className="border-t px-0 py-4">
                 <Button>Connect GitHub</Button>
               </CardFooter>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
