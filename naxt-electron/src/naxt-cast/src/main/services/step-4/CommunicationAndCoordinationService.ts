import { CommunicationAndCoordination } from '@cast/src/main/models';
import { CommunicationAndCoordinationRepo, LastIdRepo, ProjectRepo } from '@cast/src/main/repositories';
import { Service } from '@cast/src/main/services/common/Service';
import {
  CommunicationAndCoordinationController1LinkService,
  CommunicationAndCoordinationController2LinkService,
} from '@cast/src/main/services/link-services/CommunicationAndCoordinationControllerLinkService';
import { CommunicationAndCoordinationTableModel } from '@cast/src/main/services/models';
import { inject, injectable } from 'inversify';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class CommunicationAndCoordinationService extends Service<CommunicationAndCoordination> {
  constructor(
    @inject(ProjectRepo) projectRepo: ProjectRepo,
    @inject(LastIdRepo) lastIdRepo: LastIdRepo,
    @inject(CommunicationAndCoordinationRepo)
    private readonly communicationAndCoordinationRepo: CommunicationAndCoordinationRepo,
    @inject(CommunicationAndCoordinationController1LinkService)
    private readonly linkService1: CommunicationAndCoordinationController1LinkService,
    @inject(CommunicationAndCoordinationController2LinkService)
    private readonly linkService2: CommunicationAndCoordinationController2LinkService
  ) {
    super(CommunicationAndCoordination, projectRepo, communicationAndCoordinationRepo, lastIdRepo);
  }

  public getAllTableModels$(projectId: string): Observable<CommunicationAndCoordinationTableModel[]> {
    return combineLatest([
      this.communicationAndCoordinationRepo.findAll$(projectId),
      this.linkService1.getControllerChipMapByCommunicationAndCoordinationIds$(projectId),
      this.linkService2.getControllerChipMapByCommunicationAndCoordinationIds$(projectId),
    ]).pipe(
      map(([commAndCoords, controller1ChipMap, controller2ChipMap]) => {
        return commAndCoords.map(commAndCo => {
          const selectedController1 = controller1ChipMap.get(commAndCo.id).find(chip => chip.selected);
          const selectedController2 = controller2ChipMap.get(commAndCo.id).find(chip => chip.selected);
          return new CommunicationAndCoordinationTableModel(
            commAndCo,
            controller1ChipMap.get(commAndCo.id).filter(chip => chip.id !== selectedController2?.id),
            controller2ChipMap.get(commAndCo.id).filter(chip => chip.id !== selectedController1?.id)
          );
        });
      })
    );
  }
}
