import { ConversionSensorLastId } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const conversionSensorLastIdSchema: RxJsonSchema<ConversionSensorLastId> = {
  title: 'stpa: conversion sensor schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    sensorId: { type: 'number' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'sensorId']],
  required: ['projectId', 'sensorId', 'lastId'],
};
