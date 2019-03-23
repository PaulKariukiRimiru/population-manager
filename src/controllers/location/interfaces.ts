export interface LocationRequest {
  name: string;
  female: number;
  male: number;
  parentLocation?: string;
}

export interface LocationResponseSchema {
  id: string;
  name: string;
}

export interface CascadePopulationUpdateSpec {
  male: number;
  female: number;
  locationId: string;
  operation: ModificationOperator;
}

export interface CascadeDeleteSpec {
  id: string;
  parentId: string;
  male: number;
  female: number;
}

export enum ModificationOperator {
  add = 'add',
  minus = 'minus',
}
