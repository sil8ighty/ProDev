import { TechnicalPackage, FileReference } from '../types';

/**
 * Layer 2: Technical/Handoff Package Manager
 * Manages all technical documentation and deliverables
 */
export class Layer2Manager {
  /**
   * Create a new technical package
   */
  public createTechnicalPackage(projectId: string): TechnicalPackage {
    return {
      id: this.generateId(),
      projectId,
      version: '1.0.0',
      created: new Date(),
      engineering: {
        architecture: '',
        technologies: [],
        dependencies: [],
        setupInstructions: '',
      },
      files: {
        code: [],
        designs: [],
        diagrams: [],
        documentation: [],
      },
      intellectualProperty: {
        patents: [],
        trademarks: [],
        copyrights: [],
        licenses: [],
      },
      testing: {
        testResults: [],
        qualityMetrics: {},
      },
    };
  }

  /**
   * Add a file reference to the technical package
   */
  public addFileReference(
    techPackage: TechnicalPackage,
    category: 'code' | 'designs' | 'diagrams' | 'documentation',
    fileRef: Omit<FileReference, 'created' | 'lastModified'>
  ): TechnicalPackage {
    const newFileRef: FileReference = {
      ...fileRef,
      created: new Date(),
      lastModified: new Date(),
    };

    return {
      ...techPackage,
      files: {
        ...techPackage.files,
        [category]: [...techPackage.files[category], newFileRef],
      },
    };
  }

  /**
   * Remove a file reference
   */
  public removeFileReference(
    techPackage: TechnicalPackage,
    category: 'code' | 'designs' | 'diagrams' | 'documentation',
    filePath: string
  ): TechnicalPackage {
    return {
      ...techPackage,
      files: {
        ...techPackage.files,
        [category]: techPackage.files[category].filter(f => f.path !== filePath),
      },
    };
  }

  /**
   * Update engineering information
   */
  public updateEngineering(
    techPackage: TechnicalPackage,
    updates: Partial<TechnicalPackage['engineering']>
  ): TechnicalPackage {
    return {
      ...techPackage,
      engineering: {
        ...techPackage.engineering,
        ...updates,
      },
    };
  }

  /**
   * Add technology to the stack
   */
  public addTechnology(techPackage: TechnicalPackage, technology: string): TechnicalPackage {
    if (techPackage.engineering.technologies.includes(technology)) {
      return techPackage;
    }

    return {
      ...techPackage,
      engineering: {
        ...techPackage.engineering,
        technologies: [...techPackage.engineering.technologies, technology],
      },
    };
  }

  /**
   * Add dependency
   */
  public addDependency(techPackage: TechnicalPackage, dependency: string): TechnicalPackage {
    if (techPackage.engineering.dependencies.includes(dependency)) {
      return techPackage;
    }

    return {
      ...techPackage,
      engineering: {
        ...techPackage.engineering,
        dependencies: [...techPackage.engineering.dependencies, dependency],
      },
    };
  }

  /**
   * Update intellectual property information
   */
  public updateIP(
    techPackage: TechnicalPackage,
    updates: Partial<TechnicalPackage['intellectualProperty']>
  ): TechnicalPackage {
    return {
      ...techPackage,
      intellectualProperty: {
        ...techPackage.intellectualProperty,
        ...updates,
      },
    };
  }

  /**
   * Add test result
   */
  public addTestResult(techPackage: TechnicalPackage, testResult: string): TechnicalPackage {
    return {
      ...techPackage,
      testing: {
        ...techPackage.testing,
        testResults: [...techPackage.testing.testResults, testResult],
      },
    };
  }

  /**
   * Update quality metrics
   */
  public updateQualityMetrics(
    techPackage: TechnicalPackage,
    metrics: Record<string, any>
  ): TechnicalPackage {
    return {
      ...techPackage,
      testing: {
        ...techPackage.testing,
        qualityMetrics: {
          ...techPackage.testing.qualityMetrics,
          ...metrics,
        },
      },
    };
  }

  /**
   * Set deployment information
   */
  public setDeployment(
    techPackage: TechnicalPackage,
    deployment: TechnicalPackage['deployment']
  ): TechnicalPackage {
    return {
      ...techPackage,
      deployment,
    };
  }

  /**
   * Generate a handoff package summary
   */
  public generateHandoffSummary(techPackage: TechnicalPackage): string {
    const sections: string[] = [];

    sections.push('# Technical Handoff Package\n');
    sections.push(`Version: ${techPackage.version}`);
    sections.push(`Generated: ${techPackage.created.toISOString()}\n`);

    // Engineering
    sections.push('## Engineering Overview');
    sections.push(`Architecture: ${techPackage.engineering.architecture}`);
    sections.push(`Technologies: ${techPackage.engineering.technologies.join(', ')}`);
    sections.push(`Dependencies: ${techPackage.engineering.dependencies.length} total\n`);

    // Files
    sections.push('## Deliverables');
    sections.push(`Code Files: ${techPackage.files.code.length}`);
    sections.push(`Design Files: ${techPackage.files.designs.length}`);
    sections.push(`Diagrams: ${techPackage.files.diagrams.length}`);
    sections.push(`Documentation: ${techPackage.files.documentation.length}\n`);

    // IP
    sections.push('## Intellectual Property');
    sections.push(`Patents: ${techPackage.intellectualProperty.patents.length}`);
    sections.push(`Trademarks: ${techPackage.intellectualProperty.trademarks.length}`);
    sections.push(`Licenses: ${techPackage.intellectualProperty.licenses.join(', ') || 'None'}\n`);

    // Testing
    sections.push('## Quality Assurance');
    sections.push(`Test Coverage: ${techPackage.testing.testCoverage || 'N/A'}`);
    sections.push(`Test Results: ${techPackage.testing.testResults.length} results recorded\n`);

    // Deployment
    if (techPackage.deployment) {
      sections.push('## Deployment');
      sections.push(`Environments: ${techPackage.deployment.environments.join(', ')}`);
      sections.push(`Infrastructure: ${techPackage.deployment.infrastructure}\n`);
    }

    return sections.join('\n');
  }

  /**
   * Get all files by tag
   */
  public getFilesByTag(techPackage: TechnicalPackage, tag: string): FileReference[] {
    const allFiles = [
      ...techPackage.files.code,
      ...techPackage.files.designs,
      ...techPackage.files.diagrams,
      ...techPackage.files.documentation,
    ];

    return allFiles.filter(f => f.tags.includes(tag));
  }

  /**
   * Get files by type
   */
  public getFilesByType(techPackage: TechnicalPackage, type: string): FileReference[] {
    const allFiles = [
      ...techPackage.files.code,
      ...techPackage.files.designs,
      ...techPackage.files.diagrams,
      ...techPackage.files.documentation,
    ];

    return allFiles.filter(f => f.type === type);
  }

  /**
   * Increment version
   */
  public incrementVersion(techPackage: TechnicalPackage): TechnicalPackage {
    const parts = techPackage.version.split('.');
    const patch = parseInt(parts[2] || '0') + 1;

    return {
      ...techPackage,
      version: `${parts[0]}.${parts[1]}.${patch}`,
    };
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `tech-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate technical package completeness
   */
  public validateTechnicalPackage(techPackage: TechnicalPackage): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    if (!techPackage.engineering.architecture) {
      warnings.push('Architecture description is missing');
    }

    if (techPackage.engineering.technologies.length === 0) {
      warnings.push('No technologies listed');
    }

    if (techPackage.files.code.length === 0) {
      warnings.push('No code files referenced');
    }

    if (techPackage.files.documentation.length === 0) {
      warnings.push('No documentation files referenced');
    }

    if (!techPackage.engineering.setupInstructions) {
      warnings.push('Setup instructions are missing');
    }

    if (techPackage.testing.testResults.length === 0) {
      warnings.push('No test results recorded');
    }

    return {
      valid: warnings.length === 0,
      warnings,
    };
  }
}
