import { ConversionLastId } from '@stpa/src/main/models';
import { RxJsonSchema } from 'rxdb';

export const conversionLastIdSchema: RxJsonSchema<ConversionLastId> = {
  title: 'stpa: conversion last id schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    actuatorId: { type: 'number' },
    lastId: { type: 'number' },
  },
  indexes: ['projectId', ['projectId', 'actuatorId']],
  required: ['projectId', 'actuatorId', 'lastId'],
};
