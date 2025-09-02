import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Message, ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from 'src/app/demo/service/user.service';
import { PaginatedListUser, User, FilterUser } from 'src/app/demo/api/userInterface';
import { KeyValues } from 'src/app/demo/api/keyValues';
import { ProfileService } from 'src/app/demo/service/profile.service';
import { GeneralService } from 'src/app/demo/service/general/general.service';
import { LoadingService } from 'src/app/demo/service/loading.service';
import { Clipboard } from '@angular/cdk/clipboard';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class UserComponent implements OnInit {
  PaginatedList: PaginatedListUser;
  filter: FilterUser;
  obj: User;
  display: boolean = false;
  displayUpdate: boolean = false;
  displayDC: boolean = false;
  displayDA: boolean = false;
  displayResetPassword: boolean = false;
  dialogImportIsOpen: boolean = false;
  AddObj: User;
  actionLabel: string = "";
  msgs: Message[] = [];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];
  profiles: KeyValues[] = [];

  saveMode: number = null;
  selectFilters: any = { profileIdF: null, profileIdS: null };
  newPassword: string;
  showPasswordError: boolean = false;
  isEnableOptions: { name: string; value: number; }[];

  constructor(private clipboard: Clipboard, private UserService: UserService, public generalService: GeneralService,
    private confirmationService: ConfirmationService, private messageService: MessageService, private cdr: ChangeDetectorRef,
    private profileService: ProfileService,
     private _loadingService: LoadingService, ) {
    this.PaginatedList = <PaginatedListUser>{};
    this.obj = <User>{};
    this.filter = <FilterUser>{};
    this.filter.pageSize = 10;
    this.filter.pageIndex = 1;
    this.AddObj = <User>{};
    this.AddObj.IsEnabled = false;
    this.AddObj.password = '';
    this.isEnableOptions = [
      { name: 'Oui', value: 1 },
      { name: 'Non', value: 2 }
    ];
  }

  async ngOnInit() {
    this._loadingService.showLoader();
    this.profileService.GetKeyValueItemsProfile().subscribe(data => {
    this.profiles = data;
    });
    this.UserService.getAll(this.filter).subscribe(data => {
      {
        this.PaginatedList = data;
        this._loadingService.hideLoader();
      }
    });
  }

  public onChangeSelect() {

    this.UserService.getAll(this.filter).subscribe(data => this.PaginatedList = data);
  }

  public handlePagination(event: PageEvent): void {
    this.filter.pageIndex = event.first;
    this.filter.pageIndex = event.page + 1;
    this._loadingService.showLoader();
    this.UserService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
        this._loadingService.hideLoader();
    }
    );
  }



  onSearch() {
    this.filter.first = 0;
    this.filter.pageIndex = 1;
    this._loadingService.showLoader();
    this.UserService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
        this._loadingService.hideLoader();
    }

    );

  }

  onReset() {
    this.filter = <FilterUser>{
      pageSize: 10,
      pageIndex: 1,
      isEnabled: undefined,
      input: undefined
    };
    this._loadingService.showLoader();
    this.UserService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    }
    );
  }

  onAdd() {
    this.display = true;
    this.AddObj = <User>{};
    this.AddObj.IsEnabled = false;
    this.saveMode = 1;
  }

  onUpdate(item: User) {
    this.AddObj = <User>{};
    this.AddObj.Id = item.Id;
    this.AddObj.FullName = item.FullName;
    this.AddObj.UserName = item.UserName;
    this.AddObj.Email = item.Email;
    this.AddObj.ProfileId = item.ProfileId;
    this.AddObj.IsEnabled = item.IsEnabled;
    this.displayUpdate = true;
    this.cdr.detectChanges();
    this.saveMode = 2;
  }

  onPost(mode: number, item?: User) {
    if (mode == 1) {
      this.onAdd();
    } else if (mode == 2) {
      this.onUpdate(item);
    } 
  }
  onInputChange(password: string): void {
    this.showPasswordError = !this.generalService.strongPasswordValidator(this.AddObj.password);
  }
  isPasswordValid(): boolean {
    return this.generalService.strongPasswordValidator(this.AddObj.password);
  }
  onResetPassword(item?: User) {
    this.confirmationService.confirm({
      key: 'confirm1',
      message: 'Voulez vous réinitialiser le mot de passe ?',
      accept: () => {
        this.resetPassword(item);
      }
    });
  }

  resetPassword(item?: User) {
    this._loadingService.showLoader();
    this.UserService.resetPassword(item.Id).subscribe(
      response => {
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Succès',
          detail: 'Le mot de passe a été changé avec succès.'
        });
        this.displayResetPassword = true;
        this.newPassword = response.password;
        this._loadingService.hideLoader();
      },
      error => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Erreur',
          detail: "Échec de changement de mot de passe."
        });
        this._loadingService.hideLoader();
      }
    );
  }

  onCopyPassword() {
    this.clipboard.copy(this.newPassword);
    this.messageService.add({
      key: 'tst',
      severity: 'success',
      summary: 'Succès',
      detail: 'Mot de passe copié.'
    });
  }

  onCloseDialigResetPassword() {
    this.displayResetPassword = false;
    this.newPassword = null;
  }


  addUser() {
    this.showPasswordError = !this.isPasswordValid();
    if (!this.showPasswordError) {
    this._loadingService.showLoader();
      this.UserService.add(this.AddObj).subscribe(
        response => {
          this.UserService.getAll(this.filter).subscribe(data => {
            this.PaginatedList = data;
            this._loadingService.hideLoader();
          }
          );
          this.display = false;
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Succès',
            detail: 'Le profil a été ajouté avec succès.'
          });
          this.AddObj = <User>{};
        },
        error => {
          this.messageService.add({
            key: 'tst',
            severity: 'warn',
            summary: 'Erreur',
            detail: "Échec d'ajouter le profil."
          });
        }
      );
    } else {
      // Optionally handle case where password is invalid
      error => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Erreur',
          detail: "Password validation failed."
        });
      }
    }
  }

  updateUser() {
    this._loadingService.showLoader();
    this.UserService.update(this.AddObj).subscribe(
      response => {
        this.UserService.getAll(this.filter).subscribe(data => {
          this.PaginatedList = data;
          this._loadingService.hideLoader();
        }
        );
        this.displayUpdate = false;
        this.displayDA = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Succès',
          detail: 'Le profil a été modifié avec succès.'
        });
        this.AddObj = <User>{};
      },
      error => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Erreur',
          detail: "Échec de modifier le profil."
        });
      }
    );
  }

  onSubmit() {
    if (this.saveMode == 1) {
      this.addUser();
    } else if (this.saveMode == 2) {
      this.updateUser()
    }
  }

  onCloseDialig() {
    this.display = false;
    this.saveMode = null;
    this.AddObj = null;
    this.AddObj = <User>{};
  }

  onCloseDialigUpdate() {
    this.displayUpdate = false;
    this.saveMode = null;
    this.AddObj = null;
    this.AddObj = <User>{};
  }

  onCloseDialigCentre() {
    this.displayDC = false;
    this.saveMode = null;
    this.AddObj = null;
    this.AddObj = <User>{};
  }

  onCloseDialigAssign() {
    this.displayDA = false;
    this.saveMode = null;
    this.AddObj = null;
    this.AddObj = <User>{};
  }

  onEnableDesableItem(mode: number, item?: User) {
    this.AddObj = <User>{};
    this.AddObj = item;
    if (mode == 1) {
      this.confirmationService.confirm({
        key: 'confirm1',
        message: 'Voulez vous activer ce profil ?',
        accept: () => {
          this.AddObj.IsEnabled = true;
          this.updateUser();
        }
      });
    } else if (mode == 2) {
      this.confirmationService.confirm({
        key: 'confirm1',
        message: 'Voulez vous désactiver ce profil ?',
        accept: () => {
          this.AddObj.IsEnabled = false;
          this.updateUser();
        }
      });
    }
  }


}