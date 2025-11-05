/**
 * Comprehensive PRD Types - Part 2
 * Timeline, Budget, Manufacturing, Regulatory, Risk, GTM
 */

import { PriorityLevel, FeasibilityStatus } from './comprehensive-prd';

// ============================================================================
// TIMELINE & ROADMAP
// ============================================================================

export interface Timeline {
  // Overall project timeline
  projectStart: Date;
  mvpTarget: Date;
  betaTarget?: Date;
  launchTarget: Date;

  // Phases
  phases: DevelopmentPhase[];

  // Critical path
  criticalPath: CriticalPathItem[];

  // Milestones
  keyMilestones: KeyMilestone[];

  // Dependencies
  externalDependencies: ExternalDependency[];
}

export interface DevelopmentPhase {
  name: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  deliverables: string[];
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
}

export interface CriticalPathItem {
  task: string;
  duration: string;
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface KeyMilestone {
  name: string;
  date: Date;
  type: 'internal' | 'external' | 'regulatory' | 'launch';
  criteria: string[];
  importance: 'critical' | 'high' | 'medium';
}

export interface ExternalDependency {
  name: string;
  type: 'vendor' | 'partner' | 'regulatory' | 'certification' | 'other';
  impact: string;
  timeline: string;
  mitigation: string;
}

// ============================================================================
// BUDGET & RESOURCES
// ============================================================================

export interface BudgetAndResources {
  // Total budget
  totalBudget: number;
  currency: string;

  // Budget breakdown
  budgetBreakdown: BudgetBreakdown;

  // Funding
  funding: {
    source: string;
    amount: number;
    secured: boolean;
    conditions: string[];
  }[];

  // Resources
  resources: ResourcePlan;

  // ROI projection
  roiProjection: ROIProjection;
}

export interface BudgetBreakdown {
  // Development costs
  development: {
    engineering: number;
    design: number;
    prototyping: number;
    testing: number;
    tooling?: number;
    software_licenses: number;
    infrastructure: number;
    total: number;
  };

  // Manufacturing costs (if applicable)
  manufacturing?: {
    nre: number;  // Non-recurring engineering
    tooling: number;
    unitCost: number;
    minimumOrderQuantity: number;
    setupCosts: number;
    total: number;
  };

  // Marketing & Sales
  marketing: {
    branding: number;
    advertising: number;
    contentCreation: number;
    events: number;
    partnerships: number;
    total: number;
  };

  // Operations
  operations: {
    facilities: number;
    utilities: number;
    insurance: number;
    legal: number;
    accounting: number;
    humanResources: number;
    total: number;
  };

  // Certification & Compliance
  compliance?: {
    certifications: number;
    testing: number;
    legal: number;
    consultants: number;
    total: number;
  };

  // Contingency
  contingency: {
    percentage: number;
    amount: number;
    rationale: string;
  };
}

export interface ResourcePlan {
  // Team structure
  team: {
    internal: TeamMember[];
    external: ExternalResource[];
    contractors: Contractor[];
  };

  // Resource allocation
  allocation: ResourceAllocation[];

  // Hiring plan
  hiringPlan: HiringPlan[];
}

export interface TeamMember {
  role: string;
  count: number;
  requiredSkills: string[];
  responsibility: string;
  startDate: Date;
  fullTime: boolean;
  allocated: boolean;
}

export interface ExternalResource {
  type: 'agency' | 'consultant' | 'freelancer' | 'vendor';
  role: string;
  company?: string;
  scope: string;
  duration: string;
  cost: number;
}

export interface Contractor {
  specialty: string;
  count: number;
  duration: string;
  rate: number;
  scope: string;
}

export interface ResourceAllocation {
  resource: string;
  phase: string;
  allocation: string; // e.g., "50%", "full-time"
  startDate: Date;
  endDate: Date;
}

export interface HiringPlan {
  role: string;
  count: number;
  targetDate: Date;
  requiredBy: string; // Which milestone requires this
  status: 'not-started' | 'recruiting' | 'interviewing' | 'hired';
}

export interface ROIProjection {
  breakEvenPoint: string;
  year1: {
    revenue: number;
    costs: number;
    profit: number;
    roi: number;
  };
  year2: {
    revenue: number;
    costs: number;
    profit: number;
    roi: number;
  };
  year3: {
    revenue: number;
    costs: number;
    profit: number;
    roi: number;
  };
  assumptions: string[];
}

// ============================================================================
// MANUFACTURING & PRODUCTION
// ============================================================================

export interface ManufacturingRequirements {
  // Manufacturing strategy
  strategy: 'in-house' | 'contract-manufacturing' | 'hybrid';

  // Manufacturing location
  locations: ManufacturingLocation[];

  // Production process
  process: ProductionProcess;

  // Quality control
  qualityControl: QualityControl;

  // Supply chain
  supplyChain: SupplyChain;

  // Packaging
  packaging: PackagingRequirements;

  // Logistics
  logistics: LogisticsRequirements;

  // Scalability
  scalability: ManufacturingScalability;
}

export interface ManufacturingLocation {
  facility: string;
  location: string;
  type: 'owned' | 'leased' | 'contract-manufacturer';
  capabilities: string[];
  capacity: string;
  leadTime: string;
  qualifications: string[];
}

export interface ProductionProcess {
  steps: ProductionStep[];
  cycleTime: string;
  yield: string;
  automation: string;
  qualityCheckpoints: string[];
}

export interface ProductionStep {
  order: number;
  name: string;
  description: string;
  duration: string;
  equipment: string[];
  skills: string[];
  qualityChecks: string[];
}

export interface QualityControl {
  standards: string[];
  inspectionPlan: string;
  testingProtocol: string;
  acceptanceCriteria: string[];
  defectTracking: string;
  correctiveActions: string;
}

export interface SupplyChain {
  suppliers: Supplier[];
  leadTimes: Record<string, string>;
  inventoryStrategy: string;
  riskMitigation: string[];
  backupSuppliers: string[];
}

export interface Supplier {
  name: string;
  component: string;
  location: string;
  leadTime: string;
  moq: number;  // Minimum order quantity
  reliability: 'high' | 'medium' | 'low';
  cost: number;
  alternatives: string[];
}

export interface PackagingRequirements {
  primaryPackaging: string;
  secondaryPackaging: string;
  labeling: string[];
  barcoding: string;
  sustainability: string;
  regulations: string[];
}

export interface LogisticsRequirements {
  shipping: {
    methods: string[];
    carriers: string[];
    domesticLeadTime: string;
    internationalLeadTime: string;
  };
  warehousing: {
    locations: string[];
    capacity: string;
    temperature_control: boolean;
    security: string;
  };
  fulfillment: {
    strategy: 'in-house' | '3PL' | 'hybrid';
    provider?: string;
    sla: string;
  };
}

export interface ManufacturingScalability {
  currentCapacity: number;
  maxCapacity: number;
  scalingPlan: string;
  bottlenecks: string[];
  investments_needed: string[];
}

// ============================================================================
// REGULATORY & COMPLIANCE
// ============================================================================

export interface RegulatoryCompliance {
  // Industry-specific regulations
  regulations: Regulation[];

  // Certifications required
  certifications: Certification[];

  // Standards compliance
  standards: Standard[];

  // Testing requirements
  testing: TestingRequirement[];

  // Documentation requirements
  documentation: DocumentationRequirement[];

  // Approval process
  approvalProcess: ApprovalProcess[];

  // Ongoing compliance
  ongoingCompliance: OngoingCompliance;
}

export interface Regulation {
  name: string;
  jurisdiction: string;
  applicability: string;
  requirements: string[];
  timeline: string;
  cost: number;
  status: 'not-started' | 'in-progress' | 'submitted' | 'approved';
}

export interface Certification {
  name: string;
  certifyingBody: string;
  required: boolean;
  cost: number;
  timeline: string;
  requirements: string[];
  renewalPeriod?: string;
  status: 'not-started' | 'in-progress' | 'testing' | 'certified';
}

export interface Standard {
  name: string;
  version: string;
  applicability: string;
  requirements: string[];
  verification: string;
}

export interface TestingRequirement {
  testType: string;
  standard: string;
  laboratory: string;
  duration: string;
  cost: number;
  frequency: 'one-time' | 'periodic' | 'per-batch';
}

export interface DocumentationRequirement {
  documentType: string;
  purpose: string;
  required_by: string;
  template?: string;
  deadline: Date;
}

export interface ApprovalProcess {
  agency: string;
  processType: string;
  steps: string[];
  timeline: string;
  cost: number;
  riskOfDelay: 'low' | 'medium' | 'high';
}

export interface OngoingCompliance {
  reporting: string[];
  audits: string[];
  renewals: string[];
  monitoring: string[];
}

// ============================================================================
// RISK ASSESSMENT
// ============================================================================

export interface RiskAssessment {
  // Risk categories
  technical: Risk[];
  business: Risk[];
  market: Risk[];
  regulatory: Risk[];
  financial: Risk[];
  operational: Risk[];

  // Overall risk profile
  overallRisk: 'low' | 'medium' | 'high' | 'critical';

  // Risk mitigation strategy
  mitigationStrategy: string;
}

export interface Risk {
  id: string;
  category: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  severity: number;  // probability x impact (1-9 scale)

  // Mitigation
  mitigation: {
    strategy: string;
    actions: string[];
    cost: number;
    responsibility: string;
    status: 'not-started' | 'in-progress' | 'completed';
  };

  // Contingency
  contingency: {
    plan: string;
    trigger: string;
    actions: string[];
  };
}

// ============================================================================
// GO-TO-MARKET STRATEGY
// ============================================================================

export interface GoToMarketStrategy {
  // Launch strategy
  launchStrategy: {
    type: 'big-bang' | 'soft-launch' | 'phased' | 'beta';
    timeline: string;
    approach: string;
  };

  // Marketing strategy
  marketing: {
    positioning: string;
    messaging: string;
    channels: MarketingChannel[];
    campaigns: Campaign[];
    budget: number;
  };

  // Sales strategy
  sales: {
    approach: 'direct' | 'indirect' | 'hybrid';
    team: string;
    process: string;
    targets: SalesTarget[];
    enablement: string[];
  };

  // Distribution
  distribution: {
    channels: DistributionChannel[];
    partnerships: string[];
    coverage: string;
  };

  // Customer acquisition
  customerAcquisition: {
    strategy: string;
    cac: number;  // Customer acquisition cost
    ltv: number;  // Lifetime value
    channels: string[];
  };

  // Launch plan
  launchPlan: LaunchPlan;
}

export interface MarketingChannel {
  channel: string;
  tactics: string[];
  budget: number;
  expectedReach: string;
  expectedConversion: string;
}

export interface Campaign {
  name: string;
  objective: string;
  channels: string[];
  budget: number;
  timeline: string;
  kpis: string[];
}

export interface SalesTarget {
  period: string;
  units: number;
  revenue: number;
  segment: string;
}

export interface DistributionChannel {
  channel: string;
  type: 'direct' | 'retail' | 'online' | 'distributor' | 'reseller';
  coverage: string;
  margin: number;
  terms: string;
}

export interface LaunchPlan {
  prelaunch: LaunchActivity[];
  launch: LaunchActivity[];
  postlaunch: LaunchActivity[];
}

export interface LaunchActivity {
  activity: string;
  timeline: string;
  responsible: string;
  budget: number;
  success_criteria: string[];
}

// ============================================================================
// SUCCESS CRITERIA
// ============================================================================

export interface SuccessCriteria {
  // Product success metrics
  productMetrics: Metric[];

  // Business success metrics
  businessMetrics: Metric[];

  // User success metrics
  userMetrics: Metric[];

  // Technical success metrics
  technicalMetrics: Metric[];

  // Market success metrics
  marketMetrics: Metric[];

  // Validation checkpoints
  validationCheckpoints: ValidationCheckpoint[];
}

export interface Metric {
  name: string;
  description: string;
  target: string;
  measurement: string;
  frequency: string;
  threshold: {
    success: string;
    warning: string;
    failure: string;
  };
}

export interface ValidationCheckpoint {
  phase: string;
  criteria: string[];
  decision: 'go' | 'no-go' | 'pivot';
  date: Date;
  completed: boolean;
}

// ============================================================================
// CONSTRAINTS & ASSUMPTIONS
// ============================================================================

export interface ConstraintsAndAssumptions {
  constraints: Constraint[];
  assumptions: Assumption[];
  dependencies: Dependency[];
}

export interface Constraint {
  id: string;
  type: 'budget' | 'time' | 'technical' | 'regulatory' | 'resource' | 'market';
  description: string;
  impact: string;
  flexibility: 'none' | 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface Assumption {
  id: string;
  description: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  validated: boolean;
  validationMethod: string;
  risk_if_false: string;
}

export interface Dependency {
  id: string;
  description: string;
  type: 'internal' | 'external';
  owner: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  impact_if_delayed: string;
}

// ============================================================================
// PRD VALIDATION
// ============================================================================

export interface PRDValidation {
  completeness: number;  // 0-100%
  requiredFields: FieldValidation[];
  warnings: string[];
  blockers: string[];
  readyForDevelopment: boolean;
  lastValidated: Date;
}

export interface FieldValidation {
  field: string;
  required: boolean;
  completed: boolean;
  completeness: number;
  issues: string[];
}

// ============================================================================
// APPROVER
// ============================================================================

export interface Approver {
  name: string;
  role: string;
  approved: boolean;
  date?: Date;
  comments?: string;
}
export * from './comprehensive-prd';
