export interface Profile {
    id?: string;
    code?: string;
    label?: string;
    enabled?:boolean;
    guidePdfUrl?:string;
}

export interface Group{
    id?: string;
    label?: string;
    enabled?:boolean;
}

export interface AccessMode{
    id?: string;
    code?:string;
    label?: string;
    enabled?:boolean;
    resource?: Resource;
}

export interface Resource{
    id?: string;
    code?: string;
    label?: string;
    enabled?:boolean;
}
export interface LoginResponse{
    codeReponse?: null;
    msg?: string;
    user?: User;
    secondUser?: User;
    isSecondAccountInUse?: boolean;
    hasSecondAccount?: boolean;
    isFirstLogin?:boolean;
    isPasswordWeak?:boolean;
    permissions?: [string];
    centres?: [];
}
export interface User{
    id?: string;
    userName?: string;
    fullName?: string;
    email?: string;
    password?: string;
    profileId?: number;
    profile?:Profile;
    enabled?:boolean;
    parentUserId?: string;
    parentUser?:User;
    connectAsUserId?: string;
    isAdmin?:boolean;
    connectAs?:User;
    serviceId?: number;
    clientId?: number;
}

export interface switchSessionParamDto{
    mainAccountId?: number;
    secAccountId?: number;
    accountInUse?: number;
}

export interface FilterProfile{
    label?: string;
    first?: number;
    pageIndex?: number;
    pageSize?: number;
    isEnabled?: any;
}

export interface PaginatedListProfile {
    items: Profile[];
    pageIndex : number;
    totalPages: number;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}

export interface FilterUser{
    input?: string;
    first?: number;
    profileId?:number;
    pageIndex?: number;
    pageSize?: number;
    isEnabled?: any;
}

export interface PaginatedListUser {
    items: User[];
    pageIndex : number;
    totalPages: number;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}

export interface FilterGroup{
    label?: string;
    first?: number;
    pageIndex?: number;
    pageSize?: number;
    isEnabled?: any;
}

export interface PaginatedListGroup {
    items: Group[];
    pageIndex : number;
    totalPages: number;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}

export interface FilterResource{
    label?: string;
    first?: number;
    pageIndex?: number;
    pageSize?: number;
    isEnabled?: any;
}

export interface PaginatedListResource {
    items: Resource[];
    pageIndex : number;
    totalPages: number;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}

export interface FilterAccessMode{
    label?: string;
    first?: number;
    pageIndex?: number;
    pageSize?: number;
    isEnabled?: any;
}

export interface PaginatedListAccessMode {
    items: AccessMode[];
    pageIndex : number;
    totalPages: number;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}

export interface Permission {
    id?: string;
    profileId?: string;
    resourceId?: string;
    accessModeId?:string;
    profile?: Profile;
    accessMode?: AccessMode;
}

export interface FilterPermission{
    input?: string;
    profileId?: string;
    resourceId?: string;
    accessModeId?:string;
    first?: number;
    pageIndex?: number;
    pageSize?: number;
    isEnabled?: any;
}

export interface PaginatedListPermission {
    items: Permission[];
    pageIndex : number;
    totalPages: number;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}

export interface ResourceWithAccessModesDto{
    resourceId:string;
    resourceLabel:string;
    profileId:string;
    enabled?:boolean;
    accessModes?: AccessDto[];
}

export interface AccessDto{
    accessModeId:string;
    accessModeLabel:string;
    enabled?:boolean;
    isChecked?:boolean;
    isUpdated?:boolean;
}

export const ServicesDekra = {
    production: false,
    list_services: [
        { value: 0, label: "Choisir le service" },
        { value: 1, label: "DSI" },
        { value: 2, label: "DAF" },
        { value: 3, label: "SREP" },
        { value: 4, label: "DCM" },
        { value: 5, label: "SRR" },
        { value: 6, label: "DRH" },
        { value: 7, label: "SQ" },
        { value: 8, label: "STMG" },
        { value: 9, label: "DEX" }
    ]
};