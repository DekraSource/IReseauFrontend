import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Message, ConfirmationService, MessageService } from 'primeng/api';
import { ProfileService } from 'src/app/demo/service/profile.service';
import { PaginatedListProfile, Profile, FilterProfile } from 'src/app/demo/api/userInterface';
import { GeneralService } from 'src/app/demo/service/general/general.service';
import { LoadingService } from 'src/app/demo/service/loading.service';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ConfirmationService, MessageService]
})

export class ProfileComponent implements OnInit {
  PaginatedList: PaginatedListProfile;
  filter: FilterProfile;
  obj: Profile;
  display: boolean = false;
  displayDP: boolean = false;
  AddObj: Profile;
  actionLabel: string = "";
  msgs: Message[] = [];
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];

  isEnableOptions: any[] = [];
  saveMode: number = null;
  GuidePdfUrlPath: Blob;

  constructor(private profileService: ProfileService, public generalService: GeneralService,
    private confirmationService: ConfirmationService, private messageService: MessageService, private cdr: ChangeDetectorRef,private _loadingService: LoadingService) {
    this.PaginatedList = <PaginatedListProfile>{};
    this.obj = <Profile>{};
    this.filter = <FilterProfile>{};
    this.filter.pageSize = 10;
    this.filter.pageIndex = 1;
    this.filter.label = null;
    this.AddObj = <Profile>{};

    this.isEnableOptions = [
      { name: 'Oui', value: 1 },
      { name: 'Non', value: 2 }
    ];
  }

  ngOnInit() {
    this._loadingService.showLoader();
    this.profileService.getAll(this.filter).subscribe(data => {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    });
  }

  public onChangeSelect() {
    this.profileService.getAll(this.filter).subscribe(data => 
      {
        this.PaginatedList = data;
        this._loadingService.hideLoader();
      }
    );
  }

  public handlePagination(event: PageEvent): void {
    this.filter.pageIndex = event.first;
    this.filter.pageIndex = event.page + 1;
    this.profileService.getAll(this.filter).subscribe(data => this.PaginatedList = data);
  }

  onSearch() {
    this._loadingService.showLoader();
    this.profileService.getAll(this.filter).subscribe(data => 
    {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    } 
      
    );
  }

  onReset() {
    this.filter = <FilterProfile>{
      pageSize: 10,
      pageIndex: 1,
      label: undefined
    };
    this._loadingService.showLoader();
    this.profileService.getAll(this.filter).subscribe(data => 
    {
      this.PaginatedList = data;
      this._loadingService.hideLoader();
    }
      
    );
  }

  onAdd() {
    this.display = true;
    this.AddObj = <Profile>{};
    this.AddObj.Enabled = true;
    this.saveMode = 1;
  }

  onUpdate(item: Profile) {
    this.display = true;
    this.AddObj = <Profile>{};
    this.AddObj.Id = item.Id;
    this.AddObj.Code = item.Code;
    this.AddObj.Label = item.Label;
    this.AddObj.Enabled = item.Enabled;
    this.saveMode = 2;
  }


  onPost(mode: number, item?: Profile) {
    if (mode == 1) {
      this.onAdd();
    } else if (mode == 2) {
      this.onUpdate(item)
    }
  }

  addProfile() {
    this._loadingService.showLoader();
    this.profileService.add(this.AddObj).subscribe(
      response => {
        this.profileService.getAll(this.filter).subscribe(data => 
          {
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
        this.AddObj = <Profile>{};
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
  }

  updateProfile() {
    this._loadingService.showLoader();
    this.profileService.update(this.AddObj).subscribe(
      response => {
        this.profileService.getAll(this.filter).subscribe(data => 
          {
            this.PaginatedList = data;
            this._loadingService.hideLoader();
          }
        );
        this.display = false;
        this.messageService.add({
          key: 'tst',
          severity: 'success',
          summary: 'Succès',
          detail: 'Le profil a été modifié avec succès.'
        });
        this.AddObj = <Profile>{};
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
    if (this.GuidePdfUrlPath) {
      this.profileService.uploadGuidePdf(this.GuidePdfUrlPath).subscribe(res => {

        if (this.saveMode == 1) {
          this.addProfile();
        } else if (this.saveMode == 2) {
          this.updateProfile();
        }
      });
    } else {
      if (this.saveMode == 1) {
        this.addProfile();
      } else if (this.saveMode == 2) {
        this.updateProfile();
      }
    }
  }


  onCloseDP() {
    this.displayDP = false;
  }

  onCloseDialig() {
    this.display = false;
    this.saveMode = null;
    this.AddObj = null;
    this.AddObj = <Profile>{};
  }

  onEnableDesableItem(mode: number, item?: Profile) {
    this.AddObj = <Profile>{};
    this.AddObj.Id = item.Id;
    this.AddObj.Code = item.Code;
    this.AddObj.Label = item.Label;
    if (mode == 1) {
      this.confirmationService.confirm({
        key: 'confirm1',
        message: 'Voulez vous activer ce profil ?',
        accept: () => {
          this.AddObj.Enabled = true;
          this.updateProfile();
        }
      });
    } else if (mode == 2) {
      this.confirmationService.confirm({
        key: 'confirm1',
        message: 'Voulez vous désactiver ce profil ?',
        accept: () => {
          this.AddObj.Enabled = false;
          this.updateProfile();
        }
      });
    }
  }
  onUpload(event: { files: Blob[] }) {
    this.GuidePdfUrlPath = event.files[0];
  }
}