export interface LocationPostRequest {
  name: string;
  female: number;
  male: number;
  parentLocation?: string;
}

export interface LocationDeleteRequest {
  id: string;
}

export interface LocationUpdateRequest {
  id: string;
  name?: string;
  female?: number;
  male?: number;
}

export interface LocationGetRequest {
  name?: string;
}

export interface LocationGetResponse {
  id: string;
  name: string;
  totalPopulation: number;
  summary: {
    male: number;
    female: number;
  };
}

export interface LocationResponseSchema {
  id: string;
  name: string;
}

export interface CascadePopulationUpdateSpec {
  male: {
    count: number,
    operation: ModificationOperator,
  };
  female: {
    count: number,
    operation: ModificationOperator,
  };
  locationId: string;
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
