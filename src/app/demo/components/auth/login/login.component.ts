import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { GeneralService } from 'src/app/demo/service/general/general.service';
import { UserService } from 'src/app/demo/service/user.service';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/demo/service/loading.service';
import { co } from '@fullcalendar/core/internal-common';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
        @media (max-width: 768px) {
    .surface-card {
        padding: 2rem 1.5rem;
    }
    .text-center {
        font-size: 0.9rem;
    }
    input, p-password {
        font-size: 0.9rem;
    }
}

    `]
})
export class LoginComponent implements OnInit {

    valCheck: string[] = ['remember'];
    is_loading: boolean = false;
    Login: Subscription;
    FormulaireLogin: FormGroup;
    ApiMessage: any;
    IsHidden: boolean = false;
    IsFiled: boolean = false;
    Error: any = 0;

    constructor(public layoutService: LayoutService,
        private userService: UserService,
        private GeneralService: GeneralService,
        private router: Router,
        private _loadingService: LoadingService,
        private messageService: MessageService) {

        this.GeneralService.if_load = false;
        this.FormulaireLogin = new FormGroup({
            username: new FormControl(null, [
                Validators.maxLength(100),
                Validators.required,
            ]),
            password: new FormControl(null, [
                // Validators.minLength(6),
                // Validators.maxLength(30),
                Validators.required,
            ]),
        });
    }

    ngOnInit(): void {
            this.is_loading = false;
            this._loadingService.isLoading = false;
    }

    get loginErrors() {
        return this.FormulaireLogin.controls;
    }

    LoginUtilisateur() {
        this.IsFiled = true;
        if (this.FormulaireLogin.valid) {
            // Si le formulaire est valide
            this.is_loading = true;
            this._loadingService.isLoading = true;

            const formdata = new FormData();

            formdata.append(
                'username',
                this.FormulaireLogin.value.username.replace(/\s/g, '')
            );
            formdata.append('password', this.FormulaireLogin.value.password);
            formdata.append('token_notification', null);

            this.userService.Login(formdata).subscribe(
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
                                break;
                        } // fin switch
                    } else {
                        this.ApiMessage = 'Oups quelque chose a mal tourné : ' + r?.msg;
                        this.error();
                    }
                },
                (error) => {
                    this.ApiMessage =
                        'Oups quelque chose a mal tourné : ' + error;
                    this.error();
                }
            ); // end subscribe
        } // Si le formulaire est invalide
        else {
            this.ApiMessage = 'Veuillez saisir les informations qui manquent';
            this.error();
        }
    }

    StoreData(data: any) {
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
                    key: 'centres',
                    value: data.hasOwnProperty('centres')
                        ? data?.centres
                        : null,
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
                    value: false,
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
            this.GeneralService.set_DataSession(body);

            try {
                const permissions = data?.permissions;
                const user = data?.user;
                const controller = permissions?.[0]?.accessMode.code?.split('-')?.[0];
                const profileCode = user?.profile?.code;
             

                // this.GeneralService.permissions = permissions;

                if (controller == undefined || controller == null) {
                    this.ApiMessage = 'Vérifier permission avec votre administrateur';
                    this.error();
                } else {
                    if (profileCode === 'CEC') {
                        this.router.navigate(['/cecPvs']);
                        // this.router.navigate(['/']);

                    } else {
                        this.router.navigate(['/']);
                    }
                }

                this.is_loading = false;
                this._loadingService.isLoading = false;
            } catch (error) {
                this.ApiMessage = 'Vérification des permission :' + error;
                this.error();
            }
        });
    }

    error() {
        this.IsHidden = false;
        this.Error = 2;
        this.is_loading = false;
        this._loadingService.isLoading = false;
        this.IsHidden = true;
        this.messageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Erreur',
            detail: this.ApiMessage
          });
    }

    ngOnDestroy(): void {
        let unsubscribe: any[] = [this.Login];
        unsubscribe.forEach((element: any) => {
            if (element) {
                element.unsubscribe();
            }
        });
    }
}
