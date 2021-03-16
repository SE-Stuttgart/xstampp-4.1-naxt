import { LossScenario } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const lossScenarioSchema: RxJsonSchema<LossScenario> = {
  title: 'stpa: loss scenario schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    state: { type: ['string', 'null'] },
    ucaId: { type: 'number' },
    headCategory: { type: ['string', 'null'] },
    subCategory: { type: ['string', 'null'] },
    controller1Id: { type: ['number', 'null'] },
    controller2Id: { type: ['number', 'null'] },
    controlAlgorithm: { type: ['number', 'null'] },
    description1: { type: ['string', 'null'] },
    description2: { type: ['string', 'null'] },
    description3: { type: ['string', 'null'] },
    controlActionId: { type: ['number', 'null'] },
    inputArrowId: { type: ['number', 'null'] },
    feedbackArrowId: { type: ['number', 'null'] },
    inputBoxId: { type: ['string', 'null'] },
    sensorId: { type: ['number', 'null'] },
    reason: { type: ['string', 'null'] },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'name', 'description', 'state'],
};
