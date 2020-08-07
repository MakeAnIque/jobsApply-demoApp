import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { AuthService } from '../app/auth.service';
import { catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AllApiRoutesService {
  url: string;
  headers: any;
  loginCheck;
  constructor(
    public http: HttpClient,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.url = environment.origin;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('_start_token'),
    });
  }

  /**
   * username , password
   * @param param employer login credential
   */
  public employerLogin(param: {
    EMPLOYERMAILID?: string;
    EMPLOYERPASSWORD?: string;
  }): Observable<{}> {
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: t || '',
      }),
    };
    return this.http
      .post(`${this.url}/api/employerLogin`, param, httpOptions)
      .pipe(
        map((elem: any) => {
          console.log(elem.hasOwnProperty('data'));
          if (elem.hasOwnProperty('data')) {
            const data = {
              status: elem.status,
              indentifier: 'login successful',
              data: elem.data.employerLogin,
              token: elem.data.token,
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
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: t || '',
      }),
    };
    return this.http
      .post(`${this.url}/api/registerEmployer`, param, httpOptions)
      .pipe(
        map((elem: any) => {
          console.log(elem);
          if (
            elem.message.trim() === 'EmployerUser Registration successfully'
          ) {
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

  public employerPostJob(param: {}): Observable<{}> {
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: t || '',
      }),
    };
    return this.http
      .post(`${this.url}/api/addUpdateJobPostDetails`, param, httpOptions)
      .pipe(
        map((elem: any) => {
          // if (elem.hasOwnProperty('tokenExp')) {
          //   this.logout();
          // }
          if (elem.status) {
            return {
              status: true,
            };
          } else {
            return {
              status: false,
            };
          }
        })
      );
  }
  public getAllJobPostList(): Observable<{}> {
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: t || '',
      }),
    };
    return this.http
      .get(`${this.url}/api/getAllJobPostDetailsList`, httpOptions)
      .pipe(
        map((elem: any) => {
          if (elem.status) {
            return elem.data.getAllJobPostDetailsList;
          } else {
            return 'error';
          }
        })
      );
  }

  public getJobPostedDetailTOVIew(param: {}): Observable<{}> {
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: t || '',
      }),
    };
    return this.http
      .post(`${this.url}/api/getJobPostDetails`, param, httpOptions)
      .pipe(
        map((elem: any) => {
          console.log(elem);
          if (elem.data.getJobPostDetails.length) {
            return elem.data.getJobPostDetails;
          } else {
            return false;
          }
        })
      );
  }

  public postCandidateJobDetails(param): Observable<any> {
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: t || '',
      }),
    };
    return this.http
      .post(`${this.url}/api/addUpdateCandidateDetails`, param, httpOptions)
      .pipe(
        map((elem: any) => {
          if (!elem.status) {
            return {
              status: false,
            };
          }
          if (elem.type === -1) {
            return {
              status: true,
              already: true,
            };
          } else {
            return {
              status: true,
              already: false,
            };
          }
        })
      );
  }
  public getEmployerRecJobS(param): Observable<{}> {
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: t || '',
      }),
    };
    return this.http
      .post(
        `${this.url}/api/getCandidateDetailsByCandidateId`,
        param,
        httpOptions
      )
      .pipe(
        map((elem: any) => {
          if (elem.data.getCandidateDetailsByCandidateId.length == 0) {
            return {
              status: true,
              data: false,
            };
          } else {
            return {
              status: true,
              data: elem.data.getCandidateDetailsByCandidateId,
            };
          }
        })
      );
  }

  public getCheckLogin() {
    let t = window.localStorage.getItem('_start_token');
    console.log(t);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: t || '',
      }),
    };

    return this.http.get(`${this.url}/api/checkLogin`, httpOptions).pipe(
      map((elem) => {
        if (elem.hasOwnProperty('tokenExp')) {
          this.logout();
        } else {
          return elem;
        }
      })
    );
  }
  logout(): void {
    if (this.authService.isLoggedIn) {
      this.authService.isLoggedIn = false;
      window.localStorage.removeItem('_start_det');
      window.localStorage.removeItem('_start_token');
      this.loginCheck = 'Log In';
      this.router.navigate(['/']);
      this.snackBar.open('Logout successfully', 'close', {
        duration: 5000,
      });
    } else {
      // this.router.navigate(['/login']);
    }
  }
  // public downloadFile(url) {
  //   return this.http.down(url);
  // }
}
