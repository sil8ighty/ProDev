import {
  BehindTheScenes,
  Learning,
  LearningCategory,
  Note,
  ExternalLink,
  UnexpectedMoment,
} from '../types';

/**
 * Layer 3: Behind-the-Scenes Manager
 * Manages learnings, notes, links, failures, and unexpected moments
 */
export class Layer3Manager {
  /**
   * Create a new behind-the-scenes container
   */
  public createBehindTheScenes(): BehindTheScenes {
    return {
      learnings: [],
      notes: [],
      links: [],
      failures: [],
      unexpectedMoments: [],
    };
  }

  /**
   * Add a learning
   */
  public addLearning(
    bts: BehindTheScenes,
    projectId: string,
    params: {
      title: string;
      content: string;
      category: LearningCategory;
      tags?: string[];
      relatedTo?: string[];
    }
  ): BehindTheScenes {
    const learning: Learning = {
      id: this.generateId('learning'),
      projectId,
      title: params.title,
      content: params.content,
      category: params.category,
      tags: params.tags || [],
      created: new Date(),
      relatedTo: params.relatedTo,
    };

    return {
      ...bts,
      learnings: [...bts.learnings, learning],
    };
  }

  /**
   * Update a learning
   */
  public updateLearning(
    bts: BehindTheScenes,
    learningId: string,
    updates: Partial<Omit<Learning, 'id' | 'projectId' | 'created'>>
  ): BehindTheScenes {
    return {
      ...bts,
      learnings: bts.learnings.map(l =>
        l.id === learningId ? { ...l, ...updates } : l
      ),
    };
  }

  /**
   * Remove a learning
   */
  public removeLearning(bts: BehindTheScenes, learningId: string): BehindTheScenes {
    return {
      ...bts,
      learnings: bts.learnings.filter(l => l.id !== learningId),
    };
  }

  /**
   * Get learnings by category
   */
  public getLearningsByCategory(
    bts: BehindTheScenes,
    category: LearningCategory
  ): Learning[] {
    return bts.learnings.filter(l => l.category === category);
  }

  /**
   * Get learnings by tag
   */
  public getLearningsByTag(bts: BehindTheScenes, tag: string): Learning[] {
    return bts.learnings.filter(l => l.tags.includes(tag));
  }

  /**
   * Add a note
   */
  public addNote(
    bts: BehindTheScenes,
    projectId: string,
    params: {
      content: string;
      tags?: string[];
      attachments?: string[];
    }
  ): BehindTheScenes {
    const note: Note = {
      id: this.generateId('note'),
      projectId,
      content: params.content,
      tags: params.tags || [],
      created: new Date(),
      lastUpdated: new Date(),
      attachments: params.attachments || [],
    };

    return {
      ...bts,
      notes: [...bts.notes, note],
    };
  }

  /**
   * Update a note
   */
  public updateNote(
    bts: BehindTheScenes,
    noteId: string,
    updates: Partial<Omit<Note, 'id' | 'projectId' | 'created'>>
  ): BehindTheScenes {
    return {
      ...bts,
      notes: bts.notes.map(n =>
        n.id === noteId
          ? { ...n, ...updates, lastUpdated: new Date() }
          : n
      ),
    };
  }

  /**
   * Remove a note
   */
  public removeNote(bts: BehindTheScenes, noteId: string): BehindTheScenes {
    return {
      ...bts,
      notes: bts.notes.filter(n => n.id !== noteId),
    };
  }

  /**
   * Search notes by content
   */
  public searchNotes(bts: BehindTheScenes, query: string): Note[] {
    const lowerQuery = query.toLowerCase();
    return bts.notes.filter(n =>
      n.content.toLowerCase().includes(lowerQuery) ||
      n.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Add an external link
   */
  public addLink(
    bts: BehindTheScenes,
    params: {
      url: string;
      title: string;
      description: string;
      category: string;
    }
  ): BehindTheScenes {
    const link: ExternalLink = {
      id: this.generateId('link'),
      url: params.url,
      title: params.title,
      description: params.description,
      category: params.category,
      created: new Date(),
    };

    return {
      ...bts,
      links: [...bts.links, link],
    };
  }

  /**
   * Remove a link
   */
  public removeLink(bts: BehindTheScenes, linkId: string): BehindTheScenes {
    return {
      ...bts,
      links: bts.links.filter(l => l.id !== linkId),
    };
  }

  /**
   * Get links by category
   */
  public getLinksByCategory(bts: BehindTheScenes, category: string): ExternalLink[] {
    return bts.links.filter(l => l.category === category);
  }

  /**
   * Add a failure record
   */
  public addFailure(bts: BehindTheScenes, failure: string): BehindTheScenes {
    return {
      ...bts,
      failures: [...bts.failures, failure],
    };
  }

  /**
   * Add an unexpected moment
   */
  public addUnexpectedMoment(
    bts: BehindTheScenes,
    projectId: string,
    params: {
      title: string;
      description: string;
      impact: 'low' | 'medium' | 'high';
      resolution?: string;
      milestoneId?: string;
    }
  ): BehindTheScenes {
    const moment: UnexpectedMoment = {
      id: this.generateId('moment'),
      projectId,
      title: params.title,
      description: params.description,
      impact: params.impact,
      resolution: params.resolution,
      created: new Date(),
      milestoneId: params.milestoneId,
    };

    return {
      ...bts,
      unexpectedMoments: [...bts.unexpectedMoments, moment],
    };
  }

  /**
   * Update an unexpected moment
   */
  public updateUnexpectedMoment(
    bts: BehindTheScenes,
    momentId: string,
    updates: Partial<Omit<UnexpectedMoment, 'id' | 'projectId' | 'created'>>
  ): BehindTheScenes {
    return {
      ...bts,
      unexpectedMoments: bts.unexpectedMoments.map(m =>
        m.id === momentId ? { ...m, ...updates } : m
      ),
    };
  }

  /**
   * Get unexpected moments by milestone
   */
  public getUnexpectedMomentsByMilestone(
    bts: BehindTheScenes,
    milestoneId: string
  ): UnexpectedMoment[] {
    return bts.unexpectedMoments.filter(m => m.milestoneId === milestoneId);
  }

  /**
   * Get unexpected moments by impact level
   */
  public getUnexpectedMomentsByImpact(
    bts: BehindTheScenes,
    impact: 'low' | 'medium' | 'high'
  ): UnexpectedMoment[] {
    return bts.unexpectedMoments.filter(m => m.impact === impact);
  }

  /**
   * Generate insights summary
   */
  public generateInsightsSummary(bts: BehindTheScenes): string {
    const sections: string[] = [];

    sections.push('# Behind-the-Scenes Insights\n');

    // Learnings
    sections.push('## Learnings');
    sections.push(`Total: ${bts.learnings.length}`);
    const learningsByCategory = this.groupByCategory(bts.learnings);
    for (const [category, count] of Object.entries(learningsByCategory)) {
      sections.push(`- ${category}: ${count}`);
    }
    sections.push('');

    // Notes
    sections.push('## Notes');
    sections.push(`Total: ${bts.notes.length}`);
    sections.push('');

    // Links
    sections.push('## External Resources');
    sections.push(`Total Links: ${bts.links.length}`);
    const linksByCategory = this.groupLinksByCategory(bts.links);
    for (const [category, count] of Object.entries(linksByCategory)) {
      sections.push(`- ${category}: ${count}`);
    }
    sections.push('');

    // Failures
    sections.push('## Documented Failures');
    sections.push(`Total: ${bts.failures.length}`);
    sections.push('');

    // Unexpected Moments
    sections.push('## Unexpected Moments');
    sections.push(`Total: ${bts.unexpectedMoments.length}`);
    const momentsByImpact = this.groupMomentsByImpact(bts.unexpectedMoments);
    for (const [impact, count] of Object.entries(momentsByImpact)) {
      sections.push(`- ${impact}: ${count}`);
    }

    return sections.join('\n');
  }

  /**
   * Group learnings by category
   */
  private groupByCategory(learnings: Learning[]): Record<string, number> {
    return learnings.reduce((acc, l) => {
      acc[l.category] = (acc[l.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Group links by category
   */
  private groupLinksByCategory(links: ExternalLink[]): Record<string, number> {
    return links.reduce((acc, l) => {
      acc[l.category] = (acc[l.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Group moments by impact
   */
  private groupMomentsByImpact(moments: UnexpectedMoment[]): Record<string, number> {
    return moments.reduce((acc, m) => {
      acc[m.impact] = (acc[m.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Generate a unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export learnings as markdown
   */
  public exportLearningsAsMarkdown(bts: BehindTheScenes): string {
    const sections: string[] = [];

    sections.push('# Project Learnings\n');

    const categories = Object.values(LearningCategory);

    for (const category of categories) {
      const learnings = this.getLearningsByCategory(bts, category);
      if (learnings.length === 0) continue;

      sections.push(`## ${category.toUpperCase()}\n`);

      learnings.forEach(learning => {
        sections.push(`### ${learning.title}`);
        sections.push(`*${learning.created.toLocaleDateString()}*\n`);
        sections.push(learning.content);
        if (learning.tags.length > 0) {
          sections.push(`\nTags: ${learning.tags.join(', ')}`);
        }
        sections.push('');
      });
    }

    return sections.join('\n');
  }
}
