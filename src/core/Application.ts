import {
  Project,
  ProductType,
  ProjectStatus,
  Milestone,
  PRD,
  SlideDeckConfig,
  SlideDeck,
  Workflow,
} from '../types';
import { ModuleRegistry } from './ModuleRegistry';
import { Layer1Manager } from '../layers/Layer1Manager';
import { Layer2Manager } from '../layers/Layer2Manager';
import { Layer3Manager } from '../layers/Layer3Manager';
import { MilestoneManager } from '../modules/MilestoneManager';
import { SlideDeckGenerator } from '../export/SlideDeckGenerator';
import { WorkflowEngine } from '../workflow/WorkflowEngine';
import { JSONStorage, IStorage } from '../storage/Storage';

/**
 * Main Application Controller
 * Orchestrates all layers and modules
 */
export class Application {
  private storage: IStorage;
  private moduleRegistry: ModuleRegistry;
  private layer1Manager: Layer1Manager;
  private layer2Manager: Layer2Manager;
  private layer3Manager: Layer3Manager;
  private milestoneManager: MilestoneManager;
  private slideDeckGenerator: SlideDeckGenerator;
  private workflowEngine: WorkflowEngine;

  private currentProject: Project | null = null;
  private currentWorkflow: Workflow | null = null;

  constructor(storagePath: string = './data') {
    this.storage = new JSONStorage(storagePath);
    this.moduleRegistry = ModuleRegistry.getInstance();
    this.layer1Manager = new Layer1Manager();
    this.layer2Manager = new Layer2Manager();
    this.layer3Manager = new Layer3Manager();
    this.milestoneManager = new MilestoneManager();
    this.slideDeckGenerator = new SlideDeckGenerator();
    this.workflowEngine = new WorkflowEngine();
  }

  /**
   * Initialize the application
   */
  public async initialize(): Promise<void> {
    await this.moduleRegistry.initializeAll();
    console.log('Application initialized successfully');
  }

  /**
   * Create a new project
   */
  public createProject(name: string, productType: ProductType): Project {
    const prd = this.layer1Manager.createPRD({
      title: name,
      productType,
      what: '',
      why: '',
      who: '',
      where: '',
      when: '',
      market: {
        targetAudience: '',
        marketSize: '',
        competitors: [],
        uniqueValueProposition: '',
      },
      business: {
        revenueModel: '',
      },
    });

    const project: Project = {
      id: this.generateId(),
      name,
      created: new Date(),
      lastUpdated: new Date(),
      status: ProjectStatus.PLANNING,
      layer1: this.layer1Manager.createInvestorOverview(
        prd,
        ProjectStatus.PLANNING,
        []
      ),
      layer2: this.layer2Manager.createTechnicalPackage(this.generateId()),
      layer3: this.layer3Manager.createBehindTheScenes(),
      milestones: [],
      tags: [],
      team: [],
    };

    this.currentProject = project;
    this.currentWorkflow = this.workflowEngine.createDefaultWorkflow(productType);

    return project;
  }

  /**
   * Load an existing project
   */
  public async loadProject(projectId: string): Promise<Project | null> {
    const project = await this.storage.load(projectId);
    if (project) {
      this.currentProject = project;
      // Recreate workflow based on product type
      this.currentWorkflow = this.workflowEngine.createDefaultWorkflow(
        project.layer1.prd.productType
      );
    }
    return project;
  }

  /**
   * Save the current project
   */
  public async saveProject(): Promise<void> {
    if (!this.currentProject) {
      throw new Error('No active project to save');
    }

    this.currentProject.lastUpdated = new Date();
    await this.storage.save(this.currentProject);
    console.log(`Project saved: ${this.currentProject.name}`);
  }

  /**
   * Get current project
   */
  public getCurrentProject(): Project | null {
    return this.currentProject;
  }

  /**
   * Get current workflow
   */
  public getCurrentWorkflow(): Workflow | null {
    return this.currentWorkflow;
  }

  /**
   * Update PRD
   */
  public updatePRD(updates: Partial<PRD>): void {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    const updatedPRD = this.layer1Manager.updatePRD(
      this.currentProject.layer1.prd,
      updates
    );

    this.currentProject.layer1.prd = updatedPRD;
    this.currentProject.layer1 = this.layer1Manager.updateInvestorOverview(
      this.currentProject.layer1,
      { prd: updatedPRD }
    );
  }

  /**
   * Add a milestone
   */
  public addMilestone(params: {
    title: string;
    description: string;
    targetDate: Date;
    isMVP?: boolean;
    deliverables?: string[];
  }): Milestone {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    const milestone = this.milestoneManager.createMilestone(
      this.currentProject.id,
      params
    );

    this.currentProject.milestones.push(milestone);
    this.currentProject.layer1 = this.layer1Manager.updateInvestorOverview(
      this.currentProject.layer1,
      { milestones: this.currentProject.milestones }
    );

    return milestone;
  }

  /**
   * Update milestone
   */
  public updateMilestone(milestoneId: string, updates: Partial<Milestone>): void {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    const index = this.currentProject.milestones.findIndex(m => m.id === milestoneId);
    if (index === -1) {
      throw new Error(`Milestone ${milestoneId} not found`);
    }

    this.currentProject.milestones[index] = {
      ...this.currentProject.milestones[index],
      ...updates,
    };

    // Update investor overview
    this.currentProject.layer1 = this.layer1Manager.updateInvestorOverview(
      this.currentProject.layer1,
      { milestones: this.currentProject.milestones }
    );
  }

  /**
   * Add a learning
   */
  public addLearning(params: {
    title: string;
    content: string;
    category: any;
    tags?: string[];
  }): void {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    this.currentProject.layer3 = this.layer3Manager.addLearning(
      this.currentProject.layer3,
      this.currentProject.id,
      params
    );
  }

  /**
   * Add a note
   */
  public addNote(content: string, tags?: string[]): void {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    this.currentProject.layer3 = this.layer3Manager.addNote(
      this.currentProject.layer3,
      this.currentProject.id,
      { content, tags }
    );
  }

  /**
   * Add an unexpected moment
   */
  public addUnexpectedMoment(params: {
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    milestoneId?: string;
  }): void {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    this.currentProject.layer3 = this.layer3Manager.addUnexpectedMoment(
      this.currentProject.layer3,
      this.currentProject.id,
      params
    );
  }

  /**
   * Update technical package
   */
  public updateTechnicalPackage(updates: any): void {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    if (updates.engineering) {
      this.currentProject.layer2 = this.layer2Manager.updateEngineering(
        this.currentProject.layer2,
        updates.engineering
      );
    }

    if (updates.deployment) {
      this.currentProject.layer2 = this.layer2Manager.setDeployment(
        this.currentProject.layer2,
        updates.deployment
      );
    }
  }

  /**
   * Generate slide deck
   */
  public generateSlideDeck(config: SlideDeckConfig): SlideDeck {
    if (!this.currentProject) {
      throw new Error('No active project');
    }

    return this.slideDeckGenerator.generateDeck(this.currentProject, config);
  }

  /**
   * Export slide deck as markdown
   */
  public exportSlideDeckAsMarkdown(deck: SlideDeck): string {
    return this.slideDeckGenerator.exportAsMarkdown(deck);
  }

  /**
   * Export slide deck as HTML
   */
  public exportSlideDeckAsHTML(deck: SlideDeck): string {
    return this.slideDeckGenerator.exportAsHTML(deck);
  }

  /**
   * Complete workflow step
   */
  public completeWorkflowStep(stepId: string): void {
    if (!this.currentWorkflow) {
      throw new Error('No active workflow');
    }

    this.currentWorkflow = this.workflowEngine.completeStep(
      this.currentWorkflow,
      stepId
    );
  }

  /**
   * Get workflow suggestion
   */
  public getWorkflowSuggestion(): string {
    if (!this.currentWorkflow || !this.currentProject) {
      return 'No active project or workflow';
    }

    return this.workflowEngine.suggestNextAction(
      this.currentWorkflow,
      this.currentProject
    );
  }

  /**
   * Get workflow progress
   */
  public getWorkflowProgress(): any {
    if (!this.currentWorkflow) {
      return null;
    }

    return this.workflowEngine.getProgress(this.currentWorkflow);
  }

  /**
   * List all projects
   */
  public async listProjects(): Promise<Project[]> {
    return await this.storage.loadAll();
  }

  /**
   * Delete a project
   */
  public async deleteProject(projectId: string): Promise<void> {
    await this.storage.delete(projectId);
    if (this.currentProject && this.currentProject.id === projectId) {
      this.currentProject = null;
      this.currentWorkflow = null;
    }
  }

  /**
   * Get project summary
   */
  public getProjectSummary(): string {
    if (!this.currentProject) {
      return 'No active project';
    }

    const sections: string[] = [];

    sections.push(`Project: ${this.currentProject.name}`);
    sections.push(`Status: ${this.currentProject.status}`);
    sections.push(`Product Type: ${this.currentProject.layer1.prd.productType}`);
    sections.push(`Created: ${this.currentProject.created.toLocaleDateString()}\n`);

    // Milestones
    const mvpProgress = this.milestoneManager.getMVPProgress(this.currentProject.milestones);
    sections.push(`Milestones: ${this.currentProject.milestones.length} total`);
    sections.push(`MVP Progress: ${mvpProgress.percentage}%`);
    sections.push(
      `Overall Progress: ${this.milestoneManager.getOverallProgress(this.currentProject.milestones)}%\n`
    );

    // Learnings
    sections.push(`Learnings: ${this.currentProject.layer3.learnings.length}`);
    sections.push(`Notes: ${this.currentProject.layer3.notes.length}`);
    sections.push(`Unexpected Moments: ${this.currentProject.layer3.unexpectedMoments.length}\n`);

    // Workflow
    if (this.currentWorkflow) {
      const progress = this.workflowEngine.getProgress(this.currentWorkflow);
      sections.push(`Workflow Progress: ${progress.percentage}%`);
      sections.push(`Suggestion: ${this.getWorkflowSuggestion()}`);
    }

    return sections.join('\n');
  }

  /**
   * Export project data
   */
  public async exportProject(projectId: string, exportPath: string): Promise<void> {
    await this.storage.export(projectId, exportPath);
  }

  /**
   * Shutdown the application
   */
  public async shutdown(): Promise<void> {
    await this.moduleRegistry.destroyAll();
    console.log('Application shut down successfully');
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
