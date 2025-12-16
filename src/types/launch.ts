export interface Launch {
  id: string;
  name: string;
  description: string;
  launchDate: Date;
  status: LaunchStatus;
  completionPercentage: number;
  riskLevel: RiskLevel;
  team: Team;
  artifacts: Artifact[];
  content: Content[];
  milestones: Milestone[];
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  owner: string;
  status: ArtifactStatus;
  source: DataSource;
  sourceUrl?: string;
  targetDate: Date;
  actualDate?: Date;
  description?: string;
}

export interface Content {
  id: string;
  name: string;
  type: ContentType;
  owner: string;
  status: ContentStatus;
  approvalChain: ApprovalStep[];
  targetDate: Date;
  actualDate?: Date;
  description?: string;
  linkedArtifacts: string[];
  priority: Priority;
}

export interface ApprovalStep {
  id: string;
  approver: string;
  role: string;
  status: ApprovalStatus;
  approvedAt?: Date;
  reviewStartDate?: Date;
  approvalDueDate?: Date;
  comments?: string;
  order: number;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  status: MilestoneStatus;
  dependencies: string[];
  assignee: string;
}

export enum LaunchStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  DELAYED = 'delayed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum Team {
  MARKETING = 'marketing',
  PRODUCT = 'product',
  ENGINEERING = 'engineering',
  SALES = 'sales',
  SUCCESS = 'success'
}

export enum ArtifactType {
  DEMO = 'demo',
  SDK = 'sdk',
  DOCUMENTATION = 'documentation',
  RESEARCH_PAPER = 'research_paper',
  BLOG_POST = 'blog_post',
  WEBINAR = 'webinar',
  WEBSITE = 'website',
  API = 'api'
}

export enum ContentStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  REJECTED = 'rejected'
}

export enum ArtifactStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  TESTING = 'testing',
  COMPLETED = 'completed',
  READY_TO_PUBLISH = 'ready to publish',
  PUBLISHED = 'published',
  BLOCKED = 'blocked'
}

export enum ContentType {
  BLOG_POST = 'blog_post',
  RESEARCH_PAPER = 'research_paper',
  DEMO = 'demo',
  WEBINAR = 'webinar',
  ANNOUNCEMENT = 'announcement',
  SOCIAL_MEDIA = 'social_media',
  EMAIL = 'email',
  PRESS_RELEASE = 'press_release'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SKIPPED = 'skipped',
  OVERDUE = 'overdue'
}

export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum DataSource {
  JIRA = 'jira',
  AIRTABLE = 'airtable',
  CONFLUENCE = 'confluence',
  GITHUB = 'github',
  SHAREPOINT = 'sharepoint',
  MANUAL = 'manual'
}

export interface DataSourceConfig {
  source: DataSource;
  endpoint?: string;
  apiKey?: string;
  projectId?: string;
  boardId?: string;
  lastSync?: Date;
  syncStatus: 'connected' | 'disconnected' | 'error';
}
