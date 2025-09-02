export interface FormationDto {
  id: number;
  numValidation: string;
  dateValidation: Date;
  dateDebut: Date;
  dateFin: Date;
  animateur1: string;
  animateur2: string;
  resultat: boolean;
  chefCentre?: string;
  agentVisiteur?: string;
  formationType: string;
  dateEnvoiCneh?: Date;
  errorCneh?: string;
}
export interface FormationExcelDto {
  isChefCentre: boolean;
  centre?: string;
  nomComplete?: string;
  cin?: string;
  animateur1?: string;
  animateur2?: string;
  dateDebut?: Date;
  dateFin?: Date;
  dateValidation?: Date;
  numValidation?: string;
  resultat?: boolean;
  formationType?: string;
  error?: string;
  hasError?: boolean;

}