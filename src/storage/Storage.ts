import * as fs from 'fs';
import * as path from 'path';
import { Project } from '../types';

/**
 * Storage interface for persisting project data
 */
export interface IStorage {
  save(project: Project): Promise<void>;
  load(projectId: string): Promise<Project | null>;
  loadAll(): Promise<Project[]>;
  delete(projectId: string): Promise<void>;
  exists(projectId: string): Promise<boolean>;
  export(projectId: string, exportPath: string): Promise<void>;
}

/**
 * JSON-based file storage implementation
 */
export class JSONStorage implements IStorage {
  private storagePath: string;

  constructor(storagePath: string = './data') {
    this.storagePath = storagePath;
    this.ensureStorageDirectory();
  }

  /**
   * Ensure the storage directory exists
   */
  private ensureStorageDirectory(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Get the file path for a project
   */
  private getProjectPath(projectId: string): string {
    return path.join(this.storagePath, `${projectId}.json`);
  }

  /**
   * Save a project to storage
   */
  public async save(project: Project): Promise<void> {
    const projectPath = this.getProjectPath(project.id);
    const data = JSON.stringify(project, null, 2);

    return new Promise((resolve, reject) => {
      fs.writeFile(projectPath, data, 'utf8', (err) => {
        if (err) {
          reject(new Error(`Failed to save project: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Load a project from storage
   */
  public async load(projectId: string): Promise<Project | null> {
    const projectPath = this.getProjectPath(projectId);

    if (!fs.existsSync(projectPath)) {
      return null;
    }

    return new Promise((resolve, reject) => {
      fs.readFile(projectPath, 'utf8', (err, data) => {
        if (err) {
          reject(new Error(`Failed to load project: ${err.message}`));
        } else {
          try {
            const project = JSON.parse(data);
            // Convert date strings back to Date objects
            this.deserializeDates(project);
            resolve(project);
          } catch (parseErr) {
            reject(new Error(`Failed to parse project data: ${parseErr}`));
          }
        }
      });
    });
  }

  /**
   * Load all projects from storage
   */
  public async loadAll(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(this.storagePath, (err, files) => {
        if (err) {
          reject(new Error(`Failed to read storage directory: ${err.message}`));
          return;
        }

        const jsonFiles = files.filter(f => f.endsWith('.json'));
        const loadPromises = jsonFiles.map(f => {
          const projectId = f.replace('.json', '');
          return this.load(projectId);
        });

        Promise.all(loadPromises)
          .then(projects => resolve(projects.filter(p => p !== null) as Project[]))
          .catch(reject);
      });
    });
  }

  /**
   * Delete a project from storage
   */
  public async delete(projectId: string): Promise<void> {
    const projectPath = this.getProjectPath(projectId);

    return new Promise((resolve, reject) => {
      fs.unlink(projectPath, (err) => {
        if (err && err.code !== 'ENOENT') {
          reject(new Error(`Failed to delete project: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Check if a project exists
   */
  public async exists(projectId: string): Promise<boolean> {
    const projectPath = this.getProjectPath(projectId);
    return fs.existsSync(projectPath);
  }

  /**
   * Convert date strings back to Date objects recursively
   */
  private deserializeDates(obj: any): void {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) continue;

      // Check if it's a date string
      if (typeof obj[key] === 'string' && this.isDateString(obj[key])) {
        obj[key] = new Date(obj[key]);
      } else if (typeof obj[key] === 'object') {
        // Recursively process nested objects
        this.deserializeDates(obj[key]);
      }
    }
  }

  /**
   * Check if a string is a valid date string
   */
  private isDateString(value: string): boolean {
    const dateKeys = ['date', 'created', 'updated', 'completed', 'lastUpdated', 'lastModified'];
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
  }

  /**
   * Export a project to a specific location
   */
  public async export(projectId: string, exportPath: string): Promise<void> {
    const project = await this.load(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const data = JSON.stringify(project, null, 2);

    return new Promise((resolve, reject) => {
      fs.writeFile(exportPath, data, 'utf8', (err) => {
        if (err) {
          reject(new Error(`Failed to export project: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }
}
