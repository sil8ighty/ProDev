import {
  ComprehensivePRD,
  ProductCategory,
  ExecutiveSummary,
  FeatureSet,
  Feature,
  PriorityLevel,
  FeasibilityStatus,
} from '../types/comprehensive-prd';

// Types from part 2 (using any for now to avoid circular dependencies)
type PRDValidation = any;
type FieldValidation = any;

/**
 * Comprehensive PRD Manager
 * Ensures complete product definition before development begins
 */
export class ComprehensivePRDManager {
  /**
   * Create a new comprehensive PRD from template
   */
  public createFromTemplate(
    productName: string,
    category: ProductCategory
  ): ComprehensivePRD {
    const baseTemplate = this.getBaseTemplate(productName, category);
    const categorySpecific = this.getCategorySpecificFields(category);

    return {
      ...baseTemplate,
      ...categorySpecific,
    };
  }

  /**
   * Get base PRD template
   */
  private getBaseTemplate(productName: string, category: ProductCategory): ComprehensivePRD {
    return {
      id: this.generateId(),
      version: '1.0.0',
      status: 'draft',
      category,
      created: new Date(),
      lastUpdated: new Date(),
      approvers: [],

      executiveSummary: this.getExecutiveSummaryTemplate(productName),
      productDefinition: this.getProductDefinitionTemplate(),
      features: this.getEmptyFeatureSet(),
      technicalRequirements: this.getTechnicalRequirementsTemplate(),
      businessRequirements: this.getBusinessRequirementsTemplate(),
      marketAnalysis: this.getMarketAnalysisTemplate(),
      timeline: this.getTimelineTemplate(),
      budgetAndResources: this.getBudgetTemplate(),
      regulatoryCompliance: this.getRegulatoryTemplate(),
      riskAssessment: this.getRiskAssessmentTemplate(),
      goToMarket: this.getGoToMarketTemplate(),
      successCriteria: this.getSuccessCriteriaTemplate(),
      constraintsAndAssumptions: this.getConstraintsTemplate(),
      validation: this.initializeValidation(),
    };
  }

  /**
   * Get category-specific fields
   */
  private getCategorySpecificFields(category: ProductCategory): Partial<ComprehensivePRD> {
    switch (category) {
      case ProductCategory.HARDWARE_ELECTRONICS:
      case ProductCategory.HARDWARE_MECHANICAL:
      case ProductCategory.IOT:
      case ProductCategory.AUTOMOTIVE:
        return {
          manufacturing: this.getManufacturingTemplate(),
        };

      case ProductCategory.MEDICAL_DEVICE:
        return {
          manufacturing: this.getManufacturingTemplate(),
          regulatoryCompliance: this.getMedicalRegulatoryTemplate(),
        };

      case ProductCategory.PHARMACEUTICAL:
        return {
          manufacturing: this.getManufacturingTemplate(),
          regulatoryCompliance: this.getPharmaceuticalRegulatoryTemplate(),
        };

      case ProductCategory.FOOD_BEVERAGE:
        return {
          manufacturing: this.getManufacturingTemplate(),
          regulatoryCompliance: this.getFoodRegulatoryTemplate(),
        };

      default:
        return {};
    }
  }

  /**
   * Validate PRD completeness
   */
  public validatePRD(prd: ComprehensivePRD): PRDValidation {
    const fieldValidations: FieldValidation[] = [];

    // Validate executive summary
    fieldValidations.push(
      ...this.validateExecutiveSummary(prd.executiveSummary)
    );

    // Validate product definition
    fieldValidations.push(
      ...this.validateProductDefinition(prd.productDefinition)
    );

    // Validate features
    fieldValidations.push(...this.validateFeatures(prd.features));

    // Validate technical requirements
    fieldValidations.push(
      ...this.validateTechnicalRequirements(prd.technicalRequirements)
    );

    // Validate business requirements
    fieldValidations.push(
      ...this.validateBusinessRequirements(prd.businessRequirements)
    );

    // Validate market analysis
    fieldValidations.push(...this.validateMarketAnalysis(prd.marketAnalysis));

    // Validate timeline
    fieldValidations.push(...this.validateTimeline(prd.timeline));

    // Validate budget
    fieldValidations.push(
      ...this.validateBudget(prd.budgetAndResources)
    );

    // Validate regulatory (if applicable)
    if (this.requiresRegulatory(prd.category)) {
      fieldValidations.push(
        ...this.validateRegulatory(prd.regulatoryCompliance)
      );
    }

    // Validate manufacturing (if applicable)
    if (prd.manufacturing) {
      fieldValidations.push(...this.validateManufacturing(prd.manufacturing));
    }

    // Calculate overall completeness
    const totalFields = fieldValidations.length;
    const completedFields = fieldValidations.filter(f => f.completed).length;
    const completeness = Math.round((completedFields / totalFields) * 100);

    // Check for blockers
    const blockers = fieldValidations
      .filter(f => f.required && !f.completed)
      .map(f => `Required field incomplete: ${f.field}`);

    // Check for warnings
    const warnings = fieldValidations
      .filter(f => !f.required && !f.completed && f.completeness < 50)
      .map(f => `Recommended field needs attention: ${f.field}`);

    // Determine if ready for development
    const requiredComplete = fieldValidations
      .filter(f => f.required)
      .every(f => f.completed);

    const readyForDevelopment =
      requiredComplete &&
      completeness >= 80 && // At least 80% complete
      blockers.length === 0;

    return {
      completeness,
      requiredFields: fieldValidations,
      warnings,
      blockers,
      readyForDevelopment,
      lastValidated: new Date(),
    };
  }

  /**
   * Check if PRD is ready to proceed to development
   */
  public canProceedToDevelopment(prd: ComprehensivePRD): {
    ready: boolean;
    missingRequired: string[];
    recommendations: string[];
  } {
    const validation = this.validatePRD(prd);

    const missingRequired = validation.requiredFields
      .filter((f: any) => f.required && !f.completed)
      .map((f: any) => f.field);

    const recommendations: string[] = [];

    // Check required features
    if (prd.features.required.length === 0) {
      recommendations.push('Define at least one required feature for MVP');
    }

    // Check budget allocation
    if (prd.budgetAndResources.totalBudget === 0) {
      recommendations.push('Define total budget');
    }

    // Check timeline
    if (!prd.timeline.mvpTarget) {
      recommendations.push('Set MVP target date');
    }

    // Check team resources
    if (prd.budgetAndResources.resources.team.internal.length === 0) {
      recommendations.push('Define team structure and roles');
    }

    // Check success metrics
    if (prd.successCriteria.productMetrics.length === 0) {
      recommendations.push('Define success metrics');
    }

    // Check risk assessment
    const totalRisks =
      prd.riskAssessment.technical.length +
      prd.riskAssessment.business.length +
      prd.riskAssessment.market.length;

    if (totalRisks === 0) {
      recommendations.push('Conduct risk assessment');
    }

    // Check regulatory requirements (if applicable)
    if (this.requiresRegulatory(prd.category)) {
      if (prd.regulatoryCompliance.regulations.length === 0) {
        recommendations.push(
          'Identify applicable regulations for your product category'
        );
      }
    }

    return {
      ready: validation.readyForDevelopment && recommendations.length === 0,
      missingRequired,
      recommendations,
    };
  }

  /**
   * Get PRD completeness score with breakdown
   */
  public getCompletenessScore(prd: ComprehensivePRD): {
    overall: number;
    sections: { section: string; score: number }[];
    criticalMissing: string[];
  } {
    const sections = [
      { section: 'Executive Summary', score: this.scoreExecutiveSummary(prd.executiveSummary) },
      { section: 'Product Definition', score: this.scoreProductDefinition(prd.productDefinition) },
      { section: 'Features', score: this.scoreFeatures(prd.features) },
      { section: 'Technical Requirements', score: this.scoreTechnicalRequirements(prd.technicalRequirements) },
      { section: 'Business Requirements', score: this.scoreBusinessRequirements(prd.businessRequirements) },
      { section: 'Market Analysis', score: this.scoreMarketAnalysis(prd.marketAnalysis) },
      { section: 'Timeline', score: this.scoreTimeline(prd.timeline) },
      { section: 'Budget & Resources', score: this.scoreBudget(prd.budgetAndResources) },
      { section: 'Regulatory Compliance', score: this.scoreRegulatory(prd.regulatoryCompliance) },
      { section: 'Risk Assessment', score: this.scoreRiskAssessment(prd.riskAssessment) },
      { section: 'Go-to-Market', score: this.scoreGoToMarket(prd.goToMarket) },
      { section: 'Success Criteria', score: this.scoreSuccessCriteria(prd.successCriteria) },
    ];

    if (prd.manufacturing) {
      sections.push({
        section: 'Manufacturing',
        score: this.scoreManufacturing(prd.manufacturing),
      });
    }

    const overall = Math.round(
      sections.reduce((sum, s) => sum + s.score, 0) / sections.length
    );

    const criticalMissing: string[] = [];

    // Check critical sections
    if (prd.features.required.length === 0) {
      criticalMissing.push('No required features defined');
    }

    if (prd.budgetAndResources.totalBudget === 0) {
      criticalMissing.push('Budget not defined');
    }

    if (!prd.timeline.mvpTarget) {
      criticalMissing.push('MVP target date not set');
    }

    if (prd.executiveSummary.what === '') {
      criticalMissing.push('Product description (what) not defined');
    }

    return {
      overall,
      sections,
      criticalMissing,
    };
  }

  /**
   * Generate PRD completeness report
   */
  public generateCompletenessReport(prd: ComprehensivePRD): string {
    const score = this.getCompletenessScore(prd);
    const validation = this.validatePRD(prd);
    const readiness = this.canProceedToDevelopment(prd);

    const sections: string[] = [];

    sections.push('# PRD Completeness Report');
    sections.push(`Product: ${prd.executiveSummary.productName}`);
    sections.push(`Category: ${prd.category}`);
    sections.push(`Version: ${prd.version}`);
    sections.push(`Status: ${prd.status}`);
    sections.push(`Last Updated: ${prd.lastUpdated.toLocaleDateString()}\n`);

    sections.push('## Overall Completeness');
    sections.push(`Score: ${score.overall}%`);
    sections.push(
      `Status: ${readiness.ready ? '✅ Ready for Development' : '⚠️  Not Ready for Development'}\n`
    );

    sections.push('## Section Breakdown');
    score.sections.forEach(s => {
      const emoji = s.score >= 80 ? '✅' : s.score >= 50 ? '⚠️' : '❌';
      sections.push(`${emoji} ${s.section}: ${s.score}%`);
    });
    sections.push('');

    if (score.criticalMissing.length > 0) {
      sections.push('## Critical Missing Items');
      score.criticalMissing.forEach(item => {
        sections.push(`❌ ${item}`);
      });
      sections.push('');
    }

    if (validation.blockers.length > 0) {
      sections.push('## Blockers (Must Fix)');
      validation.blockers.forEach((blocker: any) => {
        sections.push(`🚫 ${blocker}`);
      });
      sections.push('');
    }

    if (readiness.missingRequired.length > 0) {
      sections.push('## Required Fields Missing');
      readiness.missingRequired.forEach(field => {
        sections.push(`- ${field}`);
      });
      sections.push('');
    }

    if (readiness.recommendations.length > 0) {
      sections.push('## Recommendations');
      readiness.recommendations.forEach(rec => {
        sections.push(`💡 ${rec}`);
      });
      sections.push('');
    }

    if (validation.warnings.length > 0) {
      sections.push('## Warnings');
      validation.warnings.forEach((warning: any) => {
        sections.push(`⚠️  ${warning}`);
      });
      sections.push('');
    }

    sections.push('## Next Steps');
    if (readiness.ready) {
      sections.push('✅ PRD is complete and ready for development!');
      sections.push('- Submit for final approval');
      sections.push('- Begin milestone planning');
      sections.push('- Kick off development');
    } else {
      sections.push('Complete the following to proceed:');
      if (readiness.missingRequired.length > 0) {
        sections.push('1. Fill in all required fields');
      }
      if (readiness.recommendations.length > 0) {
        sections.push('2. Address all recommendations');
      }
      if (validation.blockers.length > 0) {
        sections.push('3. Resolve all blockers');
      }
    }

    return sections.join('\n');
  }

  // Template generation methods (simplified for brevity)
  private getExecutiveSummaryTemplate(productName: string): ExecutiveSummary {
    return {
      productName,
      tagline: '',
      visionStatement: '',
      missionStatement: '',
      what: '',
      why: '',
      who: '',
      where: '',
      when: '',
      keyBenefits: [],
      uniqueSellingPoints: [],
      competitiveAdvantages: [],
    };
  }

  private getProductDefinitionTemplate(): any {
    return {
      problemStatement: '',
      solutionDescription: '',
      targetUsers: [],
      useCases: [],
      userStories: [],
      specifications: {
        performance: {},
      },
      designRequirements: {
        aesthetics: '',
        brandGuidelines: '',
        accessibilityRequirements: [],
      },
      userExperience: {
        onboarding: '',
        learningCurve: '',
        usability: [],
        accessibility: [],
        internationalization: {
          languages: [],
          localization: [],
          culturalConsiderations: [],
        },
      },
    };
  }

  private getEmptyFeatureSet(): FeatureSet {
    return {
      required: [],
      highPriority: [],
      mediumPriority: [],
      lowPriority: [],
      optional: [],
    };
  }

  private getTechnicalRequirementsTemplate(): any {
    return {
      architecture: {
        overview: '',
        components: [],
        dataFlow: '',
        integrations: [],
      },
      technologyStack: {},
      security: {
        authentication: [],
        authorization: [],
        dataEncryption: '',
        networkSecurity: '',
        vulnerabilityTesting: [],
        complianceStandards: [],
      },
      performance: {
        responseTime: '',
        throughput: '',
        benchmarks: {},
      },
      scalability: {
        expectedLoad: '',
        growthProjection: '',
        scalingStrategy: '',
      },
      data: {
        storage: '',
        retention: '',
        backup: '',
        privacy: '',
      },
      integrations: [],
    };
  }

  private getBusinessRequirementsTemplate(): any {
    return {
      businessModel: {
        type: 'B2B',
        description: '',
        revenueStreams: [],
        costStructure: {
          development: 0,
          marketing: 0,
          operations: 0,
          support: 0,
          overhead: 0,
          total: 0,
        },
        valueProposition: '',
      },
      pricing: {
        strategy: '',
        currency: 'USD',
        paymentMethods: [],
      },
      salesAndDistribution: {
        channels: [],
        salesProcess: '',
        partnerships: [],
      },
      customerSupport: {
        channels: [],
        sla: '',
        documentation: [],
        training: [],
      },
      legal: {
        intellectualProperty: [],
        licensing: '',
        contracts: [],
        trademarks: [],
        patents: [],
      },
    };
  }

  private getMarketAnalysisTemplate(): any {
    return {
      marketSize: {
        tam: '',
        sam: '',
        som: '',
        growthRate: '',
      },
      segments: [],
      competition: {
        direct: [],
        indirect: [],
        analysis: {
          ourAdvantages: [],
          ourDisadvantages: [],
          differentiators: [],
          positioning: '',
        },
      },
      trends: [],
      customerInsights: {
        painPoints: [],
        buyingBehavior: '',
        decisionFactors: [],
        priceEnsitivity: 'medium',
      },
    };
  }

  private getTimelineTemplate(): any {
    return {
      projectStart: new Date(),
      mvpTarget: new Date(),
      launchTarget: new Date(),
      phases: [],
      criticalPath: [],
      keyMilestones: [],
      externalDependencies: [],
    };
  }

  private getBudgetTemplate(): any {
    return {
      totalBudget: 0,
      currency: 'USD',
      budgetBreakdown: {
        development: {
          engineering: 0,
          design: 0,
          prototyping: 0,
          testing: 0,
          software_licenses: 0,
          infrastructure: 0,
          total: 0,
        },
        marketing: {
          branding: 0,
          advertising: 0,
          contentCreation: 0,
          events: 0,
          partnerships: 0,
          total: 0,
        },
        operations: {
          facilities: 0,
          utilities: 0,
          insurance: 0,
          legal: 0,
          accounting: 0,
          humanResources: 0,
          total: 0,
        },
        contingency: {
          percentage: 10,
          amount: 0,
          rationale: '10% contingency for unforeseen costs',
        },
      },
      funding: [],
      resources: {
        team: {
          internal: [],
          external: [],
          contractors: [],
        },
        allocation: [],
        hiringPlan: [],
      },
      roiProjection: {
        breakEvenPoint: '',
        year1: { revenue: 0, costs: 0, profit: 0, roi: 0 },
        year2: { revenue: 0, costs: 0, profit: 0, roi: 0 },
        year3: { revenue: 0, costs: 0, profit: 0, roi: 0 },
        assumptions: [],
      },
    };
  }

  private getManufacturingTemplate(): any {
    return {
      strategy: 'contract-manufacturing',
      locations: [],
      process: {
        steps: [],
        cycleTime: '',
        yield: '',
        automation: '',
        qualityCheckpoints: [],
      },
      qualityControl: {
        standards: [],
        inspectionPlan: '',
        testingProtocol: '',
        acceptanceCriteria: [],
        defectTracking: '',
        correctiveActions: '',
      },
      supplyChain: {
        suppliers: [],
        leadTimes: {},
        inventoryStrategy: '',
        riskMitigation: [],
        backupSuppliers: [],
      },
      packaging: {
        primaryPackaging: '',
        secondaryPackaging: '',
        labeling: [],
        barcoding: '',
        sustainability: '',
        regulations: [],
      },
      logistics: {
        shipping: {
          methods: [],
          carriers: [],
          domesticLeadTime: '',
          internationalLeadTime: '',
        },
        warehousing: {
          locations: [],
          capacity: '',
          temperature_control: false,
          security: '',
        },
        fulfillment: {
          strategy: 'in-house',
          sla: '',
        },
      },
      scalability: {
        currentCapacity: 0,
        maxCapacity: 0,
        scalingPlan: '',
        bottlenecks: [],
        investments_needed: [],
      },
    };
  }

  private getRegulatoryTemplate(): any {
    return {
      regulations: [],
      certifications: [],
      standards: [],
      testing: [],
      documentation: [],
      approvalProcess: [],
      ongoingCompliance: {
        reporting: [],
        audits: [],
        renewals: [],
        monitoring: [],
      },
    };
  }

  private getMedicalRegulatoryTemplate(): any {
    const base = this.getRegulatoryTemplate();
    return {
      ...base,
      regulations: [
        {
          name: 'FDA 510(k) or PMA',
          jurisdiction: 'United States',
          applicability: 'Medical devices',
          requirements: [
            'Design controls (21 CFR Part 820)',
            'Risk management (ISO 14971)',
            'Biocompatibility testing',
            'Clinical data',
            'Labeling requirements',
          ],
          timeline: '6-12 months',
          cost: 0,
          status: 'not-started',
        },
        {
          name: 'EU MDR',
          jurisdiction: 'European Union',
          applicability: 'Medical devices',
          requirements: [
            'CE marking',
            'Technical documentation',
            'Clinical evaluation',
            'Quality management system',
          ],
          timeline: '6-12 months',
          cost: 0,
          status: 'not-started',
        },
      ],
      standards: [
        {
          name: 'ISO 13485',
          version: '2016',
          applicability: 'Medical device quality management',
          requirements: ['QMS implementation', 'Documentation', 'Audits'],
          verification: 'Third-party audit',
        },
        {
          name: 'IEC 62304',
          version: '2006',
          applicability: 'Medical device software lifecycle',
          requirements: ['Software development plan', 'Risk management', 'Testing'],
          verification: 'Internal audit',
        },
      ],
    };
  }

  private getPharmaceuticalRegulatoryTemplate(): any {
    const base = this.getRegulatoryTemplate();
    return {
      ...base,
      regulations: [
        {
          name: 'FDA NDA/ANDA',
          jurisdiction: 'United States',
          applicability: 'Pharmaceutical products',
          requirements: [
            'Clinical trials (Phase I-III)',
            'Chemistry, Manufacturing, and Controls (CMC)',
            'Pharmacology/toxicology data',
            'Labeling',
          ],
          timeline: '8-10 years',
          cost: 0,
          status: 'not-started',
        },
      ],
      standards: [
        {
          name: 'GMP (Good Manufacturing Practice)',
          version: 'Current',
          applicability: 'Pharmaceutical manufacturing',
          requirements: ['Facility design', 'Process validation', 'Quality control'],
          verification: 'FDA inspection',
        },
      ],
    };
  }

  private getFoodRegulatoryTemplate(): any {
    const base = this.getRegulatoryTemplate();
    return {
      ...base,
      regulations: [
        {
          name: 'FDA Food Facility Registration',
          jurisdiction: 'United States',
          applicability: 'Food manufacturing',
          requirements: [
            'Facility registration',
            'HACCP plan',
            'Allergen control',
            'Labeling compliance',
          ],
          timeline: '3-6 months',
          cost: 0,
          status: 'not-started',
        },
      ],
      standards: [
        {
          name: 'HACCP',
          version: 'Current',
          applicability: 'Food safety',
          requirements: ['Hazard analysis', 'Critical control points', 'Monitoring'],
          verification: 'Internal audit',
        },
      ],
    };
  }

  private getRiskAssessmentTemplate(): any {
    return {
      technical: [],
      business: [],
      market: [],
      regulatory: [],
      financial: [],
      operational: [],
      overallRisk: 'medium',
      mitigationStrategy: '',
    };
  }

  private getGoToMarketTemplate(): any {
    return {
      launchStrategy: {
        type: 'soft-launch',
        timeline: '',
        approach: '',
      },
      marketing: {
        positioning: '',
        messaging: '',
        channels: [],
        campaigns: [],
        budget: 0,
      },
      sales: {
        approach: 'direct',
        team: '',
        process: '',
        targets: [],
        enablement: [],
      },
      distribution: {
        channels: [],
        partnerships: [],
        coverage: '',
      },
      customerAcquisition: {
        strategy: '',
        cac: 0,
        ltv: 0,
        channels: [],
      },
      launchPlan: {
        prelaunch: [],
        launch: [],
        postlaunch: [],
      },
    };
  }

  private getSuccessCriteriaTemplate(): any {
    return {
      productMetrics: [],
      businessMetrics: [],
      userMetrics: [],
      technicalMetrics: [],
      marketMetrics: [],
      validationCheckpoints: [],
    };
  }

  private getConstraintsTemplate(): any {
    return {
      constraints: [],
      assumptions: [],
      dependencies: [],
    };
  }

  private initializeValidation(): PRDValidation {
    return {
      completeness: 0,
      requiredFields: [],
      warnings: [],
      blockers: [],
      readyForDevelopment: false,
      lastValidated: new Date(),
    };
  }

  // Validation helper methods
  private validateExecutiveSummary(summary: ExecutiveSummary): FieldValidation[] {
    return [
      {
        field: 'Executive Summary - Product Name',
        required: true,
        completed: !!summary.productName && summary.productName !== '',
        completeness: summary.productName ? 100 : 0,
        issues: [],
      },
      {
        field: 'Executive Summary - What',
        required: true,
        completed: !!summary.what && summary.what.length > 20,
        completeness: summary.what ? Math.min((summary.what.length / 100) * 100, 100) : 0,
        issues: summary.what.length < 20 ? ['Description too short (minimum 20 characters)'] : [],
      },
      {
        field: 'Executive Summary - Why',
        required: true,
        completed: !!summary.why && summary.why.length > 20,
        completeness: summary.why ? Math.min((summary.why.length / 100) * 100, 100) : 0,
        issues: [],
      },
      {
        field: 'Executive Summary - Who',
        required: true,
        completed: !!summary.who && summary.who.length > 10,
        completeness: summary.who ? Math.min((summary.who.length / 50) * 100, 100) : 0,
        issues: [],
      },
    ];
  }

  private validateProductDefinition(definition: any): FieldValidation[] {
    return [
      {
        field: 'Product Definition - Problem Statement',
        required: true,
        completed: !!definition.problemStatement && definition.problemStatement.length > 20,
        completeness: definition.problemStatement ? Math.min((definition.problemStatement.length / 100) * 100, 100) : 0,
        issues: [],
      },
      {
        field: 'Product Definition - Solution Description',
        required: true,
        completed: !!definition.solutionDescription && definition.solutionDescription.length > 20,
        completeness: definition.solutionDescription ? Math.min((definition.solutionDescription.length / 100) * 100, 100) : 0,
        issues: [],
      },
      {
        field: 'Product Definition - Target Users',
        required: true,
        completed: definition.targetUsers && definition.targetUsers.length > 0,
        completeness: definition.targetUsers ? (definition.targetUsers.length > 0 ? 100 : 0) : 0,
        issues: definition.targetUsers.length === 0 ? ['Define at least one target user persona'] : [],
      },
    ];
  }

  private validateFeatures(features: FeatureSet): FieldValidation[] {
    return [
      {
        field: 'Features - Required (MVP)',
        required: true,
        completed: features.required && features.required.length > 0,
        completeness: features.required ? (features.required.length > 0 ? 100 : 0) : 0,
        issues: features.required.length === 0 ? ['Define at least one required feature for MVP'] : [],
      },
    ];
  }

  private validateTechnicalRequirements(tech: any): FieldValidation[] {
    return [
      {
        field: 'Technical - Architecture Overview',
        required: true,
        completed: !!tech.architecture.overview && tech.architecture.overview.length > 20,
        completeness: tech.architecture.overview ? Math.min((tech.architecture.overview.length / 100) * 100, 100) : 0,
        issues: [],
      },
    ];
  }

  private validateBusinessRequirements(business: any): FieldValidation[] {
    return [
      {
        field: 'Business - Business Model',
        required: true,
        completed: !!business.businessModel.description && business.businessModel.description.length > 20,
        completeness: business.businessModel.description ? Math.min((business.businessModel.description.length / 100) * 100, 100) : 0,
        issues: [],
      },
      {
        field: 'Business - Revenue Streams',
        required: true,
        completed: business.businessModel.revenueStreams && business.businessModel.revenueStreams.length > 0,
        completeness: business.businessModel.revenueStreams.length > 0 ? 100 : 0,
        issues: business.businessModel.revenueStreams.length === 0 ? ['Define at least one revenue stream'] : [],
      },
    ];
  }

  private validateMarketAnalysis(market: any): FieldValidation[] {
    return [
      {
        field: 'Market - Market Size (TAM/SAM/SOM)',
        required: true,
        completed: !!market.marketSize.tam && !!market.marketSize.sam,
        completeness: (market.marketSize.tam ? 50 : 0) + (market.marketSize.sam ? 50 : 0),
        issues: [],
      },
    ];
  }

  private validateTimeline(timeline: any): FieldValidation[] {
    return [
      {
        field: 'Timeline - MVP Target Date',
        required: true,
        completed: !!timeline.mvpTarget,
        completeness: timeline.mvpTarget ? 100 : 0,
        issues: !timeline.mvpTarget ? ['Set MVP target date'] : [],
      },
      {
        field: 'Timeline - Launch Target Date',
        required: true,
        completed: !!timeline.launchTarget,
        completeness: timeline.launchTarget ? 100 : 0,
        issues: [],
      },
    ];
  }

  private validateBudget(budget: any): FieldValidation[] {
    return [
      {
        field: 'Budget - Total Budget',
        required: true,
        completed: budget.totalBudget > 0,
        completeness: budget.totalBudget > 0 ? 100 : 0,
        issues: budget.totalBudget === 0 ? ['Define total budget'] : [],
      },
      {
        field: 'Budget - Team Resources',
        required: true,
        completed: budget.resources.team.internal.length > 0 || budget.resources.team.external.length > 0,
        completeness: (budget.resources.team.internal.length > 0 || budget.resources.team.external.length > 0) ? 100 : 0,
        issues: [],
      },
    ];
  }

  private validateRegulatory(regulatory: any): FieldValidation[] {
    return [
      {
        field: 'Regulatory - Regulations Identified',
        required: true,
        completed: regulatory.regulations && regulatory.regulations.length > 0,
        completeness: regulatory.regulations.length > 0 ? 100 : 0,
        issues: regulatory.regulations.length === 0 ? ['Identify applicable regulations'] : [],
      },
    ];
  }

  private validateManufacturing(manufacturing: any): FieldValidation[] {
    return [
      {
        field: 'Manufacturing - Strategy',
        required: true,
        completed: !!manufacturing.strategy,
        completeness: manufacturing.strategy ? 100 : 0,
        issues: [],
      },
      {
        field: 'Manufacturing - Supply Chain',
        required: true,
        completed: manufacturing.supplyChain.suppliers.length > 0,
        completeness: manufacturing.supplyChain.suppliers.length > 0 ? 100 : 0,
        issues: manufacturing.supplyChain.suppliers.length === 0 ? ['Identify suppliers'] : [],
      },
    ];
  }

  // Scoring methods (simplified)
  private scoreExecutiveSummary(summary: ExecutiveSummary): number {
    let score = 0;
    if (summary.productName) score += 10;
    if (summary.what && summary.what.length > 20) score += 15;
    if (summary.why && summary.why.length > 20) score += 15;
    if (summary.who && summary.who.length > 10) score += 15;
    if (summary.where) score += 10;
    if (summary.when) score += 10;
    if (summary.visionStatement && summary.visionStatement.length > 20) score += 10;
    if (summary.keyBenefits.length > 0) score += 10;
    if (summary.uniqueSellingPoints.length > 0) score += 5;
    return score;
  }

  private scoreProductDefinition(definition: any): number {
    let score = 0;
    if (definition.problemStatement && definition.problemStatement.length > 20) score += 20;
    if (definition.solutionDescription && definition.solutionDescription.length > 20) score += 20;
    if (definition.targetUsers && definition.targetUsers.length > 0) score += 20;
    if (definition.useCases && definition.useCases.length > 0) score += 15;
    if (definition.userStories && definition.userStories.length > 0) score += 15;
    if (definition.specifications && definition.specifications.performance) score += 10;
    return score;
  }

  private scoreFeatures(features: FeatureSet): number {
    let score = 0;
    if (features.required.length > 0) score += 50;
    if (features.highPriority.length > 0) score += 20;
    if (features.mediumPriority.length > 0) score += 10;
    if (features.lowPriority.length > 0) score += 10;
    if (features.optional.length > 0) score += 10;
    return Math.min(score, 100);
  }

  private scoreTechnicalRequirements(tech: any): number {
    let score = 0;
    if (tech.architecture.overview && tech.architecture.overview.length > 20) score += 30;
    if (tech.architecture.components.length > 0) score += 20;
    if (tech.technologyStack && Object.keys(tech.technologyStack).length > 0) score += 20;
    if (tech.security && tech.security.authentication.length > 0) score += 15;
    if (tech.performance && tech.performance.responseTime) score += 15;
    return score;
  }

  private scoreBusinessRequirements(business: any): number {
    let score = 0;
    if (business.businessModel.description && business.businessModel.description.length > 20) score += 25;
    if (business.businessModel.revenueStreams.length > 0) score += 25;
    if (business.pricing && business.pricing.strategy) score += 20;
    if (business.salesAndDistribution && business.salesAndDistribution.channels.length > 0) score += 15;
    if (business.legal && business.legal.intellectualProperty.length > 0) score += 15;
    return score;
  }

  private scoreMarketAnalysis(market: any): number {
    let score = 0;
    if (market.marketSize.tam) score += 20;
    if (market.marketSize.sam) score += 20;
    if (market.segments && market.segments.length > 0) score += 20;
    if (market.competition && market.competition.direct.length > 0) score += 20;
    if (market.trends && market.trends.length > 0) score += 10;
    if (market.customerInsights && market.customerInsights.painPoints.length > 0) score += 10;
    return score;
  }

  private scoreTimeline(timeline: any): number {
    let score = 0;
    if (timeline.mvpTarget) score += 30;
    if (timeline.launchTarget) score += 30;
    if (timeline.phases && timeline.phases.length > 0) score += 20;
    if (timeline.keyMilestones && timeline.keyMilestones.length > 0) score += 20;
    return score;
  }

  private scoreBudget(budget: any): number {
    let score = 0;
    if (budget.totalBudget > 0) score += 30;
    if (budget.budgetBreakdown.development.total > 0) score += 20;
    if (budget.resources.team.internal.length > 0 || budget.resources.team.external.length > 0) score += 30;
    if (budget.roiProjection && budget.roiProjection.breakEvenPoint) score += 20;
    return score;
  }

  private scoreRegulatory(regulatory: any): number {
    let score = 0;
    if (regulatory.regulations && regulatory.regulations.length > 0) score += 40;
    if (regulatory.certifications && regulatory.certifications.length > 0) score += 30;
    if (regulatory.standards && regulatory.standards.length > 0) score += 30;
    return score;
  }

  private scoreRiskAssessment(risk: any): number {
    let score = 0;
    const totalRisks = risk.technical.length + risk.business.length + risk.market.length + risk.regulatory.length + risk.financial.length + risk.operational.length;
    if (totalRisks > 0) score += 60;
    if (risk.mitigationStrategy && risk.mitigationStrategy.length > 20) score += 40;
    return score;
  }

  private scoreGoToMarket(gtm: any): number {
    let score = 0;
    if (gtm.launchStrategy && gtm.launchStrategy.type) score += 20;
    if (gtm.marketing && gtm.marketing.channels.length > 0) score += 20;
    if (gtm.sales && gtm.sales.approach) score += 20;
    if (gtm.distribution && gtm.distribution.channels.length > 0) score += 20;
    if (gtm.customerAcquisition && gtm.customerAcquisition.strategy) score += 20;
    return score;
  }

  private scoreSuccessCriteria(success: any): number {
    let score = 0;
    if (success.productMetrics && success.productMetrics.length > 0) score += 25;
    if (success.businessMetrics && success.businessMetrics.length > 0) score += 25;
    if (success.userMetrics && success.userMetrics.length > 0) score += 25;
    if (success.technicalMetrics && success.technicalMetrics.length > 0) score += 25;
    return score;
  }

  private scoreManufacturing(manufacturing: any): number {
    let score = 0;
    if (manufacturing.strategy) score += 20;
    if (manufacturing.locations && manufacturing.locations.length > 0) score += 20;
    if (manufacturing.supplyChain && manufacturing.supplyChain.suppliers.length > 0) score += 30;
    if (manufacturing.qualityControl && manufacturing.qualityControl.standards.length > 0) score += 30;
    return score;
  }

  // Helper methods
  private requiresRegulatory(category: ProductCategory): boolean {
    return [
      ProductCategory.MEDICAL_DEVICE,
      ProductCategory.PHARMACEUTICAL,
      ProductCategory.FOOD_BEVERAGE,
      ProductCategory.AUTOMOTIVE,
      ProductCategory.AEROSPACE,
    ].includes(category);
  }

  private generateId(): string {
    return `prd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
