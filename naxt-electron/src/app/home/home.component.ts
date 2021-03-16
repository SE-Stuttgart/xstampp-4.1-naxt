import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CastProject, importExportController as importExportCast } from '@cast/index';
import { AppNavigationService, ElectronService, KeyValuePair, MessageService, ProjectService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, TableComponent } from '@shared/index';
import { ProjectType, State } from '@src-shared/Enums';
import { Chip, importExportController, LossTableEntry, StpaProject } from '@stpa/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'stamp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @ViewChild(TableComponent) table: TableComponent<LossTableEntry>;
  arrayChipList: Chip[] = [
    { name: 'Chip1', id: 1, selected: false, label: 'H-1' },
    { name: 'Chip2', id: 2, selected: false, label: 'H-2' },
    { name: 'Chip3', id: 3, selected: false, label: 'H-3' },
  ];
  arrayChipListSelected: Chip[] = [
    { name: 'Chip1', id: 1, selected: true, label: 'H-1' },
    { name: 'Chip2', id: 2, selected: true, label: 'H-2' },
    { name: 'Chip3', id: 3, selected: false, label: 'H-3' },
  ];
  list = [
    { name: 'untitledStpaProject', path: '/home/maurice...' },
    { name: 'reddit', path: '/home/felix/...' },
    { name: 'arMaAnalysis', path: '/home/eva/...' },
  ];

  ELEMENT_DATA: LossTableEntry[] = [
    {
      id: 1,
      tableId: 'L-1',
      projectId: '-1',
      description: '',
      hazardChips: this.arrayChipList,
      name: 'Loss of life or injury to people',
      state: State.TODO,
    },
    {
      id: 2,
      tableId: 'L-2',
      projectId: '-1',
      description: '',
      hazardChips: this.arrayChipListSelected,
      name: 'Loss of or damage to vehicle',
      state: State.DONE,
    },
    {
      id: 3,
      tableId: 'L-3',
      projectId: '-1',
      description: '',
      hazardChips: this.arrayChipList,
      name: 'Loss of or damage to objects outside the vehicle',
      state: State.DOING,
    },
    {
      id: 4,
      tableId: 'L-4',
      projectId: '-1',
      description: '',
      hazardChips: this.arrayChipList,
      name: 'Loss of customer satisfaction',
      state: State.TODO,
    },
  ];

  columns: ColumnDefinition[] = [
    { label: 'Name', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true },
  ];
  removable: boolean = true;

  constructor(
    private readonly translate: TranslateService,
    private readonly msg: MessageService,
    private readonly electronService: ElectronService,
    private readonly router: Router,
    private readonly navigationService: AppNavigationService,
    private readonly projectService: ProjectService
  ) {}

  openTable(): void {
    const key = new KeyValuePair(this.ELEMENT_DATA[1].tableId);
    this.table.activateRowByPair(key);
  }

  openDialogStpa(): void {
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
      .then(project => this.router.navigateByUrl(`/${project.projectType}/${project.projectId}`));
  }
  openDialogCast(): void {
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
      .then(project => this.router.navigateByUrl(`/${project.projectType}/${project.projectId}`));
  }
  openFile(): void {
    this.electronService.remote.dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Naxt Project', extensions: ['hazx4', 'cast'] }],
      })
      .then(result => {
        const filePath: string = result.filePaths[0];
        const filename = this.electronService.path.basename(filePath);
        const content = this.electronService.fs.readFileSync(filePath, 'utf-8');

        const navPointWithSamePath = this.navigationService.navPoints
          .getValue()
          .find(_navPoint => _navPoint.filePath === filePath);
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
            .then(project => importExportController.import(project, contentParsed))
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
            .then(project => importExportCast.import(project, contentParsed))
            .then(project => this.router.navigateByUrl(`/${project.projectType}/${project.projectId}`));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  importOldStpaProject(): void {
    this.electronService.remote.dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'hazx4', extensions: ['hazx4'] }],
      })
      .then(result => {
        console.log(result.filePaths[0]);
        //this.data.type = 'path';
      })
      .catch(err => {
        console.log(err);
      });
  }

  get title(): Observable<string> {
    return this.translate.get('PAGES.HOME.TITLE');
  }

  cahngeLan(): void {
    this.translate.currentLang === 'en' ? this.translate.use('de') : this.translate.use('en');
  }
}
