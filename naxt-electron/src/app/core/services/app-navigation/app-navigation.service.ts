import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { Subscriptions } from '../../../shared/utils/subscriptions';
import { ProjectService } from '../project/project.service';
import { KeyValuePair, NavigationPoint } from './navigation.type';

@Injectable({
  providedIn: 'root',
})
export class AppNavigationService {
  private subscriptions: Subscriptions = new Subscriptions();
  private navPointList: NavigationPoint[] = [];
  navPoints: BehaviorSubject<NavigationPoint[]> = new BehaviorSubject<NavigationPoint[]>([]);
  keyValuePair: BehaviorSubject<KeyValuePair> = new BehaviorSubject<KeyValuePair>(void 0);
  lastPoint: BehaviorSubject<NavigationPoint> = new BehaviorSubject<NavigationPoint>(void 0);

  // activeBaseUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  activeBaseUrl: string = '';
  private _activePoint = new BehaviorSubject<NavigationPoint>(undefined);
  activePoint: Observable<NavigationPoint> = this._activePoint.pipe(
    distinctUntilChanged((prev, next) => {
      const isSame: boolean = prev?.projectId === next?.projectId;
      if (!isSame) this.lastPoint.next(prev);
      return isSame;
    })
  );

  constructor(private readonly projectService: ProjectService, private readonly router: Router) {
    this.subscriptions.plusOne = this.projectService
      .allProjects()
      .pipe(
        tap(projects => {
          const tempList: NavigationPoint[] = [];
          projects.forEach(p => {
            const foundProject = this.navPointList.find(project => project.projectId === p.projectId);
            if (!!foundProject) {
              tempList.push({ ...foundProject, ...p });
            } else {
              tempList.push({
                ...p,
                subPath: '',
              });
            }
          });
          this.navPointList = tempList;
          this.navPoints.next(this.navPointList);
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        tap((e: NavigationEnd) => {
          const temp: string[] = e.urlAfterRedirects.split('/');
          this.activeBaseUrl = '/' + temp[1];
          this.activeBaseUrl += !!temp[2] ? '/' + temp[2] : '';

          // if id (temp[2]) and subPath (temp[3]) set point in navList
          this.setSubPathById(temp[2], temp[3]);

          // pushes nex value in pair if possible
          const pair: KeyValuePair = this.getKeyValueById(temp[2]);
          if (!!pair) this.keyValuePair.next(pair);
          else this.keyValuePair.next(undefined);

          // wait for side load ?

          this._activePoint.next(this.currentPoint);
        })
      )
      .subscribe();
  }

  /**
   * Checks if the given point is active.
   * @param id the id of the point / project
   */
  isActive(id: string): boolean {
    return this.activeBaseUrl.includes(id);
  }

  subIsActive(path: string): boolean {
    return this.currentPoint?.subPath === path;
  }

  get currentPoint(): NavigationPoint {
    return this.navPoints.getValue().find((point: NavigationPoint) => this.isActive(point.projectId));
  }

  get rootPath(): string {
    return this.activeBaseUrl;
  }

  // the path suffix
  get pathSuffix(): string {
    return '/' + this.navPointList.find(np => this.activeBaseUrl.includes(np.projectId)).subPath;
  }

  /**
   * Sets the subpath by id.
   * @param id The id of the path / navpoint / project
   * @param subPath The new subpath for the nacpoint
   */
  setSubPathById(id: string, subPath: string): void {
    if (!!id && !!subPath) {
      const point = this.navPointList.find(point => point.projectId === id);
      if (!!point) {
        point.subPath = subPath;
        this.navPoints.next(this.navPointList);
      }
    }
  }

  setKeyValueById(id: string, pair: KeyValuePair): void {
    if (!!id) {
      const point = this.navPointList.find(point => point.projectId === id);
      if (!!point) {
        point.keyValuePair = pair;
        this.navPoints.next(this.navPointList);
      }
    }
  }

  setNewKeyValue(pair: KeyValuePair): void {
    const id = this.activeBaseUrl.split('/')[2];
    this.setKeyValueById(id, pair);
  }

  getKeyValueById(id: string): KeyValuePair {
    if (!!id) {
      const point = this.navPointList.find(point => point.projectId === id);
      if (!!point) {
        return point.keyValuePair;
      }
    }
    return undefined;
  }

  /**
   * UNsubscribes all subscriptions.
   */
  unsubsribe(): void {
    this.subscriptions.unsubscribe();
  }
}
