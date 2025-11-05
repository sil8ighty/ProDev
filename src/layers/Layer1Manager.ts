import { PRD, InvestorOverview, ProductType, Milestone, ProjectStatus } from '../types';

/**
 * Layer 1: Overview/Investor View Manager
 * Manages the PRD and investor-facing information
 */
export class Layer1Manager {
  /**
   * Create a new PRD
   */
  public createPRD(params: {
    title: string;
    productType: ProductType;
    what: string;
    why: string;
    who: string;
    where: string;
    when: string;
    market: {
      targetAudience: string;
      marketSize: string;
      competitors: string[];
      uniqueValueProposition: string;
    };
    business: {
      revenueModel: string;
      projectedRevenue?: string;
      estimatedCost?: string;
      roi?: string;
    };
    successMetrics?: string[];
    constraints?: string[];
    assumptions?: string[];
  }): PRD {
    return {
      id: this.generateId(),
      title: params.title,
      version: '1.0.0',
      productType: params.productType,
      created: new Date(),
      lastUpdated: new Date(),
      what: params.what,
      why: params.why,
      who: params.who,
      where: params.where,
      when: params.when,
      market: params.market,
      business: params.business,
      successMetrics: params.successMetrics || [],
      constraints: params.constraints || [],
      assumptions: params.assumptions || [],
    };
  }

  /**
   * Update an existing PRD
   */
  public updatePRD(prd: PRD, updates: Partial<PRD>): PRD {
    const updated = {
      ...prd,
      ...updates,
      lastUpdated: new Date(),
    };

    // Increment version if significant changes
    if (this.hasSignificantChanges(updates)) {
      updated.version = this.incrementVersion(prd.version);
    }

    return updated;
  }

  /**
   * Create an investor overview
   */
  public createInvestorOverview(
    prd: PRD,
    currentStatus: ProjectStatus,
    milestones: Milestone[]
  ): InvestorOverview {
    return {
      prd,
      currentStatus,
      milestones,
      highlights: this.generateHighlights(prd, milestones),
      risks: this.identifyRisks(prd, milestones),
      nextSteps: this.generateNextSteps(milestones),
    };
  }

  /**
   * Update investor overview
   */
  public updateInvestorOverview(
    overview: InvestorOverview,
    updates: Partial<InvestorOverview>
  ): InvestorOverview {
    return {
      ...overview,
      ...updates,
    };
  }

  /**
   * Generate highlights based on PRD and milestones
   */
  private generateHighlights(prd: PRD, milestones: Milestone[]): string[] {
    const highlights: string[] = [];

    // Add market highlights
    highlights.push(`Target Market: ${prd.market.targetAudience}`);
    highlights.push(`Market Size: ${prd.market.marketSize}`);
    highlights.push(`UVP: ${prd.market.uniqueValueProposition}`);

    // Add milestone highlights
    const completedMilestones = milestones.filter(m => m.status === 'completed');
    if (completedMilestones.length > 0) {
      highlights.push(`${completedMilestones.length} of ${milestones.length} milestones completed`);
    }

    // Add MVP highlights
    const mvpMilestones = milestones.filter(m => m.isMVP);
    if (mvpMilestones.length > 0) {
      const completedMVP = mvpMilestones.filter(m => m.status === 'completed');
      highlights.push(`MVP Progress: ${completedMVP.length}/${mvpMilestones.length} features completed`);
    }

    return highlights;
  }

  /**
   * Identify potential risks
   */
  private identifyRisks(prd: PRD, milestones: Milestone[]): string[] {
    const risks: string[] = [];

    // Check for blocked milestones
    const blockedMilestones = milestones.filter(m => m.status === 'blocked');
    if (blockedMilestones.length > 0) {
      risks.push(`${blockedMilestones.length} milestone(s) currently blocked`);
    }

    // Check for overdue milestones
    const now = new Date();
    const overdueMilestones = milestones.filter(
      m => m.status !== 'completed' && new Date(m.targetDate) < now
    );
    if (overdueMilestones.length > 0) {
      risks.push(`${overdueMilestones.length} milestone(s) overdue`);
    }

    // Add constraints as potential risks
    risks.push(...prd.constraints.map(c => `Constraint: ${c}`));

    return risks;
  }

  /**
   * Generate next steps based on milestones
   */
  private generateNextSteps(milestones: Milestone[]): string[] {
    const nextSteps: string[] = [];

    // Get the next pending or in-progress milestone
    const upcomingMilestones = milestones
      .filter(m => m.status === 'pending' || m.status === 'in-progress')
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
      .slice(0, 3);

    upcomingMilestones.forEach(m => {
      nextSteps.push(`${m.title} (Target: ${new Date(m.targetDate).toLocaleDateString()})`);
    });

    // Check for blocked milestones that need attention
    const blockedMilestones = milestones.filter(m => m.status === 'blocked');
    blockedMilestones.forEach(m => {
      nextSteps.push(`Unblock: ${m.title}`);
    });

    return nextSteps;
  }

  /**
   * Check if updates contain significant changes
   */
  private hasSignificantChanges(updates: Partial<PRD>): boolean {
    const significantFields = ['what', 'why', 'who', 'market', 'business'];
    return significantFields.some(field => field in updates);
  }

  /**
   * Increment version number
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const minor = parseInt(parts[1] || '0') + 1;
    return `${parts[0]}.${minor}.${parts[2] || '0'}`;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `prd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate PRD completeness
   */
  public validatePRD(prd: PRD): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!prd.title || prd.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!prd.what || prd.what.trim() === '') {
      errors.push('Product description (what) is required');
    }

    if (!prd.why || prd.why.trim() === '') {
      errors.push('Product rationale (why) is required');
    }

    if (!prd.who || prd.who.trim() === '') {
      errors.push('Target audience (who) is required');
    }

    if (!prd.market.targetAudience || prd.market.targetAudience.trim() === '') {
      errors.push('Target audience in market section is required');
    }

    if (!prd.business.revenueModel || prd.business.revenueModel.trim() === '') {
      errors.push('Revenue model is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
