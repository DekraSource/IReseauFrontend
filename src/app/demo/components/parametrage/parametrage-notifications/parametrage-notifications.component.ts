import {  ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { NotificationDeclencher, ParametrageNotification } from 'src/app/demo/api/parametrageNotification';
import { Editor } from 'primeng/editor';
import { ParametrageNotificationsService } from 'src/app/demo/service/parametrage-notifications.service';



@Component({
  selector: 'app-parametrage-notifications',
  templateUrl: './parametrage-notifications.component.html',
  styleUrls: ['./parametrage-notifications.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ParametrageNotificationsComponent implements OnInit {
      @ViewChild('editor') editor!: Editor;
  @ViewChild('editorContainer') editorContainer!: ElementRef;


  visible = false;
  parametrageNotifications: ParametrageNotification[] = [];
  notificationDeclenchers: NotificationDeclencher[] = [];
  model: ParametrageNotification;

  // Drag and drop variables
  draggableChips = [
    { label: 'DateDeclencherContact', color: 'primary', text: '$DateDeclencherContact$' },
    { label: 'DateDeclencherKey', color: 'primary', text: '$DateDeclencherKey$' },
    { label: 'AgentVisiteurMail', color: 'primary', text: '$AgentVisiteurMail$' },
    { label: 'ChefCentreMail', color: 'primary', text: '$ChefCentreMail$' },
    { label: 'CentreMailPatron', color: 'primary', text: '$CentreMailPatron$' },
    { label: 'ResponsableCenteMail', color: 'primary', text: '$ResponsableCenteMail$' },
   { label: 'Centre', color: 'primary', text: '$Centre$' },
   { label: 'Cap', color: 'primary', text: '$Cap$' },
   { label: 'Cin', color: 'primary', text: '$Cin$' },
    { label: 'Equipment', color: 'primary', text: '$Equipment$' }
  ];

  constructor(
    private parametrageNotificationsService: ParametrageNotificationsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
        private cdr: ChangeDetectorRef

  ) {
    this.model = this.createNewModel();
  }


  ngOnInit(): void {
    this.getParametrageNotifications();
    this.getNotificationDeclenchers();
  }

  createNewModel(): ParametrageNotification {
    return {
      id: 0,
      delai: null,
      notificationDeclencherId: -1,
      emailTo: '',
      object: '',
      body: ''
    };
  }

  getParametrageNotifications(): void {
    // Mock data for demonstration
    this.parametrageNotificationsService.getAll().subscribe(data => {
      this.parametrageNotifications = data;
    });
  }

  getNotificationDeclenchers(): void {
    this.parametrageNotificationsService.getNotificationDeclencherForLookUp().subscribe(data => {
      this.notificationDeclenchers = data;
    });
  }

  openDialog(): void {
    this.model = this.createNewModel();
    this.visible = true;
  }

edit(notification: ParametrageNotification): void {
  this.model = { ...notification };
  this.visible = true;

  setTimeout(() => {
    if (this.editor && this.editor.getQuill()) {
      this.editor.getQuill().root.innerHTML = this.model.body || '';
      this.cdr.detectChanges();
    }
  }, 0);
}

  submit(): void {
    // Basic validation
    if (!this.model.delai || this.model.delai < 1) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Délai est requis et doit être supérieur à 0' });
      return;
    }
    
    if (!this.model.notificationDeclencherId || this.model.notificationDeclencherId === -1) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Déclencher est requis' });
      return;
    }
    
    if (!this.model.emailTo || !this.isValidEmail(this.model.emailTo)) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Email est requis et doit être valide' });
      return;
    }
    
    if (!this.model.object) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Object est requis' });
      return;
    }
    
    if (!this.model.body) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Corps du message est requis' });
      return;
    }

    if (this.model.id > 0) {
     this.parametrageNotificationsService.update(this.model.id,this.model).subscribe({
      next: () => {
        this.getParametrageNotifications();
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Opération effectuée avec succès'});
        this.visible = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Erreur est survenue'});
      }
    });
    } else {
        this.parametrageNotificationsService.create(this.model).subscribe({
      next: () => {
        this.getParametrageNotifications();
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Opération effectuée avec succès'});
        this.visible = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Erreur est survenue'});
      }
    });
    }
  }

  delete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
            this.parametrageNotificationsService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Etalonnage Deleted', life: 3000 });
            this.getParametrageNotifications();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete etalonnage' });
          }
        });
      }
    });
  }

 // Copy text to clipboard and insert into editor
  onChipClick(chipText: string): void {
    this.copyToClipboard(chipText).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copié',
        detail: 'Variable copiée dans le presse-papier'
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de copier la variable'
      });
    });
  }

  // Copy text to clipboard
  private async copyToClipboard(text: string): Promise<void> {
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        this.insertTextAtCursor(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          this.insertTextAtCursor(text);
        } else {
          throw new Error('Copy command failed');
        }
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      throw err;
    }
  }

  // Alternative: Just insert text without clipboard
  onChipClickSimple(chipText: string): void {
    this.insertTextAtCursor(chipText);
    this.messageService.add({
      severity: 'info',
      summary: 'Inséré',
      detail: 'Variable insérée dans l\'éditeur'
    });
  }

  // Insert text at current cursor position
  private insertTextAtCursor(text: string): void {
    if (this.editor && this.editor.getQuill) {
      try {
        const quill = this.editor.getQuill();
        if (quill) {
          const range = quill.getSelection();
          if (range) {
            quill.insertText(range.index, text);
            quill.setSelection(range.index + text.length);
          } else {
            // If no selection, append at the end
            quill.insertText(quill.getLength(), text);
          }
        }
      } catch (error) {
        console.error('Error inserting text:', error);
        // Fallback: append to model body
        this.model.body += text;
      }
    } else {
      // Fallback if editor is not available
      this.model.body += text;
    }
  }

  // Optional: Focus editor when chip is clicked
  focusEditor(): void {
    if (this.editor && this.editor.getQuill) {
      const quill = this.editor.getQuill();
      if (quill) {
        quill.focus();
      }
    }
  }


//   onEditorInit(editor: any): void {
//     // Add drop event listener to the editor
//     const editorElement = document.querySelector('.ql-editor');
//     if (editorElement) {
//       editorElement.addEventListener('drop', (event: DragEvent) => {
//         event.preventDefault();
//         const text = event.dataTransfer.getData('text/plain');
//         if (text) {
//           // Get current selection
//           const selection = window.getSelection();
//           if (selection && selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             range.deleteContents();
//             range.insertNode(document.createTextNode(text));
//           } else {
//             // If no selection, append to the end
//             editorElement.innerHTML += text;
//           }
          
//           // Update the model value
//           this.model.body = editorElement.innerHTML;
//         }
//       });
      
//       editorElement.addEventListener('dragover', (event: DragEvent) => {
//         event.preventDefault(); // Necessary to allow drop
//       });
//     }
//   }

  cancel(): void {
    this.visible = false;
  }

  // Search functionality
  applyFilterGlobal(event: any, stringVal: string, dt: Table) {
    dt.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
   // Setup drop handlers manually

}