export interface GenreVehiculeDtos {
    id: number;
    code: string;
    codeEos?: string;
    libelle?: string;
    dateModification?: Date;
    sansMesure?: boolean;
}

export interface MesureRequiseDtos {
  vehiculeType: number;
  energieId: number;
  freinage: boolean;
  suspension: boolean;
  gaz: boolean;
  reglophare: boolean;
  ripage: boolean;
  opacimetre: boolean;
}