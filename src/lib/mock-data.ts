import type { Project, Task, Decision, TaskStatus, TaskPriority } from './types';

export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'AI Copilot V2',
    status: 'Active',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date(),
    connectors: {
      githubRepoUrl: 'https://github.com/example/copilot-v2',
      vercelProjectId: 'prj_vercel_123',
    },
    health: {
      lastDeployAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      lastWebhookAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      lastAiRunAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      lastDeployUrl: 'https://copilot-v2-example.vercel.app'
    },
  },
  {
    id: 'proj_2',
    name: 'Data Pipeline Refactor',
    status: 'Planning',
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date(),
    connectors: {},
    health: {},
  },
];

const createTask = (id: number, title: string, status: TaskStatus, priority: TaskPriority, blocked: boolean): Task => ({
  id: `task_${id}`,
  title,
  description: `Description for ${title}`,
  status,
  priority,
  acceptanceCriteria: ['Criteria 1', 'Criteria 2'],
  blocked,
  source: Math.random() > 0.5 ? 'ai' : 'human',
  createdAt: new Date(Date.now() - id * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
});

export const mockTasks: Task[] = [
  createTask(1, 'Setup CI/CD pipeline for the new service', 'doing', 'p0', true),
  createTask(2, 'Design database schema for user profiles', 'doing', 'p1', false),
  createTask(3, 'Implement authentication endpoints', 'backlog', 'p0', false),
  createTask(4, 'Develop UI for the dashboard', 'backlog', 'p1', false),
  createTask(5, 'Integrate with Stripe for payments', 'backlog', 'p2', false),
  createTask(6, 'Write end-to-end tests for login flow', 'done', 'p1', false),
  createTask(7, 'Deploy staging environment on Vercel', 'done', 'p0', false),
];

export const mockDecisions: Decision[] = [
    {
        id: 'dec_1',
        title: 'Adopted PostgreSQL over MongoDB',
        context: 'We needed strong transactional support for financial data.',
        decision: 'Use PostgreSQL for the primary database.',
        consequences: 'Requires more upfront schema design but ensures data integrity. Less flexibility for unstructured data.',
        createdAt: new Date('2023-10-05'),
        source: 'human'
    },
    {
        id: 'dec_2',
        title: 'Switched to Genkit for AI Flows',
        context: 'Initial implementation with direct API calls was becoming hard to manage and trace.',
        decision: 'Refactor all AI calls to use Genkit flows for better observability and management.',
        consequences: 'Increased initial setup time but simplifies long-term maintenance and debugging of AI features.',
        createdAt: new Date('2023-10-20'),
        source: 'ai'
    }
];
