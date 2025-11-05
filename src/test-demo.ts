// Test script to create a demo project and generate HTML slide deck
import { Application, ProductType, LearningCategory, DependencyType, CriticalityLevel, DependencyStatus } from './index';

async function main() {
  const app = new Application('./data');
  await app.initialize();

  // Create project
  console.log('Creating project...');
  const project = app.createProject('Smart Fitness Wearable', ProductType.HYBRID);

  // Update PRD
  console.log('Setting up PRD...');
  app.updatePRD({
    what: 'A smart wearable device with AI-powered health tracking, heart rate monitoring, and companion mobile app',
    why: 'Current fitness trackers lack AI personalization and fail to provide actionable insights',
    who: 'Health-conscious professionals aged 25-45 who want data-driven fitness guidance',
    where: 'Wearable device + iOS/Android mobile applications + cloud backend',
    when: 'MVP launch Q2 2025, full product launch Q4 2025',
    market: {
      targetAudience: 'Tech-savvy fitness enthusiasts and health-conscious professionals',
      marketSize: '$62B wearables market, targeting 2M users year 1',
      competitors: ['Fitbit', 'Apple Watch', 'Garmin', 'Whoop'],
      uniqueValueProposition: 'Only wearable with real-time AI coaching that adapts to your biometric data',
    },
    business: {
      revenueModel: 'Hardware sales + subscription ($14.99/month for AI coaching)',
      projectedRevenue: '$15M ARR by end of year 2',
      estimatedCost: '$3.5M development + $800K operations yearly',
      roi: '250% by year 3',
    },
    successMetrics: [
      'User engagement: 80% daily active users',
      'AI accuracy: 90%+ prediction accuracy for workout recommendations',
      'Customer retention: 70% annual retention rate',
      'Net Promoter Score: 50+',
    ],
    constraints: [
      'Battery life must be minimum 5 days',
      'Waterproof to 50m',
      'FDA compliance for health metrics',
      'Must sync in under 30 seconds',
    ],
    assumptions: [
      'Users have smartphones (iOS 14+ or Android 10+)',
      'Users willing to pay for subscription',
      'Regulatory approval timeline of 6 months',
    ],
  });

  // Add milestones
  console.log('Adding milestones...');

  app.addMilestone({
    title: 'Hardware Prototype Design',
    description: 'Complete circuit design, sensor selection, and PCB layout',
    targetDate: new Date('2025-03-15'),
    isMVP: true,
    deliverables: ['Circuit schematics', 'PCB layout', 'Bill of materials', '3D case design'],
  });

  app.addMilestone({
    title: 'Firmware Development',
    description: 'Core firmware for sensor reading and data transmission',
    targetDate: new Date('2025-04-01'),
    isMVP: true,
    deliverables: ['Sensor drivers', 'Bluetooth communication', 'Power management', 'Data logging'],
  });

  app.addMilestone({
    title: 'Mobile App MVP',
    description: 'iOS and Android apps for data visualization',
    targetDate: new Date('2025-04-15'),
    isMVP: true,
    deliverables: ['User authentication', 'Data sync', 'Basic dashboard', 'Settings'],
  });

  app.addMilestone({
    title: 'AI Model Training',
    description: 'Train ML models for personalized coaching',
    targetDate: new Date('2025-05-01'),
    isMVP: true,
    deliverables: ['Training dataset', 'Model architecture', 'Training pipeline', 'API integration'],
  });

  app.addMilestone({
    title: 'Beta Testing Program',
    description: 'Run beta test with 100 users',
    targetDate: new Date('2025-06-01'),
    isMVP: false,
    deliverables: ['Beta tester recruitment', 'Feedback collection', 'Bug fixes', 'Performance improvements'],
  });

  // Update some milestone progress
  const milestones = app.getCurrentProject()!.milestones;
  app.updateMilestone(milestones[0].id, { status: 'completed', progress: 100 });
  app.updateMilestone(milestones[1].id, { status: 'in-progress', progress: 65 });
  app.updateMilestone(milestones[2].id, { status: 'in-progress', progress: 40 });

  // Add dependencies
  console.log('Adding dependencies...');

  app.addDependency({
    name: 'Maxim MAX30102 Heart Rate Sensor',
    type: DependencyType.HARDWARE,
    description: 'Integrated pulse oximetry and heart rate sensor',
    vendor: 'Maxim Integrated',
    criticality: CriticalityLevel.CRITICAL,
    cost: {
      model: 'one-time',
      amount: '$3.50',
      currency: 'USD',
      billingCycle: 'one-time',
    },
    relatedMilestones: [milestones[0].id],
  });

  app.addDependency({
    name: 'Nordic nRF52840 Bluetooth SoC',
    type: DependencyType.HARDWARE,
    description: 'Bluetooth Low Energy System-on-Chip',
    vendor: 'Nordic Semiconductor',
    criticality: CriticalityLevel.CRITICAL,
    cost: {
      model: 'one-time',
      amount: '$5.20',
      currency: 'USD',
      billingCycle: 'one-time',
    },
    relatedMilestones: [milestones[0].id, milestones[1].id],
  });

  app.addDependency({
    name: 'AWS IoT Core',
    type: DependencyType.SERVICE,
    description: 'Cloud platform for device connectivity and data ingestion',
    vendor: 'Amazon Web Services',
    criticality: CriticalityLevel.HIGH,
    cost: {
      model: 'usage-based',
      amount: 'Variable based on device count',
      currency: 'USD',
      notes: 'Estimated $0.08 per 100K messages',
    },
    relatedMilestones: [milestones[1].id, milestones[2].id],
  });

  app.addDependency({
    name: 'TensorFlow Lite',
    type: DependencyType.SOFTWARE,
    description: 'On-device ML inference framework',
    vendor: 'Google',
    criticality: CriticalityLevel.HIGH,
    cost: {
      model: 'free',
    },
    relatedMilestones: [milestones[3].id],
  });

  app.addDependency({
    name: 'React Native',
    type: DependencyType.SOFTWARE,
    description: 'Cross-platform mobile app framework',
    vendor: 'Meta',
    criticality: CriticalityLevel.HIGH,
    cost: {
      model: 'free',
    },
    relatedMilestones: [milestones[2].id],
  });

  // Update dependency statuses
  const deps = app.getCurrentProject()!.dependencies.dependencies;
  app.updateDependencyStatus(deps[0].id, DependencyStatus.ACQUIRED);
  app.updateDependencyStatus(deps[1].id, DependencyStatus.ACQUIRED);
  app.updateDependencyStatus(deps[2].id, DependencyStatus.INTEGRATED);
  app.updateDependencyStatus(deps[3].id, DependencyStatus.INTEGRATED);
  app.updateDependencyStatus(deps[4].id, DependencyStatus.INTEGRATED);

  // Add learnings
  console.log('Adding learnings...');

  app.addLearning({
    title: 'Battery Life Optimization Success',
    content: 'By implementing adaptive sampling rates, we extended battery life from 3 days to 6 days - exceeding our 5-day requirement',
    category: LearningCategory.SUCCESS,
    tags: ['hardware', 'power-management'],
  });

  app.addLearning({
    title: 'Bluetooth Pairing Challenges',
    content: 'Initial BLE pairing had 40% failure rate. Implemented retry logic and improved UX, reduced failures to 5%',
    category: LearningCategory.TECHNIQUE,
    tags: ['bluetooth', 'mobile'],
  });

  app.addLearning({
    title: 'Pivot from Custom ML to TensorFlow',
    content: 'Our custom ML framework was too slow for on-device inference. Switching to TensorFlow Lite reduced inference time from 800ms to 120ms',
    category: LearningCategory.PIVOT,
    tags: ['machine-learning', 'performance'],
  });

  app.addLearning({
    title: 'PCB Design Iteration',
    content: 'First PCB had EM interference between WiFi and heart rate sensor. Redesigned with proper grounding and shielding',
    category: LearningCategory.FAILURE,
    tags: ['hardware', 'pcb'],
  });

  // Add notes
  app.addNote('FDA pre-submission meeting scheduled for March 20th', ['regulatory', 'meeting']);
  app.addNote('Beta tester recruitment ongoing - 45 signups so far', ['beta', 'testing']);
  app.addNote('Considering partnership with gym chain for distribution', ['business-development']);

  // Add unexpected moment
  app.addUnexpectedMoment({
    title: 'Heart Rate Sensor Supply Chain Delay',
    description: 'Primary sensor supplier (Maxim) announced 12-week lead time delay due to chip shortage',
    impact: 'high',
    milestoneId: milestones[0].id,
  });

  // Update technical package
  app.updateTechnicalPackage({
    engineering: {
      architecture: 'Hybrid hardware-software system with edge computing and cloud backend',
      technologies: [
        'Nordic nRF52840 (BLE SoC)',
        'ARM Cortex-M4 processor',
        'React Native (Mobile)',
        'Node.js (Backend)',
        'AWS IoT Core',
        'TensorFlow Lite',
        'PostgreSQL',
      ],
      dependencies: [
        'Bluetooth Low Energy 5.2',
        'iOS 14+ / Android 10+',
        'Cloud connectivity',
      ],
      setupInstructions: 'Full setup guide available in technical documentation',
    },
  });

  // Save project
  console.log('Saving project...');
  await app.saveProject();

  // Generate HTML slide deck
  console.log('Generating slide deck...');
  const deck = app.generateSlideDeck({
    type: 'on-demand',
    includeLayer1: true,
    includeLayer2: true,
    includeLayer3: true,
  });

  // Export as HTML
  const html = app.exportSlideDeckAsHTML(deck);

  // Write to file
  const fs = require('fs');
  fs.writeFileSync('smart-fitness-tracker-presentation.html', html);

  console.log('\n✅ Success!');
  console.log('📊 Project created with:');
  console.log(`   - ${project.milestones.length} milestones (${milestones.filter(m => m.isMVP).length} MVP)`);
  console.log(`   - ${project.dependencies.dependencies.length} dependencies tracked`);
  console.log(`   - ${project.layer3.learnings.length} learnings captured`);
  console.log(`   - ${deck.slides.length} slides generated`);
  console.log('\n📄 HTML presentation saved to: smart-fitness-tracker-presentation.html');
  console.log('\n👉 Open the HTML file to view the presentation!');
}

main().catch(console.error);
