export type UserRole = 'admin' | 'member' | 'viewer';

export interface Org {
  id: string;
  name: string;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  role: UserRole;
  displayName: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  connectors: {
    githubRepoUrl?: string;
    vercelProjectId?: string;
  };
  health: {
    lastDeployAt?: Date;
    lastWebhookAt?: Date;
    lastAiRunAt?: Date;
    lastDeployUrl?: string;
  };
}

export type TaskStatus = 'backlog' | 'doing' | 'done';
export type TaskPriority = 'p0' | 'p1' | 'p2';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  acceptanceCriteria: string[];
  blocked: boolean;
  source: 'human' | 'ai';
  createdAt: Date;
  updatedAt: Date;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  createdAt: Date;
  source: 'human' | 'ai';
  supersedesDecisionId?: string;
}

export interface Constraint {
  id: string;
  text: string;
  createdAt: Date;
  source: 'human' | 'ai';
}

export type ArtifactType = 'link' | 'file' | 'note' | 'prompt' | 'spec';

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  url?: string;
  text?: string;
  storagePath?: string;
  createdAt: Date;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  writtenToMemory: boolean;
}
