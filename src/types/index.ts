/**
 * Core type definitions for the Product Development Tracking System
 */

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export enum ProductType {
  SOFTWARE = 'software',
  HARDWARE = 'hardware',
  NON_TANGIBLE = 'non-tangible',
  HYBRID = 'hybrid'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  ON_HOLD = 'on-hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// ============================================================================
// LAYER 1: OVERVIEW/INVESTOR VIEW
// ============================================================================

export interface PRD {
  id: string;
  title: string;
  version: string;
  productType: ProductType;
  created: Date;
  lastUpdated: Date;

  // Core product information
  what: string;           // What is the product?
  why: string;            // Why are we building it?
  who: string;            // Who is it for?
  where: string;          // Where will it be used/deployed?
  when: string;           // Timeline and milestones

  // Market information
  market: {
    targetAudience: string;
    marketSize: string;
    competitors: string[];
    uniqueValueProposition: string;
  };

  // Business information
  business: {
    revenueModel: string;
    projectedRevenue?: string;
    estimatedCost?: string;
    roi?: string;
  };

  // Success metrics
  successMetrics: string[];

  // Constraints and assumptions
  constraints: string[];
  assumptions: string[];
}

export interface InvestorOverview {
  prd: PRD;
  currentStatus: ProjectStatus;
  milestones: Milestone[];
  highlights: string[];
  risks: string[];
  nextSteps: string[];
}

// ============================================================================
// LAYER 2: TECHNICAL/HANDOFF PACKAGE
// ============================================================================

export interface TechnicalPackage {
  id: string;
  projectId: string;
  version: string;
  created: Date;

  // Engineering documentation
  engineering: {
    architecture: string;
    technologies: string[];
    dependencies: string[];
    setupInstructions: string;
  };

  // File references (paths to actual files)
  files: {
    code: FileReference[];
    designs: FileReference[];
    diagrams: FileReference[];
    documentation: FileReference[];
  };

  // Intellectual Property
  intellectualProperty: {
    patents: string[];
    trademarks: string[];
    copyrights: string[];
    licenses: string[];
  };

  // Testing and quality
  testing: {
    testCoverage?: string;
    testResults: string[];
    qualityMetrics: Record<string, any>;
  };

  // Deployment information
  deployment?: {
    environments: string[];
    deploymentGuide: string;
    infrastructure: string;
  };
}

export interface FileReference {
  path: string;
  type: string;
  description: string;
  tags: string[];
  created: Date;
  lastModified: Date;
}

// ============================================================================
// LAYER 3: BEHIND-THE-SCENES
// ============================================================================

export interface Learning {
  id: string;
  projectId: string;
  title: string;
  content: string;
  category: LearningCategory;
  tags: string[];
  created: Date;
  relatedTo?: string[];  // IDs of related milestones, notes, etc.
}

export enum LearningCategory {
  SUCCESS = 'success',
  FAILURE = 'failure',
  INSIGHT = 'insight',
  TECHNIQUE = 'technique',
  DECISION = 'decision',
  PIVOT = 'pivot'
}

export interface Note {
  id: string;
  projectId: string;
  content: string;
  tags: string[];
  created: Date;
  lastUpdated: Date;
  attachments: string[];
}

export interface ExternalLink {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  created: Date;
}

export interface BehindTheScenes {
  learnings: Learning[];
  notes: Note[];
  links: ExternalLink[];
  failures: string[];
  unexpectedMoments: UnexpectedMoment[];
}

export interface UnexpectedMoment {
  id: string;
  projectId: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  resolution?: string;
  created: Date;
  milestoneId?: string;
}

// ============================================================================
// MILESTONES & MVP
// ============================================================================

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  isMVP: boolean;
  deliverables: string[];
  dependencies: string[];  // IDs of other milestones
  progress: number;  // 0-100
  blockers: string[];
}

// ============================================================================
// PROJECT
// ============================================================================

export interface Project {
  id: string;
  name: string;
  created: Date;
  lastUpdated: Date;
  status: ProjectStatus;

  // Three layers
  layer1: InvestorOverview;
  layer2: TechnicalPackage;
  layer3: BehindTheScenes;

  // Dependencies and Support
  dependencies: any; // Will be properly typed after importing from dependencies.ts

  // Milestones
  milestones: Milestone[];

  // Metadata
  tags: string[];
  team: string[];
}

// ============================================================================
// SLIDE DECK GENERATION
// ============================================================================

export interface SlideDeckConfig {
  type: 'time-based' | 'milestone-based' | 'on-demand';
  includeLayer1: boolean;
  includeLayer2: boolean;
  includeLayer3: boolean;
  milestoneIds?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  customSections?: string[];
}

export interface Slide {
  title: string;
  content: string[];
  type: 'title' | 'content' | 'data' | 'image';
  metadata?: Record<string, any>;
}

export interface SlideDeck {
  id: string;
  projectId: string;
  title: string;
  slides: Slide[];
  config: SlideDeckConfig;
  created: Date;
}

// ============================================================================
// WORKFLOW
// ============================================================================

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  order: number;
  guidance?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  currentStep: number;
}

// ============================================================================
// MODULE SYSTEM
// ============================================================================

export interface Module {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;

  initialize?: () => Promise<void>;
  destroy?: () => Promise<void>;
}

export interface ModuleRegistry {
  register(module: Module): void;
  unregister(moduleId: string): void;
  get(moduleId: string): Module | undefined;
  getAll(): Module[];
  enable(moduleId: string): void;
  disable(moduleId: string): void;
}

// Export all dependency types
export * from './dependencies';
