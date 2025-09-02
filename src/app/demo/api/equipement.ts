export interface EquipementDtos {
    id: number;
    identifiant: string;
    isRemplacent: boolean;
    marque: string;
    modele: string;
    protocole: string;
    referenceHomologation: string;
    ligneCentreId: number;
    ligneId: number;
    equipementTypeId: number;
    dateEtalonnage?: Date;
    dateExpirationEtalonnage?: Date;
    dateHomologation?: Date;
    dateMiseService?: Date;
    societeEtalonnage: string;
    adresseSocieteEtalonnage: string;
    telSocieteEtalonnage: string;
    errorCneh?: string;
    dateEnvoiCneh?: Date;
    isValide: boolean;
    dateSuppression?: Date;
    etalonnable: boolean;
    centre?: string;
    ligne?: string;
    ligneEos?: string;
    equipementType?: string;
}
export interface LigneDtos {
    id: number;
    centreId: number;
    type: string;
    numLigne: string;
  displayName?: string; // Add this if needed
}

export interface EtalonnageDtos {
    id: number;
    interventionTypeId: number;
    dateIntervention?: Date;
    moisExpiration: number;
    constats: string;
    rapportIntervention: string;
    equipementId: number;
    interventionType?: string;
}

export enum InterventionTypeEnum {
    Etalonnage = 1,
    Maintenance = 2
}