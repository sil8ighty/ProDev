/**
 * Dependencies and Support Layer Types
 * Track all external requirements needed for the product
 */

export enum DependencyType {
  API = 'api',
  HARDWARE = 'hardware',
  SOFTWARE = 'software',
  SERVICE = 'service',
  CONSUMABLE = 'consumable',
  TOOL = 'tool',
  LIBRARY = 'library',
  INFRASTRUCTURE = 'infrastructure',
}

export enum DependencyStatus {
  PLANNED = 'planned',
  EVALUATING = 'evaluating',
  APPROVED = 'approved',
  ACQUIRED = 'acquired',
  INTEGRATED = 'integrated',
  DEPRECATED = 'deprecated',
}

export enum CriticalityLevel {
  CRITICAL = 'critical',      // System cannot function without it
  HIGH = 'high',              // Major functionality depends on it
  MEDIUM = 'medium',          // Important but has alternatives
  LOW = 'low',                // Nice to have, easy to replace
}

/**
 * Base dependency interface
 */
export interface Dependency {
  id: string;
  name: string;
  type: DependencyType;
  description: string;
  status: DependencyStatus;
  criticality: CriticalityLevel;

  // Vendor/Provider information
  vendor: string;
  vendorContact?: string;
  vendorWebsite?: string;

  // Cost information
  cost: {
    model: 'free' | 'one-time' | 'subscription' | 'usage-based' | 'custom';
    amount?: string;
    currency?: string;
    billingCycle?: 'monthly' | 'annually' | 'per-use' | 'one-time';
    notes?: string;
  };

  // Lifecycle tracking
  dateAdded: Date;
  dateAcquired?: Date;
  dateIntegrated?: Date;
  dateDeprecated?: Date;

  // Relationships
  relatedMilestones: string[];  // Which milestones need this
  dependencies: string[];        // Other dependencies this depends on
  alternatives: string[];        // Alternative options considered

  // Documentation
  documentation: {
    setupGuide?: string;
    apiDocs?: string;
    notes: string[];
  };

  // Monitoring
  version?: string;
  lastUpdated?: Date;
  updateFrequency?: string;
  maintenanceSchedule?: string;

  // Risks and considerations
  risks: string[];
  limitations: string[];
  licenseType?: string;
  licenseExpiry?: Date;

  // Custom metadata
  metadata: Record<string, any>;
}

/**
 * API-specific dependency
 */
export interface APIDependency extends Dependency {
  type: DependencyType.API;
  apiDetails: {
    endpoint: string;
    authentication: 'api-key' | 'oauth' | 'basic-auth' | 'none' | 'custom';
    rateLimit?: string;
    uptime?: string;
    latency?: string;
  };
}

/**
 * Hardware-specific dependency
 */
export interface HardwareDependency extends Dependency {
  type: DependencyType.HARDWARE;
  hardwareDetails: {
    model?: string;
    specifications?: string;
    quantity: number;
    supplier?: string;
    leadTime?: string;
    warrantyInfo?: string;
  };
}

/**
 * Software-specific dependency
 */
export interface SoftwareDependency extends Dependency {
  type: DependencyType.SOFTWARE;
  softwareDetails: {
    version: string;
    platform: string[];
    repository?: string;
    packageManager?: string;
    installCommand?: string;
  };
}

/**
 * Service-specific dependency (cloud services, SaaS, etc.)
 */
export interface ServiceDependency extends Dependency {
  type: DependencyType.SERVICE;
  serviceDetails: {
    serviceTier?: string;
    region?: string;
    uptime?: string;
    supportLevel?: string;
    dataLocation?: string;
  };
}

/**
 * Consumable-specific dependency (materials, supplies)
 */
export interface ConsumableDependency extends Dependency {
  type: DependencyType.CONSUMABLE;
  consumableDetails: {
    unit: string;
    quantityNeeded: number;
    reorderThreshold?: number;
    shelfLife?: string;
    storageRequirements?: string;
  };
}

/**
 * Complete dependencies container
 */
export interface DependenciesLayer {
  dependencies: Dependency[];

  // Summary statistics
  summary: {
    total: number;
    byType: Record<DependencyType, number>;
    byStatus: Record<DependencyStatus, number>;
    byCriticality: Record<CriticalityLevel, number>;
    totalMonthlyCost: number;
    totalOneTimeCost: number;
  };

  // Tracking
  lastReviewed?: Date;
  nextReviewDate?: Date;
  responsiblePerson?: string;
}

/**
 * Dependency evaluation criteria
 */
export interface DependencyEvaluation {
  dependencyId: string;
  evaluatedBy: string;
  evaluationDate: Date;

  criteria: {
    costEffectiveness: number;      // 1-5 rating
    reliability: number;             // 1-5 rating
    documentation: number;           // 1-5 rating
    communitySupport: number;        // 1-5 rating
    securityCompliance: number;      // 1-5 rating
    performanceRating: number;       // 1-5 rating
  };

  pros: string[];
  cons: string[];
  recommendation: 'approve' | 'reject' | 'needs-review';
  notes: string;
}

/**
 * Dependency incident tracking
 */
export interface DependencyIncident {
  id: string;
  dependencyId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dateOccurred: Date;
  dateResolved?: Date;
  impact: string;
  resolution?: string;
  preventiveMeasures: string[];
}
