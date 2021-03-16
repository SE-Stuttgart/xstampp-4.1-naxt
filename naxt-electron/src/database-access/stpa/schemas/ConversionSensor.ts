import { ConversionSensor } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const conversionSensorSchema: RxJsonSchema<ConversionSensor> = {
  title: 'stpa: conversion (sensor) schema',
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
  },
  indexes: ['projectId', ['projectId', 'id']],
  required: ['projectId', 'id', 'parentId', 'state', 'controlActionId', 'controlActionId'],
};
