// This will be the main dashboard page.
// For now, it redirects to the projects page.
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect('/projects');
}
