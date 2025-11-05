import { Workflow, WorkflowStep, Project, ProductType } from '../types';

/**
 * Semi-Guided Workflow Engine
 * Provides structured guidance through the product development process
 */
export class WorkflowEngine {
  /**
   * Create a default workflow based on product type
   */
  public createDefaultWorkflow(productType: ProductType): Workflow {
    const baseSteps = this.getBaseSteps();
    const typeSpecificSteps = this.getTypeSpecificSteps(productType);

    return {
      id: this.generateId(),
      name: `${productType} Product Development Workflow`,
      description: `Semi-guided workflow for ${productType} product development`,
      steps: [...baseSteps, ...typeSpecificSteps],
      currentStep: 0,
    };
  }

  /**
   * Get base workflow steps (common to all product types)
   */
  private getBaseSteps(): WorkflowStep[] {
    return [
      {
        id: 'step-prd',
        name: 'Define Product Requirements (PRD)',
        description: 'Create a comprehensive Product Requirements Document',
        required: true,
        completed: false,
        order: 1,
        guidance: `
Define the core aspects of your product:
- What: Clear description of the product
- Why: Problem being solved and rationale
- Who: Target audience and users
- Where: Deployment/usage context
- When: Timeline and key dates
- Market: Target audience, market size, competitors, UVP
- Business: Revenue model, costs, ROI
- Success Metrics: How you'll measure success
        `.trim(),
      },
      {
        id: 'step-mvp',
        name: 'Define MVP Milestones',
        description: 'Identify minimum viable product features and milestones',
        required: true,
        completed: false,
        order: 2,
        guidance: `
Define your MVP scope:
- Identify core features essential for launch
- Create milestones for each MVP feature
- Set realistic target dates
- Define deliverables for each milestone
- Consider dependencies between milestones
        `.trim(),
      },
      {
        id: 'step-additional-milestones',
        name: 'Define Additional Milestones',
        description: 'Plan post-MVP features and enhancements',
        required: false,
        completed: false,
        order: 3,
        guidance: `
Plan your roadmap beyond MVP:
- Identify nice-to-have features
- Plan for scalability and optimization
- Consider future integrations
- Set long-term goals
        `.trim(),
      },
      {
        id: 'step-architecture',
        name: 'Define Technical Architecture',
        description: 'Design the technical architecture and technology stack',
        required: true,
        completed: false,
        order: 4,
        guidance: `
Document technical decisions:
- System architecture and design patterns
- Technology stack and frameworks
- Infrastructure requirements
- Security considerations
- Scalability approach
        `.trim(),
      },
      {
        id: 'step-development',
        name: 'Development Phase',
        description: 'Build the product, document learnings, track progress',
        required: true,
        completed: false,
        order: 5,
        guidance: `
During development:
- Track progress on each milestone
- Document learnings and insights
- Record failures and how you overcame them
- Note unexpected moments and pivots
- Keep technical documentation up to date
- Add relevant external resources and links
        `.trim(),
      },
      {
        id: 'step-testing',
        name: 'Testing & Quality Assurance',
        description: 'Test the product and ensure quality standards',
        required: true,
        completed: false,
        order: 6,
        guidance: `
Quality assurance checklist:
- Unit testing
- Integration testing
- User acceptance testing
- Performance testing
- Security testing
- Document test results and metrics
        `.trim(),
      },
      {
        id: 'step-documentation',
        name: 'Complete Documentation',
        description: 'Finalize all technical and user documentation',
        required: true,
        completed: false,
        order: 7,
        guidance: `
Documentation checklist:
- User documentation
- API documentation (if applicable)
- Setup and installation guides
- Architecture documentation
- Maintenance procedures
        `.trim(),
      },
      {
        id: 'step-handoff-package',
        name: 'Prepare Handoff Package',
        description: 'Compile all deliverables for handoff',
        required: true,
        completed: false,
        order: 8,
        guidance: `
Handoff package should include:
- All source code and files
- Technical documentation
- Test results and quality metrics
- Deployment guides
- IP documentation (patents, licenses, etc.)
- Contact information for ongoing support
        `.trim(),
      },
    ];
  }

  /**
   * Get product type-specific steps
   */
  private getTypeSpecificSteps(productType: ProductType): WorkflowStep[] {
    switch (productType) {
      case ProductType.SOFTWARE:
        return [
          {
            id: 'step-sw-design',
            name: 'UI/UX Design',
            description: 'Design user interface and user experience',
            required: true,
            completed: false,
            order: 3.5,
            guidance: 'Create wireframes, mockups, and interactive prototypes',
          },
          {
            id: 'step-sw-deployment',
            name: 'Deployment Setup',
            description: 'Configure deployment pipeline and environments',
            required: true,
            completed: false,
            order: 7.5,
            guidance: 'Set up CI/CD, staging, and production environments',
          },
        ];

      case ProductType.HARDWARE:
        return [
          {
            id: 'step-hw-design',
            name: 'Hardware Design',
            description: 'Design schematics and PCB layouts',
            required: true,
            completed: false,
            order: 3.5,
            guidance: 'Create detailed hardware designs and bill of materials',
          },
          {
            id: 'step-hw-prototype',
            name: 'Prototyping',
            description: 'Build and test physical prototypes',
            required: true,
            completed: false,
            order: 5.5,
            guidance: 'Iterate on hardware designs based on prototype testing',
          },
          {
            id: 'step-hw-manufacturing',
            name: 'Manufacturing Planning',
            description: 'Plan manufacturing process and supply chain',
            required: true,
            completed: false,
            order: 7.5,
            guidance: 'Work with manufacturers, plan quality control',
          },
        ];

      case ProductType.NON_TANGIBLE:
        return [
          {
            id: 'step-nt-content',
            name: 'Content Creation',
            description: 'Create core content and materials',
            required: true,
            completed: false,
            order: 3.5,
            guidance: 'Develop content, materials, or services',
          },
          {
            id: 'step-nt-delivery',
            name: 'Delivery Method',
            description: 'Define how the product will be delivered',
            required: true,
            completed: false,
            order: 5.5,
            guidance: 'Plan distribution, access, and delivery mechanisms',
          },
        ];

      case ProductType.HYBRID:
        return [
          {
            id: 'step-hybrid-integration',
            name: 'Component Integration',
            description: 'Integrate hardware, software, and service components',
            required: true,
            completed: false,
            order: 5.5,
            guidance: 'Ensure all components work together seamlessly',
          },
        ];

      default:
        return [];
    }
  }

  /**
   * Advance to next step
   */
  public advanceStep(workflow: Workflow): Workflow {
    if (workflow.currentStep < workflow.steps.length - 1) {
      return {
        ...workflow,
        currentStep: workflow.currentStep + 1,
      };
    }
    return workflow;
  }

  /**
   * Go to a specific step
   */
  public goToStep(workflow: Workflow, stepIndex: number): Workflow {
    if (stepIndex >= 0 && stepIndex < workflow.steps.length) {
      return {
        ...workflow,
        currentStep: stepIndex,
      };
    }
    return workflow;
  }

  /**
   * Complete a step
   */
  public completeStep(workflow: Workflow, stepId: string): Workflow {
    return {
      ...workflow,
      steps: workflow.steps.map(step =>
        step.id === stepId ? { ...step, completed: true } : step
      ),
    };
  }

  /**
   * Uncomplete a step
   */
  public uncompleteStep(workflow: Workflow, stepId: string): Workflow {
    return {
      ...workflow,
      steps: workflow.steps.map(step =>
        step.id === stepId ? { ...step, completed: false } : step
      ),
    };
  }

  /**
   * Get current step
   */
  public getCurrentStep(workflow: Workflow): WorkflowStep {
    return workflow.steps[workflow.currentStep];
  }

  /**
   * Get next required incomplete step
   */
  public getNextRequiredStep(workflow: Workflow): WorkflowStep | null {
    return (
      workflow.steps.find(step => step.required && !step.completed) || null
    );
  }

  /**
   * Check if workflow is complete
   */
  public isWorkflowComplete(workflow: Workflow): boolean {
    return workflow.steps
      .filter(step => step.required)
      .every(step => step.completed);
  }

  /**
   * Get workflow progress
   */
  public getProgress(workflow: Workflow): {
    completed: number;
    total: number;
    percentage: number;
  } {
    const requiredSteps = workflow.steps.filter(step => step.required);
    const completedSteps = requiredSteps.filter(step => step.completed);

    return {
      completed: completedSteps.length,
      total: requiredSteps.length,
      percentage: Math.round((completedSteps.length / requiredSteps.length) * 100),
    };
  }

  /**
   * Get workflow status
   */
  public getStatus(workflow: Workflow): string {
    const progress = this.getProgress(workflow);

    if (progress.percentage === 0) {
      return 'Not Started';
    } else if (progress.percentage === 100) {
      return 'Completed';
    } else {
      return `In Progress (${progress.percentage}%)`;
    }
  }

  /**
   * Suggest next action
   */
  public suggestNextAction(workflow: Workflow, project: Project): string {
    const currentStep = this.getCurrentStep(workflow);

    if (currentStep.completed) {
      const nextStep = this.getNextRequiredStep(workflow);
      if (nextStep) {
        return `Move on to: ${nextStep.name}`;
      } else {
        return 'All required steps completed! Consider reviewing optional steps.';
      }
    }

    // Provide specific suggestions based on current step
    switch (currentStep.id) {
      case 'step-prd':
        if (!project.layer1.prd.what) {
          return 'Start by defining what your product is and what problem it solves';
        }
        return 'Complete all sections of the PRD';

      case 'step-mvp':
        if (project.milestones.filter(m => m.isMVP).length === 0) {
          return 'Define at least one MVP milestone';
        }
        return 'Review and finalize your MVP milestones';

      case 'step-development':
        const inProgressMilestones = project.milestones.filter(
          m => m.status === 'in-progress'
        );
        if (inProgressMilestones.length === 0) {
          return 'Start working on a milestone';
        }
        return `Continue working on: ${inProgressMilestones[0].title}`;

      default:
        return currentStep.guidance || `Work on: ${currentStep.name}`;
    }
  }

  /**
   * Add a custom step
   */
  public addCustomStep(
    workflow: Workflow,
    step: Omit<WorkflowStep, 'order'>,
    position: number
  ): Workflow {
    const newSteps = [...workflow.steps];
    newSteps.splice(position, 0, { ...step, order: position });

    // Re-number steps
    newSteps.forEach((s, i) => {
      s.order = i;
    });

    return {
      ...workflow,
      steps: newSteps,
    };
  }

  /**
   * Remove a custom step
   */
  public removeCustomStep(workflow: Workflow, stepId: string): Workflow {
    // Don't remove required base steps
    const step = workflow.steps.find(s => s.id === stepId);
    if (step && step.required && step.id.startsWith('step-')) {
      return workflow; // Can't remove base required steps
    }

    return {
      ...workflow,
      steps: workflow.steps.filter(s => s.id !== stepId),
    };
  }

  /**
   * Generate workflow report
   */
  public generateReport(workflow: Workflow, project: Project): string {
    const sections: string[] = [];

    sections.push(`# Workflow Report: ${workflow.name}\n`);
    sections.push(`Status: ${this.getStatus(workflow)}`);

    const progress = this.getProgress(workflow);
    sections.push(`Progress: ${progress.completed}/${progress.total} (${progress.percentage}%)\n`);

    sections.push('## Steps\n');

    workflow.steps.forEach((step, index) => {
      const status = step.completed ? '✓' : step.required ? '○' : '◌';
      const current = index === workflow.currentStep ? ' (CURRENT)' : '';
      sections.push(`${status} ${step.name}${current}`);
      sections.push(`   ${step.description}`);
      if (!step.completed && step.required) {
        sections.push(`   Status: Incomplete`);
      }
      sections.push('');
    });

    sections.push('\n## Next Action');
    sections.push(this.suggestNextAction(workflow, project));

    return sections.join('\n');
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
