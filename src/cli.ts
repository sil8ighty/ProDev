#!/usr/bin/env node

import { Command } from 'commander';
import { Application } from './core/Application';
import { ProductType, LearningCategory, ProjectStatus } from './types';
import * as fs from 'fs';
import * as path from 'path';

const app = new Application();
const program = new Command();

// Helper function to ensure app is initialized
async function ensureInitialized() {
  await app.initialize();
}

// Helper function to ensure project is loaded
function ensureProject() {
  const project = app.getCurrentProject();
  if (!project) {
    console.error('No active project. Create or load a project first.');
    process.exit(1);
  }
  return project;
}

program
  .name('prodev')
  .description('Modular Product Development Tracking System')
  .version('0.1.0');

// ============================================================================
// PROJECT COMMANDS
// ============================================================================

program
  .command('init <name>')
  .description('Create a new project')
  .option('-t, --type <type>', 'Product type (software, hardware, non-tangible, hybrid)', 'software')
  .action(async (name, options) => {
    await ensureInitialized();

    const typeMap: Record<string, ProductType> = {
      software: ProductType.SOFTWARE,
      hardware: ProductType.HARDWARE,
      'non-tangible': ProductType.NON_TANGIBLE,
      hybrid: ProductType.HYBRID,
    };

    const productType = typeMap[options.type] || ProductType.SOFTWARE;

    const project = app.createProject(name, productType);
    await app.saveProject();

    console.log(`\nProject created: ${project.name}`);
    console.log(`Product Type: ${project.layer1.prd.productType}`);
    console.log(`Project ID: ${project.id}\n`);
    console.log('Next step: Define your PRD using the "prd" commands');
  });

program
  .command('load <projectId>')
  .description('Load an existing project')
  .action(async (projectId) => {
    await ensureInitialized();

    const project = await app.loadProject(projectId);
    if (project) {
      console.log(`Project loaded: ${project.name}`);
      console.log(app.getProjectSummary());
    } else {
      console.error(`Project ${projectId} not found`);
    }
  });

program
  .command('list')
  .description('List all projects')
  .action(async () => {
    await ensureInitialized();

    const projects = await app.listProjects();
    if (projects.length === 0) {
      console.log('No projects found');
    } else {
      console.log('\nProjects:');
      projects.forEach(p => {
        console.log(`\n- ${p.name}`);
        console.log(`  ID: ${p.id}`);
        console.log(`  Type: ${p.layer1.prd.productType}`);
        console.log(`  Status: ${p.status}`);
        console.log(`  Created: ${p.created.toLocaleDateString()}`);
      });
    }
  });

program
  .command('status')
  .description('Show current project status')
  .action(async () => {
    await ensureInitialized();
    ensureProject();
    console.log(app.getProjectSummary());
  });

program
  .command('save')
  .description('Save current project')
  .action(async () => {
    await ensureInitialized();
    ensureProject();
    await app.saveProject();
  });

// ============================================================================
// PRD COMMANDS
// ============================================================================

const prdCmd = program
  .command('prd')
  .description('Manage Product Requirements Document');

prdCmd
  .command('set <field> <value>')
  .description('Set a PRD field (what, why, who, where, when)')
  .action(async (field, value) => {
    await ensureInitialized();
    const project = ensureProject();

    const validFields = ['what', 'why', 'who', 'where', 'when'];
    if (!validFields.includes(field)) {
      console.error(`Invalid field. Must be one of: ${validFields.join(', ')}`);
      process.exit(1);
    }

    app.updatePRD({ [field]: value });
    await app.saveProject();
    console.log(`Updated ${field}: ${value}`);
  });

prdCmd
  .command('market')
  .description('Set market information')
  .option('--audience <audience>', 'Target audience')
  .option('--size <size>', 'Market size')
  .option('--uvp <uvp>', 'Unique value proposition')
  .option('--competitor <competitor>', 'Add competitor (can be used multiple times)')
  .action(async (options) => {
    await ensureInitialized();
    const project = ensureProject();

    const updates: any = {};
    const market = { ...project.layer1.prd.market };

    if (options.audience) market.targetAudience = options.audience;
    if (options.size) market.marketSize = options.size;
    if (options.uvp) market.uniqueValueProposition = options.uvp;
    if (options.competitor) {
      if (!market.competitors.includes(options.competitor)) {
        market.competitors.push(options.competitor);
      }
    }

    app.updatePRD({ market });
    await app.saveProject();
    console.log('Market information updated');
  });

prdCmd
  .command('business')
  .description('Set business information')
  .option('--revenue <model>', 'Revenue model')
  .option('--projected <amount>', 'Projected revenue')
  .option('--cost <amount>', 'Estimated cost')
  .option('--roi <percentage>', 'Expected ROI')
  .action(async (options) => {
    await ensureInitialized();
    const project = ensureProject();

    const business = { ...project.layer1.prd.business };

    if (options.revenue) business.revenueModel = options.revenue;
    if (options.projected) business.projectedRevenue = options.projected;
    if (options.cost) business.estimatedCost = options.cost;
    if (options.roi) business.roi = options.roi;

    app.updatePRD({ business });
    await app.saveProject();
    console.log('Business information updated');
  });

prdCmd
  .command('show')
  .description('Show the current PRD')
  .action(async () => {
    await ensureInitialized();
    const project = ensureProject();
    const prd = project.layer1.prd;

    console.log('\n=== PRODUCT REQUIREMENTS DOCUMENT ===\n');
    console.log(`Title: ${prd.title}`);
    console.log(`Version: ${prd.version}`);
    console.log(`Type: ${prd.productType}\n`);
    console.log(`What: ${prd.what}`);
    console.log(`Why: ${prd.why}`);
    console.log(`Who: ${prd.who}`);
    console.log(`Where: ${prd.where}`);
    console.log(`When: ${prd.when}\n`);
    console.log('Market:');
    console.log(`  Target Audience: ${prd.market.targetAudience}`);
    console.log(`  Market Size: ${prd.market.marketSize}`);
    console.log(`  UVP: ${prd.market.uniqueValueProposition}`);
    console.log(`  Competitors: ${prd.market.competitors.join(', ')}\n`);
    console.log('Business:');
    console.log(`  Revenue Model: ${prd.business.revenueModel}`);
    if (prd.business.projectedRevenue) console.log(`  Projected Revenue: ${prd.business.projectedRevenue}`);
    if (prd.business.estimatedCost) console.log(`  Estimated Cost: ${prd.business.estimatedCost}`);
    if (prd.business.roi) console.log(`  ROI: ${prd.business.roi}`);
  });

// ============================================================================
// MILESTONE COMMANDS
// ============================================================================

const milestoneCmd = program
  .command('milestone')
  .description('Manage milestones');

milestoneCmd
  .command('add <title>')
  .description('Add a new milestone')
  .option('-d, --description <desc>', 'Description', '')
  .option('-t, --target <date>', 'Target date (YYYY-MM-DD)')
  .option('-m, --mvp', 'Mark as MVP milestone')
  .option('--deliverable <item>', 'Add deliverable (can be used multiple times)')
  .action(async (title, options) => {
    await ensureInitialized();
    ensureProject();

    const targetDate = options.target ? new Date(options.target) : new Date();
    const deliverables = options.deliverable ? [options.deliverable] : [];

    const milestone = app.addMilestone({
      title,
      description: options.description,
      targetDate,
      isMVP: options.mvp || false,
      deliverables,
    });

    await app.saveProject();
    console.log(`\nMilestone added: ${milestone.title}`);
    console.log(`ID: ${milestone.id}`);
    console.log(`MVP: ${milestone.isMVP ? 'Yes' : 'No'}`);
  });

milestoneCmd
  .command('list')
  .description('List all milestones')
  .option('-m, --mvp', 'Show only MVP milestones')
  .action(async (options) => {
    await ensureInitialized();
    const project = ensureProject();

    let milestones = project.milestones;
    if (options.mvp) {
      milestones = milestones.filter(m => m.isMVP);
    }

    if (milestones.length === 0) {
      console.log('No milestones found');
      return;
    }

    console.log('\nMilestones:');
    milestones.forEach(m => {
      const mvpTag = m.isMVP ? ' [MVP]' : '';
      console.log(`\n- ${m.title}${mvpTag}`);
      console.log(`  Status: ${m.status}`);
      console.log(`  Progress: ${m.progress}%`);
      console.log(`  Target: ${new Date(m.targetDate).toLocaleDateString()}`);
      if (m.blockers.length > 0) {
        console.log(`  Blockers: ${m.blockers.join(', ')}`);
      }
    });
  });

milestoneCmd
  .command('update <title>')
  .description('Update milestone status')
  .option('-s, --status <status>', 'Status (pending, in-progress, completed, blocked)')
  .option('-p, --progress <percent>', 'Progress percentage (0-100)')
  .action(async (title, options) => {
    await ensureInitialized();
    const project = ensureProject();

    const milestone = project.milestones.find(m => m.title === title);
    if (!milestone) {
      console.error(`Milestone "${title}" not found`);
      process.exit(1);
    }

    const updates: any = {};
    if (options.status) updates.status = options.status;
    if (options.progress) updates.progress = parseInt(options.progress);

    app.updateMilestone(milestone.id, updates);
    await app.saveProject();
    console.log(`Milestone updated: ${title}`);
  });

// ============================================================================
// LEARNING COMMANDS
// ============================================================================

const learningCmd = program
  .command('learning')
  .description('Manage learnings');

learningCmd
  .command('add <title>')
  .description('Add a learning')
  .option('-c, --content <content>', 'Learning content', '')
  .option('-t, --type <type>', 'Category (success, failure, insight, technique, decision, pivot)', 'insight')
  .option('--tag <tag>', 'Add tag (can be used multiple times)')
  .action(async (title, options) => {
    await ensureInitialized();
    ensureProject();

    const categoryMap: Record<string, LearningCategory> = {
      success: LearningCategory.SUCCESS,
      failure: LearningCategory.FAILURE,
      insight: LearningCategory.INSIGHT,
      technique: LearningCategory.TECHNIQUE,
      decision: LearningCategory.DECISION,
      pivot: LearningCategory.PIVOT,
    };

    const category = categoryMap[options.type] || LearningCategory.INSIGHT;
    const tags = options.tag ? [options.tag] : [];

    app.addLearning({
      title,
      content: options.content,
      category,
      tags,
    });

    await app.saveProject();
    console.log(`Learning added: ${title}`);
  });

learningCmd
  .command('list')
  .description('List all learnings')
  .option('-t, --type <type>', 'Filter by category')
  .action(async (options) => {
    await ensureInitialized();
    const project = ensureProject();

    let learnings = project.layer3.learnings;

    if (options.type) {
      learnings = learnings.filter(l => l.category === options.type);
    }

    if (learnings.length === 0) {
      console.log('No learnings found');
      return;
    }

    console.log('\nLearnings:');
    learnings.forEach(l => {
      console.log(`\n- ${l.title} [${l.category}]`);
      console.log(`  ${l.content}`);
      if (l.tags.length > 0) {
        console.log(`  Tags: ${l.tags.join(', ')}`);
      }
    });
  });

// ============================================================================
// NOTE COMMANDS
// ============================================================================

const noteCmd = program
  .command('note')
  .description('Manage notes');

noteCmd
  .command('add <content>')
  .description('Add a note')
  .option('--tag <tag>', 'Add tag (can be used multiple times)')
  .action(async (content, options) => {
    await ensureInitialized();
    ensureProject();

    const tags = options.tag ? [options.tag] : [];
    app.addNote(content, tags);

    await app.saveProject();
    console.log('Note added');
  });

noteCmd
  .command('list')
  .description('List all notes')
  .action(async () => {
    await ensureInitialized();
    const project = ensureProject();

    if (project.layer3.notes.length === 0) {
      console.log('No notes found');
      return;
    }

    console.log('\nNotes:');
    project.layer3.notes.forEach(n => {
      console.log(`\n- ${n.content}`);
      console.log(`  Created: ${new Date(n.created).toLocaleDateString()}`);
      if (n.tags.length > 0) {
        console.log(`  Tags: ${n.tags.join(', ')}`);
      }
    });
  });

// ============================================================================
// WORKFLOW COMMANDS
// ============================================================================

const workflowCmd = program
  .command('workflow')
  .description('Manage workflow');

workflowCmd
  .command('show')
  .description('Show workflow progress')
  .action(async () => {
    await ensureInitialized();
    ensureProject();

    const workflow = app.getCurrentWorkflow();
    if (!workflow) {
      console.log('No workflow available');
      return;
    }

    const progress = app.getWorkflowProgress();
    console.log(`\nWorkflow: ${workflow.name}`);
    console.log(`Progress: ${progress.completed}/${progress.total} (${progress.percentage}%)\n`);

    console.log('Steps:');
    workflow.steps.forEach((step, index) => {
      const status = step.completed ? '✓' : step.required ? '○' : '◌';
      const current = index === workflow.currentStep ? ' ← CURRENT' : '';
      console.log(`${status} ${step.name}${current}`);
    });

    console.log(`\nSuggestion: ${app.getWorkflowSuggestion()}`);
  });

workflowCmd
  .command('complete <stepName>')
  .description('Mark a workflow step as complete')
  .action(async (stepName) => {
    await ensureInitialized();
    ensureProject();

    const workflow = app.getCurrentWorkflow();
    if (!workflow) {
      console.log('No workflow available');
      return;
    }

    const step = workflow.steps.find(s =>
      s.name.toLowerCase().includes(stepName.toLowerCase())
    );

    if (!step) {
      console.error(`Step "${stepName}" not found`);
      process.exit(1);
    }

    app.completeWorkflowStep(step.id);
    await app.saveProject();
    console.log(`Step completed: ${step.name}`);
  });

// ============================================================================
// EXPORT COMMANDS
// ============================================================================

const exportCmd = program
  .command('export')
  .description('Export project data');

exportCmd
  .command('deck')
  .description('Generate and export a slide deck')
  .option('-t, --type <type>', 'Deck type (time-based, milestone-based, on-demand)', 'on-demand')
  .option('--layer1', 'Include Layer 1 (Overview)', true)
  .option('--layer2', 'Include Layer 2 (Technical)', false)
  .option('--layer3', 'Include Layer 3 (Behind-the-scenes)', false)
  .option('-f, --format <format>', 'Export format (markdown, html)', 'markdown')
  .option('-o, --output <file>', 'Output file', 'deck')
  .action(async (options) => {
    await ensureInitialized();
    ensureProject();

    const typeMap: Record<string, any> = {
      'time-based': 'time-based',
      'milestone-based': 'milestone-based',
      'on-demand': 'on-demand',
    };

    const deck = app.generateSlideDeck({
      type: typeMap[options.type] || 'on-demand',
      includeLayer1: options.layer1,
      includeLayer2: options.layer2,
      includeLayer3: options.layer3,
    });

    let content: string;
    let extension: string;

    if (options.format === 'html') {
      content = app.exportSlideDeckAsHTML(deck);
      extension = 'html';
    } else {
      content = app.exportSlideDeckAsMarkdown(deck);
      extension = 'md';
    }

    const filename = `${options.output}.${extension}`;
    fs.writeFileSync(filename, content);

    console.log(`Slide deck exported to: ${filename}`);
    console.log(`Total slides: ${deck.slides.length}`);
  });

exportCmd
  .command('project <outputFile>')
  .description('Export entire project as JSON')
  .action(async (outputFile) => {
    await ensureInitialized();
    const project = ensureProject();

    await app.exportProject(project.id, outputFile);
    console.log(`Project exported to: ${outputFile}`);
  });

// ============================================================================
// MAIN
// ============================================================================

program.parse(process.argv);
