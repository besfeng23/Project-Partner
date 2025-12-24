import { RecommendedActionCard } from "@/components/dashboard/recommended-action-card";
import { TaskSummaryCard } from "@/components/dashboard/task-summary-card";
import { DecisionSummaryCard } from "@/components/dashboard/decision-summary-card";
import { ConnectionHealthCard } from "@/components/dashboard/connection-health-card";
import { mockProjects, mockTasks, mockDecisions } from "@/lib/mock-data";

export default function DashboardPage() {
  // In a real app, you would fetch this data based on the selected project
  const currentProject = mockProjects[0];
  const tasks = mockTasks;
  const decisions = mockDecisions;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {currentProject.name} Dashboard
        </h1>
        <p className="text-muted-foreground">
          Here's your project's status at a glance.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecommendedActionCard />
        <TaskSummaryCard tasks={tasks} />
        <div className="col-span-1 flex flex-col gap-6">
          <DecisionSummaryCard decisions={decisions} />
          <ConnectionHealthCard project={currentProject} />
        </div>
      </div>
    </div>
  );
}
