/**
 * Comprehensive Product Requirements Document (PRD) Types
 * Single source of truth for product definition across all industries
 */

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

export enum ProductCategory {
  SOFTWARE = 'software',
  SAAS = 'saas',
  HARDWARE_ELECTRONICS = 'hardware-electronics',
  HARDWARE_MECHANICAL = 'hardware-mechanical',
  CONSUMER_GOODS = 'consumer-goods',
  MEDICAL_DEVICE = 'medical-device',
  PHARMACEUTICAL = 'pharmaceutical',
  FOOD_BEVERAGE = 'food-beverage',
  AUTOMOTIVE = 'automotive',
  INDUSTRIAL = 'industrial',
  AEROSPACE = 'aerospace',
  IOT = 'iot',
  HYBRID = 'hybrid',
  SERVICE = 'service',
}

export enum DevelopmentPhase {
  CONCEPT = 'concept',
  FEASIBILITY = 'feasibility',
  DESIGN = 'design',
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
  LAUNCH = 'launch',
  MAINTENANCE = 'maintenance',
}

export enum PriorityLevel {
  CRITICAL = 'critical',      // Must have - product fails without it
  HIGH = 'high',              // Should have - major functionality
  MEDIUM = 'medium',          // Nice to have - enhances product
  LOW = 'low',                // Could have - future consideration
  OPTIONAL = 'optional',      // Completely optional
}

export enum FeasibilityStatus {
  NOT_ASSESSED = 'not-assessed',
  FEASIBLE = 'feasible',
  FEASIBLE_WITH_CONSTRAINTS = 'feasible-with-constraints',
  NOT_FEASIBLE = 'not-feasible',
  REQUIRES_RESEARCH = 'requires-research',
}

// ============================================================================
// CORE PRD STRUCTURE
// ============================================================================

export interface ComprehensivePRD {
  // Metadata
  id: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'locked';
  category: ProductCategory;
  created: Date;
  lastUpdated: Date;
  approvers: any[];  // Approver[] from part 2

  // Executive Summary (The "Elevator Pitch")
  executiveSummary: ExecutiveSummary;

  // Product Definition
  productDefinition: ProductDefinition;

  // Features (Required vs Optional)
  features: FeatureSet;

  // Technical Requirements
  technicalRequirements: TechnicalRequirements;

  // Business Requirements
  businessRequirements: BusinessRequirements;

  // Market & Customer
  marketAnalysis: MarketAnalysis;

  // Timeline & Roadmap
  timeline: any;  // Timeline from part 2

  // Budget & Resources
  budgetAndResources: any;  // BudgetAndResources from part 2

  // Manufacturing & Production (if applicable)
  manufacturing?: any;  // ManufacturingRequirements from part 2

  // Regulatory & Compliance
  regulatoryCompliance: any;  // RegulatoryCompliance from part 2

  // Risk Assessment
  riskAssessment: any;  // RiskAssessment from part 2

  // Go-to-Market Strategy
  goToMarket: any;  // GoToMarketStrategy from part 2

  // Success Criteria
  successCriteria: any;  // SuccessCriteria from part 2

  // Constraints & Assumptions
  constraintsAndAssumptions: any;  // ConstraintsAndAssumptions from part 2

  // Validation & Completeness
  validation: any;  // PRDValidation from part 2
}

// ============================================================================
// EXECUTIVE SUMMARY
// ============================================================================

export interface ExecutiveSummary {
  productName: string;
  tagline: string;
  visionStatement: string;
  missionStatement: string;

  // The 5 Ws
  what: string;         // What is the product?
  why: string;          // Why are we building it?
  who: string;          // Who is it for?
  where: string;        // Where will it be used/sold?
  when: string;         // When will it launch?

  // Key highlights
  keyBenefits: string[];
  uniqueSellingPoints: string[];
  competitiveAdvantages: string[];
}

// ============================================================================
// PRODUCT DEFINITION
// ============================================================================

export interface ProductDefinition {
  problemStatement: string;
  solutionDescription: string;

  // Target users/customers
  targetUsers: TargetUser[];

  // Use cases and user stories
  useCases: UseCase[];
  userStories: UserStory[];

  // Product specifications
  specifications: ProductSpecifications;

  // Design requirements
  designRequirements: DesignRequirements;

  // User experience requirements
  userExperience: UserExperienceRequirements;
}

export interface TargetUser {
  persona: string;
  demographics: {
    ageRange?: string;
    location?: string;
    income?: string;
    education?: string;
    occupation?: string;
  };
  psychographics: {
    goals: string[];
    painPoints: string[];
    behaviors: string[];
    preferences: string[];
  };
  technicalProficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  actors: string[];
  preconditions: string[];
  steps: string[];
  postconditions: string[];
  alternativeFlows: string[];
  priority: PriorityLevel;
}

export interface UserStory {
  id: string;
  as: string;           // As a [user type]
  iWant: string;        // I want to [action]
  soThat: string;       // So that [benefit]
  acceptanceCriteria: string[];
  priority: PriorityLevel;
  estimatedEffort?: string;
}

export interface ProductSpecifications {
  // Physical specifications (for hardware)
  physical?: {
    dimensions: string;
    weight: string;
    materials: string[];
    colors: string[];
    form_factor: string;
  };

  // Performance specifications
  performance: {
    speed?: string;
    capacity?: string;
    throughput?: string;
    latency?: string;
    accuracy?: string;
    reliability?: string;
    uptime?: string;
  };

  // Environmental specifications
  environmental?: {
    operatingTemperature: string;
    storageTemperature: string;
    humidity: string;
    altitude?: string;
    waterResistance?: string;
    dustResistance?: string;
  };

  // Power specifications
  power?: {
    inputVoltage?: string;
    powerConsumption?: string;
    batteryLife?: string;
    batteryType?: string;
    chargingTime?: string;
  };

  // Connectivity
  connectivity?: {
    wireless: string[];  // WiFi, Bluetooth, NFC, etc.
    wired: string[];     // USB, Ethernet, etc.
    protocols: string[];
  };
}

export interface DesignRequirements {
  aesthetics: string;
  brandGuidelines: string;
  accessibilityRequirements: string[];

  // For physical products
  industrialDesign?: {
    style: string;
    ergonomics: string;
    userInterface: string;
    packaging: string;
  };

  // For digital products
  uiDesign?: {
    designSystem: string;
    colorPalette: string[];
    typography: string;
    iconography: string;
    responsiveness: string[];
  };
}

export interface UserExperienceRequirements {
  onboarding: string;
  learningCurve: string;
  usability: string[];
  accessibility: string[];
  internationalization: {
    languages: string[];
    localization: string[];
    culturalConsiderations: string[];
  };
}

// ============================================================================
// FEATURES (REQUIRED VS OPTIONAL)
// ============================================================================

export interface FeatureSet {
  required: Feature[];      // Must have for MVP
  highPriority: Feature[];  // Should have soon after MVP
  mediumPriority: Feature[]; // Nice to have
  lowPriority: Feature[];   // Future consideration
  optional: Feature[];      // Completely optional
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: PriorityLevel;

  // Detailed requirements
  functionalRequirements: string[];
  technicalRequirements: string[];
  dependencies: string[];  // IDs of other features

  // Feasibility
  feasibility: FeasibilityStatus;
  feasibilityNotes: string;

  // Effort estimation
  estimatedDevelopmentTime?: string;
  estimatedCost?: number;
  complexity: 'low' | 'medium' | 'high' | 'very-high';

  // User impact
  userBenefit: string;
  userImpact: 'low' | 'medium' | 'high' | 'critical';

  // Business value
  businessValue: string;
  revenueImpact?: string;

  // Metrics
  successMetrics: string[];
}

// ============================================================================
// TECHNICAL REQUIREMENTS
// ============================================================================

export interface TechnicalRequirements {
  // Architecture
  architecture: {
    overview: string;
    components: string[];
    dataFlow: string;
    integrations: string[];
  };

  // Technology stack
  technologyStack: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    infrastructure?: string[];
    devTools?: string[];
  };

  // For hardware
  hardware?: {
    components: HardwareComponent[];
    billOfMaterials: BOMItem[];
    schematics: string;
    pcbRequirements?: string;
    mechanicalDrawings?: string;
  };

  // Security requirements
  security: SecurityRequirements;

  // Performance requirements
  performance: PerformanceRequirements;

  // Scalability
  scalability: {
    expectedLoad: string;
    growthProjection: string;
    scalingStrategy: string;
  };

  // Data requirements
  data: {
    storage: string;
    retention: string;
    backup: string;
    privacy: string;
  };

  // Integration requirements
  integrations: Integration[];

  // API requirements (if applicable)
  api?: APIRequirements;
}

export interface HardwareComponent {
  id: string;
  name: string;
  partNumber: string;
  manufacturer: string;
  specifications: string;
  quantity: number;
  cost: number;
  leadTime: string;
  alternatives: string[];
}

export interface BOMItem {
  partNumber: string;
  description: string;
  manufacturer: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  leadTime: string;
  notes: string;
}

export interface SecurityRequirements {
  authentication: string[];
  authorization: string[];
  dataEncryption: string;
  networkSecurity: string;
  vulnerabilityTesting: string[];
  complianceStandards: string[];
}

export interface PerformanceRequirements {
  responseTime: string;
  throughput: string;
  concurrentUsers?: string;
  dataProcessing?: string;
  benchmarks: Record<string, string>;
}

export interface Integration {
  name: string;
  type: 'api' | 'webhook' | 'sdk' | 'plugin' | 'embedded';
  provider: string;
  purpose: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  requirements: string[];
}

export interface APIRequirements {
  type: 'REST' | 'GraphQL' | 'gRPC' | 'WebSocket';
  authentication: string;
  rateLimit: string;
  versioning: string;
  documentation: string;
  endpoints: APIEndpoint[];
}

export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  parameters: string[];
  response: string;
}

// ============================================================================
// BUSINESS REQUIREMENTS
// ============================================================================

export interface BusinessRequirements {
  // Business model
  businessModel: {
    type: 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'Subscription' | 'Freemium' | 'Other';
    description: string;
    revenueStreams: RevenueStream[];
    costStructure: CostStructure;
    valueProposition: string;
  };

  // Pricing strategy
  pricing: {
    strategy: string;
    tiers?: PricingTier[];
    currency: string;
    paymentMethods: string[];
  };

  // Sales & distribution
  salesAndDistribution: {
    channels: string[];
    salesProcess: string;
    partnerships: string[];
  };

  // Customer support
  customerSupport: {
    channels: string[];
    sla: string;
    documentation: string[];
    training: string[];
  };

  // Legal & IP
  legal: {
    intellectualProperty: string[];
    licensing: string;
    contracts: string[];
    trademarks: string[];
    patents: string[];
  };
}

export interface RevenueStream {
  name: string;
  type: 'one-time' | 'recurring' | 'usage-based' | 'commission';
  amount: string;
  frequency?: string;
  projection: {
    year1: number;
    year2: number;
    year3: number;
  };
}

export interface CostStructure {
  development: number;
  manufacturing?: number;
  marketing: number;
  operations: number;
  support: number;
  overhead: number;
  total: number;
}

export interface PricingTier {
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'annually' | 'one-time';
  features: string[];
  limits: Record<string, any>;
}

// ============================================================================
// MARKET ANALYSIS
// ============================================================================

export interface MarketAnalysis {
  // Market size and opportunity
  marketSize: {
    tam: string;  // Total Addressable Market
    sam: string;  // Serviceable Addressable Market
    som: string;  // Serviceable Obtainable Market
    growthRate: string;
  };

  // Target market segments
  segments: MarketSegment[];

  // Competition
  competition: {
    direct: Competitor[];
    indirect: Competitor[];
    analysis: CompetitiveAnalysis;
  };

  // Market trends
  trends: MarketTrend[];

  // Customer insights
  customerInsights: {
    painPoints: string[];
    buyingBehavior: string;
    decisionFactors: string[];
    priceEnsitivity: 'low' | 'medium' | 'high';
  };
}

export interface MarketSegment {
  name: string;
  size: string;
  characteristics: string[];
  needs: string[];
  priority: 'primary' | 'secondary' | 'tertiary';
}

export interface Competitor {
  name: string;
  product: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  website: string;
}

export interface CompetitiveAnalysis {
  ourAdvantages: string[];
  ourDisadvantages: string[];
  differentiators: string[];
  positioning: string;
}

export interface MarketTrend {
  trend: string;
  impact: 'positive' | 'negative' | 'neutral';
  timeframe: string;
  relevance: string;
}

// Continued in next file...
