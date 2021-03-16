import { Component, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CastProject, importExportController as castImportExportController } from '@cast/index';
import { AppNavigationService, ElectronService, MessageService, NavigationPoint, ProjectService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ProjectType, State } from '@src-shared/Enums';
import { importExportController as stpaImportExportController, StpaProject } from '@stpa/index';
import { FileFilter } from 'electron';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IpcKeys, StoreKeys } from '../../enum-keys';
import { removeDB as removeCastDB } from '../database-access/cast';
import { removeDB as removeStpaDB } from '../database-access/stpa';
import { AppConfig } from '../environments/environment';
import { Subscriptions } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();

  constructor(
    readonly electronService: ElectronService,
    private readonly translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly router: Router,
    private readonly ngZone: NgZone,
    private readonly messageService: MessageService,
    private readonly projectService: ProjectService
  ) {
    // sets global lang for electron container

    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang('en');

    // loads language config
    this.electronService.ipcRenderer
      .invoke(IpcKeys.STORE, StoreKeys.LANGUAGE)
      .then(s => {
        this.translate.use(s ?? 'en');
      })
      .catch(() => this.translate.use('en'));
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    // triggers menu rerender on language change
    this.subscriptions.plusOne = this.translate.onLangChange
      .pipe(
        tap(s => {
          this.electronService.ipcRenderer.send(IpcKeys.SET_LANGUAGE, s.lang);
        })
      )
      .subscribe();

    // recieves data from main process
    this.electronService.ipcRenderer.on(IpcKeys.LANGUAGE, (event, args) => {
      this.ngZone.run(() => {
        this.translate.use(args);
      });
    });
    this.electronService.ipcRenderer.on(IpcKeys.NEW_STPA, () => {
      this.ngZone.run(() => {
        this.projectService
          .createStpaProject({
            description: '',
            fileName: 'untitledStpaProject',
            filePath: '',
            name: 'untitled',
            projectId: void 0,
            projectType: ProjectType.STPA,
            state: State.TODO,
            unsavedChanges: false,
          })
          .then(project => this.router.navigateByUrl(`/${project.projectType}/${project.projectId}`))
          .catch((err: Error) => this.messageService.info(err.message));
        //       },
        //     }
        //   );
        // });
      });
    });
    this.electronService.ipcRenderer.on(IpcKeys.NEW_CAST, () => {
      this.ngZone.run(
        () => {
          // this.messageService.dialog(
          //   {
          //     data: {
          //       headline: 'Projekt erstellen',
          //       text: 'Bitte gib den Projektnamen an:',
          //       inputLabel: 'TestLabel',
          //       labelDirectoryPathField: 'directory',
          //     },
          //   },
          //   {
          //     accept: (extra: string, path: string) => {
          //       console.log(extra + '\n' + path);
          this.projectService
            .createCastProject({
              description: '',
              fileName: 'untitledCastProject',
              filePath: '',
              name: 'untitled',
              projectId: void 0,
              projectType: ProjectType.CAST,
              state: State.TODO,
              unsavedChanges: false,
            })
            .then(project => this.router.navigateByUrl(`/${project.projectType}/${project.projectId}`))
            .catch((err: Error) => this.messageService.info(err.message));
        }
        //     }
        //   );
        // }
      );
    });

    this.electronService.ipcRenderer.on(IpcKeys.OPEN_PROJECT, () => {
      this.ngZone.run(() => {
        this.electronService.remote.dialog
          .showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Naxt Project', extensions: ['hazx4', 'cast'] }],
          })
          .then(result => {
            // const file = JSON.parse(result.filePaths[0]);
            // console.log(file);
            const filePath: string = result.filePaths[0];
            const filename = this.electronService.path.basename(filePath);
            const content = this.electronService.fs.readFileSync(filePath, 'utf-8');

            const navPointWithSamePath = this.navPoints.getValue().find(_navPoint => _navPoint.filePath === filePath);
            if (!!navPointWithSamePath) {
              this.router.navigateByUrl(`/${navPointWithSamePath.projectType}/${navPointWithSamePath.projectId}`);
              return;
            }

            if (filePath.endsWith('hazx4')) {
              const contentParsed: StpaProject = JSON.parse(content);
              this.projectService
                .createStpaProject({
                  description: '',
                  fileName: filename,
                  filePath: filePath,
                  name: filename,
                  projectId: '',
                  projectType: ProjectType.STPA,
                  state: State.TODO,
                  unsavedChanges: false,
                })
                .then(project => stpaImportExportController.import(project, contentParsed))
                .then(project => this.router.navigateByUrl(`/${project.projectType}/${project.projectId}`));
            } else if (filePath.endsWith('cast')) {
              const contentParsed: CastProject = JSON.parse(content);
              this.projectService
                .createCastProject({
                  description: '',
                  fileName: filename,
                  filePath: filePath,
                  name: filename,
                  projectId: '',
                  projectType: ProjectType.CAST,
                  state: State.TODO,
                  unsavedChanges: false,
                })
                .then(project => castImportExportController.import(project, contentParsed))
                .then(project => this.router.navigateByUrl(`/${project.projectType}/${project.projectId}`));
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    });

    this.electronService.ipcRenderer.on(IpcKeys.IMPORT_PROJECT, () => {
      this.ngZone.run(() => {
        this.electronService.remote.dialog
          .showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Hazx4', extensions: ['.hazx4'] }],
          })
          .then(result => {
            console.log(result.filePaths[0]);
            //this.data.type = 'path';
          })
          .catch(err => {
            console.log(err);
          });
      });
    });

    this.electronService.ipcRenderer.on('reset', () => {
      this.ngZone.run(() => {
        console.log('works');
        /**insert stuff here */
      });
    });

    this.electronService.ipcRenderer.on(IpcKeys.SAVE_PROJECT, () => {
      this.ngZone.run(() => {
        const navPoint = this.navigationService.currentPoint;
        if (navPoint?.projectType === ProjectType.STPA) this.saveStpaProject(navPoint, true, false, false);
        else if (navPoint?.projectType === ProjectType.CAST) {
          this.saveCastProject(navPoint, true, false, false);
        }
      });
    });

    this.electronService.ipcRenderer.on(IpcKeys.SAVE_PROJECT_AS, () => {
      this.ngZone.run(() => {
        const navPoint = this.navigationService.currentPoint;
        if (navPoint?.projectType === ProjectType.STPA) this.saveStpaProject(navPoint, false, false, false);
        else if (navPoint?.projectType === ProjectType.CAST) {
          this.saveCastProject(navPoint, false, false, false);
        }
      });
    });
  }

  get navPoints(): BehaviorSubject<NavigationPoint[]> {
    return this.navigationService.navPoints;
  }

  get isHome(): boolean {
    return this.router?.url.length <= 1;
  }

  getRouterLink(navPoint: NavigationPoint): string {
    let route: string = navPoint.projectType + '/' + navPoint.projectId;
    route += navPoint.subPath && navPoint.subPath.length > 0 ? '/' + navPoint.subPath : '';
    return route;
  }

  async ngOnDestroy(): Promise<void> {
    this.navigationService.unsubsribe();
    this.subscriptions.unsubscribe();

    await removeStpaDB();
    await removeCastDB();
  }

  isActive(id: string): boolean {
    return this.navigationService.isActive(id);
  }

  async closeClick(event: MouseEvent, navPoint: NavigationPoint): Promise<void> {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (!navPoint.unsavedChanges) {
      await this.router.navigateByUrl('/home');
      await this.closeProject(navPoint);
    } else {
      let didNavigate = false;
      await this.router.navigateByUrl('/home').then(couldNavigate => {
        didNavigate = couldNavigate;
      });

      setTimeout(() => {
        if (didNavigate || !this.navigationService.currentPoint?.projectId) {
          if (navPoint?.projectType === ProjectType.STPA) {
            this.saveStpaProject(navPoint, true, true, true);
          } else if (navPoint?.projectType === ProjectType.CAST) {
            this.saveCastProject(navPoint, true, true, true);
          }
        }
      }, 1000);
    }
  }

  private saveStpaProject(
    navPoint: NavigationPoint,
    useFilePathIfExists: boolean,
    closeProjectFinally: boolean,
    withQuestionPopup: boolean
  ): void {
    return this.saveProject(
      navPoint,
      [{ name: 'hazx4', extensions: ['hazx4'] }],
      useFilePathIfExists,
      closeProjectFinally,
      withQuestionPopup
    );
  }

  private saveCastProject(
    navPoint: NavigationPoint,
    useFilePathIfExists: boolean,
    closeProjectFinally: boolean,
    withQuestionPopup: boolean
  ): void {
    return this.saveProject(
      navPoint,
      [{ name: 'cast', extensions: ['cast'] }],
      useFilePathIfExists,
      closeProjectFinally,
      withQuestionPopup
    );
  }

  private saveProject(
    navPoint: NavigationPoint,
    fileFilter: FileFilter[],
    useFilePathIfExists: boolean,
    closeProjectFinally: boolean,
    withQuestionPopup: boolean
  ): void {
    const pathExists = this.electronService.fs.existsSync(navPoint.filePath);

    if (withQuestionPopup) {
      const dialogOptions = {
        type: 'question',
        buttons: ['Close Without Saving', 'Cancel', 'Save Project'],
        message: 'Save changes to ' + navPoint.fileName + ' before closing?',
      };
      this.electronService.remote.dialog.showMessageBox(null, dialogOptions).then(response => {
        switch (response.response) {
          case 0: // Close Without Saving
            if (closeProjectFinally) this.closeProject(navPoint);
            break;
          case 1: // Cancel
            break;
          case 2: // Save Project
            if (pathExists && useFilePathIfExists) {
              this.exportProjectToPath(navPoint, navPoint.filePath, closeProjectFinally);
            } else {
              this.electronService.remote.dialog
                .showSaveDialog({
                  filters: fileFilter,
                })
                .then(result => {
                  if (!result.canceled) this.exportProjectToPath(navPoint, result.filePath, closeProjectFinally);
                });
              return;
            }
            break;
        }
      });
    } else {
      if (pathExists && useFilePathIfExists) {
        this.exportProjectToPath(navPoint, navPoint.filePath, closeProjectFinally);
        return;
      } else {
        this.electronService.remote.dialog
          .showSaveDialog({
            filters: fileFilter,
          })
          .then(result => {
            if (!result.canceled) this.exportProjectToPath(navPoint, result.filePath, closeProjectFinally);
          });
        return;
      }
    }
  }

  private async exportProjectToPath(
    navPoint: NavigationPoint,
    filePath: string,
    closeProjectFinally: boolean
  ): Promise<void> {
    let importExportController;
    const fileNameWithExtension = '';
    if (navPoint.projectType === ProjectType.STPA) {
      importExportController = stpaImportExportController;
      // fileNameWithExtension = '.naxt.hazx4';
    } else if (navPoint.projectType === ProjectType.CAST) {
      importExportController = castImportExportController;
      // fileNameWithExtension = '.naxt.cast';
    }

    const chosenFilename = this.electronService.path.basename(filePath);
    this.projectService
      .updateProject({
        ...navPoint,
        fileName: chosenFilename + fileNameWithExtension,
        filePath: filePath + fileNameWithExtension,
        unsavedChanges: false,
      })
      .then(() => {
        importExportController.export(navPoint.projectId).then(exportedProject => {
          const file = JSON.stringify(exportedProject);
          this.electronService.fs.writeFile(filePath + fileNameWithExtension, file, {}, () => {
            this.ngZone.run(() => {
              if (closeProjectFinally) this.closeProject(navPoint);
            });
          });
        });
      });
  }

  private async closeProject(navPoint: NavigationPoint): Promise<boolean> {
    // const navPointIndex = this.navPoints
    //   .getValue()
    //   .map(_navPoint => _navPoint.projectId)
    //   .indexOf(navPoint.projectId);
    // const nextNavPointIndex = navPointIndex > 0 ? navPointIndex - 1 : navPointIndex + 1;
    // const nextNavPoint = this.navPoints.getValue()[nextNavPointIndex];

    return this.projectService.closeProject(navPoint);
    //   .then(() => {
    //   if (this.navigationService.currentPoint?.subPath === navPoint.subPath) {
    //     if (nextNavPoint) return this.router.navigateByUrl(`/${nextNavPoint.projectType}/${nextNavPoint.projectId}`);
    //     return this.router.navigateByUrl('/home');
    //   }
    // });
  }
}
