import { Component, OnInit } from '@angular/core';
import { EmailService } from './emailservice';
import { Email } from './Email';
import { FilterUtils } from 'primeng/utils';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService],
  styles: [`
      :host ::ng-deep .p-cell-editing {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
      }
  `]
})
export class AppComponent implements OnInit {
  emails: Email[];

  clonedEmails: { [s: string]: Email; } = {};

  constructor(private productService: EmailService, private messageService: MessageService) { }

  ngOnInit() {
    this.productService.getEmails()
      .subscribe(emails => this.emails = emails);
  }

  onRowEditInit(product: Email) {
    this.clonedEmails[product.id] = { ...product };
  }

  onRowEditSave(email: Email) {
    if (email.startDate) {
      delete this.clonedEmails[email.id];
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Email info updated' });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
  }

  onRowEditCancel(email: Email, index: number) {
    this.emails[index] = this.clonedEmails[email.id];
    delete this.emails[email.id];
  }
}
