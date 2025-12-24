
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { toast } = useToast();
  const [vercelProjectId, setVercelProjectId] = useState('');
  const [vercelToken, setVercelToken] = useState('');
  const [customIntegrationApiKey, setCustomIntegrationApiKey] = useState('');

  const handleVercelConnect = () => {
    // In a real application, you would securely save this information
    // and verify the connection.
    toast({
      title: "Vercel Connection Updated",
      description: "Your Vercel Project ID has been saved.",
    });
  };

  const handleCustomIntegrationConnect = () => {
    // In a real application, you would securely save this information
    // and verify the connection.
    toast({
      title: "Custom Integration Connected",
      description: "Your API key has been saved.",
    });
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
              <CardDescription>Connect with GitHub, Vercel, and more.</CardDescription>
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
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="vercel-token">Vercel Access Token</Label>
                  <Input 
                    id="vercel-token" 
                    type="password"
                    placeholder="vck_..."
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                  />
                   <p className="text-xs text-muted-foreground">This is used to fetch project details from the Vercel API.</p>
                </div>
               </div>
                <CardFooter className="border-t px-0 py-4">
                    <Button onClick={handleVercelConnect}>Connect Vercel</Button>
                </CardFooter>
                
                <Separator />

                <div>
                  <h3 className="text-lg font-medium font-headline">Custom API Integration</h3>
                  <p className="text-sm text-muted-foreground">Set up a generic API integration.</p>
               </div>
               <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-integration-api-key">API Key</Label>
                  <Input 
                    id="custom-integration-api-key" 
                    type="password"
                    placeholder="Enter your API key" 
                    value={customIntegrationApiKey}
                    onChange={(e) => setCustomIntegrationApiKey(e.target.value)}
                  />
                </div>
               </div>
               <CardFooter className="border-t px-0 py-4">
                 <Button onClick={handleCustomIntegrationConnect}>Connect Integration</Button>
               </CardFooter>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
