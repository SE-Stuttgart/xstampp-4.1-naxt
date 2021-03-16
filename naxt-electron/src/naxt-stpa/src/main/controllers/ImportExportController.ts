import { Project } from '@src-shared/project/Project';
import { inject, injectable } from 'inversify';
import { ImportExportService } from '../services';
import { StpaProject } from '../services/models';

@injectable()
export class ImportExportController {
  constructor(@inject(ImportExportService) private readonly importExportService: ImportExportService) {}

  public async import(project: Project, stpaProject: StpaProject): Promise<Project> {
    return this.importExportService.import(project, stpaProject);
  }

  public async export(projectId: string): Promise<StpaProject> {
    return this.importExportService.export(projectId);
  }
}
