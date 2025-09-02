export interface NiveauFormationTypeDtos {
  id: number;
  libelle: string;
}

export interface ChefCentreDtos {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  niveauFormationTypeId: number;
  centreId: number;
  tel: string;
  cin: string;
  cnss: string;
  sexe: string;
  dateAffectaion?: Date;
  dateEnvoiCneh?: Date;
  errorCneh?: string;
  centre?: string;
}