import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AllApiRoutesService {
  url: string;
  constructor(public http: HttpClient) {
    this.url = environment.origin;
  }

  /**
   * username , password
   * @param param employer login credential
   */
  public employerLogin(param: {
    EMPLOYERMAILID?: string;
    EMPLOYERPASSWORD?: string;
  }): Observable<{}> {
    return this.http.post(`${this.url}/api/employerLogin`, param).pipe(
      map((elem: any) => {
        console.log(elem.hasOwnProperty('data'));
        if (elem.hasOwnProperty('data')) {
          const data = {
            status: elem.status,
            indentifier: 'login successful',
            data: elem.data.employerLogin,
          };
          return data;
        } else {
          const data = { status: elem.status, indentifier: 'loginFailed' };
          return data;
        }
      })
    );
  }
  public employerSignup(param: {}): Observable<{}> {
    return this.http.post(`${this.url}/api/registerEmployer`, param).pipe(
      map((elem: any) => {
        console.log(elem);
        if (elem.message.trim() === 'EmployerUser Registration successfully') {
          return {
            registration: true,
            message: 'Registration Successfully.',
          };
        } else {
          return {
            registration: false,
            message: 'User Already Exists.',
          };
        }
      })
    );
  }
}
