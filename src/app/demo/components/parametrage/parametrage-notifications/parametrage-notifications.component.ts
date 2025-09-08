import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ParametrageNotification } from 'src/app/demo/api/parametrageNotification';
import { ParametrageNotificationsService } from 'src/app/demo/service/parametrage-notifications.service';
@Component({
selector: 'app-parametrage-notifications',
templateUrl: './parametrage-notifications.component.html',
styleUrls: ['./parametrage-notifications.component.scss'],
providers: [MessageService, ConfirmationService]
})
export class ParametrageNotificationsComponent implements OnInit {
items: ParametrageNotification[] = [];
selected?: ParametrageNotification;
dialogVisible = false;
form!: FormGroup;
loading = false;


constructor(
private svc: ParametrageNotificationsService,
private fb: FormBuilder,
private msg: MessageService,
private confirm: ConfirmationService
) {}


ngOnInit(): void {
this.initForm();
this.load();
}


initForm() {
this.form = this.fb.group({
id: [null],
delai: [0, Validators.required],
notificationDeclencherId: [null, Validators.required],
emailTo: [''],
dateCreation: [new Date().toISOString()],
object: [''],
body: ['']
});
}


load() {
this.loading = true;
this.svc.getAll().subscribe({
next: data => { this.items = data; this.loading = false; },
error: () => { this.loading = false; this.msg.add({severity:'error', summary:'Error', detail:'Failed to load data'}); }
});
}


openNew() {
this.selected = undefined;
this.form.reset({ delai: 0, notificationDeclencherId: null, emailTo: '', object: '', body: '' });
this.dialogVisible = true;
}


edit(item: ParametrageNotification) {
this.selected = { ...item };
this.form.patchValue(this.selected);
this.dialogVisible = true;
}


save() {
if (this.form.invalid) {
this.form.markAllAsTouched();
return;
}
const model: ParametrageNotification = this.form.value;
if (model.id) {
this.svc.update(model.id, model).subscribe({
next: () => { this.msg.add({severity:'success', summary:'Saved', detail:'Updated successfully'}); this.dialogVisible=false; this.load(); },
error: () => this.msg.add({severity:'error', summary:'Error', detail:'Update failed'})
});
} else {
this.svc.create(model).subscribe({
next: () => { this.msg.add({severity:'success', summary:'Saved', detail:'Created successfully'}); this.dialogVisible=false; this.load(); },
error: () => this.msg.add({severity:'error', summary:'Error', detail:'Create failed'})
});
}
}


confirmDelete(item: ParametrageNotification) {
this.confirm.confirm({
message: `Are you sure you want to delete notification #${item.id}?`,
accept: () => this.delete(item)
});
}


delete(item: ParametrageNotification) {
if (!item.id) return;
this.svc.delete(item.id).subscribe({
next: () => { this.msg.add({severity:'success', summary:'Deleted', detail:'Deleted successfully'}); this.load(); },
error: () => this.msg.add({severity:'error', summary:'Error', detail:'Delete failed'})
});
}
}