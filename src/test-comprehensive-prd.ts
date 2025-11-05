// Comprehensive PRD System Demo
// Demonstrates the complete PRD workflow with validation and templates

import { Application } from './index';
import { ProductCategory, PriorityLevel, FeasibilityStatus } from './types/comprehensive-prd';

async function main() {
  const app = new Application('./data');
  await app.initialize();

  console.log('============================================');
  console.log('Comprehensive PRD System Demo');
  console.log('============================================\n');

  // Create a comprehensive PRD for a medical device
  console.log('Creating comprehensive PRD for Medical Device...\n');
  const medicalDevicePRD = app.createComprehensivePRD(
    'Smart Blood Glucose Monitor',
    ProductCategory.MEDICAL_DEVICE
  );

  // Initial validation
  console.log('--- Initial Validation ---');
  const initialValidation = app.validateComprehensivePRD(medicalDevicePRD);
  console.log(`Completeness: ${initialValidation.completeness}%`);
  console.log(`Ready for Development: ${initialValidation.readyForDevelopment ? 'YES' : 'NO'}`);
  console.log(`Blockers: ${initialValidation.blockers.length}`);
  console.log(`Warnings: ${initialValidation.warnings.length}\n`);

  // Fill in Executive Summary
  console.log('--- Filling in Executive Summary ---');
  medicalDevicePRD.executiveSummary.productName = 'GlucoSense Pro';
  medicalDevicePRD.executiveSummary.tagline = 'Continuous glucose monitoring made simple';
  medicalDevicePRD.executiveSummary.visionStatement = 'To empower people with diabetes to live healthier lives through real-time, accurate, and painless glucose monitoring';
  medicalDevicePRD.executiveSummary.missionStatement = 'Deliver the most accurate, user-friendly, and affordable continuous glucose monitoring system';
  medicalDevicePRD.executiveSummary.what = 'A wearable continuous glucose monitor (CGM) with AI-powered insights and smartphone integration';
  medicalDevicePRD.executiveSummary.why = 'Traditional finger-prick testing is painful, inconvenient, and provides only snapshots. CGM provides continuous monitoring but current solutions are expensive and complex';
  medicalDevicePRD.executiveSummary.who = 'Type 1 and Type 2 diabetes patients, particularly those on insulin therapy';
  medicalDevicePRD.executiveSummary.where = 'Global market, starting with US and EU';
  medicalDevicePRD.executiveSummary.when = 'FDA submission Q2 2025, market launch Q1 2026';
  medicalDevicePRD.executiveSummary.keyBenefits = [
    'Painless continuous monitoring for 14 days',
    'Real-time glucose alerts and trend analysis',
    'AI-powered meal and exercise recommendations',
    '50% lower cost than competitors',
    'Water-resistant and discreet design',
  ];
  medicalDevicePRD.executiveSummary.uniqueSellingPoints = [
    'Proprietary enzyme-free sensing technology',
    'Smartphone app with AI coaching',
    'Insurance-covered with major providers',
  ];
  medicalDevicePRD.executiveSummary.competitiveAdvantages = [
    'Lower cost of goods (30% vs competitors)',
    'Longer sensor life (14 days vs 10 days)',
    'No calibration required',
    'Smaller form factor',
  ];

  // Add required features
  console.log('--- Adding Required Features ---');
  medicalDevicePRD.features.required = [
    {
      id: 'feat-001',
      name: 'Continuous Glucose Sensing',
      description: 'Real-time glucose measurement every 5 minutes',
      category: 'Core Functionality',
      priority: PriorityLevel.CRITICAL,
      functionalRequirements: [
        'Measure glucose every 5 minutes',
        'Accuracy: ±10% vs lab reference',
        'Range: 40-400 mg/dL',
        'Sensor life: 14 days',
      ],
      technicalRequirements: [
        'Enzyme-free electrochemical sensor',
        'Bluetooth Low Energy 5.2',
        'Onboard data storage: 8 hours',
      ],
      dependencies: [],
      feasibility: FeasibilityStatus.FEASIBLE,
      feasibilityNotes: 'Proven sensing technology, validated in lab tests',
      estimatedDevelopmentTime: '6 months',
      estimatedCost: 500000,
      complexity: 'high',
      userBenefit: 'Eliminates finger pricks, provides continuous monitoring',
      userImpact: 'critical',
      businessValue: 'Core differentiator, enables entire product',
      revenueImpact: 'Primary revenue driver',
      successMetrics: ['Accuracy vs lab reference', 'Sensor survival rate', 'User satisfaction'],
    },
    {
      id: 'feat-002',
      name: 'Real-time Alerts',
      description: 'Push notifications for high/low glucose levels',
      category: 'Safety',
      priority: PriorityLevel.CRITICAL,
      functionalRequirements: [
        'Configurable high/low thresholds',
        'Customizable alert tones',
        'Snooze functionality',
        'Emergency contact notification',
      ],
      technicalRequirements: [
        'Push notifications via iOS/Android',
        'Background monitoring',
        'Alert delivery within 30 seconds',
      ],
      dependencies: ['feat-001'],
      feasibility: FeasibilityStatus.FEASIBLE,
      feasibilityNotes: 'Standard mobile notification API',
      estimatedDevelopmentTime: '2 months',
      estimatedCost: 100000,
      complexity: 'medium',
      userBenefit: 'Prevents dangerous glucose levels',
      userImpact: 'critical',
      businessValue: 'Safety requirement for FDA approval',
      successMetrics: ['Alert delivery time', 'False alarm rate', 'User response time'],
    },
    {
      id: 'feat-003',
      name: 'Smartphone App',
      description: 'iOS and Android companion app for data visualization',
      category: 'User Interface',
      priority: PriorityLevel.CRITICAL,
      functionalRequirements: [
        'Real-time glucose display',
        'Historical data graphs',
        'Meal logging',
        'Medication tracking',
        'Export reports',
      ],
      technicalRequirements: [
        'React Native cross-platform',
        'Offline data storage',
        'Cloud sync',
        'HIPAA-compliant backend',
      ],
      dependencies: ['feat-001'],
      feasibility: FeasibilityStatus.FEASIBLE,
      feasibilityNotes: 'Standard mobile app development',
      estimatedDevelopmentTime: '8 months',
      estimatedCost: 600000,
      complexity: 'high',
      userBenefit: 'Easy access to glucose data and insights',
      userImpact: 'critical',
      businessValue: 'Required for product functionality',
      successMetrics: ['App rating', 'Daily active users', 'Session duration'],
    },
  ];

  // Add high priority features
  medicalDevicePRD.features.highPriority = [
    {
      id: 'feat-101',
      name: 'AI Coaching',
      description: 'Machine learning-powered recommendations for meals and exercise',
      category: 'Intelligence',
      priority: PriorityLevel.HIGH,
      functionalRequirements: [
        'Personalized meal suggestions',
        'Exercise recommendations',
        'Pattern recognition',
        'Predictive alerts',
      ],
      technicalRequirements: [
        'TensorFlow Lite on-device inference',
        'Cloud-based model training',
        'User data privacy',
      ],
      dependencies: ['feat-001', 'feat-003'],
      feasibility: FeasibilityStatus.FEASIBLE_WITH_CONSTRAINTS,
      feasibilityNotes: 'Requires significant training data, initial models may be basic',
      estimatedDevelopmentTime: '12 months',
      estimatedCost: 800000,
      complexity: 'very-high',
      userBenefit: 'Actionable insights for better glucose control',
      userImpact: 'high',
      businessValue: 'Key differentiator, subscription revenue',
      revenueImpact: '$10/month subscription',
      successMetrics: ['Recommendation accuracy', 'User engagement', 'Glucose improvement'],
    },
  ];

  // Validate after adding features
  console.log('\n--- Validation After Adding Features ---');
  const featuresValidation = app.validateComprehensivePRD(medicalDevicePRD);
  console.log(`Completeness: ${featuresValidation.completeness}%`);
  console.log(`Ready for Development: ${featuresValidation.readyForDevelopment ? 'YES' : 'NO'}\n`);

  // Get completeness score
  console.log('--- Completeness Score Breakdown ---');
  const completenessScore = app.getPRDCompletenessScore(medicalDevicePRD);
  console.log(`Overall Score: ${completenessScore.overall}%\n`);
  console.log('Section Scores:');
  completenessScore.sections.forEach((section: any) => {
    const bar = '█'.repeat(Math.floor(section.score / 5));
    console.log(`  ${section.section.padEnd(30)} ${bar} ${section.score}%`);
  });
  console.log('\nCritical Missing Items:');
  completenessScore.criticalMissing.forEach((item: any) => {
    console.log(`  ⚠️  ${item}`);
  });

  // Check readiness for development
  console.log('\n--- Development Readiness Check ---');
  const readiness = app.checkPRDReadiness(medicalDevicePRD);
  console.log(`Ready to Proceed: ${readiness.ready ? '✅ YES' : '❌ NO'}\n`);

  if (readiness.missingRequired.length > 0) {
    console.log('Missing Required Items:');
    readiness.missingRequired.forEach((item: any) => {
      console.log(`  ❌ ${item}`);
    });
    console.log();
  }

  if (readiness.recommendations.length > 0) {
    console.log('Recommendations:');
    readiness.recommendations.forEach((rec: any) => {
      console.log(`  💡 ${rec}`);
    });
    console.log();
  }

  // Generate full report
  console.log('--- Full Completeness Report ---');
  const report = app.generatePRDCompletenessReport(medicalDevicePRD);
  console.log(report);

  // Demo different product categories
  console.log('\n\n============================================');
  console.log('Product Category Templates');
  console.log('============================================\n');

  const categories = [
    ProductCategory.SOFTWARE,
    ProductCategory.SAAS,
    ProductCategory.HARDWARE_ELECTRONICS,
    ProductCategory.IOT,
    ProductCategory.PHARMACEUTICAL,
    ProductCategory.FOOD_BEVERAGE,
  ];

  categories.forEach((category: any) => {
    const prd = app.createComprehensivePRD(`Sample ${category} Product`, category);
    const validation = app.validateComprehensivePRD(prd);
    console.log(`${category.toUpperCase()}`);
    console.log(`  Initial Completeness: ${validation.completeness}%`);
    console.log(`  Blockers: ${validation.blockers.length}`);
    console.log(`  Warnings: ${validation.warnings.length}`);
    console.log();
  });

  console.log('============================================');
  console.log('Demo Complete!');
  console.log('============================================\n');
  console.log('Key Takeaways:');
  console.log('✅ Comprehensive PRD templates for 14+ product categories');
  console.log('✅ Required vs Optional feature separation with 5 priority levels');
  console.log('✅ Feasibility tracking per feature');
  console.log('✅ Real-time validation and completeness scoring (0-100%)');
  console.log('✅ Industry-specific regulatory templates');
  console.log('✅ Development readiness gates');
  console.log('✅ Detailed completeness reports');
  console.log('\nThe PRD system ensures products are fully planned before development begins!');
}

main().catch(console.error);
