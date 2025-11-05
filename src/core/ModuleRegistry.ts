import { Module, ModuleRegistry as IModuleRegistry } from '../types';

/**
 * Central registry for managing modules in the application
 * Enables the modular architecture for easy feature addition
 */
export class ModuleRegistry implements IModuleRegistry {
  private modules: Map<string, Module> = new Map();
  private static instance: ModuleRegistry;

  private constructor() {}

  /**
   * Get the singleton instance of ModuleRegistry
   */
  public static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  /**
   * Register a new module
   */
  public register(module: Module): void {
    if (this.modules.has(module.id)) {
      throw new Error(`Module with id '${module.id}' is already registered`);
    }

    this.modules.set(module.id, module);
    console.log(`Module registered: ${module.name} (v${module.version})`);

    // Initialize the module if it has an initialize method
    if (module.initialize && module.enabled) {
      module.initialize().catch(err => {
        console.error(`Failed to initialize module ${module.name}:`, err);
      });
    }
  }

  /**
   * Unregister a module
   */
  public unregister(moduleId: string): void {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module with id '${moduleId}' not found`);
    }

    // Call destroy if available
    if (module.destroy) {
      module.destroy().catch(err => {
        console.error(`Failed to destroy module ${module.name}:`, err);
      });
    }

    this.modules.delete(moduleId);
    console.log(`Module unregistered: ${module.name}`);
  }

  /**
   * Get a module by ID
   */
  public get(moduleId: string): Module | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Get all registered modules
   */
  public getAll(): Module[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get all enabled modules
   */
  public getEnabled(): Module[] {
    return this.getAll().filter(m => m.enabled);
  }

  /**
   * Enable a module
   */
  public enable(moduleId: string): void {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module with id '${moduleId}' not found`);
    }

    module.enabled = true;

    if (module.initialize) {
      module.initialize().catch(err => {
        console.error(`Failed to initialize module ${module.name}:`, err);
      });
    }

    console.log(`Module enabled: ${module.name}`);
  }

  /**
   * Disable a module
   */
  public disable(moduleId: string): void {
    const module = this.modules.get(moduleId);
    if (!module) {
      throw new Error(`Module with id '${moduleId}' not found`);
    }

    module.enabled = false;

    if (module.destroy) {
      module.destroy().catch(err => {
        console.error(`Failed to destroy module ${module.name}:`, err);
      });
    }

    console.log(`Module disabled: ${module.name}`);
  }

  /**
   * Check if a module is registered
   */
  public has(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }

  /**
   * Initialize all enabled modules
   */
  public async initializeAll(): Promise<void> {
    const enabledModules = this.getEnabled();

    for (const module of enabledModules) {
      if (module.initialize) {
        try {
          await module.initialize();
        } catch (err) {
          console.error(`Failed to initialize module ${module.name}:`, err);
        }
      }
    }
  }

  /**
   * Destroy all modules
   */
  public async destroyAll(): Promise<void> {
    const modules = this.getAll();

    for (const module of modules) {
      if (module.destroy) {
        try {
          await module.destroy();
        } catch (err) {
          console.error(`Failed to destroy module ${module.name}:`, err);
        }
      }
    }
  }
}
