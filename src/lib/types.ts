import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'member' | 'viewer';

export interface Org {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export interface OrgMembership {
  uid: string;
  role: UserRole;
  displayName: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'planning' | 'paused' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  health?: {
    lastDeployAt?: Timestamp;
    lastWebhookAt?: Timestamp;
    lastAiRunAt?: Timestamp;
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
  blockedReason?: string;
  source: 'human' | 'ai';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdByUid: string;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  createdAt: Timestamp;
  createdByUid: string;
  source: 'human' | 'ai';
  supersedesDecisionId?: string;
}

export interface Constraint {
  id: string;
  text: string;
  createdAt: Timestamp;
  source: 'human' | 'ai';
  createdByUid: string;
}

export type ArtifactType = 'link' | 'file' | 'note' | 'prompt' | 'spec';

export interface Artifact {
  id:string;
  type: ArtifactType;
  title: string;
  url?: string;
  text?: string;
  storagePath?: string;
  createdAt: Timestamp;
  createdByUid: string;
}

export interface AuditEvent {
    id: string;
    eventType: string;
    payload: Record<string, any>;
    createdAt: Timestamp;
    actorUid: string;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Timestamp;
  writtenToMemory: boolean;
}

export interface VercelConnector {
    vercelProjectId: string;
    vercelTeamId?: string;
    connectedAt: Timestamp;
    lastCheckedAt: Timestamp;
    lastStatus: 'connected' | 'error';
    lastError?: string;
}
