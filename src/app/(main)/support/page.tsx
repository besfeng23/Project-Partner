import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SupportPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Support
        </h1>
        <p className="text-muted-foreground">
          Have a question or need help? Fill out the form below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Our team will get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="How can we help?" className="min-h-[120px]" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit Ticket</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
