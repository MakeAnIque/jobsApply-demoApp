import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

import { catchError } from 'rxjs/operators';

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

  public employerPostJob(param: {}): Observable<{}> {
    return this.http
      .post(`${this.url}/api/addUpdateJobPostDetails`, param)
      .pipe(
        map((elem: any) => {
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
    return this.http.get(`${this.url}/api/getAllJobPostDetailsList`).pipe(
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
    return this.http.post(`${this.url}/api/getJobPostDetails`, param).pipe(
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
    return this.http
      .post(`${this.url}/api/addUpdateCandidateDetails`, param)
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
    return this.http
      .post(`${this.url}/api/getCandidateDetailsByCandidateId`, param)
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

  // public downloadFile(url) {
  //   return this.http.down(url);
  // }
}
