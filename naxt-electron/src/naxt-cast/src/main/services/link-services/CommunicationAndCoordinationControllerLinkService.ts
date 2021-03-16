import {
  CommunicationAndCoordinationController1Link,
  CommunicationAndCoordinationController2Link,
  CommunicationAndCoordinationControllerLink,
} from '@cast/src/main/models';
import {
  CommunicationAndCoordinationController1LinkRepo,
  CommunicationAndCoordinationController2LinkRepo,
  CommunicationAndCoordinationRepo,
  ControllerRepo,
  ProjectRepo,
} from '@cast/src/main/repositories';
import { ChipMap } from '@cast/src/main/services/util/ChipMap';
import { toControllerChipMapByCommunicationAndCoordinationIds$ } from '@cast/src/main/services/util/toChipMap';
import { NAXTError } from '@src-shared/errors/NaxtError';
import { Repository } from '@src-shared/rxdb-repository/Repository';
import { inject, unmanaged } from 'inversify';
import { Observable } from 'rxjs';
import { LinkService } from '../common/LinkService';

abstract class CommunicationAndCoordinationControllerLinkService<
  T extends CommunicationAndCoordinationControllerLink
> extends LinkService<T> {
  protected constructor(
    @unmanaged()
    _clazz: { new (): T },
    @unmanaged()
    _projectRepo: ProjectRepo,
    @unmanaged()
    private readonly __linkRepo: Repository<T>,
    @unmanaged()
    private readonly communicationAndCoordinationRepo: CommunicationAndCoordinationRepo,
    @unmanaged() private readonly controllerRepo: ControllerRepo
  ) {
    super(_clazz, _projectRepo, __linkRepo);
  }

  public async create(link: T): Promise<T> {
    return this.checkCreationRules(link).then(() => super.create(link));
  }

  protected async checkCreationRules(link: CommunicationAndCoordinationController1Link): Promise<void> {
    const { projectId, communicationAndCoordinationId, controllerId } = link;

    const cNcExists = this.communicationAndCoordinationRepo.exists(projectId, communicationAndCoordinationId);
    if (!cNcExists) throw new NAXTError('No such [communication and coordination] exists:', link);

    const controllerExists = this.controllerRepo.exists(projectId, controllerId);
    if (!controllerExists) throw new NAXTError('No such [controller] exists:', link);
  }

  public getControllerChipMapByCommunicationAndCoordinationIds$(projectId: string): Observable<ChipMap> {
    const controllers$ = this.controllerRepo.findAll$(projectId);
    const communicationAndCoordination$ = this.communicationAndCoordinationRepo.findAll$(projectId);
    const links$ = this.__linkRepo.findAll$(projectId);
    return toControllerChipMapByCommunicationAndCoordinationIds$(controllers$, communicationAndCoordination$, links$);
  }
}

export class CommunicationAndCoordinationController1LinkService extends CommunicationAndCoordinationControllerLinkService<
  CommunicationAndCoordinationController1Link
> {
  constructor(
    @inject(ProjectRepo)
    projectRepo: ProjectRepo,
    @inject(CommunicationAndCoordinationController1LinkRepo)
    private readonly linkRepo: CommunicationAndCoordinationController1LinkRepo,
    @inject(CommunicationAndCoordinationRepo)
    communicationAndCoordinationRepo: CommunicationAndCoordinationRepo,
    @inject(ControllerRepo) controllerRepo: ControllerRepo
  ) {
    super(
      CommunicationAndCoordinationController1Link,
      projectRepo,
      linkRepo,
      communicationAndCoordinationRepo,
      controllerRepo
    );
  }

  public async removeAllForCommunicationAndCoordinationId(
    projectId: string,
    communicationAndCoordinationId: string
  ): Promise<CommunicationAndCoordinationControllerLink[]> {
    return this.linkRepo.removeAllForCommunicationAndCoordinationId(projectId, communicationAndCoordinationId);
  }
}

export class CommunicationAndCoordinationController2LinkService extends CommunicationAndCoordinationControllerLinkService<
  CommunicationAndCoordinationController2Link
> {
  constructor(
    @inject(ProjectRepo)
    projectRepo: ProjectRepo,
    @inject(CommunicationAndCoordinationController2LinkRepo)
    private readonly linkRepo: CommunicationAndCoordinationController2LinkRepo,
    @inject(CommunicationAndCoordinationRepo)
    communicationAndCoordinationRepo: CommunicationAndCoordinationRepo,
    @inject(ControllerRepo) controllerRepo: ControllerRepo
  ) {
    super(
      CommunicationAndCoordinationController2Link,
      projectRepo,
      linkRepo,
      communicationAndCoordinationRepo,
      controllerRepo
    );
  }

  public async removeAllForCommunicationAndCoordinationId(
    projectId: string,
    communicationAndCoordinationId: string
  ): Promise<CommunicationAndCoordinationControllerLink[]> {
    return this.linkRepo.removeAllForCommunicationAndCoordinationId(projectId, communicationAndCoordinationId);
  }
}
