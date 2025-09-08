export interface ParametrageNotification {
id?: number;
delai: number;
notificationDeclencherId: number;
notificationDeclencher?: NotificationDeclencher;
emailTo?: string;
dateCreation?: string;
object?: string;
body?: string;
}


export interface NotificationDeclencher {
id: number;
libelle: string;
}