import {
  Project,
  SlideDeck,
  SlideDeckConfig,
  Slide,
  Milestone,
  Learning,
  LearningCategory,
} from '../types';

/**
 * Automated Slide Deck Generator
 * Creates presentations from project data based on various triggers
 */
export class SlideDeckGenerator {
  /**
   * Generate a slide deck based on configuration
   */
  public generateDeck(project: Project, config: SlideDeckConfig): SlideDeck {
    const slides: Slide[] = [];

    // Title slide
    slides.push(this.createTitleSlide(project));

    // Layer 1: Overview/Investor content
    if (config.includeLayer1) {
      slides.push(...this.generateLayer1Slides(project));
    }

    // Layer 2: Technical content
    if (config.includeLayer2) {
      slides.push(...this.generateLayer2Slides(project));
    }

    // Layer 3: Behind-the-scenes content
    if (config.includeLayer3) {
      slides.push(...this.generateLayer3Slides(project, config));
    }

    // Milestone-specific slides
    if (config.type === 'milestone-based' && config.milestoneIds) {
      slides.push(...this.generateMilestoneSlides(project, config.milestoneIds));
    }

    // Time-based slides
    if (config.type === 'time-based' && config.dateRange) {
      slides.push(...this.generateTimeBasedSlides(project, config.dateRange));
    }

    // Custom sections
    if (config.customSections) {
      slides.push(...this.generateCustomSections(project, config.customSections));
    }

    // Summary slide
    slides.push(this.createSummarySlide(project));

    return {
      id: this.generateId(),
      projectId: project.id,
      title: this.generateDeckTitle(project, config),
      slides,
      config,
      created: new Date(),
    };
  }

  /**
   * Create title slide
   */
  private createTitleSlide(project: Project): Slide {
    return {
      title: project.layer1.prd.title,
      content: [
        `Product Type: ${project.layer1.prd.productType}`,
        `Status: ${project.status}`,
        `Version: ${project.layer1.prd.version}`,
        `Date: ${new Date().toLocaleDateString()}`,
      ],
      type: 'title',
    };
  }

  /**
   * Generate Layer 1 (Overview/Investor) slides
   */
  private generateLayer1Slides(project: Project): Slide[] {
    const slides: Slide[] = [];
    const prd = project.layer1.prd;

    // Product overview
    slides.push({
      title: 'Product Overview',
      content: [
        `What: ${prd.what}`,
        `Why: ${prd.why}`,
        `Who: ${prd.who}`,
        `Where: ${prd.where}`,
        `When: ${prd.when}`,
      ],
      type: 'content',
    });

    // Market analysis
    slides.push({
      title: 'Market Analysis',
      content: [
        `Target Audience: ${prd.market.targetAudience}`,
        `Market Size: ${prd.market.marketSize}`,
        `Unique Value Proposition: ${prd.market.uniqueValueProposition}`,
        '',
        'Competitors:',
        ...prd.market.competitors.map(c => `- ${c}`),
      ],
      type: 'content',
    });

    // Business model
    slides.push({
      title: 'Business Model',
      content: [
        `Revenue Model: ${prd.business.revenueModel}`,
        prd.business.projectedRevenue ? `Projected Revenue: ${prd.business.projectedRevenue}` : '',
        prd.business.estimatedCost ? `Estimated Cost: ${prd.business.estimatedCost}` : '',
        prd.business.roi ? `Expected ROI: ${prd.business.roi}` : '',
      ].filter(Boolean),
      type: 'content',
    });

    // Success metrics
    if (prd.successMetrics.length > 0) {
      slides.push({
        title: 'Success Metrics',
        content: prd.successMetrics.map(m => `- ${m}`),
        type: 'content',
      });
    }

    // Highlights and risks
    slides.push({
      title: 'Highlights',
      content: project.layer1.highlights.map(h => `- ${h}`),
      type: 'content',
    });

    slides.push({
      title: 'Risks & Constraints',
      content: [
        'Risks:',
        ...project.layer1.risks.map(r => `- ${r}`),
        '',
        'Constraints:',
        ...prd.constraints.map(c => `- ${c}`),
      ],
      type: 'content',
    });

    // Next steps
    if (project.layer1.nextSteps.length > 0) {
      slides.push({
        title: 'Next Steps',
        content: project.layer1.nextSteps.map(s => `- ${s}`),
        type: 'content',
      });
    }

    return slides;
  }

  /**
   * Generate Layer 2 (Technical) slides
   */
  private generateLayer2Slides(project: Project): Slide[] {
    const slides: Slide[] = [];
    const tech = project.layer2;

    // Architecture
    slides.push({
      title: 'Technical Architecture',
      content: [
        tech.engineering.architecture,
        '',
        'Technologies:',
        ...tech.engineering.technologies.map(t => `- ${t}`),
      ],
      type: 'content',
    });

    // Deliverables
    const totalFiles =
      tech.files.code.length +
      tech.files.designs.length +
      tech.files.diagrams.length +
      tech.files.documentation.length;

    slides.push({
      title: 'Deliverables',
      content: [
        `Total Files: ${totalFiles}`,
        `Code Files: ${tech.files.code.length}`,
        `Design Files: ${tech.files.designs.length}`,
        `Diagrams: ${tech.files.diagrams.length}`,
        `Documentation: ${tech.files.documentation.length}`,
      ],
      type: 'data',
    });

    // Quality metrics
    if (tech.testing.testCoverage || Object.keys(tech.testing.qualityMetrics).length > 0) {
      const content: string[] = [];

      if (tech.testing.testCoverage) {
        content.push(`Test Coverage: ${tech.testing.testCoverage}`);
      }

      content.push('', 'Quality Metrics:');
      for (const [key, value] of Object.entries(tech.testing.qualityMetrics)) {
        content.push(`- ${key}: ${value}`);
      }

      slides.push({
        title: 'Quality Assurance',
        content,
        type: 'data',
      });
    }

    // Deployment
    if (tech.deployment) {
      slides.push({
        title: 'Deployment',
        content: [
          'Environments:',
          ...tech.deployment.environments.map(e => `- ${e}`),
          '',
          `Infrastructure: ${tech.deployment.infrastructure}`,
        ],
        type: 'content',
      });
    }

    return slides;
  }

  /**
   * Generate Layer 3 (Behind-the-scenes) slides
   */
  private generateLayer3Slides(project: Project, config: SlideDeckConfig): Slide[] {
    const slides: Slide[] = [];
    const bts = project.layer3;

    // Learnings summary
    if (bts.learnings.length > 0) {
      const learningsByCategory: Record<string, number> = {};
      bts.learnings.forEach(l => {
        learningsByCategory[l.category] = (learningsByCategory[l.category] || 0) + 1;
      });

      slides.push({
        title: 'Key Learnings',
        content: [
          `Total Learnings: ${bts.learnings.length}`,
          '',
          ...Object.entries(learningsByCategory).map(
            ([cat, count]) => `${cat}: ${count}`
          ),
        ],
        type: 'data',
      });

      // Top learnings by category
      for (const category of Object.values(LearningCategory)) {
        const categoryLearnings = bts.learnings
          .filter(l => l.category === category)
          .slice(0, 3);

        if (categoryLearnings.length > 0) {
          slides.push({
            title: `${category.toUpperCase()} Learnings`,
            content: categoryLearnings.map(l => `- ${l.title}: ${l.content.substring(0, 100)}...`),
            type: 'content',
          });
        }
      }
    }

    // Unexpected moments
    if (bts.unexpectedMoments.length > 0) {
      const highImpact = bts.unexpectedMoments.filter(m => m.impact === 'high');

      if (highImpact.length > 0) {
        slides.push({
          title: 'Critical Unexpected Moments',
          content: highImpact.map(m => {
            const resolution = m.resolution ? ` (Resolved: ${m.resolution})` : ' (Unresolved)';
            return `- ${m.title}${resolution}`;
          }),
          type: 'content',
        });
      }
    }

    // Failures and insights
    if (bts.failures.length > 0) {
      slides.push({
        title: 'Documented Challenges',
        content: [
          `Total Documented: ${bts.failures.length}`,
          '',
          'Key Challenges:',
          ...bts.failures.slice(0, 5).map(f => `- ${f}`),
        ],
        type: 'content',
      });
    }

    return slides;
  }

  /**
   * Generate milestone-specific slides
   */
  private generateMilestoneSlides(project: Project, milestoneIds: string[]): Slide[] {
    const slides: Slide[] = [];

    milestoneIds.forEach(id => {
      const milestone = project.milestones.find(m => m.id === id);
      if (!milestone) return;

      slides.push({
        title: `Milestone: ${milestone.title}`,
        content: [
          milestone.description,
          '',
          `Status: ${milestone.status}`,
          `Progress: ${milestone.progress}%`,
          `Target Date: ${new Date(milestone.targetDate).toLocaleDateString()}`,
          milestone.completedDate
            ? `Completed: ${new Date(milestone.completedDate).toLocaleDateString()}`
            : '',
          '',
          'Deliverables:',
          ...milestone.deliverables.map(d => `- ${d}`),
        ].filter(Boolean),
        type: 'content',
      });
    });

    return slides;
  }

  /**
   * Generate time-based slides
   */
  private generateTimeBasedSlides(
    project: Project,
    dateRange: { from: Date; to: Date }
  ): Slide[] {
    const slides: Slide[] = [];

    // Milestones in range
    const milestonesInRange = project.milestones.filter(m => {
      const date = new Date(m.targetDate);
      return date >= dateRange.from && date <= dateRange.to;
    });

    if (milestonesInRange.length > 0) {
      slides.push({
        title: 'Milestones in Period',
        content: [
          `Period: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`,
          '',
          ...milestonesInRange.map(m =>
            `- ${m.title} (${m.status}) - ${new Date(m.targetDate).toLocaleDateString()}`
          ),
        ],
        type: 'content',
      });
    }

    // Learnings in range
    const learningsInRange = project.layer3.learnings.filter(l => {
      const date = new Date(l.created);
      return date >= dateRange.from && date <= dateRange.to;
    });

    if (learningsInRange.length > 0) {
      slides.push({
        title: 'Learnings in Period',
        content: learningsInRange.map(l => `- ${l.title}`),
        type: 'content',
      });
    }

    return slides;
  }

  /**
   * Generate custom sections
   */
  private generateCustomSections(project: Project, sections: string[]): Slide[] {
    return sections.map(section => ({
      title: section,
      content: ['Custom content for ' + section],
      type: 'content' as const,
    }));
  }

  /**
   * Create summary slide
   */
  private createSummarySlide(project: Project): Slide {
    const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
    const totalMilestones = project.milestones.length;

    return {
      title: 'Summary',
      content: [
        `Project: ${project.name}`,
        `Status: ${project.status}`,
        `Milestones: ${completedMilestones}/${totalMilestones} completed`,
        `Total Learnings: ${project.layer3.learnings.length}`,
        `Last Updated: ${new Date(project.lastUpdated).toLocaleDateString()}`,
      ],
      type: 'content',
    };
  }

  /**
   * Generate deck title based on config
   */
  private generateDeckTitle(project: Project, config: SlideDeckConfig): string {
    const baseName = project.layer1.prd.title;

    switch (config.type) {
      case 'milestone-based':
        return `${baseName} - Milestone Review`;
      case 'time-based':
        return `${baseName} - Progress Report`;
      case 'on-demand':
        return `${baseName} - Custom Presentation`;
      default:
        return baseName;
    }
  }

  /**
   * Export slide deck as markdown
   */
  public exportAsMarkdown(deck: SlideDeck): string {
    const sections: string[] = [];

    sections.push(`# ${deck.title}\n`);
    sections.push(`Generated: ${deck.created.toLocaleDateString()}\n`);
    sections.push('---\n');

    deck.slides.forEach((slide, index) => {
      sections.push(`## Slide ${index + 1}: ${slide.title}\n`);
      sections.push(slide.content.join('\n'));
      sections.push('\n---\n');
    });

    return sections.join('\n');
  }

  /**
   * Export slide deck as HTML
   */
  public exportAsHTML(deck: SlideDeck): string {
    const slides = deck.slides.map((slide, index) => `
      <div class="slide" data-slide="${index}">
        <h2>${slide.title}</h2>
        <div class="content">
          ${slide.content.map(c => `<p>${c}</p>`).join('\n')}
        </div>
      </div>
    `).join('\n');

    return `
<!DOCTYPE html>
<html>
<head>
  <title>${deck.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .slide { margin-bottom: 40px; padding: 20px; border: 1px solid #ccc; }
    h2 { color: #333; margin-top: 0; }
    .content p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>${deck.title}</h1>
  <p>Generated: ${deck.created.toLocaleDateString()}</p>
  <hr>
  ${slides}
</body>
</html>
    `;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `deck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
