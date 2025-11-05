import {
  Dependency,
  DependencyType,
  DependencyStatus,
  CriticalityLevel,
  DependenciesLayer,
  DependencyEvaluation,
  DependencyIncident,
  APIDependency,
  HardwareDependency,
  SoftwareDependency,
  ServiceDependency,
  ConsumableDependency,
} from '../types/dependencies';

/**
 * Dependencies and Support Layer Manager
 * Manages all external requirements and dependencies
 */
export class DependenciesManager {
  /**
   * Create a new dependencies layer
   */
  public createDependenciesLayer(): DependenciesLayer {
    return {
      dependencies: [],
      summary: {
        total: 0,
        byType: this.initializeTypeCount(),
        byStatus: this.initializeStatusCount(),
        byCriticality: this.initializeCriticalityCount(),
        totalMonthlyCost: 0,
        totalOneTimeCost: 0,
      },
    };
  }

  /**
   * Add a dependency
   */
  public addDependency(
    layer: DependenciesLayer,
    params: {
      name: string;
      type: DependencyType;
      description: string;
      criticality: CriticalityLevel;
      vendor: string;
      cost: Dependency['cost'];
      relatedMilestones?: string[];
    }
  ): DependenciesLayer {
    const dependency: Dependency = {
      id: this.generateId(),
      name: params.name,
      type: params.type,
      description: params.description,
      status: DependencyStatus.PLANNED,
      criticality: params.criticality,
      vendor: params.vendor,
      cost: params.cost,
      dateAdded: new Date(),
      relatedMilestones: params.relatedMilestones || [],
      dependencies: [],
      alternatives: [],
      documentation: {
        notes: [],
      },
      risks: [],
      limitations: [],
      metadata: {},
    };

    const dependencies = [...layer.dependencies, dependency];

    return {
      ...layer,
      dependencies,
      summary: this.calculateSummary(dependencies),
    };
  }

  /**
   * Update dependency status
   */
  public updateStatus(
    layer: DependenciesLayer,
    dependencyId: string,
    status: DependencyStatus
  ): DependenciesLayer {
    const dependencies = layer.dependencies.map(dep => {
      if (dep.id !== dependencyId) return dep;

      const updated = { ...dep, status };

      // Set date fields based on status
      if (status === DependencyStatus.ACQUIRED && !dep.dateAcquired) {
        updated.dateAcquired = new Date();
      } else if (status === DependencyStatus.INTEGRATED && !dep.dateIntegrated) {
        updated.dateIntegrated = new Date();
      } else if (status === DependencyStatus.DEPRECATED && !dep.dateDeprecated) {
        updated.dateDeprecated = new Date();
      }

      return updated;
    });

    return {
      ...layer,
      dependencies,
      summary: this.calculateSummary(dependencies),
    };
  }

  /**
   * Add risk to dependency
   */
  public addRisk(
    layer: DependenciesLayer,
    dependencyId: string,
    risk: string
  ): DependenciesLayer {
    return {
      ...layer,
      dependencies: layer.dependencies.map(dep =>
        dep.id === dependencyId
          ? { ...dep, risks: [...dep.risks, risk] }
          : dep
      ),
    };
  }

  /**
   * Add limitation to dependency
   */
  public addLimitation(
    layer: DependenciesLayer,
    dependencyId: string,
    limitation: string
  ): DependenciesLayer {
    return {
      ...layer,
      dependencies: layer.dependencies.map(dep =>
        dep.id === dependencyId
          ? { ...dep, limitations: [...dep.limitations, limitation] }
          : dep
      ),
    };
  }

  /**
   * Add alternative dependency
   */
  public addAlternative(
    layer: DependenciesLayer,
    dependencyId: string,
    alternativeName: string
  ): DependenciesLayer {
    return {
      ...layer,
      dependencies: layer.dependencies.map(dep =>
        dep.id === dependencyId
          ? { ...dep, alternatives: [...dep.alternatives, alternativeName] }
          : dep
      ),
    };
  }

  /**
   * Add documentation note
   */
  public addDocumentationNote(
    layer: DependenciesLayer,
    dependencyId: string,
    note: string
  ): DependenciesLayer {
    return {
      ...layer,
      dependencies: layer.dependencies.map(dep =>
        dep.id === dependencyId
          ? {
              ...dep,
              documentation: {
                ...dep.documentation,
                notes: [...dep.documentation.notes, note],
              },
            }
          : dep
      ),
    };
  }

  /**
   * Link dependency to milestone
   */
  public linkToMilestone(
    layer: DependenciesLayer,
    dependencyId: string,
    milestoneId: string
  ): DependenciesLayer {
    return {
      ...layer,
      dependencies: layer.dependencies.map(dep =>
        dep.id === dependencyId && !dep.relatedMilestones.includes(milestoneId)
          ? { ...dep, relatedMilestones: [...dep.relatedMilestones, milestoneId] }
          : dep
      ),
    };
  }

  /**
   * Get dependencies by type
   */
  public getDependenciesByType(
    layer: DependenciesLayer,
    type: DependencyType
  ): Dependency[] {
    return layer.dependencies.filter(dep => dep.type === type);
  }

  /**
   * Get dependencies by status
   */
  public getDependenciesByStatus(
    layer: DependenciesLayer,
    status: DependencyStatus
  ): Dependency[] {
    return layer.dependencies.filter(dep => dep.status === status);
  }

  /**
   * Get dependencies by criticality
   */
  public getDependenciesByCriticality(
    layer: DependenciesLayer,
    criticality: CriticalityLevel
  ): Dependency[] {
    return layer.dependencies.filter(dep => dep.criticality === criticality);
  }

  /**
   * Get dependencies for a milestone
   */
  public getDependenciesForMilestone(
    layer: DependenciesLayer,
    milestoneId: string
  ): Dependency[] {
    return layer.dependencies.filter(dep =>
      dep.relatedMilestones.includes(milestoneId)
    );
  }

  /**
   * Get critical dependencies that aren't integrated yet
   */
  public getCriticalPendingDependencies(layer: DependenciesLayer): Dependency[] {
    return layer.dependencies.filter(
      dep =>
        dep.criticality === CriticalityLevel.CRITICAL &&
        dep.status !== DependencyStatus.INTEGRATED
    );
  }

  /**
   * Calculate monthly costs
   */
  public calculateMonthlyCosts(layer: DependenciesLayer): number {
    return layer.dependencies.reduce((total, dep) => {
      if (dep.cost.model === 'subscription' && dep.cost.amount) {
        const amount = parseFloat(dep.cost.amount.replace(/[^0-9.]/g, ''));
        if (dep.cost.billingCycle === 'monthly') {
          return total + amount;
        } else if (dep.cost.billingCycle === 'annually') {
          return total + amount / 12;
        }
      }
      return total;
    }, 0);
  }

  /**
   * Calculate one-time costs
   */
  public calculateOneTimeCosts(layer: DependenciesLayer): number {
    return layer.dependencies.reduce((total, dep) => {
      if (
        (dep.cost.model === 'one-time' || dep.cost.billingCycle === 'one-time') &&
        dep.cost.amount
      ) {
        const amount = parseFloat(dep.cost.amount.replace(/[^0-9.]/g, ''));
        return total + amount;
      }
      return total;
    }, 0);
  }

  /**
   * Generate dependencies report
   */
  public generateReport(layer: DependenciesLayer): string {
    const sections: string[] = [];

    sections.push('# Dependencies & Support Report\n');

    // Summary
    sections.push('## Summary');
    sections.push(`Total Dependencies: ${layer.summary.total}`);
    sections.push(`Monthly Cost: $${layer.summary.totalMonthlyCost.toFixed(2)}`);
    sections.push(`One-Time Cost: $${layer.summary.totalOneTimeCost.toFixed(2)}\n`);

    // By Type
    sections.push('## By Type');
    for (const [type, count] of Object.entries(layer.summary.byType)) {
      if (count > 0) {
        sections.push(`- ${type}: ${count}`);
      }
    }
    sections.push('');

    // By Status
    sections.push('## By Status');
    for (const [status, count] of Object.entries(layer.summary.byStatus)) {
      if (count > 0) {
        sections.push(`- ${status}: ${count}`);
      }
    }
    sections.push('');

    // Critical pending
    const criticalPending = this.getCriticalPendingDependencies(layer);
    if (criticalPending.length > 0) {
      sections.push('## Critical Pending Dependencies');
      criticalPending.forEach(dep => {
        sections.push(`- ${dep.name} (${dep.vendor}) - Status: ${dep.status}`);
      });
      sections.push('');
    }

    // By Criticality
    sections.push('## By Criticality');
    for (const [crit, count] of Object.entries(layer.summary.byCriticality)) {
      if (count > 0) {
        sections.push(`- ${crit}: ${count}`);
      }
    }
    sections.push('');

    // Detailed list
    sections.push('## Detailed Dependencies\n');
    layer.dependencies.forEach(dep => {
      sections.push(`### ${dep.name}`);
      sections.push(`- Type: ${dep.type}`);
      sections.push(`- Vendor: ${dep.vendor}`);
      sections.push(`- Status: ${dep.status}`);
      sections.push(`- Criticality: ${dep.criticality}`);
      sections.push(`- Cost: ${dep.cost.model} ${dep.cost.amount || 'N/A'}`);

      if (dep.risks.length > 0) {
        sections.push(`- Risks: ${dep.risks.join(', ')}`);
      }

      if (dep.alternatives.length > 0) {
        sections.push(`- Alternatives: ${dep.alternatives.join(', ')}`);
      }

      sections.push('');
    });

    return sections.join('\n');
  }

  /**
   * Generate cost breakdown
   */
  public generateCostBreakdown(layer: DependenciesLayer): string {
    const sections: string[] = [];

    sections.push('# Cost Breakdown\n');

    // Monthly costs
    const monthlyDeps = layer.dependencies.filter(
      dep =>
        dep.cost.model === 'subscription' &&
        (dep.cost.billingCycle === 'monthly' || dep.cost.billingCycle === 'annually')
    );

    if (monthlyDeps.length > 0) {
      sections.push('## Monthly Recurring Costs\n');
      monthlyDeps.forEach(dep => {
        const amount = dep.cost.amount || 'N/A';
        const cycle = dep.cost.billingCycle;
        sections.push(`- ${dep.name}: ${amount} (${cycle})`);
      });
      sections.push(`\n**Total Monthly: $${layer.summary.totalMonthlyCost.toFixed(2)}**\n`);
    }

    // One-time costs
    const oneTimeDeps = layer.dependencies.filter(
      dep => dep.cost.model === 'one-time' || dep.cost.billingCycle === 'one-time'
    );

    if (oneTimeDeps.length > 0) {
      sections.push('## One-Time Costs\n');
      oneTimeDeps.forEach(dep => {
        const amount = dep.cost.amount || 'N/A';
        sections.push(`- ${dep.name}: ${amount}`);
      });
      sections.push(`\n**Total One-Time: $${layer.summary.totalOneTimeCost.toFixed(2)}**\n`);
    }

    // Usage-based
    const usageDeps = layer.dependencies.filter(dep => dep.cost.model === 'usage-based');

    if (usageDeps.length > 0) {
      sections.push('## Usage-Based Costs\n');
      usageDeps.forEach(dep => {
        sections.push(`- ${dep.name}: ${dep.cost.notes || 'Variable based on usage'}`);
      });
      sections.push('');
    }

    // Free
    const freeDeps = layer.dependencies.filter(dep => dep.cost.model === 'free');

    if (freeDeps.length > 0) {
      sections.push('## Free Dependencies\n');
      freeDeps.forEach(dep => {
        sections.push(`- ${dep.name} (${dep.vendor})`);
      });
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * Check for expired licenses
   */
  public getExpiredLicenses(layer: DependenciesLayer): Dependency[] {
    const now = new Date();
    return layer.dependencies.filter(
      dep => dep.licenseExpiry && new Date(dep.licenseExpiry) < now
    );
  }

  /**
   * Check for expiring licenses (within 30 days)
   */
  public getExpiringLicenses(layer: DependenciesLayer, daysAhead: number = 30): Dependency[] {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + daysAhead);

    return layer.dependencies.filter(dep => {
      if (!dep.licenseExpiry) return false;
      const expiry = new Date(dep.licenseExpiry);
      return expiry > now && expiry <= future;
    });
  }

  /**
   * Remove a dependency
   */
  public removeDependency(
    layer: DependenciesLayer,
    dependencyId: string
  ): DependenciesLayer {
    const dependencies = layer.dependencies.filter(dep => dep.id !== dependencyId);

    return {
      ...layer,
      dependencies,
      summary: this.calculateSummary(dependencies),
    };
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(dependencies: Dependency[]): DependenciesLayer['summary'] {
    const summary: DependenciesLayer['summary'] = {
      total: dependencies.length,
      byType: this.initializeTypeCount(),
      byStatus: this.initializeStatusCount(),
      byCriticality: this.initializeCriticalityCount(),
      totalMonthlyCost: 0,
      totalOneTimeCost: 0,
    };

    dependencies.forEach(dep => {
      summary.byType[dep.type]++;
      summary.byStatus[dep.status]++;
      summary.byCriticality[dep.criticality]++;

      // Calculate costs
      if (dep.cost.amount) {
        const amount = parseFloat(dep.cost.amount.replace(/[^0-9.]/g, ''));

        if (dep.cost.model === 'subscription') {
          if (dep.cost.billingCycle === 'monthly') {
            summary.totalMonthlyCost += amount;
          } else if (dep.cost.billingCycle === 'annually') {
            summary.totalMonthlyCost += amount / 12;
          }
        } else if (dep.cost.model === 'one-time' || dep.cost.billingCycle === 'one-time') {
          summary.totalOneTimeCost += amount;
        }
      }
    });

    return summary;
  }

  /**
   * Initialize type count
   */
  private initializeTypeCount(): Record<DependencyType, number> {
    const count: any = {};
    Object.values(DependencyType).forEach(type => {
      count[type] = 0;
    });
    return count;
  }

  /**
   * Initialize status count
   */
  private initializeStatusCount(): Record<DependencyStatus, number> {
    const count: any = {};
    Object.values(DependencyStatus).forEach(status => {
      count[status] = 0;
    });
    return count;
  }

  /**
   * Initialize criticality count
   */
  private initializeCriticalityCount(): Record<CriticalityLevel, number> {
    const count: any = {};
    Object.values(CriticalityLevel).forEach(level => {
      count[level] = 0;
    });
    return count;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `dep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate dependency completeness
   */
  public validate(dependency: Dependency): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dependency.name || dependency.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!dependency.vendor || dependency.vendor.trim() === '') {
      errors.push('Vendor is required');
    }

    if (!dependency.description || dependency.description.trim() === '') {
      errors.push('Description is required');
    }

    if (!dependency.cost.model) {
      errors.push('Cost model is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
