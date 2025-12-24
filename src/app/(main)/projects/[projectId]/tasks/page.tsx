import { KanbanBoard } from "@/components/kanban-board";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button>
            <PlusCircle />
            Add Task
        </Button>
      </div>
      <KanbanBoard />
    </div>
  );
}
