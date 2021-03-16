import { CastProject } from '@cast/src/main/services';
import { ImportExportService } from '@cast/src/main/services/ImportExportService';
import { Project } from '@src-shared/project/Project';
import { inject, injectable } from 'inversify';

@injectable()
export class ImportExportController {
  constructor(@inject(ImportExportService) private readonly importExportService: ImportExportService) {}

  public async import(project: Project, castProject: CastProject): Promise<Project> {
    return this.importExportService.import(project, castProject);
  }

  public async export(projectId: string): Promise<CastProject> {
    return this.importExportService.export(projectId);
  }
}
