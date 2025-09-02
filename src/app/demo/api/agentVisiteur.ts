// agent-visiteur.model.ts
export interface AgentVisiteurDtos {
  id: number;
  centreId: number;
  numeroCap: string;
  nom: string;
  prenom: string;
  mail: string;
  tel: string;
  cin: string;
  cnss: string;
  statutAdministratif: string;
  anneeAutorisation: number;
  dateAffectation: Date;
  dateCap: Date;
  dateExpirationCap: Date;
  categorieCap: string;
  isActif: boolean;
  centre?: string;
}

export interface AffecterAgentDtos {
  numeroCap: string;
  cin: string;
  centreId: number;
}

export interface KeyValuesDtos {
  key: number;
  values: string;
}
export interface AgentForCreateDtos {
  id: number;
  centre: string;
  cin: string;
  cap: string;
  etat: string;
  isSentToCneh: boolean;
  capPdfUrl?: string;
}