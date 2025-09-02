export interface TableauBordDtos {
  TotalCentre: number;
  TotalAgentVisiteur: number;
  TotalChefCentre: number;
  TotalLigne: number;
  TotalEquipement: number;
  TotalEquipementEtalonner: number;
  TotalEquipementNonEtalonner: number;
  TotalEquipementNonValide: number;
  TotalFormationAgent: number;
  TotalFormationAgentValide: number;
  TotalFormationChef: number;
  TotalFormationChefValide: number;
}


export interface EquipementControleDtos {
  Centre: string;
  LigneNombreVL: number;
  OPACVL: number;
  REGLOVL: number;
  BFRVL: number;
  BSUPVL: number;
  PRIPVL: number;
  ANAGVL: number;
  LigneNombrePL: number;
  OPACPL: number;
  REGLOPL: number;
  BFRPL: number;
  PRIPPL: number;
}