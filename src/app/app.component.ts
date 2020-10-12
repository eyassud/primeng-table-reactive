import { Component, OnInit } from '@angular/core';
import { EmailService } from './emailservice';
import { Email } from './Email';
import { MessageService } from 'primeng/api';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService],
  // styles: [`
  //     :host ::ng-deep .p-cell-editing {
  //         padding-top: 0 !important;
  //         padding-bottom: 0 !important;
  //     }
  // `]
})
export class AppComponent implements OnInit {
  emailForm: FormGroup;
  emails: Email[];
  clonedEmails: { [s: string]: Email; } = {};

  constructor(
    private emailService: EmailService,
    private messageService: MessageService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.emailService.getEmails()
      .subscribe(emails => {
        this.emails = emails;
        this.emailForm = this.fb.group({
          tableRowArray: this.fb.array(this.buildTableRowArray(emails))
        });
      });
  }

  get tableRowArray(): FormArray {
    return this.emailForm.get('tableRowArray') as FormArray;
  }

  buildTableRowArray(emails: Email[]) {
    return emails.map(email => this.fb.group({
      id: [email.id, Validators.required],
      code: [email.code, Validators.required],
      email: [email.email, [ Validators.required, Validators.email]],
      startDate: [email.startDate, Validators.required],
      endDate: [email.endDate, Validators.required]
    }));
  }

  onRowEditInit(row: FormGroup) {
    this.clonedEmails[row.controls.id.value] = { ...row.value as Email };
  }

  onRowEditSave(row: FormGroup) {
    if (row.valid) {
      delete this.clonedEmails[row.controls.id.value];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Email info updated' });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email info' });
    }

    this.emailForm.reset(this.emailForm.value);
  }

  onRowEditCancel(row: FormGroup, index: number) {
    this.emails[index] = this.clonedEmails[row.controls.id.value];
    delete this.clonedEmails[row.controls.id.value];
    this.emailForm = this.fb.group({
      tableRowArray: this.fb.array(this.buildTableRowArray(this.emails))
    });
  }
}
