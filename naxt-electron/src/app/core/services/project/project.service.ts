import { Injectable } from '@angular/core';
import { projectController as CastController } from '@cast/index';
import { ProjectType } from '@src-shared/Enums';
import { Project } from '@src-shared/project/Project';
import { projectController as StpaController } from '@stpa/index';

import { combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  openNext: Subject<Project> = new Subject<Project>();

  createStpaProject(project: Project): Promise<Project> {
    return StpaController.create(project);
  }

  createCastProject(_project: Project): Promise<Project> {
    return CastController.create(_project);
  }

  createProject(_project: Project): Promise<Project> {
    if (_project.projectType === ProjectType.STPA) return this.createStpaProject(_project);
    return this.createCastProject(_project);
  }

  updateStpaProject(project: Project): Promise<Project> {
    return StpaController.update(project);
  }

  updateCastProject(_project: Project): Promise<Project> {
    return CastController.update(_project);
  }

  updateProject(project: Project): Promise<Project> {
    if (project.projectType === ProjectType.STPA) return this.updateStpaProject(project);
    return this.updateCastProject(project);
  }

  openStpaProject(_fileName: string, path: string): void {
    console.log(path);
  }

  openProjectWithId(id: string): void {
    console.log(id);
  }

  closeStpaProject(project: Project): Promise<boolean> {
    return StpaController.remove(project);
  }

  closeCastProject(_project: Project): Promise<boolean> {
    return CastController.remove(_project);
  }

  closeProject(project: Project): Promise<boolean> {
    if (project.projectType === ProjectType.STPA) return this.closeStpaProject(project);
    return this.closeCastProject(project);
  }

  allProjects(): Observable<Project[]> {
    return combineLatest([StpaController.getAll$(), CastController.getAll$()]).pipe(
      map(([stpaProjects, castProjects]) => {
        return [].concat(stpaProjects, castProjects);
      })
    );
  }
}
