export interface Lignes {
    id: number;
    numLigne: number;
    typeId: number;
    type?: string;
    statutId: number;
    statut?: string;
    dateStatut?: Date | null;
    decision?: string | null;
    decisionDate?: Date | null;
    isActif: boolean;
    centreId: number;
    centre?: string;
}

export interface KeyValue {
    key: number;
    value: string;
}
