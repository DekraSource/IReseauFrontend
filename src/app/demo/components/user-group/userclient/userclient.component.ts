import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Message, ConfirmationService, MessageService } from 'primeng/api';
import { UserClientService } from 'src/app/demo/service/UserClientService.service'
import { PaginatedListUserClient, UserClient, FilterUserClient } from 'src/app/demo/api/userInterface';
import { GeneralService } from 'src/app/demo/service/general/general.service';
import { LoadingService } from 'src/app/demo/service/loading.service';
import { UserService } from 'src/app/demo/service/user.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-userclient',
  templateUrl: './userclient.component.html',
  styleUrls: ['./userclient.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class UserClientComponent implements OnInit {
  PaginatedList: PaginatedListUserClient;
  filter: FilterUserClient;
  obj: UserClient;
  display: boolean = false;
  AddObj: UserClient;
  actionLabel: string = "";
  msgs: Message[] = [];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];

  users: any[] = [];
  clients: any[] = [];
  saveMode: number = null;

  constructor(
    private userClientService: UserClientService, 
    private UserService: UserService,
    public generalService: GeneralService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService, 
    private cdr: ChangeDetectorRef,
    private _loadingService: LoadingService
  ) {
    this.PaginatedList = <PaginatedListUserClient>{};
    this.obj = <UserClient>{};
    this.filter = <FilterUserClient>{};
    this.filter.pageSize = 10;
    this.filter.pageIndex = 1;
    this.filter.idUser = null;
    this.filter.idClient = null;
    this.AddObj = <UserClient>{};
  }

  ngOnInit() {
    this._loadingService.showLoader();
    this.loadData();
    this.UserService.GetKeyValueItemsClient().subscribe(data => {
    this.clients = data;
    });
        this.UserService.GetKeyValueItems().subscribe(data => {
    this.users = data;
    });
  }

  loadData() {
    this.userClientService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    });
  }

 

  public onChangeSelect() {
    this._loadingService.showLoader();
    this.userClientService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    });
  }

  public handlePagination(event: PageEvent): void {
    this.filter.pageIndex = event.page + 1;
    this.filter.pageSize = event.rows;
    this.userClientService.getAll(this.filter).subscribe(data => this.PaginatedList = data);
  }

  onSearch() {
    this._loadingService.showLoader();
    this.userClientService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    });
  }

  onReset() {
    this.filter = <FilterUserClient>{
      pageSize: 10,
      pageIndex: 1,
      idUser: null,
      idClient: null
    };
    this._loadingService.showLoader();
    this.userClientService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    });
  }

  onAdd() {
    this.display = true;
    this.AddObj = <UserClient>{};
    this.saveMode = 1;
  }

  onUpdate(item: UserClient) {
    this.display = true;
    this.AddObj = { ...item };
    this.saveMode = 2;
  }

  onPost(mode: number, item?: UserClient) {
    if (mode == 1) {
      this.onAdd();
    } else if (mode == 2) {
      this.onUpdate(item);
    }
  }

  addUserClient() {
    this._loadingService.showLoader();
    this.userClientService.add(this.AddObj).subscribe(
      response => {
        this.loadData();
        this.display = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Succès',
          detail: 'L\'association utilisateur-client a été ajoutée avec succès.'
        });
        this.AddObj = <UserClient>{};
      },
      error => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Erreur',
          detail: "Échec d'ajouter l'association utilisateur-client."
        });
      }
    );
  }

  updateUserClient() {
    this._loadingService.showLoader();
    this.userClientService.update(this.AddObj).subscribe(
      response => {
        this.loadData();
        this.display = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Succès',
          detail: 'L\'association utilisateur-client a été modifiée avec succès.'
        });
        this.AddObj = <UserClient>{};
      },
      error => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Erreur',
          detail: "Échec de modifier l'association utilisateur-client."
        });
      }
    );
  }

  onSubmit() {
    if (this.saveMode == 1) {
      this.addUserClient();
    } else if (this.saveMode == 2) {
      this.updateUserClient();
    }
  }

  onCloseDialig() {
    this.display = false;
    this.saveMode = null;
    this.AddObj = <UserClient>{};
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      key: 'confirm1',
      message: 'Voulez-vous vraiment supprimer cette association ?',
      accept: () => {
        this._loadingService.showLoader();
        this.userClientService.delete(id).subscribe(
          response => {
            this.loadData();
            this.messageService.add({
              key: 'tst',
              severity: 'success',
              summary: 'Succès',
              detail: 'L\'association a été supprimée avec succès.'
            });
          },
          error => {
            this.messageService.add({
              key: 'tst',
              severity: 'warn',
              summary: 'Erreur',
              detail: "Échec de supprimer l'association."
            });
          }
        );
      }
    });
  }
}