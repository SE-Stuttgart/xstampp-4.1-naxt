import { Conversion } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const conversionSchema: RxJsonSchema<Conversion> = {
  title: 'stpa: conversion (actuator) schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    id: { type: 'number' },
    parentId: { type: 'number' },
    name: { type: 'string' },
    description: { type: 'string' },
    state: { type: ['string', 'null'] },
    conversion: { type: 'string' },
    controlActionId: { type: 'number' },
    actuatorId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'parentId', 'state', 'controlActionId', 'controlActionId', 'actuatorId'],
};
