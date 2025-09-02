import { AgentVisiteurDtos } from "./agentVisiteur";

export interface ReaffectationAgentVisiteurDtos {
  id: number;
  agentVisiteurId: number; // New property
  agentVisiteur: AgentVisiteurDtos; // New property
  sourceCentreId: number;
  sourceCentre: CentreDtos;
  destinationCentreId: number;
  destinationCentre: CentreDtos;
  dateAffectation?: Date;
  dateRetour?: Date;
  dateExecution?: Date;
  isImmediate?: boolean;
}
export interface CentreDtos {
  id: number;
  nom: string;
  agrement: string;
}
