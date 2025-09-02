import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from '../service/app.layout.service';
import { GeneralService } from 'src/app/demo/service/general/general.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/demo/service/user.service';
import { Subscription } from 'rxjs';
import { switchSessionParamDto, User } from 'src/app/demo/api/userInterface';
import { LoadingService } from 'src/app/demo/service/loading.service';
import { Menu } from 'primeng/menu';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface updatePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
}

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrl: './app.topbar.component.scss',
    providers: [ConfirmationService, MessageService]
})
export class AppTopBarComponent implements OnInit {

    AddObj: User;
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef

    if_show_update_password: boolean = false;
    if_show_receb: boolean = false;
    data_selected_user: any;
    Header_info: any;
    dialogHeader: string = "Profil : ";
    is_loading: boolean = false;
    changeSession: Subscription;
    ApiMessage: any;
    IsHidden: boolean = false;
    IsFiled: boolean = false;
    display: boolean = false;
    Error: any = 0;
    param: switchSessionParamDto = {};
    displayDialog: boolean = false;
    itemNotification: MenuItem[] = [];
    overlayWidth: string = '300px';
    showPasswordError: boolean = false;

    showChangePasswordDialog: boolean = false;
    newPassword: string = '';

    @ViewChild('menuNotification') menuNotification!: Menu;

   
    updatePasswordRequest: updatePasswordRequest;

    constructor(public layoutService: LayoutService, public generalService: GeneralService,
        private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService,
        private userService: UserService, private _loadingService: LoadingService
    ) {
        this.param = <switchSessionParamDto>{};
        this.AddObj = <User>{};
        this.updatePasswordRequest = <updatePasswordRequest>{};
        this.dialogHeader = "Profil : " + this.generalService.get_DataSession('mainUser')?.fullName;
        // this.loadProfile(this.generalService.get_DataSession('mainUser')?.id);
       
     
    }

    ngOnInit() {
        this.checkPasswordStatus();
    }

    checkPasswordStatus() {
        const isFirstLogin = this.generalService.get_DataSession('isFirstLogin') === true;
        const isPasswordWeak = this.generalService.get_DataSession('isPasswordWeak') === true;
        this.showChangePasswordDialog = isFirstLogin || isPasswordWeak;
    }
      
    loadProfile(userId: string) {
        if (userId) {
            this.userService.getById(userId).subscribe(data => { this.AddObj = data; });
        }
    }
    
    onInputChange(password: string): void {
        // Check the password using the strongPasswordValidator
        this.showPasswordError = !this.generalService.strongPasswordValidator(this.updatePasswordRequest.newPassword);
      }
    isPasswordValid(): boolean {
        return this.generalService.strongPasswordValidator(this.updatePasswordRequest.newPassword);
    }
    doPasswordsMatch(): boolean {
        return this.updatePasswordRequest.currentPassword === this.updatePasswordRequest.newPassword;
    }

    onUpdateProfile() {
        this._loadingService.isLoading = true;
        const userId = this.generalService.get_DataSession('mainUser')?.id;
        if (userId) {
            this.userService.getById(userId).subscribe(data => {
                this.AddObj = data;
                this.AddObj.password = null;
                this.display = true;
                this._loadingService.isLoading = false;
            });
        }
    }

    onCloseDialig() {
        this.display = false;
        this.AddObj = null;
        this.AddObj = <User>{};
    }


    onSubmit() {

        this.showPasswordError = !this.isPasswordValid();
        if (!this.showPasswordError) {
            this.userService.changePassword(this.updatePasswordRequest).subscribe(
                response => {
                    this.AddObj = <User>{};
                    this.updatePasswordRequest = <updatePasswordRequest>{};
                    if (this.generalService.get_DataSession('mainUser')?.id) {
                        this.userService.getById(this.generalService.get_DataSession('mainUser')?.id).subscribe(data => {
                            this.AddObj = data;
                            this.AddObj.password = null;
                        });
                    }
                    this.display = false;
                    this.showChangePasswordDialog = false;
                    localStorage.setItem('isFirstLogin', 'false');
                    localStorage.setItem('isPasswordWeak', 'false');
                    this.messageService.add({
                        key: 'tst',
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Le mot de passe a été changé avec succès.'
                    });

                },
                error => {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'warn',
                        summary: 'Erreur',
                        detail: error?.error
                    });
                }
            );
        }
    }

    itemsprofiles = [
        {
            label: this.generalService.get_DataSession('isConnectedAsUsed') ?
                this.generalService.get_DataSession('connectedAs')?.fullName : this.generalService.get_DataSession('mainUser')?.fullName,
            icon: 'pi pi-user',
            items: [
                {
                    label: this.generalService.get_DataSession('fullName'),
                    visible: this.generalService.get_DataSession('isConnectedAsUsed'),
                    icon: 'pi pi-sign-in',
                    command: () => {
                        this.onChangeSession(this.generalService.get_DataSession('mainUser')?.id,
                            this.generalService.get_DataSession('connectedAs')?.id,
                            this.generalService.get_DataSession('isConnectedAsUsed'))
                    }
                },
                {
                    label: this.generalService.get_DataSession('connectedAs')?.fullName,
                    visible: this.generalService.get_DataSession('hasSecondAccount') && !this.generalService.get_DataSession('isConnectedAsUsed'),
                    icon: 'pi pi-sign-in',
                    command: () => {
                        this.onChangeSession(this.generalService.get_DataSession('mainUser')?.id,
                            this.generalService.get_DataSession('connectedAs')?.id,
                            this.generalService.get_DataSession('isConnectedAsUsed'))
                    }
                },
                {
                    label: 'Profil',
                    visible: !this.generalService.get_DataSession('isConnectedAsUsed') && this.generalService.canActivate('R-ACC'),
                    icon: 'pi pi-user',
                    command: () => {
                        this.onUpdateProfile();
                    }
                },
                {
                    label: 'Se déconnecter',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        this.logout()
                    }
                }
            ]
        },
    ]

    logout() {
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            accept: () => {
                localStorage.clear();
                this.generalService.clearCachedPermissions();
                this.router.navigate(['/auth']);
            }
        });
    }

    onChangeSession(mainAccountId?: number, secAccountId?: number, accountInUse?: boolean) {
        this.param.mainAccountId = mainAccountId;
        this.param.secAccountId = secAccountId;
        this.param.accountInUse = accountInUse ? 0 : 1;
        this.confirmationService.confirm({
            key: 'confirm1',
            message: 'Êtes-vous sûr de vouloir vous changer la session ?',
            accept: () => {
                this.toChangeSession(this.param);
                this._loadingService.isLoading = true;
            }
        });
    }

    refreshPage() {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/']);
            setTimeout(() => {
                this._loadingService.isLoading = false;
                window.location.reload();
            }, 500);
        });
    }

    toChangeSession(param: switchSessionParamDto) {
        this.IsFiled = true;
        this.userService.changeSession(param).subscribe(
            (r: any) => {
                if (r?.codeReponse) {
                    switch (r?.codeReponse) {
                        case 200: {
                            this.IsHidden = false;
                            this.ApiMessage = 'Authentification valide';
                            this.Error = 0;
                            this.StoreData(r);
                            break;
                        }
                        default:
                            this.ApiMessage = r?.msg;
                            this.error();
                            this._loadingService.isLoading = false;
                            break;
                    } // fin switch
                } else {
                    this.ApiMessage =
                        'Oups quelque chose a mal tourné : ' + r?.msg;
                    this.error();
                }
            },
            (error) => {
                this.ApiMessage =
                    'Oups quelque chose a mal tourné : ' + error;
                this.error();
            }
        ); // end subscribe
    }

    StoreData(data: any) {
        localStorage.clear();
        new Promise((resolve) => {
            let body: any[] = [
                {
                    key: 'fullName',
                    value: data?.user?.fullName,
                },
                {
                    key: 'mainUser',
                    value: data?.user,
                },
                {
                    key: 'profileId', // l'access token pour envoyé des requêts à l'api 
                    value: data?.user?.profileId,
                },
                {
                    key: 'jwt_token', // l'access token pour envoyé des requêts à l'api
                    value: data.hasOwnProperty('token') ? data?.token : null,
                },
                {
                    key: 'permissions',
                    value: data.hasOwnProperty('permissions')
                        ? data?.permissions
                        : null,
                },
                {
                    key: 'connectedAs',
                    value: data?.secondUser,
                },
                {
                    key: 'isConnectedAsUsed',
                    value: data?.isSecondAccountInUse,
                },
                {
                    key: 'hasSecondAccount',
                    value: data?.hasSecondAccount,
                },
                {
                    key: 'isFirstLogin',
                    value: data?.isFirstLogin,
                },
                {
                    key: 'isPasswordWeak',
                    value: data?.isPasswordWeak,
                },
            ];
            resolve(body);
        }).then((body) => {
            this.generalService.set_DataSession(body);
            this.refreshPage();
        });
    }

    error() {
        this.IsHidden = false;
        this.Error = 2;
        this.is_loading = false;
        setTimeout(() => {
            this.IsHidden = true;
        }, 500);
    }

    ngOnDestroy(): void {
        let unsubscribe: any[] = [this.changeSession];
        unsubscribe.forEach((element: any) => {
            if (element) {
                element.unsubscribe();
            }
        });
    }

    onMenuShow() {
        // Manually remove focus from items if needed
        setTimeout(() => {
            const menuElement = this.menuNotification?.containerViewChild?.nativeElement;
            if (menuElement) {
                // Example: Focus a hidden element instead to prevent menu focus
                const hiddenInput = document.createElement('input');
                hiddenInput.style.position = 'absolute';
                hiddenInput.style.opacity = '0';
                menuElement.appendChild(hiddenInput);
                hiddenInput.focus();
                menuElement.removeChild(hiddenInput);
            }
        });
    }

    getTimeAgo(date: Date): string {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
    }
    parseStyle(style): string {
        return eval('(' + style + ')');
    }
}
