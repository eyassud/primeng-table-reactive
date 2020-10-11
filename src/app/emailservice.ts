import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Email } from './Email';

@Injectable()
export class EmailService {
  constructor(private http: HttpClient) { }

  getEmails(): Observable<Email[]> {
    return this.http.get<Email[]>('assets/emails.json')
    .pipe(
      map((emails: any) => emails.data)
    );
  }
}
