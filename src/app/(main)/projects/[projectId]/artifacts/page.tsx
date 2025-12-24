import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function ArtifactsPage() {
  return (
    <div className="space-y-4">
       <div className="flex items-center justify-end">
        <Button>
          <PlusCircle />
          Add Artifact
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Artifacts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will list project artifacts like links, notes, and uploaded files. This feature is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
