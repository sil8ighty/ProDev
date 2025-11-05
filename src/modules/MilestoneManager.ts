import { Milestone } from '../types';

/**
 * Milestone and MVP Tracking Manager
 * Handles milestone creation, tracking, and progress management
 */
export class MilestoneManager {
  /**
   * Create a new milestone
   */
  public createMilestone(
    projectId: string,
    params: {
      title: string;
      description: string;
      targetDate: Date;
      isMVP?: boolean;
      deliverables?: string[];
      dependencies?: string[];
    }
  ): Milestone {
    return {
      id: this.generateId(),
      projectId,
      title: params.title,
      description: params.description,
      targetDate: params.targetDate,
      status: 'pending',
      isMVP: params.isMVP || false,
      deliverables: params.deliverables || [],
      dependencies: params.dependencies || [],
      progress: 0,
      blockers: [],
    };
  }

  /**
   * Update milestone status
   */
  public updateStatus(
    milestone: Milestone,
    status: Milestone['status']
  ): Milestone {
    const updated = { ...milestone, status };

    // Set completion date if completed
    if (status === 'completed' && !milestone.completedDate) {
      updated.completedDate = new Date();
      updated.progress = 100;
    }

    return updated;
  }

  /**
   * Update milestone progress
   */
  public updateProgress(milestone: Milestone, progress: number): Milestone {
    const validProgress = Math.max(0, Math.min(100, progress));

    const updated = {
      ...milestone,
      progress: validProgress,
    };

    // Auto-update status based on progress
    if (validProgress === 0 && milestone.status === 'in-progress') {
      updated.status = 'pending';
    } else if (validProgress > 0 && validProgress < 100 && milestone.status === 'pending') {
      updated.status = 'in-progress';
    } else if (validProgress === 100 && milestone.status !== 'completed') {
      updated.status = 'completed';
      updated.completedDate = new Date();
    }

    return updated;
  }

  /**
   * Add a blocker to milestone
   */
  public addBlocker(milestone: Milestone, blocker: string): Milestone {
    return {
      ...milestone,
      blockers: [...milestone.blockers, blocker],
      status: 'blocked',
    };
  }

  /**
   * Remove a blocker
   */
  public removeBlocker(milestone: Milestone, blocker: string): Milestone {
    const blockers = milestone.blockers.filter(b => b !== blocker);

    return {
      ...milestone,
      blockers,
      status: blockers.length === 0 ? 'in-progress' : 'blocked',
    };
  }

  /**
   * Add a deliverable
   */
  public addDeliverable(milestone: Milestone, deliverable: string): Milestone {
    return {
      ...milestone,
      deliverables: [...milestone.deliverables, deliverable],
    };
  }

  /**
   * Remove a deliverable
   */
  public removeDeliverable(milestone: Milestone, deliverable: string): Milestone {
    return {
      ...milestone,
      deliverables: milestone.deliverables.filter(d => d !== deliverable),
    };
  }

  /**
   * Add a dependency
   */
  public addDependency(milestone: Milestone, dependencyId: string): Milestone {
    if (milestone.dependencies.includes(dependencyId)) {
      return milestone;
    }

    return {
      ...milestone,
      dependencies: [...milestone.dependencies, dependencyId],
    };
  }

  /**
   * Remove a dependency
   */
  public removeDependency(milestone: Milestone, dependencyId: string): Milestone {
    return {
      ...milestone,
      dependencies: milestone.dependencies.filter(d => d !== dependencyId),
    };
  }

  /**
   * Mark as MVP
   */
  public markAsMVP(milestone: Milestone): Milestone {
    return {
      ...milestone,
      isMVP: true,
    };
  }

  /**
   * Unmark as MVP
   */
  public unmarkAsMVP(milestone: Milestone): Milestone {
    return {
      ...milestone,
      isMVP: false,
    };
  }

  /**
   * Check if milestone is overdue
   */
  public isOverdue(milestone: Milestone): boolean {
    if (milestone.status === 'completed') {
      return false;
    }

    return new Date() > new Date(milestone.targetDate);
  }

  /**
   * Check if milestone can start (all dependencies completed)
   */
  public canStart(milestone: Milestone, allMilestones: Milestone[]): boolean {
    if (milestone.dependencies.length === 0) {
      return true;
    }

    return milestone.dependencies.every(depId => {
      const dep = allMilestones.find(m => m.id === depId);
      return dep && dep.status === 'completed';
    });
  }

  /**
   * Get milestone duration in days
   */
  public getDaysUntilTarget(milestone: Milestone): number {
    const now = new Date();
    const target = new Date(milestone.targetDate);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get milestone completion percentage for a list
   */
  public getOverallProgress(milestones: Milestone[]): number {
    if (milestones.length === 0) return 0;

    const totalProgress = milestones.reduce((sum, m) => sum + m.progress, 0);
    return Math.round(totalProgress / milestones.length);
  }

  /**
   * Get MVP progress
   */
  public getMVPProgress(milestones: Milestone[]): {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    percentage: number;
  } {
    const mvpMilestones = milestones.filter(m => m.isMVP);

    const completed = mvpMilestones.filter(m => m.status === 'completed').length;
    const inProgress = mvpMilestones.filter(m => m.status === 'in-progress').length;
    const pending = mvpMilestones.filter(m => m.status === 'pending').length;

    return {
      total: mvpMilestones.length,
      completed,
      inProgress,
      pending,
      percentage: mvpMilestones.length > 0
        ? Math.round((completed / mvpMilestones.length) * 100)
        : 0,
    };
  }

  /**
   * Get milestones by status
   */
  public getMilestonesByStatus(
    milestones: Milestone[],
    status: Milestone['status']
  ): Milestone[] {
    return milestones.filter(m => m.status === status);
  }

  /**
   * Get next milestones (upcoming and not blocked)
   */
  public getNextMilestones(milestones: Milestone[], limit: number = 3): Milestone[] {
    return milestones
      .filter(m => m.status === 'pending' || m.status === 'in-progress')
      .filter(m => this.canStart(m, milestones))
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
      .slice(0, limit);
  }

  /**
   * Get critical path (milestones with dependencies)
   */
  public getCriticalPath(milestones: Milestone[]): Milestone[] {
    const visited = new Set<string>();
    const path: Milestone[] = [];

    const visit = (milestone: Milestone) => {
      if (visited.has(milestone.id)) return;
      visited.add(milestone.id);

      // Visit dependencies first
      milestone.dependencies.forEach(depId => {
        const dep = milestones.find(m => m.id === depId);
        if (dep) visit(dep);
      });

      path.push(milestone);
    };

    // Start with milestones that have no dependents
    const withDependents = new Set(
      milestones.flatMap(m => m.dependencies)
    );

    const endPoints = milestones.filter(m => !withDependents.has(m.id));

    endPoints.forEach(visit);

    return path;
  }

  /**
   * Generate milestone report
   */
  public generateReport(milestones: Milestone[]): string {
    const sections: string[] = [];

    sections.push('# Milestone Report\n');

    // Overall stats
    sections.push('## Overall Progress');
    sections.push(`Total Milestones: ${milestones.length}`);
    sections.push(`Overall Progress: ${this.getOverallProgress(milestones)}%\n`);

    // Status breakdown
    sections.push('## Status Breakdown');
    sections.push(`Completed: ${this.getMilestonesByStatus(milestones, 'completed').length}`);
    sections.push(`In Progress: ${this.getMilestonesByStatus(milestones, 'in-progress').length}`);
    sections.push(`Pending: ${this.getMilestonesByStatus(milestones, 'pending').length}`);
    sections.push(`Blocked: ${this.getMilestonesByStatus(milestones, 'blocked').length}\n`);

    // MVP progress
    const mvpProgress = this.getMVPProgress(milestones);
    sections.push('## MVP Progress');
    sections.push(`Total MVP Features: ${mvpProgress.total}`);
    sections.push(`Completed: ${mvpProgress.completed}`);
    sections.push(`In Progress: ${mvpProgress.inProgress}`);
    sections.push(`MVP Completion: ${mvpProgress.percentage}%\n`);

    // Overdue milestones
    const overdue = milestones.filter(m => this.isOverdue(m));
    if (overdue.length > 0) {
      sections.push('## Overdue Milestones');
      overdue.forEach(m => {
        sections.push(`- ${m.title} (Due: ${new Date(m.targetDate).toLocaleDateString()})`);
      });
      sections.push('');
    }

    // Next milestones
    const next = this.getNextMilestones(milestones);
    if (next.length > 0) {
      sections.push('## Next Milestones');
      next.forEach(m => {
        const daysUntil = this.getDaysUntilTarget(m);
        sections.push(`- ${m.title} (${daysUntil} days)`);
      });
      sections.push('');
    }

    // Blocked milestones
    const blocked = this.getMilestonesByStatus(milestones, 'blocked');
    if (blocked.length > 0) {
      sections.push('## Blocked Milestones');
      blocked.forEach(m => {
        sections.push(`- ${m.title}`);
        m.blockers.forEach(b => {
          sections.push(`  - ${b}`);
        });
      });
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate milestone
   */
  public validate(milestone: Milestone): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!milestone.title || milestone.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!milestone.description || milestone.description.trim() === '') {
      errors.push('Description is required');
    }

    if (!milestone.targetDate) {
      errors.push('Target date is required');
    }

    if (milestone.deliverables.length === 0) {
      errors.push('At least one deliverable is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
