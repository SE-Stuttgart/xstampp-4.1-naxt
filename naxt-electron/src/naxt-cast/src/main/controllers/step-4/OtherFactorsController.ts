import { OtherFactors } from '@cast/src/main/models';
import { OtherFactorsService } from '@cast/src/main/services';
import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

@injectable()
export class OtherFactorsController {
  constructor(
    @inject(OtherFactorsService)
    private readonly otherFactorsService: OtherFactorsService
  ) {}

  public async update(description: OtherFactors): Promise<OtherFactors> {
    return this.otherFactorsService.update(description);
  }

  public get$(projectId: string): Observable<OtherFactors> {
    return this.otherFactorsService.get$(projectId);
  }
}
