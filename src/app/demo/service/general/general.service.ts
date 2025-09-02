import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as JWT from 'jwt-decode';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { CrypteService } from '../crypte/crypte.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})

/* ------------------- jwt_token est le jwt token ------------------- */
export class GeneralService {
    public if_load: boolean = true;
    public is_loading: boolean = false;
    public currentMenu: any;
    public innerWidth: any = window.innerWidth; // innerWidth>=992 (web) // innerWidth<992 (mobile)
    public menu_toggel: boolean = true;
    private cachedPermissions: any[] | null = null;

    constructor(private CryprtService: CrypteService, private router: Router) { }

    /* --------------- Récupération d'une valeur depuis une liste --------------- */
    Get_libelle(
        identifiant: any = null,
        liste: any[] = [],
        prop: any = 'label'
    ) {
        if (identifiant && liste.length > 0) {
            return liste.find(
                (element: any) => Number(element?.value) == Number(identifiant)
            )?.[prop];
        } else {
            return null;
        }
    }

    /* ------------------------- Gestion du localStorage ------------------------ */

    set_DataSession(body: any) {
        body.forEach((element: any) => {
            if (
                element?.key != null &&
                element?.key != '' &&
                element?.value != null
            ) {
                localStorage.setItem(
                    element?.key,
                    this.CryprtService.encryptUsingAES256(
                        element?.value
                    ).toString()
                );
            }
        });
        return true;
    }

    get_DataSession(key: any): any {
        /* ------------------ Si la variable existe sur la session ------------------ */
        if (localStorage.getItem(key)) {
            let result: any = this.CryprtService.decryptUsingAES256(
                localStorage.getItem(key)
            );
            if (result != null) {
                return result;
            }
        } else {
            if (key == 'user_id') {
                localStorage.clear();
                setTimeout(() => {
                    this.router.navigate(['/auth']);
                }, 100);
            }
            return null;
        }
    }

    Get_claim(claim: any) {
        let result: any = JWT.jwtDecode(this.get_DataSession('jwt_token'));
        return result?.[claim];
    }

    /* ----------------------- Fonction pour décode le jwt ---------------------- */

    DecodeJwt(token: any, claim: any) {
        let result: any = JWT.jwtDecode(token);
        return result?.[claim];
    }

    /* -------------------------------------------------------------------------- */
    /*       Pour l'ajout et modification et la recherche kendo date picker       */
    /* -------------------------------------------------------------------------- */
    FormatDate(date: any) {
        if (date != null && date != undefined) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year, month, day].join('-');
        } else return null;
    }
    formatDate(dateString) {
         if (!dateString || dateString === '0001-01-01T00:00:00' || dateString === '0001-01-01') {
            return null;
        }
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    formatDatePeriode(dateString: string): string {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${year}`;
    }
    formatDatetime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    FormatDateToYear(date: any) {
        if (date != null && date != undefined) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [year].join('');
        } else return null;
    }

    FormatDateToMonth(date: any) {
        if (date != null && date != undefined) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            return [month, year].join('/');
        } else return null;
    }
    getFirstDayOfCurrentMonth(): Date {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    getLastDayOfMonth(date: Date): Date {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return new Date(year, month, 0);
    }
    getValidDate(input: any): Date | null {
        if (!input || input === '0001-01-01T00:00:00' || input === '0001-01-01') {
            return null;
        }
        const date = new Date(input);
        return isNaN(date.getTime()) ? null : date;
    }
    cleanText(value: any): string {
        if (!value || value === 'null' || value === 'undefined') return '';
        return value;
    }
    /* -------------------------------------------------------------------------- */
    /*                           la gestion des erreurs                           */
    /* -------------------------------------------------------------------------- */
    errorSwal(
        message: any,
        duration: any = 2000,
        icon: any = 'warning',
        text: any = '',
        showConfirmButton: any = false
    ) { }

    canActivate(role: any): boolean {
        if (this.cachedPermissions == null) {
            const permissions: any = this.get_DataSession('permissions');
            if (permissions != null) {
                this.cachedPermissions = permissions;
            } else {
                return false;
            }
        }
        return this.cachedPermissions?.some(
            (obj: any) => obj.accessMode.code.toLowerCase() == role.toLowerCase()
        );
    }

    canActivateAll(roles: any[]): boolean {
        if (this.cachedPermissions == null) {
            const permissions: any = this.get_DataSession('permissions');
            if (permissions != null) {
                this.cachedPermissions = permissions;
            } else {
                return false;
            }
        }

        var exist = false;
        var data: any[] = this.cachedPermissions;

        for (let index = 0; index < roles.length; index++) {
            var role = roles[index];
            if (
                data.some(
                    (obj: any) =>
                        obj.accessMode.code.toLowerCase() == role.toLowerCase()
                )
            ) {
                exist = true;
                break;
            }
        }

        return exist;
    }

    clearCachedPermissions() {
        this.cachedPermissions = null;
    }

    inialDates(): any[] {
        const today = new Date();
        const dateStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 1
        );

        return [dateStart, today];
    }

    async SwalMsg(
        title: string,
        msg: string,
        showCancelButton: boolean = true,
        reverseButtons: boolean = true
    ) {
        return await Swal.fire({
            title: title,
            html: msg,
            icon: 'warning',
            showCancelButton: showCancelButton,
            reverseButtons: reverseButtons,
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#258662',
            cancelButtonColor: '#f50707',
            confirmButtonText: 'Valider',
            customClass: {
                container: 'my-swal',
            },
        });
    }

    convertBlobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /* -------------------------------------------------------------------------- */
    /*                                Validators                                  */
    /* -------------------------------------------------------------------------- */
    strongPasswordValidator(password: string): boolean {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
    }


    saveAsExcelFile(buffer: any, fileName: string, extension: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = extension;
        const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
   }

}
