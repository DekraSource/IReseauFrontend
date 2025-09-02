export interface ListControlesDtos {
 id: number;
  cAPAgent: string;
  matSerial: string;
  matZone: string;
  matLettre: string;
  lineNumber: string;
  isdegraded: boolean;
  dataOfCreation: Date;
  isCanceled: boolean;
  resultat?: boolean;
  chassisNumber?: string;
  brand?: string;
  genre?: string;
  fuel?: string;
  typeVehicule?: string;
  tokenId?: string;
}
export interface ListTokensDtos {
  numLiasse: string;
  token: string;
  isdegraded: boolean;
  dateCreation: Date;
}
export interface GridQuery {
  CentreId: number;
  Page: number;
  PageSize: number;
  Sorts: SortInfo[];
  Filters: FilterInfo[];
}

export interface SortInfo {
  SortBy: string;
  Descending: boolean;
}

export interface FilterInfo {
  PropertyName: string;
  Value: string;
}

export interface GridData<T> {
  data: T[];
  totalItems: number;
}
