"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, Timestamp, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFirebaseDb } from "@/lib/firebase";
import type { Decision } from "@/lib/types";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { AppError } from "@/components/app-error";

const ORG_ID = "default";

function NewDecisionDialog({ orgId, projectId }: { orgId: string, projectId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const [decision, setDecision] = useState("");
    const [consequences, setConsequences] = useState("");
    const { user } = useAuth();
    const { toast } = useToast();
    const db = getFirebaseDb();

    const handleSubmit = async () => {
        if (!user || !title || !context || !decision || !consequences || !db) {
            toast({
                variant: "destructive",
                title: "Missing fields",
                description: "Please fill out all fields to log a decision.",
            });
            return;
        }

        const decisionsRef = collection(db, `orgs/${orgId}/projects/${projectId}/decisions`);
        
        try {
            await addDoc(decisionsRef, {
                title,
                context,
                decision,
                consequences,
                createdAt: serverTimestamp(),
                createdByUid: user.uid,
                source: 'human',
            });

            toast({
                title: "Decision Logged",
                description: `The decision "${title}" has been successfully logged.`,
            });
            setIsOpen(false);
            // Reset form
            setTitle("");
            setContext("");
            setDecision("");
            setConsequences("");

        } catch (error: any) {
            console.error("Error logging decision:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Could not log the decision.",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    Log Decision
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Log a New Decision</DialogTitle>
                    <DialogDescription>
                        Record an important project decision for future reference. Decisions are append-only.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="context" className="text-right">Context</Label>
                        <Textarea id="context" value={context} onChange={(e) => setContext(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="decision" className="text-right">Decision</Label>
                        <Textarea id="decision" value={decision} onChange={(e) => setDecision(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="consequences" className="text-right">Consequences</Label>
                        <Textarea id="consequences" value={consequences} onChange={(e) => setConsequences(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Log Decision</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function DecisionsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const db = getFirebaseDb();

  const decisionsRef = db ? collection(db, `orgs/${ORG_ID}/projects/${projectId}/decisions`) : null;
  const q = decisionsRef ? query(decisionsRef, orderBy("createdAt", "desc")) : null;
  const [snapshot, loading, error] = useCollection(q);

  if (!db) {
    return <AppError title="Could not load decisions" message={'Firebase client is unavailable.'} />;
  }

  const decisions = snapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Decision)) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <NewDecisionDialog orgId={ORG_ID} projectId={projectId} />
      </div>
      {loading && <p>Loading decisions...</p>}
      {error && <AppError title="Error loading decisions" message={error.message} />}
      {!loading && decisions.length === 0 && (
          <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No Decisions Logged</h3>
              <p className="text-muted-foreground">Log your first project decision to get started.</p>
          </div>
      )}
      <div className="space-y-6">
        {decisions.map((decision) => (
          <Card key={decision.id}>
            <CardHeader>
              <CardTitle className="font-headline">{decision.title}</CardTitle>
              <CardDescription>
                Logged on {decision.createdAt ? format((decision.createdAt as Timestamp).toDate(), "MMMM d, yyyy") : "unknown date"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">Context</h4>
                <p className="text-muted-foreground text-sm">{decision.context}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Decision</h4>
                <p className="text-muted-foreground text-sm">{decision.decision}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Consequences</h4>
                <p className="text-muted-foreground text-sm">{decision.consequences}</p>
              </div>
            </CardContent>
            {decision.supersedesDecisionId && (
                <CardFooter>
                    <p className="text-xs text-muted-foreground">Supersedes decision: {decision.supersedesDecisionId}</p>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
