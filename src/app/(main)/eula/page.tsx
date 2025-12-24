import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EulaPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          End User License Agreement (EULA)
        </h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agreement to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            By using the Project Partner application ("App"), you agree to be bound by the terms of this End User License Agreement ("EULA"). If you do not agree to the terms of this EULA, do not use the App.
          </p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>License Grant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We grant you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the App for your personal, non-commercial purposes strictly in accordance with the terms of this Agreement.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restrictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
           <p>You agree not to, and you will not permit others to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose, or otherwise commercially exploit the App or make the App available to any third party.</li>
            <li>Modify, make derivative works of, disassemble, decrypt, reverse compile, or reverse engineer any part of the App.</li>
            <li>Remove, alter, or obscure any proprietary notice (including any notice of copyright or trademark) of ours or our affiliates, partners, suppliers, or the licensors of the App.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
